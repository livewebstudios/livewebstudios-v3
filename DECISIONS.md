# DECISIONS: Live AI Studios (/ai) build

One line per judgment call: date, decision, why.

- 2026-09-26: Proceeded with only lws-ai-blueprint-handoff.md untracked. It is the handoff being run, not stray work, so the "dirty tree" stop condition does not apply.
- 2026-09-26: Work on main (the handoff says note the branch and work on it; Session 6 pushes origin main).
- 2026-09-26: .theme-live-ai lives in global.css, not per page. Seven pages plus the article template share it; per-page copies would drift.
- 2026-09-26: .theme-live-ai sets --cyan-2 equal to --cyan so any inherited two-stop button ramp renders flat violet. Enforces the no-purple-gradient rule by construction.
- 2026-09-26: .theme-live-ai kills the .page-head::before accent bloom (a radial-gradient). Re-tinting it violet would break the flat-violet rule.
