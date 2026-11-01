import React, { useEffect, useRef } from 'react';
import Character from './Character';

export const clamp = (value, min, max) => Math.min(Math.max(value, min), Math.max(min, max));
export default function FloatingCharacter({ name, areaRef, target }) {
  const bubbleRef = useRef(null);
  useEffect(() => {
    let frame, previous = 0;
    const area = areaRef.current;
    const position = { x: area.clientWidth * .82, y: area.clientHeight * .25 };
    const tick = time => {
      const dt = previous ? Math.min(time - previous, 50) : 16;
      previous = time;
      const radius = bubbleRef.current.offsetWidth / 2 + 12;
      const x = clamp(target.current?.x ?? area.clientWidth * .82, radius, area.clientWidth - radius);
      const y = clamp(target.current?.y ?? area.clientHeight * .25, radius, area.clientHeight - radius);
      const ease = 1 - Math.exp(-dt / 145);
      position.x += (x - position.x) * ease;
      position.y += (y - position.y) * ease;
      bubbleRef.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [areaRef, target]);
  return <div className="bubble-position" ref={bubbleRef}><div className="bubble"><Character name={name}/><span className="bubble-glint"/></div><span className="bubble-name">{name}</span></div>;
}
