import { cleanName } from './duelEngine.js';

// Conexión de la sala entre dos personas, sin servidor propio:
//  1) PeerJS (WebRTC punto a punto con el servicio público de señalización) → entre dispositivos.
//  2) BroadcastChannel → entre pestañas del mismo navegador (útil para probar).
// Se intentan ambos a la vez; los mensajes llevan "seq" para descartar duplicados.

const PREFIX = 'votopolis-';
export const JOIN_TIMEOUT_MS = 10000;
const hasBC = () => typeof BroadcastChannel !== 'undefined';
const hasWebRTC = () => typeof window !== 'undefined' && typeof window.RTCPeerConnection !== 'undefined';
const makeId = () => Math.random().toString(36).slice(2, 10);

export function hostRoom(code, hostName, h) {
  let seq = 0, lastSeq = 0, guestId = null, closed = false, peer = null;
  const outs = new Set();
  const raw = obj => outs.forEach(f => { try { f(obj); } catch { /* canal cerrado */ } });
  const bc = hasBC() ? new BroadcastChannel(PREFIX + code) : null;
  if (bc) { outs.add(o => bc.postMessage(o)); bc.onmessage = e => receive(e.data); }

  function receive(data) {
    if (closed || !data || data.from !== 'guest' || typeof data.t !== 'string' || typeof data.gid !== 'string') return;
    if (data.t === 'join') {
      if (!guestId) { guestId = data.gid; h.onGuest(cleanName(data.name, 'Invitado')); }
      if (data.gid !== guestId) { raw({ t: 'full', to: data.gid, from: 'host' }); return; }
      raw({ t: 'welcome', to: data.gid, from: 'host', hostName });
      return;
    }
    if (data.gid !== guestId) return;
    if (typeof data.seq === 'number') { if (data.seq <= lastSeq) return; lastSeq = data.seq; }
    h.onMessage(data);
  }

  if (hasWebRTC()) {
    import('peerjs').then(({ Peer }) => {
      if (closed) return;
      peer = new Peer(PREFIX + code, { debug: 0 });
      peer.on('open', () => h.onPeerStatus?.(true));
      peer.on('error', e => h.onPeerStatus?.(false, e?.type));
      peer.on('connection', conn => {
        const out = o => { if (conn.open) conn.send(o); };
        conn.on('open', () => outs.add(out));
        conn.on('data', receive);
        conn.on('close', () => { outs.delete(out); if (guestId) h.onGuestLeft?.(); });
      });
    }).catch(() => h.onPeerStatus?.(false, 'load'));
  } else h.onPeerStatus?.(false, 'no-webrtc');

  return {
    send: msg => raw({ ...msg, from: 'host', seq: ++seq }),
    close() { closed = true; try { peer?.destroy(); } catch { /* ya cerrado */ } try { bc?.close(); } catch { /* ya cerrado */ } outs.clear(); },
  };
}

export function joinRoom(code, name, h) {
  const gid = makeId();
  let seq = 0, lastSeq = 0, welcomed = false, closed = false, peer = null, tick = null, timeout = null;
  const outs = new Set();
  const raw = obj => outs.forEach(f => { try { f(obj); } catch { /* canal cerrado */ } });
  const bc = hasBC() ? new BroadcastChannel(PREFIX + code) : null;
  if (bc) { outs.add(o => bc.postMessage(o)); bc.onmessage = e => receive(e.data); }
  const sendJoin = () => raw({ t: 'join', gid, name, from: 'guest' });

  function stopJoining() { clearInterval(tick); clearTimeout(timeout); }
  function receive(data) {
    if (closed || !data || data.from !== 'host' || typeof data.t !== 'string') return;
    if (data.to && data.to !== gid) return;
    if (data.t === 'welcome') { if (!welcomed) { welcomed = true; stopJoining(); h.onWelcome(cleanName(data.hostName, 'Anfitrión')); } return; }
    if (data.t === 'full') { stopJoining(); h.onFull(); return; }
    if (!welcomed) return;
    if (typeof data.seq === 'number') { if (data.seq <= lastSeq) return; lastSeq = data.seq; }
    h.onMessage(data);
  }

  if (hasWebRTC()) {
    import('peerjs').then(({ Peer }) => {
      if (closed) return;
      peer = new Peer({ debug: 0 });
      peer.on('open', () => {
        const conn = peer.connect(PREFIX + code, { reliable: true });
        conn.on('open', () => { outs.add(o => { if (conn.open) conn.send(o); }); sendJoin(); });
        conn.on('data', receive);
        conn.on('close', () => { if (welcomed && !closed) h.onClosed?.(); });
      });
      peer.on('error', () => { /* el temporizador avisa si no se logra conectar */ });
    }).catch(() => { /* se usa solo BroadcastChannel */ });
  }

  sendJoin();
  tick = setInterval(sendJoin, 600);
  timeout = setTimeout(() => { if (!welcomed && !closed) { stopJoining(); h.onTimeout(); } }, JOIN_TIMEOUT_MS);

  return {
    send: msg => raw({ ...msg, from: 'guest', gid, seq: ++seq }),
    close() { closed = true; stopJoining(); try { peer?.destroy(); } catch { /* ya cerrado */ } try { bc?.close(); } catch { /* ya cerrado */ } outs.clear(); },
  };
}
