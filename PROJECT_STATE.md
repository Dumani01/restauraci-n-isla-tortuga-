# PROJECT STATE

## Fase 11 - Fuente única de información en db.json

Se trasladó al `db.json` la información de dominio del proyecto: ubicación, descripción, actividades, motivo de restauración, colaboración y etapas del ciclo coralino. `projectData.js` ya no contiene copias de esos textos y las páginas públicas (`PublicHome`, `ProjectPage`, `NewsPage`, `LoginPage`, `InteractivePublicPages`) y el dashboard consumen `projectInfo` desde `databaseService.js`. Las traducciones de etiquetas y textos propios de la interfaz permanecen en i18n; el clima continúa siendo información externa en tiempo real y el mapa usa los puntos demo del mismo `db.json`.

## Verification

- `npm run test`: PASS (10 tests)
- `npm run build`: PASS (advertencia existente de bundle > 500 kB)

## Fase 10 - Servicios conectados con db.json

Se creó `src/services/databaseService.js` como punto único de lectura de `db.json`. Expone el proyecto, ciclo de vida, observaciones, evidencias, usuarios y puntos del mapa mediante copias de sus colecciones. `mapService.js` dejó de importar el JSON directamente y `projectData.js` ahora toma la ubicación, actividades, colaboración y etapas desde la base demo, conservando respaldos de interfaz cuando un campo no existe. No se inventaron registros de campo ni se añadió persistencia de escritura en el navegador.

## Verification

- `npm run test`: PASS (10 tests)
- `npm run build`: PASS (advertencia existente de bundle > 500 kB)

## Fase 9 - Chatbot de IA accesible

Se incorporó un chatbot global para visitantes y usuarios autenticados mediante `src/components/chatbot/ChatbotWidget.jsx` y `src/hooks/useChatbot.jsx`. La interfaz conserva el historial durante la sesión en `sessionStorage`, envía únicamente el contexto mínimo de la ruta actual al servicio existente `aiService`, limita el historial local y ofrece estados de carga, error, reintento, sugerencias y limpieza de conversación. El widget no llama directamente a proveedores de IA y continúa funcionando con un mensaje de bienvenida cuando n8n no está configurado.

La interfaz está traducida en español, inglés, francés, alemán y portugués. Incluye botón flotante, panel responsive, foco inicial, cierre con Escape, Enter para enviar, Shift+Enter para salto de línea, roles ARIA, salida de texto segura sin HTML interpretado y botón manual `Escuchar` por respuesta usando el narrador existente. No hay narración automática, reconocimiento de voz, acciones administrativas ni diagnóstico biológico.

## Verification

- `npm run test`: PASS (9 tests)
- `npm run build`: PASS (advertencia existente de bundle > 500 kB)
- Respuestas reales de IA: pendientes de configurar/importar el workflow n8n y su webhook mediante `VITE_N8N_AI_WEBHOOK_URL`

Se habilitó n8n local mediante `npx n8n@2.42.3` porque Docker no está disponible. La instancia responde en `http://localhost:5678`; falta crear la cuenta propietaria inicial, importar/activar el workflow y configurar la credencial del proveedor.

Se revisó y corrigió directamente el workflow existente `Restauracion Coralina - Isla Tortuga - AI Assistant` (ID `s3rMetkRiSw1NA6F`), sin crear otro flujo. Se eliminó una clave que estaba colocada incorrectamente en el campo URL del nodo DeepSeek, se estableció `https://api.deepseek.com/chat/completions`, se normalizó el modelo a `deepseek-chat` y se limitó CORS a `http://localhost:5173`. El frontend quedó apuntando mediante `.env.local` a `http://localhost:5678/webhook/coral-assistant`. La credencial Header Auth y la activación final quedan para que el propietario introduzca su API key en n8n.

La integración quedó preparada para n8n local con `n8n/docker-compose.yml`, `n8n/.env.example` y `n8n/README.md`. El frontend usa como webhook local `http://localhost:5678/webhook/coral-assistant`; las credenciales del proveedor se mantienen fuera de React. El workflow conserva el `requestId` del frontend en las respuestas exitosas y de error.

- Docker/n8n local: no ejecutable en este entorno porque Docker Desktop y la CLI de n8n no están instalados.

## Fase 8 - Integración IA mediante n8n

Se preparó la infraestructura de IA sin crear todavía un chatbot visual. `src/services/aiService.js` valida y limita solicitudes, normaliza el payload, agrega `requestId`, usa únicamente `VITE_N8N_AI_WEBHOOK_URL`, aplica timeout de 30 segundos y normaliza respuestas/errores. Se documentó el contrato en `docs/AI_PAYLOAD_CONTRACT.md` y se agregó `.env.example` sin secretos.

Se exportó `n8n/coral-assistant-workflow.json` con Webhook POST, validación de entrada, normalización de idioma/rol, contexto público controlado, prompt de sistema seguro, proveedor configurable mediante variables de n8n, normalización de salida y respuesta estable. No se envían contraseñas ni datos privados; la IA no concede permisos, diagnostica enfermedades ni recomienda intervenciones biológicas.

## Verification

