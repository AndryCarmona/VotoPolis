import React, { memo, useEffect, useRef, useState } from 'react';
import { prepareStates } from './mapGeometry';
import { HOME_CAMERA, MAX_ZOOM, MIN_ZOOM, constrainCamera, focusCamera, pinchCamera, zoomAt } from './mapCamera';

const SHORT_NAMES = { '03':'Baja California Sur', '05':'Coahuila', '09':'CDMX', '15':'Estado de México', '16':'Michoacán', '24':'San Luis Potosí', '30':'Veracruz' };

const MapArtwork = memo(function MapArtwork({ regions, selectedCode, hoveredCode, scale }) {
  const selected = regions?.find(state => state.code === selectedCode);
  function surface(state, lifted = false) {
    const index = Number(state.code) - 1;
    const [x,y] = state.label;
    const large = state.bounds.width > 44 && state.bounds.height > 35;
    return <g key={state.code} className={`state-surface ${selectedCode && !lifted ? 'is-muted' : ''} ${lifted ? 'is-lifted' : ''} ${hoveredCode === state.code ? 'is-hovered' : ''}`} style={{ '--lift': `${-11 / Math.sqrt(scale)}px` }}>
      <path d={state.path} className="region-depth" transform="translate(0 6)"/>
      <path d={state.path} className="region-face"/>
      <g clipPath={`url(#clip-${state.code})`} className="region-illustrations">
        {state.decorations.map(([dx,dy],i)=><use key={i} href={['#map-tree','#map-mountain','#map-agave','#map-house'][(index+i)%4]} x={dx-7} y={dy-10} width="14" height="17"/>)}
        {large && <><path className="glowing-trail" d={`M${x-18},${y+25} Q${x+18},${y+10} ${x+8},${y-23}`}/><use href={index % 3 === 0 ? '#map-mountain' : index % 3 === 1 ? '#map-tree' : '#map-agave'} x={x-18} y={y-28} width="21" height="24"/><use href={index % 4 === 0 ? '#map-house' : '#map-tree'} x={x+16} y={y+15} width="16" height="19"/></>}
      </g>
    </g>;
  }
  function label(state) {
    const lifted=state.code===selectedCode;
    const large=state.bounds.width>44 && state.bounds.height>35;
    if(!lifted) return null;
    const [x,y]=state.label;
    const words=(SHORT_NAMES[state.code]||state.name).split(' ');
    const split=Math.ceil(words.length/2);
    const lines=words.length>2 || (words.length===2 && state.bounds.width<100) ? [words.slice(0,split).join(' '),words.slice(split).join(' ')] : [words.join(' ')];
    const fontSize=(large ? (state.bounds.width>100 ? 11 : 9) : 6)/Math.sqrt(scale);
    return <g key={state.code} className={`region-name-layer ${selectedCode&&!lifted?'is-muted':''} ${lifted?'is-lifted':''}`} style={{'--lift':`${-11/Math.sqrt(scale)}px`}}><text x={x} y={y+3} className="region-label" style={{fontSize,strokeWidth:fontSize*.27}}>{lines.map((line,i)=><tspan key={line} x={x} dy={i ? fontSize : 0}>{line.toLocaleUpperCase('es-MX')}</tspan>)}</text></g>;
  }
  return <g className="map-artwork" aria-hidden="true" pointerEvents="none">
    <defs>{regions?.map(s => <clipPath id={`clip-${s.code}`} key={s.code}><path d={s.path}/></clipPath>)}</defs>
    <g className="country-halo">{regions?.map(s => <path key={s.code} d={s.path}/>)}</g>
    {selected && <path className="selected-footprint" d={selected.path}/>}
    {regions && [...regions.filter(s => s.code !== selectedCode), ...(selected ? [selected] : [])].map(s => surface(s,s.code === selectedCode))}
    {regions && [...regions.filter(s=>s.code!==selectedCode),...(selected?[selected]:[])].map(label)}
  </g>;
});

