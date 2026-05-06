import {
  DMSerifDisplay_400Regular,
  DMSerifDisplay_400Regular_Italic,
} from '@expo-google-fonts/dm-serif-display';
import { DMMono_400Regular } from '@expo-google-fonts/dm-mono';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

const SAND = '#F2E8D5';
const INK = '#1C1A14';
const WARM_GRAY = '#8A7B6A';
const GRAY_LIGHT = '#C4B9AC';
const DUSTY = '#C9837A';
const PEACH = '#F0DBC8';

type Vibe = 'light' | 'deep' | 'chaotic' | 'nostalgic' | 'spicy';

type QuestionItem = { q: string; depth: number; follow: string };

const QUESTIONS: Record<Vibe, QuestionItem[]> = {
  light: [
    {
      q: "What's a skill you have that genuinely surprises people?",
      depth: 1,
      follow: 'When did you first realize you were good at it?',
    },
    {
      q: "What's a food you hated as a kid that you secretly love now?",
      depth: 1,
      follow: 'Do you remember the exact moment you changed your mind?',
    },
    {
      q: "What's the most useless skill you're actually proud of?",
      depth: 1,
      follow: 'Has it ever accidentally come in handy?',
    },
    {
      q: "What compliment have you never forgotten?",
      depth: 2,
      follow: 'Do you think the person knew how much it meant?',
    },
    {
      q: "What's a movie you've seen more times than you'd admit?",
      depth: 1,
      follow: 'What keeps pulling you back to it?',
    },
    {
      q: 'If you could only eat one cuisine for the rest of the year, what would it be?',
      depth: 1,
      follow: 'What dish would you miss most from everything else?',
    },
  ],
  deep: [
    {
      q: 'What version of yourself did you have to leave behind to become who you are now?',
      depth: 3,
      follow: 'Do you ever miss that version of yourself?',
    },
    {
      q: "What's something you used to believe about yourself that you don't anymore?",
      depth: 3,
      follow: 'What changed — a moment, or a slow drift?',
    },
    {
      q: 'When did you last feel genuinely proud of something you did?',
      depth: 2,
      follow:
        'Did you let yourself sit with that feeling, or did you move on quickly?',
    },
    {
      q: "What's a version of your life you almost lived?",
      depth: 3,
      follow: 'Do you ever wonder about it, or have you made peace with it?',
    },
    {
      q: 'What do you wish people asked you about more?',
      depth: 2,
      follow: "Why do you think they don't?",
    },
    {
      q: "What's a fear you've never told anyone about?",
      depth: 3,
      follow: 'Where do you think it comes from?',
    },
  ],
  chaotic: [
    {
      q: "What's your villain origin story — the one that actually makes sense?",
      depth: 1,
      follow: "Are you sure you're still not in that arc?",
    },
    {
      q: 'If you had to describe your personality as a piece of furniture, what is it?',
      depth: 1,
      follow: "Is that the furniture you'd want to be, or just the most accurate?",
    },
    {
      q: 'What hill will you die on that genuinely does not matter at all?',
      depth: 2,
      follow: 'Has anyone ever changed your mind on this? Even slightly?',
    },
    {
      q: 'Assign everyone in this room a 70s interior design era. Explain your choices.',
      depth: 1,
      follow: "Who's most offended by their assignment?",
    },
    {
      q: "What's the worst advice you've ever followed and somehow it worked out?",
      depth: 2,
      follow: 'Would you give that advice to someone else?',
    },
    {
      q: "If your life had a director's commentary track, what would be the most embarrassing revelation?",
      depth: 2,
      follow: 'Is there anyone in this room who already knows that story?',
    },
  ],
  nostalgic: [
    {
      q: "What's a song that takes you back to a specific moment every single time?",
      depth: 2,
      follow:
        'Can you still access that feeling when you hear it, or has it faded?',
    },
    {
      q: 'What did you want to be when you grew up, and do you remember exactly why?',
      depth: 2,
      follow: 'Is any part of that still alive in what you do now?',
    },
    {
      q: "What's the best summer you remember having?",
      depth: 1,
      follow: 'What made it feel so different from others?',
    },
    {
      q: "What's something from your childhood that you wish still existed?",
      depth: 1,
      follow:
        'Is there a modern version of it that almost hits, but not quite?',
    },
    {
      q: "What's a smell that takes you somewhere completely specific?",
      depth: 2,
      follow: 'Is it a good place or a complicated one?',
    },
    {
      q: 'Who was the first person outside your family who made you feel truly seen?',
      depth: 3,
      follow: 'Are you still in touch with them?',
    },
  ],
  spicy: [
    {
      q: "What's an opinion you hold that most people in this room would push back on?",
      depth: 2,
      follow: 'Has anyone ever actually changed your mind on this?',
    },
    {
      q: "What's something you've completely reversed your position on in the last two years?",
      depth: 2,
      follow: 'What was the moment that cracked it open?',
    },
    {
      q: "What's a boundary you've set that other people thought was strange?",
      depth: 3,
      follow: 'Do you still hold it, or has it shifted?',
    },
    {
      q: "What's something you'd never say first, but would say if someone else opened the door?",
      depth: 2,
      follow: 'Is there someone in this room you'd say it to right now?',
    },
    {
      q: "What's the most honest thing you've said to someone that you weren't sure they were ready to hear?",
      depth: 3,
      follow: 'How did they take it?',
    },
    {
      q: "What's a belief you inherited that you've quietly let go of?",
      depth: 3,
      follow: 'Did you ever tell the person you inherited it from?',
    },
  ],
};

