import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { HomeStackParamList } from '../../types/navigation';
import {
  fetchOffers,
  fetchStores,
  fetchStatistics,
  type Offer,
  type Store,
  type StatPeriod,
} from '../../api/homeApi';
import DonutChart from '../../components/DonutChart';
import StarRating from '../../components/StarRating';
import { COLORS } from '../../theme/colors';
import { styles } from './HomeScreen.styles';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_GAP = 16;
const HOT_CARD_W = SCREEN_W - CARD_GAP * 2;

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;
};

const PERIODS: { key: StatPeriod; label: string }[] = [
  { key: 'daily', label: 'Day' },
  { key: 'weekly', label: 'Week' },
  { key: 'monthly', label: 'Month' },
];

export default function HomeScreen({ navigation }: Props) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [period, setPeriod] = useState<StatPeriod>('monthly');
  const [statsSegments, setStatsSegments] = useState<{ value: number }[]>([]);
  const [centerRupee, setCenterRupee] = useState('0.00');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dealIndex, setDealIndex] = useState(0);
  const [periodOpen, setPeriodOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        try {
          const [o, s] = await Promise.all([fetchOffers(), fetchStores()]);
          if (!active) return;
          setOffers(o);
          setStores(s);
        } catch (e: any) {
          const st = e?.response?.status;
          const msg =
            st === 401
              ? 'Session expired. Please log in again.'
              : st === 500
                ? 'Server error — try again.'
                : 'Failed to load home.';
          if (active) Alert.alert('Error', msg);
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const st = await fetchStatistics(period);
        if (!active) return;
        const rows = st.data ?? [];
        setStatsSegments(rows.map((r) => ({ value: r.percentage })));
        const sumPct = rows.reduce((a, r) => a + r.percentage, 0);
        setCenterRupee(`₹ ${(sumPct * 5.18).toFixed(2)}`);
      } catch {
        /* */
      }
    })();
    return () => {
      active = false;
    };
  }, [period]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const [o, s] = await Promise.all([fetchOffers(), fetchStores()]);
      setOffers(o);
      setStores(s);
      const st = await fetchStatistics(period);
      const rows = st.data ?? [];
      setStatsSegments(rows.map((r) => ({ value: r.percentage })));
      const sumPct = rows.reduce((a, r) => a + r.percentage, 0);
      setCenterRupee(`₹ ${(sumPct * 5.18).toFixed(2)}`);
    } catch {
      Alert.alert('Error', 'Refresh failed.');
    } finally {
      setRefreshing(false);
    }
  };

  const onDealScroll = (ev: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = ev.nativeEvent.contentOffset.x;
    const i = Math.round(x / (HOT_CARD_W + 12));
    if (i !== dealIndex) setDealIndex(i);
  };

  const periodLabel = PERIODS.find((p) => p.key === period)?.label ?? 'Month';

  const stripStores = stores.slice(0, 8);

  if (loading && !refreshing && offers.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Text style={styles.title}>SoftwareCo</Text>
        <View style={styles.rowBetween}>

        <Text style={styles.sectionTitle}>Hot deals</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={HOT_CARD_W + 12}
          decelerationRate="fast"
          contentContainerStyle={styles.hotScroll}
          onScroll={onDealScroll}
          scrollEventThrottle={16}>
          {offers.map((item) => (
            <View key={item._id} style={[styles.dealCard, { width: HOT_CARD_W }]}>
              <Image source={{ uri: item.image }} style={styles.dealImage} />
            </View>
          ))}
        </ScrollView>
        <View style={styles.dots}>
          {offers.slice(0, 6).map((_, i) => (
            <View key={i} style={[styles.dot, i === dealIndex && styles.dotActive]} />
          ))}
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Stores</Text>
          <TouchableOpacity onPress={() => navigation.navigate('StoresList')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storeStrip}>
          {stripStores.map((store) => (
            <TouchableOpacity
              key={store._id}
              activeOpacity={0.9}
              style={styles.storeCard}
              onPress={() => navigation.navigate('StoreDetail', { storeId: store._id })}>
              <View style={styles.storeImageWrap}>
                <Image source={{ uri: store.image }} style={styles.storeImage} />
                <TouchableOpacity
                  style={styles.viewStoreBtn}
                  onPress={() => navigation.navigate('StoreDetail', { storeId: store._id })}>
                  <Text style={styles.viewStoreText}>View Store</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.storeMetaRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.storeName}>{store.name}</Text>
                  <Text style={styles.storeCat}>{store.category}</Text>
                </View>
                <StarRating rating={4} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={{ zIndex: 20 }}>
            <TouchableOpacity
              style={styles.periodBtn}
              onPress={() => setPeriodOpen((v) => !v)}
              activeOpacity={0.85}>
              <Text style={styles.periodBtnText}>{periodLabel}</Text>
              <View style={styles.periodChevronBox}>
                <Ionicons
                  name={periodOpen ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#FFFFFF"
                />
              </View>
            </TouchableOpacity>
            {periodOpen && (
              <View style={styles.periodMenu}>
                {PERIODS.map((p) => (
                  <TouchableOpacity
                    key={p.key}
                    style={[
                      styles.periodItem,
                      p.key === period && styles.periodItemActive,
                    ]}
                    onPress={() => {
                      setPeriod(p.key);
                      setPeriodOpen(false);
                    }}>
                    <Text
                      style={[
                        styles.periodItemText,
                        p.key === period && styles.periodItemTextActive,
                      ]}>
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
        <View style={styles.chartBox}>
          {statsSegments.length > 0 ? (
            <DonutChart segments={statsSegments} centerLabel={centerRupee} />
          ) : (
            <Text style={{ color: '#6B7280' }}>No statistics</Text>
          )}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

