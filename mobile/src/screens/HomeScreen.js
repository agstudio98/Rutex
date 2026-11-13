import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView, { Marker, Callout } from '../components/Map/MapViewWrapper';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import { incidenceService, routeService } from '../services/api';
import { DEFAULT_MAP_DELTA, INCIDENT_TYPES } from '../config/constants';
import theme from '../theme/theme';
import IncidentModal from '../components/IncidentModal';
import ContactsModal from '../components/ContactsModal';
import {
  UsersIcon,
  SettingsIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  CompassIcon,
} from '../components/SvgIcons';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [incidences, setIncidences] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [startingRoute, setStartingRoute] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    let locationSubscription = null;

    const requestAndGetLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            '// PERMISOS REQUERIDOS',
            'Rutex necesita acceso a tu ubicación satelital para el radar de seguridad.'
          );
          setLoadingLocation(false);
          return;
        }

        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const coords = {
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
        };

        setCurrentLocation(coords);
        setLoadingLocation(false);
        fetchNearbyIncidences(coords.latitude, coords.longitude);

        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 20,
          },
          (loc) => {
            setCurrentLocation({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });
          }
        );
      } catch (err) {
        console.error('[Location Error]:', err);
        setLoadingLocation(false);
      }
    };

    requestAndGetLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const fetchNearbyIncidences = async (lat, lng) => {
    try {
      const response = await incidenceService.getNearby(lat, lng, 10000);
      if (response.data?.incidences) {
        setIncidences(response.data.incidences);
      }
    } catch (err) {
      console.warn('[Incidences Fetch Error]:', err.message);
    }
  };

  const centerOnUser = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          ...DEFAULT_MAP_DELTA,
        },
        800
      );
    }
  };

  const handleStartRoute = async () => {
    if (!currentLocation) {
      Alert.alert('// RADAR GPS', 'Obteniendo coordenadas satelitales...');
      return;
    }

    try {
      setStartingRoute(true);

      const destination = {
        latitude: currentLocation.latitude + 0.005,
        longitude: currentLocation.longitude + 0.005,
      };

      const res = await routeService.createSession(currentLocation, destination);

      if (res.data?.success && res.data?.session) {
        navigation.navigate('ActiveRoute', {
          session: res.data.session,
        });
      }
    } catch (err) {
      console.error('[Start Route Error]:', err);
      Alert.alert(
        '// ERROR',
        err.response?.data?.message || 'No se pudo iniciar la sesión de acompañamiento'
      );
    } finally {
      setStartingRoute(false);
    }
  };

  const getIncidentColor = (type) => {
    const found = INCIDENT_TYPES.find((item) => item.id === type);
    return found ? found.color : theme.colors.yellow;
  };

  return (
    <View style={styles.container}>
      {/* Barra superior brutalista flotante */}
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <View style={styles.brandSquare}>
            <Text style={styles.brandSquareText}>RTX</Text>
          </View>
          <View>
            <Text style={styles.welcomeText}>
              RADAR // {user?.name?.toUpperCase() || 'USUARIO'}
            </Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusIndicator}>TELEMETRÍA ACTIVA</Text>
            </View>
          </View>
        </View>

        <View style={styles.topActions}>
          <TouchableOpacity
            style={styles.actionBtnOutline}
            onPress={() => setShowContactsModal(true)}
            activeOpacity={0.8}
          >
            <UsersIcon size={16} color="#FFFFFF" />
            <Text style={styles.actionBtnOutlineText}>RED</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnOutline}
            onPress={() => navigation.navigate('SettingsTab')}
            activeOpacity={0.8}
          >
            <SettingsIcon size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mapa Principal */}
      {loadingLocation ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.yellow} />
          <Text style={styles.loadingText}>SINCRONIZANDO COORDENADAS GPS...</Text>
        </View>
      ) : (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: currentLocation?.latitude || -34.6037,
            longitude: currentLocation?.longitude || -58.3816,
            ...DEFAULT_MAP_DELTA,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
        >
          {incidences.map((incident) => {
            const coords = incident.location?.coordinates;
            if (!coords || coords.length < 2) return null;
            const [lng, lat] = coords;
            const color = getIncidentColor(incident.type);

            return (
              <Marker
                key={incident._id}
                coordinate={{ latitude: lat, longitude: lng }}
                pinColor={color}
              >
                <Callout>
                  <View style={styles.calloutContainer}>
                    <Text style={[styles.calloutTitle, { color }]}>
                      ⚠️ {incident.type.toUpperCase().replace('_', ' ')}
                    </Text>
                    {incident.description ? (
                      <Text style={styles.calloutDesc}>{incident.description}</Text>
                    ) : null}
                    <Text style={styles.calloutTime}>
                      REPORTADO: {incident.userId?.name || 'COMUNIDAD'}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
      )}

      {/* Botón flotante para recentrar mapa */}
      <TouchableOpacity
        style={styles.recenterBtn}
        onPress={centerOnUser}
        activeOpacity={0.8}
      >
        <CompassIcon size={18} color={theme.colors.yellow} />
        <Text style={styles.recenterText}>MI POSICIÓN</Text>
      </TouchableOpacity>

      {/* Panel inferior brutalista */}
      <View style={styles.bottomCard}>
        <View style={styles.bottomCardHeader}>
          <Text style={styles.bottomCardTag}>[TELEMETRÍA] // PROTOCOLO ACTIVO</Text>
          <Text style={styles.bottomTitle}>ACOMPAÑAMIENTO EN VIVO</Text>
          <Text style={styles.bottomSubtitle}>
            Tus contactos recibirán un enlace WebSocket con telemetría en tiempo real.
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.btnDangerOutline}
            onPress={() => setShowIncidentModal(true)}
            activeOpacity={0.8}
          >
            <AlertTriangleIcon size={18} color={theme.colors.danger} />
            <Text style={styles.btnDangerOutlineText}>REPORTAR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnPrimaryYellow}
            onPress={handleStartRoute}
            disabled={startingRoute}
            activeOpacity={0.85}
          >
            {startingRoute ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <>
                <Text style={styles.btnPrimaryYellowText}>INICIAR TRAYECTO</Text>
                <ArrowRightIcon size={18} color="#000000" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Modales */}
      <IncidentModal
        visible={showIncidentModal}
        currentLocation={currentLocation}
        onClose={() => setShowIncidentModal(false)}
        onReportSuccess={(newIncident) => {
          setIncidences((prev) => [newIncident, ...prev]);
        }}
      />

      <ContactsModal
        visible={showContactsModal}
        onClose={() => setShowContactsModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    maxWidth: 600,
    alignSelf: 'center',
    width: '92%',
    zIndex: 10,
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#262626',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 0,
    shadowOpacity: 0,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandSquare: {
    width: 32,
    height: 32,
    backgroundColor: theme.colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  brandSquareText: {
    fontFamily: theme.fonts.h1,
    fontSize: 10,
    color: '#000000',
  },
  welcomeText: {
    fontFamily: theme.fonts.h3,
    color: '#FFFFFF',
    fontSize: 12,
    letterSpacing: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    backgroundColor: theme.colors.success,
    marginRight: 6,
  },
  statusIndicator: {
    fontFamily: theme.fonts.bodyBold,
    color: theme.colors.success,
    fontSize: 9,
    letterSpacing: 1,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnOutline: {
    backgroundColor: '#141414',
    borderWidth: 1.5,
    borderColor: '#262626',
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtnOutlineText: {
    fontFamily: theme.fonts.bodyBold,
    color: '#FFFFFF',
    fontSize: 10,
    letterSpacing: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: theme.fonts.bodyBold,
    color: '#A3A3A3',
    fontSize: 12,
    marginTop: 14,
    letterSpacing: 1.5,
  },
  calloutContainer: {
    width: 200,
    padding: 8,
    backgroundColor: '#0A0A0A',
  },
  calloutTitle: {
    fontFamily: theme.fonts.h3,
    fontSize: 12,
    marginBottom: 4,
    letterSpacing: 1,
  },
  calloutDesc: {
    fontFamily: theme.fonts.body,
    fontSize: 11,
    color: '#D4D4D4',
    marginBottom: 4,
  },
  calloutTime: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 9,
    color: '#737373',
  },
  recenterBtn: {
    position: 'absolute',
    right: 16,
    bottom: 240,
    backgroundColor: '#0A0A0A',
    borderWidth: 1.5,
    borderColor: theme.colors.yellow,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  recenterText: {
    fontFamily: theme.fonts.bodyBold,
    color: '#FFFFFF',
    fontSize: 10,
    letterSpacing: 1,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 75,
    left: 16,
    right: 16,
    maxWidth: 600,
    width: '92%',
    alignSelf: 'center',
    backgroundColor: '#0A0A0A',
    borderWidth: 2,
    borderColor: '#262626',
    padding: 18,
    elevation: 0,
    shadowOpacity: 0,
  },
  bottomCardHeader: {
    marginBottom: 14,
  },
  bottomCardTag: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 9,
    color: theme.colors.yellow,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  bottomTitle: {
    fontFamily: theme.fonts.h2,
    color: '#FFFFFF',
    fontSize: 16,
    letterSpacing: 1,
  },
  bottomSubtitle: {
    fontFamily: theme.fonts.body,
    color: '#A3A3A3',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnDangerOutline: {
    backgroundColor: '#170505',
    borderWidth: 1.5,
    borderColor: theme.colors.danger,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnDangerOutlineText: {
    fontFamily: theme.fonts.bodyBold,
    color: theme.colors.danger,
    fontSize: 11,
    letterSpacing: 1,
  },
  btnPrimaryYellow: {
    flex: 1,
    backgroundColor: theme.colors.yellow,
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  btnPrimaryYellowText: {
    fontFamily: theme.fonts.bodyBold,
    color: '#000000',
    fontSize: 12,
    letterSpacing: 1,
  },
});

export default HomeScreen;
