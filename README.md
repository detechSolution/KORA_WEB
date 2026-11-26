# Kora Web

Public site for Kora. Members browse sessions, spa, memberships, and schedules, then book and pay. Guests can inquire, buy gift cards, and create an account.

## Tech stack

- Nuxt 4 (Vue 3), client-rendered SPA
- Nuxt UI 4
- Pinia
- Zod
- Tailwind CSS 4
- ESLint (Antfu config)

## Prerequisites

- Node.js 22.x
- npm

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and set the API:

   ```env
   NUXT_PUBLIC_API_BASE_URL=http://localhost:8000
   NUXT_PUBLIC_API_TIMEOUT=10000
   NUXT_PUBLIC_BOOKING_ENABLED=false
   ```

   | Variable                      | Description                         |
   | ----------------------------- | ----------------------------------- |
   | `NUXT_PUBLIC_API_BASE_URL`    | Backend API base URL                |
   | `NUXT_PUBLIC_API_TIMEOUT`     | API request timeout in milliseconds |
   | `NUXT_PUBLIC_BOOKING_ENABLED` | `true` turns on public booking      |

## Development

```bash
npm run dev
```

Uses `.env.local` and serves at `http://localhost:3000` (with `--host` for LAN access).

## Scripts

| Command            | Description                                     |
| ------------------ | ----------------------------------------------- |
| `npm run dev`      | Dev server with `.env.local`                    |
| `npm run generate` | Static site into `.output/public` (uses `.env`) |
| `npm run build`    | Production build                                |
| `npm run preview`  | Preview the production build                    |
| `npm run lint`     | Run ESLint                                      |
| `npm run lint:fix` | Run ESLint with auto-fix                        |
| `npm run knip`     | Find unused files and exports                   |

## Project structure

```
app/
├── components/   # Home, sessions, spa, membership, checkout, layout
├── composables/  # useApi, payments, pagination
├── config/       # API endpoints and icons
├── data/         # Static page content
├── pages/        # Public routes
├── stores/       # Auth, cart, checkout, sessions, spa, membership
└── utils/
```

## Features

- **Home and spaces:** Wellness, recovery, rehabilitation, and nutrition
- **Book:** Sessions, spa sanctuary, memberships, guest passes, and gift cards
- **Schedules** and member profile
- **Checkout:** Fonepay and related payment status pages
- **Account:** Register, login, email verification, Google sign-in, forgot password
- **Company pages:** Careers, inquiry, corporate and retreats, etiquette, CSR, terms

## Deployment

`npm run generate` writes a static SPA to `.output/public`. Set the `NUXT_PUBLIC_*` variables at build time so they are baked into the client bundle.

## License

Private
