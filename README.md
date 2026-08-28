# Zeta Docs

This repository owns the public Zeta documentation and the website that renders it. Product source code and engineering architecture remain in [chogng/zeta](https://github.com/chogng/zeta).

## Repository layout

* `docs/` contains task-oriented Markdown articles and the explicit `toc.json` navigation.
* `app/`, `components/`, and `lib/` contain the documentation website.
* `build/` validates content, generates the site data, and tests rendered HTML.
* [`CONTRIBUTING.md`](CONTRIBUTING.md) describes the single-maintainer workflow for maintaining and publishing the site.

## Local development

Install Node.js 22.13 or later, then run:

```bash
corepack pnpm install
corepack pnpm dev
```

Open `http://localhost:3000`. The development command regenerates navigation and search data before starting the site.

## Maintenance and publishing

This is a single-maintainer repository. Work directly on `main`; pull requests are not required. Keep commits focused, run the verification suite before pushing, and use a short-lived branch only for risky or long-running work.

The source workflow and the production publishing workflow are separate. A push to `main` updates the source repository but does not by itself publish production. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the maintenance checklist, staging step, release tags, and publishing handoff.

## Validate a change

```bash
corepack pnpm check:docs
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
```

Or run the complete suite with:

```bash
corepack pnpm verify
```

Every published page must appear in `docs/toc.json` and include `ContentId`, `DateApproved`, and `MetaDescription` frontmatter. The checks reject unlisted pages, duplicate content IDs, broken local links, and missing article structure.

## Content ownership

Write for people using Zeta. Keep implementation contracts, crate responsibilities, migration plans, and internal architecture in the Zeta source repository. When product behavior changes, update the source implementation and this repository in the same change window without copying internal design documents into the public site.
