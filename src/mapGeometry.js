import { states } from './data/states.js';
export const project = ([lon,lat]) => [80 + (lon + 118.5) * 24,65 + (33 - lat) * 26];
export function geometryPath(geometry) {
 const polygons = geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates];
 return polygons.map(p => p.map(r => r.map((point,i) => `${i ? 'L' : 'M'}${project(point).map(n => n.toFixed(1)).join(',')}`).join(' ') + 'Z').join(' ')).join(' ');
}
export function mainPolygonLayout(geometry) {
 const polygons = geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates];
 const area = ring => Math.abs(ring.reduce((sum, p, i) => { const q = ring[(i+1)%ring.length]; return sum + p[0]*q[1] - q[0]*p[1]; },0));
 const ring = polygons.reduce((largest,p) => area(p[0]) > area(largest[0]) ? p : largest, polygons[0])[0].map(project);
 const xs = ring.map(p => p[0]), ys = ring.map(p => p[1]);
 const x = Math.min(...xs), y = Math.min(...ys), width = Math.max(...xs)-x, height = Math.max(...ys)-y;
 // Punto interior para rótulos e ilustraciones, sin modificar el contorno geográfico.
 const inside = ([px,py]) => {
  let result = false;
  for (let i=0,j=ring.length-1;i<ring.length;j=i++) {
   const a=ring[i],b=ring[j];
   if ((a[1]>py)!==(b[1]>py) && px<(b[0]-a[0])*(py-a[1])/(b[1]-a[1])+a[0]) result=!result;
  }
  return result;
 };
 let label = [x+width/2,y+height/2], best = Infinity;
 for (let iy=1;iy<16;iy++) for(let ix=1;ix<16;ix++) {
  const point=[x+width*ix/16,y+height*iy/16];
  const score=(point[0]-x-width/2)**2+(point[1]-y-height/2)**2;
  if(score<best && inside(point)) {label=point;best=score;}
 }
 const decorations=[];
 for (const fy of [.2,.45,.7,.85]) for(const fx of [.2,.4,.65,.8]) {
  const point=[x+width*fx,y+height*fy];
  if(inside(point) && Math.hypot(point[0]-label[0],point[1]-label[1])>18) decorations.push(point);
 }
 return { bounds:{x,y,width,height}, label, decorations:decorations.filter((_,i)=>i%Math.max(1,Math.ceil(decorations.length/6))===0).slice(0,6) };
}
export function prepareStates(collection) {
 if (collection.type !== 'FeatureCollection' || collection.features.length !== 32) throw Error('Se requieren las 32 entidades.');
 return states.map(state => {
  const matches = collection.features.filter(f => f.properties.shapeName === state.sourceName);
  if (matches.length !== 1) throw Error(`Geometría ausente o duplicada: ${state.name}`);
  const feature = matches[0];
  if (!['Polygon','MultiPolygon'].includes(feature.geometry.type)) throw Error('Geometría no compatible');
  return {...state,path:geometryPath(feature.geometry),...mainPolygonLayout(feature.geometry)};
 });
}
