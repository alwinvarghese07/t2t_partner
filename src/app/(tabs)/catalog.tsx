import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Switch,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePortal } from '@/store/portalStore';
import { Fonts } from '@/constants/typography';
import { useBottomSheet } from '@/context/BottomSheetContext';

export default function CatalogScreen() {
  const insets = useSafeAreaInsets();
  const { inventory, packages, toggleInventory, property } = usePortal();
  const { showBottomSheet } = useBottomSheet();
  const [activeSegment, setActiveSegment] = useState<'Inventory' | 'Packages' | 'Rate Cards'>('Inventory');

  const dynamicIslandTopPadding = Math.max(insets.top, Platform.OS === 'ios' ? 52 : 24) + 8;

  const totalUnits = inventory.reduce((sum, item) => sum + item.total, 0);
  const availableUnits = inventory.reduce((sum, item) => sum + item.available, 0);
  const bookedUnits = inventory.reduce((sum, item) => sum + item.booked, 0);

  const rateCards = [
    { id: 'RC-101', name: 'Regular Season Tariff', vertical: 'Accommodation', base: '₹2,060', surge: '+15% weekends', status: 'Active' },
    { id: 'RC-102', name: 'Srivari Brahmotsavam Surge', vertical: 'Accommodation', base: '₹3,500', surge: '+25% festive', status: 'Scheduled' },
    { id: 'RC-103', name: 'Tirupati-Tirumala Cab Tariff', vertical: 'Travel/Cab', base: '₹2,800', surge: 'Flat rate', status: 'Active' },
  ];

  return (
    <View style={[styles.mainWrapper, { paddingTop: dynamicIslandTopPadding }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header matching Home design */}
        <View style={styles.topHeader}>
          <View style={styles.headerBrandRow}>
            <View style={styles.headerLogoBox}>
              <Image
                source={require('@/assets/images/logo-icon.png')}
                style={styles.headerLogo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.headerTextGroup}>
              <Text style={styles.headerTitle}>Catalog & Inventory</Text>
              <Text style={styles.headerSub} numberOfLines={1}>{property.name}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.circleAddBtn}
            onPress={() =>
              showBottomSheet({
                title: 'New Service Listing',
                message: 'Add an inventory room category, darshan pilgrim package, or festive surge rate card for Annamaiah Guest House.',
                icon: 'booking',
                primaryButtonText: 'Create Listing',
                secondaryButtonText: 'Cancel'
              })
            }
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Hero White Summary Card (Home Screen Style) */}
        <View style={styles.heroSummaryCard}>
          <View style={styles.heroCardContent}>
            <View style={styles.heroCardHeaderRow}>
              <View>
                <Text style={styles.summaryLabel}>Total Active Room Capacity</Text>
                <View style={styles.balanceValueRow}>
                  <Text style={styles.heroBigAmount}>{totalUnits}</Text>
                  <Text style={styles.heroUnitLabel}>Units Online</Text>
                </View>
              </View>

              <View style={styles.timeframePill}>
                <Ionicons name="business-outline" size={12} color="#475569" />
                <Text style={styles.timeframeText}>Live Tariffs</Text>
              </View>
            </View>

            <View style={styles.badgeRow}>
              <View style={[styles.miniStatusBadge, { backgroundColor: '#ecfdf5' }]}>
                <Ionicons name="checkmark-circle" size={11} color="#059669" />
                <Text style={[styles.miniStatusText, { color: '#059669' }]}>
                  {availableUnits} Free for Booking
                </Text>
              </View>
              <View style={[styles.miniStatusBadge, { backgroundColor: '#fef2f2' }]}>
                <Ionicons name="lock-closed" size={11} color="#dc2626" />
                <Text style={[styles.miniStatusText, { color: '#dc2626' }]}>
                  {bookedUnits} Currently Booked
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Clean Pill Segmented Control */}
        <View style={styles.segmentContainer}>
          {(['Inventory', 'Packages', 'Rate Cards'] as const).map(seg => {
            const isActive = activeSegment === seg;
            return (
              <TouchableOpacity
                key={seg}
                style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                onPress={() => setActiveSegment(seg)}
                activeOpacity={0.8}
              >
                <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                  {seg}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 1. INVENTORY SEGMENT */}
        {activeSegment === 'Inventory' && (
          <View style={styles.sectionWrap}>
            <View style={styles.noticeBanner}>
              <Ionicons name="information-circle-outline" size={18} color="#0284c7" />
              <Text style={styles.noticeText}>
                Toggle availability to instantly open or block rooms for online pilgrim reservations.
              </Text>
            </View>

            {inventory.map(item => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.roomType}</Text>
                    <Text style={styles.cardPrice}>₹{item.price.toLocaleString()} / night</Text>
                  </View>
                  <View style={styles.switchWrapper}>
                    <Text style={[styles.switchStatus, { color: item.status === 'Available' ? '#059669' : '#dc2626' }]}>
                      {item.status}
                    </Text>
                    <Switch
                      value={item.status === 'Available'}
                      onValueChange={() => toggleInventory(item.id)}
                      trackColor={{ false: '#e2e8f0', true: '#bae6fd' }}
                      thumbColor={item.status === 'Available' ? '#3b82f6' : '#94a3b8'}
                    />
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Total Units</Text>
                    <Text style={styles.statVal}>{item.total}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Booked</Text>
                    <Text style={[styles.statVal, { color: '#dc2626' }]}>{item.booked}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Available</Text>
                    <Text style={[styles.statVal, { color: '#059669' }]}>{item.available}</Text>
                  </View>
                </View>

                {/* Flat Ghost Pill Button (No Shadow) */}
                <TouchableOpacity
                  style={styles.ghostPillBtn}
                  onPress={() =>
                    showBottomSheet({
                      title: 'Inventory Blackout Dates',
                      message: `Specify maintenance blackout or offline counter booking lock for ${item.roomType}.`,
                      icon: 'booking',
                      primaryButtonText: 'Set Dates',
                      secondaryButtonText: 'Dismiss'
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Ionicons name="calendar-outline" size={15} color="#111318" />
                  <Text style={styles.ghostPillBtnText}>Block Specific Dates</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* 2. PACKAGES SEGMENT */}
        {activeSegment === 'Packages' && (
          <View style={styles.sectionWrap}>
            {packages.map(p => (
              <View key={p.code} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.pkgCode}>{p.code}</Text>
                  <View style={[styles.pillBadge, p.status === 'Active' ? styles.pillBadgeActive : styles.pillBadgeDraft]}>
                    <Text style={[styles.pillBadgeText, p.status === 'Active' ? styles.pillBadgeTextActive : styles.pillBadgeTextDraft]}>
                      {p.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.pkgName}>{p.name}</Text>
                <Text style={styles.pkgService}>{p.service} · {p.roomType}</Text>

                <View style={styles.pkgDetailsRow}>
                  <View style={styles.pkgDetailItem}>
                    <Ionicons name="time-outline" size={14} color="#8e95a2" />
                    <Text style={styles.pkgDetailText}>{p.duration}</Text>
                  </View>
                  <View style={styles.pkgDetailItem}>
                    <Ionicons name="people-outline" size={14} color="#8e95a2" />
                    <Text style={styles.pkgDetailText}>Max {p.maxGuests} Guests</Text>
                  </View>
                </View>

                <View style={styles.pkgFooter}>
                  <View>
                    <Text style={styles.priceLabel}>Package Tariff</Text>
                    <Text style={styles.pkgPrice}>₹{p.price.toLocaleString()}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.darkPillBtn}
                    onPress={() =>
                      showBottomSheet({
                        title: 'Edit Darshan Package',
                        message: `Configure pilgrim itinerary, vehicle allocation, and tariff for ${p.name}.`,
                        icon: 'document',
                        primaryButtonText: 'Update Package',
                        secondaryButtonText: 'Cancel'
                      })
                    }
                    activeOpacity={0.85}
                  >
                    <Text style={styles.darkPillBtnText}>Edit Package</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 3. RATE CARDS SEGMENT */}
        {activeSegment === 'Rate Cards' && (
          <View style={styles.sectionWrap}>
            <View style={styles.noticeBanner}>
              <Ionicons name="trending-up-outline" size={18} color="#0284c7" />
              <Text style={styles.noticeText}>
                Active surge rules dynamically update room tariffs during Brahmotsavam pilgrimage rush.
              </Text>
            </View>

            {rateCards.map(rc => (
              <View key={rc.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.pkgCode}>{rc.id}</Text>
                    <Text style={styles.cardTitle}>{rc.name}</Text>
                  </View>
                  <View style={[styles.pillBadge, rc.status === 'Active' ? styles.pillBadgeActive : styles.pillBadgeDraft]}>
                    <Text style={[styles.pillBadgeText, rc.status === 'Active' ? styles.pillBadgeTextActive : styles.pillBadgeTextDraft]}>
                      {rc.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.rateGrid}>
                  <View style={styles.rateBlock}>
                    <Text style={styles.rateLabel}>BASE TARIFF</Text>
                    <Text style={styles.rateVal}>{rc.base}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.rateBlock}>
                    <Text style={styles.rateLabel}>DYNAMIC SURGE</Text>
                    <Text style={[styles.rateVal, { color: '#d97706' }]}>{rc.surge}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.ghostPillBtn}
                  onPress={() =>
                    showBottomSheet({
                      title: 'Surge Rule Configuration',
                      message: `Dynamic rate multipliers for ${rc.name} will trigger automatically when hotel occupancy exceeds 85%.`,
                      icon: 'money',
                      primaryButtonText: 'Save Rule',
                      secondaryButtonText: 'Close'
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Ionicons name="options-outline" size={15} color="#111318" />
                  <Text style={styles.ghostPillBtnText}>Modify Rules</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#f6f8fb',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  headerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 12,
  },
  headerLogoBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#edf0f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    width: 26,
    height: 26,
  },
  headerTextGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#111318',
  },
  headerSub: {
    fontSize: 11.5,
    fontFamily: Fonts.regular,
    color: '#8e95a2',
    marginTop: 1,
  },
  circleAddBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111318',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0,
    elevation: 0,
  },
  // Hero White Summary Card (Home Screen Style)
  heroSummaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#edf0f5',
    marginBottom: 16,
    shadowOpacity: 0,
    elevation: 0,
  },
  heroCardContent: {
    padding: 20,
  },
  heroCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 11.5,
    fontFamily: Fonts.medium,
    color: '#8e95a2',
  },
  balanceValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  heroBigAmount: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: '#111318',
    letterSpacing: -0.5,
  },
  heroUnitLabel: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: '#3b82f6',
  },
  timeframePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#edf0f5',
  },
  timeframeText: {
    fontSize: 11,
    fontFamily: Fonts.semiBold,
    color: '#475569',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    marginTop: 4,
  },
  miniStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  miniStatusText: {
    fontSize: 11,
    fontFamily: Fonts.semiBold,
  },
  heroActionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  heroActionCol: {
    alignItems: 'center',
    gap: 6,
  },
  heroRoundBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111318',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0,
    elevation: 0,
  },
  heroActionLabel: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: '#111318',
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f4f9',
    borderRadius: 9999,
    padding: 3,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#ffffff',
  },
  segmentText: {
    fontSize: 12.5,
    fontFamily: Fonts.medium,
    color: '#8e95a2',
  },
  segmentTextActive: {
    color: '#111318',
    fontFamily: Fonts.semiBold,
  },
  sectionWrap: {
    gap: 12,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#e0f2fe',
    borderRadius: 18,
    padding: 12,
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#0369a1',
    flex: 1,
    lineHeight: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#edf0f5',
    shadowOpacity: 0,
    elevation: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#111318',
  },
  cardPrice: {
    fontSize: 12.5,
    fontFamily: Fonts.medium,
    color: '#3b82f6',
    marginTop: 2,
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchStatus: {
    fontSize: 11.5,
    fontFamily: Fonts.semiBold,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#edf0f5',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: '#8e95a2',
  },
  statVal: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#111318',
    marginTop: 2,
  },
  ghostPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#f1f4f9',
    borderRadius: 9999,
    shadowOpacity: 0,
    elevation: 0,
  },
  ghostPillBtnText: {
    fontSize: 12.5,
    fontFamily: Fonts.semiBold,
    color: '#111318',
  },
  pkgCode: {
    fontSize: 11.5,
    fontFamily: Fonts.semiBold,
    color: '#3b82f6',
  },
  pillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  pillBadgeActive: { backgroundColor: '#ecfdf5' },
  pillBadgeDraft: { backgroundColor: '#f1f4f9' },
  pillBadgeText: { fontSize: 10.5, fontFamily: Fonts.semiBold },
  pillBadgeTextActive: { color: '#059669' },
  pillBadgeTextDraft: { color: '#8e95a2' },
  pkgName: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#111318',
    marginTop: 4,
  },
  pkgService: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#8e95a2',
    marginTop: 2,
  },
  pkgDetailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  pkgDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pkgDetailText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#64748b',
  },
  pkgFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  priceLabel: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    color: '#8e95a2',
  },
  pkgPrice: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#111318',
  },
  darkPillBtn: {
    backgroundColor: '#111318',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 9999,
    shadowOpacity: 0,
    elevation: 0,
  },
  darkPillBtnText: {
    fontSize: 12.5,
    fontFamily: Fonts.semiBold,
    color: '#ffffff',
  },
  rateGrid: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginVertical: 12,
  },
  rateBlock: {
    flex: 1,
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: 10,
    fontFamily: Fonts.semiBold,
    color: '#8e95a2',
    letterSpacing: 0.5,
  },
  rateVal: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#111318',
    marginTop: 2,
  },
});
