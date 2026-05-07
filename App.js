import { DMMono_400Regular } from '@expo-google-fonts/dm-mono';
import {
  DMSerifDisplay_400Regular,
  DMSerifDisplay_400Regular_Italic,
} from '@expo-google-fonts/dm-serif-display';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import PitRingFrame, { RING_BY_VIBE } from './components/PitRingFrame';

/** Locked palette — Pit design system */
const COLORS = {
  cream: '#EBE4CD',
  sand: '#F2EED5',
  ink: '#1C1A14',
  gray: '#8A7D6A',
  grayLight: '#D5CEC4',
  green: '#3D5B4F',
  yellow: '#EFE750',
  blue: '#BDCDE0',
  cranberry: '#8E555D',
  dusty: '#C9837A',
  peach: '#F0DBC8',
};

const CARD_THEME = {
  light: {
    bg: COLORS.cream,
    meta: '#6A6430',
    question: COLORS.ink,
    dotFilled: '#6A6430',
    dotEmpty: 'rgba(106,100,48,0.25)',
  },
  deep: {
    bg: COLORS.green,
    meta: '#9BC4AA',
    question: '#F2FAF4',
    dotFilled: '#9BC4AA',
    dotEmpty: 'rgba(155,196,170,0.25)',
  },
  chaotic: {
    bg: COLORS.yellow,
    meta: '#6B6500',
    question: COLORS.ink,
    dotFilled: '#6B6500',
    dotEmpty: 'rgba(107,101,0,0.25)',
  },
  nostalgic: {
    bg: COLORS.blue,
    meta: '#3A5A7A',
    question: '#1A2A3A',
    dotFilled: '#3A5A7A',
    dotEmpty: 'rgba(58,90,122,0.25)',
  },
  spicy: {
    bg: COLORS.cranberry,
    meta: '#F0D6DA',
    question: '#FAF4F5',
    dotFilled: '#F0D6DA',
    dotEmpty: 'rgba(240,214,218,0.25)',
  },
};

const PILL_ACTIVE = {
  light: {
    backgroundColor: COLORS.cream,
    borderColor: '#BFBB8A',
    color: '#3A3620',
  },
  deep: {
    backgroundColor: COLORS.green,
    borderColor: 'transparent',
    color: '#C8E0D2',
  },
  chaotic: {
    backgroundColor: COLORS.yellow,
    borderColor: 'transparent',
    color: '#3A3A00',
  },
  nostalgic: {
    backgroundColor: COLORS.blue,
    borderColor: 'transparent',
    color: '#1A2A3A',
  },
  spicy: {
    backgroundColor: COLORS.cranberry,
    borderColor: 'transparent',
    color: '#F8E4E8',
  },
};

