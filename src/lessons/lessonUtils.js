// Lógica pura (sin React) para poder probarla con node:test.

export function fillNames(text, guide, friend) {
  return text.replaceAll('{guide}', guide).replaceAll('{friend}', friend);
}

export function otherCharacter(name) {
  return name === 'Lia' ? 'Rocko' : 'Lia';
}

// answers: arreglo de índices elegidos (o null). Devuelve puntaje y detalle por pregunta.
export function scoreQuiz(quiz, answers) {
  const detail = quiz.map((item, i) => {
    const chosen = answers[i] ?? null;
    return { index: i, q: item.q, chosen, correct: item.answer, isCorrect: chosen === item.answer, why: item.why, options: item.options };
  });
  const score = detail.filter(d => d.isCorrect).length;
  return { score, total: quiz.length, detail };
}

export function feedbackTitle(score, total) {
  if (score === total) return '¡Perfecto!';
  if (score >= Math.ceil(total / 2)) return '¡Muy bien!';
  return '¡Buen intento!';
}

// Progreso en localStorage: { [lessonId]: mejorPuntaje }
const KEY = 'votopolis.lessons.v1';

export function readProgress(storage) {
  try {
    const raw = storage?.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch { return {}; }
}

export function saveBest(storage, lessonId, score) {
  const current = readProgress(storage);
  const best = Math.max(current[lessonId] ?? 0, score);
  const next = { ...current, [lessonId]: best };
  try { storage?.setItem(KEY, JSON.stringify(next)); } catch { /* almacenamiento no disponible */ }
  return next;
}

export function safeStorage() {
  try { return typeof window !== 'undefined' ? window.localStorage : null; } catch { return null; }
}
