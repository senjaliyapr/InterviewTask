import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch } from '../../store/hooks';
import { persistToken } from '../../store/slices/authSlice';
import { loginApi } from '../../api/authApi';
import { COLORS } from '../../theme/colors';
import { styles } from './LoginScreen.styles';

const MAIL_ICON = require('../../../assets/icons/mail.png');
const LOCK_ICON = require('../../../assets/icons/lock.png');
const EYE_OFF_ICON = require('../../../assets/icons/eye-off.png');

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('user1');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await loginApi(username, password);

      if (!res || !res.token) {
        throw new Error('Invalid response');
      }

      await dispatch(persistToken(res.token)).unwrap();
    } catch (error: any) {
      console.log('ERROR:', error?.response?.data || error.message);
      Alert.alert('Login Failed', 'Check credentials or API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Image
              source={require('../../../assets/login.png')}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.form}>
            <View style={styles.fieldShell}>
              <View style={styles.iconLeading}>
                <Image source={MAIL_ICON} style={styles.iconImage} />
              </View>
              <TextInput
                placeholder="Email or Mobile number"
                placeholderTextColor={COLORS.placeholder}
                style={styles.fieldInput}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View style={styles.fieldShell}>
              <View style={styles.iconLeading}>
                <Image source={LOCK_ICON} style={styles.iconImage} />
              </View>
              <TextInput
                placeholder="Password"
                placeholderTextColor={COLORS.placeholder}
                style={styles.fieldInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                disabled={loading}>
                <Image source={showPassword ? EYE_OFF_ICON : EYE_OFF_ICON} style={styles.eyeIcon} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

