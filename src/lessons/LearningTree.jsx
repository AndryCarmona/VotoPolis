import React from 'react';

export const STAGES = ['Semilla', 'Brote', 'Tallito', 'Arbolito', 'Árbol joven', 'Árbol con ramas', 'Árbol con flores', 'Árbol frondoso', '¡Árbol grandote!'];
const BASE = 262;
const BRANCHES = [[0.5, -1, 44], [0.58, 1, 46], [0.68, -1, 52], [0.76, 1, 54], [0.86, -1, 48], [0.93, 1, 50]];
// Un nivel de copa más por cada lección completada a partir de la 3.ª: [dx, dy, radio].
const CANOPY = [
  [[0, -8, 28], [-24, 8, 21], [24, 8, 21]],
  [[-38, -14, 23], [38, -14, 23], [0, -36, 25]],
  [[-54, 10, 22], [54, 10, 22], [-18, -54, 22]],
  [[20, -56, 22], [-66, -18, 20], [66, -18, 20]],
  [[-36, -46, 20], [36, -46, 20], [0, -68, 22]],
  [[-78, 14, 18], [78, 14, 18], [0, 20, 28]],
];
const GREENS = ['#4f9d77', '#6bb58a', '#3f8a68'];

export function treeStage(count) { return Math.max(0, Math.min(8, Math.floor(count))); }

export default function LearningTree({ count }) {
  const n = treeStage(count);
  const h = n === 0 ? 0 : 26 + n * 20, w = 5 + n * 3.2, top = BASE - h;
  const tiers = n >= 3 ? CANOPY.slice(0, n - 2) : [];
  const circles = tiers.flatMap((t, ti) => t.map(([dx, dy, r], i) => ({ x: 150 + dx, y: top + dy + 14, r, c: GREENS[(ti + i) % 3] })));
  const leaves = n === 1 ? [[-1, 0.9]] : n === 2 ? [[-1, 0.85], [1, 0.62], [-1, 0.4]] : [];
  const label = `Árbol de aprendizaje: ${STAGES[n]}. ${n} de 8 lecciones completadas.`;
  return <svg className="tree" viewBox="0 0 300 300" role="img" aria-label={label}>
    <rect x="0" y="0" width="300" height="300" rx="24" fill="#e8f3ea"/>
    {n === 8 && <g aria-hidden="true"><circle cx="248" cy="48" r="20" fill="#f7c948"/>{[0, 45, 90, 135, 180, 225, 270, 315].map(a => <line key={a} x1="248" y1="48" x2={248 + 34 * Math.cos(a * Math.PI / 180)} y2={48 + 34 * Math.sin(a * Math.PI / 180)} stroke="#f7c948" strokeWidth="3" strokeLinecap="round" opacity=".6"/>)}</g>}
    <ellipse cx="150" cy={BASE + 8} rx="120" ry="22" fill="#9ccb9a"/>
    <ellipse cx="150" cy={BASE + 4} rx="70" ry="10" fill="#7a5a3c"/>
    <g key={n} className="tree-grow" style={{ transformOrigin: `150px ${BASE}px` }}>
      {n === 0 && <><ellipse cx="150" cy={BASE - 4} rx="9" ry="6" fill="#8b5e34"/><path d="M146 258 q4 -5 8 0" stroke="#5e3f22" strokeWidth="2" fill="none"/></>}
      {n > 0 && <path d={`M${150 - w / 2} ${BASE} L${150 - w / 3.2} ${top} L${150 + w / 3.2} ${top} L${150 + w / 2} ${BASE} Z`} fill={n < 3 ? '#5da86f' : '#7a5232'}/>}
      {n >= 3 && BRANCHES.slice(0, n - 2).map(([f, side, len], i) => <line key={i} x1="150" y1={BASE - h * f} x2={150 + side * len} y2={BASE - h * f - len * 0.55} stroke="#7a5232" strokeWidth={Math.max(3, w / 3)} strokeLinecap="round"/>)}
      {leaves.map(([side, f], i) => <ellipse key={i} cx={150 + side * 16} cy={BASE - h * f} rx="16" ry="8" fill="#6bb58a" transform={`rotate(${side * -25} ${150 + side * 16} ${BASE - h * f})`}/>)}
      {n >= 1 && n < 3 && <ellipse cx="150" cy={top - 8} rx="10" ry="16" fill="#79c08f"/>}
      {circles.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={c.c}/>)}
      {n >= 6 && circles.filter((_, i) => i % 2 === 0).map((c, i) => <circle key={`f${i}`} cx={c.x + 6} cy={c.y - 4} r="5" fill="#dc819f"/>)}
      {n >= 8 && circles.filter((_, i) => i % 3 === 1).map((c, i) => <circle key={`g${i}`} cx={c.x - 4} cy={c.y + 6} r="6" fill="#f7c948" stroke="#d9a21b" strokeWidth="1.5"/>)}
    </g>
  </svg>;
}
