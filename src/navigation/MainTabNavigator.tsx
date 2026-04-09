import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Image } from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from '../types/navigation';
import HomeStackNavigator from './HomeStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

const NAVY = '#1E4E79';
const HOME_ICON = require('../../assets/icons/home.png');
const HOME_ICON_SELECTED = require('../../assets/icons/home_selected.png');
const PERSON_ICON = require('../../assets/icons/person.png');
const PERSON_ICON_SELECTED = require('../../assets/icons/person_selected.png');

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const isHome = route.name === 'HomeTab';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.85}>
            {focused ? (
              <View style={styles.pill}>
                <Image
                  source={isHome ? HOME_ICON_SELECTED : PERSON_ICON_SELECTED}
                  style={[styles.tabIcon, styles.pillIcon]}
                />
                <Text style={styles.pillText}>{isHome ? 'Home' : 'Profile'}</Text>
              </View>
            ) : (
              <Image source={isHome ? HOME_ICON : PERSON_ICON} style={styles.tabIcon} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingHorizontal: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NAVY,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 28,
  },
  pillIcon: { marginRight: 8 },
  tabIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    opacity: 0.85,
  },
  pillText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
