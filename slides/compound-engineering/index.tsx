import { type DesignSystem, type Page, type SlideMeta, type SlideTransition, useSlidePageNumber } from '@open-slide/core';
import ivan from './assets/ivan.jpeg';
import slide1 from './assets/slide1.jpg';
import slide4 from './assets/slide4.jpg';
import slide7 from './assets/slide7.jpg';
import slide17 from './assets/slide17.jpg';
import busFactor from './assets/bus-factor.png';
import slidesSite from './assets/slides-site.png';
import linkedin from './assets/linkedin.png';

export const design: DesignSystem = {
  palette: { bg: '#0a141c', text: '#e6edf3', accent: '#01578C' },
  fonts: {
    display: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  typeScale: { hero: 156, body: 34 },
  radius: 10,
};

const BG = '#0a141c';
const TEXT = '#e6edf3';
const PRIMARY = '#01578C';
const ACCENT = '#22d3ee';
const MUTED = '#7d93a8';
const PANEL = '#0f1e2c';
const CODE = '#0d2b3e';
const SUCCESS = '#3fb950';
const WARN = '#d29922';
const ERROR = '#f85149';

const SANS = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const MONO = 'ui-monospace, "SF Mono", "JetBrains Mono", "Fira Code", Menlo, Consolas, monospace';

// ── Theme components (from agent-console) ─────────────────────────────────

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
        fontFamily: MONO,
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: 1.4,
        color: MUTED,
        textTransform: 'uppercase',
      }}
    >
      <span>COMPOUND ENGINEERING {'// 2026'}</span>
      <span style={{ color: ACCENT }}>
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
      fontFamily: MONO,
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: 2.4,
      color: ACCENT,
      textTransform: 'uppercase',
    }}
  >
    <span style={{ color: PRIMARY }}>{'>'}</span>
    <span>{children}</span>
  </div>
);

const Frame = ({ children }: { children: React.ReactNode }) => (
  <section
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: BG,
      color: TEXT,
      fontFamily: SANS,
    }}
  >
    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: PRIMARY }} />
    {children}
    <Footer />
  </section>
);

