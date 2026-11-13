import React from 'react';
import { useApp } from '../../context/AppContext';
import { Permit } from '../../types';
import { 
  Plus, 
  QrCode, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  DoorOpen, 
  Calendar, 
  ChevronRight,
  ShieldCheck,
  Building,
  UserCheck
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { 
    currentStudent, 
    permits, 
    setIsPermitFormOpen, 
    setSelectedPermitForDetail, 
    setActiveTab 
  } = useApp();

  const myPermits = permits.filter(p => p.studentId === currentStudent.id);
  
  const activePermit = myPermits.find(p => ['disetujui', 'sedang_keluar', 'terlambat'].includes(p.status)) 
    || myPermits.find(p => p.status === 'menunggu');

  const totalCount = myPermits.length;
  const completedCount = myPermits.filter(p => p.status === 'sudah_kembali').length;
  const lateCount = myPermits.filter(p => p.isLate || p.status === 'terlambat').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disetujui':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Disetujui · Siap Keluar</span>
          </span>
        );
      case 'sedang_keluar':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Sedang Keluar Asrama</span>
          </span>
        );
      case 'terlambat':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Terlambat Kembali</span>
          </span>
        );
      case 'sudah_kembali':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sudah Kembali</span>
          </span>
        );
      case 'ditolak':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span>Ditolak</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu Verifikasi</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* 1. Student Identity Hero Card (Clean Professional Boarding School Style) */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 shadow-sm border border-blue-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-white/60 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-blue-900 ${
                currentStudent.currentStatus === 'sedang_keluar' 
                  ? 'bg-sky-400' 
                  : currentStudent.currentStatus === 'terlambat'
                  ? 'bg-rose-500'
                  : 'bg-emerald-400'
              }`} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-white/10 text-blue-100 border border-white/15">
                  NISN: {currentStudent.nisn}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/30 text-white border border-blue-400/30">
                  {currentStudent.classRoom}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                {currentStudent.name}
              </h1>

              <p className="text-xs sm:text-sm text-blue-100/90 font-medium mt-0.5 flex items-center gap-1.5">
                <span>{currentStudent.dormBuilding}</span>
                <span>·</span>
                <span>{currentStudent.roomNumber}</span>
              </p>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPermitFormOpen(true)}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Ajukan Izin Baru</span>
            </button>
          </div>
        </div>

        {/* Status Strip */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-blue-200">Status Keberadaan:</span>
            <span className="font-semibold text-white bg-blue-950/50 px-2.5 py-1 rounded-lg border border-white/10">
              {currentStudent.currentStatus === 'sedang_keluar'
                ? 'Sedang di Luar Asrama'
                : currentStudent.currentStatus === 'terlambat'
                ? 'Terlambat Kembali'
                : 'Berada di Asrama'}
            </span>
          </div>

          <div className="text-blue-100/80 text-[11px]">
            Kontak Wali: {currentStudent.parentName} ({currentStudent.parentPhone})
          </div>
        </div>
      </div>

      {/* 2. Active Permit Card (If available) */}
      {activePermit && (
        <div className={`p-5 rounded-2xl border transition-all ${
          activePermit.status === 'terlambat'
            ? 'bg-rose-50/70 border-rose-200 shadow-xs'
            : activePermit.status === 'sedang_keluar'
            ? 'bg-sky-50/70 border-sky-200 shadow-xs'
            : activePermit.status === 'disetujui'
            ? 'bg-blue-50/70 border-blue-200 shadow-xs'
            : 'bg-amber-50/70 border-amber-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className={`p-3 rounded-xl shrink-0 ${
                activePermit.status === 'terlambat'
                  ? 'bg-rose-600 text-white'
                  : activePermit.status === 'sedang_keluar'
                  ? 'bg-sky-600 text-white'
                  : activePermit.status === 'disetujui'
                  ? 'bg-blue-600 text-white'
                  : 'bg-amber-500 text-white'
              }`}>
                {activePermit.status === 'terlambat' ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : activePermit.status === 'sedang_keluar' ? (
                  <DoorOpen className="w-5 h-5" />
                ) : (
                  <QrCode className="w-5 h-5" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {activePermit.id}
                  </span>
                  {getStatusBadge(activePermit.status)}
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {activePermit.typeLabel} · {activePermit.destination}
                </h3>

                <p className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span>Jadwal Keluar: {activePermit.departureDate} ({activePermit.departureTime} WIB)</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-blue-900">
                    Batas Kembali: {activePermit.estimatedReturnDate} ({activePermit.estimatedReturnTime} WIB)
                  </span>
                </p>

                {activePermit.approvedBy && (
                  <p className="text-[11px] text-blue-700 font-medium mt-1">
                    Disetujui oleh: {activePermit.approvedBy}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPermitForDetail(activePermit)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all whitespace-nowrap active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span>Buka QR Code Izin</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Stat Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Diajukan</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {totalCount}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Semua riwayat perizinan</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Izin Aktif</p>
          <p className="text-2xl font-bold text-blue-600 mt-1 tabular-nums">
            {activePermit ? '1' : '0'}
          </p>
          <span className="text-[11px] text-blue-600 font-medium mt-0.5 block capitalize">
            {activePermit ? activePermit.status.replace('_', ' ') : 'Tidak ada'}
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Selesai Tepat Waktu</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
            {completedCount}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">Kembali aman</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Terlambat</p>
          <p className="text-2xl font-bold text-rose-600 mt-1 tabular-nums">
            {lateCount}
          </p>
          <span className="text-[11px] text-rose-500 font-medium mt-0.5 block">Catatan kedisiplinan</span>
        </div>
      </div>

      {/* 4. Recent Permits List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Riwayat Izin Terbaru
            </h2>
            <p className="text-xs text-slate-500">
              Daftar izin keluar dan masuk asrama yang telah diajukan
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('riwayat')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {myPermits.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Belum Ada Pengajuan Izin</p>
            <p className="text-xs text-slate-500 mt-1">
              Klik tombol "Ajukan Izin Baru" untuk mengajukan izin keluar asrama.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {myPermits.slice(0, 4).map((permit) => (
              <div
                key={permit.id}
                onClick={() => setSelectedPermitForDetail(permit)}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-600">
                        {permit.id}
                      </span>
                      {getStatusBadge(permit.status)}
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 mt-1">
                      {permit.typeLabel}
                    </h4>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-sm">{permit.destination}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <p className="font-medium text-slate-800">
                      {permit.departureDate}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Batas: {permit.estimatedReturnTime} WIB
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
