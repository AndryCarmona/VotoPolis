import React, { useEffect, useReducer, useRef, useState } from 'react';
import Character from '../Character';
import { THEMES, scenarios } from './duelData';
import { buildGame, cleanName, emptyView, isValidCode, makeRoomCode, normalizeCode, reduceView, SECONDS } from './duelEngine';
import { DuelHost } from './duelHost';
import { hostRoom, joinRoom } from './roomLink';

const view = (v, a) => (a.t === 'reset' ? emptyView : reduceView(v, a, Date.now()));

function Countdown({ deadline, seconds, locked }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, (deadline - Date.now()) / 1000));
    tick();
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, [deadline]);
  const pct = Math.max(0, Math.min(100, (left / seconds) * 100));
  return <div className={`countdown ${left <= 5 ? 'hurry' : ''} ${locked ? 'locked' : ''}`} role="timer" aria-label={`Tiempo restante: ${Math.ceil(left)} segundos`}>
    <div className="countdown-bar"><i style={{ width: `${pct}%` }}/></div>
    <b aria-hidden="true">{Math.ceil(left)} s</b>
  </div>;
}

export default function Duel({ guide, onExit, onLessons }) {
  const [step, setStep] = useState('menu'); // menu | host | join | lobby | play | error
  const [role, setRole] = useState(null);
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('mezcla');
  const [codeInput, setCodeInput] = useState('');
  const [code, setCode] = useState('');
  const [names, setNames] = useState({ host: '', guest: '' });
  const [notice, setNotice] = useState('');
  const [peerOk, setPeerOk] = useState(null);
  const [copied, setCopied] = useState(false);
  const [state, dispatch] = useReducer(view, emptyView);
  const link = useRef(null), ctrl = useRef(null), headingRef = useRef(null);
  const friend = guide === 'Lia' ? 'Rocko' : 'Lia';

  const closeAll = () => { ctrl.current?.dispose(); ctrl.current = null; link.current?.close(); link.current = null; };
  useEffect(() => closeAll, []); // limpia al salir de la pantalla
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, [step, state.phase, state.index]);

  function reset(next = 'menu') { closeAll(); dispatch({ t: 'reset' }); setNotice(''); setPeerOk(null); setRole(null); setStep(next); }

  function createRoom(e) {
    e.preventDefault();
    const me = cleanName(name, 'Anfitrión');
    const c = makeRoomCode();
    setName(me); setCode(c); setRole('host'); setNames({ host: me, guest: '' }); setNotice('');
    link.current = hostRoom(c, me, {
      onGuest: g => setNames(n => ({ ...n, guest: g })),
      onMessage: m => { if (m.t === 'answer') ctrl.current?.answer('guest', m.index, m.choice); },
      onPeerStatus: (ok, why) => setPeerOk(ok ? true : why === 'unavailable-id' ? 'taken' : false),
      onGuestLeft: () => { setNotice('Tu compañera o compañero se desconectó.'); },
    });
    setStep('lobby');
  }

  function startGame() {
    const t = THEMES.find(x => x.key === theme) ?? THEMES[2];
    const questions = buildGame(scenarios, t);
    ctrl.current = new DuelHost({
      questions, names,
      emit: m => { link.current?.send(m); dispatch(m); },
    });
    setStep('play');
    ctrl.current.start();
  }

  function joinGame(e) {
    e.preventDefault();
    const c = normalizeCode(codeInput);
    if (!isValidCode(c)) { setNotice('El código tiene 6 letras y números. Revísalo y vuelve a intentar.'); return; }
    const me = cleanName(name, 'Invitado');
    setName(me); setCode(c); setRole('guest'); setNotice(''); setStep('lobby');
    setNames({ host: '', guest: me });
    link.current = joinRoom(c, me, {
      onWelcome: h => setNames({ host: h, guest: me }),
      onMessage: m => { setStep('play'); dispatch(m); },
      onFull: () => { reset('error'); setNotice('Esa sala ya tiene dos jugadores.'); },
      onTimeout: () => { reset('error'); setNotice('No encontramos esa sala. Revisa el código y que tu compañera o compañero ya la haya creado.'); },
      onClosed: () => { setNotice('La sala se cerró.'); },
    });
  }

  function pick(choice) {
    if (state.phase !== 'question' || state.picked !== null) return;
    dispatch({ t: 'picked', choice });
    if (role === 'host') ctrl.current?.answer('host', state.index, choice);
    else link.current?.send({ t: 'answer', index: state.index, choice });
  }

  async function copyCode() {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* sin portapapeles */ }
  }
  async function shareCode() {
    const text = `¡Juega conmigo el Duelo Democrático! Código de sala: ${code}`;
    if (navigator.share) { try { await navigator.share({ text }); return; } catch { /* cancelado */ } }
    copyCode();
  }

  const me = role === 'host' ? 'host' : 'guest', other = role === 'host' ? 'guest' : 'host';
  const myScore = state.scores?.[me] ?? 0, otherScore = state.scores?.[other] ?? 0;

  return <main className="duel">
    <div className="lesson-top"><button className="back" onClick={() => { reset(); onExit(); }}>← Salir del duelo</button>{step !== 'menu' && step !== 'error' && step !== 'play' && <button className="back" onClick={() => reset()}>Cambiar de sala</button>}</div>

    {step === 'menu' && <section aria-labelledby="duel-h">
      <div className="eyebrow left">JUEGA CON UNA AMIGA, UN AMIGO O UN FAMILIAR</div>
      <h1 id="duel-h" ref={headingRef} tabIndex="-1" className="lesson-h">Duelo Democrático <span aria-hidden="true">⚔️🗳️</span></h1>
      <p className="lead">Dos personas, una sala y 8 escenarios de la vida diaria. Tienen {SECONDS} segundos para leer y elegir la respuesta. ¡Quien acierte más será la persona más democrática!</p>
      <div className="duel-choices">
        <button className="duel-card" onClick={() => setStep('host')}><span aria-hidden="true">🏠</span><b>Crear una sala</b><small>Te damos un código para compartir</small></button>
        <button className="duel-card" onClick={() => setStep('join')}><span aria-hidden="true">🔑</span><b>Entrar con un código</b><small>Escribe el código que te compartieron</small></button>
      </div>
      <p className="quiz-note">Para jugar entre dos dispositivos se necesita internet. No uses tu nombre completo ni datos personales: basta con un apodo.</p>
      <p className="quiz-note"><button className="linklike" onClick={onLessons}>¿Primero quieres practicar? Ve a las lecciones</button></p>
    </section>}

    {step === 'host' && <form onSubmit={createRoom} aria-labelledby="duel-h">
      <h1 id="duel-h" ref={headingRef} tabIndex="-1" className="lesson-h">Crea tu sala</h1>
      <label className="field">Tu apodo<input value={name} onChange={e => setName(e.target.value)} maxLength={16} placeholder="Por ejemplo: Alex" autoComplete="off" required/></label>
      <fieldset className="themes"><legend>¿Sobre qué quieren jugar?</legend>
        {THEMES.map(t => <label key={t.key} className={`option ${theme === t.key ? 'chosen' : ''}`}><input type="radio" name="theme" checked={theme === t.key} onChange={() => setTheme(t.key)}/><span className="letter" aria-hidden="true">{t.emoji}</span><span>{t.label}</span></label>)}
      </fieldset>
      <button className="primary wide" type="submit">Crear sala <span aria-hidden="true">↗</span></button>
    </form>}

    {step === 'join' && <form onSubmit={joinGame} aria-labelledby="duel-h">
      <h1 id="duel-h" ref={headingRef} tabIndex="-1" className="lesson-h">Entra a una sala</h1>
      <label className="field">Tu apodo<input value={name} onChange={e => setName(e.target.value)} maxLength={16} placeholder="Por ejemplo: Ana" autoComplete="off" required/></label>
      <label className="field">Código de la sala<input className="code-input" value={codeInput} onChange={e => setCodeInput(normalizeCode(e.target.value))} maxLength={6} placeholder="ABC123" autoCapitalize="characters" autoComplete="off" spellCheck="false" inputMode="text" required aria-describedby="code-help"/></label>
      <p id="code-help" className="quiz-note">Son 6 letras y números.</p>
      {notice && <p className="alert" role="alert">{notice}</p>}
      <button className="primary wide" type="submit">Entrar <span aria-hidden="true">↗</span></button>
    </form>}

    {step === 'error' && <section aria-labelledby="duel-h">
      <h1 id="duel-h" ref={headingRef} tabIndex="-1" className="lesson-h">No pudimos entrar 😕</h1>
      <p className="alert" role="alert">{notice}</p>
      <button className="primary wide" onClick={() => reset('join')}>Intentar de nuevo</button>
    </section>}

    {step === 'lobby' && <section aria-labelledby="duel-h">
      {role === 'host' ? <>
        <h1 id="duel-h" ref={headingRef} tabIndex="-1" className="lesson-h">Sala lista</h1>
        <p className="lead">Comparte este código con la persona que va a jugar contigo:</p>
        <div className="room-code" aria-label={`Código de sala: ${code.split('').join(' ')}`}>{code}</div>
        <div className="row-actions"><button className="back" onClick={copyCode}>{copied ? '¡Copiado! ✓' : '📋 Copiar código'}</button><button className="back" onClick={shareCode}>📤 Compartir</button></div>
        {peerOk === false && <p className="alert" role="status">No pudimos abrir la conexión por internet. La sala solo funcionará entre pestañas de este mismo navegador.</p>}
        {peerOk === 'taken' && <p className="alert" role="status">Ese código ya estaba en uso. Pulsa «Cambiar de sala» y crea otra.</p>}
        <ul className="players" aria-live="polite">
          <li className="on"><Character name={guide}/><span><b>{names.host}</b> · anfitrión</span></li>
          <li className={names.guest ? 'on' : 'wait'}><Character name={friend}/><span>{names.guest ? <><b>{names.guest}</b> se conectó ✓</> : 'Esperando a la otra persona…'}</span></li>
        </ul>
        {notice && <p className="alert" role="status">{notice}</p>}
        <button className="primary wide" disabled={!names.guest} onClick={startGame}>{names.guest ? '¡Empezar el duelo!' : 'Esperando jugadores…'} <span aria-hidden="true">↗</span></button>
      </> : <>
        <h1 id="duel-h" ref={headingRef} tabIndex="-1" className="lesson-h">{names.host ? '¡Conectado!' : 'Conectando…'}</h1>
        <p className="lead" role="status">{names.host ? `Estás en la sala de ${names.host}. Espera a que empiece el duelo.` : `Buscando la sala ${code}…`}</p>
        <div className="room-code small">{code}</div>
        {notice && <p className="alert" role="status">{notice}</p>}
      </>}
    </section>}

    {step === 'play' && <section aria-labelledby="duel-q" className="play">
      <div className="scoreboard" aria-label="Marcador">
        <span className="me"><b>{names[me]}</b> (tú) <i>{myScore}</i></span>
        <span className="vs" aria-hidden="true">vs</span>
        <span className="other"><b>{names[other]}</b> <i>{otherScore}</i></span>
      </div>

      {(state.phase === 'question' || state.phase === 'reveal') && <>
        <p className="quiz-progress">Escenario {state.index + 1} de {state.total}</p>
        <p className="scenario">{state.scenario}</p>
        {state.phase === 'question' && <Countdown key={state.index} deadline={state.deadline} seconds={state.seconds} locked={state.picked !== null}/>}
        <fieldset className="quiz">
          <legend id="duel-q" ref={headingRef} tabIndex="-1">{state.question}</legend>
          {state.options.map((opt, i) => {
            const rv = state.phase === 'reveal' ? state.reveal : null;
            const cls = rv ? (i === rv.correct ? 'right' : state.picked === i ? 'wrong' : '') : state.picked === i ? 'chosen' : '';
            return <label key={i} className={`option ${cls}`}>
              <input type="radio" name={`duel-${state.index}`} checked={state.picked === i} disabled={state.phase !== 'question' || state.picked !== null} onChange={() => pick(i)}/>
              <span className="letter" aria-hidden="true">{rv ? (i === rv.correct ? '✓' : state.picked === i ? '✗' : 'ABC'[i]) : 'ABC'[i]}</span><span>{opt}</span>
            </label>;
          })}
        </fieldset>
        {state.phase === 'question' && <p className="quiz-note" role="status">{state.picked !== null ? '¡Respuesta enviada! Esperando a la otra persona o a que termine el tiempo…' : `Elige una respuesta antes de que se acabe el tiempo.`}</p>}
        {state.phase === 'reveal' && <div className="reveal" role="status">
          <p><b>{state.picked === null ? '⏰ Se acabó el tiempo. ' : state.picked === state.reveal.correct ? '🎉 ¡Correcto! ' : '💡 Casi. '}</b>{state.reveal.why}</p>
          <p className="other-pick">{names[other]} {state.reveal.picks[other] === null ? 'no alcanzó a responder.' : state.reveal.picks[other] === state.reveal.correct ? 'acertó ✓' : 'falló esta vez.'}</p>
          <p className="quiz-note">La siguiente pregunta llega en unos segundos…</p>
        </div>}
      </>}

      {state.phase === 'final' && <div className="final">
        <div className="result-head">
          <div className="say-avatar big" aria-hidden="true"><Character name={state.result.winner === other ? friend : guide}/></div>
          <div><h1 id="duel-q" ref={headingRef} tabIndex="-1" className="lesson-h">{state.result.title}</h1><p className="lead">{state.result.subtitle}</p></div>
        </div>
        <ul className="final-scores">
          {['host', 'guest'].map(r => <li key={r} className={state.result.winner === r ? 'winner' : ''}><span>{state.result.winner === r ? '🏆 ' : ''}<b>{state.names[r]}</b></span><span>{state.scores[r]} de {state.total}</span></li>)}
        </ul>
        <details className="review"><summary>Repasar las respuestas correctas</summary>
          <ol>{state.review.map((r, i) => <li key={i}><b>{r.question}</b><br/>✓ {r.correctText}<br/><span>{r.why}</span></li>)}</ol>
        </details>
        <div className="mission"><b>🎯 Tu misión</b><p>Cuéntale a alguien de tu familia una cosa que aprendiste en el duelo.</p></div>
        <div className="row-actions wrap"><button className="back" onClick={() => reset('menu')}>Jugar otra vez</button><button className="primary" onClick={() => { reset(); onLessons(); }}>Ir a las lecciones <span aria-hidden="true">↗</span></button></div>
      </div>}
    </section>}
  </main>;
}
