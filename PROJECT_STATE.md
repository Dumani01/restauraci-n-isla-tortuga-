# PROJECT STATE

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
