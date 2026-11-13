import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, Permit, PermitStatus } from '../../types';
import { 
  Search, 
  MapPin, 
  Clock, 
  ChevronRight,
  Users,
  CheckCircle2,
  AlertTriangle,
  DoorOpen,
  Home
} from 'lucide-react';

export const MonitoringView: React.FC = () => {
  const { students, permits, setSelectedPermitForDetail } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const monitoringData = students.map(student => {
    const studentPermits = permits.filter(p => p.studentId === student.id);
    const activePermit = studentPermits.find(p => ['disetujui', 'sedang_keluar', 'terlambat'].includes(p.status)) 
      || studentPermits[0];

    let displayStatus: 'di_asrama' | 'sedang_keluar' | 'sudah_kembali' | 'terlambat' | 'menunggu' = 'di_asrama';
    if (activePermit) {
      if (activePermit.status === 'sedang_keluar') displayStatus = 'sedang_keluar';
      else if (activePermit.status === 'terlambat') displayStatus = 'terlambat';
      else if (activePermit.status === 'sudah_kembali') displayStatus = 'sudah_kembali';
      else if (activePermit.status === 'menunggu') displayStatus = 'menunggu';
    }

    return {
      student,
      permit: activePermit,
      displayStatus,
    };
  });

  const filteredData = monitoringData.filter(item => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      item.student.name.toLowerCase().includes(query) ||
      item.student.classRoom.toLowerCase().includes(query) ||
      item.student.roomNumber.toLowerCase().includes(query) ||
      item.student.dormBuilding.toLowerCase().includes(query) ||
      (item.permit?.destination.toLowerCase().includes(query) ?? false);

    let matchesFilter = true;
    if (filterStatus === 'di_asrama') {
      matchesFilter = item.displayStatus === 'di_asrama' || item.displayStatus === 'sudah_kembali';
    } else if (filterStatus === 'sedang_keluar') {
      matchesFilter = item.displayStatus === 'sedang_keluar';
    } else if (filterStatus === 'sudah_kembali') {
      matchesFilter = item.displayStatus === 'sudah_kembali';
    } else if (filterStatus === 'terlambat') {
      matchesFilter = item.displayStatus === 'terlambat';
    }

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sedang_keluar':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Sedang Keluar</span>
          </span>
        );
      case 'terlambat':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Terlambat</span>
          </span>
        );
      case 'sudah_kembali':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sudah Kembali</span>
          </span>
        );
      case 'menunggu':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span>Di Asrama</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 pb-20">
      
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Monitoring Keberadaan Siswa Realtime</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau status kepulangan, lokasi tujuan, dan batas waktu kembali seluruh santri asrama secara terpusat.
          </p>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama santri, kelas, kamar, atau tujuan..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'Semua Siswa' },
              { id: 'di_asrama', label: 'Di Asrama' },
              { id: 'sedang_keluar', label: 'Sedang Keluar' },
              { id: 'sudah_kembali', label: 'Sudah Kembali' },
              { id: 'terlambat', label: 'Terlambat Kembali' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterStatus === tab.id
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

      {/* Desktop Table View / Mobile Cards View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table View (Desktop) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Santri</th>
                <th className="py-3 px-4">Kelas & Kamar</th>
                <th className="py-3 px-4">Tujuan Izin</th>
                <th className="py-3 px-4">Waktu Keluar</th>
                <th className="py-3 px-4">Batas Kembali</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Tidak ada siswa yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredData.map(({ student, permit, displayStatus }) => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{student.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">NISN: {student.nisn}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{student.classRoom}</p>
                      <p className="text-[11px] text-slate-500">{student.dormBuilding} ({student.roomNumber})</p>
                    </td>

                    <td className="py-3.5 px-4">
                      {permit ? (
                        <div>
                          <p className="font-medium text-slate-800 truncate max-w-[200px]">
                            {permit.destination}
                          </p>
                          <p className="text-[11px] text-blue-600 font-medium">{permit.typeLabel}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Tidak ada izin aktif</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {permit?.actualDepartureAt ? (
                        <div>
                          <span className="font-semibold text-slate-800">
                            {new Date(permit.actualDepartureAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                          </span>
                          <p className="text-[10px] text-slate-400">{permit.departureDate}</p>
                        </div>
                      ) : permit ? (
                        <span className="text-slate-500">Jadwal: {permit.departureTime}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {permit ? (
                        <div>
                          <span className={`font-semibold ${displayStatus === 'terlambat' ? 'text-rose-600' : 'text-slate-800'}`}>
                            {permit.estimatedReturnTime} WIB
                          </span>
                          <p className="text-[10px] text-slate-400">{permit.estimatedReturnDate}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(displayStatus)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {permit ? (
                        <button
                          type="button"
                          onClick={() => setSelectedPermitForDetail(permit)}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <span>Detail</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="lg:hidden p-4 space-y-3">
          {filteredData.length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-400">
              Tidak ada siswa yang sesuai filter.
            </p>
          ) : (
            filteredData.map(({ student, permit, displayStatus }) => (
              <div 
                key={student.id}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{student.name}</h4>
                      <p className="text-xs text-slate-500">
                        {student.classRoom} · {student.dormBuilding} ({student.roomNumber})
                      </p>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(displayStatus)}
                  </div>
                </div>

                {permit && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                    <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{permit.destination}</span>
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                      <span>Keluar: {permit.departureTime} WIB</span>
                      <span className="font-semibold text-blue-700">Batas: {permit.estimatedReturnTime} WIB</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">Wali: {student.parentPhone}</span>
                  {permit && (
                    <button
                      type="button"
                      onClick={() => setSelectedPermitForDetail(permit)}
                      className="text-blue-600 font-semibold flex items-center gap-1"
                    >
                      <span>Lihat Detail</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
