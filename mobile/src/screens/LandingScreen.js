import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import theme from '../theme/theme';
import ContactsModal from '../components/ContactsModal';
import IncidentModal from '../components/IncidentModal';
import AnimatedFadeSlide from '../components/AnimatedFadeSlide';
import Geometric3DBackground from '../components/Geometric3DBackground';
import {
  ShieldIcon,
  MapPinIcon,
  RouteIcon,
  AlertTriangleIcon,
  UsersIcon,
  SettingsIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  StarIcon,
  GeometricDiamond,
  ArrowRightIcon,
} from '../components/SvgIcons';

const { width } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
  const { user, showWelcomeGuide, dismissWelcomeGuide } = useAuth();
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [guideIndex, setGuideIndex] = useState(0);
  const guideOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (showWelcomeGuide) setGuideIndex(0);
  }, [showWelcomeGuide]);

  const changeGuidePage = (nextIndex) => {
    Animated.timing(guideOpacity, { toValue: 0, duration: 160, useNativeDriver: true }).start(() => {
      setGuideIndex(nextIndex);
      Animated.timing(guideOpacity, { toValue: 1, duration: 240, useNativeDriver: true }).start();
    });
  };

  const handlePanicQuickAlert = () => {
    Alert.alert(
      '// ALERTA SOS INMEDIATA',
      '¿Disparar señal de auxilio a tus contactos de emergencia? Se transmitirán tus coordenadas exactas.',
      [
        { text: 'CANCELAR', style: 'cancel' },
        {
          text: 'CONFIRMAR SOS',
          style: 'destructive',
          onPress: () => {
            navigation.navigate('MapTab');
          },
        },
      ]
    );
  };

  const features = [
    {
      code: '01',
      title: 'ACOMPAÑAMIENTO EN VIVO',
      desc: 'Transmisión GPS bidireccional mediante WebSockets de latencia crítica. Tus contactos monitorean tu progreso en tiempo real con detección automática de desvíos y paradas.',
      icon: <RouteIcon size={24} color={theme.colors.yellow} />,
    },
    {
      code: '02',
      title: 'MAPA COLABORATIVO',
      desc: 'Base de datos geoespacial descentralizada. Reportes vecinales de luminarias apagadas, disturbios o sospechas georreferenciadas con radio de proximidad.',
      icon: <MapPinIcon size={24} color={theme.colors.yellow} />,
    },
    {
      code: '03',
      title: 'BOTÓN DE PÁNICO SOS',
      desc: 'Protocolo de rescate con cuenta regresiva configurable, sirena acústica de disuasión y envío instantáneo de alerta a tu círculo prioritario.',
      icon: <AlertTriangleIcon size={24} color={theme.colors.yellow} />,
    },
    {
      code: '04',
      title: 'RUTAS INTELIGENTES',
      desc: 'Sugerencias de navegación que priorizan avenidas iluminadas, corredores comerciales activos y zonas libres de incidencias recientes.',
      icon: <ShieldIcon size={24} color={theme.colors.yellow} />,
    },
  ];

  const testimonials = [
    {
      name: 'CAMILA ROMANO',
      role: 'Estudiante Universitaria // Medicina',
      comment:
        'Termino las prácticas hospitalarias cerca de medianoche. Con Rutex mis padres reciben el enlace de mi trayecto y saben cuándo llego a destino. Seguridad tangible.',
      badge: 'VERIFICADO',
    },
    {
      name: 'MARIANO BENÍTEZ',
      role: 'Atleta Urbano // Turno Noche',
      comment:
        'Entreno temprano en avenidas poco transitadas. El mapa de incidencias me salvó de entrar a dos esquinas que reportaban disturbios recientes.',
      badge: 'COMUNIDAD',
    },
    {
      name: 'LUCÍA FERNÁNDEZ',
      role: 'Comercio Minorista // Cierre Nocturno',
      comment:
        'Cierro mi local a las 22 hs. Tener el botón de pánico en pantalla y saber que mis contactos están conectados en vivo me cambió totalmente la tranquilidad.',
      badge: 'ACTIVO',
    },
  ];

  const faqs = [
    {
      q: '¿Cómo se garantiza la privacidad de mis trayectos?',
      a: 'Tus coordenadas solo se emiten de forma activa durante una ruta iniciada o una emergencia. No se almacenan historiales de ubicación para fines publicitarios.',
    },
    {
      q: '¿Qué sucede si presiono el botón de pánico por equivocación?',
      a: 'Cuentas con una cuenta regresiva programable de 3 a 5 segundos desde la sección de Ajustes para cancelar la señal antes del aviso masivo.',
    },
    {
      q: '¿Mis contactos necesitan la app instalada para seguirme?',
      a: 'Pueden seguirte desde la web en tiempo real o recibir la notificación directa si ya están registrados en tu red de confianza.',
    },
  ];

  const guidePages = [
    { title: 'ARQUITECTURA DE OPERACIONES', body: 'Una red de herramientas para acompañar tus recorridos, compartir alertas y pedir ayuda cuando la necesites.', details: features.map((item) => `${item.title}: ${item.desc}`) },
    { title: 'SOBRE NOSOTROS', body: 'Rutex fue concebida bajo la premisa de que la libertad de circular sin miedo es un derecho civil innegociable. Combinamos infraestructura de software crítico con solidaridad vecinal directa para cuidar los espacios urbanos.', details: ['PRIVACIDAD · Tus coordenadas solo se transmiten bajo tu orden explícita.', 'SOLIDARIDAD · Una red vecinal donde cada reporte puede prevenir un delito.', 'VELOCIDAD · Alertas en tiempo real con respuesta inmediata.'] },
    { title: 'EXPERIENCIAS REALES', body: 'La red de Rutex acompaña a personas en sus recorridos cotidianos.', details: testimonials.map((item) => `${item.name}: “${item.comment}”`) },
    { title: 'PREGUNTAS FRECUENTES', body: 'Respuestas para usar Rutex con confianza.', details: faqs.map((item) => `${item.q}\n${item.a}`) },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* 1. Header Brutalista */}
      <AnimatedFadeSlide direction="down" duration={450}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>RTX</Text>
            </View>
            <View>
              <Text style={styles.appName}>RUTEX</Text>
              <Text style={styles.appTagline}>// URBAN DEFENSE NETWORK</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('SettingsTab')}
            activeOpacity={0.8}
          >
            <SettingsIcon size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </AnimatedFadeSlide>

      {/* 2. Banner de Estado del Usuario */}
      <AnimatedFadeSlide delay={100} duration={450}>
        <View style={styles.statusBar}>
          <View style={styles.statusLeft}>
            <View style={styles.statusSquare} />
            <Text style={styles.statusUser}>
              USUARIO: {user?.name?.toUpperCase() || 'CIUDADANO'}
            </Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>SISTEMA EN LÍNEA</Text>
          </View>
        </View>
      </AnimatedFadeSlide>

      {/* 3. Hero Section con Fondo 3D Three.js */}
      <AnimatedFadeSlide delay={150} duration={500}>
        <View style={styles.heroBox}>
          {/* Fondo Volumétrico 3D Three.js */}
          <View style={styles.hero3DContainer}>
            <Geometric3DBackground
              height={260}
              color={theme.colors.yellow}
              secondaryColor="#FFFFFF"
              speed={0.01}
              opacity={0.8}
            />
          </View>

          <View style={styles.heroContent}>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>[00] // RED URBANA GEOMÉTRICA</Text>
            </View>

            <Text style={styles.heroH1}>
              SEGURIDAD COLECTIVA.{'\n'}
              <Text style={styles.heroH1Highlight}>CERO INCERTIDUMBRE.</Text>
            </Text>

            <Text style={styles.heroParagraph}>
              Plataforma comunitaria de acompañamiento con geolocalización de alta
              fidelidad, mapas colaborativos de riesgo y respuesta instantánea ante
              emergencias urbanas.
            </Text>

            <View style={styles.heroActions}>
              <TouchableOpacity
                style={styles.btnPrimaryYellow}
                onPress={() => navigation.navigate('MapTab')}
                activeOpacity={0.85}
              >
                <Text style={styles.btnPrimaryYellowText}>INICIAR TRAYECTO</Text>
                <ArrowRightIcon size={18} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </AnimatedFadeSlide>

      {/* 4. Grilla de Acciones Rápidas Brutalistas */}
      <AnimatedFadeSlide delay={200} duration={500}>
        <View style={styles.gridSection}>
          <View style={styles.sectionHeaderBar}>
            <Text style={styles.sectionIndex}>[01]</Text>
            <Text style={styles.sectionTitle}>OPERACIONES RÁPIDAS</Text>
          </View>

          <View style={styles.quickGrid}>
            <TouchableOpacity
              style={[styles.quickCard, styles.quickCardMap]}
              onPress={() => navigation.navigate('MapTab')}
              activeOpacity={0.8}
            >
              <View style={styles.quickCardHeader}>
                <MapPinIcon size={22} color={theme.colors.yellow} />
                <Text style={styles.quickCardCode}>01/MAP</Text>
              </View>
              <Text style={styles.quickCardTitle}>MAPA EN VIVO</Text>
              <Text style={styles.quickCardDesc}>
                Explorar incidencias vecinales y radar GPS.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickCard, styles.quickCardSos]}
              onPress={handlePanicQuickAlert}
              activeOpacity={0.8}
            >
              <View style={styles.quickCardHeader}>
                <AlertTriangleIcon size={22} color={theme.colors.danger} />
                <Text style={[styles.quickCardCode, { color: theme.colors.danger }]}>
                  02/SOS
                </Text>
              </View>
              <Text style={[styles.quickCardTitle, { color: theme.colors.danger }]}>
                ALERTA SOS
              </Text>
              <Text style={styles.quickCardDesc}>
                Disparo inmediato a tu círculo de rescate.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => setShowContactsModal(true)}
              activeOpacity={0.8}
            >
              <View style={styles.quickCardHeader}>
                <UsersIcon size={22} color="#FFFFFF" />
                <Text style={styles.quickCardCode}>03/NET</Text>
              </View>
              <Text style={styles.quickCardTitle}>CONTACTOS</Text>
              <Text style={styles.quickCardDesc}>
                {user?.contacts?.length || 0} personas en tu red de confianza.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => setShowIncidentModal(true)}
              activeOpacity={0.8}
            >
              <View style={styles.quickCardHeader}>
                <GeometricDiamond size={22} color={theme.colors.yellow} />
                <Text style={styles.quickCardCode}>04/REP</Text>
              </View>
              <Text style={styles.quickCardTitle}>REPORTAR</Text>
              <Text style={styles.quickCardDesc}>
                Informar anomalía o zona de riesgo.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </AnimatedFadeSlide>

      {/* Acceso a configuración */}
      <AnimatedFadeSlide delay={250} duration={500}>
        <View style={styles.configBanner}>
          <View style={styles.configBannerLeft}>
            <Text style={styles.configBannerTitle}>CONFIGURACIÓN DEL SISTEMA</Text>
            <Text style={styles.configBannerText}>
              Ajusta cuentas regresivas SOS, sirena, radio del radar y privacidad.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btnPrimaryYellow}
            onPress={() => navigation.navigate('SettingsTab')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryYellowText}>CONFIGURAR</Text>
            <SettingsIcon size={16} color="#000000" />
          </TouchableOpacity>
        </View>
      </AnimatedFadeSlide>

      {/* Modales */}
      <ContactsModal
        visible={showContactsModal}
        onClose={() => setShowContactsModal(false)}
      />

      <IncidentModal
        visible={showIncidentModal}
        currentLocation={null}
        onClose={() => setShowIncidentModal(false)}
        onReportSuccess={() => {
          Alert.alert(
            '// REPORTE REGISTRADO',
            'Tu incidencia fue agregada a la red de protección vecinal.'
          );
        }}
      />
      <Modal visible={showWelcomeGuide} animationType="fade" onRequestClose={dismissWelcomeGuide}>
        <View style={styles.guideScreen}>
          <View style={styles.guideTop}>
            <Text style={styles.guideBrand}>RUTEX // GUÍA</Text>
            <TouchableOpacity onPress={dismissWelcomeGuide} accessibilityLabel="Cerrar guía">
              <Text style={styles.guideSkip}>OMITIR</Text>
            </TouchableOpacity>
          </View>
          <Animated.ScrollView contentContainerStyle={styles.guideContent} style={{ opacity: guideOpacity }}>
            <Text style={styles.guideCounter}>[{String(guideIndex + 1).padStart(2, '0')} / 04]</Text>
            <Text style={styles.guideTitle}>{guidePages[guideIndex].title}</Text>
            <Text style={styles.guideBody}>{guidePages[guideIndex].body}</Text>
            <View style={styles.guideDetails}>
              {guidePages[guideIndex].details.map((detail, index) => (
                <View key={`${guideIndex}-${index}`} style={styles.guideDetailRow}>
                  <View style={styles.guideBullet} />
                  <Text style={styles.guideDetailText}>{detail}</Text>
                </View>
              ))}
            </View>
          </Animated.ScrollView>
          <View style={styles.guideFooter}>
            <View style={styles.guideDots}>
              {guidePages.map((_, index) => (
                <TouchableOpacity key={index} onPress={() => changeGuidePage(index)} style={[styles.guideDot, index === guideIndex && styles.guideDotActive]} />
              ))}
            </View>
            <View style={styles.guideControls}>
              {guideIndex > 0 ? <TouchableOpacity style={styles.guidePrev} onPress={() => changeGuidePage(guideIndex - 1)}><Text style={styles.guidePrevText}>ANTERIOR</Text></TouchableOpacity> : <View />}
              <TouchableOpacity style={styles.guideNext} onPress={() => guideIndex === guidePages.length - 1 ? dismissWelcomeGuide() : changeGuidePage(guideIndex + 1)}>
                <Text style={styles.guideNextText}>{guideIndex === guidePages.length - 1 ? 'COMENZAR' : 'SIGUIENTE'}</Text>
                <ArrowRightIcon size={17} color="#000000" />
              </TouchableOpacity>
            </View>
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

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: '#262626',
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandBadge: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  brandBadgeText: {
    fontFamily: theme.fonts.h1,
    fontSize: 14,
    color: '#000000',
  },
  appName: {
    fontFamily: theme.fonts.h1,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  appTagline: {
    fontFamily: theme.fonts.bodySemiBold,
    fontSize: 10,
    color: '#737373',
    letterSpacing: 1,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#121212',
    borderWidth: 1.5,
    borderColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Barra de estado
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderWidth: 1.5,
    borderColor: '#262626',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusSquare: {
    width: 8,
    height: 8,
    backgroundColor: theme.colors.success,
    marginRight: 10,
  },
  statusUser: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  statusPill: {
    backgroundColor: '#171717',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#333333',
  },
  statusPillText: {
    fontFamily: theme.fonts.bodySemiBold,
    fontSize: 9,
    color: theme.colors.yellow,
    letterSpacing: 1,
  },

  // Hero Section
  heroBox: {
    backgroundColor: '#0A0A0A',
    borderWidth: 2,
    borderColor: '#262626',
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  hero3DContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.35,
    zIndex: 1,
  },
  heroContent: {
    padding: 24,
    position: 'relative',
    zIndex: 2,
  },
  heroTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 16,
  },
  heroTagText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 10,
    color: theme.colors.yellow,
    letterSpacing: 1.5,
  },
  heroH1: {
    fontFamily: theme.fonts.h1,
    fontSize: 28,
    lineHeight: 34,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  heroH1Highlight: {
    color: theme.colors.yellow,
  },
  heroParagraph: {
    fontFamily: theme.fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: '#A3A3A3',
    marginBottom: 22,
  },
  heroActions: {
    flexDirection: 'row',
  },

  // Botones Amarillos Brutalistas
  btnPrimaryYellow: {
    backgroundColor: theme.colors.yellow,
    paddingVertical: 14,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#000000',
    elevation: 0,
    shadowOpacity: 0,
  },
  btnPrimaryYellowText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 13,
    color: '#000000',
    letterSpacing: 1,
  },

  // Secciones Generales
  sectionHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  sectionIndex: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: theme.colors.yellow,
    letterSpacing: 1,
  },
  sectionTitle: {
    fontFamily: theme.fonts.h2,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },

  // Grilla Rápida
  gridSection: {
    marginBottom: 24,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickCard: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: '#0F0F0F',
    borderWidth: 1.5,
    borderColor: '#262626',
    padding: 16,
  },
  quickCardMap: {
    borderColor: theme.colors.yellow,
  },
  quickCardSos: {
    borderColor: theme.colors.danger,
    backgroundColor: '#140505',
  },
  quickCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickCardCode: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 10,
    color: '#737373',
    letterSpacing: 1,
  },
  quickCardTitle: {
    fontFamily: theme.fonts.h3,
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 4,
  },
  quickCardDesc: {
    fontFamily: theme.fonts.body,
    fontSize: 12,
    color: '#A3A3A3',
    lineHeight: 16,
  },

  // Estadísticas
  statsBlock: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1.5,
    borderColor: '#262626',
    backgroundColor: '#0A0A0A',
    marginBottom: 28,
  },
  statCell: {
    flexBasis: '50%',
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#1C1C1C',
  },
  statNumber: {
    fontFamily: theme.fonts.h1,
    fontSize: 24,
    color: theme.colors.yellow,
    letterSpacing: 1,
  },
  statLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 4,
    letterSpacing: 1,
  },
  statSub: {
    fontFamily: theme.fonts.body,
    fontSize: 10,
    color: '#737373',
  },

  // Sección de Pilares
  sectionBlock: {
    marginBottom: 28,
  },
  featuresStack: {
    gap: 12,
  },
  featureRow: {
    backgroundColor: '#0D0D0D',
    borderWidth: 1.5,
    borderColor: '#262626',
    padding: 18,
    flexDirection: 'row',
  },
  featureCodeBox: {
    width: 44,
    marginRight: 16,
    alignItems: 'center',
    gap: 6,
  },
  featureCodeText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    color: '#737373',
    letterSpacing: 1,
  },
  featureContentBox: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: theme.fonts.h2,
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 6,
  },
  featureDesc: {
    fontFamily: theme.fonts.body,
    fontSize: 13,
    color: '#A3A3A3',
    lineHeight: 19,
  },

  // Sobre Nosotros
  aboutBlock: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1.5,
    borderColor: '#262626',
    padding: 20,
    marginBottom: 28,
  },
  aboutBody: {
    fontFamily: theme.fonts.body,
    fontSize: 14,
    color: '#D4D4D4',
    lineHeight: 22,
    marginBottom: 20,
  },
  aboutHighlight: {
    fontFamily: theme.fonts.bodyBold,
    color: theme.colors.yellow,
  },
  aboutTriad: {
    gap: 10,
  },
  triadCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    padding: 14,
  },
  triadTitle: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: theme.colors.yellow,
    letterSpacing: 1,
    marginBottom: 4,
  },
  triadText: {
    fontFamily: theme.fonts.body,
    fontSize: 12,
    color: '#A3A3A3',
    lineHeight: 17,
  },

  // Testimonios
  testimonialsStack: {
    gap: 12,
  },
  testCard: {
    backgroundColor: '#0D0D0D',
    borderWidth: 1.5,
    borderColor: '#262626',
    padding: 18,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  testName: {
    fontFamily: theme.fonts.h3,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  testRole: {
    fontFamily: theme.fonts.body,
    fontSize: 11,
    color: '#737373',
  },
  testBadge: {
    backgroundColor: '#1F1F1F',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#333333',
  },
  testBadgeText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 9,
    color: theme.colors.yellow,
    letterSpacing: 1,
  },
  testStars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 10,
  },
  testComment: {
    fontFamily: theme.fonts.body,
    fontSize: 13,
    color: '#E5E5E5',
    lineHeight: 20,
  },

  // FAQ
  faqStack: {
    gap: 10,
  },
  faqCard: {
    backgroundColor: '#0D0D0D',
    borderWidth: 1.5,
    borderColor: '#262626',
    padding: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQ: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    flex: 1,
    marginRight: 12,
  },
  faqA: {
    fontFamily: theme.fonts.body,
    fontSize: 13,
    color: '#A3A3A3',
    lineHeight: 19,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#262626',
  },

  // Configuración Banner Final
  configBanner: {
    backgroundColor: '#0F0F0F',
    borderWidth: 2,
    borderColor: theme.colors.yellow,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  configBannerLeft: {
    flex: 1,
    minWidth: 220,
  },
  configBannerTitle: {
    fontFamily: theme.fonts.h2,
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  configBannerText: {
    fontFamily: theme.fonts.body,
    fontSize: 12,
    color: '#A3A3A3',
    marginTop: 4,
    lineHeight: 17,
  },
  guideScreen: {
    flex: 1,
    backgroundColor: '#050505',
    paddingTop: 52,
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  guideTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  guideBrand: {
    fontFamily: theme.fonts.h2,
    color: theme.colors.yellow,
    fontSize: 13,
    letterSpacing: 2,
  },
  guideSkip: {
    fontFamily: theme.fonts.bodyBold,
    color: '#A3A3A3',
    fontSize: 11,
    letterSpacing: 1,
    padding: 8,
  },
  guideContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 30,
  },
  guideCounter: {
    color: theme.colors.yellow,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 18,
  },
  guideTitle: {
    color: '#FFFFFF',
    fontFamily: theme.fonts.h1,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: 1,
    marginBottom: 16,
  },
  guideBody: {
    color: '#B8B8B8',
    fontFamily: theme.fonts.body,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 24,
  },
  guideDetails: {
    gap: 12,
  },
  guideDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#101010',
    borderWidth: 1,
    borderColor: '#252525',
    padding: 14,
    gap: 12,
  },
  guideBullet: {
    width: 7,
    height: 7,
    backgroundColor: theme.colors.yellow,
    marginTop: 5,
  },
  guideDetailText: {
    flex: 1,
    color: '#E5E5E5',
    fontFamily: theme.fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
  guideFooter: {
    borderTopWidth: 1,
    borderTopColor: '#262626',
    paddingTop: 18,
  },
  guideDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 18,
  },
  guideDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#444444',
  },
  guideDotActive: {
    width: 22,
    backgroundColor: theme.colors.yellow,
  },
  guideControls: {
    minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guidePrev: {
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  guidePrevText: {
    color: '#A3A3A3',
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
  },
  guideNext: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: theme.colors.yellow,
    paddingHorizontal: 20,
  },
  guideNextText: {
    color: '#000000',
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
  },
});

export default LandingScreen;
