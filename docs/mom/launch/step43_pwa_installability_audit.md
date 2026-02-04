# Step 43/91 — PWA Installability Audit

UTC: 2026-02-04T17:39:06Z
Base URL (local prod): http://127.0.0.1:3010

## Manifest
- Status: 200
- Content-Type: unknown
- Cache-Control: missing

### Manifest headers (first 30)
```
HTTP/1.1 200 OK
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data: blob:; media-src 'self' data: blob:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https: wss:
Accept-Ranges: bytes
Cache-Control: public, max-age=0
Last-Modified: Mon, 26 Jan 2026 14:13:31 GMT
ETag: W/"215-19bfaa7126c"
Content-Type: application/manifest+json
Content-Length: 533
Vary: Accept-Encoding
Date: Wed, 04 Feb 2026 17:39:03 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

### Manifest body (first 140 lines)
```
{
  "name": "Lumora",
  "short_name": "Lumora",
  "description": "Lumora — unified portals (FYP, GMAR, NEXA, Movies, Live, Share).",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#05080f",
  "theme_color": "#070b14",
  "orientation": "portrait",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" }
  ]
}
```

## Icons
Checked routes:
- /icon
- /apple-icon
- /favicon.ico

## Home HTML head (first 60 lines)
```
<!DOCTYPE html><!--N7npktfBXbLocanwU4z_T--><html lang="en" data-lumora-theme="darkglass"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="/_next/static/css/64ade01f0434e403.css" data-precedence="next"/><link rel="preload" as="script" fetchPriority="low" href="/_next/static/chunks/webpack-5d05d300bd8ae87c.js"/><script src="/_next/static/chunks/1222e57d-cdeed2c7c514bfa8.js" async=""></script><script src="/_next/static/chunks/4725-40100e1309954b01.js" async=""></script><script src="/_next/static/chunks/main-app-c3ee904a59492689.js" async=""></script><script src="/_next/static/chunks/app/layout-65284048bd259946.js" async=""></script><script src="/_next/static/chunks/app/error-4f272efe79a11f7a.js" async=""></script><meta name="color-scheme" content="dark"/><meta name="theme-color" content="#070b14"/><title>Lumora</title><meta name="description" content="Lumora — unified portals (FYP, GMAR, Videos, NEXA, Movies, Live)."/><meta name="application-name" content="Lumora"/><link rel="manifest" href="/manifest.webmanifest"/><meta name="apple-mobile-web-app-capable" content="yes"/><meta name="mobile-web-app-capable" content="yes"/><meta name="format-detection" content="telephone=no"/><meta name="mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-title" content="Lumora"/><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/><link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="1x1"/><link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png"/><link rel="icon" href="/icon-512.png" sizes="512x512" type="image/png"/><link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" type="image/png"/><script src="/_next/static/chunks/polyfills-42372ed130431b0a.js" noModule=""></script></head><body class="lumora-root"><div hidden=""><!--$--><!--/$--></div><main class="lumoHome"><span id="STEP133_SPLASH_READY" style="display:none">STEP133_SPLASH_READY</span><span id="STEP135_TOPNAV" style="display:none">STEP135_TOPNAV</span><span id="STEP135_HOME_PORTALS_GRID" style="display:none">STEP135_HOME_PORTALS_GRID</span><style>
        .lumoHome {
          min-height: calc(100vh - 64px);
          padding: 20px 16px 36px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .lumoHero {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 18px 18px 16px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(20,24,40,.55);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .lumoTitle {
          font-size: 26px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .lumoSub {
          margin: 0;
          opacity: .86;
          max-width: 70ch;
        }
        .lumoGrid {
          margin-top: 16px;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 12px;
        }
        .lumoTile {
          grid-column: span 6;
          border-radius: 16px;
          padding: 14px 14px 12px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(15,18,32,.55);
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: transform .14s ease, border-color .14s ease, background .14s ease;
          will-change: transform;
        }
        .lumoTile:hover {
          transform: translateY(-2px);
          border-color: rgba(255,255,255,.22);
          background: rgba(22,26,44,.72);
        }
        .lumoTileTop {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 10px;
```

## Notes
- iOS A2HS requires HTTPS in real deployment.
- If rel="manifest" or apple-touch-icon meta are missing, update app/layout.tsx head metadata.