function IllustrationDefinitions() {
  return <defs>
    <linearGradient id="revealed-land" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#532080"/><stop offset=".5" stopColor="#793299"/><stop offset="1" stopColor="#a22481"/></linearGradient>
    <linearGradient id="ocean" x2="1" y2="1"><stop stopColor="#28134e"/><stop offset=".55" stopColor="#42216d"/><stop offset="1" stopColor="#241241"/></linearGradient>
    <pattern id="ocean-stars" width="145" height="115" patternUnits="userSpaceOnUse"><path d="M20 76q5 6 10 0q5 6 10 0m-22 5q5 6 10 0q5 6 10 0" stroke="#9a6ac3" fill="none" opacity=".35" strokeWidth="1.5"/><circle cx="105" cy="25" r="1" fill="#e8c7fc" opacity=".4"/><path d="M65 34v5m-2.5-2.5h5" stroke="#efbfef" opacity=".45"/></pattern>
    <symbol id="map-mountain" viewBox="0 0 24 24"><path d="m1 22 9-19 13 19z" fill="#633580" stroke="#3b1b50"/><path d="m10 3-4 9 4-2 4 4 1-3z" fill="#d4a5e9"/></symbol>
    <symbol id="map-tree" viewBox="0 0 24 24"><path d="M12 14v9" stroke="#4b235b" strokeWidth="3"/><path d="m12 1-6 9h3l-5 7q8 5 16 0l-5-7h3z" fill="#719d9b" stroke="#3c315f" strokeWidth="1.4"/></symbol>
    <symbol id="map-house" viewBox="0 0 24 24"><path d="M4 11h16v11H4z" fill="#e9b6bc" stroke="#4f275e"/><path d="m2 11 10-9 10 9z" fill="#9b4e94" stroke="#4f275e"/><path d="M10 22v-7h5v7" fill="#684074"/></symbol>
    <symbol id="map-agave" viewBox="0 0 24 24"><path d="M12 22 1 9l8 6-5-13 8 12 1-14 3 14 7-10-4 13 5-3z" fill="#91b8be" stroke="#45265f" strokeLinejoin="round"/></symbol>
    <filter id="lift-shadow" x="-60%" y="-60%" width="220%" height="240%" colorInterpolationFilters="sRGB"><feDropShadow dx="0" dy="9" stdDeviation="4" floodColor="#13051e" floodOpacity=".8"/></filter>
  </defs>;
}

