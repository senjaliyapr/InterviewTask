import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setChannel, setMainEnabled, seedFromApi } from '../../store/slices/notificationsSlice';
import type { ChannelToggles } from '../../store/slices/notificationsSlice';
import { fetchNotifications } from '../../api/homeApi';
import { COLORS } from '../../theme/colors';
import { styles } from './ManageNotificationsScreen.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../types/navigation';

type Props = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'ManageNotifications'>;
};

export default function ManageNotificationsScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const orderedIds = useAppSelector((s) => s.notifications.orderedIds);
  const byId = useAppSelector((s) => s.notifications.byId);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await fetchNotifications();
    dispatch(
      seedFromApi(
        data.map((r) => ({
          id: r._id,
          enabled: r.enabled,
          pushEnabled: r.pushEnabled,
          emailEnabled: r.emailEnabled,
          smsEnabled: r.smsEnabled,
          displayText: r.displayText,
          description: r.description,
        })),
      ),
    );
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      let a = true;
      (async () => {
        setLoading(true);
        try {
          await load();
        } catch (e: any) {
          const st = e?.response?.status;
          const msg =
            st === 500 ? 'Server error loading notifications.' : 'Could not load notifications.';
          if (a) Alert.alert('Error', msg);
        } finally {
          if (a) setLoading(false);
        }
      })();
      return () => {
        a = false;
      };
    }, [load]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
    } catch {
      Alert.alert('Error', 'Refresh failed.');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading && orderedIds.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Notifications</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Notifications</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {orderedIds.map((id) => {
          const pref = byId[id];
          if (!pref) return null;
          const dimmed = !pref.mainEnabled;
          return (
            <View key={id} style={[styles.card, dimmed && styles.cardDimmed]}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardTitle}>{pref.displayText}</Text>
                  <Text style={styles.cardDesc}>{pref.description}</Text>
                </View>
                <Switch
                  value={pref.mainEnabled}
                  onValueChange={(v) => {
                    dispatch(setMainEnabled({ id, enabled: v }));
                  }}
                  trackColor={{ false: COLORS.dotInactive, true: '#93C5FD' }}
                  thumbColor={pref.mainEnabled ? COLORS.primary : '#f4f3f4'}
                />
              </View>
              <View style={styles.divider} />
              <Text style={styles.channelsHeading}>Notification channels</Text>
              <View style={styles.channelsRow}>
                {(
                  [
                    ['pushEnabled', 'Push'] as const,
                    ['emailEnabled', 'Email'] as const,
                    ['smsEnabled', 'Sms'] as const,
                  ] as const
                ).map(([key, label]) => (
                  <ChannelCheck
                    key={key}
                    label={label}
                    active={pref.channels[key]}
                    disabled={dimmed}
                    onToggle={() =>
                      dispatch(
                        setChannel({
                          id,
                          channel: key as keyof ChannelToggles,
                          value: !pref.channels[key],
                        }),
                      )
                    }
                  />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function ChannelCheck({
  label,
  active,
  disabled,
  onToggle,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.checkItem, disabled && styles.checkDisabled]}
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.7}>
      <View style={[styles.checkBox, active && styles.checkBoxOn]}>
        {active && <Ionicons name="checkmark" size={16} color="#fff" />}
      </View>
      <Text style={[styles.checkLabel, disabled && styles.checkLabelDim]}>{label}</Text>
    </TouchableOpacity>
  );
}
