import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  Mail, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface AdminManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminManagementModal: React.FC<AdminManagementModalProps> = ({ isOpen, onClose }) => {
  const { adminEmails, addAdminEmail, removeAdminEmail, currentUser } = useApp();
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setMessage({ text: 'กรุณากรอกอีเมลที่ถูกต้อง', type: 'error' });
      return;
    }

    const success = addAdminEmail(newEmail.trim());
    if (success) {
      setMessage({ text: `เพิ่มสิทธิ์ผู้ดูแลระบบให้ ${newEmail} สำเร็จ`, type: 'success' });
      setNewEmail('');
    } else {
      setMessage({ text: 'อีเมลนี้มีสิทธิ์ผู้ดูแลระบบอยู่แล้ว หรือระบุไม่ถูกต้อง', type: 'error' });
    }
  };

  const handleRemove = (email: string) => {
    if (confirm(`คุณต้องการถอนสิทธิ์ผู้ดูแลระบบของ ${email} หรือไม่?`)) {
      const success = removeAdminEmail(email);
      if (success) {
        setMessage({ text: `ถอนสิทธิ์ ${email} สำเร็จ`, type: 'success' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E9D5FF] overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#7E60BF] via-[#9370DB] to-[#C8ACD6] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-100" />
            <div>
              <h2 className="text-base font-bold">จัดการสิทธิ์ผู้ดูแลระบบ (Admin)</h2>
              <p className="text-[11px] text-purple-100">เพิ่มหรือถอนสิทธิ์ผู้ดูแลระบบภาควิชา</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-purple-100 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {message && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              message.type === 'success' 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Add Form */}
          <form onSubmit={handleAdd} className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              เพิ่มอีเมลผู้ดูแลระบบคนใหม่ (Google Email)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="เช่น admin.assistant@gmail.com หรือ staff@edtech.ac.th"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                เพิ่มสิทธิ์
              </button>
            </div>
          </form>

          {/* Admin Email List */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
              รายชื่อผู้ดูแลระบบในปัจจุบัน ({adminEmails.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {adminEmails.map((email) => {
                const isMaster = email === 'chiratchaya041048@gmail.com';
                const isMe = currentUser?.email.toLowerCase() === email.toLowerCase();
                return (
                  <div 
                    key={email}
                    className="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {email[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800 truncate">{email}</span>
                          {isMaster && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-purple-600 text-white font-bold rounded">
                              Master Admin
                            </span>
                          )}
                          {isMe && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-slate-200 text-slate-700 font-medium rounded">
                              (คุณ)
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">สิทธิ์: จัดการอุปกรณ์, อนุมัติยืม-คืน, จัดการระบบ</span>
                      </div>
                    </div>

                    {!isMaster && (
                      <button
                        onClick={() => handleRemove(email)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2"
                        title="ถอนสิทธิ์ผู้ดูแลระบบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
            💡 ผู้ใช้ที่มีอีเมลตรงกับรายชื่อนี้ เมื่อลงชื่อเข้าใช้ด้วย Google Sign-In จะได้รับสิทธิ์ผู้ดูแลระบบ (Admin) โดยอัตโนมัติทันที
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
            >
              ปิด
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
