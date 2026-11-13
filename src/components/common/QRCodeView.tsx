import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, Printer, ShieldCheck } from 'lucide-react';

interface QRCodeViewProps {
  value: string;
  permitId: string;
  studentName: string;
  statusText?: string;
  subtext?: string;
  size?: number;
  showActions?: boolean;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  value,
  permitId,
  studentName,
  statusText = 'VERIFIKASI DIGITAL RESMI ASRAMALINK',
  subtext = 'Tunjukkan kode ini kepada petugas di pos gerbang asrama saat keluar dan kembali.',
  size = 200,
  showActions = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    QRCode.toCanvas(
      canvasRef.current,
      value,
      {
        width: size,
        margin: 2,
        color: {
          dark: '#0F2447', // Deep navy
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      },
      (error) => {
        if (error) {
          console.error('Error generating QR Code', error);
        } else if (canvasRef.current) {
          setDataUrl(canvasRef.current.toDataURL('image/png'));
        }
      }
    );
  }, [value, size]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `QRCode-Izin-${permitId}-${studentName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-2xl p-5 border border-slate-200 shadow-sm max-w-sm mx-auto w-full text-center">
      
      {/* Top Security Header */}
      <div className="flex items-center gap-1.5 text-blue-800 font-semibold text-xs mb-3 bg-blue-50/80 px-3 py-1 rounded-md border border-blue-200">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
        <span>{statusText}</span>
      </div>

      {/* QR Canvas Container */}
      <div className="relative p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-inner flex items-center justify-center">
        <canvas ref={canvasRef} className="rounded-lg block" />
        
        {/* Subtle center logo overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-9 h-9 rounded-lg bg-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-md border-2 border-white">
            AL
          </div>
        </div>
      </div>

      {/* Permit ID & Student Details */}
      <div className="mt-3.5 space-y-0.5">
        <div className="font-mono text-xs font-bold text-blue-900 tracking-wider">
          {permitId}
        </div>
        <p className="text-sm font-bold text-slate-800 pt-0.5">
          {studentName}
        </p>
        <p className="text-xs text-slate-500 max-w-[260px] mx-auto leading-relaxed">
          {subtext}
        </p>
      </div>

      {/* Action buttons */}
      {showActions && (
        <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-slate-100 w-full">
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95"
            title="Salin ID"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin ID</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs active:scale-95"
            title="Simpan QR Code"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Simpan</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center p-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95"
            title="Cetak Surat Izin"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
