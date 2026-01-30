# Edge Runtime Allowlist — Step 15

The following routes are **explicitly allowed** to run on Edge:

- app/apple-icon.tsx
- app/icon.tsx
- app/embed/route.ts
- app/portals/page.tsx
- app/api/pulse/*
- app/api/hybrid/placeholder/*

All other routes must default to **Node.js runtime**.

Generated at: Wed Jan 28 22:28:18 UTC 2026
