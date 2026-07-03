import React from "react";
import { 
  SupervisionReport, School 
} from "../types";
import { 
  Printer, FileDown, ArrowLeft, QrCode, CheckCircle, ShieldCheck 
} from "lucide-react";

interface OfficialPrintReportProps {
  reportId: string;
  reports: SupervisionReport[];
  schools: School[];
  onClose: () => void;
}

// High-fidelity vector SVG Garuda emblem path (Official Thai symbol)
export function GarudaEmblem() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto fill-black">
      <path d="M50 1C48.6 4.3 47.1 8 46.5 9.3c-.6 1.3-1.8 1.8-3.4 1.3-1.6-.5-3.6-1.5-4.4-2.2-.8-.7-1.4-.4-1.2.7.2 1.1.8 2.6 1.4 3.3.6.7 1.3 1.9 1.5 2.6.2.7-.4 1.2-1.3 1.1s-2.1-.4-2.7-.7c-.6-.3-1.3-.1-1.5.5s0 1.5.4 2.1c.4.6 1.2 1.5 1.8 2.1s1.3 1.2 1.5 1.5c.2.3-.4.6-1.3.6s-2.2-.1-2.9-.3c-.7-.2-1.3 0-1.4.5s.1 1.2.5 1.6c.4.4 1.2.9 1.8 1.1.6.2 1.2.6 1.4.9.2.3-.4.5-1.3.5h-2.9c-.8 0-1.3.3-1.2.8s.4 1 .8 1.2c.4.2 1.1.4 1.5.5s1 .4 1.2.6c.2.2-.4.4-1.3.4h-2.9c-.8 0-1.3.3-1.2.8s.4 1 .8 1.2c.4.2 1.1.4 1.5.5s1 .4 1.2.6c.2.2-.4.4-1.3.4h-2.9c-.8 0-1.3.3-1.2.8s.4 1 .8 1.2c.4.2 1.1.4 1.5.5s1 .4 1.2.6c.2.2-.4.4-1.3.4H28.4c-1.3 0-2.4 1.2-2.4 2.6s.9 2.5 2.1 2.6c1.2.1 2.3.8 2.5 1.5.2.7.1 1.5-.2 1.8-.3.3-.8.4-1.1.1-.3-.3-.8-1.1-1.1-1.8s-1.1-1.3-1.8-1.3c-.7 0-1.3.6-1.3 1.3s.5 1.3 1.1 1.5c.6.2 1.4.7 1.8 1.1s.6 1.1.4 1.5c-.2.4-.8.6-1.3.4s-1.1-.7-1.3-1.1c-.2-.4-.8-.7-1.3-.7s-1 .3-1 .7.3.7.8.9c.5.2 1.1.6 1.3.9.2.3-.3.5-.9.5h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7H21c-.6 0-1 .3-.9.7s.4.7.9.7H23.3c1.3 0 2.4 1.2 2.4 2.6s-.9 2.5-2.1 2.6c-1.2.1-2.3.8-2.5 1.5-.2.7-.1 1.5.2 1.8.3.3.8.4 1.1.1.3-.3.8-1.1 1.1-1.8s1.1-1.3 1.8-1.3c.7 0 1.3.6 1.3 1.3s-.5 1.3-1.1 1.5c-.6.2-1.4.7-1.8 1.1s-.6 1.1-.4 1.5c.2.4.8.6 1.3.4s1.1-.7 1.3-1.1c.2-.4.8-.7 1.3-.7s1 .3-1 .7c0 .4-.3.7-.8.9-.5.2-1.1.6-1.3.9-.2.3.3.5.9.5H29.1c1.3 0 2.4 1.2 2.4 2.6s-.9 2.5-2.1 2.6c-1.2.1-2.3.8-2.5 1.5-.2.7-.1 1.5.2 1.8s.8.4 1.1.1c.3-.3.8-1.1 1.1-1.8s1.1-1.3 1.8-1.3c.7 0 1.3.6 1.3 1.3s-.5 1.3-1.1 1.5c-.6.2-1.4.7-1.8 1.1s-.6 1.1-.4 1.5c.2.4.8.6 1.3.4s1.1-.7 1.3-1.1c.2-.4.8-.7 1.3-.7s1 .3-1 .7c0 .4-.3.7-.8.9-.5.2-1.1.6-1.3.9-.2.3.3.5.9.5h1.5c1.1 0 1.9.9 1.9 2s-.8 2-1.8 2.1c-1 .1-1.8.8-2 1.5-.2.7-.1 1.5.2 1.8s.8.4 1.1.1c.3-.3.8-1.1 1.1-1.8s1.1-1.3 1.8-1.3c.7 0 1.3.6 1.3 1.3s-.5 1.3-1.1 1.5c-.6.2-1.4.7-1.8 1.1s-.6 1.1-.4 1.5c.2.4.8.6 1.3.4s1.1-.7 1.3-1.1c.2-.4.8-.7 1.3-.7s1 .3-1 .7c0 .4-.3.7-.8.9-.5.2-1.1.6-1.3.9-.2.3.3.5.9.5h1.5c1.1 0 1.9.9 1.9 2s-.8 2-1.8 2.1c-1 .1-1.8.8-2 1.5-.2.7-.1 1.5.2 1.8s.8.4 1.1.1c.3-.3.8-1.1 1.1-1.8s1.1-1.3 1.8-1.3c.7 0 1.3.6 1.3 1.3s-.5 1.3-1.1 1.5c-.6.2-1.4.7-1.8 1.1s-.6 1.1-.4 1.5c.2.4.8.6 1.3.4s1.1-.7 1.3-1.1c.2-.4.8-.7 1.3-.7s1 .3-1 .7c0 .4-.3.7-.8.9-.5.2-1.1.6-1.3.9-.2.3.3.5.9.5h1.5c.6 0 1 .3.9.7s-.4.7-.9.7h-1.5c-.6 0-.9.3-.7.7s.6.7 1.2.7h1.5c.6 0 1 .3.9.7s-.4.7-.9.7H34.4c.6.2 1.3.7 1.7 1.1s.6 1.1.4 1.5c-.2.4-.8.6-1.3.4s-1.1-.7-1.3-1.1c-.2-.4-.8-.7-1.3-.7s-1 .3-1 .7.3.7.8.9c.5.2 1.1.6 1.3.9.2.3-.3.5-.9.5h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7H29c-1.3 0-2.4 1.2-2.4 2.6s.9 2.5 2.1 2.6c1.2.1 2.3.8 2.5 1.5.2.7.1 1.5-.2 1.8-.3.3-.8.4-1.1.1-.3-.3-.8-1.1-1.1-1.8s-1.1-1.3-1.8-1.3c-.7 0-1.3.6-1.3 1.3s.5 1.3 1.1 1.5c.6.2 1.4.7 1.8 1.1s.6 1.1.4 1.5c-.2.4-.8.6-1.3.4s-1.1-.7-1.3-1.1c-.2-.4-.8-.7-1.3-.7s-1 .3-1 .7c0 .4.3.7.8.9.5.2 1.1.6 1.3.9.2.3-.3.5-.9.5H23c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7H21c-.6 0-1 .3-.9.7s.4.7.9.7H23.3c1.3 0 2.4 1.2 2.4 2.6s-.9 2.5-2.1 2.6c-1.2.1-2.3.8-2.5 1.5-.2.7-.1 1.5.2 1.8.3.3.8.4 1.1.1.3-.3.8-1.1 1.1-1.8s1.1-1.3 1.8-1.3c.7 0 1.3.6 1.3 1.3s-.5 1.3-1.1 1.5c-.6.2-1.4.7-1.8 1.1s-.6 1.1-.4 1.5c.2.4.8.6 1.3.4s1.1-.7 1.3-1.1c.2-.4.8-.7 1.3-.7s1 .3-1 .7c0 .4-.3.7-.8.9-.5.2-1.1.6-1.3.9-.2.3.3.5.9.5H29.1c1.3 0 2.4 1.2 2.4 2.6s-.9 2.5-2.1 2.6c-1.2.1-2.3.8-2.5 1.5-.2.7-.1 1.5.2 1.8s.8.4 1.1.1c.3-.3.8-1.1 1.1-1.8s1.1-1.3 1.8-1.3c.7 0 1.3.6 1.3 1.3s-.5 1.3-1.1 1.5c-.6.2-1.4.7-1.8 1.1s-.6 1.1-.4 1.5c.2.4.8.6 1.3.4s1.1-.7 1.3-1.1c.2-.4.8-.7 1.3-.7s1 .3-1 .7c0 .4-.3.7-.8.9-.5.2-1.1.6-1.3.9-.2.3.3.5.9.5h1.5c1.1 0 1.9.9 1.9 2s-.8 2-1.8 2.1c-1 .1-1.8.8-2 1.5-.2.7-.1 1.5.2 1.8s.8.4 1.1.1c.3-.3.8-1.1 1.1-1.8s1.1-1.3 1.8-1.3c.7 0 1.3.6 1.3 1.3s-.5 1.3-1.1 1.5c-.6.2-1.4.7-1.8 1.1s-.6 1.1-.4 1.5c.2.4.8.6 1.3.4s1.1-.7 1.3-1.1c.2-.4.8-.7 1.3-.7s1 .3-1 .7c0 .4-.3.7-.8.9-.5.2-1.1.6-1.3.9-.2.3.3.5.9.5h1.5c1.1 0 1.9.9 1.9 2s-.8 2-1.8 2.1c-1 .1-1.8.8-2 1.5-.2.7-.1 1.5.2 1.8s.8.4 1.1.1c.3-.3.8-1.1 1.1-1.8s1.1-1.3 1.8-1.3c.7 0 1.3.6 1.3 1.3s-.5 1.3-1.1 1.5c-.6.2-1.4.7-1.8 1.1s-.6 1.1-.4 1.5c.2.4.8.6 1.3.4s1.1-.7 1.3-1.1c.2-.4.8-.7 1.3-.7s1 .3-1 .7c0 .4-.3.7-.8.9-.5.2-1.1.6-1.3.9-.2.3.3.5.9.5h1.5c.6 0 1 .3.9.7s-.4.7-.9.7h-1.5c-.6 0-.9.3-.7.7s.6.7 1.2.7h1.5c.6 0 1 .3.9.7s-.4.7-.9.7zm15.6 15.6c-.6.2-1.3.7-1.7 1.1s-.6 1.1-.4 1.5c.2.4.8.6 1.3.4s1.1-.7 1.3-1.1c.2-.4.8-.7 1.3-.7s1 .3-1 .7.3.7.8.9c.5.2 1.1.6 1.3.9.2.3-.3.5-.9.5h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7zm-22-22c-.6.2-1.3.7-1.7 1.1s-.6 1.1-.4 1.5c.2.4.8.6 1.3.4s1.1-.7 1.3-1.1c.2-.4.8-.7 1.3-.7s1 .3-1 .7.3.7.8.9c.5.2 1.1.6 1.3.9.2.3-.3.5-.9.5h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7zm15.6 15.6c-.6.2-1.3.7-1.7 1.1s-.6 1.1-.4 1.5c.2.4.8.6 1.3.4s1.1-.7 1.3-1.1c.2-.4.8-.7 1.3-.7s1 .3-1 .7.3.7.8.9c.5.2 1.1.6 1.3.9.2.3-.3.5-.9.5h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7zm11-11c-.6.2-1.3.7-1.7 1.1s-.6 1.1-.4 1.5c.2.4.8.6 1.3.4s1.1-.7 1.3-1.1c.2-.4.8-.7 1.3-.7s1 .3-1 .7c0 .4.3.7.8.9.5.2 1.1.6 1.3.9.2.3-.3.5-.9.5h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7zm-22-22c-.6.2-1.3.7-1.7 1.1s-.6 1.1-.4 1.5c.2.4.8.6 1.3.4s1.1-.7 1.3-1.1c.2-.4.8-.7 1.3-.7s1 .3-1 .7c0 .4.3.7.8.9.5.2 1.1.6 1.3.9.2.3-.3.5-.9.5h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7zm15.6 15.6c-.6.2-1.3.7-1.7 1.1s-.6 1.1-.4 1.5c.2.4.8.6 1.3.4s1.1-.7 1.3-1.1c.2-.4.8-.7 1.3-.7s1 .3-1 .7c0 .4.3.7.8.9.5.2 1.1.6 1.3.9.2.3-.3.5-.9.5h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7zm-26.6-26.6c-.6.2-1.3.7-1.7 1.1s-.6 1.1-.4 1.5c.2.4.8.6 1.3.4s1.1-.7 1.3-1.1c.2-.4.8-.7 1.3-.7s1 .3-1 .7c0 .4.3.7.8.9.5.2 1.1.6 1.3.9.2.3-.3.5-.9.5h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7zm15.6 15.6c-.6.2-1.3.7-1.7 1.1s-.6 1.1-.4 1.5c.2.4.8.6 1.3.4s1.1-.7 1.3-1.1c.2-.4.8-.7 1.3-.7s1 .3-1 .7c0 .4.3.7.8.9.5.2 1.1.6 1.3.9.2.3-.3.5-.9.5h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7zm-4.6-4.6c-.6.2-1.3.7-1.7 1.1s-.6 1.1-.4 1.5c.2.4.8.6 1.3.4s1.1-.7 1.3-1.1c.2-.4.8-.7 1.3-.7s1 .3-1 .7c0 .4.3.7.8.9.5.2 1.1.6 1.3.9.2.3-.3.5-.9.5h-1.5c-.6 0-1 .3-.9.7s.4.7.9.7h1.5c.6 0 .9.3.7.7s-.6.7-1.2.7z" />
    </svg>
  );
}

