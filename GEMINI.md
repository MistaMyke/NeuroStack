# GEMINI.md

## Project Overview

This repository, NeuroStack, is a personal development lab for building and documenting portfolio-ready web applications that integrate AI. The project serves as both a portfolio and a record of technical growth.

The primary technologies used are:
- **Frontend:** React with Vite
- **Backend:** Python with FastAPI (planned)
- **AI/ML:** OpenAI API, Hugging Face, LangChain (planned)
- **Deployment:** Docker, with plans for Render/Vercel

The repository is structured with a `portfolio` directory containing the frontend application, and plans for a backend application and other projects.

## Building and Running

The frontend application is a React project built with Vite.

**To run the development server:**

```bash
npm run dev
```

This will start the development server, typically at `http://localhost:5173`.

**To build the project for production:**

```bash
npm run build
```

This will create a `dist` directory with the production-ready files.

**To preview the production build:**

```bash
npm run preview
```

**To lint the code:**

```bash
npm run lint
```

## Development Conventions

- The project uses `eslint` for code linting. The configuration is in `eslint.config.js`.
- The frontend is built with React and uses functional components with hooks.
- The project follows a standard React project structure with `src`, `public`, and `assets` directories.
- The `pnpm-workspace.yaml` file suggests that the project may be set up as a monorepo using pnpm workspaces, although there is currently only one workspace (`portfolio`).
