import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Permit } from '../../types';
import { 
  Inbox, 
  DoorOpen, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  QrCode, 
  ShieldCheck, 
  Check, 
  X, 
  ChevronRight, 
  Users
} from 'lucide-react';

export const PengurusDashboard: React.FC = () => {
  const { 
    permits, 
    currentPengurus, 
    approvePermit, 
    rejectPermit, 
    setSelectedPermitForDetail, 
    setActiveTab 
  } = useApp();

  const [activeApprovalId, setActiveApprovalId] = useState<string | null>(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // 4 Key Metrics:
  const countPending = permits.filter(p => p.status === 'menunggu').length;
  const countSedangKeluar = permits.filter(p => p.status === 'sedang_keluar').length;
  const countSudahKembali = permits.filter(p => p.status === 'sudah_kembali').length;
  const countTerlambat = permits.filter(p => p.status === 'terlambat').length;

  const pendingPermits = permits.filter(p => p.status === 'menunggu');
  const activeExits = permits.filter(p => p.status === 'sedang_keluar' || p.status === 'terlambat');

  const handleQuickApprove = (id: string) => {
    approvePermit(id, approvalNote || 'Disetujui. Harap menjaga ketertiban dan kembali tepat waktu.');
    setActiveApprovalId(null);
    setApprovalNote('');
  };

  const handleQuickReject = (id: string) => {
    if (!rejectReason.trim()) {
      alert('Mohon cantumkan alasan penolakan.');
      return;
    }
    rejectPermit(id, rejectReason);
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Pengurus Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white p-6 shadow-sm border border-blue-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={currentPengurus.avatar}
              alt={currentPengurus.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-white/60 shadow-sm shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/10 text-blue-200 text-xs font-semibold mb-1 border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                <span>Portal Dewan Pengasuhan & Kedisiplinan Asrama</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Assalamu'alaikum, {currentPengurus.name}
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/90 font-medium mt-0.5">
                {currentPengurus.title} · {currentPengurus.department}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveTab('scanner')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span>Buka Scanner Pos Gerbang</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('monitoring')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Monitoring Santri</span>
            </button>
          </div>
        </div>
      </div>

      {/* The 4 Crucial Spec Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Pengajuan Baru */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pengajuan Baru
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">
              {countPending}
            </span>
            <span className="text-xs text-amber-600 font-semibold">
              Perlu verifikasi
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Menunggu persetujuan pembina
          </p>
        </div>

        {/* 2. Sedang Keluar */}
        <div 
          onClick={() => setActiveTab('monitoring')}
          className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-blue-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sedang Keluar
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200 group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <DoorOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">
              {countSedangKeluar}
            </span>
            <span className="text-xs text-sky-600 font-semibold">
              Santri di luar
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            QR terverifikasi di pos gerbang
          </p>
        </div>

        {/* 3. Sudah Kembali */}
        <div 
          onClick={() => setActiveTab('monitoring')}
          className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-blue-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sudah Kembali
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">
              {countSudahKembali}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">
              Tepat waktu
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Selesai dan kembali aman
          </p>
        </div>

        {/* 4. Terlambat Kembali */}
        <div 
          onClick={() => setActiveTab('monitoring')}
          className="p-5 bg-white rounded-xl border border-rose-200 shadow-xs cursor-pointer hover:border-rose-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
              Terlambat Kembali
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-600 tabular-nums">
              {countTerlambat}
            </span>
            <span className="text-xs text-rose-600 font-semibold">
              Perlu evaluasi
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Melewati batas jam asrama
          </p>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 & 2: Pengajuan Baru yang Membutuhkan Persetujuan */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-blue-600" />
                  <span>Pengajuan Izin Menunggu Persetujuan</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verifikasi izin santri secara digital tanpa tanda tangan manual
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {pendingPermits.length} Menunggu
              </span>
            </div>

            {pendingPermits.length === 0 ? (
              <div className="py-10 px-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-800">
                  Semua Pengajuan Telah Diverifikasi
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tidak ada permohonan santri yang tertunda saat ini.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingPermits.map(permit => (
                  <div 
                    key={permit.id}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={permit.studentAvatar}
                          alt={permit.studentName}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">
                              {permit.studentName}
                            </span>
                            <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {permit.studentClass}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {permit.studentDorm} ({permit.studentRoom}) · Wali: {permit.parentPhone}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedPermitForDetail(permit)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 shrink-0 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
                      >
                        <span>Lihat Detail</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Content Snippet */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white p-3 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Kategori & Tujuan:</span>
                        <p className="font-semibold text-slate-800">
                          {permit.typeLabel}
                        </p>
                        <p className="text-slate-600 flex items-center gap-1 text-[11px] mt-0.5">
                          <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                          <span className="truncate">{permit.destination}</span>
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[11px]">Rencana Jadwal:</span>
                        <p className="font-semibold text-slate-800">
                          Keluar: {permit.departureDate} ({permit.departureTime})
                        </p>
                        <p className="text-blue-700 font-medium text-[11px] mt-0.5">
                          Batas Kembali: {permit.estimatedReturnTime} WIB
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 italic">
                      "{permit.reason}"
                    </p>

                    {/* Action Bar */}
                    {activeApprovalId === permit.id ? (
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-2 animate-in fade-in">
                        <label className="text-xs font-semibold text-slate-800 block">
                          Catatan Persetujuan Pengurus (Tercatat Otomatis):
                        </label>
                        <input
                          type="text"
                          value={approvalNote}
                          onChange={(e) => setApprovalNote(e.target.value)}
                          placeholder="Contoh: Disetujui. Harap kembali sebelum sholat maghrib."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setActiveApprovalId(null)}
                            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 rounded-lg border border-slate-300"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickApprove(permit.id)}
                            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                          >
                            Konfirmasi Setujui Digital
                          </button>
                        </div>
                      </div>
                    ) : rejectingId === permit.id ? (
                      <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-2 animate-in fade-in">
                        <label className="text-xs font-semibold text-rose-900 block">
                          Alasan Penolakan:
                        </label>
                        <textarea
                          rows={2}
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Tulis alasan penolakan izin..."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setRejectingId(null)}
                            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 rounded-lg border border-slate-300"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickReject(permit.id)}
                            className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
                          >
                            Tolak Izin
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setRejectingId(permit.id)}
                          className="py-2 px-3 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Tolak</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveApprovalId(permit.id)}
                          className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Setujui (Tanda Tangan Otomatis)</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Sedang di Luar Asrama */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DoorOpen className="w-5 h-5 text-sky-600" />
                <span>Sedang di Luar Asrama</span>
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                {activeExits.length}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Siswa yang telah keluar pos gerbang dan belum kembali:
            </p>

            {activeExits.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500">
                  Seluruh siswa saat ini berada di dalam asrama.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeExits.map(permit => {
                  const isLate = permit.status === 'terlambat';
                  return (
                    <div
                      key={permit.id}
                      onClick={() => setSelectedPermitForDetail(permit)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isLate
                          ? 'bg-rose-50/70 border-rose-200'
                          : 'bg-sky-50/40 border-sky-200 hover:bg-sky-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={permit.studentAvatar}
                          alt={permit.studentName}
                          className="w-10 h-10 rounded-lg object-cover border border-white shadow-xs shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {permit.studentName}
                            </p>
                            {isLate ? (
                              <span className="text-[10px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                                Terlambat
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                                Keluar
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {permit.studentClass} · {permit.destination}
                          </p>
                          <div className="flex items-center justify-between text-[10px] font-medium text-slate-600 mt-1">
                            <span>Keluar: {permit.departureTime}</span>
                            <span className={isLate ? 'text-rose-700 font-bold' : 'text-blue-700 font-semibold'}>
                              Batas: {permit.estimatedReturnTime} WIB
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('monitoring')}
              className="w-full py-2.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center block"
            >
              Lihat Seluruh Monitoring Santri &rarr;
            </button>
          </div>

          {/* Pos Gerbang Shortcut */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-800 to-indigo-900 text-white shadow-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-blue-300" />
              <h3 className="text-sm font-bold">Pos Gerbang Terpadu</h3>
            </div>
            <p className="text-xs text-blue-100/90 leading-relaxed font-normal">
              Pindai QR Code santri saat keluar atau tiba kembali ke asrama. Sistem otomatis mencatat waktu dan status kedisiplinan.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('scanner')}
              className="w-full py-2.5 px-4 bg-white text-blue-900 hover:bg-blue-50 font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-95"
            >
              Buka Scanner Pos Gerbang
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
