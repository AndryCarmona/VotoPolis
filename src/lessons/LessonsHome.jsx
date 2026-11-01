import React, { useMemo } from 'react';
import Character from '../Character';
import { lessons, sources } from './lessonsData';
import { readProgress, safeStorage } from './lessonUtils';
import LearningTree, { STAGES, treeStage } from './LearningTree';

function Stars({ value, total = 3 }) {
  return <span className="stars" role="img" aria-label={`${value} de ${total} estrellas`}>{Array.from({ length: total }, (_, i) => <span key={i} className={i < value ? 'on' : ''} aria-hidden="true">★</span>)}</span>;
}

export default function LessonsHome({ name, onOpen, onMap, onDuel }) {
  const progress = useMemo(() => readProgress(safeStorage()), []);
  const done = lessons.filter(l => (progress[l.id] ?? 0) > 0).length;
  const allDone = done === lessons.length;
  const next = lessons.find(l => !(progress[l.id] > 0)) ?? lessons[0];
  return <main className="lessons-home">
    <section className="lessons-hero">
      <div className="hero-copy">
        <div className="eyebrow left">APRENDE CON {name.toUpperCase()}</div>
        <h1 tabIndex="-1" data-screen-heading>8 lecciones para entender la democracia<span className="dot">.</span></h1>
        <p className="intro-lg">Aprende qué es la democracia, por qué importa participar y cómo leer los datos de participación. Cada lección tiene una explicación corta, casos de la vida diaria y un cuestionario.</p>
        <div className="hero-actions">
          <button className="primary" onClick={() => onOpen(next.id)}>{done === 0 ? 'Empezar la lección 1' : allDone ? 'Repasar la lección 1' : `Seguir con la lección ${next.id}`}<span aria-hidden="true">↗</span></button>
          <button className="back" onClick={onMap}>🗺️ Explorar el mapa</button>
        </div>
        <div className="overall" role="progressbar" aria-valuemin="0" aria-valuemax={lessons.length} aria-valuenow={done} aria-label="Lecciones completadas">
          <div className="overall-bar"><i style={{ width: `${(done / lessons.length) * 100}%` }}/></div>
          <span>{done} de {lessons.length} lecciones completadas</span>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true"><div className="bubble big"><Character name={name}/></div></div>
    </section>
    {allDone && <p className="celebrate" role="status">🎉 ¡Completaste las 8 lecciones! Ya eres embajadora o embajador de la participación. Cuéntale a alguien lo que aprendiste.</p>}
    <div className="grow-row">
      <section className="tree-card" aria-labelledby="tree-h">
        <LearningTree count={done}/>
        <div>
          <h2 id="tree-h">Tu árbol de aprendizaje</h2>
          <p className="tree-stage"><b>{STAGES[treeStage(done)]}</b> · {done} de {lessons.length} lecciones</p>
          <p>{allDone ? '¡Tu árbol llegó a lo más alto! Gracias por aprender y participar.' : `Completa ${lessons.length - done} ${lessons.length - done === 1 ? 'lección más' : 'lecciones más'} y mira cómo crece, de una semillita a un árbol grandote.`}</p>
        </div>
      </section>
      <section className="duel-promo" aria-labelledby="duel-promo-h">
        <span className="duel-emoji" aria-hidden="true">⚔️🗳️</span>
        <h2 id="duel-promo-h">Duelo Democrático</h2>
        <p>Crea una sala, comparte el código y juega con alguien más. ¡Quien acierte más será la persona más democrática!</p>
        <button className="primary" onClick={onDuel}>Jugar ahora <span aria-hidden="true">↗</span></button>
      </section>
    </div>
    <ol className="lesson-grid">
      {lessons.map(l => {
        const best = progress[l.id] ?? 0;
        return <li key={l.id}>
          <button className={`lesson-card ${best > 0 ? 'done' : ''}`} onClick={() => onOpen(l.id)}>
            <span className="lesson-num">Lección {l.id}</span>
            <span className="lesson-emoji" aria-hidden="true">{l.emoji}</span>
            <span className="lesson-title">{l.title}</span>
            <span className="lesson-tag">{l.tagline}</span>
            <span className="lesson-foot">{best > 0 ? <Stars value={best}/> : <span className="lesson-cta">Empezar →</span>}{best > 0 && <span className="lesson-cta">Repasar</span>}</span>
          </button>
        </li>;
      })}
    </ol>
    <aside className="lessons-sources" aria-label="Fuentes">
      <h2>Para familias y docentes</h2>
      <p>Las cifras de la lección 6 provienen de la Plataforma de Conteos Censales de Participación Ciudadana (CCPC) del INE. Los ejemplos de colonias son inventados para practicar. Fuentes:</p>
      <ul>{sources.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.label}</a></li>)}</ul>
    </aside>
  </main>;
}
