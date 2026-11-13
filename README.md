# Rutex

**Versión 0.1.0-beta.1** · Aplicación de seguridad urbana comunitaria para Android, iOS y web.

Rutex combina un mapa de incidencias, acompañamiento de trayectos en vivo, alertas SOS y una red de contactos de confianza. Esta versión beta incluye una app Expo/React Native y una API Node.js con MongoDB y Socket.IO.

## Prestaciones de la beta

- **Acceso y cuentas:** registro con correo, inicio de sesión con contraseña o Google, perfil y cierre de sesión. Las contraseñas nuevas requieren 8 caracteres o más, mayúscula, minúscula, número y símbolo. El nombre admite letras, espacios, apóstrofes y guiones.
- **Inicio operativo:** acceso rápido a iniciar trayecto, mapa, SOS, contactos, reportes y ajustes del sistema.
- **Guía de bienvenida:** carrusel de pantalla completa con transiciones fade sobre arquitectura de operaciones, Rutex, experiencias y preguntas frecuentes. Aparece después de un login o registro nuevo.
- **Mapa comunitario:** ubicación del usuario, consulta de incidencias cercanas y reportes georreferenciados de riesgos urbanos.
- **Acompañamiento en vivo:** vista de trayecto con ubicación GPS y transmisión por Socket.IO. Permite emitir una alerta SOS durante una sesión y finalizar el recorrido al llegar.
- **Contactos de confianza:** gestión de contactos registrados por correo electrónico.
- **Configuración:** perfil, radio del radar, preferencias de ubicación y opciones de alertas SOS.
- **Interfaz multiplataforma:** React Native Maps en móvil y vista OpenStreetMap en web.

> Rutex 0.1.0-beta.1 es una beta. La disponibilidad del mapa, GPS, OAuth y datos compartidos depende de la configuración de cada entorno y sus servicios.

## Arquitectura

```text
Rutex/
├── backend/   API REST, autenticación, MongoDB y Socket.IO
└── mobile/    Aplicación Expo para Android, iOS y web
```

| Componente | Tecnologías principales |
|---|---|
| App | Expo SDK 57, React Native, React Navigation |
| Ubicación y mapas | `expo-location`, `react-native-maps`, OpenStreetMap web |
| API | Node.js, Express, Mongoose |
| Tiempo real | Socket.IO |
| Seguridad | JWT, bcryptjs, validación de ID tokens de Google en el servidor |

## Requisitos

- Node.js y npm compatibles con Expo SDK 57.
- MongoDB local o una URI accesible. En desarrollo existe un fallback opcional a MongoDB en memoria si está instalada la dependencia correspondiente.
- Credenciales OAuth 2.0 de Google para las plataformas que se quieran habilitar.
- En un dispositivo físico, teléfono y computadora en la misma red local.

## Puesta en marcha

### 1. Backend

```bash
cd backend
npm install
cp -n .env.example .env
```

Completá `MONGO_URI`, `JWT_SECRET` y los Client IDs OAuth que correspondan. `GOOGLE_WEB_CLIENT_ID` debe ser el mismo Client ID configurado para la web. El secreto de cliente, si se configura, se guarda solo en `backend/.env`; nunca se publica en variables `EXPO_PUBLIC_*`.

```bash
npm run dev
```

La API queda disponible por defecto en `http://localhost:5000`. Comprobación de estado: `GET /api/health`.

### 2. App

```bash
cd mobile
npm install
cp -n .env.example .env
```

Completá las variables públicas OAuth necesarias en `mobile/.env`:

```dotenv
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
```

Configurá los mismos Client IDs en el `.env` del backend. Para web, registrá el origen de desarrollo y los dominios publicados en Google Cloud Console. Para Android/iOS, configurá los identificadores de la app y las credenciales de firma. Reiniciá Expo cuando cambies variables de entorno.

```bash
npx expo start
```

Para desarrollo web con caché limpia:

```bash
npx expo start --web --clear
```

### Conexión desde un teléfono físico

En [`mobile/src/config/constants.js`](./mobile/src/config/constants.js), reemplazá `DEV_MACHINE_IP = null` por la IP local de la computadora, por ejemplo `192.168.1.50`. La configuración predeterminada usa `10.0.2.2` para el emulador Android y `localhost` para web/iOS Simulator.

## API y tiempo real

### Autenticación (`/api/auth`)

- `POST /register` — crea una cuenta con nombre, correo, contraseña y teléfono.
- `POST /login` — inicia sesión con correo y contraseña.
- `POST /google` — recibe un ID token de Google, valida firma, audiencia, emisor y correo verificado, y emite un JWT de Rutex.
- `GET /profile`, `PUT /profile` — consulta y actualiza el perfil (requieren JWT).
- `POST /contacts` — agrega un contacto existente por correo (requiere JWT).

### Incidencias (`/api/incidences`)

- `GET /` — lista incidencias.
- `GET /nearby?lat={lat}&lng={lng}&distance={metros}` — busca incidencias cercanas.
- `POST /` — crea una incidencia (requiere JWT).

### Trayectos (`/api/routes`)

- `POST /` — crea una sesión de acompañamiento (requiere JWT).
- `GET /active/current` — consulta la sesión activa.
- `GET /:id` — obtiene el detalle de una sesión.
- `PATCH /:id/status` — actualiza el estado de la sesión.

Socket.IO comunica la entrada y salida de acompañantes, las actualizaciones de coordenadas, alertas de emergencia y finalización de la sesión. Los eventos principales son `join_route`, `leave_route`, `location_update`, `emergency_alert` y `finish_route`.

## Estructura de ramas y versiones

Para el desarrollo compartido, usar esta convención:

- `main`: versiones estables y releases publicados.
- `develop`: integración del próximo release.
- `feature/<tema>`: funcionalidades nuevas desde `develop`.
- `fix/<tema>`: correcciones desde `develop`.
- `release/<version>`: estabilización y documentación de una versión.
- `hotfix/<tema>`: correcciones urgentes desde `main`.

Los releases usan etiquetas SemVer, por ejemplo `v0.1.0-beta.1`. Cada release debe actualizar este README y [`CHANGELOG.md`](./CHANGELOG.md), describir cambios y limitaciones, y pasar revisión antes de integrarse a `main`.

## Documentación

- [Backend: instalación, endpoints y eventos](./backend/README.md)
- [App móvil: configuración de Expo](./mobile/README.md)
- [Historial de versiones](./CHANGELOG.md)
- [Contribuciones y flujo de ramas](./CONTRIBUTING.md)
