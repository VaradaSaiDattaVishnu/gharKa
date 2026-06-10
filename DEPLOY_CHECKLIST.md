# GharKa — Complete Deployment Checklist (Oracle Cloud edition)

The plan now:

```
  API (backend)  ->  Oracle Cloud Always Free VM   https://gharka.duckdns.org   (never sleeps, $0)
  Database       ->  Neon                          (already created)
  Web (frontend) ->  Vercel                         https://<your-project>.vercel.app
  Mobile app     ->  EAS Build                      (optional, later)
```

Only the **API** moved (off Render). Neon, Firebase, Cloudinary, and Vercel are
unchanged. Deep detail + troubleshooting for the API VM lives in `DEPLOY_ORACLE.md`.

---

## WHAT'S DIFFERENT FROM THE OLD RENDER CHECKLIST

The Oracle flow **reverses** a few things the Render guide told you:

| Render said | On Oracle you do |
|-------------|------------------|
| Don't set `PORT` | **Keep `PORT=3001`** (Caddy proxies to it) |
| Blueprint auto-generates JWT secrets | **Generate them yourself** with `openssl rand -hex 32` |
| Paste `FIREBASE_SERVICE_ACCOUNT_JSON` | **Upload the .json file**, set `FIREBASE_SERVICE_ACCOUNT_PATH` |
| Tables created "on app start" | Migrations run by `deploy/oracle/deploy.sh` |
| API URL = `gharka-api.onrender.com` | API URL = **`gharka.duckdns.org`** (your DuckDNS) |

`render.yaml` is now legacy/unused.

---

## !! SECURITY — READ FIRST
Your `Downloads/"Step 1: Create Your Database (Neon).md"` holds LIVE secrets
(Firebase private key, Neon password, Firebase keys). Keep it on your computer
only; never commit it. **Once everything works, regenerate the Firebase
service-account key** (Firebase Console → Project settings → Service accounts →
Generate new private key), because it sat in a plain-text file.

---

## ALREADY DONE [x]
- [x] Neon database created + connection string saved
- [x] Firebase project created (gharka-f8004)
- [x] Firebase service-account .json downloaded (`apps/api/firebase-service-account.json`)
- [x] Firebase web config saved (the 6 values)
- [x] Code fixed and pushed to GitHub
- [x] Oracle deploy scripts written (`deploy/oracle/` + `DEPLOY_ORACLE.md`)

---

## STEP 0 — Push the deploy scripts to GitHub  (REQUIRED, do this first)
The VM clones your repo, so the new scripts must be on GitHub. On your Mac:

```bash
cd "/Users/varadasaidattavishnu/Desktop/Chef App"
git add deploy/ DEPLOY_ORACLE.md DEPLOY_CHECKLIST.md
git commit -m "Add Oracle Cloud deployment config"
git push
```

---

## STEP 1 — CLOUDINARY  (REQUIRED — the API won't start without it)
1. https://cloudinary.com → **Sign Up Free**.
2. On the Dashboard, copy these 3 values (you'll paste them into `apps/api/.env`):
   - **Cloud Name**
   - **API Key**
   - **API Secret** (click the eye icon to reveal)

---

## STEP 2 — TURN ON FIREBASE PHONE LOGIN
1. https://console.firebase.google.com → open **gharka-f8004**.
2. **Build → Authentication** → **Get started** (if shown).
3. **Sign-in method** tab → **Phone** → toggle **ON** → **Save**.
4. (Test without real SMS) same screen → **Phone numbers for testing** → add a
   test number + 6-digit code (e.g. `+91XXXXXXXXXX` / `123456`).

---

## STEP 3 — DEPLOY THE API ON ORACLE CLOUD
*(Full click-by-click + troubleshooting: `DEPLOY_ORACLE.md`. Condensed exact path here.)*

**3.1 Create the VM** — https://www.oracle.com/cloud/free/ → sign up (card for
identity only, never charged; pick a Home Region near you).
Console → **Compute → Instances → Create instance**:
- Name `gharka-api`
- **Image:** Canonical **Ubuntu 22.04**
- **Shape:** Ampere → **VM.Standard.A1.Flex**, **1 OCPU / 6 GB** (must show
  "Always Free-eligible")
- **SSH keys:** Generate a key pair → **download the private key**
- **Create** → wait for **RUNNING** → copy the **Public IP**.

**3.2 Open the cloud firewall** — instance → Subnet → **Default Security List** →
**Add Ingress Rules**: source `0.0.0.0/0`, TCP, port **80**; and again port **443**.

**3.3 Free domain (DuckDNS)** — https://www.duckdns.org → sign in → add subdomain
`gharka` → set its IP to your VM's Public IP. Your API URL is now
**`https://gharka.duckdns.org`**. *(Own a domain? Point an A record at the IP and use it instead.)*

**3.4 SSH in** (on your Mac):
```bash
chmod 400 ~/Downloads/ssh-key-*.key
ssh -i ~/Downloads/ssh-key-*.key ubuntu@<YOUR_VM_PUBLIC_IP>
```

**3.5 Get the code + provision** (on the VM):
```bash
ssh-keygen -t ed25519 -C "gharka-vm" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
# ^ paste this into GitHub → repo → Settings → Deploy keys → Add (read-only)
git clone git@github.com:<YOUR_GITHUB_USER>/<YOUR_REPO>.git gharka
cd gharka
bash deploy/oracle/setup.sh
```

