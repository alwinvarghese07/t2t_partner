import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePortal } from '@/store/portalStore';
import { Fonts, Palette } from '@/constants/typography';
import { useBottomSheet } from '@/context/BottomSheetContext';

export default function CreateBookingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addBooking, inventory, property } = usePortal();
  const { showBottomSheet } = useBottomSheet();

  const [customer, setCustomer] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('28 Oct 2026, 02:00 PM');
  const [checkOut, setCheckOut] = useState('29 Oct 2026, 11:00 AM');
  const [guests, setGuests] = useState('2');

  const selectedRoom = inventory[selectedRoomIndex] || inventory[0];
  const dynamicIslandTopPadding = Math.max(insets.top, Platform.OS === 'ios' ? 52 : 24) + 8;

  const handleReset = () => {
    setCustomer('');
    setPhone('');
    setSelectedRoomIndex(0);
    setGuests('2');
  };

  const handleSubmit = () => {
    if (!customer.trim()) {
      showBottomSheet({
        title: 'Missing Guest Name',
        message: 'Please enter the primary devotee or guest full name before proceeding.',
        icon: 'warning',
        primaryButtonText: 'Got it'
      });
      return;
    }

    const newId = addBooking({
      customer: customer.trim(),
      phone: phone.trim() || '+91 98000 00000',
      service: `${property.name} - ${selectedRoom.roomType}`,
      serviceType: 'Accommodation',
      checkIn,
      checkOut,
      guests: parseInt(guests, 10) || 2,
      amount: selectedRoom.price
    });

    showBottomSheet({
      title: 'Reservation Confirmed!',
      message: `Walk-in booking ${newId} for ${customer.trim()} is successfully confirmed and added to the front desk ledger.`,
      icon: 'success',
      primaryButtonText: 'View Reservations',
      onPrimaryPress: () => router.back()
    });
  };

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
        <Text style={styles.headerTitle}>New Reservation</Text>
        <TouchableOpacity
          style={styles.circleActionBtn}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh-outline" size={18} color="#111318" />
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
              <Text style={styles.balanceHeaderLabel}>WALK-IN RESERVATION DESK</Text>
              <Text style={styles.balanceValue}>Quick Check-In</Text>
            </View>
            <View style={styles.surgeBadgePill}>
              <View style={styles.pulseDot} />
              <Text style={styles.surgeBadgeText}>Instant Confirm</Text>
            </View>
          </View>

          <Text style={styles.heroSubtext}>
            {property.name} • Direct Pilgrim Walk-in & Counter Allocation
          </Text>

          {/* 3 Circular Action Buttons */}
          <View style={styles.heroActionsRow}>
            <View style={styles.actionCol}>
              <TouchableOpacity
                style={[styles.circleActionButton, selectedRoomIndex === 0 && styles.circleActionActive]}
                onPress={() => setSelectedRoomIndex(0)}
                activeOpacity={0.85}
              >
                <Ionicons name="bed" size={20} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.actionColLabel}>Standard</Text>
            </View>

            <View style={styles.actionCol}>
              <TouchableOpacity
                style={[styles.circleActionButton, selectedRoomIndex === 1 && styles.circleActionActive]}
                onPress={() => setSelectedRoomIndex(1)}
                activeOpacity={0.85}
              >
                <Ionicons name="people" size={20} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.actionColLabel}>Deluxe</Text>
            </View>

            <View style={styles.actionCol}>
              <TouchableOpacity
                style={styles.circleActionButton}
                onPress={() =>
                  showBottomSheet({
                    title: 'Government ID Policy',
                    message: 'As per Tirupati pilgrimage regulations, all adult guests must present original Aadhaar card, Passport, or Voter ID during check-in.',
                    icon: 'security',
                    primaryButtonText: 'I Understand'
                  })
                }
                activeOpacity={0.85}
              >
                <Ionicons name="information-circle" size={20} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.actionColLabel}>ID Policy</Text>
            </View>
          </View>
        </View>

        {/* Twin Highlight Cards */}
        <View style={styles.kpiTwinRow}>
          <View style={styles.twinCard}>
            <View style={styles.twinHeaderRow}>
              <View style={[styles.twinIconBox, { backgroundColor: '#eff6ff' }]}>
                <Ionicons name="pricetag-outline" size={15} color="#2563eb" />
              </View>
              <View style={[styles.miniStatusPill, { backgroundColor: '#eff6ff' }]}>
                <Text style={[styles.miniStatusText, { color: '#2563eb' }]}>Nightly</Text>
              </View>
            </View>
            <Text style={styles.twinCategory}>TARIFF TIER</Text>
            <Text style={styles.twinValue}>₹ {selectedRoom.price.toLocaleString()}</Text>
          </View>

          <View style={styles.twinCard}>
            <View style={styles.twinHeaderRow}>
              <View style={[styles.twinIconBox, { backgroundColor: '#f0fdf4' }]}>
                <Ionicons name="key-outline" size={15} color="#16a34a" />
              </View>
              <View style={[styles.miniStatusPill, { backgroundColor: '#ecfdf5' }]}>
                <Text style={[styles.miniStatusText, { color: '#059669' }]}>Available</Text>
              </View>
            </View>
            <Text style={styles.twinCategory}>INVENTORY</Text>
            <Text style={styles.twinValue}>{selectedRoom.available} Units Ready</Text>
          </View>
        </View>

        {/* Section: Guest Details */}
        <Text style={styles.sectionHeading}>GUEST CONTACT & IDENTIFICATION</Text>
        <View style={styles.cleanCard}>
          <Text style={styles.fieldLabel}>PRIMARY GUEST FULL NAME *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Ramesh Kumar"
            placeholderTextColor="#8e95a2"
            value={customer}
            onChangeText={setCustomer}
          />

          <Text style={[styles.fieldLabel, { marginTop: 14 }]}>MOBILE CONTACT NUMBER *</Text>
          <TextInput
            style={styles.input}
            placeholder="+91 98765 00000"
            placeholderTextColor="#8e95a2"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* Section: Select Room Unit */}
        <Text style={styles.sectionHeading}>SELECT ROOM CATEGORY</Text>
        <View style={styles.cleanCard}>
          {inventory.map((item, idx) => {
            const isSelected = selectedRoomIndex === idx;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.roomOption, isSelected && styles.roomOptionSelected]}
                onPress={() => setSelectedRoomIndex(idx)}
                activeOpacity={0.7}
              >
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.roomName, isSelected && styles.roomNameSelected]}>
                    {item.roomType}
                  </Text>
                  <Text style={styles.roomAvail}>{item.available} units available • {item.status}</Text>
                </View>
                <Text style={[styles.roomPrice, isSelected && styles.roomPriceSelected]}>
                  ₹ {item.price.toLocaleString()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section: Schedule & Guests */}
        <Text style={styles.sectionHeading}>SCHEDULE & OCCUPANCY</Text>
        <View style={styles.cleanCard}>
          <View style={styles.rowDates}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>CHECK-IN TIMING</Text>
              <TextInput
                style={styles.input}
                value={checkIn}
                onChangeText={setCheckIn}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>CHECK-OUT TIMING</Text>
              <TextInput
                style={styles.input}
                value={checkOut}
                onChangeText={setCheckOut}
              />
            </View>
          </View>

          <Text style={[styles.fieldLabel, { marginTop: 14 }]}>TOTAL PILGRIMS / GUESTS COUNT</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={guests}
            onChangeText={setGuests}
          />
        </View>

        {/* Total Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>NET AMOUNT PAYABLE</Text>
              <Text style={styles.summarySub}>Inclusive of taxes. Immediate ledger ledger credit.</Text>
            </View>
            <Text style={styles.summaryPrice}>₹ {selectedRoom.price.toLocaleString()}</Text>
          </View>
        </View>

        {/* Flat Dark Pill Button: NO drop shadow */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" style={{ marginRight: 6 }} />
          <Text style={styles.submitBtnText}>Confirm & Record Reservation</Text>
        </TouchableOpacity>

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
    fontSize: 15,
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
  cleanCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#edf0f5',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 10.5,
    fontFamily: Fonts.bold,
    color: '#8e95a2',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#edf0f5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13.5,
    fontFamily: Fonts.medium,
    color: '#111318',
  },
  roomOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#edf0f5',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  roomOptionSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#2563eb',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563eb',
  },
  roomName: {
    fontSize: 13.5,
    fontFamily: Fonts.semiBold,
    color: '#111318',
  },
  roomNameSelected: {
    color: '#1e40af',
    fontFamily: Fonts.bold,
  },
  roomAvail: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: '#8e95a2',
    marginTop: 2,
  },
  roomPrice: {
    fontSize: 14.5,
    fontFamily: Fonts.bold,
    color: '#111318',
  },
  roomPriceSelected: {
    color: '#1e40af',
  },
  rowDates: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#edf0f5',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10.5,
    fontFamily: Fonts.bold,
    color: '#8e95a2',
    letterSpacing: 0.8,
  },
  summaryPrice: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#111318',
  },
  summarySub: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: '#64748b',
    marginTop: 3,
  },
  submitBtn: {
    flexDirection: 'row',
    backgroundColor: '#111318',
    paddingVertical: 15,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    // NO drop shadows
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: Fonts.semiBold,
  },
});
