# Lumora Security Headers

## Enforced headers
- x-lumora-sec: 1
- x-content-type-options: nosniff
- x-frame-options: SAMEORIGIN
- referrer-policy: strict-origin-when-cross-origin
- x-xss-protection: 1; mode=block

## Enforcement
- Applied globally through middleware
- Excludes _next/static, _next/image, favicon.ico
