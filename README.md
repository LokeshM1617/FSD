# EXPERIMENT 10: CI/CD Deployment with GitHub Actions + Render/Vercel

This experiment automates the CI/CD deployment pipeline for the full **SecureBank** application (built cumulatively through Experiments 1 to 9).

---

## Architecture

| Component | Platform | Role | Configuration / Command |
| :--- | :--- | :--- | :--- |
| **CI Automation** | **GitHub Actions** | Automated validation on every push/PR to `main` | `.github/workflows/ci.yml` |
| **Frontend Web App** | **Vercel** | Edge hosting with auto-redeploy | Root: `frontend`, Build: `npm run build`, Out: `dist` |
| **Backend REST & WS** | **Render** | Node.js web service with persistent env vars | Root: `backend`, Build: `npm install`, Start: `npm start` |
| **Database** | **MongoDB Atlas** | Managed cloud database with resilient fallback | `MONGO_URI` environment variable |

---

## GitHub Actions CI Workflow (`.github/workflows/ci.yml`)

The workflow defines two independent validation jobs executed on `ubuntu-latest`:
1. **`frontend-build`**:
   - Checks out repository (`actions/checkout@v4`)
   - Installs Node.js 20 (`actions/setup-node@v4`)
   - Installs dependencies in `frontend` (`npm install`)
   - Compiles production Vite build (`npm run build`)
2. **`backend-check`**:
   - Checks out repository (`actions/checkout@v4`)
   - Installs Node.js 20 (`actions/setup-node@v4`)
   - Installs dependencies in `backend` (`npm install`)
   - Verifies backend start script (`node -e "const p=require('./package.json'); if(!p.scripts?.start) process.exit(1);"`)

---

## Step-by-Step Deployment Guide (As per Lab Manual)

### Step 1: Push Project to GitHub
In terminal:
```bash
git init
git add .
git commit -m "Prepare SecureBank project for CI/CD deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

### Step 2: GitHub Actions Workflow Validation
1. Open your repository on **GitHub**.
2. Click the **Actions** tab.
3. Select **Full Stack CI**.
4. Both `frontend-build` and `backend-check` will show green **Success** checkmarks.

### Step 3: Deploy Backend on Render
1. Go to [https://render.com](https://render.com) and log in.
2. Click **New +** &rarr; **Web Service**.
3. Select your GitHub repository.
4. Set the following settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `MONGO_URI`: `mongodb+srv://student:student123@cluster0.mongodb.net/securebank?retryWrites=true&w=majority`
   - `JWT_SECRET`: `securebank_jwt_super_secret_key_exp10_render_prod_2026`
6. Click **Deploy Web Service**.
7. Note down your public URL (e.g. `https://securebank-backend.onrender.com`).

### Step 4: Deploy Frontend on Vercel
1. Go to [https://vercel.com](https://vercel.com) and sign in.
2. Click **Add New** &rarr; **Project** and import your repository.
3. In Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: Your Render backend URL (e.g. `https://securebank-backend.onrender.com`)
5. Click **Deploy**.
6. Access your public live application URL (e.g. `https://securebank.vercel.app`).

### Step 5: Test Automatic Redeployment (Continuous Delivery)
1. Make a small visible change in `frontend/src/pages/Home.jsx`.
2. Commit and push:
   ```bash
   git add .
   git commit -m "update homepage cloud title"
   git push origin main
   ```
3. Watch GitHub Actions CI run automatically.
4. Render and Vercel will automatically redeploy the new version without any manual server access.
