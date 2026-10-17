import type { Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { MorphElement, Step, Steps } from '@open-slide/core';
import imgIvan from './assets/ivan.jpeg';
import imgQrSlides from './assets/qr-slides.png';
import imgQrLinkedin from './assets/qr-linkedin.png';
import imgQrX from './assets/qr-x.png';
import imgBusFactor from './assets/bus-factor.png';

// Ported 1:1 from a Claude Slides artifact (https://claude.ai/artifact/4wHJ17F6PuQBR7tbpo6mZm).
// Markup keeps the artifact's inline styles; BASE_CSS reproduces that runtime's element defaults.

const FONT_HREFS: string[] = [
  'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400..700;1,400..700&display=swap',
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400..700&display=swap',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400..700&display=swap',
];

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
    return (
      <span style={{ display: 'block', flexShrink: 0, width, height: h, background: color, borderRadius: radius }} />
    );
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
      ? [
          [x1, y1],
          [(x1 + x2) / 2, y1],
          [(x1 + x2) / 2, y2],
          [x2, y2],
        ]
      : route === 'hv'
        ? [
            [x1, y1],
            [x2, y1],
            [x2, y2],
          ]
        : route === 'vh'
          ? [
              [x1, y1],
              [x1, y2],
              [x2, y2],
            ]
          : [
              [x1, y1],
              [x2, y2],
            ];
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
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={dashed ? `${stroke * 3} ${stroke * 2}` : undefined}
      />
      {head !== 'none' && <polygon points={arrow(pts[n - 1], pts[n - 2])} fill={color} />}
      {head === 'both' && <polygon points={arrow(pts[0], pts[1])} fill={color} />}
    </svg>
  );
};

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

export const transition: SlideTransition = {
  duration: 240,
  // Held exit + opacity-only enter, so the morphing elements carry all the motion (open-slide morph rules).
  exit: { duration: 240, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: { duration: 240, easing: EASE_OUT, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
  morph: { duration: 480, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
};

const EMBED_COVER =
  "<!doctype html><html><head><meta charset=\"utf-8\"></head><body style=\"margin:0;background:#141210;overflow:hidden\"><canvas id=\"c\" style=\"display:block;width:100vw;height:100vh\"></canvas><script>\nconst c=document.getElementById('c'),g=c.getContext('2d');\nlet W=1,H=1,D=1;\nfunction rs(){D=devicePixelRatio||1;W=innerWidth;H=innerHeight;c.width=W*D;c.height=H*D;}\nrs();addEventListener('resize',rs);\nconst N=760,GA=Math.PI*(3-Math.sqrt(5)),CX=1390,CY=540,K=16.5,F=[13,21,34],RATE=2.2,EXP=1.6,START=0;\nconst P=[];for(let i=0;N>i;i++){P.push([K*Math.sqrt(i+1),i*GA,Math.pow(i,1/EXP)/RATE]);}\nconst T0=performance.now()/1000-START;\nfunction f(){\nconst t=performance.now()/1000-T0,s=Math.min(W/1920,H/1080);\ng.setTransform(D*s,0,0,D*s,D*(W-1920*s)/2,D*(H-1080*s)/2);\ng.fillStyle='#141210';g.fillRect(-400,-400,2720,1880);\nconst rot=t*0.03,wave=(t*260)%1700;\nconst pos=P.map(p=>[CX+p[0]*Math.cos(p[1]+rot),CY+p[0]*Math.sin(p[1]+rot)]);\nconst rg=g.createRadialGradient(CX,CY,0,CX,CY,560);rg.addColorStop(0,'rgba(224,120,79,0.12)');rg.addColorStop(1,'rgba(224,120,79,0)');g.fillStyle=rg;g.fillRect(CX-560,CY-560,1120,1120);\ng.lineWidth=1.2;\nfor(let i=0;N>i;i++){const age=t-P[i][2];if(0>age)break;\nfor(const k of F){const j=i-k;if(0>j)continue;\nconst a=0.08+0.6*Math.exp(-age*1.2);\ng.strokeStyle='rgba(224,120,79,'+a.toFixed(3)+')';\ng.beginPath();g.moveTo(pos[i][0],pos[i][1]);g.lineTo(pos[j][0],pos[j][1]);g.stroke();}}\nfor(let i=0;N>i;i++){const age=t-P[i][2];if(0>age)break;\nconst w=Math.exp(-Math.pow(P[i][0]-wave,2)/3200),fr=Math.exp(-age*2);\nconst r=1.2+Math.min(3.2,age*0.35)+w*2.6;\ng.fillStyle='rgba(244,239,230,'+Math.min(1,0.38+0.5*w+0.3*fr).toFixed(3)+')';\ng.beginPath();g.arc(pos[i][0],pos[i][1],r,0,6.283);g.fill();\nif(fr>0.04){g.strokeStyle='rgba(224,120,79,'+fr.toFixed(3)+')';g.lineWidth=1.5;g.beginPath();g.arc(pos[i][0],pos[i][1],r+4+16*(1-fr),0,6.283);g.stroke();g.lineWidth=1.2;}}\nconst lg=g.createLinearGradient(0,0,1150,0);lg.addColorStop(0,'rgba(20,18,16,0.97)');lg.addColorStop(0.55,'rgba(20,18,16,0.8)');lg.addColorStop(1,'rgba(20,18,16,0)');g.fillStyle=lg;g.fillRect(-400,-400,1550,1880);\nrequestAnimationFrame(f);}\nrequestAnimationFrame(f);\n</script></body></html>";
const EMBED_CLOSE =
  "<!doctype html><html><head><meta charset=\"utf-8\"></head><body style=\"margin:0;background:#141210;overflow:hidden\"><canvas id=\"c\" style=\"display:block;width:100vw;height:100vh\"></canvas><script>\nconst c=document.getElementById('c'),g=c.getContext('2d');\nlet W=1,H=1,D=1;\nfunction rs(){D=devicePixelRatio||1;W=innerWidth;H=innerHeight;c.width=W*D;c.height=H*D;}\nrs();addEventListener('resize',rs);\nconst N=760,GA=Math.PI*(3-Math.sqrt(5)),CX=1390,CY=540,K=16.5,F=[13,21,34],RATE=2.2,EXP=1.6,START=60;\nconst P=[];for(let i=0;N>i;i++){P.push([K*Math.sqrt(i+1),i*GA,Math.pow(i,1/EXP)/RATE]);}\nconst T0=performance.now()/1000-START;\nfunction f(){\nconst t=performance.now()/1000-T0,s=Math.min(W/1920,H/1080);\ng.setTransform(D*s,0,0,D*s,D*(W-1920*s)/2,D*(H-1080*s)/2);\ng.fillStyle='#141210';g.fillRect(-400,-400,2720,1880);\nconst rot=t*0.03,wave=(t*260)%1700;\nconst pos=P.map(p=>[CX+p[0]*Math.cos(p[1]+rot),CY+p[0]*Math.sin(p[1]+rot)]);\nconst rg=g.createRadialGradient(CX,CY,0,CX,CY,560);rg.addColorStop(0,'rgba(224,120,79,0.16)');rg.addColorStop(1,'rgba(224,120,79,0)');g.fillStyle=rg;g.fillRect(CX-560,CY-560,1120,1120);\ng.lineWidth=1.2;\nfor(let i=0;N>i;i++){const age=t-P[i][2];if(0>age)break;\nfor(const k of F){const j=i-k;if(0>j)continue;\nconst w=Math.exp(-Math.pow(P[i][0]-wave,2)/6000);\nconst a=0.1+0.35*w;\ng.strokeStyle='rgba(224,120,79,'+a.toFixed(3)+')';\ng.beginPath();g.moveTo(pos[i][0],pos[i][1]);g.lineTo(pos[j][0],pos[j][1]);g.stroke();}}\nfor(let i=0;N>i;i++){const age=t-P[i][2];if(0>age)break;\nconst w=Math.exp(-Math.pow(P[i][0]-wave,2)/3200);\nconst r=1.2+Math.min(3.2,age*0.35)+w*2.6;\ng.fillStyle='rgba(244,239,230,'+Math.min(1,0.45+0.5*w).toFixed(3)+')';\ng.beginPath();g.arc(pos[i][0],pos[i][1],r,0,6.283);g.fill();}\nconst lg=g.createLinearGradient(0,0,1150,0);lg.addColorStop(0,'rgba(20,18,16,0.97)');lg.addColorStop(0.55,'rgba(20,18,16,0.8)');lg.addColorStop(1,'rgba(20,18,16,0)');g.fillStyle=lg;g.fillRect(-400,-400,1550,1880);\nrequestAnimationFrame(f);}\nrequestAnimationFrame(f);\n</script></body></html>";

const CoverSlide: Page = () => (
  <div
    className="osa"
    style={{
      background: '#141210',
      color: '#F4EFE6',
      fontFamily: "'DM Sans', Arial, sans-serif",
      padding: '128px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <Embed html={EMBED_COVER} box={{ left: '0', top: '0', width: '1920px', height: '1080px' }} />
    <p
      style={{
        position: 'relative',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '24px',
        letterSpacing: '4px',
        color: '#E0784F',
      }}
    >
      {'CLAUDE COMMUNITY · GUADALAJARA · OCT 2026'}
    </p>
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '48px', width: '1000px' }}>
      <h1
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '160px',
          fontWeight: '400',
          lineHeight: '0.98',
          letterSpacing: '-5px',
          color: '#F4EFE6',
        }}
      >
        {'Compound'}
        <br />
        <i>{'Engineering'}</i>
      </h1>
      <p style={{ fontSize: '44px', lineHeight: '1.3', color: '#CFC6B8', width: '880px' }}>
        {'Cómo lograr que cada sesión con Claude deje tu repo '}
        <span style={{ color: '#E0784F' }}>{'más inteligente'}</span>
        {' que antes.'}
      </p>
    </div>
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'center' }}>
      <p style={{ fontSize: '32px', fontWeight: '600', color: '#F4EFE6' }}>{'Ivan Galaviz'}</p>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#8F877B' }}>
        {'Senior Software Engineer · Netflix'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '101px', height: '6px', background: '#E0784F' }}
      ></div>
    </MorphElement>
  </div>
);

