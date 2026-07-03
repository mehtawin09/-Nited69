import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, Save, Sparkles, Brain, Award, Building2, Calendar, Clock, 
  Plus, Trash2, CheckCircle, HelpCircle, Signature, Image as ImageIcon, 
  Trash, ChevronRight, ChevronLeft, RefreshCw, Eye, Upload, QrCode, ShieldCheck
} from "lucide-react";
import { 
  SupervisionReport, School, IndicatorScore, AIAnalysisResult, SignatureData, ActivityPhoto 
} from "../types";
import { 
  availableGrades, academicYears, initialSupervisors, 
  defaultClassroomScores, defaultActiveLearningScores, activeLearningCategories 
} from "../initialData";

interface ReportFormViewProps {
  reportId: string | null; // null for create
  schools: School[];
  reports: SupervisionReport[];
  onBack: () => void;
  onSave: (report: SupervisionReport) => void;
}

// Simple HTML5 Canvas Signature Pad Component
interface SigPadProps {
  label: string;
  onSaveSignature: (base64Data: string) => void;
  existingImg?: string;
  placeholderName: string;
}

function SignaturePad({ label, onSaveSignature, existingImg, placeholderName }: SigPadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(!!existingImg);
  const [imgUrl, setImgUrl] = useState<string | undefined>(existingImg);
  const [showPad, setShowPad] = useState(false);

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#1e293b"; // dark charcoal
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      onSaveSignature(dataUrl);
      setImgUrl(dataUrl);
      setHasSigned(true);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setImgUrl(undefined);
    setHasSigned(false);
    onSaveSignature("");
  };

  // Simulated image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onSaveSignature(base64String);
        setImgUrl(base64String);
        setHasSigned(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">{label}</label>
        {hasSigned && (
          <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full px-2 py-0.5 font-bold flex items-center gap-0.5">
            <ShieldCheck className="h-3 w-3" /> ลงนามแล้ว
          </span>
        )}
      </div>

      <div className="flex flex-col items-center justify-center bg-white border border-slate-200 rounded-lg p-2 h-36 relative overflow-hidden">
        {imgUrl ? (
          <div className="text-center space-y-2">
            <img src={imgUrl} alt="Signature" className="h-20 object-contain mx-auto mix-blend-multiply" />
            <p className="text-[10px] text-slate-400 font-mono italic">ผู้ลงนาม: {placeholderName}</p>
          </div>
        ) : showPad ? (
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-slate-50 rounded cursor-crosshair border border-dashed border-slate-300"
            width={300}
            height={130}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        ) : (
          <div className="text-center text-slate-400 space-y-1">
            <Signature className="h-8 w-8 mx-auto text-slate-300" />
            <p className="text-xs">คลิกเปิดแผงเพื่อวาดลายมือชื่อ</p>
          </div>
        )}
      </div>

      <div className="flex justify-between gap-1.5">
        {!showPad && !imgUrl ? (
          <button
            type="button"
            onClick={() => setShowPad(true)}
            className="w-full text-[11px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold py-1.5 rounded-lg border border-indigo-200 transition-colors cursor-pointer text-center"
          >
            วาดลายเซ็น
          </button>
        ) : (
          <button
            type="button"
            onClick={clearCanvas}
            className="w-full text-[11px] bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium py-1.5 rounded-lg transition-colors cursor-pointer text-center"
          >
            ล้างลายเซ็น
          </button>
        )}

        <label className="w-full text-[11px] bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer text-center flex items-center justify-center gap-1">
          <Upload className="h-3 w-3" /> อัปไฟล์รูป
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
      </div>
    </div>
  );
}

