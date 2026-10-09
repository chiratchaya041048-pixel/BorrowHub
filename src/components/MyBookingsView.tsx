import React, { useState } from 'react';
import { BorrowRequest, BorrowStatus } from '../types';
import { useApp } from '../context/AppContext';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Calendar, 
  FileText, 
  QrCode, 
  Ban, 
  ArrowRight, 
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';

interface MyBookingsViewProps {
  onViewDigitalSlip: (request: BorrowRequest) => void;
  onBrowseCatalog: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  onViewDigitalSlip,
  onBrowseCatalog
}) => {
  const { borrowRequests, currentUser, cancelBorrowRequest } = useApp();
  const [filterStatus, setFilterStatus] = useState<BorrowStatus | 'all'>('all');
  const [cancellingRequestId, setCancellingRequestId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-purple-100 shadow-md text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center">
          <ClipboardList className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">กรุณาเข้าสู่ระบบ</h3>
        <p className="text-xs text-slate-500">
          เข้าสู่ระบบเพื่อดูประวัติการยืม-คืนอุปกรณ์ และตรวจสอบสถานะคำขอจองของคุณ
        </p>
      </div>
    );
  }

  // Filter requests for current user (Strictly own requests only)
  const myRequests = borrowRequests.filter(
    r => r.userId === currentUser.id || r.userEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const filtered = myRequests.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const handleConfirmCancel = () => {
    if (!cancellingRequestId) return;
    const res = cancelBorrowRequest(cancellingRequestId);
    setCancellingRequestId(null);
    showToast(res.message);
  };

  const getStatusBadge = (status: BorrowStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            รอเจ้าหน้าที่อนุมัติ
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
            อนุมัติแล้ว (รอรับอุปกรณ์)
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
            กำลังยืมใช้งาน
          </span>
        );
      case 'returned':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            คืนอุปกรณ์แล้ว
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            ถูกปฏิเสธคำขอ
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Ban className="w-3.5 h-3.5 text-slate-500" />
            ยกเลิกคำขอแล้ว
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9D5FF] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#F3E8FF] text-[#7E60BF]">
              <ClipboardList className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#2D1B4E]">
              รายการคำขอจองและยืมอุปกรณ์ของฉัน
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ติดตามสถานะคำขอยืมอุปกรณ์โสตทัศนูปกรณ์ และแสดงใบยืมดิจิทัลเพื่อรับของ
          </p>
        </div>

        <button
          onClick={onBrowseCatalog}
          className="px-4 py-2.5 bg-[#F8F0FC] hover:bg-[#F3E8FF] text-[#5B2C6F] rounded-xl text-xs font-semibold border border-[#E9D5FF] flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <span>ค้นหาอุปกรณ์เพิ่มเติม</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-white p-2 rounded-2xl border border-[#E9D5FF] overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3.5 py-2 rounded-xl transition-all shrink-0 ${
            filterStatus === 'all'
              ? 'bg-[#7E60BF] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-[#F8F0FC]'
          }`}
        >
          ทั้งหมด ({myRequests.length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-3.5 py-2 rounded-xl transition-all shrink-0 ${
            filterStatus === 'pending'
              ? 'bg-amber-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-amber-50'
          }`}
        >
          รออนุมัติ ({myRequests.filter(r => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilterStatus('approved')}
          className={`px-3.5 py-2 rounded-xl transition-all shrink-0 ${
            filterStatus === 'approved'
              ? 'bg-sky-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-sky-50'
          }`}
        >
          อนุมัติแล้ว ({myRequests.filter(r => r.status === 'approved').length})
        </button>
        <button
          onClick={() => setFilterStatus('active')}
          className={`px-3.5 py-2 rounded-xl transition-all shrink-0 ${
            filterStatus === 'active'
              ? 'bg-[#7E60BF] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-[#F8F0FC]'
          }`}
        >
          กำลังยืมอยู่ ({myRequests.filter(r => r.status === 'active').length})
        </button>
        <button
          onClick={() => setFilterStatus('returned')}
          className={`px-3.5 py-2 rounded-xl transition-all shrink-0 ${
            filterStatus === 'returned'
              ? 'bg-emerald-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-emerald-50'
          }`}
        >
          คืนแล้ว ({myRequests.filter(r => r.status === 'returned').length})
        </button>
        <button
          onClick={() => setFilterStatus('rejected')}
          className={`px-3.5 py-2 rounded-xl transition-all shrink-0 ${
            filterStatus === 'rejected'
              ? 'bg-rose-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-rose-50'
          }`}
        >
          ปฏิเสธ/ยกเลิก ({myRequests.filter(r => r.status === 'rejected' || r.status === 'cancelled').length})
        </button>
      </div>

      {/* Requests List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-[#E9D5FF] space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F8F0FC] text-[#7E60BF] flex items-center justify-center">
            <ClipboardList className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2D1B4E]">ไม่พบรายการคำขอในหมวดหมู่นี้</h3>
            <p className="text-xs text-slate-500 mt-1">
              คุณสามารถเริ่มส่งคำขอจองอุปกรณ์ที่ต้องการใช้งานได้ทันที
            </p>
          </div>
          <button
            onClick={onBrowseCatalog}
            className="px-5 py-2.5 bg-gradient-to-r from-[#7E60BF] to-[#6A1B9A] text-white rounded-xl text-xs font-semibold shadow-md shadow-[#C8ACD6] hover:shadow-lg transition-all"
          >
            ไปที่แคตตาล็อกอุปกรณ์
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-[#E9D5FF] hover:border-[#C8ACD6] p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Left Item Details */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <img
                  src={req.equipmentImage}
                  alt={req.equipmentName}
                  className="w-20 h-20 rounded-2xl object-cover border border-[#E9D5FF] shrink-0 shadow-2xs"
                />

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-[#F3E8FF] text-[#5B2C6F] rounded">
                      {req.requestNumber}
                    </span>
                    {getStatusBadge(req.status)}
                  </div>

                  <h3 className="font-bold text-[#2D1B4E] text-sm md:text-base leading-snug">
                    {req.equipmentName}
                  </h3>

                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-y-1 gap-x-4 pt-1">
                    <span>จำนวน: <strong className="text-[#7E60BF]">{req.quantity} ชิ้น</strong></span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#7E60BF]" />
                      <span>{req.borrowDate} ถึง <strong className="text-slate-800">{req.expectedReturnDate}</strong></span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    วัตถุประสงค์: {req.purpose}
                  </p>

                  {/* Rejection / Note alert if any */}
                  {req.rejectionReason && (
                    <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-700">
                      เหตุผลที่ปฏิเสธ: {req.rejectionReason}
                    </div>
                  )}

                  {req.returnNotes && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800">
                      ผลการตรวจรับคืน: {req.returnNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <button
                  type="button"
                  onClick={() => onViewDigitalSlip(req)}
                  className="px-3.5 py-2 bg-[#F8F0FC] hover:bg-[#F3E8FF] text-[#5B2C6F] rounded-xl text-xs font-semibold border border-[#E9D5FF] flex items-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#7E60BF]" />
                  <span>ดูใบยืม (Pass / QR)</span>
                </button>

                {req.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => setCancellingRequestId(req.id)}
                    className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold border border-rose-200 transition-colors"
                  >
                    ยกเลิกคำขอ
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-rose-100 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Ban className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">ยืนยันการยกเลิกคำขอจอง</h3>
            <p className="text-xs text-slate-600">
              คุณต้องการยกเลิกคำขอยืมอุปกรณ์นี้ใช่หรือไม่? เมื่อยกเลิกแล้วจะไม่สามารถกู้คืนได้
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellingRequestId(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
              >
                ไม่ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                ยืนยันยกเลิกคำขอ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs border border-purple-500/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  );
};
