import { Fonts } from '@/constants/typography';
import { usePortal } from '@/store/portalStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText
} from 'react-native-svg';

const SERVICE_TYPES = [
  {
    id: 'accommodation',
    name: 'Accommodation',
    shortName: 'Stay',
    pieLabel: 'Accommodation',
    percent: 54,
    startPct: 0,
    endPct: 54,
    amount: '₹24,375',
    details: '10 Active Units',
    desc: 'Standard Double, Deluxe AC & Family Suites',
    color: '#f97316',
    labelFactor: 0.62,
    fontSize: 12.5,
    percentSize: 14,
    icon: 'bed-outline' as const,
  },
  {
    id: 'darshan',
    name: 'Darshan Packages',
    shortName: 'Darshan',
    pieLabel: 'Darshan',
    percent: 24,
    startPct: 54,
    endPct: 78,
    amount: '₹10,800',
    details: '3 Tour Circuits',
    desc: 'VIP Tirumala Darshan & Pilgrim Sightseeing',
    color: '#7c3aed',
    labelFactor: 0.62,
    fontSize: 12,
    percentSize: 13,
    icon: 'sparkles-outline' as const,
  },
  {
    id: 'transit',
    name: 'Transit & Cabs',
    shortName: 'Transit',
    pieLabel: 'Transit',
    percent: 14,
    startPct: 78,
    endPct: 92,
    amount: '₹6,300',
    details: 'Hill Ghat Taxis',
    desc: 'Station/Airport Pickups & Tirumala Ghat link',
    color: '#0284c7',
    labelFactor: 0.66,
    fontSize: 11,
    percentSize: 12,
    icon: 'car-outline' as const,
  },
  {
    id: 'pooja',
    name: 'Pooja & Seva',
    shortName: 'Pooja',
    pieLabel: 'Pooja',
    percent: 8,
    startPct: 92,
    endPct: 100,
    amount: '₹3,600',
    details: 'Special Sevas',
    desc: 'Suprabhatham & Special Darshan assistance',
    color: '#10b981',
    labelFactor: 0.72,
    fontSize: 10.5,
    percentSize: 11.5,
    icon: 'flower-outline' as const,
  },
];

const getPieSlice = (cx: number, cy: number, r: number, startPct: number, endPct: number) => {
  const startAngle = (startPct / 100) * 360 - 90;
  const endAngle = (endPct / 100) * 360 - 90;

  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);

  const largeArcFlag = endPct - startPct > 50 ? 1 : 0;

  return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
};

const getSliceOffset = (startPct: number, endPct: number, distance: number) => {
  const midPct = (startPct + endPct) / 2;
  const midAngle = (midPct / 100) * 360 - 90;
  const midRad = (midAngle * Math.PI) / 180;
  return {
    x: Math.round(distance * Math.cos(midRad)),
    y: Math.round(distance * Math.sin(midRad)),
  };
};

