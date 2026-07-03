import { School, IndicatorScore } from "./types";

export const initialSchools: School[] = [
  { id: "school-1", name: "บ้านลอง (ฟองจันทร์ราษฎร์อุปถัมภ์)" },
  { id: "school-2", name: "วัดทุ่งล้อม (ทองประชานะเคราะห์)" },
  { id: "school-3", name: "ท่าวะ (ราษฎร์บำรุง)" },
];

export const initialSupervisors: string[] = [
  "นายพิชญุตม์ คงทอง",
  "นายพีรวัฒน์ ดีพอ",
  "นายชัยพิสิษฐ์ เพชรอมรเมธากุล",
];

export const availableGrades: string[] = [
  "อนุบาล 1/1", "อนุบาล 1/2", "อนุบาล 2/1", "อนุบาล 2/2", "อนุบาล 3/1", "อนุบาล 3/2",
  "ป.1/1", "ป.1/2", "ป.2/1", "ป.2/2", "ป.3/1", "ป.3/2", "ป.4/1", "ป.4/2", "ป.5/1", "ป.5/2", "ป.6/1", "ป.6/2",
  "ม.1/1", "ม.1/2", "ม.2/1", "ม.2/2", "ม.3/1", "ม.3/2"
];

export const academicYears: string[] = [
  "2569", "2570", "2571", "2572", "2573", "2574", "2575", "2576", "2577", "2578", "2579", "2580"
];

export const classroomIndicators: string[] = [
  "ความสะอาดและความปลอดภัย",
  "บรรยากาศส่งเสริมการเรียนรู้",
  "สัญลักษณ์ชาติ ศาสนา พระมหากษัตริย์",
  "ป้ายชื่อและข้อมูลห้องเรียน",
  "ข้อตกลงในห้องเรียน",
  "มุมแสดงผลงานนักเรียน",
  "ตารางกิจกรรมและตารางสอน",
  "สื่อและเทคโนโลยี",
  "ระบบดูแลช่วยเหลือนักเรียน",
  "มุมส่งเสริมการอ่าน",
  "ป้ายนิเทศและการตกแต่ง",
  "แผนการจัดการเรียนรู้"
];

export interface ActiveLearningCategory {
  id: string;
  name: string;
  indicators: { index: number; name: string }[];
}

export const activeLearningCategories: ActiveLearningCategory[] = [
  {
    id: "cat-1",
    name: "หมวดที่ 1 การวางแผนการจัดการเรียนรู้",
    indicators: [
      { index: 1, name: "แผนการสอนสอดคล้องมาตรฐาน" },
      { index: 2, name: "ออกแบบกิจกรรม Active Learning" }
    ]
  },
  {
    id: "cat-2",
    name: "หมวดที่ 2 การจัดการเรียนรู้",
    indicators: [
      { index: 3, name: "ผู้เรียนมีส่วนร่วม" },
      { index: 4, name: "ส่งเสริมการคิดวิเคราะห์" }
    ]
  },
  {
    id: "cat-3",
    name: "หมวดที่ 3 สื่อและนวัตกรรม",
    indicators: [
      { index: 5, name: "ใช้สื่อเหมาะสม" },
      { index: 6, name: "ใช้นวัตกรรมสนับสนุนการเรียนรู้" }
    ]
  },
  {
    id: "cat-4",
    name: "หมวดที่ 4 การวัดผล",
    indicators: [
      { index: 7, name: "ประเมินตามสภาพจริง" },
      { index: 8, name: "ใช้ข้อมูลสะท้อนผลการเรียนรู้" }
    ]
  },
  {
    id: "cat-5",
    name: "หมวดที่ 5 บรรยากาศการเรียนรู้",
    indicators: [
      { index: 9, name: "ห้องเรียนเชิงบวก" },
      { index: 10, name: "ส่งเสริมการเรียนรู้ร่วมกัน" }
    ]
  }
];

export const defaultClassroomScores = (): IndicatorScore[] =>
  classroomIndicators.map((name, idx) => ({
    index: idx + 1,
    name,
    score: 0,
    note: ""
  }));

export const defaultActiveLearningScores = (): IndicatorScore[] => {
  const scores: IndicatorScore[] = [];
  activeLearningCategories.forEach(cat => {
    cat.indicators.forEach(ind => {
      scores.push({
        index: ind.index,
        name: ind.name,
        score: 0,
        note: ""
      });
    });
  });
  return scores;
};