- `npm run test`: PASS (9 tests)
- `npm run build`: PASS (advertencia existente de bundle > 500 kB)
- Workflow JSON: válido mediante parse local
- Escaneo de secretos en `src/`, `public/` y `db.json`: sin credenciales encontradas
- `npm run lint`: N/A, no existe script `lint` en `package.json`
- Ejecución real del webhook: pendiente de configurar/importar el workflow en una instancia n8n con credenciales del proveedor.


## Fase 7 - API meteorológica y clima

Se integró Open-Meteo mediante `src/services/weatherService.js`, reutilizando las coordenadas generales centralizadas de Isla Tortuga desde `mapService.js`. El componente `WeatherCard` muestra clima actual, sensación térmica, humedad, viento, precipitación, condición meteorológica y pronóstico compacto de cinco días. Incluye estados de carga, error con reintento y caché en `sessionStorage` durante 20 minutos. Los códigos WMO se convierten a etiquetas e iconos comprensibles mediante i18n y el narrador puede leer el contenido textual sin iniciar voz automáticamente.

El widget se integró una sola vez en la página de Mapa, separado de Leaflet. No se agregaron claves privadas, alertas, geolocalización, IA, n8n ni recomendaciones oficiales de seguridad marítima.

## Verification

- `npm run test`: PASS (7 tests)
- `npm run build`: PASS (advertencia existente de bundle > 500 kB, incrementada por Leaflet)
- `npm run lint`: N/A, no existe script `lint` en `package.json`
- Verificación en vivo de Open-Meteo: pendiente de ejecutar en navegador con red disponible.


## Fase 6 - Mapa interactivo con Leaflet

Se reemplazó el mapa visual simulado por un mapa real con Leaflet, React Leaflet y OpenStreetMap. La vista carga puntos desde `db.json` mediante `src/services/mapService.js`, valida coordenadas sin romper el mapa y mantiene un centro generalizado de Isla Tortuga centralizado. Se agregaron marcadores diferenciados por tipo, popups, leyenda accesible, filtro sin recarga, estados de carga/error/vacío y una advertencia explícita de que los puntos son demo o de referencia.

La integración conserva i18n y el narrador puede leer la información textual de la leyenda, filtros y popups sin narrar movimientos del mapa. No se agregaron métricas de campo, corales enfermos ni coordenadas sensibles. El CRUD por roles queda pendiente porque el proyecto actual no tiene backend JSON Server ni roles `ADMIN`/`MODERATOR` configurados.

## Verification

- `npm run test`: PASS (7 tests)
- `npm run build`: PASS (advertencia existente de bundle > 500 kB)
- `npm run lint`: N/A, no existe script `lint` en `package.json`


## Fase 5 - Voice / Narrador accesible

Se incorporó un narrador reutilizable basado en la Web Speech API nativa (`speechSynthesis` y `SpeechSynthesisUtterance`). El control global permite activar o desactivar la narración, pausar, continuar, detener y ajustar velocidad y volumen. La lectura por hover usa un retardo de 420 ms y la lectura por foco de teclado funciona sobre títulos, párrafos, enlaces, botones, labels, controles de formulario, tarjetas y textos con `alt` significativo. Se agregó deduplicación, cancelación de lecturas anteriores, exclusión mediante `data-narrator-ignore`/`aria-hidden`, selección de voz por idioma i18n y fallback seguro cuando el navegador no soporta SpeechSynthesis.

Las preferencias se guardan en `localStorage` como `narratorEnabled`, `narratorRate` y `narratorVolume`. El control está disponible en la navegación pública y en el panel privado. No se implementaron reconocimiento de voz, chatbot, IA, n8n, mapas externos ni backend.

## Verification

- `npm run test`: PASS (7 tests)
- `npm run build`: PASS
- `npm run lint`: N/A, no existe script `lint` en `package.json`
- Verificación visual y de voces reales: pendiente de navegador/dispositivo con SpeechSynthesis disponible; las voces dependen del sistema operativo.


## Fase 4 - Sistema multilenguaje i18n

Se implementó internacionalización completa de la interfaz con `i18next` y `react-i18next`. La aplicación ahora ofrece español, inglés, francés, alemán y portugués mediante un selector accesible en la navegación pública. El idioma se detecta desde `localStorage` o el navegador, se conserva en `preferredLanguage` y actualiza dinámicamente `html[lang]`. Se migraron la navegación, portada, proyecto, mapa, galería, noticias, acceso, dashboard, observaciones y textos del ciclo de vida coral. El contenido divulgativo del proyecto permanece separado de la UI y no se traducen datos creados por usuarios mediante IA.

## Verification

- `npm run test`: PASS (7 tests)
- `npm run build`: PASS
- `npm run lint`: N/A, no existe script `lint` en `package.json`


## Fase 81 - Fondo proporcional al cambiar pestañas

Se corrigio el estiramiento visual del fondo submarino de la portada al cambiar la pestaña “Como”. El pseudo-elemento global de la portada ahora usa `background-size: cover` en lugar de `100% 100%`, conservando la proporcion de la imagen aunque cambie la altura del contenido.

## Verification

- `npm run test`: PASS (7 tests)
- `npm run build`: PASS

## Fase 80 - Limpieza de elementos decorativos del carrusel

Se eliminaron del carrusel el numero grande de etapa y la leyenda auxiliar sobre el modelo. La ficha de informacion y el tooltip interactivo se mantienen para conservar el contexto sin elementos flotantes que compitan con las imagenes.

## Verification

