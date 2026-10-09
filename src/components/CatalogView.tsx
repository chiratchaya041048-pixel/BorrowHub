import React, { useState, useMemo } from 'react';
import { Equipment, EquipmentCategoryKey } from '../types';
import { CATEGORIES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Camera, 
  Mic, 
  SunMedium, 
  Maximize2, 
  Projector, 
  Tablet, 
  Layers, 
  Info,
  CalendarCheck,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface CatalogViewProps {
  onSelectEquipmentForDetail: (equipment: Equipment) => void;
  onSelectEquipmentForBorrow: (equipment: Equipment) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  onSelectEquipmentForDetail,
  onSelectEquipmentForBorrow
}) => {
  const { equipmentList, currentUser } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategoryKey | 'all'>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'borrowed'>('all');

  // Category Icon Resolver
  const getCategoryIcon = (key: string) => {
    switch (key) {
      case 'camera': return <Camera className="w-3.5 h-3.5" />;
      case 'audio': return <Mic className="w-3.5 h-3.5" />;
      case 'lighting': return <SunMedium className="w-3.5 h-3.5" />;
      case 'tripod': return <Maximize2 className="w-3.5 h-3.5" />;
      case 'projector': return <Projector className="w-3.5 h-3.5" />;
      case 'display': return <Tablet className="w-3.5 h-3.5" />;
      default: return <Layers className="w-3.5 h-3.5" />;
    }
  };

  const filteredEquipment = useMemo(() => {
    return equipmentList.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Availability filter
      if (availabilityFilter === 'available' && (item.availableQuantity <= 0 || item.status !== 'available')) {
        return false;
      }
      if (availabilityFilter === 'borrowed' && item.availableQuantity > 0) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesCode = item.code.toLowerCase().includes(query);
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesLoc = item.location.toLowerCase().includes(query);
        if (!matchesCode && !matchesName && !matchesDesc && !matchesLoc) {
          return false;
        }
      }

      return true;
    });
  }, [equipmentList, selectedCategory, availabilityFilter, searchQuery]);

  // Overall statistics for banner
  const totalItems = equipmentList.reduce((acc, curr) => acc + curr.totalQuantity, 0);
  const totalAvailable = equipmentList.reduce((acc, curr) => acc + curr.availableQuantity, 0);
  const totalBorrowed = totalItems - totalAvailable;

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Hero Welcome Banner (Pastel purple theme) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#7E60BF] via-[#9370DB] to-[#C8ACD6] text-white shadow-xl p-6 sm:p-8 md:p-10">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#6A1B9A]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/25 backdrop-blur-md text-white text-xs font-medium mb-4 border border-white/30 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-100" />
            <span>ศูนย์บริการเครื่องมือและโสตทัศนูปกรณ์เพื่อการศึกษา</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-xs">
            ยืม-คืนอุปกรณ์ผลิตสื่อและการเรียนรู้
          </h2>
          <p className="mt-3 text-sm sm:text-base text-purple-50 leading-relaxed max-w-2xl font-light">
            บริการยืมกล้องดิจิทัล ไมโครโฟนไร้สาย ไฟสตูดิโอ ขาตั้งกล้อง และเครื่องฉายโปรเจกเตอร์ 
            สำหรับนิสิต นักศึกษา และคณาจารย์ภาควิชาเทคโนโลยีการศึกษา
          </p>

          {/* Quick stats in banner */}
          <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/25 shadow-xs">
              <span className="text-purple-100 text-[11px] block">อุปกรณ์ทั้งหมดในระบบ</span>
              <strong className="text-xl sm:text-2xl font-bold mt-0.5 block text-white">{totalItems} ชิ้น</strong>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/25 shadow-xs">
              <span className="text-emerald-200 text-[11px] block">พร้อมให้ยืมทันที</span>
              <strong className="text-xl sm:text-2xl font-bold text-white mt-0.5 block">{totalAvailable} ชิ้น</strong>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/25 shadow-xs">
              <span className="text-amber-100 text-[11px] block">กำลังถูกยืมใช้งาน</span>
              <strong className="text-xl sm:text-2xl font-bold text-white mt-0.5 block">{totalBorrowed} ชิ้น</strong>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/25 shadow-xs">
              <span className="text-purple-100 text-[11px] block">เวลาทำการศูนย์โสตฯ</span>
              <strong className="text-sm font-semibold text-white mt-1.5 block">จันทร์ - ศุกร์ 08:30 - 16:30 น.</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-[#E9D5FF] space-y-4">
        
        {/* Search Input & Status Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#7E60BF] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาตามชื่ออุปกรณ์ รหัส (เช่น CAM-001) หรือห้องจัดเก็บ..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF5FF] border border-[#E9D5FF] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E60BF] focus:border-[#7E60BF] outline-none transition-all placeholder:text-slate-400 text-[#2D1B4E]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600"
              >
                ล้างคำค้น
              </button>
            )}
          </div>

          {/* Availability Pills */}
          <div className="flex items-center gap-1.5 bg-[#F8F0FC] p-1 rounded-xl self-start sm:self-auto shrink-0 text-xs font-medium border border-[#E9D5FF]/60">
            <button
              onClick={() => setAvailabilityFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                availabilityFilter === 'all'
                  ? 'bg-[#7E60BF] text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-[#2D1B4E]'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setAvailabilityFilter('available')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                availabilityFilter === 'available'
                  ? 'bg-emerald-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              ว่างพร้อมยืม ({totalAvailable})
            </button>
            <button
              onClick={() => setAvailabilityFilter('borrowed')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                availabilityFilter === 'borrowed'
                  ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              กำลังถูกยืม
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-[#7E60BF] text-white shadow-xs'
                : 'bg-[#F3E8FF] text-[#5B2C6F] hover:bg-[#E9D5FF] border border-[#E9D5FF]'
            }`}
          >
            <span>ทุกหมวดหมู่ ({equipmentList.length})</span>
          </button>

          {CATEGORIES.map((cat) => {
            const count = equipmentList.filter(e => e.category === cat.key).length;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#7E60BF] text-white shadow-xs'
                    : 'bg-[#F3E8FF] text-[#5B2C6F] hover:bg-[#E9D5FF] border border-[#E9D5FF]'
                }`}
              >
                {getCategoryIcon(cat.key)}
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#E9D5FF] text-[#5B2C6F]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Equipment Grid */}
      {filteredEquipment.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-purple-200 space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">ไม่พบรายการอุปกรณ์ที่ค้นหา</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            ลองปรับเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นเพื่อดูรายการอุปกรณ์ทั้งหมดของภาควิชา
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setAvailabilityFilter('all');
            }}
            className="px-4 py-2 bg-purple-100 text-purple-800 rounded-xl text-xs font-semibold hover:bg-purple-200 transition-colors"
          >
            รีเซ็ตตัวกรองทั้งหมด
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredEquipment.map((equipment) => {
            const isAvailable = equipment.status === 'available' && equipment.availableQuantity > 0;
            const isLowStock = isAvailable && equipment.availableQuantity <= 1;

            return (
              <div
                key={equipment.id}
                className="group bg-white rounded-2xl border border-[#E9D5FF] hover:border-[#C8ACD6] shadow-xs hover:shadow-xl hover:shadow-[#D8B4F8]/20 transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Thumbnail Image Container */}
                <div className="relative h-44 sm:h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={equipment.imageUrl}
                    alt={equipment.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Category & Code Tag */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#4A154B]/85 backdrop-blur-xs text-white">
                      {equipment.code}
                    </span>
                  </div>

                  {/* Availability Badge */}
                  <div className="absolute top-3 right-3">
                    {equipment.status === 'maintenance' ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs">
                        ซ่อมบำรุง
                      </span>
                    ) : equipment.availableQuantity > 0 ? (
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs ${
                        isLowStock 
                          ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                          : 'bg-emerald-600 text-white'
                      }`}>
                        ว่าง {equipment.availableQuantity}/{equipment.totalQuantity} ชิ้น
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        ยืมหมดแล้ว
                      </span>
                    )}
                  </div>

                  {/* Storage Location Tag */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-xs rounded-lg text-white text-[10px]">
                    <MapPin className="w-3 h-3 text-[#D8B4F8] shrink-0" />
                    <span className="truncate">{equipment.location}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 
                      onClick={() => onSelectEquipmentForDetail(equipment)}
                      className="font-bold text-[#2D1B4E] text-sm hover:text-[#7E60BF] transition-colors line-clamp-2 cursor-pointer leading-snug"
                    >
                      {equipment.name}
                    </h3>
                    
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {equipment.description}
                    </p>
                  </div>

                  {/* Included items summary */}
                  {equipment.accessories && equipment.accessories.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[11px] text-slate-400 truncate">
                        📦 พร้อม: {equipment.accessories.slice(0, 2).join(', ')}
                        {equipment.accessories.length > 2 && ` +${equipment.accessories.length - 2}`}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectEquipmentForDetail(equipment)}
                      className="px-3 py-2 text-xs font-medium text-slate-700 hover:text-[#7E60BF] hover:bg-[#F3E8FF] rounded-xl transition-colors border border-[#E9D5FF]"
                    >
                      ดูสเปก
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => onSelectEquipmentForBorrow(equipment)}
                      disabled={!isAvailable}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                        isAvailable
                          ? 'bg-gradient-to-r from-[#7E60BF] to-[#6A1B9A] text-white hover:from-[#6A1B9A] hover:to-[#5B2C6F] shadow-[#C8ACD6]'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>{isAvailable ? 'ขอยืมอุปกรณ์' : 'ไม่ว่างให้ยืม'}</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
