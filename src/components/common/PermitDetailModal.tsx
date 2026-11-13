import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Permit } from '../../types';
import { QRCodeView } from './QRCodeView';
import { 
  X, 
  Calendar, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  DoorOpen, 
  Check,
  Clock
} from 'lucide-react';

export const PermitDetailModal: React.FC = () => {
  const { 
    selectedPermitForDetail, 
    setSelectedPermitForDetail, 
    userRole, 
    approvePermit, 
    rejectPermit,
    processGateScan
  } = useApp();

  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [scanFeedback, setScanFeedback] = useState<string | null>(null);

  if (!selectedPermitForDetail) return null;

  const permit: Permit = selectedPermitForDetail;

  const getStatusBadge = () => {
    switch (permit.status) {
      case 'disetujui':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Disetujui · Siap Keluar</span>
          </span>
        );
      case 'sedang_keluar':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Sedang Keluar Asrama</span>
          </span>
        );
      case 'sudah_kembali':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-3.5 h-3.5" />
            <span>Sudah Kembali (Selesai)</span>
          </span>
        );
      case 'terlambat':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Terlambat Kembali</span>
          </span>
        );
      case 'ditolak':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <XCircle className="w-3.5 h-3.5" />
            <span>Izin Ditolak</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu Verifikasi</span>
          </span>
        );
    }
  };

  const handleApprove = () => {
    approvePermit(permit.id, approvalNotes);
    setSelectedPermitForDetail(null);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Silakan tulis alasan penolakan.');
      return;
    }
    rejectPermit(permit.id, rejectReason);
    setSelectedPermitForDetail(null);
  };

  const handleSimulateScan = () => {
    const res = processGateScan(permit.id);
    setScanFeedback(res.message);
    setTimeout(() => {
      setSelectedPermitForDetail(null);
    }, 1800);
  };

  return (
    <div 
      onClick={() => setSelectedPermitForDetail(null)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto animate-in fade-in cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-xl relative my-auto cursor-default"
      >
        
        {/* Header Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-200">
          <div>
            <span className="text-[11px] font-mono font-semibold text-blue-600 tracking-wider">
              {permit.id}
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Detail Surat Izin Digital
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setSelectedPermitForDetail(null)}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
                Kategori Izin
              </span>
              <p className="text-base font-bold text-slate-900">
                {permit.typeLabel}
              </p>
            </div>
            <div>
              {getStatusBadge()}
            </div>
          </div>

          {/* Student Profile Snippet */}
          <div className="flex items-center gap-3.5 p-4 bg-white rounded-xl border border-slate-200">
            <img
              src={permit.studentAvatar}
              alt={permit.studentName}
              className="w-12 h-12 rounded-lg object-cover border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {permit.studentName}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {permit.studentClass} · {permit.studentDorm} ({permit.studentRoom})
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600">
                <span>Telp: {permit.studentPhone}</span>
                <span aria-hidden="true">·</span>
                <span className="text-blue-700 font-medium">Wali: {permit.parentPhone}</span>
              </div>
            </div>
          </div>

          {/* Destination & Reason */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Lokasi Tujuan</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {permit.destination}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Alasan / Keperluan</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {permit.reason}
              </p>
            </div>
          </div>

          {/* Time & Schedule Grid */}
          <div className="grid grid-cols-2 gap-3.5 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-xs">
            <div>
              <span className="text-slate-500 font-medium block mb-1">Jadwal Keluar:</span>
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                {permit.departureDate}
              </p>
              <p className="text-blue-700 font-bold mt-0.5">
                {permit.departureTime} WIB
              </p>
            </div>

            <div>
              <span className="text-slate-500 font-medium block mb-1">Batas Waktu Kembali:</span>
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                {permit.estimatedReturnDate}
              </p>
              <p className="text-blue-700 font-bold mt-0.5">
                {permit.estimatedReturnTime} WIB
              </p>
            </div>
          </div>

          {/* Digital Verification Record */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Pencatatan & Verifikasi Pengurus</span>
              </div>
              {permit.approvedBy && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Tervalidasi Digital
                </span>
              )}
            </div>

            {permit.status === 'menunggu' ? (
              <p className="text-slate-500 italic pt-1">
                Permohonan izin ini sedang mengantre untuk diverifikasi oleh pengurus asrama.
              </p>
            ) : permit.status === 'ditolak' ? (
              <div className="bg-rose-50 p-3 rounded-lg border border-rose-200 text-rose-900">
                <p className="font-semibold">Ditolak oleh: {permit.rejectedBy}</p>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Waktu: {permit.rejectedAt ? new Date(permit.rejectedAt).toLocaleString('id-ID') : '-'}
                </p>
                <p className="mt-1 font-medium">Alasan: {permit.rejectionReason}</p>
              </div>
            ) : (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Disetujui Oleh:</span>
                  <span className="font-semibold text-slate-900">{permit.approvedBy || '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Waktu Persetujuan Otomatis:</span>
                  <span className="font-mono text-slate-700">
                    {permit.approvedAt ? new Date(permit.approvedAt).toLocaleString('id-ID') : '-'}
                  </span>
                </div>
                {permit.approvalNotes && (
                  <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] mt-1">
                    Catatan Pengurus: "{permit.approvalNotes}"
                  </p>
                )}
              </div>
            )}

            {/* Departure & Arrival Actual Timestamps */}
            {(permit.actualDepartureAt || permit.actualReturnAt) && (
              <div className="pt-2 border-t border-slate-100 space-y-1">
                {permit.actualDepartureAt && (
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Waktu Keluar Aktual (Pos Gerbang):</span>
                    <span className="font-semibold text-blue-700">
                      {new Date(permit.actualDepartureAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  </div>
                )}
                {permit.actualReturnAt && (
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Waktu Kembali Aktual (Pos Gerbang):</span>
                    <span className="font-semibold text-emerald-700">
                      {new Date(permit.actualReturnAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  </div>
                )}
                {permit.isLate && (
                  <div className="p-2 bg-rose-50 text-rose-800 rounded-lg font-medium text-xs flex items-center gap-1.5 border border-rose-200">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                    <span>Terlambat kembali {permit.lateDurationMinutes || 0} menit dari jadwal yang ditetapkan.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* QR Code Section */}
          {['disetujui', 'sedang_keluar', 'sudah_kembali', 'terlambat'].includes(permit.status) && (
            <div className="pt-2">
              <QRCodeView
                value={permit.qrPayload}
                permitId={permit.id}
                studentName={permit.studentName}
                subtext={
                  permit.status === 'disetujui'
                    ? 'Tunjukkan QR Code ini pada petugas pos gerbang saat akan meninggalkan asrama.'
                    : permit.status === 'sedang_keluar' || permit.status === 'terlambat'
                    ? 'Tunjukkan QR Code ini kepada petugas pos gerbang saat tiba kembali di asrama.'
                    : 'Izin telah selesai digunakan. Siswa sudah berada di asrama.'
                }
              />
            </div>
          )}

          {/* Scan Feedback Alert */}
          {scanFeedback && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs font-semibold text-center animate-in fade-in">
              {scanFeedback}
            </div>
          )}

          {/* Gate Simulation Button */}
          {(permit.status === 'disetujui' || permit.status === 'sedang_keluar' || permit.status === 'terlambat') && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1.5">
              <p className="text-xs text-slate-600 font-medium">
                Simulasi Petugas Gerbang (Uji Coba Langsung):
              </p>
              <button
                type="button"
                onClick={handleSimulateScan}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <DoorOpen className="w-4 h-4" />
                <span>
                  {permit.status === 'disetujui'
                    ? 'Simulasikan Scan KELUAR di Gerbang'
                    : 'Simulasikan Scan KEMBALI di Gerbang'}
                </span>
              </button>
            </div>
          )}

          {/* Pengurus Verification Actions */}
          {userRole === 'pengurus' && permit.status === 'menunggu' && (
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Tindakan Verifikasi Pengurus:
              </h4>

              <div>
                <label className="text-xs text-slate-600 block mb-1">
                  Catatan untuk Siswa (Opsional):
                </label>
                <input
                  type="text"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Contoh: Bawa kartu pelajar dan kembali sebelum maghrib."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {showRejectInput && (
                <div className="animate-in fade-in">
                  <label className="text-xs font-semibold text-rose-700 block mb-1">
                    Alasan Penolakan (Wajib):
                  </label>
                  <textarea
                    rows={2}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Contoh: Belum ada konfirmasi izin dari wali santri."
                    className="w-full p-2.5 text-xs rounded-xl border border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                  />
                </div>
              )}

              <div className="flex gap-2">
                {!showRejectInput ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowRejectInput(true)}
                      className="py-2.5 px-4 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors"
                    >
                      Tolak Izin
                    </button>
                    <button
                      type="button"
                      onClick={handleApprove}
                      className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all active:scale-95"
                    >
                      Setujui Izin Digital
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowRejectInput(false)}
                      className="py-2.5 px-4 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleReject}
                      className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
                    >
                      Konfirmasi Tolak
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
