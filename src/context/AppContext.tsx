import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  Student, 
  Pengurus, 
  Permit, 
  NotificationItem, 
  AuditLog, 
  PermitType, 
  PermitStatus 
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_PENGURUS, 
  INITIAL_PERMITS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from '../data/initialData';

interface GateScanResult {
  success: boolean;
  action?: 'keluar' | 'kembali';
  permit?: Permit;
  isLate?: boolean;
  message: string;
}

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentStudent: Student;
  setCurrentStudent: (student: Student) => void;
  currentPengurus: Pengurus;
  setCurrentPengurus: (pengurus: Pengurus) => void;
  
  students: Student[];
  pengurusList: Pengurus[];
  permits: Permit[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  selectedPermitForDetail: Permit | null;
  setSelectedPermitForDetail: (permit: Permit | null) => void;
  
  isPermitFormOpen: boolean;
  setIsPermitFormOpen: (open: boolean) => void;
  
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  
  // Actions
  submitPermit: (data: {
    type: PermitType;
    typeLabel: string;
    destination: string;
    reason: string;
    departureDate: string;
    departureTime: string;
    estimatedReturnDate: string;
    estimatedReturnTime: string;
  }) => Permit;
  
  approvePermit: (permitId: string, notes?: string) => void;
  rejectPermit: (permitId: string, reason: string) => void;
  processGateScan: (permitIdOrPayload: string, officerName?: string) => GateScanResult;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'asramalink_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or seed data
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [pengurusList] = useState<Pengurus[]>(INITIAL_PENGURUS);

  const [permits, setPermits] = useState<Permit[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_permits`);
      return saved ? JSON.parse(saved) : INITIAL_PERMITS;
    } catch {
      return INITIAL_PERMITS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifs`);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [userRole, setUserRole] = useState<UserRole>('siswa');
  const [currentStudent, setCurrentStudent] = useState<Student>(students[0] || INITIAL_STUDENTS[0]);
  const [currentPengurus, setCurrentPengurus] = useState<Pengurus>(pengurusList[0] || INITIAL_PENGURUS[0]);
  
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedPermitForDetail, setSelectedPermitForDetail] = useState<Permit | null>(null);
  const [isPermitFormOpen, setIsPermitFormOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_permits`, JSON.stringify(permits));
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
      localStorage.setItem(`${STORAGE_KEY}_notifs`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(auditLogs));
    } catch (e) {
      console.error('Failed to sync to LocalStorage', e);
    }
  }, [permits, students, notifications, auditLogs]);

  // Keep currentStudent synced with student updates
  useEffect(() => {
    const updated = students.find(s => s.id === currentStudent.id);
    if (updated) {
      setCurrentStudent(updated);
    }
  }, [students]);

  // Check for permits that have exceeded curfew while "sedang_keluar"
  useEffect(() => {
    const checkOverduePermits = () => {
      const now = new Date();
      let hasUpdates = false;

      const updatedPermits = permits.map(p => {
        if (p.status === 'sedang_keluar') {
          const estimatedReturn = new Date(`${p.estimatedReturnDate}T${p.estimatedReturnTime}:00`);
          if (now > estimatedReturn) {
            hasUpdates = true;
            const diffMinutes = Math.floor((now.getTime() - estimatedReturn.getTime()) / (1000 * 60));
            return {
              ...p,
              status: 'terlambat' as PermitStatus,
              isLate: true,
              lateDurationMinutes: diffMinutes,
            };
          }
        }
        return p;
      });

      if (hasUpdates) {
        setPermits(updatedPermits);
        
        // Notify pengurus
        const newNotif: NotificationItem = {
          id: `NOTIF-${Date.now()}`,
          recipientType: 'pengurus',
          title: 'Perhatian: Siswa Terlambat Kembali',
          message: 'Sistem mendeteksi ada santri/siswa yang telah melampaui batas waktu kepulangan asrama.',
          type: 'error',
          timestamp: new Date().toISOString(),
          read: false,
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    };

    const interval = setInterval(checkOverduePermits, 30000);
    return () => clearInterval(interval);
  }, [permits]);

  // Submit new permit
  const submitPermit = (data: {
    type: PermitType;
    typeLabel: string;
    destination: string;
    reason: string;
    departureDate: string;
    departureTime: string;
    estimatedReturnDate: string;
    estimatedReturnTime: string;
  }): Permit => {
    const permitNumber = `IZN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;
    const qrPayload = `ASRAMALINK-${currentStudent.id}-${permitNumber}-${Date.now().toString(36).toUpperCase()}`;

    const newPermit: Permit = {
      id: permitNumber,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentClass: currentStudent.classRoom,
      studentRoom: currentStudent.roomNumber,
      studentDorm: currentStudent.dormBuilding,
      studentAvatar: currentStudent.avatar,
      studentPhone: currentStudent.phone,
      parentPhone: currentStudent.parentPhone,
      type: data.type,
      typeLabel: data.typeLabel,
      destination: data.destination,
      reason: data.reason,
      departureDate: data.departureDate,
      departureTime: data.departureTime,
      estimatedReturnDate: data.estimatedReturnDate,
      estimatedReturnTime: data.estimatedReturnTime,
      status: 'menunggu',
      createdAt: new Date().toISOString(),
      qrPayload,
    };

    setPermits(prev => [newPermit, ...prev]);

    // Update student's activePermitId
    setStudents(prev => prev.map(s => s.id === currentStudent.id ? { ...s, activePermitId: newPermit.id } : s));

    // Audit log
    const log: AuditLog = {
      id: `LOG-${Date.now()}`,
      permitId: newPermit.id,
      studentName: currentStudent.name,
      action: 'pengajuan',
      actionLabel: 'Pengajuan Izin Masuk Sistem',
      actorName: currentStudent.name,
      actorRole: 'Siswa',
      timestamp: new Date().toISOString(),
      details: `Mengajukan izin keluar (${data.typeLabel}) ke ${data.destination}. Menunggu verifikasi pengurus.`,
    };
    setAuditLogs(prev => [log, ...prev]);

    // Notification for pengurus
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      recipientType: 'pengurus',
      title: 'Pengajuan Izin Baru',
      message: `${currentStudent.name} (${currentStudent.classRoom}) mengajukan ${data.typeLabel} ke ${data.destination}.`,
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false,
      permitId: newPermit.id,
    };
    setNotifications(prev => [notif, ...prev]);

    return newPermit;
  };

  // Approve permit
  const approvePermit = (permitId: string, notes?: string) => {
    const timestamp = new Date().toISOString();
    const wardenName = currentPengurus.name;

    let targetPermit: Permit | undefined;

    setPermits(prev => prev.map(p => {
      if (p.id === permitId) {
        targetPermit = {
          ...p,
          status: 'disetujui',
          approvedBy: wardenName,
          approvedAt: timestamp,
          approvalNotes: notes || 'Izin telah disetujui secara digital tanpa tanda tangan manual.',
        };
        return targetPermit;
      }
      return p;
    }));

    if (targetPermit) {
      // Audit log
      const log: AuditLog = {
        id: `LOG-${Date.now()}`,
        permitId,
        studentName: targetPermit.studentName,
        action: 'persetujuan',
        actionLabel: 'Pengajuan Izin Disetujui',
        actorName: wardenName,
        actorRole: 'Pengurus',
        timestamp,
        details: `Izin resmi disetujui oleh ${wardenName}. QR Code verifikasi aktif.${notes ? ` Catatan: "${notes}"` : ''}`,
      };
      setAuditLogs(prev => [log, ...prev]);

      // Notification to student
      const notif: NotificationItem = {
        id: `NOTIF-${Date.now()}`,
        recipientType: 'siswa',
        recipientId: targetPermit.studentId,
        title: 'Izin Anda Disetujui!',
        message: `Pengajuan izin ${targetPermit.typeLabel} Anda telah disetujui oleh ${wardenName}. Tunjukkan QR Code pada petugas saat keluar gerbang.`,
        type: 'success',
        timestamp,
        read: false,
        permitId,
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  // Reject permit
  const rejectPermit = (permitId: string, reason: string) => {
    const timestamp = new Date().toISOString();
    const wardenName = currentPengurus.name;

    let targetPermit: Permit | undefined;

    setPermits(prev => prev.map(p => {
      if (p.id === permitId) {
        targetPermit = {
          ...p,
          status: 'ditolak',
          rejectedBy: wardenName,
          rejectedAt: timestamp,
          rejectionReason: reason,
        };
        return targetPermit;
      }
      return p;
    }));

    if (targetPermit) {
      // Reset student active permit if it was this one
      setStudents(prev => prev.map(s => s.id === targetPermit?.studentId ? { ...s, activePermitId: undefined } : s));

      // Audit log
      const log: AuditLog = {
        id: `LOG-${Date.now()}`,
        permitId,
        studentName: targetPermit.studentName,
        action: 'penolakan',
        actionLabel: 'Pengajuan Izin Ditolak',
        actorName: wardenName,
        actorRole: 'Pengurus',
        timestamp,
        details: `Ditolak oleh ${wardenName}. Alasan: ${reason}`,
      };
      setAuditLogs(prev => [log, ...prev]);

      // Notification to student
      const notif: NotificationItem = {
        id: `NOTIF-${Date.now()}`,
        recipientType: 'siswa',
        recipientId: targetPermit.studentId,
        title: 'Pengajuan Izin Ditolak',
        message: `Pengajuan izin ${targetPermit.typeLabel} ditolak oleh ${wardenName}. Alasan: ${reason}`,
        type: 'error',
        timestamp,
        read: false,
        permitId,
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  // Gate Scan handler (Keluar dan Masuk)
  const processGateScan = (permitIdOrPayload: string, officerName?: string): GateScanResult => {
    const officer = officerName || (userRole === 'pengurus' ? currentPengurus.name : 'Pos Gerbang Terpadu');
    const timestamp = new Date().toISOString();

    const cleanInput = permitIdOrPayload.trim();
    const permit = permits.find(p => p.id === cleanInput || p.qrPayload === cleanInput);

    if (!permit) {
      return {
        success: false,
        message: `QR Code tidak dikenali atau data izin tidak ditemukan dalam sistem (${cleanInput}).`,
      };
    }

    if (permit.status === 'menunggu') {
      return {
        success: false,
        message: `Izin untuk ${permit.studentName} masih berstatus 'Menunggu Persetujuan' pengurus dan belum dapat digunakan.`,
      };
    }

    if (permit.status === 'ditolak') {
      return {
        success: false,
        message: `Izin untuk ${permit.studentName} telah Ditolak. Siswa tidak diizinkan meninggalkan asrama.`,
      };
    }

    if (permit.status === 'sudah_kembali') {
      return {
        success: false,
        message: `Izin ini (${permit.id}) sudah selesai digunakan. Siswa telah tercatat kembali ke asrama sebelumnya.`,
      };
    }

    // CASE 1: Student is exiting dorm (status was 'disetujui')
    if (permit.status === 'disetujui') {
      const updatedPermit: Permit = {
        ...permit,
        status: 'sedang_keluar',
        actualDepartureAt: timestamp,
        departureGateOfficer: officer,
      };

      setPermits(prev => prev.map(p => p.id === permit.id ? updatedPermit : p));

      // Update student status
      setStudents(prev => prev.map(s => s.id === permit.studentId ? {
        ...s,
        currentStatus: 'sedang_keluar',
        activePermitId: permit.id,
      } : s));

      // Audit Log
      const log: AuditLog = {
        id: `LOG-${Date.now()}`,
        permitId: permit.id,
        studentName: permit.studentName,
        action: 'scan_keluar',
        actionLabel: 'Scan QR Keluar Asrama Berhasil',
        actorName: officer,
        actorRole: 'Pengurus',
        timestamp,
        details: `Siswa resmi keluar asrama menuju ${permit.destination}. Waktu keluar tercatat otomatis: ${new Date(timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB.`,
      };
      setAuditLogs(prev => [log, ...prev]);

      // Notifications
      const notifSiswa: NotificationItem = {
        id: `NOTIF-${Date.now()}`,
        recipientType: 'siswa',
        recipientId: permit.studentId,
        title: 'Verifikasi Keluar Berhasil',
        message: `Selamat jalan! Waktu keluar Anda tercatat pada ${new Date(timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB. Harap kembali sebelum ${permit.estimatedReturnTime} WIB.`,
        type: 'info',
        timestamp,
        read: false,
        permitId: permit.id,
      };

      const notifPengurus: NotificationItem = {
        id: `NOTIF-${Date.now() + 1}`,
        recipientType: 'pengurus',
        title: 'Siswa Keluar Asrama',
        message: `${permit.studentName} (${permit.studentClass}) telah meninggalkan asrama melalui ${officer}.`,
        type: 'info',
        timestamp,
        read: false,
        permitId: permit.id,
      };

      setNotifications(prev => [notifSiswa, notifPengurus, ...prev]);

      return {
        success: true,
        action: 'keluar',
        permit: updatedPermit,
        message: `Verifikasi keluar berhasil! ${permit.studentName} diizinkan meninggalkan asrama. Waktu keluar: ${new Date(timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB.`,
      };
    }

    // CASE 2: Student is returning to dorm (status was 'sedang_keluar' or 'terlambat')
    if (permit.status === 'sedang_keluar' || permit.status === 'terlambat') {
      const now = new Date();
      const estimatedReturn = new Date(`${permit.estimatedReturnDate}T${permit.estimatedReturnTime}:00`);
      const isLate = now > estimatedReturn;
      const lateMinutes = isLate ? Math.floor((now.getTime() - estimatedReturn.getTime()) / (1000 * 60)) : 0;

      const updatedPermit: Permit = {
        ...permit,
        status: 'sudah_kembali',
        actualReturnAt: timestamp,
        returnGateOfficer: officer,
        isLate: isLate || permit.isLate,
        lateDurationMinutes: lateMinutes || permit.lateDurationMinutes || 0,
      };

      setPermits(prev => prev.map(p => p.id === permit.id ? updatedPermit : p));

      // Update student status back to 'di_asrama'
      setStudents(prev => prev.map(s => s.id === permit.studentId ? {
        ...s,
        currentStatus: 'di_asrama',
        activePermitId: undefined,
      } : s));

      // Audit Log
      const log: AuditLog = {
        id: `LOG-${Date.now()}`,
        permitId: permit.id,
        studentName: permit.studentName,
        action: 'scan_kembali',
        actionLabel: isLate ? 'Scan QR Masuk (Terlambat Kembali)' : 'Scan QR Masuk Kembali Tepat Waktu',
        actorName: officer,
        actorRole: 'Pengurus',
        timestamp,
        details: isLate 
          ? `Siswa kembali ke asrama dengan KETERLAMBATAN ${lateMinutes} menit (Batas: ${permit.estimatedReturnTime} WIB, Kembali: ${new Date(timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB).`
          : `Siswa kembali ke asrama dengan aman dan tepat waktu. Verifikasi selesai.`,
      };
      setAuditLogs(prev => [log, ...prev]);

      // Notifications
      const notifSiswa: NotificationItem = {
        id: `NOTIF-${Date.now()}`,
        recipientType: 'siswa',
        recipientId: permit.studentId,
        title: isLate ? 'Kepulangan Dicatat: Terlambat' : 'Selamat Datang Kembali di Asrama',
        message: isLate 
          ? `Waktu kembali tercatat pada ${new Date(timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB. Anda terlambat ${lateMinutes} menit. Harap menghadap pengurus pembina.`
          : `Waktu kepulangan tercatat tepat waktu (${new Date(timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB). Izin telah selesai.`,
        type: isLate ? 'warning' : 'success',
        timestamp,
        read: false,
        permitId: permit.id,
      };

      const notifPengurus: NotificationItem = {
        id: `NOTIF-${Date.now() + 1}`,
        recipientType: 'pengurus',
        title: isLate ? 'Peringatan: Siswa Kembali Terlambat' : 'Siswa Telah Kembali',
        message: isLate
          ? `${permit.studentName} kembali ke asrama terlambat ${lateMinutes} menit dari jadwal.`
          : `${permit.studentName} (${permit.studentClass}) telah tiba kembali di asrama dengan aman.`,
        type: isLate ? 'warning' : 'success',
        timestamp,
        read: false,
        permitId: permit.id,
      };

      setNotifications(prev => [notifSiswa, notifPengurus, ...prev]);

      return {
        success: true,
        action: 'kembali',
        permit: updatedPermit,
        isLate,
        message: isLate 
          ? `Siswa ${permit.studentName} tercatat KEMBALI, namun TERLAMBAT ${lateMinutes} menit.`
          : `Siswa ${permit.studentName} berhasil KEMBALI ke asrama dengan tepat waktu!`,
      };
    }

    return {
      success: false,
      message: 'Status izin tidak memungkinkan untuk diproses saat ini.',
    };
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}_permits`);
      localStorage.removeItem(`${STORAGE_KEY}_students`);
      localStorage.removeItem(`${STORAGE_KEY}_notifs`);
      localStorage.removeItem(`${STORAGE_KEY}_logs`);
    } catch {}
    setPermits(INITIAL_PERMITS);
    setStudents(INITIAL_STUDENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentStudent(INITIAL_STUDENTS[0]);
    setCurrentPengurus(INITIAL_PENGURUS[0]);
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        currentStudent,
        setCurrentStudent,
        currentPengurus,
        setCurrentPengurus,
        students,
        pengurusList,
        permits,
        notifications,
        auditLogs,
        activeTab,
        setActiveTab,
        selectedPermitForDetail,
        setSelectedPermitForDetail,
        isPermitFormOpen,
        setIsPermitFormOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        submitPermit,
        approvePermit,
        rejectPermit,
        processGateScan,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