- `npm run test`: PASS (7 tests)
- `npm run build`: PASS

## Fase 79 - Correccion visual del carrusel

Se corrigio el desborde de nombres largos en la rail del carrusel: ahora las tarjetas reservan espacio para los controles, usan un ancho flexible y permiten envolver el texto/scroll horizontal. El tooltip de los modelos dejo de heredar la transformacion 3D del boton completo; la profundidad queda en la imagen y el texto usa una superficie nitida con ancho maximo responsive, contraste y z-index estable.

## Verification

- `npm run test`: PASS (7 tests)
- `npm run build`: PASS

## Fase 78 - Responsive + optimizacion visual (en revision)

Se ajusto la base visual para responsive con `box-sizing` global, imagenes limitadas al contenedor y controles tipograficos heredados. La navegacion publica conserva todas las rutas y ahora ofrece areas tactiles minimas de 44px. El feature y el carrusel de ciclo pasan a una columna antes en tablet para evitar compresion y solapamientos. Las imagenes del ciclo reservan dimensiones, usan `object-fit: contain`, `decoding="async"` y `loading="lazy"` cuando corresponden.

La auditoria de assets encontro 6 WebP del ciclo (aprox. 2.74 MB total) y 8 PNG heredados (aprox. 17.76 MB total). No se convirtieron los PNG porque no hay herramienta de conversion disponible en el entorno y no se debe degradar su calidad sin verificacion visual. La verificacion visual en las ocho resoluciones solicitadas queda pendiente porque no hay navegador conectado; el servidor Vite no pudo abrirse mediante la CLI ni el navegador integrado disponible.

## Verification

- `npm run test`: PASS (7 tests)
- `npm run build`: PASS
- `npm run lint`: no configurado en `package.json`
- Verificacion visual multi-resolucion: PENDIENTE por falta de navegador conectado

## Fase 74 - Carrusel 3D interactivo del ciclo de vida

Se reconstruyo la ruta publica `/galeria` como un carrusel interactivo con seis modelos visuales CSS con profundidad: gametos, embrion, larva (planula), asentamiento en sustrato, coral juvenil y coral adulto. Cada modelo responde al hover y al foco de teclado, muestra un destaque visual y un tooltip con el nombre; la ficha activa conserva la descripcion centralizada en `src/services/projectData.js`. Se agregaron controles anterior/siguiente, miniaturas por etapa, estados accesibles y una nota explicita de contenido informativo de referencia. Los modelos son representaciones visuales y no evidencia ni resultados de campo.

## Verification

- `npm run test`: PASS (7 tests)
- `npm run build`: PASS

## Fase 75 - Carrusel 3D integrado en la pagina principal

Se traslado la experiencia de modelos 3D al bloque `#corales` de la portada. El apartado ahora sustituye los tres corales rasterizados por las seis etapas del ciclo de vida, con hover/foco, tooltip, ficha informativa, controles anterior/siguiente y selector de etapas dentro de la misma escena marina. La ruta `/galeria` conserva su carrusel de referencia.

## Verification

- `npm run test`: PASS (7 tests)
- `npm run build`: PASS

## Fase 76 - Assets optimizados para el carrusel coralino

Se incorporaron los seis assets WebP transparentes proporcionados en `src/assets/ciclo-coral/` y se sustituyeron los modelos CSS por las imagenes de cada etapa tanto en el carrusel de portada como en la galeria. Se conservaron hover/foco, tooltip, controles, miniaturas y la distincion entre contenido visual de referencia y evidencia de campo. Se mejoro el tratamiento visual con sombras, brillo, escalado y miniaturas de imagen.

## Verification

- `npm run test`: PASS (7 tests)
- `npm run build`: PASS

## Fase 73 - Contenido de restauración coralina basado en material proporcionado

Se sustituyeron los registros, cifras, especies, fechas, noticias y ubicaciones ficticias de la interfaz por la información proporcionada sobre Isla Tortuga y el Golfo de Nicoya: ciclo de vida del coral, selección y recolección responsable, guarderías marinas, estructuras, limpieza, mantenimiento, monitoreo y colaboración. El contenido quedó centralizado en `src/services/projectData.js`; `db.json` conserva únicamente el esquema del proyecto con observaciones y evidencias vacías. Se retiró la ruta de detalle de corales sin registros verificables y el acceso privado ahora requiere variables de entorno, sin credenciales inventadas.

## Verification

- `npm run test`: PASS (7 tests)
- `npm run build`: PASS (sin errores; permanece la advertencia de bundle grande cuando corresponde)

## Fase 72 - Flujo de composición componentes → páginas → rutas → App → main → index.html

Se reorganizó la arquitectura de entrada sin cambiar las URLs públicas o privadas. Los componentes compartidos ahora viven en `src/components`, las vistas antes embebidas en `App.jsx` se trasladaron a `src/pages`, la definición de React Router quedó en `src/routes/AppRoutes.jsx`, `src/app/App.jsx` compone el proveedor de autenticación con las rutas, y `src/main.jsx` permanece como punto de montaje hacia `index.html`. Se conservaron los datos demo, las guardas privadas y el funcionamiento sin servicios externos.

## Verification

- `npm run test`: PASS (7 tests)
- `npm run build`: PASS (advertencia existente de bundle > 500 kB)

## Fase 71 - Carpeta de servicios demo

