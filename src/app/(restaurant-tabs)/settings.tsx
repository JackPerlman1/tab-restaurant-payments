import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { useAuth } from '@/context/auth';
import { useRestaurant } from '@/context/restaurant';
import { resetOnboarding } from '@/utils/demo';

const C = {
  navy: '#0B1426',
  navyCard: '#1A2B4A',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  whiteMid: 'rgba(255,255,255,0.70)',
  border: 'rgba(255,255,255,0.07)',
  borderFocus: 'rgba(255,255,255,0.28)',
  red: '#FF453A',
};

function ChevronIcon() {
  if (Platform.OS === 'ios') {
    return <SymbolView name="chevron.right" tintColor="rgba(255,255,255,0.25)" style={{ width: 14, height: 14 }} />;
  }
  return <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 16 }}>›</Text>;
}

type ProfileState = {
  restaurantName: string;
  address: string;
  cuisine: string;
  ownerName: string;
};

export default function RestaurantSettingsScreen() {
  const { user, logout } = useAuth();
  const { resetDemoData } = useRestaurant();

  const authName = user?.type === 'restaurant' ? user.restaurantName : 'Osteria Morini';
  const authAddress = user?.type === 'restaurant' && user.address ? user.address : '218 Lafayette St, New York, NY 10012';
  const authOwner = user?.type === 'restaurant' && user.ownerName ? user.ownerName : 'Marco Rossi';
  const authEmail = user?.type === 'restaurant' ? user.email : '';

  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileState>({
    restaurantName: authName,
    address: authAddress,
    cuisine: 'Italian',
    ownerName: authOwner,
  });
  const [draft, setDraft] = useState<ProfileState>(profile);

  const handleEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const handleSave = () => {
    setProfile(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleReset = () => {
    resetDemoData();
    resetOnboarding();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.delay(60).duration(600).springify()} style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </Animated.View>

        {/* Restaurant profile card */}
        <Animated.View entering={FadeInDown.delay(120).duration(600).springify()}>
          <Text style={styles.sectionLabel}>RESTAURANT</Text>
          <View style={styles.profileCard}>
            {editing ? (
              <View style={styles.editForm}>
                <View style={styles.editField}>
                  <Text style={styles.editFieldLabel}>Name</Text>
                  <TextInput
                    style={styles.editInput}
                    value={draft.restaurantName}
                    onChangeText={(t) => setDraft((d) => ({ ...d, restaurantName: t }))}
                    selectionColor={C.white}
                    placeholderTextColor="rgba(255,255,255,0.30)"
                  />
                </View>
                <View style={styles.fieldDivider} />
                <View style={styles.editField}>
                  <Text style={styles.editFieldLabel}>Address</Text>
                  <TextInput
                    style={styles.editInput}
                    value={draft.address}
                    onChangeText={(t) => setDraft((d) => ({ ...d, address: t }))}
                    selectionColor={C.white}
                    placeholderTextColor="rgba(255,255,255,0.30)"
                    multiline
                  />
                </View>
                <View style={styles.fieldDivider} />
                <View style={styles.editField}>
                  <Text style={styles.editFieldLabel}>Cuisine</Text>
                  <TextInput
                    style={styles.editInput}
                    value={draft.cuisine}
                    onChangeText={(t) => setDraft((d) => ({ ...d, cuisine: t }))}
                    selectionColor={C.white}
                    placeholderTextColor="rgba(255,255,255,0.30)"
                  />
                </View>
                <View style={styles.editActions}>
                  <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <ProfileRow label="Name" value={profile.restaurantName} />
                <View style={styles.fieldDivider} />
                <ProfileRow label="Address" value={profile.address} />
                <View style={styles.fieldDivider} />
                <ProfileRow label="Cuisine" value={profile.cuisine} />
              </>
            )}
          </View>
        </Animated.View>

        {/* Owner info */}
        <Animated.View entering={FadeInDown.delay(190).duration(600).springify()}>
          <Text style={styles.sectionLabel}>OWNER</Text>
          <View style={styles.profileCard}>
            <ProfileRow label="Name" value={profile.ownerName} />
            <View style={styles.fieldDivider} />
            <ProfileRow label="Email" value={authEmail || 'Not set'} />
          </View>
        </Animated.View>

        {/* Edit Profile button */}
        {!editing && (
          <Animated.View entering={FadeInDown.delay(250).duration(500)}>
            <TouchableOpacity style={styles.editBtn} activeOpacity={0.75} onPress={handleEdit}>
              <Text style={styles.editBtnText}>Edit Profile</Text>
              <ChevronIcon />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Log Out */}
        <Animated.View entering={FadeInDown.delay(310).duration(500)}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <TouchableOpacity style={styles.logoutRow} activeOpacity={0.75} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Reset demo data — hidden at bottom */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.resetSection}>
          <TouchableOpacity style={styles.resetBtn} activeOpacity={0.6} onPress={handleReset}>
            <Text style={styles.resetText}>Reset Demo Data</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.profileLabel}>{label}</Text>
      <Text style={styles.profileValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.navy,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 8,
    marginBottom: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.5,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.whiteDim,
    letterSpacing: 1.5,
    marginBottom: 8,
    marginTop: 4,
  },
  profileCard: {
    backgroundColor: C.navyCard,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 16,
  },
  profileLabel: {
    fontSize: 15,
    color: C.whiteDim,
    fontWeight: '400',
    flexShrink: 0,
    width: 70,
  },
  profileValue: {
    fontSize: 15,
    color: C.white,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  fieldDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: C.border,
    marginLeft: 16,
  },
  editForm: {
    padding: 16,
    gap: 0,
  },
  editField: {
    paddingVertical: 10,
    gap: 4,
  },
  editFieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.whiteDim,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  editInput: {
    fontSize: 15,
    color: C.white,
    fontWeight: '500',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: C.navy,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: C.whiteDim,
  },
  editBtn: {
    backgroundColor: C.navyCard,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 28,
  },
  editBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: C.white,
  },
  logoutRow: {
    backgroundColor: C.navyCard,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: C.red,
  },
  resetSection: {
    marginTop: 16,
    alignItems: 'center',
  },
  resetBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.22)',
    letterSpacing: 0.3,
  },
});
