# VotoPolis · Mapa interactivo con relieve y zoom

Frontend React + JavaScript con Vite. Conserva la selección de Lia/Rocko y el movimiento de la burbuja; añade las 32 entidades interactivas y la introducción de Puebla. No incorpora backend, API de servicios, autenticación, base de datos ni despliegue.

## Elevación, escala de grises y navegación del mapa

El diseño del escenario sigue las referencias visuales aportadas: océano violeta, regiones púrpuras, bordes de isla, sombras, rótulos claros con contorno oscuro, caminos punteados y pequeñas ilustraciones vectoriales. Los árboles, montañas, casas y agaves son motivos decorativos originales, no ubicaciones de monumentos o ciudades. Se mantienen las geometrías locales y las proporciones del mapa; no se utiliza una imagen plana como mapa interactivo.

Seleccionar cualquiera de las 32 entidades eleva su superficie con una transición de 300 ms, añade espesor y sombra proyectada, conserva su color y sitúa las otras 31 en gris. Al cambiar de entidad, la anterior baja. Al cerrar la tarjeta o borrar la selección, se restauran los colores y la vista completa. Las zonas de interacción permanecen en la posición geográfica original; las superficies, rótulos e ilustraciones no interceptan clics, por lo que el relieve no bloquea a los estados vecinos.

Controles visibles:

- **+ / −**: acercar y alejar entre **100 % y 700 %**. Con una entidad seleccionada, los botones centran el acercamiento en su región principal.
- **Centrar entidad**: calcula el encuadre de la entidad seleccionada sin deformarla. En entidades con islas alejadas se enfoca el polígono principal para que el territorio sea legible.
- **Ver todo México**: restablece el zoom y la panorámica, conservando la selección. Para restaurar también los colores se cierra la selección.
- **Arrastrar**: a partir de un zoom mayor al 100 %, desplaza el mapa. Al 100 %, el gesto mantiene la mecánica de mover la burbuja.
- **Dos dedos**: pellizcar acerca o aleja y permite desplazar el centro del gesto simultáneamente. Un pellizco o arrastre no selecciona una entidad al soltar los dedos.
- **Teclado**: Tab enfoca regiones y controles; Enter o Espacio seleccionan; `+`, `−` y `0`/Inicio controlan el zoom cuando el foco está en el mapa. Las flechas desplazan el mapa cuando está ampliado y mueven la burbuja en la vista completa. Escape desde una región cierra la selección.

La panorámica está acotada para no perder el país fuera del escenario. La cámara utiliza una escala uniforme en ambos ejes. Los controles ocupan una franja separada de la superficie geográfica. Se respeta la preferencia de movimiento reducido. No se añadieron dependencias.

Archivos de esta ampliación: `src/MexicoMap.jsx`, `src/mapGeometry.js`, `src/main.jsx`, `scripts/validate.test.js` y este README; nuevos `src/mapCamera.js` (cámara y gestos comprobables sin navegador) y `src/map-adventure.css` (estética y relieve).

Validación de esta ampliación: **8 pruebas automáticas**, build de producción, las 32 selecciones con una superficie elevada y 31 silenciadas, clic, panorámica con arrastre y teclado, límite de 700 %, restablecimiento a 100 %, cierre y recuperación de todos los colores, navegación de Puebla y ausencia de errores de consola. Se revisó el diseño a un ancho de 390 píxeles sin desbordamiento y con controles dentro del escenario. La matemática del pellizco tiene pruebas automatizadas; sigue pendiente la validación del gesto con dos dedos en un dispositivo físico.

## Ejecutar localmente

Con Node.js 18 o superior (recomendado Node.js 22 LTS):

```sh
npm install
npm run dev
```

Abre la URL que imprime Vite. Comprobaciones y vista previa de producción:

```sh
npm test
npm run build
npm run preview
```

No se añadieron dependencias en esta fase. Las pruebas usan el módulo integrado `node:test`.

## Uso

- Elige a Lia o Rocko y confirma.
- Mueve el cursor por el escenario; la burbuja sigue con inercia y un desplazamiento lateral que deja visible el punto de selección. No intercepta eventos (`pointer-events: none`).
- Pasa el cursor por una entidad para ver su nombre. Haz clic para seleccionarla: la elevación, la sombra, el contorno y la tarjeta con ✓ indican la selección sin depender solo del color.
- En táctil, arrastra para mover la burbuja y toca sin arrastrar para seleccionar. Un desplazamiento mayor a 8 píxeles se considera arrastre y no selecciona una entidad accidentalmente. El escenario usa `touch-action: none`; la página conserva su desplazamiento fuera del escenario.
- Con Tab puedes enfocar las 32 regiones SVG. Enter o Espacio seleccionan una entidad; las flechas mueven la burbuja. El selector «Encuentra una entidad» permite elegir regiones pequeñas, especialmente en móviles.
- Solo Puebla ofrece «Comenzar historia». Las otras 31 entidades muestran «Próximamente».
- La historia conserva el personaje elegido, ofrece una introducción con dato oficial y enlace, y «Continuar» abre únicamente una transición de contenido pendiente. «Volver al mapa» conserva personaje y entidad.
- «Cerrar y seguir explorando» borra la selección. «Cambiar personaje» conserva la última elección en las tarjetas.

## Archivos modificados

- `src/main.jsx`: navegación local entre selección, mapa, Puebla y transición; selección de entidad y distinción entre toque y arrastre.
- `src/MexicoMap.jsx`: carga de geometrías locales, 32 regiones SVG accesibles, resaltado y etiquetas; error recuperable con reintento.
- `src/FloatingCharacter.jsx`: conserva la animación y la limpieza de requestAnimationFrame; posición inicial sobre una zona libre del escenario.
- `src/styles.css`: estados de interacción, rayado de selección, tarjeta, introducción y adaptación móvil. Se conserva la estética de la fase 1 y movimiento reducido.
- `package.json`: comando `npm test`, sin cambios de dependencias.
- `README.md`: instrucciones y fuentes de esta fase.

