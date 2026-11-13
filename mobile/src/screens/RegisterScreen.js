import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import theme from '../theme/theme';
import AnimatedFadeSlide from '../components/AnimatedFadeSlide';
import Geometric3DBackground from '../components/Geometric3DBackground';
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  LockIcon,
  ArrowRightIcon,
} from '../components/SvgIcons';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert('// INCOMPLETO', 'Por favor completa todos los campos del registro.');
      return;
    }

    const normalizedName = name.trim();
    if (normalizedName.length < 2 || normalizedName.length > 50 || !/^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(normalizedName)) {
      Alert.alert('// NOMBRE INVÁLIDO', 'Usá entre 2 y 50 letras. Se permiten espacios, apóstrofes y guiones.');
      return;
    }

    if (password.length < 8 || password.length > 64 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9\s]/.test(password)) {
      Alert.alert('// SEGURIDAD', 'La contraseña requiere 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.');
      return;
    }

    setLoading(true);
    const result = await register({
      name: normalizedName,
      email: email.trim(),
      phone: phone.trim(),
      password,
    });
    setLoading(false);

    if (!result.success) {
      Alert.alert('// ERROR DE REGISTRO', result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Fondo 3D Volumétrico */}
      <View style={styles.background3D}>
        <Geometric3DBackground
          height={320}
          color={theme.colors.yellow}
          secondaryColor="#FFFFFF"
          speed={0.008}
          opacity={0.35}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedFadeSlide direction="up" duration={500} style={styles.contentWrap}>
          <View style={styles.headerContainer}>
            <Image
              source={require('../../assets/rutex/icon.png')}
              style={styles.brandLogo}
              resizeMode="contain"
              accessibilityLabel="Escudo de Rutex"
            />
            <Text style={styles.title}>ALTA DE CIUDADANO</Text>
            <Text style={styles.subtitle}>
              [NODO VECINAL] // INCORPORACIÓN A LA RED DE DEFENSA
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
            <Text style={styles.label}>NOMBRE DE USUARIO</Text>
              <View style={styles.inputWrap}>
                <UserIcon size={16} color="#737373" />
              <TextInput
                  style={styles.input}
                  placeholder="JUAN PÉREZ"
                  placeholderTextColor="#525252"
                  value={name}
                onChangeText={(value) => setName(value.replace(/[^\p{L}\p{M} '\u2019-]/gu, '').replace(/\s+/g, ' '))}
                maxLength={50}
                autoCapitalize="words"
                autoCorrect={false}
                />
              </View>
            <Text style={styles.passwordHint}>Solo letras, espacios, apóstrofes y guiones (2 a 50 caracteres).</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
              <View style={styles.inputWrap}>
                <MailIcon size={16} color="#737373" />
                <TextInput
                  style={styles.input}
                  placeholder="juan@rutex.com"
                  placeholderTextColor="#525252"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>TELÉFONO DE CONTACTO</Text>
              <View style={styles.inputWrap}>
                <PhoneIcon size={16} color="#737373" />
                <TextInput
                  style={styles.input}
                  placeholder="+54 9 11 1234-5678"
                  placeholderTextColor="#525252"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
            <Text style={styles.label}>CONTRASEÑA SEGURA</Text>
              <View style={styles.inputWrap}>
                <LockIcon size={16} color="#737373" />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••••••"
                  placeholderTextColor="#525252"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                maxLength={64}
                autoCapitalize="none"
                autoCorrect={false}
                />
              </View>
            <Text style={styles.passwordHint}>8+ caracteres · mayúscula · minúscula · número · símbolo</Text>
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <>
                  <Text style={styles.registerButtonText}>CREAR CUENTA</Text>
                  <ArrowRightIcon size={18} color="#000000" />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.footerLink}>
              <Text style={styles.footerText}>¿YA ESTÁS REGISTRADO? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>INICIAR SESIÓN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </AnimatedFadeSlide>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
  },
  background3D: {
    position: 'absolute',
    top: '8%',
    left: 0,
    right: 0,
    alignItems: 'center',
    opacity: 0.35,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingVertical: 50,
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
    fontSize: 10,
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
  passwordHint: {
    color: '#737373',
    fontFamily: theme.fonts.body,
    fontSize: 10,
    marginTop: 7,
    lineHeight: 15,
  },
  registerButton: {
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
  registerButtonText: {
    fontFamily: theme.fonts.bodyBold,
    color: '#000000',
    fontSize: 12,
    letterSpacing: 1.5,
  },
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
  loginLink: {
    fontFamily: theme.fonts.bodyBold,
    color: theme.colors.yellow,
    fontSize: 12,
    letterSpacing: 0.5,
  },
});

export default RegisterScreen;
