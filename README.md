# DayFlow — AI Daily Planner

A production-ready AI-powered daily planner built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. Powered by Groq's `llama-3.3-70b-versatile` model.

## Features

- **AI plan generation** — enter tasks in plain text, get a structured, time-blocked schedule
- **Priority badges** — high / medium / low with colour-coded indicators
- **Dark / light mode** — persisted in `localStorage`, respects system preference
- **Plan history** — last 20 plans saved locally, restorable at any time
- **Copy to clipboard** — formatted plain text, ready to paste anywhere
- **Download as .txt** — saves a clean daily schedule file
- **Fully responsive** — stacked on mobile, side-by-side on desktop
- **Framer Motion animations** — staggered reveals, hover effects, smooth transitions
- **Structured error handling** — network, API, parse, and validation error types

## Project Structure

```
ai-daily-planner/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Main page — state root
│   └── api/
│       └── plan/
│           └── route.ts        # POST /api/plan
│
├── components/
│   ├── ui/                     # Reusable primitives
│   │   ├── Badge.tsx           # Priority badge
│   │   ├── Button.tsx          # Button (primary / ghost / outline)
│   │   └── Card.tsx            # Glass card
│   └── planner/                # Feature components
│       ├── Navbar.tsx          # Sticky nav + theme toggle
│       ├── InputPanel.tsx      # Textarea + generate button
│       ├── ResultPanel.tsx     # Plan output panel
│       ├── TaskCard.tsx        # Individual task card
│       ├── ActionBar.tsx       # Copy / download / clear
│       ├── HistoryPanel.tsx    # Saved plans dropdown
│       ├── ErrorDisplay.tsx    # Typed error UI
│       ├── ResultSkeleton.tsx  # Loading skeleton
│       └── States.tsx          # Empty state
│
├── lib/
│   ├── ai.ts                   # Groq API caller + prompt builder
│   ├── planUtils.ts            # Format, copy, download helpers
│   ├── theme.tsx               # ThemeProvider + useTheme
│   ├── useErrorHandler.ts      # Error classification hook
│   ├── usePlanHistory.ts       # localStorage history hook
│   └── utils.ts                # cn() helper
│
├── types/
│   └── index.ts                # All TypeScript interfaces
│
├── styles/
│   └── globals.css             # Tailwind base + custom utilities
│
├── public/
│   └── images/                 # Static assets
│
├── .env.example
├── .eslintrc.json
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo>
cd ai-daily-planner
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Groq API key:

```env
AI_API_KEY=your_groq_api_key_here
```

Get a free key at [console.groq.com](https://console.groq.com/keys).

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
npm run build
npm start
```

## API Reference

### `POST /api/plan`

**Request body:**
```json
{ "tasks": "Write quarterly report\nReview pull requests\nTeam sync at 3pm" }
```

**Success response `200`:**
```json
{
  "success": true,
  "plan": {
    "tasks": [
      {
        "title": "Write quarterly report",
        "priority": "high",
        "estimatedTime": "2 hours",
        "suggestedTimeSlot": "09:00 – 11:00"
      }
    ],
    "summary": "A focused 3-task day starting with deep work."
  }
}
```

**Error response `4xx / 5xx`:**
```json
{ "error": "Human-readable error message." }
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion v11 |
| AI Model | Groq — llama-3.3-70b-versatile |
| Fonts | Geist Sans + Geist Mono |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `AI_API_KEY` | Yes | Groq API key |
