import React from 'react';
import { stateByCode } from './data/states';
export default function StateInfoCard({code,onClose,onStart}) {
 const state = stateByCode[code];
 return <section className="state-info" aria-labelledby="state-card-title"><div><div className="eyebrow">✓ ENTIDAD SELECCIONADA · {state.code}</div><h2 id="state-card-title">{state.name}</h2><p role="status">{state.hasStory ? 'Una primera historia te espera en Puebla.' : 'Próximamente · Su historia todavía está en preparación.'}</p></div><div className="state-actions">{state.hasStory && <button className="primary" onClick={onStart}>Comenzar historia ↗</button>}<button className="back" onClick={onClose}>Cerrar y seguir explorando</button></div></section>;
}
