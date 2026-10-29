import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts, Palette } from '@/constants/typography';
import { usePortal } from '@/store/portalStore';

export default function CustomTabBar(props: any) {
  const { state, descriptors, navigation } = props;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { bookings, notifications } = usePortal();

  const pendingBookings = bookings.filter(b => b.status === 'Pending Confirmation').length;
  const unreadNotifs = notifications.filter(n => n.unread).length;

  const bottomOffset = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 12);

  const getTabIcon = (name: string, isFocused: boolean) => {
    switch (name) {
      case 'index':
        return isFocused ? 'grid' : 'grid-outline';
      case 'bookings':
        return isFocused ? 'calendar' : 'calendar-outline';
      case 'catalog':
        return isFocused ? 'bed' : 'bed-outline';
      case 'more':
        return isFocused ? 'settings' : 'settings-outline';
      default:
        return 'ellipse-outline';
    }
  };

  const getTabLabel = (name: string) => {
    switch (name) {
      case 'index': return 'Home';
      case 'bookings': return 'Bookings';
      case 'catalog': return 'Catalog';
      case 'more': return 'Settings';
      default: return name;
    }
  };

  const getRoutePath = (name: string) => {
    switch (name) {
      case 'index': return '/(tabs)';
      case 'bookings': return '/(tabs)/bookings';
      case 'catalog': return '/(tabs)/catalog';
      case 'more': return '/(tabs)/more';
      default: return `/(tabs)/${name}`;
    }
  };

  return (
    <View
      style={[styles.barWrapper, { bottom: bottomOffset }]}
      pointerEvents="box-none"
    >
      <View style={styles.barContainer} pointerEvents="auto">
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const iconName = getTabIcon(route.name, isFocused);
          const label = getTabLabel(route.name);

          const onPress = () => {
            const event = navigation?.emit ? navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            }) : { defaultPrevented: false };

            if (!event?.defaultPrevented) {
              const targetPath = getRoutePath(route.name);
              // In Expo Router, navigate using both router and navigation for bulletproof compatibility
              try {
                router.replace(targetPath as any);
              } catch {
                router.push(targetPath as any);
              }

              if (navigation?.navigate) {
                try {
                  navigation.navigate(route.name);
                } catch {
                  // ignore
                }
              }
            }
          };

          if (isFocused) {
            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={{ selected: true }}
                accessibilityLabel={options.tabBarAccessibilityLabel || label}
                testID={options.tabBarButtonTestID || `tab-${route.name}`}
                onPress={onPress}
                style={[styles.activePill, Platform.OS === 'web' && (styles.pointerCursor as any)]}
                activeOpacity={0.85}
                hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
              >
                <Ionicons name={iconName as any} size={18} color="#ffffff" />
                <Text style={styles.activePillText}>{label}</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{ selected: false }}
              accessibilityLabel={options.tabBarAccessibilityLabel || label}
              testID={options.tabBarButtonTestID || `tab-${route.name}`}
              onPress={onPress}
              style={[styles.inactiveIconBtn, Platform.OS === 'web' && (styles.pointerCursor as any)]}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
            >
              <Ionicons name={iconName as any} size={21} color="#64748b" />
              {route.name === 'bookings' && pendingBookings > 0 && (
                <View style={styles.miniBadge} />
              )}
              {route.name === 'more' && unreadNotifs > 0 && (
                <View style={[styles.miniBadge, { backgroundColor: Palette.bluePill }]} />
              )}
            </TouchableOpacity>
          );
        })}

        {/* Right Floating + Button */}
        <TouchableOpacity
          style={[styles.plusBtn, Platform.OS === 'web' && (styles.pointerCursor as any)]}
          onPress={() => router.push('/create-booking')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Create Booking"
          testID="tab-create-booking"
          hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 20,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 36,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#edf0f5',
    width: '100%',
    maxWidth: 520,
    // Flat: no drop shadows
    shadowOpacity: 0,
    elevation: 0,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: Palette.darkPill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
  activePillText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontFamily: Fonts.semiBold,
  },
  inactiveIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  miniBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f59e0b',
  },
  plusBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.bluePill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointerCursor: {
    cursor: 'pointer',
  },
});
