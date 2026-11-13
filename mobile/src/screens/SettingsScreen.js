import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import theme from '../theme/theme';
import AnimatedFadeSlide from '../components/AnimatedFadeSlide';
import {
  UserIcon,
  AlertTriangleIcon,
  CompassIcon,
  LockIcon,
  BellIcon,
  ChevronRightIcon,
  LogoutIcon,
  CrossIcon,
} from '../components/SvgIcons';

const SettingsScreen = ({ navigation }) => {
  const { user, logout, updateProfileAndSettings } = useAuth();

  // Estados de perfil
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Estados de configuración de seguridad
  const [sosCountdown, setSosCountdown] = useState(user?.settings?.sosCountdown ?? 3);
  const [soundAlerts, setSoundAlerts] = useState(user?.settings?.soundAlerts ?? true);
  const [vibration, setVibration] = useState(user?.settings?.vibration ?? true);
  const [autoNotifyContacts, setAutoNotifyContacts] = useState(
    user?.settings?.autoNotifyContacts ?? true
  );

  // Estados de mapa e incidencias
  const [incidentRadius, setIncidentRadius] = useState(
    user?.settings?.incidentRadius ?? 5
  );
  const [proximitySound, setProximitySound] = useState(
    user?.settings?.proximitySound ?? true
  );
  const [mapType, setMapType] = useState(user?.settings?.mapType || 'standard');

  // Estados de privacidad
  const [shareLocationOnlyOnActiveRoute, setShareLocationOnlyOnActiveRoute] =
    useState(user?.settings?.shareLocationOnlyOnActiveRoute ?? true);
  const [highAccuracyLocation, setHighAccuracyLocation] = useState(
    user?.settings?.highAccuracyLocation ?? true
  );

  // Estados de notificaciones
  const [incidentPushAlerts, setIncidentPushAlerts] = useState(
    user?.settings?.incidentPushAlerts ?? true
  );
  const [routeEndReminder, setRouteEndReminder] = useState(
    user?.settings?.routeEndReminder ?? true
  );

  // Modales informativos
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem('@rutex_settings');
        if (storedSettings) {
          const parsed = JSON.parse(storedSettings);
          if (parsed.sosCountdown !== undefined) setSosCountdown(parsed.sosCountdown);
          if (parsed.soundAlerts !== undefined) setSoundAlerts(parsed.soundAlerts);
          if (parsed.vibration !== undefined) setVibration(parsed.vibration);
          if (parsed.incidentRadius !== undefined) setIncidentRadius(parsed.incidentRadius);
          if (parsed.mapType !== undefined) setMapType(parsed.mapType);
          if (parsed.shareLocationOnlyOnActiveRoute !== undefined)
            setShareLocationOnlyOnActiveRoute(parsed.shareLocationOnlyOnActiveRoute);
          if (parsed.highAccuracyLocation !== undefined)
            setHighAccuracyLocation(parsed.highAccuracyLocation);
        }
      } catch (e) {
        console.warn('Error cargando settings:', e);
      }
    };
    loadSettings();
  }, []);

  const handleSaveProfile = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('// ATENCIÓN', 'Nombre y teléfono no pueden estar vacíos.');
      return;
    }

    try {
      setSavingProfile(true);
      const res = await updateProfileAndSettings({
        name: name.trim(),
        phone: phone.trim(),
      });
      if (res?.success) {
        Alert.alert('// CONFIRMADO', 'Datos de perfil sincronizados correctamente.');
      }
    } catch (err) {
      Alert.alert('// ERROR', 'No se pudo actualizar el perfil en el servidor.');
    } finally {
      setSavingProfile(false);
    }
  };

  const saveSetting = async (key, value) => {
    try {
      const currentStored = await AsyncStorage.getItem('@rutex_settings');
      const settingsObj = currentStored ? JSON.parse(currentStored) : {};
      settingsObj[key] = value;
      await AsyncStorage.setItem('@rutex_settings', JSON.stringify(settingsObj));

      updateProfileAndSettings({
        settings: settingsObj,
      });
    } catch (e) {
      console.warn('Error guardando ajuste:', key, e);
    }
  };

  const handleCountdownChange = (seconds) => {
    setSosCountdown(seconds);
    saveSetting('sosCountdown', seconds);
  };

  const handleRadiusChange = (km) => {
    setIncidentRadius(km);
    saveSetting('incidentRadius', km);
  };

  const handleMapTypeChange = (type) => {
    setMapType(type);
    saveSetting('mapType', type);
  };

  const handleClearCache = async () => {
    Alert.alert(
      '// PURGAR CACHÉ',
      '¿Deseas restablecer los parámetros locales y datos temporales del mapa?',
      [
        { text: 'CANCELAR', style: 'cancel' },
        {
          text: 'PURGAR',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@rutex_settings');
              Alert.alert('// LISTO', 'Memoria temporal purgada.');
            } catch (e) {
              Alert.alert('// ERROR', 'Fallo al purgar caché.');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Título Brutalista */}
      <AnimatedFadeSlide direction="down" duration={400}>
        <View style={styles.header}>
          <Text style={styles.headerTag}>[AJUSTES] // SISTEMA</Text>
          <Text style={styles.headerTitle}>CONFIGURACIONES</Text>
          <Text style={styles.headerSubtitle}>
            Parámetros operativos de seguridad, telemetría y privacidad.
          </Text>
        </View>
      </AnimatedFadeSlide>

      {/* Bloque 1: Perfil de Usuario */}
      <AnimatedFadeSlide delay={100} duration={450}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <UserIcon size={18} color={theme.colors.yellow} />
              <Text style={styles.cardTitle}>01 // IDENTIDAD</Text>
            </View>
            <View style={styles.badgeActive}>
              <Text style={styles.badgeActiveText}>VERIFICADO</Text>
            </View>
          </View>

          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={styles.profileMeta}>
              <Text style={styles.metaLabel}>ID DE CUENTA (SOLO LECTURA)</Text>
              <Text style={styles.metaEmail}>{user?.email || 'usuario@rutex.com'}</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>NOMBRE COMPLETO</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="NOMBRE"
              placeholderTextColor="#525252"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>TELÉFONO DE CONTACTO</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+54 9 11..."
              placeholderTextColor="#525252"
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity
            style={styles.btnPrimaryYellow}
            onPress={handleSaveProfile}
            disabled={savingProfile}
            activeOpacity={0.85}
          >
            {savingProfile ? (
              <ActivityIndicator color="#000000" size="small" />
            ) : (
              <Text style={styles.btnPrimaryYellowText}>GUARDAR PERFIL</Text>
            )}
          </TouchableOpacity>
        </View>
      </AnimatedFadeSlide>

      {/* Bloque 2: Alertas y Botón SOS */}
      <AnimatedFadeSlide delay={180} duration={450}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <AlertTriangleIcon size={18} color={theme.colors.danger} />
              <Text style={styles.cardTitle}>02 // PROTOCOLO DE PÁNICO SOS</Text>
            </View>
            <View style={styles.badgeCritical}>
              <Text style={styles.badgeCriticalText}>CRÍTICO</Text>
            </View>
          </View>

          <Text style={styles.groupLabel}>CUENTA REGRESIVA ANTES DEL DISPARO:</Text>
          <View style={styles.buttonSelector}>
            {[
              { val: 0, label: '0s INMEDIATO' },
              { val: 3, label: '3s ESTÁNDAR' },
              { val: 5, label: '5s SEGURO' },
            ].map((item) => (
              <TouchableOpacity
                key={item.val}
                style={[
                  styles.selectorBtn,
                  sosCountdown === item.val && styles.selectorBtnActive,
                ]}
                onPress={() => handleCountdownChange(item.val)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.selectorBtnText,
                    sosCountdown === item.val && styles.selectorBtnTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchMeta}>
              <Text style={styles.switchTitle}>SIRENA ACÚSTICA DE DISUASIÓN</Text>
              <Text style={styles.switchDesc}>
                Emite audio de alta frecuencia para repeler amenazas.
              </Text>
            </View>
            <Switch
              value={soundAlerts}
              onValueChange={(val) => {
                setSoundAlerts(val);
                saveSetting('soundAlerts', val);
              }}
              trackColor={{ false: '#262626', true: theme.colors.yellow }}
              thumbColor={soundAlerts ? '#000000' : '#737373'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchMeta}>
              <Text style={styles.switchTitle}>VIBRACIÓN HÁPTICA CONTINUA</Text>
              <Text style={styles.switchDesc}>
                Respuesta física al confirmar transmisión de auxilio.
              </Text>
            </View>
            <Switch
              value={vibration}
              onValueChange={(val) => {
                setVibration(val);
                saveSetting('vibration', val);
              }}
              trackColor={{ false: '#262626', true: theme.colors.yellow }}
              thumbColor={vibration ? '#000000' : '#737373'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchMeta}>
              <Text style={styles.switchTitle}>AVISO AUTOMÁTICO A CONTACTOS</Text>
              <Text style={styles.switchDesc}>
                Envío inmediato de coordenadas a tu círculo prioritario.
              </Text>
            </View>
            <Switch
              value={autoNotifyContacts}
              onValueChange={(val) => {
                setAutoNotifyContacts(val);
                saveSetting('autoNotifyContacts', val);
              }}
              trackColor={{ false: '#262626', true: theme.colors.yellow }}
              thumbColor={autoNotifyContacts ? '#000000' : '#737373'}
            />
          </View>
        </View>
      </AnimatedFadeSlide>

      {/* Bloque 3: Mapa y Radar de Incidencias */}
      <AnimatedFadeSlide delay={240} duration={450}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <CompassIcon size={18} color={theme.colors.yellow} />
              <Text style={styles.cardTitle}>03 // RADAR DE INCIDENCIAS</Text>
            </View>
          </View>

          <Text style={styles.groupLabel}>RADIO DE DETECCIÓN GEOESPACIAL:</Text>
          <View style={styles.buttonSelector}>
            {[
              { km: 1, label: '1 KM' },
              { km: 3, label: '3 KM' },
              { km: 5, label: '5 KM' },
              { km: 10, label: '10 KM' },
            ].map((item) => (
              <TouchableOpacity
                key={item.km}
                style={[
                  styles.selectorBtn,
                  incidentRadius === item.km && styles.selectorBtnActive,
                ]}
                onPress={() => handleRadiusChange(item.km)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.selectorBtnText,
                    incidentRadius === item.km && styles.selectorBtnTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchMeta}>
              <Text style={styles.switchTitle}>BEEP DE PROXIMIDAD A ZONA DE RIESGO</Text>
              <Text style={styles.switchDesc}>
                Alerta sonora breve al ingresar en un radio de reporte activo.
              </Text>
            </View>
            <Switch
              value={proximitySound}
              onValueChange={(val) => {
                setProximitySound(val);
                saveSetting('proximitySound', val);
              }}
              trackColor={{ false: '#262626', true: theme.colors.yellow }}
              thumbColor={proximitySound ? '#000000' : '#737373'}
            />
          </View>

          <Text style={styles.groupLabel}>MODO DE VISUALIZACIÓN:</Text>
          <View style={styles.buttonSelector}>
            {[
              { id: 'standard', label: 'ESTÁNDAR' },
              { id: 'satellite', label: 'SATÉLITE' },
              { id: 'terrain', label: 'HÍBRIDO' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.selectorBtn,
                  mapType === item.id && styles.selectorBtnActive,
                ]}
                onPress={() => handleMapTypeChange(item.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.selectorBtnText,
                    mapType === item.id && styles.selectorBtnTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </AnimatedFadeSlide>

      {/* Bloque 4: Privacidad y Telemetría */}
      <AnimatedFadeSlide delay={300} duration={450}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <LockIcon size={18} color="#FFFFFF" />
              <Text style={styles.cardTitle}>04 // PRIVACIDAD Y GPS</Text>
            </View>
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchMeta}>
              <Text style={styles.switchTitle}>GPS ACTIVO SÓLO EN TRAYECTOS</Text>
              <Text style={styles.switchDesc}>
                Desconecta el módulo de localización al concluir el viaje.
              </Text>
            </View>
            <Switch
              value={shareLocationOnlyOnActiveRoute}
              onValueChange={(val) => {
                setShareLocationOnlyOnActiveRoute(val);
                saveSetting('shareLocationOnlyOnActiveRoute', val);
              }}
              trackColor={{ false: '#262626', true: theme.colors.yellow }}
              thumbColor={shareLocationOnlyOnActiveRoute ? '#000000' : '#737373'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchMeta}>
              <Text style={styles.switchTitle}>ALTA PRECISIÓN SATELITAL</Text>
              <Text style={styles.switchDesc}>
                Frecuencia continua de 20 metros para exactitud máxima.
              </Text>
            </View>
            <Switch
              value={highAccuracyLocation}
              onValueChange={(val) => {
                setHighAccuracyLocation(val);
                saveSetting('highAccuracyLocation', val);
              }}
              trackColor={{ false: '#262626', true: theme.colors.yellow }}
              thumbColor={highAccuracyLocation ? '#000000' : '#737373'}
            />
          </View>

          <TouchableOpacity
            style={styles.btnSecondaryOutline}
            onPress={handleClearCache}
            activeOpacity={0.8}
          >
            <Text style={styles.btnSecondaryOutlineText}>PURGAR MEMORIA TEMPORAL</Text>
          </TouchableOpacity>
        </View>
      </AnimatedFadeSlide>

      {/* Bloque 5: Notificaciones */}
      <AnimatedFadeSlide delay={350} duration={450}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <BellIcon size={18} color="#FFFFFF" />
              <Text style={styles.cardTitle}>05 // NOTIFICACIONES</Text>
            </View>
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchMeta}>
              <Text style={styles.switchTitle}>ALERTAS PUSH DE INCIDENCIAS</Text>
              <Text style={styles.switchDesc}>
                Avisos comunitarios cuando ocurren eventos en tu barrio.
              </Text>
            </View>
            <Switch
              value={incidentPushAlerts}
              onValueChange={(val) => {
                setIncidentPushAlerts(val);
                saveSetting('incidentPushAlerts', val);
              }}
              trackColor={{ false: '#262626', true: theme.colors.yellow }}
              thumbColor={incidentPushAlerts ? '#000000' : '#737373'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchMeta}>
              <Text style={styles.switchTitle}>RECORDATORIO DE LLEGADA</Text>
              <Text style={styles.switchDesc}>
                Avisar si llegaste al punto para cerrar el acompañamiento.
              </Text>
            </View>
            <Switch
              value={routeEndReminder}
              onValueChange={(val) => {
                setRouteEndReminder(val);
                saveSetting('routeEndReminder', val);
              }}
              trackColor={{ false: '#262626', true: theme.colors.yellow }}
              thumbColor={routeEndReminder ? '#000000' : '#737373'}
            />
          </View>
        </View>
      </AnimatedFadeSlide>

      {/* Bloque 6: Enlaces Informativos */}
      <AnimatedFadeSlide delay={400} duration={450}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>06 // SISTEMA Y SOPORTE</Text>
            <Text style={styles.versionText}>VER: 1.0.0-PROD</Text>
          </View>

          <TouchableOpacity
            style={styles.infoLink}
            onPress={() => setShowSupportModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.infoLinkText}>CENTRO DE SOPORTE // 24/7</Text>
            <ChevronRightIcon size={16} color="#737373" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoLink}
            onPress={() => setShowPrivacyModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.infoLinkText}>TÉRMINOS DE SERVICIO Y POLÍTICAS</Text>
            <ChevronRightIcon size={16} color="#737373" />
          </TouchableOpacity>
        </View>
      </AnimatedFadeSlide>

      {/* Botón de Salir */}
      <AnimatedFadeSlide delay={450} duration={450}>
        <TouchableOpacity
          style={styles.btnLogout}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <LogoutIcon size={18} color={theme.colors.danger} />
          <Text style={styles.btnLogoutText}>DESCONECTAR SESIÓN</Text>
        </TouchableOpacity>
      </AnimatedFadeSlide>

      {/* Modal de Soporte */}
      <Modal visible={showSupportModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>// SOPORTE TÉCNICO</Text>
              <TouchableOpacity onPress={() => setShowSupportModal(false)}>
                <CrossIcon size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalBody}>
              Para consultas de integración vecinal o fallas técnicas en tiempo real:
            </Text>
            <View style={styles.modalCodeBlock}>
              <Text style={styles.modalCodeText}>soporte@rutex.app</Text>
            </View>
            <Text style={styles.modalSub}>
              Monitoreo continuo y asistencia en incidentes.
            </Text>
            <TouchableOpacity
              style={styles.btnPrimaryYellow}
              onPress={() => setShowSupportModal(false)}
            >
              <Text style={styles.btnPrimaryYellowText}>ENTENDIDO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Privacidad */}
      <Modal visible={showPrivacyModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>// PRIVACIDAD Y DATOS</Text>
              <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                <CrossIcon size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 200 }}>
              <Text style={styles.modalBody}>
                1. GEOLOCALIZACIÓN: Únicamente transmitida durante trayectos activos
                o pulsación explícita de alerta SOS.{'\n\n'}
                2. SEGURIDAD: Cifrado en tránsito y sockets con autenticación JWT.{'\n\n'}
                3. COMUNIDAD: Los reportes preservan tu identidad anónima frente a
                terceros.
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.btnPrimaryYellow}
              onPress={() => setShowPrivacyModal(false)}
            >
              <Text style={styles.btnPrimaryYellowText}>ACEPTAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 40,
    maxWidth: 720,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: '#262626',
    paddingBottom: 16,
  },
  headerTag: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    color: theme.colors.yellow,
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontFamily: theme.fonts.h1,
    fontSize: 26,
    color: '#FFFFFF',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  headerSubtitle: {
    fontFamily: theme.fonts.body,
    fontSize: 13,
    color: '#A3A3A3',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1.5,
    borderColor: '#262626',
    padding: 18,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontFamily: theme.fonts.h3,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  badgeActive: {
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: theme.colors.yellow,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeActiveText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 9,
    color: theme.colors.yellow,
    letterSpacing: 1,
  },
  badgeCritical: {
    backgroundColor: '#260808',
    borderWidth: 1,
    borderColor: theme.colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeCriticalText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 9,
    color: theme.colors.danger,
    letterSpacing: 1,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    backgroundColor: theme.colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  avatarText: {
    fontFamily: theme.fonts.h1,
    fontSize: 18,
    color: '#000000',
  },
  profileMeta: {
    flex: 1,
  },
  metaLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 10,
    color: '#737373',
    letterSpacing: 1,
  },
  metaEmail: {
    fontFamily: theme.fonts.bodySemiBold,
    fontSize: 13,
    color: '#FFFFFF',
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    color: '#A3A3A3',
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: '#262626',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontFamily: theme.fonts.bodySemiBold,
    fontSize: 13,
  },
  btnPrimaryYellow: {
    backgroundColor: theme.colors.yellow,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#000000',
    marginTop: 6,
    elevation: 0,
    shadowOpacity: 0,
  },
  btnPrimaryYellowText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: '#000000',
    letterSpacing: 1,
  },
  btnSecondaryOutline: {
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: '#262626',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  btnSecondaryOutlineText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    color: '#A3A3A3',
    letterSpacing: 1,
  },
  groupLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    color: '#A3A3A3',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 6,
  },
  buttonSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  selectorBtn: {
    flex: 1,
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: '#262626',
    paddingVertical: 10,
    alignItems: 'center',
  },
  selectorBtnActive: {
    backgroundColor: '#1C1900',
    borderColor: theme.colors.yellow,
  },
  selectorBtnText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 10,
    color: '#737373',
    letterSpacing: 0.5,
  },
  selectorBtnTextActive: {
    color: theme.colors.yellow,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#171717',
  },
  switchMeta: {
    flex: 1,
    paddingRight: 14,
  },
  switchTitle: {
    fontFamily: theme.fonts.h3,
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  switchDesc: {
    fontFamily: theme.fonts.body,
    fontSize: 11,
    color: '#737373',
    marginTop: 2,
    lineHeight: 15,
  },
  versionText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 10,
    color: '#737373',
    letterSpacing: 1,
  },
  infoLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#171717',
  },
  infoLinkText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: '#D4D4D4',
    letterSpacing: 1,
  },
  btnLogout: {
    backgroundColor: '#170505',
    borderWidth: 1.5,
    borderColor: theme.colors.danger,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 20,
    elevation: 0,
    shadowOpacity: 0,
  },
  btnLogoutText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: theme.colors.danger,
    letterSpacing: 1.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    backgroundColor: '#0A0A0A',
    borderWidth: 2,
    borderColor: theme.colors.yellow,
    padding: 22,
    width: '100%',
    maxWidth: 420,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: theme.fonts.h2,
    fontSize: 15,
    color: theme.colors.yellow,
    letterSpacing: 1.5,
  },
  modalBody: {
    fontFamily: theme.fonts.body,
    fontSize: 13,
    color: '#D4D4D4',
    lineHeight: 19,
    marginBottom: 14,
  },
  modalCodeBlock: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#333333',
    padding: 10,
    marginBottom: 10,
  },
  modalCodeText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.yellow,
    letterSpacing: 1,
  },
  modalSub: {
    fontFamily: theme.fonts.body,
    fontSize: 11,
    color: '#737373',
    marginBottom: 16,
  },
});

export default SettingsScreen;
