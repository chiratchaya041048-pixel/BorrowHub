import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Shield, 
  CheckCircle2, 
  LogIn, 
  Sparkles,
  Camera
} from 'lucide-react';
import { DEMO_USERS } from '../data/seedData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle, switchDemoUser } = useApp();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const handleCustomGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) {
      alert('กรุณากรอกอีเมลที่ถูกต้อง');
      return;
    }
    loginWithGoogle(customEmail.trim(), customName.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E9D5FF] overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-6 bg-gradient-to-br from-[#7E60BF] via-[#9370DB] to-[#C8ACD6] text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-purple-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 shadow-inner">
            <LogIn className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold">เข้าสู่ระบบด้วย Google Account</h2>
          <p className="text-xs text-purple-100 mt-1">
            ระบบยืม-คืนอุปกรณ์ ภาควิชาเทคโนโลยีการศึกษา
          </p>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Quick 1-click accounts */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              เลือกบัญชีเข้าใช้งานทันที (Demo Accounts)
            </p>
            <div className="space-y-2">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    switchDemoUser(user.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all text-left group"
                >
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full object-cover border border-purple-200 shadow-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-purple-700 truncate">
                        {user.displayName}
                      </p>
                      {user.email === 'chiratchaya041048@gmail.com' && (
                        <span className="px-1.5 py-0.5 text-[10px] bg-purple-100 text-purple-800 font-bold rounded">
                          Admin หลัก
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <span className="text-xs text-purple-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    เลือก →
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-xs">หรือ เข้าสู่ระบบด้วยอีเมล Google อื่น</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Custom Google sign in */}
          <form onSubmit={handleCustomGoogleLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Google Email (@gmail.com หรือเมลมหาวิทยาลัย)
              </label>
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="example@gmail.com หรือ student@edtech.ac.th"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ชื่อ-นามสกุล (สร้างโปรไฟล์อัตโนมัติ)
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="ระบุชื่อภาษาไทย หรือ ภาษาอังกฤษ"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              {/* Google G SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>ลงชื่อเข้าใช้ด้วย Google Sign-In</span>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile, isAdmin } = useApp();

  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [studentId, setStudentId] = useState(currentUser?.studentId || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName,
      phoneNumber,
      studentId,
      department,
      photoURL
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E9D5FF] overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#7E60BF] via-[#9370DB] to-[#C8ACD6] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-100" />
            <h2 className="text-base font-bold">ข้อมูลโปรไฟล์ผู้ใช้งาน</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-purple-100 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>บันทึกการเปลี่ยนแปลงโปรไฟล์เรียบร้อยแล้ว</span>
            </div>
          )}

          {/* Avatar and Role */}
          <div className="flex items-center gap-4 p-3 bg-[#F8F0FC] rounded-2xl border border-[#E9D5FF]">
            <img
              src={photoURL || currentUser.photoURL}
              alt={currentUser.displayName}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#C8ACD6] shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#2D1B4E] text-sm">{currentUser.displayName}</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  isAdmin ? 'bg-[#F3E8FF] text-[#5B2C6F] border border-[#E9D5FF]' : 'bg-slate-100 text-slate-700'
                }`}>
                  {isAdmin ? 'ผู้ดูแลระบบ (Admin)' : 'ผู้ใช้ทั่วไป / นักศึกษา'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{currentUser.email}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">ชื่อ-นามสกุล *</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">รหัสนักศึกษา / รหัสบุคลากร *</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="เช่น 65020123"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">เบอร์โทรศัพท์ติดต่อ *</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="เช่น 081-234-5678"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">สังกัด / ภาควิชา / ชั้นปี</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="เช่น ภาควิชาเทคโนโลยีการศึกษา (ปี 3)"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">ลิงก์ภาพโปรไฟล์ (URL)</label>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-600"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              ปิด
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs"
            >
              บันทึกข้อมูล
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
