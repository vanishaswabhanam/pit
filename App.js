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
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

const COLORS = {
  cream: '#E8E4C0',
  sand: '#F2E8D5',
  ink: '#1C1A14',
  gray: '#8A7B6A',
  grayLight: '#C4B9AC',
  green: '#3D6B4F',
  yellow: '#EFEF50',
  blue: '#B8C8D8',
  cranberry: '#8C5560',
  dusty: '#C9837A',
  peach: '#F0DBC8',
};

const CARD_THEME = {
  light: {
    bg: COLORS.cream,
    meta: '#6A6430',
    question: '#1C1A14',
    dotFilled: '#6A6430',
    dotEmpty: 'rgba(106,100,48,0.25)',
  },
  deep: {
    bg: COLORS.green,
    meta: '#8AB89A',
    question: '#E8F4EC',
    dotFilled: '#8AB89A',
    dotEmpty: 'rgba(138,184,154,0.25)',
  },
  chaotic: {
    bg: COLORS.yellow,
    meta: '#7A7A00',
    question: '#1C1A14',
    dotFilled: '#7A7A00',
    dotEmpty: 'rgba(122,122,0,0.25)',
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
    meta: '#E0BCC2',
    question: '#FAF0F2',
    dotFilled: '#E0BCC2',
    dotEmpty: 'rgba(224,188,194,0.25)',
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
    color: '#F0D0D4',
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

const VIBES = ['light', 'deep', 'chaotic', 'nostalgic', 'spicy'];

export default function App() {
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
        duration: 175,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        applyChange();
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 175,
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
      <View style={{ flex: 1, backgroundColor: COLORS.sand }}>
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={grainStyle} />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ScrollView
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
            <View style={styles.vibeRow}>
              {VIBES.map((v) => {
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

            <View style={styles.cardWrap}>
              <Animated.View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.bg,
                    opacity: cardOpacity,
                  },
                ]}
              >
                <View>
                  <View style={styles.depthLabelRow}>
                    <View style={styles.depthDots}>
                      {[0, 1, 2].map((i) => (
                        <View
                          key={i}
                          style={[
                            styles.depthDot,
                            {
                              backgroundColor:
                                i < current.depth
                                  ? theme.dotFilled
                                  : theme.dotEmpty,
                            },
                          ]}
                        />
                      ))}
                    </View>
                    <Text style={[styles.depthTxt, { color: theme.meta }]}>
                      depth {current.depth} of 3
                    </Text>
                  </View>
                  <Text style={[styles.questionText, { color: theme.question }]}>
                    {current.q}
                  </Text>
                </View>
                <View style={styles.cardBottom}>
                  <Text style={[styles.vibeTag, { color: theme.meta }]}>
                    {currentVibe}
                  </Text>
                </View>
              </Animated.View>
            </View>

            <View
              style={[
                styles.deeperWrap,
                !deeperVisible && styles.deeperHidden,
              ]}
              pointerEvents={deeperVisible ? 'auto' : 'none'}
            >
              <View style={styles.deeperCard}>
                <Text style={styles.deeperEyebrow}>go deeper ↓</Text>
                <Text style={styles.deeperText}>{current.follow}</Text>
              </View>
            </View>

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
    </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.sand,
  },
  safe: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 48,
  },
  app: {
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 36,
    paddingBottom: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  wordmark: {
    fontFamily: 'DMSerif-Italic',
    fontSize: 22,
    color: COLORS.ink,
    letterSpacing: -0.2,
  },
  sessionInfo: {
    fontFamily: 'DMMono-Regular',
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: COLORS.gray,
  },
  vibeLabel: {
    fontFamily: 'DMMono-Regular',
    fontSize: 9,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: COLORS.gray,
    marginBottom: 10,
  },
  vibeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 32,
  },
  vibePill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  vibePillIdle: {
    borderColor: COLORS.grayLight,
    backgroundColor: 'transparent',
  },
  vibePillText: {
    fontFamily: 'DMMono-Regular',
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'lowercase',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  cardWrap: {
    marginBottom: 24,
  },
  card: {
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 28,
    minHeight: 280,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  depthLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  depthDots: {
    flexDirection: 'row',
    gap: 4,
  },
  depthDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  depthTxt: {
    fontFamily: 'DMMono-Regular',
    fontSize: 9,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  questionText: {
    fontFamily: 'DMSerif-Regular',
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 28,
  },
  vibeTag: {
    fontFamily: 'DMMono-Regular',
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  deeperWrap: {
    marginBottom: 28,
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
  deeperHidden: {
    opacity: 0,
    transform: [{ translateY: 8 }],
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
    fontSize: 9,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: COLORS.dusty,
    marginBottom: 8,
  },
  deeperText: {
    fontFamily: 'DMSerif-Regular',
    fontSize: 17,
    lineHeight: 23,
    color: '#5A2E1E',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: 'DMMono-Regular',
    fontSize: 11,
    letterSpacing: 0.8,
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
    paddingBottom: 16,
  },
  counter: {
    fontFamily: 'DMMono-Regular',
    fontSize: 10,
    letterSpacing: 1,
    color: COLORS.gray,
  },
  saveBtn: {
    fontFamily: 'DMMono-Regular',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: COLORS.gray,
    paddingVertical: 4,
  },
  saveBtnSaved: {
    color: COLORS.dusty,
  },
});
