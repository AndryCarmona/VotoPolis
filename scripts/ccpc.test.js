import test from 'node:test';
import assert from 'node:assert/strict';
import { states } from '../src/data/states.js';
import { explainState, stateData, national, ofTen } from '../src/data/ccpc.js';

test('toda entidad produce una explicación con la referencia nacional', () => {
  for (const s of states) {
    const e = explainState(s.code, s.name);
    assert.ok(e.items.length >= 2, s.name);
    assert.ok(e.items.some(i => i.value === '59,7 %'), `${s.name} sin referencia nacional`);
    assert.ok(e.items.every(i => i.says.length > 20));
    assert.ok(e.source.url.startsWith('https://'));
  }
});

test('las claves de datos corresponden a entidades reales', () => {
  const codes = new Set(states.map(s => s.code));
  Object.keys(stateData).forEach(c => assert.ok(codes.has(c), `clave ${c}`));
});

test('Yucatán y Baja California se comparan con el promedio nacional', () => {
  const yuc = explainState('31', 'Yucatán');
  assert.equal(yuc.items[0].value, '71,4 %');
  assert.equal(yuc.items[1].value, '+11,7 puntos');
  const bc = explainState('02', 'Baja California');
  assert.equal(bc.items[1].value, '−12,7 puntos');
  assert.match(bc.items[1].says, /más baja/);
  assert.equal(national[2024], 59.7);
});

test('Puebla es muestral y no se compara directo; las demás no inventan cifras', () => {
  const pue = explainState('21', 'Puebla');
  assert.match(pue.items[0].says, /no la comparamos directo/);
  assert.ok(!pue.items.some(i => i.label.includes('Frente al promedio')));
  const gro = explainState('12', 'Guerrero');
  assert.equal(gro.items[0].value, 'Dato por cargar');
  assert.equal(gro.hasValue, false);
});

test('redondeo a "de cada 10" en lenguaje sencillo', () => {
  assert.equal(ofTen(71.4), '7 de cada 10');
  assert.equal(ofTen(47), 'casi 5 de cada 10');
  assert.equal(ofTen(64.3), 'más de 6 de cada 10');
  assert.equal(ofTen(59.7), '6 de cada 10');
});
