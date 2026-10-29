import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import CustomTabBar from '@/components/CustomTabBar';
import { usePortal } from '@/store/portalStore';

export default function TabLayout() {
  const { isAuthenticated } = usePortal();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

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
