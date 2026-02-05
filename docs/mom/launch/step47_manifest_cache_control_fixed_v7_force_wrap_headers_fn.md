# Step 47 — Manifest Cache-Control Fixed (force-wrap headers(), v7)

- Fix method: wrap existing next.config headers() (no AST injection), always prepends manifest rule
- Path: /manifest.webmanifest
- Cache-Control: public, max-age=3600, immutable
- Proof header: X-Lumora-Manifest-Headers: 1

Artifacts:
- HEAD: /tmp/step47_manifest_headers_head.txt
- GET : /tmp/step47_manifest_headers_get.txt

Status: PASS
