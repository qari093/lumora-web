# Lumora Deployment Target

Primary target:
- Vercel
- Region: fra1
- Domain: lumora.app
- Runtime: Next.js
- Database: PostgreSQL
- Storage/CDN: Cloudflare R2 / Cloudflare edge

Deployment gates:
- Prisma validate
- Typecheck
- Vitest ecosystem suites
- Next build
- Browser smoke
- Final launch seal