Se creó `src/services/demoData.js` para centralizar los datos demostrativos compartidos por las rutas públicas y privadas. Se mantuvo explícita la distinción entre datos demo y datos verificados.

## Fase 70 - Organización de carpetas y entrada de React Router

Se separó el punto de entrada `src/main.jsx` de la aplicación y su configuración de React Router en `src/app/App.jsx`. Las vistas existentes se agruparon en `src/pages/public` y `src/pages/private`, actualizando imports de assets, estilos y pruebas sin cambiar las URLs públicas o privadas.

## Verification

- `npm run test`: PASS (7 tests)
- `npm run build`: PASS (advertencia existente de bundle > 500 kB)

## Fase 69 - Encabezado sin sombreado separador

Se retiró el degradado del encabezado de Mapa y Galería para evitar una franja oscura debajo del título. La escena marina continua permanece visible sin modificar el contenido.

## Fase 68 - Encabezado de Mapa sin imagen independiente

Se eliminó explícitamente la imagen coralina propia del encabezado de Mapa para que la escena continua de la portada y Proyecto sea visible detrás del título. Se conservó el contenido y la interacción del mapa.

## Fase 67 - Fondo continuo en apartados interactivos

Se alineó el encabezado de Mapa y Galería con la escena marina continua de la página principal y Proyecto. Se retiró la imagen submarina independiente del encabezado sin modificar el contenido ni las interacciones de esos apartados.

## Fase 66 - Scroll interno sin cambiar la URL

Se reemplazó el enlace con hash de `Seguir explorando` por un botón que desplaza suavemente hacia `#seguimiento` dentro de la misma portada, sin redireccionar ni modificar la URL del navegador.

## Fase 65 - Recorte de capas atmosféricas sin scroll adicional

Se cambió la portada a `overflow: clip` para recortar sus capas atmosféricas que sobresalían del contenido y extendían el documento. Esto mantiene un único scroll normal y elimina el espacio posterior al footer.

## Fase 64 - Footer con altura directa y estable

Se aplicó directamente al elemento footer una altura fija de 76px, fondo marino, límites máximo y mínimo, y recorte interno. Esto elimina cualquier posibilidad de que el footer se estire y genere el bloque oscuro sobrante.

## Fase 63 - Flujo final de portada corregido

Se normalizó el flujo de la home para usar un único scroll del documento, se eliminó cualquier altura implícita del contenedor público y se fijó el footer a 76px con recorte interno. Ya no queda espacio oscuro adicional después del límite.

## Fase 62 - Footer marino compacto

Se reemplazó el bloque oscuro posterior de la portada por un footer compacto de 76px que usa la misma imagen marina como fondo. La información del footer permanece visible sobre la escena, sin espacio oscuro adicional.

## Fase 61 - Flujo normal del documento y cierre del footer

Se eliminaron las alturas mínimas de viewport que dejaban una superficie oscura extensa después del contenido. Las rutas públicas ahora siguen un flujo normal de documento y terminan en un footer compacto, sin espacio adicional posterior.

## Fase 60 - Footer compacto

Se redujo la altura visual del footer mediante un padding vertical compacto y una altura mínima explícita de cero. Se conservaron sus textos y enlaces.

## Fase 59 - Eliminación del espacio blanco exterior

Se igualó el fondo de `body` y `#root` al fondo de las rutas públicas para que no aparezca una superficie blanca después del footer ni detrás del límite de la portada.

## Fase 58 - Eliminación del doble scroll y fondo exterior

Se reemplazó el recorte horizontal del contenedor público por `overflow-x: clip` para evitar que el navegador cree una segunda barra vertical. En la portada, el footer ahora usa el mismo fondo final oscuro para evitar que aparezca una franja azul externa.

## Fase 57 - Corrección del fondo duplicado al final de la portada

Se eliminó la imagen de fondo global que se repetía detrás del footer de la portada. El contenedor público de la home ahora mantiene un fondo sólido fuera de la escena principal, evitando el efecto de una segunda página detrás.

## Fase 56 - Scroll vertical recuperado en la portada

Se eliminó el `overflow: hidden` del contenedor general de la portada, que podía limitar el desplazamiento después de usar `Seguir explorando`. Los elementos internos conservan sus propios recortes visuales y la página vuelve a usar el scroll vertical normal.

## Fase 55 - Retiro de numeración en principios

Se eliminaron los rótulos numéricos `01`, `02` y `03` de las tarjetas de principios de `Proyecto`, sin modificar sus títulos ni textos.

## Fase 54 - Hero sin sombreado bajo el título

Se retiró la capa de degradado del hero de las rutas públicas para que el fondo marino continúe directamente bajo el título, sin una banda oscura ni separación visual.

## Fase 53 - Fondo marino unificado en apartados públicos

Se unificó el fondo de las rutas públicas con la misma escena marina continua de la página principal. El cambio aplica a Proyecto, Mapa, Galería, Noticias, acceso y detalles, conservando sus contenidos y bloques internos.

## Fase 52 - Fondo marino para Proyecto

La ruta `Proyecto` ahora utiliza como fondo la misma escena marina continua de la página principal, con una capa de contraste más ligera en el hero. El cambio está limitado al fondo de esa ruta.

## Fase 51 - Fondo del apartado alineado con la página principal

