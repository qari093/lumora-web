# Lumora Production PostgreSQL Setup

Required:
- Managed PostgreSQL provider
- Region: EU / Frankfurt preferred
- SSL required
- Daily backups enabled
- Connection pooling enabled
- Separate production DATABASE_URL
- Never use localhost in Vercel production

Recommended provider:
- Neon, Supabase, Railway, Render, or managed PostgreSQL on your cloud provider

After creating database:
1. Copy the production pooled PostgreSQL URL.
2. Add it to Vercel as DATABASE_URL.
3. Replace local placeholder only in Vercel environment, not necessarily in committed repo.
4. Run deployment.
