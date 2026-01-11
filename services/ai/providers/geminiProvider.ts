
import { TileData, TilingMethod, PaintData } from "../../../types";

const callGeminiAPI = async (payload: any) => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) throw new Error("API Key không tìm thấy trong .env.local");

    // Sử dụng model v1 ổn định
    const model = "gemini-1.5-flash-latest";
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${key}`;

    console.log("📡 Calling Gemini API:", url);

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Gemini API Error:", errorData);
        throw new Error(errorData.error?.message || "Lỗi kết nối Gemini");
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

// ============================================
// HÀM PHÂN TÍCH ẢNH GẠCH
// ============================================
export const analyzeTileFromImage = async (imageBase64: string): Promise<string> => {
    const prompt = `BẠN LÀ CHUYÊN GIA VẬT LIỆU XÂY DỰNG CỦA GRANDCERA. Hãy phân tích ảnh mẫu gạch này và đề xuất thông số...`;

    const payload = {
        contents: [{
            parts: [
                { text: prompt },
                { inlineData: { mimeType: 'image/jpeg', data: imageBase64.split(',')[1] || imageBase64 } }
            ]
        }]
    };

    return await callGeminiAPI(payload);
};

// ============================================
// HÀM CHAT AI TƯ VẤN
// ============================================
export const getAIChatResponse = async (message: string, imageBase64?: string) => {
    const parts: any[] = [{ text: message }];
    if (imageBase64) {
        parts.push({
            inline_data: { mime_type: 'image/jpeg', data: imageBase64.split(',')[1] || imageBase64 }
        });
    }

    const payload = {
        contents: [{ parts }],
        systemInstruction: {
            parts: [{ text: "BẠN LÀ CHUYÊN GIA TƯ VẤN CỦA GRANDCERA. Trả lời bằng tiếng Việt, chuyên nghiệp." }]
        }
    };

    return await callGeminiAPI(payload);
};

// ============================================
// HÀM PHÂN TÍCH BỐI CẢNH PHÒNG (Dành cho Rendering)
// ============================================
export const describeRoomLayout = async (imageBase64: string): Promise<string> => {
    try {
        const prompt = `Act as an Architect. Analyze this interior image and describe the structural layout in detail (walls, furniture, stairs). Reply in English, concisely.`;

        const payload = {
            contents: [{
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType: 'image/jpeg', data: imageBase64.split(',')[1] || imageBase64 } }
                ]
            }]
        };

        return await callGeminiAPI(payload);
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
