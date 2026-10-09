import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ComputerLogo } from './ComputerLogo';
import { 
  Package, 
  ClipboardList, 
  LayoutDashboard, 
  User, 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  Menu, 
  X, 
  BookOpen, 
  Sparkles,
  Users,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'catalog' | 'my-bookings' | 'admin-dashboard' | 'guidelines';
  setCurrentTab: (tab: 'catalog' | 'my-bookings' | 'admin-dashboard' | 'guidelines') => void;
  onOpenLogin: () => void;
  onOpenProfile: () => void;
  onOpenAdminManage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenLogin,
  onOpenProfile,
  onOpenAdminManage
}) => {
  const { currentUser, isAdmin, logout, borrowRequests, switchRole } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Calculate user's active/pending requests
  const myPendingOrActiveCount = borrowRequests.filter(
    r => r.userId === currentUser?.id && (r.status === 'pending' || r.status === 'active')
  ).length;

  // Calculate admin pending count
  const pendingRequestsCount = borrowRequests.filter(r => r.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E9D5FF] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Title */}
          <div 
            onClick={() => setCurrentTab('catalog')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#F8F0FC] border border-[#E9D5FF] flex items-center justify-center p-1.5 shadow-md shadow-[#D8B4F8]/40 group-hover:scale-105 transition-transform">
              <ComputerLogo className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F3E8FF] text-[#5B2C6F] border border-[#E9D5FF]">
                  EDTECH BORROWING
                </span>
                <span className="text-[10px] text-slate-400 font-mono">v2.5</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-[#2D1B4E] group-hover:text-[#7E60BF] transition-colors leading-tight">
                ระบบยืม-คืนอุปกรณ์ ภาควิชาเทคโนโลยีการศึกษา
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setCurrentTab('catalog')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                currentTab === 'catalog'
                  ? 'bg-[#7E60BF] text-white shadow-xs shadow-[#C8ACD6]'
                  : 'text-[#4A154B] hover:text-[#2D1B4E] hover:bg-[#F3E8FF]/80'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>อุปกรณ์ทั้งหมด</span>
            </button>

            <button
              onClick={() => setCurrentTab('my-bookings')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all relative flex items-center gap-2 ${
                currentTab === 'my-bookings'
                  ? 'bg-[#7E60BF] text-white shadow-xs shadow-[#C8ACD6]'
                  : 'text-[#4A154B] hover:text-[#2D1B4E] hover:bg-[#F3E8FF]/80'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>รายการจองของฉัน</span>
              {myPendingOrActiveCount > 0 && (
                <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                  currentTab === 'my-bookings' ? 'bg-white text-[#7E60BF]' : 'bg-[#E9D5FF] text-[#5B2C6F]'
                }`}>
                  {myPendingOrActiveCount}
                </span>
              )}
            </button>

            {/* Admin Dashboard Tab */}
            {isAdmin && (
              <button
                onClick={() => setCurrentTab('admin-dashboard')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all relative flex items-center gap-2 ${
                  currentTab === 'admin-dashboard'
                    ? 'bg-gradient-to-r from-[#7E60BF] to-[#6A1B9A] text-white shadow-xs shadow-[#C8ACD6]'
                    : 'text-[#5B2C6F] bg-[#F8F0FC] hover:bg-[#F3E8FF] border border-[#E9D5FF]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#9B72CF] group-hover:text-[#7E60BF]" />
                <span className="font-semibold">ระบบผู้ดูแล (Admin)</span>
                {pendingRequestsCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                    {pendingRequestsCount} รออนุมัติ
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setCurrentTab('guidelines')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'guidelines'
                  ? 'bg-[#7E60BF] text-white'
                  : 'text-slate-600 hover:text-[#2D1B4E] hover:bg-[#F3E8FF]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>ระเบียบการยืม</span>
            </button>
          </nav>

          {/* Right Action: User Profile / Login & Role Switcher */}
          <div className="flex items-center gap-2">
            {/* Quick Role Switcher Pill */}
            <div className="hidden sm:flex items-center bg-[#F3E8FF] p-1 rounded-2xl border border-[#E9D5FF] text-xs">
              <button
                onClick={() => {
                  switchRole('user');
                  if (currentTab === 'admin-dashboard') {
                    setCurrentTab('catalog');
                  }
                }}
                className={`px-2.5 py-1 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                  !isAdmin 
                    ? 'bg-white text-[#7E60BF] font-bold shadow-xs' 
                    : 'text-[#5B2C6F] hover:text-[#2D1B4E]'
                }`}
                title="สลับเป็นมุมมองผู้ใช้งานทั่วไป (User View)"
              >
                <User className="w-3.5 h-3.5" />
                <span>ผู้ใช้ทั่วไป</span>
              </button>
              <button
                onClick={() => {
                  switchRole('admin');
                  setCurrentTab('admin-dashboard');
                }}
                className={`px-2.5 py-1 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                  isAdmin 
                    ? 'bg-[#7E60BF] text-white font-bold shadow-xs' 
                    : 'text-[#5B2C6F] hover:text-[#2D1B4E]'
                }`}
                title="สลับเป็นมุมมองผู้ดูแลระบบ (Admin View)"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>แอดมิน (Admin)</span>
              </button>
            </div>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl border border-[#E9D5FF] hover:border-[#C8ACD6] bg-[#F8F0FC] hover:bg-[#F3E8FF] transition-all text-left"
                >
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName}
                    className="w-8 h-8 rounded-full object-cover border border-[#C8ACD6] shadow-2xs"
                  />
                  <div className="hidden lg:block text-xs">
                    <p className="font-bold text-[#2D1B4E] line-clamp-1 max-w-[140px]">
                      {currentUser.displayName}
                    </p>
                    <p className="text-[10px] text-[#7E60BF] font-medium">
                      {isAdmin ? '🛡️ ผู้ดูแลระบบ (Admin)' : '👤 ผู้ใช้ทั่วไป/นิสิต'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div 
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E9D5FF] py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="font-bold text-[#2D1B4E] truncate">{currentUser.displayName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isAdmin ? 'bg-[#F3E8FF] text-[#5B2C6F] border border-[#E9D5FF]' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {isAdmin ? 'ผู้ดูแลระบบ (Admin)' : 'นักศึกษา / ผู้ใช้ทั่วไป'}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenProfile();
                        }}
                        className="w-full px-4 py-2 text-left text-slate-700 hover:bg-[#F8F0FC] flex items-center gap-2.5"
                      >
                        <User className="w-4 h-4 text-[#7E60BF]" />
                        <span>แก้ไขข้อมูลโปรไฟล์ / เบอร์โทร</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenAdminManage();
                          }}
                          className="w-full px-4 py-2 text-left text-[#5B2C6F] hover:bg-[#F8F0FC] flex items-center gap-2.5 font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#7E60BF]" />
                          <span>จัดการสิทธิ์ Admin Emails</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenLogin();
                        }}
                        className="w-full px-4 py-2 text-left text-slate-700 hover:bg-[#F8F0FC] flex items-center gap-2.5"
                      >
                        <Users className="w-4 h-4 text-[#7E60BF]" />
                        <span>สลับบัญชี Google / ผู้ใช้งาน</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>ออกจากระบบ</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#7E60BF] to-[#6A1B9A] hover:from-[#6A1B9A] hover:to-[#5B2C6F] shadow-xs flex items-center gap-2 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบ Google</span>
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-[#7E60BF] hover:bg-[#F3E8FF] rounded-xl"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E9D5FF] bg-white px-4 pt-2 pb-4 space-y-1 text-xs">
          {/* Mobile Role Switcher */}
          <div className="p-2 mb-2 bg-[#F3E8FF] rounded-2xl border border-[#E9D5FF]">
            <p className="text-[11px] font-semibold text-[#5B2C6F] mb-1.5 px-1">สลับบทบาท (Role Switcher):</p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  switchRole('user');
                  if (currentTab === 'admin-dashboard') setCurrentTab('catalog');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-1.5 px-2 rounded-xl text-center font-medium transition-all flex items-center justify-center gap-1.5 ${
                  !isAdmin ? 'bg-white text-[#7E60BF] font-bold shadow-xs' : 'text-[#5B2C6F] hover:bg-white/60'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>ผู้ใช้ทั่วไป</span>
              </button>
              <button
                onClick={() => {
                  switchRole('admin');
                  setCurrentTab('admin-dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-1.5 px-2 rounded-xl text-center font-medium transition-all flex items-center justify-center gap-1.5 ${
                  isAdmin ? 'bg-[#7E60BF] text-white font-bold shadow-xs' : 'text-[#5B2C6F] hover:bg-white/60'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>แอดมิน (Admin)</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentTab('catalog');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full px-3 py-2.5 rounded-xl font-medium text-left flex items-center gap-2.5 ${
              currentTab === 'catalog' ? 'bg-[#7E60BF] text-white' : 'text-slate-700 hover:bg-[#F8F0FC]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>อุปกรณ์ทั้งหมด</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab('my-bookings');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full px-3 py-2.5 rounded-xl font-medium text-left flex items-center justify-between ${
              currentTab === 'my-bookings' ? 'bg-[#7E60BF] text-white' : 'text-slate-700 hover:bg-[#F8F0FC]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ClipboardList className="w-4 h-4" />
              <span>รายการจองของฉัน</span>
            </div>
            {myPendingOrActiveCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] bg-[#E9D5FF] text-[#5B2C6F] rounded-full font-bold">
                {myPendingOrActiveCount}
              </span>
            )}
          </button>

          {isAdmin && (
            <button
              onClick={() => {
                setCurrentTab('admin-dashboard');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full px-3 py-2.5 rounded-xl font-medium text-left flex items-center justify-between ${
                currentTab === 'admin-dashboard' ? 'bg-gradient-to-r from-[#7E60BF] to-[#6A1B9A] text-white' : 'bg-[#F8F0FC] text-[#5B2C6F] border border-[#E9D5FF]'
              }`}
            >
              <div className="flex items-center gap-2.5 font-bold">
                <LayoutDashboard className="w-4 h-4" />
                <span>ระบบผู้ดูแล (Admin)</span>
              </div>
              {pendingRequestsCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] bg-rose-500 text-white rounded-full font-bold">
                  {pendingRequestsCount} รออนุมัติ
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => {
              setCurrentTab('guidelines');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full px-3 py-2.5 rounded-xl font-medium text-left flex items-center gap-2.5 ${
              currentTab === 'guidelines' ? 'bg-[#7E60BF] text-white' : 'text-slate-700 hover:bg-[#F8F0FC]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>ระเบียบการยืม-คืน</span>
          </button>
        </div>
      )}
    </header>
  );
};
