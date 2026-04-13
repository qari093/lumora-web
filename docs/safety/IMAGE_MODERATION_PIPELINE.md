# Image Moderation Pipeline

## Purpose
Moderate image assets before they can enter feed, reaction, or content workflows.

## Current checks
- mime type allowlist
- suspicious dimensions
- risky filename / alt text / source metadata
- tiny artifact detection

## Actions
- allow
- review
- block

## Endpoint
- GET /api/safety/image
