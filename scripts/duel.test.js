import test from 'node:test';
import assert from 'node:assert/strict';
import { scenarios, THEMES } from '../src/duel/duelData.js';
import { buildGame, makeRoomCode, normalizeCode, isValidCode, cleanName, resultOf, reduceView, emptyView, ROOM_ALPHABET, SECONDS } from '../src/duel/duelEngine.js';
import { DuelHost } from '../src/duel/duelHost.js';
import { hostRoom, joinRoom } from '../src/duel/roomLink.js';

const wait = ms => new Promise(r => setTimeout(r, ms));
const rngSeq = () => { let x = 7; return () => (x = (x * 16807) % 2147483647) / 2147483647; };

test('hay 16 escenarios válidos, 2 por cada lección', () => {
  assert.equal(scenarios.length, 16);
  for (let t = 1; t <= 8; t++) assert.equal(scenarios.filter(s => s.topic === t).length, 2, `tema ${t}`);
  scenarios.forEach(s => {
    assert.equal(s.options.length, 3);
    assert.equal(new Set(s.options).size, 3);
    assert.ok(s.answer >= 0 && s.answer < 3 && s.scenario.length > 20 && s.why.length > 15);
  });
});

test('buildGame elige 8 preguntas por tema, mezcla opciones y conserva la correcta', () => {
  for (const theme of THEMES) {
    const g = buildGame(scenarios, theme, 8, rngSeq());
    assert.equal(g.length, 8);
    g.forEach(q => {
      assert.ok(theme.topics.includes(q.topic));
      const original = scenarios.find(s => s.question === q.question && s.scenario === q.scenario);
      assert.equal(q.options[q.answer], original.options[original.answer]);
      assert.deepEqual([...q.options].sort(), [...original.options].sort());
    });
  }
});

test('códigos de sala alfanuméricos, sin caracteres confusos y normalizables', () => {
  for (let i = 0; i < 200; i++) {
    const c = makeRoomCode();
    assert.equal(c.length, 6);
    assert.ok(isValidCode(c));
    assert.ok([...c].every(ch => ROOM_ALPHABET.includes(ch)));
  }
  assert.equal(normalizeCode(' ab-c2 d3e4 '), 'ABC2D3');
  assert.equal(isValidCode('ABC0O1'), false);
  assert.equal(isValidCode('ABC'), false);
});

test('los nombres se limpian y se limitan', () => {
  assert.equal(cleanName('  Ana   María  '), 'Ana María');
  assert.equal(cleanName('<b>Alex</b>'), 'bAlex/b');
  assert.equal(cleanName('x'.repeat(40)).length, 16);
  assert.equal(cleanName('   ', 'Jugador'), 'Jugador');
});

test('el resultado nombra a la persona más democrática, o empate', () => {
  const n = { host: 'Alex', guest: 'Ana' };
  assert.match(resultOf(n, { host: 6, guest: 4 }, 8).title, /Alex fue la persona más democrática/);
  assert.match(resultOf(n, { host: 3, guest: 5 }, 8).title, /Ana fue la persona más democrática/);
  assert.equal(resultOf(n, { host: 4, guest: 4 }, 8).winner, null);
  assert.match(resultOf(n, { host: 4, guest: 4 }, 8).title, /Empate/);
  assert.equal(resultOf(n, { host: 0, guest: 0 }, 8).winner, null);
});

test('DuelHost: puntúa, ignora respuestas inválidas o repetidas y termina', async () => {
  const questions = buildGame(scenarios, THEMES[2], 3, rngSeq());
  const log = [];
  const host = new DuelHost({ questions, names: { host: 'Alex', guest: 'Ana' }, emit: m => log.push(m), seconds: 0.2, revealMs: 20, graceMs: 20, earlyMs: 5 });
  host.start();
  assert.equal(log[0].t, 'q');
  assert.equal(host.answer('guest', 0, 7), false, 'opción fuera de rango');
  assert.equal(host.answer('guest', 5, 0), false, 'índice de pregunta equivocado');
  assert.equal(host.answer('host', 0, questions[0].answer), true);
  assert.equal(host.answer('host', 0, 0), false, 'segunda respuesta ignorada');
  assert.equal(host.answer('guest', 0, (questions[0].answer + 1) % 3), true);
  await wait(60);
  assert.equal(log.find(m => m.t === 'reveal').scores.host, 1);
  assert.equal(log.find(m => m.t === 'reveal').scores.guest, 0);
  await wait(900); // las otras 2 preguntas vencen por tiempo sin respuestas
  const fin = log.at(-1);
  assert.equal(fin.t, 'final');
  assert.deepEqual(fin.scores, { host: 1, guest: 0 });
  assert.match(fin.result.title, /Alex/);
  assert.equal(fin.review.length, 3);
  host.dispose();
});

