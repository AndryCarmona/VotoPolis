import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { prepareStates } from '../src/mapGeometry.js';
import { states } from '../src/data/states.js';
import { pueblaStory } from '../src/data/puebla.js';
import { HOME_CAMERA, MAX_ZOOM, constrainCamera, focusCamera, pinchCamera, toWorld, zoomAt } from '../src/mapCamera.js';

const geo = JSON.parse(readFileSync(new URL('../public/mexico-states.geojson', import.meta.url),'utf8'));
test('32 claves INEGI únicas, una geometría por entidad y contornos válidos', () => {
 const regions = prepareStates(geo);
 assert.equal(regions.length,32);
 assert.deepEqual(regions.map(r => r.code),Array.from({length:32},(_,i) => String(i+1).padStart(2,'0')));
 for (const r of regions) { assert.match(r.path,/^M/); assert.match(r.path,/Z$/); assert.ok(!/NaN|undefined|Infinity/.test(r.path),r.name); }
});
test('zoom acotado: vista mínima exacta y cámara sin perderse fuera del mapa', () => {
 assert.deepEqual(constrainCamera({x:-999,y:9999,scale:.1}),HOME_CAMERA);
 const zoom=constrainCamera({x:-999,y:9999,scale:50});
 assert.equal(zoom.scale,MAX_ZOOM);
 assert.equal(zoom.x,900/(2*MAX_ZOOM));
 assert.equal(zoom.y,570-570/(2*MAX_ZOOM));
});
test('zoom mantiene la coordenada geográfica bajo el punto de referencia', () => {
 const cursor={x:470,y:310};
 const before=toWorld(cursor,HOME_CAMERA),after=toWorld(cursor,zoomAt(HOME_CAMERA,3,cursor));
 assert.ok(Math.abs(before.x-after.x)<1e-9);
 assert.ok(Math.abs(before.y-after.y)<1e-9);
});
test('pellizco duplica escala y admite desplazamiento simultáneo del centro', () => {
 const start=[{x:400,y:285},{x:500,y:285}];
 const end=[{x:375,y:300},{x:575,y:300}];
 const result=pinchCamera(HOME_CAMERA,start,end);
 assert.equal(result.scale,2);
 const anchored=toWorld({x:475,y:300},result);
 assert.deepEqual(anchored,{x:450,y:285});
 assert.equal(pinchCamera(HOME_CAMERA,start,[{x:0,y:0},{x:9000,y:0}]).scale,MAX_ZOOM);
});
test('las 32 entidades tienen encuadre finito, uniforme y acotado para el centrado', () => {
 for(const region of prepareStates(geo)) {
  assert.ok(region.bounds.width>0 && region.bounds.height>0);
  const camera=focusCamera(region.bounds);
  assert.ok(camera.scale>=1 && camera.scale<=MAX_ZOOM,region.name);
  assert.ok(Number.isFinite(camera.x) && Number.isFinite(camera.y),region.name);
  assert.ok(region.label.every(Number.isFinite));
 }
});
test('identidad independiente del orden y del ISO duplicado de CDMX y México', () => {
 const regions = prepareStates({...geo,features:[...geo.features].reverse()});
 assert.equal(regions.find(s => s.code === '09').name,'Ciudad de México');
 assert.equal(regions.find(s => s.code === '15').name,'México');
 assert.notEqual(regions.find(s => s.code === '09').path,regions.find(s => s.code === '15').path);
});
test('no aceptar estados ausentes o duplicados', () => {
 assert.throws(() => prepareStates({...geo,features:geo.features.slice(1)}));
 assert.throws(() => prepareStates({...geo,features:[...geo.features.slice(1),geo.features[1]]}));
});
test('solo Puebla ofrece historia y el dato conserva fuente y contexto', () => {
 assert.deepEqual(states.filter(s => s.hasStory).map(s => s.code),['21']);
 assert.equal(pueblaStory.fact.value,'64.3 %');
 assert.equal(new URL(pueblaStory.fact.url).hostname,'centralelectoral.ine.mx');
 assert.match(pueblaStory.fact.universe,/Lista Nominal/);
 assert.match(pueblaStory.fact.methodology,/muestral/);
 assert.match(pueblaStory.fact.process,/2024/);
});
