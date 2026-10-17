import type { Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { Step, Steps, unstable_SharedElement as SharedElement } from '@open-slide/core';
import busFactor from './assets/bus-factor.png';
import ivanPhoto from './assets/ivan.jpeg';
import qrLinkedin from './assets/qr-linkedin.png';
import qrSlides from './assets/qr-slides.png';
import qrX from './assets/qr-x.png';

// Ported 1:1 from the Claude Slides artifact (backup in backups/compound-engineering-claude-community/).
// The markup keeps the artifact's inline styles; BASE_CSS reproduces that runtime's element defaults.

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400..700;1,400..700&family=DM+Sans:wght@400..700&family=JetBrains+Mono:wght@400..700&display=swap';

const BASE_CSS = `
.ccg { position: relative; width: 100%; height: 100%; box-sizing: border-box; overflow: hidden; display: flex; flex-direction: column; }
.ccg * { box-sizing: border-box; margin: 0; }
.ccg div { display: flex; flex-direction: column; }
.ccg h1 { font-size: 96px; font-weight: 600; line-height: 1.1; }
.ccg h2 { font-size: 64px; font-weight: 600; line-height: 1.15; }
.ccg h3 { font-size: 44px; font-weight: 600; line-height: 1.2; }
.ccg p { font-size: 32px; font-weight: 400; line-height: 1.4; }
.ccg img, .ccg svg { display: block; flex-shrink: 0; }
.ccg a { color: inherit; text-decoration: none; }
.ccg hr { border: 0; }
.ccg [data-osd-step] { position: absolute; inset: 0; pointer-events: none; }
`;

if (typeof document !== 'undefined') {
  if (!document.getElementById('ccg-webfont')) {
    const link = document.createElement('link');
    link.id = 'ccg-webfont';
    link.rel = 'stylesheet';
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }
  if (!document.getElementById('ccg-base')) {
    const style = document.createElement('style');
    style.id = 'ccg-base';
    style.textContent = BASE_CSS;
    document.head.appendChild(style);
  }
}

// Live canvas page, sandboxed like the artifact's <x-embed>.
const Embed = ({ html }: { html: string }) => (
  <iframe
    title="Espiral de crecimiento compuesto"
    srcDoc={html}
    sandbox="allow-scripts"
    style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, border: 0, pointerEvents: 'none' }}
  />
);

// Block arrow: the head is the last 40% of its length.
const Arrow = ({ color, width, height }: { color: string; width: number; height: number }) => (
  <svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <polygon points="0,30 60,30 60,0 100,50 60,100 60,70 0,70" fill={color} />
  </svg>
);

