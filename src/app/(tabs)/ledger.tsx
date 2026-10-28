import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePortal } from '@/store/portalStore';
import { Fonts } from '@/constants/typography';
import { useBottomSheet } from '@/context/BottomSheetContext';

export default function LedgerScreen() {
  const insets = useSafeAreaInsets();
  const { ledger, property } = usePortal();
  const { showBottomSheet } = useBottomSheet();

  const dynamicIslandTopPadding = Math.max(insets.top, Platform.OS === 'ios' ? 52 : 24) + 8;

  const totalGross = ledger.reduce((sum, item) => sum + item.credit, 0);
  const totalDeductions = 0; // TDS + GST
  const netBalance = totalGross - totalDeductions;

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
              <Text style={styles.headerTitle}>Financial Ledger</Text>
              <Text style={styles.headerSub} numberOfLines={1}>{property.name}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.exportCircleBtn}
            onPress={() =>
              showBottomSheet({
                title: 'Financial Statement',
                message: 'Verified double-entry ledger PDF statement with GST and settlement certificates is ready.',
                icon: 'document',
                primaryButtonText: 'Download PDF',
                secondaryButtonText: 'Dismiss'
              })
            }
            activeOpacity={0.7}
          >
            <Ionicons name="document-text-outline" size={20} color="#111318" />
          </TouchableOpacity>
        </View>

        {/* Hero White Summary Card (Home Screen Style) */}
        <View style={styles.heroSummaryCard}>
          <View style={styles.heroCardContent}>
            <View style={styles.heroCardHeaderRow}>
              <View>
                <Text style={styles.summaryLabel}>All Partners Net Balance</Text>
                <View style={styles.balanceValueRow}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <Text style={styles.heroBigAmount}>
                    {netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>

              <View style={styles.timeframePill}>
                <Ionicons name="shield-checkmark" size={12} color="#059669" />
                <Text style={styles.timeframeText}>NEFT Ready</Text>
              </View>
            </View>

            <View style={styles.surgeRow}>
              <View style={styles.surgeBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#059669" />
                <Text style={styles.surgeBadgeText}>100% Settled</Text>
              </View>
              <Text style={styles.balanceSubtext}>
                Net earnings after TDS (1%) & GST (18%)
              </Text>
            </View>

            {/* 3 Circular Action Buttons */}
            <View style={styles.heroActionButtonsRow}>
              <View style={styles.heroActionCol}>
                <TouchableOpacity
                  style={styles.heroRoundBtn}
                  onPress={() =>
                    showBottomSheet({
                      title: 'Settlement Queued',
                      message: `Withdrawal batch for ₹${netBalance.toLocaleString()} queued for automatic NEFT payout into your verified HDFC bank account.`,
                      icon: 'money',
                      primaryButtonText: 'Confirm Payout'
                    })
                  }
                  activeOpacity={0.85}
                >
                  <Ionicons name="arrow-up-outline" size={20} color="#ffffff" style={{ transform: [{ rotate: '45deg' }] }} />
                </TouchableOpacity>
                <Text style={styles.heroActionLabel}>Withdraw</Text>
              </View>

              <View style={styles.heroActionCol}>
                <TouchableOpacity
                  style={styles.heroRoundBtn}
                  onPress={() =>
                    showBottomSheet({
                      title: 'Verified Bank Account',
                      message: 'HDFC Bank Tirupati Main Branch\nA/C No: ******* 4819\nIFSC: HDFC0001234\nBeneficiary: Annamaiah Reddy\nStatus: KYC Validated',
                      icon: 'security',
                      primaryButtonText: 'Done'
                    })
                  }
                  activeOpacity={0.85}
                >
                  <Ionicons name="business-outline" size={19} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.heroActionLabel}>Bank A/C</Text>
              </View>

              <View style={styles.heroActionCol}>
                <TouchableOpacity
                  style={styles.heroRoundBtn}
                  onPress={() =>
                    showBottomSheet({
                      title: 'Tax & TDS Certificates',
                      message: 'FY 2026-27 Form 16A quarterly TDS certificates and GST invoices are audited and available.',
                      icon: 'document',
                      primaryButtonText: 'View Invoices'
                    })
                  }
                  activeOpacity={0.85}
                >
                  <Ionicons name="receipt-outline" size={19} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.heroActionLabel}>Tax Invoices</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Twin Highlight Cards (Fintech Style) */}
        <View style={styles.kpiTwinRow}>
          <View style={styles.kpiTwinCard}>
            <View style={styles.twinHeader}>
              <Text style={styles.twinTitle}>Gross Sales</Text>
              <View style={[styles.twinIconBox, { backgroundColor: '#ecfdf5' }]}>
                <Ionicons name="wallet" size={14} color="#059669" />
              </View>
            </View>
            <Text style={styles.twinCategory}>Direct Devotee Bookings</Text>
            <Text style={[styles.twinAmount, { color: '#059669' }]}>
              ₹{totalGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
            <View style={styles.twinTrendPill}>
              <Ionicons name="arrow-up" size={11} color="#059669" />
              <Text style={styles.twinTrendText}>Active inflow</Text>
            </View>
          </View>

          <View style={styles.kpiTwinCard}>
            <View style={styles.twinHeader}>
              <Text style={styles.twinTitle}>Deductions</Text>
              <View style={[styles.twinIconBox, { backgroundColor: '#fef2f2' }]}>
                <Ionicons name="pie-chart" size={14} color="#dc2626" />
              </View>
            </View>
            <Text style={styles.twinCategory}>Govt Tax & Gateway</Text>
            <Text style={[styles.twinAmount, { color: '#dc2626' }]}>
              ₹{totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.twinSub}>Zero pending liabilities</Text>
          </View>
        </View>

        {/* Transaction History Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeadingNoMargin}>Transaction Statement</Text>
          <TouchableOpacity
            onPress={() =>
              showBottomSheet({
                title: 'Export Receipt',
                message: 'Receipt download for recent pilgrim transactions has been generated.',
                icon: 'document',
                primaryButtonText: 'Download'
              })
            }
          >
            <Text style={styles.viewAllText}>Download PDF</Text>
          </TouchableOpacity>
        </View>

        {/* Grouped Transaction Card */}
        <View style={styles.groupedCard}>
          {ledger.map((txn, index) => (
            <View key={txn.id}>
              <View style={styles.txnRow}>
                <View style={styles.txnAvatarCircle}>
                  <Ionicons name="arrow-down" size={18} color="#059669" />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.txnTop}>
                    <Text style={styles.txnId}>{txn.id}</Text>
                    <Text style={styles.txnCredit}>
                      +₹{txn.credit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Text>
                  </View>

                  <Text style={styles.txnDesc}>{txn.description}</Text>

                  <View style={styles.txnFooter}>
                    <Text style={styles.txnDate}>{txn.date}</Text>
                    <View style={styles.refPill}>
                      <Ionicons name="link-outline" size={11} color="#0284c7" />
                      <Text style={styles.refText}>{txn.refId}</Text>
                    </View>
                  </View>
                </View>
              </View>
              {index < ledger.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
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
  exportCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#edf0f5',
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
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  timeframeText: {
    fontSize: 11,
    fontFamily: Fonts.semiBold,
    color: '#059669',
  },
  surgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 16,
    marginTop: 2,
  },
  surgeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 9999,
  },
  surgeBadgeText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: '#059669',
  },
  balanceSubtext: {
    fontSize: 11.5,
    fontFamily: Fonts.regular,
    color: '#8e95a2',
    flexShrink: 1,
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
  kpiTwinRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  kpiTwinCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#edf0f5',
  },
  twinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  twinTitle: {
    fontSize: 11.5,
    fontFamily: Fonts.medium,
    color: '#8e95a2',
  },
  twinIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  twinCategory: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#111318',
  },
  twinAmount: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#111318',
    marginTop: 4,
    marginBottom: 6,
  },
  twinTrendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  twinTrendText: {
    fontSize: 11,
    fontFamily: Fonts.semiBold,
    color: '#059669',
  },
  twinSub: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: '#8e95a2',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionHeadingNoMargin: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: '#8e95a2',
    marginLeft: 4,
  },
  viewAllText: {
    fontSize: 12.5,
    fontFamily: Fonts.semiBold,
    color: '#3b82f6',
    marginRight: 4,
  },
  groupedCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#edf0f5',
    overflow: 'hidden',
  },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
  },
  txnAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  txnTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  txnId: {
    fontSize: 13.5,
    fontFamily: Fonts.bold,
    color: '#111318',
  },
  txnCredit: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#059669',
  },
  txnDesc: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#64748b',
    marginTop: 4,
  },
  txnFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  txnDate: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: '#8e95a2',
  },
  refPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  refText: {
    fontSize: 10.5,
    fontFamily: Fonts.semiBold,
    color: '#0284c7',
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#f1f4f9',
    marginLeft: 68,
  },
});
