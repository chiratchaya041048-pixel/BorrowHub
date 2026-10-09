import React from 'react';
import { 
  BookOpen, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  Phone, 
  MapPin, 
  Mail,
  AlertTriangle
} from 'lucide-react';

export const GuidelinesView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9D5FF] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#F3E8FF] text-[#7E60BF] rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D1B4E]">
              ระเบียบและแนวปฏิบัติการยืม-คืนอุปกรณ์
            </h2>
            <p className="text-xs sm:text-sm text-[#7E60BF] font-medium mt-0.5">
              ภาควิชาเทคโนโลยีการศึกษา คณะศึกษาศาสตร์
            </p>
          </div>
        </div>
      </div>

      {/* Rules Accordions / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* 1. ผู้มีสิทธิ์ยืม */}
        <div className="bg-white rounded-2xl p-5 border border-[#E9D5FF] shadow-xs space-y-2.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-[#2D1B4E] text-sm">
            <CheckCircle2 className="w-4 h-4 text-[#7E60BF]" />
            <span>1. ผู้มีสิทธิ์ยืมอุปกรณ์</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            นิสิต/นักศึกษา คณาจารย์ และบุคลากรสังกัดภาควิชาเทคโนโลยีการศึกษา หรือผู้ลงทะเบียนเรียนในรายวิชาปฏิบัติการผลิตสื่อที่ได้รับอนุญาตจากอาจารย์ผู้รับผิดชอบรายวิชา
          </p>
        </div>

        {/* 2. การจองล่วงหน้า */}
        <div className="bg-white rounded-2xl p-5 border border-[#E9D5FF] shadow-xs space-y-2.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-[#2D1B4E] text-sm">
            <Clock className="w-4 h-4 text-[#7E60BF]" />
            <span>2. ระยะเวลาการส่งคำขอจอง</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            ต้องส่งคำขอจองล่วงหน้าอย่างน้อย <strong>1 วันทำการ</strong> โดยระบุวัตถุประสงค์ในการยืมและกำหนดเวลาคืนที่ชัดเจน การยืมในแต่ละครั้งไม่เกิน <strong>3-5 วัน</strong> (หากต้องการต่ออายุต้องได้รับการอนุมัติ)
          </p>
        </div>

        {/* 3. การรับมอบอุปกรณ์ */}
        <div className="bg-white rounded-2xl p-5 border border-[#E9D5FF] shadow-xs space-y-2.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-[#2D1B4E] text-sm">
            <CheckCircle2 className="w-4 h-4 text-[#7E60BF]" />
            <span>3. การรับมอบอุปกรณ์</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            ผู้ยืมต้องแสดงบัตรนักศึกษาหรือบัตรประจำตัวประชาชน พร้อมเปิดหน้า <strong>ใบยืม-คืนอุปกรณ์อิเล็กทรอนิกส์ (Digital Slip)</strong> ให้เจ้าหน้าที่สแกนตรวจสอบและตรวจสภาพอุปกรณ์ร่วมกันก่อนนำออกจากห้อง
          </p>
        </div>

        {/* 4. การส่งคืนและการดูแลรักษา */}
        <div className="bg-white rounded-2xl p-5 border border-[#E9D5FF] shadow-xs space-y-2.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-[#2D1B4E] text-sm">
            <ShieldAlert className="w-4 h-4 text-[#7E60BF]" />
            <span>4. ความรับผิดชอบเมื่ออุปกรณ์ชำรุด/สูญหาย</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            ผู้ยืมต้องดูแลรักษาอุปกรณ์อย่างระมัดระวัง หากอุปกรณ์เกิดความเสียหายหรือสูญหายอันเนื่องมาจากความประมาทเลินเล่อ ผู้ยืมต้องรับผิดชอบชดใช้ค่าซ่อมหรือจัดหาอุปกรณ์ทดแทนที่มีคุณสมบัติเทียบเท่า
          </p>
        </div>

      </div>

      {/* Office Hours & Contact Box */}
      <div className="bg-gradient-to-r from-[#F8F0FC] to-[#F3E8FF] rounded-3xl p-6 border border-[#E9D5FF] space-y-4">
        <h3 className="font-bold text-[#2D1B4E] text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#7E60BF]" />
          <span>เวลาเปิดให้บริการและข้อมูลการติดต่อ</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-[#7E60BF] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900">เวลาทำการ</strong>
              <span>จันทร์ - ศุกร์ : 08.30 - 16.30 น.</span>
              <span className="block text-slate-500 text-[11px]">(ปิดทำการในวันหยุดราชการ)</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#7E60BF] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900">สถานที่รับ-คืน</strong>
              <span>ศูนย์บริการโสตทัศนูปกรณ์ ชั้น 4 ห้อง 402</span>
              <span className="block text-slate-500 text-[11px]">อาคารเรียนและปฏิบัติการศึกษาศาสตร์</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-[#7E60BF] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900">ติดต่อเจ้าหน้าที่</strong>
              <span>โทร: 02-649-5000 ต่อ 1520</span>
              <span className="block text-slate-500 text-[11px]">อีเมล: edtech-service@university.ac.th</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
