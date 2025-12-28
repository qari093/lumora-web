# Lumora Live — Integration Steps (1 → 122)
(steps only, no details)

## Core Live Integration (1 → 76)
1. Live feature flags + mode gates
2. Live portal shell route wiring
3. Live rooms registry scaffolding
4. Live room create/join API
5. Live room presence model
6. Live websocket handshake + auth
7. Live session telemetry events
8. Live rate-limit middleware baseline
9. Live moderation stubs (report/mute)
10. Live safety policy stubs (age/consent)
11. Live stream manifest placeholder
12. Live stream start/stop endpoints
13. Live host permissions base
14. Live viewer permissions base
15. Live chat send/receive API
16. Live chat persistence baseline
17. Live chat anti-spam guard
18. Live reactions endpoint
19. Live reactions throttling
20. Live room list endpoint
21. Live hub registry endpoint
22. Live portal hubs endpoint (route)
23. Live portal hubs response contract
24. Live portal hubs ratelimit headers
25. Live portal hubs safe fallback behavior
26. Live hub UI wiring (client)
27. Live room UI skeleton (client)
28. Live chat UI skeleton (client)
29. Live reactions UI skeleton (client)
30. Live host controls UI skeleton
31. Live room header + viewer count
32. Live join/leave telemetry
33. Live heartbeat / keepalive
34. Live server health endpoint
35. Live client health probe
36. Live smoke scripts baseline
37. Live vitest health harness baseline
38. Live contract test for portal hubs
39. Live contract test for live room list
40. Live contract test for live chat
41. Live DB models baseline (rooms/messages)
42. Live DB indexes baseline
43. Live migrations lock discipline
44. Live audit logs baseline
45. Live abuse signals baseline
46. Live ban/mute store baseline
47. Live report intake baseline
48. Live report triage stub
49. Live content policy hooks stub
50. Live playback policy gate stub
51. Live creator profile link stub
52. Live discover ranking stub
53. Live shadow ranking telemetry
54. Live compliance docs stub
55. Live operator checklist stub
56. Live rollback hooks stub
57. Live crash-safe fallbacks
58. Live error boundary UI
59. Live loading/skeleton states
60. Live route-level caching rules
61. Live no-store enforcement where needed
62. Fix /api/live/portal-hubs 500 (safe fallback)
63. Force /api/live/portal-hubs never 500 + guaranteed headers
64. Add contract tests for /api/live/portal-hubs
65. Live final smoke macro (all core endpoints)
66. Live portal navigation links finalize
67. Live room join UX polish
68. Live chat moderation UI hooks
69. Live reaction mapping finalize
70. Live telemetry dashboards stub
71. Live trust gates finalize
72. Live rate-limit tuning pass
73. Live documentation pass
74. Live CI gate hook for live tests
75. Live pre-test operator runbook
76. Live readiness marker + freeze

## Live Monetization Policy Integration (Phase 0–1, Ad-Free) (77 → 98)
77. Policy non-negotiables codified (constants + doc)
78. Monetization feature flags (ad-free test phase)
79. Gifts/Sparks hard caps enforcement
80. No streak pressure rule (UI + server)
81. Private spend UX (no public shaming/rankings)
82. Creator dignity guardrails (copy + flows)
83. Refund / dispute intake flow stub
84. Spend friction safeguards (cooldown + confirmations)
85. Age-aware gating for spend (policy gate)
86. Anti-fraud hooks for gifting (signals stub)
87. Creator payout ledger binding (shadow mode)
88. Community drives framing rules (no “failure” states)
89. Operator policy checklist + enforcement toggles
90. Policy compliance smoke + lock marker
91. Wellness-aligned earnings copy enforcement
92. No addiction dark-pattern audit
93. Spend transparency receipts (private)
94. Soft-cap breach alerting (operator)
95. Policy telemetry events
96. Policy rollback toggles
97. Creator trust score (shadow)
98. Monetization Phase-1 freeze marker

## Live Infrastructure, Safety & Scale Hardening (99 → 122)
99. Live WebSocket reconnect resilience
100. Live backpressure handling
101. Live message fanout optimization
102. Live cold-start mitigation
103. Live regional latency probes
104. Live abuse burst detection
105. Live automated mute escalation
106. Live moderator tooling v1
107. Live legal audit hooks
108. Live privacy redaction paths
109. Live retention metrics binding
110. Live anomaly dashboards
111. Live disaster recovery drill
112. Live incident response runbook
113. Live rollback simulation
114. Live load test (baseline)
115. Live stress test (peak)
116. Live cost telemetry
117. Live spend ceiling guard
118. Live kill-switch validation
119. Live operator acceptance gate
120. Live production readiness review
121. Live public beta unlock
122. Live final lock + handoff