// Line with a filled head at the end, in its host's coordinates. "elbow" = across, down, across.
const Connector = ({
  x1,
  y1,
  x2,
  y2,
  route,
  color,
  stroke,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  route: string;
  color: string;
  stroke: number;
}) => {
  const head = stroke * 5;
  const end = x2 - head;
  const mid = (x1 + x2) / 2;
  const d = route === 'elbow' ? `M${x1} ${y1} H${mid} V${y2} H${end}` : `M${x1} ${y1} L${end} ${y2}`;
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
      <path d={d} fill="none" stroke={color} strokeWidth={stroke} />
      <polygon points={`${x2},${y2} ${end},${y2 - head * 0.6} ${end},${y2 + head * 0.6}`} fill={color} />
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

const SPIRAL_COVER =
  "<!doctype html><html><head><meta charset=\"utf-8\"></head><body style=\"margin:0;background:#141210;overflow:hidden\"><canvas id=\"c\" style=\"display:block;width:100vw;height:100vh\"></canvas><script>\nconst c=document.getElementById('c'),g=c.getContext('2d');\nlet W=1,H=1,D=1;\nfunction rs(){D=devicePixelRatio||1;W=innerWidth;H=innerHeight;c.width=W*D;c.height=H*D;}\nrs();addEventListener('resize',rs);\nconst N=760,GA=Math.PI*(3-Math.sqrt(5)),CX=1390,CY=540,K=16.5,F=[13,21,34],RATE=2.2,EXP=1.6,START=0;\nconst P=[];for(let i=0;N>i;i++){P.push([K*Math.sqrt(i+1),i*GA,Math.pow(i,1/EXP)/RATE]);}\nconst T0=performance.now()/1000-START;\nfunction f(){\nconst t=performance.now()/1000-T0,s=Math.min(W/1920,H/1080);\ng.setTransform(D*s,0,0,D*s,D*(W-1920*s)/2,D*(H-1080*s)/2);\ng.fillStyle='#141210';g.fillRect(-400,-400,2720,1880);\nconst rot=t*0.03,wave=(t*260)%1700;\nconst pos=P.map(p=>[CX+p[0]*Math.cos(p[1]+rot),CY+p[0]*Math.sin(p[1]+rot)]);\nconst rg=g.createRadialGradient(CX,CY,0,CX,CY,560);rg.addColorStop(0,'rgba(224,120,79,0.12)');rg.addColorStop(1,'rgba(224,120,79,0)');g.fillStyle=rg;g.fillRect(CX-560,CY-560,1120,1120);\ng.lineWidth=1.2;\nfor(let i=0;N>i;i++){const age=t-P[i][2];if(0>age)break;\nfor(const k of F){const j=i-k;if(0>j)continue;\nconst a=0.08+0.6*Math.exp(-age*1.2);\ng.strokeStyle='rgba(224,120,79,'+a.toFixed(3)+')';\ng.beginPath();g.moveTo(pos[i][0],pos[i][1]);g.lineTo(pos[j][0],pos[j][1]);g.stroke();}}\nfor(let i=0;N>i;i++){const age=t-P[i][2];if(0>age)break;\nconst w=Math.exp(-Math.pow(P[i][0]-wave,2)/3200),fr=Math.exp(-age*2);\nconst r=1.2+Math.min(3.2,age*0.35)+w*2.6;\ng.fillStyle='rgba(244,239,230,'+Math.min(1,0.38+0.5*w+0.3*fr).toFixed(3)+')';\ng.beginPath();g.arc(pos[i][0],pos[i][1],r,0,6.283);g.fill();\nif(fr>0.04){g.strokeStyle='rgba(224,120,79,'+fr.toFixed(3)+')';g.lineWidth=1.5;g.beginPath();g.arc(pos[i][0],pos[i][1],r+4+16*(1-fr),0,6.283);g.stroke();g.lineWidth=1.2;}}\nconst lg=g.createLinearGradient(0,0,1150,0);lg.addColorStop(0,'rgba(20,18,16,0.97)');lg.addColorStop(0.55,'rgba(20,18,16,0.8)');lg.addColorStop(1,'rgba(20,18,16,0)');g.fillStyle=lg;g.fillRect(-400,-400,1550,1880);\nrequestAnimationFrame(f);}\nrequestAnimationFrame(f);\n</script></body></html>";
const SPIRAL_CLOSE =
  "<!doctype html><html><head><meta charset=\"utf-8\"></head><body style=\"margin:0;background:#141210;overflow:hidden\"><canvas id=\"c\" style=\"display:block;width:100vw;height:100vh\"></canvas><script>\nconst c=document.getElementById('c'),g=c.getContext('2d');\nlet W=1,H=1,D=1;\nfunction rs(){D=devicePixelRatio||1;W=innerWidth;H=innerHeight;c.width=W*D;c.height=H*D;}\nrs();addEventListener('resize',rs);\nconst N=760,GA=Math.PI*(3-Math.sqrt(5)),CX=1390,CY=540,K=16.5,F=[13,21,34],RATE=2.2,EXP=1.6,START=60;\nconst P=[];for(let i=0;N>i;i++){P.push([K*Math.sqrt(i+1),i*GA,Math.pow(i,1/EXP)/RATE]);}\nconst T0=performance.now()/1000-START;\nfunction f(){\nconst t=performance.now()/1000-T0,s=Math.min(W/1920,H/1080);\ng.setTransform(D*s,0,0,D*s,D*(W-1920*s)/2,D*(H-1080*s)/2);\ng.fillStyle='#141210';g.fillRect(-400,-400,2720,1880);\nconst rot=t*0.03,wave=(t*260)%1700;\nconst pos=P.map(p=>[CX+p[0]*Math.cos(p[1]+rot),CY+p[0]*Math.sin(p[1]+rot)]);\nconst rg=g.createRadialGradient(CX,CY,0,CX,CY,560);rg.addColorStop(0,'rgba(224,120,79,0.16)');rg.addColorStop(1,'rgba(224,120,79,0)');g.fillStyle=rg;g.fillRect(CX-560,CY-560,1120,1120);\ng.lineWidth=1.2;\nfor(let i=0;N>i;i++){const age=t-P[i][2];if(0>age)break;\nfor(const k of F){const j=i-k;if(0>j)continue;\nconst w=Math.exp(-Math.pow(P[i][0]-wave,2)/6000);\nconst a=0.1+0.35*w;\ng.strokeStyle='rgba(224,120,79,'+a.toFixed(3)+')';\ng.beginPath();g.moveTo(pos[i][0],pos[i][1]);g.lineTo(pos[j][0],pos[j][1]);g.stroke();}}\nfor(let i=0;N>i;i++){const age=t-P[i][2];if(0>age)break;\nconst w=Math.exp(-Math.pow(P[i][0]-wave,2)/3200);\nconst r=1.2+Math.min(3.2,age*0.35)+w*2.6;\ng.fillStyle='rgba(244,239,230,'+Math.min(1,0.45+0.5*w).toFixed(3)+')';\ng.beginPath();g.arc(pos[i][0],pos[i][1],r,0,6.283);g.fill();}\nconst lg=g.createLinearGradient(0,0,1150,0);lg.addColorStop(0,'rgba(20,18,16,0.97)');lg.addColorStop(0.55,'rgba(20,18,16,0.8)');lg.addColorStop(1,'rgba(20,18,16,0)');g.fillStyle=lg;g.fillRect(-400,-400,1550,1880);\nrequestAnimationFrame(f);}\nrequestAnimationFrame(f);\n</script></body></html>";

const CoverSlide: Page = () => (
  <div
    className="ccg"
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
    <Embed html={SPIRAL_COVER} />
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
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '96px', height: '6px', background: '#E0784F' }}
      ></div>
    </SharedElement>
  </div>
);

