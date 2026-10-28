import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  Easing
} from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  G
} from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '@/constants/typography';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type SheetIconType =
  | 'success'
  | 'booking'
  | 'money'
  | 'user'
  | 'document'
  | 'security'
  | 'location'
  | 'bell'
  | 'link'
  | 'info'
  | 'warning';

export interface BottomSheetOptions {
  title: string;
  message: string;
  icon?: SheetIconType;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
}

interface BottomSheetModalProps {
  visible: boolean;
  options: BottomSheetOptions | null;
  onClose: () => void;
}

export const IllustratedBadge: React.FC<{ type: SheetIconType }> = ({ type }) => {
  const yellow = '#facc15';
  const lightYellow = '#fef08a';
  const black = '#111318';
  const white = '#ffffff';

  return (
    <View style={styles.badgeWrapper}>
      <Svg width={94} height={94} viewBox="0 0 94 94" fill="none">
        <Defs>
          <LinearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#fef08a" />
            <Stop offset="100%" stopColor="#facc15" />
          </LinearGradient>
          <LinearGradient id="accentGlow" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#fef9c3" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Soft background aura circle */}
        <Circle cx="47" cy="47" r="44" fill="url(#accentGlow)" />

        {type === 'success' && (
          <G>
            {/* Person with certificate / approval */}
            <Circle cx="47" cy="34" r="13" fill="url(#cardGrad)" stroke={black} strokeWidth="2.5" />
            <Path
              d="M26 68 C26 52 35 48 47 48 C59 48 68 52 68 68"
              fill="url(#cardGrad)"
              stroke={black}
              strokeWidth="2.5"
            />
            {/* White certificate stamp */}
            <Rect x="48" y="44" width="24" height="26" rx="4" fill={white} stroke={black} strokeWidth="2.5" />
            <Path d="M53 52 L67 52" stroke={black} strokeWidth="2" strokeLinecap="round" />
            <Path d="M53 58 L63 58" stroke={black} strokeWidth="2" strokeLinecap="round" />
            <Circle cx="64" cy="62" r="5" fill={yellow} stroke={black} strokeWidth="2" />
            <Path d="M62 62 L63.5 63.5 L66 60.5" stroke={black} strokeWidth="1.8" strokeLinecap="round" />
            {/* Floating stars */}
            <Circle cx="23" cy="30" r="2.5" fill={black} />
            <Circle cx="73" cy="28" r="3" fill={yellow} stroke={black} strokeWidth="1.5" />
          </G>
        )}

        {type === 'booking' && (
          <G>
            {/* Calendar modal with check badge */}
            <Rect x="23" y="24" width="48" height="48" rx="10" fill={white} stroke={black} strokeWidth="2.5" />
            <Path d="M23 38 L71 38" stroke={black} strokeWidth="2.5" />
            <Rect x="23" y="24" width="48" height="14" rx="10" fill="url(#cardGrad)" stroke={black} strokeWidth="2.5" />
            {/* Binder rings */}
            <Rect x="33" y="19" width="4" height="8" rx="2" fill={black} />
            <Rect x="57" y="19" width="4" height="8" rx="2" fill={black} />
            {/* Calendar dots */}
            <Circle cx="35" cy="48" r="2.5" fill={black} />
            <Circle cx="47" cy="48" r="2.5" fill={black} />
            <Circle cx="59" cy="48" r="2.5" fill={black} />
            <Circle cx="35" cy="58" r="2.5" fill={black} />
            {/* Floating Check pill badge */}
            <Circle cx="58" cy="58" r="9" fill={yellow} stroke={black} strokeWidth="2" />
            <Path d="M54.5 58 L57 60.5 L61.5 56" stroke={black} strokeWidth="2" strokeLinecap="round" />
            {/* Sparkle */}
            <Circle cx="18" cy="42" r="2.5" fill={black} />
          </G>
        )}

        {type === 'money' && (
          <G>
            {/* Bank card & cash flying bill */}
            <Rect
              x="24"
              y="34"
              width="46"
              height="32"
              rx="6"
              transform="rotate(-8 47 50)"
              fill="url(#cardGrad)"
              stroke={black}
              strokeWidth="2.5"
            />
            {/* Card chip / magnetic strip */}
            <Rect
              x="26"
              y="42"
              width="44"
              height="6"
              transform="rotate(-8 47 50)"
              fill={black}
            />
            {/* Receipt document in front */}
            <Rect x="44" y="22" width="28" height="34" rx="4" fill={white} stroke={black} strokeWidth="2" />
            <Path d="M49 30 L67 30" stroke={black} strokeWidth="2" strokeLinecap="round" />
            <Path d="M49 36 L63 36" stroke={black} strokeWidth="2" strokeLinecap="round" />
            <Circle cx="58" cy="46" r="4.5" fill={yellow} stroke={black} strokeWidth="1.8" />
            {/* Sparkles */}
            <Circle cx="20" cy="30" r="3" fill={yellow} stroke={black} strokeWidth="1.5" />
            <Circle cx="76" cy="48" r="2" fill={black} />
          </G>
        )}

        {type === 'user' && (
          <G>
            {/* Person avatar like unblock wade warren in reference image */}
            <Circle cx="47" cy="33" r="14" fill="url(#cardGrad)" stroke={black} strokeWidth="2.5" />
            <Path
              d="M24 70 C24 53 34 49 47 49 C60 49 70 53 70 70"
              fill="url(#cardGrad)"
              stroke={black}
              strokeWidth="2.5"
            />
            {/* Circular badge on chest */}
            <Circle cx="63" cy="62" r="9" fill={white} stroke={black} strokeWidth="2.2" />
            <Path d="M59 62 L67 62" stroke={black} strokeWidth="2" strokeLinecap="round" />
            <Path d="M63 58 L63 66" stroke={black} strokeWidth="2" strokeLinecap="round" />
            {/* Sparkle dot */}
            <Circle cx="73" cy="30" r="2.5" fill={black} />
            <Circle cx="21" cy="45" r="3" fill={yellow} stroke={black} strokeWidth="1.5" />
          </G>
        )}

        {type === 'document' && (
          <G>
            {/* Wishlist / Document sheet matching ref #05 */}
            <Path
              d="M32 20 L56 20 L66 30 L66 72 L32 72 Z"
              fill={white}
              stroke={black}
              strokeWidth="2.5"
            />
            <Path d="M56 20 L56 30 L66 30" fill="url(#cardGrad)" stroke={black} strokeWidth="2" />
            {/* Ruled lines */}
            <Path d="M38 38 L54 38" stroke={black} strokeWidth="2.2" strokeLinecap="round" />
            <Path d="M38 46 L60 46" stroke={black} strokeWidth="2.2" strokeLinecap="round" />
            <Path d="M38 54 L52 54" stroke={black} strokeWidth="2.2" strokeLinecap="round" />
            {/* Badge stamp */}
            <Circle cx="58" cy="62" r="8" fill={yellow} stroke={black} strokeWidth="2" />
            <Path d="M55 62 L57.5 64.5 L61.5 59.5" stroke={black} strokeWidth="1.8" strokeLinecap="round" />
          </G>
        )}

        {type === 'security' && (
          <G>
            {/* Shield with lock or checkmark */}
            <Path
              d="M47 20 C60 20 68 25 68 36 C68 54 55 66 47 72 C39 66 26 54 26 36 C26 25 34 20 47 20 Z"
              fill="url(#cardGrad)"
              stroke={black}
              strokeWidth="2.5"
            />
            {/* Inner Lock */}
            <Rect x="39" y="42" width="16" height="13" rx="3" fill={white} stroke={black} strokeWidth="2" />
            <Path
              d="M43 42 L43 36 C43 33.5 45 31.5 47 31.5 C49 31.5 51 33.5 51 36 L51 42"
              fill="none"
              stroke={black}
              strokeWidth="2"
            />
            <Circle cx="47" cy="48" r="2" fill={black} />
            <Circle cx="74" cy="30" r="2.5" fill={black} />
          </G>
        )}

        {type === 'location' && (
          <G>
            {/* Temple Spire / Pin Marker */}
            <Path
              d="M47 18 C35 18 26 27 26 39 C26 54 44 71 47 74 C50 71 68 54 68 39 C68 27 59 18 47 18 Z"
              fill="url(#cardGrad)"
              stroke={black}
              strokeWidth="2.5"
            />
            <Circle cx="47" cy="38" r="9" fill={white} stroke={black} strokeWidth="2.2" />
            <Path d="M47 32 L47 44 M41 38 L53 38" stroke={black} strokeWidth="2" strokeLinecap="round" />
            <Circle cx="20" cy="32" r="3" fill={lightYellow} stroke={black} strokeWidth="1.5" />
          </G>
        )}

        {type === 'bell' && (
          <G>
            {/* Ringing Bell with sound waves */}
            <Path
              d="M47 20 C42 20 38 24 38 29 L38 42 C38 46 34 50 32 54 L62 54 C60 50 56 46 56 42 L56 29 C56 24 52 20 47 20 Z"
              fill="url(#cardGrad)"
              stroke={black}
              strokeWidth="2.5"
            />
            <Circle cx="47" cy="60" r="5" fill={black} />
            <Path d="M44 20 C44 18 45.5 16 47 16 C48.5 16 50 18 50 20" stroke={black} strokeWidth="2.5" />
            {/* Sound waves */}
            <Path d="M25 36 C23 39 23 44 25 47" stroke={black} strokeWidth="2" strokeLinecap="round" />
            <Path d="M69 36 C71 39 71 44 69 47" stroke={black} strokeWidth="2" strokeLinecap="round" />
          </G>
        )}

        {type === 'link' && (
          <G>
            {/* Interlocking yellow chain links matching ref #08 */}
            <Rect
              x="26"
              y="36"
              width="26"
              height="16"
              rx="8"
              transform="rotate(-40 39 44)"
              fill="none"
              stroke={black}
              strokeWidth="4"
            />
            <Rect
              x="26"
              y="36"
              width="26"
              height="16"
              rx="8"
              transform="rotate(-40 39 44)"
              fill="url(#cardGrad)"
            />
            <Rect
              x="42"
              y="40"
              width="26"
              height="16"
              rx="8"
              transform="rotate(-40 55 48)"
              fill="none"
              stroke={black}
              strokeWidth="4"
            />
            <Rect
              x="42"
              y="40"
              width="26"
              height="16"
              rx="8"
              transform="rotate(-40 55 48)"
              fill="url(#cardGrad)"
            />
            {/* Sparkles */}
            <Circle cx="48" cy="22" r="2.5" fill={black} />
            <Circle cx="22" cy="56" r="3" fill={yellow} stroke={black} strokeWidth="1.5" />
            <Circle cx="72" cy="40" r="2" fill={black} />
          </G>
        )}

        {(type === 'info' || type === 'warning') && (
          <G>
            {/* Speech dialogue bubbles matching ref #02 */}
            <Path
              d="M30 26 C22 26 16 32 16 39 C16 43 18 47 21 49 L20 56 L27 52 C28 52 29 52 30 52 C38 52 44 46 44 39 C44 32 38 26 30 26 Z"
              fill={white}
              stroke={black}
              strokeWidth="2.5"
            />
            <Circle cx="24" cy="39" r="2" fill={black} />
            <Circle cx="30" cy="39" r="2" fill={black} />
            <Circle cx="36" cy="39" r="2" fill={black} />

            {/* Front yellow speech bubble */}
            <Path
              d="M58 36 C48 36 40 43 40 51 C40 56 43 60 47 63 L46 72 L55 67 C56 67 57 67 58 67 C68 67 76 60 76 51 C76 43 68 36 58 36 Z"
              fill="url(#cardGrad)"
              stroke={black}
              strokeWidth="2.5"
            />
            <Circle cx="51" cy="51" r="2.2" fill={black} />
            <Circle cx="58" cy="51" r="2.2" fill={black} />
            <Circle cx="65" cy="51" r="2.2" fill={black} />
          </G>
        )}
      </Svg>
    </View>
  );
};

