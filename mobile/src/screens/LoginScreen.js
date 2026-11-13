import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import theme from '../theme/theme';
import AnimatedFadeSlide from '../components/AnimatedFadeSlide';
import Geometric3DBackground from '../components/Geometric3DBackground';
import { ArrowRightIcon, LockIcon, MailIcon } from '../components/SvgIcons';
import GoogleSignInButton from '../components/GoogleSignInButton';

const showLoginMessage = (title, message) => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') window.alert(`${title}\n${message}`);
  else Alert.alert(title, message);
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      showLoginMessage('// ATENCIÓN', 'Por favor ingresá tu correo y contraseña.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      showLoginMessage('// ACCESO DENEGADO', result.message);
    }
  };

  const handleGoogleCredential = async (idToken) => {
    const result = await loginWithGoogle(idToken);
    if (!result.success) showLoginMessage('// ACCESO DENEGADO', result.message);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 3D Volumetric Wireframe en el fondo */}
      <View style={styles.background3D}>
        <Geometric3DBackground
          height={320}
          color={theme.colors.yellow}
          secondaryColor="#FFFFFF"
          speed={0.009}
          opacity={0.4}
        />
      </View>

      <AnimatedFadeSlide direction="up" duration={500} style={styles.contentWrap}>
        <View style={styles.headerContainer}>
          <Image
            source={require('../../assets/rutex/icon.png')}
            style={styles.brandLogo}
            resizeMode="contain"
            accessibilityLabel="Escudo de Rutex"
          />
          <Text style={styles.title}>RUTEX</Text>
          <AnimatedFadeSlide direction="up" delay={180} duration={650}>
            <Text style={styles.subtitle}>BIENVENIDOS</Text>
          </AnimatedFadeSlide>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
            <View style={styles.inputWrap}>
              <MailIcon size={16} color="#737373" />
              <TextInput
                style={styles.input}
                placeholder="operador@rutex.com"
                placeholderTextColor="#525252"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CONTRASEÑA</Text>
            <View style={styles.inputWrap}>
              <LockIcon size={16} color="#737373" />
              <TextInput
                style={styles.input}
                placeholder="••••••••••••"
                placeholderTextColor="#525252"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>INGRESAR AL SISTEMA</Text>
                <ArrowRightIcon size={18} color="#000000" />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.separatorRow}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>O CONTINUÁ CON</Text>
            <View style={styles.separatorLine} />
          </View>

          <GoogleSignInButton
            onCredential={handleGoogleCredential}
          />

          <View style={styles.footerLink}>
            <Text style={styles.footerText}>¿NO POSEES CUENTA? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>REGÍSTRATE AQUÍ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AnimatedFadeSlide>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
  },
  background3D: {
    position: 'absolute',
    top: '12%',
    left: 0,
    right: 0,
    alignItems: 'center',
    opacity: 0.5,
    zIndex: 1,
  },
  contentWrap: {
    zIndex: 2,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 14,
  },
  title: {
    fontFamily: theme.fonts.h1,
    fontSize: 24,
    color: '#FFFFFF',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 18,
    color: theme.colors.yellow,
    letterSpacing: 1.5,
    marginTop: 6,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#0A0A0A',
    borderWidth: 2,
    borderColor: '#262626',
    padding: 22,
    elevation: 0,
    shadowOpacity: 0,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    color: '#A3A3A3',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: '#262626',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    color: '#FFFFFF',
    fontFamily: theme.fonts.bodySemiBold,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: theme.colors.yellow,
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    elevation: 0,
    shadowOpacity: 0,
  },
  loginButtonText: {
    fontFamily: theme.fonts.bodyBold,
    color: '#000000',
    fontSize: 12,
    letterSpacing: 1.5,
  },
  separatorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20 },
  separatorLine: { flex: 1, height: 1, backgroundColor: '#262626' },
  separatorText: { color: '#737373', fontFamily: theme.fonts.bodyBold, fontSize: 9, letterSpacing: 1 },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
    paddingTop: 16,
  },
  footerText: {
    fontFamily: theme.fonts.body,
    color: '#737373',
    fontSize: 12,
  },
  registerLink: {
    fontFamily: theme.fonts.bodyBold,
    color: theme.colors.yellow,
    fontSize: 12,
    letterSpacing: 0.5,
  },
});

export default LoginScreen;
