import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, Polyline } from '../components/Map/MapViewWrapper';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import { socketService } from '../services/socket';
import { routeService } from '../services/api';
import PanicButton from '../components/PanicButton';
import { DEFAULT_MAP_DELTA } from '../config/constants';
import theme from '../theme/theme';
import { CheckIcon, AlertTriangleIcon } from '../components/SvgIcons';

const ActiveRouteScreen = ({ route, navigation }) => {
  const { session } = route.params;
  const { user } = useAuth();

  const initialLat =
    session?.currentLocation?.coordinates?.[1] ??
    session?.origin?.coordinates?.[1] ??
    -34.6037;
  const initialLng =
    session?.currentLocation?.coordinates?.[0] ??
    session?.origin?.coordinates?.[0] ??
    -58.3816;

  const [currentCoords, setCurrentCoords] = useState({
    latitude: initialLat,
    longitude: initialLng,
  });

  const destinationCoords = {
    latitude: session?.destination?.coordinates?.[1] ?? initialLat + 0.005,
    longitude: session?.destination?.coordinates?.[0] ?? initialLng + 0.005,
  };

  const [status, setStatus] = useState(session?.status || 'active');
  const [companionsCount, setCompanionsCount] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  const mapRef = useRef(null);
  const locationWatcherRef = useRef(null);

  useEffect(() => {
    socketService.connect();
    socketService.joinRoute(session?._id, user?.name, 'owner');

    socketService.onCompanionJoined((data) => {
      setCompanionsCount((prev) => prev + 1);
      Alert.alert(
        '// ACOMPAÑANTE CONECTADO',
        `${data.userName || 'Un contacto'} se sumó a tu telemetría en vivo.`
      );
    });

    socketService.onEmergencyAlert(() => {
      setStatus('alert');
    });

    socketService.onLocationUpdated((data) => {
      if (data.sessionId === session?._id && data.latitude && data.longitude) {
        setCurrentCoords({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }
    });

    const startLocationTracking = async () => {
      try {
        const { status: permStatus } = await Location.requestForegroundPermissionsAsync();
        if (permStatus !== 'granted') {
          Alert.alert(
            '// ATENCIÓN',
            'Se requieren permisos de geolocalización satelital activa.'
          );
          return;
        }

        locationWatcherRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,
            distanceInterval: 5,
          },
          (loc) => {
            const newLat = loc.coords.latitude;
            const newLng = loc.coords.longitude;

            setCurrentCoords({ latitude: newLat, longitude: newLng });

            socketService.emitLocationUpdate(
              session._id,
              newLat,
              newLng,
              loc.coords.speed || 0,
              loc.coords.heading || 0
            );
          }
        );
      } catch (err) {
        console.error('[Tracking Error]:', err);
      }
    };

    startLocationTracking();

    return () => {
      if (locationWatcherRef.current) {
        locationWatcherRef.current.remove();
      }
      socketService.leaveRoute(session._id, user?.name);
      socketService.cleanRouteListeners();
    };
  }, [session._id]);

  const handlePanicAlert = async () => {
    try {
      setStatus('alert');

      socketService.emitEmergencyAlert(
        session._id,
        'Alerta de pánico activada por el usuario',
        currentCoords.latitude,
        currentCoords.longitude
      );

      await routeService.updateStatus(
        session._id,
        'alert',
        'Alerta de pánico activada desde la aplicación móvil'
      );
    } catch (err) {
      console.error('[Panic Alert Error]:', err);
    }
  };

  const handleFinishRoute = async () => {
    try {
      setIsFinishing(true);
      socketService.emitFinishRoute(session._id);
      await routeService.updateStatus(session._id, 'completed');

      Alert.alert(
        '// DESTINO ALCANZADO',
        'Llegaste seguro. Protocolo de acompañamiento concluido con éxito.'
      );
      navigation.goBack();
    } catch (err) {
      console.error('[Finish Route Error]:', err);
      Alert.alert('// ERROR', 'No se pudo cerrar la sesión de ruta.');
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Brutalista */}
      <View style={[styles.headerBanner, status === 'alert' && styles.headerBannerAlert]}>
        <View style={styles.headerInfo}>
          <Text style={styles.bannerTag}>[TELEMETRÍA] // SESIÓN EN VIVO</Text>
          <Text style={styles.bannerStatus}>
            {status === 'alert' ? 'ALERTA SOS EMITIDA' : 'TRAYECTO EN CURSO'}
          </Text>
          <Text style={styles.bannerSubtitle}>
            {companionsCount > 0
              ? `${companionsCount} contacto(s) en tu sala privada`
              : 'Transmitiendo coordenadas cada 3 seg...'}
          </Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={[styles.liveDot, status === 'alert' && styles.liveDotAlert]} />
          <Text style={styles.liveText}>EN VIVO</Text>
        </View>
      </View>

      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: currentCoords.latitude,
          longitude: currentCoords.longitude,
          ...DEFAULT_MAP_DELTA,
        }}
        showsUserLocation={false}
      >
        <Marker
          coordinate={currentCoords}
          title="Tu Posición Satelital"
          pinColor={status === 'alert' ? theme.colors.danger : theme.colors.yellow}
        />

        <Marker
          coordinate={destinationCoords}
          title="Destino Seguro"
          pinColor="#00FF66"
        />

        <Polyline
          coordinates={[currentCoords, destinationCoords]}
          strokeColor={theme.colors.yellow}
          strokeWidth={3}
        />
      </MapView>

      {/* Panel Inferior Brutalista */}
      <View style={styles.controlPanel}>
        <PanicButton onPress={handlePanicAlert} isAlerting={status === 'alert'} />

        <TouchableOpacity
          style={styles.finishBtn}
          onPress={handleFinishRoute}
          disabled={isFinishing}
          activeOpacity={0.85}
        >
          {isFinishing ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <View style={styles.finishContent}>
              <CheckIcon size={18} color="#000000" />
              <Text style={styles.finishBtnText}>LLEGUÉ SEGURO // CONCLUIR</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerBanner: {
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#262626',
  },
  headerBannerAlert: {
    backgroundColor: '#1C0505',
    borderBottomColor: theme.colors.danger,
  },
  headerInfo: {
    flex: 1,
  },
  bannerTag: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 9,
    color: theme.colors.yellow,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  bannerStatus: {
    fontFamily: theme.fonts.h2,
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 1,
  },
  bannerSubtitle: {
    fontFamily: theme.fonts.body,
    color: '#A3A3A3',
    fontSize: 11,
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    backgroundColor: theme.colors.success,
  },
  liveDotAlert: {
    backgroundColor: theme.colors.danger,
  },
  liveText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 9,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  map: {
    flex: 1,
  },
  controlPanel: {
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 2,
    borderTopColor: '#262626',
    elevation: 0,
    shadowOpacity: 0,
  },
  finishBtn: {
    backgroundColor: theme.colors.yellow,
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    elevation: 0,
    shadowOpacity: 0,
  },
  finishContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  finishBtnText: {
    fontFamily: theme.fonts.bodyBold,
    color: '#000000',
    fontSize: 12,
    letterSpacing: 1.5,
  },
});

export default ActiveRouteScreen;
