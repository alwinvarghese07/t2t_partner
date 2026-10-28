import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePortal } from '@/store/portalStore';
import { Fonts, Palette } from '@/constants/typography';
import { useBottomSheet } from '@/context/BottomSheetContext';

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { notifications, markAllNotificationsRead } = usePortal();
  const { showBottomSheet } = useBottomSheet();
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'booking'>('all');

  const unreadCount = notifications.filter(n => n.unread).length;
  const dynamicIslandTopPadding = Math.max(insets.top, Platform.OS === 'ios' ? 52 : 24) + 8;

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'unread') return n.unread;
    if (filterType === 'booking') return n.title.toLowerCase().includes('booking') || n.title.toLowerCase().includes('reservation');
    return true;
  });

  return (
    <View style={[styles.mainWrapper, { paddingTop: dynamicIslandTopPadding }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.circleActionBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color="#111318" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alerts & Activity</Text>
        <TouchableOpacity
          style={styles.markReadPill}
          onPress={markAllNotificationsRead}
          activeOpacity={0.7}
        >
          <Text style={styles.markReadText}>Mark read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero White Summary Card */}
        <View style={styles.heroSummaryCard}>
          <View style={styles.heroSummaryTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.balanceHeaderLabel}>SYSTEM ACTIVITY STREAM</Text>
              <Text style={styles.balanceValue}>
                {unreadCount > 0 ? `${unreadCount} Unread Alerts` : 'All Caught Up'}
              </Text>
            </View>
            <View style={styles.surgeBadgePill}>
              <View style={styles.pulseDot} />
              <Text style={styles.surgeBadgeText}>Live Feed</Text>
            </View>
          </View>

          <Text style={styles.heroSubtext}>
            Real-time updates on reservations, occupancy thresholds, and payment ledger receipts.
          </Text>

          {/* 3 Circular Action Buttons */}
          <View style={styles.heroActionsRow}>
            <View style={styles.actionCol}>
              <TouchableOpacity
                style={[styles.circleActionButton, filterType === 'all' && styles.circleActionActive]}
                onPress={() => setFilterType('all')}
                activeOpacity={0.85}
              >
                <Ionicons name="layers" size={20} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.actionColLabel}>All</Text>
            </View>

            <View style={styles.actionCol}>
              <TouchableOpacity
                style={[styles.circleActionButton, filterType === 'unread' && styles.circleActionActive]}
                onPress={() => setFilterType('unread')}
                activeOpacity={0.85}
              >
                <Ionicons name="mail-unread" size={20} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.actionColLabel}>Unread</Text>
            </View>

            <View style={styles.actionCol}>
              <TouchableOpacity
                style={[styles.circleActionButton, filterType === 'booking' && styles.circleActionActive]}
                onPress={() => setFilterType('booking')}
                activeOpacity={0.85}
              >
                <Ionicons name="calendar" size={20} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.actionColLabel}>Bookings</Text>
            </View>
          </View>
        </View>

        {/* Twin Highlight Cards */}
        <View style={styles.kpiTwinRow}>
          <View style={styles.twinCard}>
            <View style={styles.twinHeaderRow}>
              <View style={[styles.twinIconBox, { backgroundColor: '#eff6ff' }]}>
                <Ionicons name="shield-checkmark-outline" size={15} color="#2563eb" />
              </View>
              <View style={[styles.miniStatusPill, { backgroundColor: '#ecfdf5' }]}>
                <Text style={[styles.miniStatusText, { color: '#059669' }]}>Active</Text>
              </View>
            </View>
            <Text style={styles.twinCategory}>DISPATCH STATUS</Text>
            <Text style={styles.twinValue}>Gateway Synced</Text>
          </View>

          <View style={styles.twinCard}>
            <View style={styles.twinHeaderRow}>
              <View style={[styles.twinIconBox, { backgroundColor: '#f0fdf4' }]}>
                <Ionicons name="mail-outline" size={15} color="#16a34a" />
              </View>
              <View style={[styles.miniStatusPill, { backgroundColor: '#eff6ff' }]}>
                <Text style={[styles.miniStatusText, { color: '#2563eb' }]}>Audited</Text>
              </View>
            </View>
            <Text style={styles.twinCategory}>STREAM LOGS</Text>
            <Text style={styles.twinValue}>{notifications.length} Entries</Text>
          </View>
        </View>

        {/* Notification Stream Cards */}
        <Text style={styles.sectionHeading}>RECENT NOTIFICATIONS</Text>
        <View style={styles.groupedCard}>
          {filteredNotifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={32} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No notifications found</Text>
              <Text style={styles.emptySubtitle}>You have reviewed all alerts for this category.</Text>
            </View>
          ) : (
            filteredNotifications.map((n, idx) => (
              <View key={n.id}>
                <TouchableOpacity
                  style={[styles.notifRow, n.unread && styles.notifRowUnread]}
                  onPress={() =>
                    showBottomSheet({
                      title: n.title,
                      message: `${n.desc}\n\nDispatched: ${n.time}`,
                      icon: 'bell',
                      primaryButtonText: 'Dismiss'
                    })
                  }
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconBox, { backgroundColor: n.unread ? '#eff6ff' : '#f8fafc' }]}>
                    <Ionicons
                      name={n.unread ? 'notifications' : 'notifications-outline'}
                      size={18}
                      color={n.unread ? '#2563eb' : '#8e95a2'}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                      <Text style={styles.notifTitle}>{n.title}</Text>
                      {n.unread && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notifDesc}>{n.desc}</Text>
                    <Text style={styles.notifTime}>{n.time}</Text>
                  </View>
                </TouchableOpacity>
                {idx < filteredNotifications.length - 1 && <View style={styles.rowDivider} />}
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: Palette.bg,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    maxWidth: 580,
    alignSelf: 'center',
    width: '100%',
  },
  circleActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#edf0f5',
  },
  headerTitle: {
    fontSize: 16.5,
    fontFamily: Fonts.bold,
    color: '#111318',
    letterSpacing: -0.2,
  },
  markReadPill: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#edf0f5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9999,
  },
  markReadText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: '#2563eb',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    maxWidth: 580,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  heroSummaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#edf0f5',
    marginBottom: 14,
  },
  heroSummaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  balanceHeaderLabel: {
    fontSize: 10.5,
    fontFamily: Fonts.bold,
    color: '#8e95a2',
    letterSpacing: 0.8,
  },
  balanceValue: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#111318',
    marginTop: 2,
    letterSpacing: -0.3,
  },
  surgeBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  surgeBadgeText: {
    fontSize: 11.5,
    fontFamily: Fonts.semiBold,
    color: '#059669',
  },
  heroSubtext: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 17,
  },
  heroActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f4f9',
  },
  actionCol: {
    alignItems: 'center',
    gap: 6,
  },
  circleActionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111318',
    alignItems: 'center',
    justifyContent: 'center',
    // NO drop shadows
    shadowOpacity: 0,
    elevation: 0,
  },
  circleActionActive: {
    backgroundColor: '#2563eb',
  },
  actionColLabel: {
    fontSize: 11,
    fontFamily: Fonts.semiBold,
    color: '#111318',
  },
  kpiTwinRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  twinCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#edf0f5',
  },
  twinHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  twinIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniStatusPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  miniStatusText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
  },
  twinCategory: {
    fontSize: 9.5,
    fontFamily: Fonts.bold,
    color: '#8e95a2',
    letterSpacing: 0.6,
  },
  twinValue: {
    fontSize: 14.5,
    fontFamily: Fonts.bold,
    color: '#111318',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: '#8e95a2',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.7,
  },
  groupedCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#edf0f5',
    overflow: 'hidden',
  },
  notifRow: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    alignItems: 'flex-start',
  },
  notifRowUnread: {
    backgroundColor: '#fbfdff',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notifTitle: {
    fontSize: 13.5,
    fontFamily: Fonts.bold,
    color: '#111318',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563eb',
  },
  notifDesc: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#64748b',
    marginTop: 3,
    lineHeight: 17,
  },
  notifTime: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: '#94a3b8',
    marginTop: 6,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#f1f4f9',
    marginLeft: 68,
  },
  emptyState: {
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 14.5,
    fontFamily: Fonts.semiBold,
    color: '#111318',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#8e95a2',
    marginTop: 4,
    textAlign: 'center',
  },
});
