import React, { useState } from 'react';
import { BorrowRequest, ReturnCondition } from '../types';
import { useApp } from '../context/AppContext';
import { 
  X, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  FileCheck2, 
  Package 
} from 'lucide-react';

interface ReturnInspectionModalProps {
  request: BorrowRequest | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReturnInspectionModal: React.FC<ReturnInspectionModalProps> = ({
  request,
  onClose,
  onSuccess
}) => {
  const { recordReturn } = useApp();
  const [condition, setCondition] = useState<ReturnCondition>('perfect');
  const [notes, setNotes] = useState<string>('ตรวจสอบอุปกรณ์ครบถ้วน สภาพพร้อมใช้งานต่อ');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = recordReturn(request.id, condition, notes);
    setIsSubmitting(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      alert(res.message);
    }
  };

  const conditionOptions: { key: ReturnCondition; label: string; desc: string; color: string; icon: any }[] = [
    {
      key: 'perfect',
      label: 'สภาพสมบูรณ์ 100%',
      desc: 'อุปกรณ์ อุปกรณ์เสริมครบถ้วน ใช้งานได้ปกติ ไม่มีรอยตำหนิ',
      color: 'border-emerald-300 bg-emerald-50 text-emerald-800',
      icon: CheckCircle2
    },
    {
      key: 'minor_issue',
      label: 'มีรอยขีดข่วนเล็กน้อย / ใช้งานได้',
      desc: 'มีรอยจากการใช้งานทั่วไป ฟังก์ชันหลักทำงานปกติ',
      color: 'border-amber-300 bg-amber-50 text-amber-800',
      icon: AlertTriangle
    },
    {
      key: 'damaged',
      label: 'ชำรุดเสียหาย (ต้องส่งซ่อม)',
      desc: 'อุปกรณ์แตกหัก เปิดไม่ติด หรืออุปกรณ์เสริมสำคัญสูญหาย',
      color: 'border-rose-300 bg-rose-50 text-rose-800',
      icon: AlertOctagon
    },
    {
      key: 'lost',
      label: 'สูญหายทั้งหมด',
      desc: 'ผู้ยืมทำอุปกรณ์สูญหาย ต้องดำเนินการชดใช้ตามระเบียบ',
      color: 'border-purple-300 bg-purple-50 text-purple-900',
      icon: AlertOctagon
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E9D5FF] overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-emerald-100" />
            <div>
              <h2 className="text-base font-bold">บันทึกรับคืนอุปกรณ์ & ตรวจสอบสภาพ</h2>
              <p className="text-[11px] text-emerald-100">ใบคำขอเลขที่: {request.requestNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-emerald-100 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Target Info */}
          <div className="p-3.5 bg-[#F8F0FC] border border-[#E9D5FF] rounded-2xl flex items-center gap-3">
            <img
              src={request.equipmentImage}
              alt={request.equipmentName}
              className="w-14 h-14 rounded-xl object-cover border border-[#E9D5FF]"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#E9D5FF] text-[#5B2C6F] rounded">
                {request.equipmentCode}
              </span>
              <p className="font-bold text-[#2D1B4E] text-xs mt-0.5 truncate">{request.equipmentName}</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                ผู้คืน: <strong className="text-slate-700">{request.userName}</strong> ({request.studentId || request.userEmail}) • {request.quantity} ชิ้น
              </p>
            </div>
          </div>

          {/* Condition Radio Options */}
          <div>
            <label className="block font-semibold text-slate-800 mb-2">
              ผลการตรวจสอบสภาพอุปกรณ์ *
            </label>
            <div className="space-y-2">
              {conditionOptions.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = condition === opt.key;
                return (
                  <label
                    key={opt.key}
                    onClick={() => {
                      setCondition(opt.key);
                      if (opt.key === 'perfect') setNotes('ตรวจสอบอุปกรณ์ครบถ้วน สภาพพร้อมใช้งานต่อ');
                      else if (opt.key === 'minor_issue') setNotes('มีรอยขีดข่วนเล็กน้อย อุปกรณ์เสริมครบ');
                      else if (opt.key === 'damaged') setNotes('ชำรุดเสียหาย ต้องส่งช่างซ่อมบำรุงภาควิชา');
                      else if (opt.key === 'lost') setNotes('อุปกรณ์สูญหาย ติดต่อผู้ยืมชดใช้ค่าเสียหาย');
                    }}
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? `${opt.color} ring-2 ring-emerald-500 shadow-xs`
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="returnCondition"
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 font-bold">
                        <IconComponent className="w-4 h-4 shrink-0" />
                        <span>{opt.label}</span>
                      </div>
                      <p className="text-[11px] opacity-80 mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              บันทึกหมายเหตุการตรวจรับ (อุปกรณ์ครบ/ไม่ครบ)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ระบุรายละเอียดการตรวจสอบ เช่น แบตเตอรี่ครบ 2 ก้อน, ฝาครอบเลนส์ครบ..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          {/* Footer */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              {isSubmitting ? 'กำลังบันทึก...' : 'ยืนยันการรับคืนอุปกรณ์'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
