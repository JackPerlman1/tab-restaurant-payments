import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { fmt, useTab } from '@/context/tab';

const C = {
  navy: '#0B1426',
  navyCard: '#1A2B4A',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  border: 'rgba(255,255,255,0.07)',
  green: '#30D158',
  amber: '#FF9F0A',
};

const MOCK_NAMES = ['Alex M.', 'Jordan L.', 'Casey R.', 'Taylor B.', 'Morgan K.', 'Quinn S.'];

type Participant = {
  name: string;
  paid: boolean;
};

function CheckIcon({ color }: { color: string }) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name="checkmark.circle.fill"
        tintColor={color}
        style={{ width: 20, height: 20 }}
      />
    );
  }
  return <Text style={{ color, fontSize: 16 }}>✓</Text>;
}

function ClockIcon({ color }: { color: string }) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name="clock.fill"
        tintColor={color}
        style={{ width: 20, height: 20 }}
      />
    );
  }
  return <Text style={{ color, fontSize: 14 }}>⏱</Text>;
}

export default function SplitWaitingScreen() {
  const { people, perPerson, tableCode } = useLocalSearchParams<{
    people: string;
    perPerson: string;
    tableCode: string;
  }>();
  const { closeTab, openTab } = useTab();
  const count = parseInt(people || '3', 10);

  const buildParticipants = (): Participant[] => {
    const list: Participant[] = [{ name: 'You', paid: true }];
    for (let i = 1; i < count; i++) {
      list.push({ name: MOCK_NAMES[i - 1] ?? `Guest ${i + 1}`, paid: false });
    }
    return list;
  };

  const [participants, setParticipants] = useState<Participant[]>(buildParticipants);
  const paidCount = participants.filter((p) => p.paid).length;
  const allPaid = paidCount === count;

  const handleSimulatePay = () => {
    setParticipants((prev) =>
      prev.map((p, i) => {
        if (!p.paid) {
          const nextUnpaid = prev.findIndex((x) => !x.paid);
          if (i === nextUnpaid) return { ...p, paid: true };
        }
        return p;
      })
    );
  };

  const handleConfirm = () => {
    if (!openTab) return;
    const tipAmount = openTab.subtotal * 0.20;
    const friendNames = participants.filter((p) => p.name !== 'You').map((p) => p.name);
    closeTab(tipAmount, 20, friendNames);
    router.replace({
      pathname: '/customer/payment-success',
      params: {
        total: fmt(openTab.total + tipAmount),
        tip: fmt(tipAmount),
        restaurant: openTab.restaurantName,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.delay(60).duration(600).springify()}>
          <Text style={styles.title}>Waiting Room</Text>
          <Text style={styles.subtitle}>
            {paidCount} of {count} paid
          </Text>
        </Animated.View>

        {/* Code reminder */}
        <Animated.View entering={FadeInDown.delay(150).duration(600).springify()} style={styles.codeBar}>
          <Text style={styles.codeBarLabel}>Table code</Text>
          <Text style={styles.codeBarValue}>{tableCode}</Text>
        </Animated.View>

        {/* Per-person amount */}
        <Animated.View entering={FadeInDown.delay(220).duration(600).springify()} style={styles.amountBanner}>
          <Text style={styles.amountLabel}>Each person</Text>
          <Text style={styles.amountValue}>${perPerson}</Text>
          <Text style={styles.amountNote}>incl. 20% tip</Text>
        </Animated.View>

        {/* Participants */}
        <Animated.View entering={FadeInDown.delay(290).duration(600).springify()} style={styles.card}>
          <Text style={styles.cardLabel}>PARTICIPANTS</Text>
          {participants.map((p, i) => (
            <Animated.View
              key={p.name}
              entering={FadeInRight.delay(300 + i * 60).duration(400)}
              style={[styles.participantRow, i < participants.length - 1 && styles.rowBorder]}>
              <View style={styles.participantLeft}>
                <View style={[styles.avatar, p.paid && styles.avatarPaid]}>
                  <Text style={styles.avatarText}>{p.name.charAt(0)}</Text>
                </View>
                <Text style={styles.participantName}>{p.name}</Text>
              </View>
              <View style={styles.participantRight}>
                <Text style={[styles.participantStatus, p.paid && styles.statusPaid]}>
                  {p.paid ? 'Paid' : 'Waiting'}
                </Text>
                {p.paid ? (
                  <CheckIcon color={C.green} />
                ) : (
                  <ClockIcon color={C.amber} />
                )}
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Simulate button (dev helper) */}
        {!allPaid && (
          <TouchableOpacity style={styles.simulateBtn} onPress={handleSimulatePay}>
            <Text style={styles.simulateBtnText}>Simulate someone paying →</Text>
          </TouchableOpacity>
        )}

        {allPaid && (
          <Animated.View entering={FadeInDown.duration(500).springify()}>
            <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.85} onPress={handleConfirm}>
              <Text style={styles.confirmBtnText}>Everyone paid — Close Tab</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.navy,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  back: {
    paddingTop: 8,
    paddingBottom: 20,
    alignSelf: 'flex-start',
  },
  backText: {
    color: C.whiteDim,
    fontSize: 15,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: C.whiteDim,
    marginBottom: 24,
  },
  codeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.navyCard,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  codeBarLabel: {
    fontSize: 13,
    color: C.whiteDim,
    fontWeight: '500',
  },
  codeBarValue: {
    fontSize: 22,
    fontWeight: '700',
    color: C.white,
    letterSpacing: 5,
  },
  amountBanner: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    gap: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.whiteDim,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  amountValue: {
    fontSize: 40,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -1,
  },
  amountNote: {
    fontSize: 12,
    color: C.whiteDim,
  },
  card: {
    backgroundColor: C.navyCard,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.whiteDim,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  participantLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPaid: {
    backgroundColor: 'rgba(48,209,88,0.15)',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '600',
    color: C.white,
  },
  participantName: {
    fontSize: 15,
    fontWeight: '500',
    color: C.white,
  },
  participantRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  participantStatus: {
    fontSize: 13,
    color: C.whiteDim,
    fontWeight: '500',
  },
  statusPaid: {
    color: C.green,
  },
  simulateBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 12,
  },
  simulateBtnText: {
    color: C.whiteDim,
    fontSize: 13,
    fontWeight: '500',
  },
  confirmBtn: {
    backgroundColor: C.white,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: C.navy,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
