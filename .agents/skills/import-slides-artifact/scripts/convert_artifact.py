#!/usr/bin/env python3
"""Convert a Claude Slides artifact export into an open-slide deck (slides/<id>/index.tsx + assets/).

Export layout (what `Artifact read` saves):
    <export>/project/deck.json
    <export>/project/slides/<slide-id>.html     one <section> per file
    <export>/assets/<blob-id>.<ext>             images the slides reference as /_blob/<blob-id>

Usage:
    python3 -I convert_artifact.py --export <dir> --repo <repo-root> --slide-id <kebab-id> [--source-url <artifact-url>]

Standard library only. Prints warnings for anything it could not reproduce exactly.
"""
import argparse
import json
import re
import shutil
import sys
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

VOID = {'img', 'br', 'hr'}
SVG_LEAF = {'polygon', 'circle', 'line', 'path', 'polyline', 'rect', 'ellipse', 'stop', 'use'}
# html.parser lowercases names; React needs the SVG camelCase spellings back.
SVG_TAGS = {t.lower(): t for t in (
    'linearGradient', 'radialGradient', 'clipPath', 'textPath', 'feGaussianBlur', 'feOffset',
    'feMerge', 'feMergeNode', 'feColorMatrix', 'feBlend', 'feFlood', 'feComposite')}
SVG_ATTRS = {a.lower(): a for a in (
    'viewBox', 'preserveAspectRatio', 'gradientUnits', 'gradientTransform', 'patternUnits',
    'patternTransform', 'stdDeviation', 'markerWidth', 'markerHeight', 'refX', 'refY',
    'pathLength', 'clipPathUnits', 'spreadMethod', 'startOffset', 'textLength', 'filterUnits')}

warnings = []


def warn(msg):
    warnings.append(msg)


def camel(prop):
    if prop.startswith('-webkit-'):
        prop = 'Webkit-' + prop[len('-webkit-'):]
    parts = prop.split('-')
    return parts[0] + ''.join(p[:1].upper() + p[1:] for p in parts[1:])


def parse_style(css):
    out = {}
    for decl in css.split(';'):
        if ':' in decl:
            k, v = decl.split(':', 1)
            if k.strip():
                out[k.strip().lower()] = v.strip()
    return out


def style_obj(css):
    items = [f'{camel(k)}: {json.dumps(v, ensure_ascii=False)}' for k, v in parse_style(css).items()]
    return '{{ ' + ', '.join(items) + ' }}'


def num(v, default=0.0):
    try:
        return float(str(v).replace('px', '').strip())
    except ValueError:
        return default


def pascal(slide_id):
    name = ''.join(p.capitalize() for p in re.split(r'[^A-Za-z0-9]+', slide_id) if p)
    if not name or name[0].isdigit():
        name = 'P' + name
    return name + 'Slide'