const SpeakerSlide: Page = () => (
  <div
    className="osa"
    style={{
      background: '#F4EFE6',
      color: '#1F1D1A',
      fontFamily: "'DM Sans', Arial, sans-serif",
      padding: '128px 128px 160px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '112px',
    }}
  >
    <img
      src={imgIvan}
      alt={'Foto de Ivan Galaviz'}
      style={{ position: 'relative', width: '600px', height: '600px', objectFit: 'cover', borderRadius: '300px' }}
    />
    <div style={{ position: 'relative', flex: '1', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '4px', color: '#B5502F' }}
      >
        {'QUIÉN HABLA'}
      </p>
      <h2
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '120px',
          fontWeight: '400',
          lineHeight: '1',
          letterSpacing: '-3px',
          color: '#1F1D1A',
        }}
      >
        {'Ivan'}
        <br />
        {'Galaviz'}
      </h2>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '32px', color: '#5E5850' }}>
        {'Senior Software Engineer · Netflix'}
      </p>
      <p
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontStyle: 'italic',
          fontSize: '44px',
          lineHeight: '1.3',
          color: '#1F1D1A',
          borderTop: '1px solid #DDD5C7',
          padding: '32px 0 0 0',
        }}
      >
        {'Me obsesiona una pregunta: ¿por qué cada sesión con Claude empieza de cero?'}
      </p>
    </div>
    <div
      style={{
        position: 'absolute',
        left: '128px',
        right: '128px',
        bottom: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'02 / 19'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '202px', height: '6px', background: '#B5502F' }}
      ></div>
    </MorphElement>
  </div>
);

const HookSlide: Page = () => (
  <div
    className="osa"
    style={{
      background: '#141210',
      color: '#F4EFE6',
      fontFamily: "'DM Sans', Arial, sans-serif",
      padding: '128px 128px 160px',
      display: 'flex',
      flexDirection: 'column',
      gap: '48px',
    }}
  >
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: '#1E1B18',
        border: '1px solid #34302B',
        borderRadius: '24px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '12px',
          padding: '24px 32px',
          borderBottom: '1px solid #34302B',
        }}
      >
        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#4A453E' }}></div>
        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#4A453E' }}></div>
        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#4A453E' }}></div>
        <div style={{ flex: '1' }}></div>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#8F877B' }}>
          {'~/api · martes 18:47'}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '40px 48px' }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '30px', lineHeight: '1.4', color: '#F4EFE6' }}>
          <span style={{ color: '#E0784F' }}>{'$'}</span>
          {' claude'}
        </p>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '30px', lineHeight: '1.4', color: '#F4EFE6' }}>
          <span style={{ color: '#E0784F' }}>{'>'}</span>
          {' agrega rate limiting al API público'}
        </p>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '30px', lineHeight: '1.4', color: '#8F877B' }}>
          {' … 40 minutos, 3 enfoques, 2 bugs, 1 decisión difícil …'}
        </p>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '30px', lineHeight: '1.4', color: '#9CC59A' }}>
          {' Listo: 12 archivos, 34 pruebas en verde.'}
        </p>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '30px', lineHeight: '1.4', color: '#F4EFE6' }}>
          <span style={{ color: '#E0784F' }}>{'$'}</span>
          {' exit'}
        </p>
      </div>
    </div>
    <Steps>
      <Step duration={360}>
        <h2
          style={{
            position: 'absolute',
            left: '128px',
            top: '720px',
            width: '1664px',
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '96px',
            fontWeight: '400',
            lineHeight: '1.05',
            letterSpacing: '-2px',
            color: '#F4EFE6',
          }}
        >
          {'Y ahora, '}
          <i style={{ color: '#E0784F' }}>{'¿qué aprendió tu repo?'}</i>
        </h2>
      </Step>
    </Steps>
    <div
      style={{
        position: 'absolute',
        left: '128px',
        right: '128px',
        bottom: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#8F877B' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#8F877B' }}
      >
        {'03 / 19'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '303px', height: '6px', background: '#E0784F' }}
      ></div>
    </MorphElement>
  </div>
);

const DiffSlide: Page = () => (
  <div
    className="osa"
    style={{
      background: '#F4EFE6',
      color: '#1F1D1A',
      fontFamily: "'DM Sans', Arial, sans-serif",
      padding: '128px 128px 160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '48px',
    }}
  >
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '4px', color: '#B5502F' }}
      >
        {'DEUDA DE CONTEXTO'}
      </p>
      <h2
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '72px',
          fontWeight: '400',
          lineHeight: '1.1',
          letterSpacing: '-1px',
          color: '#1F1D1A',
        }}
      >
        {'Lo que el diff no guarda'}
      </h2>
    </div>
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', gap: '32px', alignItems: 'stretch' }}>
      <div
        style={{
          width: '620px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          background: '#FBF8F2',
          border: '1px solid #DDD5C7',
          borderRadius: '24px',
          padding: '56px',
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '4px',
            color: '#2F6B3A',
          }}
        >
          {'EL DIFF GUARDA'}
        </p>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '44px', lineHeight: '1.2', color: '#2F6B3A' }}>
          {'+ 247 líneas'}
        </p>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '44px', lineHeight: '1.2', color: '#2F6B3A' }}>
          {'+ 12 archivos'}
        </p>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '44px', lineHeight: '1.2', color: '#2F6B3A' }}>
          {'+ 34 pruebas'}
        </p>
      </div>
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          background: '#141210',
          borderRadius: '24px',
          padding: '56px',
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '4px',
            color: '#E0784F',
          }}
        >
          {'LA SESIÓN SE LLEVÓ'}
        </p>
        <p style={{ fontSize: '36px', lineHeight: '1.3', color: '#CFC6B8', textDecoration: 'line-through #E0784F' }}>
          {'por qué elegimos límite por API key y no por IP'}
        </p>
        <p style={{ fontSize: '36px', lineHeight: '1.3', color: '#CFC6B8', textDecoration: 'line-through #E0784F' }}>
          {'los dos enfoques que descartamos, y por qué'}
        </p>
        <p style={{ fontSize: '36px', lineHeight: '1.3', color: '#CFC6B8', textDecoration: 'line-through #E0784F' }}>
          {'el caso límite que casi rompe producción'}
        </p>
        <p style={{ fontSize: '36px', lineHeight: '1.3', color: '#CFC6B8', textDecoration: 'line-through #E0784F' }}>
          {'la convención que Claude adivinó mal tres veces'}
        </p>
      </div>
    </div>
    <div
      style={{
        position: 'absolute',
        left: '128px',
        right: '128px',
        bottom: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'04 / 19'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '404px', height: '6px', background: '#B5502F' }}
      ></div>
    </MorphElement>
  </div>
);

const FirstDaySlide: Page = () => (
  <div
    className="osa"
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      justifyContent: 'space-between',
      padding: '128px 128px 160px',
      background: '#b5502f',
    }}
  >
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '4px', color: '#fbf8f2' }}
      >
        {'EL MODELO MENTAL'}
      </p>
      <h2
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '72px',
          fontWeight: '400',
          lineHeight: '1.1',
          letterSpacing: '-1px',
          color: '#fbf8f2',
        }}
      >
        {'Cada sesión nueva de Claude es su primer día'}
      </h2>
    </div>
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', gap: '48px', alignItems: 'end' }}>
      <div style={{ width: '420px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '4px',
            color: '#f2cdbd',
          }}
        >
          {'SIN MEMORIA'}
        </p>
        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '44px',
            lineHeight: '1.2',
            color: '#fbf8f2',
          }}
        >
          {'Siempre es su primer día'}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
        <div
          style={{
            display: 'grid',
            alignItems: 'end',
            justifyItems: 'center',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            padding: '0 0 12px',
          }}
        >
          <div
            style={{
              width: '96px',
              height: '96px',
              display: 'flex',
              flexDirection: 'column',
              background: '#f2cdbd',
              borderRadius: '256px',
              opacity: '0.6',
            }}
          ></div>
          <div
            style={{
              width: '96px',
              height: '96px',
              display: 'flex',
              flexDirection: 'column',
              background: '#f2cdbd',
              borderRadius: '256px',
              opacity: '0.6',
            }}
          ></div>
          <div
            style={{
              width: '96px',
              height: '96px',
              display: 'flex',
              flexDirection: 'column',
              background: '#f2cdbd',
              borderRadius: '256px',
              opacity: '0.6',
            }}
          ></div>
          <div
            style={{
              width: '96px',
              height: '96px',
              display: 'flex',
              flexDirection: 'column',
              background: '#f2cdbd',
              borderRadius: '256px',
              opacity: '0.6',
            }}
          ></div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            padding: '16px 0 0',
            borderTop: '2px solid #d98a6c',
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '24px',
              textAlign: 'center',
              color: '#f2cdbd',
            }}
          >
            {'de cero'}
          </p>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '24px',
              textAlign: 'center',
              color: '#f2cdbd',
            }}
          >
            {'de cero'}
          </p>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '24px',
              textAlign: 'center',
              color: '#f2cdbd',
            }}
          >
            {'de cero'}
          </p>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '24px',
              textAlign: 'center',
              color: '#f2cdbd',
            }}
          >
            {'de cero'}
          </p>
        </div>
      </div>
    </div>
    <div
      style={{
        position: 'absolute',
        right: '128px',
        bottom: '64px',
        left: '128px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#fbf8f2' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#fbf8f2' }}
      >
        {'05 / 19'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '505px',
          height: '6px',
          display: 'flex',
          flexDirection: 'column',
          background: '#fbf8f2',
        }}
      ></div>
    </MorphElement>
  </div>
);