const getSliceLabelPos = (cx: number, cy: number, r: number, startPct: number, endPct: number, factor = 0.65) => {
  const midPct = (startPct + endPct) / 2;
  const midAngle = (midPct / 100) * 360 - 90;
  const midRad = (midAngle * Math.PI) / 180;
  return {
    x: Math.round(cx + r * factor * Math.cos(midRad)),
    y: Math.round(cy + r * factor * Math.sin(midRad)),
  };
};

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { property, bookings, inventory, notifications, toggleInventory } = usePortal();

  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'Oct 2026' | 'All Time'>('Oct 2026');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const selectedServiceItem = SERVICE_TYPES.find(s => s.id === selectedService);

  const totalBalance = bookings.reduce((sum, item) => sum + item.amount, 0);
  const pendingCount = bookings.filter(b => b.status === 'Pending Confirmation').length;
  const unreadCount = notifications.filter(n => n.unread).length;
  const primaryRoom = inventory[0];

  // Dynamic Island & Status Bar safe clearance
  const dynamicIslandTopPadding = Math.max(insets.top, Platform.OS === 'ios' ? 52 : 24) + 8;

  // Chart data points for smooth bezier curve
  // Width 340, Height 140
  const areaPath = "M 10 110 C 60 100, 90 70, 130 65 C 170 60, 200 45, 240 38 C 270 32, 300 20, 330 18 L 330 135 L 10 135 Z";
  const linePath = "M 10 110 C 60 100, 90 70, 130 65 C 170 60, 200 45, 240 38 C 270 32, 300 20, 330 18";

  return (
    <View style={[styles.mainWrapper, { paddingTop: dynamicIslandTopPadding }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top App Header with Partner Property Brand & Notifications */}
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
              <Text style={styles.headerPropertyName} numberOfLines={1}>{property.name}</Text>
              <Text style={styles.headerPropertySub} numberOfLines={1}>{property.location}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.notifButton}
            onPress={() => router.push('/notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color="#111318" />
            {unreadCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Hero White Balance & Action Card */}
        <View style={styles.heroAnalyticsCard}>
          <View style={styles.heroCardContent}>
            <View style={styles.heroCardHeaderRow}>
              <View>
                <Text style={styles.balanceHeaderLabel}>Total Net Revenue</Text>
                <View style={styles.balanceValueRow}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <Text style={styles.heroBigBalance}>
                    {analyticsTimeframe === 'Oct 2026' ? '24,375.00' : totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.timeframePill}
                onPress={() => setAnalyticsTimeframe(prev => prev === 'Oct 2026' ? 'All Time' : 'Oct 2026')}
                activeOpacity={0.8}
              >
                <Text style={styles.timeframeText}>{analyticsTimeframe}</Text>
                <Ionicons name="chevron-down" size={12} color="#8e95a2" />
              </TouchableOpacity>
            </View>

            <View style={styles.surgeRow}>
              <View style={styles.surgeBadge}>
                <Ionicons name="trending-up" size={12} color="#059669" />
                <Text style={styles.surgeBadgeText}>+18.4%</Text>
              </View>
              <Text style={styles.balanceSubtext}>
                Surge during Srivari Brahmotsavam pilgrimage
              </Text>
            </View>
          </View>
        </View>

        {/* Two Side-by-Side Highlight Analytics Cards */}
        <View style={styles.kpiTwinRow}>
          <View style={styles.kpiTwinCard}>
            <View style={styles.twinHeader}>
              <Text style={styles.twinTitle}>Highest Revenue</Text>
              <View style={[styles.twinIconBox, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="flash" size={14} color="#d97706" />
              </View>
            </View>
            <Text style={styles.twinCategory}>Standard Double</Text>
            <Text style={styles.twinAmount}>₹18,540</Text>
            <View style={styles.twinTrendPill}>
              <Ionicons name="arrow-up" size={11} color="#059669" />
              <Text style={styles.twinTrendText}>+14% vs last week</Text>
            </View>
          </View>

          <View style={styles.kpiTwinCard}>
            <View style={styles.twinHeader}>
              <Text style={styles.twinTitle}>Peak Season</Text>
              <View style={[styles.twinIconBox, { backgroundColor: '#f3e8ff' }]}>
                <Ionicons name="heart" size={14} color="#7c3aed" />
              </View>
            </View>
            <Text style={styles.twinCategory}>Brahmotsavam</Text>
            <Text style={styles.twinAmount}>90% Occupancy</Text>
            <Text style={styles.twinSub}>9 of 10 rooms allocated</Text>
          </View>
        </View>

        {/* Horizontal Prompt Banner (matching reference Image 1) */}
        {pendingCount > 0 && (
          <TouchableOpacity
            style={styles.promptBannerCard}
            onPress={() => router.push('/(tabs)/bookings')}
            activeOpacity={0.8}
          >
            <View style={styles.promptCoinBox}>
              <Ionicons name="time" size={18} color="#d97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.promptBannerTitle}>
                {pendingCount} Pending Reservation
              </Text>
              <Text style={styles.promptBannerSub}>usha rani · Tap to review & confirm</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#8e95a2" />
          </TouchableOpacity>
        )}

        {/* Interactive Inflow & Spending Trends Chart Card */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartMainTitle}>Occupancy Trends</Text>
              <View style={styles.chartLegendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#f97316' }]} />
                  <Text style={styles.legendText}>Oct 2026 (Surge)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#cbd5e1' }]} />
                  <Text style={styles.legendText}>Target (85%)</Text>
                </View>
              </View>
            </View>

            <View style={styles.calendarPill}>
              <Ionicons name="calendar-outline" size={13} color="#64748b" />
              <Text style={styles.calendarPillText}>1–31 Oct</Text>
            </View>
          </View>

          {/* SVG Smooth Area Chart */}
          <View style={styles.svgContainer}>
            <Svg width="100%" height={150} viewBox="0 0 340 140">
              <Defs>
                <LinearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#f97316" stopOpacity="0.32" />
                  <Stop offset="85%" stopColor="#f97316" stopOpacity="0.02" />
                  <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </LinearGradient>
              </Defs>

              {/* Target benchmark dashed line */}
              <Line
                x1="10"
                y1="50"
                x2="330"
                y2="50"
                stroke="#e2e8f0"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
              <SvgText
                x="14"
                y="44"
                fill="#94a3b8"
                fontSize="9.5"
                fontFamily={Fonts.medium}
              >
                Target 85% Benchmark
              </SvgText>

              {/* Area fill */}
              <Path d={areaPath} fill="url(#orangeGrad)" />

              {/* Smooth curve line */}
              <Path
                d={linePath}
                fill="none"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Active data point pin */}
              <Circle cx="240" cy="38" r="6" fill="#ffffff" stroke="#f97316" strokeWidth="3" />

              {/* Highlight callout badge */}
              <G x="180" y="2">
                <Path
                  d="M 0 0 L 80 0 C 84 0 87 3 87 7 L 87 23 C 87 27 84 30 80 30 L 50 30 L 45 35 L 40 30 L 0 30 C -4 30 -7 27 -7 23 L -7 7 C -7 3 -4 0 0 0 Z"
                  fill="#111318"
                />
                <SvgText
                  x="40"
                  y="14"
                  fill="#ffffff"
                  fontSize="8.5"
                  textAnchor="middle"
                  fontFamily={Fonts.bold}
                >
                  Peak Surge: 90%
                </SvgText>
                <SvgText
                  x="40"
                  y="24"
                  fill="#94a3b8"
                  fontSize="8"
                  textAnchor="middle"
                  fontFamily={Fonts.medium}
                >
                  usha rani + 2 groups
                </SvgText>
              </G>
            </Svg>

            {/* X-axis labels */}
            <View style={styles.chartXLabels}>
              <Text style={styles.chartXText}>Oct 1</Text>
              <Text style={styles.chartXText}>Oct 8</Text>
              <Text style={styles.chartXText}>Oct 15</Text>
              <Text style={styles.chartXText}>Oct 22</Text>
              <Text style={[styles.chartXText, { color: '#f97316', fontFamily: Fonts.bold }]}>Today</Text>
              <Text style={styles.chartXText}>Oct 31</Text>
            </View>
          </View>
        </View>

        {/* Service Types Section with Full-Size Pie Chart */}
        <View style={styles.serviceTypesCard}>
          <View style={styles.serviceCardHeader}>
            <View>
              <Text style={styles.serviceCardTitle}>Service Distribution</Text>
              <Text style={styles.serviceCardSubtitle}>Daily offerings & revenue share</Text>
            </View>
            <View style={styles.serviceBadgePill}>
              <View style={styles.pulseDot} />
              <Text style={styles.serviceBadgeText}>4 Active Services</Text>
            </View>
          </View>

          {/* Interactive Tooltip Card */}
          {selectedServiceItem ? (
            <View style={styles.pieTooltipCard}>
              <View style={styles.pieTooltipHeader}>
                <View style={styles.pieTooltipTitleRow}>
                  <View style={[styles.pieTooltipDot, { backgroundColor: selectedServiceItem.color }]} />
                  <Text style={styles.pieTooltipTitle}>{selectedServiceItem.name}</Text>
                  <View style={[styles.pieTooltipPill, { backgroundColor: `${selectedServiceItem.color}18` }]}>
                    <Text style={[styles.pieTooltipPillText, { color: selectedServiceItem.color }]}>
                      {selectedServiceItem.percent}% Share
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedService(null)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <Text style={styles.pieTooltipDesc}>{selectedServiceItem.desc}</Text>

              <View style={styles.pieTooltipMetricsRow}>
                <View style={styles.pieTooltipMetric}>
                  <Text style={styles.pieTooltipMetricLabel}>REVENUE</Text>
                  <Text style={styles.pieTooltipMetricVal}>{selectedServiceItem.amount}</Text>
                </View>
                <View style={styles.pieTooltipDivider} />
                <View style={styles.pieTooltipMetric}>
                  <Text style={styles.pieTooltipMetricLabel}>INVENTORY</Text>
                  <Text style={styles.pieTooltipMetricVal}>{selectedServiceItem.details}</Text>
                </View>
                <View style={styles.pieTooltipDivider} />
                <View style={styles.pieTooltipMetric}>
                  <Text style={styles.pieTooltipMetricLabel}>PORTFOLIO</Text>
                  <Text style={[styles.pieTooltipMetricVal, { color: selectedServiceItem.color }]}>
                    {selectedServiceItem.percent}%
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.pieHintPill}>
              <Ionicons name="finger-print-outline" size={13} color="#64748b" />
              <Text style={styles.pieHintText}>Tap any slice to inspect details & breakdown</Text>
            </View>
          )}

          {/* Full Size Pie Chart with Slices and Names on Pie */}
          <View style={styles.fullPieSvgWrapper}>
            <Svg width="100%" height={290} viewBox="0 0 320 290">
              {SERVICE_TYPES.map(item => {
                const isSelected = selectedService === item.id;
                const isAnySelected = selectedService !== null;
                const offset = isSelected ? getSliceOffset(item.startPct, item.endPct, 8) : { x: 0, y: 0 };
                const labelPos = getSliceLabelPos(160, 145, 120, item.startPct, item.endPct, item.labelFactor);

                return (
                  <G
                    key={item.id}
                    transform={`translate(${offset.x}, ${offset.y})`}
                    onPress={() => setSelectedService(prev => prev === item.id ? null : item.id)}
                  >
                    <Path
                      d={getPieSlice(160, 145, 120, item.startPct, item.endPct)}
                      fill={item.color}
                      opacity={!isAnySelected || isSelected ? 1 : 0.45}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />

                    {/* Service Name & Percentage directly on Pie */}
                    <SvgText
                      x={labelPos.x}
                      y={labelPos.y - 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={item.fontSize}
                      fontFamily={Fonts.bold}
                    >
                      {item.pieLabel}
                    </SvgText>
                    <SvgText
                      x={labelPos.x}
                      y={labelPos.y + 12}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={item.percentSize}
                      fontFamily={Fonts.bold}
                    >
                      {item.percent}%
                    </SvgText>
                  </G>
                );
              })}

              {/* Center Hub */}
              <Circle cx="160" cy="145" r="28" fill="#ffffff" stroke="#f1f4f9" strokeWidth="2" />
              <SvgText
                x="160"
                y="142"
                textAnchor="middle"
                fill="#111318"
                fontSize="12.5"
                fontFamily={Fonts.bold}
              >
                {selectedServiceItem ? `${selectedServiceItem.percent}%` : '100%'}
              </SvgText>
              <SvgText
                x="160"
                y="153"
                textAnchor="middle"
                fill="#8e95a2"
                fontSize="8"
                fontFamily={Fonts.medium}
              >
                {selectedServiceItem ? selectedServiceItem.shortName : 'Total'}
              </SvgText>
            </Svg>
          </View>
        </View>

        {/* Property Occupancy Progress Bar */}
        <View style={styles.occupancyCard}>
          <View style={styles.occupancyTextRow}>
            <View style={styles.occupancyLabelRow}>
              <Ionicons name="pie-chart-outline" size={14} color="#64748b" />
              <Text style={styles.occupancyLabel}>Property Occupancy Rate</Text>
            </View>
            <Text style={styles.occupancyValue}>10% (1 / 10 Rooms)</Text>
          </View>
          <View style={styles.occupancyTrack}>
            <View style={[styles.occupancyFill, { width: '10%' }]} />
          </View>
        </View>

        {/* Room Inventory Unit Quick-Toggle */}
        {primaryRoom && (
          <View style={styles.cleanCard}>
            <View style={styles.invHeaderRow}>
              <View>
                <Text style={styles.invRoomType}>{primaryRoom.roomType}</Text>
                <Text style={styles.invPrice}>₹{primaryRoom.price.toLocaleString()} / night</Text>
              </View>
              <View style={styles.invSwitchRow}>
                <Text style={[styles.invStatusPill, { color: primaryRoom.status === 'Available' ? '#059669' : '#dc2626' }]}>
                  {primaryRoom.status}
                </Text>
                <Switch
                  value={primaryRoom.status === 'Available'}
                  onValueChange={() => toggleInventory(primaryRoom.id)}
                  trackColor={{ false: '#e2e8f0', true: '#bae6fd' }}
                  thumbColor={primaryRoom.status === 'Available' ? '#3b82f6' : '#94a3b8'}
                />
              </View>
            </View>

            <View style={styles.invMetricsBar}>
              <View style={styles.invMetricItem}>
                <Text style={styles.invMetricLabel}>Total</Text>
                <Text style={styles.invMetricValue}>{primaryRoom.total}</Text>
              </View>
              <View style={styles.invMetricDivider} />
              <View style={styles.invMetricItem}>
                <Text style={styles.invMetricLabel}>Booked</Text>
                <Text style={[styles.invMetricValue, { color: '#dc2626' }]}>{primaryRoom.booked}</Text>
              </View>
              <View style={styles.invMetricDivider} />
              <View style={styles.invMetricItem}>
                <Text style={styles.invMetricLabel}>Available</Text>
                <Text style={[styles.invMetricValue, { color: '#059669' }]}>{primaryRoom.available}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Recent Bookings List */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeadingNoMargin}>Recent Bookings</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/bookings')}>
            <Text style={styles.viewAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.groupedCard}>
          {bookings.slice(0, 3).map((b, index) => (
            <View key={b.id}>
              <TouchableOpacity
                style={styles.txnRowItem}
                onPress={() => router.push('/(tabs)/bookings')}
                activeOpacity={0.7}
              >
                <View style={styles.txnAvatarCircle}>
                  <Text style={styles.txnAvatarInitial}>{b.customer.charAt(0).toUpperCase()}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.txnCustomerName}>{b.customer}</Text>
                  <Text style={styles.txnMetaSub}>{b.serviceType} · {b.checkIn.split(',')[0]}</Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.txnAmountGreen}>+₹{b.amount.toLocaleString()}</Text>
                  <Text style={styles.txnStatusSub}>{b.status === 'Pending Confirmation' ? 'Pending' : 'Received'}</Text>
                </View>
              </TouchableOpacity>
              {index < 2 && <View style={styles.rowDivider} />}
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
  headerPropertyName: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#111318',
  },
  headerPropertySub: {
    fontSize: 11.5,
    fontFamily: Fonts.regular,
    color: '#8e95a2',
    marginTop: 1,
  },
  notifButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#edf0f5',
  },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#3b82f6',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notifBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: Fonts.bold,
  },
  // Hero White Analytics Card
  heroAnalyticsCard: {
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
    marginBottom: 10,
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
  balanceHeaderLabel: {
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
  heroBigBalance: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#111318',
    letterSpacing: -0.5,
  },
  surgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
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
  // Service Types Card
  sectionHeading: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: '#8e95a2',
    marginBottom: 10,
    marginLeft: 4,
  },
  serviceTypesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#edf0f5',
    marginBottom: 16,
  },
  serviceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  serviceCardTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#111318',
  },
  serviceCardSubtitle: {
    fontSize: 11.5,
    fontFamily: Fonts.regular,
    color: '#8e95a2',
    marginTop: 2,
  },
  serviceBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  serviceBadgeText: {
    fontSize: 11,
    fontFamily: Fonts.semiBold,
    color: '#059669',
  },
  fullPieSvgWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  pieTooltipCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 4,
  },
  pieTooltipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  pieTooltipTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pieTooltipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pieTooltipTitle: {
    fontSize: 13.5,
    fontFamily: Fonts.bold,
    color: '#111318',
  },
  pieTooltipPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  pieTooltipPillText: {
    fontSize: 10.5,
    fontFamily: Fonts.bold,
  },
  pieTooltipDesc: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: '#64748b',
    marginBottom: 8,
  },
  pieTooltipMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#edf2f7',
  },
  pieTooltipMetric: {
    alignItems: 'center',
    flex: 1,
  },
  pieTooltipMetricLabel: {
    fontSize: 9,
    fontFamily: Fonts.bold,
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  pieTooltipMetricVal: {
    fontSize: 12.5,
    fontFamily: Fonts.bold,
    color: '#111318',
    marginTop: 2,
  },
  pieTooltipDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#e2e8f0',
  },
  pieHintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f8fafc',
    borderRadius: 9999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#edf0f5',
    marginBottom: 6,
    alignSelf: 'center',
  },
  pieHintText: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: '#64748b',
  },
  // Side by side cards
  kpiTwinRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
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
    fontSize: 12.5,
    fontFamily: Fonts.semiBold,
    color: '#111318',
  },
  twinAmount: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#111318',
    marginTop: 3,
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
  // Prompt Banner (Fintech style)
  promptBannerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#edf0f5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  promptCoinBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptBannerTitle: {
    fontSize: 13.5,
    fontFamily: Fonts.bold,
    color: '#111318',
  },
  promptBannerSub: {
    fontSize: 11.5,
    fontFamily: Fonts.regular,
    color: '#8e95a2',
    marginTop: 2,
  },
  // Inflow Trends Chart Card
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#edf0f5',
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  chartMainTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#111318',
  },
  chartLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: '#8e95a2',
  },
  calendarPill: {
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
  calendarPillText: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: '#64748b',
  },
  svgContainer: {
    width: '100%',
    alignItems: 'center',
  },
  chartXLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 8,
  },
  chartXText: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    color: '#8e95a2',
  },
  cleanCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#edf0f5',
    marginBottom: 16,
  },
  occupancyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#edf0f5',
    marginBottom: 16,
  },
  occupancyLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  occupancyTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  occupancyLabel: {
    fontSize: 11.5,
    fontFamily: Fonts.medium,
    color: '#64748b',
  },
  occupancyValue: {
    fontSize: 11.5,
    fontFamily: Fonts.semiBold,
    color: '#111318',
  },
  occupancyTrack: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  occupancyFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 9999,
  },
  invHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invRoomType: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#111318',
  },
  invPrice: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#3b82f6',
    marginTop: 2,
  },
  invSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  invStatusPill: {
    fontSize: 11.5,
    fontFamily: Fonts.semiBold,
  },
  invMetricsBar: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  invMetricItem: {
    flex: 1,
    alignItems: 'center',
  },
  invMetricDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#edf0f5',
  },
  invMetricLabel: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: '#8e95a2',
  },
  invMetricValue: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#111318',
    marginTop: 2,
  },
  // Recent Transactions Section
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
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
  txnRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  txnAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111318',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txnAvatarInitial: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#ffffff',
  },
  txnCustomerName: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#111318',
  },
  txnMetaSub: {
    fontSize: 11.5,
    fontFamily: Fonts.regular,
    color: '#8e95a2',
    marginTop: 2,
  },
  txnAmountGreen: {
    fontSize: 14.5,
    fontFamily: Fonts.bold,
    color: '#059669',
  },
  txnStatusSub: {
    fontSize: 10.5,
    fontFamily: Fonts.medium,
    color: '#94a3b8',
    marginTop: 2,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#f1f4f9',
    marginLeft: 68,
  },
});