Se alineó únicamente el fondo del apartado principal con la imagen continua utilizada por la página principal. No se modificaron otros elementos visuales ni funcionales.

## Fase 50 - Fondo marino aplicado directamente al apartado principal

Se aplicó el fondo submarino directamente sobre el contenedor visible del hero para evitar que la capa global de la portada lo ocultara. El ajuste se limita al fondo del apartado.

## Fase 49 - Fondo marino del hero

Se cambió únicamente la imagen de fondo del hero por una escena submarina con arrecife y rayos de luz. No se modificaron la estructura, el contenido ni los estilos del resto del apartado.

## Fase 48 - Fondo marino visible en el hero

Se reforzó el fondo del apartado principal para mostrar directamente la escena marina de Isla Tortuga detrás del contenido. Se mantuvo una imagen continua, sin franja separadora, con color y brillo ligeramente ajustados para conservar la lectura del título.

## Fase 47 - Hero sin sombreado separador

Se eliminó la capa de degradado oscuro del hero de la portada. El título principal queda directamente sobre la escena marina, sin una franja o sombreado visual que parezca separar el contenido.

## Fase 46 - Actualización consolidada del prototipo

Se consolidaron en el repositorio los ajustes recientes de portada, dashboard, observaciones, temas claro/oscuro, navegación lateral y pruebas asociadas. La aplicación mantiene datos demostrativos, rutas funcionales y verificación automática de la eliminación de burbujas decorativas.

## Fase 45 - Navegación lateral premium

Se reemplazaron los emojis del sidebar por iconos consistentes, se mejoraron las áreas de clic, el espaciado, la jerarquía, los estados activos y el hover para una navegación más refinada en temas claro y oscuro.

## Fase 44 - Tema claro consistente en Observaciones

Se corrigió el shell de Observaciones para que el tema blanco coincida con el dashboard: sidebar blanco, navegación activa naranja, barra superior clara, breadcrumb claro, formulario blanco y contraste coherente. El tema oscuro mantiene su variante carbón/naranja.

## Fase 43 - Cambio de tema disponible en Observaciones

Se añadió el control luna/sol a la barra superior de Observaciones. El botón comparte `rc_dashboard_theme` con el dashboard, actualiza el tema claro/oscuro y conserva la preferencia entre ambas vistas.

## Fase 42 - Observaciones con shell CoreUI completo

El apartado de observaciones ahora comparte la misma estructura visual del dashboard: sidebar, barra superior con búsqueda y acciones, breadcrumb, superficies temáticas, formulario alineado, acentos naranja y soporte claro/oscuro. Se conserva el contenido funcional de captura y guardado demo.

## Fase 41 - Observaciones alineadas con el sistema visual

Se aplicó al formulario de nueva observación la misma composición del dashboard: superficie tipo tarjeta, acento naranja, campos consistentes, estados de foco, botón de acción, mensaje de guardado y soporte para tema claro/oscuro.

## Fase 40 - Tema oscuro gris carbón y naranja

Se ajustó el tema oscuro a un gris muy oscuro con superficies carbón y detalles naranjas coordinados con el tema claro. Se actualizaron sidebar, barra superior, widgets, tarjetas, estados, botones, gráfico y controles para mantener contraste sin volver al azul dominante.

## Fase 39 - Dashboard sin franjas exteriores

Se eliminó el padding del contenedor privado únicamente para el dashboard y se hizo que la vista ocupe todo su lienzo. Ya no quedan separaciones blancas alrededor de la barra superior, contenido ni tarjetas.

## Fase 38 - Modo oscuro alineado con referencia CoreUI

Se ajustó el modo oscuro del dashboard para usar la composición azul grisácea de la referencia: sidebar y barra superior en tonos CoreUI, contenido en gris carbón, widgets violeta/azul/amarillo/coral, tarjetas oscuras y botón de menú visible. Se conserva la marca Carolina y la información demostrativa del proyecto.

## Fase 37 - Paleta naranja para temas claro y oscuro

Se unificó la paleta del dashboard: el tema claro usa superficies blancas, texto oscuro y detalles naranjas; el tema oscuro usa superficies negras, texto claro y detalles naranjas. Se ajustaron sidebar, barra superior, widgets, tarjetas, estados, controles y gráfico para mantener contraste.

## Fase 36 - Sidebar contraíble y barra superior simplificada

El logo Carolina ahora alterna el sidebar entre expandido y compacto, conservando el contenido principal visible. Se eliminó el botón de tres rayas junto a la búsqueda del dashboard para evitar controles duplicados.

## Fase 35 - Tema oscuro accesible para el dashboard

Se añadió un control de tema claro/oscuro en la barra superior del dashboard. El modo negro ajusta fondo, tarjetas, textos, bordes, tabla, leyenda y controles del gráfico para conservar contraste y legibilidad; la preferencia se guarda localmente.

## Fase 34 - Dashboard reconstruido con referencia CoreUI

Se reconstruyó la vista privada del dashboard con una composición tipo CoreUI: barra superior, búsqueda, acciones, breadcrumb, cuatro widgets con mini-gráficos, panel temporal, selector Día/Mes/Año, descarga visual, tabla de observaciones y tarjeta de contexto. La paleta conserva azul profundo, turquesa y coral para mantener la identidad de Restauración Carolina; todos los datos siguen siendo demostrativos.

