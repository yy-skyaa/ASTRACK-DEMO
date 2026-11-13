import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PermitType } from '../../types';
import { 
  X, 
  Send, 
  Calendar, 
  Clock, 
  MapPin, 
  Home,
  ShoppingBag,
  Stethoscope,
  Trophy,
  Users,
  Briefcase,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const PERMIT_OPTIONS: { type: PermitType; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
  { 
    type: 'pulang_weekend', 
    label: 'Pulang Weekend', 
    desc: 'Kepulangan ke rumah orang tua/wali akhir pekan',
    icon: Home 
  },
  { 
    type: 'keperluan_pribadi', 
    label: 'Keperluan Pribadi & Belanja', 
    desc: 'Membeli perlengkapan mandi, seragam, laundry, buku',
    icon: ShoppingBag 
  },
  { 
    type: 'berobat', 
    label: 'Pemeriksaan Medis / Berobat', 
    desc: 'Klinik, dokter gigi, rumah sakit rujukan, apotek obat',
    icon: Stethoscope 
  },
  { 
    type: 'lomba_akademik', 
    label: 'Lomba & Prestasi Akademik', 
    desc: 'Olimpiade sains, kompetisi antar sekolah, seminar',
    icon: Trophy 
  },
  { 
    type: 'keperluan_keluarga', 
    label: 'Keperluan Keluarga', 
    desc: 'Tasyakuran, pernikahan keluarga inti, urusan penting',
    icon: Users 
  },
  { 
    type: 'organisasi', 
    label: 'Kegiatan Organisasi / Ekskul', 
    desc: 'Tugas OSIS, kepramukaan, delegasi sekolah',
    icon: Briefcase 
  },
];

export const PermitFormModal: React.FC = () => {
  const { isPermitFormOpen, setIsPermitFormOpen, submitPermit, setSelectedPermitForDetail, setActiveTab } = useApp();

  const todayStr = new Date().toISOString().slice(0, 10);

  const [type, setType] = useState<PermitType>('keperluan_pribadi');
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [departureDate, setDepartureDate] = useState(todayStr);
  const [departureTime, setDepartureTime] = useState('14:00');
  const [estimatedReturnDate, setEstimatedReturnDate] = useState(todayStr);
  const [estimatedReturnTime, setEstimatedReturnTime] = useState('17:30');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = () => {
    setIsPermitFormOpen(false);
    setErrorMsg('');
    setIsSuccess(false);
    setActiveTab('dashboard');
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPermitFormOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPermitFormOpen]);

  if (!isPermitFormOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!destination.trim()) {
      setErrorMsg('Tujuan perjalanan wajib diisi.');
      return;
    }

    if (!reason.trim()) {
      setErrorMsg('Alasan pengajuan izin wajib diisi.');
      return;
    }

    const start = new Date(`${departureDate}T${departureTime}:00`);
    const end = new Date(`${estimatedReturnDate}T${estimatedReturnTime}:00`);

    if (end <= start) {
      setErrorMsg('Waktu perkiraan kembali harus lebih besar dari waktu keberangkatan.');
      return;
    }

    const selectedOpt = PERMIT_OPTIONS.find(p => p.type === type);
    const newPermit = submitPermit({
      type,
      typeLabel: selectedOpt ? selectedOpt.label : 'Izin Keluar Asrama',
      destination,
      reason,
      departureDate,
      departureTime,
      estimatedReturnDate,
      estimatedReturnTime,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsPermitFormOpen(false);
      setSelectedPermitForDetail(newPermit);
      setActiveTab('dashboard');
    }, 1000);
  };

  return (
    <div 
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto animate-in fade-in cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-xl relative my-auto cursor-default"
      >
        
        {/* Header Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Formulir Pengajuan Izin Keluar
            </h2>
            <p className="text-xs text-slate-500">
              Sistem Perizinan Digital AsramaLink
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Pengajuan Izin Berhasil Dikirim
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Permohonan izin Anda telah masuk ke sistem antrean pengurus asrama untuk diverifikasi secara digital.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. Pilih Kategori Izin */}
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-2">
                1. Kategori Izin Keluar
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PERMIT_OPTIONS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = type === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setType(item.type)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600/30 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold leading-tight truncate">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Tujuan Perjalanan */}
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                2. Lokasi / Tempat Tujuan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Contoh: Apotek Kimia Farma & Toko Buku Gramedia"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 text-slate-800"
                />
              </div>
            </div>

            {/* 3. Alasan */}
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                3. Alasan Lengkap Keperluan
              </label>
              <textarea
                rows={2}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tuliskan keperluan keluar asrama secara jelas..."
                className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 text-slate-800"
              />
            </div>

            {/* 4. Jadwal Rencana */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-3">
              <h4 className="text-xs font-semibold text-slate-900">
                4. Rencana Jadwal Waktu
              </h4>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">
                    Tanggal Keluar:
                  </label>
                  <input
                    type="date"
                    required
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">
                    Jam Keluar:
                  </label>
                  <input
                    type="time"
                    required
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">
                    Tanggal Kembali:
                  </label>
                  <input
                    type="date"
                    required
                    value={estimatedReturnDate}
                    onChange={(e) => setEstimatedReturnDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">
                    Batas Jam Kembali:
                  </label>
                  <input
                    type="time"
                    required
                    value={estimatedReturnTime}
                    onChange={(e) => setEstimatedReturnTime(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Keterlambatan kembali dari jam yang ditentukan akan tercatat otomatis pada riwayat kedisiplinan.</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="py-2.5 px-4 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Pengajuan Izin</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
