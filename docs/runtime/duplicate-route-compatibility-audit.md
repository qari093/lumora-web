# Duplicate Route Compatibility Audit

Generated: 2026-06-06T21:03:38.884Z

## liveRoomAliases

| Route | Exists | Classification | Methods | Bytes |
|---|---:|---|---|---:|
| `app/api/live/room/route.ts` | yes | unknown | GET | 182 |
| `app/api/live/room-list/route.ts` | yes | unknown | GET | 187 |
| `app/api/live/roomlist/route.ts` | yes | unknown | GET | 186 |
| `app/api/live/rooms-list/route.ts` | yes | unknown | GET | 188 |
| `app/api/live/roomslist/route.ts` | yes | unknown | GET | 187 |
| `app/api/live/rooms/list/route.ts` | yes | unknown | GET | 188 |
| `app/api/live/rooms/public/route.ts` | yes | unknown | GET | 190 |
| `app/api/live/rooms/route.ts` | yes | canonical | GET | 266 |

## fypLegacy

| Route | Exists | Classification | Methods | Bytes |
|---|---:|---|---|---:|
| `app/api/fyp94/feed/route.ts` | yes | unknown | GET | 181 |
| `app/api/fyp94/health/route.ts` | yes | unknown | GET | 185 |
| `app/api/fyp94/library/route.ts` | yes | unknown | GET | 191 |
| `app/api/fyp94/production-health/route.ts` | yes | unknown | GET | 197 |
| `app/api/feed/route.ts` | yes | active_implementation | GET | 2622 |
| `app/api/feed/final/route.ts` | yes | unknown | GET | 263 |
| `app/api/feed/mix/route.ts` | yes | active_implementation | GET, POST | 1119 |
| `app/api/fyp/feed/route.ts` | yes | canonical | GET | 1214 |
| `app/api/fyp/native-feed/route.ts` | yes | canonical | GET | 843 |

## walletZencoinOverlap

| Route | Exists | Classification | Methods | Bytes |
|---|---:|---|---|---:|
| `app/api/wallet/route.ts` | yes | unknown | GET | 186 |
| `app/api/wallet/balance/route.ts` | yes | unknown | GET | 194 |
| `app/api/wallet/history/route.ts` | yes | unknown | GET | 193 |
| `app/api/wallet/ledger/route.ts` | yes | unknown | POST | 193 |
| `app/api/wallets/route.ts` | yes | unknown | GET, POST | 290 |
| `app/api/wallets/ensure/route.ts` | yes | unknown | POST | 195 |
| `app/api/zencoin/wallet/route.ts` | yes | unknown | GET | 94 |
| `app/api/zenwallet/runtime/route.ts` | yes | canonical | GET | 269 |
| `app/api/zenwallet/ledger/route.ts` | yes | canonical | GET | 215 |

## zendoroCommerceOverlap

| Route | Exists | Classification | Methods | Bytes |
|---|---:|---|---|---:|
| `app/api/zendoro/products/route.ts` | yes | canonical | GET | 142 |
| `app/api/products/route.ts` | yes | unknown | GET, POST | 290 |
| `app/api/zendoro/orders/route.ts` | yes | canonical | GET | 140 |
| `app/api/orders/route.ts` | yes | unknown | GET | 297 |
| `app/api/zendoro/checkout/route.ts` | yes | canonical | GET | 235 |
| `app/api/payments/checkout/route.ts` | yes | unknown | POST | 197 |
| `app/api/stripe/checkout/route.ts` | yes | unknown | POST | 195 |
| `app/api/stripe/create-checkout-session/route.ts` | yes | unknown | POST | 210 |
| `app/api/zendoro/webhook/route.ts` | yes | canonical | GET | 234 |
| `app/api/payments/webhook/route.ts` | yes | unknown | POST | 195 |
| `app/api/stripe/webhook/route.ts` | yes | canonical | POST | 3271 |
| `app/api/shop/webhook/route.ts` | yes | unknown | POST | 191 |
| `app/api/webhooks/zendoro/route.ts` | yes | unknown | POST | 555 |

## Rule

No route is deleted in this audit. Any legacy route must first be converted to a compatibility wrapper or gated behind a production-safe 404 before removal.
