# Vibe Tags Lite — Status Endpoint

## Route
- `GET /api/vibe/status`
- `GET /api/vibe/status?debug=1` (includes env snapshot)

## Response
Always returns `200` with an inspectable payload (never hard-500 for dev/test ergonomics).

Example:
```json
{
  "ok": true,
  "enabled": false,
  "source": "flags:vibeTagsLiteEnabled",
  "ts": 1730000000000
}
```

## ENV Toggles
- `LUMORA_VIBE_TAGS_LITE=1|0|true|false`
- `NEXT_PUBLIC_LUMORA_VIBE_TAGS_LITE=1|0|true|false`

Server + client overrides supported.
