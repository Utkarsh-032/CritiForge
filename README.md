# CritiForge

**Review. Improve. Ship.**

CritiForge is an AI engineering workspace that reviews websites and code, explains problems, and helps developers improve and ship better software. The current project uses deterministic demo responses marked with `source: "demo"`; it does not call an AI provider.

## Run locally

Start the demo API:

```powershell
cd apps/server
npm start
```

Start the Vite frontend from the repository root:

```powershell
npm run dev
```

The frontend calls `http://localhost:3001/api` by default. The documented environment variable is in `apps/client/.env.example`.

## Demo endpoints

- `GET /api/health`
- `POST /api/reviews/website`
- `POST /api/reviews/code`
- `POST /api/mentor`
