import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeStackParamList } from '../../types/navigation';
import { fetchStoreById, type Store } from '../../api/homeApi';
import { COLORS } from '../../theme/colors';
import { styles } from './StoreDetailScreen.styles';

type Props = NativeStackScreenProps<HomeStackParamList, 'StoreDetail'>;

export default function StoreDetailScreen({ route, navigation }: Props) {
  const { storeId } = route.params;
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      let a = true;
      (async () => {
        setLoading(true);
        try {
          const s = await fetchStoreById(storeId);
          if (a) setStore(s);
        } finally {
          if (a) setLoading(false);
        }
      })();
      return () => {
        a = false;
      };
    }, [storeId]),
  );

  if (loading || !store) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const { lat, long, address } = store.location;
  const region = {
    latitude: lat,
    longitude: long,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Image source={{ uri: store.image }} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.heroTint} />
        <View style={[styles.heroTopBar, { paddingTop: Math.max(insets.top, 10) }]}>
          <View style={styles.heroTopBarRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.heroContent}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>
              {store.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 3)}
            </Text>
          </View>
          <Text style={styles.heroTitle}>{store.name}</Text>
          <View style={styles.catRow}>
            <View style={styles.dot} />
            <Text style={styles.cat}>{store.category}</Text>
          </View>
        </View>
      </View>

      <View style={styles.sheet}>
        <Text style={styles.sectionLabel}>Store</Text>
        <View style={styles.addrRow}>
          <Ionicons name="location-outline" size={18} color={COLORS.placeholder} style={styles.pinIcon} />
          <Text style={styles.addr}>{address}</Text>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Map</Text>
        <View style={styles.mapWrap}>
          <MapView style={styles.map} initialRegion={region} scrollEnabled={false}>
            <Marker coordinate={{ latitude: lat, longitude: long }} title={store.name} />
          </MapView>
        </View>
      </View>
    </ScrollView>
  );
}
