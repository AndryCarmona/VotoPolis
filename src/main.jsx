import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Character from './Character';
import MexicoMap from './MexicoMap';
import FloatingCharacter from './FloatingCharacter';
import StateInfoCard from './StateInfoCard';
import PueblaIntroduction from './PueblaIntroduction';
import { states } from './data/states';
import LessonsHome from './lessons/LessonsHome';
import LessonPlayer from './lessons/LessonPlayer';
import Duel from './duel/Duel';
import './styles.css';
import './map-adventure.css';
import './lessons/lessons.css';

function Selection({ onConfirm, initialName }) {
  const [selected, setSelected] = useState(initialName || 'Lia');
  return <main className="selection"><div className="eyebrow"><span/> UN GRAN VIAJE EMPIEZA CONTIGO</div><h1>Pequeños exploradores.<br/><em>Un México por descubrir.</em></h1><p className="intro">Cada gran cambio empieza con la curiosidad.<br/>Elige a tu acompañante y hagamos nuestro primer recorrido.</p>
    <fieldset className="characters"><legend>¿Con quién quieres explorar?</legend>{['Lia', 'Rocko'].map((name, i) => <label className={`character-card ${name.toLowerCase()} ${selected === name ? 'selected' : ''}`} key={name}>
      <input type="radio" name="character" value={name} checked={selected === name} onChange={() => setSelected(name)}/><span className="check" aria-hidden="true">{selected === name ? '✓' : ''}</span><span className="card-index">0{i + 1}</span><div className="character-art"><span className="art-circle"/><span className="spark spark-one">✧</span><Character name={name}/><span className="spark spark-two">✦</span></div><span className="character-name">{name}</span><span className="species">{i === 0 ? 'Una ajolote con mucha curiosidad' : 'Un xolo con espíritu aventurero'}</span><span className="select-label">{selected === name ? 'Tu acompañante' : 'Elegir a ' + name}</span>
    </label>)}</fieldset><button className="primary" onClick={() => onConfirm(selected)}>¡Vamos a explorar! <span aria-hidden="true">↗</span></button><p className="small-note">Podrás cambiar de acompañante cuando quieras.</p></main>;
}
function Exploration({ name, onBack, selectedCode, onSelect, onStart }) {
  const areaRef = useRef(null), target = useRef(null);
  const [active, setActive] = useState(false);
  const gesture = useRef(null), wasDrag = useRef(false);
  function move(e) { if (e.pointerType !== 'mouse' && (!e.buttons || !e.isPrimary)) return; if (gesture.current && Math.hypot(e.clientX - gesture.current.x, e.clientY - gesture.current.y) > 8) wasDrag.current = true; const rect = areaRef.current.getBoundingClientRect(); target.current = { x: e.clientX - rect.left + 60, y: e.clientY - rect.top - 55 }; setActive(true); }
  return <main className="exploration"><div className="explore-heading"><div><div className="eyebrow">TU PRIMER RECORRIDO</div><h1 tabIndex="-1" data-screen-heading>México te espera<span>.</span></h1></div><button className="back" onClick={onBack}>← Cambiar personaje</button></div><div ref={areaRef} className={`explore-area ${active ? 'active' : ''}`} tabIndex="0" aria-label="Zona de exploración. Mueve el cursor, arrastra el dedo o usa las flechas para mover a tu personaje." onPointerEnter={e => { if (e.pointerType === 'mouse') setActive(true); }} onPointerMove={move} onPointerDown={e => { gesture.current = { x: e.clientX, y: e.clientY }; wasDrag.current = false; move(e); }} onPointerUp={e => { gesture.current = null; if (e.pointerType !== 'mouse') setActive(false); }} onPointerLeave={() => setActive(false)} onPointerCancel={() => { gesture.current = null; wasDrag.current = true; setActive(false); }} onKeyDown={e => { const delta = { ArrowLeft: [-30, 0], ArrowRight: [30, 0], ArrowUp: [0, -30], ArrowDown: [0, 30] }[e.key]; if (!delta) return; e.preventDefault(); const p = target.current ?? { x: areaRef.current.clientWidth / 2, y: areaRef.current.clientHeight / 2 }; target.current = { x: Math.max(80, Math.min(areaRef.current.clientWidth - 80, p.x + delta[0])), y: Math.max(80, Math.min(areaRef.current.clientHeight - 80, p.y + delta[1])) }; setActive(true); }}>
      <span className="area-label"><i/> {active ? 'Explorando contigo' : 'Todo listo para explorar'}</span><MexicoMap selectedCode={selectedCode} onSelect={onSelect} wasDrag={wasDrag}/><FloatingCharacter name={name} areaRef={areaRef} target={target}/><div className="map-caption">UN PAÍS, MUCHAS FORMAS DE PARTICIPAR</div>
    </div><p className="movement-hint"><span aria-hidden="true">✥</span><span className="desktop-hint">Elige una entidad y descubre su relieve</span><span className="touch-hint">Toca para elegir; pellizca para acercar</span><span className="hint-detail">Amplía el mapa para ver más detalles.</span></p><div className="map-tools"><label htmlFor="state-select">Encuentra una entidad <select id="state-select" value={selectedCode || ""} onChange={e => onSelect(e.target.value || null)}><option value="">Selecciona una entidad</option>{states.map(state => <option key={state.code} value={state.code}>{state.name}</option>)}</select></label><a href="https://www.geoboundaries.org/" target="_blank" rel="noreferrer">Geografía: INEGI / geoBoundaries · CC BY 4.0</a></div>{selectedCode && <StateInfoCard code={selectedCode} onClose={() => onSelect(null)} onStart={onStart}/>}</main>;
}
function App() {
  const [name, setName] = useState(null);
  const [screen, setScreen] = useState('selection');
  const [selectedCode, setSelectedCode] = useState(null);
  useEffect(() => {
    // Orienta a lectores de pantalla al cambiar de escena, sin forzar el foco en cada selección.
    document.querySelector('[data-screen-heading]')?.focus();
  }, [screen]);
  const [lessonId, setLessonId] = useState(1);
  const inLessons = screen === 'learn' || screen === 'lesson';
  const backToMap = () => setScreen('map');
  return <div className="app"><header><a href="./" className="brand" aria-label="Ajolotitlán, inicio" onClick={e => { e.preventDefault(); setScreen('selection'); }}><span className="brand-icon">✳</span> ajolotitlán<span className="brand-dot">.</span></a><div className="header-right"><span>Descubre. Explora. Participa.</span><b className="ine">INE</b></div></header>{name && screen !== 'selection' && <nav className="subnav" aria-label="Secciones"><button className={inLessons ? 'active' : ''} aria-current={inLessons ? 'page' : undefined} onClick={() => setScreen('learn')}><span aria-hidden="true">📚</span> Lecciones</button><button className={screen === 'duel' ? 'active' : ''} aria-current={screen === 'duel' ? 'page' : undefined} onClick={() => setScreen('duel')}><span aria-hidden="true">⚔️</span> Duelo</button><button className={!inLessons && screen !== 'duel' ? 'active' : ''} aria-current={!inLessons && screen !== 'duel' ? 'page' : undefined} onClick={() => setScreen('map')}><span aria-hidden="true">🗺️</span> Mapa</button></nav>}{screen === 'selection' ? <Selection initialName={name} onConfirm={choice => { setName(choice); setScreen('learn'); }}/> : screen === 'learn' ? <LessonsHome name={name} onOpen={id => { setLessonId(id); setScreen('lesson'); }} onMap={() => setScreen('map')} onDuel={() => setScreen('duel')}/> : screen === 'duel' ? <Duel guide={name} onExit={() => setScreen('learn')} onLessons={() => setScreen('learn')}/> : screen === 'lesson' ? <LessonPlayer lessonId={lessonId} guide={name} onExit={() => setScreen('learn')} onOpen={setLessonId}/> : screen === 'map' ? <Exploration name={name} onBack={() => setScreen('selection')} selectedCode={selectedCode} onSelect={setSelectedCode} onStart={() => { if (selectedCode === '21') setScreen('puebla'); }}/> : <PueblaIntroduction name={name} transition={screen === 'transition'} onContinue={() => setScreen('transition')} onBack={backToMap}/>}<footer><span>Un pequeño viaje hacia una gran ciudadanía.</span><span>HECHO DE CURIOSIDAD Y DIVERSIDAD <span className="footer-flower">✳</span></span></footer></div>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);