test('reduceView arma la vista de pregunta, respuesta propia, revelación y final', () => {
  let v = reduceView(emptyView, { t: 'q', index: 0, total: 8, scenario: 's', question: 'q', options: ['a', 'b', 'c'], seconds: SECONDS }, 1000);
  assert.equal(v.phase, 'question');
  assert.equal(v.deadline, 1000 + SECONDS * 1000);
  v = reduceView(v, { t: 'picked', choice: 2 });
  v = reduceView(v, { t: 'picked', choice: 0 });
  assert.equal(v.picked, 2, 'no se puede cambiar la respuesta');
  v = reduceView(v, { t: 'reveal', correct: 1, why: 'x', picks: { host: 2, guest: 1 }, scores: { host: 0, guest: 1 } });
  assert.equal(v.phase, 'reveal');
  assert.equal(v.scores.guest, 1);
});

test('partida completa por la sala: anfitrión e invitado (BroadcastChannel)', async () => {
  const code = makeRoomCode();
  const questions = buildGame(scenarios, THEMES[0], 2, rngSeq());
  let hostLink, ctrl, guestName = null, hostViews = [], guestViews = [], guestLink, welcomed = null;
  hostLink = hostRoom(code, 'Alex', {
    onGuest: n => { guestName = n; },
    onMessage: m => { if (m.t === 'answer') ctrl?.answer('guest', m.index, m.choice); },
    onPeerStatus: () => {},
  });
  guestLink = joinRoom(code, 'Ana', {
    onWelcome: n => { welcomed = n; },
    onMessage: m => guestViews.push(m),
    onFull: () => assert.fail('no debería estar llena'),
    onTimeout: () => assert.fail('no debería agotar el tiempo'),
  });
  await wait(100);
  assert.equal(guestName, 'Ana');
  assert.equal(welcomed, 'Alex');
  // Una tercera persona intenta entrar: sala llena.
  let full = false;
  const third = joinRoom(code, 'Tercero', { onWelcome: () => assert.fail('no debe entrar'), onMessage() {}, onFull: () => { full = true; }, onTimeout() {} });
  await wait(100);
  assert.equal(full, true);
  third.close();

  ctrl = new DuelHost({ questions, names: { host: 'Alex', guest: 'Ana' }, emit: m => { hostViews.push(m); hostLink.send(m); }, seconds: 1, revealMs: 20, graceMs: 50, earlyMs: 5 });
  ctrl.start();
  await wait(30);
  const q0 = guestViews.find(m => m.t === 'q');
  assert.ok(q0, 'la persona invitada recibe la pregunta');
  assert.ok(!('answer' in q0), 'la pregunta enviada no incluye la respuesta correcta');
  ctrl.answer('host', 0, questions[0].answer);
  guestLink.send({ t: 'answer', index: 0, choice: questions[0].answer });
  await wait(80);
  const rev = guestViews.find(m => m.t === 'reveal');
  assert.deepEqual(rev.scores, { host: 1, guest: 1 });
  ctrl.answer('host', 1, questions[1].answer);
  guestLink.send({ t: 'answer', index: 1, choice: (questions[1].answer + 1) % 3 });
  await wait(150);
  const fin = guestViews.find(m => m.t === 'final');
  assert.ok(fin, 'la persona invitada recibe el resultado final');
  assert.deepEqual(fin.scores, { host: 2, guest: 1 });
  assert.match(fin.result.title, /Alex fue la persona más democrática/);
  assert.equal(guestViews.filter(m => m.t === 'final').length, 1, 'sin mensajes duplicados');
  ctrl.dispose(); hostLink.close(); guestLink.close();
});

test('si la sala no existe, se agota el tiempo de conexión', async () => {
  let timedOut = false;
  const g = joinRoom('ZZZZZZ', 'Sola', { onWelcome: () => assert.fail('no'), onMessage() {}, onFull() {}, onTimeout: () => { timedOut = true; } });
  g.close();
  assert.equal(timedOut, false, 'cerrar cancela el temporizador');
});
