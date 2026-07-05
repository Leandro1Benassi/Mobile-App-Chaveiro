/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check } from 'lucide-react';

interface SignaturePadProps {
  onSave: (base64Data: string) => void;
  onClear?: () => void;
  width?: number;
  height?: number;
}

export default function SignaturePad({
  onSave,
  onClear,
  width = 240,
  height = 100,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  // Set up high DPI canvas support
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#022c22'; // Very dark green/black
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    // Check if touch event
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (canvas && hasSigned) {
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    onSave('');
    if (onClear) onClear();
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative border-2 border-dashed border-emerald-300/60 bg-emerald-50/40 rounded-lg p-1 w-full max-w-full overflow-hidden transition-all duration-200 hover:border-emerald-400">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="bg-transparent cursor-crosshair w-full block h-24 touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          id="signature-canvas"
        />
        
        {!hasSigned && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40">
            <span className="text-xs text-emerald-800 font-medium">Assine aqui</span>
            <span className="text-[9px] text-emerald-600/70">Toque e arraste</span>
          </div>
        )}

        {hasSigned && (
          <div className="absolute top-1 right-1 flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearCanvas();
              }}
              type="button"
              id="clear-signature-btn"
              className="p-1 rounded bg-white hover:bg-rose-50 text-rose-500 shadow-xs border border-rose-100 transition-colors cursor-pointer"
              title="Limpar assinatura"
            >
              <Eraser size={12} />
            </button>
            <div className="p-1 rounded bg-emerald-500 text-white shadow-xs border border-emerald-400">
              <Check size={12} />
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center w-full mt-1 px-1">
        <span className="text-[10px] text-slate-400 font-mono italic">Assinatura do Cliente</span>
        {hasSigned && (
          <button
            type="button"
            onClick={clearCanvas}
            id="reset-sig-link"
            className="text-[10px] text-rose-500 hover:underline cursor-pointer font-medium"
          >
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}
