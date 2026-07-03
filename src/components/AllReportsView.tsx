import React, { useState } from "react";
import { SupervisionReport, School, UserRole } from "../types";
import { 
  Building2 as SchoolIcon, Filter as FilterIcon, Calendar as CalendarIcon, 
  Trash2 as TrashIcon, Edit2 as EditIcon, Check as CheckIcon, X as XIcon, 
  Printer as PrinterIcon, Search, ChevronRight, FileText, AlertTriangle
} from "lucide-react";

interface AllReportsViewProps {
  reports: SupervisionReport[];
  schools: School[];
  currentUserRole: UserRole;
  onEditReport: (reportId: string) => void;
  onDeleteReport: (reportId: string) => void;
  onPrintReport: (reportId: string) => void;
  onUpdateStatus: (reportId: string, status: SupervisionReport["status"]) => void;
}

export default function AllReportsView({
  reports,
  schools,
  currentUserRole,
  onEditReport,
  onDeleteReport,
  onPrintReport,
  onUpdateStatus
}: AllReportsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  // Filtering reports
  const filteredReports = reports.filter(r => {
    const matchesSearch = 
      r.basicInfo.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.basicInfo.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.basicInfo.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.basicInfo.teachers.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.basicInfo.primarySupervisor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSchool = schoolFilter === "all" || r.basicInfo.schoolId === schoolFilter;
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesYear = yearFilter === "all" || r.basicInfo.academicYear === yearFilter;

    return matchesSearch && matchesSchool && matchesStatus && matchesYear;
  });

  const getStatusBadgeClass = (status: SupervisionReport["status"]) => {
    const base = "px-2.5 py-1 text-[10px] font-bold rounded-full border ";
    switch (status) {
      case "Draft": return base + "bg-slate-50 text-slate-500 border-slate-200";
      case "Submitted": return base + "bg-amber-50 text-amber-600 border-amber-200";
      case "Under Review": return base + "bg-blue-50 text-blue-600 border-blue-200";
      case "Approved": return base + "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Rejected": return base + "bg-rose-50 text-rose-600 border-rose-200";
      default: return base + "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  const getStatusLabel = (status: SupervisionReport["status"]) => {
    switch (status) {
      case "Draft": return "แบบร่าง";
      case "Submitted": return "ส่งนิเทศแล้ว";
      case "Under Review": return "กำลังตรวจสอบ";
      case "Approved": return "อนุมัติแล้ว";
      case "Rejected": return "ตีกลับแก้ไข";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <FilterIcon className="h-4.5 w-4.5 text-blue-500" />
          ค้นหาและกรองรายงานการนิเทศภายใน
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search text */}
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหาชื่อครู, โรงเรียน, วิชา, ผู้นิเทศ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-4 py-2.5 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          </div>

          {/* School filter */}
          <div className="relative">
            <select
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
              className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">กรอง: ทุกโรงเรียน</option>
              {schools.map(sch => (
                <option key={sch.id} value={sch.id}>{sch.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <ChevronRight className="h-3 w-3 rotate-90" />
            </div>
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">กรอง: ทุกสถานะ</option>
              <option value="Draft">แบบร่าง (Draft)</option>
              <option value="Submitted">ส่งตรวจ (Submitted)</option>
              <option value="Under Review">กำลังตรวจ (Under Review)</option>
              <option value="Approved">อนุมัติเรียบร้อย (Approved)</option>
              <option value="Rejected">ตีกลับแก้ไข (Rejected)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <ChevronRight className="h-3 w-3 rotate-90" />
            </div>
          </div>

          {/* Academic year filter */}
          <div className="relative">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">กรอง: ทุกปีการศึกษา</option>
              <option value="2569">ปีการศึกษา 2569</option>
              <option value="2570">ปีการศึกษา 2570</option>
              <option value="2571">ปีการศึกษา 2571</option>
              <option value="2572">ปีการศึกษา 2572</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <ChevronRight className="h-3 w-3 rotate-90" />
            </div>
          </div>
        </div>
      </div>

      {/* Reports Lists Table card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <FileText className="h-4.5 w-4.5 text-blue-500" />
            ตารางรายการผลประเมินนิเทศ ({filteredReports.length} รายการจากทั้งหมด {reports.length})
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-500">
            <thead>
              <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase font-semibold">
                <th className="p-4">โรงเรียน / วันที่</th>
                <th className="p-4">ระดับชั้น / วิชาการสอน</th>
                <th className="p-4">ผู้รับการนิเทศ / ผู้นิเทศ</th>
                <th className="p-4 text-center">ห้องเรียนคุณภาพ</th>
                <th className="p-4 text-center">Active Learning</th>
                <th className="p-4 text-center">คะแนนรวม (เต็ม 100)</th>
                <th className="p-4 text-center">สถานะ</th>
                <th className="p-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((report) => {
                const classroomSum = report.classroomScores.reduce((sum, s) => sum + s.score, 0);
                const activeSum = report.activeLearningScores.reduce((sum, s) => sum + s.score, 0);
                const totalScore = classroomSum + activeSum;
                const totalPercent = (((classroomSum / 60) * 100 + (activeSum / 40) * 100) / 2).toFixed(0);

                const hasPermissionToApprove = 
                  currentUserRole === "Super Admin" || 
                  currentUserRole === "Admin โรงเรียน" || 
                  currentUserRole === "ผู้อำนวยการโรงเรียน";

                return (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* School / Date */}
                    <td className="p-4">
                      <div className="font-bold text-slate-800 flex items-center gap-1 line-clamp-1">
                        <SchoolIcon className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        {report.basicInfo.schoolName}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3 shrink-0" />
                        วันที่ {report.basicInfo.date} • {report.basicInfo.time} น.
                      </div>
                    </td>

                    {/* Grade / Subject */}
                    <td className="p-4">
                      <div className="font-semibold text-slate-700">{report.basicInfo.grade}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 bg-slate-100/50 rounded p-1">
                        {report.basicInfo.subject || "ไม่ได้ระบุวิชา/กิจกรรม"}
                      </div>
                    </td>

                    {/* Teacher / Supervisor */}
                    <td className="p-4">
                      <div className="font-semibold text-slate-700 line-clamp-1">
                        ครู: {report.basicInfo.teachers.filter(Boolean).join(", ")}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                        ผู้นิเทศ: {report.basicInfo.primarySupervisor}
                      </div>
                    </td>

                    {/* Classroom Quality score */}
                    <td className="p-4 text-center">
                      <span className="font-bold text-slate-800 font-mono text-[13px]">{classroomSum} / 60</span>
                      <span className="text-[9px] text-slate-400 block">({((classroomSum / 60) * 100).toFixed(0)}%)</span>
                    </td>

                    {/* Active learning score */}
                    <td className="p-4 text-center">
                      <span className="font-bold text-slate-800 font-mono text-[13px]">{activeSum} / 40</span>
                      <span className="text-[9px] text-slate-400 block">({((activeSum / 40) * 100).toFixed(0)}%)</span>
                    </td>

                    {/* Total Score Percent */}
                    <td className="p-4 text-center">
                      <div className="inline-flex flex-col items-center justify-center bg-blue-50 border border-blue-100 p-1.5 rounded-lg min-w-[54px]">
                        <span className="font-black text-blue-700 font-mono text-sm leading-none">{totalScore}</span>
                        <span className="text-[9px] text-blue-500 font-medium mt-0.5">{totalPercent}%</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 text-center">
                      <span className={getStatusBadgeClass(report.status)}>
                        {getStatusLabel(report.status)}
                      </span>
                    </td>

                    {/* Operations */}
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        
                        {/* Print / Preview official doc */}
                        <button
                          onClick={() => onPrintReport(report.id)}
                          title="พรีวิวรายงานภาษาไทย / พิมพ์ PDF"
                          className="p-1.5 bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <PrinterIcon className="h-3.5 w-3.5" />
                        </button>

                        {/* Edit report */}
                        <button
                          onClick={() => onEditReport(report.id)}
                          title="แก้ไขรายงานนิเทศ"
                          className="p-1.5 bg-slate-50 border border-slate-200 text-slate-600 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <EditIcon className="h-3.5 w-3.5" />
                        </button>

                        {/* Quick Approvals (only shown for Admin/Directors) */}
                        {hasPermissionToApprove && report.status === "Submitted" && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => onUpdateStatus(report.id, "Approved")}
                              title="อนุมัติรายงานการประเมิน"
                              className="p-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <CheckIcon className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => onUpdateStatus(report.id, "Rejected")}
                              title="ตีกลับไปแก้ไข"
                              className="p-1.5 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <XIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Delete report */}
                        <button
                          onClick={() => onDeleteReport(report.id)}
                          title="ลบรายงานนี้ออกจากฐานข้อมูล"
                          className="p-1.5 bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 bg-white">
                    <AlertTriangle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <h5 className="font-bold text-slate-700 text-xs">ไม่พบรายการผลการนิเทศที่ค้นหา</h5>
                    <p className="text-[11px] text-slate-500 mt-1">กรุณาลองเปลี่ยนคำค้นหา หรือล้างการกรองเพื่อดึงข้อมูลทั้งหมด</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
