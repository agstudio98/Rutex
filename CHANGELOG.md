# Historial de cambios

Los cambios visibles de Rutex se registran aquí por versión. El formato sigue [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) y las versiones siguen SemVer.

## [Unreleased]

Cambios posteriores a la primera beta.

## [0.1.0-beta.1] - 2026-11-13

### Añadido

- Registro e inicio de sesión con correo y contraseña, con reglas de nombre y robustez de contraseña.
- Inicio de sesión con Google mediante ID token y validación en el backend.
- Inicio operativo con accesos a trayecto, mapa, SOS, contactos, reportes y configuración.
- Guía de bienvenida a pantalla completa, navegable como carrusel y con transiciones fade.
- Mapa comunitario con incidencias georreferenciadas y búsqueda por proximidad.
- Sesiones de acompañamiento con ubicación GPS y eventos Socket.IO en vivo.
- Alerta SOS dentro de una sesión activa y cierre del trayecto.
- Gestión de contactos de confianza y ajustes de perfil, mapa, ubicación y alertas.
- Cliente móvil multiplataforma con una vista de mapa adaptada a web.

### Seguridad y configuración

- Contraseñas hasheadas con bcryptjs y sesiones de Rutex firmadas con JWT.
- Validación en el servidor de emisor, audiencia, firma y correo verificado de los ID tokens de Google.
- Variables de entorno locales excluidas del repositorio mediante `.gitignore`.
