import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';

const VB = 188;

/**
 * Flip to `false` to restore the original SVG “conversation pit” drawing.
 * (`true` = use `assets/pit-ring-art.png` under the centered question card.)
 */
export const USE_BITMAP_PIT_ART = false;

/** Card width vs pit square when using bitmap art — tweak if copy clips. */
const BITMAP_CARD_WIDTH_RATIO = 0.42;

/**
 * How much to blow up the PNG inside its slot (>1 = bigger pit, edges may crop).
 * Tune here if it still feels small/large.
 */
export const BITMAP_PIT_ZOOM = 1.06;

/** Rotate bitmap (+ matching player dots) — clockwise degrees. */
const BITMAP_ROTATE_DEG = '90deg';

const PIT_RING_IMAGE = require('../assets/pit-ring-art.png');

/** Sofa ring + pit floor — tints per vibe (Concept 03 vector mode). */
export const RING_BY_VIBE = {
  light: { sofa: '#EBE4CD', cushion: '#D4CCB0', pitFloor: '#D8D4BC' },
  deep: { sofa: '#3D5B4F', cushion: '#2F4840', pitFloor: '#D4CFA0' },
  chaotic: { sofa: '#EFE750', cushion: '#DCD34A', pitFloor: '#E5E2C4' },
  nostalgic: { sofa: '#BDCDE0', cushion: '#A0B8CC', pitFloor: '#D4CFA0' },
  spicy: { sofa: '#8E555D', cushion: '#74464D', pitFloor: '#D4CFA0' },
};

const PLAYER_DOT_STYLES = [
  { fill: '#EBE4CD', stroke: '#1C1A14' },
  { fill: '#EFE750', stroke: '#1C1A14' },
  { fill: '#8E555D', stroke: '#FAF0F2' },
  { fill: '#3D5B4F', stroke: '#C8E0D2' },
  { fill: '#BDCDE0', stroke: '#1A2A3A' },
  { fill: '#C9837A', stroke: '#5A2E1E' },
  { fill: '#F2EED5', stroke: '#1C1A14' },
  { fill: '#8A7D6A', stroke: '#F2EED5' },
];

function playerDotPositions(count) {
  const cx = 94;
  const cy = 94;
  const r = 77;
  return Array.from({ length: count }, (_, i) => {
    const θ = -Math.PI / 2 + (i / Math.max(count, 1)) * (Math.PI * 2);
    return {
      cx: cx + r * Math.cos(θ),
      cy: cy + r * Math.sin(θ),
    };
  });
}

