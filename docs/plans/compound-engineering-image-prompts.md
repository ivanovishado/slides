# Image Generation Prompts — Compound Engineering Deck

Detailed prompts for the 4 illustrations needed in `slides/compound-engineering/index.tsx`. Slide 2 (speaker intro) uses an existing photo — no generation required.

## Visual direction

All images share the **agent-console** theme palette and a serious technical editorial style. They sit on a dark slide background, so they should be dark, high-contrast, and cinematic — not bright marketing splashes.

| Role    | Hex       | Usage in images                                         |
| ------- | --------- | ------------------------------------------------------ |
| bg      | `#0a141c` | dark navy-black background — images blend with this    |
| primary | `#01578C` | deep ocean blue — structural elements, borders, frames |
| accent  | `#22d3ee` | bright cyan — glowing/active elements, energy flow     |
| muted   | `#7d93a8` | slate gray — secondary/de-emphasized fragments         |

**Style keywords (all images):** serious technical editorial, cinematic, high-contrast, precise, engineering keynote, dark mode, geometric, artifact-driven.

**Shared negative prompt (append to every generation):**

> no cartoon characters, no cute robots, no mascot illustrations, no mystical AI glow, no magical sparkles, no brain-with-lightbulb cliché, no neural network spaghetti backgrounds, no generic tech stock photography, no server rooms, no glowing globes, no 3D plastic render, no gradient mesh backgrounds, no readable text, no watermarks, no people, no stock photo humans

---

## Slide 1 — Cover (560 × 460, aspect ~5:4)

**Placeholder hint:** "Ilustración técnica cinematográfica: fragmentos de prompt desechables a la izquierda transformándose en un flywheel de ingeniería estructurado a la derecha."

**Prompt:**

