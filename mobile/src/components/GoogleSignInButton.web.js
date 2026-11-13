import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import theme from '../theme/theme';

const GoogleSignInButton = ({ onCredential }) => {
  const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const [googleReady, setGoogleReady] = useState(false);
  const buttonHost = useRef(null);
  const callbackRef = useRef(onCredential);

  useEffect(() => {
    callbackRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!clientId || typeof document === 'undefined') return undefined;

    const renderGoogleButton = () => {
      const googleIdentity = window.google?.accounts?.id;
      if (!googleIdentity || !buttonHost.current) return;
      googleIdentity.initialize({
        client_id: clientId,
        callback: ({ credential }) => {
          if (credential) callbackRef.current?.(credential);
        },
      });
      googleIdentity.renderButton(buttonHost.current, {
        theme: 'filled_black',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: Math.min(buttonHost.current.clientWidth || 360, 396),
      });
      setGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return undefined;
    }

    let script = document.querySelector('script[data-rutex-google-identity]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.dataset.rutexGoogleIdentity = 'true';
      document.head.appendChild(script);
    }
    script.addEventListener('load', renderGoogleButton);
    return () => script.removeEventListener('load', renderGoogleButton);
  }, [clientId]);

  if (!clientId) {
    return (
      <TouchableOpacity
        onPress={() => window.alert('Configurá EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID para habilitar el acceso con Google.')}
        style={styles.unconfiguredButton}
        activeOpacity={0.85}
      >
        <Text style={styles.googleG}>G</Text>
        <Text style={styles.buttonText}>CONTINUAR CON GOOGLE</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.buttonWrap}>
      <View ref={buttonHost} style={styles.buttonHost} />
      {!googleReady && (
        <View style={styles.loading}>
          <ActivityIndicator color={theme.colors.yellow} />
        </View>
      )}
    </View>
  );
};

const styles = {
  buttonWrap: { height: 48, marginTop: 14, position: 'relative' },
  buttonHost: { width: '100%', minHeight: 48, alignItems: 'center' },
  loading: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111111' },
  unconfiguredButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#111111', borderWidth: 1.5, borderColor: '#3A3A3A', paddingVertical: 13, marginTop: 14 },
  googleG: { color: '#FFFFFF', fontFamily: theme.fonts.h1, fontSize: 17 },
  buttonText: { color: '#FFFFFF', fontFamily: theme.fonts.bodyBold, fontSize: 11, letterSpacing: 1 },
};

export default GoogleSignInButton;