const QUESTIONS = {
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
      q: 'What compliment have you never forgotten?',
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
      follow: "Are you sure you're not still in that arc?",
    },
    {
      q: 'If you had to describe your personality as a piece of furniture, what is it?',
      depth: 1,
      follow:
        "Is that the furniture you'd want to be, or just the most accurate?",
    },
    {
      q: 'What hill will you die on that genuinely does not matter at all?',
      depth: 2,
      follow:
        'Has anyone ever changed your mind on this? Even slightly?',
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
      follow: "Is there someone in this room you'd say it to right now?",
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

/** Vibe list + pill rows — derived from QUESTIONS so keys never drift. */
const VIBES = Object.keys(QUESTIONS);
const VIBE_ROWS = [VIBES.slice(0, 3), VIBES.slice(3)];

export default function App() {
  const { width: windowWidth } = useWindowDimensions();
  /** SVG pit ring size — balanced for phone width. */
  const ringSize = Math.min(Math.max(windowWidth - 40, 272), 336);

  /** Demo headcount — replace with virtual room presence later */
  const [playersInPit] = useState(4);

  const [fontsLoaded] = useFonts({
    'DMSerif-Regular': DMSerifDisplay_400Regular,
    'DMSerif-Italic': DMSerifDisplay_400Regular_Italic,
    'DMMono-Regular': DMMono_400Regular,
  });

  const [currentVibe, setCurrentVibe] = useState('light');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [deeperVisible, setDeeperVisible] = useState(false);
  const [saved, setSaved] = useState(false);

  const cardOpacity = useRef(new Animated.Value(1)).current;

  const list = QUESTIONS[currentVibe];
  const current = list[currentIdx];
  const theme = CARD_THEME[currentVibe];

  const runCardFlip = useCallback(
    (applyChange) => {
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        applyChange();
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }).start();
      });
    },
    [cardOpacity]
  );

  const setVibe = useCallback(
    (vibe) => {
      if (vibe === currentVibe) return;
      runCardFlip(() => {
        setCurrentVibe(vibe);
        setCurrentIdx(0);
        setDeeperVisible(false);
        setSaved(false);
      });
    },
    [currentVibe, runCardFlip]
  );

  const shuffle = useCallback(() => {
    runCardFlip(() => {
      const pool = QUESTIONS[currentVibe];
      let next = currentIdx;
      while (next === currentIdx && pool.length > 1) {
        next = Math.floor(Math.random() * pool.length);
      }
      setCurrentIdx(next);
      setDeeperVisible(false);
      setSaved(false);
    });
  }, [currentIdx, currentVibe, runCardFlip]);

  const toggleDeeper = useCallback(() => {
    setDeeperVisible((v) => !v);
  }, []);

  const toggleSave = useCallback(() => {
    setSaved((s) => !s);
  }, []);

  const grainStyle = useMemo(
    () => ({
      ...StyleSheet.absoluteFillObject,
      backgroundColor: COLORS.sand,
      opacity: 0.06,
    }),
    []
  );

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.sand }}>
        <StatusBar style="dark" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={grainStyle} />
      <ScrollView
        style={styles.scrollFlex}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
          <View style={styles.app}>
            <View style={styles.header}>
              <Text style={styles.wordmark}>drop a topic</Text>
              <Text style={styles.sessionInfo}>in the pit</Text>
            </View>

            <Text style={styles.vibeLabel}>pick a vibe</Text>
            <View style={styles.vibeRowsOuter}>
              {VIBE_ROWS.map((row, ri) => (
                <View key={ri} style={styles.vibeRow}>
                  {row.map((v) => {
                    const active = v === currentVibe;
                    const activeStyle = active ? PILL_ACTIVE[v] : {};
                    return (
                      <Pressable
                        key={v}
                        onPress={() => setVibe(v)}
                        style={({ pressed }) => [
                          styles.vibePill,
                          !active && styles.vibePillIdle,
                          activeStyle,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.vibePillText,
                            !active && { color: COLORS.gray },
                            active && { color: activeStyle.color },
                          ]}
                        >
                          {v}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>

            <Text style={styles.depthRibbon}>
              depth {current.depth} of 3 · {currentVibe}
            </Text>

            <View style={styles.cardWrap}>
              <Animated.View style={{ opacity: cardOpacity }}>
                <PitRingFrame
                  ring={RING_BY_VIBE[currentVibe]}
                  metaUpper={`${currentVibe} · ${current.depth}/3`}
                  question={current.q}
                  questionColor={theme.question}
                  metaColor={theme.meta}
                  cardBg={theme.bg}
                  size={ringSize}
                  playerCount={playersInPit}
                  dashColor={COLORS.gray}
                />
              </Animated.View>
            </View>

            {deeperVisible ? (
              <View style={styles.deeperWrap}>
                <View style={styles.deeperCard}>
                  <Text style={styles.deeperEyebrow}>go deeper ↓</Text>
                  <Text style={styles.deeperText}>{current.follow}</Text>
                </View>
              </View>
            ) : null}

            <View style={styles.actions}>
              <Pressable
                onPress={shuffle}
                style={({ pressed }) => [
                  styles.btn,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.btnText}>shuffle ↻</Text>
              </Pressable>
              <Pressable
                onPress={toggleDeeper}
                style={({ pressed }) => [
                  styles.btn,
                  styles.btnDeeper,
                  deeperVisible && styles.btnDeeperActive,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.btnText,
                    styles.btnDeeperText,
                    deeperVisible && styles.btnDeeperTextActive,
                  ]}
                >
                  go deeper
                </Text>
              </Pressable>
            </View>

            <View style={styles.bottomRow}>
              <Text style={styles.counter}>
                {currentIdx + 1} of {list.length}
              </Text>
              <Pressable onPress={toggleSave} hitSlop={12}>
                <Text
                  style={[styles.saveBtn, saved && styles.saveBtnSaved]}
                >
                  {saved ? 'saved ✦' : 'save card'}
                </Text>
              </Pressable>
            </View>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.sand,
  },
  scrollFlex: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 48,
  },
  app: {
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  depthRibbon: {
    fontFamily: 'DMMono-Regular',
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 14,
  },
  wordmark: {
    fontFamily: 'DMSerif-Italic',
    fontSize: 28,
    color: COLORS.ink,
    letterSpacing: -0.35,
  },
  sessionInfo: {
    fontFamily: 'DMMono-Regular',
    fontSize: 12,
    letterSpacing: 1.35,
    textTransform: 'uppercase',
    color: COLORS.gray,
  },
  vibeLabel: {
    fontFamily: 'DMMono-Regular',
    fontSize: 11,
    letterSpacing: 1.75,
    textTransform: 'uppercase',
    color: COLORS.gray,
    marginBottom: 12,
  },
  vibeRowsOuter: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 22,
  },
  vibeRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 7,
    justifyContent: 'center',
    width: '100%',
  },
  vibePill: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
  },
  vibePillIdle: {
    borderColor: COLORS.grayLight,
    backgroundColor: 'transparent',
  },
  vibePillText: {
    fontFamily: 'DMMono-Regular',
    fontSize: 12,
    letterSpacing: 0.65,
    textTransform: 'lowercase',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  cardWrap: {
    marginBottom: 28,
    alignItems: 'center',
  },
  deeperWrap: {
    marginBottom: 28,
    width: '100%',
  },
  deeperCard: {
    backgroundColor: COLORS.peach,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.dusty,
  },
  deeperEyebrow: {
    fontFamily: 'DMMono-Regular',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: COLORS.dusty,
    marginBottom: 10,
  },
  deeperText: {
    fontFamily: 'DMSerif-Regular',
    fontSize: 19,
    lineHeight: 26,
    color: '#5A2E1E',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    marginBottom: 22,
  },
  btn: {
    flex: 1,
    paddingVertical: 17,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: 'DMMono-Regular',
    fontSize: 13,
    letterSpacing: 0.95,
    textTransform: 'uppercase',
    color: COLORS.gray,
  },
  btnDeeper: {
    borderColor: COLORS.dusty,
  },
  btnDeeperText: {
    color: COLORS.dusty,
  },
  btnDeeperActive: {
    backgroundColor: COLORS.peach,
    borderColor: COLORS.dusty,
  },
  btnDeeperTextActive: {
    color: '#5A2E1E',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 22,
  },
  counter: {
    fontFamily: 'DMMono-Regular',
    fontSize: 12,
    letterSpacing: 1.05,
    color: COLORS.gray,
  },
  saveBtn: {
    fontFamily: 'DMMono-Regular',
    fontSize: 12,
    letterSpacing: 1.05,
    textTransform: 'uppercase',
    color: COLORS.gray,
    paddingVertical: 6,
  },
  saveBtnSaved: {
    color: COLORS.dusty,
  },
});
