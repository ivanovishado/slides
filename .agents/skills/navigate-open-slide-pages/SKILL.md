---
name: navigate-open-slide-pages
description: Guide agents working with open-slide decks to jump directly to a specific slide/page number using the viewer URL query parameter `?p=x`. Use when asked to open, show, inspect, screenshot, validate, or navigate to a specific page in an open-slide presentation.
---

# Navigate Open-Slide Pages

## Core Rule

Use the open-slide viewer query parameter `?p=x` to jump directly to a page.

- `x` is the visible page number shown in the deck footer and notes panel.
- Page numbers are 1-based, not 0-based.
- Do not step through pages with repeated next/previous navigation when the target page is known.
- This guidance is tool-independent: apply it with whatever browser, shell, or app navigation mechanism is available.

## URL Pattern

For a deck whose slide id is `<slide-id>`:

```text
/s/<slide-id>?p=<page-number>
```

Examples:

```text
http://127.0.0.1:5173/s/compound-engineering?p=7
http://localhost:5173/s/team-roadmap?p=12
```

If already viewing a deck, preserve the current origin and deck path, then set or replace the `p` query parameter.

## Resolve the Slide Id

Derive the slide id from the folder under `slides/`:

```text
slides/compound-engineering/index.tsx -> /s/compound-engineering
slides/team-roadmap/index.tsx -> /s/team-roadmap
```

If the current URL is already an open-slide deck route, prefer updating that route instead of reconstructing it.

## Validation

After navigating, confirm that the visible page indicator matches the requested page, for example `07 / 22` or `Notes page 7/22`.

If the requested page does not appear, check whether the deck has fewer pages than requested or whether the URL points to the wrong slide id.
