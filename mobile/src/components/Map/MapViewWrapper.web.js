import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

/**
 * Fallback interactivo para Web usando OpenStreetMap iframe y overlays
 * Permite que Rutex se ejecute en navegadores sin dependencias nativas de iOS/Android.
 */
const MapView = forwardRef(({ style, initialRegion, children }, ref) => {
  const [region, setRegion] = useState(
    initialRegion || {
      latitude: -34.6037,
      longitude: -58.3816,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    }
  );

  useImperativeHandle(ref, () => ({
    animateToRegion: (newRegion) => {
      setRegion((prev) => ({ ...prev, ...newRegion }));
    },
  }));

  const delta = region.latitudeDelta || 0.015;
  const bbox = `${region.longitude - delta},${region.latitude - delta},${
    region.longitude + delta
  },${region.latitude + delta}`;
  const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${region.latitude}%2C${region.longitude}`;

  return (
    <View style={[styles.container, style]}>
      {/* Mapa interactivo de OpenStreetMap para entorno Web */}
      <iframe
        title="Rutex OpenStreetMap"
        src={iframeSrc}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          pointerEvents: 'auto',
        }}
      />

      {/* Badge informativo de modo Web */}
      <View style={styles.webBadge}>
        <Text style={styles.webBadgeText}>🌐 Rutex Web Preview (OpenStreetMap)</Text>
        <Text style={styles.coordsText}>
          Lat: {region.latitude.toFixed(4)} | Lng: {region.longitude.toFixed(4)}
        </Text>
      </View>

      {/* Renderizado de marcadores y elementos hijos como overlay lateral/inferior */}
      <View style={styles.overlayContainer}>
        {children}
      </View>
    </View>
  );
});

export const Marker = ({ coordinate, title, pinColor = '#EF4444', children }) => {
  if (!coordinate) return null;
  return (
    <View style={styles.markerCard}>
      <View style={[styles.markerDot, { backgroundColor: pinColor }]} />
      <View style={styles.markerContent}>
        <Text style={styles.markerTitle}>{title || 'Punto de interés'}</Text>
        <Text style={styles.markerCoords}>
          {coordinate.latitude.toFixed(4)}, {coordinate.longitude.toFixed(4)}
        </Text>
        {children}
      </View>
    </View>
  );
};

export const Callout = ({ children }) => {
  return <View style={styles.calloutWrapper}>{children}</View>;
};

export const Polyline = ({ coordinates = [], strokeColor = '#3B82F6' }) => {
  if (!coordinates || coordinates.length < 2) return null;
  return (
    <View style={styles.polylineCard}>
      <Text style={[styles.polylineText, { color: strokeColor }]}>
        🛣️ Trayecto trazado: ({coordinates.length} puntos GPS)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  webBadge: {
    position: 'absolute',
    top: 90,
    left: 16,
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: '#FFE600',
    zIndex: 5,
  },
  webBadgeText: {
    color: '#FFE600',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  coordsText: {
    color: '#A3A3A3',
    fontSize: 9,
    marginTop: 2,
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 16,
    maxHeight: 140,
    zIndex: 6,
    pointerEvents: 'box-none',
  },
  markerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    padding: 8,
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: '#262626',
  },
  markerDot: {
    width: 8,
    height: 8,
    marginRight: 8,
  },
  markerContent: {
    flex: 1,
  },
  markerTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  markerCoords: {
    color: '#737373',
    fontSize: 9,
  },
  calloutWrapper: {
    marginTop: 4,
  },
  polylineCard: {
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: '#FFE600',
  },
  polylineText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFE600',
    letterSpacing: 1,
  },
});

export default MapView;
