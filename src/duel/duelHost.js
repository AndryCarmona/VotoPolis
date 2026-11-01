import { SECONDS, resultOf } from './duelEngine.js';

// Controla la partida desde la persona anfitriona (autoridad única).
// emit(msg) envía el mensaje a la persona invitada y también lo aplica en la vista local.
export class DuelHost {
  constructor({ questions, names, emit, seconds = SECONDS, revealMs = 5000, graceMs = 1200, earlyMs = 500 }) {
    Object.assign(this, { questions, names, emit, seconds, revealMs, graceMs, earlyMs });
    this.index = -1; this.phase = 'idle'; this.scores = { host: 0, guest: 0 };
    this.picks = { host: null, guest: null }; this.timer = null; this.history = [];
  }
  start() { if (this.phase === 'idle') this.next(); }
  clear() { clearTimeout(this.timer); this.timer = null; }
  dispose() { this.clear(); this.phase = 'done'; }
  next() {
    this.clear();
    this.index += 1;
    if (this.index >= this.questions.length) return this.finish();
    const q = this.questions[this.index];
    this.phase = 'question';
    this.picks = { host: null, guest: null };
    this.emit({ t: 'q', index: this.index, total: this.questions.length, scenario: q.scenario, question: q.question, options: q.options, seconds: this.seconds });
    this.timer = setTimeout(() => this.reveal(), this.seconds * 1000 + this.graceMs);
  }
  answer(role, index, choice) {
    if (this.phase !== 'question' || index !== this.index) return false;
    if (role !== 'host' && role !== 'guest') return false;
    if (!Number.isInteger(choice) || choice < 0 || choice >= this.questions[this.index].options.length) return false;
    if (this.picks[role] !== null) return false;
    this.picks[role] = choice;
    if (this.picks.host !== null && this.picks.guest !== null) { this.clear(); this.timer = setTimeout(() => this.reveal(), this.earlyMs); }
    return true;
  }
  reveal() {
    if (this.phase !== 'question') return;
    this.clear();
    this.phase = 'reveal';
    const q = this.questions[this.index];
    for (const r of ['host', 'guest']) if (this.picks[r] === q.answer) this.scores[r] += 1;
    this.history.push({ ...this.picks });
    this.emit({ t: 'reveal', index: this.index, correct: q.answer, why: q.why, picks: { ...this.picks }, scores: { ...this.scores } });
    this.timer = setTimeout(() => this.next(), this.revealMs);
  }
  finish() {
    this.phase = 'done';
    const total = this.questions.length;
    this.emit({
      t: 'final', total, names: this.names, scores: { ...this.scores },
      result: resultOf(this.names, this.scores, total),
      review: this.questions.map(q => ({ question: q.question, correctText: q.options[q.answer], why: q.why })),
    });
  }
}
