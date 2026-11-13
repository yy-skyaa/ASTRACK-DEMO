import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentHistory } from './components/student/StudentHistory';
import { StudentProfile } from './components/student/StudentProfile';
import { PermitFormModal } from './components/student/PermitFormModal';
import { PengurusDashboard } from './components/pengurus/PengurusDashboard';
import { MonitoringView } from './components/pengurus/MonitoringView';
import { GateScanner } from './components/pengurus/GateScanner';
import { AuditHistoryView } from './components/pengurus/AuditHistoryView';
import { PermitDetailModal } from './components/common/PermitDetailModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { LoginModal } from './components/auth/LoginModal';
import { Building2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    userRole, 
    setUserRole, 
    activeTab, 
    setActiveTab, 
    isPermitFormOpen,
    setIsPermitFormOpen, 
    setIsLoginModalOpen 
  } = useApp();

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Institutional Context Sub-Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white py-2 px-4 sm:px-6 shadow-xs text-xs border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-medium text-blue-100">
              Mode Akses: <strong className="text-white">{userRole === 'siswa' ? 'Siswa / Santri' : 'Pengurus Asrama (Dewan Pembina)'}</strong>
            </span>
            <span className="hidden md:inline text-blue-300/80">
              — Sistem Perizinan Digital Asrama Siswa
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="text-blue-200 hover:text-white underline underline-offset-2 font-medium transition-colors"
            >
              Ganti Akun Demo
            </button>
            <span className="text-blue-400/50">|</span>
            <button
              type="button"
              onClick={() => {
                if (userRole === 'siswa') {
                  setUserRole('pengurus');
                  setActiveTab('dashboard');
                } else {
                  setUserRole('siswa');
                  setActiveTab('dashboard');
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all text-xs"
            >
              Beralih ke {userRole === 'siswa' ? 'Pengurus' : 'Siswa'} &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <main className="flex-1 py-6">
        {userRole === 'siswa' ? (
          <>
            {activeTab === 'dashboard' && <StudentDashboard />}
            {activeTab === 'ajukan' && <StudentDashboard />}
            {activeTab === 'riwayat' && <StudentHistory />}
            {activeTab === 'profil' && <StudentProfile />}
          </>
        ) : (
          <>
            {activeTab === 'dashboard' && <PengurusDashboard />}
            {activeTab === 'scanner' && <GateScanner />}
            {activeTab === 'monitoring' && <MonitoringView />}
            {activeTab === 'audit' && <AuditHistoryView />}
          </>
        )}
      </main>

      {/* Footer on desktop */}
      <footer className="hidden md:block py-6 border-t border-slate-200 bg-white text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-800">AsramaLink — Sistem Perizinan Asrama Terpadu</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <span>Verifikasi QR Pos Gerbang</span>
            <span>·</span>
            <span>Otentikasi Digital Otomatis</span>
            <span>·</span>
            <span>Pencatatan Kedisiplinan Realtime</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals & Drawers */}
      <PermitFormModal />
      <PermitDetailModal />
      <NotificationDrawer />
      <LoginModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
