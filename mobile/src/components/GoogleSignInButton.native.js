import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Text, TouchableOpacity } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import theme from '../theme/theme';

WebBrowser.maybeCompleteAuthSession();

const GoogleSignInButton = ({ onCredential }) => {
  const [loading, setLoading] = useState(false);
  const onCredentialRef = useRef(onCredential);
  useEffect(() => { onCredentialRef.current = onCredential; }, [onCredential]);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'GOOGLE_CLIENT_ID_NOT_CONFIGURED',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'GOOGLE_CLIENT_ID_NOT_CONFIGURED',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'GOOGLE_CLIENT_ID_NOT_CONFIGURED',
    scopes: ['openid', 'profile', 'email'],
    selectAccount: true,
  }, { scheme: 'rutex', path: 'oauthredirect' });

  useEffect(() => {
    if (!response || response.type !== 'success') return;
    const idToken = response.params?.id_token || response.authentication?.idToken;
    if (!idToken) {
      Alert.alert('// ERROR GOOGLE', 'Google no devolvió un token de identidad.');
      return;
    }
    setLoading(true);
    Promise.resolve(onCredentialRef.current(idToken)).finally(() => setLoading(false));
  }, [response]);

  const configuredClientId = Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
    : process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.disabled]}
      onPress={() => {
        if (!configuredClientId) {
          Alert.alert('// GOOGLE NO CONFIGURADO', 'Configurá el Client ID OAuth de Google para esta plataforma.');
          return;
        }
        if (request) promptAsync();
      }}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.googleG}>G</Text>}
      <Text style={styles.buttonText}>{loading ? 'CONECTANDO…' : 'CONTINUAR CON GOOGLE'}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#111111', borderWidth: 1.5, borderColor: '#3A3A3A', paddingVertical: 13, marginTop: 14 },
  disabled: { opacity: 0.55 },
  googleG: { color: '#FFFFFF', fontFamily: theme.fonts.h1, fontSize: 17 },
  buttonText: { color: '#FFFFFF', fontFamily: theme.fonts.bodyBold, fontSize: 11, letterSpacing: 1 },
};

export default GoogleSignInButton;
