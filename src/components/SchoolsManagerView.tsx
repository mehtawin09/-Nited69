import React, { useState, useRef } from "react";
import { School, SupervisionReport } from "../types";
import { 
  Building2, Plus, Edit2, Trash2, Check, X, Upload, Award, FileText, BarChart3, ShieldCheck
} from "lucide-react";

interface SchoolsManagerViewProps {
  schools: School[];
  reports: SupervisionReport[];
  onAddSchool: (school: Omit<School, "id">) => void;
  onUpdateSchool: (school: School) => void;
  onDeleteSchool: (schoolId: string) => void;
}

export default function SchoolsManagerView({
  schools,
  reports,
  onAddSchool,
  onUpdateSchool,
  onDeleteSchool
}: SchoolsManagerViewProps) {
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // Form fields state
  const [schoolName, setSchoolName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setLogoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startEdit = (school: School) => {
    setEditingSchoolId(school.id);
    setSchoolName(school.name);
    setSchoolCode(school.code || "");
    setSubDistrict(school.subDistrict || "");
    setLogoUrl(school.logoUrl || "");
    setIsAddingNew(false);
  };

  const cancelEdit = () => {
    setEditingSchoolId(null);
    setIsAddingNew(false);
    clearForm();
  };

  const clearForm = () => {
    setSchoolName("");
    setSchoolCode("");
    setSubDistrict("");
    setLogoUrl("");
  };

  const handleSave = () => {
    if (!schoolName.trim()) {
      alert("กรุณากรอกชื่อโรงเรียน");
      return;
    }

    if (editingSchoolId) {
      onUpdateSchool({
        id: editingSchoolId,
        name: schoolName,
        code: schoolCode,
        subDistrict,
        logoUrl: logoUrl || "/assets/school_placeholder.png"
      });
      setEditingSchoolId(null);
    } else {
      onAddSchool({
        name: schoolName,
        code: schoolCode,
        subDistrict,
        logoUrl: logoUrl || "/assets/school_placeholder.png"
      });
      setIsAddingNew(false);
    }
    clearForm();
  };

  // Helper stats calculating per school
  const getSchoolStats = (schoolId: string) => {
    const schoolReports = reports.filter(r => r.basicInfo.schoolId === schoolId);
    const count = schoolReports.length;
    
    let avg = 0;
    if (count > 0) {
      const sum = schoolReports.reduce((total, r) => {
        const cls = r.classroomScores.reduce((sum, s) => sum + s.score, 0);
        const act = r.activeLearningScores.reduce((sum, s) => sum + s.score, 0);
        return total + cls + act;
      }, 0);
      avg = Number((sum / count).toFixed(1));
    }

    return { count, avg };
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-slate-400">การบริหารโครงสร้างโรงเรียน</span>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            รายชื่อและระบบสารสนเทศสถานศึกษา ({schools.length} โรงเรียน)
          </h2>
        </div>

        {!isAddingNew && !editingSchoolId && (
          <button
            onClick={() => {
              clearForm();
              setIsAddingNew(true);
            }}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-all shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            เพิ่มโรงเรียนใหม่
          </button>
        )}
      </div>

      {/* Input Form for Add/Edit */}
      {(isAddingNew || editingSchoolId) && (
        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-blue-950 flex items-center gap-1.5">
            <Plus className="h-4.5 w-4.5" />
            {editingSchoolId ? "แก้ไขข้อมูลสถานศึกษา" : "เพิ่มสถานศึกษาใหม่เข้าสังกัด สพป.แพร่ เขต 1"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Logo Upload Box */}
            <div className="md:col-span-1 flex flex-col items-center justify-center p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50 relative group">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden" 
              />
              
              {logoUrl ? (
                <div className="relative">
                  <img src={logoUrl} alt="Logo" className="h-24 w-24 object-contain rounded-lg bg-white p-1 shadow-sm" />
                  <button 
                    onClick={() => setLogoUrl("")}
                    className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white p-1 rounded-full hover:bg-rose-600 shadow-sm cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-1.5 p-4 text-slate-400 hover:text-blue-600 cursor-pointer w-full h-full"
                >
                  <Upload className="h-8 w-8 text-slate-300" />
                  <span className="text-[10px] font-bold">อัปโหลดตราโรงเรียน</span>
                </button>
              )}
            </div>

            {/* Fields */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">ชื่อสถานศึกษา *</label>
                <input
                  type="text"
                  placeholder="เช่น โรงเรียนบ้านลอง (ฟองจันทร์ราษฎร์อุปถัมภ์)"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">รหัสสถานศึกษา (EMIS)</label>
                <input
                  type="text"
                  placeholder="ระบุรหัส 10 หลัก..."
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">กลุ่มพัฒนาคุณภาพการศึกษา (ตำบล)</label>
                <input
                  type="text"
                  placeholder="เช่น อำเภอเมืองแพร่..."
                  value={subDistrict}
                  onChange={(e) => setSubDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end gap-2 pt-4 sm:pt-0 justify-end sm:col-span-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 border border-slate-200 hover:bg-slate-50 font-bold text-xs px-4 py-2.5 rounded-lg cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all shadow-sm cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" />
                  บันทึกข้อมูล
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Grid of schools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schools.map((school) => {
          const stats = getSchoolStats(school.id);

          return (
            <div key={school.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50/20 to-transparent rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform" />
              
              <div className="flex gap-3 relative">
                {/* School Logo */}
                <div className="h-14 w-14 rounded-xl bg-slate-50 border border-slate-200/60 p-1 flex items-center justify-center shrink-0">
                  <img 
                    src={school.logoUrl || "https://img.icons8.com/color/96/school.png"} 
                    alt="School Logo" 
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* School title */}
                <div className="space-y-0.5">
                  <h4 className="text-sm font-extrabold text-slate-800 leading-tight">
                    {school.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    CODE: {school.code || "ไม่ได้ระบุ"} • {school.subDistrict || "เมืองแพร่"}
                  </p>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                    <ShieldCheck className="h-2.5 w-2.5 text-blue-500" />
                    เครือข่าย สพป.แพร่ เขต 1
                  </span>
                </div>
              </div>

              {/* School aggregated stats */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold flex items-center justify-center gap-0.5">
                    <FileText className="h-3 w-3 text-blue-400" />
                    จำนวนประเมิน
                  </div>
                  <div className="font-mono font-black text-slate-700 text-base mt-0.5">
                    {stats.count} <span className="text-[9px] text-slate-400 font-normal">ฉบับ</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 font-bold flex items-center justify-center gap-0.5">
                    <BarChart3 className="h-3 w-3 text-emerald-400" />
                    คะแนนเฉลี่ยรวม
                  </div>
                  <div className="font-mono font-black text-emerald-600 text-base mt-0.5">
                    {stats.avg > 0 ? `${stats.avg}` : "-"} <span className="text-[9px] text-emerald-400 font-normal">{stats.avg > 0 ? "คะแนน" : ""}</span>
                  </div>
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 relative">
                <span className="text-[10px] text-slate-400 font-semibold">แก้ไขล่าสุด: วานนี้</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => startEdit(school)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
                    title="แก้ไขข้อมูลโรงเรียน"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if(confirm(`ยืนยันลบข้อมูลโรงเรียน "${school.name}" หรือไม่?\n(คำเตือน: ข้อมูลคะแนนและแบบรายงานในโรงเรียนนี้อาจสูญหาย)`)) {
                        onDeleteSchool(school.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
                    title="ลบโรงเรียนนี้"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
