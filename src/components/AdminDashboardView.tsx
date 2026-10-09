import React, { useState } from 'react';
import { Equipment, BorrowRequest, BorrowStatus } from '../types';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Plus, 
  Edit3, 
  Trash2, 
  UserCheck, 
  Calendar, 
  Search, 
  Filter, 
  UserPlus, 
  FileCheck2, 
  XCircle, 
  ShieldCheck, 
  ArrowUpRight,
  TrendingUp,
  Tag,
  Check,
  ShieldAlert,
  X,
  AlertTriangle
} from 'lucide-react';

interface AdminDashboardViewProps {
  onOpenAddEquipment: () => void;
  onOpenEditEquipment: (item: Equipment) => void;
  onOpenReturnModal: (request: BorrowRequest) => void;
  onViewDigitalSlip: (request: BorrowRequest) => void;
  onOpenAdminManage: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onOpenAddEquipment,
  onOpenEditEquipment,
  onOpenReturnModal,
  onViewDigitalSlip,
  onOpenAdminManage
}) => {
  const { 
    equipmentList, 
    borrowRequests, 
    approveBorrowRequest, 
    rejectBorrowRequest, 
    deleteEquipment,
    adminEmails,
    currentUser,
    isAdmin,
    switchRole
  } = useApp();

  const [activeTab, setActiveTab] = useState<'requests' | 'inventory' | 'history'>('requests');
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'approved' | 'active' | 'returned' | 'rejected'>('pending');
  const [inventorySearch, setInventorySearch] = useState('');

  // Modals state for Approval, Rejection, and Deletion
  const [approvingRequest, setApprovingRequest] = useState<BorrowRequest | null>(null);
  const [approvalActionType, setApprovalActionType] = useState<'approved' | 'active'>('approved');
  const [rejectingRequest, setRejectingRequest] = useState<BorrowRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState<string | null>(null);
  const [deletingEquipment, setDeletingEquipment] = useState<Equipment | null>(null);

  // In-app Toast message
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Stats Calculations
  const totalEquipments = equipmentList.reduce((acc, eq) => acc + eq.totalQuantity, 0);
  const totalAvailable = equipmentList.reduce((acc, eq) => acc + eq.availableQuantity, 0);
  const totalBorrowed = totalEquipments - totalAvailable;
  const pendingRequests = borrowRequests.filter(r => r.status === 'pending');
  const approvedRequests = borrowRequests.filter(r => r.status === 'approved');
  const activeLoans = borrowRequests.filter(r => r.status === 'active');
  const returnedHistory = borrowRequests.filter(r => r.status === 'returned');
  const rejectedRequests = borrowRequests.filter(r => r.status === 'rejected' || r.status === 'cancelled');

  // Role Guard Check
  if (!isAdmin) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-[#E9D5FF] text-center max-w-lg mx-auto my-12 space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#F8F0FC] text-[#7E60BF] flex items-center justify-center mx-auto border border-[#E9D5FF]">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-[#2D1B4E]">ไม่มีสิทธิ์เข้าถึงมุมมองผู้ดูแลระบบ (Admin View)</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          บัญชีปัจจุบันของคุณคือ <strong>{currentUser?.displayName || 'ผู้ใช้ทั่วไป'}</strong> ({currentUser?.email || 'ยังไม่ได้เข้าสู่ระบบ'})
          ซึ่งไม่มีสิทธิ์ Admin ในการดูหรืออนุมัติคำขอยืมของระบบ
        </p>
        <button
          onClick={() => switchRole('admin')}
          className="px-5 py-2.5 bg-gradient-to-r from-[#7E60BF] to-[#6A1B9A] text-white text-xs font-semibold rounded-xl shadow-md shadow-[#C8ACD6] hover:shadow-lg transition-all"
        >
          สลับเป็นบัญชีผู้ดูแลระบบ (Admin)
        </button>
      </div>
    );
  }

  const handleOpenApprove = (req: BorrowRequest, defaultType: 'approved' | 'active' = 'approved') => {
    setApprovingRequest(req);
    setApprovalActionType(defaultType);
  };

  const handleConfirmApprove = () => {
    if (!approvingRequest) return;
    const res = approveBorrowRequest(approvingRequest.id, approvalActionType);
    setApprovingRequest(null);
    showToast(res.message, res.success ? 'success' : 'error');
  };

  const handleOpenReject = (req: BorrowRequest) => {
    setRejectingRequest(req);
    setRejectionReason('');
    setRejectionError(null);
  };

  const handleConfirmReject = () => {
    if (!rejectingRequest) return;
    if (!rejectionReason.trim()) {
      setRejectionError('กรุณาระบุเหตุผลการปฏิเสธคำขอยืมอุปกรณ์');
      return;
    }
    const res = rejectBorrowRequest(rejectingRequest.id, rejectionReason.trim());
    setRejectingRequest(null);
    setRejectionReason('');
    setRejectionError(null);
    showToast(res.message, res.success ? 'success' : 'error');
  };

  const handleConfirmDelete = () => {
    if (!deletingEquipment) return;
    const ok = deleteEquipment(deletingEquipment.id);
    const msg = ok 
      ? `ลบอุปกรณ์ "${deletingEquipment.name}" ออกจากระบบเรียบร้อยแล้ว`
      : 'ไม่สามารถลบอุปกรณ์นี้ได้ เนื่องจากมีรายการที่กำลังถูกยืมหรือรออนุมัติอยู่';
    setDeletingEquipment(null);
    showToast(msg, ok ? 'success' : 'error');
  };

  // Filter requests
  const filteredRequests = borrowRequests.filter(r => {
    if (requestFilter === 'pending') return r.status === 'pending';
    if (requestFilter === 'approved') return r.status === 'approved';
    if (requestFilter === 'active') return r.status === 'active';
    if (requestFilter === 'returned') return r.status === 'returned';
    if (requestFilter === 'rejected') return r.status === 'rejected' || r.status === 'cancelled';
    return true; // 'all' shows all requests in the system
  });

  const filteredInventory = equipmentList.filter(eq => {
    if (!inventorySearch.trim()) return true;
    const q = inventorySearch.toLowerCase();
    return eq.name.toLowerCase().includes(q) || eq.code.toLowerCase().includes(q) || eq.location.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & KPI Stat Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9D5FF] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#F3E8FF] text-[#7E60BF]">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D1B4E]">
                Dashboard ภาพรวมผู้ดูแลระบบ (Admin)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              จัดการอุปกรณ์, ตรวจสอบและอนุมัติการยืม-คืน, บันทึกสภาพอุปกรณ์ และรายงานสถิติ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdminManage}
              className="px-3.5 py-2 text-xs font-semibold text-[#5B2C6F] bg-[#F8F0FC] hover:bg-[#F3E8FF] border border-[#E9D5FF] rounded-xl transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4 text-[#7E60BF]" />
              <span>จัดการสิทธิ์ Admin ({adminEmails.length})</span>
            </button>

            <button
              onClick={onOpenAddEquipment}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#7E60BF] to-[#6A1B9A] hover:from-[#6A1B9A] hover:to-[#5B2C6F] rounded-xl shadow-md shadow-[#C8ACD6] transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มอุปกรณ์ใหม่</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total equipment */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F8F0FC] to-[#F3E8FF]/60 border border-[#E9D5FF]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5B2C6F]">อุปกรณ์ทั้งหมด</span>
              <Package className="w-4 h-4 text-[#7E60BF]" />
            </div>
            <p className="text-2xl font-bold text-[#2D1B4E] mt-2">{totalEquipments} <span className="text-xs font-normal text-slate-500">ชิ้น</span></p>
            <p className="text-[11px] text-[#7E60BF] mt-1">{equipmentList.length} รายการโมเดล</p>
          </div>

          {/* 2. Currently Borrowed */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F3E8FF] to-[#FAF5FF] border border-[#E9D5FF]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5B2C6F]">กำลังถูกยืมใช้งาน</span>
              <TrendingUp className="w-4 h-4 text-[#7E60BF]" />
            </div>
            <p className="text-2xl font-bold text-[#6A1B9A] mt-2">{totalBorrowed} <span className="text-xs font-normal text-slate-500">ชิ้น</span></p>
            <p className="text-[11px] text-slate-500 mt-1">{activeLoans.length} รายการที่กำลังยืม</p>
          </div>

          {/* 3. Pending Approval (Alert) */}
          <div className={`p-4 rounded-2xl border transition-all ${
            pendingRequests.length > 0 
              ? 'bg-rose-50/70 border-rose-200' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-900">รออนุมัติการยืม</span>
              <Clock className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-2xl font-bold text-rose-700 mt-2">
              {pendingRequests.length} <span className="text-xs font-normal text-slate-500">คำขอ</span>
            </p>
            <p className="text-[11px] text-rose-600 mt-1">
              {pendingRequests.length > 0 ? '⚠️ ต้องดำเนินการตรวจสอบ' : 'ไม่มีคำขอค้าง'}
            </p>
          </div>

          {/* 4. Total Returned */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-900">บันทึกคืนสำเร็จ</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-700 mt-2">{returnedHistory.length} <span className="text-xs font-normal text-slate-500">ครั้ง</span></p>
            <p className="text-[11px] text-emerald-700 mt-1">ประวัติการคืนสมบูรณ์</p>
          </div>
        </div>
      </div>

      {/* Main Admin Tab Navigator */}
      <div className="flex items-center gap-2 border-b border-[#E9D5FF] pb-2">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'bg-[#7E60BF] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#7E60BF] hover:bg-[#F8F0FC]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>คำขอยืม-คืนที่ต้องจัดการ</span>
          {pendingRequests.length > 0 && (
            <span className="px-2 py-0.5 text-[10px] bg-rose-500 text-white rounded-full font-bold">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-[#7E60BF] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#7E60BF] hover:bg-[#F8F0FC]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>คลังอุปกรณ์และสต็อก ({equipmentList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-[#7E60BF] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#7E60BF] hover:bg-[#F8F0FC]'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>ประวัติและรายงานการคืน ({returnedHistory.length})</span>
        </button>
      </div>

      {/* TAB 1: REQUESTS MANAGEMENT */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 bg-white p-2 rounded-2xl border border-purple-100 text-xs overflow-x-auto">
            <span className="text-slate-500 pl-2 shrink-0">กรองสถานะ:</span>
            <button
              onClick={() => setRequestFilter('pending')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                requestFilter === 'pending' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-amber-50'
              }`}
            >
              รออนุมัติ ({pendingRequests.length})
            </button>
            <button
              onClick={() => setRequestFilter('approved')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                requestFilter === 'approved' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-sky-50'
              }`}
            >
              อนุมัติแล้ว ({approvedRequests.length})
            </button>
            <button
              onClick={() => setRequestFilter('active')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                requestFilter === 'active' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              กำลังยืมอยู่ ({activeLoans.length})
            </button>
            <button
              onClick={() => setRequestFilter('returned')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                requestFilter === 'returned' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-emerald-50'
              }`}
            >
              คืนแล้ว ({returnedHistory.length})
            </button>
            <button
              onClick={() => setRequestFilter('rejected')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                requestFilter === 'rejected' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-rose-50'
              }`}
            >
              ปฏิเสธ ({rejectedRequests.length})
            </button>
            <button
              onClick={() => setRequestFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                requestFilter === 'all' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ทั้งหมดในระบบ ({borrowRequests.length})
            </button>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-purple-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-800">ไม่มีรายการคำขอในสถานะนี้</h3>
              <p className="text-xs text-slate-500 mt-1">คำขอในระบบได้รับการดำเนินการครบถ้วน</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs hover:border-purple-300 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                >
                  {/* Left: Device & Borrower Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <img
                      src={req.equipmentImage}
                      alt={req.equipmentName}
                      className="w-16 h-16 rounded-xl object-cover border border-purple-100 shrink-0"
                    />

                    <div className="min-w-0 flex-1 space-y-1 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded">
                          {req.requestNumber}
                        </span>
                        {req.status === 'pending' && (
                          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-full border border-amber-200">
                            ⏳ รออนุมัติ
                          </span>
                        )}
                        {req.status === 'approved' && (
                          <span className="px-2.5 py-0.5 bg-sky-100 text-sky-800 font-bold rounded-full border border-sky-200">
                            ✓ อนุมัติแล้ว (รอรับของ)
                          </span>
                        )}
                        {req.status === 'active' && (
                          <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 font-bold rounded-full border border-purple-200">
                            📦 กำลังยืมใช้งาน
                          </span>
                        )}
                        {req.status === 'returned' && (
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full border border-emerald-200">
                            ✓ คืนแล้ว
                          </span>
                        )}
                        {req.status === 'rejected' && (
                          <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 font-bold rounded-full border border-rose-200">
                            ✕ ปฏิเสธคำขอ
                          </span>
                        )}
                        {req.status === 'cancelled' && (
                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-full border border-slate-200">
                            ✕ ยกเลิกโดยผู้ใช้
                          </span>
                        )}
                        <span className="font-mono text-purple-700 font-semibold">{req.equipmentCode}</span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm">{req.equipmentName}</h3>

                      <div className="text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span>ผู้ยืม: <strong className="text-slate-800">{req.userName}</strong> (รหัส: {req.studentId || '-'})</span>
                        <span>โทร: <strong className="text-purple-700">{req.userPhone}</strong></span>
                        <span>จำนวน: <strong>{req.quantity} ชิ้น</strong></span>
                      </div>

                      <p className="text-slate-500">
                        ช่วงเวลายืม: <strong>{req.borrowDate}</strong> ถึง <strong className="text-rose-600">{req.expectedReturnDate}</strong>
                      </p>

                      <p className="text-slate-500 italic">
                        วัตถุประสงค์: {req.purpose} {req.courseOrProject ? `(${req.courseOrProject})` : ''}
                      </p>

                      {req.rejectionReason && (
                        <p className="text-rose-600 font-medium">
                          เหตุผลที่ปฏิเสธ: {req.rejectionReason}
                        </p>
                      )}
                      {req.approvedBy && (
                        <p className="text-slate-400 text-[11px]">
                          ผู้อนุมัติ: {req.approvedBy}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions for Admin */}
                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0">
                    <button
                      onClick={() => onViewDigitalSlip(req)}
                      className="px-3 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors"
                    >
                      ดูใบยืม
                    </button>

                    {/* Pending Actions */}
                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleOpenReject(req)}
                          className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
                        >
                          ปฏิเสธ (Reject)
                        </button>

                        <button
                          onClick={() => handleOpenApprove(req, 'approved')}
                          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>อนุมัติ (Approve)</span>
                        </button>
                      </>
                    )}

                    {/* Approved Actions */}
                    {req.status === 'approved' && (
                      <>
                        <button
                          onClick={() => handleOpenReject(req)}
                          className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
                        >
                          ยกเลิก/ปฏิเสธ
                        </button>

                        <button
                          onClick={() => handleOpenApprove(req, 'active')}
                          className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Package className="w-4 h-4" />
                          <span>ส่งมอบอุปกรณ์ (เริ่มยืมใช้งาน)</span>
                        </button>
                      </>
                    )}

                    {/* Active Loan Actions */}
                    {req.status === 'active' && (
                      <button
                        onClick={() => onOpenReturnModal(req)}
                        className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>บันทึกการคืน & ตรวจสภาพ</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal: Confirm Approval */}
          {approvingRequest && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
              <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-purple-100 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                      <Check className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">ยืนยันการอนุมัติคำขอยืมอุปกรณ์</h3>
                      <p className="text-[11px] text-slate-500 font-mono">{approvingRequest.requestNumber}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setApprovingRequest(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8F0FC] border border-[#E9D5FF] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">อุปกรณ์:</span>
                    <strong className="text-slate-800">{approvingRequest.equipmentName}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">รหัสอุปกรณ์:</span>
                    <span className="font-mono font-bold text-purple-700">{approvingRequest.equipmentCode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">ผู้ยืม:</span>
                    <strong className="text-slate-800">{approvingRequest.userName} ({approvingRequest.userPhone})</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">จำนวนที่ขอยืม:</span>
                    <strong className="text-purple-700">{approvingRequest.quantity} ชิ้น</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">กำหนดคืน:</span>
                    <strong className="text-rose-600">{approvingRequest.expectedReturnDate}</strong>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="font-semibold text-slate-700 block">เลือกรูปแบบการอนุมัติ:</label>
                  <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-purple-50/50">
                    <input
                      type="radio"
                      name="approvalType"
                      checked={approvalActionType === 'approved'}
                      onChange={() => setApprovalActionType('approved')}
                      className="mt-0.5 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <strong className="text-slate-800 block">อนุมัติคำขอ (Approved)</strong>
                      <span className="text-slate-500 text-[11px]">อนุมัติรายการและตัดสต็อกคงเหลือ รอผู้ยืมมารับอุปกรณ์จริง</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-purple-50/50">
                    <input
                      type="radio"
                      name="approvalType"
                      checked={approvalActionType === 'active'}
                      onChange={() => setApprovalActionType('active')}
                      className="mt-0.5 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <strong className="text-slate-800 block">อนุมัติและส่งมอบทันที (Active)</strong>
                      <span className="text-slate-500 text-[11px]">ผู้ยืมอยู่หน้าโต๊ะบริการและรับอุปกรณ์ไปใช้งานทันที</span>
                    </div>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setApprovingRequest(null)}
                    className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleConfirmApprove}
                    className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>ยืนยันอนุมัติคำขอนี้</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal: Rejection Prompt */}
          {rejectingRequest && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-purple-100 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-rose-100 text-rose-600">
                      <AlertTriangle className="w-5 h-5" />
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">ปฏิเสธคำขอยืมอุปกรณ์</h3>
                  </div>
                  <button 
                    onClick={() => setRejectingRequest(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600">
                  คำขอ: <strong>{rejectingRequest.requestNumber}</strong> ({rejectingRequest.equipmentName}) - ผู้ยืม: {rejectingRequest.userName}
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">ระบุเหตุผลในการปฏิเสธคำขอ:</label>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => {
                      setRejectionReason(e.target.value);
                      if (rejectionError) setRejectionError(null);
                    }}
                    placeholder="เช่น อุปกรณ์ติดคิวใช้งานในวิชาภาคบังคับ, เอกสารไม่ครบถ้วน, เกินโควตาการยืม..."
                    className={`w-full p-3 text-xs border rounded-xl outline-none focus:ring-2 ${
                      rejectionError ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20' : 'border-slate-300 focus:ring-purple-500'
                    }`}
                  />
                  {rejectionError && (
                    <p className="text-rose-600 text-[11px] font-medium">{rejectionError}</p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setRejectingRequest(null);
                      setRejectionReason('');
                      setRejectionError(null);
                    }}
                    className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleConfirmReject}
                    className="px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
                  >
                    ยืนยันการปฏิเสธ
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal: Delete Equipment Confirmation */}
          {deletingEquipment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-rose-100 space-y-4 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Trash2 className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">ยืนยันการลบอุปกรณ์</h3>
                <p className="text-xs text-slate-600">
                  คุณแน่ใจหรือไม่ว่าต้องการลบอุปกรณ์ <strong>"{deletingEquipment.name}"</strong> ({deletingEquipment.code}) ออกจากระบบ?
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => setDeletingEquipment(null)}
                    className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
                  >
                    ยืนยันการลบ
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Toast Notification */}
          {toast && (
            <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs border ${
                toast.type === 'success' 
                  ? 'bg-slate-900 text-white border-emerald-500/50' 
                  : 'bg-rose-900 text-white border-rose-500/50'
              }`}>
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{toast.message}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVENTORY & CRUD */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="ค้นหารหัส หรือชื่ออุปกรณ์..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <button
              onClick={onOpenAddEquipment}
              className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl flex items-center gap-1.5 shadow-xs w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มอุปกรณ์ใหม่</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-purple-50/60 border-b border-purple-100 text-slate-700 font-semibold">
                  <tr>
                    <th className="p-3.5">รูป & รหัส</th>
                    <th className="p-3.5">ชื่ออุปกรณ์</th>
                    <th className="p-3.5">หมวดหมู่</th>
                    <th className="p-3.5 text-center">คงเหลือ / ทั้งหมด</th>
                    <th className="p-3.5">สถานะ</th>
                    <th className="p-3.5">ตำแหน่งจัดเก็บ</th>
                    <th className="p-3.5 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.map((eq) => (
                    <tr key={eq.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={eq.imageUrl}
                            alt={eq.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          />
                          <span className="font-mono font-bold text-purple-900">{eq.code}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-slate-800 max-w-[200px] truncate">
                        {eq.name}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-medium">
                          {eq.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="font-bold text-purple-700">{eq.availableQuantity}</span> / {eq.totalQuantity}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          eq.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {eq.status === 'available' ? 'พร้อมใช้งาน' : 'ซ่อมบำรุง'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500 max-w-[150px] truncate">
                        {eq.location}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenEditEquipment(eq)}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="แก้ไขข้อมูล"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingEquipment(eq)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="ลบอุปกรณ์"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RETURN HISTORY & AUDIT LOG */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">ประวัติการคืนอุปกรณ์และการตรวจสอบสภาพ</h3>
            <span className="text-slate-500">บันทึกทั้งหมด {returnedHistory.length} รายการ</span>
          </div>

          {returnedHistory.length === 0 ? (
            <p className="text-center py-8 text-slate-400">ยังไม่มีประวัติการส่งคืนอุปกรณ์</p>
          ) : (
            <div className="space-y-3">
              {returnedHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.equipmentImage}
                      alt={item.equipmentName}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800">{item.requestNumber}</span>
                        <span className="font-bold text-purple-800">{item.equipmentName}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">
                        ผู้ยืม: <strong>{item.userName}</strong> • คืนเมื่อวันที่: <strong>{item.actualReturnDate || item.expectedReturnDate}</strong>
                      </p>
                      <p className="text-slate-500 italic mt-0.5">
                        สภาพ: <span className="font-bold text-slate-700">{
                          item.returnCondition === 'perfect' ? 'สภาพสมบูรณ์ 100%' :
                          item.returnCondition === 'minor_issue' ? 'มีรอยขีดข่วนเล็กน้อย' :
                          item.returnCondition === 'damaged' ? 'ชำรุดเสียหาย' : 'สูญหาย'
                        }</span> • บันทึก: {item.returnNotes || '-'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewDigitalSlip(item)}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 text-xs font-medium self-end md:self-auto"
                  >
                    ดูใบยืม-คืน
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
