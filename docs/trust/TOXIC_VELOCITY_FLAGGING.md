# Toxic Velocity Flagging

## Purpose
Detect signals that gain speed abnormally while carrying trust, bot, anomaly, or semantic risk.

## Factors
- high velocity + low trust
- high velocity + semantic risk
- high velocity + bot risk
- high velocity + anomaly risk
- ragebait/deceptive spike language

## Output
- toxicVelocityScore
- flagged
- reasons

## Endpoint
- GET /api/trust/toxic-velocity