export const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  visible,
  options,
  onClose,
}) => {
  const OFFSCREEN_OFFSET = Math.max(SCREEN_HEIGHT, 850);
  const [backdropAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(OFFSCREEN_OFFSET));

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(OFFSCREEN_OFFSET);
      backdropAnim.setValue(0);

      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 360,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }
  }, [visible, backdropAnim, slideAnim, OFFSCREEN_OFFSET]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: OFFSCREEN_OFFSET,
        duration: 240,
        easing: Easing.bezier(0.4, 0, 1, 1),
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => {
      onClose();
    });
  };

  if (!visible && !options) return null;

  const iconType = options?.icon || 'info';

  const isDismissText = (text?: string) => {
    if (!text) return true;
    const lower = text.trim().toLowerCase();
    return [
      'got it',
      'understood',
      'done',
      'close',
      'dismiss',
      'great',
      'stay signed in',
      'i understand',
      'ok',
      'okay',
      'cancel'
    ].includes(lower);
  };

  const showPrimaryAction = Boolean(options?.primaryButtonText && !isDismissText(options.primaryButtonText));
  const showSecondaryAction = Boolean(options?.secondaryButtonText && !isDismissText(options.secondaryButtonText));
  const hasActions = showPrimaryAction || showSecondaryAction;

  const handlePrimary = () => {
    if (options?.onPrimaryPress) {
      options.onPrimaryPress();
    }
    handleDismiss();
  };

  const handleSecondary = () => {
    if (options?.onSecondaryPress) {
      options.onSecondaryPress();
    }
    handleDismiss();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleDismiss}
    >
      <View style={styles.modalOverlay}>
        {/* Semi-transparent Dim Backdrop */}
        <TouchableWithoutFeedback onPress={handleDismiss}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropAnim,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Sliding Sheet Wrapper */}
        <Animated.View
          style={[
            styles.sheetWrapper,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Big Circular White Cross Button Floating Centered Above Bottom Sheet */}
          <TouchableOpacity
            style={styles.floatingCloseBtn}
            onPress={handleDismiss}
            activeOpacity={0.8}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={24} color="#111318" />
          </TouchableOpacity>

          {/* Bottom Sheet Card */}
          <View style={styles.sheetContainer}>
            {/* Top handle pill */}
            <View style={styles.dragHandleBar} />

            {/* Card matching user reference image */}
            <View style={styles.contentCard}>
            {/* Illustrated Icon Badge */}
            <View style={styles.badgeContainer}>
              <IllustratedBadge type={iconType} />
            </View>

            {/* Title */}
            <Text style={styles.sheetTitle}>{options?.title}</Text>

            {/* Subtitle / Description */}
            <Text style={[styles.sheetMessage, !hasActions && { marginBottom: 8 }]}>
              {options?.message}
            </Text>

            {/* Only render action button if it is a real custom action, NOT a close/dismiss button */}
            {hasActions && (
              <View style={styles.actionContainer}>
                {showPrimaryAction && options?.primaryButtonText && (
                  <TouchableOpacity
                    style={styles.primaryPillBtn}
                    onPress={handlePrimary}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.primaryPillText}>{options.primaryButtonText}</Text>
                  </TouchableOpacity>
                )}

                {showSecondaryAction && options?.secondaryButtonText && (
                  <TouchableOpacity
                    style={styles.secondaryPillBtn}
                    onPress={handleSecondary}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.secondaryPillText}>{options.secondaryButtonText}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.52)',
  },
  sheetWrapper: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    alignItems: 'center',
  },
  floatingCloseBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#edf0f5',
    // Flat: NO drop shadows
    shadowOpacity: 0,
    elevation: 0,
  },
  sheetContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    borderWidth: 1,
    borderColor: '#edf0f5',
    borderBottomWidth: 0,
    // Flat: NO drop shadows
    shadowOpacity: 0,
    elevation: 0,
  },
  dragHandleBar: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
    alignSelf: 'center',
    marginBottom: 14,
  },
  contentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 26,
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: 'center',
    overflow: 'hidden',
  },
  badgeContainer: {
    marginTop: 18,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeWrapper: {
    width: 94,
    height: 94,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#111318',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  sheetMessage: {
    fontSize: 13.5,
    fontFamily: Fonts.regular,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  actionContainer: {
    width: '100%',
    gap: 10,
  },
  primaryPillBtn: {
    width: '100%',
    backgroundColor: '#111318',
    borderRadius: 9999,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    // Strictly flat
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryPillText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: Fonts.semiBold,
  },
  secondaryPillBtn: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 9999,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#edf0f5',
    // Strictly flat
    shadowOpacity: 0,
    elevation: 0,
  },
  secondaryPillText: {
    color: '#475569',
    fontSize: 13.5,
    fontFamily: Fonts.medium,
  },
});
