---
name: import-slides-artifact
description: Port a Claude Slides artifact (a claude.ai/artifact/... or claude.ai/code/artifact/... deck made from the Slides type) into this open-slide repo as slides/<id>/index.tsx so it can be deployed to ivanovishado.dev with pixel-faithful visuals. Use whenever the user wants to move, copy, publish, deploy, self-host, or "pasar" a Claude artifact deck to their repo or domain, wants a deck viewable without a Claude account, or asks to keep the artifact and the site in sync — even if they don't say "import" or "artifact".
---

# Import a Claude Slides artifact into open-slide

A Slides artifact stores each slide as one `<section>` of inline-styled HTML on a 1920×1080 canvas (`project/slides/<id>.html`, ordered by `project/deck.json`). open-slide renders React pages on the same canvas. The two are close enough that a mechanical conversion keeps the look exactly, so **convert, don't redesign**: the user approved the artifact as it is.

`scripts/convert_artifact.py` does the conversion. Your job is to export the artifact, run the script, fix what it warns about, verify visually, and update the QR codes.

## 1. Export the artifact (outside the repo)

Put the export in the scratchpad, not in the repo. A raw export inside the repo breaks `biome lint` in CI, and the artifact's own version history is already the backup.

1. `Artifact` `read` with `path: "project/deck.json"` to get `order`, `title`, and `faces`.
2. In one call, `read` with `paths`: every `project/slides/<id>.html` from `order`, plus `out_dir: <scratch>/export`. The result says which slides were edited by hand; the export holds the current version, so the user's edits come along.
3. Assets: `list` with `scope: "assets"`, then read each asset with a single `path: "<asset-id>"` (asset ids don't work inside `paths`). Save each one as `<scratch>/export/assets/<asset-id>.<ext>`. If an asset read fails but the user has the original locally, copy it there and confirm its sha256 matches the listing (`shasum -a 256`).

## 2. Convert

Pick a short kebab-case id; it becomes the URL `https://www.ivanovishado.dev/slides/s/<id>`. Ask the user if it isn't obvious. Optionally write a names file so assets get readable filenames:

```json
{"951cf575...": "speaker.jpeg", "f8bf4e26...": "bus-factor.png"}
```

```bash
python3 -I .agents/skills/import-slides-artifact/scripts/convert_artifact.py \
  --export <scratch>/export --repo . --slide-id <id> \
  --source-url <artifact-url> [--asset-names <scratch>/names.json]
pnpm exec biome format --write slides/<id>
pnpm typecheck && pnpm lint && pnpm build
```

The script writes `slides/<id>/index.tsx` and `slides/<id>/assets/`, sets `meta.createdAt` to now, and refuses to overwrite an existing slide. Read every `WARNING:` line; each one is something it could not reproduce exactly (icons, video, crops, uploaded fonts, hidden slides). Fix those by hand in the generated file, or tell the user what was left out.

### What the script reproduces, and why

Knowing this helps when you have to fix something by hand:

- **Element defaults.** The artifact runtime has defaults that CSS lacks: a `div` without `display` is a flex column, `h1`/`h2`/`h3`/`p` default to 96/64/44/32px, there are no margins, and boxes use border-box. `BASE_CSS`, scoped to `.osa`, recreates them.
- **Paint order.** In the artifact, a pinned backdrop listed *before* the flow content (an `<x-embed>`, an image, a scrim) paints *behind* it. In plain CSS, every `position:absolute` box paints above flow content, which hides the text. The script fixes this by giving the section's flow children `position:relative`. If text vanishes behind something, this is the first thing to check.
- **`<x-embed>`** becomes a sandboxed `<iframe srcDoc>` with the same box. Inside the editor pane it can take several seconds to appear; that's load time, not a bug.
- **`<x-shape>` and `<x-connector>`** become the `Shape` and `Connector` components: arrows, diamonds and ellipses, plus straight, elbow, hv and vh routes with heads.
- **`data-build-in`** becomes `<Steps><Step>`. The Step wrapper is pinned with `inset:0`, so the pinned child keeps its coordinates and adds no flow gap.
- **`data-transition="magic"`.** An element whose `id` repeats across slides (for example a progress bar) becomes `SharedElement`, and the deck gets a quiet dissolve transition plus `sharedElements`.
- **`<aside>` speaker notes** become `export const notes`.
- **Fonts.** Google Fonts from `deck.json` `faces` are injected once in `<head>`. Uploaded font files are not handled; the script warns about them.

## 3. Verify visually

The conversion can be right on paper and wrong on screen, so look at every slide.

- Start the dev server through `.claude/launch.json`. The desktop launcher may not have `node` on PATH, and `open-slide dev` can stop at an interactive skills-drift prompt. Point `runtimeExecutable` at the absolute `node` binary (`which node`) and run `node_modules/@open-slide/core/dist/cli/bin.js dev --port <p> --no-skills-check`. If `preview_start` still can't reach it, start that command in the background from Bash and add an attach-only configuration (`"url": "http://localhost:<p>"`).
- Open `/slides/s/<id>`, set the viewport to 1920×1080, press `f` for present mode, and step through with ArrowRight. Slides with build-ins need one extra press. Wait about a second after each key, because a press during a transition can skip a slide.
- Compare against the artifact. Check text that disappeared (paint order), arrows, connectors, embeds and QR codes. Reset the viewport when you're done.

## 4. QR codes

The talk's outro usually has a QR code for "the presentation". Once the deck lives on the domain, point that code at `https://www.ivanovishado.dev/slides/s/<id>`. Generate it in a throwaway venv in the scratchpad, since the repo allows no new dependencies:

```bash
python3 -m venv <scratch>/qrenv && <scratch>/qrenv/bin/pip install -q segno
<scratch>/qrenv/bin/python -I -c "import segno,sys; segno.make(sys.argv[1], error='m').save(sys.argv[2], scale=30, border=2)" \
  https://www.ivanovishado.dev/slides/s/<id> slides/<id>/assets/<qr-file>.png
```

Look at the PNG before using it. Also offer to swap the same QR into the artifact (upload it as an asset, then edit the outro slide's `src`), so the artifact and the site stay the same.

## 5. Publish

Committing and pushing to `main` deploys to GitHub Pages (`.github/workflows/deploy-pages.yml`), so ask before you push. Leave `.claude/launch.json` out of the commit, since it holds machine-specific paths. After the push, follow the run with `gh run watch <id> --exit-status`, then open the URL in the browser.

Deep links return HTTP 404 even when they work: the site is a SPA served through GitHub Pages' `404.html` fallback, so check that the page renders rather than checking the status code.

Later edits to the artifact don't reach the site on their own. To resync, export again and regenerate: remove `slides/<id>/` first, because the script won't overwrite, and redo the QR swap.