/** Softer band inside the dashed outline — shifts with vibe */
const PIT_SEAT: Record<Vibe, string> = {
  light: '#E4DFC4',
  deep: '#8AAC9C',
  chaotic: '#E8E070',
  nostalgic: '#B8C8D8',
  spicy: '#C49AA0',
};

/** Inner card frame accent */
const CARD_BORDER: Record<Vibe, string> = {
  light: '#9A9568',
  deep: '#2F4A3C',
  chaotic: '#A6A620',
  nostalgic: '#6D8494',
  spicy: '#6B3E44',
};

const CARD_META: Record<Vibe, string> = {
  light: '#6A6430',
  deep: '#8AB89A',
  chaotic: '#7A7A00',
  nostalgic: '#3A5A7A',
  spicy: '#E0BCC2',
};

const CARD_QUESTION: Record<Vibe, string> = {
  light: '#1C1A14',
  deep: '#E8F4EC',
  chaotic: '#1C1A14',
  nostalgic: '#1A2A3A',
  spicy: '#FAF0F2',
};

const CARD_SURFACE = '#F7F4EC';

const PLAYER_DOTS: { color: string; style: object }[] = [
  { color: '#3D6B4F', style: { top: '9%', left: '22%' } },
  { color: '#E8E4C0', style: { top: '10%', right: '20%' } },
  { color: '#EFEF50', style: { bottom: '12%', right: '22%' } },
  { color: '#8C5560', style: { bottom: '14%', left: '20%' } },
];

