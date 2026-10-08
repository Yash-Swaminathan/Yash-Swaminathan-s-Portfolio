# Portfolio development

From the repository root:

```sh
npm run setup
npm run review
```

`setup` installs the frontend and backend dependencies from their lockfiles. Stop
an existing preview before rerunning setup. In a Git worktree, it copies missing
local environment files from the primary checkout
without replacing existing files or printing their contents. The frontend requires
`REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` in `frontend/.env`; the
backend uses the root `.env` for Supabase and Spotify configuration.

`review` starts both servers and prints a review URL to open in an Orca browser tab.
`npm run dev` starts the same servers for regular development. Ports are selected
per checkout, with a free-port fallback, and the frontend points at that checkout's
backend. Stop the runner with Ctrl+C.

## Review workflow

The development-only `/review` page groups the current portfolio into eight steps.
For each section, choose keep/simplify/move/remove, write requested changes and
optional replacement copy, and mark it ready to apply. Copy the section brief into
the agent chat to make the source changes. Review the live preview and then mark
the section applied. Switch between desktop and mobile previews as needed.

Notes are stored locally in the browser, scoped to the checkout. They do not modify
the public portfolio. Download all notes as Markdown to back them up or share them
with the agent. The review route and navigation link are absent in production.

The [rework plan](docs/portfolio-rework-plan.md) describes the proposed PR sequence.
The [review notes](docs/portfolio-review-notes.md) preserve the initial content brief.

## Orca worktree setup

`orca.yaml` supplies `node scripts/setup-worktree.cjs` as the worktree setup command.
`.worktreeinclude` asks Orca to copy the ignored environment files into new worktrees.
The setup script also handles copying them when run manually.

In Orca's repository hook settings, allow repo-defined setup commands and run setup
by default. If you use a local command override, set it to:

```sh
node scripts/setup-worktree.cjs
```

Then run `npm run review` in the new worktree. Configuration and scripts must be
present on the Git ref used to create it; uncommitted files in the main checkout do
not automatically appear in a fresh worktree.
