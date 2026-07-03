import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API routes go here FIRST
app.post("/api/ai-analysis", async (req, res) => {
  try {
    const { classroomScores, activeLearningScores, basicInfo } = req.body;
    
    // Construct a comprehensive educational prompt in Thai
    const prompt = `คุณคือผู้เชี่ยวชาญด้านการศึกษาระดับประเทศและศึกษานิเทศก์อัจฉริยะ (Smart Supervision AI) สังกัด สำนักงานเขตพื้นที่การศึกษาประถมศึกษาแพร่ เขต 1 (สพป.แพร่ เขต 1)
จงทำการวิเคราะห์ผลการประเมินการนิเทศภายในสถานศึกษาอย่างมืออาชีพตามหลักวิชาการศึกษาชั้นสูง โดยประมวลผลข้อมูลจริงดังต่อไปนี้:

ข้อมูลการประเมินเบื้องต้น:
- โรงเรียน: ${basicInfo.schoolName || "ไม่ระบุ"}
- ระดับชั้น: ${basicInfo.grade || "ไม่ระบุ"}
- ครูผู้รับการนิเทศ: ${basicInfo.teachers?.join(", ") || "ไม่ระบุ"}
- ผู้นิเทศหลัก: ${basicInfo.primarySupervisor || "ไม่ระบุ"}
- คณะผู้นิเทศร่วม: ${basicInfo.coSupervisors?.join(", ") || "ไม่ระบุ"}
- วิชา/กิจกรรม: ${basicInfo.subject || "ไม่ระบุ"}
- ปีการศึกษา: ${basicInfo.academicYear} ภาคเรียนที่: ${basicInfo.semester} รอบการนิเทศที่: ${basicInfo.round}

ผลการประเมินห้องเรียนคุณภาพ (คะแนนเต็มข้อละ 5 คะแนน, รวม 12 ตัวชี้วัด, คะแนนรวม 60 คะแนน):
${classroomScores.map((s: any, idx: number) => `${idx + 1}. ${s.name}: ได้ ${s.score}/5 คะแนน ${s.note ? `(หมายเหตุ: ${s.note})` : ""}`).join("\n")}
คะแนนรวมห้องเรียนคุณภาพ: ${classroomScores.reduce((sum: number, s: any) => sum + s.score, 0)}/60 คะแนน

ผลการประเมิน Active Learning (คะแนนเต็มข้อละ 4 คะแนน, รวม 10 ข้อใน 5 หมวด, คะแนนรวม 40 คะแนน):
${activeLearningScores.map((s: any, idx: number) => `${idx + 1}. ${s.name}: ได้ ${s.score}/4 คะแนน`).join("\n")}
คะแนนรวม Active Learning: ${activeLearningScores.reduce((sum: number, s: any) => sum + s.score, 0)}/40 คะแนน

กรุณาเขียนบทวิเคราะห์สะท้อนคิดเชิงลึกอย่างสร้างสรรค์ เพื่อพัฒนาคุณภาพการจัดการเรียนรู้ของครูผู้สอน โดยตอบกลับมาในรูปแบบของ JSON ที่มีฟิลด์ตรงตามโครงสร้างด้านล่าง (ใช้ภาษาไทยที่เป็นทางการ สุภาพ ถูกหลักวิชาการศึกษา และมีรายละเอียดเชิงปฏิบัติการ):
1. strengths (จุดเด่นที่ควรชื่นชม): สรุปจุดเด่นของห้องเรียนและการสอนนี้เป็นข้อๆ (อย่างน้อย 3 ข้อ)
2. developmentAreas (จุดที่ควรได้รับการพัฒนา): สรุปจุดที่ควรปรับปรุงอย่างเฉพาะเจาะจง (อย่างน้อย 2 ข้อ)
3. recommendations (ข้อเสนอแนะเชิงลึก): วิธีการปรับปรุงและเทคนิคการจัดการเรียนรู้เพิ่มเติมที่เป็นรูปธรรมและปฏิบัติได้จริง
4. coachingFeedback (แนวทางจิตวิทยาการโค้ช): วิธีประสานงาน ชี้แนะ และสร้างขวัญกำลังใจแก่ครูผู้รับการนิเทศ (Coaching & Feedback)
5. developmentPlan (แผนพัฒนาคุณภาพสถานศึกษา): แนวทางการพัฒนาต่อเนื่องในระดับรายวิชาและระดับภาพรวมโรงเรียน
6. executiveSummary (สรุปภาพรวมสำหรับผู้บริหาร): รายงานสรุปเชิงนโยบายสั้นๆ สำหรับผู้อำนวยการโรงเรียนพิจารณาอนุมัติเชิงนโยบาย
7. academicNeeds (ความจำเป็นเชิงวิชาการเพื่อการพัฒนาต่อยอด): ความต้องการเชิงวิชาการที่จำเป็น สื่อ อุปกรณ์ เทคนิคการสอน หรือนวัตกรรมทางการเรียนรู้ที่เป็นประโยชน์สูงสุดต่อผู้รับการนิเทศเพื่อพัฒนาต่อยอดในเชิงลึก`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strengths: { type: Type.STRING, description: "จุดเด่นของการจัดสภาพแวดล้อมห้องเรียนคุณภาพและการออกแบบ Active Learning สรุปเป็นหัวข้อเชิงวิเคราะห์" },
            developmentAreas: { type: Type.STRING, description: "จุดสำคัญที่ต้องได้รับการพัฒนาปรับปรุงตามเกณฑ์มาตรฐาน" },
            recommendations: { type: Type.STRING, description: "ข้อเสนอแนะแนะแนววิถีใหม่เพื่อการพัฒนาที่รวดเร็วและยั่งยืน" },
            coachingFeedback: { type: Type.STRING, description: "ข้อคิดเห็นและการชี้แนะเชิงสร้างสรรค์เพื่อการเปลี่ยนแปลงพฤติกรรมการสอน" },
            developmentPlan: { type: Type.STRING, description: "แนวทางหรือกรอบแผนพัฒนาระยะสั้นและระยะยาว" },
            executiveSummary: { type: Type.STRING, description: "ข้อพิจารณาเชิงบริหารสำหรับผู้อำนวยการสถานศึกษา" },
            academicNeeds: { type: Type.STRING, description: "ความจำเป็นเชิงวิชาการ การสนับสนุน สื่อ นวัตกรรม ความรู้ที่เป็นประโยชน์ต่อผู้รับการนิเทศเพื่อนำไปใช้พัฒนาอย่างเป็นรูปธรรม" }
          },
          required: ["strengths", "developmentAreas", "recommendations", "coachingFeedback", "developmentPlan", "executiveSummary", "academicNeeds"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "เกิดข้อผิดพลาดในการวิเคราะห์ด้วย AI" });
  }
});

// Wrap everything below inside an async start function to avoid top level await in CommonJS build
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap().catch(err => {
  console.error("Failed to start server:", err);
});
