import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Fonts } from '@/constants/typography';
import { useBottomSheet } from '@/context/BottomSheetContext';
import { usePortal } from '@/store/portalStore';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showBottomSheet } = useBottomSheet();
  const { setIsAuthenticated } = usePortal();

  // Authentication Flow Step: 'credentials' -> 'otp'
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');

  // Credentials State
  const [email, setEmail] = useState('partner@trip2tirupati.com');
  const [password, setPassword] = useState('partner8160#');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Focus States
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // OTP State
  const [otp, setOtp] = useState('');
  const [otpFocused, setOtpFocused] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const otpInputRef = useRef<any>(null);

  // Timer effect for OTP resend
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Handle proceed from credentials to OTP verification
  const handleProceedToOtp = () => {
    if (!email.trim() || !password.trim()) {
      showBottomSheet({
        title: 'Missing Details',
        message: 'Please enter your partner email and password to proceed.',
        icon: 'warning',
        primaryButtonText: 'Try Again'
      });
      return;
    }

    // Switch to OTP verification step
    setOtp('');
    setCountdown(45);
    setStep('otp');
    setTimeout(() => {
      otpInputRef.current?.focus();
    }, 150);
  };

  // Verify entered OTP and navigate to Home
  const handleVerifyOtp = (codeToVerify?: string) => {
    const finalCode = (codeToVerify ?? otp).trim();

    if (finalCode.length < 6) {
      showBottomSheet({
        title: 'Incomplete Code',
        message: 'Please enter the full 6-digit verification code.',
        icon: 'warning',
        primaryButtonText: 'OK'
      });
      return;
    }

    // Mark partner authenticated in portal store
    setIsAuthenticated(true);

    showBottomSheet({
      title: 'Verification Successful!',
      message: `Identity confirmed for ${email}. Welcome to Trip2Tirupati Partner Operations.`,
      icon: 'success',
      primaryButtonText: 'Open Dashboard',
      onPrimaryPress: () => {
        router.replace('/(tabs)');
      }
    });
  };

  const handleResendOtp = () => {
    setCountdown(45);
    setOtp('');
    showBottomSheet({
      title: 'New Code Dispatched',
      message: `A fresh 6-digit security code (816024) was sent to ${email}.`,
      icon: 'info',
      primaryButtonText: 'Enter Code',
      onPrimaryPress: () => {
        setTimeout(() => otpInputRef.current?.focus(), 150);
      }
    });
  };

  const handleSocialAuth = (_provider: 'Google' | 'Facebook') => {
    setOtp('');
    setCountdown(45);
    setStep('otp');
    setTimeout(() => {
      otpInputRef.current?.focus();
    }, 150);
  };

  const handleForgotPassword = () => {
    showBottomSheet({
      title: 'Reset Password',
      message: `A password reset link will be dispatched to ${email || 'your registered email address'}.`,
      icon: 'info',
      primaryButtonText: 'Send Reset Link',
      secondaryButtonText: 'Cancel'
    });
  };

  const dynamicTopInset = Math.max(insets.top, Platform.OS === 'ios' ? 44 : 20);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Top Header with Sacred Tirupati Temple Image */}
      <ImageBackground
        source={require('@/assets/images/tirupati-temple.jpg')}
        style={[styles.templeHeader, { paddingTop: dynamicTopInset }]}
        resizeMode="cover"
      >
        {/* Subtle Dark Vignette Overlay for Crisp Contrast */}
        <View style={styles.imageOverlay} />

        {/* Back Button Row */}
        <View style={styles.topBarRow}>
          <TouchableOpacity
            style={styles.backCircleBtn}
            onPress={() => {
              if (step === 'otp') {
                setStep('credentials');
              } else if (router.canGoBack()) {
                router.back();
              }
            }}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* White Block sticking to bottom with Heading, Subheading & Form inside */}
      <View style={styles.whiteBottomCard}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.cardScrollView}
            contentContainerStyle={[
              styles.cardScrollContent,
              { paddingBottom: Math.max(insets.bottom, 24) + 16 }
            ]}
            showsVerticalScrollIndicator={false}
            bounces={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Heading and Subheading inside the white block */}
            <View style={styles.headingSection}>
              {step === 'credentials' ? (
                <>
                  <Text style={styles.blockHeading}>
                    Go ahead and set up your account
                  </Text>
                  <Text style={styles.blockSubheading}>
                    Sign in to enjoy the best managing experience
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.blockHeading}>
                    Security Verification
                  </Text>
                  <Text style={styles.blockSubheading}>
                    Enter the 6-digit OTP code sent to {email || 'your registered partner email'}
                  </Text>
                </>
              )}
            </View>

            {step === 'credentials' ? (
              /* ================= CREDENTIALS STEP ================= */
              <>
                {/* Field 1: Email Address with Outside Label */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Email Address</Text>
                  <View style={[styles.inputBox, emailFocused && styles.inputBoxFocused]}>
                    <Ionicons
                      name="mail-outline"
                      size={19}
                      color={emailFocused ? '#111318' : '#94a3b8'}
                      style={styles.inputLeftIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="partner@trip2tirupati.com"
                      placeholderTextColor="#94a3b8"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                    />
                  </View>
                </View>

                {/* Field 2: Password with Outside Label */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <View style={[styles.inputBox, passwordFocused && styles.inputBoxFocused]}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={19}
                      color={passwordFocused ? '#111318' : '#94a3b8'}
                      style={styles.inputLeftIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="••••••••••••"
                      placeholderTextColor="#94a3b8"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                    />
                    <TouchableOpacity
                      style={styles.eyeToggleBtn}
                      onPress={() => setShowPassword(prev => !prev)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color="#94a3b8"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Remember Me & Forgot Password Row */}
                <View style={styles.rememberRow}>
                  <TouchableOpacity
                    style={styles.checkboxGroup}
                    onPress={() => setRememberMe(prev => !prev)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                      {rememberMe && <Ionicons name="checkmark" size={13} color="#ffffff" />}
                    </View>
                    <Text style={styles.rememberText}>Remember me</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                {/* Primary Action Button (Solid Black) */}
                <TouchableOpacity
                  style={styles.primaryAuthButton}
                  onPress={handleProceedToOtp}
                  activeOpacity={0.88}
                >
                  <Text style={styles.primaryAuthButtonText}>Login</Text>
                </TouchableOpacity>

                {/* Divider: Or login with */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>Or login with</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Social Auth Buttons (Google & Facebook) */}
                <View style={styles.socialButtonsRow}>
                  <TouchableOpacity
                    style={styles.socialBtn}
                    onPress={() => handleSocialAuth('Google')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.googleIconBox}>
                      <Svg width={20} height={20} viewBox="0 0 24 24">
                        <Path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <Path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <Path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          fill="#FBBC05"
                        />
                        <Path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          fill="#EA4335"
                        />
                      </Svg>
                    </View>
                    <Text style={styles.socialBtnText}>Google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.socialBtn}
                    onPress={() => handleSocialAuth('Facebook')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="logo-facebook" size={21} color="#1877f2" />
                    <Text style={styles.socialBtnText}>Facebook</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              /* ================= OTP VERIFICATION STEP ================= */
              <>
                {/* Prompt Instruction */}
                <Text style={styles.otpInstructionText}>
                  Please enter the 6-digit verification code below:
                </Text>

                {/* 6-Digit OTP Boxes Container */}
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => otpInputRef.current?.focus()}
                  style={styles.otpBoxesWrapper}
                >
                  {/* Invisible Native Input capturing keystrokes and SMS autofill */}
                  <TextInput
                    ref={otpInputRef}
                    style={styles.hiddenOtpInput}
                    value={otp}
                    onChangeText={text => {
                      const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
                      setOtp(cleaned);
                      if (cleaned.length === 6) {
                        handleVerifyOtp(cleaned);
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    textContentType="oneTimeCode"
                    autoFocus={true}
                    onFocus={() => setOtpFocused(true)}
                    onBlur={() => setOtpFocused(false)}
                  />

                  {/* 6 Visual Digit Boxes with Black Selection Style */}
                  <View style={styles.otpBoxesRow} pointerEvents="none">
                    {[0, 1, 2, 3, 4, 5].map(index => {
                      const char = otp[index] || '';
                      const isCurrent = otpFocused && otp.length === index;
                      const isFilled = char !== '';

                      return (
                        <View
                          key={index}
                          style={[
                            styles.otpBox,
                            isFilled && styles.otpBoxFilled,
                            isCurrent && styles.otpBoxActive,
                          ]}
                        >
                          <Text style={[styles.otpBoxChar, isFilled && styles.otpBoxCharFilled]}>
                            {char ? char : isCurrent ? '|' : '·'}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </TouchableOpacity>

                {/* Resend Code Row with Countdown */}
                <View style={styles.otpResendRow}>
                  {countdown > 0 ? (
                    <Text style={styles.otpTimerText}>
                      Resend code in{' '}
                      <Text style={styles.otpTimerHighlight}>
                        00:{countdown < 10 ? `0${countdown}` : countdown}s
                      </Text>
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleResendOtp} activeOpacity={0.7}>
                      <Text style={styles.otpResendActiveText}>
                        {"Didn't get code? "}
                        <Text style={styles.otpResendUnderline}>Resend OTP</Text>
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Primary Action Button: Solid Black */}
                <TouchableOpacity
                  style={styles.primaryAuthButton}
                  onPress={() => handleVerifyOtp()}
                  activeOpacity={0.88}
                >
                  <Text style={styles.primaryAuthButtonText}>Verify & Enter Portal</Text>
                </TouchableOpacity>

                {/* Secondary Option: Back to Login */}
                <TouchableOpacity
                  style={styles.otpBackActionBtn}
                  onPress={() => setStep('credentials')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={15} color="#111318" />
                  <Text style={styles.otpBackActionText}>Use Different Login Email</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0d14',
  },
  templeHeader: {
    height: 310,
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    zIndex: 10,
  },
  backCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  whiteBottomCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: -26,
    overflow: 'hidden',
    width: '100%',
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  cardScrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  cardScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
    maxWidth: 580,
    width: '100%',
    alignSelf: 'center',
  },
  headingSection: {
    marginBottom: 16,
  },
  blockHeading: {
    fontSize: 21,
    fontFamily: Fonts.bold,
    color: '#111318',
    lineHeight: 27,
    letterSpacing: -0.4,
  },
  blockSubheading: {
    fontSize: 12.5,
    fontFamily: Fonts.regular,
    color: '#64748b',
    lineHeight: 17,
    marginTop: 4,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontFamily: Fonts.semiBold,
    color: '#1e293b',
    marginBottom: 6,
    marginLeft: 2,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    height: 48,
  },
  inputBoxFocused: {
    borderColor: '#111318',
    backgroundColor: '#ffffff',
  },
  inputLeftIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#111318',
    padding: 0,
    margin: 0,
  },
  eyeToggleBtn: {
    padding: 6,
    marginLeft: 6,
  },
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 2,
    paddingHorizontal: 2,
  },
  checkboxGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxActive: {
    backgroundColor: '#111318',
    borderColor: '#111318',
  },
  rememberText: {
    fontSize: 12.5,
    fontFamily: Fonts.medium,
    color: '#64748b',
  },
  forgotPasswordText: {
    fontSize: 12.5,
    fontFamily: Fonts.semiBold,
    color: '#111318',
  },
  primaryAuthButton: {
    backgroundColor: '#111318',
    borderRadius: 9999,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryAuthButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: Fonts.bold,
    letterSpacing: 0.2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  dividerText: {
    fontSize: 11.5,
    fontFamily: Fonts.medium,
    color: '#94a3b8',
    marginHorizontal: 12,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  googleIconBox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtnText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: '#111318',
  },

  /* ===== OTP SPECIFIC STYLES ===== */
  otpInstructionText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  otpBoxesWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  hiddenOtpInput: {
    ...StyleSheet.absoluteFill,
    opacity: 0,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  otpBox: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: {
    borderColor: '#111318',
    backgroundColor: '#ffffff',
  },
  otpBoxActive: {
    borderColor: '#111318',
    borderWidth: 2,
    backgroundColor: '#ffffff',
  },
  otpBoxChar: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#94a3b8',
  },
  otpBoxCharFilled: {
    color: '#111318',
  },
  otpResendRow: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 2,
  },
  otpTimerText: {
    fontSize: 12.5,
    fontFamily: Fonts.regular,
    color: '#94a3b8',
  },
  otpTimerHighlight: {
    fontFamily: Fonts.semiBold,
    color: '#111318',
  },
  otpResendActiveText: {
    fontSize: 12.5,
    fontFamily: Fonts.medium,
    color: '#64748b',
  },
  otpResendUnderline: {
    fontFamily: Fonts.bold,
    color: '#111318',
    textDecorationLine: 'underline',
  },
  otpBackActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    marginTop: 6,
  },
  otpBackActionText: {
    fontSize: 12.5,
    fontFamily: Fonts.semiBold,
    color: '#111318',
  },
});
