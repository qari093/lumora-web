# Wallet/Zencoin Namespace Compatibility Wrappers

Status: applied

Canonical launch namespace: `/api/zenwallet/*`

Rule: legacy wallet/wallets endpoints must not receive new logic.

- `GET` `app/api/wallet/route.ts` -> `/api/zenwallet/runtime`
- `GET` `app/api/wallet/balance/route.ts` -> `/api/zenwallet/runtime`
- `GET` `app/api/wallet/history/route.ts` -> `/api/zenwallet/ledger`
- `POST` `app/api/wallet/ledger/route.ts` -> `/api/zenwallet/ledger`
- `GET,POST` `app/api/wallets/route.ts` -> `/api/zenwallet/runtime`
- `POST` `app/api/wallets/ensure/route.ts` -> `/api/zenwallet/runtime`
