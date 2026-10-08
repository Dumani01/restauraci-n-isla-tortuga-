# Restauración Coralina

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

El chat usa `VITE_N8N_AI_WEBHOOK_URL` para enviar consultas a n8n. Para desarrollo local, `.env.local` debe apuntar a:

```env
VITE_N8N_AI_WEBHOOK_URL=http://localhost:5678/webhook/coral-assistant
```

Pasos:

1. Inicia n8n siguiendo [n8n/README.md](./n8n/README.md).
2. Configura `AI_API_KEY` únicamente en el entorno seguro de n8n; nunca en React, `db.json` o variables `VITE_*`.
3. Confirma que el webhook `POST` use la ruta `coral-assistant` y devuelva `success`, `answer` y `requestId`; los errores devuelven `success: false` y un código `error`.
4. Publica el workflow y configura la URL HTTPS de producción en el entorno local/de despliegue del frontend.
5. Prueba el chat. Si n8n no está disponible, la interfaz permanece disponible y muestra un error controlado.

El cliente valida mensajes de 1 a 2000 caracteres, limita el contexto a una etiqueta de página y no envía roles. Un rol enviado por el navegador sería manipulable y no es autorización.

El workflow exportado no implementa autenticación del webhook ni limitación de solicitudes. CORS solo restringe solicitudes desde navegadores compatibles: no autentica solicitudes ni evita clientes directos. Antes de exponerlo en producción, usa HTTPS y un proxy/API gateway para autenticación, límites de solicitudes y allowlist de origen; configura también CORS en n8n. La URL del webhook no es un secreto.

## Límites del modo demo

El acceso, los roles y las cuentas del área privada se verifican solo en el navegador; no representan identidad ni autorización seguras. Antes de usarla con personas o registros de campo se requiere identidad y autorización del lado servidor en cada endpoint.

Las observaciones se guardan localmente en el navegador y se etiquetan como demo/no verificadas. No se sincronizan entre dispositivos ni constituyen registros de campo confirmados; se necesita una API y almacenamiento con controles de acceso para uso operativo.

La galería pública (`/galeria`) incluye las fotografías aportadas en `src/assets/galeria/` y las carga de forma diferida. Se conservan como imágenes compartidas, no como registros verificados de especies, fechas o ubicaciones.
