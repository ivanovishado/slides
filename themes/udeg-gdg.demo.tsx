import { type DesignSystem, type Page, useSlidePageNumber } from '@open-slide/core';

export const design: DesignSystem = {
  palette: { bg: '#202945', text: '#ffffff', accent: '#FDCF85' },
  fonts: {
    display: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  typeScale: { hero: 152, body: 36 },
  radius: 8,
};

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

const CodeMark = () => (
  <div style={{ position: 'relative', width: 520, height: 280 }}>
    <div
      style={{
        position: 'absolute',
        left: 30,
        top: 58,
        width: 260,
        height: 58,
        borderRadius: 999,
        background: '#ea4335',
        transform: 'rotate(-31deg)',
        transformOrigin: 'left center',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 30,
        top: 158,
        width: 260,
        height: 58,
        borderRadius: 999,
        background: '#4285f4',
        transform: 'rotate(31deg)',
        transformOrigin: 'left center',
      }}
    />
    <div
      style={{
        position: 'absolute',
        right: 30,
        top: 58,
        width: 260,
        height: 58,
        borderRadius: 999,
        background: '#0f9d58',
        transform: 'rotate(31deg)',
        transformOrigin: 'right center',
      }}
    />
    <div
      style={{
        position: 'absolute',
        right: 30,
        top: 158,
        width: 260,
        height: 58,
        borderRadius: 999,
        background: '#fbbc04',
        transform: 'rotate(-31deg)',
        transformOrigin: 'right center',
      }}
    />
  </div>
);

const ColorRail = () => (
  <div style={{ display: 'flex', gap: 16 }}>
    <span style={{ width: 86, height: 12, background: '#4285f4', borderRadius: 999 }} />
    <span style={{ width: 86, height: 12, background: '#ea4335', borderRadius: 999 }} />
    <span style={{ width: 86, height: 12, background: '#fbbc04', borderRadius: 999 }} />
    <span style={{ width: 86, height: 12, background: '#0f9d58', borderRadius: 999 }} />
  </div>
);

const Frame = ({ children }: { children: React.ReactNode }) => (
  <section
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: '#202945',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}
  >
    <div style={{ position: 'absolute', left: 112, right: 112, top: 72, height: 4, background: '#FDCF85' }} />
    <div style={{ position: 'absolute', left: 112, top: 92 }}>
      <ColorRail />
    </div>
    <div style={{ position: 'absolute', right: -160, bottom: -240, width: 620, height: 620, border: '34px solid #FDCF85', borderRadius: 999, opacity: 0.18 }} />
    {children}
    <Footer />
  </section>
);

const Cover: Page = () => (
  <Frame>
    <div
      style={{
        position: 'absolute',
        left: 112,
        top: 226,
        width: 1130,
        display: 'flex',
        flexDirection: 'column',
        gap: 34,
      }}
    >
      <Eyebrow>Developer community</Eyebrow>
      <Title>UdeG meets GDG</Title>
      <p style={{ fontSize: 36, lineHeight: 1.5, color: '#d8dee9', maxWidth: 980, margin: 0 }}>
        A formal academic frame with sharp Google Developer Groups color accents.
      </p>
    </div>
    <div style={{ position: 'absolute', right: 150, top: 344 }}>
      <CodeMark />
    </div>
    <div style={{ position: 'absolute', left: 112, bottom: 154, width: 420, height: 18, background: '#B12028' }} />
  </Frame>
);

const Content: Page = () => (
  <Frame>
    <div
      style={{
        position: 'absolute',
        left: 112,
        right: 112,
        top: 176,
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
        gap: 86,
        alignItems: 'start',
      }}
    >
      <div>
        <Eyebrow>Session architecture</Eyebrow>
        <h2 style={{ fontSize: 92, lineHeight: 1.08, margin: '32px 0 34px', color: '#ffffff' }}>
          Academic gravity, developer velocity.
        </h2>
        <p style={{ fontSize: 36, lineHeight: 1.55, color: '#d8dee9', margin: 0, maxWidth: 850 }}>
          Use the official blue field for authority, the yellow line for hierarchy, and the four GDG colors for modular signals across sections, examples, and demos.
        </p>
      </div>
      <div
        style={{
          background: '#17213a',
          border: '4px solid #FDCF85',
          borderRadius: 8,
          padding: 44,
          boxShadow: '18px 18px 0 #B12028',
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 800, color: '#FDCF85', letterSpacing: 2.4, textTransform: 'uppercase' }}>
          Palette logic
        </div>
        <div style={{ display: 'grid', gap: 26, marginTop: 34 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '112px 1fr', gap: 24, alignItems: 'center' }}>
            <span style={{ height: 22, background: '#FDCF85' }} />
            <span style={{ fontSize: 32, color: '#ffffff' }}>Official yellow defines structure</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '112px 1fr', gap: 24, alignItems: 'center' }}>
            <span style={{ height: 22, background: '#B12028' }} />
            <span style={{ fontSize: 32, color: '#ffffff' }}>Official red carries emphasis</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '112px 1fr', gap: 24, alignItems: 'center' }}>
            <span style={{ height: 22, background: '#8F993E' }} />
            <span style={{ fontSize: 32, color: '#ffffff' }}>Olive marks secondary context</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '112px 1fr', gap: 24, alignItems: 'center' }}>
            <ColorRail />
            <span style={{ fontSize: 32, color: '#ffffff' }}>GDG colors mark modules</span>
          </div>
        </div>
      </div>
    </div>
  </Frame>
);

const Closer: Page = () => (
  <Frame>
    <div
      style={{
        position: 'absolute',
        inset: '176px 112px 132px',
        display: 'grid',
        gridTemplateColumns: '0.82fr 1.18fr',
        gap: 84,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          height: 540,
          background: '#B12028',
          border: '16px solid #FDCF85',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CodeMark />
      </div>
      <div>
        <Eyebrow>Build with community</Eyebrow>
        <h2 style={{ fontSize: 118, lineHeight: 1.03, margin: '36px 0 32px', color: '#ffffff' }}>
          Formal enough for campus. Fast enough for builders.
        </h2>
        <p style={{ fontSize: 36, lineHeight: 1.5, color: '#d8dee9', margin: 0, maxWidth: 900 }}>
          The deck should feel like a university hall wired for live code, workshops, and practical demos.
        </p>
      </div>
    </div>
  </Frame>
);

export default [Cover, Content, Closer] satisfies Page[];
