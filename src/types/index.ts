export type UserRole = 'siswa' | 'pengurus';

export type PermitType = 
  | 'pulang_weekend'
  | 'keperluan_pribadi'
  | 'berobat'
  | 'lomba_akademik'
  | 'keperluan_keluarga'
  | 'organisasi';

export type PermitStatus = 
  | 'menunggu'        // Menunggu persetujuan pengurus
  | 'disetujui'       // Disetujui, siap keluar (QR Code aktif)
  | 'ditolak'         // Ditolak oleh pengurus
  | 'sedang_keluar'   // Sudah scan keluar di pos gerbang
  | 'sudah_kembali'   // Sudah scan kembali di pos gerbang (selesai)
  | 'terlambat';      // Melewati batas waktu kembali tanpa kembali tepat waktu

export interface Student {
  id: string;
  nisn: string;
  name: string;
  avatar: string;
  classRoom: string;
  dormBuilding: string;
  roomNumber: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  currentStatus: 'di_asrama' | 'sedang_keluar' | 'terlambat';
  activePermitId?: string;
}

export interface Pengurus {
  id: string;
  nip: string;
  name: string;
  title: string;
  avatar: string;
  phone: string;
  department: string;
}

export interface Permit {
  id: string; // e.g., "IZN-20261001-01"
  studentId: string;
  studentName: string;
  studentClass: string;
  studentRoom: string;
  studentDorm: string;
  studentAvatar: string;
  studentPhone: string;
  parentPhone: string;
  
  type: PermitType;
  typeLabel: string;
  destination: string;
  reason: string;
  
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // HH:mm
  estimatedReturnDate: string; // YYYY-MM-DD
  estimatedReturnTime: string; // HH:mm
  
  status: PermitStatus;
  createdAt: string; // ISO string
  
  approvedBy?: string; // Nama pengurus
  approvedAt?: string; // Timestamp otomatis
  approvalNotes?: string;
  
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  
  actualDepartureAt?: string; // Waktu scan keluar
  departureGateOfficer?: string; // Petugas gerbang / sistem
  
  actualReturnAt?: string; // Waktu scan kembali
  returnGateOfficer?: string;
  
  isLate?: boolean;
  lateDurationMinutes?: number;
  
  qrPayload: string; // Unik token/payload QR
}

export interface NotificationItem {
  id: string;
  recipientType: 'siswa' | 'pengurus' | 'all';
  recipientId?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  permitId?: string;
}

export interface AuditLog {
  id: string;
  permitId: string;
  studentName: string;
  action: 'pengajuan' | 'persetujuan' | 'penolakan' | 'scan_keluar' | 'scan_kembali' | 'terlambat';
  actionLabel: string;
  actorName: string;
  actorRole: 'Siswa' | 'Pengurus' | 'Sistem';
  timestamp: string;
  details: string;
}