## Archivos añadidos

- `src/StateInfoCard.jsx`: nombre, disponibilidad y acciones de la entidad.
- `src/PueblaIntroduction.jsx`: bienvenida del personaje, dato con fuente y transición.
- `src/data/states.js`: catálogo de 32 nombres normalizados y claves INEGI de dos dígitos.
- `src/data/puebla.js`: narrativa y metadatos del dato oficial, separados de la interfaz.
- `src/mapGeometry.js`: proyección, trazados y validación de las 32 geometrías.
- `public/mexico-states.geojson`: copia local de la geometría estatal.
- `public/geography-source.json`: metadatos originales de procedencia y licencia.
- `scripts/validate.test.js`: pruebas de integridad, identidad independiente del orden y disponibilidad de historias.

`src/Character.jsx` se reutiliza sin cambios. `public/mexico.json` se conserva como recurso de la fase 1, pero el mapa interactivo utiliza exclusivamente el archivo estatal, evitando desajustes entre dos fuentes distintas.

## Procedencia y licencia geográfica

Fuente primaria declarada por geoBoundaries: **Instituto Nacional de Estadística y Geografía (INEGI)**. Capa **gbOpen MEX ADM1**, identificador `MEX-ADM1-31927357`, año representado **2020**, compilación **21 de febrero de 2024**, 32 entidades. No representa una actualización de límites a 2026.

- [Metadatos de la capa](https://www.geoboundaries.org/api/current/gbOpen/MEX/ADM1/).
- [Archivo fijado a la revisión 90a1d52](https://github.com/wmgeolab/geoBoundaries/blob/90a1d52/releaseData/gbOpen/MEX/ADM1/geoBoundaries-MEX-ADM1_simplified.geojson).
- [Descarga del archivo real de Git LFS](https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/90a1d52/releaseData/gbOpen/MEX/ADM1/geoBoundaries-MEX-ADM1_simplified.geojson).
- [Fuente original enlazada en los metadatos](https://data.humdata.org/dataset/mexican-administrative-level-0-country-1-estado-and-2-municipio-boundary-polygons).
- Distribución gbOpen bajo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Los metadatos de la capa consignan **CC BY 3.0 IGO** para la fuente original; se conserva esa declaración en `public/geography-source.json` y se acredita a INEGI y geoBoundaries en la interfaz.

Se utiliza la simplificación proporcionada por geoBoundaries, sin inventar polígonos ni fronteras. Se proyectan las coordenadas para mostrarlas como SVG. No requiere una biblioteca geográfica ni una conexión externa durante la exploración.

La fuente llama «Distrito Federal» a CDMX y repite `MX-MEX` en CDMX y México. `states.js` une cada geometría por su nombre original, valida una coincidencia exacta y asigna su clave INEGI estable: **09 Ciudad de México**, **15 México**, **21 Puebla**. No se utiliza el orden de los elementos para identificar estados. Se normalizan acentos y nombres actuales en la interfaz.

## Fuente electoral de Puebla

**64.3 %**, participación de la población inscrita en la Lista Nominal en Puebla en la **jornada del 2 de junio de 2024**, reportada por el **Estudio Muestral de Participación Ciudadana 2024** del INE. Es un resultado muestral; no una cifra actual, un conteo de votos ni un resultado del PREP.

[Publicación oficial de INE / Central Electoral](https://centralelectoral.ine.mx/2025/10/10/estudio-muestral-2024-senala-aumento-del-11-2-por-ciento-de-participacion-de-las-mujeres-poblanas/), publicada el **10 de octubre de 2025**, consultada el **28 de octubre de 2026**. El primer párrafo identifica la cifra, la entidad, el universo y la fecha; el siguiente atribuye los resultados al estudio muestral. Título, URL, fecha, universo, proceso y metodología están guardados en `src/data/puebla.js`. La escena incluye un enlace visible a la publicación.

## Comprobaciones y límites

Las pruebas verifican 32 geometrías, claves únicas 01–32, correspondencia aunque se invierta el orden del archivo, distinción CDMX/México, rechazo de entidades ausentes o duplicadas, Puebla como única historia y contexto/fuente del dato. El build genera la versión estática en `dist/`.

La revisión en navegador cubre selección de las 32 entidades por teclado, clics en regiones, navegación de Puebla y transición, conservación del personaje y adaptación a un ancho de 390 píxeles sin desbordamiento horizontal. La interacción táctil está implementada con Pointer Events; falta validarla en un teléfono físico. En móviles las entidades pequeñas también se pueden elegir en el selector.

El archivo geográfico ocupa aproximadamente 4 MB antes de compresión y se carga localmente al entrar al mapa. La navegación y elecciones se conservan en memoria durante la sesión; una recarga vuelve al inicio. La fuente oficial del INE se abre externamente y requiere conexión. Las otras historias, misiones, minijuegos, perfiles, recompensas y servicios futuros están fuera de esta fase.

## Revelado del territorio al seleccionar
El mapa inicial utiliza un único morado, con límites geográficos visibles y sin paisajes ni rótulos interiores. Al seleccionar una entidad se centra automáticamente la cámara y solo ese territorio revela su degradado violeta/magenta, sus ilustraciones, su nombre y su relieve. Las otras entidades permanecen sin ilustraciones y se atenúan en gris. Cerrar restaura el mapa morado y la vista completa. Esta presentación sustituye la distribución inicial de varios tonos y los paisajes siempre visibles descritos anteriormente.

