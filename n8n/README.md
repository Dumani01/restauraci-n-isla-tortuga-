# Integración local de n8n

La aplicación React ya consume el webhook `POST /webhook/coral-assistant` mediante `VITE_N8N_AI_WEBHOOK_URL`. El workflow `coral-assistant-workflow.json` valida el payload, construye un prompt controlado y devuelve la respuesta con el mismo `requestId` recibido.

## Arranque

1. Instala Docker Desktop.
2. Copia `n8n/.env.example` como `n8n/.env` y completa `N8N_ENCRYPTION_KEY` y `AI_API_KEY`. No subas ese archivo al repositorio.
3. Desde la raíz ejecuta `docker compose --env-file n8n/.env -f n8n/docker-compose.yml up -d`.
4. Abre `http://localhost:5678` y crea el usuario propietario de n8n.
5. Importa `n8n/coral-assistant-workflow.json` desde el menú de workflows.
6. Activa el workflow y copia la URL de producción del webhook.
7. En el `.env` local del frontend usa `VITE_N8N_AI_WEBHOOK_URL=http://localhost:5678/webhook/coral-assistant` y reinicia Vite.

### Alternativa sin Docker

Si Docker Desktop no está disponible, con Node.js instalado puedes abrir n8n con:

```powershell
npx --yes n8n@2.42.3 start
```

Luego abre `http://localhost:5678`. En Windows también puede iniciarse en segundo plano con `Start-Process` usando `C:\Program Files\nodejs\npx.cmd`.

Las credenciales del proveedor no se envían al navegador. Si n8n no está activo o el webhook no está configurado, el chatbot conserva su interfaz y muestra un error controlado.

## Prueba rápida

Con el workflow activo, prueba el endpoint con un payload de referencia:

```json
{
  "message": "¿Qué es la restauración coralina?",
  "language": "es",
  "role": "USER",
  "context": { "page": "home" },
  "requestId": "manual-test-001"
}
```

La respuesta esperada contiene `success`, `answer`, `requestId` y `sources`. No se deben enviar contraseñas, observaciones privadas completas, claves ni coordenadas sensibles.
