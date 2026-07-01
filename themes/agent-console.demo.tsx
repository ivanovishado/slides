import { type DesignSystem, type Page, useSlidePageNumber } from '@open-slide/core';

export const design: DesignSystem = {
  palette: { bg: '#0a141c', text: '#e6edf3', accent: '#01578C' },
  fonts: {
    display: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  typeScale: { hero: 156, body: 34 },
  radius: 10,
};

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

const Line = ({
  mark,
  markColor,
  label,
  children,
}: {
  mark: string;
  markColor: string;
  label: string;
  children: React.ReactNode;
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '24px 150px 1fr',
      gap: 18,
      alignItems: 'baseline',
      fontSize: 26,
      lineHeight: 1.5,
    }}
  >
    <span style={{ color: markColor, fontWeight: 700 }}>{mark}</span>
    <span
      style={{
        color: '#7d93a8',
        textTransform: 'uppercase',
        letterSpacing: 1.4,
        fontSize: 22,
      }}
    >
      {label}
    </span>
    <span style={{ color: '#e6edf3' }}>{children}</span>
  </div>
);

const Frame = ({ children }: { children: React.ReactNode }) => (
  <section
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: '#0a141c',
      color: '#e6edf3',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 6,
        background: '#01578C',
      }}
    />
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
        right: 112,
        top: 200,
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
        gap: 96,
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <Eyebrow>Agentic systems</Eyebrow>
        <Title>Agents that ship</Title>
        <p
          style={{
            fontSize: 34,
            lineHeight: 1.5,
            color: '#7d93a8',
            maxWidth: 760,
            margin: 0,
          }}
        >
          A practical architecture for AI that perceives, reasons, and acts — without losing the plot.
        </p>
      </div>
      <TerminalPanel title="agent loop · live">
        <div style={{ display: 'grid', gap: 12 }}>
          <Line mark="✓" markColor="#3fb950" label="perceive">
            user intent parsed
          </Line>
          <Line mark="•" markColor="#d29922" label="reason">
            plan: 3 steps
          </Line>
          <Line mark="→" markColor="#22d3ee" label="act">
            tool: search(...)
          </Line>
          <Line mark="✓" markColor="#3fb950" label="observe">
            12 results
          </Line>
          <Line mark="•" markColor="#d29922" label="reason">
            step 2 of 3
          </Line>
        </div>
      </TerminalPanel>
    </div>
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
        gridTemplateColumns: '0.95fr 1.05fr',
        gap: 88,
        alignItems: 'start',
      }}
    >
      <div>
        <Eyebrow>Loop anatomy</Eyebrow>
        <h2
          style={{
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSize: 84,
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: '-0.01em',
            margin: '30px 0 32px',
            color: '#e6edf3',
          }}
        >
          One loop, three primitives.
        </h2>
        <p
          style={{
            fontSize: 34,
            lineHeight: 1.55,
            color: '#7d93a8',
            margin: 0,
            maxWidth: 760,
          }}
        >
          Perceive, reason, act. Every agent framework collapses into this cycle — the engineering question is what you let live inside it.
        </p>
      </div>
      <TerminalPanel title="trace · run #0142" status="#d29922">
        <div style={{ display: 'grid', gap: 12 }}>
          <Line mark="•" markColor="#d29922" label="plan">
            decompose goal
          </Line>
          <Line mark="✓" markColor="#3fb950" label="tool">
            search.run → 12 hits
          </Line>
          <Line mark="✓" markColor="#3fb950" label="tool">
            db.query → 3 rows
          </Line>
          <Line mark="!" markColor="#f85149" label="tool">
            rate limited, retry
          </Line>
          <Line mark="✓" markColor="#3fb950" label="tool">
            retry ok
          </Line>
          <Line mark="✓" markColor="#3fb950" label="done">
            3 / 3 steps
          </Line>
        </div>
      </TerminalPanel>
    </div>
  </Frame>
);

const Closer: Page = () => (
  <Frame>
    <div
      style={{
        position: 'absolute',
        inset: '200px 112px 132px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 32,
      }}
    >
      <Eyebrow>End</Eyebrow>
      <h2
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: 132,
          fontWeight: 900,
          lineHeight: 1.04,
          letterSpacing: '-0.015em',
          margin: 0,
          color: '#e6edf3',
        }}
      >
        Ship the agent.
      </h2>
      <p
        style={{
          fontSize: 34,
          lineHeight: 1.5,
          color: '#7d93a8',
          maxWidth: 900,
          margin: 0,
        }}
      >
        Keep the loop tight, the tools honest, and the trace readable. Questions?
      </p>
    </div>
  </Frame>
);

export default [Cover, Content, Closer] satisfies Page[];
