# Rutex Backend 🛡️

Servicio backend para **Rutex**, plataforma de seguridad urbana, acompañamiento en tiempo real y mapas comunitarios.

**Versión 0.1.0 Beta.** Consultá las prestaciones generales en el [README principal](../README.md) y el detalle de cambios en [`CHANGELOG.md`](../CHANGELOG.md).

## Tecnologías
- **Node.js** & **Express**
- **MongoDB** & **Mongoose** (Índices geoespaciales `2dsphere` y GeoJSON)
- **Socket.io** (Salas de trayecto y alertas de pánico en tiempo real)
- **JWT** (Autenticación y protección de endpoints)
- **Bcryptjs** (Hasheo seguro de contraseñas)
- **Google OAuth** (validación criptográfica de ID tokens y correo verificado)

---

## Estructura de Directorios

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Conexión a MongoDB
│   ├── controllers/
│   │   ├── authController.js     # Registro, login, perfil y contactos
│   │   ├── incidenceController.js# Creación y consultas geoespaciales ($near)
│   │   └── routeController.js    # Sesiones de trayecto y estados
│   ├── middlewares/
│   │   └── authMiddleware.js     # Verificación de JWT Bearer Token
│   ├── models/
│   │   ├── User.js               # Esquema de usuario y lista de contactos
│   │   ├── RouteSession.js       # Esquema de trayecto (GeoJSON + estado)
│   │   └── Incidence.js          # Esquema de incidencias comunitarias (2dsphere)
│   ├── routes/
│   │   ├── authRoutes.js         # Endpoints /api/auth
│   │   ├── incidenceRoutes.js    # Endpoints /api/incidences
│   │   └── routeRoutes.js        # Endpoints /api/routes
│   ├── sockets/
│   │   └── routeSocket.js        # Eventos WebSocket (join_route, location_update, emergency_alert)
│   ├── app.js                    # Configuración de Express y middlewares
│   └── server.js                 # Entrada del servidor HTTP y Socket.io
├── .env.example
├── package.json
└── README.md
```

---

## Instalación y Ejecución

```bash
cd backend
npm install

# Copiar variables de entorno
cp -n .env.example .env

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en producción
npm start
```

El servidor carga `backend/.env` desde la ruta del proyecto, independientemente del directorio desde el que se ejecute. `GOOGLE_WEB_CLIENT_ID`, `GOOGLE_ANDROID_CLIENT_ID` y `GOOGLE_IOS_CLIENT_ID` deben coincidir con los clientes usados por la app. El Client Secret no se envía a la app; el endpoint de Google valida el ID token recibido.

---

## Endpoints REST Principales

### Autenticación (`/api/auth`)
- `POST /api/auth/register`: `{ name, email, password, phone }`
- `POST /api/auth/login`: `{ email, password }`
- `POST /api/auth/google`: `{ idToken }` — valida la identidad Google y devuelve un JWT de Rutex.
- `GET /api/auth/profile`: (Requiere Bearer Token)
- `POST /api/auth/contacts`: `{ contactEmail }` (Requiere Bearer Token)

### Incidencias Comunitarias (`/api/incidences`)
- `POST /api/incidences`: `{ type, description, latitude, longitude }` (Requiere Bearer Token)
- `GET /api/incidences/nearby?lat=-34.6037&lng=-58.3816&distance=5000`: Consulta incidencias en un radio en metros.
- `GET /api/incidences`: Lista incidencias recientes.

### Rutas y Acompañamiento (`/api/routes`)
- `POST /api/routes`: `{ origin: { latitude, longitude }, destination: { latitude, longitude } }`
- `GET /api/routes/:id`: Detalle de la sesión.
- `PATCH /api/routes/:id/status`: `{ status: 'completed' | 'alert' | 'active', reason }`
- `GET /api/routes/active/current`: Sesión activa del usuario.

---

## Eventos WebSocket (`Socket.io`)

| Evento | Dirección | Parámetros / Payload | Descripción |
|---|---|---|---|
| `join_route` | Cliente -> Servidor | `{ sessionId, userName, role }` | Une el socket a la sala `route_SESSION_ID` |
| `companion_joined` | Servidor -> Sala | `{ socketId, userName, role }` | Notifica que un contacto se unió |
| `location_update` | Cliente -> Servidor | `{ sessionId, latitude, longitude, speed, heading }` | Envía coordenadas actuales del usuario |
| `route_location_updated` | Servidor -> Sala | `{ sessionId, latitude, longitude, speed, heading, timestamp }` | Retransmite coordenadas en vivo a acompañantes |
| `emergency_alert` | Cliente -> Servidor | `{ sessionId, reason, latitude, longitude }` | Dispara estado de alerta y pánico |
| `route_emergency_alert` | Servidor -> Sala | `{ sessionId, status, reason, location, timestamp }` | Alerta inmediata a todos los contactos en la sala |
| `finish_route` | Cliente -> Servidor | `{ sessionId }` | Marca la sesión como completada |
