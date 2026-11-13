import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import theme from '../theme/theme';
import { CrossIcon, UsersIcon, UserIcon, MailIcon } from './SvgIcons';

const ContactsModal = ({ visible, onClose }) => {
  const { user, refreshProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddContact = async () => {
    if (!email.trim()) {
      Alert.alert('// ATENCIÓN', 'Ingresa el correo electrónico del contacto.');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.addContact(email.trim());

      if (res.data?.success) {
        Alert.alert(
          '// CONTACTO VINCULADO',
          `${email} fue añadido a tu red de confianza.`
        );
        setEmail('');
        await refreshProfile();
      }
    } catch (err) {
      console.error('[Add Contact Error]:', err);
      Alert.alert(
        '// ERROR',
        err.response?.data?.message ||
          'No se pudo agregar el contacto. Verifica que el email esté registrado.'
      );
    } finally {
      setLoading(false);
    }
  };

  const contacts = user?.contacts || [];

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
              <UsersIcon size={20} color={theme.colors.yellow} />
              <Text style={styles.title}>RED DE CONFIANZA</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <CrossIcon size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Tus contactos recibirán un enlace de telemetría y alertas SOS en tiempo real.
          </Text>

          <View style={styles.addSection}>
            <Text style={styles.inputLabel}>VINCULAR NUEVO MIEMBRO</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <MailIcon size={16} color="#737373" />
                <TextInput
                  style={styles.input}
                  placeholder="contacto@rutex.com"
                  placeholderTextColor="#525252"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity
                style={styles.btnAdd}
                onPress={handleAddContact}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#000000" size="small" />
                ) : (
                  <Text style={styles.btnAddText}>AGREGAR</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.listTitle}>
            MIEMBROS ACTIVOS ({contacts.length})
          </Text>

          {contacts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                NO POSEES CONTACTOS VINCULADOS EN TU RED.
              </Text>
            </View>
          ) : (
            <FlatList
              data={contacts}
              keyExtractor={(item) => item._id || item.email || Math.random().toString()}
              renderItem={({ item }) => (
                <View style={styles.contactItem}>
                  <View style={styles.contactAvatar}>
                    <UserIcon size={16} color="#000000" />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>
                      {item.name?.toUpperCase() || 'MIEMBRO VECINAL'}
                    </Text>
                    <Text style={styles.contactEmail}>{item.email}</Text>
                  </View>
                  <View style={styles.badgeLinked}>
                    <Text style={styles.badgeLinkedText}>CONECTADO</Text>
                  </View>
                </View>
              )}
              style={styles.list}
            />
          )}
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
    maxHeight: '85%',
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
  addSection: {
    marginBottom: 20,
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: '#262626',
    padding: 14,
  },
  inputLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 10,
    color: theme.colors.yellow,
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: theme.fonts.bodySemiBold,
    fontSize: 13,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  btnAdd: {
    backgroundColor: theme.colors.yellow,
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
    shadowOpacity: 0,
  },
  btnAddText: {
    fontFamily: theme.fonts.bodyBold,
    color: '#000000',
    fontSize: 11,
    letterSpacing: 1,
  },
  listTitle: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    color: '#737373',
    letterSpacing: 1,
    marginBottom: 10,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1F1F1F',
    backgroundColor: '#050505',
  },
  emptyText: {
    fontFamily: theme.fonts.bodyBold,
    color: '#525252',
    fontSize: 11,
    letterSpacing: 1,
  },
  list: {
    maxHeight: 240,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    padding: 12,
    marginBottom: 8,
  },
  contactAvatar: {
    width: 32,
    height: 32,
    backgroundColor: theme.colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontFamily: theme.fonts.h3,
    color: '#FFFFFF',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  contactEmail: {
    fontFamily: theme.fonts.body,
    color: '#A3A3A3',
    fontSize: 11,
  },
  badgeLinked: {
    backgroundColor: '#1C1900',
    borderWidth: 1,
    borderColor: theme.colors.yellow,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeLinkedText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 9,
    color: theme.colors.yellow,
    letterSpacing: 1,
  },
});

export default ContactsModal;
