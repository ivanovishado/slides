import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';

// GitHub Pages serves deep links like /s/<id> through 404.html, so they return HTTP 404 and
// search engines drop them. Writing dist/s/<id>.html makes /s/<id> a real 200 page.
const siteUrl = 'https://talks.ivanovishado.dev';
const siteTitle = 'Talks · Ivan Galaviz';
const slidesDir = new URL('../slides/', import.meta.url);
const distDir = new URL('../dist/', import.meta.url);

const escapeHtml = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const withHead = (html, title, url) => {
  if (!/<title>[^<]*<\/title>/.test(html)) {
    throw new Error('dist/index.html does not have the expected <title> tag');
  }
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace('</head>', `    <link rel="canonical" href="${url}" />\n  </head>`);
};

const html = await readFile(new URL('index.html', distDir), 'utf8');

const decks = [];
for (const entry of await readdir(slidesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const source = await readFile(new URL(`${entry.name}/index.tsx`, slidesDir), 'utf8');
  const title = source.match(/export const meta[^=]*=\s*{[^}]*?title:\s*'([^']+)'/s)?.[1];
  if (!title) throw new Error(`slides/${entry.name}/index.tsx has no meta.title`);
  decks.push({ id: entry.name, title });
}

await writeFile(new URL('index.html', distDir), withHead(html, siteTitle, `${siteUrl}/`));

await mkdir(new URL('s/', distDir), { recursive: true });
for (const { id, title } of decks) {
  await writeFile(new URL(`s/${id}.html`, distDir), withHead(html, title, `${siteUrl}/s/${id}`));
}

const urls = [`${siteUrl}/`, ...decks.map(({ id }) => `${siteUrl}/s/${id}`)];
await writeFile(
  new URL('sitemap.xml', distDir),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u}</loc></url>`)
    .join('\n')}\n</urlset>\n`,
);
await writeFile(new URL('robots.txt', distDir), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
