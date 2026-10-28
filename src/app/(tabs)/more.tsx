import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts, Palette } from '@/constants/typography';
import { usePortal } from '@/store/portalStore';
import { useBottomSheet } from '@/context/BottomSheetContext';

export default function MoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { property, notifications } = usePortal();
  const { showBottomSheet } = useBottomSheet();
  const unreadCount = notifications.filter(n => n.unread).length;

  const dynamicIslandTopPadding = Math.max(insets.top, Platform.OS === 'ios' ? 52 : 24) + 8;

  return (
    <View style={[styles.mainWrapper, { paddingTop: dynamicIslandTopPadding }]}>
      {/* Top Header matching signature Home style */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeftBrand}>
          <View style={styles.headerLogoBox}>
            <Image
              source={require('@/assets/images/logo-icon.png')}
              style={styles.headerLogoImage}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.headerBrandTitle}>{property.name}</Text>
            <Text style={styles.headerBrandSubtitle}>{property.location}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.headerRightAction}
          onPress={() => router.push('/notifications')}
          activeOpacity={0.8}
        >
          <Ionicons name="notifications-outline" size={19} color="#111318" />
          {unreadCount > 0 && <View style={styles.headerNotifBadge} />}
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
              <Text style={styles.balanceHeaderLabel}>PARTNER PROFILE & ACCESS</Text>
              <Text style={styles.balanceValue}>Annamaiah Reddy</Text>
            </View>
            <View style={styles.surgeBadgePill}>
              <View style={styles.pulseDot} />
              <Text style={styles.surgeBadgeText}>Super Admin</Text>
            </View>
          </View>

          <Text style={styles.heroSubtext}>
            Partner ID: AP-TPT-8160 • Tirupati Town Central • KYC Verified
          </Text>

          {/* 3 Circular Action Buttons with white icons matching Home */}
          <View style={styles.heroActionsRow}>
            <View style={styles.actionCol}>
              <TouchableOpacity
                style={styles.circleActionButton}
                onPress={() =>
                  showBottomSheet({
                    title: 'Property Overview',
                    message: `${property.name}\n${property.location}\n10 Active Room Units registered on Trip2Tirupati network.`,
                    icon: 'user',
                    primaryButtonText: 'Understood'
                  })
                }
                activeOpacity={0.85}
              >
                <Ionicons name="business" size={20} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.actionColLabel}>Property</Text>
            </View>

            <View style={styles.actionCol}>
              <TouchableOpacity
                style={styles.circleActionButton}
                onPress={() =>
                  showBottomSheet({
                    title: 'Roles & Access Privileges',
                    message: 'Administrator tier active with full ledger settlement, real-time reservations, and inventory override permissions.',
                    icon: 'security',
                    primaryButtonText: 'Done'
                  })
                }
                activeOpacity={0.85}
              >
                <Ionicons name="shield-checkmark" size={20} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.actionColLabel}>Security</Text>
            </View>

            <View style={styles.actionCol}>
              <TouchableOpacity
                style={styles.circleActionButton}
                onPress={() =>
                  showBottomSheet({
                    title: 'Trip2Tirupati Partner Desk',
                    message: '24x7 Dedicated Pilgrim Partner Support:\n📞 +91 877 222 5555\n✉️ partner-support@trip2tirupati.com',
                    icon: 'info',
                    primaryButtonText: 'Contact Support'
                  })
                }
                activeOpacity={0.85}
              >
                <Ionicons name="help-buoy" size={20} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.actionColLabel}>Support</Text>
            </View>
          </View>
        </View>

        {/* Twin Highlight Cards matching Home */}
        <View style={styles.kpiTwinRow}>
          <View style={styles.twinCard}>
            <View style={styles.twinHeaderRow}>
              <View style={[styles.twinIconBox, { backgroundColor: '#eff6ff' }]}>
                <Ionicons name="ribbon-outline" size={15} color="#2563eb" />
              </View>
              <View style={[styles.miniStatusPill, { backgroundColor: '#ecfdf5' }]}>
                <Text style={[styles.miniStatusText, { color: '#059669' }]}>Verified</Text>
              </View>
            </View>
            <Text style={styles.twinCategory}>PARTNER TIER</Text>
            <Text style={styles.twinValue}>Gold Network</Text>
          </View>

          <View style={styles.twinCard}>
            <View style={styles.twinHeaderRow}>
              <View style={[styles.twinIconBox, { backgroundColor: '#f0fdf4' }]}>
                <Ionicons name="finger-print-outline" size={15} color="#16a34a" />
              </View>
              <View style={[styles.miniStatusPill, { backgroundColor: '#f0fdf4' }]}>
                <Text style={[styles.miniStatusText, { color: '#16a34a' }]}>Active</Text>
              </View>
            </View>
            <Text style={styles.twinCategory}>ACTIVE SESSION</Text>
            <Text style={styles.twinValue}>Desk Terminal #1</Text>
          </View>
        </View>

        {/* Single Standalone Card: Property & KYC Verification */}
        <TouchableOpacity
          style={styles.singleRowCard}
          onPress={() =>
            showBottomSheet({
              title: 'KYC & Trade Verification',
              message: `${property.name}\nGSTIN: 37AAAAA0000A1Z5\nTTD Pilgrim Accommodation Authorized\nStatus: 100% Verified & Compliant`,
              icon: 'document',
              primaryButtonText: 'Close'
            })
          }
          activeOpacity={0.7}
        >
          <View style={styles.rowLeft}>
            <View style={[styles.rowIconCircle, { backgroundColor: '#eff6ff' }]}>
              <Ionicons name="document-lock-outline" size={18} color="#2563eb" />
            </View>
            <View>
              <Text style={styles.rowTitle}>Property & KYC Documentation</Text>
              <Text style={styles.rowSubtitle}>GSTIN 37AAAAA0000A1Z5 • Verified</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        </TouchableOpacity>

        {/* Section: Operations & Inventory */}
        <Text style={styles.sectionHeading}>OPERATIONS & CATALOG</Text>
        <View style={styles.groupedCard}>
          <TouchableOpacity
            style={styles.groupedRow}
            onPress={() => router.push('/(tabs)/catalog')}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.rowIconCircle, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="flash-outline" size={18} color="#d97706" />
              </View>
              <View>
                <Text style={styles.rowTitle}>Room Attributes & Tariffs</Text>
                <Text style={styles.rowSubtitle}>Dynamic pricing, surge rules & amenities</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.groupedRow}
            onPress={() =>
              showBottomSheet({
                title: 'Branch Coordinates & GPS',
                message: 'Near RTC Central Bus Stand, Tirupati (13.6521° N, 79.3872° E)\nGeofenced for automatic devotee check-in alerts upon arrival.',
                icon: 'location',
                primaryButtonText: 'Got it'
              })
            }
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.rowIconCircle, { backgroundColor: '#f0fdf4' }]}>
                <Ionicons name="navigate-circle-outline" size={18} color="#16a34a" />
              </View>
              <View>
                <Text style={styles.rowTitle}>Branch Coordinates & GPS</Text>
                <Text style={styles.rowSubtitle}>RTC Bus Stand Hub • Geofenced</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.groupedRow}
            onPress={() =>
              showBottomSheet({
                title: 'Transit Provider Network',
                message: 'Integrated with 45+ verified Tirupati pilgrim transit providers and taxi operators for Tirumala Hill Ghat trips.',
                icon: 'link',
                primaryButtonText: 'Done'
              })
            }
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.rowIconCircle, { backgroundColor: '#f5f3ff' }]}>
                <Ionicons name="hand-left-outline" size={18} color="#7c3aed" />
              </View>
              <View>
                <Text style={styles.rowTitle}>Transit & Taxi Provider Network</Text>
                <Text style={styles.rowSubtitle}>Tirupati Airport & Railway Station link</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Section: Pilgrim Destination & Guides */}
        <Text style={styles.sectionHeading}>DESTINATION & PILGRIM GUIDE</Text>
        <View style={styles.groupedCard}>
          <TouchableOpacity
            style={styles.groupedRow}
            onPress={() =>
              showBottomSheet({
                title: 'Sacred Temples & Darshan Guide',
                message: 'Sri Venkateswara Swamy Temple (Tirumala)\nOpen: 03:00 AM - 11:30 PM\nDistance: 22 km via First Ghat Road.\nPadmavathi Ammavari Temple: 5 km.',
                icon: 'location',
                primaryButtonText: 'Great'
              })
            }
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.rowIconCircle, { backgroundColor: '#fff7ed' }]}>
                <Ionicons name="sparkles-outline" size={18} color="#ea580c" />
              </View>
              <View>
                <Text style={styles.rowTitle}>Sacred Temples & Timings</Text>
                <Text style={styles.rowSubtitle}>Tirumala, Padmavathi Ammavari, Govindaraja</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.groupedRow}
            onPress={() =>
              showBottomSheet({
                title: 'Pilgrim Darshan Itineraries',
                message: 'Pre-configured 1-Day, 2-Day, and 3-Day Tirupati pilgrim circuits available for hotel guests with verified taxi packages.',
                icon: 'booking',
                primaryButtonText: 'View Packages',
                onPrimaryPress: () => router.push('/(tabs)/catalog')
              })
            }
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.rowIconCircle, { backgroundColor: '#f0f9ff' }]}>
                <Ionicons name="compass-outline" size={18} color="#0284c7" />
              </View>
              <View>
                <Text style={styles.rowTitle}>Pilgrim Darshan Itineraries</Text>
                <Text style={styles.rowSubtitle}>1-Day & 2-Day temple visit routes</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.groupedRow}
            onPress={() => router.push('/notifications')}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.rowIconCircle, { backgroundColor: '#e0f2fe' }]}>
                <Ionicons name="notifications-outline" size={18} color="#0284c7" />
              </View>
              <View>
                <Text style={styles.rowTitle}>Notification Stream</Text>
                <Text style={styles.rowSubtitle}>Real-time activity and booking alerts</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {unreadCount > 0 && (
                <View style={styles.smallNotifPill}>
                  <Text style={styles.smallNotifText}>{unreadCount}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Section: Staff & Permissions */}
        <Text style={styles.sectionHeading}>TEAM & GOVERNANCE</Text>
        <View style={styles.groupedCard}>
          <TouchableOpacity
            style={styles.groupedRow}
            onPress={() =>
              showBottomSheet({
                title: 'Front Desk Operators',
                message: 'Annamaiah Reddy (Admin)\nReceptionist Duty: Front Desk Terminal\nNight Duty Officer: Active\nAll terminals operational.',
                icon: 'user',
                primaryButtonText: 'Understood'
              })
            }
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.rowIconCircle, { backgroundColor: '#f1f5f9' }]}>
                <Ionicons name="person-outline" size={18} color="#334155" />
              </View>
              <View>
                <Text style={styles.rowTitle}>Front Desk Operators</Text>
                <Text style={styles.rowSubtitle}>2 active staff members configured</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.groupedRow}
            onPress={() =>
              showBottomSheet({
                title: 'Roles & Security Privileges',
                message: 'Two-factor authentication enabled for all administrative withdrawals and rate revisions. Session timeout set to 24h idle.',
                icon: 'security',
                primaryButtonText: 'Done'
              })
            }
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.rowIconCircle, { backgroundColor: '#f1f5f9' }]}>
                <Ionicons name="shield-outline" size={18} color="#334155" />
              </View>
              <View>
                <Text style={styles.rowTitle}>Roles & Permissions</Text>
                <Text style={styles.rowSubtitle}>Role-based access control enabled</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.groupedRow}
            onPress={() =>
              showBottomSheet({
                title: 'Security & Audit Logs',
                message: 'Recent event: Session login verified at 14:32:00.\nCryptographic signing: Active.\nZero unauthorized access attempts detected.',
                icon: 'document',
                primaryButtonText: 'Close'
              })
            }
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.rowIconCircle, { backgroundColor: '#f1f5f9' }]}>
                <Ionicons name="document-text-outline" size={18} color="#334155" />
              </View>
              <View>
                <Text style={styles.rowTitle}>Security & Audit Logs</Text>
                <Text style={styles.rowSubtitle}>Immutable audit trail active</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Sign Out Flat Pill Button */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={() =>
            showBottomSheet({
              title: 'Active Partner Session',
              message: 'You are signed into Annamaiah Guest House Tirupati as Partner Super Admin (ID: AP-8160).',
              icon: 'user',
              primaryButtonText: 'Stay Signed In'
            })
          }
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text style={styles.signOutBtnText}>Partner Session Active (ID: AP-8160)</Text>
        </TouchableOpacity>

        <View style={{ height: 110 }} />
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
  headerLeftBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerLogoBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eef1f6',
    overflow: 'hidden',
  },
  headerLogoImage: {
    width: 26,
    height: 26,
  },
  headerBrandTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#111318',
    letterSpacing: -0.2,
  },
  headerBrandSubtitle: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: '#8e95a2',
    marginTop: 1,
  },
  headerRightAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#edf0f5',
    position: 'relative',
  },
  headerNotifBadge: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#ef4444',
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
  singleRowCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#edf0f5',
    marginBottom: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rowIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 13.5,
    fontFamily: Fonts.semiBold,
    color: '#111318',
  },
  rowSubtitle: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: '#8e95a2',
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
    marginBottom: 16,
  },
  groupedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f4f9',
    marginLeft: 64,
  },
  smallNotifPill: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  smallNotifText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: Fonts.bold,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fee2e2',
    borderRadius: 9999,
    paddingVertical: 14,
    marginTop: 6,
    // NO drop shadow
    shadowOpacity: 0,
    elevation: 0,
  },
  signOutBtnText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: '#ef4444',
  },
});
