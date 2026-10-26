import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { fitText } from '@remotion/layout-utils';
import { loadFont } from '@remotion/google-fonts/InterTight';
import { C, REF_W, SPRING } from './tokens';
import { Block, CardItem, PointerProps } from './types';

const { fontFamily } = loadFont('normal', { weights: ['600', '700', '900'] });
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export function estimateKeyWordWidth(text: string, fontSize: number): number {
  // Inter Tight 900 tracking -0.04em is approximately 0.54 * fontSize * charCount for mixed case
  return Math.round(text.length * fontSize * 0.54);
}

export const KeyWord: React.FC<{
  text: string;
  at: number;
  hero?: boolean;
  y?: number;
  dot?: boolean;
  onLayout?: (box: { width: number; fontSize: number }) => void;
}> = ({ text, at, hero, y = 0.54, dot = false, onLayout }) => {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const S = width / REF_W;
  const t = f - at;
  const target = width * (hero ? 0.87 : 0.76);

  let size = (hero ? 165 : 115) * S;
  if (typeof document !== 'undefined') {
    try {
      const res = fitText({ text, withinWidth: target, fontFamily, fontWeight: '900' });
      if (res && res.fontSize) {
        size = Math.min(res.fontSize, (hero ? 165 : 115) * S);
      }
    } catch {
      size = Math.min(target / (Math.max(text.length, 1) * 0.56), (hero ? 165 : 115) * S);
    }
  } else {
    size = Math.min(target / (Math.max(text.length, 1) * 0.56), (hero ? 165 : 115) * S);
  }

  const p = spring({ frame: t, fps, config: SPRING.key });
  const opacity = interpolate(t, [0, 4], [0.3, 1], clamp);
  const blur = interpolate(t, [0, 5], [4, 0], clamp);
  if (t < 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: height * y,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12 * S,
        transform: `translateY(-50%) scale(${0.92 + 0.08 * p})`,
        opacity,
        filter: blur > 0 ? `blur(${blur * S}px)` : undefined,
      }}
    >
      <span
        style={{
          fontFamily,
          fontWeight: 900,
          fontSize: size,
          letterSpacing: '-0.04em',
          lineHeight: 0.9,
          color: C.orange,
          textAlign: 'center',
          textShadow: hero
            ? `0 0 ${22 * S}px ${C.glow}, 0 0 ${48 * S}px rgba(255,106,0,.35), 0 ${3 * S}px ${10 * S}px rgba(0,0,0,.45)`
            : `0 ${3 * S}px ${10 * S}px rgba(0,0,0,.45)`,
        }}
      >
        {text}
      </span>
      {dot && (
        <span
          style={{
            display: 'inline-block',
            width: 18 * S,
            height: 18 * S,
            borderRadius: '50%',
            backgroundColor: C.orange,
            boxShadow: `0 0 ${12 * S}px ${C.glow}`,
          }}
        />
      )}
    </div>
  );
};

export const Tier: React.FC<{
  text: string;
  at: number;
  kind: 1 | 3;
  style?: React.CSSProperties;
}> = ({ text, at, kind, style }) => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const S = width / REF_W;
  const t = f - at;
  if (t < 0) return null;

  const opacity = interpolate(t, [0, 5], [kind === 1 ? 0 : 0.35, kind === 1 ? 1 : 0.65], clamp);
  const y = interpolate(t, [0, 5], [6 * S, 0], clamp);

  return (
    <span
      style={{
        position: 'absolute',
        fontFamily,
        fontWeight: kind === 1 ? 700 : 600,
        fontSize: (kind === 1 ? 38 : 28) * S,
        color: kind === 1 ? C.white : C.w65,
        opacity,
        transform: `translateY(${y}px)`,
        letterSpacing: '-0.01em',
        textShadow: `0 ${2 * S}px ${8 * S}px rgba(0,0,0,.6)`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </span>
  );
};

export const Strike: React.FC<{
  at: number;
  box: { x: number; y: number; w: number };
}> = ({ at, box }) => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const S = width / REF_W;
  const w = interpolate(f - at, [0, 9], [0, box.w + 20 * S], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  if (f < at) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: box.x - 10 * S,
        top: box.y,
        width: w,
        height: 6 * S,
        background: C.white,
        transform: 'rotate(-4deg)',
        transformOrigin: 'left center',
        borderRadius: 3 * S,
        zIndex: 5,
      }}
    />
  );
};