> Cinematic technical illustration for an engineering conference keynote. Split composition. On the left half: scattered translucent text fragments, chat bubbles, and prompt snippets dissolving and fading into darkness — representing disposable, ephemeral AI interactions evaporating. On the right half: a luminous structured flywheel made of geometric engineering artifacts — code blocks, test files, documentation pages, review checkmarks, and decision records — arranged in a circular mechanical system with clean connecting arcs, implying persistent rotation and durable memory. A directional flow of small light particles moves from left to right, from the fading fragments into the solid flywheel, showing transformation from ephemeral to durable. Dark navy-black background (#0a141c). Flywheel structure and connecting arcs in deep ocean blue (#01578C). Active nodes, particle flow, and glow accents in bright cyan (#22d3ee). Fading fragments on the left lit with faint slate gray (#7d93a8). Serious, precise, high-contrast editorial technical illustration. No cartoon style, no cute robots, no magical AI glow, no neural network spaghetti, no generic stock tech imagery. Feel of a premium engineering keynote, not a marketing splash. --ar 5:4

**Aspect ratio:** `--ar 5:4` (Midjourney) or `560x460` (DALL-E / Flux).

---

## Slide 2 — Speaker Intro (400 × 400)

**No generation needed.** Uses the existing photo at `slides/streamlit-workshop/assets/ivan.jpeg`.

To wire it into the slide, replace the `ImagePlaceholder` on slide 2 with:

```tsx
import ivan from '../../streamlit-workshop/assets/ivan.jpeg';
// ...
<img src={ivan} style={{ width: 400, height: 400, objectFit: 'cover', borderRadius: 10 }} />
```

Or use the inspector's "Replace…" feature on the placeholder.

---

## Slide 4 — Disposable Prompts Create Context Debt (480 × 440, aspect ~1:1)

**Placeholder hint:** "Notas adhesivas y fragmentos de chat dispersos fuera de un repositorio limpio y organizado."

**Prompt:**

> Technical illustration on a dark navy-black background (#0a141c). A clean, organized repository boundary on the right side — represented as a structured grid of file icons, code blocks, and folder shapes neatly arranged within a glowing deep ocean blue (#01578C) rectangular border. Everything inside the border is orderly and indexed. Outside the boundary, on the left side and spilling into the foreground: scattered sticky notes, chat message fragments, half-written requirement lines, faded prompt text blocks, and decision scraps floating in disorganized, drifting clusters — unindexed, fragile, visibly decaying. The visual contrast between the organized repo interior and the chaotic context debris outside is stark and intentional. Repository frame and internal structure in deep ocean blue (#01578C). The scattered fragments outside lit with faint cyan (#22d3ee) glow to suggest lost, inaccessible information. Dark, serious, high-contrast technical editorial style. No cartoon style, no playful icons, no generic tech stock imagery, no readable text. --ar 1:1

**Aspect ratio:** `--ar 1:1` or `480x440`.

---

## Slide 7 — A Familiar Idea: The Second Brain (480 × 440, aspect ~1:1)

**Placeholder hint:** "Notas personales, highlights y diagramas expandiéndose en un grafo de conocimiento estructurado."

**Prompt:**

> Cinematic technical illustration on a dark navy-black background (#0a141c). On the left: a stack of personal notebooks, highlighted text fragments, and small hand-drawn diagram sketches — analog knowledge capture. These expand rightward and progressively transform into a structured, interconnected knowledge graph: clean circular nodes connected by straight lines forming an organized, hierarchical network. The graph nodes resemble engineering artifacts — document icons, decision records, pattern cards, solution notes — not abstract bubbles. The transformation from scattered analog notes on the left to a precise digital structured graph on the right should feel like knowledge becoming systematized and retrievable. Graph nodes, connecting lines, and structural elements in deep ocean blue (#01578C). Active nodes, highlight markers, and transformation energy in bright cyan (#22d3ee). Analog notebook elements in muted slate gray (#7d93a8). Serious, precise, high-contrast technical editorial style. No cartoon doodles, no playful mind-map bubbles, no generic AI brain imagery, no floating gears, no lightbulb cliché. --ar 1:1

**Aspect ratio:** `--ar 1:1` or `480x440`.

---

## Slide 17 — Compound: Reinvest the Learning (460 × 440, aspect ~1:1)

**Placeholder hint:** "Insights depositándose en un almacén de memoria o bóveda que alimenta visiblemente la siguiente tarea de ingeniería."

**Prompt:**

> Technical illustration on a dark navy-black background (#0a141c). Center: a structured memory vault — an architectural archive with labeled shelves and compartments holding geometric engineering artifacts: test files, decision records, pattern documents, and solution notes, each a small clean icon. From above, glowing insight particles and decision fragments stream downward into the vault, being absorbed and organized onto the shelves. From the right side of the vault, a stream of structured energy flows outward toward an abstract engineering task indicator on the far right — a terminal prompt or code branch symbol. The vault visibly stores learning and powers the next task. Vault structure, shelves, and compartment borders in deep ocean blue (#01578C). Incoming insight particles, outgoing energy stream, and active artifacts in bright cyan (#22d3ee). Vault interior in darker shade (#0f1e2c). Serious, mechanical, durable, high-contrast technical editorial style. No cartoon treasure chest, no magical glow, no generic data center stock photography, no floating gears. --ar 1:1

**Aspect ratio:** `--ar 1:1` or `460x440`.

---

## Generation notes

- **Tool-agnostic:** The prompts above work with Midjourney (append `--ar` flags), DALL-E 3 (specify pixel dimensions), Flux, or Stable Diffusion. If using Midjourney, add `--style raw --v 6` for a less painterly, more photographic/technical look.
- **Background matching:** All images use `#0a141c` as the base background. If the generation tool produces a slightly different dark, that's fine — the slide's `Frame` component provides the actual `#0a141c` background behind the image, so a close-enough dark blend reads correctly.
- **No text:** All prompts explicitly avoid readable text. If the model generates garbled text, reroll or use the "no text" negative prompt more aggressively. Faux code/terminal glyphs (unreadable squiggles that look like code) are acceptable.
- **Color accuracy:** If the model struggles with exact hex values, generate with the closest dark-blue + cyan palette and adjust hue/saturation in post. The key is: dark background, blue structural elements, cyan active/glowing elements.
- **Post-processing:** If an image has a visible border or frame, crop it to the placeholder dimensions. The slide's `ImagePlaceholder` slots are fixed pixel sizes.