## Fase 33 - Estética CoreUI adaptada al dashboard

Se adaptó la composición del dashboard a la referencia CoreUI: fondo administrativo claro, tarjetas compactas, bordes y sombras sutiles, tipografía sans para el panel, sidebar estructurada y mejor densidad de información. Se conserva la paleta marina de Restauración Carolina y no se incorporan dependencias nuevas ni datos comerciales de la plantilla.

## Fase 32 - Acceso de usuario con tarjeta visual

Se adaptó el enlace de acceso público a una tarjeta de perfil inspirada en el componente compartido, con icono, gradiente marino, borde suave, estado hover/focus visible y ajuste responsive. El enlace conserva su navegación al login demo.

## Fase 31 - Dashboard alineado con la experiencia marina

Se rediseñó visualmente el área privada con una navegación lateral submarina, fondo marino sutil, tarjetas de indicadores, superficies translúcidas, acentos coral y turquesa, gráfico con mejor contraste y responsive para pantallas pequeñas. Se conservaron los datos demostrativos y el funcionamiento actual del panel.

## Fase 30 - Eliminación de círculos flotantes

Se eliminaron las burbujas animadas y los patrones radiales de la atmósfera submarina para retirar los círculos blancos visibles sobre la imagen. Se conservan únicamente la textura marina, la luz difusa y los degradados no circulares.

## Fase 29 - Burbujas submarinas realistas

Se reintrodujo una corriente de 64 burbujas suaves que se activa al descender más allá del header. Cada partícula tiene variación determinista de tamaño, brillo, desenfoque, opacidad y deriva para conservar volumen visual sin formar anillos decorativos.

## Fase 28 - Retiro de círculos decorativos

Se retiró la capa de burbujas circulares de la portada porque interfería con la lectura visual. Se conservan el fondo marino, la atmósfera de luz y las partículas ambientales no circulares.

## Fase 27 - Limpieza de numeración visual

Se eliminaron el contador “01 / 04” del hero y los marcadores ordinales “01”, “02” y “03” de las tarjetas de indicadores. Se conservaron únicamente los valores principales de datos del prototipo.

## Fase 26 - Eliminación de rótulos secundarios

Se retiraron los rótulos “En una mirada”, “Un registro a la vez” y “Seguimiento demostrativo” para simplificar la portada y dar prioridad directa a los títulos y datos principales.

## Fase 25 - Simplificación de etiquetas

Se retiraron las etiquetas secundarias visibles del tramo inferior de la portada: “Restauración Carolina”, “Profundidad · vista demo” y los estados demo de la ficha de coral. La jerarquía queda más limpia y se conserva la información principal de cada sección.

## Fase 24 - Limpieza del visual submarino

Se eliminó del visual central el icono de ondas y la etiqueta “Exploración · datos demostrativos”. El espacio queda limpio para que destaque únicamente la escena submarina y el contenido funcional asociado.

## Fase 23 - Escena de corales sin marcos

Se retiraron los últimos overlays decorativos que podían percibirse como recuadros claros: rayos internos, partículas de la escena, bandas de transición, haz lateral y base de arena. El escenario queda limpio, con los corales interactivos y su información directamente sobre el fondo marino.

## Fase 22 - Limpieza de superficies claras

Se eliminaron el brillo blanco superior y la sombra interna heredada de la ficha informativa de corales. La ficha permanece funcional y legible, pero ya no genera un recuadro claro sobre el fondo submarino.

## Fase 21 - Limpieza de líneas decorativas

Se eliminó el patrón de anillos concéntricos blancos del escenario interactivo de corales. La escena conserva profundidad, rayos suaves, partículas y corales destacados sin líneas que interfieran con la lectura visual.

## Fase 20 - Transición superficie-submarino suavizada

Se suavizó la unión visual entre la superficie y el fondo marino en el inicio de indicadores. La transición ahora usa una mezcla azul-turquesa muy ligera y difuminada, sin sombra rectangular ni cambio brusco entre secciones.

## Fase 19 - Fondo único sin franjas

Se añadió una regla global de la portada que fuerza transparencia en todas las secciones y en la atmósfera base. También se eliminó el fondo de hover de los indicadores, evitando que aparezcan nuevas tarjetas o franjas al pasar el cursor.

## Fase 18 - Capas internas transparentes

Se eliminaron las últimas capas rectangulares internas: la imagen local del visual central, los fondos de etiquetas y la sombra del panel informativo de corales. También se dejó transparente el cierre de la portada para que el fondo marino sea continuo hasta el final.

## Fase 17 - Eliminación de bloques oscuros

Se eliminaron los fondos negros o azul oscuro que formaban rectángulos detrás de las secciones de la portada. Statement, indicadores, feature y arrecife ahora dejan pasar la imagen marina completa; se ajustaron colores, contraste y escalas tipográficas para mantener una lectura clara sin paneles opacos.

## Fase 16 - Secciones transparentes

Se retiraron los fondos claros que formaban recuadros visuales sobre la imagen marina. El resumen y sus indicadores ahora usan capas azul-marino translúcidas, con tipografía clara y sombra sutil para conservar legibilidad sin ocultar el fondo submarino.

## Fase 15 - Burbujas submarinas visibles