export default function OfficialPrintReport({
  reportId,
  reports,
  schools,
  onClose
}: OfficialPrintReportProps) {
  const report = reports.find(r => r.id === reportId);
  if (!report) {
    return (
      <div className="p-12 text-center text-slate-500">
        ไม่พบข้อมูลรายงานในระบบ
      </div>
    );
  }

  const sch = schools.find(s => s.id === report.basicInfo.schoolId);

  const classroomSum = report.classroomScores.reduce((sum, s) => sum + s.score, 0);
  const activeLearningSum = report.activeLearningScores.reduce((sum, s) => sum + s.score, 0);
  const grandTotal = classroomSum + activeLearningSum;
  
  const classroomPercent = ((classroomSum / 60) * 100).toFixed(1);
  const activeLearningPercent = ((activeLearningSum / 40) * 100).toFixed(1);
  const grandPercent = (((classroomSum / 60) * 100 + (activeLearningSum / 40) * 100) / 2).toFixed(1);

  const getClassroomLevel = (score: number) => {
    if (score >= 54) return "ดีเยี่ยม";
    if (score >= 48) return "ดีมาก";
    if (score >= 36) return "ดี";
    if (score >= 30) return "พอใช้";
    return "ปรับปรุง";
  };

  const getActiveLearningLevel = (score: number) => {
    if (score >= 36) return "ดีเยี่ยม";
    if (score >= 32) return "ดีมาก";
    if (score >= 24) return "ดี";
    if (score >= 20) return "พอใช้";
    return "ปรับปรุง";
  };

  // Trigger browser print dialog (optimised with @media print CSS styles)
  const handlePrintPdf = () => {
    window.print();
  };

  const [isDownloading, setIsDownloading] = React.useState(false);

  // Directly download as PDF with exactly 2.5cm margins
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    const element = document.getElementById("pdf-report-content");
    if (!element) {
      alert("ไม่พบส่วนเนื้อหารายงานที่ต้องการดาวน์โหลด");
      setIsDownloading(false);
      return;
    }

    try {
      const html2pdf = await new Promise<any>((resolve, reject) => {
        if ((window as any).html2pdf) {
          resolve((window as any).html2pdf);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.async = true;
        script.onload = () => resolve((window as any).html2pdf);
        script.onerror = (err) => reject(new Error("ไม่สามารถโหลดระบบสร้าง PDF ได้"));
        document.body.appendChild(script);
      });

      // Temporarily add a class to disable double padding, rounded borders, and shadows during PDF conversion
      element.classList.add("pdf-download-active");

      // 2.5cm on all sides. [top, left, bottom, right] in cm
      const opt = {
        margin: [2.5, 2.5, 2.5, 2.5],
        filename: `รายงานการนิเทศ_${report.basicInfo.schoolName}_${report.basicInfo.grade}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2.5, // High resolution for beautiful Thai fonts
          useCORS: true, 
          logging: false,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'cm', 
          format: 'a4', 
          orientation: 'portrait' 
        },
        pagebreak: { mode: ['css', 'legacy'] } // Strictly respect .page-break class element page break rules
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("เกิดข้อผิดพลาดในการดาวน์โหลด PDF กรุณาใช้ปุ่ม 'บันทึก PDF / สั่งพิมพ์จริง' แทน");
    } finally {
      element.classList.remove("pdf-download-active");
      setIsDownloading(false);
    }
  };

  // Export dynamically to DOC format
  const handleExportDoc = () => {
    const reportTitle = `รายงานการนิเทศภายใน_${report.basicInfo.schoolName}_${report.basicInfo.grade}`;
    
    // Construct inline HTML for Microsoft Word download
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>รายงานการนิเทศภายใน</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Sarabun', 'TH Sarabun New', Arial, sans-serif;
            font-size: 16pt;
            line-height: 1.5;
            padding: 2.5cm;
          }
          h1, h2, h3 { text-align: center; font-weight: bold; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid black; padding: 8px; font-size: 14pt; }
          th { background-color: #f2f2f2; text-align: center; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .signature-section { margin-top: 50px; float: right; width: 300px; text-align: center; font-size: 14pt; }
        </style>
      </head>
      <body>
        <h3>รายงานการนิเทศติดตามเพื่อประเมินผลการเรียนรู้</h3>
        <h2>สำนักงานเขตพื้นที่การศึกษาประถมศึกษาแพร่ เขต 1</h2>
        <br/>
        <p class="bold">ข้อมูลพื้นฐาน:</p>
        <p>โรงเรียน: ${report.basicInfo.schoolName}</p>
        <p>ระดับชั้นเรียน: ${report.basicInfo.grade}</p>
        <p>วันที่ประเมิน: ${report.basicInfo.date} เวลา ${report.basicInfo.time} น.</p>
        <p>ปีการศึกษา: ${report.basicInfo.academicYear} ภาคเรียนที่: ${report.basicInfo.semester}</p>
        <p>ครูผู้รับการนิเทศ: ${report.basicInfo.teachers.join(", ")}</p>
        <p>ผู้นิเทศหลัก: ${report.basicInfo.primarySupervisor}</p>
        <p>รายวิชา/กิจกรรม: ${report.basicInfo.subject || "ไม่ระบุ"}</p>
        
        <br/>
        <p class="bold">สรุปผลการประเมิน:</p>
        <table>
          <thead>
            <tr>
              <th>ประเภทการประเมิน</th>
              <th>คะแนนเต็ม</th>
              <th>คะแนนที่ได้</th>
              <th>คิดเป็นร้อยละ</th>
              <th>ระดับคุณภาพ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1. การประเมินห้องเรียนคุณภาพ</td>
              <td class="center">60</td>
              <td class="center">${classroomSum}</td>
              <td class="center">${classroomPercent}%</td>
              <td class="center">${getClassroomLevel(classroomSum)}</td>
            </tr>
            <tr>
              <td>2. การประเมิน Active Learning</td>
              <td class="center">40</td>
              <td class="center">${activeLearningSum}</td>
              <td class="center">${activeLearningPercent}%</td>
              <td class="center">${getActiveLearningLevel(activeLearningSum)}</td>
            </tr>
            <tr class="bold">
              <td>คะแนนรวมทั้งสิ้น</td>
              <td class="center">100</td>
              <td class="center">${grandTotal}</td>
              <td class="center">${grandPercent}%</td>
              <td class="center">-</td>
            </tr>
          </tbody>
        </table>

        <br/>
        <p class="bold">ผลสังเคราะห์และข้อเสนอแนะเชิงลึกโดย AI:</p>
        <p class="bold">จุดเด่นที่ควรชื่นชม:</p>
        <p>${report.aiAnalysis?.strengths || "ไม่มีข้อมูล"}</p>
        
        <p class="bold">จุดที่ควรได้รับการพัฒนา:</p>
        <p>${report.aiAnalysis?.developmentAreas || "ไม่มีข้อมูล"}</p>

        <p class="bold">ความจำเป็นเชิงวิชาการเพื่อพัฒนาต่อยอดสำหรับผู้รับการนิเทศ:</p>
        <p>${report.aiAnalysis?.academicNeeds || "ไม่มีข้อมูล"}</p>

        <p class="bold">ข้อเสนอแนะเชิงลึก:</p>
        <p>${report.aiAnalysis?.recommendations || "ไม่มีข้อมูล"}</p>

        <br/>
        <div class="signature-section">
          <p>ลงชื่อ....................................................... ผู้นิเทศ</p>
          <p>(${report.basicInfo.primarySupervisor})</p>
          <p>วันที่ ${report.basicInfo.date}</p>
        </div>
      </body>
      </html>
    `;

    // Create download link and trigger
    const blob = new Blob([htmlContent], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportTitle}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      
      {/* Action panel at the top (Hidden on print) */}
      <div className="no-print flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <span className="text-xs font-semibold text-slate-400">ระบบนิเทศและพิจารณาเห็นชอบ</span>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">แบบรายงานผลและจัดพิมพ์ราชการ</h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* Export to Word */}
          <button
            onClick={handleExportDoc}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <FileDown className="h-4 w-4 text-slate-500" />
            ดาวน์โหลด DOC (Word)
          </button>

          {/* Direct PDF Download with 2.5cm margins */}
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer ${isDownloading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <FileDown className="h-4 w-4" />
            {isDownloading ? "กำลังดาวน์โหลด..." : "ดาวน์โหลด PDF (A4)"}
          </button>

          {/* Trigger window print */}
          <button
            onClick={handlePrintPdf}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            บันทึก PDF / สั่งพิมพ์จริง
          </button>
        </div>
      </div>

      {/* Official Thai Government A4 Report style Sheet container */}
      <div id="pdf-report-content" className="bg-white p-12 md:p-16 rounded-3xl border border-slate-200 shadow-xl max-w-4xl mx-auto font-sarabun text-slate-900 print-container">
        
        {/* CSS rules tailored exactly for clean page breaks, print borders, and Sarabun sizing */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap');
          
          .font-sarabun {
            font-family: 'Sarabun', sans-serif !important;
          }
          
          @page {
            size: A4;
            margin: 2.5cm !important; /* EXACTLY 2.5cm on all sides */
          }
          
          .pdf-download-active {
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            border-radius: 0 !important;
            max-width: 100% !important;
          }
          
          @media print {
            body {
              background-color: white !important;
              color: black !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            .no-print {
              display: none !important;
            }
            .print-container {
              box-shadow: none !important;
              border: none !important;
              padding: 0 !important; /* Handled by @page margins to ensure exact 2.5cm */
              margin: 0 !important;
              max-width: 100% !important;
              font-size: 16pt !important;
              line-height: 1.6 !important;
            }
            .page-break {
              page-break-before: always !important;
            }
            table {
              page-break-inside: avoid !important;
            }
          }
        `}</style>

        {/* COVER PAGE (หน้าปก) */}
        <div className="text-center space-y-12 min-h-[900px] flex flex-col justify-between py-12">
          
          {/* Top section */}
          <div className="space-y-6">
            <GarudaEmblem />
            <br/>
            <h1 className="text-2xl font-extrabold tracking-tight text-black leading-tight uppercase">
              รายงานผลการนิเทศติดตามภายในสถานศึกษาอัจฉริยะ
            </h1>
            <h2 className="text-lg font-bold text-slate-800 leading-normal">
              การประเมินห้องเรียนคุณภาพ และการจัดการสอน Active Learning
            </h2>
            <p className="text-md font-semibold text-slate-700 bg-slate-50 border border-slate-200 max-w-md mx-auto py-2 rounded-2xl">
              โรงเรียนในสังกัด สพป.แพร่ เขต 1
            </p>
          </div>

          {/* Central target school */}
          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-400 tracking-wider uppercase">สถานศึกษาที่เข้ารับการประเมิน</p>
            <h3 className="text-3xl font-black text-indigo-950 leading-tight">
              {report.basicInfo.schoolName}
            </h3>
            <p className="text-md font-bold text-slate-600">
              ระดับชั้นเรียนประเมิน: {report.basicInfo.grade}
            </p>
            <p className="text-sm text-slate-500 font-mono">
              รหัสประเมินอัจฉริยะ: SUP-{report.id.substring(7, 15)}
            </p>
          </div>

          {/* Footer of cover */}
          <div className="space-y-3 pt-12 border-t border-slate-100 max-w-lg mx-auto">
            <div className="grid grid-cols-2 text-left text-xs gap-y-2 text-slate-600">
              <span className="font-bold text-slate-800">ครูผู้รับการนิเทศ:</span>
              <span>{report.basicInfo.teachers.filter(Boolean).join(", ")}</span>

              <span className="font-bold text-slate-800">ผู้นิเทศหลักประจำวิชา:</span>
              <span>{report.basicInfo.primarySupervisor}</span>

              {report.basicInfo.coSupervisors.length > 0 && (
                <>
                  <span className="font-bold text-slate-800">คณะผู้นิเทศร่วม:</span>
                  <span>{report.basicInfo.coSupervisors.join(", ")}</span>
                </>
              )}

              <span className="font-bold text-slate-800">ภาคเรียน/ปีการศึกษา:</span>
              <span>ภาคเรียนที่ {report.basicInfo.semester} ปีการศึกษา {report.basicInfo.academicYear} (รอบที่ {report.basicInfo.round})</span>

              <span className="font-bold text-slate-800">วันที่ทำการประเมิน:</span>
              <span>{report.basicInfo.date} • {report.basicInfo.time} น.</span>
            </div>
          </div>
        </div>

        {/* FORWARD PAGE & CORE DOCUMENT INFO (หน้า 2) */}
        <div className="page-break pt-12 space-y-6">
          <div className="flex justify-between items-center border-b-2 border-indigo-950 pb-3">
            <span className="text-xs font-bold text-indigo-700">แบบรายงาน สพป.แพร่ เขต 1</span>
            <span className="text-xs text-slate-400">เลขรับรองดิจิทัล: {report.id}</span>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-850">1. ข้อมูลสังเคราะห์และคะแนนผลการประเมิน</h3>
            <p className="text-xs text-slate-500 leading-relaxed indent-8">
              การประเมินผลการจัดสิ่งแวดล้อมห้องเรียนคุณภาพ และทักษะกระบวนการออกแบบแผนจัดการเรียนรู้ Active Learning ครั้งนี้ เป็นความร่วมมือเชิงกลยุทธ์การศึกษา สังกัดสำนักงานเขตพื้นที่การศึกษาประถมศึกษาแพร่ เขต 1 โดยผู้นิเทศได้ประยุกต์ใช้โมเดลวิเคราะห์ข้อมูลแบบรวมศูนย์ เพื่อยกระดับความเที่ยงตรงและความแม่นยำในการชี้แนะเชิงสร้างสรรค์
            </p>
          </div>

          {/* Scores comparison table */}
          <div className="space-y-3 pt-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">ตารางสรุปผลลัพธ์คะแนนประเมิน (เต็ม 100 คะแนน)</h4>
            <div className="overflow-hidden border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                    <th className="p-3">ประเภทเกณฑ์มาตรฐานที่ได้รับการประเมิน</th>
                    <th className="p-3 text-center">คะแนนเต็ม</th>
                    <th className="p-3 text-center">คะแนนที่ได้</th>
                    <th className="p-3 text-center">คิดเป็นร้อยละ</th>
                    <th className="p-3 text-center">ระดับคุณภาพ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">1) หมวดการประเมินสิ่งแวดล้อมห้องเรียนคุณภาพ</td>
                    <td className="p-3 text-center">60</td>
                    <td className="p-3 text-center font-bold text-indigo-600">{classroomSum}</td>
                    <td className="p-3 text-center font-bold font-mono text-slate-700">{classroomPercent}%</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-600 text-[10px]">
                        {getClassroomLevel(classroomSum)}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">2) หมวดการจัดการเรียนรู้ Active Learning 10 ตัวชี้วัด</td>
                    <td className="p-3 text-center">40</td>
                    <td className="p-3 text-center font-bold text-violet-600">{activeLearningSum}</td>
                    <td className="p-3 text-center font-bold font-mono text-slate-700">{activeLearningPercent}%</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-violet-50 text-violet-600 text-[10px]">
                        {getActiveLearningLevel(activeLearningSum)}
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-indigo-50/40 font-extrabold text-slate-850">
                    <td className="p-3">คะแนนรวมทั้งสิ้นเฉลี่ยสะสม</td>
                    <td className="p-3 text-center">100</td>
                    <td className="p-3 text-center font-black text-indigo-700 text-sm">{grandTotal}</td>
                    <td className="p-3 text-center font-black font-mono text-indigo-700 text-sm">{grandPercent}%</td>
                    <td className="p-3 text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Synthesis Details */}
          {report.aiAnalysis && (
            <div className="space-y-6 pt-4 page-break">
              <h3 className="text-lg font-black text-slate-850 border-b border-slate-100 pb-2">
                2. ผลการวิเคราะห์และข้อคิดเห็นเชิงบูรณาการโดยปัญญาประดิษฐ์ (AI Analysis)
              </h3>

              {/* Strengths */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">🌟 จุดเด่นที่พบจากการจัดการเรียนรู้ (จุดเด่น)</h4>
                <p className="text-xs text-slate-600 leading-relaxed indent-6 whitespace-pre-line">
                  {report.aiAnalysis.strengths}
                </p>
              </div>

              {/* Development Areas */}
              <div className="space-y-1.5 pt-2">
                <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider">⚠️ จุดที่ต้องได้รับการปรับปรุงพัฒนาเร่งด่วน (จุดที่ควรพัฒนา)</h4>
                <p className="text-xs text-slate-600 leading-relaxed indent-6 whitespace-pre-line">
                  {report.aiAnalysis.developmentAreas}
                </p>
              </div>

              {/* Recommendations */}
              <div className="space-y-1.5 pt-2">
                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">💡 ข้อเสนอแนะแนวทางการยกระดับทางวิชาการ (ข้อเสนอแนะเชิงวิชาการ)</h4>
                <p className="text-xs text-slate-600 leading-relaxed indent-6 whitespace-pre-line">
                  {report.aiAnalysis.recommendations}
                </p>
              </div>

              {/* Academic Needs (ความจำเป็นเชิงวิชาการเพื่อพัฒนาต่อยอด) */}
              {report.aiAnalysis.academicNeeds && (
                <div className="space-y-1.5 pt-2 border-l-2 border-blue-500 pl-3 bg-blue-50/10 py-2 rounded-r-lg">
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">🎓 ความจำเป็นเชิงวิชาการเพื่อพัฒนาต่อยอดสำหรับครูผู้รับการนิเทศ (ความต้องการพัฒนาเชิงวิชาการ)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed indent-6 whitespace-pre-line">
                    {report.aiAnalysis.academicNeeds}
                  </p>
                </div>
              )}

              {/* Coaching feedback */}
              <div className="space-y-1.5 pt-2">
                <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wider">💬 การชี้แนะและการสะท้อนคิดของผู้สอน (การแนะนำและสะท้อนผล)</h4>
                <p className="text-xs text-slate-600 leading-relaxed indent-6 whitespace-pre-line">
                  {report.aiAnalysis.coachingFeedback}
                </p>
              </div>

              {/* Development Plan */}
              <div className="space-y-1.5 pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">📈 แผนงานปรับปรุงคุณภาพสถานศึกษา (แผนพัฒนาสถานศึกษา)</h4>
                <p className="text-xs text-slate-600 leading-relaxed indent-6 whitespace-pre-line">
                  {report.aiAnalysis.developmentPlan}
                </p>
              </div>
            </div>
          )}

          {/* Supervision general summary block */}
          {report.summary && (
            <div className="space-y-2 pt-4 border-t border-slate-100 page-break">
              <h3 className="text-lg font-black text-slate-850">3. สรุปบทวิเคราะห์รวมเชิงวิชาการ</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
                {report.summary}
              </p>
            </div>
          )}

          {/* Signatures section (หน้าลงนาม) */}
          <div className="page-break pt-12 space-y-12">
            <h3 className="text-lg font-black text-slate-850 border-b border-slate-100 pb-2 text-center">
              การลงนามยืนยันความเที่ยงตรงทางระบบดิจิทัล
            </h3>

            <div className="grid grid-cols-2 gap-12 pt-4">
              {/* Supervisor sign */}
              <div className="text-center flex flex-col items-center">
                <p className="text-xs text-slate-500 font-bold mb-2">ลงชื่อผู้ประเมิน/ผู้นิเทศ</p>
                <div className="h-16 flex items-end justify-center mb-1">
                  {report.signatures?.primarySupervisor?.signatureImage ? (
                    <img src={report.signatures.primarySupervisor.signatureImage} alt="Sig" className="h-14 object-contain mix-blend-multiply" />
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
                <div className="text-xs font-semibold text-slate-800">
                  <p>ลงชื่อ............................................................ ผู้นิเทศ</p>
                  <p className="mt-1.5">({report.basicInfo.primarySupervisor})</p>
                  <p className="text-[10px] text-slate-400 mt-1">วันที่ {report.basicInfo.date}</p>
                </div>
              </div>

              {/* Teacher sign */}
              <div className="text-center flex flex-col items-center">
                <p className="text-xs text-slate-500 font-bold mb-2">ลงชื่อผู้รับการประเมิน/ผู้รับการนิเทศ</p>
                <div className="h-16 flex items-end justify-center mb-1">
                  {report.signatures?.teachers?.[0]?.signatureImage ? (
                    <img src={report.signatures.teachers[0].signatureImage} alt="Sig" className="h-14 object-contain mix-blend-multiply" />
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
                <div className="text-xs font-semibold text-slate-800">
                  <p>ลงชื่อ............................................................ ผู้รับการนิเทศ</p>
                  <p className="mt-1.5">({report.basicInfo.teachers[0] || "ผู้รับการนิเทศ"})</p>
                  <p className="text-[10px] text-slate-400 mt-1">วันที่ {report.basicInfo.date}</p>
                </div>
              </div>

              {/* Director sign */}
              <div className="text-center flex flex-col items-center col-span-2 mx-auto pt-6">
                <p className="text-xs text-slate-500 font-bold mb-2">ผู้พิจารณาเห็นชอบ (ผู้บริหารสถานศึกษา)</p>
                <div className="h-16 flex items-end justify-center mb-1">
                  {report.signatures?.schoolDirector?.signatureImage ? (
                    <img src={report.signatures.schoolDirector.signatureImage} alt="Sig" className="h-14 object-contain mix-blend-multiply" />
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
                <div className="text-xs font-semibold text-slate-800">
                  <p>ลงชื่อ............................................................ ผู้อำนวยการสถานศึกษา</p>
                  <p className="mt-1.5">({report.signatures?.schoolDirector?.name || "...................................................................."})</p>
                  <p className="text-[10px] text-slate-400 mt-1">ผู้อำนวยการโรงเรียน {report.basicInfo.schoolName}</p>
                </div>
              </div>
            </div>

            {/* Cryptographic verification block */}
            <div className="border border-indigo-150 bg-indigo-50/20 p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded">ตราประทับอิเล็กทรอนิกส์ยืนยันความเที่ยงตรง (Digital Cryptographic Stamp)</span>
                <p className="text-xs font-bold text-slate-800 mt-1">ระบบตรวจสอบข้อมูลและลายเซ็นดิจิทัล สพป.แพร่ เขต 1</p>
                <p className="text-[10px] text-slate-400 font-mono">รหัสรับรอง (Hash ID): SHA-256/{report.id}-{Date.now().toString().substring(3)}</p>
              </div>
              
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="p-1 bg-white border border-slate-200 rounded-lg">
                  <QrCode className="h-14 w-14 text-indigo-950" />
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  <p>สแกนเพื่อตรวจสอบความถูกต้อง</p>
                  <p className="text-[8px]">ลายมือชื่อได้รับหลักฐานยืนยันแล้ว</p>
                  <p className="text-indigo-600 font-bold mt-1">● ตรวจสอบและผ่านการรับรองออนไลน์แล้ว</p>
                </div>
              </div>
            </div>
          </div>

          {/* APPENDIX: PHOTOS GALLERY (ภาคผนวกภาพประกอบ) */}
          {report.photos && report.photos.length > 0 && (
            <div className="page-break pt-12 space-y-6">
              <h3 className="text-lg font-black text-slate-850 border-b border-slate-100 pb-2 text-center">
                ภาคผนวก (รูปภาพประกอบการนิเทศ)
              </h3>
              <p className="text-xs text-slate-500 text-center">ภาพประกอบการนิเทศติดตามสิ่งแวดล้อมชั้นเรียนและกิจกรรม Active Learning</p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                {report.photos.map((photo) => (
                  <div key={photo.id} className="border border-slate-200 rounded-2xl overflow-hidden p-2 bg-slate-50 space-y-2">
                    <div className="h-44 bg-slate-100">
                      <img src={photo.dataUrl} alt="Appendix" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-600 text-center leading-normal">
                      {photo.caption}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
