# API Safe-Rating Filters

## Purpose
Allow only G / PG-rated assets through automated source-rating gates.

## Policy
- G -> allow
- PG -> allow
- Unknown / Unrated -> review
- PG-13 / R / NC-17 -> block

## Endpoint
- GET /api/safety/rating
