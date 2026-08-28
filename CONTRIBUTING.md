# Contributing to Zeta Docs

## Repository model

This repository is maintained by one developer. `main` is the working branch, so normal documentation changes can be made and committed directly on `main`. Pull requests are not required.

The public documentation source lives in `docs/`. The website implementation lives in `app/`, `components/`, and `lib/`. Product implementation and internal engineering contracts remain in the Zeta source repository.

Do not commit generated or local runtime directories such as `.build/`, `dist/`, or `.wrangler/`.

## Maintain an article

Use lowercase file and directory names with dashes, for example `docs/customize/agent-tools.md`.

Every article must have the required frontmatter:

```yaml
---
ContentId: <unique UUID>
DateApproved: 8/27/2026
MetaDescription: <description no longer than 160 characters>
Keywords:
  - Zeta
  - Agent
---
# Article title

Introductory paragraph.

## Main section
```

Keep one H1 per article, put an introductory paragraph directly after it, and use H2 headings for the main sections. Update `DateApproved` when the article receives a substantial review or content update.

Add every article to `docs/toc.json`. The TOC entry controls whether the article is published and determines its position in the navigation. Use `/docs/...md` for links between documentation articles.

When product behavior changes, update the product source and the corresponding documentation in the same change window. Do not move a published article casually. This repository does not yet provide a redirect registry or a sitemap, so URL changes need an explicit redirect implementation before they are made.

## Direct-main workflow

1. Synchronize the working branch:

   ```bash
   git switch main
   git pull --ff-only origin main
   ```

2. Edit the Markdown article and update `docs/toc.json` when navigation changes.

3. Preview the site locally:

   ```bash
   corepack pnpm dev
   ```

   Open `http://localhost:3000` and check the article, navigation, links, search, and responsive layout.

4. Run the complete verification suite:

   ```bash
   corepack pnpm verify
   ```

5. Commit the focused change directly on `main`:

   ```bash
   git add docs/ docs/toc.json
   git commit -m "docs: update agent tools guide"
   git push origin main
   ```

Use a short-lived branch when a change is risky or needs to remain unpublished for a long time. The branch does not need to result in a pull request.

## Publish a release

Publishing is a separate, manual step. Pushing `main` does not automatically publish production.

1. Start from the latest `main` and run `corepack pnpm verify`.

2. Create the production build:

   ```bash
   corepack pnpm build
   ```

   The build regenerates the documentation data and writes the deployable site to `dist/`.

3. Publish the build to the configured staging environment and verify the rendered pages, navigation, search, links, and metadata.

4. After staging passes, tag the exact commit that is ready for production:

   ```bash
   git tag -a docs-release-YYYY-MM-DD -m "Publish docs YYYY-MM-DD"
   git push origin main --follow-tags
   ```

5. Manually promote the same build to production and run a smoke test against the public URL.

The repository carries the Sites project handoff in `.openai/hosting.json`, but it does not currently contain a `deploy` script or a production publishing workflow. Use the configured Sites publisher for this project rather than assuming that `wrangler deploy` or `git push` publishes the site.

To roll back, redeploy a previously tagged build after confirming the tag and the corresponding `dist/` artifact.