const SEAT_SLOTS = [
  { top: '6%', left: '38%' },
  { top: '18%', right: '8%' },
  { bottom: '22%', right: '10%' },
  { bottom: '10%', left: '36%' },
  { top: '38%', left: '6%' },
  { top: '42%', right: '7%' },
  { bottom: '38%', left: '8%' },
  { bottom: '34%', right: '9%' },
];

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSerifDisplay_400Regular,
    DMSerifDisplay_400Regular_Italic,
    DMMono_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  const [vibe, setVibe] = useState<Vibe>('nostalgic');
  const [qIndex, setQIndex] = useState(2);
  const [deeperOpen, setDeeperOpen] = useState(false);

  const list = QUESTIONS[vibe];
  const current = list[qIndex];

  const shuffle = useCallback(() => {
    setDeeperOpen(false);
    setQIndex((prev) => {
      if (list.length <= 1) return 0;
      let next = prev;
      let guard = 0;
      while (next === prev && guard < 32) {
        next = Math.floor(Math.random() * list.length);
        guard++;
      }
      return next;
    });
  }, [list.length]);

  const selectVibe = useCallback((next: Vibe) => {
    setDeeperOpen(false);
    setVibe(next);
    setQIndex(0);
  }, []);

  const pitSeatColor = PIT_SEAT[vibe];
  const seatGrain = useMemo(
    () => ({
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(28,26,20,0.03)',
    }),
    [],
  );

  if (!fontsLoaded) return null;

  const vibes: Vibe[] = ['light', 'deep', 'chaotic', 'nostalgic', 'spicy'];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.wordmark}>drop a topic</Text>
        <Text style={styles.sessionMeta}>{PLAYER_DOTS.length} IN THE PIT</Text>
      </View>

      <Text style={styles.metaRibbon}>
        DEPTH {current.depth} OF 3 · {vibe.toUpperCase()}
      </Text>

      <Text style={styles.vibeLabel}>pick a vibe</Text>
      <View style={styles.vibeRow}>
        {vibes.map((v) => {
          const active = v === vibe;
          return (
            <Pressable
              key={v}
              onPress={() => selectVibe(v)}
              style={[
                styles.vibePill,
                active && styles.vibePillActive,
                active && vibePillSurface[v],
              ]}
            >
              <Text
                style={[
                  styles.vibePillText,
                  active && vibePillText[v],
                  !active && styles.vibePillTextIdle,
                ]}
              >
                {v}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.pitWrap}>
        <View style={styles.pitOuter}>
          <View style={[styles.pitSeat, { backgroundColor: pitSeatColor }]}>
            <View pointerEvents="none" style={seatGrain} />
            {SEAT_SLOTS.map((slot, i) => (
              <View key={i} pointerEvents="none" style={[styles.seatMark, slot]} />
            ))}
            {PLAYER_DOTS.map((p, i) => (
              <View
                key={i}
                pointerEvents="none"
                style={[styles.playerDot, p.style, { backgroundColor: p.color }]}
              />
            ))}
            <View style={[styles.card, { borderColor: CARD_BORDER[vibe] }]}>
              <Text style={[styles.cardEyebrow, { color: CARD_META[vibe] }]}>
                {vibe.toUpperCase()} · {current.depth}/3
              </Text>
              <Text style={[styles.question, { color: CARD_QUESTION[vibe] }]}>
                {current.q}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {deeperOpen ? (
        <View style={styles.deeperCard}>
          <Text style={styles.deeperEyebrow}>go deeper ↓</Text>
          <Text style={styles.deeperText}>{current.follow}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Pressable
          onPress={shuffle}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
        >
          <Text style={styles.btnLabel}>SHUFFLE ↻</Text>
        </Pressable>
        <Pressable
          onPress={() => setDeeperOpen((v) => !v)}
          style={({ pressed }) => [
            styles.btn,
            styles.btnDeep,
            deeperOpen && styles.btnDeepOn,
            pressed && styles.btnPressed,
          ]}
        >
          <Text style={[styles.btnLabel, styles.btnDeepLabel]}>GO DEEPER</Text>
        </Pressable>
      </View>

    </SafeAreaView>
  );
}

const vibePillSurface: Record<Vibe, object> = {
  light: {
    backgroundColor: '#E8E4C0',
    borderColor: '#BFBB8A',
  },
  deep: {
    backgroundColor: '#3D6B4F',
    borderColor: '#3D6B4F',
  },
  chaotic: {
    backgroundColor: '#EFEF50',
    borderColor: '#EFEF50',
  },
  nostalgic: {
    backgroundColor: '#B8C8D8',
    borderColor: '#B8C8D8',
  },
  spicy: {
    backgroundColor: '#8C5560',
    borderColor: '#8C5560',
  },
};

const vibePillText: Record<Vibe, object> = {
  light: { color: '#3A3620' },
  deep: { color: '#C8E0D2' },
  chaotic: { color: '#3A3A00' },
  nostalgic: { color: '#1A2A3A' },
  spicy: { color: '#F0D0D4' },
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SAND,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 16,
    paddingBottom: 12,
  },
  wordmark: {
    fontFamily: 'DMSerifDisplay_400Regular_Italic',
    fontSize: 22,
    color: INK,
    letterSpacing: -0.2,
  },
  sessionMeta: {
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
    letterSpacing: 1.4,
    color: WARM_GRAY,
  },
  metaRibbon: {
    fontFamily: 'DMMono_400Regular',
    fontSize: 9,
    letterSpacing: 2,
    textAlign: 'center',
    color: WARM_GRAY,
    marginBottom: 14,
  },
  vibeLabel: {
    fontFamily: 'DMMono_400Regular',
    fontSize: 9,
    letterSpacing: 3,
    color: WARM_GRAY,
    marginBottom: 10,
  },
  vibeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 22,
  },
  vibePill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: GRAY_LIGHT,
    backgroundColor: 'transparent',
  },
  vibePillActive: {
    borderWidth: 1,
  },
  vibePillText: {
    fontFamily: 'DMMono_400Regular',
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'lowercase',
  },
  vibePillTextIdle: {
    color: WARM_GRAY,
  },
  pitWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pitOuter: {
    width: '100%',
    maxWidth: 360,
    aspectRatio: 1,
    borderRadius: 36,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: INK,
    padding: 11,
  },
  pitSeat: {
    flex: 1,
    borderRadius: 28,
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  seatMark: {
    position: 'absolute',
    width: 14,
    height: 11,
    borderRadius: 4,
    backgroundColor: 'rgba(28,26,20,0.045)',
  },
  playerDot: {
    position: 'absolute',
    width: 11,
    height: 11,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(28,26,20,0.18)',
  },
  card: {
    width: '76%',
    minHeight: 176,
    borderRadius: 18,
    borderWidth: 3,
    paddingHorizontal: 22,
    paddingVertical: 24,
    justifyContent: 'center',
    backgroundColor: CARD_SURFACE,
  },
  cardEyebrow: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 11,
    letterSpacing: 0.6,
    marginBottom: 14,
  },
  question: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.2,
  },
  deeperCard: {
    marginTop: 18,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: PEACH,
    borderLeftWidth: 3,
    borderLeftColor: DUSTY,
  },
  deeperEyebrow: {
    fontFamily: 'DMMono_400Regular',
    fontSize: 9,
    letterSpacing: 2,
    color: DUSTY,
    marginBottom: 8,
  },
  deeperText: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 17,
    lineHeight: 24,
    color: '#5A2E1E',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GRAY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDeep: {
    borderColor: DUSTY,
  },
  btnDeepOn: {
    backgroundColor: PEACH,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  btnLabel: {
    fontFamily: 'DMMono_400Regular',
    fontSize: 11,
    letterSpacing: 1,
    color: WARM_GRAY,
  },
  btnDeepLabel: {
    color: DUSTY,
  },
});
