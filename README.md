# Portfolio — Astro Implementation

An **Astro** (v5, SSR) implementation based on a fork of the original portfolio template by [Prasad Lakhara](https://prasadlakhara.github.io/portfolio-template/).

## Credits

- **Original template:** [prasadlakhara/portfolio-template](https://prasadlakhara.github.io/portfolio-template/) — HTML/CSS/JS portfolio template.
- **Astro implementation:** This project adapts the original template into an Astro-based application with server-side rendering, i18n (EN/ES), Docker support, and interactive skills with workplace data.

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

## License

This project is based on the open-source [portfolio-template](https://prasadlakhara.github.io/portfolio-template/) by Prasad Lakhara. Please respect the original license terms.
