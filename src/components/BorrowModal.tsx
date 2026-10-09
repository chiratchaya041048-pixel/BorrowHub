import React, { useState } from 'react';
import { Equipment } from '../types';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Layers, 
  ShieldAlert, 
  UserCheck 
} from 'lucide-react';

interface BorrowModalProps {
  equipment: Equipment | null;
  onClose: () => void;
  onSuccess: (requestId: string) => void;
}

export const BorrowModal: React.FC<BorrowModalProps> = ({ equipment, onClose, onSuccess }) => {
  const { currentUser, createBorrowRequest, updateProfile } = useApp();

  const todayStr = new Date().toISOString().slice(0, 10);
  const defaultReturnDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [quantity, setQuantity] = useState<number>(1);
  const [borrowDate, setBorrowDate] = useState<string>(todayStr);
  const [expectedReturnDate, setExpectedReturnDate] = useState<string>(defaultReturnDate);
  const [purpose, setPurpose] = useState<string>('');
  const [courseOrProject, setCourseOrProject] = useState<string>('');
  
  // Profile fields check
  const [phoneNumber, setPhoneNumber] = useState<string>(currentUser?.phoneNumber || '');
  const [studentId, setStudentId] = useState<string>(currentUser?.studentId || '');
  const [department, setDepartment] = useState<string>(currentUser?.department || 'ภาควิชาเทคโนโลยีการศึกษา');

  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!equipment) return null;

  const maxAvailable = equipment.availableQuantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentUser) {
      setErrorMsg('กรุณาเข้าสู่ระบบก่อนทำการจอง');
      return;
    }

    if (!phoneNumber.trim()) {
      setErrorMsg('กรุณาระบุหมายเลขโทรศัพท์ที่ติดต่อได้');
      return;
    }

    if (!studentId.trim()) {
      setErrorMsg('กรุณาระบุรหัสนักศึกษา หรือรหัสบุคลากร');
      return;
    }

    if (!purpose.trim()) {
      setErrorMsg('กรุณาระบุวัตถุประสงค์ในการยืมใช้งาน');
      return;
    }

    if (new Date(expectedReturnDate) < new Date(borrowDate)) {
      setErrorMsg('วันที่กำหนดคืนต้องไม่เกิดขึ้นก่อนวันที่เริ่มยืม');
      return;
    }

    if (quantity < 1 || quantity > maxAvailable) {
      setErrorMsg(`จำนวนต้องอยู่ระหว่าง 1 ถึง ${maxAvailable} ชิ้น`);
      return;
    }

    if (!agreedToTerms) {
      setErrorMsg('กรุณายอมรับเงื่อนไขและระเบียบการยืม-คืนอุปกรณ์');
      return;
    }

    setIsSubmitting(true);

    // Update profile if phone or student ID changed
    if (
      phoneNumber !== currentUser.phoneNumber ||
      studentId !== currentUser.studentId ||
      department !== currentUser.department
    ) {
      updateProfile({
        phoneNumber,
        studentId,
        department
      });
    }

    const res = createBorrowRequest(
      equipment.id,
      quantity,
      borrowDate,
      expectedReturnDate,
      purpose,
      courseOrProject
    );

    setIsSubmitting(false);

    if (res.success && res.request) {
      onSuccess(res.request.id);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E9D5FF] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#7E60BF] via-[#9370DB] to-[#C8ACD6] text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-100">
              แบบฟอร์มขอส่งคำขอยืมอุปกรณ์
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              ระบบยืม-คืน ภาควิชาเทคโนโลยีการศึกษา
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-purple-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Equipment Snapshot */}
        <div className="p-4 bg-[#F8F0FC] border-b border-[#E9D5FF] flex items-center gap-4">
          <img
            src={equipment.imageUrl}
            alt={equipment.name}
            className="w-16 h-16 rounded-xl object-cover border border-[#C8ACD6] shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-mono px-2 py-0.5 bg-[#E9D5FF] text-[#5B2C6F] rounded font-semibold">
              {equipment.code}
            </span>
            <h3 className="text-sm font-bold text-[#2D1B4E] line-clamp-1 mt-1">
              {equipment.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <span>สถานที่เก็บ: {equipment.location}</span>
              <span className="text-[#7E60BF] font-semibold">• คงเหลือ {equipment.availableQuantity} ชิ้น</span>
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quantity and Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                จำนวนที่ต้องการยืม *
              </label>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={maxAvailable}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(maxAvailable, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full text-center py-2 text-sm font-bold text-slate-800 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(maxAvailable, quantity + 1))}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">สูงสุด {maxAvailable} ชิ้น</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                วันที่เริ่มยืม *
              </label>
              <input
                type="date"
                value={borrowDate}
                min={todayStr}
                onChange={(e) => setBorrowDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                กำหนดส่งคืน *
              </label>
              <input
                type="date"
                value={expectedReturnDate}
                min={borrowDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-700"
                required
              />
            </div>
          </div>

          {/* Purpose & Course */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                วัตถุประสงค์ในการยืมใช้งาน *
              </label>
              <textarea
                rows={2}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="ระบุรายละเอียด เช่น ใช้ถ่ายทำวิดีโอคลิปการสอนบทเรียน, ผลิตรายการโทรทัศน์เพื่อการศึกษา..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-800 placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ชื่อรายวิชา / โครงการ / กิจกรรม (ถ้ามี)
              </label>
              <input
                type="text"
                value={courseOrProject}
                onChange={(e) => setCourseOrProject(e.target.value)}
                placeholder="เช่น ET301 การผลิตสื่อวีดิทัศน์, สัมมนาวิชาการนวัตกรรมทางการศึกษา"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Borrower Profile Verification */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 text-purple-800">
                <UserCheck className="w-4 h-4 text-purple-600" />
                ตรวจสอบข้อมูลผู้ยืม (สำหรับติดต่อรับอุปกรณ์)
              </span>
              <span className="text-[11px] text-slate-500">{currentUser?.email}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">เบอร์โทรติดต่อ *</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="08X-XXX-XXXX"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">รหัสนักศึกษา/บุคลากร *</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="เช่น 65020123"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">สาขา / สังกัด</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
            />
            <span>
              ข้าพเจ้ายินยอมปฏิบัติตามระเบียบการยืม-คืนอุปกรณ์โสตทัศนศึกษา และจะดูแลรักษาอุปกรณ์ให้อยู่ในสภาพสมบูรณ์ พร้อมรับผิดชอบความเสียหายหากเกิดขึ้น
            </span>
          </label>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#7E60BF] to-[#6A1B9A] hover:from-[#6A1B9A] hover:to-[#5B2C6F] rounded-xl shadow-md shadow-[#C8ACD6] hover:shadow-lg transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'กำลังส่งคำขอ...' : 'ยืนยันการส่งคำขอจอง'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
