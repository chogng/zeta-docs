# Zeta Docs

This repository owns the public Zeta documentation and the lightweight site that previews it. Product source code and engineering architecture remain in [chogng/zeta](https://github.com/chogng/zeta).

## Repository layout

* `docs/` contains task-oriented Markdown articles and the explicit `toc.json` navigation.
* `index.html` configures the Docsify browser-side Markdown renderer.
* `build/` contains the Docsify navigation generator and Zeta-specific validation and publishing helpers.
* [`CONTRIBUTING.md`](CONTRIBUTING.md) describes the single-maintainer workflow for maintaining and publishing the site.

## Local development

Install Node.js 22.13 or later, then run:

```bash
npm install
npm run serve
```

Open `http://localhost:3000`. Like `vscode-docs`, the serve command generates the sidebar and then starts Docsify directly from the repository root.

## Maintenance and publishing

This is a single-maintainer repository. Work directly on `main`; pull requests are not required. Keep commits focused, run the verification suite before pushing, and use a short-lived branch only for risky or long-running work.

The source workflow and the production publishing workflow are separate. A push to `main` updates the source repository but does not by itself publish production. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the maintenance checklist, staging step, release tags, and publishing handoff.

## Validate a change

```bash
npm run check-docs
npm run lint
npm test
```

Or run the complete suite with:

```bash
npm run verify
```

Every published page must appear in `docs/toc.json` and include `ContentId`, `DateApproved`, and `MetaDescription` frontmatter. The checks reject unlisted pages, duplicate content IDs, broken local links, and missing article structure. Docsify strips the frontmatter in the browser before rendering the article.

## Content ownership

Write for people using Zeta. Keep implementation contracts, crate responsibilities, migration plans, and internal architecture in the Zeta source repository. When product behavior changes, update the source implementation and this repository in the same change window without copying internal design documents into the public site.
