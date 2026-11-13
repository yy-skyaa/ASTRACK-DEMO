import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Plus, 
  Clock, 
  User, 
  QrCode, 
  Users, 
  FileText 
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { userRole, activeTab, setActiveTab, setIsPermitFormOpen } = useApp();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg shadow-slate-900/5 px-3 py-1.5">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {userRole === 'siswa' ? (
          <>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-all ${
                activeTab === 'dashboard'
                  ? 'text-blue-600 font-bold scale-102'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Beranda</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPermitFormOpen(true);
              }}
              className="flex flex-col items-center justify-center -mt-4"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30 active:scale-95 transition-transform border-2 border-white">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-semibold text-blue-700 mt-0.5">Ajukan Izin</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('riwayat')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-all ${
                activeTab === 'riwayat'
                  ? 'text-blue-600 font-bold scale-102'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Riwayat</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profil')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-all ${
                activeTab === 'profil'
                  ? 'text-blue-600 font-bold scale-102'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Profil</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 transition-all ${
                activeTab === 'dashboard'
                  ? 'text-blue-600 font-bold scale-102'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('scanner')}
              className="flex flex-col items-center justify-center -mt-4"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-md shadow-blue-950/30 active:scale-95 transition-transform border-2 border-white">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-semibold text-blue-900 mt-0.5">Scan Pos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('monitoring')}
              className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 transition-all ${
                activeTab === 'monitoring'
                  ? 'text-blue-600 font-bold scale-102'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Monitoring</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 transition-all ${
                activeTab === 'audit'
                  ? 'text-blue-600 font-bold scale-102'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Riwayat</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
