# Lumora FYP94 Production Layer

Pack 6 locks:
- R2 migration prep
- CDN URL mapping
- fallback local mode
- feed health endpoint
- final production seal

Rules:
- local mode remains default
- R2 activates only via env flag
- CDN fallback is safe
- health endpoint verifies manifest and playable files
