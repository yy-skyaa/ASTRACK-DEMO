import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Phone, 
  Heart, 
  User,
  ShieldCheck
} from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { currentStudent, students, setCurrentStudent, permits } = useApp();

  const myPermits = permits.filter(p => p.studentId === currentStudent.id);
  const totalPermits = myPermits.length;
  const onTimePermits = myPermits.filter(p => p.status === 'sudah_kembali' && !p.isLate).length;
  const latePermits = myPermits.filter(p => p.isLate || p.status === 'terlambat').length;

  const complianceRate = totalPermits > 0 
    ? Math.round(((totalPermits - latePermits) / totalPermits) * 100) 
    : 100;

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4 sm:px-6 pb-20">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center relative overflow-hidden">
        <div className="h-24 -mx-6 -mt-6 bg-gradient-to-r from-blue-900 to-indigo-900 mb-6" />
        
        <div className="relative -mt-16">
          <div className="relative inline-block">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-sm mx-auto"
              referrerPolicy="no-referrer"
            />
            <span className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${
              currentStudent.currentStatus === 'sedang_keluar' 
                ? 'bg-sky-500' 
                : currentStudent.currentStatus === 'terlambat'
                ? 'bg-rose-500'
                : 'bg-emerald-500'
            }`} />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-3">
            {currentStudent.name}
          </h2>
          <p className="text-xs font-semibold text-blue-600 mt-0.5">
            NISN: {currentStudent.nisn} · {currentStudent.classRoom}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {currentStudent.dormBuilding} · {currentStudent.roomNumber}
          </p>
        </div>

        {/* Compliance & Stat Counters */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Total Izin</span>
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {totalPermits}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Tepat Waktu</span>
            <span className="text-xl font-bold text-emerald-700 tabular-nums">
              {onTimePermits}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Tingkat Disiplin</span>
            <span className="text-xl font-bold text-blue-700 tabular-nums">
              {complianceRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Detail Personal & Wali Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <span>Informasi Santri & Kontak Wali</span>
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>No. Telepon Siswa:</span>
            </span>
            <span className="text-slate-800 font-semibold">{currentStudent.phone}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-slate-400" />
              <span>Nama Orang Tua / Wali:</span>
            </span>
            <span className="text-slate-800 font-semibold">{currentStudent.parentName}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>No. Telepon / WhatsApp Wali:</span>
            </span>
            <span className="text-slate-800 font-semibold">{currentStudent.parentPhone}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Gedung & Nomor Kamar:</span>
            </span>
            <span className="text-slate-800 font-semibold">
              {currentStudent.dormBuilding} - {currentStudent.roomNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Demo Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">
          Ganti Akun Santri (Simulasi Demo)
        </h3>
        <p className="text-xs text-slate-500">
          Pilih siswa lain untuk menguji skenario perizinan yang berbeda:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {students.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentStudent(s)}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                s.id === currentStudent.id
                  ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600/30'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <img
                src={s.avatar}
                alt={s.name}
                className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {s.name}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {s.classRoom} · {s.dormBuilding}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
