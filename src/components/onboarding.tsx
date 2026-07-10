import { Platform, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRef, useState } from 'react';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

const { width: SCREEN_W } = Dimensions.get('window');

const C = {
  navy: '#0B1426',
  navyCard: '#1A2B4A',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  whiteMid: 'rgba(255,255,255,0.70)',
  border: 'rgba(255,255,255,0.10)',
  green: '#30D158',
  gold: '#C9A84C',
};

function MemberCardGraphic() {
  return (
    <View style={styles.memberCard}>
      <View style={styles.cardTopRow}>
        <Text style={styles.cardBrand}>Tab</Text>
        <View style={styles.cardAccentDots}>
          <View style={styles.accDot} />
          <View style={styles.accDot} />
          <View style={styles.accDot} />
        </View>
      </View>
      <Text style={styles.cardId}>1 2 3  4 5 6</Text>
      <View style={styles.cardBottom}>
        <Text style={styles.cardMemberLabel}>MEMBER</Text>
        <View style={styles.cardChip} />
      </View>
    </View>
  );
}

function DiningGraphic() {
  if (Platform.OS === 'ios') {
    return (
      <View style={styles.iconCircle}>
        <SymbolView name="fork.knife" tintColor={C.white} style={{ width: 60, height: 60 }} />
      </View>
    );
  }
  return (
    <View style={styles.iconCircle}>
      <Text style={styles.iconEmoji}>🍽</Text>
    </View>
  );
}

function PhoneGraphic() {
  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.iconCircle, styles.iconCircleGreen]}>
        <SymbolView name="checkmark.circle.fill" tintColor={C.green} style={{ width: 70, height: 70 }} />
      </View>
    );
  }
  return (
    <View style={[styles.iconCircle, styles.iconCircleGreen]}>
      <Text style={[styles.iconEmoji, { color: C.green }]}>✓</Text>
    </View>
  );
}

type SlideData = {
  id: string;
  graphic: React.ReactNode;
  title: string;
  subtitle: string;
};

const SLIDES: SlideData[] = [
  {
    id: '1',
    graphic: <MemberCardGraphic />,
    title: 'Get your Member ID',
    subtitle: "A unique 6-digit code that's yours forever — no sign-in needed at the table",
  },
  {
    id: '2',
    graphic: <DiningGraphic />,
    title: 'Give it to your server, then just enjoy your meal',
    subtitle: 'Share your ID once and your tab opens automatically',
  },
  {
    id: '3',
    graphic: <PhoneGraphic />,
    title: "Tip and leave whenever you're ready",
    subtitle: "The bill comes to your phone — tip and walk out the moment you're done",
  },
];

function Slide({ item, isActive }: { item: SlideData; isActive: boolean }) {
  return (
    <View style={[styles.slide, { width: SCREEN_W }]}>
      <View style={styles.graphicArea}>{item.graphic}</View>
      <View style={styles.textArea}>
        <Animated.Text
          key={isActive ? 'active' : 'inactive'}
          entering={isActive ? FadeInDown.delay(120).duration(500).springify() : undefined}
          style={styles.slideTitle}>
          {item.title}
        </Animated.Text>
        <Animated.Text
          key={isActive ? 'sub-active' : 'sub-inactive'}
          entering={isActive ? FadeInDown.delay(220).duration(500).springify() : undefined}
          style={styles.slideSubtitle}>
          {item.subtitle}
        </Animated.Text>
      </View>
    </View>
  );
}

export function OnboardingCarousel({ onDone }: { onDone: () => void }) {
  const [currentPage, setCurrentPage] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const goNext = () => {
    if (currentPage < SLIDES.length - 1) {
      const next = currentPage + 1;
      flatRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentPage(next);
    } else {
      onDone();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip */}
      <Animated.View entering={FadeIn.delay(300).duration(400)} style={styles.topBar}>
        {currentPage < SLIDES.length - 1 ? (
          <TouchableOpacity onPress={onDone} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </Animated.View>

      {/* Slides */}
      <FlatList
        ref={flatRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({ length: SCREEN_W, offset: SCREEN_W * index, index })}
        renderItem={({ item, index }) => (
          <Slide item={item} isActive={index === currentPage} />
        )}
        onMomentumScrollEnd={(e) => {
          setCurrentPage(Math.round(e.nativeEvent.contentOffset.x / SCREEN_W));
        }}
      />

      {/* Dots + CTA */}
      <Animated.View entering={FadeIn.delay(500).duration(400)} style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentPage && styles.dotActive]} />
          ))}
        </View>

        {currentPage === SLIDES.length - 1 ? (
          <TouchableOpacity style={styles.getStartedBtn} activeOpacity={0.85} onPress={onDone}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextBtn} activeOpacity={0.85} onPress={goNext}>
            <Text style={styles.nextText}>Next  →</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.navy,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 0,
  },
  skipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '500',
    color: C.whiteDim,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  graphicArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  textArea: {
    width: '100%',
    paddingBottom: 32,
    gap: 12,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  slideSubtitle: {
    fontSize: 16,
    color: C.whiteDim,
    lineHeight: 24,
    fontWeight: '400',
  },
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 20,
    gap: 20,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  dotActive: {
    width: 20,
    backgroundColor: C.white,
  },
  getStartedBtn: {
    width: '100%',
    backgroundColor: C.white,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '700',
    color: C.navy,
    letterSpacing: 0.1,
  },
  nextBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: C.border,
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
  },
  nextText: {
    fontSize: 16,
    fontWeight: '600',
    color: C.white,
    letterSpacing: 0.1,
  },
  // Member card graphic
  memberCard: {
    width: 280,
    height: 168,
    borderRadius: 20,
    backgroundColor: C.navyCard,
    borderWidth: 1,
    borderColor: C.border,
    padding: 22,
    justifyContent: 'space-between',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrand: {
    fontSize: 22,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.5,
  },
  cardAccentDots: {
    flexDirection: 'row',
    gap: 5,
  },
  accDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.gold,
    opacity: 0.7,
  },
  cardId: {
    fontSize: 28,
    fontWeight: '700',
    color: C.white,
    letterSpacing: 6,
    alignSelf: 'center',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardMemberLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.whiteDim,
    letterSpacing: 2,
  },
  cardChip: {
    width: 36,
    height: 26,
    borderRadius: 5,
    backgroundColor: C.gold,
    opacity: 0.55,
  },
  // Icon graphics
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleGreen: {
    backgroundColor: 'rgba(48,209,88,0.10)',
    borderColor: 'rgba(48,209,88,0.20)',
  },
  iconEmoji: {
    fontSize: 64,
    color: C.white,
  },
});
