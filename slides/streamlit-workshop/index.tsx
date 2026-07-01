import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';
import cugdlLogo from './assets/cugdl-logo.png';
import gdgLogo from './assets/gdg-logo.png';
import ivan from './assets/ivan.jpeg';
import linkedin from './assets/linkedin.png';
import movIndigoLogo from './assets/mov-indigo-logo.png';
import repo from './assets/repo.png';
import slidesQr from './assets/slides.png';

export const design: DesignSystem = {
  palette: { bg: '#0e1116', text: '#f5f7fa', accent: '#f7931a' },
  fonts: {
    display: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  typeScale: { hero: 160, body: 36 },
  radius: 10,
};

const muted = '#8b95a7';
const panel = '#161b22';
const panelLine = '#21262d';
const bitcoin = '#f7931a';
const crestRed = '#B12028';
const gdgBlue = '#4285f4';
const gdgGreen = '#0f9d58';
const gdgYellow = '#fbbc04';
const gdgRed = '#ea4335';
const ink = '#000000';
const mono = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

const STYLE_ID = 'streamlit-workshop-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes osd-fade-up {
      from { opacity: 0; transform: translateY(18px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes osd-type {
      from { width: 0; }
      to { width: 100%; }
    }
    @keyframes osd-stream {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes osd-blink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
    @keyframes osd-draw {
      from { stroke-dashoffset: 6000; }
      to { stroke-dashoffset: 0; }
    }
    .osd-fade-up { animation: osd-fade-up 520ms cubic-bezier(0, 0, 0.2, 1) both; }
    .osd-type {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      width: 0;
      animation: osd-type 1.5s steps(40, end) both;
    }
    .osd-stream {
      opacity: 0;
      animation: osd-stream 420ms cubic-bezier(0, 0, 0.2, 1) both;
    }
    .osd-caret::after {
      content: '';
      display: inline-block;
      width: 0.08em;
      height: 0.9em;
      background: currentColor;
      margin-left: 0.12em;
      vertical-align: -0.08em;
      animation: osd-blink 1s steps(1) infinite;
    }
    .osd-draw {
      stroke-dasharray: 6000;
      stroke-dashoffset: 6000;
      animation: osd-draw 2.6s cubic-bezier(0, 0, 0.2, 1) forwards;
    }
    .osd-code {
      font-family: ${mono};
      background: ${panel};
      color: ${bitcoin};
      padding: 3px 11px;
      border-radius: 6px;
      font-size: 0.88em;
      border: 1px solid ${panelLine};
    }
    ::selection {
      background: ${bitcoin};
      color: ${ink};
    }
  `;
  document.head.appendChild(style);
}

const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 'var(--osd-size-hero)',
      fontWeight: 900,
      lineHeight: 1.02,
      letterSpacing: -0.01,
      margin: 0,
      maxWidth: 1320,
      color: 'var(--osd-text)',
    }}
  >
    {children}
  </h1>
);

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 112,
        right: 112,
        bottom: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'var(--osd-font-body)',
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: 1.6,
        color: muted,
        textTransform: 'uppercase',
      }}
    >
      <span>UdeG x GDG · Streamlit Workshop</span>
      <span style={{ color: 'var(--osd-accent)' }}>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      fontFamily: 'var(--osd-font-body)',
      fontSize: 22,
      fontWeight: 800,
      letterSpacing: 3.4,
      color: 'var(--osd-accent)',
      textTransform: 'uppercase',
    }}
  >
    <span style={{ width: 64, height: 7, background: gdgBlue, borderRadius: 999 }} />
    <span>{children}</span>
  </div>
);

const ColorRail = () => (
  <div style={{ display: 'flex', gap: 10 }}>
    <span style={{ width: 56, height: 8, background: gdgBlue, borderRadius: 999 }} />
    <span style={{ width: 56, height: 8, background: gdgRed, borderRadius: 999 }} />
    <span style={{ width: 56, height: 8, background: gdgYellow, borderRadius: 999 }} />
    <span style={{ width: 56, height: 8, background: gdgGreen, borderRadius: 999 }} />
  </div>
);

const Frame = ({ children }: { children: React.ReactNode }) => (
  <section
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
    }}
  >
    <div style={{ position: 'absolute', left: 112, right: 112, top: 60, height: 3, background: 'var(--osd-accent)', opacity: 0.9 }} />
    <div style={{ position: 'absolute', right: 112, top: 78 }}>
      <ColorRail />
    </div>
    <div style={{ position: 'absolute', left: 112, bottom: 100, width: 320, height: 10, background: crestRed }} />
    {children}
    <Footer />
  </section>
);

const ContentBlock = ({ children, top = 150 }: { children: React.ReactNode; top?: number }) => (
  <div className="osd-fade-up" style={{ position: 'absolute', left: 112, right: 112, top, bottom: 130 }}>
    {children}
  </div>
);

const PageHeading = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <h2
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 70,
      lineHeight: 1.1,
      margin: '18px 0 36px',
      color: 'var(--osd-text)',
      maxWidth: 1320,
      ...style,
    }}
  >
    {children}
  </h2>
);

const BodyList = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <ul
    style={{
      fontSize: 'var(--osd-size-body)',
      lineHeight: 1.5,
      color: muted,
      margin: 0,
      paddingLeft: 44,
      maxWidth: 1100,
      ...style,
    }}
  >
    {children}
  </ul>
);

const Code = ({ children }: { children: React.ReactNode }) => <span className="osd-code">{children}</span>;

const TrafficLights = () => (
  <div style={{ display: 'flex', gap: 9 }}>
    {['#ff5f56', '#ffbd2e', '#27c93f'].map((color) => (
      <span
        key={color}
        style={{
          width: 13,
          height: 13,
          borderRadius: '50%',
          background: color,
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.25)',
        }}
      />
    ))}
  </div>
);

const WindowShell = ({
  title,
  badge,
  children,
  style,
}: {
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      background: '#0b0f14',
      border: `1px solid ${panelLine}`,
      borderRadius: 'var(--osd-radius)',
      boxShadow: '0 40px 80px -36px rgba(0,0,0,0.7)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
  >
    <div
      style={{
        height: 48,
        padding: '0 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: '#090d12',
        borderBottom: `1px solid ${panelLine}`,
        flexShrink: 0,
      }}
    >
      <TrafficLights />
      <div
        style={{
          flex: 1,
          textAlign: 'center',
          fontFamily: mono,
          fontSize: 18,
          color: '#6b7689',
          letterSpacing: '0.02em',
        }}
      >
        {title}
      </div>
      <div style={{ minWidth: 40, display: 'flex', justifyContent: 'flex-end' }}>{badge}</div>
    </div>
    {children}
  </div>
);

const CodePane = ({
  children,
  fontSize = 30,
  style,
}: {
  children: React.ReactNode;
  fontSize?: number;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      padding: '30px 40px',
      fontFamily: mono,
      fontSize,
      lineHeight: 1.6,
      color: 'var(--osd-text)',
      ...style,
    }}
  >
    {children}
  </div>
);

const PriceTrace = ({
  width,
  height,
  stroke = bitcoin,
  strokeWidth = 3,
  fillOpacity = 0.14,
  animate = true,
}: {
  width: number;
  height: number;
  stroke?: string;
  strokeWidth?: number;
  fillOpacity?: number;
  animate?: boolean;
}) => {
  const series = [
    4, 5, 7, 12, 8, 15, 22, 30, 28, 40, 55, 48, 70, 95, 120, 180, 160, 210, 300, 420, 380, 520,
    680, 900, 1100, 950, 1400, 1800, 1600, 2200, 3100, 4200, 3800, 5200, 6400, 5800, 7200, 8900,
    9600, 11200, 13800, 12400, 15800, 19200, 16800, 24000, 31000, 29000, 42000, 58000, 64000,
    48000, 43000, 52000, 61000, 57000, 69000, 71000, 64000, 68000, 72000,
  ];
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const stepX = width / (series.length - 1);
  const pts = series.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const linePath = `M${pts.join(' L')}`;
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
  return (
    <svg
      aria-hidden="true"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      <path d={areaPath} fill={stroke} fillOpacity={fillOpacity} />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        className={animate ? 'osd-draw' : undefined}
      />
    </svg>
  );
};

const BtcRing = ({ size = 460 }: { size?: number }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      border: `22px solid ${bitcoin}`,
      opacity: 0.22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        width: size * 0.7,
        height: size * 0.7,
        borderRadius: '50%',
        background: panel,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: mono,
        fontSize: size * 0.22,
        color: bitcoin,
        fontWeight: 800,
      }}
    >
      ₿
    </div>
  </div>
);

const Cover: Page = () => (
  <Frame>
    <div className="osd-fade-up" style={{ position: 'absolute', left: 112, top: 210, width: 1180 }}>
      <div style={{ display: 'flex', gap: 32, marginBottom: 48 }}>
        {[
          { src: cugdlLogo, alt: 'UdeG' },
          { src: gdgLogo, alt: 'GDG' },
          { src: movIndigoLogo, alt: 'MOV Indigo' },
        ].map(({ src, alt }) => (
          <div
            key={alt}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '14px 24px',
              width: 340,
              height: 110,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 18px 40px -22px rgba(0,0,0,0.8)',
            }}
          >
            <img src={src} alt={alt} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
          </div>
        ))}
      </div>
      <Eyebrow>Taller UdeG x GDG</Eyebrow>
      <Title>Streamlit</Title>
      <p style={{ fontSize: 56, lineHeight: 1.2, color: 'var(--osd-text)', maxWidth: 1080, margin: '28px 0 0', fontWeight: 500 }}>
        De notebook a dashboard de Bitcoin
      </p>
      <p style={{ fontSize: 30, color: muted, marginTop: 40, maxWidth: 900, letterSpacing: 0.4 }}>
        De <Code>streamlit run streamlit_app.py</Code> a un dashboard local filtrable en 2 horas.
      </p>
    </div>
    <div style={{ position: 'absolute', right: 96, top: 230, width: 660, height: 610 }}>
      <div style={{ position: 'absolute', left: 0, top: 240 }}>
        <PriceTrace width={660} height={360} strokeWidth={4} />
      </div>
      <div style={{ position: 'absolute', right: -40, top: -70 }}>
        <BtcRing size={300} />
      </div>
    </div>
  </Frame>
);

const Presenter: Page = () => (
  <Frame>
    <ContentBlock top={170}>
      <Eyebrow>Presenta</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', gap: 80, marginTop: 28, alignItems: 'center' }}>
        <div
          style={{
            width: 440,
            height: 440,
            borderRadius: 'var(--osd-radius)',
            border: `2px solid ${panelLine}`,
            background: panel,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <img src={ivan} alt="Iván Galaviz" style={{ width: 440, height: 440, objectFit: 'cover', borderRadius: 'var(--osd-radius)' }} />
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 92, lineHeight: 1.05, margin: 0, color: 'var(--osd-text)', fontWeight: 900 }}>Ivan Galaviz</h2>
          <div style={{ fontSize: 38, color: 'var(--osd-accent)', fontWeight: 800, marginTop: 24, letterSpacing: 0.3 }}>
            Software Engineer at Netflix
          </div>
          <div style={{ fontSize: 32, color: muted, marginTop: 18, lineHeight: 1.4 }}>
            Ing. en Computación por la UdeG — CUCEI
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
            <span style={{ height: 10, width: 120, background: crestRed, borderRadius: 999 }} />
            <span style={{ height: 10, width: 120, background: bitcoin, borderRadius: 999 }} />
            <span style={{ height: 10, width: 120, background: gdgBlue, borderRadius: 999 }} />
          </div>
        </div>
      </div>
    </ContentBlock>
  </Frame>
);

const NotebookVsApp: Page = () => (
  <Frame>
    <ContentBlock>
      <Eyebrow>Por qué apps locales</Eyebrow>
      <PageHeading>Hoy usamos <Code>streamlit run</Code>, no notebooks</PageHeading>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 4 }}>
        <WindowShell title="notebook.ipynb" style={{ minHeight: 460 }}>
          <div style={{ padding: '28px 36px', fontSize: 27, lineHeight: 1.6, color: muted }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <span style={{ width: 28, height: 28, borderRadius: 6, background: gdgYellow, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: ink, fontWeight: 900, fontSize: 16 }}>In</span>
              <span style={{ color: 'var(--osd-text)', fontFamily: mono, fontSize: 22 }}>[1]</span>
            </div>
            <div style={{ fontFamily: mono, fontSize: 24, color: 'var(--osd-text)', background: '#090d12', border: `1px solid ${panelLine}`, borderRadius: 6, padding: '18px 22px' }}>
              import streamlit as st<br />
              <span style={{ color: muted }}># renderiza una app Streamlit</span><br />
              <span style={{ color: bitcoin }}>from</span> streamlit_jupyter <span style={{ color: bitcoin }}>import</span> st
            </div>
            <p style={{ fontSize: 24, color: muted, marginTop: 22, lineHeight: 1.5 }}>
              <Code>streamlit-jupyter</Code> permite renderizar apps Streamlit dentro de un notebook.
            </p>
          </div>
        </WindowShell>
        <WindowShell title="~/streamlit-workshop — zsh" style={{ minHeight: 460 }}>
          <div style={{ padding: '28px 36px', fontFamily: mono, fontSize: 26, lineHeight: 1.7, color: muted }}>
            <div style={{ display: 'flex', gap: 14 }}>
              <span style={{ color: gdgGreen }}>$</span>
              <span style={{ color: 'var(--osd-text)' }}>streamlit run streamlit_app.py</span>
            </div>
            <div style={{ color: 'var(--osd-text)', marginTop: 10 }}>
              <span style={{ color: bitcoin }}>  Local URL: </span>http://localhost:8501
            </div>
            <div style={{ color: 'var(--osd-text)' }}>
              <span style={{ color: bitcoin }}>  Network URL: </span>http://192.168.0.21:8501
            </div>
            <p style={{ fontFamily: 'var(--osd-font-body)', fontSize: 24, color: muted, marginTop: 26, lineHeight: 1.5 }}>
              El flujo normal de Streamlit: un archivo Python y un servidor local.
            </p>
          </div>
        </WindowShell>
      </div>
    </ContentBlock>
  </Frame>
);

const WhatIsStreamlit: Page = () => (
  <Frame>
    <ContentBlock>
      <Eyebrow>Concepto</Eyebrow>
      <PageHeading>Un script de Python que se vuelve una app web</PageHeading>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, marginTop: 4, alignItems: 'stretch' }}>
        <WindowShell title="streamlit_app.py" style={{ minHeight: 420 }}>
          <CodePane fontSize={28}>
            <span style={{ color: bitcoin }}>import</span> streamlit <span style={{ color: bitcoin }}>as</span> st
            <br />
            <br />
            st.title(<span style={{ color: gdgGreen }}>"Dashboard de Bitcoin"</span>)
            <br />
            st.write(<span style={{ color: gdgGreen }}>"Precio histórico"</span>)
          </CodePane>
        </WindowShell>
        <div
          style={{
            background: panel,
            border: `1px solid ${panelLine}`,
            borderRadius: 'var(--osd-radius)',
            minHeight: 420,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ height: 44, background: '#090d12', borderBottom: `1px solid ${panelLine}`, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 10 }}>
            <TrafficLights />
            <span style={{ marginLeft: 14, fontFamily: mono, fontSize: 18, color: muted }}>localhost:8501</span>
          </div>
          <div style={{ padding: '28px 34px', color: 'var(--osd-text)' }}>
            <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.2 }}>Dashboard de Bitcoin</div>
            <div style={{ fontSize: 24, color: muted, marginTop: 14 }}>Precio histórico</div>
          </div>
        </div>
      </div>
    </ContentBlock>
  </Frame>
);

const RerunNode = ({ label, desc, color }: { label: string; desc: string; color: string }) => (
  <div
    style={{
      background: panel,
      border: `1px solid ${panelLine}`,
      borderLeft: `8px solid ${color}`,
      borderRadius: 'var(--osd-radius)',
      padding: '24px 30px',
      width: 620,
    }}
  >
    <div style={{ fontSize: 34, fontWeight: 800, color: 'var(--osd-text)' }}>{label}</div>
    <div style={{ fontSize: 26, color: muted, marginTop: 8, lineHeight: 1.4 }}>{desc}</div>
  </div>
);

const MentalModel: Page = () => (
  <Frame>
    <ContentBlock>
      <Eyebrow>Modelo mental</Eyebrow>
      <PageHeading>El script se re-ejecuta de arriba hacia abajo</PageHeading>
      <div style={{ display: 'grid', gridTemplateColumns: '620px 90px', gap: 24, alignItems: 'start', marginTop: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <RerunNode label="1 · Cambia un widget" desc="El usuario mueve un slider o elige un año." color={gdgBlue} />
          <div style={{ color: bitcoin, fontSize: 30, marginLeft: 280, fontWeight: 900 }}>↓</div>
          <RerunNode label="2 · Streamlit re-ejecuta el script" desc="Todo el archivo se ejecuta otra vez, de arriba a abajo." color={bitcoin} />
          <div style={{ color: bitcoin, fontSize: 30, marginLeft: 280, fontWeight: 900 }}>↓</div>
          <RerunNode label="3 · La UI se redibuja" desc="Cada st.* refleja los nuevos valores al instante." color={gdgGreen} />
        </div>
        <div
          style={{
            marginTop: 8,
            height: 520,
            borderLeft: `3px dashed ${panelLine}`,
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -40,
              top: 250,
              color: crestRed,
              fontSize: 40,
              fontWeight: 900,
              transform: 'rotate(180deg)',
            }}
          >
            ↻
          </div>
          <div style={{ position: 'absolute', left: 4, top: 240, fontSize: 20, color: muted, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 800, writingMode: 'vertical-rl' }}>
            rerun loop
          </div>
        </div>
      </div>
    </ContentBlock>
  </Frame>
);

const UIPrimitives: Page = () => (
  <Frame>
    <ContentBlock>
      <Eyebrow>Primitivas</Eyebrow>
      <PageHeading>Texto y retroalimentación</PageHeading>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 4, alignItems: 'start' }}>
        <WindowShell title="streamlit_app.py" style={{ minHeight: 420 }}>
          <CodePane fontSize={26}>
            st.title(<span style={{ color: gdgGreen }}>"Dashboard de Bitcoin"</span>)
            <br />
            st.write(<span style={{ color: gdgGreen }}>"Precio de cierre histórico"</span>)
            <br />
            st.markdown(<span style={{ color: gdgGreen }}>"**Filtro activo**"</span>)
            <br />
            st.success(<span style={{ color: gdgGreen }}>"Datos cargados"</span>)
          </CodePane>
        </WindowShell>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ background: panel, border: `1px solid ${panelLine}`, borderRadius: 'var(--osd-radius)', padding: '20px 28px' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--osd-text)' }}>Dashboard de Bitcoin</div>
            <div style={{ fontSize: 26, color: muted, marginTop: 8 }}>Precio de cierre histórico</div>
            <div style={{ fontSize: 26, color: 'var(--osd-text)', marginTop: 8 }}><strong>Filtro activo</strong></div>
          </div>
          <div style={{ background: 'rgba(15,157,88,0.12)', border: `1px solid ${gdgGreen}`, borderLeft: `8px solid ${gdgGreen}`, borderRadius: 'var(--osd-radius)', padding: '20px 28px', color: gdgGreen, fontSize: 28, fontWeight: 700 }}>
            ✓ Datos cargados
          </div>
          <div style={{ fontSize: 25, color: muted, lineHeight: 1.5 }}>
            Estructura con <Code>st.title</Code>/<Code>st.markdown</Code>; valida con <Code>st.success</Code>/<Code>st.info</Code>.
          </div>
        </div>
      </div>
    </ContentBlock>
  </Frame>
);

const WidgetsAsVariables: Page = () => (
  <Frame>
    <ContentBlock>
      <Eyebrow>Widgets</Eyebrow>
      <PageHeading>Los widgets son variables</PageHeading>
      <WindowShell title="streamlit_app.py" style={{ width: 1180, marginTop: 4 }}>
        <CodePane fontSize={30}>
          min_price = st.slider(<span style={{ color: gdgGreen }}>"Precio mínimo de cierre"</span>, 0, 130000, 30000)
          <br />
          year = st.selectbox(<span style={{ color: gdgGreen }}>"Año"</span>, sorted(data[<span style={{ color: gdgYellow }}>"Year"</span>].unique()))
          <br />
          <br />
          <span style={{ color: muted }}>filtrado</span> = data[(data[<span style={{ color: gdgYellow }}>"Close"</span>] &gt;= min_price) &amp; (data[<span style={{ color: gdgYellow }}>"Year"</span>] == year)]
        </CodePane>
      </WindowShell>
      <div style={{ display: 'flex', gap: 28, marginTop: 28, maxWidth: 1180 }}>
        <div style={{ background: panel, borderTop: `6px solid ${gdgBlue}`, borderRadius: 'var(--osd-radius)', padding: 26, flex: 1 }}>
          <Code>st.slider</Code>
          <div style={{ fontSize: 26, color: muted, marginTop: 12, lineHeight: 1.4 }}>Retorna un número.</div>
        </div>
        <div style={{ background: panel, borderTop: `6px solid ${gdgGreen}`, borderRadius: 'var(--osd-radius)', padding: 26, flex: 1 }}>
          <Code>st.selectbox</Code>
          <div style={{ fontSize: 26, color: muted, marginTop: 12, lineHeight: 1.4 }}>Retorna una opción.</div>
        </div>
        <div style={{ background: panel, borderTop: `6px solid ${bitcoin}`, borderRadius: 'var(--osd-radius)', padding: 26, flex: 1 }}>
          <Code>st.date_input</Code>
          <div style={{ fontSize: 26, color: muted, marginTop: 12, lineHeight: 1.4 }}>Retorna un rango de fechas.</div>
        </div>
      </div>
    </ContentBlock>
  </Frame>
);

const DatasetField = ({ col, q, color = gdgBlue }: { col: string; q: string; color?: string }) => (
  <div
    style={{
      background: panel,
      borderLeft: `8px solid ${color}`,
      borderRadius: 'var(--osd-radius)',
      padding: '20px 26px',
    }}
  >
    <Code>{col}</Code>
    <div style={{ fontSize: 26, color: muted, marginTop: 10, lineHeight: 1.35 }}>{q}</div>
  </div>
);

const DatasetMap: Page = () => (
  <Frame>
    <ContentBlock top={130}>
      <Eyebrow>Datos · Semana 3</Eyebrow>
      <PageHeading>El dataset btc_diario_limpio.csv</PageHeading>
      <div style={{ display: 'flex', gap: 36, marginBottom: 24, color: muted, fontSize: 26 }}>
        <span><strong style={{ color: 'var(--osd-text)' }}>5,285</strong> filas diarias</span>
        <span>·</span>
        <span><strong style={{ color: 'var(--osd-text)' }}>2012-01-01 → 2026-06-23</strong></span>
        <span>·</span>
        <span><Code>Daily_Return</Code> tiene 1 NaN (fila 0)</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        <DatasetField col="Date" q="Marca temporal diaria." color={gdgBlue} />
        <DatasetField col="Open / High / Low" q="OHLC del día en USD." color={bitcoin} />
        <DatasetField col="Close" q="Cierre usado en la gráfica." color={bitcoin} />
        <DatasetField col="Volume" q="Volumen negociado en BTC." color={gdgGreen} />
        <DatasetField col="Year / Month" q="Columnas derivadas para filtrar." color={gdgYellow} />
        <DatasetField col="Daily_Return" q="Retorno porcentual diario." color={gdgRed} />
      </div>
    </ContentBlock>
  </Frame>
);

const FilterPattern: Page = () => (
  <Frame>
    <ContentBlock>
      <Eyebrow>Patrón</Eyebrow>
      <PageHeading>Widget → Condición → DataFrame filtrado</PageHeading>
      <WindowShell title="streamlit_app.py" style={{ width: 1180, marginTop: 4 }}>
        <CodePane fontSize={30}>
          <span style={{ color: muted }}># 1. el widget regresa un valor Python</span>
          <br />
          years = st.multiselect(<span style={{ color: gdgGreen }}>"Años"</span>, sorted(data[<span style={{ color: gdgYellow }}>"Year"</span>].unique()))
          <br />
          <br />
          <span style={{ color: muted }}># 2. ese valor alimenta una condicion Pandas</span>
          <br />
          <span style={{ color: bitcoin }}>if</span> years:
          <br />
          &nbsp;&nbsp;data = data[data[<span style={{ color: gdgYellow }}>"Year"</span>].isin(years)]
          <br />
          <br />
          <span style={{ color: muted }}># 3. el DataFrame filtrado alimenta la UI</span>
          <br />
          st.dataframe(data)
        </CodePane>
      </WindowShell>
    </ContentBlock>
  </Frame>
);

const MetricTile = ({ label, value, color = bitcoin }: { label: string; value: string; color?: string }) => (
  <div
    style={{
      background: panel,
      border: `1px solid ${panelLine}`,
      borderLeft: `5px solid ${color}`,
      borderRadius: 6,
      padding: '12px 16px',
    }}
  >
    <div style={{ fontSize: 14, color: muted, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>{label}</div>
    <div style={{ fontSize: 22, color: 'var(--osd-text)', fontWeight: 800, marginTop: 4 }}>{value}</div>
  </div>
);

const DashboardLayout: Page = () => (
  <Frame>
    <ContentBlock top={120}>
      <Eyebrow>Dashboard</Eyebrow>
      <PageHeading>Sidebar + métricas + gráficas + tabla</PageHeading>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '250px 1fr',
          gap: 20,
          marginTop: 4,
          background: '#0b0f14',
          border: `1px solid ${panelLine}`,
          borderRadius: 'var(--osd-radius)',
          overflow: 'hidden',
          maxHeight: 560,
        }}
      >
        <div style={{ background: '#090d12', borderRight: `1px solid ${panelLine}`, padding: '20px 18px' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--osd-text)', letterSpacing: 1, textTransform: 'uppercase' }}>Filtros</div>
          <div style={{ fontSize: 15, color: muted, marginTop: 14 }}>Rango de fechas</div>
          <div style={{ height: 34, background: panel, border: `1px solid ${panelLine}`, borderRadius: 4, marginTop: 6 }} />
          <div style={{ fontSize: 15, color: muted, marginTop: 16 }}>Años</div>
          <div style={{ height: 34, background: panel, border: `1px solid ${panelLine}`, borderRadius: 4, marginTop: 6 }} />
          <div style={{ fontSize: 15, color: muted, marginTop: 16 }}>Meses</div>
          <div style={{ height: 34, background: panel, border: `1px solid ${panelLine}`, borderRadius: 4, marginTop: 6 }} />
        </div>
        <div style={{ padding: '20px 22px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <MetricTile label="Días" value="1,826" color={gdgBlue} />
            <MetricTile label="Último cierre" value="$72,000" />
            <MetricTile label="Máximo cierre" value="$72,000" />
            <MetricTile label="Retorno diario prom." value="0.12%" color={gdgGreen} />
            <MetricTile label="Volatilidad" value="3.85%" color={gdgRed} />
            <MetricTile label="Volumen total" value="4.2M BTC" color={gdgYellow} />
          </div>
          <div style={{ height: 150, marginTop: 16, background: panel, border: `1px solid ${panelLine}`, borderRadius: 6, padding: 10 }}>
            <div style={{ fontSize: 13, color: muted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Precio de cierre</div>
            <div style={{ marginTop: 4 }}><PriceTrace width={640} height={120} strokeWidth={2} animate={false} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
            <div style={{ height: 70, background: panel, border: `1px solid ${panelLine}`, borderRadius: 6, padding: '6px 10px' }}>
              <div style={{ fontSize: 12, color: muted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Cierre prom. por año</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 44, marginTop: 4 }}>
                <span style={{ width: 10, height: 12, background: bitcoin, opacity: 0.7, borderRadius: 2 }} />
                <span style={{ width: 10, height: 28, background: bitcoin, opacity: 0.7, borderRadius: 2 }} />
                <span style={{ width: 10, height: 45, background: bitcoin, opacity: 0.7, borderRadius: 2 }} />
                <span style={{ width: 10, height: 60, background: bitcoin, opacity: 0.7, borderRadius: 2 }} />
                <span style={{ width: 10, height: 38, background: bitcoin, opacity: 0.7, borderRadius: 2 }} />
                <span style={{ width: 10, height: 70, background: bitcoin, opacity: 0.7, borderRadius: 2 }} />
                <span style={{ width: 10, height: 55, background: bitcoin, opacity: 0.7, borderRadius: 2 }} />
                <span style={{ width: 10, height: 82, background: bitcoin, opacity: 0.7, borderRadius: 2 }} />
              </div>
            </div>
            <div style={{ height: 70, background: panel, border: `1px solid ${panelLine}`, borderRadius: 6, padding: '6px 10px' }}>
              <div style={{ fontSize: 12, color: muted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Retorno prom. por mes</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 44, marginTop: 4 }}>
                <span style={{ width: 10, height: 20, background: gdgGreen, opacity: 0.7, borderRadius: 2 }} />
                <span style={{ width: 10, height: 10, background: gdgRed, opacity: 0.7, borderRadius: 2 }} />
                <span style={{ width: 10, height: 35, background: gdgGreen, opacity: 0.7, borderRadius: 2 }} />
                <span style={{ width: 10, height: 18, background: gdgGreen, opacity: 0.7, borderRadius: 2 }} />
                <span style={{ width: 10, height: 42, background: gdgGreen, opacity: 0.7, borderRadius: 2 }} />
                <span style={{ width: 10, height: 25, background: gdgGreen, opacity: 0.7, borderRadius: 2 }} />
                <span style={{ width: 10, height: 30, background: gdgGreen, opacity: 0.7, borderRadius: 2 }} />
                <span style={{ width: 10, height: 15, background: gdgGreen, opacity: 0.7, borderRadius: 2 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentBlock>
  </Frame>
);

const PipelineStep = ({ n, title, desc, color }: { n: number; title: string; desc: string; color: string }) => (
  <div style={{ background: panel, borderTop: `6px solid ${color}`, borderRadius: 'var(--osd-radius)', padding: 32, flex: 1 }}>
    <div style={{ fontSize: 28, fontWeight: 900, color, marginBottom: 12 }}>0{n}</div>
    <div style={{ fontSize: 34, fontWeight: 800, color: 'var(--osd-text)', marginBottom: 12 }}>{title}</div>
    <div style={{ fontSize: 26, color: muted, lineHeight: 1.4 }}>{desc}</div>
  </div>
);

const DeploymentPreview: Page = () => (
  <Frame>
    <ContentBlock>
      <Eyebrow>Despliegue</Eyebrow>
      <PageHeading>De local a Streamlit Community Cloud</PageHeading>
      <div style={{ display: 'flex', gap: 28, marginTop: 8, maxWidth: 1640 }}>
        <PipelineStep n={1} title="GitHub" desc="Sube el repo con streamlit_app.py y data/." color={gdgBlue} />
        <PipelineStep n={2} title="requirements.txt" desc="Lista las dependencias exactas." color={gdgYellow} />
        <PipelineStep n={3} title="Community Cloud" desc="Apunta a streamlit_app.py y ejecuta." color={gdgGreen} />
      </div>
      <div style={{ marginTop: 36, fontSize: 28, color: muted, maxWidth: 1180 }}>
        Streamlit Cloud corre <Code>streamlit run streamlit_app.py</Code> por ti — la misma app de <Code>localhost:8501</Code>, ahora pública.
      </div>
    </ContentBlock>
  </Frame>
);

const Closing: Page = () => (
  <Frame>
    <div className="osd-fade-up" style={{ position: 'absolute', left: 112, right: 112, top: 170, bottom: 130, display: 'flex', flexDirection: 'column' }}>
      <Eyebrow>Cierre</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 650px', gap: 48, marginTop: 28, flex: 1, alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 92, lineHeight: 1.05, margin: '0 0 32px', maxWidth: 1000, color: 'var(--osd-text)', fontWeight: 900 }}>
            Adapta, no reescribas
          </h2>
          <BodyList>
            <li style={{ marginBottom: 20 }}>
              El mismo patrón sirve para cualquier dataset de la Semana 3 o futuro.
            </li>
            <li style={{ marginBottom: 20 }}>
              Cambia filtros, métricas y gráficas; la estructura del dashboard se mantiene.
            </li>
            <li>Gracias. ¿Preguntas?</li>
          </BodyList>
        </div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'flex-start' }}>
          <div style={{ width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#fff', padding: 14, borderRadius: 'var(--osd-radius)', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.7)' }}>
              <div style={{ width: 172, height: 172, borderRadius: 4 }}>
                <img src={repo} alt="QR del repositorio" style={{ display: 'block', width: 172, height: 172, objectFit: 'contain' }} />
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--osd-accent)', letterSpacing: 0.3 }}>
                Repo
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.35, color: muted, marginTop: 4, fontFamily: mono }}>
                github.com/ivanovishado/mini-streamlit-demo
              </div>
            </div>
          </div>
          <div style={{ width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#fff', padding: 14, borderRadius: 'var(--osd-radius)', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.7)' }}>
              <div style={{ width: 172, height: 172, borderRadius: 4 }}>
                <img
                  src={linkedin}
                  alt="QR de LinkedIn"
                  style={{
                    display: 'block',
                    width: 172,
                    height: 172,
                    objectFit: 'contain',
                  }}
                />
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--osd-accent)', letterSpacing: 0.3 }}>
                LinkedIn
              </div>
              <div style={{ fontSize: 14, color: muted, marginTop: 4, fontFamily: mono }}>
                in/ivanovishado
              </div>
            </div>
          </div>
          <div style={{ width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#fff', padding: 14, borderRadius: 'var(--osd-radius)', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.7)' }}>
              <div style={{ width: 172, height: 172, borderRadius: 4 }}>
                <img
                  src={slidesQr}
                  alt="QR de la presentación"
                  style={{
                    display: 'block',
                    width: 172,
                    height: 172,
                    objectFit: 'contain',
                  }}
                />
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--osd-accent)', letterSpacing: 0.3 }}>
                Slides
              </div>
              <div style={{ fontSize: 14, color: muted, marginTop: 4, fontFamily: mono }}>
                Presentación
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Frame>
);

export const transition: SlideTransition = {
  duration: 200,
  exit: {
    duration: 140,
    easing: EASE_IN,
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-4px)' },
    ],
  },
  enter: {
    duration: 200,
    delay: 80,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

export const meta: SlideMeta = {
  title: 'Streamlit: de notebook a dashboard de Bitcoin',
  theme: 'udeg-gdg',
  createdAt: '2026-06-23T07:46:33.698Z',
};

export default [
  Cover,
  Presenter,
  NotebookVsApp,
  WhatIsStreamlit,
  MentalModel,
  UIPrimitives,
  WidgetsAsVariables,
  DatasetMap,
  FilterPattern,
  DashboardLayout,
  DeploymentPreview,
  Closing,
] satisfies Page[];
