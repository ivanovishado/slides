---
name: Agent Console
description: A dark system-console theme for technical talks on AI agentic development, built on #01578C structural blue with a bright cyan agent-signal accent and CLI status semantics.
---

# Agent Console

## Palette

| Role    | Value     | Notes                                                  |
| ------- | --------- | ------------------------------------------------------ |
| bg      | `#0a141c` | deep blue-black ink, console background                |
| panel   | `#0f1e2c` | raised surface for cards / content panels              |
| code    | `#0d2b3e` | terminal-panel background, nested inside panels        |
| text    | `#e6edf3` | near-white primary copy                                |
| primary | `#01578C` | structural brand — left gutter, panel borders, rules   |
| accent  | `#22d3ee` | agent signal — eyebrow text, active marks, key numbers |
| muted   | `#7d93a8` | secondary copy, trace labels, dividers                 |
| success | `#3fb950` | CLI status: tool success / step done                   |
| warn    | `#d29922` | CLI status: thinking / rate-limited / retry            |
| error   | `#f85149` | CLI status: failure / blocked                          |

`primary` (`#01578C`) is the backbone; `accent` is the bright cousin that glows on top of it. The three status colors appear **only** as terminal-status semantics inside `TerminalPanel` traces — never as body copy or decoration.

## Typography

- Display font: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` — weight 800–900 for headlines.
- Body font: same as display — weight 400–500.
- Mono font: `ui-monospace, "SF Mono", "JetBrains Mono", "Fira Code", Menlo, Consolas, monospace` — weight 500–700 for eyebrow, footer, labels, and all code/trace content.
- Type-scale overrides (only what differs from `slide-authoring` defaults):
  - Hero title: 156 px (default 140–200 ✓)
  - Section heading: 84 px
  - Page heading: 64 px
  - Body text: 34 px (default 32–44 ✓)
  - Caption / label (mono): 22 px

## Layout

- Content padding: 112 px from canvas edges (1920 × 1080), footer reserved at 54 px from the bottom.
- Alignment: left-aligned, single editorial column; optional right-hand terminal/code panel on content pages.
- Grid notes: 12-column feel; body copy max-width ~960 px; terminal panels 520–720 px wide.
- Chrome: a 6 px `#01578C` left gutter running the full canvas height (the signature), a mono eyebrow with a `>` prompt, and terminal panels with a status dot. No top rule — the gutter carries the frame.

## Fixed components

These are paste-ready. Copy them verbatim into a slide that uses this theme.

### Title

```tsx
const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: 156,
      fontWeight: 900,
      lineHeight: 1.04,
      letterSpacing: '-0.015em',
      margin: 0,
      maxWidth: 1400,
      color: '#e6edf3',
    }}
  >
    {children}
  </h1>
);
```

### Footer

Pull the page number from `useSlidePageNumber()` — never hardcode `pageNum` / `total` props.

```tsx
import { useSlidePageNumber } from '@open-slide/core';

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 112,
        right: 112,
        bottom: 54,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'ui-monospace, "SF Mono", "JetBrains Mono", "Fira Code", Menlo, Consolas, monospace',
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: 1.4,
        color: '#7d93a8',
        textTransform: 'uppercase',
      }}
    >
      <span>AGENT-CONSOLE {'// 2026'}</span>
      <span style={{ color: '#22d3ee' }}>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};
```

### Eyebrow / accents

```tsx
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 16,
      fontFamily: 'ui-monospace, "SF Mono", "JetBrains Mono", "Fira Code", Menlo, Consolas, monospace',
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: 2.4,
      color: '#22d3ee',
      textTransform: 'uppercase',
    }}
  >
    <span style={{ color: '#01578C' }}>{'>'}</span>
    <span>{children}</span>
  </div>
);
```

### TerminalPanel (signature component)

The natural home for agent-loop traces, tool-call transcripts, and code snippets. The status dot defaults to "running" green; swap to `#d29922` (thinking) or `#f85149` (error) as the trace state changes.

```tsx
const TerminalPanel = ({
  title,
  status = '#3fb950',
  children,
}: {
  title: string;
  status?: string;
  children: React.ReactNode;
}) => (
  <div
    style={{
      background: '#0d2b3e',
      border: '2px solid #01578C',
      borderRadius: 10,
      padding: '32px 36px',
      fontFamily: 'ui-monospace, "SF Mono", "JetBrains Mono", "Fira Code", Menlo, Consolas, monospace',
      color: '#e6edf3',
      boxShadow: '0 0 0 1px rgba(2, 87, 140, 0.25), 18px 18px 0 rgba(2, 87, 140, 0.12)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
      <span style={{ width: 12, height: 12, borderRadius: 999, background: status }} />
      <span
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: '#7d93a8',
          letterSpacing: 1.6,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </span>
    </div>
    {children}
  </div>
);
```

## Motion

- Philosophy: **subtle** — the console frame holds steady; content rises in with small, product-grade motion. No animated gutters, no blinking panels, no theatrical reveals.
- Reusable keyframes (paste-ready):

```css
@keyframes fadeUpAgent {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Status dots inside `TerminalPanel` may pulse **only** when representing a live/running state; keep the pulse slow (1.4s, 60% opacity floor) and respect `prefers-reduced-motion`.

## Aesthetic

System console for agent development. A deep blue-black ink field carries `#01578C` as the structural brand — the left gutter, panel borders, and rules — while a bright cyan (`#22d3ee`) is the agent signal: the color of an active token, a running tool call, a live thought. Heavy sans-serif carries headlines and body; a monospace family carries the eyebrow, footer, labels, and every trace line. The signature is the `TerminalPanel` with a status dot — agent loops belong in terminals, not in decorative boxes. Status glyphs (`✓ • → !`) are CLI-conventional, not emoji. Avoid gradients, glassmorphism, neon overload, playful emoji, cartoon robot illustrations, and generic "AI sparkle" iconography — this is an engineering deck, not a marketing splash.

## Example usage

```tsx
const Cover: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: '#0a141c',
      color: '#e6edf3',
      padding: 112,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
    }}
  >
    <Eyebrow>Agentic systems</Eyebrow>
    <Title>Agents that ship</Title>
    <p style={{ fontSize: 34, lineHeight: 1.5, color: '#7d93a8', maxWidth: 960, margin: '32px 0 0' }}>
      A practical architecture for AI that perceives, reasons, and acts — without losing the plot.
    </p>
    <Footer />
  </div>
);
```
