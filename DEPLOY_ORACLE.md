# GharKa API — Deploy on Oracle Cloud (Always Free, never sleeps)

This replaces **Render** for the backend API. Oracle Cloud's **Always Free** tier
gives you a real virtual machine that runs **24/7, never sleeps, and costs $0
forever** — no 15-minute spin-down, no 50-second cold starts.

The trade-off vs. Render: it's a raw Linux server, so there are more one-time
setup steps. Everything below is copy-paste, and the scripts in `deploy/oracle/`
do the heavy lifting. **The database (Neon), Firebase, and Cloudinary do not
change** — only where the API runs changes.

```
 Internet (HTTPS)
       │
       ▼
 gharka.duckdns.org ──DNS A record──► your VM's public IP
       │   ports 80 / 443
       ▼
 ┌──────────────────────────────────────────────┐
 │  Oracle Always Free VM (Ubuntu, ARM64)         │
 │                                                │
 │    Caddy  — auto-HTTPS reverse proxy           │
 │      │  forwards /api/*  and  /ws (WebSocket)  │
 │      ▼                                          │
 │    Node API (pm2)  →  127.0.0.1:3001           │
 │      Fastify + Socket.io                       │
 └───────────────────────┬────────────────────────┘
                          │
                          ▼
        Neon Postgres · Firebase Admin · Cloudinary  (all external, unchanged)
```

> **Why these tools?** `pm2` keeps the Node app running and restarts it on crash
> or reboot. `Caddy` is a tiny reverse proxy that gives you **free automatic
> HTTPS** — your Vercel site is HTTPS, and browsers block an HTTPS page from
> calling an HTTP API, so the API *must* have HTTPS. HTTPS needs a domain name,
> which is why Step C gets you a free one from DuckDNS.

---

## What you'll need (10 min of prep)

- [ ] A credit/debit card — Oracle requires it **only to verify you're human**.
      Always Free resources are **never charged**.
- [ ] Your secrets from the old Render setup (you already have these):
      Neon `DATABASE_URL`, Firebase project ID + service-account `.json`,
      Cloudinary cloud name/key/secret, your admin phone number, your Vercel URL.
- [ ] The repo pushed to GitHub (already done).

---

## STEP A — Create the Oracle Always Free VM

1. Go to **https://www.oracle.com/cloud/free/** → **Start for free** → sign up.
   - **Pick your Home Region carefully** (a region near you). Always Free
     resources live in your home region and it **cannot be changed later**.
2. In the Console: **☰ Menu → Compute → Instances → Create instance**.
3. **Name:** `gharka-api`
4. **Image and shape** → **Edit**:
   - **Image:** change to **Canonical Ubuntu 22.04** (or 24.04).
   - **Shape:** **Ampere** → **VM.Standard.A1.Flex** → set **OCPU = 1**,
     **Memory = 6 GB**. Confirm it shows the green **"Always Free-eligible"** tag.
     *(You may go up to 4 OCPU / 24 GB for free, but 1/6 is plenty for this API.)*
5. **Networking:** leave the defaults (it creates a VCN and assigns a public IPv4).
6. **Add SSH keys:** choose **Generate a key pair for me** → **download the
   private key** (and public key). Keep the private key safe — it's your only
   way in. *(Or paste your own `~/.ssh/id_ed25519.pub` if you have one.)*
7. **Create.** Wait until the status is **RUNNING**, then copy the
   **Public IP address** shown on the instance page. You'll use it below.

> **"Out of host capacity" error?** Free A1 capacity is popular and sometimes
> full. Just retry after a while, try a different **Availability Domain** in the
> create dialog, or try again later. It clears up regularly.

> **Recommended:** on the instance page → **Reserve** the public IP (Networking →
> the VNIC → edit the IP to *Reserved*) so it never changes.

---

## STEP B — Open the cloud firewall (ports 80 & 443)

Oracle has **two** firewalls. This is the cloud one (the OS one is handled by a
script later). Skipping this is the #1 reason deploys fail.

1. On the instance page, under **Primary VNIC**, click the **Subnet** link.
2. Click the **Default Security List**.
3. **Add Ingress Rules** → add these two (port 22/SSH already exists):

   | Source CIDR | IP Protocol | Destination Port |
   |-------------|-------------|------------------|
   | `0.0.0.0/0` | TCP         | `80`             |
   | `0.0.0.0/0` | TCP         | `443`            |

