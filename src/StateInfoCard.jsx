import React from 'react';
import Character from './Character';
import Icon from './Icon';
import { stateByCode } from './data/states';
import { explainState, countryInsights, CCPC_URL } from './data/ccpc';

export default function StateInfoCard({ code, name, onClose, onStart }) {
  const state = stateByCode[code];
  const info = explainState(code, state.name);
  const max = Math.max(...info.bars.map(b => b.value), 1);
  return <section className="state-info" aria-labelledby="state-card-title">
    <div className="state-head">
      <div>
        <div className="eyebrow left"><Icon name="check" size={14}/> ENTIDAD SELECCIONADA · {state.code}</div>
        <h2 id="state-card-title">{state.name}</h2>
      </div>
      <div className="state-actions">
        {state.hasStory && <button className="primary" onClick={onStart}>Comenzar historia ↗</button>}
        <button className="back" onClick={onClose}>Cerrar y seguir explorando</button>
      </div>
    </div>

    <div className={`say ${name.toLowerCase()} state-say`}>
      <div className="say-avatar" aria-hidden="true"><Character name={name}/></div>
      <div className="say-body">
        <b className="say-name">{name} te explica</b>
        <p>Vamos a leer juntos los números de {state.name}. Un porcentaje es «de cada 100 personas»: si dice 60 %, son 60 de cada 100, o sea, 6 de cada 10.</p>
      </div>
    </div>

    <ul className="data-items">
      {info.items.map(it => <li key={it.label}>
        <span className="data-label">{it.label}</span>
        <b className="data-value">{it.value}</b>
        <p>{it.says}</p>
      </li>)}
    </ul>

    {info.bars.length > 1 && <div className="data-bars" role="img" aria-label={info.bars.map(b => `${b.label}: ${String(b.value).replace('.', ',')} por ciento`).join('. ')}>
      {info.bars.map(b => <div className="data-bar" key={b.label}><span>{b.label}</span><div className="data-track"><i className={b.tone} style={{ width: `${(b.value / max) * 100}%` }}/></div><b>{String(b.value).replace('.', ',')} %</b></div>)}
    </div>}

    <details className="data-more">
      <summary>También en todo el país</summary>
      <ul>{countryInsights.map(t => <li key={t}>{t}</li>)}</ul>
    </details>
    <p className="data-source">Fuente: <a href={info.source.url} target="_blank" rel="noreferrer">{info.source.label}</a> · <a href={CCPC_URL} target="_blank" rel="noreferrer">Ver la plataforma CCPC del INE</a></p>
  </section>;
}
