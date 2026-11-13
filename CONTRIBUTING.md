# Contribuir a Rutex

Gracias por ayudar a mejorar Rutex. Este flujo mantiene cambios pequeños, revisables y asociados a una versión.

## Ramas

- `main`: releases estables; cada release debe tener una etiqueta SemVer.
- `develop`: integración del próximo release.
- `feature/<tema>`: funcionalidad nueva, creada desde `develop`.
- `fix/<tema>`: corrección normal, creada desde `develop`.
- `release/<version>`: estabilización, documentación y ajustes de una versión.
- `hotfix/<tema>`: corrección urgente, creada desde `main` y luego integrada en `develop`.

Ejemplos: `feature/google-sign-in`, `fix/logout-navigation`, `release/0.1.0-beta.1`.

## Commits

Usá mensajes breves en formato Conventional Commits:

```text
feat(auth): add Google sign-in
fix(map): handle missing location permission
docs(readme): document beta setup
```

Prefijos recomendados: `feat`, `fix`, `docs`, `refactor`, `chore` y `security`.

## Pull requests

1. Creá una rama desde la rama base indicada.
2. Mantené el cambio enfocado y actualizá la documentación si cambia el comportamiento o la configuración.
3. Ejecutá las comprobaciones apropiadas para el área modificada y describí sus resultados en el PR.
4. Para cambios visuales, agregá capturas de móvil o web.
5. Solicitá revisión antes de integrar; los cambios a `main` se publican mediante un release.

No incluyas `.env`, tokens, contraseñas, datos personales, claves de firma ni artefactos locales. Usá los archivos `.env.example` para documentar nombres de variables sin valores reales.

## Publicar una versión

1. Creá `release/<version>` desde `develop`.
2. Revisá el alcance beta/estable, configuración limpia, documentación y resultados de las comprobaciones.
3. Actualizá `CHANGELOG.md` y las versiones de app y paquetes.
4. Integrá el release en `main` y `develop` mediante PR.
5. Etiquetá el commit publicado, por ejemplo `v0.1.0-beta.1`.
6. Publicá una GitHub Release con las notas del changelog y las limitaciones conocidas.

Para un repositorio compartido, protegé `main` y `develop` en GitHub y exigí PR y revisión antes de integrar.