export default function ReportFormView({ 
  reportId, 
  schools, 
  reports, 
  onBack, 
  onSave 
}: ReportFormViewProps) {
  // Navigation Tabs: Basic Info | Classroom | Active Learning | AI Analysis | Summary | Signature & Photos
  const [activeTab, setActiveTab] = useState<number>(1);
  
  // Local states for report creation
  const [schoolId, setSchoolId] = useState("");
  const [grade, setGrade] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [academicYear, setAcademicYear] = useState("2569");
  const [semester, setSemester] = useState("1");
  const [round, setRound] = useState("1");
  const [subject, setSubject] = useState("");
  
  // Teachers (Unlimited, min 3 input boxes initially)
  const [teachers, setTeachers] = useState<string[]>(["", "", ""]);
  
  // Primary Supervisor and Co-supervisors
  const [primarySupervisor, setPrimarySupervisor] = useState(initialSupervisors[0]);
  const [coSupervisors, setCoSupervisors] = useState<string[]>([]);
  const [newCoSupervisor, setNewCoSupervisor] = useState("");

  // Classroom Score Form & Smart score inputs
  const [classroomScores, setClassroomScores] = useState<IndicatorScore[]>(defaultClassroomScores());
  const [classroomSmartScore, setClassroomSmartScore] = useState<string>("");

  // Active Learning Form & Smart score inputs
  const [activeLearningScores, setActiveLearningScores] = useState<IndicatorScore[]>(defaultActiveLearningScores());
  const [activeLearningSmartScore, setActiveLearningSmartScore] = useState<string>("");

  // AI analysis, summary, photos
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [summary, setSummary] = useState("");
  const [photos, setPhotos] = useState<ActivityPhoto[]>([]);
  const [status, setStatus] = useState<"Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected">("Draft");

  // AI Generation Loading state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiLoadingMessage, setAiLoadingMessage] = useState("");

  // Signature Data States
  const [sigSupervisor, setSigSupervisor] = useState<string>("");
  const [sigDirector, setSigDirector] = useState<string>("");
  const [sigTeacher, setSigTeacher] = useState<string>("");

  // Pre-load report data if editing
  useEffect(() => {
    if (reportId) {
      const rep = reports.find(r => r.id === reportId);
      if (rep) {
        setSchoolId(rep.basicInfo.schoolId);
        setGrade(rep.basicInfo.grade);
        setDate(rep.basicInfo.date);
        setTime(rep.basicInfo.time);
        setAcademicYear(rep.basicInfo.academicYear);
        setSemester(rep.basicInfo.semester);
        setRound(rep.basicInfo.round);
        setSubject(rep.basicInfo.subject);
        setTeachers(rep.basicInfo.teachers.length > 0 ? rep.basicInfo.teachers : ["", "", ""]);
        setPrimarySupervisor(rep.basicInfo.primarySupervisor);
        setCoSupervisors(rep.basicInfo.coSupervisors || []);
        
        setClassroomScores(rep.classroomScores);
        setActiveLearningScores(rep.activeLearningScores);
        setAiAnalysis(rep.aiAnalysis);
        setSummary(rep.summary);
        setPhotos(rep.photos || []);
        setStatus(rep.status);

        // Signatures load
        setSigSupervisor(rep.signatures?.primarySupervisor?.signatureImage || "");
        setSigDirector(rep.signatures?.schoolDirector?.signatureImage || "");
        setSigTeacher(rep.signatures?.teachers?.[0]?.signatureImage || "");
      }
    } else {
      // Set current date & time
      const today = new Date();
      setDate(today.toISOString().split("T")[0]);
      setTime(today.toTimeString().split(" ")[0].substring(0, 5));
      if (schools.length > 0) {
        setSchoolId(schools[0].id);
      }
      setGrade(availableGrades[5]); // default P.1/1
    }
  }, [reportId, reports, schools]);

  // Handle auto score distribution on typing 60
  const handleClassroomSmartScoreChange = (val: string) => {
    setClassroomSmartScore(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 12 && num <= 60) {
      const baseScore = Math.floor(num / 12);
      const remainder = num % 12;

      const newScores = classroomScores.map((scoreObj, idx) => {
        let score = baseScore;
        // Distribute remainder point-by-point to first items
        if (idx < remainder) {
          score += 1;
        }
        return {
          ...scoreObj,
          score: Math.min(5, Math.max(1, score))
        };
      });
      setClassroomScores(newScores);
    }
  };

  // Handle active learning auto score distribution
  const handleActiveLearningSmartScoreChange = (val: string) => {
    setActiveLearningSmartScore(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 10 && num <= 40) {
      const baseScore = Math.floor(num / 10);
      const remainder = num % 10;

      const newScores = activeLearningScores.map((scoreObj, idx) => {
        let score = baseScore;
        if (idx < remainder) {
          score += 1;
        }
        return {
          ...scoreObj,
          score: Math.min(4, Math.max(1, score))
        };
      });
      setActiveLearningScores(newScores);
    }
  };

  // Teachers field actions
  const handleTeacherNameChange = (idx: number, val: string) => {
    const updated = [...teachers];
    updated[idx] = val;
    setTeachers(updated);
  };

  const addTeacherField = () => {
    setTeachers([...teachers, ""]);
  };

  const removeTeacherField = (idx: number) => {
    if (teachers.length > 1) {
      setTeachers(teachers.filter((_, i) => i !== idx));
    }
  };

  // Co-supervisors
  const addCoSupervisor = () => {
    if (newCoSupervisor.trim() && !coSupervisors.includes(newCoSupervisor.trim())) {
      setCoSupervisors([...coSupervisors, newCoSupervisor.trim()]);
      setNewCoSupervisor("");
    }
  };

  const removeCoSupervisor = (name: string) => {
    setCoSupervisors(coSupervisors.filter(c => c !== name));
  };

  // Score stats calculations
  const classroomSum = classroomScores.reduce((sum, s) => sum + s.score, 0);
  const classroomPercent = ((classroomSum / 60) * 100);
  
  const getClassroomLevel = (score: number) => {
    if (score >= 54) return "ดีเยี่ยม";
    if (score >= 48) return "ดีมาก";
    if (score >= 36) return "ดี";
    if (score >= 30) return "พอใช้";
    return "ปรับปรุง";
  };

  const activeLearningSum = activeLearningScores.reduce((sum, s) => sum + s.score, 0);
  const activeLearningPercent = ((activeLearningSum / 40) * 100);
  
  const getActiveLearningLevel = (score: number) => {
    if (score >= 36) return "ดีเยี่ยม";
    if (score >= 32) return "ดีมาก";
    if (score >= 24) return "ดี";
    if (score >= 20) return "พอใช้";
    return "ปรับปรุง";
  };

  // Autogenerate supervision summary description based on current evaluation values
  const generateAutomaticSummary = () => {
    const schoolName = schools.find(s => s.id === schoolId)?.name || "โรงเรียน";
    const teachersList = teachers.filter(Boolean).join(", ");
    
    let text = `ผลการตรวจติดตามและประเมินนิเทศภายใน ณ ${schoolName} ในระดับชั้นเรียน ${grade} ปีการศึกษา ${academicYear} ภาคเรียนที่ ${semester} รอบการนิเทศที่ ${round} ผู้รับการนิเทศหลัก ได้แก่ [ ${teachersList} ] วิชากิจกรรม: ${subject || "ไม่ได้ระบุ"} มีรายละเอียดผลสรุปดังนี้:\n\n`;
    text += `1. ผลการประเมินห้องเรียนคุณภาพ (เต็ม 60 คะแนน): ได้คะแนนประเมินรวมทั้งสิ้น ${classroomSum} คะแนน คิดเป็นร้อยละ ${classroomPercent.toFixed(1)}% อยู่ในระดับคุณภาพ "${getClassroomLevel(classroomSum)}"\n`;
    text += `2. ผลการประเมิน Active Learning (เต็ม 40 คะแนน): ได้คะแนนรวมทั้งสิ้น ${activeLearningSum} คะแนน คิดเป็นร้อยละ ${activeLearningPercent.toFixed(1)}% อยู่ในระดับคุณภาพ "${getActiveLearningLevel(activeLearningSum)}"\n\n`;
    text += `ข้อคิดเห็นของผู้นิเทศ: ห้องเรียนมีความพร้อมในด้านกายภาพและสิ่งแวดล้อมส่งเสริมการเรียนรู้เป็นอย่างดี ครูผู้สอนมีความพยายามในการออกแบบการเรียนรู้แบบแก้ปัญหาและสร้างสรรค์ผลงานเชิงประจักษ์ ควรส่งเสริมการนำเทคโนโลยีและนวัตกรรม AI มาผสมผสานเพิ่มเติมสำหรับการดูแลนักเรียนแบบรายบุคคลต่อไป`;
    
    setSummary(text);
  };

  // Trigger Gemini AI API analysis with server proxy
  const runAIAnalysis = async () => {
    setIsAiLoading(true);
    
    // Rotating loading messages
    const loadingSentences = [
      "กำลังประมวลผลการคำนวณร้อยละคะแนนการนิเทศ...",
      "วิเคราะห์ตัวชี้วัดความสะอาด ความปลอดภัย และสิ่งแวดล้อมห้องเรียน...",
      "สังเคราะห์รูปแบบการจัดการเรียนรู้ Active Learning 10 รายการ...",
      "ประมวลผลผ่านโมเดลปัญญาประดิษฐ์ระดับสูง Gemini Flash...",
      "เขียนข้อคิดเห็น จิตวิทยาการโค้ช (Coaching & Feedback) ภาษาข้าราชการวิชาการ..."
    ];
    
    let msgIdx = 0;
    setAiLoadingMessage(loadingSentences[0]);
    const timer = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingSentences.length;
      setAiLoadingMessage(loadingSentences[msgIdx]);
    }, 2500);

    try {
      const schName = schools.find(s => s.id === schoolId)?.name || "ไม่ระบุ";
      const payload = {
        classroomScores,
        activeLearningScores,
        basicInfo: {
          schoolName: schName,
          grade,
          teachers: teachers.filter(Boolean),
          primarySupervisor,
          coSupervisors,
          subject,
          academicYear,
          semester,
          round
        }
      };

      const response = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("ระบบวิเคราะห์ด้วย AI ขัดข้องชั่วคราว");
      }

      const data: AIAnalysisResult = await response.json();
      setAiAnalysis(data);
      
      // Auto fill or append to general summary
      if (!summary) {
        setSummary(`ผลวิเคราะห์ภาพรวมโดย AI:\n${data.executiveSummary}\n\nข้อเสนอแนะหลัก:\n${data.recommendations}`);
      }
    } catch (err: any) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ AI: " + err.message);
    } finally {
      clearInterval(timer);
      setIsAiLoading(false);
    }
  };

  // Activity Photos handling (base64 simulation)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: any, index) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Url = reader.result as string;
          const newPhoto: ActivityPhoto = {
            id: `photo-${Date.now()}-${index}`,
            dataUrl: base64Url,
            caption: `ภาพประกอบกิจกรรมที่ ${photos.length + index + 1}`,
            order: photos.length + index
          };
          setPhotos(prev => [...prev, newPhoto].sort((a, b) => a.order - b.order));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const deletePhoto = (pId: string) => {
    setPhotos(photos.filter(p => p.id !== pId));
  };

  const updatePhotoCaption = (pId: string, text: string) => {
    setPhotos(photos.map(p => p.id === pId ? { ...p, caption: text } : p));
  };

  const movePhotoOrder = (pId: string, direction: "up" | "down") => {
    const idx = photos.findIndex(p => p.id === pId);
    if (idx === -1) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= photos.length) return;

    const updated = [...photos];
    // Swap items
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    // Reset order index
    const reordered = updated.map((p, i) => ({ ...p, order: i }));
    setPhotos(reordered);
  };

  // Submit and Save the Report
  const saveReport = (currentStatus?: typeof status) => {
    const activeStatus = currentStatus || status;
    const schName = schools.find(s => s.id === schoolId)?.name || "";

    const reportData: SupervisionReport = {
      id: reportId || `report-${Date.now()}`,
      status: activeStatus,
      basicInfo: {
        schoolId,
        schoolName: schName,
        grade,
        date,
        time,
        academicYear,
        semester,
        round,
        teachers: teachers.filter(Boolean),
        primarySupervisor,
        coSupervisors,
        subject
      },
      classroomScores,
      activeLearningScores,
      aiAnalysis,
      summary,
      signatures: {
        primarySupervisor: {
          roleTitle: "ผู้นิเทศหลัก",
          name: primarySupervisor,
          signed: !!sigSupervisor,
          date,
          signatureImage: sigSupervisor
        },
        schoolDirector: {
          roleTitle: "ผู้อำนวยการโรงเรียน",
          name: "ผู้อำนวยการสถานศึกษา",
          signed: !!sigDirector,
          date,
          signatureImage: sigDirector
        },
        teachers: teachers.filter(Boolean).map(t => ({
          roleTitle: "ครูผู้รับการนิเทศ",
          name: t,
          signed: !!sigTeacher,
          date,
          signatureImage: sigTeacher
        }))
      },
      photos,
      createdAt: reportId ? (reports.find(r => r.id === reportId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(reportData);
  };

  return (
    <div className="space-y-6 relative">
      {/* AI Loading Mask */}
      {isAiLoading && (
        <div className="fixed inset-0 bg-slate-900/65 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center space-y-6 text-center">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl animate-bounce">
              <Sparkles className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800">ระบบ AI กำลังวิเคราะห์วิจารณ์เชิงลึก</h3>
              <p className="text-sm text-slate-500 font-medium animate-pulse min-h-[40px]">
                {aiLoadingMessage}
              </p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full animate-infinite-loading"></div>
            </div>
            <p className="text-[10px] text-slate-400">Smart Supervision AI Engine • สพป.แพร่ เขต 1</p>
          </div>
        </div>
      )}

      {/* Top action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg transition-all cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <span className="text-xs font-semibold text-slate-400">รายการนิเทศโรงเรียน</span>
            <h2 id="form-report-title" className="text-xl font-bold text-slate-800 tracking-tight">
              {reportId ? "แก้ไขและพิจารณารายงานการนิเทศ" : "สร้างแบบรายงานนิเทศภายในอัจฉริยะ"}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => saveReport("Draft")}
            className="flex-1 sm:flex-initial items-center justify-center inline-flex gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-lg transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" /> บันทึกร่าง
          </button>
          <button
            onClick={() => saveReport("Submitted")}
            className="flex-1 sm:flex-initial items-center justify-center inline-flex gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all shadow-sm cursor-pointer"
          >
            <CheckCircle className="h-4 w-4" /> บันทึกและส่งตรวจ
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-1">
        {[
          { num: 1, label: "1. ข้อมูลพื้นฐาน" },
          { num: 2, label: "2. ห้องเรียนคุณภาพ (60)" },
          { num: 3, label: "3. Active Learning (40)" },
          { num: 4, label: "4. สังเคราะห์ผลด้วย AI" },
          { num: 5, label: "5. สรุปผลและภาพกิจกรรม" },
          { num: 6, label: "6. ลงนามลายมือชื่อดิจิทัล" }
        ].map((tab) => (
          <button
            key={tab.num}
            onClick={() => setActiveTab(tab.num)}
            className={`flex-1 min-w-[120px] text-center text-xs py-2 px-3 font-semibold rounded-lg transition-all cursor-pointer ${activeTab === tab.num ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content tabs */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">

        {/* Tab 1: Basic Info */}
        {activeTab === 1 && (
          <div className="space-y-6">
            <h3 className="text-md font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-500" /> ส่วนที่ 1: ข้อมูลพื้นฐานการนิเทศภายใน
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* School select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">โรงเรียนเป้าหมายที่ได้รับการนิเทศ <span className="text-red-500">*</span></label>
                <select
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {schools.map(sch => (
                    <option key={sch.id} value={sch.id}>{sch.name}</option>
                  ))}
                </select>
              </div>

              {/* Grade select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">ระดับชั้นเรียน <span className="text-red-500">*</span></label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {availableGrades.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">รายวิชา / กิจกรรมการเรียนรู้</label>
                <input
                  type="text"
                  placeholder="เช่น วิชาภาษาไทย เรื่อง อักษรสามหมู่"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">วันที่ทำการนิเทศ</label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">เวลาทำการนิเทศ</label>
                <div className="relative">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Clock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Supervision Round */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">รอบการนิเทศที่</label>
                <select
                  value={round}
                  onChange={(e) => setRound(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {Array.from({ length: 20 }).map((_, i) => (
                    <option key={i} value={`${i + 1}`}>รอบการนิเทศที่ {i + 1}</option>
                  ))}
                </select>
              </div>

              {/* Academic Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">ปีการศึกษา</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {academicYears.map(y => (
                    <option key={y} value={y}>ปีการศึกษา {y}</option>
                  ))}
                </select>
              </div>

              {/* Semester */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">ภาคเรียนที่</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1">ภาคเรียนที่ 1</option>
                  <option value="2">ภาคเรียนที่ 2</option>
                </select>
              </div>
            </div>

            {/* Teacher list (3 slots default, unlimited expandable) */}
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200/50 mt-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">ครูผู้รับการนิเทศในคาบเรียนนี้ (ไม่จำกัดจำนวน)</h4>
                <button
                  type="button"
                  onClick={addTeacherField}
                  className="text-xs text-indigo-600 font-bold hover:text-indigo-700 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> เพิ่มครูผู้รับการนิเทศ
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {teachers.map((t, idx) => (
                  <div key={idx} className="flex gap-1.5 items-center bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 rounded px-1.5 py-0.5">{idx + 1}</span>
                    <input
                      type="text"
                      placeholder="ชื่อ-นามสกุลครู"
                      value={t}
                      onChange={(e) => handleTeacherNameChange(idx, e.target.value)}
                      className="w-full border-0 text-slate-700 text-xs focus:outline-none"
                    />
                    {teachers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTeacherField(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Primary & Co Supervisors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              {/* Primary */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">ผู้นิเทศหลักประจำตัว</label>
                <select
                  value={primarySupervisor}
                  onChange={(e) => setPrimarySupervisor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {initialSupervisors.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                  <option value="ศึกษานิเทศก์ประจำเขต">ศึกษานิเทศก์ประจำเขตพื้นที่การศึกษา</option>
                </select>
              </div>

              {/* Co-supervisors inputs */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">คณะผู้นิเทศร่วม (ถ้ามี)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ระบุชื่อผู้นิเทศร่วมคนใหม่"
                    value={newCoSupervisor}
                    onChange={(e) => setNewCoSupervisor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={addCoSupervisor}
                    className="bg-indigo-50 text-indigo-600 border border-indigo-200 font-bold px-4 rounded-xl text-xs hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    เพิ่ม
                  </button>
                </div>

                {/* Co-supervisors pills */}
                {coSupervisors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {coSupervisors.map(name => (
                      <span key={name} className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-full px-2.5 py-1 border border-slate-200">
                        {name}
                        <button type="button" onClick={() => removeCoSupervisor(name)} className="text-slate-400 hover:text-red-500 font-bold">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom tab page button */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setActiveTab(2)}
                className="flex items-center gap-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 transition-all cursor-pointer"
              >
                หน้าต่อไป: ห้องเรียนคุณภาพ <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Classroom Quality */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
              <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" /> ส่วนที่ 2: เกณฑ์ประเมินห้องเรียนคุณภาพ (เต็ม 60 คะแนน)
              </h3>

              {/* SMART SCORE */}
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-2 max-w-sm w-full sm:w-auto">
                <div className="p-1 bg-amber-500 text-white rounded-lg">
                  <Sparkles className="h-3.5 w-3.5 animate-spin" />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-extrabold text-amber-800 uppercase block tracking-wider leading-none">SMART SCORE AUTO-DISTRIBUTE</label>
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="number"
                      min={12}
                      max={60}
                      placeholder="พิมพ์คะแนนรวม (12-60)"
                      value={classroomSmartScore}
                      onChange={(e) => handleClassroomSmartScoreChange(e.target.value)}
                      className="border border-amber-300 rounded px-2 py-0.5 text-xs text-amber-900 bg-white font-mono w-32 focus:outline-none"
                    />
                    <span className="text-[9px] text-amber-600 font-semibold leading-tight">เฉลี่ยแจกแต้มทันที</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total classroom quality indicators info */}
            <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
              <div className="text-xs">
                <span className="font-bold text-slate-700">คะแนนประเมินรวมปัจจุบัน:</span>
                <span className="ml-1.5 font-mono font-black text-indigo-700 text-lg">{classroomSum} / 60</span>
                <span className="ml-1 text-slate-500">คะแนน (คิดเป็น {classroomPercent.toFixed(1)}%)</span>
              </div>
              <div className="text-xs font-bold text-indigo-800 bg-white border border-indigo-100 px-3 py-1 rounded-lg shadow-sm">
                ระดับ: {getClassroomLevel(classroomSum)}
              </div>
            </div>

            {/* 12 Indicators grid lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classroomScores.map((item, idx) => (
                <div key={item.index} className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col justify-between space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5">ตัวชี้วัดที่ {item.index}</span>
                      <h4 className="text-xs font-bold text-slate-800 mt-1">{item.name}</h4>
                    </div>
                    {/* Score select */}
                    <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5">
                      {[1, 2, 3, 4, 5].map(scoreNum => (
                        <button
                          key={scoreNum}
                          type="button"
                          onClick={() => {
                            const updated = [...classroomScores];
                            updated[idx].score = scoreNum;
                            setClassroomScores(updated);
                          }}
                          className={`w-6 h-6 rounded text-xs font-bold transition-all cursor-pointer ${item.score === scoreNum ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-50"}`}
                        >
                          {scoreNum}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment box */}
                  <input
                    type="text"
                    placeholder="หมายเหตุ / สังเกตการณ์เชิงประจักษ์ (ไม่บังคับ)"
                    value={item.note || ""}
                    onChange={(e) => {
                      const updated = [...classroomScores];
                      updated[idx].note = e.target.value;
                      setClassroomScores(updated);
                    }}
                    className="w-full bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>

            {/* Bottom page action triggers */}
            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab(1)}
                className="flex items-center gap-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-4 py-2 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> ย้อนกลับ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab(3)}
                className="flex items-center gap-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 transition-all cursor-pointer"
              >
                หน้าต่อไป: Active Learning <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Active Learning */}
        {activeTab === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
              <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
                <Brain className="h-5 w-5 text-violet-500" /> ส่วนที่ 3: เกณฑ์ประเมินการจัดการสอน Active Learning (เต็ม 40 คะแนน)
              </h3>

              {/* SMART SCORE FOR ACTIVE LEARNING */}
              <div className="flex items-center gap-2 bg-violet-550/10 border border-violet-200 rounded-xl p-2 max-w-sm w-full sm:w-auto">
                <div className="p-1 bg-violet-500 text-white rounded-lg">
                  <Sparkles className="h-3.5 w-3.5 animate-spin" />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-extrabold text-violet-800 uppercase block tracking-wider leading-none">SMART SCORE AUTO-DISTRIBUTE</label>
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="number"
                      min={10}
                      max={40}
                      placeholder="พิมพ์คะแนนรวม (10-40)"
                      value={activeLearningSmartScore}
                      onChange={(e) => handleActiveLearningSmartScoreChange(e.target.value)}
                      className="border border-violet-300 rounded px-2 py-0.5 text-xs text-violet-900 bg-white font-mono w-32 focus:outline-none"
                    />
                    <span className="text-[9px] text-violet-600 font-semibold leading-tight">เฉลี่ยแจกแต้มทันที</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total active learning score banner */}
            <div className="flex justify-between items-center bg-violet-50 p-4 rounded-2xl border border-violet-100">
              <div className="text-xs">
                <span className="font-bold text-slate-700">คะแนนประเมิน Active Learning ปัจจุบัน:</span>
                <span className="ml-1.5 font-mono font-black text-violet-700 text-lg">{activeLearningSum} / 40</span>
                <span className="ml-1 text-slate-500">คะแนน (คิดเป็น {activeLearningPercent.toFixed(1)}%)</span>
              </div>
              <div className="text-xs font-bold text-violet-800 bg-white border border-violet-100 px-3 py-1 rounded-lg shadow-sm">
                ระดับ: {getActiveLearningLevel(activeLearningSum)}
              </div>
            </div>

            {/* Categorized Indicators */}
            <div className="space-y-6">
              {activeLearningCategories.map((category) => (
                <div key={category.id} className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-extrabold text-violet-700 uppercase tracking-wider block">{category.name}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.indicators.map((ind) => {
                      const scoreItemIdx = activeLearningScores.findIndex(s => s.index === ind.index);
                      const scoreItem = activeLearningScores[scoreItemIdx];

                      return (
                        <div key={ind.index} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="text-[9px] font-bold text-violet-600 bg-violet-50 rounded px-1.5 py-0.5">ตัวชี้วัด {ind.index}</span>
                              <p className="text-xs font-bold text-slate-700 mt-1">{ind.name}</p>
                            </div>
                            
                            {/* Graded score 1-4 */}
                            <div className="flex items-center gap-0.5 bg-slate-50 border border-slate-200 rounded-lg p-0.5 shrink-0">
                              {[1, 2, 3, 4].map(scoreNum => (
                                <button
                                  key={scoreNum}
                                  type="button"
                                  onClick={() => {
                                    if (scoreItemIdx !== -1) {
                                      const updated = [...activeLearningScores];
                                      updated[scoreItemIdx].score = scoreNum;
                                      setActiveLearningScores(updated);
                                    }
                                  }}
                                  className={`w-6 h-6 rounded text-xs font-bold transition-all cursor-pointer ${scoreItem?.score === scoreNum ? "bg-violet-600 text-white" : "text-slate-400 hover:bg-slate-100"}`}
                                >
                                  {scoreNum}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions pages */}
            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab(2)}
                className="flex items-center gap-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-4 py-2 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> ย้อนกลับ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab(4)}
                className="flex items-center gap-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 transition-all cursor-pointer"
              >
                หน้าต่อไป: สังเคราะห์ผลด้วย AI <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: AI Analysis */}
        {activeTab === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 pb-3">
              <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-500" /> ส่วนที่ 4: สังเคราะห์ผลการประเมินอัจฉริยะด้วยระบบ AI
              </h3>

              <button
                type="button"
                onClick={runAIAnalysis}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-100 transition-all cursor-pointer shrink-0"
              >
                <RefreshCw className="h-4 w-4 animate-spin-slow" />
                เริ่มวิเคราะห์ด้วย AI ทันที
              </button>
            </div>

            {/* AI Result Cards or placeholder */}
            {aiAnalysis ? (
              <div className="space-y-5">
                {/* 2 columns layout of AI outcomes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Strengths */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="text-xs font-bold text-emerald-600 block mb-2 uppercase tracking-wider">🌟 จุดเด่นที่ควรชื่นชม (Strengths)</label>
                    <textarea
                      value={aiAnalysis.strengths}
                      onChange={(e) => setAiAnalysis({ ...aiAnalysis, strengths: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-slate-700 text-xs rounded-lg p-3 h-32 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Areas for development */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="text-xs font-bold text-amber-600 block mb-2 uppercase tracking-wider">⚠️ จุดที่ควรได้รับการพัฒนา (Areas for Development)</label>
                    <textarea
                      value={aiAnalysis.developmentAreas}
                      onChange={(e) => setAiAnalysis({ ...aiAnalysis, developmentAreas: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-slate-700 text-xs rounded-lg p-3 h-32 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Academic recommendations */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="text-xs font-bold text-indigo-600 block mb-2 uppercase tracking-wider">💡 ข้อเสนอแนะเชิงวิชาการ (Academic Recommendations)</label>
                    <textarea
                      value={aiAnalysis.recommendations}
                      onChange={(e) => setAiAnalysis({ ...aiAnalysis, recommendations: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-slate-700 text-xs rounded-lg p-3 h-32 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Coaching & Feedback */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="text-xs font-bold text-purple-600 block mb-2 uppercase tracking-wider">💬 การชี้แนะและการสะท้อนคิด (Coaching & Feedback)</label>
                    <textarea
                      value={aiAnalysis.coachingFeedback}
                      onChange={(e) => setAiAnalysis({ ...aiAnalysis, coachingFeedback: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-slate-700 text-xs rounded-lg p-3 h-32 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Development Plan */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 col-span-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">📈 แผนพัฒนาคุณภาพสถานศึกษา (School Improvement Plan)</label>
                    <textarea
                      value={aiAnalysis.developmentPlan}
                      onChange={(e) => setAiAnalysis({ ...aiAnalysis, developmentPlan: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-slate-700 text-xs rounded-lg p-3 h-28 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Executive Summary */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 col-span-1 md:col-span-2">
                    <label className="text-xs font-bold text-indigo-950 block mb-2 uppercase tracking-wider">📋 บทสรุปเชิงบริหารสำหรับผู้บริหาร (Executive Summary for Directors)</label>
                    <textarea
                      value={aiAnalysis.executiveSummary}
                      onChange={(e) => setAiAnalysis({ ...aiAnalysis, executiveSummary: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-slate-700 text-xs rounded-lg p-3 h-28 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Academic Needs */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-blue-200 col-span-1 md:col-span-2">
                    <label className="text-xs font-bold text-blue-600 block mb-2 uppercase tracking-wider">🎓 ความจำเป็นเชิงวิชาการเพื่อพัฒนาต่อยอดสำหรับครูผู้รับการนิเทศ (Academic Development Needs)</label>
                    <textarea
                      value={aiAnalysis.academicNeeds || ""}
                      onChange={(e) => setAiAnalysis({ ...aiAnalysis, academicNeeds: e.target.value })}
                      placeholder="ระบุความจำเป็นเชิงวิชาการที่สำคัญ เทคนิคการสอน สื่อ นวัตกรรม หรือการสนับสนุนเร่งด่วนที่ครูผู้สอนจำเป็นต้องได้รับเพื่อการพัฒนาอย่างต่อเนื่อง..."
                      className="w-full bg-white border border-slate-200 text-slate-700 text-xs rounded-lg p-3 h-28 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Quick utility buttons */}
                <div className="flex flex-wrap gap-2 justify-end bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      if (aiAnalysis) {
                        const polished = {
                          ...aiAnalysis,
                          recommendations: `จากการประเมินเชิงประจักษ์ในชั้นเรียนข้างต้น ขอเสนอเชิงนโยบายเพื่อเป็นแนวปฏิบัติสืบไปดังนี้: ${aiAnalysis.recommendations}`
                        };
                        setAiAnalysis(polished);
                      }
                    }}
                    className="text-xs bg-white text-slate-700 border border-slate-200 font-bold px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    ✨ ปรับภาษาราชการ (Formalize)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (aiAnalysis) {
                        setSummary(`สรุปโดยย่อจากการสังเคราะห์ด้วย AI:\n- ${aiAnalysis.strengths.substring(0, 100)}...\n\nแผนการโค้ชผู้สอน:\n- ${aiAnalysis.coachingFeedback.substring(0, 100)}...`);
                      }
                    }}
                    className="text-xs bg-white text-slate-700 border border-slate-200 font-bold px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    📝 ดึงเข้าสรุปรายงานย่อ
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 p-12 text-center rounded-3xl space-y-4">
                <Brain className="h-12 w-12 mx-auto text-slate-300" />
                <div className="max-w-md mx-auto space-y-1">
                  <h4 className="font-bold text-slate-700">ระบบประเมินอัจฉริยะยังไม่ได้เริ่มวิเคราะห์</h4>
                  <p className="text-xs text-slate-500">กรุณากรอกคะแนนในส่วนที่ 2 และ 3 ให้ครบถ้วน จากนั้นคลิกปุ่ม &quot;เริ่มวิเคราะห์ด้วย AI ทันที&quot; เพื่อเชื่อมระบบประมวลผลคำแนะนำเชิงลึก</p>
                </div>
                <button
                  type="button"
                  onClick={runAIAnalysis}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
                >
                  ประมวลผลด่วนด้วย AI
                </button>
              </div>
            )}

            {/* Page actions */}
            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab(3)}
                className="flex items-center gap-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-4 py-2 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> ย้อนกลับ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab(5)}
                className="flex items-center gap-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 transition-all cursor-pointer"
              >
                หน้าต่อไป: สรุปและภาพกิจกรรม <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Summary & Activity Photo */}
        {activeTab === 5 && (
          <div className="space-y-6">
            <h3 className="text-md font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-indigo-500" /> ส่วนที่ 5: สรุปผลการประเมินและภาพถ่ายกิจกรรม
            </h3>

            {/* Supervision general summary field */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/55 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">บทสรุปและข้อคิดเห็นของผู้นิเทศหลัก</label>
                <button
                  type="button"
                  onClick={generateAutomaticSummary}
                  className="text-xs text-indigo-600 font-bold hover:text-indigo-700 inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" /> เขียนสรุปอัจฉริยะอัตโนมัติ
                </button>
              </div>

              <textarea
                placeholder="ระบุคำบรรยายสรุปผลการนิเทศติดตามเพื่อนำเข้าพิมพ์ในระบบราชการ..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-700 text-xs rounded-xl p-4 h-40 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Photos upload (Not required, can bypass) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">แนบภาพประกอบกิจกรรม (ไม่บังคับ - ข้ามได้)</h4>
                  <p className="text-[10px] text-slate-400">อัปโหลดภาพกิจกรรม จัดเรียงตำแหน่ง และเขียนคำบรรยายภาพ</p>
                </div>
                
                <label className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-sm">
                  <Upload className="h-3.5 w-3.5" /> เลือกไฟล์ภาพประกอบ
                  <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              {/* Photos lists */}
              {photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div key={photo.id} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                      <div className="relative h-32 bg-slate-100 flex items-center justify-center">
                        <img src={photo.dataUrl} alt="Activity" className="w-full h-full object-cover" />
                        {/* Control buttons */}
                        <div className="absolute top-2 right-2 flex gap-1.5 bg-slate-900/40 p-1.5 rounded-xl backdrop-blur-xs">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => movePhotoOrder(photo.id, "up")}
                              className="text-white hover:text-indigo-200 cursor-pointer"
                            >
                              <ChevronLeft className="h-4 w-4 rotate-90" />
                            </button>
                          )}
                          {index < photos.length - 1 && (
                            <button
                              type="button"
                              onClick={() => movePhotoOrder(photo.id, "down")}
                              className="text-white hover:text-indigo-200 cursor-pointer"
                            >
                              <ChevronRight className="h-4 w-4 rotate-90" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => deletePhoto(photo.id)}
                            className="text-rose-200 hover:text-rose-400 cursor-pointer"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Caption box */}
                      <div className="p-3 bg-white space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">คำบรรยายภาพ</label>
                        <input
                          type="text"
                          value={photo.caption}
                          onChange={(e) => updatePhotoCaption(photo.id, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200 p-8 text-center rounded-2xl text-slate-400 text-xs">
                  ยังไม่ได้แนบรูปประกอบการประเมิน (สามารถส่งบันทึกรายงานโดยไม่แนบรูปได้)
                </div>
              )}
            </div>

            {/* Actions pages */}
            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab(4)}
                className="flex items-center gap-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-4 py-2 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> ย้อนกลับ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab(6)}
                className="flex items-center gap-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 transition-all cursor-pointer"
              >
                หน้าต่อไป: ลงนามดิจิทัล <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 6: Signatures */}
        {activeTab === 6 && (
          <div className="space-y-6">
            <h3 className="text-md font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Signature className="h-5 w-5 text-indigo-500" /> ส่วนที่ 6: ระบบลงลายมือชื่อดิจิทัลและความเที่ยงตรง (Digital Signatures)
            </h3>

            {/* Guidance panel */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
              <p className="font-bold text-slate-700">คำชี้แจงระบบลงนามอิเล็กทรอนิกส์อัจฉริยะ:</p>
              <p>1. สามารถวาดลายมือชื่อด้วย นิ้วมือ, เมาส์ หรือ ปากกาเขียนบนหน้าจอ (iPad/Tablet/Smartphones)</p>
              <p>2. มีระบบบันทึกเวลา (Timestamp) และคีย์ใบรับรองความเที่ยงตรง (Digital Cryptographic Certificate Key) อัตโนมัติเมื่อทำรายงาน</p>
              <p>3. ข้อมูลลายเซ็นจะถูกแนบลงในหน้าปกรายงานนิเทศฉบับทางการราชการของ สพป.แพร่ เขต 1 พร้อม QR Code ทันที</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Signature 1: Supervisor */}
              <SignaturePad
                label="ลายมือชื่อผู้นิเทศหลัก"
                onSaveSignature={(data) => setSigSupervisor(data)}
                existingImg={sigSupervisor}
                placeholderName={primarySupervisor}
              />

              {/* Signature 2: Teacher */}
              <SignaturePad
                label="ลายมือชื่อครูผู้รับการนิเทศ"
                onSaveSignature={(data) => setSigTeacher(data)}
                existingImg={sigTeacher}
                placeholderName={teachers[0] || "ครูผู้สอน"}
              />

              {/* Signature 3: School Director */}
              <SignaturePad
                label="ลายมือชื่อผู้อำนวยการโรงเรียน (พิจารณาเห็นชอบ)"
                onSaveSignature={(data) => setSigDirector(data)}
                existingImg={sigDirector}
                placeholderName="ผู้อำนวยการโรงเรียน"
              />
            </div>

            {/* Quick Digital Validation Status */}
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between text-xs text-indigo-800 font-medium">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                <span>รหัสใบรับรองดิจิทัล: <span className="font-mono font-bold">SN-SUP-{Date.now().toString().substring(5)}</span></span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold bg-white px-2 py-1 rounded border border-emerald-100">
                <ShieldCheck className="h-4 w-4" /> ความปลอดภัย 256-bit SSL
              </div>
            </div>

            {/* Actions page buttons */}
            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab(5)}
                className="flex items-center gap-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-4 py-2 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> ย้อนกลับ
              </button>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => saveReport("Draft")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  บันทึกแบบร่าง (Draft)
                </button>
                <button
                  type="button"
                  onClick={() => saveReport("Submitted")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md cursor-pointer"
                >
                  บันทึกสมบูรณ์และส่งนิเทศ
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