Se añadieron burbujas pequeñas y translúcidas con borde luminoso, tamaños variados y trayectorias ascendentes. Se activan progresivamente con el scroll para que la superficie inicial no tenga partículas, mientras la zona submarina combina burbujas, haces de luz y color marino.

## Fase 14 - Atmósfera submarina de luz

Se reemplazó el patrón de burbujas de la portada por una atmósfera más natural: haces de luz difuminados, caústicas cromáticas y variaciones suaves de contraste, saturación y tonos azul-verde. La intensidad continúa vinculada al scroll, por lo que la superficie inicial permanece limpia y la iluminación aparece al descender bajo el agua. Se conserva el soporte para movimiento reducido.

## Fase 13 - Imagen vertical de recorrido completo

La portada utiliza `src/assets/isla-tortuga-long-scroll.png`, un recurso vertical de 821x1916 creado como una sola escena continua: Isla Tortuga y la superficie aparecen al inicio, la columna de agua ocupa la mayor parte del recorrido y el arrecife queda reservado para el tramo inferior. La imagen se aplica como fondo único de la home al 100% del ancho y el 100% de la altura, con capas translúcidas encima para mantener legibles todos los apartados sin recortar la narrativa submarina.

## Fase 12 - Narrativa visual continua

La home ahora utiliza una sola imagen vertical, `src/assets/isla-tortuga-descent.png`, estirada a lo largo de toda la portada. La composición recorre Isla Tortuga desde el mar, atraviesa la superficie, baja por la columna de agua y termina en el arrecife. Los fondos opacos de las secciones fueron reemplazados por capas translúcidas; Proyecto, Mapa, Galería y Noticias siguen siendo rutas separadas.

## Extension de recorrido marino

Se sustituyó el recurso por una variante con más columna de agua abierta y se forzó su composición a cubrir el 100% del ancho y la altura real de la portada. Las capas claras de resumen se hicieron translúcidas para que la imagen sea continua y visible hasta el final del scroll.

## Fase 11 - Hero submarino

Se sustituyó la imagen de superficie por `src/assets/underwater-hero.png`, una escena submarina realista con profundidad, rayos de luz, partículas y arrecife. La variable visual pasó a `--vh-underwater-image` para que hero, transición y sección de resumen usen la misma continuidad marina.

## Fase 10 - Superficie a fondo marino

Se eliminó el aspecto de recuadro del encabezado en la portada y se integró una imagen panorámica propia de Isla Tortuga como fondo del título principal. La capa de atmósfera usa el progreso de scroll para pasar gradualmente de superficie tropical a profundidad marina, sin añadir movimiento invasivo al primer viewport.

## Continuidad de inmersión

La sección de resumen demo dejó de ser un bloque claro aislado: ahora recibe progresivamente la imagen marina, una capa de profundidad y una transición de contraste/tipografía controlada por el scroll, preparando el paso hacia el arrecife.

## Correccion de capas de inmersion

Se corrigió la superposición que ocultaba la imagen: la capa clara ahora se desvanece y la imagen submarina entra por encima con un progreso de inmersión acelerado durante el primer scroll. La portada conserva superficie al inicio y profundidad visible desde el bloque de resumen.

## Fase 9 - Sistema tipografico

Se unifico la tipografia de la experiencia: serif editorial para titulares, métricas y nombres; sans legible para navegación, textos, formularios y datos. Se ajustaron tamaños fluidos, pesos, tracking, interlineado, antialiasing y responsive en portada, páginas públicas y panel privado.

## Alcance visual

Se excluyen deliberadamente precios, planes, suscripciones y cualquier bloque comercial del template de referencia. La experiencia queda enfocada en restauración coralina, seguimiento, mapa, galería, noticias y acceso.

## Ajuste de visibilidad

El resumen numerado de indicadores demo se movió inmediatamente después del hero para que la adaptación visual sea evidente durante el primer scroll, manteniendo el primer viewport sin burbujas ni métricas flotantes.

## Fase 8 - Adaptacion visual Studiova

Se integraron en la portada patrones visuales y funcionales del template Studiova adjunto: bloque numerado de indicadores demo, jerarquia editorial, estados hover con overlay, subrayado de navegacion activa, revelado por scroll y boton de volver arriba. Se mantuvo la estructura coralina, el contexto acuatico, la trazabilidad de datos demo y la implementacion React/CSS sin Bootstrap ni jQuery.

## Limpieza del primer viewport

Se retiro del hero inicial el fondo coralino fotorealista y la escena WebGL. El inicio queda con un fondo acuatico limpio; los corales y la ambientacion submarina permanecen en las secciones de inmersion posteriores.

## Escena submarina 3D integrada

Se incorporo una escena WebGL procedural en la portada, inspirada en los repositorios mini-aquarium, Pelagic y WaterThreeJS: peces con movimiento, silueta de arrecife, particulas y profundidad controlada por scroll. Si WebGL no esta disponible, permanece el fondo visual existente como fallback.

## Inspiracion submarina casi realista

Se incorporaron recursos visuales inspirados en referencias de acuarios y escenas submarinas: profundidad por scroll, cambio de luz y contraste, causticas animadas, particulas marinas y sombras de fondo. Se mantuvo la arquitectura actual sin incorporar un motor 3D pesado.

## Ultimo cambio revertido

Se retiro la linea de superficie, la tarjeta de descenso y las metricas flotantes de la portada. Se conservan los cambios previos de corales, mapa, galeria, noticias, acceso y burbujas activadas por scroll.

