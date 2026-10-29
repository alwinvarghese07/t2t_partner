import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePortal } from '@/store/portalStore';
import { Fonts } from '@/constants/typography';
import { useBottomSheet } from '@/context/BottomSheetContext';

export default function BookingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { bookings, updateBookingStatus, property } = usePortal();
  const { showBottomSheet } = useBottomSheet();

  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const dynamicIslandTopPadding = Math.max(insets.top, Platform.OS === 'ios' ? 52 : 24) + 8;

  const pendingBookings = bookings.filter(b => b.status === 'Pending Confirmation');
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked In');
  const totalValue = bookings.reduce((sum, b) => sum + b.amount, 0);

  const filteredBookings = bookings.filter(b => {
    const matchQuery =
      b.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery);

    if (!matchQuery) return false;
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending') return b.status === 'Pending Confirmation';
    if (activeTab === 'Confirmed') return b.status === 'Confirmed' || b.status === 'Checked In';
    if (activeTab === 'Completed') return b.status === 'Completed';
    if (activeTab === 'Cancelled') return b.status === 'Cancelled';
    return true;
  });

  const handleConfirm = (id: string) => {
    updateBookingStatus(id, 'Confirmed');
    showBottomSheet({
      title: 'Booking Confirmed!',
      message: `Reservation ${id} has been accepted. The devotee has been notified via SMS and arrival desk is notified.`,
      icon: 'success',
      primaryButtonText: 'Great'
    });
  };

  const handleCheckIn = (id: string) => {
    updateBookingStatus(id, 'Checked In');
    showBottomSheet({
      title: 'Devotee Checked In',
      message: `Welcome protocol and digital key allocation completed for reservation ${id}.`,
      icon: 'user',
      primaryButtonText: 'Done'
    });
  };

  return (
    <View style={[styles.mainWrapper, { paddingTop: dynamicIslandTopPadding }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header with Property Brand and Add Button */}
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
              <Text style={styles.headerTitle}>Reservations</Text>
              <Text style={styles.headerSub} numberOfLines={1}>{property.name}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.circleAddBtn}
            onPress={() => router.push('/create-booking')}
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
                <Text style={styles.summaryLabel}>Total Reservations Pipeline</Text>
                <View style={styles.balanceValueRow}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <Text style={styles.heroBigAmount}>
                    {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>

              <View style={styles.timeframePill}>
                <Ionicons name="calendar-outline" size={12} color="#475569" />
                <Text style={styles.timeframeText}>Active Batch</Text>
              </View>
            </View>

            <View style={styles.badgeRow}>
              {pendingBookings.length > 0 && (
                <View style={[styles.miniStatusBadge, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="time" size={11} color="#b45309" />
                  <Text style={[styles.miniStatusText, { color: '#b45309' }]}>
                    {pendingBookings.length} Awaiting Confirmation
                  </Text>
                </View>
              )}
              <View style={[styles.miniStatusBadge, { backgroundColor: '#ecfdf5' }]}>
                <Ionicons name="checkmark-circle" size={11} color="#059669" />
                <Text style={[styles.miniStatusText, { color: '#059669' }]}>
                  {confirmedBookings.length} Confirmed Stays
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pill Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={18} color="#8e95a2" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search devotee name, booking ID, phone..."
              placeholderTextColor="#8e95a2"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color="#8e95a2" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Pill Filter Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            {(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map(tab => {
              const count = bookings.filter(b => {
                if (tab === 'All') return true;
                if (tab === 'Pending') return b.status === 'Pending Confirmation';
                if (tab === 'Confirmed') return b.status === 'Confirmed' || b.status === 'Checked In';
                if (tab === 'Completed') return b.status === 'Completed';
                if (tab === 'Cancelled') return b.status === 'Cancelled';
                return true;
              }).length;

              const isActive = activeTab === tab;

              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabPill, isActive && styles.tabPillActive]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {tab}
                  </Text>
                  <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
                    <Text style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}>
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Reservations Card List */}
        <View style={styles.listWrap}>
          {filteredBookings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <Ionicons name="calendar-outline" size={32} color="#8e95a2" />
              </View>
              <Text style={styles.emptyTitle}>No Bookings Found</Text>
              <Text style={styles.emptyDesc}>There are no bookings matching the selected filter criteria.</Text>
            </View>
          ) : (
            filteredBookings.map(b => (
              <View key={b.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.customerAvatarBox}>
                    <Text style={styles.customerInitial}>{b.customer.charAt(0).toUpperCase()}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.bIdRow}>
                      <Text style={styles.cardId}>{b.id}</Text>
                      <View style={[
                        styles.statusPill,
                        b.status === 'Pending Confirmation' ? styles.statusPillPending :
                        b.status === 'Confirmed' || b.status === 'Checked In' ? styles.statusPillConfirmed :
                        styles.statusPillDefault
                      ]}>
                        <Text style={[
                          styles.statusPillText,
                          b.status === 'Pending Confirmation' ? styles.statusTextPending :
                          b.status === 'Confirmed' || b.status === 'Checked In' ? styles.statusTextConfirmed :
                          styles.statusTextDefault
                        ]}>
                          {b.status}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.cardCustomer}>{b.customer}</Text>
                    <Text style={styles.cardPhone}>{b.phone}</Text>
                  </View>
                </View>

                {/* Service info */}
                <View style={styles.serviceRow}>
                  <Ionicons name="bed-outline" size={15} color="#8e95a2" />
                  <Text style={styles.serviceText} numberOfLines={1}>{b.service}</Text>
                  <View style={styles.paymentPill}>
                    <Text style={styles.paymentPillText}>{b.paymentStatus}</Text>
                  </View>
                </View>

                {/* Dates & Guests row */}
                <View style={styles.datesGrid}>
                  <View style={styles.dateBlock}>
                    <Text style={styles.dateLabel}>CHECK-IN</Text>
                    <Text style={styles.dateValue}>{b.checkIn}</Text>
                  </View>
                  <View style={styles.dateDivider} />
                  <View style={styles.dateBlock}>
                    <Text style={styles.dateLabel}>CHECK-OUT</Text>
                    <Text style={styles.dateValue}>{b.checkOut}</Text>
                  </View>
                </View>

                {/* Amount and guest counts */}
                <View style={styles.cardBottomRow}>
                  <View style={styles.guestsInfo}>
                    <Ionicons name="people-outline" size={15} color="#8e95a2" />
                    <Text style={styles.guestsText}>{b.guests} Guests</Text>
                  </View>
                  <Text style={styles.amountText}>₹{b.amount.toLocaleString()}</Text>
                </View>

                {/* Flat Pill Action Buttons: NO drop shadows */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.ghostPillBtn}
                    onPress={() =>
                      showBottomSheet({
                        title: 'Devotee Contact',
                        message: `Devotee: ${b.customer}\nPhone: ${b.phone}\nService: ${b.service}`,
                        icon: 'info',
                        primaryButtonText: 'Call Guest',
                        secondaryButtonText: 'Dismiss'
                      })
                    }
                    activeOpacity={0.7}
                  >
                    <Ionicons name="call-outline" size={14} color="#111318" />
                    <Text style={styles.ghostPillText}>Call</Text>
                  </TouchableOpacity>

                  {b.status === 'Pending Confirmation' && (
                    <TouchableOpacity
                      style={styles.darkPillBtn}
                      onPress={() => handleConfirm(b.id)}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="checkmark" size={15} color="#ffffff" />
                      <Text style={styles.darkPillText}>Accept Booking</Text>
                    </TouchableOpacity>
                  )}

                  {b.status === 'Confirmed' && (
                    <TouchableOpacity
                      style={styles.bluePillBtn}
                      onPress={() => handleCheckIn(b.id)}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="enter-outline" size={15} color="#ffffff" />
                      <Text style={styles.bluePillText}>Check In</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

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
    // NO drop shadows
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
    // NO drop shadows
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
    gap: 4,
    marginTop: 4,
    marginBottom: 4,
  },
  currencySymbol: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#111318',
  },
  heroBigAmount: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: '#111318',
    letterSpacing: -0.5,
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
  searchWrapper: {
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#edf0f5',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: '#111318',
  },
  tabsContainer: {
    marginBottom: 14,
  },
  tabsContent: {
    gap: 8,
    paddingVertical: 2,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 9999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#edf0f5',
  },
  tabPillActive: {
    backgroundColor: '#111318',
    borderColor: '#111318',
  },
  tabText: {
    fontSize: 12.5,
    fontFamily: Fonts.medium,
    color: '#8e95a2',
  },
  tabTextActive: {
    color: '#ffffff',
    fontFamily: Fonts.semiBold,
  },
  tabBadge: {
    backgroundColor: '#f1f4f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabBadgeText: {
    fontSize: 10.5,
    fontFamily: Fonts.bold,
    color: '#8e95a2',
  },
  tabBadgeTextActive: {
    color: '#ffffff',
  },
  listWrap: {
    gap: 12,
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
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  customerAvatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111318',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerInitial: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#ffffff',
  },
  bIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardId: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: '#3b82f6',
  },
  cardCustomer: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#111318',
    marginTop: 2,
  },
  cardPhone: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#8e95a2',
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  statusPillPending: { backgroundColor: '#fef3c7' },
  statusPillConfirmed: { backgroundColor: '#ecfdf5' },
  statusPillDefault: { backgroundColor: '#f1f4f9' },
  statusPillText: { fontSize: 10.5, fontFamily: Fonts.semiBold },
  statusTextPending: { color: '#b45309' },
  statusTextConfirmed: { color: '#059669' },
  statusTextDefault: { color: '#8e95a2' },
  paymentPill: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 9999,
  },
  paymentPillText: {
    fontSize: 10.5,
    fontFamily: Fonts.semiBold,
    color: '#059669',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 12,
  },
  serviceText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#111318',
    flex: 1,
  },
  datesGrid: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  dateBlock: {
    flex: 1,
  },
  dateDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#edf0f5',
    marginHorizontal: 10,
  },
  dateLabel: {
    fontSize: 10,
    fontFamily: Fonts.semiBold,
    color: '#8e95a2',
    letterSpacing: 0.5,
  },
  dateValue: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#111318',
    marginTop: 2,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  guestsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guestsText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#8e95a2',
  },
  amountText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#111318',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  ghostPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f1f4f9',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 9999,
    shadowOpacity: 0,
    elevation: 0,
  },
  ghostPillText: {
    fontSize: 12.5,
    fontFamily: Fonts.semiBold,
    color: '#111318',
  },
  darkPillBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#111318',
    paddingVertical: 9,
    borderRadius: 9999,
    shadowOpacity: 0,
    elevation: 0,
  },
  darkPillText: {
    fontSize: 12.5,
    fontFamily: Fonts.semiBold,
    color: '#ffffff',
  },
  bluePillBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#3b82f6',
    paddingVertical: 9,
    borderRadius: 9999,
    shadowOpacity: 0,
    elevation: 0,
  },
  bluePillText: {
    fontSize: 12.5,
    fontFamily: Fonts.semiBold,
    color: '#ffffff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#edf0f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#111318',
  },
  emptyDesc: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#8e95a2',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
});
