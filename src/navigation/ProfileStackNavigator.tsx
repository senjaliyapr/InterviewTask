import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types/navigation';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AudioRecordingScreen from '../screens/profile/AudioRecordingScreen';
import ManageNotificationsScreen from '../screens/profile/ManageNotificationsScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const NAVY = '#1E4E79';

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: NAVY,
        headerTitleStyle: { fontWeight: '700' },
      }}>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AudioRecording"
        component={AudioRecordingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageNotifications"
        component={ManageNotificationsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