export const PointerIcon: React.FC<PointerProps> = ({
  at,
  dur = 15,
  startX = 300,
  startY = 1100,
  dx = 180,
  dy = 20,
  rotDeg = 15,
}) => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const S = width / REF_W;
  const t = f - at;
  if (t < 0) return null;

  const progress = interpolate(t, [0, dur], [0, 1], {
    ...clamp,
    easing: (v) => 1 - Math.pow(1 - v, 3),
  });
  const opacity = interpolate(t, [0, 4], [0, 1], clamp);

  const curX = (startX + dx * progress) * S;
  const curY = (startY + dy * progress) * S;
  const curRot = -10 + rotDeg * progress;

  return (
    <div
      style={{
        position: 'absolute',
        left: curX,
        top: curY,
        opacity,
        transform: `rotate(${curRot}deg)`,
        transformOrigin: 'center center',
        pointerEvents: 'none',
        zIndex: 6,
        filter: `drop-shadow(0 0 ${12 * S}px ${C.glow})`,
      }}
    >
      <svg
        width={36 * S}
        height={36 * S}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 3L21 10.5L12.5 13L9.5 21L3 3Z"
          fill="rgba(255, 106, 0, 0.25)"
          stroke={C.orange}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const BlurWhip: React.FC<{
  c: number;
  children: React.ReactNode;
}> = ({ c, children }) => {
  const f = useCurrentFrame();
  const blur = interpolate(f, [c - 1, c, c + 1, c + 4, c + 5, c + 6], [0, 6, 20, 20, 12, 0], clamp);

  return (
    <div
      style={{
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        position: 'absolute',
        inset: 0,
      }}
    >
      {children}
    </div>
  );
};

export const Stripes: React.FC<{
  start: number;
}> = ({ start }) => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const S = width / REF_W;
  const P = 9 * S;
  const w = interpolate(f - start, [0, 4, 5, 9], [0, P, P, 0], clamp);

  if (f < start || f > start + 9) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        background: `repeating-linear-gradient(90deg, #fff 0, #fff ${w}px, transparent ${w}px, transparent ${P}px)`,
      }}
    />
  );
};

export const SettleZoom: React.FC<{
  at: number;
  from?: number;
  dur?: number;
  children: React.ReactNode;
}> = ({ at, from = 1.15, dur = 9, children }) => {
  const f = useCurrentFrame();
  const s = interpolate(f - at, [0, dur], [from, 1], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `scale(${s})`,
        transformOrigin: 'center center',
      }}
    >
      {children}
    </div>
  );
};

export const GradeOverlay: React.FC = () => (
  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
    {/* bottom falloff */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(to bottom, transparent 45%, rgba(0,0,0,.55) 70%, rgba(0,0,0,.92) 90%, #000 100%)',
      }}
    />
    {/* side vignette */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(ellipse 70% 60% at 50% 42%, transparent 55%, rgba(0,0,0,.45) 100%)',
      }}
    />
  </div>
);

