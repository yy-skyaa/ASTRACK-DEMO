import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Permit } from '../../types';
import { 
  QrCode, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  DoorOpen, 
  X, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';

export const GateScanner: React.FC = () => {
  const { permits, processGateScan, setSelectedPermitForDetail } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    action?: 'keluar' | 'kembali';
    permit?: Permit;
    isLate?: boolean;
    message: string;
  } | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Audio feedback using Web Audio API
  const playBeep = (isError = false, isLate = false) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (isError) {
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else if (isLate) {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.setValueAtTime(330, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } else {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      }
    } catch {
      // AudioContext not permitted or supported
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      setCameraError('Kamera tidak dapat diakses atau izin ditolak. Anda dapat menggunakan pemindaian kode verifikasi manual di bawah.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleScanSubmit = (codeToScan?: string) => {
    const targetCode = codeToScan || inputCode;
    if (!targetCode.trim()) return;

    const res = processGateScan(targetCode);
    setScanResult(res);

    if (res.success) {
      playBeep(false, res.isLate);
    } else {
      playBeep(true);
    }

    setInputCode('');
  };

  const approvedPermits = permits.filter(p => p.status === 'disetujui');
  const outPermits = permits.filter(p => p.status === 'sedang_keluar' || p.status === 'terlambat');

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 pb-20">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Pos Keamanan & Gerbang Utama Asrama</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Pos Scanner QR Code Keluar & Masuk
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pindai QR Code santri untuk mencatat waktu keluar dan kembali secara otomatis dan akurat.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isCameraActive ? (
              <button
                type="button"
                onClick={startCamera}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Nyalakan Kamera Scanner</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCamera}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold active:scale-95 transition-all"
              >
                <X className="w-4 h-4" />
                <span>Matikan Kamera</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Camera Viewfinder */}
      {isCameraActive && (
        <div className="relative rounded-2xl overflow-hidden bg-black max-w-md mx-auto aspect-square border-2 border-blue-500 shadow-md">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />

          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-8">
            <div className="w-64 h-64 border-2 border-dashed border-sky-400 rounded-2xl relative flex items-center justify-center">
              <div className="absolute w-full h-0.5 bg-sky-400 shadow-sm shadow-sky-400 animate-pulse top-1/2" />
              <p className="text-white text-xs font-semibold bg-black/60 px-3 py-1 rounded-md backdrop-blur-xs">
                Arahkan QR Code ke Kotak
              </p>
            </div>
          </div>
        </div>
      )}

      {cameraError && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Manual Code Input */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
          Input Kode Izin / Barcode Scanner Manual:
        </h3>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <QrCode className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleScanSubmit();
              }}
              placeholder="Tempel / ketik Kode Izin (contoh: IZN-20261001-01 atau ASRAMALINK-...)"
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>

          <button
            type="button"
            onClick={() => handleScanSubmit()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Verifikasi Pos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scan Result Feedback Card */}
      {scanResult && (
        <div className={`p-6 rounded-2xl border shadow-sm animate-in zoom-in-95 transition-all ${
          !scanResult.success
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : scanResult.isLate
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : scanResult.action === 'keluar'
            ? 'bg-sky-50 border-sky-300 text-sky-950'
            : 'bg-emerald-50 border-emerald-300 text-emerald-950'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${
              !scanResult.success
                ? 'bg-rose-600 text-white'
                : scanResult.isLate
                ? 'bg-amber-500 text-white'
                : scanResult.action === 'keluar'
                ? 'bg-sky-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}>
              {!scanResult.success ? (
                <X className="w-6 h-6" />
              ) : scanResult.isLate ? (
                <AlertTriangle className="w-6 h-6" />
              ) : scanResult.action === 'keluar' ? (
                <DoorOpen className="w-6 h-6" />
              ) : (
                <CheckCircle2 className="w-6 h-6" />
              )}
            </div>

            <div className="flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider block opacity-75">
                {scanResult.success
                  ? scanResult.action === 'keluar'
                    ? 'VERIFIKASI SCAN KELUAR BERHASIL'
                    : 'VERIFIKASI SCAN KEMBALI BERHASIL'
                  : 'VERIFIKASI GAGAL'}
              </span>

              <h3 className="text-base font-bold mt-0.5">
                {scanResult.message}
              </h3>

              {scanResult.permit && (
                <div className="mt-4 p-3.5 bg-white/90 rounded-xl border border-black/5 text-xs text-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{scanResult.permit.studentName} ({scanResult.permit.studentClass})</span>
                    <span className="font-mono text-xs text-blue-700">{scanResult.permit.id}</span>
                  </div>
                  <p className="text-slate-600">
                    Tujuan: {scanResult.permit.destination}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>
                      {scanResult.action === 'keluar' 
                        ? `Keluar: ${new Date(scanResult.permit.actualDepartureAt || '').toLocaleTimeString('id-ID')} WIB`
                        : `Kembali: ${new Date(scanResult.permit.actualReturnAt || '').toLocaleTimeString('id-ID')} WIB`
                      }
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedPermitForDetail(scanResult.permit!)}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Buka Detail Lengkap &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Test Simulator for Active Permits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Ready to Exit (Disetujui) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <DoorOpen className="w-4 h-4 text-blue-600" />
              <span>Siap Keluar Asrama (Disetujui)</span>
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {approvedPermits.length}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Klik siswa untuk memverifikasi QR saat melewati pos gerbang keluar:
          </p>

          {approvedPermits.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center">
              Tidak ada izin berstatus siap keluar saat ini.
            </p>
          ) : (
            <div className="space-y-2">
              {approvedPermits.map(permit => (
                <div
                  key={permit.id}
                  className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {permit.studentName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {permit.studentClass} · {permit.destination}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleScanSubmit(permit.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs active:scale-95 transition-all whitespace-nowrap"
                  >
                    Scan Keluar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ready to Return */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Sedang di Luar (Siap Scan Kembali)</span>
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">
              {outPermits.length}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Klik siswa untuk memverifikasi QR saat mereka tiba kembali di asrama:
          </p>

          {outPermits.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center">
              Tidak ada santri yang sedang berada di luar asrama.
            </p>
          ) : (
            <div className="space-y-2">
              {outPermits.map(permit => {
                const isLate = permit.status === 'terlambat';
                return (
                  <div
                    key={permit.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                      isLate
                        ? 'bg-rose-50/70 border-rose-200'
                        : 'bg-slate-50 hover:bg-emerald-50/50 border-slate-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {permit.studentName}
                        </p>
                        {isLate && (
                          <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                            Terlambat
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        Batas: {permit.estimatedReturnTime} WIB · {permit.destination}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleScanSubmit(permit.id)}
                      className={`px-3 py-1.5 text-xs font-semibold text-white rounded-lg shadow-xs active:scale-95 transition-all whitespace-nowrap ${
                        isLate
                          ? 'bg-rose-600 hover:bg-rose-700'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      Scan Kembali
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