const BusFactorSlide: Page = () => (
  <div
    className="osa"
    style={{
      background: '#F7F3DD',
      color: '#1F1D1A',
      fontFamily: "'DM Sans', Arial, sans-serif",
      padding: '0',
      display: 'flex',
      flexDirection: 'row',
    }}
  >
    <img
      src={imgBusFactor}
      alt={
        'Ilustración del bus factor: una persona atropellada por un autobús y otra que exclama que nadie más sabía la contraseña'
      }
      style={{ position: 'relative', width: '1080px', height: '1080px', objectFit: 'cover' }}
    />
    <div
      style={{
        position: 'relative',
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '40px',
        padding: '128px 128px 160px 96px',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '4px', color: '#B5502F' }}
      >
        {'RIESGO'}
      </p>
      <h2
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '72px',
          fontWeight: '400',
          lineHeight: '1.1',
          letterSpacing: '-1px',
          color: '#1F1D1A',
        }}
      >
        {'Tu bus factor ya no es solo una persona.'}
      </h2>
      <p
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontStyle: 'italic',
          fontSize: '44px',
          lineHeight: '1.3',
          color: '#B5502F',
        }}
      >
        {'Es cada sesión que cerraste sin guardar nada.'}
      </p>
    </div>
    <div
      style={{
        position: 'absolute',
        left: '1176px',
        right: '128px',
        bottom: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'ILUSTRACIÓN: SKETCHPLANATIONS'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'06 / 19'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '606px', height: '6px', background: '#B5502F' }}
      ></div>
    </MorphElement>
  </div>
);

const MultiplierSlide: Page = () => (
  <div
    className="osa"
    style={{
      background: '#141210',
      color: '#F4EFE6',
      fontFamily: "'DM Sans', Arial, sans-serif",
      padding: '128px 128px 160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: '40px',
    }}
  >
    <p
      style={{
        position: 'relative',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '24px',
        letterSpacing: '4px',
        color: '#E0784F',
      }}
    >
      {'EL RIESGO SE MULTIPLICA'}
    </p>
    <h2
      style={{
        position: 'relative',
        fontFamily: "'Source Serif 4', Georgia, serif",
        fontSize: '120px',
        fontWeight: '400',
        lineHeight: '1.02',
        letterSpacing: '-3px',
        color: '#F4EFE6',
        width: '1600px',
      }}
    >
      {'Claude te hace más rápido.'}
    </h2>
    <Steps>
      <Step duration={360}>
        <h2
          style={{
            position: 'absolute',
            left: '128px',
            top: '620px',
            width: '1664px',
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontStyle: 'italic',
            fontSize: '120px',
            fontWeight: '400',
            lineHeight: '1.02',
            letterSpacing: '-3px',
            color: '#E0784F',
          }}
        >
          {'Sin memoria, también olvidas más rápido.'}
        </h2>
      </Step>
    </Steps>
    <div style={{ position: 'relative', height: '260px' }}></div>
    <div
      style={{
        position: 'absolute',
        left: '128px',
        right: '128px',
        bottom: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#8F877B' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#8F877B' }}
      >
        {'07 / 19'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '707px', height: '6px', background: '#E0784F' }}
      ></div>
    </MorphElement>
  </div>
);

const QuestionSlide: Page = () => (
  <div
    className="osa"
    style={{
      background: '#F4EFE6',
      color: '#1F1D1A',
      fontFamily: "'DM Sans', Arial, sans-serif",
      padding: '128px 128px 160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: '48px',
    }}
  >
    <p
      style={{
        position: 'relative',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '24px',
        letterSpacing: '4px',
        color: '#B5502F',
      }}
    >
      {'LA PREGUNTA CENTRAL'}
    </p>
    <h2
      style={{
        position: 'relative',
        fontFamily: "'Source Serif 4', Georgia, serif",
        fontSize: '120px',
        fontWeight: '400',
        lineHeight: '1.05',
        letterSpacing: '-3px',
        color: '#1F1D1A',
        width: '1560px',
      }}
    >
      {'¿Y si cada tarea hiciera más fácil '}
      <i style={{ color: '#B5502F' }}>{'la siguiente?'}</i>
    </h2>
    <div
      style={{
        position: 'absolute',
        left: '128px',
        right: '128px',
        bottom: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'08 / 19'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '808px', height: '6px', background: '#B5502F' }}
      ></div>
    </MorphElement>
  </div>
);

const DefinitionSlide: Page = () => (
  <div
    className="osa"
    style={{
      background: '#141210',
      color: '#F4EFE6',
      fontFamily: "'DM Sans', Arial, sans-serif",
      padding: '128px 128px 160px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '96px',
    }}
  >
    <div style={{ position: 'relative', flex: '1', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '4px', color: '#E0784F' }}
      >
        {'LA IDEA'}
      </p>
      <h2
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '120px',
          fontWeight: '400',
          lineHeight: '1',
          letterSpacing: '-3px',
          color: '#F4EFE6',
        }}
      >
        {'Compound'}
        <br />
        <i>{'Engineering'}</i>
      </h2>
      <p style={{ fontSize: '32px', lineHeight: '1.45', color: '#CFC6B8' }}>
        {
          'Cada unidad de trabajo debe hacer más fáciles las siguientes. Planear, trabajar y revisar ya lo hacemos todos. La cuarta fase, '
        }
        <span style={{ color: '#E0784F' }}>{'compound'}</span>
        {', es la que casi nadie hace.'}
      </p>
    </div>
    <div style={{ position: 'relative', width: '760px', height: '760px' }}>
      <svg
        aria-label={'Ciclo: Planear, Trabajar, Revisar, Compound, alrededor del repositorio'}
        width={'760'}
        height={'760'}
        viewBox={'0 0 760 760'}
        style={{ position: 'absolute', left: '0', top: '0', width: '760px', height: '760px' }}
      >
        <circle cx={'380'} cy={'380'} r={'330'} fill={'none'} stroke={'#2A2622'} strokeWidth={'1'} />
        <circle
          cx={'380'}
          cy={'380'}
          r={'260'}
          fill={'none'}
          stroke={'#4A453E'}
          strokeWidth={'2'}
          strokeDasharray={'4 10'}
        />
        <circle cx={'380'} cy={'380'} r={'150'} fill={'#1E1B18'} stroke={'#34302B'} strokeWidth={'1'} />
        <polygon points={'574,206 547,199 567,179'} fill={'#E0784F'} />
        <polygon points={'554,574 561,547 581,567'} fill={'#E0784F'} />
        <polygon points={'186,554 213,561 193,581'} fill={'#E0784F'} />
        <polygon points={'206,186 199,213 179,193'} fill={'#E0784F'} />
      </svg>
      <p
        style={{
          position: 'absolute',
          left: '260px',
          top: '80px',
          width: '240px',
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '32px',
          textAlign: 'center',
          color: '#F4EFE6',
          background: '#1E1B18',
          border: '1px solid #4A453E',
          borderRadius: '999px',
          padding: '16px 20px',
        }}
      >
        {'Planear'}
      </p>
      <p
        style={{
          position: 'absolute',
          left: '520px',
          top: '340px',
          width: '240px',
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '32px',
          textAlign: 'center',
          color: '#F4EFE6',
          background: '#1E1B18',
          border: '1px solid #4A453E',
          borderRadius: '999px',
          padding: '16px 20px',
        }}
      >
        {'Trabajar'}
      </p>
      <p
        style={{
          position: 'absolute',
          left: '260px',
          top: '600px',
          width: '240px',
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '32px',
          textAlign: 'center',
          color: '#F4EFE6',
          background: '#1E1B18',
          border: '1px solid #4A453E',
          borderRadius: '999px',
          padding: '16px 20px',
        }}
      >
        {'Revisar'}
      </p>
      <Steps>
        <Step duration={360}>
          <p
            style={{
              position: 'absolute',
              left: '0px',
              top: '340px',
              width: '240px',
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '32px',
              textAlign: 'center',
              color: '#141210',
              background: '#E0784F',
              borderRadius: '999px',
              padding: '16px 20px',
              boxShadow: '0 0 48px rgba(224,120,79,0.45)',
            }}
          >
            {'Compound'}
          </p>
        </Step>
      </Steps>
      <p
        style={{
          position: 'absolute',
          left: '230px',
          top: '318px',
          width: '300px',
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontStyle: 'italic',
          fontSize: '44px',
          textAlign: 'center',
          color: '#E0784F',
        }}
      >
        {'tu repo'}
      </p>
      <p
        style={{
          position: 'absolute',
          left: '230px',
          top: '384px',
          width: '300px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '24px',
          textAlign: 'center',
          color: '#8F877B',
        }}
      >
        {'+ inteligente'}
      </p>
    </div>
    <div
      style={{
        position: 'absolute',
        left: '128px',
        right: '128px',
        bottom: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#8F877B' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#8F877B' }}
      >
        {'09 / 19'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '909px', height: '6px', background: '#E0784F' }}
      ></div>
    </MorphElement>
  </div>
);

