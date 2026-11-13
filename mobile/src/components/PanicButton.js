import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import theme from '../theme/theme';
import { AlertTriangleIcon } from './SvgIcons';

const PanicButton = ({ onPress, isAlerting = false }) => {
  const handlePress = () => {
    Alert.alert(
      '// PROTOCOLO SOS CRÍTICO',
      '¿Disparar señal de auxilio a tus contactos de emergencia con ubicación satelital en vivo?',
      [
        { text: 'CANCELAR', style: 'cancel' },
        {
          text: 'DISPARAR ALERTA',
          style: 'destructive',
          onPress: onPress,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.button, isAlerting && styles.buttonAlerting]}
        onPress={handlePress}
      >
        <View style={styles.innerBox}>
          <AlertTriangleIcon
            size={22}
            color={isAlerting ? '#000000' : theme.colors.danger}
          />
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.buttonText,
                isAlerting && styles.buttonTextAlerting,
              ]}
            >
              {isAlerting ? '¡ALERTA SOS EMITIDA!' : 'BOTÓN DE PÁNICO SOS'}
            </Text>
            <Text
              style={[styles.subText, isAlerting && styles.subTextAlerting]}
            >
              {isAlerting
                ? 'TRANSMITIENDO COORDENADAS A CONTACTOS'
                : 'PULSAR PARA TRANSMITIR AUXILIO INMEDIATO'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  button: {
    width: '100%',
    backgroundColor: '#120505',
    borderWidth: 2,
    borderColor: theme.colors.danger,
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonAlerting: {
    backgroundColor: theme.colors.yellow,
    borderColor: '#000000',
  },
  innerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  buttonText: {
    fontFamily: theme.fonts.h3,
    color: theme.colors.danger,
    fontSize: 13,
    letterSpacing: 1.5,
  },
  buttonTextAlerting: {
    color: '#000000',
    fontFamily: theme.fonts.h2,
  },
  subText: {
    fontFamily: theme.fonts.body,
    color: '#737373',
    fontSize: 10,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  subTextAlerting: {
    color: '#000000',
    fontFamily: theme.fonts.bodySemiBold,
  },
});

export default PanicButton;
