---
name: UdeG GDG
description: A ceremonial tech theme blending Universidad de Guadalajara official blue, red, olive, and yellow with GDG's Google-color developer accents.
---

# UdeG GDG

## Palette

| Role       | Value     | Notes                                      |
| ---------- | --------- | ------------------------------------------ |
| bg         | `#202945` | UdeG blue, Pantone 288 C                   |
| text       | `#ffffff` | primary copy on the official blue field    |
| accent     | `#FDCF85` | UdeG yellow, Pantone 116 C                 |
| muted      | `#d8dee9` | functional blue tint for secondary copy    |
| panel      | `#17213a` | darker blue surface derived from bg        |
| crestRed   | `#B12028` | UdeG red, Pantone 7621 C                   |
| olive      | `#8F993E` | UdeG olive, Pantone 7495 C                 |
| gdgBlue    | `#4285f4` | GDG accent segment                         |
| gdgGreen   | `#0f9d58` | GDG accent segment                         |
| gdgYellow  | `#fbbc04` | GDG accent segment, distinct from UdeG yellow |
| gdgRed     | `#ea4335` | GDG accent segment                         |
| ink        | `#000000` | UdeG K100 / inverse text                   |
| gray       | `#404041` | UdeG K85 gray for light surfaces           |

## Typography

- Display font: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` - weight 850-900 for headlines.
- Body font: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` - weight 400-500.
- Type-scale overrides:
  - Hero title: 152 px (default 140-200)
  - Section heading: 92 px
  - Page heading: 76 px
  - Body text: 36 px
  - Caption / label: 24 px

## Layout

- Content padding: 112 px from canvas edges (1920 x 1080), with footer reserved at 60 px from the bottom.
- Alignment: left-aligned and ceremonial, with one strong title column and one visual system column when needed.
- Grid notes: use a 12-column feel with broad gutters; keep body copy to 900-1050 px max width.
- Chrome: use thin official-yellow rules, deep blue panels, red institutional blocks, olive secondary marks, and short GDG color bars as code-chevron motifs.

## Fixed components

These are paste-ready. Copy them verbatim into a slide that uses this theme.

### Title

```tsx
const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: 152,
      fontWeight: 900,
      lineHeight: 1.02,
      letterSpacing: 0,
      margin: 0,
      maxWidth: 1320,
      color: '#ffffff',
    }}
  >
    {children}
  </h1>
);
```

### Footer

Pull the page number from `useSlidePageNumber()` - never hardcode `pageNum` / `total` props.

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
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: 24,
        fontWeight: 700,
        letterSpacing: 1.6,
        color: '#d8dee9',
        textTransform: 'uppercase',
      }}
    >
      <span>UdeG x GDG</span>
      <span style={{ color: '#FDCF85' }}>{String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
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
      gap: 14,
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: 24,
      fontWeight: 800,
      letterSpacing: 3.6,
      color: '#FDCF85',
      textTransform: 'uppercase',
    }}
  >
    <span style={{ width: 72, height: 8, background: '#4285f4', borderRadius: 999 }} />
    <span>{children}</span>
  </div>
);
```

## Motion

- Philosophy: subtle - hold the institutional frame steady and let content rise in with small, product-grade motion.
- Reusable keyframes:

```css
@keyframes fadeUpUdeg {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

## Aesthetic

Ceremonial tech: a university crest translated into a developer event deck. The base should feel formal, dark, and confident through the official UdeG blue field, yellow rules, olive secondary marks, and occasional institutional-red blocks; GDG appears as clean geometric bars, code-chevron references, and four-color accents rather than as a playful full takeover. Avoid gradients, busy logo collages, cartoon icons, emoji, and generic tech-blue dominance.

## Example usage

```tsx
const Cover: Page = () => (
  <div style={{ width: '100%', height: '100%', background: '#202945', color: '#ffffff', padding: 112, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
    <Eyebrow>Developer community</Eyebrow>
    <Title>UdeG meets GDG</Title>
    <p style={{ fontSize: 36, lineHeight: 1.5, color: '#d8dee9', maxWidth: 980, marginTop: 34, marginBottom: 0 }}>
      A formal academic frame with sharp Google Developer Groups color accents.
    </p>
    <Footer />
  </div>
);
```
