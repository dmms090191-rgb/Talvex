import { Upload, ZoomIn, ZoomOut, RotateCcw, Layers, Eye } from 'lucide-react';

interface Props {
  onUpload: () => void;
  hasImage: boolean;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  hasOverlay: boolean;
  onAddPage: () => void;
  opacity: number;
  onOpacityChange: (v: number) => void;
}

export default function CalquerLogoToolbar({
  onUpload, hasImage, zoom, onZoomIn, onZoomOut, onZoomReset,
  hasOverlay, onAddPage, opacity, onOpacityChange,
}: Props) {
  const opacityPct = Math.round(opacity * 100);

  return (
    <div className="w-64 flex-shrink-0 flex flex-col gap-5 p-4 overflow-y-auto border-r"
      style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(15,23,42,0.6)' }}>

      <Section title="Image de reference">
        <button onClick={onUpload}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' }}>
          <Upload className="w-4 h-4" />
          {hasImage ? 'Changer le logo' : 'Uploader un logo'}
        </button>
        {hasImage && (
          <p className="text-xs mt-1.5" style={{ color: 'rgba(148,163,184,0.8)' }}>
            Image chargee. Utilisez le zoom pour ajuster.
          </p>
        )}
      </Section>

      <Section title="Zoom">
        <div className="flex items-center gap-2">
          <ZoomButton onClick={onZoomOut} icon={<ZoomOut className="w-3.5 h-3.5" />} disabled={zoom <= 0.1} />
          <div className="flex-1 text-center text-xs font-mono tabular-nums" style={{ color: 'rgba(226,232,240,0.9)' }}>
            {Math.round(zoom * 100)}%
          </div>
          <ZoomButton onClick={onZoomIn} icon={<ZoomIn className="w-3.5 h-3.5" />} disabled={zoom >= 5} />
        </div>
        <button onClick={onZoomReset}
          className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors duration-150"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(226,232,240,0.7)' }}>
          <RotateCcw className="w-3 h-3" /> Reset (100%)
        </button>
        <p className="text-[10px]" style={{ color: 'rgba(148,163,184,0.4)' }}>
          Molette souris pour zoomer. Clic droit + glisser pour deplacer.
        </p>
      </Section>

      <Section title="Calque">
        {!hasOverlay ? (
          <button onClick={onAddPage}
            disabled={!hasImage}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:scale-[1.02]"
            style={{ background: hasImage ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255,255,255,0.06)', color: '#fff', boxShadow: hasImage ? '0 2px 8px rgba(16,185,129,0.3)' : 'none' }}>
            <Layers className="w-4 h-4" />
            Ajouter une page
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <Layers className="w-3.5 h-3.5" style={{ color: '#34d399' }} />
              <span className="text-xs font-medium" style={{ color: '#34d399' }}>Page active</span>
            </div>
            <TransparencySlider opacityPct={opacityPct} onOpacityChange={onOpacityChange} />
          </div>
        )}
      </Section>

      <div className="mt-auto pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(148,163,184,0.5)' }}>
          V1 - Uploadez un logo, ajoutez un calque transparent pour le reproduire.
        </p>
      </div>
    </div>
  );
}

function TransparencySlider({ opacityPct, onOpacityChange }: { opacityPct: number; onOpacityChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" style={{ color: 'rgba(148,163,184,0.8)' }} />
          <span className="text-xs" style={{ color: 'rgba(226,232,240,0.8)' }}>Transparence</span>
        </div>
        <span className="text-xs font-mono tabular-nums px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(226,232,240,0.9)' }}>
          {opacityPct}%
        </span>
      </div>
      <input type="range" min={0} max={100} value={opacityPct}
        onChange={e => onOpacityChange(Number(e.target.value) / 100)}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, #3b82f6 ${opacityPct}%, rgba(255,255,255,0.1) ${opacityPct}%)` }} />
      <div className="flex justify-between text-[10px]" style={{ color: 'rgba(148,163,184,0.5)' }}>
        <span>Opaque</span>
        <span>Transparent</span>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(148,163,184,0.6)' }}>{title}</h3>
      {children}
    </div>
  );
}

function ZoomButton({ onClick, icon, disabled }: { onClick: () => void; icon: React.ReactNode; disabled: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="p-2 rounded-lg transition-colors duration-150 disabled:opacity-30"
      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(226,232,240,0.8)' }}>
      {icon}
    </button>
  );
}
