import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { INCIDENT_TYPES } from '../config/constants';
import { incidenceService } from '../services/api';
import theme from '../theme/theme';
import { CrossIcon, AlertTriangleIcon } from './SvgIcons';

const IncidentModal = ({ visible, onClose, currentLocation, onReportSuccess }) => {
  const [selectedType, setSelectedType] = useState(INCIDENT_TYPES[0].id);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!currentLocation) {
      Alert.alert(
        '// UBICACIÓN NO DETECTADA',
        'No se ha obtenido tu posición satelital actual para georreferenciar el reporte.'
      );
      return;
    }

    try {
      setLoading(true);
      const res = await incidenceService.create({
        type: selectedType,
        description,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });

      if (res.data?.success) {
        Alert.alert(
          '// REPORTE REGISTRADO',
          'La anomalía fue añadida a la red colaborativa.'
        );
        setDescription('');
        setSelectedType(INCIDENT_TYPES[0].id);
        onClose();
        if (onReportSuccess) onReportSuccess(res.data.incidence);
      }
    } catch (error) {
      console.error('[Report Incident Error]:', error);
      Alert.alert(
        '// ERROR',
        error.response?.data?.message ||
          'Fallo al registrar la incidencia. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <AlertTriangleIcon size={20} color={theme.colors.yellow} />
              <Text style={styles.title}>REPORTAR RIESGO URBANO</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <CrossIcon size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Tu reporte se vinculará a las coordenadas actuales y alertará a los vecinos cercanos.
          </Text>

          <Text style={styles.sectionLabel}>TIPO DE INCIDENCIA:</Text>
          <View style={styles.typeGrid}>
            {INCIDENT_TYPES.map((type) => {
              const isSelected = selectedType === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeBtn,
                    isSelected && styles.typeBtnSelected,
                  ]}
                  onPress={() => setSelectedType(type.id)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.typeLabel,
                      isSelected && styles.typeLabelSelected,
                    ]}
                  >
                    {type.label.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>DETALLES ADICIONALES (OPCIONAL):</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describí brevemente la situación o puntos de referencia..."
            placeholderTextColor="#525252"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.btnCancelText}>CANCELAR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSubmit}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#000000" size="small" />
              ) : (
                <Text style={styles.btnSubmitText}>EMITIR REPORTE</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  modalContent: {
    backgroundColor: '#0A0A0A',
    borderWidth: 2,
    borderColor: theme.colors.yellow,
    width: '100%',
    maxWidth: 520,
    padding: 22,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#262626',
    paddingBottom: 14,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: theme.fonts.h2,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontFamily: theme.fonts.body,
    fontSize: 12,
    color: '#A3A3A3',
    lineHeight: 17,
    marginBottom: 18,
  },
  sectionLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 10,
    color: theme.colors.yellow,
    letterSpacing: 1,
    marginBottom: 8,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeBtn: {
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: '#262626',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  typeBtnSelected: {
    backgroundColor: '#1C1900',
    borderColor: theme.colors.yellow,
  },
  typeLabel: {
    fontFamily: theme.fonts.bodyBold,
    color: '#737373',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  typeLabelSelected: {
    color: theme.colors.yellow,
  },
  textArea: {
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: '#262626',
    padding: 12,
    color: '#FFFFFF',
    fontFamily: theme.fonts.body,
    fontSize: 13,
    textAlignVertical: 'top',
    height: 80,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  btnCancel: {
    backgroundColor: '#141414',
    borderWidth: 1.5,
    borderColor: '#262626',
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCancelText: {
    fontFamily: theme.fonts.bodyBold,
    color: '#A3A3A3',
    fontSize: 11,
    letterSpacing: 1,
  },
  btnSubmit: {
    flex: 1,
    backgroundColor: theme.colors.yellow,
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
    shadowOpacity: 0,
  },
  btnSubmitText: {
    fontFamily: theme.fonts.bodyBold,
    color: '#000000',
    fontSize: 12,
    letterSpacing: 1.5,
  },
});

export default IncidentModal;