class Converter(HTMLParser):
    def __init__(self, slide_id, assets, embeds, shared_ids):
        super().__init__(convert_charrefs=True)
        self.slide_id = slide_id
        self.assets = assets
        self.embeds = embeds
        self.shared_ids = shared_ids
        self.out = []
        self.stack = []  # (tag, closing markup, in_svg)
        self.notes = ''
        self.in_aside = False
        self.hidden = False

    def emit(self, s):
        self.out.append(s)

    def in_svg(self):
        return any(t[2] for t in self.stack)

    def parent(self):
        return self.stack[-1][0] if self.stack else None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if self.in_aside:
            return
        if tag == 'aside':
            self.in_aside = True
            return
        if tag == 'section':
            self.hidden = 'hidden' in a
            self.emit(f'<div className="osa" style={style_obj(a.get("style", ""))}>')
            self.stack.append((tag, '</div>', False))
            return
        if tag == 'x-embed':
            st = parse_style(a.get('style', ''))
            box = {k: st[k] for k in ('left', 'top', 'right', 'bottom', 'width', 'height') if k in st}
            self.emit(f'<Embed html={{{self.embeds[a["data-embed"]]}}} box={{{json.dumps(box)}}} />')
            self.stack.append((tag, '', False))
            return
        if tag == 'x-shape':
            st = parse_style(a.get('style', ''))
            rest = {k: v for k, v in st.items() if k not in ('background', 'width', 'height', 'border')}
            if rest:
                warn(f'{self.slide_id}: x-shape style ignored: {rest}')
            self.emit(
                f'<Shape kind="{a.get("kind", "rect")}" color="{st.get("background", "transparent")}" '
                f'width={{{int(num(st.get("width"), 100))}}} height={{{int(num(st.get("height"), 100))}}} />'
            )
            self.stack.append((tag, '', False))
            return
        if tag == 'x-connector':
            st = parse_style(a.get('style', ''))
            if not all(k in a for k in ('x1', 'y1', 'x2', 'y2')):
                warn(f'{self.slide_id}: flow x-connector without coordinates skipped')
            else:
                self.emit(
                    f'<Connector x1={{{num(a["x1"])}}} y1={{{num(a["y1"])}}} x2={{{num(a["x2"])}}} y2={{{num(a["y2"])}}} '
                    f'route="{a.get("route", "straight")}" head="{a.get("head", "end")}" '
                    f'color="{st.get("color", "#000")}" stroke={{{num(st.get("border-width"), 2)}}} '
                    f'dashed={{{"true" if "dash" in st.get("border-style", "") else "false"}}} />'
                )
            self.stack.append((tag, '', False))
            return
        if tag == 'x-icon':
            warn(f'{self.slide_id}: x-icon "{a.get("name")}" has no open-slide equivalent; replaced by an empty box')
            st = a.get('style', '')
            self.emit(f'<span style={style_obj(st)} />')
            self.stack.append((tag, '', False))
            return
        if tag == 'tr' and self.parent() == 'table':
            # React builds the DOM directly, so the <tbody> the HTML parser would add must be explicit.
            self.emit('<tbody>')
            self.stack.append(('tbody', '</tbody>', False))
        if tag == 'img' and 'data-video' in a:
            warn(f'{self.slide_id}: video clip not ported; the still image is shown instead')
        if 'data-crop' in a:
            warn(f'{self.slide_id}: image crop (data-crop) not ported')

        svg = tag == 'svg' or self.in_svg()
        jsx_tag = SVG_TAGS.get(tag, tag) if svg else tag
        style = a.get('style', '')
        pinned = 'position:absolute' in style.replace(' ', '')
        # The artifact paints flow content in source order together with pinned layers; plain CSS
        # paints every positioned box above flow content. Making the section's flow children
        # position:relative restores source-order painting (a backdrop listed first stays behind).
        if self.parent() == 'section' and not pinned and 'position' not in style:
            style = 'position:relative;' + style

        pre, post = '', ''
        el_id = a.get('id')
        if el_id and el_id in self.shared_ids:
            pre, post = f'<SharedElement id="{el_id}">', '</SharedElement>'
        if 'data-build-in' in a:
            if not pinned:
                warn(f'{self.slide_id}: data-build-in on a flow element; revealed with a step but layout may shift')
            pre, post = '<Steps><Step duration={360}>' + pre, post + '</Step></Steps>'

        parts = [jsx_tag]
        for k, v in attrs:
            if k in ('id', 'class', 'hidden') or k.startswith('data-'):
                continue
            if k == 'style':
                if style:
                    parts.append(f'style={style_obj(style)}')
            elif k == 'src' and tag == 'img':
                if v in self.assets:
                    parts.append(f'src={{{self.assets[v]}}}')
                else:
                    warn(f'{self.slide_id}: image {v} not found in export assets')
                    parts.append(f'src={json.dumps(v)}')
            elif svg and k in SVG_ATTRS:
                parts.append(f'{SVG_ATTRS[k]}={json.dumps(v)}')
            elif svg and ('-' in k or ':' in k) and not k.startswith('aria-'):
                parts.append(f'{camel(k.replace(":", "-"))}={json.dumps(v)}')
            elif k == 'for':
                parts.append(f'htmlFor={json.dumps(v)}')
            else:
                parts.append(f'{k}={json.dumps(v, ensure_ascii=False)}')
        if self.parent() == 'section' and 'style' not in a and not pinned:
            parts.append('style={{ position: "relative" }}')
        if tag == 'a':
            parts += ['target="_blank"', 'rel="noreferrer"']
        if tag in VOID or (svg and tag in SVG_LEAF):
            self.emit(pre + '<' + ' '.join(parts) + ' />' + post)
            if tag not in VOID:
                self.stack.append((tag, '', svg))
            return
        self.emit(pre + '<' + ' '.join(parts) + '>')
        self.stack.append((tag, f'</{jsx_tag}>' + post, svg))

    def handle_endtag(self, tag):
        if tag == 'aside':
            self.in_aside = False
            return
        if self.in_aside or tag in VOID:
            return
        if tag == 'table' and self.stack and self.stack[-1][0] == 'tbody':
            self.emit(self.stack.pop()[1])
        while self.stack:
            t, close, _ = self.stack.pop()
            self.emit(close)
            if t == tag:
                break

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID and tag != 'aside':
            self.handle_endtag(tag)

    def handle_data(self, data):
        if self.in_aside:
            self.notes += data
            return
        if not data.strip():
            if data and '\n' not in data:
                self.emit('{" "}')
            return
        self.emit('{' + json.dumps(re.sub(r'\s+', ' ', data), ensure_ascii=False) + '}')


