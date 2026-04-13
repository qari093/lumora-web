# Bot Pattern Filtering

## Purpose
Identify likely bot-generated or spam-amplified signal patterns.

## Rules
- repeated token pattern
- character flood pattern
- hashtag stuffing
- synthetic handle pattern
- all-caps shout pattern

## Output
- botRiskScore
- isBotLikely
- reasons

## Endpoint
- GET /api/trust/bot-patterns
