import React, { useEffect, useRef, useState } from 'react';
import Character from '../Character';
import { Visual } from './Visuals';
import { lessons } from './lessonsData';
import { fillNames, otherCharacter, scoreQuiz, feedbackTitle, saveBest, safeStorage } from './lessonUtils';

const STEPS = ['Aprende', 'En la vida real', 'Cuestionario'];

function Bubble({ who, name, text, visual }) {
  return <div className={`say ${who} ${name.toLowerCase()}`}>
    <div className="say-avatar" aria-hidden="true"><Character name={name}/></div>
    <div className="say-body"><b className="say-name">{name}</b><p>{text}</p>{visual && <Visual kind={visual}/>}</div>
  </div>;
}

function Stepper({ step }) {
  return <ol className="stepper" aria-label="Pasos de la lección">{STEPS.map((s, i) => <li key={s} className={i === step ? 'current' : i < step ? 'past' : ''} aria-current={i === step ? 'step' : undefined}><span>{i + 1}</span>{s}</li>)}</ol>;
}

export default function LessonPlayer({ lessonId, guide, onExit, onOpen }) {
  const lesson = lessons.find(l => l.id === lessonId);
  const friend = otherCharacter(guide);
  const who = { guide, friend };
  const [step, setStep] = useState(0);
  const [shown, setShown] = useState(1);
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const headingRef = useRef(null);
  const lastBubble = useRef(null);

  // Reinicia al cambiar de lección.
  useEffect(() => { setStep(0); setShown(1); setQi(0); setAnswers([]); setFinished(false); }, [lessonId]);
  // Lleva el foco al título de cada paso para lectores de pantalla y teclado.
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); window.scrollTo({ top: 0 }); }, [step, qi, finished, lessonId]);
  useEffect(() => { if (shown > 1) lastBubble.current?.scrollIntoView({ block: 'nearest' }); }, [shown]);

  const result = finished ? scoreQuiz(lesson.quiz, answers) : null;
  useEffect(() => { if (result) saveBest(safeStorage(), lesson.id, result.score); }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps

  const allShown = shown >= lesson.explain.length;
  const q = lesson.quiz[qi];
  const nextLesson = lessons.find(l => l.id === lesson.id + 1);

  function restartQuiz() { setAnswers([]); setQi(0); setFinished(false); setStep(2); }
  function restartAll() { setAnswers([]); setQi(0); setFinished(false); setStep(0); setShown(1); }

  return <main className="lesson">
    <div className="lesson-top">
      <button className="back" onClick={onExit}>← Todas las lecciones</button>
      <span className="lesson-count">Lección {lesson.id} de {lessons.length}</span>
    </div>
    {!finished && <Stepper step={step}/>}

    {step === 0 && !finished && <section aria-labelledby="lesson-h">
      <h1 id="lesson-h" ref={headingRef} tabIndex="-1" className="lesson-h"><span aria-hidden="true">{lesson.emoji}</span> {lesson.title}</h1>
      <div className="chat">
        {lesson.explain.slice(0, shown).map((b, i) => <div key={i} ref={i === shown - 1 ? lastBubble : null}><Bubble who={b.who} name={who[b.who]} text={fillNames(b.text, guide, friend)} visual={b.visual}/></div>)}
      </div>
      {!allShown ? <button className="primary wide" onClick={() => setShown(s => s + 1)}>Seguir <span aria-hidden="true">▸</span></button> : <>
        <p className="key-idea"><b>💡 Idea clave</b>{lesson.keyIdea}</p>
        <button className="primary wide" onClick={() => setStep(1)}>Ver casos de la vida real <span aria-hidden="true">↗</span></button>
      </>}
    </section>}

    {step === 1 && !finished && <section aria-labelledby="lesson-h">
      <h1 id="lesson-h" ref={headingRef} tabIndex="-1" className="lesson-h">En la vida real</h1>
      <p className="lead">{friend} y {guide} te muestran cómo se usa esta idea todos los días.</p>
      <ul className="cases">{lesson.cases.map(c => <li key={c.title} className="case"><span className="case-icon" aria-hidden="true">{c.icon}</span><div><h2>{c.title}</h2><p>{c.text}</p></div></li>)}</ul>
      <p className="key-idea"><b>💡 Recuerda</b>{lesson.keyIdea}</p>
      <div className="row-actions">
        <button className="back" onClick={() => setStep(0)}>← Volver a la explicación</button>
        <button className="primary" onClick={() => setStep(2)}>¡A responder! <span aria-hidden="true">↗</span></button>
      </div>
    </section>}

    {step === 2 && !finished && <section aria-labelledby="quiz-q">
      <p className="quiz-progress" aria-live="polite">Pregunta {qi + 1} de {lesson.quiz.length}</p>
      <div className="quiz-bar" aria-hidden="true"><i style={{ width: `${((qi + 1) / lesson.quiz.length) * 100}%` }}/></div>
      <fieldset className="quiz">
        <legend id="quiz-q" ref={headingRef} tabIndex="-1">{q.q}</legend>
        {q.options.map((opt, i) => <label key={opt} className={`option ${answers[qi] === i ? 'chosen' : ''}`}>
          <input type="radio" name={`q-${lesson.id}-${qi}`} checked={answers[qi] === i} onChange={() => setAnswers(a => { const n = [...a]; n[qi] = i; return n; })}/>
          <span className="letter" aria-hidden="true">{'ABC'[i]}</span><span>{opt}</span>
        </label>)}
      </fieldset>
      <p className="quiz-note">Al terminar verás qué respondiste bien y qué podemos repasar.</p>
      <div className="row-actions">
        {qi === 0 ? <button className="back" onClick={() => setStep(1)}>← Volver</button> : <button className="back" onClick={() => setQi(qi - 1)}>← Anterior</button>}
        <button className="primary" disabled={answers[qi] === undefined || answers[qi] === null} onClick={() => qi < lesson.quiz.length - 1 ? setQi(qi + 1) : setFinished(true)}>{qi < lesson.quiz.length - 1 ? 'Siguiente' : 'Terminar'} <span aria-hidden="true">↗</span></button>
      </div>
    </section>}

    {finished && result && <section aria-labelledby="result-h" className="result">
      <div className="result-head">
        <div className="say-avatar big" aria-hidden="true"><Character name={result.score === result.total ? guide : friend}/></div>
        <div>
          <h1 id="result-h" ref={headingRef} tabIndex="-1" className="lesson-h">{feedbackTitle(result.score, result.total)}</h1>
          <p className="score" role="status">Acertaste {result.score} de {result.total} <span className="stars" aria-hidden="true">{Array.from({ length: result.total }, (_, i) => <span key={i} className={i < result.score ? 'on' : ''}>★</span>)}</span></p>
          <p className="lead">{result.score === result.total ? `${guide} y ${friend} están muy orgullosos de ti.` : `Vamos a repasar juntos lo que se nos hizo difícil. ¡Equivocarse también es aprender!`}</p>
        </div>
      </div>
      <ol className="feedback">
        {result.detail.map(d => <li key={d.index} className={d.isCorrect ? 'ok' : 'bad'}>
          <h2><span aria-hidden="true">{d.isCorrect ? '✅' : '❌'}</span> <span className="sr-only">{d.isCorrect ? 'Correcta: ' : 'Por repasar: '}</span>{d.q}</h2>
          {!d.isCorrect && <p><b>Tu respuesta:</b> {d.chosen === null ? 'Sin responder' : d.options[d.chosen]}</p>}
          <p><b>{d.isCorrect ? 'Respuesta:' : 'Respuesta correcta:'}</b> {d.options[d.correct]}</p>
          <p className="why"><b>¿Por qué?</b> {d.why}</p>
        </li>)}
      </ol>
      <div className="mission" role="note"><b>🎯 Tu misión</b><p>{lesson.mission}</p></div>
      <div className="row-actions wrap">
        {result.score < result.total && <button className="back" onClick={restartAll}>Repasar la lección</button>}
        {result.score < result.total && <button className="back" onClick={restartQuiz}>Intentar de nuevo</button>}
        {nextLesson ? <button className="primary" onClick={() => onOpen(nextLesson.id)}>Siguiente lección <span aria-hidden="true">↗</span></button> : <button className="primary" onClick={onExit}>¡Terminé! Ver mis lecciones <span aria-hidden="true">↗</span></button>}
      </div>
    </section>}
  </main>;
}
