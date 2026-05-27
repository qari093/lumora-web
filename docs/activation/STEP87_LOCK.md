Validated:
- velocity scoring integrated
- recency burst working (recent items boosted)
- score floor enforced (no score < 1)
- source reliability applied
- ranking returns 200 OK
- multi-source preserved in top 10
- scoring variation exists

Constraints:
- if top10 becomes single-source → INVALID
- if scores collapse (no variation) → INVALID
- if any score < 1 → INVALID

State:
- advanced scoring layer (velocity + recency + reliability + floor) = WORKING