const MathSlide: Page = () => (
  <div
    className="osa"
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      justifyContent: 'space-between',
      padding: '128px 128px 160px',
      background: '#b5502f',
    }}
  >
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '4px', color: '#fbf8f2' }}
      >
        {'LA BOLA DE NIEVE'}
      </p>
      <h2
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '72px',
          fontWeight: '400',
          lineHeight: '1.1',
          letterSpacing: '-1px',
          color: '#fbf8f2',
        }}
      >
        {'Cada vuelta del ciclo deja una capa'}
      </h2>
    </div>
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', gap: '48px', alignItems: 'end' }}>
      <div style={{ width: '420px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '4px',
            color: '#fbf8f2',
          }}
        >
          {'CON COMPOUND'}
        </p>
        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '44px',
            lineHeight: '1.2',
            color: '#fbf8f2',
          }}
        >
          {'Cada sesión llega '}
          <i>{'sabiendo más'}</i>
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
        <div
          style={{
            display: 'grid',
            alignItems: 'end',
            justifyItems: 'center',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            padding: '0 0 12px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              display: 'flex',
              flexDirection: 'column',
              background: 'radial-gradient(circle at 35% 30%, #fffdf8 0%, #fbf8f2 45%, #e6cfc2 100%)',
              borderRadius: '256px',
              boxShadow: '0 10px 24px #3a1a0e59',
            }}
          ></div>
          <div
            style={{
              width: '104px',
              height: '104px',
              display: 'flex',
              flexDirection: 'column',
              background: 'radial-gradient(circle at 35% 30%, #fffdf8 0%, #fbf8f2 45%, #e6cfc2 100%)',
              borderRadius: '256px',
              boxShadow: '0 12px 32px #3a1a0e59',
            }}
          ></div>
          <div
            style={{
              width: '168px',
              height: '168px',
              display: 'flex',
              flexDirection: 'column',
              background: 'radial-gradient(circle at 35% 30%, #fffdf8 0%, #fbf8f2 45%, #e6cfc2 100%)',
              borderRadius: '256px',
              boxShadow: '0 16px 40px #3a1a0e59',
            }}
          ></div>
          <div
            style={{
              width: '256px',
              height: '256px',
              display: 'flex',
              flexDirection: 'column',
              background: 'radial-gradient(circle at 35% 30%, #fffdf8 0%, #fbf8f2 45%, #e6cfc2 100%)',
              borderRadius: '256px',
              boxShadow: '0 20px 56px #3a1a0e66',
            }}
          ></div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            padding: '16px 0 0',
            borderTop: '2px solid #fbf8f2',
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', Arial, sans-serif",
              fontSize: '28px',
              textAlign: 'center',
              color: '#fbf8f2',
            }}
          >
            {'nada todavía'}
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', Arial, sans-serif",
              fontSize: '28px',
              textAlign: 'center',
              color: '#fbf8f2',
            }}
          >
            {'+ CLAUDE.md'}
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', Arial, sans-serif",
              fontSize: '28px',
              textAlign: 'center',
              color: '#fbf8f2',
            }}
          >
            {'+ skills'}
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', Arial, sans-serif",
              fontSize: '28px',
              textAlign: 'center',
              color: '#fbf8f2',
            }}
          >
            {'+ tests y decisiones'}
          </p>
        </div>
      </div>
    </div>
    <div
      style={{
        position: 'absolute',
        right: '128px',
        bottom: '64px',
        left: '128px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#fbf8f2' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#fbf8f2' }}
      >
        {'10 / 19'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '1011px',
          height: '6px',
          display: 'flex',
          flexDirection: 'column',
          background: '#fbf8f2',
        }}
      ></div>
    </MorphElement>
  </div>
);

