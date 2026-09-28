# PROMPT CONTRACT

Cada instrucción para el agente debe usar esta estructura:

```text
TASK: tarea concreta del turno.
RULESET: reglas necesarias.
SCOPE: archivos o carpetas que puede tocar.
ACCEPTANCE: condiciones verificables de finalización.
STOP: punto exacto donde debe detenerse.
DOC: YES | NO
CONTEXT: MINIMAL | AUTO | DEEP
VERIFY: TARGETED | DOMAIN | UI | FULL
GIT: NONE | mensaje solicitado
```

## Política

- `SCOPE` limita la exploración y evita cambios innecesarios.
- `ACCEPTANCE` debe describir resultados comprobables.
- `STOP` impide que el agente comience otra fase sin autorización.
- `CONTEXT: MINIMAL` es el valor inicial recomendado.
- `VERIFY` debe corresponder al riesgo del cambio.
- No repetir en el prompt información que ya esté documentada en los context packs.
