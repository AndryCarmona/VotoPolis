export const MAP_WIDTH = 900;
export const MAP_HEIGHT = 570;
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 7;
export const HOME_CAMERA = Object.freeze({ x: 450, y: 285, scale: 1 });
const clamp = (n, low, high) => Math.max(low, Math.min(high, n));

export function constrainCamera(camera) {
  const scale = clamp(camera.scale, MIN_ZOOM, MAX_ZOOM);
  const halfWidth = MAP_WIDTH / (2 * scale);
  const halfHeight = MAP_HEIGHT / (2 * scale);
  return {
    scale,
    x: clamp(camera.x, halfWidth, MAP_WIDTH - halfWidth),
    y: clamp(camera.y, halfHeight, MAP_HEIGHT - halfHeight),
  };
}

export function toWorld(point, camera) {
  return { x: camera.x + (point.x - 450) / camera.scale, y: camera.y + (point.y - 285) / camera.scale };
}

// Mantiene el mismo punto geográfico bajo el centro del gesto, salvo al alcanzar los bordes.
export function zoomAt(camera, nextScale, point = { x: 450, y: 285 }) {
  const scale = clamp(nextScale, MIN_ZOOM, MAX_ZOOM);
  const world = toWorld(point, camera);
  return constrainCamera({ scale, x: world.x - (point.x - 450) / scale, y: world.y - (point.y - 285) / scale });
}

export function focusCamera(bounds, scale) {
  const fit = Math.min(900 / (bounds.width + 90), 570 / (bounds.height + 90));
  return constrainCamera({ x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 - 5, scale: scale ?? fit });
}

export function pinchCamera(initialCamera, startPoints, currentPoints) {
  const midpoint = points => ({ x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 });
  const distance = points => Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  const scale = clamp(initialCamera.scale * distance(currentPoints) / Math.max(1, distance(startPoints)), MIN_ZOOM, MAX_ZOOM);
  const world = toWorld(midpoint(startPoints), initialCamera);
  const center = midpoint(currentPoints);
  return constrainCamera({ scale, x: world.x - (center.x - 450) / scale, y: world.y - (center.y - 285) / scale });
}
