import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Check, RotateCcw, AlertCircle, Download } from 'lucide-react';

interface PhotoCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterName: string;
  imageSrc: string;
  onSaveCropped: (croppedDataUrl: string) => void;
}

export const PhotoCropperModal: React.FC<PhotoCropperModalProps> = ({
  isOpen,
  onClose,
  characterName,
  imageSrc,
  onSaveCropped
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imgRef.current = img;
        setZoom(1);
        setPan({ x: 0, y: 0 });
        drawCanvas();
      };
      img.src = imageSrc;
    }
  }, [imageSrc]);

  useEffect(() => {
    if (imgRef.current) {
      drawCanvas();
    }
  }, [zoom, pan]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Calculate dimensions
    const scale = Math.max(width / img.width, height / img.height) * zoom;
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;

    const x = (width - scaledWidth) / 2 + pan.x;
    const y = (height - scaledHeight) / 2 + pan.y;

    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const croppedUrl = canvas.toDataURL('image/jpeg', 0.95);
    onSaveCropped(croppedUrl);
    onClose();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const croppedUrl = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.download = `${characterName.toLowerCase().replace(/\s+/g, '-')}-reference-photo.jpg`;
    link.href = croppedUrl;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#161922] border border-slate-700/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#12141c]">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="p-1 rounded-lg bg-purple-500/10 text-purple-400">✂️</span>
              Head-and-Shoulders Face Cropper
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tight framing for <strong className="text-purple-300">{characterName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Playbook Tip Alert */}
        <div className="bg-amber-950/30 border-b border-amber-800/40 px-6 py-2.5 flex items-start gap-2.5 text-xs text-amber-200/90">
          <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Playbook Rule (Section 3):</strong> VideoExpress AI likeness is highest when the face fills 50–70% of the frame. Full-body photos produce younger, slimmer strangers. Crop tight to chest-up.
          </span>
        </div>

        {/* Cropper Canvas Area */}
        <div className="p-6 flex flex-col items-center justify-center bg-[#0d0f15]">
          <div className="relative border-2 border-purple-500/50 rounded-xl overflow-hidden shadow-inner cursor-grab active:cursor-grabbing group">
            <canvas
              ref={canvasRef}
              width={384}
              height={512}
              className="bg-slate-900 block"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />

            {/* Oval Face Guide Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div className="w-48 h-64 border border-dashed border-purple-400/60 rounded-full opacity-60 flex items-center justify-center">
                <span className="text-[10px] text-purple-300 font-mono tracking-widest uppercase bg-black/40 px-2 py-0.5 rounded">
                  Face Zone
                </span>
              </div>
            </div>

            <div className="absolute bottom-2 left-2 right-2 text-center text-[11px] text-slate-300 bg-black/60 backdrop-blur-xs py-1 rounded pointer-events-none">
              Drag to position • Use slider to zoom
            </div>
          </div>

          {/* Zoom controls */}
          <div className="w-full max-w-sm mt-5 flex items-center gap-3">
            <ZoomOut size={16} className="text-slate-400" />
            <input
              type="range"
              min="0.8"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <ZoomIn size={16} className="text-slate-400" />
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              title="Reset Zoom"
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#12141c]">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            <Download size={14} />
            Download Cropped JPG
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-lg shadow-purple-600/30 transition"
            >
              <Check size={14} />
              Use This Cropped Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