## Inmersion visual de portada

La portada ahora sigue la narrativa visual de la referencia: línea de superficie, tarjeta central de descenso y métricas flotantes demo antes de entrar a la sección de corales interactivos.

## Ajuste de activacion por scroll

Se elimino la animacion ambiental del estado inicial y del encabezado superior. Las burbujas ahora viven solo en la portada y su opacidad depende del progreso de scroll, por lo que aparecen al descender hacia la zona submarina.

## Correccion visible de interfaz

Se reforzo la identidad acuática desde el primer viewport: barra de superficie animada, encabezado con gradiente marino y halo de agua, y acceso reducido a una sola tarjeta central animada.

## Cobertura visual de apartados publicos

El lenguaje acuatico y las animaciones ahora se aplican tambien a Proyecto, Mapa, Galeria, Noticias y Acceso. El acceso fue simplificado a una composicion de tarjeta con vidrio liquido, profundidad marina y entrada animada.

## Integracion visual de referencia

Se adaptaron patrones del template Mindloop/Hirael adjunto: animaciones de entrada al viewport, superficies liquid-glass, capas de transición y comportamiento reduced-motion. La implementación se mantiene en React/CSS del proyecto y se documentó la licencia MIT.

## Mejora visual de corales

Se reemplazaron las formas CSS abstractas por tres assets rasterizados con fondo transparente y textura orgánica: coral ramificado, coral cerebro y abanico de coral. Conservan interacción, escala responsive, sombra y movimiento sutil.

## Ultima mejora visible

La portada ahora muestra desde el primer viewport un medidor fijo de profundidad, una línea de descenso al arrecife y un acceso directo a la sección de corales interactivos. Esto hace más evidente la transición acuática sin cambiar la identidad visual existente.

## Fase 7 - Entrega de esta iteracion

Se agrego un resumen local seguro para observaciones: identifica campos recibidos, lista campos incompletos y muestra un descargo explicito. No diagnostica ni recomienda intervenciones y funciona sin n8n ni servicios externos.

## Fase 6 - Entrega de esta iteracion

Se incorporo una utilidad de trazabilidad minima para distinguir origen, validacion y evidencia de cada registro. El mapa comunica estos limites al usuario y mantiene todos los registros visibles como datos demo.

## Fase 5 - Entrega de esta iteracion

Se agregaron microinteracciones acuaticas, movimiento de respiracion en la galeria, deriva de ondas en los encabezados, burbujas y balanceo en corales, ademas de estados de foco visibles y soporte reforzado para reduced-motion.

## Fase 4 - Entrega de esta iteracion

El mapa y la galeria ahora usan una experiencia submarina interactiva: marcadores demo seleccionables, ficha contextual, filtros por zona y una galeria con imagen activa y rail de referencias. No se publican coordenadas sensibles ni se presentan imagenes como evidencia de campo.

## Fase 3 - Entrega de esta iteracion

La portada conserva el diseno existente y ahora incorpora una atmosfera acuatica con ondas sutiles, una transicion de profundidad controlada por scroll y una primera escena submarina con tres corales demo interactivos. Las fichas indican estado y contexto sin inventar especies ni resultados de campo.

## Fases propuestas para la experiencia acuatica

- Fase 3 (actual): atmosfera de agua, transicion de profundidad y corales demo interactivos en portada.
- Fase 4: mapa y galeria submarinos con capas visuales, filtros y fichas trazables.
- Fase 5: microinteracciones, movimiento avanzado y accesibilidad/reduced-motion.
- Fase 6: integracion de datos verificados, evidencia y estados reales cuando el equipo los confirme.

## Current Phase

Fase 2 — Navegación visual y experiencia pública

## Current Progress

- Fase -1 Bootstrap: COMPLETE
- Fase 0 Contexto y arquitectura: COMPLETE
- Fase 1 Modelo de dominio y datos: COMPLETE
- Fase 2 Arquitectura de rutas: IN_PROGRESS_BASE
- Fase 3 Experiencia pública submarina: IN_PROGRESS_BASE
- Fase 4 Mapa, corales y estructuras: PENDING
- Fase 5 Dashboard e indicadores: IN_PROGRESS_BASE
- Fase 6 CRUD y observaciones: IN_PROGRESS_BASE
- Fase 7 n8n e IA: PENDING
- Fase 8 Calidad y cierre: PENDING

## Current Work

Sistema visual público unificado en portada, proyecto, mapa, galería, noticias y acceso; incluye navegación común, diseños responsive y contenido demostrativo identificado.

## Next Allowed Task

Continuar el desarrollo del mapa y de la galería con datos y evidencia confirmados por el equipo.

## Known Blockers

- Los datos reales de campo, protocolos, responsables, permisos y coordenadas deben confirmarse con el equipo de Restauración Carolina.
- La integración n8n todavía no está conectada.

## Active Invariants

- Datos demo claramente identificados.
- No diagnóstico automático de enfermedades.
- No exposición pública de coordenadas sensibles.
- La aplicación debe funcionar sin servicios externos.

## Verification

- `npm run test`: PASS (4 tests)
- `npm run build`: PASS (advertencia existente de bundle > 500 kB)
- Navegación pública revisada en 375, 768 y 1280 px sin desbordamiento horizontal.
