// Datos de la Plataforma de Conteos Censales de Participación Ciudadana (CCPC) del INE.
// SOLO se incluyen cifras verificadas con fuente. Para completar otras entidades, agrega su
// registro en `stateData` (clave INEGI de 2 dígitos) con el porcentaje exacto de la plataforma.

export const CCPC_URL = 'https://ine.mx/transparencia/datos-abiertos/visualizacion-datos/conteos-censales-participacion/';
export const NOTE_URL = 'https://www.razon.com.mx/mexico/2025/08/05/elecciones-2024-tuvieron-menor-participacion-ine/';
export const NOTE_LABEL = 'Plataforma CCPC (INE), según La Razón, 5 ago 2025';

export const national = { 2012: 62.1, 2018: 62.4, 2024: 59.7 }; // elecciones presidenciales

// kind: 'value' (porcentaje de la plataforma) | 'sample' (estudio muestral, no comparable directo)
//       | 'high' / 'low' (la fuente la ubica entre las más altas/bajas, sin porcentaje)
export const stateData = {
  '31': { kind: 'value', value: 71.4, rank: 'high', year: 2024, source: NOTE_LABEL, url: NOTE_URL },
  '02': { kind: 'value', value: 47, rank: 'low', year: 2024, source: NOTE_LABEL, url: NOTE_URL },
  '21': { kind: 'sample', value: 64.3, year: 2024, source: 'Estudio Muestral de Participación Ciudadana 2024 (INE)', url: 'https://centralelectoral.ine.mx/2025/10/10/estudio-muestral-2024-senala-aumento-del-11-2-por-ciento-de-participacion-de-las-mujeres-poblanas/' },
  '29': { kind: 'high', year: 2024, source: NOTE_LABEL, url: NOTE_URL },
  '09': { kind: 'high', year: 2024, source: NOTE_LABEL, url: NOTE_URL },
  '05': { kind: 'high', year: 2024, source: NOTE_LABEL, url: NOTE_URL },
  '26': { kind: 'low', year: 2024, source: NOTE_LABEL, url: NOTE_URL },
  '08': { kind: 'low', year: 2024, source: NOTE_LABEL, url: NOTE_URL },
};

export const countryInsights = [
  'Las mujeres han participado por encima de 60 % durante unos 15 años.',
  'Las personas de 60 a 74 años son quienes más participan en cada elección.',
  'Las personas de 20 a 29 y las de más de 80 años son quienes menos participan.',
];

const fmt = n => String(n).replace('.', ',');
const ofTen = v => {
  const r = Math.round(v / 10), diff = v - r * 10;
  if (Math.abs(diff) <= 1.5) return `${r} de cada 10`;
  return `${diff < 0 ? 'casi' : 'más de'} ${r} de cada 10`;
};
export { ofTen };

// Devuelve lo que el personaje explicará para una entidad.
export function explainState(code, stateName) {
  const d = stateData[code];
  const nat = national[2024];
  const items = [];
  const bars = [];
  items.push({ label: 'Referencia nacional · 2024', value: `${fmt(nat)} %`, says: `En todo el país votaron unas 6 de cada 10 personas inscritas en la Lista Nominal. Con este número comparamos a cada entidad.` });
  bars.push({ label: 'Todo México', value: nat, tone: 'nat' });

  if (d?.kind === 'value') {
    const diff = Math.round((d.value - nat) * 10) / 10;
    items.unshift({ label: `${stateName} · ${d.year}`, value: `${fmt(d.value)} %`, says: `Esto quiere decir que, de cada 100 personas inscritas en la Lista Nominal de ${stateName}, ${Math.round(d.value)} fueron a votar: ${ofTen(d.value)}.` });
    items.splice(1, 0, { label: 'Frente al promedio nacional', value: `${diff > 0 ? '+' : '−'}${fmt(Math.abs(diff))} puntos`, says: `Un punto es 1 de cada 100 personas. ${stateName} quedó ${fmt(Math.abs(diff))} puntos ${diff > 0 ? 'por encima' : 'por debajo'} del promedio${d.rank === 'high' ? ' y, según la plataforma, tuvo la participación más alta del país' : d.rank === 'low' ? ' y, según la plataforma, tuvo la participación más baja del país' : ''}.` });
    bars.unshift({ label: stateName, value: d.value, tone: 'state' });
  } else if (d?.kind === 'sample') {
    items.unshift({ label: `${stateName} · ${d.year} (estudio muestral)`, value: `${fmt(d.value)} %`, says: `Quiere decir que cerca de ${Math.round(d.value / 10)} de cada 10 personas inscritas en la Lista Nominal participaron. Viene de una muestra, no de un conteo completo, así que no la comparamos directo con el 59,7 % nacional. ¡Comparar solo cosas medidas igual!` });
    bars.unshift({ label: `${stateName} (muestral)`, value: d.value, tone: 'sample' });
  } else if (d?.kind === 'high' || d?.kind === 'low') {
    items.unshift({ label: `${stateName} · ${d.year}`, value: d.kind === 'high' ? 'Entre las más altas' : 'Entre las más bajas', says: `Según la fuente, ${stateName} está entre las entidades con participación ${d.kind === 'high' ? 'más alta' : 'más baja'}. Todavía no cargamos su porcentaje exacto: puedes consultarlo en la plataforma.` });
  } else {
    items.unshift({ label: `${stateName} · 2024`, value: 'Dato por cargar', says: `Aún no cargamos el porcentaje de ${stateName}. En la plataforma del INE puedes ver su participación por elección, sexo y edad.` });
  }
  return { items, bars, source: d ? { label: d.source, url: d.url } : { label: NOTE_LABEL, url: NOTE_URL }, hasValue: d?.kind === 'value' || d?.kind === 'sample' };
}
