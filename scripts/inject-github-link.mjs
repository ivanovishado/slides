import { readFile, writeFile } from 'node:fs/promises';

const indexFile = new URL('../dist/index.html', import.meta.url);
const repoUrl = 'https://github.com/ivanovishado/slides';
const marker = 'data-site-github-link';

const style = `    <style data-site-github-link-style>
      .site-github-link {
        position: fixed;
        right: max(18px, env(safe-area-inset-right));
        bottom: max(18px, env(safe-area-inset-bottom));
        z-index: 2147483647;
        display: inline-flex;
        width: 42px;
        height: 42px;
        align-items: center;
        justify-content: center;
        color: #111827;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(17, 24, 39, 0.18);
        border-radius: 999px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
        backdrop-filter: blur(10px);
        transition:
          transform 140ms ease,
          background-color 140ms ease,
          border-color 140ms ease;
      }

      .site-github-link:hover {
        transform: translateY(-1px);
        background: #ffffff;
        border-color: rgba(17, 24, 39, 0.3);
      }

      .site-github-link:focus-visible {
        outline: 3px solid rgba(37, 99, 235, 0.65);
        outline-offset: 3px;
      }

      .site-github-link svg {
        width: 22px;
        height: 22px;
        fill: currentColor;
      }

      .site-github-link__label {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    </style>`;

const link = `    <a ${marker} class="site-github-link" href="${repoUrl}" target="_blank" rel="noopener noreferrer" aria-label="Open slides repository on GitHub" title="Open slides repository on GitHub">
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 0C3.58 0 0 3.67 0 8.2c0 3.63 2.29 6.7 5.47 7.79.4.08.55-.18.55-.4 0-.19-.01-.84-.01-1.53-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.24 1.87.89 2.33.68.07-.53.28-.89.51-1.09-1.78-.21-3.64-.91-3.64-4.05 0-.89.31-1.63.82-2.2-.08-.21-.36-1.04.08-2.17 0 0 .67-.22 2.2.84A7.39 7.39 0 0 1 8 3.98c.68 0 1.36.09 2 .27 1.53-1.06 2.2-.84 2.2-.84.44 1.13.16 1.96.08 2.17.51.57.82 1.3.82 2.2 0 3.15-1.87 3.84-3.65 4.05.29.26.54.75.54 1.52 0 1.09-.01 1.97-.01 2.24 0 .22.15.48.55.4A8.12 8.12 0 0 0 16 8.2C16 3.67 12.42 0 8 0Z" />
      </svg>
      <span class="site-github-link__label">GitHub repository</span>
    </a>`;

const html = await readFile(indexFile, 'utf8');

if (!html.includes(marker)) {
  if (!html.includes('</head>') || !html.includes('<body>')) {
    throw new Error('dist/index.html does not have the expected head/body markers');
  }

  const next = html.replace('</head>', `${style}\n  </head>`).replace('<body>', `<body>\n${link}`);
  await writeFile(indexFile, next);
}
