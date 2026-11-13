import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Search, 
  Download, 
  Printer, 
  CheckCircle2, 
  XCircle, 
  DoorOpen, 
  AlertTriangle,
  Clock
} from 'lucide-react';

export const AuditHistoryView: React.FC = () => {
  const { auditLogs, permits, setSelectedPermitForDetail } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  const filteredLogs = auditLogs.filter(log => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      log.studentName.toLowerCase().includes(query) ||
      log.permitId.toLowerCase().includes(query) ||
      log.actorName.toLowerCase().includes(query) ||
      log.details.toLowerCase().includes(query);

    const matchesAction = filterAction === 'all' || log.action === filterAction;

    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'persetujuan':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'penolakan':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'scan_keluar':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'scan_kembali':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'terlambat':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const exportCSV = () => {
    const headers = ['ID Log', 'ID Izin', 'Nama Siswa', 'Aktivitas', 'Aktor', 'Waktu', 'Detail'];
    const rows = filteredLogs.map(l => [
      `"${l.id}"`,
      `"${l.permitId}"`,
      `"${l.studentName}"`,
      `"${l.actionLabel}"`,
      `"${l.actorName} (${l.actorRole})"`,
      `"${new Date(l.timestamp).toLocaleString('id-ID')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Perizinan_AsramaLink_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 pb-20">
      
      {/* Title & Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Log Audit & Riwayat Aktivitas Perizinan</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Rekam jejak perizinan santri asrama yang transparan, terpusat, dan bebas manipulasi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Laporan</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-3 mt-5 pt-5 border-t border-slate-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama santri, petugas, ID izin, atau detail aktivitas..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'Semua Log' },
              { id: 'pengajuan', label: 'Pengajuan' },
              { id: 'persetujuan', label: 'Persetujuan' },
              { id: 'penolakan', label: 'Penolakan' },
              { id: 'scan_keluar', label: 'Scan Keluar' },
              { id: 'scan_kembali', label: 'Scan Masuk' },
              { id: 'terlambat', label: 'Keterlambatan' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterAction(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterAction === tab.id
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

      {/* Audit Log Chronological Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {filteredLogs.length} catatan aktivitas digital</span>
          <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">Pencatatan Otomatis Realtime</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Tidak ada aktivitas log yang sesuai dengan filter pencarian.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map(log => {
              const permit = permits.find(p => p.id === log.permitId);

              return (
                <div
                  key={log.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/40 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                      <FileText className="w-4 h-4 text-slate-600" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getActionBadge(log.action)}`}>
                          {log.actionLabel}
                        </span>
                        <span className="font-bold text-slate-900">
                          {log.studentName}
                        </span>
                        <span className="font-mono text-[11px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {log.permitId}
                        </span>
                      </div>

                      <p className="text-slate-700 leading-relaxed text-xs">
                        {log.details}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                        <span>Aktor: <strong className="text-slate-700 font-semibold">{log.actorName}</strong> ({log.actorRole})</span>
                        {permit && (
                          <button
                            type="button"
                            onClick={() => setSelectedPermitForDetail(permit)}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            Buka Izin Terkait &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0 text-slate-500 font-mono text-[11px] border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                    <div>{new Date(log.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    <div className="text-slate-800 font-semibold">{new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
