export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  studentId: string; // รหัสนักศึกษา หรือ รหัสประจำตัวอาจารย์/บุคลากร
  department: string; // เช่น ภาควิชาเทคโนโลยีการศึกษา, สาขาเทคโนโลยีและสื่อสารการศึกษา
  photoURL: string;
  role: UserRole;
  createdAt: string;
}

export type EquipmentCategoryKey = 
  | 'camera' 
  | 'audio' 
  | 'lighting' 
  | 'tripod' 
  | 'projector' 
  | 'display' 
  | 'accessories';

export interface CategoryInfo {
  key: EquipmentCategoryKey;
  label: string;
  iconName: string;
  description: string;
}

export type EquipmentStatus = 'available' | 'maintenance' | 'retired';

export interface Equipment {
  id: string;
  code: string; // รหัสอุปกรณ์ เช่น EDTECH-CAM-001
  name: string; // ชื่ออุปกรณ์
  category: EquipmentCategoryKey;
  totalQuantity: number; // จำนวนทั้งหมด
  availableQuantity: number; // จำนวนคงเหลือ
  status: EquipmentStatus;
  imageUrl: string;
  description: string;
  location: string; // ห้องเก็บ/ตู้เก็บ เช่น ห้อง 402 ตู้กล้อง A1
  accessories: string[]; // อุปกรณ์ที่ให้ไปด้วย
  createdAt: string;
  updatedAt: string;
}

export type BorrowStatus = 
  | 'pending'    // รออนุมัติ
  | 'approved'   // อนุมัติแล้ว (รอผู้ยืมมารับอุปกรณ์)
  | 'active'     // กำลังยืม (รับอุปกรณ์แล้ว)
  | 'returned'   // คืนแล้ว
  | 'rejected'   // ปฏิเสธคำขอ
  | 'cancelled'; // ยกเลิกโดยผู้ใช้

export type ReturnCondition = 'perfect' | 'minor_issue' | 'damaged' | 'lost';

export interface BorrowRequest {
  id: string;
  requestNumber: string; // e.g. REQ-20261008-001
  equipmentId: string;
  equipmentCode: string;
  equipmentName: string;
  equipmentImage: string;
  equipmentCategory: EquipmentCategoryKey;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  studentId: string;
  department: string;
  quantity: number;
  borrowDate: string; // YYYY-MM-DD
  expectedReturnDate: string; // YYYY-MM-DD
  actualReturnDate?: string;
  purpose: string; // วัตถุประสงค์
  courseOrProject?: string; // รายวิชา / โครงการ
  status: BorrowStatus;
  rejectionReason?: string;
  returnCondition?: ReturnCondition;
  returnNotes?: string;
  approvedBy?: string;
  rejectedBy?: string;
  receivedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}
