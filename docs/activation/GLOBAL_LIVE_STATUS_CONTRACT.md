Global Live Status Contract

All FYP-related routes must eventually expose:
- classification
- live_status
- proof_status
- source_of_truth

Definitions:
- classification: scaffold | live | unknown
- live_status: not_live | partial | live
- proof_status: missing | pending | passed | failed
- source_of_truth: where the route gets real runtime truth from
