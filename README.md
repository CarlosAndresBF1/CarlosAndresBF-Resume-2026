# Portfolio — Astro Implementation

## Features

- Astro v5 with SSR (`@astrojs/node` adapter)
- i18n support (English & Spanish) via JSON translation files
- Interactive skills grid — click a skill to see description, workplaces, and years of experience
- Contact form (API endpoint)
- Docker & docker-compose ready
- Bootstrap 5.3 (CDN)
- Custom fonts (Neutral Face, Manrope)

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Set up your personal data

Copy the example i18n files and fill in your information:

```sh
cp src/i18n/en.example.json src/i18n/en.json
cp src/i18n/es.example.json src/i18n/es.json
```

Edit `en.json` and `es.json` with your personal data (name, experience, skills, etc.).

### 3. Run locally

```sh
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

### 4. Build for production

```sh
npm run build
node ./dist/server/entry.mjs
```

### 5. Docker

```sh
docker compose up --build
```

## Project Structure

```text
/
├── public/
│   └── assets/fonts/          # Custom fonts (CDN-ready)
├── src/
│   ├── components/            # Astro components (Navbar, Hero, Skills, etc.)
│   ├── i18n/
│   │   ├── index.ts           # i18n utility functions
│   │   ├── en.json            # English translations (git-ignored, personal data)
│   │   ├── es.json            # Spanish translations (git-ignored, personal data)
│   │   ├── en.example.json    # Example structure for English
│   │   └── es.example.json    # Example structure for Spanish
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       ├── index.astro        # Redirect to default language
│       ├── [lang]/index.astro # Dynamic i18n page
│       └── api/contact.ts     # Contact form endpoint
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Commands

| Command             | Action                                       |
| :------------------ | :------------------------------------------- |
| `npm install`       | Install dependencies                         |
| `npm run dev`       | Start dev server at `localhost:4321`          |
| `npm run build`     | Build production site to `./dist/`           |
| `npm run preview`   | Preview build locally                        |
| `npm test`          | Run unit tests with Vitest                   |
| `npm run test:watch`| Run tests in watch mode                      |

## CI/CD — Deploy to VPS with GitHub Actions

This project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically runs tests and deploys to an Ubuntu VPS via SSH + Docker on every push to `main`.

### Setup

1. **On your VPS**, clone the repo and set up i18n files:

   ```sh
   git clone git@github.com:YOUR_USER/YOUR_REPO.git ~/portfolio
   cd ~/portfolio
   cp src/i18n/en.example.json src/i18n/en.json
   cp src/i18n/es.example.json src/i18n/es.json
   # Edit the JSON files with your personal data
   ```

2. **On your VPS**, make sure Docker and Docker Compose are installed:

   ```sh
   sudo apt update && sudo apt install -y docker.io docker-compose-plugin
   sudo usermod -aG docker $USER
   ```

3. **In your GitHub repo**, go to **Settings → Secrets and variables → Actions** and add these secrets:

   | Secret            | Description                                      |
   | :---------------- | :----------------------------------------------- |
   | `VPS_HOST`        | Your VPS IP or hostname (e.g. `123.45.67.89`)    |
   | `VPS_USER`        | SSH user (e.g. `deploy`)                         |
   | `VPS_SSH_KEY`     | Private SSH key (the full content of `id_ed25519`)|
   | `VPS_PORT`        | SSH port (optional, defaults to `22`)            |
   | `VPS_PROJECT_PATH`| Project path on VPS (optional, defaults to `~/portfolio`) |

4. **Generate a deploy SSH key** (if you don't have one):

   ```sh
   ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/deploy_key -N ""
   # Copy the public key to the VPS
   ssh-copy-id -i ~/.ssh/deploy_key.pub user@your-vps-ip
   # Copy the private key content to VPS_SSH_KEY secret
   cat ~/.ssh/deploy_key
   ```

5. **Push to `main`** — the workflow will:
   - Run all unit tests
   - Verify the build succeeds
   - SSH into your VPS, pull changes, rebuild the Docker image, and restart the container

### Nginx Reverse Proxy (recommended)

To serve on port 80/443 with SSL, add an Nginx config on the VPS:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:4321;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Get a free SSL certificate with:

```sh
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```


An **Astro** (v5, SSR) implementation based on a fork of the original portfolio template by [Prasad Lakhara](https://prasadlakhara.github.io/portfolio-template/).

## Credits

- **Original template:** [prasadlakhara/portfolio-template](https://prasadlakhara.github.io/portfolio-template/) — HTML/CSS/JS portfolio template.
- **Astro implementation:** This project adapts the original template into an Astro-based application with server-side rendering, i18n (EN/ES), Docker support, and interactive skills with workplace data.