function PlayerDotsOverlay({ size, dots }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${VB} ${VB}`}
      pointerEvents="none"
    >
      {dots.map((p, i) => {
        const s = PLAYER_DOT_STYLES[i % PLAYER_DOT_STYLES.length];
        return (
          <Circle
            key={`p-${i}`}
            cx={p.cx}
            cy={p.cy}
            r={6}
            fill={s.fill}
            stroke={s.stroke}
            strokeWidth={1.2}
          />
        );
      })}
    </Svg>
  );
}

function QuestionCard({
  metaUpper,
  question,
  questionColor,
  metaColor,
  cardBg,
  style,
  textStyle = 'default',
}) {
  const metaStyles =
    textStyle === 'bitmap' ? [styles.meta, styles.metaBitmap] : [styles.meta];
  const questionStyles =
    textStyle === 'bitmap'
      ? [styles.question, styles.questionBitmap]
      : [styles.question];

  return (
    <View style={[styles.cardOverlay, { backgroundColor: cardBg }, style]}>
      <Text
        style={[...metaStyles, { color: metaColor }]}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
      >
        {metaUpper}
      </Text>
      <Text style={[...questionStyles, { color: questionColor }]}>
        {question}
      </Text>
    </View>
  );
}

/**
 * Pit ring frames the question card; optional player dots (virtual pit).
 */
export default function PitRingFrame({
  ring,
  metaUpper,
  question,
  questionColor,
  metaColor,
  cardBg,
  size,
  playerCount = 0,
  dashColor = '#8A7D6A',
}) {
  const dots = useMemo(
    () => playerDotPositions(Math.min(Math.max(playerCount, 0), 8)),
    [playerCount]
  );

  const innerLeft = (size * 42) / VB;
  const innerTop = (size * 42) / VB;
  const innerW = (size * 104) / VB;
  const innerH = (size * 104) / VB;

  if (USE_BITMAP_PIT_ART) {
    const zoom = BITMAP_PIT_ZOOM;
    const scaled = size * zoom;
    const cardW = size * BITMAP_CARD_WIDTH_RATIO;
    return (
      <View
        style={[styles.wrap, { width: size, height: size, overflow: 'hidden' }]}
      >
        <View style={[styles.bitmapClip, { width: size, height: size }]}>
          {/* Rotation on a wrapper — Hermes/RN sometimes ignores transform on Image. */}
          <View style={{ transform: [{ rotate: BITMAP_ROTATE_DEG }] }}>
            <Image
              source={PIT_RING_IMAGE}
              style={{ width: scaled, height: scaled }}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          </View>
        </View>
        {dots.length > 0 ? (
          <View
            style={[styles.dotsClip, { width: size, height: size }]}
            pointerEvents="none"
          >
            <View
              style={{
                width: size,
                height: size,
                transform: [
                  { rotate: BITMAP_ROTATE_DEG },
                  { scale: zoom },
                ],
              }}
            >
              <PlayerDotsOverlay size={size} dots={dots} />
            </View>
          </View>
        ) : null}
        <View
          style={[StyleSheet.absoluteFillObject, styles.centerLayer]}
          pointerEvents="box-none"
        >
          <QuestionCard
            metaUpper={metaUpper}
            question={question}
            questionColor={questionColor}
            metaColor={metaColor}
            cardBg={cardBg}
            textStyle="bitmap"
            style={{
              width: cardW,
              maxWidth: cardW,
              minHeight: innerH * 0.8,
              paddingHorizontal: 10,
              paddingVertical: 12,
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${VB} ${VB}`}>
        <Rect
          x={4}
          y={4}
          width={180}
          height={180}
          rx={22}
          fill="none"
          stroke={dashColor}
          strokeWidth={1}
          strokeDasharray="3 4"
        />

        <Rect x={14} y={6} width={160} height={22} rx={8} fill={ring.sofa} />
        {[24, 50, 78, 106, 134].map((x) => (
          <Rect
            key={`ts-${x}`}
            x={x}
            y={9}
            width={18}
            height={16}
            rx={4}
            fill={ring.cushion}
            opacity={0.7}
          />
        ))}

        <Rect x={14} y={160} width={160} height={22} rx={8} fill={ring.sofa} />
        {[24, 50, 78, 106, 134].map((x) => (
          <Rect
            key={`bs-${x}`}
            x={x}
            y={163}
            width={18}
            height={16}
            rx={4}
            fill={ring.cushion}
            opacity={0.7}
          />
        ))}

        <Rect x={6} y={14} width={22} height={160} rx={8} fill={ring.sofa} />
        {[24, 50, 78, 106, 134].map((y) => (
          <Rect
            key={`ls-${y}`}
            x={9}
            y={y}
            width={16}
            height={18}
            rx={4}
            fill={ring.cushion}
            opacity={0.7}
          />
        ))}

        <Rect x={160} y={14} width={22} height={160} rx={8} fill={ring.sofa} />
        {[24, 50, 78, 106, 134].map((y) => (
          <Rect
            key={`rs-${y}`}
            x={163}
            y={y}
            width={16}
            height={18}
            rx={4}
            fill={ring.cushion}
            opacity={0.7}
          />
        ))}

        <Rect x={32} y={32} width={124} height={124} rx={10} fill={ring.pitFloor} />

        {dots.map((p, i) => {
          const s = PLAYER_DOT_STYLES[i % PLAYER_DOT_STYLES.length];
          return (
            <Circle
              key={`p-${i}`}
              cx={p.cx}
              cy={p.cy}
              r={6}
              fill={s.fill}
              stroke={s.stroke}
              strokeWidth={1.2}
            />
          );
        })}
      </Svg>

      <QuestionCard
        metaUpper={metaUpper}
        question={question}
        questionColor={questionColor}
        metaColor={metaColor}
        cardBg={cardBg}
        style={{
          position: 'absolute',
          left: innerLeft,
          top: innerTop,
          width: innerW,
          height: innerH,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    alignSelf: 'center',
  },
  bitmapClip: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsClip: {
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLayer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardOverlay: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  meta: {
    fontFamily: 'DMMono-Regular',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 10,
  },
  metaBitmap: {
    fontSize: 8,
    marginBottom: 6,
  },
  question: {
    fontFamily: 'DMSerif-Regular',
    fontSize: 21,
    lineHeight: 27,
    textAlign: 'center',
    letterSpacing: -0.25,
  },
  questionBitmap: {
    fontSize: 15,
    lineHeight: 21,
  },
});
