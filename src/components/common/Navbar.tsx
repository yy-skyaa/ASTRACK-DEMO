import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Bell, 
  GraduationCap, 
  ShieldCheck, 
  RotateCcw,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    userRole, 
    setUserRole, 
    currentStudent, 
    currentPengurus, 
    notifications, 
    setIsNotificationOpen, 
    setIsLoginModalOpen,
    activeTab,
    setActiveTab,
    isPermitFormOpen,
    setIsPermitFormOpen,
    resetDemoData
  } = useApp();

  const unreadCount = notifications.filter(n => 
    !n.read && (n.recipientType === 'all' || n.recipientType === userRole || (userRole === 'siswa' && n.recipientId === currentStudent.id))
  ).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Zone 1: Brand Title with Authentic School Dorm Crest */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus-visible:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900 via-blue-800 to-blue-700 text-white flex items-center justify-center shadow-sm shadow-blue-900/20 group-hover:bg-blue-700 transition-colors">
                <Building2 className="w-5 h-5 text-blue-200" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                    Asrama<span className="text-blue-600">Link</span>
                  </span>
                  <span className="inline-flex items-center text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
                    Sistem Digital
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Perizinan Keluar Masuk Siswa Asrama
                </p>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Clean Segmented Tabs) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/70 text-xs font-semibold">
            {userRole === 'siswa' ? (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === 'dashboard' 
                      ? 'bg-white text-blue-700 shadow-xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  Beranda
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPermitFormOpen(true);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    isPermitFormOpen 
                      ? 'bg-blue-600 text-white shadow-xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  Ajukan Izin
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('riwayat')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === 'riwayat' 
                      ? 'bg-white text-blue-700 shadow-xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  Riwayat Izin
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('profil')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === 'profil' 
                      ? 'bg-white text-blue-700 shadow-xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  Profil Siswa
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === 'dashboard' 
                      ? 'bg-white text-blue-700 shadow-xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  Dashboard Pengurus
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('scanner')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === 'scanner' 
                      ? 'bg-white text-blue-700 shadow-xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  Pos Gerbang / Scanner
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('monitoring')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === 'monitoring' 
                      ? 'bg-white text-blue-700 shadow-xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  Monitoring Santri
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('audit')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === 'audit' 
                      ? 'bg-white text-blue-700 shadow-xs font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  Riwayat & Laporan
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Clean Actions, Role Switcher & User Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Role Switcher Pill */}
            <div className="inline-flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setUserRole('siswa');
                  setActiveTab('dashboard');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  userRole === 'siswa'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Beralih ke mode Siswa"
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Siswa</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserRole('pengurus');
                  setActiveTab('dashboard');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  userRole === 'pengurus'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Beralih ke mode Pengurus Asrama"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pengurus</span>
              </button>
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors focus-visible:outline-none"
              title="Notifikasi Sistem"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center text-[10px] font-bold text-white bg-blue-600 rounded-full shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Reset Demo Data Button */}
            <button
              type="button"
              onClick={resetDemoData}
              className="hidden sm:flex items-center p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
              title="Atur Ulang Data Demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* User Profile Pill */}
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors text-left"
            >
              <img
                src={userRole === 'siswa' ? currentStudent.avatar : currentPengurus.avatar}
                alt="Avatar"
                className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <div className="hidden md:block max-w-[120px] leading-tight">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {userRole === 'siswa' ? currentStudent.name : currentPengurus.name}
                </p>
                <p className="text-[10px] text-blue-600 font-medium truncate">
                  {userRole === 'siswa' ? currentStudent.classRoom : 'Pembina Asrama'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
