import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  UserProfile, 
  Equipment, 
  BorrowRequest, 
  ReturnCondition, 
  BorrowStatus 
} from '../types';
import { 
  INITIAL_ADMIN_EMAILS, 
  INITIAL_EQUIPMENT, 
  INITIAL_REQUESTS, 
  DEMO_USERS 
} from '../data/seedData';

interface AppContextType {
  currentUser: UserProfile | null;
  adminEmails: string[];
  equipmentList: Equipment[];
  borrowRequests: BorrowRequest[];
  isAdmin: boolean;
  
  // Auth methods
  loginWithGoogle: (email: string, name?: string, photo?: string) => void;
  logout: () => void;
  updateProfile: (profileData: Partial<UserProfile>) => void;
  switchDemoUser: (userId: string) => void;
  switchRole: (role: 'admin' | 'user') => void;
  addAdminEmail: (email: string) => boolean;
  removeAdminEmail: (email: string) => boolean;

  // Equipment methods (Admin)
  addEquipment: (item: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEquipment: (id: string, item: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => boolean;

  // Borrow/Return methods
  createBorrowRequest: (
    equipmentId: string, 
    quantity: number, 
    borrowDate: string, 
    expectedReturnDate: string, 
    purpose: string, 
    courseOrProject?: string
  ) => { success: boolean; message: string; request?: BorrowRequest };
  approveBorrowRequest: (requestId: string, targetStatus?: 'approved' | 'active') => { success: boolean; message: string };
  recordReturn: (requestId: string, condition: ReturnCondition, notes?: string) => { success: boolean; message: string };
  rejectBorrowRequest: (requestId: string, reason: string) => { success: boolean; message: string };
  cancelBorrowRequest: (requestId: string) => { success: boolean; message: string };

  // Utility
  resetToSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ADMINS: 'edtech_admins_v2',
  EQUIPMENT: 'edtech_equipment_v2',
  REQUESTS: 'edtech_requests_v2',
  CURRENT_USER: 'edtech_current_user_v2',
  USERS: 'edtech_users_v2'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load Admin Emails
  const [adminEmails, setAdminEmails] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMINS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ADMIN_EMAILS;
  });

