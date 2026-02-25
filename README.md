# DispensaryPages.io

AI-powered local SEO page generator for cannabis dispensaries. Generate state-compliant, SEO-optimized landing pages with LocalBusiness schema, FAQPage markup, and conversion-focused copy.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Prisma + SQLite
- **Auth:** NextAuth.js (credentials provider for demo)
- **AI:** Anthropic Claude API
- **Payments:** Stripe

## Features

- **5 Page Types:** Location pages, Strain guides, Product categories, Blog posts, Deals & promotions
- **SEO Output:** Title tags, meta descriptions, Open Graph tags, LocalBusiness JSON-LD, FAQPage schema
- **State Compliance:** Built-in rules for MN, CO, CA, IL, MI (no health claims, age gates, license requirements)
- **Export:** Copy HTML, Copy Markdown, Download full HTML file
- **Page Library:** Browse and manage all generated pages
- **Settings:** Dispensary details, state selection, brand voice configuration
- **Payments:** Stripe integration for Starter ($49/mo) and Pro ($99/mo) plans

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
- `ANTHROPIC_API_KEY` - Required for page generation
- `STRIPE_SECRET_KEY` - Required for payments (optional for dev)
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`

### 3. Initialize database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth handler
│   │   ├── generate/            # Claude AI page generation
│   │   ├── pages/               # CRUD for generated pages
│   │   ├── dispensary/          # Dispensary settings
│   │   └── stripe/              # Checkout + webhooks
│   ├── generate/                # Page generator UI
│   ├── library/                 # Generated pages library
│   ├── login/                   # Auth page
│   ├── settings/                # Dispensary settings + billing
│   └── page.tsx                 # Landing page
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── navbar.tsx               # Navigation
│   └── providers.tsx            # Session + toast providers
├── lib/
│   ├── auth.ts                  # NextAuth config
│   ├── claude.ts                # Claude API integration
│   ├── compliance.ts            # State compliance rules
│   ├── prisma.ts                # Prisma client singleton
│   ├── stripe.ts                # Stripe config + plans
│   └── utils.ts                 # shadcn/ui utils
└── generated/prisma/            # Prisma generated client
```

## Database Models

- **User** - Auth accounts and profile
- **Dispensary** - Dispensary details (name, address, state, license, brand voice)
- **GeneratedPage** - All generated pages with HTML, SEO metadata, JSON-LD
- **Subscription** - Stripe subscription status and plan

## State Compliance

The generator enforces state-specific cannabis advertising rules:

| State | Key Rules |
|-------|-----------|
| MN | No health claims, 21+ disclaimer, license required |
| CO | No health claims, no consumption depicted, license required |
| CA | No health claims, CA cannabis symbol, DCC license format |
| IL | No health claims, no healthcare testimonials, license required |
| MI | No health claims, no overconsumption promotion, license required |
