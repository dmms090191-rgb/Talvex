import { useRef, useCallback, useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';
import CalquerLogoLayerBar from './CalquerLogoLayerBar';

interface Props {
  imageUrl: string | null;
  zoom: number;
  onZoomChange: (z: number) => void;
  hasOverlay: boolean;
  overlayOpacity: number;
  inverted: boolean;
  onSwap: () => void;
  panX: number;
  panY: number;
  onPanChange: (x: number, y: number) => void;
}

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.08;

export default function CalquerLogoCanvas({
  imageUrl, zoom, onZoomChange, hasOverlay, overlayOpacity,
  inverted, onSwap, panX, panY, onPanChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(zoom + delta * (1 + zoom * 0.3)).toFixed(3)));
    onZoomChange(next);
  }, [zoom, onZoomChange]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 2) return;
    e.preventDefault();
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      onPanChange(panX + dx, panY + dy);
    };
    const onUp = (e: MouseEvent) => {
      if (e.button === 2 && dragging.current) {
        dragging.current = false;
        setIsDragging(false);
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [panX, panY, onPanChange]);

  if (!imageUrl) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: checkerBg() }}>
        <EmptyState />
      </div>
    );
  }

  const logoLayer = (
    <img src={imageUrl} alt="Logo reference"
      className="block max-w-[80vw] max-h-[70vh] object-contain select-none pointer-events-none"
      draggable={false} />
  );

  const overlayLayer = hasOverlay ? (
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: `rgba(255, 255, 255, ${1 - overlayOpacity})`, transition: 'background 0.2s ease' }} />
  ) : null;

  return (
    <div ref={containerRef}
      onWheel={handleWheel}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      className="flex-1 overflow-hidden relative"
      style={{ background: checkerBg(), cursor: isDragging ? 'grabbing' : 'default' }}>

      <div className="min-h-full flex items-center justify-center p-8"
        style={{ transform: `translate(${panX}px, ${panY}px)` }}>
        <div className="relative"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.15s ease-out' }}>
          {inverted ? (
            <>
              {overlayLayer && <div className="absolute inset-0" style={{ background: `rgba(255, 255, 255, ${1 - overlayOpacity})` }} />}
              {logoLayer}
            </>
          ) : (
            <>
              {logoLayer}
              {overlayLayer}
            </>
          )}
        </div>
      </div>

      <CalquerLogoLayerBar hasOverlay={hasOverlay} inverted={inverted} onSwap={onSwap} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center space-y-4 max-w-sm px-6">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
        style={{ background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(255,255,255,0.1)' }}>
        <ImageOff className="w-8 h-8" style={{ color: 'rgba(148,163,184,0.4)' }} />
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: 'rgba(226,232,240,0.6)' }}>
          Aucun logo charge
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(148,163,184,0.4)' }}>
          Uploadez une image depuis le panneau de gauche pour commencer.
        </p>
      </div>
    </div>
  );
}

function checkerBg() {
  return `
    repeating-conic-gradient(rgba(255,255,255,0.04) 0% 25%, rgba(0,0,0,0.08) 0% 50%)
    0 0 / 32px 32px,
    rgb(15 23 42)
  `.trim();
}
