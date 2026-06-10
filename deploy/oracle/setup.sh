#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────
# GharKa API — ONE-TIME Oracle Cloud VM provisioning
# Target: Oracle "Always Free" Ampere A1 (ARM64), Ubuntu 22.04 or 24.04 LTS.
# Installs Node 20, pnpm, pm2, Caddy, and opens the OS firewall for 80/443.
#
# Run ONCE, after you have cloned the repo onto the VM:
#     cd ~/gharka && bash deploy/oracle/setup.sh
#
# (You ALSO must add 80/443 ingress rules in the OCI Console — that is the
#  cloud-side firewall and cannot be set from inside the VM. See DEPLOY_ORACLE.md.)
# ──────────────────────────────────────────────────────────────────────────
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

NODE_MAJOR=20
PNPM_VERSION=10.33.0   # matches "packageManager" in package.json

echo "==> [1/6] Updating the system"
sudo apt-get update -y
sudo apt-get upgrade -y

echo "==> [2/6] Installing base tools + firewall persistence"
sudo apt-get install -y \
  curl git ca-certificates gnupg apt-transport-https \
  debian-keyring debian-archive-keyring \
  netfilter-persistent iptables-persistent

echo "==> [3/6] Installing Node.js ${NODE_MAJOR}.x (ARM64 build)"
curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | sudo -E bash -
sudo apt-get install -y nodejs

echo "==> [4/6] Installing pnpm@${PNPM_VERSION} and pm2 (global)"
# Installing pnpm directly via npm (instead of corepack) avoids the corepack
# signature-verification errors seen with older Node bundles. The version is
# pinned to match the repo's packageManager field, so no version warnings.
sudo npm install -g "pnpm@${PNPM_VERSION}" pm2

echo "==> [5/6] Installing Caddy (auto-HTTPS reverse proxy)"
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list >/dev/null
sudo apt-get update -y
sudo apt-get install -y caddy

echo "==> [6/6] Opening the VM firewall for HTTP (80) + HTTPS (443)"
# Oracle's Ubuntu image ships an iptables ruleset that REJECTs everything
# except SSH. Insert ACCEPT rules at the TOP (always valid, always before the
# REJECT), then persist them so they survive reboot.
sudo iptables -I INPUT 1 -p tcp -m conntrack --ctstate NEW --dport 80  -j ACCEPT
sudo iptables -I INPUT 1 -p tcp -m conntrack --ctstate NEW --dport 443 -j ACCEPT
sudo netfilter-persistent save

echo ""
echo "============================================================"
echo " Base setup complete."
echo "   node : $(node -v)"
echo "   pnpm : $(pnpm -v)"
echo "   pm2  : $(pm2 -v)"
echo "   caddy: $(caddy version | head -n1)"
echo "============================================================"
echo " Next steps (see DEPLOY_ORACLE.md):"
echo "   1. cp deploy/oracle/api.env.example apps/api/.env  &&  edit it"
echo "   2. upload firebase-service-account.json (scp from your Mac)"
echo "   3. configure /etc/caddy/Caddyfile with your domain"
echo "   4. bash deploy/oracle/deploy.sh"
echo "============================================================"
