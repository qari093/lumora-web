# ZenWallet Governance Foundation

## Classification
Zencoin is an internal platform utility credit.

Zencoin is not:
- crypto
- cash
- security
- investment
- withdrawable balance
- tradable asset

## Balance compartments
- Zencoin: spendable utility credit.
- Refund Credit: locked non-withdrawable recovery credit usable only for new Zencoin packs or subscription restoration.

## Creator separation
Creator earnings use a separate emerald/graphite Creator View and payout ledger. Consumer ZenWallet remains gold/blue.

## Anti-abuse
No pay-to-win, gambling loops, casino animations, public spender pressure, or urgency pressure.

## Payment doctrine
ZenPay Bridge routes PSPs. OrderIntent is the canonical settlement object. PSP references must bind to order_id.

## Verification doctrine
Daily roots must be signed and externally published. In-app verification must validate pinned public-key proof, not trust browser redirects.

## Offline doctrine
Offline spends require signed entitlement certificates, sequence numbers, encrypted local journal, and server replay reconciliation.

## Refund and chargeback doctrine
Refunds use original PSP first. If unavailable, Refund Credit may be issued. Chargebacks create liability/review entries without destructive ledger mutation.
