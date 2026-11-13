import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCheck, 
  Bell, 
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const { 
    isNotificationOpen, 
    setIsNotificationOpen, 
    notifications, 
    userRole, 
    currentStudent, 
    markNotificationRead, 
    markAllNotificationsRead,
    permits,
    setSelectedPermitForDetail
  } = useApp();

  if (!isNotificationOpen) return null;

  const myNotifications = notifications.filter(n => {
    if (n.recipientType === 'all') return true;
    if (userRole === 'pengurus') return n.recipientType === 'pengurus';
    return n.recipientType === 'siswa' && n.recipientId === currentStudent.id;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'error':
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const handleClickItem = (notif: any) => {
    markNotificationRead(notif.id);
    if (notif.permitId) {
      const permit = permits.find(p => p.id === notif.permitId);
      if (permit) {
        setSelectedPermitForDetail(permit);
        setIsNotificationOpen(false);
      }
    }
  };

  return (
    <div 
      onClick={() => setIsNotificationOpen(false)}
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full shadow-xl flex flex-col border-l border-slate-200 cursor-default"
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Pemberitahuan Sistem
              </h2>
              <p className="text-xs text-slate-500">
                Notifikasi perizinan & jadwal asrama
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="p-1.5 text-xs text-slate-600 hover:text-blue-700 rounded-lg hover:bg-slate-200/60 transition-colors flex items-center gap-1 font-medium"
              title="Tandai semua terbaca"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Tandai Baca</span>
            </button>
            <button
              type="button"
              onClick={() => setIsNotificationOpen(false)}
              className="w-8 h-8 rounded-lg bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {myNotifications.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Tidak ada pemberitahuan baru saat ini.
            </div>
          ) : (
            myNotifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleClickItem(n)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  n.read 
                    ? 'bg-slate-50/60 border-slate-200 text-slate-600' 
                    : 'bg-blue-50/60 border-blue-200 shadow-2xs text-slate-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {getNotifIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-semibold truncate">
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      {new Date(n.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
