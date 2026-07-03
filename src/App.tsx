import React, { useState, useEffect } from "react";
import { 
  Building2, LayoutDashboard, FileSpreadsheet, PlusCircle, Users, Settings, 
  Sparkles, RefreshCw, LogOut, CheckCircle2, ChevronRight, UserCheck, Grid
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  School, SupervisionReport, UserRole, IndicatorScore, AIAnalysisResult, SignatureData, ActivityPhoto 
} from "./types";
import { 
  initialSchools, initialSupervisors, defaultClassroomScores, defaultActiveLearningScores 
} from "./initialData";

// Importing views
import DashboardView from "./components/DashboardView";
import ReportFormView from "./components/ReportFormView";
import AllReportsView from "./components/AllReportsView";
import SchoolsManagerView from "./components/SchoolsManagerView";
import OfficialPrintReport from "./components/OfficialPrintReport";

// Standard preloaded mock reports with high-fidelity academic content
const createInitialMockReports = (schoolsList: School[]): SupervisionReport[] => [
  {
    id: "report-mock-1",
    status: "Approved",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    summary: "การจัดบรรยากาศชั้นเรียนทำได้ดีเยี่ยม มีมุมส่งเสริมการอ่านที่เป็นระเบียบเรียบร้อย นักเรียนให้ความร่วมมือและมีความสนใจในกิจกรรม Active Learning เป็นอย่างดี ครูใช้แผนการสอนสอดคล้องตามตัวชี้วัด",
    basicInfo: {
      schoolId: schoolsList[0]?.id || "school-1",
      schoolName: schoolsList[0]?.name || "บ้านลอง (ฟองจันทร์ราษฎร์อุปถัมภ์)",
      grade: "ป.3/2",
      date: "28 มิ.ย. 2569",
      time: "09:30",
      academicYear: "2569",
      semester: "1",
      round: "1",
      teachers: ["นางวิไลรัตน์ มิตรภาพ", "นายธนวัฒน์ สุขดี", "นางสาวนภา ใจเด็ด"],
      primarySupervisor: "นายพิชญุตม์ คงทอง",
      coSupervisors: ["นายพีรวัฒน์ ดีพอ"],
      subject: "วิชาคณิตศาสตร์ (การบวกลบเศษส่วนด้วยกิจกรรมสื่อทำมือ)"
    },
    classroomScores: [
      { index: 1, name: "ความสะอาดและความปลอดภัย", score: 5, note: "ห้องสะอาดมาก ไม่มีขยะ" },
      { index: 2, name: "บรรยากาศส่งเสริมการเรียนรู้", score: 5, note: "มีแสงสว่างพอดี" },
      { index: 3, name: "สัญลักษณ์ชาติ ศาสนา พระมหากษัตริย์", score: 5, note: "จัดวางครบถ้วนถูกต้อง" },
      { index: 4, name: "ป้ายชื่อและข้อมูลห้องเรียน", score: 4, note: "" },
      { index: 5, name: "ข้อตกลงในห้องเรียน", score: 5, note: "" },
      { index: 6, name: "มุมแสดงผลงานนักเรียน", score: 5, note: "มีผลงานศิลปะนักเรียนแขวนเป็นระเบียบ" },
      { index: 7, name: "ตารางกิจกรรมและตารางสอน", score: 4, note: "" },
      { index: 8, name: "สื่อและเทคโนโลยี", score: 5, note: "ใช้ Smart TV ร่วมกับแท็บเล็ตได้ดี" },
      { index: 9, name: "ระบบดูแลช่วยเหลือนักเรียน", score: 4, note: "" },
      { index: 10, name: "มุมส่งเสริมการอ่าน", score: 5, note: "มีหนังสือการ์ตูนความรู้และนิยายคุณธรรมหลากหลาย" },
      { index: 11, name: "ป้ายนิเทศและการตกแต่ง", score: 4, note: "" },
      { index: 12, name: "แผนการจัดการเรียนรู้", score: 5, note: "แผนสอดคล้อง 100%" }
    ],
    activeLearningScores: [
      { index: 1, name: "แผนการสอนสอดคล้องมาตรฐาน", score: 4 },
      { index: 2, name: "ออกแบบกิจกรรม Active Learning", score: 4 },
      { index: 3, name: "ผู้เรียนมีส่วนร่วม", score: 4 },
      { index: 4, name: "ส่งเสริมการคิดวิเคราะห์", score: 3 },
      { index: 5, name: "ใช้สื่อเหมาะสม", score: 4 },
      { index: 6, name: "ใช้นวัตกรรมสนับสนุนการเรียนรู้", score: 3 },
      { index: 7, name: "ประเมินตามสภาพจริง", score: 4 },
      { index: 8, name: "ใช้ข้อมูลสะท้อนผลการเรียนรู้", score: 3 },
      { index: 9, name: "ห้องเรียนเชิงบวก", score: 4 },
      { index: 10, name: "ส่งเสริมการเรียนรู้ร่วมกัน", score: 4 }
    ],
    aiAnalysis: {
      strengths: "1. การจัดสภาพแวดล้อมที่กระตุ้นความสนใจ: ห้องเรียนมีความสว่าง สะอาด และปลอดภัยเป็นเลิศ มีการจัดมุมส่งเสริมการอ่านที่เป็นมิตรดึงดูดผู้เรียนได้เป็นอย่างดี\n2. การจัดกิจกรรมบูรณาการสื่อทำมือ: ครูสามารถนำกิจกรรมสื่อประดิษฐ์มาอธิบายเรื่องเศษส่วนได้อย่างเป็นรูปธรรม ทำให้ผู้เรียนเห็นภาพและเข้าใจอย่างลึกซึ้ง\n3. ปฏิสัมพันธ์เชิงบวกระหว่างเรียน: ผู้เรียนมีความกระตือรือร้นและทำงานเป็นกลุ่มร่วมกันได้อย่างมีประสิทธิภาพสูง",
      developmentAreas: "1. การใช้คำถามเชิงรุกกระตุ้นการคิดวิเคราะห์: ควรเพิ่มระดับการใช้คำถามปลายเปิด (Open-ended questions) เพื่อยกระดับทักษะการคิดวิเคราะห์ของนักเรียนระดับสูง\n2. การบริหารเวลาในการทำกิจกรรมกลุ่ม: มีนักเรียนบางกลุ่มยังทำกิจกรรมไม่ทันเวลาตามที่กำหนดในแผนการจัดกิจกรรม",
      recommendations: "1. แนะนำให้นำ 'โมเดลการตั้งคำถามหมวก 6 ใบ' (De Bono's Six Thinking Hats) มาประยุกต์ใช้เพื่อฝึกพฤติกรรมการคิดอย่างรอบด้าน\n2. ครูควรแบ่งปันนวัตกรรมการจัดกิจกรรมสื่อทำมือคณิตศาสตร์นี้ผ่านคลังสื่อดิจิทัลกลางของ สพป.แพร่ เขต 1 เพื่อเผยแพร่แก่โรงเรียนอื่นในเครือข่าย",
      coachingFeedback: "ครูวิไลรัตน์ มีจิตวิญญาณความเป็นครูและทักษะการสร้างสรรค์สื่อที่โดดเด่นมาก การนิเทศเน้นการสะท้อนคิดชื่นชมเพื่อต่อยอดขวัญกำลังใจ และชวนวิเคราะห์ร่วมกันเพื่อปรับปรุงด้านการตั้งคำถามในชั้นเรียน",
      developmentPlan: "1. จัดชั่วโมง PLC ภายในกลุ่มวิชาคณิตศาสตร์เพื่อปรับปรุงคำถามปลายเปิดในแผนการเรียนรู้\n2. พัฒนาระบบประเมินตนเองของผู้เรียน (Student Self-Assessment) เพื่อให้นักเรียนเข้าใจจุดบกพร่องและตั้งเป้าหมายได้เอง",
      executiveSummary: "เป็นห้องเรียนคุณภาพต้นแบบเกรดเยี่ยมของโรงเรียนบ้านลอง เหมาะสำหรับจัดการศึกษาดูงาน แนะนำผู้บริหารเห็นชอบผลประเมินในระดับดีเยี่ยม และจัดทำเกียรติบัตรรับรองความดีความชอบทางวิชาการต่อไป"
    },
    signatures: {
      primarySupervisor: {
        roleTitle: "ผู้นิเทศหลัก",
        name: "นายพิชญุตม์ คงทอง",
        signed: true,
        date: "28 มิ.ย. 2569",
        signatureImage: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='30'><path d='M10 20 C25 5, 45 15, 60 5 C75 10, 85 25, 95 15' stroke='blue' stroke-width='2' fill='none'/></svg>"
      },
      teachers: [
        {
          roleTitle: "ครูผู้รับการนิเทศ",
          name: "นางวิไลรัตน์ มิตรภาพ",
          signed: true,
          date: "28 มิ.ย. 2569",
          signatureImage: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='30'><path d='M5 15 C30 2, 50 12, 70 8 C80 18, 90 2, 95 10' stroke='darkblue' stroke-width='2' fill='none'/></svg>"
        }
      ]
    },
    photos: []
  },
  {
    id: "report-mock-2",
    status: "Submitted",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    summary: "กิจกรรมวิทยาศาสตร์ ม.2 เน้นกิจกรรมการจำลองกลุ่มดาว ผู้เรียนตื่นตัว ได้ปฏิบัติตามกระบวนการทางวิทยาศาสตร์ครบถ้วน แต่อุปกรณ์ทดลองมีจำกัด ส่งผลให้กลุ่มนักเรียนมีขนาดใหญ่เกินไป",
    basicInfo: {
      schoolId: schoolsList[1]?.id || "school-2",
      schoolName: schoolsList[1]?.name || "วัดทุ่งล้อม (ทองประชานะเคราะห์)",
      grade: "ม.2/1",
      date: "29 มิ.ย. 2569",
      time: "13:00",
      academicYear: "2569",
      semester: "1",
      round: "1",
      teachers: ["นางสาวกมลวรรณ ดวงใจ", "นายทศพล เจริญสุข", "นางใจดี อารีชอบ"],
      primarySupervisor: "นายพีรวัฒน์ ดีพอ",
      coSupervisors: ["นายชัยพิสิษฐ์ เพชรอมรเมธากุล"],
      subject: "วิชาวิทยาศาสตร์ (การจำลองกลุ่มดาวและระบบสุริยะ)"
    },
    classroomScores: [
      { index: 1, name: "ความสะอาดและความปลอดภัย", score: 4, note: "" },
      { index: 2, name: "บรรยากาศส่งเสริมการเรียนรู้", score: 4, note: "" },
      { index: 3, name: "สัญลักษณ์ชาติ ศาสนา พระมหากษัตริย์", score: 5, note: "" },
      { index: 4, name: "ป้ายชื่อและข้อมูลห้องเรียน", score: 4, note: "" },
      { index: 5, name: "ข้อตกลงในห้องเรียน", score: 4, note: "" },
      { index: 6, name: "มุมแสดงผลงานนักเรียน", score: 4, note: "" },
      { index: 7, name: "ตารางกิจกรรมและตารางสอน", score: 4, note: "" },
      { index: 8, name: "สื่อและเทคโนโลยี", score: 4, note: "" },
      { index: 9, name: "ระบบดูแลช่วยเหลือนักเรียน", score: 4, note: "" },
      { index: 10, name: "มุมส่งเสริมการอ่าน", score: 4, note: "" },
      { index: 11, name: "ป้ายนิเทศและการตกแต่ง", score: 4, note: "" },
      { index: 12, name: "แผนการจัดการเรียนรู้", score: 4, note: "" }
    ],
    activeLearningScores: [
      { index: 1, name: "แผนการสอนสอดคล้องมาตรฐาน", score: 3 },
      { index: 2, name: "ออกแบบกิจกรรม Active Learning", score: 4 },
      { index: 3, name: "ผู้เรียนมีส่วนร่วม", score: 3 },
      { index: 4, name: "ส่งเสริมการคิดวิเคราะห์", score: 3 },
      { index: 5, name: "ใช้สื่อเหมาะสม", score: 3 },
      { index: 6, name: "ใช้นวัตกรรมสนับสนุนการเรียนรู้", score: 3 },
      { index: 7, name: "ประเมินตามสภาพจริง", score: 4 },
      { index: 8, name: "ใช้ข้อมูลสะท้อนผลการเรียนรู้", score: 3 },
      { index: 9, name: "ห้องเรียนเชิงบวก", score: 4 },
      { index: 10, name: "ส่งเสริมการเรียนรู้ร่วมกัน", score: 3 }
    ],
    aiAnalysis: {
      strengths: "1. การจัดกิจกรรมทดลองที่ลงมือทำจริง: นักเรียนได้รับการกระตุ้นความสนใจผ่านโมเดลทดลองวิทยาศาสตร์เชิงกายภาพ\n2. เกณฑ์การประเมินที่วัดทักษะปฏิบัติชัดเจน: ครูมีรูบริกส์ (Rubrics) สำหรับให้คะแนนทักษะกระบวนการวิจัยทางวิทยาศาสตร์ได้อย่างละเอียดรอบคอบ",
      developmentAreas: "1. สื่อเทคโนโลยีแบบ 3 มิติ: ควรนำโปรแกรมจำลองดวงดาวเสมือนจริง เช่น Stellarium มาเสริมเพื่อให้เด็กเห็นวงจรจริงได้รอบทิศทาง\n2. การจัดการขนาดกลุ่มของผู้เรียน: การที่นักเรียนทำกิจกรรมกลุ่มละ 7-8 คน ทำให้บางคนไม่ได้จับอุปกรณ์อย่างทั่วถึง",
      recommendations: "1. ควรแบ่งกลุ่มย่อยให้เล็กลงเหลือกลุ่มละไม่เกิน 4-5 คน เพื่อเพิ่มความรับผิดชอบและการสัมผัสอุปกรณ์จริงของทุกคน\n2. นำแอปพลิเคชัน AR (Augmented Reality) ด้านจักรวาลมาผสานเพิ่มในการจัดบรรยากาศห้องเรียนวิทยาศาสตร์",
      coachingFeedback: "ชื่นชมในความทุ่มเทจัดเตรียมโมเดลแบบจำลองดวงดาวอย่างสวยงาม แนะนำวิธีการจัดการห้องแล็บย่อยและการใช้โปรแกรมฟรีแวร์เสริมเพื่อลดภาระค่าจัดทำสื่อของครูลง",
      developmentPlan: "เสนอขอรับงบประมาณจัดซื้อชุดกล้องโทรทรรศน์และเลนส์จำลองระบบสุริยะเพิ่มเติมผ่านกองทุนยกระดับมาตรฐานโรงเรียนวัดทุ่งล้อม",
      executiveSummary: "ผลประเมินอยู่ในเกณฑ์ 'ดีมาก' สมควรได้รับการพิจารณาลงนามรับรองผล เพื่อเก็บเป็นแฟ้มสะสมงานประกอบการประเมินเลื่อนวิทยฐานะของครูอย่างสมบูรณ์แบบต่อไป"
    },
    signatures: {
      primarySupervisor: {
        roleTitle: "ผู้นิเทศหลัก",
        name: "นายพีรวัฒน์ ดีพอ",
        signed: true,
        date: "29 มิ.ย. 2569"
      }
    },
    photos: []
  }
];

