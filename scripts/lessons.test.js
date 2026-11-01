import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons, participationData } from '../src/lessons/lessonsData.js';
import { fillNames, otherCharacter, scoreQuiz, feedbackTitle, readProgress, saveBest } from '../src/lessons/lessonUtils.js';

function memoryStorage() {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}

test('hay 8 lecciones con ids 1–8 y estructura completa', () => {
  assert.equal(lessons.length, 8);
  lessons.forEach((l, i) => {
    assert.equal(l.id, i + 1);
    assert.ok(l.title && l.keyIdea && l.mission, `lección ${l.id} sin textos`);
    assert.ok(l.explain.length >= 3, `lección ${l.id} con poca explicación`);
    assert.ok(l.cases.length >= 3, `lección ${l.id} sin casos prácticos`);
    assert.equal(l.quiz.length, 3, `lección ${l.id} debe tener 3 preguntas`);
  });
});

test('cada pregunta tiene 3 opciones distintas, respuesta válida y explicación', () => {
  lessons.forEach(l => l.quiz.forEach((q, i) => {
    assert.equal(q.options.length, 3, `L${l.id}P${i + 1}`);
    assert.equal(new Set(q.options).size, 3, `opciones repetidas L${l.id}P${i + 1}`);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 3, `respuesta fuera de rango L${l.id}P${i + 1}`);
    assert.ok(q.why.length > 15, `falta explicación L${l.id}P${i + 1}`);
  }));
});

test('la respuesta correcta no está siempre en la misma posición', () => {
  const positions = new Set(lessons.flatMap(l => l.quiz.map(q => q.answer)));
  assert.equal(positions.size, 3);
});

test('los personajes se sustituyen y se alternan', () => {
  assert.equal(fillNames('Soy {guide} y ella es {friend}', 'Lia', 'Rocko'), 'Soy Lia y ella es Rocko');
  assert.equal(otherCharacter('Lia'), 'Rocko');
  assert.equal(otherCharacter('Rocko'), 'Lia');
  lessons.forEach(l => l.explain.forEach(b => assert.ok(['guide', 'friend'].includes(b.who))));
});

test('el puntaje y la retroalimentación identifican las respuestas falladas', () => {
  const quiz = lessons[0].quiz;
  const wrongOne = quiz.map((q, i) => (i === 1 ? (q.answer + 1) % 3 : q.answer));
  const r = scoreQuiz(quiz, wrongOne);
  assert.equal(r.score, 2);
  assert.deepEqual(r.detail.map(d => d.isCorrect), [true, false, true]);
  assert.equal(scoreQuiz(quiz, []).score, 0);
  assert.equal(scoreQuiz(quiz, quiz.map(q => q.answer)).score, 3);
  assert.equal(feedbackTitle(3, 3), '¡Perfecto!');
  assert.equal(feedbackTitle(2, 3), '¡Muy bien!');
  assert.equal(feedbackTitle(0, 3), '¡Buen intento!');
});

test('el progreso guarda el mejor puntaje y tolera almacenamiento ausente', () => {
  const s = memoryStorage();
  saveBest(s, 3, 2);
  saveBest(s, 3, 1);
  assert.equal(readProgress(s)[3], 2);
  saveBest(s, 3, 3);
  assert.equal(readProgress(s)[3], 3);
  assert.deepEqual(readProgress(null), {});
  assert.doesNotThrow(() => saveBest(null, 1, 1));
  assert.deepEqual(readProgress({ getItem: () => '{roto' }), {});
});

test('los datos de la gráfica conservan fuente y aviso', () => {
  assert.equal(participationData.rows.length, 3);
  participationData.rows.forEach(r => assert.ok(r.value > 0 && r.value < 100));
  assert.ok(participationData.sourceUrl.startsWith('https://'));
  assert.ok(participationData.note.length > 20);
});