export default function MexicoMap({ selectedCode, onSelect, wasDrag }) {
  const [regions,setRegions] = useState(null), [hovered,setHovered] = useState(null);
  const [failed,setFailed] = useState(false), [attempt,setAttempt] = useState(0);
  const [camera,setCamera] = useState(HOME_CAMERA), [navigating,setNavigating] = useState(false);
  const cameraRef = useRef(HOME_CAMERA), svgRef = useRef(null), points = useRef(new Map());
  const gesture = useRef(null), moved = useRef(false), frame = useRef(null);

  function updateCamera(next, immediate = false) {
    cameraRef.current = constrainCamera(next);
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    if (immediate) setCamera(cameraRef.current);
    else frame.current = requestAnimationFrame(() => { setCamera(cameraRef.current); frame.current = null; });
  }
  useEffect(() => () => { if(frame.current !== null) cancelAnimationFrame(frame.current); },[]);
  useEffect(() => { if (!selectedCode) updateCamera(HOME_CAMERA,true); },[selectedCode]);
  useEffect(() => {
    const controller = new AbortController(); setFailed(false);
    fetch(`${import.meta.env.BASE_URL}mexico-states.geojson`,{signal:controller.signal})
      .then(r => {if(!r.ok) throw Error('Mapa no disponible');return r.json();})
      .then(prepareStates).then(setRegions).catch(e => {if(e.name !== 'AbortError') setFailed(true);});
    return () => controller.abort();
  },[attempt]);

  useEffect(() => {
    const region = regions?.find(state => state.code === selectedCode);
    if (region) updateCamera(focusCamera(region.bounds),true);
  },[selectedCode,regions]);

  const selected = regions?.find(s => s.code === selectedCode);
  function localPoint(e) {
    const point = new DOMPoint(e.clientX,e.clientY).matrixTransform(svgRef.current.getScreenCTM().inverse());
    return {x:point.x,y:point.y};
  }
  function startGesture() {
    gesture.current = {camera:{...cameraRef.current},points:[...points.current.values()].map(p => ({...p}))};
  }
  function pointerDown(e) {
    if(e.button !== 0) return;
    points.current.set(e.pointerId,{...localPoint(e),code:e.target.closest('[data-state-code]')?.dataset.stateCode});
    if(points.current.size === 1) {moved.current=false;wasDrag.current=false;}
    else {moved.current=true;wasDrag.current=true;}
    svgRef.current.setPointerCapture(e.pointerId);
    startGesture();
  }
  function pointerMove(e) {
    if(!points.current.has(e.pointerId)) return;
    const previous = points.current.get(e.pointerId);
    points.current.set(e.pointerId,{...localPoint(e),code:previous.code});
    const current = [...points.current.values()];
    const initial = gesture.current;
    if(!initial) return;
    if(current.length >= 2 && initial.points.length >= 2) {
      moved.current=true;wasDrag.current=true;setNavigating(true);
      updateCamera(pinchCamera(initial.camera,initial.points,current));
    } else if (current.length === 1) {
      const delta = {x:current[0].x-initial.points[0].x,y:current[0].y-initial.points[0].y};
      // El umbral se mide en píxeles de pantalla, no cambia con el tamaño del SVG.
      const ctm=svgRef.current.getScreenCTM();
      if(Math.hypot(delta.x*ctm.a,delta.y*ctm.d)>8) {moved.current=true;wasDrag.current=true;}
      if(moved.current && initial.camera.scale>1) {
        setNavigating(true);
        updateCamera({...initial.camera,x:initial.camera.x-delta.x/initial.camera.scale,y:initial.camera.y-delta.y/initial.camera.scale});
      }
    }
  }
  function pointerUp(e, cancelled = false) {
    const point = points.current.get(e.pointerId);
    const shouldSelect = point?.code && points.current.size === 1 && !moved.current && !wasDrag.current && !cancelled;
    points.current.delete(e.pointerId);
    if(svgRef.current.hasPointerCapture(e.pointerId)) svgRef.current.releasePointerCapture(e.pointerId);
    if(cancelled) {moved.current=true;wasDrag.current=true;}
    if(points.current.size) startGesture();
    else {gesture.current=null;setNavigating(false);}
    if(shouldSelect) onSelect(point.code);
  }
  function zoom(factor) {
    const scale=cameraRef.current.scale*factor;
    updateCamera(selected ? focusCamera(selected.bounds,scale) : zoomAt(cameraRef.current,scale),true);
  }
  function keyDown(e) {
    if(e.key==='+' || e.key==='=') {e.preventDefault();e.stopPropagation();zoom(1.35);}
    else if(e.key==='-') {e.preventDefault();e.stopPropagation();zoom(1/1.35);}
    else if(e.key==='0' || e.key==='Home') {e.preventDefault();e.stopPropagation();updateCamera(HOME_CAMERA,true);}
    else if(cameraRef.current.scale>1 && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) {
      e.preventDefault();e.stopPropagation();
      const dx=e.key==='ArrowRight'?45:e.key==='ArrowLeft'?-45:0;
      const dy=e.key==='ArrowDown'?45:e.key==='ArrowUp'?-45:0;
      updateCamera({...cameraRef.current,x:cameraRef.current.x+dx/cameraRef.current.scale,y:cameraRef.current.y+dy/cameraRef.current.scale},true);
    }
  }
  return <div className={`map-wrap adventure-map ${selectedCode?'has-selection':''} ${navigating?'is-navigating':''}`}>
    {!regions && <div className="map-status" role={failed?'alert':'status'}>{failed?<>No se pudo cargar el mapa. <button className="back" onClick={()=>setAttempt(a=>a+1)}>Reintentar</button></>:'Preparando las 32 entidades…'}</div>}
    <svg ref={svgRef} className={`mexico-map ${camera.scale>1?'can-pan':''}`} viewBox="0 0 900 570" role="group" tabIndex="0" aria-label="Mapa interactivo de las 32 entidades de México" aria-describedby="map-navigation-help" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={e=>pointerUp(e)} onPointerCancel={e=>pointerUp(e,true)} onLostPointerCapture={e=>{if(points.current.has(e.pointerId))pointerUp(e,true);}} onKeyDown={keyDown}>
      <IllustrationDefinitions/>
      <rect width="900" height="570" fill="url(#ocean)" pointerEvents="none"/>
      <rect width="900" height="570" fill="url(#ocean-stars)" pointerEvents="none"/>
      <g className="map-camera" data-zoom={camera.scale.toFixed(3)} style={{transform:`translate(${450-camera.x*camera.scale}px, ${285-camera.y*camera.scale}px) scale(${camera.scale})`}}>
        <g aria-hidden="true" className="map-decoration"><text x="547" y="177" className="sea-label">GOLFO DE MÉXICO</text><text x="135" y="397" className="sea-label" transform="rotate(-15 135 397)">OCÉANO PACÍFICO</text><path d="M812 67v35m-9-13 9-22 9 22-9-5z" fill="none" stroke="#ceafe2"/><text x="808" y="56" fill="#ceafe2" fontSize="11">N</text></g>
        <MapArtwork regions={regions} selectedCode={selectedCode} hoveredCode={hovered?.code} scale={camera.scale}/>
        {regions?.map(state=><path key={state.code} id={`state-${state.code}`} data-state-code={state.code} d={state.path} fillRule="evenodd" className="state-region state-target" role="button" tabIndex="0" aria-label={state.name} aria-pressed={selectedCode===state.code} onPointerEnter={e=>{if(e.pointerType==='mouse'&&!points.current.size)setHovered(state);}} onPointerLeave={()=>setHovered(null)} onFocus={()=>setHovered(state)} onBlur={()=>setHovered(null)} onClick={e=>{if(e.detail===0)onSelect(state.code);}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();onSelect(state.code);}else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();onSelect(null);}}}><title>{state.name}</title></path>)}
      </g>
    </svg>
    <span className="state-tooltip" role="status" aria-live="polite">{hovered?.name || (selected ? `✓ ${selected.name}` : 'Un país por descubrir')}</span>
    <div className="map-controls" role="group" aria-label="Controles de zoom del mapa" onPointerDown={e=>e.stopPropagation()} onPointerUp={e=>e.stopPropagation()}>
      <button aria-label="Acercar mapa" title="Acercar (+)" disabled={camera.scale>=MAX_ZOOM} onClick={()=>zoom(1.35)}>+</button>
      <output aria-label="Nivel de zoom">{Math.round(camera.scale*100)} %</output>
      <button aria-label="Alejar mapa" title="Alejar (−)" disabled={camera.scale<=MIN_ZOOM} onClick={()=>zoom(1/1.35)}>−</button>
      <span className="control-divider"/>
      <button className="map-control-text" disabled={!selected} onClick={()=>updateCamera(focusCamera(selected.bounds),true)}>Centrar entidad</button>
      <button className="map-control-text" onClick={()=>updateCamera(HOME_CAMERA,true)}>Ver todo México</button>
    </div>
    <span id="map-navigation-help" className="map-navigation-help">{camera.scale>1?'Arrastra para recorrer · + / − para zoom · 0 para restablecer':'Toca una entidad · Pellizca para acercar'}</span>
  </div>;
}
