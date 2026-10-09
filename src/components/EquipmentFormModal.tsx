import React, { useState, useRef } from 'react';
import { Equipment, EquipmentCategoryKey, EquipmentStatus } from '../types';
import { CATEGORIES } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Check, 
  Package, 
  Sparkles 
} from 'lucide-react';

interface EquipmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentToEdit?: Equipment | null;
}

const SAMPLE_IMAGE_PRESETS: { label: string; url: string }[] = [
  {
    label: 'กล้อง Sony Mirrorless',
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'กล้อง Canon EOS R',
    url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'ไมค์ DJI Mic 2',
    url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'เครื่องอัดเสียง Zoom',
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'ไฟสตูดิโอ LED Aputure',
    url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'ไฟแท่ง Nanlite Pavotube RGB',
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'ขาตั้งกล้อง Manfrotto',
    url: 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'โปรเจกเตอร์เลเซอร์',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'จอวาดภาพ Wacom Tablet',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
  }
];

export const EquipmentFormModal: React.FC<EquipmentFormModalProps> = ({
  isOpen,
  onClose,
  equipmentToEdit
}) => {
  const { addEquipment, updateEquipment } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [code, setCode] = useState(equipmentToEdit?.code || '');
  const [name, setName] = useState(equipmentToEdit?.name || '');
  const [category, setCategory] = useState<EquipmentCategoryKey>(equipmentToEdit?.category || 'camera');
  const [totalQuantity, setTotalQuantity] = useState<number>(equipmentToEdit?.totalQuantity || 1);
  const [availableQuantity, setAvailableQuantity] = useState<number>(equipmentToEdit?.availableQuantity || 1);
  const [status, setStatus] = useState<EquipmentStatus>(equipmentToEdit?.status || 'available');
  const [imageUrl, setImageUrl] = useState<string>(
    equipmentToEdit?.imageUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
  );
  const [description, setDescription] = useState(equipmentToEdit?.description || '');
  const [location, setLocation] = useState(equipmentToEdit?.location || 'ห้องปฏิบัติการโสตทัศนูปกรณ์ 402');
  const [accessoryInput, setAccessoryInput] = useState('');
  const [accessories, setAccessories] = useState<string[]>(equipmentToEdit?.accessories || []);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAccessory = () => {
    if (accessoryInput.trim()) {
      setAccessories([...accessories, accessoryInput.trim()]);
      setAccessoryInput('');
    }
  };

  const handleRemoveAccessory = (index: number) => {
    setAccessories(accessories.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      alert('กรุณากรอกรหัสและชื่ออุปกรณ์');
      return;
    }

    if (equipmentToEdit) {
      updateEquipment(equipmentToEdit.id, {
        code,
        name,
        category,
        totalQuantity,
        availableQuantity: Math.min(totalQuantity, availableQuantity),
        status,
        imageUrl,
        description,
        location,
        accessories
      });
    } else {
      addEquipment({
        code,
        name,
        category,
        totalQuantity,
        availableQuantity,
        status,
        imageUrl,
        description,
        location,
        accessories
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E9D5FF] overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#7E60BF] via-[#9370DB] to-[#C8ACD6] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-100" />
            <h2 className="text-base font-bold">
              {equipmentToEdit ? 'แก้ไขข้อมูลอุปกรณ์' : 'เพิ่มอุปกรณ์ใหม่เข้าสู่ระบบ'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-purple-100 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Image Upload / Preview */}
          <div className="p-4 bg-[#F8F0FC] rounded-2xl border border-[#E9D5FF] space-y-3">
            <label className="block font-semibold text-[#2D1B4E]">
              รูปภาพอุปกรณ์ (Cloud Storage / อัปโหลดไฟล์ หรือ เลือกรูปตัวอย่าง)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-28 h-28 rounded-2xl bg-slate-100 border border-[#C8ACD6] overflow-hidden relative group shrink-0">
                <img
                  src={imageUrl}
                  alt="Equipment Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Upload className="w-4 h-4 mb-1" />
                  <span className="text-[10px]">เปลี่ยนรูป</span>
                </button>
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="ระบุ URL รูปภาพ เช่น https://..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-700"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold rounded-xl flex items-center gap-1.5 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    อัปโหลดไฟล์
                  </button>
                </div>

                {/* Preset selector */}
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">เลือกรูปภาพอุปกรณ์มาตรฐาน:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setImageUrl(preset.url)}
                        className="px-2 py-1 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-lg text-[10px] text-slate-700 transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code, Name, Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">รหัสอุปกรณ์ *</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="เช่น EDTECH-CAM-005"
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">ชื่ออุปกรณ์ *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น Sony Alpha A7 IV พร้อมเลนส์"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-semibold text-slate-800"
                required
              />
            </div>
          </div>

          {/* Category, Status, Quantities */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">หมวดหมู่ *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EquipmentCategoryKey)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white text-slate-800"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">สถานะอุปกรณ์ *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EquipmentStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white text-slate-800"
              >
                <option value="available">พร้อมใช้งาน</option>
                <option value="maintenance">กำลังซ่อมบำรุง</option>
                <option value="retired">ปลดระวาง</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">จำนวนทั้งหมด *</label>
              <input
                type="number"
                min="1"
                value={totalQuantity}
                onChange={(e) => {
                  const val = Math.max(1, parseInt(e.target.value) || 1);
                  setTotalQuantity(val);
                  if (availableQuantity > val) setAvailableQuantity(val);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-center font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">จำนวนคงเหลือ *</label>
              <input
                type="number"
                min="0"
                max={totalQuantity}
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(Math.min(totalQuantity, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-center font-bold text-purple-700"
                required
              />
            </div>
          </div>

          {/* Location & Description */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">ตำแหน่งจัดเก็บ (ห้อง/ตู้) *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="เช่น ห้องปฏิบัติการผลิตสื่อ 402 (ตู้กล้อง A1)"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">รายละเอียดและสเปกการใช้งาน</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุคุณสมบัติ ฟังก์ชันการทำงาน หรือเงื่อนไขเฉพาะของอุปกรณ์"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Included Accessories */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              อุปกรณ์เสริมในชุด (สาย, แบตเตอรี่, การ์ด, เคส)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={accessoryInput}
                onChange={(e) => setAccessoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAccessory();
                  }
                }}
                placeholder="พิมพ์ชื่ออุปกรณ์เสริม เช่น แบตเตอรี่ 2 ก้อน แล้วกดปุ่มเพิ่ม"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddAccessory}
                className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold rounded-xl flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                เพิ่ม
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {accessories.map((acc, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-[11px]"
                >
                  {acc}
                  <button
                    type="button"
                    onClick={() => handleRemoveAccessory(index)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-white font-semibold bg-gradient-to-r from-[#7E60BF] to-[#6A1B9A] hover:from-[#6A1B9A] hover:to-[#5B2C6F] rounded-xl shadow-md shadow-[#C8ACD6] transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {equipmentToEdit ? 'บันทึกการแก้ไข' : 'เพิ่มอุปกรณ์ใหม่'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
