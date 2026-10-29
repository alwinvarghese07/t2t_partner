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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Defs, LinearGradient, Stop, Pattern } from 'react-native-svg';
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
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Credentials State
  const [email, setEmail] = useState('partner@trip2tirupati.com');
  const [password, setPassword] = useState('partner8160#');
  const [fullName, setFullName] = useState('Annamaiah Reddy');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Focus States
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

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
    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        showBottomSheet({
          title: 'Missing Details',
          message: 'Please enter your partner email and password to proceed.',
          icon: 'warning',
          primaryButtonText: 'Try Again'
        });
        return;
      }
    } else {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        showBottomSheet({
          title: 'Required Information',
          message: 'Please complete all fields to register your property account.',
          icon: 'warning',
          primaryButtonText: 'OK'
        });
        return;
      }
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

  const handleDemoOtpFill = () => {
    setOtp('816024');
    handleVerifyOtp('816024');
  };

  const handleSocialAuth = (provider: 'Google' | 'Facebook') => {
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

  const handleDemoCredentialsFill = () => {
    setEmail('partner@trip2tirupati.com');
    setPassword('partner8160#');
    setRememberMe(true);
  };

  const dynamicTopInset = Math.max(insets.top, Platform.OS === 'ios' ? 44 : 20);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Top Dark Hero Background */}
      <View style={[styles.darkHeaderWrapper, { paddingTop: dynamicTopInset }]}>
        {/* Subtle geometric pattern in background */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id="darkGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#111622" />
                <Stop offset="50%" stopColor="#0d111a" />
                <Stop offset="100%" stopColor="#080a10" />
              </LinearGradient>
              <Pattern id="tiles" width="40" height="40" patternUnits="userSpaceOnUse">
                <Rect x="0" y="0" width="38" height="38" fill="rgba(255,255,255,0.015)" rx="4" />
              </Pattern>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#darkGrad)" />
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#tiles)" />
          </Svg>
        </View>

        {/* Back Button */}
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

        {/* Headline Titles */}
        <View style={styles.heroTextContainer}>
          {step === 'credentials' ? (
            <>
              <Text style={styles.heroMainTitle}>
                Go ahead and set up{'\n'}your account
              </Text>
              <Text style={styles.heroSubtitle}>
                {mode === 'login'
                  ? 'Sign in to enjoy the best managing experience'
                  : 'Register to manage your rooms, packages & pilgrim services'}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.heroMainTitle}>
                Security{'\n'}Verification
              </Text>
              <Text style={styles.heroSubtitle}>
                Enter the 6-digit OTP code sent to your registered partner email
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Floating White Card Form Container */}
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
          <View style={styles.whiteCard}>
            {step === 'credentials' ? (
              /* ================= CREDENTIALS STEP ================= */
              <>
                {/* Segmented Pill (Login | Register) */}
                <View style={styles.segmentContainer}>
                  <TouchableOpacity
                    style={[styles.segmentBtn, mode === 'login' && styles.segmentBtnActive]}
                    onPress={() => setMode('login')}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.segmentText, mode === 'login' && styles.segmentTextActive]}>
                      Login
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.segmentBtn, mode === 'register' && styles.segmentBtnActive]}
                    onPress={() => setMode('register')}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.segmentText, mode === 'register' && styles.segmentTextActive]}>
                      Register
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* If Register mode, show Name & Phone */}
                {mode === 'register' && (
                  <>
                    <View style={[styles.inputBox, nameFocused && styles.inputBoxFocused]}>
                      <View style={styles.inputIconWrapper}>
                        <Ionicons name="person-outline" size={20} color="#5f876f" />
                      </View>
                      <View style={styles.inputTextGroup}>
                        <Text style={styles.inputMiniLabel}>Full Name / Property Admin</Text>
                        <TextInput
                          style={styles.textInput}
                          value={fullName}
                          onChangeText={setFullName}
                          placeholder="e.g. Annamaiah Reddy"
                          placeholderTextColor="#94a3b8"
                          onFocus={() => setNameFocused(true)}
                          onBlur={() => setNameFocused(false)}
                          autoCapitalize="words"
                        />
                      </View>
                    </View>

                    <View style={[styles.inputBox, phoneFocused && styles.inputBoxFocused]}>
                      <View style={styles.inputIconWrapper}>
                        <Ionicons name="call-outline" size={20} color="#5f876f" />
                      </View>
                      <View style={styles.inputTextGroup}>
                        <Text style={styles.inputMiniLabel}>Phone Number</Text>
                        <TextInput
                          style={styles.textInput}
                          value={phone}
                          onChangeText={setPhone}
                          placeholder="+91 98765 43210"
                          placeholderTextColor="#94a3b8"
                          keyboardType="phone-pad"
                          onFocus={() => setPhoneFocused(true)}
                          onBlur={() => setPhoneFocused(false)}
                        />
                      </View>
                    </View>
                  </>
                )}

                {/* Email Address Input */}
                <View style={[styles.inputBox, emailFocused && styles.inputBoxFocused]}>
                  <View style={styles.inputIconWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#5f876f" />
                  </View>
                  <View style={styles.inputTextGroup}>
                    <Text style={styles.inputMiniLabel}>Email Address</Text>
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

                {/* Password Input */}
                <View style={[styles.inputBox, passwordFocused && styles.inputBoxFocused]}>
                  <View style={styles.inputIconWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="#5f876f" />
                  </View>
                  <View style={styles.inputTextGroup}>
                    <Text style={styles.inputMiniLabel}>Password</Text>
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
                  </View>
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

                  {mode === 'login' && (
                    <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                      <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Primary Action Button -> Switches to OTP verification */}
                <TouchableOpacity
                  style={styles.primaryAuthButton}
                  onPress={handleProceedToOtp}
                  activeOpacity={0.88}
                >
                  <Text style={styles.primaryAuthButtonText}>
                    {mode === 'login' ? 'Login' : 'Create Account'}
                  </Text>
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

                {/* 1-Tap Demo Credentials Helper */}
                <TouchableOpacity
                  style={styles.demoFillPill}
                  onPress={handleDemoCredentialsFill}
                  activeOpacity={0.7}
                >
                  <Ionicons name="sparkles" size={13} color="#5f876f" />
                  <Text style={styles.demoFillText}>Auto-fill Verified Partner Credentials</Text>
                </TouchableOpacity>
              </>
            ) : (
              /* ================= OTP VERIFICATION STEP ================= */
              <>
                {/* 2-Step Verification Header Pill */}
                <View style={styles.otpBadgeContainer}>
                  <View style={styles.otpBadge}>
                    <Ionicons name="shield-checkmark" size={14} color="#059669" />
                    <Text style={styles.otpBadgeText}>2-Step Security Verification</Text>
                  </View>
                </View>

                {/* Recipient Info Card with Quick Change button */}
                <View style={styles.otpRecipientCard}>
                  <View style={styles.otpRecipientLeft}>
                    <View style={styles.otpRecipientIconBox}>
                      <Ionicons name="mail" size={18} color="#5f876f" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.otpRecipientLabel}>Code Sent To</Text>
                      <Text style={styles.otpRecipientEmail} numberOfLines={1}>
                        {email || 'partner@trip2tirupati.com'}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.otpChangeBtn}
                    onPress={() => setStep('credentials')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.otpChangeBtnText}>Change</Text>
                  </TouchableOpacity>
                </View>

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

                  {/* 6 Visual Digit Boxes */}
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

                {/* Primary Action Button: Verify & Go to Home */}
                <TouchableOpacity
                  style={styles.primaryAuthButton}
                  onPress={() => handleVerifyOtp()}
                  activeOpacity={0.88}
                >
                  <Text style={styles.primaryAuthButtonText}>Verify & Enter Portal</Text>
                </TouchableOpacity>

                {/* 1-Tap Demo OTP Auto-fill */}
                <TouchableOpacity
                  style={styles.demoFillPill}
                  onPress={handleDemoOtpFill}
                  activeOpacity={0.7}
                >
                  <Ionicons name="sparkles" size={13} color="#5f876f" />
                  <Text style={styles.demoFillText}>Auto-fill Demo Code (816024)</Text>
                </TouchableOpacity>

                {/* Secondary Option: Back to Login */}
                <TouchableOpacity
                  style={styles.otpBackActionBtn}
                  onPress={() => setStep('credentials')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={15} color="#64748b" />
                  <Text style={styles.otpBackActionText}>Use Different Login Email</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Bottom Footer Note */}
            <Text style={styles.footerLegal}>
              Trip2Tirupati Partner Network · AP-TPT-8160 Secure Authentication
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0d14',
  },
  darkHeaderWrapper: {
    backgroundColor: '#0a0d14',
    paddingHorizontal: 22,
    paddingBottom: 26,
    position: 'relative',
    overflow: 'hidden',
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  backCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroTextContainer: {
    gap: 8,
  },
  heroMainTitle: {
    fontSize: 27,
    fontFamily: Fonts.bold,
    color: '#ffffff',
    lineHeight: 33,
    letterSpacing: -0.6,
  },
  heroSubtitle: {
    fontSize: 13.5,
    fontFamily: Fonts.regular,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 19,
    marginTop: 2,
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#0a0d14',
  },
  cardScrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cardScrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  whiteCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 22,
    paddingTop: 24,
    maxWidth: 580,
    width: '100%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowOpacity: 0,
    elevation: 0,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 9999,
    padding: 4,
    marginBottom: 20,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  segmentBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  segmentText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#94a3b8',
  },
  segmentTextActive: {
    fontFamily: Fonts.bold,
    color: '#111318',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#eef2f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 14,
  },
  inputBoxFocused: {
    borderColor: '#5f876f',
    backgroundColor: '#fafcfb',
  },
  inputIconWrapper: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputTextGroup: {
    flex: 1,
    marginLeft: 10,
  },
  inputMiniLabel: {
    fontSize: 10.5,
    fontFamily: Fonts.medium,
    color: '#94a3b8',
    marginBottom: 2,
  },
  textInput: {
    fontSize: 14.5,
    fontFamily: Fonts.semiBold,
    color: '#111318',
    padding: 0,
    margin: 0,
  },
  eyeToggleBtn: {
    padding: 4,
    marginLeft: 8,
  },
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
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
    backgroundColor: '#5f876f',
    borderColor: '#5f876f',
  },
  rememberText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: '#64748b',
  },
  forgotPasswordText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: '#5f876f',
  },
  primaryAuthButton: {
    backgroundColor: '#5f876f',
    borderRadius: 9999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryAuthButtonText: {
    color: '#ffffff',
    fontSize: 15.5,
    fontFamily: Fonts.bold,
    letterSpacing: 0.2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  dividerText: {
    fontSize: 12,
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
    paddingVertical: 13,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#eef2f6',
    backgroundColor: '#ffffff',
  },
  googleIconBox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtnText: {
    fontSize: 13.5,
    fontFamily: Fonts.semiBold,
    color: '#111318',
  },
  demoFillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#dcfce7',
    borderRadius: 9999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 18,
    alignSelf: 'center',
  },
  demoFillText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: '#15803d',
  },
  footerLegal: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 18,
    lineHeight: 16,
  },

  /* ===== OTP SPECIFIC STYLES ===== */
  otpBadgeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  otpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  otpBadgeText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: '#059669',
  },
  otpRecipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 18,
  },
  otpRecipientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  otpRecipientIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  otpRecipientLabel: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  otpRecipientEmail: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: '#111318',
    marginTop: 1,
  },
  otpChangeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  otpChangeBtnText: {
    fontSize: 11.5,
    fontFamily: Fonts.semiBold,
    color: '#5f876f',
  },
  otpInstructionText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  otpBoxesWrapper: {
    position: 'relative',
    marginBottom: 16,
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
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: {
    borderColor: '#5f876f',
    backgroundColor: '#ffffff',
  },
  otpBoxActive: {
    borderColor: '#5f876f',
    backgroundColor: '#f4f8f5',
  },
  otpBoxChar: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: '#94a3b8',
  },
  otpBoxCharFilled: {
    color: '#111318',
  },
  otpResendRow: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  otpTimerText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: '#94a3b8',
  },
  otpTimerHighlight: {
    fontFamily: Fonts.semiBold,
    color: '#5f876f',
  },
  otpResendActiveText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: '#64748b',
  },
  otpResendUnderline: {
    fontFamily: Fonts.bold,
    color: '#5f876f',
    textDecorationLine: 'underline',
  },
  otpBackActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginTop: 8,
  },
  otpBackActionText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: '#64748b',
  },
});