export default function App() {
  // Global States
  const [schools, setSchools] = useState<School[]>(initialSchools);
  const [reports, setReports] = useState<SupervisionReport[]>([]);
  const [currentTab, setCurrentTab] = useState<"dashboard" | "create" | "list" | "schools">("dashboard");
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("Super Admin");
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("all"); // School database partition simulation
  const [activeReportIdForPrint, setActiveReportIdForPrint] = useState<string | null>(null);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);

  // Load initial preloaded mock reports on mount
  useEffect(() => {
    setReports(createInitialMockReports(schools));
  }, []);

  // System notification banner
  const [notifications, setNotifications] = useState<string[]>([
    "มีแบบรายงาน 1 ฉบับ รอการพิจารณาอนุมัติจาก ผอ.โรงเรียน",
    "ผลการวิเคราะห์ AI ล่าสุด ประมวลผลเสร็จสิ้นด้วยโมเดล Gemini 3.5-flash"
  ]);

  // Handle adding a new school
  const handleAddSchool = (newSchool: Omit<School, "id">) => {
    const created: School = {
      ...newSchool,
      id: `school-${Date.now()}`,
      isCustom: true
    };
    setSchools([...schools, created]);
  };

  // Handle updating school metadata
  const handleUpdateSchool = (updated: School) => {
    setSchools(schools.map(s => s.id === updated.id ? updated : s));
    
    // Automatically update school name references in existing reports
    setReports(reports.map(r => {
      if (r.basicInfo.schoolId === updated.id) {
        return {
          ...r,
          basicInfo: {
            ...r.basicInfo,
            schoolName: updated.name
          }
        };
      }
      return r;
    }));
  };

  // Handle deleting a school
  const handleDeleteSchool = (schoolId: string) => {
    setSchools(schools.filter(s => s.id !== schoolId));
    // Remove or detach associated reports optionally
    setReports(reports.filter(r => r.basicInfo.schoolId !== schoolId));
  };

  // Handle saving supervision report (Add / Edit)
  const handleSaveReport = (newReport: SupervisionReport) => {
    const exists = reports.some(r => r.id === newReport.id);
    if (exists) {
      setReports(reports.map(r => r.id === newReport.id ? newReport : r));
    } else {
      setReports([newReport, ...reports]);
    }
    setEditingReportId(null);
    setCurrentTab("list");
  };

  // Handle deleting supervision report
  const handleDeleteReport = (reportId: string) => {
    if (confirm("ยืนยันลบแบบรายงานการนิเทศฉบับนี้อย่างถาวรจากระบบคลาวด์?")) {
      setReports(reports.filter(r => r.id !== reportId));
    }
  };

  // Handle quick update report status
  const handleUpdateStatus = (reportId: string, status: SupervisionReport["status"]) => {
    setReports(reports.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));
  };

  const handleEditReport = (reportId: string) => {
    setEditingReportId(reportId);
    setCurrentTab("create");
  };

  const handlePrintReport = (reportId: string) => {
    setActiveReportIdForPrint(reportId);
  };

  // Partitioned reports based on selected School database filter (Multi-school simulation)
  const partitionedReports = reports.filter(r => selectedSchoolId === "all" || r.basicInfo.schoolId === selectedSchoolId);

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* LEFT SIDEBAR (แท็บควบคุมการเข้าถึง) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 relative no-print border-r border-slate-800">
        
        {/* Brand Header - Professional Polish Theme */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">S</div>
            <div className="leading-tight">
              <h1 className="text-white font-bold text-lg leading-none">Smart Supervision</h1>
              <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-wider">Enterprise Edition</p>
            </div>
          </div>
        </div>

        {/* Current Active School partition state selector */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800 space-y-1.5">
          <label className="block text-[9px] font-bold text-slate-500 tracking-wider uppercase">สลับฐานข้อมูลโรงเรียน</label>
          <div className="relative">
            <select
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
              className="appearance-none w-full bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold cursor-pointer"
            >
              <option value="all">🌐 คลังข้อมูลทุกโรงเรียน</option>
              {schools.map(s => (
                <option key={s.id} value={s.id}>🏫 {s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation links - Professional Polish style */}
        <nav className="flex-1 p-4 space-y-1">
          {/* Dashboard */}
          <button
            onClick={() => { setCurrentTab("dashboard"); setEditingReportId(null); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              currentTab === "dashboard" && !editingReportId
                ? "bg-blue-600 text-white" 
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            <span>Dashboard</span>
          </button>

          {/* Create report */}
          <button
            onClick={() => { setCurrentTab("create"); setEditingReportId(null); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              currentTab === "create" || editingReportId
                ? "bg-blue-600 text-white" 
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <PlusCircle className="h-5 w-5 shrink-0" />
            <span>{editingReportId ? "แก้ไขรายงานนิเทศ" : "สร้างรายงานนิเทศใหม่"}</span>
          </button>

          {/* All reports list */}
          <button
            onClick={() => { setCurrentTab("list"); setEditingReportId(null); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              currentTab === "list" && !editingReportId
                ? "bg-blue-600 text-white" 
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-5 w-5 shrink-0" />
              <span>รายการนิเทศทั้งหมด</span>
            </div>
            <span className="bg-slate-700 text-slate-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {partitionedReports.length}
            </span>
          </button>

          {/* Schools management CRUD */}
          <button
            onClick={() => { setCurrentTab("schools"); setEditingReportId(null); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              currentTab === "schools" && !editingReportId
                ? "bg-blue-600 text-white" 
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Building2 className="h-5 w-5 shrink-0" />
            <span>ข้อมูลโรงเรียน</span>
          </button>

          {/* Theme Decorative Modules Section */}
          <div className="pt-4 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Modules</div>
          <div className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-medium">ห้องเรียนคุณภาพ</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
            <span className="text-sm font-medium">Active Learning</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium">AI วิเคราะห์ผล</span>
          </div>
        </nav>

        {/* User Role Quick Test Selector */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-850 space-y-2">
          <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
            <span>บทบาทจำลองผู้ใช้งาน (RBAC)</span>
            <span className="bg-blue-500/20 text-blue-400 px-1 rounded">Security: ON</span>
          </div>

          <div className="relative">
            <select
              value={currentUserRole}
              onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
              className="appearance-none w-full bg-slate-900 border border-slate-800 text-blue-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold cursor-pointer"
            >
              <option value="Super Admin">🛡️ Super Admin</option>
              <option value="Admin โรงเรียน">🏫 Admin โรงเรียน</option>
              <option value="ผู้อำนวยการโรงเรียน">🎓 ผู้อำนวยการโรงเรียน</option>
              <option value="คณะผู้นิเทศ">🔍 คณะผู้นิเทศ</option>
              <option value="ครูผู้รับการนิเทศ">✏️ ครูผู้รับการนิเทศ</option>
            </select>
          </div>

          <div className="text-[10px] text-slate-400 leading-normal bg-slate-900/60 p-2 rounded-lg border border-slate-800/40 mt-1">
            <p className="font-semibold text-slate-300">สิทธิ์ในการอนุมัติ:</p>
            <p className="mt-0.5">
              {currentUserRole === "Super Admin" || currentUserRole === "Admin โรงเรียน" || currentUserRole === "ผู้อำนวยการโรงเรียน"
                ? "● มีสิทธิ์อนุมัติ/ปฏิเสธแบบนิเทศ"
                : "○ ดูได้อย่างเดียว / รอความเห็นชอบ"}
            </p>
          </div>
        </div>

        {/* Footer info in professional theme style */}
        <div className="p-4 mt-auto border-t border-slate-800">
          <div className="bg-slate-800 rounded-lg p-3 text-slate-400 text-xs border border-slate-700">
            <p className="mb-1">สพป.แพร่ เขต 1</p>
            <p className="font-medium text-slate-200">ปีการศึกษา 2569 / เทอม 1</p>
          </div>
        </div>

      </aside>

      {/* RIGHT WORKSPACE PANELS */}
      <main className="flex-1 overflow-y-auto flex flex-col min-w-0">
        
        {/* Top Navbar Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-8 shrink-0 no-print">
          
          {/* Left info title */}
          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-50 text-slate-600 px-2.5 py-1.5 border border-slate-200/50 rounded-xl font-bold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              เชื่อมต่อ Cloud สำเร็จ
            </span>

            {/* Notification alert banner */}
            <div className="hidden lg:flex items-center gap-2 max-w-sm">
              <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-2 py-0.5 rounded shrink-0">แจ้งเตือนระบบ</span>
              <p className="text-xs text-slate-500 font-semibold truncate">{notifications[0]}</p>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-extrabold text-slate-800">ระบบนิเทศอัจฉริยะ (AI-Powered)</p>
              <p className="text-[10px] text-slate-400 font-bold font-mono">{currentUserRole.toUpperCase()}</p>
            </div>
            
            <div className="h-9 w-9 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center shadow-inner">
              {currentUserRole.substring(0, 2)}
            </div>
          </div>

        </header>

        {/* Dynamic content rendering frame */}
        <div className="flex-1 p-6 md:p-8 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* If printable view modal is open, overlay it */}
            {activeReportIdForPrint ? (
              <motion.div
                key="print-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <OfficialPrintReport
                  reportId={activeReportIdForPrint}
                  reports={reports}
                  schools={schools}
                  onClose={() => setActiveReportIdForPrint(null)}
                />
              </motion.div>
            ) : (
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 1. Dashboard Tab */}
                {currentTab === "dashboard" && (
                  <DashboardView 
                    reports={partitionedReports} 
                    schools={schools} 
                    onNavigateToReport={handlePrintReport}
                    onNavigateToCreate={() => { setCurrentTab("create"); }}
                  />
                )}

                {/* 2. Create/Edit Report Form Tab */}
                {currentTab === "create" && (
                  <ReportFormView
                    reportId={editingReportId}
                    reports={reports}
                    schools={schools}
                    onSave={handleSaveReport}
                    onBack={() => { setEditingReportId(null); setCurrentTab("list"); }}
                  />
                )}

                {/* 3. All Reports list with full tables */}
                {currentTab === "list" && (
                  <AllReportsView
                    reports={partitionedReports}
                    schools={schools}
                    currentUserRole={currentUserRole}
                    onEditReport={handleEditReport}
                    onDeleteReport={handleDeleteReport}
                    onPrintReport={handlePrintReport}
                    onUpdateStatus={handleUpdateStatus}
                  />
                )}

                {/* 4. Schools list CRUD */}
                {currentTab === "schools" && (
                  <SchoolsManagerView
                    schools={schools}
                    reports={reports}
                    onAddSchool={handleAddSchool}
                    onUpdateSchool={handleUpdateSchool}
                    onDeleteSchool={handleDeleteSchool}
                  />
                )}

              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Status Bar - Professional Polish Theme */}
        <footer className="h-8 bg-slate-100 border-t border-slate-200 px-6 flex items-center justify-between text-[10px] text-slate-500 font-medium shrink-0 no-print">
          <div className="flex items-center gap-4">
            <span>Status: <span className="text-emerald-600 font-bold">● Connected (Firestore Live)</span></span>
            <span>Server: BKK-01-PRIMARY</span>
          </div>
          <div>© 2026 Smart Supervision AI | Phrae Education Service Area 1</div>
        </footer>

      </main>

    </div>
  );
}