export const RecHud: React.FC<{
  startFrame: number;
  endFrame: number;
}> = ({ startFrame, endFrame }) => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const S = width / REF_W;
  if (f < startFrame || f >= endFrame) return null;

  const inset = 50 * S;
  const topY = 86 * S;
  const bottomY = 1186 * S;
  const arm = 56 * S;
  const stroke = 2 * S;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', fontFamily, zIndex: 7 }}>
      {/* Top Left Bracket */}
      <div style={{ position: 'absolute', left: inset, top: topY, width: arm, height: stroke, background: C.white }} />
      <div style={{ position: 'absolute', left: inset, top: topY, width: stroke, height: arm, background: C.white }} />

      {/* Top Right Bracket */}
      <div style={{ position: 'absolute', right: inset, top: topY, width: arm, height: stroke, background: C.white }} />
      <div style={{ position: 'absolute', right: inset, top: topY, width: stroke, height: arm, background: C.white }} />

      {/* Bottom Left Bracket */}
      <div style={{ position: 'absolute', left: inset, top: bottomY, width: arm, height: stroke, background: C.white }} />
      <div style={{ position: 'absolute', left: inset, top: bottomY - arm + stroke, width: stroke, height: arm, background: C.white }} />

      {/* Bottom Right Bracket */}
      <div style={{ position: 'absolute', right: inset, top: bottomY, width: arm, height: stroke, background: C.white }} />
      <div style={{ position: 'absolute', right: inset, top: bottomY - arm + stroke, width: stroke, height: arm, background: C.white }} />

      {/* REC Indicator */}
      <div style={{ position: 'absolute', left: 52 * S, top: 122 * S, display: 'flex', alignItems: 'center', gap: 8 * S }}>
        <div style={{ width: 12 * S, height: 12 * S, borderRadius: '50%', background: C.orange, boxShadow: `0 0 ${8 * S}px ${C.glow}` }} />
        <span style={{ color: C.white, fontWeight: 700, fontSize: 18 * S, letterSpacing: '0.05em' }}>REC</span>
      </div>

      {/* Tiny crosshair near bottom-right */}
      <div style={{ position: 'absolute', right: inset + 20 * S, top: bottomY - 30 * S, color: C.white, fontSize: 18 * S, opacity: 0.8 }}>
        +
      </div>
    </div>
  );
};

