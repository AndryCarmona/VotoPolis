import React from 'react';

// Íconos de línea minimalistas (trazo 1.8, 24×24, color heredado del texto).
const P = {
  school: <><path d="M3 21h18M5 21V10l7-5 7 5v11"/><path d="M10 21v-5h4v5"/></>,
  vote: <><path d="M4 14h16v6H4z"/><path d="M8 14V4h8v10"/><path d="m10 9 1.6 1.6L14.2 8"/></>,
  speech: <path d="M4 5h16v11H10l-4 4v-4H4z"/>,
  landmark: <><path d="M3 21h18M3 10l9-6 9 6z"/><path d="M6 10v8M10 10v8M14 10v8M18 10v8"/></>,
  users: <><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.5 0 4.5 2 4.5 5"/></>,
  chart: <><path d="M3 20h18M6 20v-7M12 20V5M18 20v-10"/></>,
  map: <><path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/></>,
  megaphone: <><path d="M4 10v4h3l7 4V6L7 10z"/><path d="M17.5 9a4 4 0 0 1 0 6"/></>,
  dice: <><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="15" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/><circle cx="9" cy="15" r="1" fill="currentColor"/></>,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>,
  doc: <><path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4M10 12h6M10 16h6"/></>,
  search: <><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></>,
  tree: <><path d="M12 21v-8"/><path d="M12 13c-4 0-6-3-6-7 4 0 6 3 6 7z"/><path d="M12 16c3 0 5-2 5-5-3 0-5 2-5 5z"/></>,
  star: <path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.3 7.200 18.900l.9-5.400L4.200 9.700l5.400-.8z"/>,
  phone: <><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/></>,
  image: <><rect x="4" y="5" width="16" height="14" rx="2"/><path d="m4 16 5-5 4 4 3-3 4 4"/><circle cx="9" cy="9" r="1"/></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4"/></>,
  bolt: <path d="M13 3 5 14h6l-1 7 8-11h-6z"/>,
  key: <><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3"/></>,
  home: <><path d="m4 11 8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/></>,
  check: <path d="m5 12.500 4.500 4.500L19 7.500"/>,
  x: <path d="M6 6l12 12M18 6 6 18"/>,
  trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M9 20h6M10 17h4"/></>,
  target: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.8" fill="currentColor"/></>,
  bulb: <><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.500 10.900c.6.500 1 1.200 1 2.100h5c0-.9.4-1.600 1-2.100A6 6 0 0 0 12 3z"/></>,
  clock: <><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></>,
  share: <><circle cx="6" cy="12" r="2.500"/><circle cx="18" cy="6" r="2.500"/><circle cx="18" cy="18" r="2.500"/><path d="m8.200 10.800 7.600-3.600M8.200 13.200l7.600 3.600"/></>,
  sparkle: <path d="M12 4v4M12 16v4M4 12h4M16 12h4M7 7l2 2M15 15l2 2M17 7l-2 2M9 15l-2 2"/>,
  book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/></>,
};

export const iconNames = Object.keys(P);

export default function Icon({ name, size = 22, className = '', title }) {
  const art = P[name];
  if (!art) return null;
  return <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : 'true'} focusable="false">{art}</svg>;
}
