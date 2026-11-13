import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PermitStatus, Permit } from '../../types';
import { 
  Search, 
  MapPin, 
  ChevronRight,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  DoorOpen
} from 'lucide-react';

export const StudentHistory: React.FC = () => {
  const { currentStudent, permits, setSelectedPermitForDetail } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const myPermits = permits.filter(p => p.studentId === currentStudent.id);

  const filteredPermits = myPermits.filter(permit => {
    const matchesSearch = 
      permit.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permit.typeLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permit.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || permit.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PermitStatus) => {
    switch (status) {
      case 'disetujui':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Disetujui</span>
          </span>
        );
      case 'sedang_keluar':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Sedang Keluar</span>
          </span>
        );
      case 'sudah_kembali':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sudah Kembali</span>
          </span>
        );
      case 'terlambat':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Terlambat</span>
          </span>
        );
      case 'ditolak':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span>Ditolak</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 pb-20">
      {/* Title & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Riwayat Seluruh Izin Siswa
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar digital seluruh perizinan yang pernah diajukan oleh {currentStudent.name}
          </p>
        </div>

        {/* Search & Segmented Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan tujuan, kategori izin, nomor ID..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'Semua Izin' },
              { id: 'disetujui', label: 'Disetujui' },
              { id: 'sedang_keluar', label: 'Sedang Keluar' },
              { id: 'sudah_kembali', label: 'Sudah Kembali' },
              { id: 'terlambat', label: 'Terlambat' },
              { id: 'menunggu', label: 'Menunggu' },
              { id: 'ditolak', label: 'Ditolak' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List of permits */}
      <div className="space-y-3">
        {filteredPermits.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Tidak Ada Izin Ditemukan</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Coba sesuaikan kata kunci pencarian atau filter status yang dipilih.
            </p>
          </div>
        ) : (
          filteredPermits.map(permit => (
            <div
              key={permit.id}
              onClick={() => setSelectedPermitForDetail(permit)}
              className="bg-white rounded-xl border border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/20 p-5 shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-600">
                      {permit.id}
                    </span>
                    {getStatusBadge(permit.status)}
                    <span className="text-[11px] text-slate-400">
                      Diajukan: {new Date(permit.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 mt-1">
                    {permit.typeLabel}
                  </h3>

                  <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-sm">{permit.destination}</span>
                  </p>

                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                    Alasan: {permit.reason}
                  </p>

                  {permit.approvedBy && (
                    <div className="flex items-center gap-1.5 text-[11px] text-blue-700 font-medium mt-1.5">
                      <span>Diverifikasi oleh: {permit.approvedBy}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 text-xs">
                <div className="sm:text-right">
                  <p className="font-semibold text-slate-800">
                    {permit.departureDate} ({permit.departureTime})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Kembali: {permit.estimatedReturnTime} WIB
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 text-blue-600 font-semibold sm:mt-2 group-hover:translate-x-0.5 transition-transform">
                  <span>Detail & QR</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
