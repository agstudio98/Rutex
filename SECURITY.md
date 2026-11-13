# Seguridad

Rutex está en beta. No uses la aplicación para responder a una emergencia real ni compartas ubicaciones de personas sin su consentimiento.

## Reportar una vulnerabilidad

No publiques credenciales, tokens ni detalles que permitan explotar una vulnerabilidad en un issue público. Usá la opción **Report a vulnerability** de GitHub si está habilitada en el repositorio; si no, contactá en privado a sus mantenedores antes de divulgarla.

## Secretos y datos

- Nunca subas archivos `.env`, claves OAuth, JWT secrets, credenciales de base de datos ni certificados de firma.
- Las variables `EXPO_PUBLIC_*` quedan incluidas en el bundle cliente y no deben contener secretos.
- Los tokens de Google se validan en el backend. El Client ID puede ser público; el Client Secret, si se usa, debe permanecer solo en el backend.
- Evitá incluir ubicaciones, teléfonos, correos u otros datos personales en logs, issues o capturas.
