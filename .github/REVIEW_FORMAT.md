# Code Review Output Format

Every `opencode-review` comment MUST follow this structure so reviews are
consistent and scannable across PRs. Omit any empty section — **except Verdict
and Summary, which are always present.**

The opencode action appends the session/run link automatically; do **not** add
a footer.

---

## Template

```
## Code Review

**Verdict:** <LGTM | Request changes | Needs discussion> — <one sentence why>

<1–2 sentence summary: what the change does and your overall assessment>

### Findings

Highest severity first, one per line, in exactly this form:

- **[Blocker]** `path/file.ext:LINE` — <concrete problem> → <suggested fix>
- **[Major]**   `path/file.ext:LINE` — <concrete problem> → <suggested fix>
- **[Nit]**     `path/file.ext:LINE` — <concrete problem> → <suggested fix>

If there are no findings, write exactly: ✅ No issues found.

### Verified OK

- <things you checked and confirmed correct, so the next reviewer does not
  re-flag them — especially code that looks suspicious but is actually handled>

### Tests & Build

<one line: `npm test` / `npm run build` pass | fail | N/A>
```

---

## Severity definitions

| Tag | Meaning |
|-----|---------|
| **[Blocker]** | Correctness or security bug; unsafe to merge as-is. |
| **[Major]** | A real issue; should fix before or soon after merge. |
| **[Nit]** | Style, naming, minor cleanup; optional. |

---

## Rules

- **Always cite `file:line`.** No vague findings like "somewhere in the auth layer".
- **One finding per bullet**, keep each to 1–2 lines.
- **Do not invent issues to fill space.** A clean, correct diff → `✅ No issues found.` is a complete, valid review.
- **No severity inflation.** A missing JSDoc is never `[Blocker]`; a single `any` in a test fixture is never `[Blocker]`.
- For translation PRs (`posts/`), keep the Verdict line and `[Blocker]`/`[Major]`/`[Nit]` tags, but use these section names instead of the generic ones:
  - `### Frontmatter & AGENTS.md Compliance`
  - `### Findings`
  - `### Verified OK` *(not defects — esp. JP/zh-CN character forms correct per `REVIEW-PITFALLS.md`)*
  - `### Tests & Build`
