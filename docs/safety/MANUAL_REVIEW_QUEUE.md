# Manual Review Queue

## Purpose
Capture high-risk or ambiguous signals for human review before feed use.

## Backing file
data/review/manual-review-queue.json

## Endpoints
- GET /api/safety/review
- GET /api/safety/review?mode=seed

## Statuses
- pending
- approved
- rejected
