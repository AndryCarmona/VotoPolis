# VotoPolis

Prototipo para **Hackea la participación: Datos que construyen democracia** (INE · DECEyEC, 2026) — **Eje 3 / Reto 3: Comunicación y visualización con impacto público (storytelling con datos)**.

> Pregunta guía del reto: *¿cómo traducir los datos de participación en mensajes comprensibles para la ciudadanía?*

## Qué es

Una experiencia web interactiva en la que la persona elige un acompañante (Lia, una ajolote, o Rocko, un xolo), explora el mapa de las 32 entidades de México y entra a la historia de cada una. El objetivo es que cualquier persona entienda **por qué importa participar**, **cuánta gente participa** y **cómo varía entre regiones**.

Nombre de la experiencia en la interfaz actual: *Ajolotitlán*.

## Estado actual

| Pieza | Estado |
| --- | --- |
| Selección de personaje | Listo |
| Mapa interactivo de 32 entidades (zoom, arrastre, teclado, táctil) | Listo |
| Historia de Puebla (1 dato oficial con fuente) | Listo |
| Historias de las otras 31 entidades | Pendiente |
| Datos de la Plataforma CCPC 2009–2024 (por elección y región) | Pendiente |
| Comparaciones temporales y territoriales | Pendiente |

Ver [`docs/ENTREGABLES-RETO3.md`](docs/ENTREGABLES-RETO3.md) para la lista de entregables de la convocatoria.

## Ejecutar localmente

Requiere Node.js 18 o superior (recomendado 22 LTS).

```sh
npm install
npm run dev      # servidor de desarrollo
npm test         # 8 pruebas automáticas (node:test)
npm run build    # versión estática en dist/
npm run preview  # vista previa de producción
```

## Estructura

```
src/            Interfaz React (mapa, cámara, personajes, historias)
src/data/       Catálogo de entidades (claves INEGI) y contenido narrativo
public/         Geometría estatal local y metadatos de procedencia
scripts/        Pruebas automáticas
docs/           Bitácora técnica y checklist de entregables
```

## Datos y fuentes

- **Participación:** Plataforma de Conteos Censales de Participación Ciudadana (CCPC) 2009–2024, INE — <https://ine.mx/transparencia/datos-abiertos/visualizacion-datos/conteos-censales-participacion/>. Solo datos agregados, sin datos personales.
- **Dato de Puebla incluido hoy (64.3 %):** Estudio Muestral de Participación Ciudadana 2024, INE. Es un resultado muestral, no un conteo de votos.
- **Geografía:** INEGI vía geoBoundaries (gbOpen MEX ADM1, CC BY 4.0). Detalle en [`public/geography-source.json`](public/geography-source.json) y en la [bitácora técnica](docs/BITACORA-TECNICA.md).

## Licencia y derechos

Aún no se define una licencia de código. La convocatoria establece una cesión de derechos patrimoniales al INE por 10 años para los trabajos presentados, conservando la autoría; conviene definir la licencia con el equipo antes de publicarla.