const ClaudeLoopSlide: Page = () => (
  <div
    className="osa"
    style={{
      background: '#F4EFE6',
      color: '#1F1D1A',
      fontFamily: "'DM Sans', Arial, sans-serif",
      padding: '128px 128px 160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '48px',
    }}
  >
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '4px', color: '#B5502F' }}
      >
        {'EL CICLO EN CLAUDE CODE'}
      </p>
      <h2
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '72px',
          fontWeight: '400',
          lineHeight: '1.1',
          letterSpacing: '-1px',
          color: '#1F1D1A',
        }}
      >
        {'Todo viene en la caja: no necesitas plugins'}
      </h2>
    </div>
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          background: '#FBF8F2',
          border: '1px solid #DDD5C7',
          borderRadius: '24px',
          padding: '40px 36px',
        }}
      >
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#B5502F' }}>{'01'}</p>
        <h3
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '44px',
            fontWeight: '500',
            color: '#1F1D1A',
          }}
        >
          {'Planear'}
        </h3>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '28px',
            color: '#F4EFE6',
            background: '#1F1D1A',
            borderRadius: '12px',
            padding: '12px 20px',
          }}
        >
          {'shift+tab'}
        </p>
        <p style={{ fontSize: '28px', lineHeight: '1.35', color: '#5E5850' }}>
          {'Plan mode: investiga sin tocar nada'}
        </p>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '2px',
            color: '#6E665C',
            borderTop: '1px solid #DDD5C7',
            padding: '20px 0 0 0',
          }}
        >
          {'DEJA'}
        </p>
        <p style={{ fontSize: '32px', fontWeight: '600', color: '#1F1D1A' }}>{'un plan revisable'}</p>
      </div>
      <Shape kind={'arrow-right'} color={'#B5502F'} width={32} height={16} />
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          background: '#FBF8F2',
          border: '1px solid #DDD5C7',
          borderRadius: '24px',
          padding: '40px 36px',
        }}
      >
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#B5502F' }}>{'02'}</p>
        <h3
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '44px',
            fontWeight: '500',
            color: '#1F1D1A',
          }}
        >
          {'Trabajar'}
        </h3>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '28px',
            color: '#F4EFE6',
            background: '#1F1D1A',
            borderRadius: '12px',
            padding: '12px 20px',
          }}
        >
          {'subagentes'}
        </p>
        <p style={{ fontSize: '28px', lineHeight: '1.35', color: '#5E5850' }}>
          {'Ejecuta el plan con contexto aislado'}
        </p>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '2px',
            color: '#6E665C',
            borderTop: '1px solid #DDD5C7',
            padding: '20px 0 0 0',
          }}
        >
          {'DEJA'}
        </p>
        <p style={{ fontSize: '32px', fontWeight: '600', color: '#1F1D1A' }}>{'código y pruebas'}</p>
      </div>
      <Shape kind={'arrow-right'} color={'#B5502F'} width={32} height={16} />
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          background: '#FBF8F2',
          border: '1px solid #DDD5C7',
          borderRadius: '24px',
          padding: '40px 36px',
        }}
      >
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#B5502F' }}>{'03'}</p>
        <h3
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '44px',
            fontWeight: '500',
            color: '#1F1D1A',
          }}
        >
          {'Revisar'}
        </h3>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '28px',
            color: '#F4EFE6',
            background: '#1F1D1A',
            borderRadius: '12px',
            padding: '12px 20px',
          }}
        >
          {'/code-review'}
        </p>
        <p style={{ fontSize: '28px', lineHeight: '1.35', color: '#5E5850' }}>
          {'Escepticismo a escala, antes del PR'}
        </p>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '2px',
            color: '#6E665C',
            borderTop: '1px solid #DDD5C7',
            padding: '20px 0 0 0',
          }}
        >
          {'DEJA'}
        </p>
        <p style={{ fontSize: '32px', fontWeight: '600', color: '#1F1D1A' }}>{'hallazgos resueltos'}</p>
      </div>
      <Shape kind={'arrow-right'} color={'#B5502F'} width={32} height={16} />
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          background: '#141210',
          borderRadius: '24px',
          padding: '40px 36px',
          boxShadow: '0 16px 48px rgba(181,80,47,0.25)',
        }}
      >
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#E0784F' }}>{'04'}</p>
        <h3
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '44px',
            fontWeight: '500',
            fontStyle: 'italic',
            color: '#E0784F',
          }}
        >
          {'Compound'}
        </h3>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '28px',
            color: '#141210',
            background: '#E0784F',
            borderRadius: '12px',
            padding: '12px 20px',
          }}
        >
          {'CLAUDE.md'}
        </p>
        <p style={{ fontSize: '28px', lineHeight: '1.35', color: '#CFC6B8' }}>{'más skills, hooks y tests'}</p>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '2px',
            color: '#8F877B',
            borderTop: '1px solid #34302B',
            padding: '20px 0 0 0',
          }}
        >
          {'DEJA'}
        </p>
        <p style={{ fontSize: '32px', fontWeight: '600', color: '#F4EFE6' }}>{'memoria para la próxima'}</p>
      </div>
    </div>
    <div
      style={{
        position: 'absolute',
        left: '128px',
        right: '128px',
        bottom: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'11 / 19'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1112px', height: '6px', background: '#B5502F' }}
      ></div>
    </MorphElement>
  </div>
);

const PlanSlide: Page = () => (
  <div
    className="osa"
    style={{
      background: '#141210',
      color: '#F4EFE6',
      fontFamily: "'DM Sans', Arial, sans-serif",
      padding: '128px 128px 160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '48px',
    }}
  >
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '4px', color: '#E0784F' }}
      >
        {'01 · PLANEAR'}
      </p>
      <h2
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '72px',
          fontWeight: '400',
          lineHeight: '1.1',
          letterSpacing: '-1px',
          color: '#F4EFE6',
        }}
      >
        {'El plan es contexto empaquetado'}
      </h2>
    </div>
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', gap: '96px', alignItems: 'center' }}>
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: '24px',
            borderTop: '1px solid #34302B',
            padding: '24px 0',
          }}
        >
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#E0784F' }}>{'01'}</p>
          <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '44px', color: '#F4EFE6' }}>
            {'Requisitos'}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: '24px',
            borderTop: '1px solid #34302B',
            padding: '24px 0',
          }}
        >
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#E0784F' }}>{'02'}</p>
          <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '44px', color: '#F4EFE6' }}>
            {'Restricciones'}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: '24px',
            borderTop: '1px solid #34302B',
            padding: '24px 0',
          }}
        >
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#E0784F' }}>{'03'}</p>
          <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '44px', color: '#F4EFE6' }}>
            {'Tradeoffs'}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: '24px',
            borderTop: '1px solid #34302B',
            borderBottom: '1px solid #34302B',
            padding: '24px 0',
          }}
        >
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#E0784F' }}>{'04'}</p>
          <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '44px', color: '#F4EFE6' }}>
            {'Criterios de éxito'}
          </p>
        </div>
      </div>
      <div
        style={{
          width: '940px',
          display: 'flex',
          flexDirection: 'column',
          background: '#1E1B18',
          border: '1px solid #34302B',
          borderRadius: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '16px',
            padding: '20px 32px',
            borderBottom: '1px solid #34302B',
          }}
        >
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#E0784F' }}></div>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '24px',
              letterSpacing: '2px',
              color: '#E0784F',
            }}
          >
            {'PLAN MODE · shift+tab'}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '32px 40px' }}>
          <p
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '26px', lineHeight: '1.5', color: '#F4EFE6' }}
          >
            <span style={{ color: '#E0784F' }}>{'>'}</span>
            {' agrega rate limiting al API público'}
          </p>
          <p
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '26px', lineHeight: '1.5', color: '#8F877B' }}
          >
            {'Leí middleware/, config/limits.ts y 3 tests.'}
          </p>
          <p
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '26px', lineHeight: '1.5', color: '#CFC6B8' }}
          >
            {'1. Límite por API key (IPs compartidas en NAT)'}
          </p>
          <p
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '26px', lineHeight: '1.5', color: '#CFC6B8' }}
          >
            {'2. 429 con Retry-After, sin romper clientes'}
          </p>
          <p
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '26px', lineHeight: '1.5', color: '#CFC6B8' }}
          >
            {'3. Prueba de carga en CI antes del merge'}
          </p>
          <p
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '26px', lineHeight: '1.5', color: '#9CC59A' }}
          >
            {'Guardado en docs/plans/rate-limit.md'}
          </p>
        </div>
      </div>
    </div>
    <div
      style={{
        position: 'absolute',
        left: '128px',
        right: '128px',
        bottom: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#8F877B' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#8F877B' }}
      >
        {'12 / 19'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1213px', height: '6px', background: '#E0784F' }}
      ></div>
    </MorphElement>
  </div>
);

const WorkSlide: Page = () => (
  <div
    className="osa"
    style={{
      background: '#F4EFE6',
      color: '#1F1D1A',
      fontFamily: "'DM Sans', Arial, sans-serif",
      padding: '128px 128px 160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '48px',
    }}
  >
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '4px', color: '#B5502F' }}
      >
        {'02 · TRABAJAR · 03 · REVISAR'}
      </p>
      <h2
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '72px',
          fontWeight: '400',
          lineHeight: '1.1',
          letterSpacing: '-1px',
          color: '#1F1D1A',
        }}
      >
        {'Subagentes: hacen el trabajo y lo revisan'}
      </h2>
    </div>
    <div style={{ position: 'relative', width: '1664px', height: '460px' }}>
      <Connector
        x1={520.0}
        y1={230.0}
        x2={820.0}
        y2={67.0}
        route={'elbow'}
        head={'end'}
        color={'#B5502F'}
        stroke={3.0}
        dashed={false}
      />
      <Connector
        x1={520.0}
        y1={230.0}
        x2={820.0}
        y2={230.0}
        route={'straight'}
        head={'end'}
        color={'#B5502F'}
        stroke={3.0}
        dashed={false}
      />
      <Connector
        x1={520.0}
        y1={230.0}
        x2={820.0}
        y2={393.0}
        route={'elbow'}
        head={'end'}
        color={'#B5502F'}
        stroke={3.0}
        dashed={false}
      />
      <div
        style={{
          position: 'absolute',
          left: '0px',
          top: '113px',
          width: '520px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: '#141210',
          borderRadius: '24px',
          padding: '40px',
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '3px',
            color: '#E0784F',
          }}
        >
          {'SESIÓN PRINCIPAL'}
        </p>
        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '44px',
            lineHeight: '1.2',
            color: '#F4EFE6',
          }}
        >
          {'Claude + el plan'}
        </p>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#8F877B' }}>
          {'contexto: limpio y enfocado'}
        </p>
      </div>
      <div
        style={{
          position: 'absolute',
          left: '820px',
          top: '0px',
          width: '844px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '32px',
          background: '#FBF8F2',
          border: '1px solid #DDD5C7',
          borderRadius: '20px',
          padding: '24px 32px',
        }}
      >
        <p
          style={{
            width: '200px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '3px',
            color: '#B5502F',
          }}
        >
          {'EXPLORA'}
        </p>
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontSize: '32px', lineHeight: '1.3', color: '#1F1D1A' }}>{'Busca en todo el repo'}</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#6E665C' }}>
            {'regresa solo un resumen'}
          </p>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: '820px',
          top: '163px',
          width: '844px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '32px',
          background: '#FBF8F2',
          border: '1px solid #DDD5C7',
          borderRadius: '20px',
          padding: '24px 32px',
        }}
      >
        <p
          style={{
            width: '200px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '3px',
            color: '#B5502F',
          }}
        >
          {'IMPLEMENTA'}
        </p>
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontSize: '32px', lineHeight: '1.3', color: '#1F1D1A' }}>{'Ejecuta un paso del plan'}</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#6E665C' }}>
            {'regresa el diff con pruebas'}
          </p>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: '820px',
          top: '326px',
          width: '844px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '32px',
          background: '#141210',
          borderRadius: '20px',
          padding: '24px 32px',
          boxShadow: '0 12px 32px rgba(181,80,47,0.25)',
        }}
      >
        <p
          style={{
            width: '200px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '3px',
            color: '#E0784F',
          }}
        >
          {'REVISA'}
        </p>
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontSize: '32px', lineHeight: '1.3', color: '#F4EFE6' }}>{'Una lente por revisor'}</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#CFC6B8' }}>
            {'seguridad · pruebas · adversarial'}
          </p>
        </div>
      </div>
    </div>
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: '32px',
        borderTop: '1px solid #DDD5C7',
        padding: '24px 0 0 0',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'DEJA'}
      </p>
      <p style={{ fontSize: '32px', fontWeight: '600', color: '#1F1D1A' }}>
        {'Código probado, hallazgos resueltos antes del PR y tus subagentes en '}
        <span style={{ color: '#B5502F' }}>{'.claude/agents/'}</span>
      </p>
    </div>
    <div
      style={{
        position: 'absolute',
        left: '128px',
        right: '128px',
        bottom: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'13 / 19'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1314px', height: '6px', background: '#B5502F' }}
      ></div>
    </MorphElement>
  </div>
);

const CompoundSlide: Page = () => (
  <div
    className="osa"
    style={{
      background: '#141210',
      color: '#F4EFE6',
      fontFamily: "'DM Sans', Arial, sans-serif",
      padding: '128px 128px 160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '48px',
    }}
  >
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '4px', color: '#E0784F' }}
      >
        {'04 · COMPOUND'}
      </p>
      <h2
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '72px',
          fontWeight: '400',
          lineHeight: '1.1',
          letterSpacing: '-1px',
          color: '#F4EFE6',
        }}
      >
        {'Cada lección se vuelve un artefacto'}
      </h2>
    </div>
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '32px',
          borderTop: '1px solid #34302B',
          padding: '18px 0',
        }}
      >
        <p style={{ width: '480px', fontSize: '32px', color: '#A39A8C' }}>{'Un bug que regresa'}</p>
        <Shape kind={'arrow-right'} color={'#E0784F'} width={48} height={24} />
        <p
          style={{
            width: '440px',
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '44px',
            lineHeight: '1.2',
            color: '#F4EFE6',
          }}
        >
          {'Un test de regresión'}
        </p>
        <p
          style={{
            width: '240px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '2px',
            color: '#8F877B',
          }}
        >
          {'EN CADA CAMBIO'}
        </p>
        <p
          style={{
            flex: '1',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            textAlign: 'right',
            color: '#E0784F',
          }}
        >
          {'tests/'}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '32px',
          borderTop: '1px solid #34302B',
          padding: '18px 0',
        }}
      >
        <p style={{ width: '480px', fontSize: '32px', color: '#A39A8C' }}>{'Un hallazgo de revisión'}</p>
        <Shape kind={'arrow-right'} color={'#E0784F'} width={48} height={24} />
        <p
          style={{
            width: '440px',
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '44px',
            lineHeight: '1.2',
            color: '#F4EFE6',
          }}
        >
          {'Una regla'}
        </p>
        <p
          style={{
            width: '240px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '2px',
            color: '#8F877B',
          }}
        >
          {'SIEMPRE'}
        </p>
        <p
          style={{
            flex: '1',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            textAlign: 'right',
            color: '#E0784F',
          }}
        >
          {'CLAUDE.md'}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '32px',
          borderTop: '1px solid #34302B',
          padding: '18px 0',
        }}
      >
        <p style={{ width: '480px', fontSize: '32px', color: '#A39A8C' }}>{'Un procedimiento que repites'}</p>
        <Shape kind={'arrow-right'} color={'#E0784F'} width={48} height={24} />
        <p
          style={{
            width: '440px',
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '44px',
            lineHeight: '1.2',
            color: '#F4EFE6',
          }}
        >
          {'Una skill'}
        </p>
        <p
          style={{
            width: '240px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '2px',
            color: '#8F877B',
          }}
        >
          {'BAJO DEMANDA'}
        </p>
        <p
          style={{
            flex: '1',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            textAlign: 'right',
            color: '#E0784F',
          }}
        >
          {'.claude/skills/'}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '32px',
          borderTop: '1px solid #34302B',
          padding: '18px 0',
        }}
      >
        <p style={{ width: '480px', fontSize: '32px', color: '#A39A8C' }}>{'Una regla que no puede fallar'}</p>
        <Shape kind={'arrow-right'} color={'#E0784F'} width={48} height={24} />
        <p
          style={{
            width: '440px',
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '44px',
            lineHeight: '1.2',
            color: '#F4EFE6',
          }}
        >
          {'Un hook'}
        </p>
        <p
          style={{
            width: '240px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '2px',
            color: '#8F877B',
          }}
        >
          {'EN CADA EVENTO'}
        </p>
        <p
          style={{
            flex: '1',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            textAlign: 'right',
            color: '#E0784F',
          }}
        >
          {'.claude/settings.json'}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '32px',
          borderTop: '1px solid #34302B',
          borderBottom: '1px solid #34302B',
          padding: '18px 0',
        }}
      >
        <p style={{ width: '480px', fontSize: '32px', color: '#A39A8C' }}>{'Una decisión costosa'}</p>
        <Shape kind={'arrow-right'} color={'#E0784F'} width={48} height={24} />
        <p
          style={{
            width: '440px',
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '44px',
            lineHeight: '1.2',
            color: '#F4EFE6',
          }}
        >
          {'Un ADR'}
        </p>
        <p
          style={{
            width: '240px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '2px',
            color: '#8F877B',
          }}
        >
          {'AL DECIDIR'}
        </p>
        <p
          style={{
            flex: '1',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            textAlign: 'right',
            color: '#E0784F',
          }}
        >
          {'docs/adr/'}
        </p>
      </div>
    </div>
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '40px',
        background: '#1E1B18',
        border: '1px solid #34302B',
        borderRadius: '20px',
        padding: '24px 40px',
      }}
    >
      <p
        style={{
          width: '260px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '24px',
          letterSpacing: '3px',
          color: '#E0784F',
        }}
      >
        {'MANTENIMIENTO'}
      </p>
      <p style={{ flex: '1', fontSize: '32px', lineHeight: '1.3', color: '#CFC6B8' }}>
        {'Mide su tamaño, poda lo duplicado y mueve el detalle a skills.'}
      </p>
    </div>
    <div
      style={{
        position: 'absolute',
        left: '128px',
        right: '128px',
        bottom: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#8F877B' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#8F877B' }}
      >
        {'14 / 19'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1415px', height: '6px', background: '#E0784F' }}
      ></div>
    </MorphElement>
  </div>
);

const RealCaseSlide: Page = () => (
  <div
    className="osa"
    style={{
      background: '#141210',
      color: '#F4EFE6',
      fontFamily: "'DM Sans', Arial, sans-serif",
      padding: '128px 128px 160px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}
  >
    <p
      style={{
        position: 'relative',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '24px',
        letterSpacing: '4px',
        color: '#E0784F',
      }}
    >
      {'CASO REAL · PROYECTO PERSONAL CON CODEX'}
    </p>
    <h2
      style={{
        position: 'relative',
        fontFamily: "'Source Serif 4', Georgia, serif",
        fontSize: '72px',
        fontWeight: '400',
        lineHeight: '1.1',
        letterSpacing: '-1px',
        color: '#F4EFE6',
      }}
    >
      {'Esto me pasó hace unas semanas'}
    </h2>
    <div
      style={{
        position: 'absolute',
        left: '128px',
        top: '347px',
        width: '1664px',
        height: '2px',
        background: '#34302B',
      }}
    ></div>
    <div
      style={{
        position: 'absolute',
        left: '128px',
        top: '332px',
        width: '380px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ width: '32px', height: '32px', borderRadius: '16px', background: '#E0784F' }}></div>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#E0784F' }}
      >
        {'30 SEP · MADRUGADA'}
      </p>
      <h3
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '32px',
          fontWeight: '400',
          lineHeight: '1.2',
          color: '#F4EFE6',
        }}
      >
        {'Una revisión atrapa un bug'}
      </h3>
      <p style={{ fontSize: '26px', lineHeight: '1.4', color: '#CFC6B8' }}>
        {'5 requests de un cliente bloqueaban el login de todos los demás.'}
      </p>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#9CC59A' }}>
        {'+ test + ADR 0002'}
      </p>
    </div>
    <Steps>
      <Step duration={360}>
        <div
          style={{
            position: 'absolute',
            left: '556px',
            top: '332px',
            width: '380px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '16px',
              background: '#141210',
              border: '3px solid #8F877B',
            }}
          ></div>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '24px',
              letterSpacing: '2px',
              color: '#8F877B',
            }}
          >
            {'30 SEP · 16:44'}
          </p>
          <h3
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '32px',
              fontWeight: '400',
              lineHeight: '1.2',
              color: '#F4EFE6',
            }}
          >
            {'Una limpieza borra docs/'}
          </h3>
          <p style={{ fontSize: '26px', lineHeight: '1.4', color: '#CFC6B8' }}>
            {'Los ADRs desaparecen del repo, junto con el porqué del fix.'}
          </p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#E0784F' }}>{'− 3 ADRs'}</p>
        </div>
      </Step>
    </Steps>
    <Steps>
      <Step duration={360}>
        <div
          style={{
            position: 'absolute',
            left: '984px',
            top: '332px',
            width: '380px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '16px',
              background: '#141210',
              border: '3px solid #8F877B',
            }}
          ></div>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '24px',
              letterSpacing: '2px',
              color: '#8F877B',
            }}
          >
            {'4 OCT · SESIÓN NUEVA'}
          </p>
          <h3
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '32px',
              fontStyle: 'italic',
              fontWeight: '400',
              lineHeight: '1.2',
              color: '#E0784F',
            }}
          >
            {'“No encontré ADRs existentes.”'}
          </h3>
          <p style={{ fontSize: '26px', lineHeight: '1.4', color: '#CFC6B8' }}>
            {'Se restauran desde git y nace la regla: revisa los ADRs antes de terminar.'}
          </p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#9CC59A' }}>
            {'+ AGENTS.md'}
          </p>
        </div>
      </Step>
    </Steps>
    <Steps>
      <Step duration={360}>
        <div
          style={{
            position: 'absolute',
            left: '1412px',
            top: '332px',
            width: '380px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '16px',
              background: '#E0784F',
              boxShadow: '0 0 32px rgba(224,120,79,0.7)',
            }}
          ></div>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '24px',
              letterSpacing: '2px',
              color: '#E0784F',
            }}
          >
            {'12 OCT'}
          </p>
          <h3
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '32px',
              fontWeight: '400',
              lineHeight: '1.2',
              color: '#F4EFE6',
            }}
          >
            {'Migro toda la base de datos'}
          </h3>
          <p style={{ fontSize: '26px', lineHeight: '1.4', color: '#CFC6B8' }}>
            {'D1 → PlanetScale. Codex lee el ADR y la regla sobrevive intacta.'}
          </p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#9CC59A' }}>
            {'✓ cf-connecting-ip'}
          </p>
        </div>
      </Step>
    </Steps>
    <Steps>
      <Step duration={360}>
        <div
          style={{
            position: 'absolute',
            left: '128px',
            top: '712px',
            width: '1664px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            borderTop: '1px solid #34302B',
            padding: '28px 0 0 0',
          }}
        >
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '72px',
              fontWeight: '400',
              lineHeight: '1.1',
              letterSpacing: '-1px',
              color: '#F4EFE6',
            }}
          >
            {'La memoria no estaba en el agente.'}
            <br />
            <i style={{ color: '#E0784F' }}>{'Estaba en git.'}</i>
          </p>
        </div>
      </Step>
    </Steps>
    <div
      style={{
        position: 'absolute',
        left: '128px',
        right: '128px',
        bottom: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#8F877B' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#8F877B' }}
      >
        {'15 / 19'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1516px', height: '6px', background: '#E0784F' }}
      ></div>
    </MorphElement>
  </div>
);

const WeekSlide: Page = () => (
  <div
    className="osa"
    style={{
      background: '#141210',
      color: '#F4EFE6',
      fontFamily: "'DM Sans', Arial, sans-serif",
      padding: '128px 128px 160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '48px',
    }}
  >
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '4px', color: '#E0784F' }}
      >
        {'ADOPCIÓN'}
      </p>
      <h2
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '72px',
          fontWeight: '400',
          lineHeight: '1.1',
          letterSpacing: '-1px',
          color: '#F4EFE6',
        }}
      >
        {'Tu primera semana'}
      </h2>
    </div>
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'end', gap: '24px' }}>
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: '#1E1B18',
          border: '1px solid #34302B',
          borderRadius: '20px',
          padding: '32px 32px 32px 32px',
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '3px',
            color: '#E0784F',
          }}
        >
          {'LUN'}
        </p>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '32px', fontWeight: '700', color: '#F4EFE6' }}>
          {'/init'}
        </p>
        <p style={{ fontSize: '28px', lineHeight: '1.35', color: '#A39A8C' }}>{'Genera tu primer CLAUDE.md'}</p>
      </div>
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: '#1E1B18',
          border: '1px solid #34302B',
          borderRadius: '20px',
          padding: '32px 32px 80px 32px',
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '3px',
            color: '#E0784F',
          }}
        >
          {'MAR'}
        </p>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '32px', fontWeight: '700', color: '#F4EFE6' }}>
          {'shift+tab'}
        </p>
        <p style={{ fontSize: '28px', lineHeight: '1.35', color: '#A39A8C' }}>{'Planea todo lo que no sea trivial'}</p>
      </div>
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: '#1E1B18',
          border: '1px solid #34302B',
          borderRadius: '20px',
          padding: '32px 32px 128px 32px',
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '3px',
            color: '#E0784F',
          }}
        >
          {'MIÉ'}
        </p>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '32px', fontWeight: '700', color: '#F4EFE6' }}>
          {'/code-review'}
        </p>
        <p style={{ fontSize: '28px', lineHeight: '1.35', color: '#A39A8C' }}>{'Antes de cada PR, sin excepción'}</p>
      </div>
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: '#1E1B18',
          border: '1px solid #34302B',
          borderRadius: '20px',
          padding: '32px 32px 176px 32px',
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '3px',
            color: '#E0784F',
          }}
        >
          {'JUE'}
        </p>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '32px', fontWeight: '700', color: '#F4EFE6' }}>
          {'una skill'}
        </p>
        <p style={{ fontSize: '28px', lineHeight: '1.35', color: '#A39A8C' }}>{'Del procedimiento que más repites'}</p>
      </div>
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: '#E0784F',
          borderRadius: '20px',
          padding: '32px 32px 224px 32px',
          boxShadow: '0 0 64px rgba(224,120,79,0.35)',
        }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '3px',
            color: '#141210',
          }}
        >
          {'VIE'}
        </p>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '32px', fontWeight: '700', color: '#141210' }}>
          {'un hook'}
        </p>
        <p style={{ fontSize: '28px', lineHeight: '1.35', color: '#141210' }}>{'Para la regla que más se rompe'}</p>
      </div>
    </div>
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '40px',
        border: '2px dashed #E0784F',
        borderRadius: '20px',
        padding: '24px 40px',
      }}
    >
      <p
        style={{
          width: '300px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '24px',
          letterSpacing: '3px',
          color: '#E0784F',
        }}
      >
        {'TODOS LOS DÍAS'}
      </p>
      <p style={{ flex: '1', fontSize: '32px', lineHeight: '1.3', color: '#F4EFE6' }}>
        {'Antes de escribir exit: el prompt de compound.'}
      </p>
    </div>
    <div
      style={{
        position: 'absolute',
        left: '128px',
        right: '128px',
        bottom: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#8F877B' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#8F877B' }}
      >
        {'16 / 19'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1617px', height: '6px', background: '#E0784F' }}
      ></div>
    </MorphElement>
  </div>
);

const StealSlide: Page = () => (
  <div
    className="osa"
    style={{
      background: '#F4EFE6',
      color: '#1F1D1A',
      fontFamily: "'DM Sans', Arial, sans-serif",
      padding: '128px 128px 160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '48px',
    }}
  >
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '4px', color: '#B5502F' }}
      >
        {'PARA LLEVAR · TÓMALE FOTO'}
      </p>
      <h2
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '72px',
          fontWeight: '400',
          lineHeight: '1.1',
          letterSpacing: '-1px',
          color: '#1F1D1A',
        }}
      >
        {'El prompt que cierra cada sesión'}
      </h2>
    </div>
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        background: '#141210',
        borderRadius: '28px',
        padding: '56px 72px',
        boxShadow: '0 32px 80px rgba(31,29,26,0.22)',
      }}
    >
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '40px', lineHeight: '1.5', color: '#F4EFE6' }}>
        <span style={{ color: '#E0784F' }}>{'>'}</span>
        {' Antes de cerrar: ¿qué aprendimos en esta sesión que la próxima debería saber?'}
      </p>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '40px', lineHeight: '1.5', color: '#CFC6B8' }}>
        {'Propón dónde guardarlo (CLAUDE.md, una skill, un hook o un test) y hazlo.'}
      </p>
    </div>
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '48px',
        background: '#B5502F',
        borderRadius: '24px',
        padding: '32px 56px',
        boxShadow: '0 20px 56px rgba(181,80,47,0.35)',
      }}
    >
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '4px',
            color: '#F2CDBD',
          }}
        >
          {'MEJOR AÚN'}
        </p>
        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '44px',
            lineHeight: '1.2',
            color: '#FBF8F2',
          }}
        >
          {'Conviértelo en tu propia skill '}
          <i>{'/compound'}</i>
          {' y vuélvelo un hábito.'}
        </p>
      </div>
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '24px',
          color: '#FBF8F2',
          background: '#3A1A0E',
          borderRadius: '12px',
          padding: '16px 24px',
        }}
      >
        {'.claude/skills/compound/'}
      </p>
    </div>
    <div
      style={{
        position: 'absolute',
        left: '128px',
        right: '128px',
        bottom: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'17 / 19'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1718px', height: '6px', background: '#B5502F' }}
      ></div>
    </MorphElement>
  </div>
);

const CloseSlide: Page = () => (
  <div
    className="osa"
    style={{
      background: '#141210',
      color: '#F4EFE6',
      fontFamily: "'DM Sans', Arial, sans-serif",
      padding: '128px 128px 160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: '48px',
    }}
  >
    <Embed html={EMBED_CLOSE} box={{ left: '0', top: '0', width: '1920px', height: '1080px' }} />
    <p
      style={{
        position: 'relative',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '24px',
        letterSpacing: '4px',
        color: '#E0784F',
      }}
    >
      {'LA PROMESA'}
    </p>
    <h2
      style={{
        position: 'relative',
        fontFamily: "'Source Serif 4', Georgia, serif",
        fontSize: '96px',
        fontWeight: '400',
        lineHeight: '1.08',
        letterSpacing: '-2px',
        color: '#F4EFE6',
        width: '1000px',
      }}
    >
      {'Que cada sesión deje tu repo '}
      <i style={{ color: '#E0784F' }}>{'más inteligente que antes.'}</i>
    </h2>
    <p
      style={{
        position: 'relative',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '28px',
        lineHeight: '1.6',
        color: '#CFC6B8',
        width: '900px',
      }}
    >
      {'Menos contexto desechable.'}
      <br />
      {'Menor bus factor.'}
      <br />
      {'Mejor siguiente cambio.'}
    </p>
    <div
      style={{
        position: 'absolute',
        left: '128px',
        right: '128px',
        bottom: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#8F877B' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#8F877B' }}
      >
        {'18 / 19'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1819px', height: '6px', background: '#E0784F' }}
      ></div>
    </MorphElement>
  </div>
);

const OutroSlide: Page = () => (
  <div
    className="osa"
    style={{
      background: '#F4EFE6',
      color: '#1F1D1A',
      fontFamily: "'DM Sans', Arial, sans-serif",
      padding: '128px 128px 160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '40px',
    }}
  >
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'end',
        justifyContent: 'space-between',
        gap: '48px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '4px',
            color: '#B5502F',
          }}
        >
          {'GRACIAS, GUADALAJARA'}
        </p>
        <h2
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '72px',
            fontWeight: '400',
            lineHeight: '1.1',
            letterSpacing: '-1px',
            color: '#1F1D1A',
          }}
        >
          {'¿Preguntas?'}
        </h2>
      </div>
      <p
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontStyle: 'italic',
          fontSize: '32px',
          lineHeight: '1.3',
          textAlign: 'right',
          color: '#B5502F',
        }}
      >
        {'Prueba el ciclo en una feature real esta semana.'}
      </p>
    </div>
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
          background: '#FFFFFF',
          border: '1px solid #DDD5C7',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 12px 40px rgba(31,29,26,0.08)',
        }}
      >
        <img
          src={imgQrSlides}
          alt={'Código QR de la presentación en ivanovishado.dev'}
          style={{ width: '470px', height: '470px', objectFit: 'contain' }}
        />
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '32px',
            fontWeight: '700',
            letterSpacing: '3px',
            color: '#B5502F',
          }}
        >
          {'PRESENTACIÓN'}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
          background: '#FFFFFF',
          border: '1px solid #DDD5C7',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 12px 40px rgba(31,29,26,0.08)',
        }}
      >
        <img
          src={imgQrLinkedin}
          alt={'Código QR del perfil de LinkedIn'}
          style={{ width: '470px', height: '470px', objectFit: 'contain' }}
        />
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '32px',
            fontWeight: '700',
            letterSpacing: '3px',
            color: '#B5502F',
          }}
        >
          {'LINKEDIN'}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
          background: '#FFFFFF',
          border: '1px solid #DDD5C7',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 12px 40px rgba(31,29,26,0.08)',
        }}
      >
        <img
          src={imgQrX}
          alt={'Código QR del perfil de X @ivanovishado'}
          style={{ width: '470px', height: '470px', objectFit: 'contain' }}
        />
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '32px',
            fontWeight: '700',
            letterSpacing: '3px',
            color: '#B5502F',
          }}
        >
          {'X · @IVANOVISHADO'}
        </p>
      </div>
    </div>
    <div
      style={{
        position: 'absolute',
        left: '128px',
        right: '128px',
        bottom: '64px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'CONCEPTO ORIGINAL: '}
        <a href={'https://every.to/guides/compound-engineering'} target="_blank" rel="noreferrer">
          <span style={{ color: '#B5502F' }}>{'COMPOUND ENGINEERING, DE EVERY'}</span>
        </a>
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'19 / 19'}
      </p>
    </div>
    <MorphElement id={'progress'}>
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1920px', height: '6px', background: '#B5502F' }}
      ></div>
    </MorphElement>
  </div>
);

