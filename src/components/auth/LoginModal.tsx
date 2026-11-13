import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  X, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { 
    isLoginModalOpen, 
    setIsLoginModalOpen, 
    userRole, 
    setUserRole, 
    currentStudent, 
    setCurrentStudent, 
    currentPengurus, 
    setCurrentPengurus,
    students,
    pengurusList,
    setActiveTab
  } = useApp();

  const [activeTab, setActiveLoginTab] = useState<'siswa' | 'pengurus'>(userRole);

  if (!isLoginModalOpen) return null;

  const handleSelectStudent = (student: typeof students[0]) => {
    setUserRole('siswa');
    setCurrentStudent(student);
    setActiveTab('dashboard');
    setIsLoginModalOpen(false);
  };

  const handleSelectPengurus = (pengurus: typeof pengurusList[0]) => {
    setUserRole('pengurus');
    setCurrentPengurus(pengurus);
    setActiveTab('dashboard');
    setIsLoginModalOpen(false);
  };

  return (
    <div 
      onClick={() => setIsLoginModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto animate-in fade-in cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden relative my-auto cursor-default"
      >
        
        {/* Top Header Card */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white relative text-center">
          <button
            type="button"
            onClick={() => setIsLoginModalOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Building2 className="w-6 h-6 text-blue-200" />
          </div>

          <h2 className="text-xl font-bold tracking-tight">
            Asrama<span className="text-blue-300">Link</span>
          </h2>
          <p className="text-xs text-blue-200/90 mt-0.5 max-w-xs mx-auto">
            Sistem Digital Perizinan Keluar Masuk Siswa Asrama
          </p>

          {/* Role Pill Switcher */}
          <div className="mt-4 p-1 bg-black/25 rounded-xl flex max-w-xs mx-auto border border-white/15">
            <button
              type="button"
              onClick={() => setActiveLoginTab('siswa')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'siswa'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>Siswa</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveLoginTab('pengurus')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'pengurus'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
              <span>Pengurus</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
              {activeTab === 'siswa' ? 'Pilih Akun Siswa (Demo):' : 'Pilih Akun Pengurus (Demo):'}
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {activeTab === 'siswa' ? (
                students.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectStudent(s)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all ${
                      s.id === currentStudent.id && userRole === 'siswa'
                        ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600/30'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
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
                    </div>
                    {s.id === currentStudent.id && userRole === 'siswa' ? (
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        Aktif
                      </span>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                ))
              ) : (
                pengurusList.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPengurus(p)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all ${
                      p.id === currentPengurus.id && userRole === 'pengurus'
                        ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600/30'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {p.title}
                        </p>
                      </div>
                    </div>
                    {p.id === currentPengurus.id && userRole === 'pengurus' ? (
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        Aktif
                      </span>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="pt-1 text-center text-xs text-slate-500">
            Pilih akun demo untuk menguji simulasi alur izin santri & pengurus asrama.
          </div>

        </div>

      </div>
    </div>
  );
};
