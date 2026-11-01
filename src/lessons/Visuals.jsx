import React, { useState } from 'react';
import { participationData } from './lessonsData';

function Person({ filled }) {
  return <svg className={`person ${filled ? 'on' : ''}`} viewBox="0 0 24 40" aria-hidden="true"><circle cx="12" cy="9" r="7"/><path d="M3 38V24a9 9 0 0 1 18 0v14z"/></svg>;
}

export function People({ filled, total = 10 }) {
  return <div className="people" aria-hidden="true">{Array.from({ length: total }, (_, i) => <Person key={i} filled={i < filled}/>)}</div>;
}

// Pictograma interactivo: mover la barra pinta personas.
export function Pictogram() {
  const [n, setN] = useState(6);
  return <figure className="visual pictogram">
    <figcaption>¿Cuántas de 10 personas votaron?</figcaption>
    <People filled={n}/>
    <label className="range-label" htmlFor="pictogram-range">Mueve la barra</label>
    <input id="pictogram-range" type="range" min="0" max="10" step="1" value={n} onChange={e => setN(Number(e.target.value))} aria-valuetext={`${n} de cada 10`}/>
    <p className="visual-readout" role="status"><b>{n} de cada 10</b> = <b>{n * 10} de cada 100</b> = <b>{n * 10} %</b></p>
  </figure>;
}

export function BarChart() {
  const { rows, title, unit, source, sourceUrl, note } = participationData;
  const summary = rows.map(r => `${r.year}: ${r.value} %`).join('; ');
  return <figure className="visual barchart">
    <figcaption>{title}</figcaption>
    <div className="bars" role="img" aria-label={`Gráfica de barras. ${summary}. Valores en ${unit}.`}>
      {rows.map(r => <div className="bar-col" key={r.year}>
        <span className="bar-value">{r.value} %</span>
        <div className="bar-track"><div className="bar-fill" style={{ height: `${r.value}%` }}/></div>
        <span className="bar-year">{r.year}</span>
      </div>)}
    </div>
    <p className="visual-unit">{unit}</p>
    <p className="visual-source">Fuente: <a href={sourceUrl} target="_blank" rel="noreferrer">{source}</a> {note}</p>
  </figure>;
}

export function Compare() {
  return <figure className="visual compare">
    <figcaption>Datos de juguete (inventados para practicar)</figcaption>
    <div className="compare-grid">
      <div><h4>Colonia Sol</h4><People filled={7}/><p><b>7 de cada 10</b> votaron</p></div>
      <div><h4>Colonia Luna</h4><People filled={4}/><p><b>4 de cada 10</b> votaron</p></div>
    </div>
  </figure>;
}

export function Visual({ kind }) {
  if (kind === 'pictogram') return <Pictogram/>;
  if (kind === 'barchart') return <BarChart/>;
  if (kind === 'compare') return <Compare/>;
  return null;
}
