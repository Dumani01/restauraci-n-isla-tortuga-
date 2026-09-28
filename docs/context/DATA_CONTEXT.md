# DATA CONTEXT

## Entidades

`users`, `zones`, `structures`, `corals`, `observations`, `maintenance`, `activities`, `news`, `media`, `alerts` y `auditEvents`.

## Relaciones principales

- Una zona puede contener estructuras.
- Una estructura pertenece a una zona.
- Un coral puede asociarse a una zona y una estructura.
- Una observación pertenece a un coral, una fecha y un observador.
- Los indicadores deben considerar registros válidos y comparables.

## Calidad

Los registros sin fecha, autor, estado, relación o evidencia requerida deben quedar pendientes de revisión.