const TerminalPanel = ({
  title,
  status = SUCCESS,
  children,
}: {
  title: string;
  status?: string;
  children: React.ReactNode;
}) => (
  <div
    style={{
      background: CODE,
      border: `2px solid ${PRIMARY}`,
      borderRadius: 10,
      padding: '28px 32px',
      fontFamily: MONO,
      color: TEXT,
      boxShadow: `0 0 0 1px rgba(2, 87, 140, 0.25), 18px 18px 0 rgba(2, 87, 140, 0.12)`,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
      <span style={{ width: 12, height: 12, borderRadius: 999, background: status }} />
      <span style={{ fontSize: 20, fontWeight: 700, color: MUTED, letterSpacing: 1.6, textTransform: 'uppercase' }}>
        {title}
      </span>
    </div>
    {children}
  </div>
);

const TraceLine = ({
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
      gridTemplateColumns: '28px 220px 1fr',
      gap: 18,
      alignItems: 'baseline',
      fontSize: 26,
      lineHeight: 1.5,
    }}
  >
    <span style={{ color: markColor, fontWeight: 700 }}>{mark}</span>
    <span style={{ color: MUTED, textTransform: 'uppercase', letterSpacing: 1.4, fontSize: 22 }}>
      {label}
    </span>
    <span style={{ color: TEXT }}>{children}</span>
  </div>
);

// ── Diagram helpers ───────────────────────────────────────────────────────

const Chevron = () => (
  <svg width="28" height="20" viewBox="0 0 28 20" fill="none" style={{ flexShrink: 0 }} role="img" aria-label="Flecha">
    <title>Flecha</title>
    <path d="M6 3 L20 10 L6 17" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LoopStep = ({ cmd, fn }: { cmd: string; fn: string }) => (
  <div
    style={{
      flex: 1,
      minWidth: 230,
      background: CODE,
      border: `2px solid ${PRIMARY}`,
      borderRadius: 10,
      padding: '22px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}
  >
    <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: ACCENT }}>{cmd}</span>
    <span style={{ fontFamily: SANS, fontSize: 23, lineHeight: 1.4, color: TEXT }}>{fn}</span>
  </div>
);

const LensCard = ({ label }: { label: string }) => (
  <div
    style={{
      background: PANEL,
      border: `1px solid ${PRIMARY}`,
      borderRadius: 8,
      padding: '28px 32px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}
  >
    <span style={{ width: 10, height: 10, borderRadius: 999, background: ACCENT, flexShrink: 0 }} />
    <span style={{ fontFamily: SANS, fontSize: 32, fontWeight: 700, color: TEXT }}>{label}</span>
  </div>
);

const NodeBox = ({ children, color = ACCENT }: { children: React.ReactNode; color?: string }) => (
  <div
    style={{
      background: CODE,
      border: `2px solid ${PRIMARY}`,
      borderRadius: 8,
      padding: '14px 22px',
      fontFamily: MONO,
      fontSize: 22,
      fontWeight: 700,
      color,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

// ── 1. Portada ────────────────────────────────────────────────────────────

const Cover: Page = () => (
  <Frame>
    <div
      style={{
        position: 'absolute',
        left: 112,
        right: 112,
        top: 170,
        display: 'grid',
        gridTemplateColumns: '1fr 680px',
        gap: 68,
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
        <h1
          style={{
            fontFamily: SANS,
            fontSize: 104,
            fontWeight: 900,
            lineHeight: 1.06,
            letterSpacing: '-0.02em',
            margin: 0,
            color: TEXT,
            maxWidth: 760,
          }}
        >
          De prompts desechables a sistemas que aprenden
        </h1>
        <p style={{ fontFamily: MONO, fontSize: 28, color: ACCENT, margin: 0, letterSpacing: 0.5 }}>
          Una introducción a Compound Engineering
        </p>
        <p style={{ fontSize: 30, lineHeight: 1.5, color: MUTED, maxWidth: 700, margin: 0 }}>
          De la interacción efímera con IA a los sistemas de ingeniería que aprenden.
        </p>
        <p style={{ fontFamily: MONO, fontSize: 22, color: MUTED, margin: '12px 0 0', letterSpacing: 1.2 }}>
          Ivan Galaviz · julio
        </p>
      </div>
      <img src={slide1} alt="De prompts desechables a un flywheel de ingeniería" style={{ width: 680, height: 548, objectFit: 'cover', borderRadius: 10 }} />
    </div>
  </Frame>
);

// ── 2. Ponente ────────────────────────────────────────────────────────────

const SpeakerIntro: Page = () => (
  <Frame>
    <div
      style={{
        position: 'absolute',
        left: 112,
        right: 112,
        top: 160,
        display: 'grid',
        gridTemplateColumns: '400px 1fr',
        gap: 80,
        alignItems: 'center',
      }}
    >
      <img src={ivan} alt="Foto del ponente" style={{ width: 400, height: 400, objectFit: 'cover', borderRadius: 10 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <Eyebrow>Ponente</Eyebrow>
        <h2 style={{ fontFamily: SANS, fontSize: 72, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.015em', margin: 0, color: TEXT }}>
          Ivan Galaviz
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <p style={{ fontSize: 32, lineHeight: 1.5, color: TEXT, margin: 0 }}>Software Engineer en Netflix</p>
          <p style={{ fontSize: 32, lineHeight: 1.5, color: TEXT, margin: 0 }}>Me gusta preocuparme por la mantenibilidad del software en este mundo AI-first</p>
        </div>
      </div>
    </div>
  </Frame>
);

// ── 3. El prompt desaparece ───────────────────────────────────────────────

const Hook: Page = () => (
  <Frame>
    <div
      style={{
        position: 'absolute',
        left: 112,
        right: 112,
        top: 200,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 80,
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        <Eyebrow>El problema</Eyebrow>
        <p style={{ fontFamily: SANS, fontSize: 64, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.015em', color: TEXT, margin: 0, maxWidth: 720 }}>
          Un prompt puede entregar código y no dejar nada detrás.
        </p>
        <div style={{ display: 'flex', gap: 32, marginTop: 8 }}>
          <span style={{ fontFamily: MONO, fontSize: 26, color: MUTED, letterSpacing: 1.2, textTransform: 'uppercase' }}>sin revisar</span>
          <span style={{ fontFamily: MONO, fontSize: 26, color: MUTED, letterSpacing: 1.2, textTransform: 'uppercase' }}>sin recuperar</span>
          <span style={{ fontFamily: MONO, fontSize: 26, color: MUTED, letterSpacing: 1.2, textTransform: 'uppercase' }}>sin mejorar</span>
        </div>
      </div>
      <TerminalPanel title="prompt · sesión desechable" status={ERROR}>
        <div style={{ display: 'grid', gap: 14, fontSize: 26, lineHeight: 1.5 }}>
          <div style={{ color: MUTED }}>$ llm "agregar rate limiting al api"</div>
          <div style={{ display: 'grid', gap: 10, marginTop: 6 }}>
            <TraceLine mark="✓" markColor={SUCCESS} label="código">247 líneas generadas</TraceLine>
            <TraceLine mark="✗" markColor={ERROR} label="intención">perdida</TraceLine>
            <TraceLine mark="✗" markColor={ERROR} label="restricciones">perdidas</TraceLine>
            <TraceLine mark="✗" markColor={ERROR} label="criterio">perdido</TraceLine>
          </div>
        </div>
      </TerminalPanel>
    </div>
  </Frame>
);

// ── 4. Deuda de contexto ──────────────────────────────────────────────────

const ContextDebt: Page = () => (
  <Frame>
    <div style={{ position: 'absolute', left: 112, right: 112, top: 140, display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <Eyebrow>Deuda de contexto</Eyebrow>
        <h2 style={{ fontFamily: SANS, fontSize: 64, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.015em', margin: 0, color: TEXT, maxWidth: 900 }}>
          Los prompts desechables crean deuda de contexto
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 600px', gap: 64, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 24, color: ACCENT, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 8 }}>Intención</div>
            <p style={{ fontSize: 30, lineHeight: 1.45, color: TEXT, margin: 0 }}>Lo que el usuario quiso decir</p>
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 24, color: ACCENT, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 8 }}>Restricciones (Guardrails)</div>
            <p style={{ fontSize: 30, lineHeight: 1.45, color: TEXT, margin: 0 }}>Lo que la solución debía respetar</p>
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 24, color: ACCENT, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 8 }}>Criterio</div>
            <p style={{ fontSize: 30, lineHeight: 1.45, color: TEXT, margin: 0 }}>Lo que hizo aceptable el resultado</p>
          </div>
        </div>
        <img src={slide4} alt="Notas y fragmentos dispersos fuera de un repositorio limpio" style={{ width: 600, height: 520, objectFit: 'cover', borderRadius: 10 }} />
      </div>
    </div>
  </Frame>
);

// ── 5. Bus factor ─────────────────────────────────────────────────────────

const BusFactor: Page = () => (
  <Frame>
    <div
      style={{
        position: 'absolute',
        left: 112,
        right: 112,
        top: 160,
        display: 'grid',
        gridTemplateColumns: '660px 1fr',
        gap: 72,
        alignItems: 'center',
      }}
    >
      <img src={busFactor} alt="Ilustración del bus factor: conocimiento concentrado en una persona" style={{ width: 660, height: 660, objectFit: 'contain', borderRadius: 10 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <Eyebrow>Riesgo</Eyebrow>
        <h2 style={{ fontFamily: SANS, fontSize: 60, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.015em', margin: 0, color: TEXT }}>
          El bus factor es un factor de contexto
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <NodeBox>arquitectura</NodeBox>
          <NodeBox>casos límite</NodeBox>
          <NodeBox>criterio de producto</NodeBox>
          <NodeBox>hábitos de despliegue</NodeBox>
          <NodeBox>criterio de revisión</NodeBox>
        </div>
        <p style={{ fontSize: 30, lineHeight: 1.5, color: MUTED, margin: 0, maxWidth: 620 }}>
          La dependencia real rara vez es de acceso o de habilidad. Es de contexto: quién sabe por qué las cosas son como son.
        </p>
      </div>
    </div>
  </Frame>
);

// ── 6. La IA puede empeorar esto ──────────────────────────────────────────

const AIWorse: Page = () => (
  <Frame>
    <div style={{ position: 'absolute', left: 112, right: 112, top: 150, display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <Eyebrow>El riesgo se agrava</Eyebrow>
        <h2 style={{ fontFamily: SANS, fontSize: 72, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.015em', margin: 0, color: TEXT }}>
          La IA puede empeorar esto
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div style={{ background: PANEL, border: `1px solid ${MUTED}`, borderRadius: 10, padding: '40px 36px' }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: MUTED, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 20 }}>Antes</div>
          <p style={{ fontSize: 34, lineHeight: 1.45, color: TEXT, margin: 0 }}>Conocimiento tribal entre humanos</p>
        </div>
        <div style={{ background: CODE, border: `2px solid ${ERROR}`, borderRadius: 10, padding: '40px 36px' }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: ERROR, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 20 }}>Después</div>
          <p style={{ fontSize: 34, lineHeight: 1.45, color: TEXT, margin: 0 }}>Humano y IA con contexto desechable</p>
        </div>
      </div>
      <p style={{ fontSize: 32, lineHeight: 1.5, color: ACCENT, margin: 0, maxWidth: 1100 }}>
        Más rendimiento no significa automáticamente más aprendizaje.
      </p>
    </div>
  </Frame>
);

// ── 7. Second Brain ───────────────────────────────────────────────────────

const SecondBrain: Page = () => (
  <Frame>
    <div
      style={{
        position: 'absolute',
        left: 112,
        right: 112,
        top: 160,
        display: 'grid',
        gridTemplateColumns: '1fr 620px',
        gap: 72,
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <Eyebrow>Un puente familiar</Eyebrow>
        <h2 style={{ fontFamily: SANS, fontSize: 60, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.015em', margin: 0, color: TEXT }}>
          Una idea familiar: el Second Brain
        </h2>
        <p style={{ fontSize: 38, lineHeight: 1.45, color: TEXT, margin: 0, maxWidth: 680 }}>
          Externaliza el conocimiento para que tu yo del futuro lo pueda reusar.
        </p>
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          <NodeBox>capturar</NodeBox>
          <NodeBox>organizar</NodeBox>
          <NodeBox>destilar</NodeBox>
          <NodeBox>expresar</NodeBox>
        </div>
      </div>
      <img src={slide7} alt="Notas expandiéndose en un grafo de conocimiento" style={{ width: 620, height: 520, objectFit: 'cover', borderRadius: 10 }} />
    </div>
  </Frame>
);

// ── 8. Second Brain de ingeniería ─────────────────────────────────────────

const EngSecondBrain: Page = () => (
  <Frame>
    <div style={{ position: 'absolute', left: 112, right: 112, top: 150, display: 'flex', flexDirection: 'column', gap: 44 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <Eyebrow>El siguiente paso</Eyebrow>
        <h2 style={{ fontFamily: SANS, fontSize: 56, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.015em', margin: 0, color: TEXT, maxWidth: 1100 }}>
          Los equipos necesitan un Second Brain de ingeniería
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div style={{ background: PANEL, border: `1px solid ${MUTED}`, borderRadius: 10, padding: '40px 36px' }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: MUTED, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 24 }}>Personal</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{ fontSize: 32, color: TEXT }}>capturar</span>
            <span style={{ fontSize: 32, color: TEXT }}>organizar</span>
            <span style={{ fontSize: 32, color: TEXT }}>destilar</span>
            <span style={{ fontSize: 32, color: TEXT }}>expresar</span>
          </div>
        </div>
        <div style={{ background: CODE, border: `2px solid ${PRIMARY}`, borderRadius: 10, padding: '40px 36px' }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: ACCENT, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 24 }}>Ingeniería</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{ fontSize: 32, color: TEXT }}>planear</span>
            <span style={{ fontSize: 32, color: TEXT }}>codificar</span>
            <span style={{ fontSize: 32, color: TEXT }}>verificar</span>
            <span style={{ fontSize: 32, color: TEXT }}>reusar</span>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 32, lineHeight: 1.5, color: ACCENT, margin: 0 }}>
        El repositorio debería recordar cómo piensa el equipo.
      </p>
    </div>
  </Frame>
);

// ── 9. La pregunta central ────────────────────────────────────────────────

const CoreQuestion: Page = () => (
  <Frame>
    <div
      style={{
        position: 'absolute',
        left: 112,
        right: 112,
        top: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 40,
      }}
    >
      <Eyebrow>La pregunta central</Eyebrow>
      <h2 style={{ fontFamily: SANS, fontSize: 68, fontWeight: 800, lineHeight: 1.22, letterSpacing: '-0.015em', margin: 0, color: TEXT, maxWidth: 1300 }}>
        ¿Qué significaría que cada tarea de ingeniería hiciera más fácil la siguiente?
      </h2>
      <div style={{ width: 120, height: 4, background: PRIMARY }} />
    </div>
  </Frame>
);

// ── 10. Interés compuesto ─────────────────────────────────────────────────

const CompoundInvesting: Page = () => (
  <Frame>
    <div style={{ position: 'absolute', left: 112, right: 112, top: 140, display: 'flex', flexDirection: 'column', gap: 36 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Eyebrow>El modelo mental</Eyebrow>
        <h2 style={{ fontFamily: SANS, fontSize: 60, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.015em', margin: 0, color: TEXT, maxWidth: 1000 }}>
          El interés compuesto requiere reinversión
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '660px 1fr', gap: 64, alignItems: 'center' }}>
        <svg width="660" height="400" viewBox="0 0 660 400" style={{ display: 'block' }} role="img" aria-label="Crecimiento lineal vs compuesto">
          <title>Crecimiento lineal vs compuesto</title>
          <line x1="50" y1="30" x2="50" y2="360" stroke={MUTED} strokeWidth="1.5" opacity="0.4" />
          <line x1="50" y1="360" x2="640" y2="360" stroke={MUTED} strokeWidth="1.5" opacity="0.4" />
          <polyline points="50,360 640,160" fill="none" stroke={MUTED} strokeWidth="3" />
          <polyline points="50,360 150,358 250,350 350,330 450,290 530,210 600,100 640,20" fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <text x="380" y="225" fontFamily={MONO} fontSize="20" fill={MUTED}>lineal</text>
          <text x="550" y="135" fontFamily={MONO} fontSize="20" fill={ACCENT}>compuesto</text>
          <text x="300" y="390" fontFamily={MONO} fontSize="18" fill={MUTED} textAnchor="middle">tiempo</text>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 24, color: ACCENT, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 8 }}>Capital</div>
            <p style={{ fontSize: 30, lineHeight: 1.45, color: TEXT, margin: 0 }}>Contexto del proyecto</p>
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 24, color: ACCENT, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 8 }}>Retorno</div>
            <p style={{ fontSize: 30, lineHeight: 1.45, color: TEXT, margin: 0 }}>Trabajo resuelto</p>
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 24, color: ACCENT, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 8 }}>Reinversión</div>
            <p style={{ fontSize: 30, lineHeight: 1.45, color: TEXT, margin: 0 }}>Artefactos durables</p>
          </div>
        </div>
      </div>
    </div>
  </Frame>
);

// ── 11. Compound Engineering definido ─────────────────────────────────────

const CompoundEngDefined: Page = () => (
  <Frame>
    <div style={{ position: 'absolute', left: 112, right: 112, top: 130, display: 'flex', flexDirection: 'column', gap: 36 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Eyebrow>La definición</Eyebrow>
        <h2 style={{ fontFamily: SANS, fontSize: 80, fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.02em', margin: 0, color: TEXT }}>
          Compound Engineering
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 64, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <p style={{ fontSize: 38, lineHeight: 1.4, color: TEXT, margin: 0, maxWidth: 760 }}>
            Cada unidad de trabajo de ingeniería debería hacer más fáciles las siguientes sesiones, no más difíciles.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: ACCENT, flexShrink: 0 }} />
              <span style={{ fontSize: 30, color: TEXT }}>Codificar decisiones</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: ACCENT, flexShrink: 0 }} />
              <span style={{ fontSize: 30, color: TEXT }}>Automatizar verificaciones</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: ACCENT, flexShrink: 0 }} />
              <span style={{ fontSize: 30, color: TEXT }}>Preservar criterio</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: ACCENT, flexShrink: 0 }} />
              <span style={{ fontSize: 30, color: TEXT }}>Recuperar soluciones pasadas</span>
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', width: 380, height: 380, margin: '0 auto' }}>
          <svg width="380" height="380" viewBox="0 0 380 380" style={{ position: 'absolute', inset: 0 }} role="img" aria-label="Flywheel: Planear, Trabajar, Revisar, Compound">
            <title>Flywheel: Planear, Trabajar, Revisar, Compound</title>
            <circle cx="190" cy="190" r="150" fill="none" stroke={PRIMARY} strokeWidth="2" strokeDasharray="6 8" opacity="0.6" />
            <path d="M190 30 L200 42 L180 42 Z" fill={ACCENT} />
            <path d="M350 190 L338 200 L338 180 Z" fill={ACCENT} />
            <path d="M190 350 L180 338 L200 338 Z" fill={ACCENT} />
            <path d="M30 190 L42 180 L42 200 Z" fill={ACCENT} />
          </svg>
          <div style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)' }}>
            <NodeBox>Planear</NodeBox>
          </div>
          <div style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)' }}>
            <NodeBox>Trabajar</NodeBox>
          </div>
          <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)' }}>
            <NodeBox>Revisar</NodeBox>
          </div>
          <div style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)' }}>
            <NodeBox>Compound</NodeBox>
          </div>
        </div>
      </div>
    </div>
  </Frame>
);

// ── 12. El ciclo de habilidades ───────────────────────────────────────────

const SkillLoop: Page = () => (
  <Frame>
    <div style={{ position: 'absolute', left: 112, right: 112, top: 142, display: 'flex', flexDirection: 'column', gap: 42 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <h2 style={{ fontFamily: SANS, fontSize: 64, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.015em', margin: 0, color: TEXT }}>
          El ciclo que puedes probar
        </h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <LoopStep cmd="/ce-brainstorm" fn="clarificar qué construir" />
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}><Chevron /></div>
        <LoopStep cmd="/ce-plan" fn="capturar cómo construirlo" />
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}><Chevron /></div>
        <LoopStep cmd="/ce-work" fn="ejecutar contra el plan" />
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}><Chevron /></div>
        <LoopStep cmd="/ce-review" fn="escalar crítica y hallar huecos" />
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}><Chevron /></div>
        <LoopStep cmd="/ce-compound" fn="documentar lo aprendido" />
      </div>
      <a
        href="https://github.com/everyinc/compound-engineering-plugin"
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: 28,
          alignItems: 'center',
          maxWidth: 1280,
          background: CODE,
          border: `2px solid ${ACCENT}`,
          borderRadius: 10,
          padding: '24px 30px',
          color: TEXT,
          textDecoration: 'none',
          boxShadow: `14px 14px 0 rgba(34, 211, 238, 0.1)`,
        }}
        target='_blank'
        rel='noopener noreferrer'
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: MONO, fontSize: 22, fontWeight: 800, color: ACCENT, letterSpacing: 1.8, textTransform: 'uppercase' }}>
          <span style={{ width: 12, height: 12, borderRadius: 999, background: SUCCESS }} />
          Fuente práctica
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 34, fontWeight: 800, color: TEXT }}>
            Plugin de Compound Engineering de Every
          </span>
          <span style={{ fontFamily: MONO, fontSize: 20, color: MUTED }}>
            github.com/EveryInc/compound-engineering-plugin · el camino más rápido para probar este workflow
          </span>
        </span>
      </a>
      <p style={{ fontSize: 32, lineHeight: 1.5, color: ACCENT, margin: 0 }}>
        No te detengas en el código generado. Termina con un artefacto reutilizable.
      </p>
    </div>
  </Frame>
);

// ── 13. De prompts a sistemas ─────────────────────────────────────────────

const PromptsToSystems: Page = () => (
  <Frame>
    <div style={{ position: 'absolute', left: 112, right: 112, top: 150, display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Eyebrow>El cambio arquitectónico</Eyebrow>
        <h2 style={{ fontFamily: SANS, fontSize: 72, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.015em', margin: 0, color: TEXT }}>
          De prompts a sistemas
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div style={{ background: PANEL, border: `1px solid ${MUTED}`, borderRadius: 10, padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: MUTED, letterSpacing: 1.4, textTransform: 'uppercase' }}>Cadena de prompts</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }}>
            <NodeBox color={MUTED}>prompt</NodeBox>
            <div style={{ width: 2, height: 20, background: MUTED, marginLeft: 40 }} />
            <NodeBox color={MUTED}>modelo</NodeBox>
            <div style={{ width: 2, height: 20, background: MUTED, marginLeft: 40 }} />
            <NodeBox color={MUTED}>código</NodeBox>
          </div>
        </div>
        <div style={{ background: CODE, border: `2px solid ${PRIMARY}`, borderRadius: 10, padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: ACCENT, letterSpacing: 1.4, textTransform: 'uppercase' }}>Sistema que aprende</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <NodeBox>instrucciones</NodeBox>
            <NodeBox>planes</NodeBox>
            <NodeBox>código</NodeBox>
            <NodeBox>pruebas</NodeBox>
            <NodeBox>revisores</NodeBox>
            <NodeBox>docs</NodeBox>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <Chevron />
            <NodeBox color={ACCENT}>siguiente tarea</NodeBox>
          </div>
        </div>
      </div>
    </div>
  </Frame>
);

// ── 14. Plan ──────────────────────────────────────────────────────────────

const Plan: Page = () => (
  <Frame>
    <div style={{ position: 'absolute', left: 112, right: 112, top: 150, display: 'flex', flexDirection: 'column', gap: 44 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Eyebrow>Planear</Eyebrow>
        <h2 style={{ fontFamily: SANS, fontSize: 64, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.015em', margin: 0, color: TEXT }}>
          El plan preserva la intención
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        <div style={{ background: CODE, border: `2px solid ${PRIMARY}`, borderRadius: 10, padding: '32px 28px', minHeight: 200, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: ACCENT }}>01</span>
          <span style={{ fontSize: 30, color: TEXT }}>Requisitos</span>
        </div>
        <div style={{ background: CODE, border: `2px solid ${PRIMARY}`, borderRadius: 10, padding: '32px 28px', minHeight: 200, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: ACCENT }}>02</span>
          <span style={{ fontSize: 30, color: TEXT }}>Restricciones</span>
        </div>
        <div style={{ background: CODE, border: `2px solid ${PRIMARY}`, borderRadius: 10, padding: '32px 28px', minHeight: 200, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: ACCENT }}>03</span>
          <span style={{ fontSize: 30, color: TEXT }}>Tradeoffs</span>
        </div>
        <div style={{ background: CODE, border: `2px solid ${PRIMARY}`, borderRadius: 10, padding: '32px 28px', minHeight: 200, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: ACCENT }}>04</span>
          <span style={{ fontSize: 30, color: TEXT }}>Criterios de éxito</span>
        </div>
      </div>
      <p style={{ fontSize: 32, lineHeight: 1.5, color: ACCENT, margin: 0 }}>
        Un plan es un paquete de contexto.
      </p>
    </div>
  </Frame>
);

// ── 15. Trabajo ───────────────────────────────────────────────────────────

const Work: Page = () => (
  <Frame>
    <div
      style={{
        position: 'absolute',
        left: 112,
        right: 112,
        top: 170,
        display: 'grid',
        gridTemplateColumns: '1fr 620px',
        gap: 64,
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <Eyebrow>Trabajar</Eyebrow>
        <h2 style={{ fontFamily: SANS, fontSize: 64, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.015em', margin: 0, color: TEXT }}>
          El trabajo consume el plan
        </h2>
        <p style={{ fontSize: 32, lineHeight: 1.5, color: MUTED, margin: 0, maxWidth: 620 }}>
          El agente lee el repositorio, se adapta a lo que descubre y verifica el comportamiento. El plan mantiene la tarea orientada hacia la meta correcta.
        </p>
      </div>
      <TerminalPanel title="/ce-work · ejecución">
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ color: MUTED, fontSize: 24 }}>$ /ce-work --plan plans/rate-limiting.md</div>
          <div style={{ display: 'grid', gap: 10, marginTop: 6 }}>
            <TraceLine mark="✓" markColor={SUCCESS} label="branch">feat/rate-limiting creado</TraceLine>
            <TraceLine mark="✓" markColor={SUCCESS} label="implementación">12 archivos modificados</TraceLine>
            <TraceLine mark="✓" markColor={SUCCESS} label="pruebas">34 pasaron, 0 fallaron</TraceLine>
            <TraceLine mark="•" markColor={WARN} label="adaptación">2 supuestos del plan corregidos</TraceLine>
            <TraceLine mark="✓" markColor={SUCCESS} label="resultado">listo para merge</TraceLine>
          </div>
        </div>
      </TerminalPanel>
    </div>
  </Frame>
);

// ── 16. Revisión ──────────────────────────────────────────────────────────

const Review: Page = () => (
  <Frame>
    <div style={{ position: 'absolute', left: 112, right: 112, top: 150, display: 'flex', flexDirection: 'column', gap: 44 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Eyebrow>Revisar</Eyebrow>
        <h2 style={{ fontFamily: SANS, fontSize: 64, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.015em', margin: 0, color: TEXT }}>
          La revisión escala el escepticismo
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        <LensCard label="Corrección" />
        <LensCard label="Pruebas" />
        <LensCard label="Mantenibilidad" />
        <LensCard label="Seguridad" />
        <LensCard label="Rendimiento" />
        <LensCard label="Arquitectura" />
      </div>
      <p style={{ fontSize: 30, lineHeight: 1.5, color: MUTED, margin: 0, maxWidth: 1100 }}>
        El objetivo no es solo que el agente escriba código. Es que investigue, corrija y llegue a revisión con hallazgos ya resueltos: de manos extra a equipo operativo.
      </p>
    </div>
  </Frame>
);

// ── 17. Compound: reinvertir ──────────────────────────────────────────────

const Compound: Page = () => (
  <Frame>
    <div
      style={{
        position: 'absolute',
        left: 112,
        right: 112,
        top: 150,
        display: 'grid',
        gridTemplateColumns: '1fr 460px',
        gap: 56,
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <Eyebrow>Compound</Eyebrow>
          <h2 style={{ fontFamily: SANS, fontSize: 60, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.015em', margin: 0, color: TEXT }}>
            Compound significa reinvertir
          </h2>
        </div>
        <TerminalPanel title="/ce-compound · reinversión">
          <div style={{ display: 'grid', gap: 10 }}>
            <TraceLine mark="✓" markColor={SUCCESS} label="bug recurrente">test de regresión</TraceLine>
            <TraceLine mark="✓" markColor={SUCCESS} label="hallazgo de revisión">instrucción en AGENTS.md / CLAUDE.md</TraceLine>
            <TraceLine mark="✓" markColor={SUCCESS} label="decisión costosa">doc de patrón buscable</TraceLine>
            <TraceLine mark="✓" markColor={SUCCESS} label="workaround">nota en docs/solutions con metadata</TraceLine>
            <TraceLine mark="✓" markColor={SUCCESS} label="fricción de flujo">mejora de workflow</TraceLine>
          </div>
        </TerminalPanel>
      </div>
      <img src={slide17} alt="Insights depositándose en un almacén de memoria" style={{ width: 460, height: 440, objectFit: 'cover', borderRadius: 10 }} />
    </div>
  </Frame>
);

// ── 18. ADRs ──────────────────────────────────────────────────────────────

const ADR: Page = () => (
  <Frame>
    <div style={{ position: 'absolute', left: 112, right: 112, top: 120, display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Eyebrow>ADRs</Eyebrow>
        <h2 style={{ fontFamily: SANS, fontSize: 60, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.015em', margin: 0, color: TEXT }}>
          Decisiones que duran
        </h2>
        <p style={{ fontSize: 30, lineHeight: 1.45, color: MUTED, margin: 0, maxWidth: 1040 }}>
          Un Architecture Decision Record captura una decisión importante junto con su contexto y sus consecuencias.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 590px', gap: 56, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div style={{ background: PANEL, border: `1px solid ${PRIMARY}`, borderRadius: 8, padding: '20px 22px' }}>
              <div style={{ fontFamily: MONO, fontSize: 20, color: ACCENT, letterSpacing: 1.4, textTransform: 'uppercase' }}>Contexto</div>
              <p style={{ fontSize: 25, lineHeight: 1.35, color: TEXT, margin: '6px 0 0' }}>El problema y la situación</p>
            </div>
            <div style={{ background: PANEL, border: `1px solid ${PRIMARY}`, borderRadius: 8, padding: '20px 22px' }}>
              <div style={{ fontFamily: MONO, fontSize: 20, color: ACCENT, letterSpacing: 1.4, textTransform: 'uppercase' }}>Decisión</div>
              <p style={{ fontSize: 25, lineHeight: 1.35, color: TEXT, margin: '6px 0 0' }}>La elección tomada</p>
            </div>
            <div style={{ background: PANEL, border: `1px solid ${PRIMARY}`, borderRadius: 8, padding: '20px 22px' }}>
              <div style={{ fontFamily: MONO, fontSize: 20, color: ACCENT, letterSpacing: 1.4, textTransform: 'uppercase' }}>Estado</div>
              <p style={{ fontSize: 25, lineHeight: 1.35, color: TEXT, margin: '6px 0 0' }}>Propuesto, aceptado, reemplazado</p>
            </div>
            <div style={{ background: PANEL, border: `1px solid ${PRIMARY}`, borderRadius: 8, padding: '20px 22px' }}>
              <div style={{ fontFamily: MONO, fontSize: 20, color: ACCENT, letterSpacing: 1.4, textTransform: 'uppercase' }}>Consecuencias</div>
              <p style={{ fontSize: 25, lineHeight: 1.35, color: TEXT, margin: '6px 0 0' }}>Lo que sigue de la decisión</p>
            </div>
          </div>
          <p style={{ fontSize: 25, lineHeight: 1.45, color: MUTED, margin: 0 }}>
            Los ADRs son inmutables: no se editan, se reemplazan con uno nuevo. La historia de decisiones queda trazable.
          </p>
          <div style={{ background: CODE, border: `2px solid ${PRIMARY}`, borderRadius: 10, padding: '24px 28px' }}>
            <p style={{ fontSize: 28, lineHeight: 1.35, color: ACCENT, margin: 0 }}>
              Un ADR nace en /ce-plan, se revisa en /ce-review, y se consolida en /ce-compound como artefacto durable del repositorio.
            </p>
          </div>
        </div>
        <TerminalPanel title="docs/adr/0007-usar-postgres.md" status={SUCCESS}>
          <div style={{ display: 'grid', gap: 12, fontSize: 22, lineHeight: 1.42 }}>
            <div style={{ color: MUTED }}># 0007. Usar Postgres para auditoría</div>
            <div style={{ color: ACCENT, fontSize: 21 }}>estado: aceptado · reemplaza 0004</div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 18, color: MUTED, textTransform: 'uppercase', letterSpacing: 1.2 }}>Contexto</div>
              <div style={{ color: TEXT, marginTop: 4 }}>Replay inmutable de eventos de auditoría</div>
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 18, color: MUTED, textTransform: 'uppercase', letterSpacing: 1.2 }}>Decisión</div>
              <div style={{ color: TEXT, marginTop: 4 }}>Postgres con partitioning por fecha</div>
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 18, color: MUTED, textTransform: 'uppercase', letterSpacing: 1.2 }}>Consecuencias</div>
              <div style={{ color: SUCCESS, marginTop: 4 }}>+ consultas SQL estándar</div>
              <div style={{ color: ERROR, marginTop: 4 }}>- mayor costo de almacenamiento</div>
            </div>
          </div>
        </TerminalPanel>
      </div>
    </div>
  </Frame>
);

// ── 19. Memoria del sistema ───────────────────────────────────────────────

const SystemMemory: Page = () => (
  <Frame>
    <div style={{ position: 'absolute', left: 112, right: 112, top: 150, display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Eyebrow>Memoria</Eyebrow>
        <h2 style={{ fontFamily: SANS, fontSize: 56, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.015em', margin: 0, color: TEXT, maxWidth: 1200 }}>
          La memoria del sistema le gana a la humana
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div style={{ background: PANEL, border: `1px solid ${MUTED}`, borderRadius: 10, padding: '36px 32px' }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: MUTED, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 24 }}>Memoria humana</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <span style={{ fontSize: 30, color: TEXT }}>no disponible</span>
            <span style={{ fontSize: 30, color: TEXT }}>inconsistente</span>
            <span style={{ fontSize: 30, color: TEXT }}>difícil de transferir</span>
            <span style={{ fontSize: 30, color: TEXT }}>inaccesible para agentes</span>
          </div>
        </div>
        <div style={{ background: CODE, border: `2px solid ${PRIMARY}`, borderRadius: 10, padding: '36px 32px' }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: ACCENT, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 24 }}>Memoria del sistema</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <span style={{ fontSize: 30, color: TEXT }}>buscable</span>
            <span style={{ fontSize: 30, color: TEXT }}>revisable</span>
            <span style={{ fontSize: 30, color: TEXT }}>ejecutable</span>
            <span style={{ fontSize: 30, color: TEXT }}>compartida por humanos y agentes</span>
          </div>
        </div>
      </div>
    </div>
  </Frame>
);

// ── 20. Escala de adopción ────────────────────────────────────────────────

const AdoptionLadder: Page = () => (
  <Frame>
    <div style={{ position: 'absolute', left: 112, right: 112, top: 150, display: 'flex', flexDirection: 'column', gap: 44 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Eyebrow>Adopción</Eyebrow>
        <h2 style={{ fontFamily: SANS, fontSize: 64, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.015em', margin: 0, color: TEXT }}>
          Empieza paso a paso
        </h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, background: CODE, border: `2px solid ${PRIMARY}`, borderRadius: 8, padding: '18px 28px', width: 640 }}>
          <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: ACCENT }}>1</span>
          <span style={{ fontSize: 28, color: TEXT }}>Instrucciones de proyecto</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, background: CODE, border: `2px solid ${PRIMARY}`, borderRadius: 8, padding: '18px 28px', width: 740, marginLeft: 40 }}>
          <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: ACCENT }}>2</span>
          <span style={{ fontSize: 28, color: TEXT }}>Planear trabajo no trivial</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, background: CODE, border: `2px solid ${PRIMARY}`, borderRadius: 8, padding: '18px 28px', width: 840, marginLeft: 80 }}>
          <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: ACCENT }}>3</span>
          <span style={{ fontSize: 28, color: TEXT }}>Revisión automatizada</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, background: CODE, border: `2px solid ${PRIMARY}`, borderRadius: 8, padding: '18px 28px', width: 940, marginLeft: 120 }}>
          <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: ACCENT }}>4</span>
          <span style={{ fontSize: 28, color: TEXT }}>Documentar problemas resueltos</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, background: CODE, border: `2px solid ${ACCENT}`, borderRadius: 8, padding: '18px 28px', width: 1040, marginLeft: 160 }}>
          <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, color: ACCENT }}>5</span>
          <span style={{ fontSize: 28, color: TEXT }}>Correr el ciclo completo en tareas acotadas</span>
        </div>
      </div>
    </div>
  </Frame>
);

// ── 21. Cierre ────────────────────────────────────────────────────────────

const Close: Page = () => (
  <Frame>
    <div
      style={{
        position: 'absolute',
        left: 112,
        right: 112,
        top: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 40,
      }}
    >
      <Eyebrow>El ROI real</Eyebrow>
      <h2 style={{ fontFamily: SANS, fontSize: 96, fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.02em', margin: 0, color: TEXT, maxWidth: 1500 }}>
        Debemos apuntar a crear sistemas que suban la vara después de cada feature.
      </h2>
      <div style={{ width: 120, height: 4, background: PRIMARY }} />
      <p style={{ fontSize: 34, lineHeight: 1.5, color: ACCENT, margin: 0, fontFamily: MONO, letterSpacing: 0.5 }}>
        Menos contexto desechable. Menor bus factor. Mejor siguiente cambio.
      </p>
    </div>
  </Frame>
);

// ── 22. Outro ─────────────────────────────────────────────────────────────

const Outro: Page = () => (
  <Frame>
    <div style={{ position: 'absolute', left: 112, right: 112, top: 150, display: 'flex', flexDirection: 'column', gap: 44 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <h2 style={{ fontFamily: SANS, fontSize: 64, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.015em', margin: 0, color: TEXT }}>
          Links y siguientes pasos
        </h2>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 96 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ background: '#ffffff', padding: 24, borderRadius: 10 }}>
            <img src={slidesSite} alt="QR code de la presentación" style={{ width: 320, height: 320, objectFit: 'contain', display: 'block' }} />
          </div>
          <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, color: ACCENT, letterSpacing: 1.6, textTransform: 'uppercase' }}>Presentación</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ background: '#ffffff', padding: 24, borderRadius: 10 }}>
            <img src={linkedin} alt="QR code de LinkedIn" style={{ width: 320, height: 320, objectFit: 'contain', display: 'block' }} />
          </div>
          <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, color: ACCENT, letterSpacing: 1.6, textTransform: 'uppercase' }}>LinkedIn</span>
        </div>
      </div>
      <p style={{ fontSize: 34, lineHeight: 1.5, color: ACCENT, margin: 0 }}>
        Prueba el ciclo en una feature real esta semana.
      </p>
    </div>
  </Frame>
);

// ── Transición (RISE — sutil) ─────────────────────────────────────────────

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

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

// ── Meta ──────────────────────────────────────────────────────────────────

export const meta: SlideMeta = {
  title: 'Compound Engineering',
  createdAt: '2026-07-01T06:26:34.856Z',
  theme: 'agent-console',
};

export default [
  Cover,
  SpeakerIntro,
  Hook,
  ContextDebt,
  BusFactor,
  AIWorse,
  SecondBrain,
  EngSecondBrain,
  CoreQuestion,
  CompoundInvesting,
  CompoundEngDefined,
  SkillLoop,
  PromptsToSystems,
  Plan,
  Work,
  Review,
  Compound,
  ADR,
  SystemMemory,
  AdoptionLadder,
  Close,
  Outro,
] satisfies Page[];
