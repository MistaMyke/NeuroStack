# GEMINI.md

## Project Overview

This repository, **NeuroStack**, is a **personal development lab** for building and documenting portfolio-ready web applications that integrate AI.  
It serves two purposes:
1. **Portfolio Output** → Showcasing technical skills and project builds.  
2. **Learning Forge** → Recording growth in full-stack + AI development.  

---

## System Context (How It Fits)

NeuroStack is part of the **5-Pillar Ecosystem**, functioning as a **working directory** outside of Obsidian vaults:  
- **IndigoShield Tech** = Business engine  
- **LifeOps / AiDHD** = Personal systems + SaaS concept  
- **Public Content** = Substack, YouTube, Podcast  
- **Project & Control** = Tracking hub  
- **Eido (Assistant)** = Integration & strategy layer  

**NeuroStack’s Role:**  
- **Sandbox for builds** (portfolio, websites, SaaS experiments)  
- **Kept separate from LifeOps vault** to reduce clutter  
- **Auto-synced with GitHub** for version control and public sharing  
- **Feeds into Project Control Hub** for progress tracking  
- **Outputs connected to Content Pillar** (portfolio site, tutorials, case studies)

---

## Project Categories

- **Portfolio Website** → Personal showcase, live projects, and technical narrative  
- **Client Projects (Prototype)** → Potential work samples, service demos  
- **SaaS Experiments** → Testing ideas for future LifeOps/AiDHD integration  
- **AI Integrations** → Demos using OpenAI, Hugging Face, LangChain  

---

## Technologies

- **Frontend:** React with Vite  
- **Backend:** Python with FastAPI (planned)  
- **AI/ML:** OpenAI API, Hugging Face, LangChain (planned)  
- **Deployment:** Docker, with plans for Render/Vercel  

---

## Structure

- `/portfolio` → React frontend app  
- `/backend` → (planned) FastAPI backend  
- `/experiments` → AI/automation prototypes  
- Future projects will live in separate directories under this repo.  

---

## Building and Running

### Development
```bash
npm run dev
```
Runs the Vite dev server at `http://localhost:5173`.

### Production
```bash
npm run build
npm run preview
```
- `build` creates optimized files in `/dist`  
- `preview` serves the production build locally  

### Linting
```bash
npm run lint
```

---

## Development Conventions

- Uses **eslint** (`eslint.config.js` configured).  
- React with **functional components + hooks**.  
- Standard React project structure: `src`, `public`, `assets`.  
- **pnpm workspaces** enabled (`pnpm-workspace.yaml`) → currently only `portfolio`, but expandable.  
- Commit messages follow a **functional style** (feature, fix, docs, chore).  

---

## Command Hooks (EidoCore)

### Tasking
- `Launch new task: [Task] — Priority: [Low/Medium/High] — Due: [Optional Date]`
- `Edit task: [Task ID] — Update: [New Details]`
- `Prioritize task: [Task] — New Priority: [High/Medium/Low]`

### Planning
- `Plan project: [Project Name] — Phases: [#] — Deliverables: [List]`
- `Draft roadmap: [Goal] — Timeline: [Short/Medium/Long]`

### Review
- `Status report` → Pull current NeuroStack progress + link to Master Progress Summary  
- `Queue check` → List current active NeuroStack tasks  
- `Update vault` → Push NeuroStack progress notes to LifeOps/IndigoShield vaults  

---

## Notes for Gemini CLI

- This folder = **execution forge**, not an Obsidian vault.  
- Treat projects here as **build outputs** linked to portfolio + public presence.  
- GitHub pushes = expected final state for sharing progress.  
- Connect status here with `Master Progress Summary` and `Project Control Hub` for ecosystem alignment.  
- When reflecting, use tone rules from **Visual and Voice Guide** (candid, raw, real, no corporate jargon).  

---

