import React from 'react';
import { Equipment } from '../types';
import { 
  X, 
  MapPin, 
  Package, 
  CheckCircle, 
  AlertTriangle, 
  Layers, 
  Tag, 
  Calendar,
  Share2,
  Check
} from 'lucide-react';

interface EquipmentDetailModalProps {
  equipment: Equipment | null;
  onClose: () => void;
  onBorrow: (equipment: Equipment) => void;
}

export const EquipmentDetailModal: React.FC<EquipmentDetailModalProps> = ({ 
  equipment, 
  onClose, 
  onBorrow 
}) => {
  if (!equipment) return null;

  const isAvailable = equipment.status === 'available' && equipment.availableQuantity > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-600 shadow-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 md:h-72 w-full bg-slate-950 overflow-hidden">
          <img
            src={equipment.imageUrl}
            alt={equipment.name}
            className="w-full h-full object-cover opacity-95 hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
          
          <div className="absolute bottom-4 left-6 right-6">
            <span className="inline-block px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#7E60BF] text-white shadow-xs">
              {equipment.code}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-1.5 drop-shadow-sm">
              {equipment.name}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Quick Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#F8F0FC] border border-[#E9D5FF]">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                equipment.status === 'available' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : equipment.status === 'maintenance'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {equipment.status === 'available' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {equipment.status === 'available' ? 'สภาพพร้อมใช้งาน' : equipment.status === 'maintenance' ? 'อยู่ระหว่างซ่อมบำรุง' : 'ปลดระวาง'}
              </span>

              <span className="text-xs text-slate-600">
                คงเหลือ: <strong className="text-[#7E60BF] text-sm font-bold">{equipment.availableQuantity}</strong> / {equipment.totalQuantity} ชิ้น
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-[#7E60BF] shrink-0" />
              <span>{equipment.location}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D1B4E] mb-2">
              รายละเอียดและการนำไปใช้งาน
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {equipment.description}
            </p>
          </div>

          {/* Accessories Included */}
          {equipment.accessories && equipment.accessories.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D1B4E] mb-3 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#7E60BF]" />
                อุปกรณ์เสริมที่บรรจุในชุด (ต้องส่งคืนครบทุกชิ้น)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {equipment.accessories.map((acc, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700"
                  >
                    <Check className="w-3.5 h-3.5 text-[#7E60BF] shrink-0" />
                    <span>{acc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules Reminder */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              คำแนะนำการใช้งานอุปกรณ์โสตทัศนศึกษา
            </p>
            <p className="text-amber-800">
              กรุณาตรวจนับอุปกรณ์และทดสอบเปิดเครื่องร่วมกับเจ้าหน้าที่ขณะรับมอบอุปกรณ์ หากพบปัญหาให้แจ้งทันที
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              ปิด
            </button>
            <button
              onClick={() => {
                onClose();
                onBorrow(equipment);
              }}
              disabled={!isAvailable}
              className={`px-6 py-2.5 text-xs font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 ${
                isAvailable 
                  ? 'bg-gradient-to-r from-[#7E60BF] to-[#6A1B9A] text-white hover:from-[#6A1B9A] hover:to-[#5B2C6F] shadow-[#C8ACD6] hover:shadow-lg' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Package className="w-4 h-4" />
              {isAvailable ? 'ส่งคำขอยืมอุปกรณ์ชิ้นนี้' : 'อุปกรณ์ไม่ว่างในขณะนี้'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
