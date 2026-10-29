import { Tabs } from 'expo-router';
import React from 'react';
import CustomTabBar from '@/components/CustomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="bookings" options={{ title: 'Bookings' }} />
      <Tabs.Screen name="catalog" options={{ title: 'Catalog' }} />
      <Tabs.Screen name="more" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