HEAD = '''import type { Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { Step, Steps, unstable_SharedElement as SharedElement } from '@open-slide/core';
__IMPORTS__

// Ported 1:1 from a Claude Slides artifact__SOURCE__.
// Markup keeps the artifact's inline styles; BASE_CSS reproduces that runtime's element defaults.

const FONT_HREFS = __FONTS__;

const BASE_CSS = `
.osa { position: relative; width: 100%; height: 100%; box-sizing: border-box; overflow: hidden; display: flex; flex-direction: column; }
.osa * { box-sizing: border-box; margin: 0; }
.osa div { display: flex; flex-direction: column; }
.osa h1 { font-size: 96px; font-weight: 600; line-height: 1.1; }
.osa h2 { font-size: 64px; font-weight: 600; line-height: 1.15; }
.osa h3 { font-size: 44px; font-weight: 600; line-height: 1.2; }
.osa p, .osa li { font-size: 32px; font-weight: 400; line-height: 1.4; }
.osa ul, .osa ol { padding-left: 1.2em; }
.osa img, .osa svg { display: block; flex-shrink: 0; }
.osa a { color: inherit; text-decoration: none; }
.osa hr { border: 0; }
.osa table { border-collapse: collapse; }
.osa th, .osa td { padding: 0.35em 0.6em; border: 1px solid currentColor; text-align: left; }
.osa [data-osd-step] { position: absolute; inset: 0; pointer-events: none; }
`;

if (typeof document !== 'undefined') {
  FONT_HREFS.forEach((href, i) => {
    const id = `osa-font-${i}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  });
  if (!document.getElementById('osa-base')) {
    const style = document.createElement('style');
    style.id = 'osa-base';
    style.textContent = BASE_CSS;
    document.head.appendChild(style);
  }
}

// The artifact's <x-embed>: a small live page in a sandboxed iframe.
const Embed = ({ html, box }: { html: string; box: Record<string, string> }) => (
  <iframe
    title="Embed"
    srcDoc={html}
    sandbox="allow-scripts"
    style={{ position: 'absolute', border: 0, pointerEvents: 'none', ...box }}
  />
);

// The artifact's <x-shape>: each kind fills its box; block arrows put the head in the last 40%.
const SHAPES: Record<string, string> = {
  'arrow-right': '0,30 60,30 60,0 100,50 60,100 60,70 0,70',
  'arrow-left': '100,30 40,30 40,0 0,50 40,100 40,70 100,70',
  'arrow-down': '30,0 70,0 70,60 100,60 50,100 0,60 30,60',
  'arrow-up': '30,100 70,100 70,40 100,40 50,0 0,40 30,40',
  diamond: '50,0 100,50 50,100 0,50',
};
const Shape = ({ kind, color, width, height }: { kind: string; color: string; width: number; height: number }) => {
  if (kind === 'ellipse' || kind === 'rect' || kind === 'rounded' || kind === 'line') {
    const radius = kind === 'ellipse' ? '50%' : kind === 'rounded' ? 16 : 0;
    const h = kind === 'line' ? 2 : height;
    return <span style={{ display: 'block', flexShrink: 0, width, height: h, background: color, borderRadius: radius }} />;
  }
  return (
    <svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <polygon points={SHAPES[kind] ?? SHAPES['arrow-right']} fill={color} />
    </svg>
  );
};

// The artifact's <x-connector>, in its host's coordinates. elbow = across, down, across; hv/vh = one bend.
const Connector = ({
  x1,
  y1,
  x2,
  y2,
  route,
  head,
  color,
  stroke,
  dashed,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  route: string;
  head: string;
  color: string;
  stroke: number;
  dashed: boolean;
}) => {
  const size = stroke * 5;
  const pts: [number, number][] =
    route === 'elbow'
      ? [[x1, y1], [(x1 + x2) / 2, y1], [(x1 + x2) / 2, y2], [x2, y2]]
      : route === 'hv'
        ? [[x1, y1], [x2, y1], [x2, y2]]
        : route === 'vh'
          ? [[x1, y1], [x1, y2], [x2, y2]]
          : [[x1, y1], [x2, y2]];
  const arrow = (tip: [number, number], from: [number, number]) => {
    const len = Math.hypot(tip[0] - from[0], tip[1] - from[1]) || 1;
    const ux = (tip[0] - from[0]) / len;
    const uy = (tip[1] - from[1]) / len;
    const bx = tip[0] - ux * size;
    const by = tip[1] - uy * size;
    const w = size * 0.6;
    return `${tip[0]},${tip[1]} ${bx - uy * w},${by + ux * w} ${bx + uy * w},${by - ux * w}`;
  };
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  const n = pts.length;
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}
    >
      <path d={line} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={dashed ? `${stroke * 3} ${stroke * 2}` : undefined} />
      {head !== 'none' && <polygon points={arrow(pts[n - 1], pts[n - 2])} fill={color} />}
      {head === 'both' && <polygon points={arrow(pts[0], pts[1])} fill={color} />}
    </svg>
  );
};

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

export const transition: SlideTransition = {
  duration: 240,
  exit: { duration: 200, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 0 }] },
  enter: { duration: 240, delay: 40, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
  sharedElements: { duration: 360, easing: EASE_OUT },
};
'''


