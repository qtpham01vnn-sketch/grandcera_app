
import { GoogleGenAI } from "@google/genai";
import { TileData, TilingMethod, PaintData } from "../../../types";

// Helper để lấy AI instance an toàn
const getAI = () => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) throw new Error("API Key không tìm thấy trong .env.local");
    return new GoogleGenAI({ apiKey: key });
};

// ============================================
// HÀM PHÂN TÍCH ẢNH GẠCH
// ============================================
export const analyzeTileFromImage = async (imageBase64: string): Promise<string> => {
    const prompt = `BẠN LÀ CHUYÊN GIA VẬT LIỆU XÂY DỰNG CỦA GRANDCERA. Hãy phân tích ảnh mẫu gạch này và đề xuất thông số...`;

    const parts = [
        { text: prompt },
        { inlineData: { mimeType: 'image/jpeg', data: imageBase64.split(',')[1] || imageBase64 } }
    ];

    try {
        const ai = getAI();
        console.log("📡 Calling Gemini SDK for tile analysis...");
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{ role: 'user', parts }]
        });
        return response.text || "";
    } catch (error) {
        console.error("❌ Gemini Tile Analysis Error:", error);
        throw error;
    }
};

// ============================================
// HÀM CHAT AI TƯ VẤN
// ============================================
export const getAIChatResponse = async (message: string, imageBase64?: string) => {
    const systemPrompt = "BẠN LÀ CHUYÊN GIA TƯ VẤN CỦA GRANDCERA - PHƯƠNG NAM STUDIO. Trả lời bằng tiếng Việt, chuyên nghiệp, ngắn gọn.";
    const fullMessage = `${systemPrompt}\n\nKhách hỏi: ${message}`;

    const parts: any[] = [{ text: fullMessage }];
    if (imageBase64) {
        parts.push({
            inlineData: { mimeType: 'image/jpeg', data: imageBase64.split(',')[1] || imageBase64 }
        });
    }

    try {
        const ai = getAI();
        console.log("📡 Calling Gemini SDK for chat...");
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{ role: 'user', parts }]
        });
        return response.text || "";
    } catch (error) {
        console.error("❌ Gemini Chat Error:", error);
        throw error;
    }
};

// ============================================
// HÀM PHÂN TÍCH BỐI CẢNH PHÒNG (Dành cho Rendering)
// ============================================
export const describeRoomLayout = async (imageBase64: string): Promise<string> => {
    try {
        const prompt = `Act as an Architect. Analyze this interior image and describe the structural layout in detail (walls, furniture, stairs). Reply in English, concisely.`;

        const parts = [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: imageBase64.split(',')[1] || imageBase64 } }
        ];

        const ai = getAI();
        console.log("📡 Calling Gemini SDK for room analysis...");
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{ role: 'user', parts }]
        });
        return response.text || "";
    } catch (error) {
        console.error("❌ Gemini Vision Error:", error);
        return "An interior construction site, raw brick walls, concrete ceilings, same structural layout as uploaded base image.";
    }
};

// ============================================
// HÀM RENDER GEMINI (FALLBACK SANG FLUX)
// ============================================
export const renderWithGemini = async (prompt: string, baseImage: string, chatImageRefs: string[] = []) => {
    // Hiện tại Gemini chưa hỗ trợ tạo ảnh trực tiếp qua API này, 
    // nên ta ném lỗi để Orchestrator tự động chuyển sang Flux.
    throw new Error("Gemini Image Generation mode is for analysis only. Switching to Flux...");
};
