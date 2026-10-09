import React from 'react';
import { BorrowRequest } from '../types';
import { ComputerLogo } from './ComputerLogo';
import { 
  X, 
  Printer, 
  Calendar, 
  User, 
  Tag, 
  ShieldCheck, 
  Clock, 
  Phone, 
  Building2, 
  QrCode,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface DigitalSlipModalProps {
  request: BorrowRequest | null;
  onClose: () => void;
}

export const DigitalSlipModal: React.FC<DigitalSlipModalProps> = ({ request, onClose }) => {
  if (!request) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusDisplay = () => {
    switch (request.status) {
      case 'active':
        return { text: 'กำลังยืมใช้งาน (อนุมัติแล้ว)', color: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'pending':
        return { text: 'รอเจ้าหน้าที่อนุมัติ', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'returned':
        return { text: 'คืนอุปกรณ์เรียบร้อยแล้ว', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'rejected':
        return { text: 'คำขอถูกปฏิเสธ', color: 'bg-rose-100 text-rose-800 border-rose-300' };
      case 'cancelled':
        return { text: 'ยกเลิกคำขอแล้ว', color: 'bg-slate-100 text-slate-700 border-slate-300' };
      default:
        return { text: request.status, color: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E9D5FF] overflow-hidden my-8">
        
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF5FF] border-b border-[#E9D5FF]">
          <div className="flex items-center space-x-2 text-[#2D1B4E] font-semibold">
            <ShieldCheck className="w-5 h-5 text-[#7E60BF]" />
            <span>ใบยืม-คืนอุปกรณ์โสตทัศนูปกรณ์อิเล็กทรอนิกส์</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5B2C6F] bg-[#F8F0FC] hover:bg-[#F3E8FF] rounded-lg transition-colors border border-[#E9D5FF]"
            >
              <Printer className="w-3.5 h-3.5" />
              พิมพ์ / บันทึก PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voucher Body (Printable layout) */}
        <div className="p-6 md:p-8 space-y-6 print:p-0">
          {/* Header */}
          <div className="text-center pb-6 border-b border-dashed border-[#E9D5FF]">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F8F0FC] mb-3 p-1 border border-[#E9D5FF] shadow-xs">
              <ComputerLogo className="w-full h-full object-contain" />
            </div>
            <h2 className="text-xl font-bold text-[#2D1B4E]">ภาควิชาเทคโนโลยีการศึกษา</h2>
            <p className="text-sm text-[#7E60BF] font-medium mt-0.5">Educational Technology Equipment Borrowing Slip</p>
            <div className="mt-3 inline-block px-3 py-1 rounded-full text-xs font-mono tracking-wider bg-[#F8F0FC] text-[#5B2C6F] border border-[#E9D5FF]">
              เลขที่คำขอ: {request.requestNumber}
            </div>
          </div>

          {/* Status Badge & QR simulation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#F8F0FC] border border-[#E9D5FF]">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white p-1 rounded-lg border border-[#E9D5FF] flex items-center justify-center shadow-xs">
                {/* Simulated QR Code */}
                <div className="text-[#7E60BF] flex flex-col items-center justify-center">
                  <QrCode className="w-12 h-12" />
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">สถานะรายการยืม</p>
                <span className={`inline-block mt-1 px-2.5 py-1 text-xs font-semibold rounded-lg border ${statusInfo.color}`}>
                  {statusInfo.text}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">สแกนตรวจสอบยืนยันรับ-ส่งมอบอุปกรณ์</p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500 self-stretch sm:self-center flex sm:flex-col justify-between">
              <span>วันที่ทำรายการ:</span>
              <span className="font-medium text-slate-700">{new Date(request.createdAt).toLocaleString('th-TH')}</span>
            </div>
          </div>

          {/* Equipment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-800 mb-3 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> รายละเอียดอุปกรณ์ที่ยืม
              </h3>
              <div className="flex gap-3">
                <img 
                  src={request.equipmentImage} 
                  alt={request.equipmentName} 
                  className="w-16 h-16 object-cover rounded-lg border border-slate-200" 
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2">{request.equipmentName}</p>
                  <p className="text-xs font-mono text-purple-700 mt-1">รหัส: {request.equipmentCode}</p>
                  <p className="text-xs text-slate-600 mt-0.5">จำนวนที่ยืม: <span className="font-bold text-slate-800">{request.quantity}</span> รายการ</p>
                </div>
              </div>
            </div>

            {/* Borrower Info */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-800 mb-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> ข้อมูลผู้ยืม
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">ชื่อ-นามสกุล:</span>
                  <span className="font-medium text-slate-800">{request.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">รหัสนักศึกษา/บุคลากร:</span>
                  <span className="font-mono font-medium text-slate-800">{request.studentId || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">เบอร์โทรศัพท์:</span>
                  <span className="font-medium text-slate-800">{request.userPhone || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">สังกัด/ภาควิชา:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[160px]">{request.department || 'ภาควิชาเทคโนโลยีการศึกษา'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time & Purpose */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-slate-700">
                <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
                <span>วันที่เริ่มยืม: <strong className="text-slate-900">{request.borrowDate}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-rose-600 shrink-0" />
                <span>กำหนดส่งคืนภายใน: <strong className="text-rose-700">{request.expectedReturnDate}</strong></span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 block">วัตถุประสงค์การยืม:</span>
              <p className="text-slate-800 font-medium mt-0.5">{request.purpose}</p>
            </div>

            {request.courseOrProject && (
              <div>
                <span className="text-slate-500 block">รายวิชา / โครงการ:</span>
                <p className="text-slate-800 font-medium mt-0.5">{request.courseOrProject}</p>
              </div>
            )}
          </div>

          {/* Approver / Return details if available */}
          {(request.approvedBy || request.returnCondition) && (
            <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 text-xs text-slate-600 space-y-1">
              {request.approvedBy && (
                <p>✓ อนุมัติโดย: <span className="font-medium text-slate-800">{request.approvedBy}</span></p>
              )}
              {request.actualReturnDate && (
                <p>✓ คืนอุปกรณ์เมื่อ: <span className="font-medium text-slate-800">{request.actualReturnDate}</span> (สภาพ: {
                  request.returnCondition === 'perfect' ? 'สมบูรณ์ปกติ' :
                  request.returnCondition === 'minor_issue' ? 'ชำรุดเล็กน้อย' :
                  request.returnCondition === 'damaged' ? 'ชำรุดเสียหาย' : 'สูญหาย'
                })</p>
              )}
              {request.returnNotes && (
                <p className="text-slate-500 italic">บันทึกตรวจรับ: {request.returnNotes}</p>
              )}
            </div>
          )}

          {/* Department Terms Notice */}
          <div className="text-[11px] text-slate-500 space-y-1 border-t border-slate-200 pt-4">
            <p className="font-semibold text-slate-700">เงื่อนไขและข้อตกลงการยืมอุปกรณ์:</p>
            <p>1. ผู้ยืมต้องนำบัตรนักศึกษา/บัตรประจำตัวประชาชนมาแสดงขณะรับอุปกรณ์ ณ ศูนย์โสตทัศนศึกษา</p>
            <p>2. ผู้ยืมมีหน้าที่ดูแลรักษาอุปกรณ์ให้อยู่ในสภาพสมบูรณ์ หากเกิดการชำรุดหรือสูญหายต้องรับผิดชอบตามระเบียบภาควิชาฯ</p>
            <p>3. ส่งคืนอุปกรณ์ตามวันและเวลาที่กำหนด หากเกินกำหนดจะมีผลต่อสิทธิ์การยืมในครั้งถัดไป</p>
          </div>

          {/* Signatures placeholder for printed version */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs text-slate-600">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400"></div>
              <p className="mt-2 font-medium">ลงชื่อผู้ยืม ({request.userName})</p>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400"></div>
              <p className="mt-2 font-medium">ลงชื่อเจ้าหน้าที่ผู้ส่งมอบ/รับคืน</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors shadow-xs"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