export const notes = [
  'Bienvenidos. Antes de empezar, fíjense en la espiral de la derecha. Cada punto que aparece es una sesión de trabajo que dejó algo guardado, y cada punto nuevo se conecta con los anteriores. Al principio crece despacio; luego se acelera. De eso trata esta charla: de cómo hacer que tu trabajo con Claude se acumule en lugar de evaporarse.',
  'Soy Ivan, Senior Software Engineer en Netflix. Uso Claude Code todos los días y hay una pregunta que no me deja: ¿por qué cada sesión empieza de cero, aunque ayer ya hayamos resuelto lo mismo? Esta charla es mi respuesta en progreso.',
  '[~1:00] Levanten la mano si hoy tuvieron una sesión así. Cuarenta minutos con Claude, probaron tres enfoques, encontraron dos bugs, tomaron una decisión difícil, y al final todo quedó en verde. Escriben exit. Clic: y ahora, ¿qué aprendió tu repo? La respuesta casi siempre es: nada. El código se queda, pero todo lo que lo hizo correcto se fue con la sesión.',
  'A la izquierda, lo que sí sobrevive: el diff. A la derecha, lo que se evaporó. La intención, las alternativas descartadas, el caso límite, la convención que tuvimos que corregir tres veces. Eso es deuda de contexto. Y como toda deuda, se paga con intereses: la próxima persona, o el próximo agente, va a redescubrir todo esto desde cero. Probablemente mañana.',
  '¿Por qué se pierde todo eso? Piensen en cada sesión nueva de Claude como alguien brillante en su primer día en el equipo. Sabe programar, pero no sabe nada de tu repo. Sin memoria, cada sesión vuelve a ser su primer día: empieza de cero y la bolita nunca crece. Todo lo que vimos en el diff, la siguiente sesión lo tiene que redescubrir.',
  'Todos conocemos el bus factor: cuántas personas tendrían que faltar para que el proyecto se detenga. ¿Cuántos tienen en su equipo a esa persona a la que todos le preguntan? Lo que sabe no está en el repo. Ahora agreguen agentes: ese compañero en su primer día trabaja contigo una hora y luego desaparece para siempre. Si no guardaste nada, tu bus factor acaba de bajar otra vez.',
  'Aquí está la trampa. Claude multiplica tu velocidad: más cambios, más features, más PRs. Clic. Pero si cada sesión olvida, también multiplica el olvido. Más throughput no significa automáticamente más aprendizaje. Sin un sistema, acumulamos deuda de contexto más rápido que nunca.',
  '[~3:30] [Pausa de dos segundos.] Normalmente cada tarea hace la siguiente un poco más difícil: más código, más casos, más cosas que recordar. ¿Qué pasaría si fuera al revés?',
  'A esto se le llama Compound Engineering; el término lo popularizó el equipo de Every. La idea: cada unidad de trabajo debe hacer más fáciles las siguientes. Planear, trabajar y revisar ya lo hacemos. Clic. La cuarta fase, compound, es tomar lo aprendido y devolverlo al repo para que la siguiente vuelta del ciclo empiece desde más arriba. En el centro no está Claude: está tu repositorio.',
  '¿Se acuerdan del primer día? Ahora, la misma sesión con compound: cada vuelta del ciclo deja algo. La primera llega sin nada. La segunda ya llega con un CLAUDE.md. La tercera con skills. La cuarta con tests y decisiones documentadas. Es una bola de nieve: cada vuelta agrega una capa, y cuanto más grande es, más nieve levanta. Eso es el interés compuesto, sin fórmulas.',
  '[~5:30] Lo mejor: no necesitan instalar nada para empezar. Cada fase tiene un equivalente nativo en Claude Code. Plan mode para planear, subagentes para trabajar con contexto aislado, code review para revisar, y CLAUDE.md, skills y hooks para la fase que importa: compound. Fíjense en la fila de abajo: cada fase deja algo. Ese es el punto.',
  'Shift más Tab y Claude entra en plan mode: investiga, lee el código, propone, pero no toca archivos. El plan captura cuatro cosas: requisitos, restricciones, tradeoffs y criterios de éxito. Fíjense en el paréntesis del punto uno: ese porqué es justo lo que normalmente se pierde. Y la última línea: el plan se guarda en el repo. Un plan es un paquete de contexto que cualquier persona o agente puede abrir mañana. [Ejemplo ilustrativo.]',
  'Con el plan aprobado, Claude trabaja y revisa. El truco son los subagentes: en lugar de que la sesión principal lea dos mil líneas para encontrar algo, delega. Uno explora y regresa un resumen. Otro implementa un paso del plan. Y para revisar, varios revisores, cada uno con su lente: seguridad, pruebas, rendimiento. Agreguen siempre la lente adversarial: su único trabajo es intentar romper el cambio, como un atacante. Cada subagente tiene su propia ventana de contexto, así que la sesión principal llega al final lúcida, no saturada. Y fíjense en lo que deja: código probado, hallazgos resueltos antes de que un humano abra el PR, y los subagentes mismos, definidos en punto claude barra agents, que se quedan en el repo para la próxima vez.',
  'Esta es la fase que casi nadie hace, y la que cambia la curva. Cada cosa que aprendiste tiene un lugar, y cada lugar actúa en un momento distinto. Un bug que regresa se vuelve un test, que corre en cada cambio. Un hallazgo de revisión, una regla en CLAUDE.md, que Claude lee siempre. Un procedimiento que repites, una skill, que se carga solo cuando hace falta. Una regla que no puede fallar, un hook: es determinista y no depende de que el modelo se acuerde. Y una decisión costosa, un ADR: un registro de decisión de arquitectura. Es un archivo corto con el contexto, la decisión y las alternativas descartadas; si la decisión cambia, se escribe uno nuevo. Es justo lo que vimos que se perdía en el diff. Todo vive en git, así que se revisa en un PR como cualquier otro código. Una advertencia, abajo: si cada sesión agrega algo, CLAUDE.md crece hasta volverse ruido. Así que la memoria también se mantiene: mide su tamaño, poda lo duplicado y mueve el detalle a skills. La lección deja de vivir en tu cabeza y empieza a vivir en el repo.',
  '[Caso real, ~1 min] Esto no es teoría. Es de un proyecto personal donde trabajo con Codex, el agente de OpenAI. El mecanismo es el mismo que en Claude Code: AGENTS.md en lugar de CLAUDE.md. 30 de septiembre: una revisión automática encontró que cinco requests de un solo cliente podían bloquear el login de todos los demás. Lo corregimos y quedó un test y un ADR. Clic. Esa misma tarde, una limpieza de documentación borró la carpeta docs, con los ADRs adentro. Clic. Cuatro días después, en una sesión nueva, el agente me dijo: no encontré ADRs existentes. Amnesia total. Los restauramos desde git y agregué una regla: antes de terminar, revisa los ADRs. Clic. Una semana después migré toda la base de datos a PlanetScale. Codex leyó el ADR y la regla de rate limiting sobrevivió intacta. Clic. La memoria no estaba en el agente: el agente la había perdido. Estaba en git, y de ahí la recuperamos.',
  'No hay que adoptar todo de golpe. Un escalón por día. Lunes: corran init y tengan su primer CLAUDE.md. Martes: plan mode para todo lo que no sea trivial. Miércoles: code review antes de cada PR. Jueves: su primera skill, del procedimiento que más repiten. Viernes: un hook para la regla que más se rompe. Fíjense que cada columna es más alta que la anterior: así se ve el interés compuesto. Y todos los días, antes de escribir exit, una sola cosa. Es la siguiente slide.',
  '[~11:45] Si se van a llevar una sola cosa de esta charla, que sea esto. Tómenle foto. Al final de cada sesión, antes de escribir exit, pídanle esto a Claude. Es la fase compound en dos líneas. Y cuando lo hayan hecho tres veces, conviértanlo en una skill propia que se llame compound, para que el hábito no dependa de que se acuerden.',
  '[~13:30] ¿Se acuerdan de la espiral de la portada? Así se ve después de muchas sesiones que sí dejaron algo. Esa era la promesa del principio: que cada sesión deje tu repo más inteligente que antes. El valor real de trabajar con agentes no es escribir más código: es que cada feature haga más fácil la siguiente. Menos contexto desechable, menor bus factor y un mejor siguiente cambio.',
  '[~14:15 · luego 5 min de Q&A con este slide arriba] Gracias. Aquí están la presentación, mi LinkedIn y mi X, donde estoy como ivanovishado. Dejo este slide arriba durante las preguntas para que todos alcancen a escanear. El concepto de Compound Engineering viene del equipo de Every; si quieren un flujo ya empaquetado, su plugin es un buen punto de partida. Pero todo lo que vimos hoy funciona con Claude Code tal como viene. Abrimos preguntas.',
];

export const meta: SlideMeta = {
  title: 'Compound Engineering — Claude Community GDL',
  createdAt: '2026-10-17T18:04:53.767Z',
};

export default [
  CoverSlide,
  SpeakerSlide,
  HookSlide,
  DiffSlide,
  FirstDaySlide,
  BusFactorSlide,
  MultiplierSlide,
  QuestionSlide,
  DefinitionSlide,
  MathSlide,
  ClaudeLoopSlide,
  PlanSlide,
  WorkSlide,
  CompoundSlide,
  RealCaseSlide,
  WeekSlide,
  StealSlide,
  CloseSlide,
  OutroSlide,
] satisfies Page[];
