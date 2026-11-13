# Rutex Mobile 🛡️📱

**Versión 0.1.0 Beta.** Para el alcance del release, requisitos y API consultá el [README principal](../README.md).

Aplicación móvil desarrollada con **React Native** y **Expo** para la plataforma **Rutex**, orientada a la seguridad urbana mediante acompañamiento en tiempo real, mapas comunitarios de incidencias y alertas de pánico.

---

## 🚀 Tecnologías y Librerías

- **Framework:** [Expo](https://expo.dev/) (SDK 57) & **React Native** (0.86)
- **Tipografías:** Google Fonts **Nunito** (para H1 y encabezados) y **Work Sans** (para párrafos, enlaces y controles)
- **Diseño & Estética:** Brutalismo ultra moderno, minimalista, formas geométricas, paleta negra profunda `#000000`, botones amarillos `#FFE600`, sin sombras
- **3D & Animación:** `Three.js` (WebGL en web y motor geométrico proyectado nativo) con formas volumétricas 3D y transiciones con slides y fades
- **Iconos:** Iconografía geométrica monocromática SVG con `react-native-svg`
- **Navegación:** `@react-navigation/native`, `@react-navigation/native-stack` & `@react-navigation/bottom-tabs`
- **Mapas:** `react-native-maps` (Android/iOS) y fallback interactivo OpenStreetMap para Web
- **Geolocalización:** `expo-location` (Rastreo continuo de coordenadas y precisión)
- **Comunicación en Tiempo Real:** `socket.io-client`
- **Cliente HTTP:** `axios` con interceptores de autenticación JWT
- **Persistencia Local:** `@react-native-async-storage/async-storage`
- **Google OAuth:** Google Identity Services en web y `expo-auth-session` en móvil; el backend verifica el ID token
- **Autenticación Google:** `expo-auth-session` con token de identidad verificado por el backend

---

## 📁 Estructura del Proyecto

```
mobile/
├── assets/                       # Iconos y splash screens de la aplicación
├── src/
│   ├── components/               # Componentes reutilizables
│   │   ├── IncidentModal.js      # Modal para reportar incidencias comunitarias
│   │   ├── ContactsModal.js      # Modal para ver y agregar contactos de confianza
│   │   └── PanicButton.js        # Botón de pánico/alerta con confirmación visual
│   ├── config/
│   │   └── constants.js          # Configuración de URLs, IPs y tipos de incidencias
│   ├── context/
│   │   └── AuthContext.js        # Proveedor de estado global de autenticación (JWT) y settings
│   ├── navigation/
│   │   └── AppNavigator.js       # Navegación con pilas de autenticación y Bottom Tabs
│   ├── screens/                  # Vistas principales
│   │   ├── LoginScreen.js        # Inicio de sesión
│   │   ├── RegisterScreen.js     # Registro de nuevos usuarios
│   │   ├── LandingScreen.js      # Pantalla de inicio tipo landing (de qué trata, sobre nosotros, experiencias, accesos rápidos)
│   │   ├── HomeScreen.js         # Mapa comunitario, geolocalización en vivo y reporte de alertas
│   │   ├── SettingsScreen.js     # Configuraciones completas (perfil, alertas SOS, radio de detección, privacidad, caché)
│   │   └── ActiveRouteScreen.js  # Pantalla de acompañamiento en vivo y transmisión GPS
│   └── services/                 # Servicios de infraestructura
│       ├── api.js                # Cliente Axios con inyección de Bearer Token y actualización de perfil
│       └── socket.js             # Gestor de conexiones y eventos de Socket.io
├── app.json                      # Configuración de Expo y permisos de geolocalización
├── babel.config.js               # Configuración del transpilador Babel
├── package.json                  # Dependencias y scripts
├── App.js                        # Punto de entrada de la aplicación
└── README.md                     # Documentación de la app móvil
```

---

## ⚙️ Configuración de Conexión con el Backend

El archivo [`src/config/constants.js`](./src/config/constants.js) administra la URL base para el cliente REST y WebSockets:

```javascript
// Si usas Expo Go en un celular físico (misma red Wi-Fi):
// Colocá la IP local de tu computadora:
export const DEV_MACHINE_IP = '192.168.1.50'; // Reemplazá con tu IP local

// Si usas el Emulador de Android oficial:
// Dejá DEV_MACHINE_IP = null y automáticamente conectará a 10.0.2.2:5000
```

### Acceso con Google

Si todavía no existe, creá `.env` con `cp -n .env.example .env` y completá los Client IDs OAuth 2.0 de Web, Android e iOS según las plataformas que publiques. Configurá los mismos IDs en `backend/.env` (ver `backend/.env.example`) para que el servidor valide el token de Google. Reiniciá Expo después de cambiar variables `EXPO_PUBLIC_*`. Para compilar en Android/iOS, registrá en Google Cloud los identificadores de paquete y las huellas de firma que uses.

El registro con correo requiere un nombre de 2 a 50 letras (admite espacios, apóstrofes y guiones) y una contraseña de al menos 8 caracteres con mayúscula, minúscula, número y símbolo.

---

## 📦 Instalación y Ejecución

### 1. Instalar dependencias
```bash
cd mobile
npm install
```

### 2. Iniciar el entorno de Expo
```bash
npm start
# o
npx expo start
```

### 3. Probar la aplicación:
- **En Android (Emulador):** Presiona `a` en la terminal.
- **En iOS (Simulador Mac):** Presiona `i` en la terminal.
- **En dispositivo físico:** Escanea el código QR desde la aplicación **Expo Go** (asegúrate de que el celular y la PC estén en la misma red Wi-Fi y configurá `DEV_MACHINE_IP`).

---

## 🔒 Permisos Requeridos

En [`app.json`](./app.json) se configuran los permisos necesarios para la geolocalización:
- **Android:** `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `ACCESS_BACKGROUND_LOCATION`.
- **iOS:** `NSLocationWhenInUseUsageDescription` y `NSLocationAlwaysAndWhenInUseUsageDescription`.

---

## 🔄 Flujo de Trabajo en la App

1. **Autenticación (`LoginScreen` / `RegisterScreen`):**
   - El usuario crea una cuenta con correo y contraseña o inicia sesión con Google.
   - El registro valida el nombre y requiere una contraseña con mayúscula, minúscula, número y símbolo.
   - El token JWT y los datos del perfil se guardan localmente en `AsyncStorage`.
2. **Pantalla de Inicio / Landing (`LandingScreen`):**
   - Inicio operativo con accesos a iniciar trayecto, mapa, SOS, contactos, reportes y configuración.
   - Después de un nuevo login o registro muestra una guía informativa en carrusel a pantalla completa.
3. **Mapa Comunitario (`HomeScreen`):**
   - Solicita permisos de ubicación y centra la vista en las coordenadas del usuario.
   - Consulta incidencias en el radio configurado (`GET /api/incidences/nearby`).
   - Muestra pines coloreados por tipo de alerta: falla de luz, actividad sospechosa, arrebatos, etc.
   - Permite reportar anomalías georreferenciadas con el botón **Reportar Peligro**.
   - Permite gestionar **Contactos de Confianza** (agregar correos de familiares/amigos).
4. **Configuraciones (`SettingsScreen`):**
   - Edición de perfil de usuario (nombre y teléfono) con sincronización en backend y almacenamiento local.
   - Ajustes del **Botón SOS**: cuenta regresiva (0s, 3s, 5s), sirena sonora, vibración y aviso automático.
   - Preferencias del mapa: radio de detección (1 km a 10 km), alertas sonoras de proximidad y tipo de mapa.
   - Privacidad: activación de GPS únicamente durante trayectos activos y alta precisión.
   - Modales informativos de soporte y políticas de privacidad, junto a botón seguro de cierre de sesión.
5. **Acompañamiento en Vivo (`ActiveRouteScreen`):**
   - Al pulsar **Iniciar Trayecto**, se crea una sesión de ruta en el backend (`POST /api/routes`).
   - Se abre un socket en la sala `route_SESSION_ID`.
   - `expo-location` rastrea las coordenadas continuamente y las emite con `location_update`.
   - Se dibuja una polilínea hacia el destino seguro.
   - Si ocurre una situación de riesgo, el **Botón de Pánico (SOS)** dispara `emergency_alert` en tiempo real y notifica a la sala.
   - Al llegar a destino, el botón **Llegué Seguro** finaliza la sesión (`finish_route`).
