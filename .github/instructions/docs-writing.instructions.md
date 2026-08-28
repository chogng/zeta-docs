---
applyTo: "docs/**/*.md"
---
# Documentation writing instructions

## Audience and scope

* Write for people using Zeta, not for people implementing its internals.
* Organize articles around a task, question, or user-visible concept.
* Keep crate maps, private types, migration plans, and architecture decisions in the Zeta source repository.
* Describe current behavior. Label incomplete or preview behavior explicitly.

## Style

* Get to the point in the first paragraph.
* Talk directly to the reader with short, active sentences.
* Use present tense and direct commands.
* Use UI labels in bold and commands, settings, file names, and identifiers in code style.
* Use numbered lists for procedures and bullet lists for unordered choices.
* Use tables only when readers need to compare the same fields across several options.
* End with links to the next useful articles when they exist.

## Page contract

* Add YAML frontmatter with unique `ContentId`, `DateApproved`, `MetaDescription`, and useful `Keywords`.
* Use one H1 that matches the user-facing page title.
* Follow the H1 with a direct introductory paragraph.
* Use H2 and H3 headings to make the article scannable.
* Use `/docs/<path>.md` links for other articles in this repository.
* Add every published page to `docs/toc.json`. Do not publish empty or placeholder pages.

## Verification

Run `corepack pnpm check:docs` after content changes. Run `corepack pnpm test` when navigation, Markdown rendering, or the website changes.
