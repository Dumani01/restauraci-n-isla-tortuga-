# Contrato de IA — Restauración Coralina

## Endpoint

- Método: `POST`
- URL frontend: `VITE_N8N_AI_WEBHOOK_URL`
- Ruta sugerida en n8n: `/webhook/coral-assistant`
- Timeout frontend: 30 segundos

React solo conoce el webhook de n8n. La clave del proveedor y el prompt de sistema viven en n8n.

## Request

```json
{
  "message": "¿Qué es la restauración coralina?",
  "language": "es",
  "role": "USER",
  "context": {
    "page": "restoration",
    "restorationZoneId": "demo-restoration-zone"
  },
  "requestId": "uuid"
}
```

`message` es obligatorio y admite hasta 2000 caracteres. `language` admite `es`, `en`, `fr`, `de` y `pt`. El contexto es opcional y debe contener solo información pública y relevante.

## Response

Éxito:

```json
{
  "success": true,
  "answer": "Respuesta en el idioma solicitado.",
  "requestId": "uuid",
  "sources": []
}
```

Error:

```json
{
  "success": false,
  "answer": "",
  "requestId": "uuid",
  "error": "INVALID_INPUT"
}
```

Errores normalizados: `INVALID_INPUT`, `AI_TIMEOUT`, `AI_SERVICE_UNAVAILABLE`, `N8N_UNAVAILABLE`, `INVALID_RESPONSE`, `RATE_LIMIT` y `UNKNOWN_ERROR`.

## Seguridad y límites

- No enviar contraseñas, tokens, credenciales, usuarios completos ni datos administrativos innecesarios.
- El rol sirve para contexto; la IA nunca concede permisos.
- No usar `VITE_*` para claves del proveedor.
- La clave debe configurarse en credenciales o variables seguras de n8n.
- El workflow debe limitar CORS al origen del frontend y aplicar rate limiting antes de publicarse.
- React no renderiza Markdown con `dangerouslySetInnerHTML`.

## Contexto permitido

El workflow puede recibir información pública puntual de una página o zona seleccionada. No debe recibir automáticamente todo `db.json`, el mapa completo, credenciales ni observaciones privadas no necesarias.
