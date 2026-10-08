# Restauración Carolina

Aplicación React para comunicar y organizar información sobre restauración coralina en Isla Tortuga y el Golfo de Nicoya.

El contenido incorporado describe el ciclo de vida del coral y el proceso compartido por el proyecto: selección y recolección responsable de fragmentos, guarderías marinas, estructuras de crecimiento, limpieza, mantenimiento y monitoreo. No se agregan especies confirmadas, coordenadas, cifras ni resultados de campo que no hayan sido proporcionados.

## Ejecutar

```bash
npm install
npm run dev
```

Validación:

```bash
npm run test
npm run build
```

## Conectar el asistente con n8n

El chat de la aplicación usa `VITE_N8N_AI_WEBHOOK_URL` para enviar consultas a n8n. Para desarrollo local, `.env.local` debe apuntar a:

```env
VITE_N8N_AI_WEBHOOK_URL=http://localhost:5678/webhook/coral-assistant
```

Pasos para habilitar la integración:

1. En n8n, abre el workflow **Restauracion Coralina - Isla Tortuga - AI Assistant**.
2. En el nodo de DeepSeek, crea o selecciona una credencial **Header Auth** con `Authorization` y el valor `Bearer <tu_clave_de_DeepSeek>`. Guarda la clave únicamente en las credenciales de n8n; nunca en React, `db.json` o variables `VITE_*`.
3. Confirma que el webhook `POST` use la ruta `coral-assistant`, que el workflow incluya el manejo de preflight `OPTIONS` y que las respuestas tengan el formato `{ "success": true, "answer": "..." }` (o `{ "success": false, "error": "..." }`).
4. Publica el workflow en n8n para que registre la URL de producción `/webhook/coral-assistant`.
5. Asegúrate de que `.env.local` apunte al host de n8n accesible desde el navegador. Reinicia Vite después de cambiar variables de entorno.
6. Abre el asistente y envía una consulta de prueba. Si n8n no está disponible, la aplicación conserva el chat y muestra un error recuperable.

Para producción, configura la URL HTTPS pública de n8n y permite el origen de la aplicación en CORS. Protege el webhook contra abuso en n8n o detrás de un proxy; la URL del webhook no es un secreto. No expongas credenciales de proveedores en el navegador.

El área privada conserva la infraestructura de acceso local del prototipo, pero no representa un sistema de identidad real. Antes de usarla con personas o registros de campo debe conectarse a un mecanismo de autenticación autorizado.

La galería pública (`/galeria`) incluye las fotografías aportadas en `src/assets/galeria/` y las carga de forma diferida. Se conservan como imágenes compartidas, no como registros verificados de especies, fechas o ubicaciones.