export const GlassCard: React.FC<{
  card: CardItem;
}> = ({ card }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const S = width / REF_W;
  const t = f - card.startFrame;
  if (f < card.startFrame || f >= card.endFrame) return null;

  const scaleY = interpolate(t, [0, 5], [0.15, 1], clamp);
  const opacity = interpolate(t, [0, 4], [0.2, 1], clamp);

  const cardW = 440 * S;
  const cardH = 76 * S;
  const cardRadius = 16 * S;
  const yPos = height * card.y;

  // Words inside card - small words like "to" are styled smaller and raised
  const words = card.text.split(' ');
  const wordRevealDuration = 5; // each word reveals every few frames
  const wordsVisibleCount = Math.min(words.length, Math.floor(t / wordRevealDuration) + 1);

  return (
    <div
      style={{
        position: 'absolute',
        left: (width - cardW) / 2,
        top: yPos - cardH / 2,
        width: cardW,
        height: cardH,
        borderRadius: cardRadius,
        background: `${C.glass} linear-gradient(90deg, rgba(255,106,0,.45) 0%, transparent 70%)`,
        border: `1px solid ${C.border}`,
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${24 * S}px`,
        gap: 16 * S,
        transform: `scaleY(${scaleY})`,
        transformOrigin: 'center center',
        opacity,
        boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
        zIndex: 8,
      }}
    >
      {card.icon === 'warning' ? (
        <span style={{ color: C.orange, fontSize: 24 * S, fontWeight: 900 }}>▲</span>
      ) : (
        <span style={{ color: C.white, fontSize: 24 * S, fontWeight: 900 }}>✖</span>
      )}
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: 30 * S,
          color: C.white,
          letterSpacing: 0,
          display: 'flex',
          alignItems: 'baseline',
          gap: 6 * S,
        }}
      >
        {words.slice(0, wordsVisibleCount).map((word, idx) => {
          const isEmphasis = word.toLowerCase() === 'to';
          return (
            <span
              key={idx}
              style={{
                fontSize: isEmphasis ? 18 * S : 30 * S,
                transform: isEmphasis ? `translateY(${-4 * S}px)` : undefined,
                opacity: isEmphasis ? 0.85 : 1,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const FocusRing: React.FC<{
  at: number;
  dur?: number;
  pillText?: string;
}> = ({ at, dur = 57, pillText = 'Please turn it off' }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const S = width / REF_W;
  const t = f - at;
  if (t < 0 || t >= dur) return null;

  const ringScale = interpolate(t, [0, 6], [1.4, 1.0], clamp);
  const ringOpacity = interpolate(t, [0, 4], [0, 1], clamp);
  const ringSize = width * 0.55;

  // Annotation pill pops at 6.9s (frame offset ≈ 21 frames from shot cut at 6.20s)
  const pillOffset = 21;
  const pillT = t - pillOffset;
  const pillVisible = pillT >= 0;
  const pillScale = pillVisible ? interpolate(pillT, [0, 4], [0.6, 1.0], clamp) : 0;
  const pillOpacity = pillVisible ? interpolate(pillT, [0, 3], [0, 1], clamp) : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: (width - ringSize) / 2,
        top: height * 0.35 - ringSize / 2,
        width: ringSize,
        height: ringSize,
        borderRadius: '50%',
        border: `${4 * S}px solid ${C.white}`,
        boxShadow: `0 0 ${20 * S}px ${C.glow}`,
        transform: `scale(${ringScale})`,
        opacity: ringOpacity,
        pointerEvents: 'none',
        zIndex: 4,
      }}
    >
      {pillVisible && (
        <div
          style={{
            position: 'absolute',
            right: 10 * S,
            top: 20 * S,
            background: C.orange,
            color: C.black,
            fontFamily,
            fontWeight: 700,
            fontSize: 20 * S,
            padding: `${4 * S}px ${12 * S}px`,
            borderRadius: 12 * S,
            boxShadow: `0 4px 16px rgba(0,0,0,0.4)`,
            transform: `scale(${pillScale})`,
            opacity: pillOpacity,
            whiteSpace: 'nowrap',
          }}
        >
          {pillText}
        </div>
      )}
    </div>
  );
};

export const CaptionBlock: React.FC<{
  block: Block;
}> = ({ block }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const S = width / REF_W;

  if (f < block.startFrame || f >= block.endFrame) return null;

  const keyY = block.key.y ?? 0.54;
  const hero = block.key.hero ?? false;
  const keyCenterY = height * keyY;

  // Target font size and width estimation for alignment
  const target = width * (hero ? 0.87 : 0.76);
  let keyFontSize = (hero ? 165 : 115) * S;
  if (typeof document !== 'undefined') {
    try {
      const res = fitText({ text: block.key.text, withinWidth: target, fontFamily, fontWeight: '900' });
      if (res && res.fontSize) {
        keyFontSize = Math.min(res.fontSize, (hero ? 165 : 115) * S);
      }
    } catch {
      keyFontSize = Math.min(target / (Math.max(block.key.text.length, 1) * 0.56), (hero ? 165 : 115) * S);
    }
  } else {
    keyFontSize = Math.min(target / (Math.max(block.key.text.length, 1) * 0.56), (hero ? 165 : 115) * S);
  }

  const estimatedKW = estimateKeyWordWidth(block.key.text, keyFontSize);
  const keyLeft = (width - estimatedKW) / 2;
  const keyRight = (width + estimatedKW) / 2;

  // Cap height and stack gaps
  const t1BottomY = keyCenterY - keyFontSize * 0.45 - 6 * S;
  const t3TopY = keyCenterY + keyFontSize * 0.45 + 4 * S;

  const hasStrike = block.fx?.includes('strike');
  const hasPointer = block.fx?.includes('pointer');

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
      {/* T1 lead-ins */}
      {block.t1?.map((item, idx) => {
        const isRight = item.align === 'right';
        const isSingleLong = !isRight && block.t1?.length === 1 && item.text.length > 8;
        const leftPos = isSingleLong ? keyLeft + estimatedKW * 0.15 : keyLeft;

        return (
          <Tier
            key={idx}
            text={item.text}
            at={item.at}
            kind={1}
            style={
              isRight
                ? { right: width - keyRight, top: t1BottomY - 38 * S }
                : { left: leftPos, top: t1BottomY - 38 * S }
            }
          />
        );
      })}

      {/* Key Word */}
      <KeyWord
        text={block.key.text}
        at={block.key.at}
        hero={hero}
        y={keyY}
        dot={block.key.dot}
      />

      {/* Strike-through effect */}
      {hasStrike && (
        <Strike
          at={block.key.at + 2}
          box={{
            x: keyLeft,
            y: keyCenterY,
            w: estimatedKW,
          }}
        />
      )}

      {/* Pointer icon effect */}
      {hasPointer && (
        <PointerIcon
          at={block.key.at}
          startX={keyLeft / S}
          startY={(keyCenterY + 40 * S) / S}
          dx={120}
          dy={10}
        />
      )}

      {/* T3 trailing words */}
      {block.t3?.map((item, idx) => (
        <Tier
          key={idx}
          text={item.text}
          at={item.at}
          kind={3}
          style={{ right: width - keyRight, top: t3TopY }}
        />
      ))}
    </div>
  );
};
