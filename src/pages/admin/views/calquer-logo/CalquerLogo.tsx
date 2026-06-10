import { useState, useRef, useCallback, useEffect } from 'react';
import CalquerLogoToolbar from './CalquerLogoToolbar';
import CalquerLogoCanvas from './CalquerLogoCanvas';

const STORAGE_KEY = 'calquer-logo-state';

interface SavedState {
  zoom: number;
  hasOverlay: boolean;
  overlayOpacity: number;
  inverted: boolean;
  panX: number;
  panY: number;
}

const DEFAULTS: SavedState = {
  zoom: 1, hasOverlay: false, overlayOpacity: 0.5,
  inverted: false, panX: 0, panY: 0,
};

function loadState(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { return { ...DEFAULTS }; }
}

function saveState(s: SavedState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

export default function CalquerLogo() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(() => loadState().zoom);
  const [hasOverlay, setHasOverlay] = useState(() => loadState().hasOverlay);
  const [overlayOpacity, setOverlayOpacity] = useState(() => loadState().overlayOpacity);
  const [inverted, setInverted] = useState(() => loadState().inverted);
  const [panX, setPanX] = useState(() => loadState().panX);
  const [panY, setPanY] = useState(() => loadState().panY);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveState({ zoom, hasOverlay, overlayOpacity, inverted, panX, panY });
  }, [zoom, hasOverlay, overlayOpacity, inverted, panX, panY]);

  const handleUpload = useCallback(() => fileRef.current?.click(), []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
    e.target.value = '';
  }, [imageUrl]);

  const handleZoomIn = useCallback(() => setZoom(z => Math.min(4, +(z + 0.25).toFixed(2))), []);
  const handleZoomOut = useCallback(() => setZoom(z => Math.max(0.25, +(z - 0.25).toFixed(2))), []);
  const handleZoomReset = useCallback(() => { setZoom(1); setPanX(0); setPanY(0); }, []);
  const handleAddPage = useCallback(() => setHasOverlay(true), []);
  const handleSwap = useCallback(() => setInverted(v => !v), []);
  const handlePanChange = useCallback((x: number, y: number) => { setPanX(x); setPanY(y); }, []);

  return (
    <div className="flex flex-col h-full min-h-0">
      <input ref={fileRef} type="file" className="hidden"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        onChange={handleFileChange} />

      <div className="flex flex-1 min-h-0">
        <CalquerLogoToolbar
          onUpload={handleUpload}
          hasImage={!!imageUrl}
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
          hasOverlay={hasOverlay}
          onAddPage={handleAddPage}
          opacity={overlayOpacity}
          onOpacityChange={setOverlayOpacity}
        />
        <CalquerLogoCanvas
          imageUrl={imageUrl}
          zoom={zoom}
          onZoomChange={setZoom}
          hasOverlay={hasOverlay}
          overlayOpacity={overlayOpacity}
          inverted={inverted}
          onSwap={handleSwap}
          panX={panX}
          panY={panY}
          onPanChange={handlePanChange}
        />
      </div>
    </div>
  );
}