**3.6 Add secrets** (on the VM):
```bash
cp deploy/oracle/api.env.example apps/api/.env
nano apps/api/.env          # fill every value; run `openssl rand -hex 32` twice for the JWT secrets
```
Then upload the Firebase file — **on your Mac**, new terminal tab:
```bash
scp -i ~/Downloads/ssh-key-*.key \
  "/Users/varadasaidattavishnu/Desktop/Chef App/apps/api/firebase-service-account.json" \
  ubuntu@<YOUR_VM_PUBLIC_IP>:/home/ubuntu/gharka/apps/api/firebase-service-account.json
```

**3.7 Configure Caddy** (on the VM):
```bash
sudo cp deploy/oracle/Caddyfile /etc/caddy/Caddyfile
sudo nano /etc/caddy/Caddyfile     # replace api.example.com with gharka.duckdns.org
sudo systemctl reload caddy
```

**3.8 Deploy + survive reboots** (on the VM):
```bash
cd ~/gharka
bash deploy/oracle/deploy.sh
pm2 startup        # run the `sudo ... pm2 startup ...` line it prints
pm2 save
```

**3.9 Test the API:**
```bash
curl -s https://gharka.duckdns.org/api/health
# → {"success":true,"data":{"status":"ok",...}}
```

---

## STEP 4 — DEPLOY THE WEBSITE ON VERCEL
1. https://vercel.com → log in with GitHub → **Add New… → Project** → import your repo.
2. **Root Directory** → Edit → choose **`apps/web`** (auto-detects Next.js).
3. **Environment Variables** — add all 7:

   ```
   NEXT_PUBLIC_API_URL                      = https://gharka.duckdns.org   ← your Oracle/DuckDNS URL
   NEXT_PUBLIC_FIREBASE_API_KEY             = (apiKey from your notes)
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN         = gharka-f8004.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID          = gharka-f8004
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET      = gharka-f8004.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 436885951413
   NEXT_PUBLIC_FIREBASE_APP_ID              = (appId from your notes)
   ```
4. **Deploy** → copy your site URL (e.g. `https://gharka.vercel.app`).

---

## STEP 5 — CONNECT THE WEBSITE AND THE API
1. **CORS** — on the VM, point the API at your real Vercel URL:
   ```bash
   nano apps/api/.env        # set CORS_ORIGINS=https://gharka.vercel.app  (no trailing slash)
   pm2 restart gharka-api
   ```
2. **Firebase** — Console → **Authentication → Settings → Authorized domains** →
   **Add domain** → your Vercel domain (e.g. `gharka.vercel.app`). Required for phone-OTP login.

---

## STEP 6 — TEST THE LIVE APP
- [ ] Open your Vercel URL — home page + 3D hero loads
- [ ] Log in with your Firebase test number + code
- [ ] The food feed loads → API + database work
- [ ] Open a chat → messages send → realtime WebSocket works

---

## STEP 7 — MOBILE APP (optional, later)
1. Edit `apps/mobile/eas.json` — change `preview` and `production`
   `EXPO_PUBLIC_API_URL` to `https://gharka.duckdns.org`; commit + push.
2. In Terminal:
   ```bash
   npm i -g eas-cli
   cd "/Users/varadasaidattavishnu/Desktop/Chef App/apps/mobile"
   eas login
   eas init
   eas build --profile preview --platform android   # test .apk
   ```

---

## ENV VAR CHEAT SHEET

**VM — `apps/api/.env`:**
```
DATABASE_URL                  = Neon string (…neon.tech/…?sslmode=require)
JWT_SECRET                    = openssl rand -hex 32
JWT_REFRESH_SECRET            = openssl rand -hex 32  (different)
FIREBASE_PROJECT_ID           = gharka-f8004
FIREBASE_SERVICE_ACCOUNT_PATH = /home/ubuntu/gharka/apps/api/firebase-service-account.json
CLOUDINARY_CLOUD_NAME         = from Cloudinary
CLOUDINARY_API_KEY            = from Cloudinary
CLOUDINARY_API_SECRET         = from Cloudinary
ADMIN_PHONE_NUMBERS           = +9198XXXXXXXX
CORS_ORIGINS                  = your Vercel URL (set in Step 5)
PORT                          = 3001
```

**Vercel (Web) — Environment Variables:** the 7 `NEXT_PUBLIC_*` above
(`NEXT_PUBLIC_API_URL` = `https://gharka.duckdns.org`).

---

## FINAL CHECKLIST
- [ ] Step 0  Deploy scripts pushed to GitHub
- [ ] Step 1  Cloudinary keys saved
- [ ] Step 2  Firebase phone login ON
- [ ] Step 3  Oracle VM live; `https://gharka.duckdns.org/api/health` → "ok"
- [ ] Step 4  Vercel website deployed; URL saved
- [ ] Step 5  CORS_ORIGINS set to Vercel URL + `pm2 restart`
- [ ] Step 5  Vercel domain added to Firebase authorized domains
- [ ] Step 6  Logged in on the live site, feed + chat work
- [ ] Step 7  (optional) Mobile preview build
- [ ] Cleanup  Regenerate the Firebase service-account key
- [ ] Optional Upgrade Oracle to "Pay As You Go" (still $0) so the VM is never reclaimed
```
