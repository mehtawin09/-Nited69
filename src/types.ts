export type UserRole = "Super Admin" | "Admin โรงเรียน" | "ผู้อำนวยการโรงเรียน" | "คณะผู้นิเทศ" | "ครูผู้รับการนิเทศ";

export interface School {
  id: string;
  name: string;
  logoUrl?: string; // Base64 or standard logo image URL
  isCustom?: boolean;
  code?: string;
  subDistrict?: string;
}

export interface IndicatorScore {
  index: number;
  name: string;
  score: number; // 1-5 for Classroom, 1-4 for Active Learning
  note?: string;
}

export interface AIAnalysisResult {
  strengths: string;
  developmentAreas: string;
  recommendations: string;
  coachingFeedback: string;
  developmentPlan: string;
  executiveSummary: string;
  academicNeeds?: string; // ความจำเป็นเชิงวิชาการเพื่อพัฒนาต่อยอด
}

export interface SignatureData {
  roleTitle: string; // e.g. "ผู้นิเทศหลัก", "ผู้อำนวยการโรงเรียน"
  name: string;
  signed: boolean;
  date?: string;
  padData?: string; // Drawing pad string path
  signatureImage?: string; // base64 or upload path
}

export interface ActivityPhoto {
  id: string;
  dataUrl: string; // Base64 URL
  caption: string;
  order: number;
}

export interface BasicInfo {
  schoolId: string;
  schoolName: string;
  grade: string;
  date: string;
  time: string;
  academicYear: string;
  semester: string;
  round: string;
  teachers: string[]; // List of teachers (minimum 3 fields provided by UI, unlimited extensible)
  primarySupervisor: string;
  coSupervisors: string[]; // List of co-supervisors (unlimited extensible)
  subject: string;
}

export interface SupervisionReport {
  id: string;
  status: "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected";
  basicInfo: BasicInfo;
  classroomScores: IndicatorScore[]; // 12 indicators (max 60 points)
  activeLearningScores: IndicatorScore[]; // 10 indicators (max 40 points)
  aiAnalysis: AIAnalysisResult | null;
  summary: string; // Supervision summary, can be auto-generated & modified
  signatures: {
    primarySupervisor?: SignatureData;
    coSupervisors?: SignatureData[];
    schoolDirector?: SignatureData;
    teachers?: SignatureData[];
  };
  photos: ActivityPhoto[];
  createdAt: string;
  updatedAt: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId?: string; // optional binding to a school
}
