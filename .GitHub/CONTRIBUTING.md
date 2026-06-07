# Contributing to VexaNode

Thanks for taking the time to contribute. All contributions are welcome — bug fixes, new features, UI improvements, documentation, and ideas.

---

## Getting Started

### 1. Fork and clone the repository

```bash
git clone https://github.com/<your-username>/VexaNode.git
cd VexaNode
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your Supabase, NextAuth, and OAuth credentials. See the [README](./README.md) for the full reference.

### 3. Initialize the database

Run `setup_database.sql` in your Supabase project's SQL Editor.

### 4. Start the dev server

```bash
npm run dev
```

---

## Making Changes

- Create a new branch for every change:
  ```bash
  git checkout -b feat/your-feature-name
  ```
- Keep commits focused and use conventional commit messages:
  - `feat: add payment method toggle`
  - `fix: resolve ticket reply auth error`
  - `docs: update environment variable reference`
  - `refactor: clean up admin data fetching`

---

## Submitting a Pull Request

1. Push your branch to your fork
2. Open a pull request against `main`
3. Fill out the PR template completely
4. Link any related issues using `Closes #<issue-number>`

PRs will be reviewed as soon as possible. Feedback will be given as inline comments — please address them before the PR can be merged.

---

## Code Style

- TypeScript is enforced across the codebase — no `any` unless absolutely necessary
- Follow the existing file and folder structure under `app/`
- No inline comments in code
- No emojis in UI labels or log output
- Run `npm run build` before submitting to ensure no type errors or build failures

---

## Reporting Bugs

Open an issue using the **Bug Report** template. Include reproduction steps, environment details, and any relevant logs or screenshots.

## Suggesting Features

Open an issue using the **Feature Request** template. Describe the problem it solves and your proposed approach.

---

## Need Help?

Join the [VexaNode Discord](https://discord.gg/vexanode) for setup questions or general discussion.