const SpeakerSlide: Page = () => (
  <div
    className="ccg"
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
      src={ivanPhoto}
      alt="Foto de Ivan Galaviz"
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
        {'Me obsesiona una pregunta: ¿quién va a mantener el código que hoy escriben los agentes?'}
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
        {'02 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '192px', height: '6px', background: '#B5502F' }}
      ></div>
    </SharedElement>
  </div>
);

const HookSlide: Page = () => (
  <div
    className="ccg"
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
        {'03 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '288px', height: '6px', background: '#E0784F' }}
      ></div>
    </SharedElement>
  </div>
);

const DiffSlide: Page = () => (
  <div
    className="ccg"
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
        {'04 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '384px', height: '6px', background: '#B5502F' }}
      ></div>
    </SharedElement>
  </div>
);

const BusFactorSlide: Page = () => (
  <div
    className="ccg"
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
      src={busFactor}
      alt="Ilustración del bus factor: una persona atropellada por un autobús y otra que exclama que nadie más sabía la contraseña"
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
        {'05 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '480px', height: '6px', background: '#B5502F' }}
      ></div>
    </SharedElement>
  </div>
);

const MultiplierSlide: Page = () => (
  <div
    className="ccg"
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
        {'06 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '576px', height: '6px', background: '#E0784F' }}
      ></div>
    </SharedElement>
  </div>
);

const QuestionSlide: Page = () => (
  <div
    className="ccg"
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
        {'07 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '672px', height: '6px', background: '#B5502F' }}
      ></div>
    </SharedElement>
  </div>
);

const MathSlide: Page = () => (
  <div
    className="ccg"
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
            color: '#f2cdbd',
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
              width: '56px',
              height: '56px',
              display: 'flex',
              flexDirection: 'column',
              background: '#f2cdbd',
              borderRadius: '256px',
              opacity: '0.6',
            }}
          ></div>
          <div
            style={{
              width: '56px',
              height: '56px',
              display: 'flex',
              flexDirection: 'column',
              background: '#f2cdbd',
              borderRadius: '256px',
              opacity: '0.6',
            }}
          ></div>
          <div
            style={{
              width: '56px',
              height: '56px',
              display: 'flex',
              flexDirection: 'column',
              background: '#f2cdbd',
              borderRadius: '256px',
              opacity: '0.6',
            }}
          ></div>
          <div
            style={{
              width: '56px',
              height: '56px',
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
        {'08 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '768px',
          height: '6px',
          display: 'flex',
          flexDirection: 'column',
          background: '#fbf8f2',
        }}
      ></div>
    </SharedElement>
  </div>
);

const DefinitionSlide: Page = () => (
  <div
    className="ccg"
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
        aria-label="Ciclo: Planear, Trabajar, Revisar, Compound, alrededor del repositorio"
        width="760"
        height="760"
        viewBox="0 0 760 760"
        style={{ position: 'absolute', left: '0', top: '0', width: '760px', height: '760px' }}
      >
        <circle cx="380" cy="380" r="330" fill="none" stroke="#2A2622" strokeWidth="1" />
        <circle cx="380" cy="380" r="260" fill="none" stroke="#4A453E" strokeWidth="2" strokeDasharray="4 10" />
        <circle cx="380" cy="380" r="150" fill="#1E1B18" stroke="#34302B" strokeWidth="1" />
        <polygon points="574,206 547,199 567,179" fill="#E0784F" />
        <polygon points="554,574 561,547 581,567" fill="#E0784F" />
        <polygon points="186,554 213,561 193,581" fill="#E0784F" />
        <polygon points="206,186 199,213 179,193" fill="#E0784F" />
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
        {'09 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '864px', height: '6px', background: '#E0784F' }}
      ></div>
    </SharedElement>
  </div>
);

const ClaudeLoopSlide: Page = () => (
  <div
    className="ccg"
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
      <Arrow color="#B5502F" width={32} height={16} />
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
      <Arrow color="#B5502F" width={32} height={16} />
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
      <Arrow color="#B5502F" width={32} height={16} />
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
        {'10 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '960px', height: '6px', background: '#B5502F' }}
      ></div>
    </SharedElement>
  </div>
);

const PlanSlide: Page = () => (
  <div
    className="ccg"
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
        {'11 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1056px', height: '6px', background: '#E0784F' }}
      ></div>
    </SharedElement>
  </div>
);

const WorkSlide: Page = () => (
  <div
    className="ccg"
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
        {'02 · TRABAJAR'}
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
        {'Subagentes: trabajo en paralelo, contexto limpio'}
      </h2>
    </div>
    <div style={{ position: 'relative', width: '1664px', height: '460px' }}>
      <Connector x1={520} y1={230} x2={820} y2={67} route="elbow" color="#B5502F" stroke={3} />
      <Connector x1={520} y1={230} x2={820} y2={230} route="straight" color="#B5502F" stroke={3} />
      <Connector x1={520} y1={230} x2={820} y2={393} route="elbow" color="#B5502F" stroke={3} />
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
            {'regresa el diff'}
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
          {'VERIFICA'}
        </p>
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontSize: '32px', lineHeight: '1.3', color: '#1F1D1A' }}>{'Corre las pruebas y los linters'}</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#6E665C' }}>
            {'regresa qué falló y por qué'}
          </p>
        </div>
      </div>
    </div>
    <p style={{ position: 'relative', fontSize: '32px', lineHeight: '1.45', color: '#5E5850', width: '1300px' }}>
      {'Cada subagente trabaja en su propia ventana de contexto y devuelve solo lo que importa.'}
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
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'12 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1152px', height: '6px', background: '#B5502F' }}
      ></div>
    </SharedElement>
  </div>
);

const ReviewSlide: Page = () => (
  <div
    className="ccg"
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
        {'03 · REVISAR'}
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
        {'Un revisor por cada lente'}
      </h2>
    </div>
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', gap: '80px', alignItems: 'center' }}>
      <div style={{ width: '600px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '32px',
            color: '#1F1D1A',
            background: '#FBF8F2',
            border: '1px solid #DDD5C7',
            borderRadius: '16px',
            padding: '20px 24px',
          }}
        >
          {'Corrección'}
        </p>
        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '32px',
            color: '#1F1D1A',
            background: '#FBF8F2',
            border: '1px solid #DDD5C7',
            borderRadius: '16px',
            padding: '20px 24px',
          }}
        >
          {'Pruebas'}
        </p>
        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '32px',
            color: '#1F1D1A',
            background: '#FBF8F2',
            border: '1px solid #DDD5C7',
            borderRadius: '16px',
            padding: '20px 24px',
          }}
        >
          {'Seguridad'}
        </p>
        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '32px',
            color: '#1F1D1A',
            background: '#FBF8F2',
            border: '1px solid #DDD5C7',
            borderRadius: '16px',
            padding: '20px 24px',
          }}
        >
          {'Rendimiento'}
        </p>
        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '32px',
            color: '#1F1D1A',
            background: '#FBF8F2',
            border: '1px solid #DDD5C7',
            borderRadius: '16px',
            padding: '20px 24px',
          }}
        >
          {'Arquitectura'}
        </p>
        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '32px',
            color: '#1F1D1A',
            background: '#FBF8F2',
            border: '1px solid #DDD5C7',
            borderRadius: '16px',
            padding: '20px 24px',
          }}
        >
          {'Mantenibilidad'}
        </p>
        <div
          style={{
            gridColumn: 'span 2',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: '20px',
            background: '#141210',
            borderRadius: '16px',
            padding: '20px 24px',
            boxShadow: '0 12px 32px rgba(181,80,47,0.25)',
          }}
        >
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '32px',
              color: '#E0784F',
            }}
          >
            {'Adversarial'}
          </p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#CFC6B8' }}>
            {'intenta romperlo'}
          </p>
        </div>
      </div>
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          background: '#141210',
          borderRadius: '24px',
          boxShadow: '0 24px 64px rgba(31,29,26,0.18)',
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
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#E0784F' }}>
            {'/code-review'}
          </p>
          <div style={{ flex: '1' }}></div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#8F877B' }}>{'ejemplo'}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
            <p
              style={{ width: '210px', fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#E0784F' }}
            >
              {'seguridad'}
            </p>
            <p style={{ flex: '1', fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#F4EFE6' }}>
              {'token impreso en logs'}
            </p>
            <p
              style={{ width: '150px', fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#9CC59A' }}
            >
              {'corregido'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
            <p
              style={{ width: '210px', fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#E0784F' }}
            >
              {'pruebas'}
            </p>
            <p style={{ flex: '1', fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#F4EFE6' }}>
              {'falta el caso límite = 0'}
            </p>
            <p
              style={{ width: '150px', fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#9CC59A' }}
            >
              {'agregado'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
            <p
              style={{ width: '210px', fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#E0784F' }}
            >
              {'rendimiento'}
            </p>
            <p style={{ flex: '1', fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#F4EFE6' }}>
              {'consulta N+1 en /orders'}
            </p>
            <p
              style={{ width: '150px', fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#9CC59A' }}
            >
              {'corregido'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
            <p
              style={{ width: '210px', fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#E0784F' }}
            >
              {'arquitectura'}
            </p>
            <p style={{ flex: '1', fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#F4EFE6' }}>
              {'lógica duplicada en 2 handlers'}
            </p>
            <p
              style={{ width: '150px', fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#9CC59A' }}
            >
              {'extraída'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
            <p
              style={{ width: '210px', fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#E0784F' }}
            >
              {'corrección'}
            </p>
            <p style={{ flex: '1', fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#F4EFE6' }}>
              {'off-by-one en la ventana'}
            </p>
            <p
              style={{ width: '150px', fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#9CC59A' }}
            >
              {'corregido'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
            <p
              style={{
                width: '210px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '24px',
                fontWeight: '700',
                color: '#E0784F',
              }}
            >
              {'adversarial'}
            </p>
            <p style={{ flex: '1', fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#F4EFE6' }}>
              {'una ráfaga de requests evade el límite'}
            </p>
            <p
              style={{ width: '150px', fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#9CC59A' }}
            >
              {'corregido'}
            </p>
          </div>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '24px',
              color: '#CFC6B8',
              borderTop: '1px solid #34302B',
              padding: '20px 0 0 0',
            }}
          >
            {'6 hallazgos · 6 resueltos antes del PR'}
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
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'13 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1248px', height: '6px', background: '#B5502F' }}
      ></div>
    </SharedElement>
  </div>
);

const CompoundSlide: Page = () => (
  <div
    className="ccg"
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
          gap: '40px',
          borderTop: '1px solid #34302B',
          padding: '22px 0',
        }}
      >
        <p style={{ width: '520px', fontSize: '32px', color: '#A39A8C' }}>{'Un bug que regresa'}</p>
        <Arrow color="#E0784F" width={48} height={24} />
        <p
          style={{
            width: '480px',
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
          gap: '40px',
          borderTop: '1px solid #34302B',
          padding: '22px 0',
        }}
      >
        <p style={{ width: '520px', fontSize: '32px', color: '#A39A8C' }}>{'Un hallazgo de revisión'}</p>
        <Arrow color="#E0784F" width={48} height={24} />
        <p
          style={{
            width: '480px',
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
          gap: '40px',
          borderTop: '1px solid #34302B',
          padding: '22px 0',
        }}
      >
        <p style={{ width: '520px', fontSize: '32px', color: '#A39A8C' }}>{'Un procedimiento que repites'}</p>
        <Arrow color="#E0784F" width={48} height={24} />
        <p
          style={{
            width: '480px',
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
          gap: '40px',
          borderTop: '1px solid #34302B',
          padding: '22px 0',
        }}
      >
        <p style={{ width: '520px', fontSize: '32px', color: '#A39A8C' }}>{'Una regla que no puede fallar'}</p>
        <Arrow color="#E0784F" width={48} height={24} />
        <p
          style={{
            width: '480px',
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
          gap: '40px',
          borderTop: '1px solid #34302B',
          borderBottom: '1px solid #34302B',
          padding: '22px 0',
        }}
      >
        <p style={{ width: '520px', fontSize: '32px', color: '#A39A8C' }}>{'Una decisión costosa'}</p>
        <Arrow color="#E0784F" width={48} height={24} />
        <div style={{ width: '480px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '44px',
              lineHeight: '1.2',
              color: '#F4EFE6',
            }}
          >
            {'Un ADR'}
          </p>
          <p
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', lineHeight: '1.4', color: '#A39A8C' }}
          >
            {'registro de decisión: qué elegimos, por qué y qué descartamos'}
          </p>
        </div>
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
        {'14 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1344px', height: '6px', background: '#E0784F' }}
      ></div>
    </SharedElement>
  </div>
);

const LayersSlide: Page = () => (
  <div
    className="ccg"
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
        {'LA MEMORIA DEL SISTEMA'}
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
        {'Dónde vive lo aprendido'}
      </h2>
    </div>
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid #DDD5C7',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '40px',
          background: '#FBF8F2',
          padding: '28px 40px',
        }}
      >
        <p
          style={{ width: '320px', fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '44px', color: '#1F1D1A' }}
        >
          {'CLAUDE.md'}
        </p>
        <p
          style={{
            width: '260px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '2px',
            color: '#B5502F',
          }}
        >
          {'SIEMPRE'}
        </p>
        <p style={{ flex: '1', fontSize: '28px', lineHeight: '1.4', color: '#5E5850' }}>
          {'Convenciones, comandos y reglas del equipo'}
        </p>
        <p
          style={{
            width: '330px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            textAlign: 'right',
            color: '#6E665C',
          }}
        >
          {'./CLAUDE.md'}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '40px',
          background: '#F1EADF',
          borderTop: '1px solid #DDD5C7',
          padding: '28px 40px',
        }}
      >
        <p
          style={{ width: '320px', fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '44px', color: '#1F1D1A' }}
        >
          {'Skills'}
        </p>
        <p
          style={{
            width: '260px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '2px',
            color: '#B5502F',
          }}
        >
          {'BAJO DEMANDA'}
        </p>
        <p style={{ flex: '1', fontSize: '28px', lineHeight: '1.4', color: '#5E5850' }}>
          {'Procedimientos repetibles, con sus scripts'}
        </p>
        <p
          style={{
            width: '330px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            textAlign: 'right',
            color: '#6E665C',
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
          gap: '40px',
          background: '#E8DFD1',
          borderTop: '1px solid #DDD5C7',
          padding: '28px 40px',
        }}
      >
        <p
          style={{ width: '320px', fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '44px', color: '#1F1D1A' }}
        >
          {'Hooks'}
        </p>
        <p
          style={{
            width: '260px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '2px',
            color: '#B5502F',
          }}
        >
          {'EN CADA EVENTO'}
        </p>
        <p style={{ flex: '1', fontSize: '28px', lineHeight: '1.4', color: '#4A453E' }}>
          {'Deterministas: no dependen de la memoria del modelo'}
        </p>
        <p
          style={{
            width: '330px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            textAlign: 'right',
            color: '#5E5850',
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
          gap: '40px',
          background: '#1F1D1A',
          padding: '28px 40px',
        }}
      >
        <p
          style={{ width: '320px', fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '44px', color: '#F4EFE6' }}
        >
          {'Subagentes'}
        </p>
        <p
          style={{
            width: '260px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            letterSpacing: '2px',
            color: '#E0784F',
          }}
        >
          {'AL DELEGAR'}
        </p>
        <p style={{ flex: '1', fontSize: '28px', lineHeight: '1.4', color: '#CFC6B8' }}>
          {'Especialistas con su propia ventana de contexto'}
        </p>
        <p
          style={{
            width: '330px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '24px',
            textAlign: 'right',
            color: '#A39A8C',
          }}
        >
          {'.claude/agents/'}
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
        {'15 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1440px', height: '6px', background: '#B5502F' }}
      ></div>
    </SharedElement>
  </div>
);

const PruneSlide: Page = () => (
  <div
    className="ccg"
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
        {'LA MEMORIA DEL SISTEMA'}
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
        {'La memoria también necesita mantenimiento'}
      </h2>
    </div>
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', gap: '96px', alignItems: 'center' }}>
      <div
        style={{
          width: '520px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          background: '#1E1B18',
          border: '1px solid #34302B',
          borderRadius: '24px',
          padding: '40px',
        }}
      >
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#8F877B' }}>{'CLAUDE.md'}</p>
        <div style={{ width: '380px', height: '14px', borderRadius: '7px', background: '#4A453E' }}></div>
        <div style={{ width: '300px', height: '14px', borderRadius: '7px', background: '#4A453E' }}></div>
        <div style={{ width: '420px', height: '14px', borderRadius: '7px', background: '#4A453E' }}></div>
        <div style={{ width: '260px', height: '14px', borderRadius: '7px', background: '#4A453E' }}></div>
        <div style={{ width: '400px', height: '14px', borderRadius: '7px', background: '#4A453E' }}></div>
        <div style={{ width: '340px', height: '14px', borderRadius: '7px', background: '#4A453E' }}></div>
        <div style={{ width: '220px', height: '14px', borderRadius: '7px', background: '#4A453E' }}></div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '16px',
            borderTop: '2px dashed #E0784F',
            padding: '10px 0 0 0',
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '24px',
              letterSpacing: '2px',
              color: '#E0784F',
            }}
          >
            {'PRESUPUESTO'}
          </p>
        </div>
        <div
          style={{ width: '410px', height: '14px', borderRadius: '7px', background: '#E0784F', opacity: '0.35' }}
        ></div>
        <div
          style={{ width: '330px', height: '14px', borderRadius: '7px', background: '#E0784F', opacity: '0.3' }}
        ></div>
        <div
          style={{ width: '390px', height: '14px', borderRadius: '7px', background: '#E0784F', opacity: '0.25' }}
        ></div>
        <div
          style={{ width: '280px', height: '14px', borderRadius: '7px', background: '#E0784F', opacity: '0.2' }}
        ></div>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', color: '#A39A8C' }}>
          {'todo lo de aquí abajo es ruido'}
        </p>
      </div>
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'baseline',
              gap: '32px',
              borderTop: '1px solid #34302B',
              padding: '22px 0',
            }}
          >
            <p
              style={{
                width: '180px',
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: '44px',
                color: '#F4EFE6',
              }}
            >
              {'Mide'}
            </p>
            <p style={{ flex: '1', fontSize: '28px', lineHeight: '1.4', color: '#CFC6B8' }}>
              {'El tamaño de CLAUDE.md y de cada SKILL.md, en cada ciclo'}
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'baseline',
              gap: '32px',
              borderTop: '1px solid #34302B',
              padding: '22px 0',
            }}
          >
            <p
              style={{
                width: '180px',
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: '44px',
                color: '#F4EFE6',
              }}
            >
              {'Poda'}
            </p>
            <p style={{ flex: '1', fontSize: '28px', lineHeight: '1.4', color: '#CFC6B8' }}>
              {'Reglas duplicadas, obsoletas o que ya cubre un hook o un test'}
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'baseline',
              gap: '32px',
              borderTop: '1px solid #34302B',
              borderBottom: '1px solid #34302B',
              padding: '22px 0',
            }}
          >
            <p
              style={{
                width: '180px',
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: '44px',
                color: '#F4EFE6',
              }}
            >
              {'Mueve'}
            </p>
            <p style={{ flex: '1', fontSize: '28px', lineHeight: '1.4', color: '#CFC6B8' }}>
              {'El detalle a skills que se cargan solo cuando hacen falta'}
            </p>
          </div>
        </div>
        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontStyle: 'italic',
            fontSize: '44px',
            lineHeight: '1.3',
            color: '#E0784F',
          }}
        >
          {'Que el ciclo de compound se revise a sí mismo.'}
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
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#8F877B' }}
      >
        {'COMPOUND ENGINEERING'}
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#8F877B' }}
      >
        {'16 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1536px', height: '6px', background: '#E0784F' }}
      ></div>
    </SharedElement>
  </div>
);

const StealSlide: Page = () => (
  <div
    className="ccg"
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
        {'17 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1632px', height: '6px', background: '#B5502F' }}
      ></div>
    </SharedElement>
  </div>
);

const WeekSlide: Page = () => (
  <div
    className="ccg"
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
        {'18 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1728px', height: '6px', background: '#E0784F' }}
      ></div>
    </SharedElement>
  </div>
);

const CloseSlide: Page = () => (
  <div
    className="ccg"
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
    <Embed html={SPIRAL_CLOSE} />
    <p
      style={{
        position: 'relative',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '24px',
        letterSpacing: '4px',
        color: '#E0784F',
      }}
    >
      {'EL ROI REAL'}
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
      {'Construye sistemas que suban la vara '}
      <i style={{ color: '#E0784F' }}>{'después de cada feature.'}</i>
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
        {'19 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1824px', height: '6px', background: '#E0784F' }}
      ></div>
    </SharedElement>
  </div>
);

const OutroSlide: Page = () => (
  <div
    className="ccg"
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
          src={qrSlides}
          alt="Código QR de la presentación en ivanovishado.dev"
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
          src={qrLinkedin}
          alt="Código QR del perfil de LinkedIn"
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
          src={qrX}
          alt="Código QR del perfil de X @ivanovishado"
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
        <a href="https://every.to/guides/compound-engineering" target="_blank" rel="noreferrer">
          <span style={{ color: '#B5502F' }}>{'COMPOUND ENGINEERING, DE EVERY'}</span>
        </a>
      </p>
      <p
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '24px', letterSpacing: '2px', color: '#6E665C' }}
      >
        {'20 / 20'}
      </p>
    </div>
    <SharedElement id="progress">
      <div
        style={{ position: 'absolute', left: '0', top: '0', width: '1920px', height: '6px', background: '#B5502F' }}
      ></div>
    </SharedElement>
  </div>
);

export const notes = [
  'Bienvenidos. Antes de empezar, fíjense en la espiral de la derecha. Cada punto que aparece es una sesión de trabajo que dejó algo guardado, y cada punto nuevo se conecta con los anteriores. Al principio crece despacio; luego se acelera. De eso trata esta charla: de cómo hacer que tu trabajo con Claude se acumule en lugar de evaporarse.',
  'Soy Ivan, Senior Software Engineer en Netflix. Uso Claude Code todos los días y hay una pregunta que no me deja: si los agentes escriben cada vez más código, ¿quién lo va a mantener dentro de un año, y con qué contexto? Esta charla es mi respuesta en progreso.',
  '[~1:00] Levanten la mano si hoy tuvieron una sesión así. Cuarenta minutos con Claude, probaron tres enfoques, encontraron dos bugs, tomaron una decisión difícil, y al final todo quedó en verde. Escriben exit. Clic: y ahora, ¿qué aprendió tu repo? La respuesta casi siempre es: nada. El código se queda, pero todo lo que lo hizo correcto se fue con la sesión.',
  'A la izquierda, lo que sí sobrevive: el diff. A la derecha, lo que se evaporó. La intención, las alternativas descartadas, el caso límite, la convención que tuvimos que corregir tres veces. Eso es deuda de contexto. Y como toda deuda, se paga con intereses: la próxima persona, o el próximo agente, va a redescubrir todo esto desde cero. Probablemente mañana.',
  'Todos conocemos el bus factor: cuántas personas tendrían que faltar para que el proyecto se detenga. ¿Cuántos tienen en su equipo a esa persona a la que todos le preguntan? Lo que sabe no está en el repo. Ahora agreguen agentes: cada sesión de Claude es como un compañero brillante que trabaja contigo una hora y luego desaparece para siempre. Si no guardaste nada, tu bus factor acaba de bajar otra vez.',
  'Aquí está la trampa. Claude multiplica tu velocidad: más cambios, más features, más PRs. Clic. Pero si cada sesión olvida, también multiplica el olvido. Más throughput no significa automáticamente más aprendizaje. Sin un sistema, acumulamos deuda de contexto más rápido que nunca.',
  '[~3:30] [Pausa de dos segundos.] Normalmente cada tarea hace la siguiente un poco más difícil: más código, más casos, más cosas que recordar. ¿Qué pasaría si fuera al revés?',
  'Piensen en cada sesión nueva de Claude como alguien brillante en su primer día en el equipo. Sabe programar, pero no sabe nada de tu repo. Arriba: sin memoria, cada sesión es otra vez su primer día. Siempre empieza de cero, y la bolita nunca crece. Abajo: con compound, cada sesión deja algo. La segunda ya llega con un CLAUDE.md. La tercera con skills. La cuarta con tests y decisiones documentadas. Es una bola de nieve: cada vuelta agrega una capa, y cuanto más grande es, más nieve levanta. Eso es el interés compuesto, sin fórmulas.',
  'A esto se le llama Compound Engineering; el término lo popularizó el equipo de Every. La idea: cada unidad de trabajo debe hacer más fáciles las siguientes. Planear, trabajar y revisar ya lo hacemos. Clic. La cuarta fase, compound, es tomar lo aprendido y devolverlo al repo para que la siguiente vuelta del ciclo empiece desde más arriba. En el centro no está Claude: está tu repositorio.',
  '[~5:30] Lo mejor: no necesitan instalar nada para empezar. Cada fase tiene un equivalente nativo en Claude Code. Plan mode para planear, subagentes para trabajar con contexto aislado, code review para revisar, y CLAUDE.md, skills y hooks para la fase que importa: compound. Fíjense en la fila de abajo: cada fase deja algo. Ese es el punto.',
  'Shift más Tab y Claude entra en plan mode: investiga, lee el código, propone, pero no toca archivos. El plan captura cuatro cosas: requisitos, restricciones, tradeoffs y criterios de éxito. Fíjense en el paréntesis del punto uno: ese porqué es justo lo que normalmente se pierde. Y la última línea: el plan se guarda en el repo. Un plan es un paquete de contexto que cualquier persona o agente puede abrir mañana. [Ejemplo ilustrativo.]',
  'Con el plan aprobado, Claude trabaja. El truco aquí son los subagentes: en lugar de que la sesión principal lea dos mil líneas para encontrar algo, delega. Un subagente explora y regresa un resumen. Otro implementa un paso. Otro verifica. Cada uno tiene su propia ventana de contexto, así que la sesión principal llega al final lúcida, no saturada. Se definen en punto claude barra agents, y también son parte del repo.',
  'Un solo revisor ve lo que ve. Varios revisores, cada uno con su lente, ven mucho más. Y agreguen siempre la lente adversarial: su único trabajo es intentar romper el cambio, como un atacante. Los demás preguntan si el código está bien; este pregunta cómo hacerlo fallar. code-review cubre lo básico; para más, defines subagentes revisores en punto claude barra agents. La meta: que cuando un humano abra el PR, los hallazgos ya estén resueltos. [Salida de ejemplo ilustrativa.]',
  'Esta es la fase que casi nadie hace, y la que cambia la curva. Cada cosa que aprendiste tiene un lugar. Un bug que regresa se vuelve un test. Un hallazgo de revisión, una regla en CLAUDE.md. Un procedimiento que repites, una skill. Una regla que no puede fallar, un hook. Y una decisión costosa, un ADR: un registro de decisión de arquitectura. Es un archivo corto con el contexto, la decisión y las alternativas descartadas; si la decisión cambia, se escribe uno nuevo. Es justo lo que vimos que se perdía en el diff. La lección deja de vivir en tu cabeza y empieza a vivir en el repo.',
  '¿Y dónde guardo cada cosa? Una regla simple. Si Claude debe saberlo siempre: CLAUDE.md. Si es un procedimiento que se usa a veces: una skill, que se carga solo cuando hace falta. Si no puede fallar nunca: un hook, porque es determinista y no depende de que el modelo se acuerde. Y si necesita su propio contexto: un subagente. Lo importante: todo vive en git, así que se revisa en un PR como cualquier otro código. Es memoria del equipo, no de una persona.',
  'Una advertencia honesta: si cada sesión agrega algo a CLAUDE.md, tarde o temprano se vuelve enorme, ocupa contexto en cada sesión y lo importante se pierde entre lo que ya no aplica. Así que el propio flujo de compound tiene que ser automantenible. Cada quien encontrará su forma, pero la idea es la misma: medir el tamaño, podar lo duplicado u obsoleto, y mover el detalle a skills que se cargan solo cuando hacen falta. Idealmente, la misma skill de compound lo revisa antes de agregar algo nuevo.',
  '[~11:00] Si se van a llevar una sola cosa de esta charla, que sea esto. Tómenle foto. Al final de cada sesión, antes de escribir exit, pídanle esto a Claude. Es la fase compound en dos líneas. Y cuando lo hayan hecho tres veces, conviértanlo en una skill propia que se llame compound, para que el hábito no dependa de que se acuerden.',
  'No hay que adoptar todo de golpe. Un escalón por día. Lunes: corran init y tengan su primer CLAUDE.md. Martes: plan mode para todo lo que no sea trivial. Miércoles: code review antes de cada PR. Jueves: su primera skill, del procedimiento que más repiten. Viernes: un hook para la regla que más se rompe. Fíjense que cada columna es más alta que la anterior: así se ve el interés compuesto.',
  '[~13:00] ¿Se acuerdan de la espiral de la portada? Así se ve después de muchas sesiones que sí dejaron algo. El ROI real de trabajar con agentes no es escribir más código: es construir sistemas que suban la vara después de cada feature. Menos contexto desechable, menor bus factor y un mejor siguiente cambio.',
  '[~14:00 · luego 5 min de Q&A con este slide arriba] Gracias. Aquí están la presentación, mi LinkedIn y mi X, donde estoy como ivanovishado. Dejo este slide arriba durante las preguntas para que todos alcancen a escanear. El concepto de Compound Engineering viene del equipo de Every; si quieren un flujo ya empaquetado, su plugin es un buen punto de partida. Pero todo lo que vimos hoy funciona con Claude Code tal como viene. Abrimos preguntas.',
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
  BusFactorSlide,
  MultiplierSlide,
  QuestionSlide,
  MathSlide,
  DefinitionSlide,
  ClaudeLoopSlide,
  PlanSlide,
  WorkSlide,
  ReviewSlide,
  CompoundSlide,
  LayersSlide,
  PruneSlide,
  StealSlide,
  WeekSlide,
  CloseSlide,
  OutroSlide,
] satisfies Page[];
