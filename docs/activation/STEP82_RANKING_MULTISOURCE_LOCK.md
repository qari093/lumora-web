Validated:
- velocity scoring integrated
- source reliability integrated
- scoring pipeline stable (no runtime errors)
- ranking produces valid numeric scores
- multi-source restored at ranking level
- top10 ranking contains >=2 sources
- feed remains multi-source and stable

Critical Guarantee:
- ranking MUST NEVER collapse to single-source again
- enforceMultiSource() is mandatory safeguard layer

Constraints:
- if top10 sources < 2 → SYSTEM INVALID
- if ranking returns 500 → SYSTEM INVALID
- if scoring produces identical values → SYSTEM INVALID

State:
- ranking intelligence layer = STABLE + GUARDED
