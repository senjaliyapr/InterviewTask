import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileStackParamList } from '../../types/navigation';
import { useAppDispatch } from '../../store/hooks';
import { clearPersistedAuth } from '../../store/slices/authSlice';
import { COLORS } from '../../theme/colors';
import { styles } from './ProfileScreen.styles';

const AUDIO_ICON = require('../../../assets/icons/audio_profile.png');
const NOTIFICATION_ICON = require('../../../assets/icons/notification-bing.png');

type Props = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>;
};

export default function ProfileScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
          }}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          onPress={() => dispatch(clearPersistedAuth())}
          style={styles.logoutBtn}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Logout">
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate('AudioRecording')}
        activeOpacity={0.7}>
        <Image source={AUDIO_ICON} style={styles.rowIcon} />
        <Text style={styles.rowLabel}>Audio Recording</Text>
        <Ionicons name="chevron-forward" size={20} color={COLORS.placeholder} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate('ManageNotifications')}
        activeOpacity={0.7}>
        <Image source={NOTIFICATION_ICON} style={styles.rowIcon} />
        <Text style={styles.rowLabel}>Manage Notifications</Text>
        <Ionicons name="chevron-forward" size={20} color={COLORS.placeholder} />
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}
