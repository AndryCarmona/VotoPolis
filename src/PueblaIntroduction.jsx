import React from 'react';
import Character from './Character';
import { pueblaStory } from './data/puebla';
export default function PueblaIntroduction({name,transition,onContinue,onBack}) {
 const {fact} = pueblaStory;
 return <main className="story-screen"><button className="back" onClick={onBack}>← Volver al mapa</button><div className="story-layout"><div className="story-character"><div className="bubble"><Character name={name}/><span className="bubble-glint"/></div><span>{name} te acompaña</span></div><div className="story-copy"><div className="eyebrow">PUEBLA · EL COMIENZO DE UNA HISTORIA</div><h1 tabIndex="-1" data-screen-heading>{transition ? 'Nuestra historia continuará…' : pueblaStory.welcome}</h1>{transition ? <><p>La siguiente parte de la historia se desarrollará en una fase posterior. Mientras tanto, puedes seguir conociendo las entidades de México.</p><button className="primary" onClick={onBack}>Seguir explorando México ↗</button></> : <><p><b>{name} dice: </b>{pueblaStory.narrative}</p><p className="story-question">{pueblaStory.question}</p><article className="official-fact" aria-labelledby="fact-title"><div className="eyebrow" id="fact-title">UN DATO PARA CONVERSAR · INE</div><strong>{fact.value}</strong><p>{fact.description}</p><small>{fact.process}<br/>{fact.methodology}</small><a href={fact.url} target="_blank" rel="noreferrer">Consultar fuente oficial del INE ↗</a><small>Publicada el 10 de octubre de 2025 · {fact.study}</small></article><button className="primary" onClick={onContinue}>Continuar ↗</button></>}</div></div></main>;
}

