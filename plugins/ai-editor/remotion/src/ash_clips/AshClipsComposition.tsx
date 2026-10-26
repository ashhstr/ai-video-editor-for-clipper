import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { C } from './tokens';
import {
  BlurWhip,
  CaptionBlock,
  FocusRing,
  GlassCard,
  GradeOverlay,
  RecHud,
  SettleZoom,
  Stripes,
} from './components';
import { Block } from './types';

export type AshClipsProps = {
  backgroundVideo?: string;
};

const BLOCKS: Block[] = [
  // Block 1: 0.03 - 1.63s (frames 1 - 49)
  {
    id: 'b1',
    startFrame: 1,
    endFrame: 49,
    t1: [
      { text: 'If the', at: 1, align: 'left' },
      { text: 'have to', at: 15, align: 'right' },
    ],
    key: { text: 'Prospects', at: 8, y: 0.54 },
    t3: [{ text: 'meet you', at: 25 }],
  },
  // Block 2: 1.67 - 3.10s (frames 50 - 93)
  {
    id: 'b2',
    startFrame: 50,
    endFrame: 93,
    t1: [{ text: 'to', at: 50, align: 'left' }],
    key: { text: 'Understand', at: 58, y: 0.54 },
    t3: [{ text: 'your value', at: 68 }],
    fx: ['pointer'],
  },
  // Block 3: 3.17 - 4.40s (frames 95 - 132)
  {
    id: 'b3',
    startFrame: 95,
    endFrame: 132,
    t1: [{ text: 'your', at: 95, align: 'left' }],
    key: { text: 'Content', at: 98, y: 0.54 },
    t3: [{ text: 'is failing', at: 108 }],
    fx: ['strike'],
  },
  // Block 4: 4.67 - 6.17s (frames 140 - 185) - HERO behind subject
  {
    id: 'b4',
    startFrame: 140,
    endFrame: 185,
    t1: [{ text: 'You know', at: 140, align: 'left' }],
    key: { text: 'content', at: 147, hero: true, y: 0.16 },
    t3: [{ text: 'matters', at: 165 }],
    fx: ['behindSubject'],
  },
  // Block 5: 6.43 - 8.10s (frames 186 - 243) - B-Roll
  {
    id: 'b5',
    startFrame: 186,
    endFrame: 243,
    t1: [{ text: 'being on', at: 193, align: 'left' }],
    key: { text: 'Camera Stresses', at: 198, y: 0.54 },
    t3: [{ text: 'you out', at: 220 }],
  },
  // Block 6: 8.33 - 10.0s (frames 250 - 300)
  {
    id: 'b6',
    startFrame: 250,
    endFrame: 300,
    t1: [{ text: 'even if', at: 250, align: 'left' }],
    key: { text: 'You record', at: 260, y: 0.54, dot: true },
    t3: [{ text: 'you are unsure', at: 280 }],
  },
  // Block 8: 14.67 - 16.92s (frames 440 - 508)
  {
    id: 'b8',
    startFrame: 440,
    endFrame: 508,
    t1: [{ text: 'we take it off', at: 440, align: 'left' }],
    key: { text: 'Your plate', at: 470, y: 0.54 },
  },
];

export const AshClipsComposition: React.FC<AshClipsProps> = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* Background footage layer with SettleZoom applied at each cut-in (§6.10) */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* Shot 1: A-Roll (0 - 185) */}
        {frame < 186 && (
          <SettleZoom at={0} from={1.15} dur={12}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 50% 40%, #1e1e1e 0%, #0a0a0a 100%)',
              }}
            />
          </SettleZoom>
        )}

        {/* Shot 2: B-Roll Insert (186 - 247) */}
        {frame >= 186 && frame < 248 && (
          <SettleZoom at={186} from={1.2} dur={10}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 50% 35%, #2a2218 0%, #0a0a0a 100%)',
              }}
            />
          </SettleZoom>
        )}

        {/* Shot 3: A-Roll Return (248 - 508) */}
        {frame >= 248 && (
          <SettleZoom at={248} from={1.15} dur={9}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 50% 40%, #1e1e1e 0%, #0a0a0a 100%)',
              }}
            />
          </SettleZoom>
        )}
      </div>

      {/* Grade treatment overlay (bottom black falloff + side vignette) */}
      <GradeOverlay />

      {/* Focus Ring on B-Roll (frames 186 - 243) with Annotation Pill popping at 6.9s (f207) */}
      <FocusRing at={186} dur={57} pillText="Please turn it off" />

      {/* BlurWhip Cut #1 (frames 93 - 98) */}
      <BlurWhip c={95}>
        <div style={{ position: 'absolute', inset: 0 }} />
      </BlurWhip>

      {/* Stripe Dissolve (frames 132 - 141) */}
      <Stripes start={132} />

      {/* BlurWhip Cut #2 (frames 243 - 248) */}
      <BlurWhip c={248}>
        <div style={{ position: 'absolute', inset: 0 }} />
      </BlurWhip>

      {/* REC HUD: 9.0s - 14.6s (frames 270 - 438) */}
      <RecHud startFrame={270} endFrame={438} />

      {/* Glass UI Cards: 10.23s - 14.6s (frames 307 - 438) */}
      <GlassCard
        card={{
          id: 'c1',
          startFrame: 307,
          endFrame: 438,
          icon: 'warning',
          text: 'what to say?',
          y: 0.56,
        }}
      />
      <GlassCard
        card={{
          id: 'c2',
          startFrame: 360,
          endFrame: 438,
          icon: 'cross',
          text: 'how it turn to revenue?',
          y: 0.66,
        }}
      />

      {/* Caption Blocks (1 through 8) */}
      {BLOCKS.map((block) => (
        <CaptionBlock key={block.id} block={block} />
      ))}
    </AbsoluteFill>
  );
};
