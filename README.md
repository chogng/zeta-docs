# Zeta Docs

This repository owns the public Zeta documentation and the website that renders it. Product source code and engineering architecture remain in [chogng/zeta](https://github.com/chogng/zeta).

## Repository layout

* `docs/` contains task-oriented Markdown articles and the explicit `toc.json` navigation.
* `app/`, `components/`, and `lib/` contain the documentation website.
* `build/` validates content, generates the site data, and tests rendered HTML.

## Local development

Install Node.js 22.13 or later, then run:

```bash
corepack pnpm install
corepack pnpm dev
```

Open `http://localhost:3000`. The development command regenerates navigation and search data before starting the site.

## Validate a change

```bash
corepack pnpm check:docs
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
```

Every published page must appear in `docs/toc.json` and include `ContentId`, `DateApproved`, and `MetaDescription` frontmatter. The checks reject unlisted pages, duplicate content IDs, broken local links, and missing article structure.

## Content ownership

Write for people using Zeta. Keep implementation contracts, crate responsibilities, migration plans, and internal architecture in the Zeta source repository. When product behavior changes, update the source implementation and this repository in the same change window without copying internal design documents into the public site.
