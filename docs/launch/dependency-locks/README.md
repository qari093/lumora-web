# Dependency Lock — Lumora Launch (Step 2)

These files represent the **frozen dependency state** at launch.

Rules:
- Do NOT modify dependencies during launch steps.
- Any change requires explicit operator approval and rollback planning.
- This lock guarantees reproducible builds.

Locked Artifacts:
- package.json.locked
- lockfile (*.locked)
- .nvmrc.locked (if present)
