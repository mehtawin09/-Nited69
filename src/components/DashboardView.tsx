import React, { useState } from "react";
import { 
  LayoutDashboard, FileText, CheckSquare, Award, Brain, School as SchoolIcon, Users, 
  ChevronRight, ArrowUpRight, TrendingUp, Sparkles, Building2, Calendar
} from "lucide-react";
import { SupervisionReport, School } from "../types";
import { motion } from "motion/react";

interface DashboardViewProps {
  reports: SupervisionReport[];
  schools: School[];
  onNavigateToReport: (reportId: string) => void;
  onNavigateToCreate: () => void;
}

export default function DashboardView({ 
  reports, 
  schools, 
  onNavigateToReport,
  onNavigateToCreate 
}: DashboardViewProps) {
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>("all");

  // Filtering reports based on school
  const filteredReports = reports.filter(r => 
    selectedSchoolFilter === "all" || r.basicInfo.schoolId === selectedSchoolFilter
  );

  // Statistics calculations
  const totalReports = filteredReports.length;
  
  const teachersCount = Array.from(new Set(
    filteredReports.flatMap(r => r.basicInfo.teachers)
  )).filter(Boolean).length;

  const approvedCount = filteredReports.filter(r => r.status === "Approved").length;
  const pendingCount = filteredReports.filter(r => r.status === "Submitted" || r.status === "Under Review").length;

  // Average Classroom Quality Score (Max 60)
  const avgClassroomScore = filteredReports.length > 0
    ? Number((filteredReports.reduce((sum, r) => {
        const reportSum = r.classroomScores.reduce((acc, c) => acc + (c.score || 0), 0);
        return sum + reportSum;
      }, 0) / filteredReports.length).toFixed(1))
    : 0;

  // Average Active Learning Score (Max 40)
  const avgActiveLearningScore = filteredReports.length > 0
    ? Number((filteredReports.reduce((sum, r) => {
        const reportSum = r.activeLearningScores.reduce((acc, c) => acc + (c.score || 0), 0);
        return sum + reportSum;
      }, 0) / filteredReports.length).toFixed(1))
    : 0;

  // Calculations per school
  const schoolStats = schools.map(sch => {
    const schReports = reports.filter(r => r.basicInfo.schoolId === sch.id);
    const count = schReports.length;
    const cSum = schReports.reduce((sum, r) => sum + r.classroomScores.reduce((acc, s) => acc + s.score, 0), 0);
    const alSum = schReports.reduce((sum, r) => sum + r.activeLearningScores.reduce((acc, s) => acc + s.score, 0), 0);
    
    return {
      name: sch.name,
      count,
      classroomAvg: count > 0 ? Number((cSum / count).toFixed(1)) : 0,
      activeLearningAvg: count > 0 ? Number((alSum / count).toFixed(1)) : 0,
    };
  });

  // 12 Classroom Indicators stats
  const classroomIndicatorStats = Array.from({ length: 12 }).map((_, idx) => {
    const name = filteredReports[0]?.classroomScores[idx]?.name || `ตัวชี้วัดที่ ${idx + 1}`;
    let sum = 0;
    let count = 0;
    filteredReports.forEach(r => {
      const item = r.classroomScores.find(c => c.index === idx + 1);
      if (item) {
        sum += item.score;
        count++;
      }
    });
    return {
      index: idx + 1,
      name,
      avg: count > 0 ? Number((sum / count).toFixed(2)) : 0
    };
  });

  // Custom Pie Chart values (Status distribution)
  const draftCount = filteredReports.filter(r => r.status === "Draft").length;
  const rejectedCount = filteredReports.filter(r => r.status === "Rejected").length;
  
  const statusDistribution = [
    { label: "ร่าง (Draft)", value: draftCount, color: "#94a3b8" },
    { label: "รอตรวจ/นิเทศ (Pending)", value: pendingCount, color: "#f59e0b" },
    { label: "อนุมัติแล้ว (Approved)", value: approvedCount, color: "#10b981" },
    { label: "ตีกลับแก้ไข (Rejected)", value: rejectedCount, color: "#ef4444" },
  ].filter(s => s.value > 0);

  const totalStatusValues = statusDistribution.reduce((sum, d) => sum + d.value, 0) || 1;

  // Native Custom SVG Pie/Donut Chart calculation
  let accumulatedAngle = 0;
  const pieSlices = statusDistribution.map((status) => {
    const percentage = (status.value / totalStatusValues) * 100;
    const angle = (status.value / totalStatusValues) * 360;
    const startAngle = accumulatedAngle;
    accumulatedAngle += angle;

    // SVG coordinates
    const r = 80;
    const cx = 100;
    const cy = 100;
    
    const x1 = cx + r * Math.cos((startAngle - 90) * Math.PI / 180);
    const y1 = cy + r * Math.sin((startAngle - 90) * Math.PI / 180);
    const x2 = cx + r * Math.cos((startAngle + angle - 90) * Math.PI / 180);
    const y2 = cy + r * Math.sin((startAngle + angle - 90) * Math.PI / 180);
    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = `
      M ${cx} ${cy}
      L ${x1} ${y1}
      A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;

    return {
      ...status,
      percentage,
      pathData
    };
  });

  // Native Custom SVG Radar Chart Calculation (for 12 classroom indicators)
  const maxScore = 5;
  const cx = 150;
  const cy = 140;
  const r = 100;
  const totalAxes = 12;

  // Radar Grid Lines
  const radarGridPaths = [0.2, 0.4, 0.6, 0.8, 1].map((scale) => {
    const points = Array.from({ length: totalAxes }).map((_, i) => {
      const angle = (i * 2 * Math.PI) / totalAxes - Math.PI / 2;
      const x = cx + r * scale * Math.cos(angle);
      const y = cy + r * scale * Math.sin(angle);
      return `${x},${y}`;
    });
    return points.join(" ") + " " + points[0]; // close loop
  });

  // Radar axes lines
  const radarAxes = Array.from({ length: totalAxes }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / totalAxes - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x1: cx, y1: cy, x2: x, y2: y, label: `ชี้วัดที่ ${i + 1}` };
  });

  // Radar Data Points
  const radarDataPoints = classroomIndicatorStats.map((stat, i) => {
    const angle = (i * 2 * Math.PI) / totalAxes - Math.PI / 2;
    const valueRatio = stat.avg / maxScore;
    const x = cx + r * valueRatio * Math.cos(angle);
    const y = cy + r * valueRatio * Math.sin(angle);
    return { x, y, name: stat.name, avg: stat.avg };
  });

  const radarPolygonPoints = radarDataPoints.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 id="dashboard-title" className="text-2xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-blue-600" />
            แผงควบคุมระบบนิเทศอัจฉริยะ
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            ข้อมูลสรุปผลการประเมินห้องเรียนคุณภาพ และการสอน Active Learning สพป.แพร่ เขต 1
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* School filter */}
          <div className="relative">
            <select
              id="school-filter"
              value={selectedSchoolFilter}
              onChange={(e) => setSelectedSchoolFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
            >
              <option value="all">ทุกโรงเรียนในระบบ</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <ChevronRight className="h-4 w-4 rotate-90" />
            </div>
          </div>

          <button
            id="quick-create-report"
            onClick={onNavigateToCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all shadow-sm cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            สร้างการนิเทศใหม่
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Report */}
        <div id="kpi-total-reports" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">การนิเทศทั้งหมด</span>
            <h3 className="text-3xl font-bold text-slate-800 font-mono">{totalReports}</h3>
            <span className="text-xs text-blue-600 font-medium flex items-center gap-0.5">
              <TrendingUp className="h-3.5 w-3.5" /> รายการนิเทศในฐานข้อมูล
            </span>
          </div>
          <div className="p-3.5 bg-blue-50 rounded-xl text-blue-600">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        {/* Teachers */}
        <div id="kpi-teachers" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">ครูที่ได้รับการนิเทศ</span>
            <h3 className="text-3xl font-bold text-slate-800 font-mono">{teachersCount}</h3>
            <span className="text-xs text-emerald-600 font-medium">รวมทุกกลุ่มระดับชั้นเรียน</span>
          </div>
          <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Approved Reports */}
        <div id="kpi-approved" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">อนุมัติเรียบร้อย</span>
            <h3 className="text-3xl font-bold text-emerald-600 font-mono">{approvedCount}</h3>
            <span className="text-xs text-slate-400 font-medium">ลงนามสมบูรณ์ครบ 100%</span>
          </div>
          <div className="p-3.5 bg-amber-50 rounded-xl text-amber-500">
            <CheckSquare className="h-6 w-6" />
          </div>
        </div>

        {/* Pending Reports */}
        <div id="kpi-pending" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">รอพิจารณาอนุมัติ</span>
            <h3 className="text-3xl font-bold text-amber-500 font-mono">{pendingCount}</h3>
            <span className="text-xs text-rose-500 font-medium">รอผู้บริหาร/ผู้นิเทศลงนาม</span>
          </div>
          <div className="p-3.5 bg-rose-50 rounded-xl text-rose-500">
            <Award className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Score Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Classroom Quality summary card */}
        <div id="classroom-summary-card" className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-indigo-950 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10">
            <Building2 className="h-44 w-44" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-indigo-550/30 border border-indigo-400/20 px-2.5 py-1 rounded-full text-xs font-medium text-indigo-200">
              <Sparkles className="h-3 w-3" /> ประเมินห้องเรียนคุณภาพ
            </div>
            <p className="text-slate-300 text-sm">คะแนนเฉลี่ยระดับโรงเรียนที่ประเมิน (เต็ม 60)</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-black font-mono tracking-tight">{avgClassroomScore}</span>
              <span className="text-xl text-slate-300">/ 60 คะแนน</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>คิดเป็นร้อยละ</span>
              <span className="font-mono font-bold text-indigo-300">{((avgClassroomScore / 60) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className="bg-indigo-400 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(avgClassroomScore / 60) * 100}%` }}
              ></div>
            </div>
            <div className="mt-2.5 flex justify-between items-center text-xs">
              <span className="text-slate-400">ระดับคุณภาพ:</span>
              <span className="px-2 py-0.5 rounded-full font-semibold text-indigo-200 bg-indigo-500/20 border border-indigo-400/30">
                {avgClassroomScore >= 54 ? "ดีเยี่ยม" : avgClassroomScore >= 48 ? "ดีมาก" : avgClassroomScore >= 36 ? "ดี" : avgClassroomScore >= 30 ? "พอใช้" : "ปรับปรุง"}
              </span>
            </div>
          </div>
        </div>

        {/* Active Learning summary card */}
        <div id="active-learning-summary-card" className="bg-gradient-to-br from-violet-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-violet-950 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10">
            <Brain className="h-44 w-44" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-violet-550/30 border border-violet-400/20 px-2.5 py-1 rounded-full text-xs font-medium text-violet-200">
              <Sparkles className="h-3 w-3" /> ประเมิน Active Learning
            </div>
            <p className="text-slate-300 text-sm">คะแนนเฉลี่ยการจัดกิจกรรมการเรียนรู้ (เต็ม 40)</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-black font-mono tracking-tight">{avgActiveLearningScore}</span>
              <span className="text-xl text-slate-300">/ 40 คะแนน</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>คิดเป็นร้อยละ</span>
              <span className="font-mono font-bold text-violet-300">{((avgActiveLearningScore / 40) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className="bg-violet-400 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(avgActiveLearningScore / 40) * 100}%` }}
              ></div>
            </div>
            <div className="mt-2.5 flex justify-between items-center text-xs">
              <span className="text-slate-400">ระดับคุณภาพ:</span>
              <span className="px-2 py-0.5 rounded-full font-semibold text-violet-200 bg-violet-500/20 border border-violet-400/30">
                {avgActiveLearningScore >= 36 ? "ดีเยี่ยม" : avgActiveLearningScore >= 32 ? "ดีมาก" : avgActiveLearningScore >= 24 ? "ดี" : avgActiveLearningScore >= 20 ? "พอใช้" : "ปรับปรุง"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Sections (Custom SVG charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Bar Chart comparing school performance */}
        <div id="school-comparison-bar-chart" className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 text-md flex items-center gap-1.5">
              <Building2 className="h-5 w-5 text-blue-500" />
              ผลการเปรียบเทียบคะแนนเฉลี่ยรายโรงเรียน
            </h3>
            <span className="text-xs text-slate-400">หน่วย: คะแนนเฉลี่ย</span>
          </div>

          {/* SVG Bar Chart */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[450px] py-4">
              <svg viewBox="0 0 500 240" className="w-full h-auto">
                {/* Grid Lines */}
                <line x1="60" y1="30" x2="480" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="60" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="60" y1="110" x2="480" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="60" y1="150" x2="480" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="60" y1="190" x2="480" y2="190" stroke="#f8fafc" strokeWidth="2" />

                {/* Y-Axis scale label */}
                <text x="45" y="34" className="text-[10px] fill-slate-400" textAnchor="end">60 / 40</text>
                <text x="45" y="74" className="text-[10px] fill-slate-400" textAnchor="end">45 / 30</text>
                <text x="45" y="114" className="text-[10px] fill-slate-400" textAnchor="end">30 / 20</text>
                <text x="45" y="154" className="text-[10px] fill-slate-400" textAnchor="end">15 / 10</text>
                <text x="45" y="194" className="text-[10px] fill-slate-400" textAnchor="end">0</text>

                {/* Draw School Bars */}
                {schoolStats.map((stat, i) => {
                  const spacing = 120;
                  const startX = 90 + i * spacing;
                  
                  // Classroom bar height calculation (Max 60 = 160px height)
                  const classroomBarHeight = (stat.classroomAvg / 60) * 160;
                  const classroomY = 190 - classroomBarHeight;

                  // Active learning bar height calculation (Max 40 = 160px height)
                  const activeBarHeight = (stat.activeLearningAvg / 40) * 160;
                  const activeY = 190 - activeBarHeight;

                  return (
                    <g key={i}>
                      {/* Classroom Quality Bar (Blue) */}
                      <rect 
                        x={startX} 
                        y={classroomY} 
                        width="18" 
                        height={classroomBarHeight > 0 ? classroomBarHeight : 1} 
                        rx="3"
                        fill="#2563eb"
                        className="transition-all duration-500 hover:opacity-80"
                      />
                      {/* Tooltip or Label on bar top */}
                      <text x={startX + 9} y={classroomY - 4} className="text-[9px] font-bold fill-blue-600 font-mono" textAnchor="middle">
                        {stat.classroomAvg}
                      </text>

                      {/* Active Learning Bar (Purple) */}
                      <rect 
                        x={startX + 24} 
                        y={activeY} 
                        width="18" 
                        height={activeBarHeight > 0 ? activeBarHeight : 1} 
                        rx="3"
                        fill="#8b5cf6"
                        className="transition-all duration-500 hover:opacity-80"
                      />
                      <text x={startX + 33} y={activeY - 4} className="text-[9px] font-bold fill-purple-600 font-mono" textAnchor="middle">
                        {stat.activeLearningAvg}
                      </text>

                      {/* X-axis labels */}
                      <text x={startX + 21} y="208" className="text-[9px] font-medium fill-slate-500" textAnchor="middle">
                        {stat.name.split(" ")[0]}
                      </text>
                      <text x={startX + 21} y="222" className="text-[8px] fill-slate-400" textAnchor="middle">
                        ({stat.count} นิเทศ)
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 justify-center items-center pt-2 border-t border-slate-50 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-3 bg-blue-600 rounded-sm"></span>
              <span>ห้องเรียนคุณภาพ (เฉลี่ย)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-3 bg-purple-500 rounded-sm"></span>
              <span>Active Learning (เฉลี่ย)</span>
            </div>
          </div>
        </div>

        {/* Pie Chart of approval status and radar */}
        <div id="status-distribution-chart" className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-md flex items-center gap-1.5">
            <CheckSquare className="h-5 w-5 text-emerald-500" />
            สถานะการอนุมัติรายงานนิเทศ
          </h3>

          <div className="flex flex-col items-center justify-center py-2">
            {statusDistribution.length > 0 ? (
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {pieSlices.map((slice, i) => (
                    <path
                      key={i}
                      d={slice.pathData}
                      fill={slice.color}
                      className="hover:opacity-90 transition-opacity duration-300"
                    />
                  ))}
                  {/* Central Hole for Donut-style */}
                  <circle cx="100" cy="100" r="45" fill="#ffffff" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-800 font-mono">{totalReports}</span>
                  <span className="text-[10px] text-slate-400 font-medium">รายการรวม</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 text-sm space-y-1">
                <FileText className="h-8 w-8 mx-auto text-slate-300" />
                <p>ไม่มีข้อมูลสถิติรายงาน</p>
              </div>
            )}

            {/* Labels detail */}
            <div className="w-full grid grid-cols-2 gap-2 mt-4">
              {pieSlices.map((status, i) => (
                <div key={i} className="flex items-start gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100/50">
                  <span className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: status.color }}></span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 line-clamp-1">{status.label}</span>
                    <span className="text-xs font-bold font-mono text-slate-700">{status.value} ฉบับ ({status.percentage.toFixed(0)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 12-indicators Spider/Radar chart */}
        <div id="radar-chart-classroom" className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 text-md flex items-center gap-1.5">
              <Award className="h-5 w-5 text-amber-500" />
              จุดเด่นภาพรวม 12 ตัวชี้วัดห้องเรียนคุณภาพ
            </h3>
            <span className="text-xs text-slate-400">ระดับ 1-5 คะแนน</span>
          </div>

          <div className="flex flex-col items-center py-2">
            {filteredReports.length > 0 ? (
              <div className="w-full flex justify-center">
                <svg viewBox="0 0 300 280" className="w-full max-w-[320px] h-auto">
                  {/* Grid Loops */}
                  {radarGridPaths.map((path, i) => (
                    <polygon
                      key={i}
                      points={path}
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Axes lines */}
                  {radarAxes.map((axis, i) => (
                    <g key={i}>
                      <line
                        x1={axis.x1}
                        y1={axis.y1}
                        x2={axis.x2}
                        y2={axis.y2}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                      />
                      {/* Label on edge of axis */}
                      {i % 2 === 0 && (
                        <text
                          x={axis.x2 + (axis.x2 > cx ? 6 : -6)}
                          y={axis.y2 + (axis.y2 > cy ? 4 : -4)}
                          className="text-[8px] font-medium fill-slate-400"
                          textAnchor={axis.x2 > cx ? "start" : "end"}
                        >
                          {i + 1}
                        </text>
                      )}
                    </g>
                  ))}

                  {/* Shaded Area of values */}
                  <polygon
                    points={radarPolygonPoints}
                    fill="rgba(79, 70, 229, 0.15)"
                    stroke="#4f46e5"
                    strokeWidth="2"
                  />

                  {/* Radar Interactive dots */}
                  {radarDataPoints.map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r="3.5"
                      fill="#4f46e5"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                  ))}
                </svg>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">
                ไม่มีข้อมูลประเมินในระบบ
              </div>
            )}
          </div>

          {/* Indicator index translation dictionary */}
          <div className="border-t border-slate-50 pt-3 text-[10px] text-slate-500 grid grid-cols-2 gap-x-4 gap-y-1">
            {classroomIndicatorStats.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-50 p-1 px-1.5 rounded">
                <span className="line-clamp-1">{idx + 1}. {item.name}</span>
                <span className="font-mono font-bold text-slate-700 bg-white border border-slate-100 rounded px-1">{item.avg}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Supervisions Table list */}
        <div id="recent-supervisions-table" className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 text-md flex items-center gap-1.5">
              <FileText className="h-5 w-5 text-blue-500" />
              รายงานนิเทศล่าสุดในสัปดาห์นี้
            </h3>
            <span className="text-xs text-blue-600 font-semibold cursor-pointer flex items-center gap-0.5">
              ดูทั้งหมด <ChevronRight className="h-3 w-3" />
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-500">
              <thead>
                <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase font-semibold">
                  <th className="p-3">โรงเรียน</th>
                  <th className="p-3">ระดับชั้น / วิชา</th>
                  <th className="p-3">ครูผู้สอน</th>
                  <th className="p-3 text-center">คะแนนรวม</th>
                  <th className="p-3 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.slice(0, 5).map((rep) => {
                  const classroomSum = rep.classroomScores.reduce((acc, c) => acc + c.score, 0);
                  const activeSum = rep.activeLearningScores.reduce((acc, c) => acc + c.score, 0);
                  const totalScorePercent = (((classroomSum / 60) * 100 + (activeSum / 40) * 100) / 2).toFixed(0);

                  const statusStyles: Record<string, string> = {
                    Draft: "bg-slate-50 text-slate-500 border-slate-100",
                    Submitted: "bg-amber-50 text-amber-600 border-amber-100",
                    "Under Review": "bg-indigo-50 text-indigo-600 border-indigo-100",
                    Approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
                    Rejected: "bg-rose-50 text-rose-600 border-rose-100",
                  };

                  const statusNames: Record<string, string> = {
                    Draft: "ฉบับร่าง",
                    Submitted: "ยื่นตรวจ",
                    "Under Review": "กำลังตรวจ",
                    Approved: "อนุมัติแล้ว",
                    Rejected: "ตีกลับแก้ไข",
                  };

                  return (
                    <tr 
                      key={rep.id} 
                      onClick={() => onNavigateToReport(rep.id)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="p-3">
                        <div className="font-semibold text-slate-800 line-clamp-1">{rep.basicInfo.schoolName}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{rep.basicInfo.date}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-slate-700">{rep.basicInfo.grade}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{rep.basicInfo.subject || "ไม่ระบุวิชา"}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-slate-700 line-clamp-1">{rep.basicInfo.teachers[0]}</div>
                        {rep.basicInfo.teachers.length > 1 && (
                          <div className="text-[10px] text-slate-400">และคณะอีก {rep.basicInfo.teachers.length - 1} ท่าน</div>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="font-bold text-indigo-600 font-mono text-[13px]">{classroomSum + activeSum}/100</div>
                        <div className="text-[9px] text-slate-400 font-medium">({totalScorePercent}%)</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-full border ${statusStyles[rep.status] || "bg-slate-100 text-slate-600"}`}>
                          {statusNames[rep.status] || rep.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-400">
                      <FileText className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                      ไม่มีรายการนิเทศในสัปดาห์นี้
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
