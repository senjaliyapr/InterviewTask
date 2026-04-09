import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HomeStackParamList } from '../../types/navigation';
import { fetchStores, type Store } from '../../api/homeApi';
import StarRating from '../../components/StarRating';
import { COLORS } from '../../theme/colors';
import { styles } from './StoresListScreen.styles';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'StoresList'>;
};

export default function StoresListScreen({ navigation }: Props) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const s = await fetchStores();
    setStores(s);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let a = true;
      (async () => {
        setLoading(true);
        try {
          await load();
        } catch {
          if (a) Alert.alert('Error', 'Could not load stores.');
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

  const renderItem = ({ item }: { item: Store }) => (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <TouchableOpacity
          style={styles.viewStoreBtn}
          onPress={() => navigation.navigate('StoreDetail', { storeId: item._id })}>
          <Text style={styles.viewStoreText}>View Store</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.metaRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.cat}>{item.category}</Text>
        </View>
        <StarRating rating={4} />
      </View>
    </View>
  );

  if (loading && stores.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
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
        <Text style={styles.headerTitle}>Stores</Text>
      </View>

      <FlatList
        data={stores}
        keyExtractor={(it) => it._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
