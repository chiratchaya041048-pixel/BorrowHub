import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CatalogView } from './components/CatalogView';
import { MyBookingsView } from './components/MyBookingsView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { GuidelinesView } from './components/GuidelinesView';
import { EquipmentDetailModal } from './components/EquipmentDetailModal';
import { BorrowModal } from './components/BorrowModal';
import { DigitalSlipModal } from './components/DigitalSlipModal';
import { EquipmentFormModal } from './components/EquipmentFormModal';
import { ReturnInspectionModal } from './components/ReturnInspectionModal';
import { LoginModal, ProfileModal } from './components/AuthModals';
import { AdminManagementModal } from './components/AdminManagementModal';
import { ComputerLogo } from './components/ComputerLogo';
import { Equipment, BorrowRequest } from './types';
import { 
  CheckCircle2, 
  Package, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, isAdmin, borrowRequests } = useApp();

  const [currentTab, setCurrentTab] = useState<'catalog' | 'my-bookings' | 'admin-dashboard' | 'guidelines'>('catalog');

  // Modals state
  const [detailEquipment, setDetailEquipment] = useState<Equipment | null>(null);
  const [borrowEquipment, setBorrowEquipment] = useState<Equipment | null>(null);
  const [digitalSlipRequest, setDigitalSlipRequest] = useState<BorrowRequest | null>(null);
  const [returnInspectRequest, setReturnInspectRequest] = useState<BorrowRequest | null>(null);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAdminManageOpen, setIsAdminManageOpen] = useState(false);
  const [isEquipmentFormOpen, setIsEquipmentFormOpen] = useState(false);
  const [equipmentToEdit, setEquipmentToEdit] = useState<Equipment | null>(null);

  // Success Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleBorrowSuccess = (requestId: string) => {
    setBorrowEquipment(null);
    const req = borrowRequests.find(r => r.id === requestId);
    if (req) {
      setDigitalSlipRequest(req);
    }
    showToast('ส่งคำขอยืมอุปกรณ์เรียบร้อยแล้ว กรุณาตรวจสอบสถานะในหน้ารายการจอง');
  };

  return (
    <div className="min-h-screen bg-[#FAF5FF] flex flex-col font-['Kanit'] text-[#2D1B4E] antialiased selection:bg-[#D8B4F8] selection:text-[#4A154B]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-[#4A154B] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs border border-[#C8ACD6]/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAdminManage={() => setIsAdminManageOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'catalog' && (
          <CatalogView
            onSelectEquipmentForDetail={(item) => setDetailEquipment(item)}
            onSelectEquipmentForBorrow={(item) => {
              if (!currentUser) {
                setIsLoginModalOpen(true);
              } else {
                setBorrowEquipment(item);
              }
            }}
          />
        )}

        {currentTab === 'my-bookings' && (
          <MyBookingsView
            onViewDigitalSlip={(req) => setDigitalSlipRequest(req)}
            onBrowseCatalog={() => setCurrentTab('catalog')}
          />
        )}

        {currentTab === 'admin-dashboard' && (
          <AdminDashboardView
            onOpenAddEquipment={() => {
              setEquipmentToEdit(null);
              setIsEquipmentFormOpen(true);
            }}
            onOpenEditEquipment={(item) => {
              setEquipmentToEdit(item);
              setIsEquipmentFormOpen(true);
            }}
            onOpenReturnModal={(req) => setReturnInspectRequest(req)}
            onViewDigitalSlip={(req) => setDigitalSlipRequest(req)}
            onOpenAdminManage={() => setIsAdminManageOpen(true)}
          />
        )}

        {currentTab === 'guidelines' && (
          <GuidelinesView />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-purple-100 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F8F0FC] border border-[#E9D5FF] flex items-center justify-center p-1 shadow-xs">
              <ComputerLogo className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">
                ภาควิชาเทคโนโลยีการศึกษา คณะศึกษาศาสตร์
              </p>
              <p className="text-[11px] text-slate-400">
                Educational Technology Equipment Borrowing System • มหาวิทยาลัยศรีนครินทรวิโรฒ / สถานศึกษา
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <button 
              onClick={() => setCurrentTab('guidelines')}
              className="hover:text-purple-700 transition-colors"
            >
              ระเบียบการยืม-คืน
            </button>
            <span>•</span>
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="hover:text-purple-700 transition-colors"
            >
              สลับบัญชีผู้ใช้งาน
            </button>
            {isAdmin && (
              <>
                <span>•</span>
                <button 
                  onClick={() => setIsAdminManageOpen(true)}
                  className="hover:text-purple-700 font-semibold text-purple-800 transition-colors"
                >
                  จัดการ Admin
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EquipmentDetailModal
        equipment={detailEquipment}
        onClose={() => setDetailEquipment(null)}
        onBorrow={(item) => {
          if (!currentUser) {
            setIsLoginModalOpen(true);
          } else {
            setBorrowEquipment(item);
          }
        }}
      />

      <BorrowModal
        equipment={borrowEquipment}
        onClose={() => setBorrowEquipment(null)}
        onSuccess={handleBorrowSuccess}
      />

      <DigitalSlipModal
        request={digitalSlipRequest}
        onClose={() => setDigitalSlipRequest(null)}
      />

      <EquipmentFormModal
        isOpen={isEquipmentFormOpen}
        onClose={() => {
          setIsEquipmentFormOpen(false);
          setEquipmentToEdit(null);
        }}
        equipmentToEdit={equipmentToEdit}
      />

      <ReturnInspectionModal
        request={returnInspectRequest}
        onClose={() => setReturnInspectRequest(null)}
        onSuccess={() => {
          showToast('บันทึกการรับคืนอุปกรณ์และตรวจสภาพเรียบร้อยแล้ว');
        }}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <AdminManagementModal
        isOpen={isAdminManageOpen}
        onClose={() => setIsAdminManageOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
