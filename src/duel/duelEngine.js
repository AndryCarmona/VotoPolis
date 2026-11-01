// Lógica pura del Duelo Democrático (sin React ni red), para poder probarla con node:test.

export const SECONDS = 15;
export const QUESTIONS_PER_GAME = 8;
export const ROOM_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O/1/I para evitar confusiones
export const CODE_LENGTH = 6;

export function makeRoomCode(rng = Math.random) {
  return Array.from({ length: CODE_LENGTH }, () => ROOM_ALPHABET[Math.floor(rng() * ROOM_ALPHABET.length)]).join('');
}
export function normalizeCode(s) {
  return String(s ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, CODE_LENGTH);
}
export function isValidCode(s) {
  return new RegExp(`^[${ROOM_ALPHABET}]{${CODE_LENGTH}}$`).test(s);
}
export function cleanName(s, fallback = 'Jugador') {
  const t = String(s ?? '').replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16);
  return t || fallback;
}

export function shuffle(arr, rng = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// Arma las preguntas de una partida: elige por tema, mezcla preguntas y opciones.
export function buildGame(pool, theme, count = QUESTIONS_PER_GAME, rng = Math.random) {
  const eligible = pool.filter(q => theme.topics.includes(q.topic));
  return shuffle(eligible, rng).slice(0, count).map(q => {
    const order = shuffle([0, 1, 2], rng);
    return { scenario: q.scenario, question: q.question, options: order.map(i => q.options[i]), answer: order.indexOf(q.answer), why: q.why, topic: q.topic };
  });
}

export function resultOf(names, scores, total) {
  const { host, guest } = scores;
  if (host === 0 && guest === 0) return { winner: null, title: '¡Sigamos aprendiendo juntos!', subtitle: 'Nadie acertó esta vez. Repasen las respuestas y vuelvan a jugar.' };
  if (host === guest) return { winner: null, title: '¡Empate democrático!', subtitle: `${names.host} y ${names.guest} acertaron ${host} de ${total}. ¡Las dos voces cuentan igual!` };
  const w = host > guest ? 'host' : 'guest';
  return { winner: w, title: `¡${names[w]} fue la persona más democrática!`, subtitle: `Acertó ${scores[w]} de ${total} preguntas sobre democracia y participación.` };
}

// Reductor de la vista: lo usan igual la persona anfitriona y la invitada.
export const emptyView = { phase: 'lobby', scores: { host: 0, guest: 0 }, picked: null };
export function reduceView(view, msg, now = Date.now()) {
  switch (msg.t) {
    case 'q': return { phase: 'question', index: msg.index, total: msg.total, scenario: msg.scenario, question: msg.question, options: msg.options, seconds: msg.seconds, deadline: now + msg.seconds * 1000, picked: null, reveal: null, scores: view.scores };
    case 'picked': return view.phase === 'question' && view.picked === null ? { ...view, picked: msg.choice } : view;
    case 'reveal': return { ...view, phase: 'reveal', reveal: { correct: msg.correct, why: msg.why, picks: msg.picks }, scores: msg.scores };
    case 'final': return { phase: 'final', scores: msg.scores, total: msg.total, names: msg.names, result: msg.result, review: msg.review, picked: null };
    default: return view;
  }
}