def asset_var(stem, used):
    base = re.sub(r'[^A-Za-z0-9]+', ' ', stem).title().replace(' ', '')
    base = 'img' + (base or 'Asset')
    name, i = base, 2
    while name in used:
        name, i = f'{base}{i}', i + 1
    used.add(name)
    return name


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--export', required=True)
    ap.add_argument('--repo', required=True)
    ap.add_argument('--slide-id', required=True)
    ap.add_argument('--source-url', default='')
    ap.add_argument('--asset-names', default='', help='optional JSON file {"<blob-id>": "photo.jpg", ...}')
    args = ap.parse_args()

    if not re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', args.slide_id):
        sys.exit('slide id must be kebab-case')
    export, repo = Path(args.export), Path(args.repo)
    deck = json.loads((export / 'project/deck.json').read_text(encoding='utf-8'))
    out_dir = repo / 'slides' / args.slide_id
    if (out_dir / 'index.tsx').exists():
        sys.exit(f'{out_dir}/index.tsx already exists; pick another id or remove it first')
    names = json.loads(Path(args.asset_names).read_text()) if args.asset_names else {}

    # Read every slide once to learn which blobs and shared ids are used.
    order = deck['order']
    raw = {}
    for sid in order:
        p = export / 'project/slides' / f'{sid}.html'
        if not p.exists():
            warn(f'{sid}: listed in deck.json order but no file; skipped')
            continue
        raw[sid] = p.read_text(encoding='utf-8')
    order = [s for s in order if s in raw]

    ids_per_slide = {}
    for sid, html in raw.items():
        html_wo_embeds = re.sub(r'<x-embed\b.*?</x-embed>', '', html, flags=re.S)
        for i in set(re.findall(r'\sid="([^"]+)"', html_wo_embeds)) - {sid}:
            ids_per_slide.setdefault(i, set()).add(sid)
    shared_ids = {i for i, s in ids_per_slide.items() if len(s) > 1}

    # Assets: copy each referenced blob with a readable name and import it once.
    (out_dir / 'assets').mkdir(parents=True, exist_ok=True)
    blobs = sorted(set(re.findall(r'/_blob/([0-9a-f]{32})', ''.join(raw.values()))))
    files = {f.stem: f for f in (export / 'assets').glob('*')} if (export / 'assets').exists() else {}
    assets, imports, used = {}, [], set()
    for b in blobs:
        f = files.get(b)
        if not f:
            warn(f'asset /_blob/{b} missing from {export}/assets; image will be broken')
            continue
        target = names.get(b, f.name)
        shutil.copyfile(f, out_dir / 'assets' / target)
        var = asset_var(Path(target).stem, used)
        assets[f'/_blob/{b}'] = var
        imports.append(f"import {var} from './assets/{target}';")

    fonts = [face['href'] for face in deck.get('faces', {}).values() if face.get('href')]
    for key, face in deck.get('faces', {}).items():
        if not face.get('href'):
            warn(f'font "{face.get("family")}" is an uploaded file ({face.get("src")}); add it to assets and an @font-face by hand')

    embed_consts, pages, notes = [], [], []
    for sid in order:
        html = raw[sid]
        embeds, count = {}, [0]

        def grab(m):
            count[0] += 1
            name = 'EMBED_' + re.sub(r'\W', '_', sid).upper() + (f'_{count[0]}' if count[0] > 1 else '')
            embed_consts.append(f'const {name} = {json.dumps(m.group(2))};')
            embeds[name] = name
            return f'<x-embed style="{m.group(1)}" data-embed="{name}"></x-embed>'

        html = re.sub(r'<x-embed\s+style="([^"]*)"[^>]*>(.*?)</x-embed>', grab, html, flags=re.S)
        c = Converter(sid, assets, embeds, shared_ids)
        c.feed(html)
        c.close()
        if c.hidden:
            warn(f'{sid}: marked hidden in the artifact; skipped')
            continue
        name = pascal(sid)  # the 'Slide' suffix keeps ids like "math" from shadowing globals
        pages.append((name, ''.join(c.out)))
        notes.append(re.sub(r'\s+', ' ', c.notes).strip())

    source = f' ({args.source_url})' if args.source_url else ''
    head = (HEAD.replace('__IMPORTS__', '\n'.join(imports))
                .replace('__SOURCE__', source)
                .replace('__FONTS__', json.dumps(fonts, indent=2)))
    created = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.') + f'{datetime.now(timezone.utc).microsecond // 1000:03d}Z'
    body = [head, *embed_consts, '']
    for name, jsx in pages:
        body.append(f'const {name}: Page = () => (\n{jsx}\n);\n')
    body.append('export const notes = ' + json.dumps(notes, ensure_ascii=False, indent=2) + ';\n')
    body.append('export const meta: SlideMeta = {\n  title: ' + json.dumps(deck.get('title', args.slide_id), ensure_ascii=False)
                + f",\n  createdAt: '{created}',\n}};\n")
    body.append('export default [\n' + ''.join(f'  {n},\n' for n, _ in pages) + '] satisfies Page[];\n')
    (out_dir / 'index.tsx').write_text('\n'.join(body), encoding='utf-8')

    print(f'wrote {out_dir}/index.tsx: {len(pages)} pages, {len(assets)} assets, {len(embed_consts)} embeds, '
          f'shared elements: {sorted(shared_ids) or "none"}')
    for w in warnings:
        print('WARNING:', w)


if __name__ == '__main__':
    main()