  // Load Equipment
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EQUIPMENT;
  });

  // Load Borrow Requests
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REQUESTS;
  });

  // Load Registered Users pool
  const [usersPool, setUsersPool] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEMO_USERS;
  });

  // Load Current User (Default to Chiratchaya - Initial Admin)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEMO_USERS[0]; // Chiratchaya Admin
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(adminEmails));
  }, [adminEmails]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipmentList));
  }, [equipmentList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(borrowRequests));
  }, [borrowRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersPool));
  }, [usersPool]);

  useEffect(() => {
    if (currentUser) {
      // Re-evaluate role in case adminEmails changed
      const normalizedEmail = currentUser.email.toLowerCase().trim();
      const isAdminEmail = adminEmails.some(a => a.toLowerCase().trim() === normalizedEmail);
      const effectiveRole = isAdminEmail ? 'admin' : 'user';
      if (currentUser.role !== effectiveRole) {
        const updated = { ...currentUser, role: effectiveRole as 'admin' | 'user' };
        setCurrentUser(updated);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
        return;
      }
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser, adminEmails]);

  const isAdmin = Boolean(currentUser && (
    currentUser.role === 'admin' ||
    adminEmails.some(a => a.toLowerCase().trim() === currentUser.email.toLowerCase().trim())
  ));

  // Login simulation (Google Sign-In)
  const loginWithGoogle = (email: string, name?: string, photo?: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const isUserAdmin = adminEmails.some(a => a.toLowerCase().trim() === cleanEmail);
    
    // Check if user already exists in pool
    const existing = usersPool.find(u => u.email.toLowerCase().trim() === cleanEmail);
    if (existing) {
      const updatedUser: UserProfile = {
        ...existing,
        role: isUserAdmin ? 'admin' : 'user',
        photoURL: photo || existing.photoURL,
        displayName: name || existing.displayName
      };
      setCurrentUser(updatedUser);
      setUsersPool(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    } else {
      // Auto-create profile for first-time login
      const defaultName = name || cleanEmail.split('@')[0];
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        email: cleanEmail,
        displayName: defaultName,
        phoneNumber: '08X-XXX-XXXX',
        studentId: isUserAdmin ? 'ADMIN-ET' : '65020XXX',
        department: 'ภาควิชาเทคโนโลยีการศึกษา',
        photoURL: photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(defaultName)}&backgroundColor=8b5cf6`,
        role: isUserAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      };
      setUsersPool(prev => [...prev, newUser]);
      setCurrentUser(newUser);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (profileData: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      ...profileData
    };
    setCurrentUser(updated);
    setUsersPool(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const switchDemoUser = (userId: string) => {
    const target = usersPool.find(u => u.id === userId);
    if (target) {
      const isTargetAdmin = adminEmails.some(a => a.toLowerCase().trim() === target.email.toLowerCase().trim());
      setCurrentUser({
        ...target,
        role: isTargetAdmin ? 'admin' : 'user'
      });
    }
  };

  const switchRole = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      const adminUser = usersPool.find(u => adminEmails.some(a => a.toLowerCase().trim() === u.email.toLowerCase().trim())) || DEMO_USERS[0];
      setCurrentUser({
        ...adminUser,
        role: 'admin'
      });
    } else {
      const normalUser = usersPool.find(u => u.id === 'user-002') || DEMO_USERS[1];
      setCurrentUser({
        ...normalUser,
        role: 'user'
      });
    }
  };

  const addAdminEmail = (email: string) => {
    const clean = email.toLowerCase().trim();
    if (!clean || !clean.includes('@')) return false;
    if (adminEmails.some(a => a.toLowerCase().trim() === clean)) return false;
    
    setAdminEmails(prev => [...prev, clean]);
    // update current user role if matches
    if (currentUser && currentUser.email.toLowerCase().trim() === clean) {
      setCurrentUser(prev => prev ? { ...prev, role: 'admin' } : null);
    }
    return true;
  };

  const removeAdminEmail = (email: string) => {
    const clean = email.toLowerCase().trim();
    // Prevent removing the primary master admin
    if (clean === 'chiratchaya041048@gmail.com') {
      return false;
    }
    setAdminEmails(prev => prev.filter(a => a.toLowerCase().trim() !== clean));
    return true;
  };

  // CRUD Equipment (Admin Only)
  const addEquipment = (item: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!isAdmin) return;
    const newId = `eq-${Date.now()}`;
    const newItem: Equipment = {
      ...item,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEquipmentList(prev => [newItem, ...prev]);
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    if (!isAdmin) return;
    setEquipmentList(prev => prev.map(eq => {
      if (eq.id === id) {
        return {
          ...eq,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return eq;
    }));
  };

  const deleteEquipment = (id: string) => {
    if (!isAdmin) return false;
    // Check if equipment is currently being borrowed
    const hasActiveRequests = borrowRequests.some(r => r.equipmentId === id && (r.status === 'active' || r.status === 'pending' || r.status === 'approved'));
    if (hasActiveRequests) {
      return false;
    }
    setEquipmentList(prev => prev.filter(eq => eq.id !== id));
    return true;
  };

  // Borrow Flow
  const createBorrowRequest = (
    equipmentId: string, 
    quantity: number, 
    borrowDate: string, 
    expectedReturnDate: string, 
    purpose: string, 
    courseOrProject?: string
  ) => {
    if (!currentUser) {
      return { success: false, message: 'กรุณาเข้าสู่ระบบก่อนทำการยืมอุปกรณ์' };
    }

    const equipment = equipmentList.find(e => e.id === equipmentId);
    if (!equipment) {
      return { success: false, message: 'ไม่พบข้อมูลอุปกรณ์' };
    }

    if (equipment.status !== 'available') {
      return { success: false, message: 'อุปกรณ์นี้ไม่พร้อมให้ยืมในขณะนี้' };
    }

    if (equipment.availableQuantity < quantity) {
      return { 
        success: false, 
        message: `จำนวนคงเหลือไม่เพียงพอ (มีคงเหลือ ${equipment.availableQuantity} ชิ้น)` 
      };
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const requestNumber = `REQ-${dateStr}-${randomSuffix}`;

    const newRequest: BorrowRequest = {
      id: `req-${Date.now()}`,
      requestNumber,
      equipmentId: equipment.id,
      equipmentCode: equipment.code,
      equipmentName: equipment.name,
      equipmentImage: equipment.imageUrl,
      equipmentCategory: equipment.category,
      userId: currentUser.id,
      userName: currentUser.displayName,
      userEmail: currentUser.email,
      userPhone: currentUser.phoneNumber,
      studentId: currentUser.studentId,
      department: currentUser.department,
      quantity,
      borrowDate,
      expectedReturnDate,
      purpose,
      courseOrProject: courseOrProject || 'โครงงานภาควิชาเทคโนโลยีการศึกษา',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBorrowRequests(prev => [newRequest, ...prev]);

    return { 
      success: true, 
      message: 'ส่งคำขอจองอุปกรณ์เรียบร้อยแล้ว รอผู้ดูแลระบบตรวจสอบและอนุมัติ',
      request: newRequest
    };
  };

  // Admin approves borrowing
  const approveBorrowRequest = (requestId: string, targetStatus: 'approved' | 'active' = 'approved') => {
    if (!isAdmin) {
      return { 
        success: false, 
        message: 'ปฏิเสธการดำเนินการ: คุณไม่มีสิทธิ์ผู้ดูแลระบบ (Admin) ในการอนุมัติคำขอ' 
      };
    }

    const target = borrowRequests.find(r => r.id === requestId);
    if (!target) return { success: false, message: 'ไม่พบรายการคำขอนี้ในระบบ' };

    const equipment = equipmentList.find(e => e.id === target.equipmentId);
    if (!equipment) return { success: false, message: 'ไม่พบข้อมูลอุปกรณ์ที่เกี่ยวข้อง' };

    // Deduct available stock if transitioning from pending
    if (target.status === 'pending') {
      if (equipment.availableQuantity < target.quantity) {
        return { 
          success: false, 
          message: `ไม่สามารถอนุมัติได้เนื่องจากอุปกรณ์คงเหลือไม่พอ (คงเหลือ ${equipment.availableQuantity} ชิ้น แต่ต้องการ ${target.quantity} ชิ้น)` 
        };
      }

      // Deduct available stock
      setEquipmentList(prev => prev.map(eq => {
        if (eq.id === target.equipmentId) {
          const nextQty = Math.max(0, eq.availableQuantity - target.quantity);
          return {
            ...eq,
            availableQuantity: nextQty,
            updatedAt: new Date().toISOString()
          };
        }
        return eq;
      }));
    }

    const adminSign = currentUser 
      ? `${currentUser.displayName} (${currentUser.email})` 
      : 'ผู้ดูแลระบบ (Admin)';

    // Update request status
    setBorrowRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: targetStatus as BorrowStatus,
          approvedBy: adminSign,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));

    const statusMessage = targetStatus === 'approved'
      ? 'อนุมัติคำขอยืมเรียบร้อยแล้ว (สถานะ: อนุมัติแล้ว / Approved รอผู้ยืมมารับอุปกรณ์)'
      : 'ส่งมอบอุปกรณ์ให้ผู้ยืมเรียบร้อยแล้ว (สถานะ: กำลังยืม / Active)';

    return { success: true, message: statusMessage };
  };

  // Record Return (Admin Only)
  const recordReturn = (requestId: string, condition: ReturnCondition, notes?: string) => {
    if (!isAdmin) {
      return { 
        success: false, 
        message: 'ปฏิเสธการดำเนินการ: คุณไม่มีสิทธิ์ผู้ดูแลระบบ (Admin) ในการบันทึกการคืน' 
      };
    }

    const target = borrowRequests.find(r => r.id === requestId);
    if (!target) return { success: false, message: 'ไม่พบรายการคำขอนี้' };

    // Restore available stock
    setEquipmentList(prev => prev.map(eq => {
      if (eq.id === target.equipmentId) {
        // If lost, do not increment available quantity, but update status if needed
        const returnedQty = condition === 'lost' ? 0 : target.quantity;
        const newQty = Math.min(eq.totalQuantity, eq.availableQuantity + returnedQty);
        return {
          ...eq,
          availableQuantity: newQty,
          status: condition === 'damaged' ? 'maintenance' : eq.status,
          updatedAt: new Date().toISOString()
        };
      }
      return eq;
    }));

    // Update request to returned
    setBorrowRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'returned' as BorrowStatus,
          actualReturnDate: new Date().toISOString().slice(0, 10),
          returnCondition: condition,
          returnNotes: notes || 'ตรวจสอบสภาพเรียบร้อยแล้ว',
          receivedBy: currentUser ? `${currentUser.displayName} (${currentUser.email})` : 'Admin',
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));

    return { success: true, message: 'บันทึกการรับคืนอุปกรณ์และตรวจสภาพเรียบร้อยแล้ว' };
  };

  // Reject Request (Admin Only)
  const rejectBorrowRequest = (requestId: string, reason: string) => {
    if (!isAdmin) {
      return { 
        success: false, 
        message: 'ปฏิเสธการดำเนินการ: คุณไม่มีสิทธิ์ผู้ดูแลระบบ (Admin) ในการปฏิเสธคำขอ' 
      };
    }

    const target = borrowRequests.find(r => r.id === requestId);
    if (!target) return { success: false, message: 'ไม่พบรายการคำขอนี้ในระบบ' };

    // If target was approved or active, restore stock
    if (target.status === 'approved' || target.status === 'active') {
      setEquipmentList(prev => prev.map(eq => {
        if (eq.id === target.equipmentId) {
          return {
            ...eq,
            availableQuantity: Math.min(eq.totalQuantity, eq.availableQuantity + target.quantity),
            updatedAt: new Date().toISOString()
          };
        }
        return eq;
      }));
    }

    const adminSign = currentUser 
      ? `${currentUser.displayName} (${currentUser.email})` 
      : 'ผู้ดูแลระบบ (Admin)';

    setBorrowRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'rejected' as BorrowStatus,
          rejectionReason: reason || 'ไม่ผ่านเกณฑ์การอนุมัติ',
          rejectedBy: adminSign,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));
    return { success: true, message: 'บันทึกการปฏิเสธคำขอยืมเรียบร้อยแล้ว (สถานะ: ถูกปฏิเสธ / Rejected)' };
  };

  // Cancel Request by user
  const cancelBorrowRequest = (requestId: string) => {
    const target = borrowRequests.find(r => r.id === requestId);
    if (!target) return { success: false, message: 'ไม่พบคำขอ' };
    if (target.status !== 'pending') {
      return { success: false, message: 'สามารถยกเลิกได้เฉพาะคำขอที่อยู่ในสถานะรออนุมัติเท่านั้น' };
    }

    setBorrowRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'cancelled' as BorrowStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));
    return { success: true, message: 'ยกเลิกคำขอจองเรียบร้อยแล้ว' };
  };

  const resetToSampleData = () => {
    setAdminEmails(INITIAL_ADMIN_EMAILS);
    setEquipmentList(INITIAL_EQUIPMENT);
    setBorrowRequests(INITIAL_REQUESTS);
    setUsersPool(DEMO_USERS);
    setCurrentUser(DEMO_USERS[0]);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        adminEmails,
        equipmentList,
        borrowRequests,
        isAdmin,
        loginWithGoogle,
        logout,
        updateProfile,
        switchDemoUser,
        switchRole,
        addAdminEmail,
        removeAdminEmail,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        createBorrowRequest,
        approveBorrowRequest,
        recordReturn,
        rejectBorrowRequest,
        cancelBorrowRequest,
        resetToSampleData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
