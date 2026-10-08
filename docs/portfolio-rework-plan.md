# Portfolio rework plan

Prepared 2026-10-08 from [the owner's review notes](portfolio-review-notes.md). This is a proposed implementation sequence; personal choices that remain undecided are called out below.

## Direction

The primary audience is recruiters hiring for backend and infrastructure engineering. The main page should make three things clear: who Yash is, what he builds, and how to contact him. Start with a compact, readable mobile layout and expand it for larger screens.

Confirmed facts: Yash is a 2B Systems Design Engineering student at the University of Waterloo, focused on infrastructure and backend engineering. StackAdapt ran May–August 2026 and is no longer a current role. The other listed employment dates are confirmed by the owner. Additional StackAdapt accomplishments will come later; do not invent them.

Suggested initial headline: **Backend & infrastructure engineering.** Suggested supporting copy: **I'm Yash, a 2B Systems Design Engineering student at the University of Waterloo. I focus on backend systems and infrastructure.** These are draft wording, not an additional claim about experience.

## Proposed page structure

- Home: concise introduction, selected projects, compact experience timeline, and a clear contact action.
- Projects: one curated project listing, with short case studies for the strongest work.
- About: one optional photo, personal interests, and music preferences presented simply.
- Writing: add when at least one real article is ready. Internship engineering lessons can support the professional story; personal topics such as stocks can be clearly categorized.
- Resume: keep the PDF accessible as a secondary link, even if it leaves the primary navigation. It remains useful as a downloadable record for applications.

Remove the map and location from the homepage. Recommend removing the quote from the homepage too. The click interaction can be kept as a small About/footer detail if desired. Avoid requiring Spotify or other widget APIs for core portfolio content to render.

## Sequential PRs

| PR | Deliverable | Review checkpoint |
| --- | --- | --- |
| 1. Development workflow | Existing local review tab, startup/setup scripts, Orca worktree configuration, and these planning documents. No public portfolio redesign in this PR. | Verify development review, production exclusion, and setup in a fresh checkout before merging. |
| 2. Homepage and experience | Shared profile/experience data; corrected school term and StackAdapt dates; concise intro; compact experience; consistent spacing and text styles; remove map, quote, and large carousel from the main page. | Review the full homepage at phone and desktop widths. Confirm wording and information hierarchy before moving on. |
| 3. Curated projects | Audit ChatterBox, Schema-Validator, and termshare against their actual source and demos. Choose featured work; rewrite cards around problem, contribution, and evidence; consolidate the duplicate Work/Projects listings. | Confirm actual project status, working links, and which projects deserve prominence. Preserve existing project URLs or add redirects for renamed/retired routes. |
| 4. Short case studies | Consistent problem/build/decisions/results format; retain useful system diagrams; put repo/demo links near the top; support optional screenshots, GIFs, or videos. | Review one finished case study before applying the template to the rest. No invented metrics or claims. |
| 5. About and writing | A quieter About page with selected personal material. Add a lightweight writing structure only when real article content exists; separate engineering and personal topics. | Choose a photo and review the first article. Avoid an empty blog or placeholder posts. |

This is a substantial content and layout rework, but the existing React application can support it. A framework migration, new database, or CMS is not required by the current brief.

## PR workflow

1. Put the review/setup changes on their own feature branch and PR first, so subsequent worktrees inherit the development workflow.
2. After a PR is reviewed and merged, create the next branch/worktree from updated main. Keep dependent layout work sequential to avoid unnecessary conflicts.
3. Each PR should ship a working site and contain one complete, reviewable outcome. Keep code, content, and styles for that outcome together rather than splitting every file into its own PR.
4. Use the Orca preview to review the result before merging. Mark a review section applied only after its actual source change has been verified.
5. Keep pending content edits in the review tab and preserve approved decisions in repository documents so worktrees and future sessions have the same brief.

## Validation for each implementation PR

- Run TypeScript checks and the production build.
- Review mobile widths of 390px and 375px, desktop at 1200px, and intermediate widths; check wrapping, reading order, touch controls, and horizontal overflow.
- Check keyboard navigation, focus visibility, text contrast, and light/dark themes.
- Verify project, contact, social, and resume links and direct loading of routes affected by the PR.
- Ensure missing external widget services do not obscure the main content.
- Add focused behavior tests when changing meaningful behavior; the existing frontend and backend Jest commands currently find no tests. Do not describe those commands as passing test suites.

## Project evidence gathered so far

The repository list and READMEs were inspected as planning evidence, not a complete implementation audit.

- [termshare](https://github.com/Yash-Swaminathan/termshare) describes terminal sharing using Go, PTYs, WebSockets, and xterm.js. Its README already includes a demo GIF, so a new recording is not a prerequisite for featuring it.
- [Schema-Validator](https://github.com/Yash-Swaminathan/Schema-Validator) describes YAML/schema validation with FastAPI, PostgreSQL, React, and Docker, with cloud deployment links and an architecture diagram. Verify those deployments before presenting them as currently live.
- [ChatterBox](https://github.com/Yash-Swaminathan/ChatterBox) has a README with both aspirational messaging-platform language and an older partial-completion checklist. Inspect the current source and confirm actual working features before describing it as production-ready or fully implemented.

## Decisions that can wait

- The chosen photo, if any, and which personal interests appear on About.
- Whether the click interaction remains as a small optional detail.
- Additional internship accomplishments and their verified results.
- The first engineering/personal articles and any new demo videos.

These decisions do not block the workflow PR or the homepage cleanup.
