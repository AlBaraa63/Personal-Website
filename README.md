# 🌐 Personal Portfolio Website

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)

**A modern, responsive portfolio showcasing my projects and skills**

[Live Demo](https://albaraaalolabi.dev) • [Source Code](https://github.com/AlBaraa63/Personal-Website)

</div>

---

## ✨ Features

- 🎨 **Modern Design** - Clean UI with smooth animations via Framer Motion
- 📱 **Fully Responsive** - Optimized for all device sizes
- ⚡ **Lightning Fast** - Built with Vite for optimal performance
- 🔒 **Type-Safe** - Full TypeScript implementation
- 📧 **Contact Form** - Integrated EmailJS for direct messaging
- 🗄️ **Supabase Integration** - Backend data management

---

## 🛠️ Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router DOM
- **Email:** EmailJS
- **Database:** Supabase
- **Deployment:** Vercel / GitHub Pages

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AlBaraa63/Personal-Website.git
cd Personal-Website

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |
| `npm run deploy` | Deploy to GitHub Pages |

---

## 📁 Project Structure

```
Personal-Website/
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   ├── data/         # Portfolio data
│   ├── hooks/        # Custom hooks
│   ├── pages/        # Page components
│   └── styles/       # Global styles
├── index.html        # Entry HTML
├── vite.config.ts    # Vite configuration
├── tailwind.config.js # Tailwind configuration
└── package.json
```

---

## 🤖 Holo-AI Backend (optional)

The Holo-AI window inside HOLO-OS runs on a two-tier brain:

1. **Local agent (default)** — intent matching + static FAQ in `src/components/apps/holoAI.ts`. Works without any API key. Can drive the OS (open/close/focus windows, deep-link projects).
2. **Claude-powered (optional)** — a Vercel Edge Function at `api/chat.ts` wraps Anthropic's API. Same `{message, actions}` shape, so the frontend code doesn't change. Claude can call tools to control the OS the same way the local agent can.

### Enabling the Claude backend on Vercel

1. Add an Anthropic API key to your Vercel project:
   - Vercel dashboard → Project → **Settings → Environment Variables**
   - Name: `ANTHROPIC_API_KEY`
   - Value: your `sk-ant-...` key
   - Apply to Production (and Preview if desired)
2. Redeploy. The frontend automatically POSTs to `/api/chat` in production.

If `ANTHROPIC_API_KEY` is missing or the function errors, the frontend silently falls back to the local agent.

**Model:** `claude-haiku-4-5` (fast + cheap). System prompt + tool definitions are prompt-cached, so repeat requests cost ~$0.001 each.

### Pointing at a different endpoint

Set `VITE_AI_ENDPOINT` at build time to override:

```bash
VITE_AI_ENDPOINT=https://my-custom-endpoint.example.com/chat npm run build
```

The endpoint must accept `POST { message: string }` and return `{ message: string, actions?: HoloAction[] }`.

### Optional: live GitHub presence widget

The desktop shows your latest public GitHub activity. To raise the rate-limit ceiling from 60/hr to 5000/hr, set `VITE_GITHUB_TOKEN` (a fine-grained PAT with read-only public access is enough).

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**Made with ❤️ by AlBaraa63**

</div>
