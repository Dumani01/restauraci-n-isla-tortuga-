# AGENTS.md

## Proyecto

Restauración Carolina es un prototipo React para dar seguimiento a la restauración coralina y evaluar preliminarmente el uso de arrecifes artificiales en Isla Tortuga y el Golfo de Nicoya.

## Reglas permanentes

- Trabajar una fase por turno y detenerse al terminarla.
- No inventar datos reales de campo, especies confirmadas, coordenadas sensibles ni resultados científicos.
- Distinguir siempre datos demo de datos verificados.
- La IA solo resume información recibida o detecta campos incompletos; no diagnostica enfermedades ni recomienda intervenciones biológicas.
- Mantener la aplicación funcional aunque n8n o un servicio externo no esté disponible.
- Usar React, React Router DOM y JavaScript salvo que exista una razón documentada para cambiar.
- Priorizar componentes simples, accesibilidad, responsive y datos trazables.
- Revisar `PROJECT_STATE.md` antes de trabajar y actualizarlo después de cambios materiales.

## Verificación mínima

```bash
npm run test
npm run build
```

## Estado actual

La base de la Fase -1 ya contiene rutas públicas y privadas, login demo, datos demo, mapa simulado, dashboard y formulario inicial de observaciones. La siguiente fase de desarrollo es la Fase 1 de modelo de dominio y datos.