4. **Save.**

---

## STEP C — Get a free domain (DuckDNS)

You need a hostname so Caddy can issue an HTTPS certificate. DuckDNS is free.
*(Already own a domain? Skip DuckDNS — just point an A record at your VM's public
IP and use that domain everywhere below instead of `gharka.duckdns.org`.)*

1. Go to **https://www.duckdns.org** → sign in (GitHub/Google).
2. In the box, type a subdomain, e.g. **`gharka`**, → **add domain**.
   You now own **`gharka.duckdns.org`**.
3. In that subdomain's **"current ip"** field, paste your VM's **Public IP** →
   **update ip**.
4. Verify it resolves (from your Mac's Terminal):
   ```bash
   dig +short gharka.duckdns.org
   ```
   It should print your VM's public IP.

---

## STEP D — Connect to the VM and run the setup script

From your Mac's Terminal (replace the key path and IP):

```bash
chmod 400 ~/Downloads/ssh-key-*.key            # the private key you downloaded
ssh -i ~/Downloads/ssh-key-*.key ubuntu@<YOUR_VM_PUBLIC_IP>
```
*(The login user for Ubuntu images is `ubuntu`. Type `yes` at the fingerprint prompt.)*

Now **on the VM**, get the code and provision the machine.

**Get the code** (use a read-only Deploy Key — most secure):
```bash
# Generate a key on the VM:
ssh-keygen -t ed25519 -C "gharka-vm" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```
Copy that line → GitHub → your repo → **Settings → Deploy keys → Add deploy key**
→ paste, leave "Allow write access" **off** → **Add key**. Then:
```bash
git clone git@github.com:<YOUR_GITHUB_USER>/<YOUR_REPO>.git gharka
cd gharka
```
*(Alternative without a deploy key: if the repo is public, just
`git clone https://github.com/<you>/<repo>.git gharka`.)*

**Provision the machine** (installs Node, pnpm, pm2, Caddy, opens the OS firewall):
```bash
bash deploy/oracle/setup.sh
```
This takes ~3–5 minutes and prints the installed versions when done.

---

## STEP E — Add your secrets to the VM

**1. Create the env file** from the template and fill it in:
```bash
cp deploy/oracle/api.env.example apps/api/.env
nano apps/api/.env
```
Fill every value (see the comments in the file). Generate the two JWT secrets
right in the terminal — run this twice and paste each result:
```bash
openssl rand -hex 32
```
Set `CORS_ORIGINS` to your Vercel URL (no trailing slash). Save in nano with
**Ctrl+O, Enter, Ctrl+X**.

**2. Upload your Firebase service-account JSON** — run this **on your Mac**, in a
new Terminal tab (not on the VM):
```bash
scp -i ~/Downloads/ssh-key-*.key \
  "/Users/varadasaidattavishnu/Desktop/Chef App/apps/api/firebase-service-account.json" \
  ubuntu@<YOUR_VM_PUBLIC_IP>:/home/ubuntu/gharka/apps/api/firebase-service-account.json
```
This matches the `FIREBASE_SERVICE_ACCOUNT_PATH` already set in the env template.

---

## STEP F — Configure Caddy with your domain

Back **on the VM**:
```bash
sudo cp deploy/oracle/Caddyfile /etc/caddy/Caddyfile
sudo nano /etc/caddy/Caddyfile      # replace api.example.com with gharka.duckdns.org
sudo systemctl reload caddy
```
Caddy will fetch the HTTPS certificate automatically (needs Steps B + C done).
Watch it happen:
```bash
sudo journalctl -u caddy -f
```
Look for `certificate obtained successfully`. Press **Ctrl+C** to stop watching.

---

## STEP G — Deploy the API

```bash
cd ~/gharka
bash deploy/oracle/deploy.sh
```
This installs deps, builds, runs the Neon migrations, and starts the API under
pm2. Then make it **survive reboots** (one time only):
```bash
pm2 startup
# ^ copy the `sudo env PATH=... pm2 startup ...` line it prints and run it
pm2 save
```

Quick local check (still on the VM):
```bash
curl -s http://127.0.0.1:3001/api/health
# → {"success":true,"data":{"status":"ok",...}}
```

---

## STEP H — Point your web + mobile apps at the new API

Your new API base URL is **`https://gharka.duckdns.org`** (or your own domain).

1. **Vercel** → your web project → **Settings → Environment Variables** →
   change `NEXT_PUBLIC_API_URL` to `https://gharka.duckdns.org` → **redeploy**.
2. **CORS** is already handled: `CORS_ORIGINS` in `apps/api/.env` must list your
   Vercel URL (you set this in Step E). If you change the Vercel URL later, edit
   that line and run `pm2 restart gharka-api`.
3. **Mobile** (`apps/mobile/eas.json`): change the `preview` and `production`
   `EXPO_PUBLIC_API_URL` values from the old Render URL to
   `https://gharka.duckdns.org`, then commit and rebuild with EAS.
4. **Firebase authorized domains:** no change needed — that list is for the web
   login widget, which still runs on your Vercel domain. The API domain does
   **not** need to be added.

---

## STEP I — Test the live app

- [ ] `curl -s https://gharka.duckdns.org/api/health` → returns `"status":"ok"`
- [ ] Open your Vercel site → it loads
- [ ] Log in with your Firebase test phone number + code
- [ ] The food feed loads → **API + database work**
- [ ] Open a chat → messages send/receive → **WebSocket works**

---

## Updating the app later

Whenever you push new code to GitHub:
```bash
ssh -i ~/Downloads/ssh-key-*.key ubuntu@<YOUR_VM_PUBLIC_IP>
cd ~/gharka
git pull
bash deploy/oracle/deploy.sh
```
That rebuilds, re-runs any new migrations, and reloads the API with zero config.

**Handy commands (on the VM):**
| Goal | Command |
|------|---------|
| See API logs (live) | `pm2 logs gharka-api` |
| API status / memory | `pm2 status` |
| Restart the API | `pm2 restart gharka-api` |
| See Caddy / HTTPS logs | `sudo journalctl -u caddy -f` |
| Reload Caddy after editing | `sudo systemctl reload caddy` |

---

## Important: keep Oracle from reclaiming your "idle" VM

On accounts that have **never upgraded**, Oracle can reclaim an Always-Free VM
that looks idle (very low CPU **and** network for 7 days). Your live API with
Caddy is rarely that idle, but to be 100% safe:

- **Best fix:** in the Console, **upgrade to "Pay As You Go"**. Your card is
  already on file; **Always-Free shapes still cost $0**, and PAYG accounts are
  **never reclaimed**. This is the recommended setting for anything you depend on.
- Or just make sure the app gets some real traffic over any 7-day window.

---

## Troubleshooting

**Caddy won't get a certificate / site unreachable**
- DNS not pointing correctly: `dig +short gharka.duckdns.org` must equal your VM IP.
- Ports not open: re-check **Step B** (OCI Security List) **and** the OS firewall:
  `sudo iptables -L INPUT -n --line-numbers` should show ACCEPT for 80 and 443.
- Watch the reason: `sudo journalctl -u caddy -e`.

**`502 Bad Gateway` from Caddy**
- The Node app isn't running: `pm2 status` / `pm2 logs gharka-api`.
- Port mismatch: `PORT` in `apps/api/.env` must equal the port in
  `/etc/caddy/Caddyfile` (both `3001`).

**API crashes on start / "Invalid environment variables"**
- `pm2 logs gharka-api` shows which var. Common causes: a JWT secret shorter
  than 32 chars, or a malformed `DATABASE_URL` (must end with `?sslmode=require`).

**Firebase / login errors**
- The service-account file isn't where the env points. Confirm:
  `ls -l /home/ubuntu/gharka/apps/api/firebase-service-account.json`.

**Can't SSH in**
- Key must be `chmod 400`; user must be `ubuntu`; port 22 ingress must exist
  (it's there by default).

**WebSocket/chat won't connect**
- `CORS_ORIGINS` must include your exact Vercel origin (scheme + host, no slash).
- The client connects on path `/ws` by default and Caddy forwards it
  automatically — no extra Caddy config needed.

---

## Cost summary

| Component | Where | Cost |
|-----------|-------|------|
| API compute | Oracle Always Free A1 VM | **$0 forever** |
| HTTPS certificate | Let's Encrypt via Caddy | **$0** |
| Domain | DuckDNS | **$0** |
| Database | Neon free tier | **$0** |
| Web | Vercel free tier | **$0** |

No 15-minute sleep. No cold starts. The API stays up 24/7.
