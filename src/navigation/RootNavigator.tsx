import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { hydrateAuth } from '../store/slices/authSlice';
import { AuthStackParamList } from '../types';
import LoginScreen from '../screens/auth/LoginScreen';
import MainTabNavigator from './MainTabNavigator';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export default function RootNavigator() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const isHydrated = useAppSelector((s) => s.auth.isHydrated);

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  if (!isHydrated) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color="#1E4E79" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? (
        <MainTabNavigator />
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  boot: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});
