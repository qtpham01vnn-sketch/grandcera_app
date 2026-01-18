
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
// ============================================
// HÀM CHAT AI TƯ VẤN + PHÂN TÍCH GẠCH THÔNG MINH
// ============================================
export const getAIChatResponse = async (message: string, imageBase64?: string) => {
    // 1. System Prompt nâng cao
    let systemPrompt = `BẠN LÀ CHUYÊN GIA TƯ VẤN VẬT LIỆU CỦA GRANDCERA.
    - Trả lời Tiếng Việt thân thiện, chuyên nghiệp.
    - Nếu khách hỏi về gạch, hãy tư vấn về phong cách, màu sắc.`;

    // 2. Nếu có ảnh, kích hoạt chế độ phân tích gạch
    if (imageBase64) {
        systemPrompt += `
        \n[NHIỆM VỤ ĐẶC BIỆT KHI CÓ ẢNH]:
        1. Nhận diện mẫu gạch trong ảnh.
        2. Tư vấn ngắn gọn về mẫu gạch này.
        3. Ở CUỐI CÙNG phản hồi, BẮT BUỘC chèn một khối JSON dữ liệu gạch theo định dạng sau (để hệ thống lưu kho):
        
        ||TILE_DATA_START||
        {
            "name": "Tên gợi ý cho gạch (Ví dụ: Marble Carrara White)",
            "description": "Mô tả ngắn về vân và bề mặt",
            "size": "Kích thước ước lượng (Ví dụ: 600x600)",
            "tile_surface": "Glossy hoặc Matte",
            "tile_type": "floor" (nếu là gạch lát) hoặc "wall" (nếu là gạch ốp)
        }
        ||TILE_DATA_END||
        `;
    }

    const fullMessage = `${systemPrompt}\n\nKhách hỏi: ${message}`;

    // Chuẩn bị payload gửi Gemini
    const parts: any[] = [{ text: fullMessage }];
    if (imageBase64) {
        parts.push({
            inlineData: { mimeType: 'image/jpeg', data: imageBase64.split(',')[1] || imageBase64 }
        });
    }

    try {
        const ai = getAI();
        console.log("📡 Calling Gemini SDK for Chat & Analysis...");
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{ role: 'user', parts }]
        });

        const text = response.text || "";
        console.log("🤖 AI Response:", text); // Log để debug xem có JSON không
        return text;

    } catch (error) {
        console.error("❌ Gemini Chat Error:", error);
        return "Xin lỗi anh Tuấn, em đang gặp chút trục trặc khi phân tích ảnh. Anh gửi lại giúp em nhé!";
    }
};

// ============================================
// HÀM PHÂN TÍCH BỐI CẢNH PHÒNG CHI TIẾT (Spatial Mapping)
// ============================================
export const describeRoomLayout = async (imageBase64: string): Promise<string> => {
    try {
        // PROMPT SIÊU CHI TIẾT ĐỂ MÔ TẢ VỊ TRÍ KHÔNG GIAN
        const prompt = `You are an expert Architectural Analyst. Your task is to describe the EXACT SPATIAL LAYOUT of this interior image so another AI can recreate the SAME structure.

CRITICAL: Be EXTREMELY SPECIFIC about positions using LEFT/RIGHT/CENTER/FRONT/BACK references.

Analyze and describe:
1. CAMERA VIEWPOINT: Where is the camera positioned? (e.g., "Camera facing the back wall from the front entrance")
2. STAIRCASE POSITION: Is there a staircase? LEFT side, RIGHT side, or CENTER? Going up or down? How many steps visible?
3. WINDOWS: How many windows? On which wall (LEFT wall, RIGHT wall, BACK wall)? Size (large, small)?
4. DOORS: Any doors visible? Position?
5. COLUMNS/PILLARS: Any structural columns? Position?
6. CEILING: Flat or sloped? Exposed beams? Height estimate?
7. WALLS: Brick, concrete, plastered? Which walls are visible?
8. FLOOR: Concrete, tiles, dirt?
9. LIGHTING: Where is the main light source coming from? (LEFT window, RIGHT window, ceiling)
10. PEOPLE/OBJECTS: Any people or construction materials visible? Where?

FORMAT YOUR RESPONSE AS A SINGLE PARAGRAPH IN ENGLISH, example:
"Camera facing the back wall. LEFT side: concrete staircase going up with 10 steps visible. RIGHT wall: 3 large rectangular windows letting in natural light. BACK wall: glass door or opening. FRONT LEFT: vertical pipe. Ceiling: exposed concrete beams. Floor: raw concrete. Two workers standing in the center-right area."

BE PRECISE ABOUT LEFT/RIGHT/CENTER POSITIONS!`;

        const parts = [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: imageBase64.split(',')[1] || imageBase64 } }
        ];

        const ai = getAI();
        console.log("📡 Calling Gemini SDK for DETAILED room analysis...");
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{ role: 'user', parts }]
        });

        const description = response.text || "";
        console.log("🏗️ Room Layout Description:", description);
        return description;

    } catch (error) {
        console.error("❌ Gemini Vision Error:", error);
        return "An interior construction site, raw brick walls, concrete ceilings. Staircase on the LEFT side. Windows on the RIGHT wall.";
    }
};

// ============================================
// HÀM RENDER VỚI GEMINI 2.5 FLASH IMAGE (THEO CÔNG THỨC AI STUDIO)
// ============================================

// Helper chuyển URL/Base64 sang Base64 thuần
const imageUrlToBase64 = async (url: string): Promise<string> => {
    if (!url) return "";
    if (url.startsWith('data:image')) {
        return url.split(',')[1];
    }
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                resolve(base64String.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error("Lỗi chuyển đổi ảnh:", e);
        return "";
    }
};

export const renderWithGeminiImage = async (
    tilingMethod: string,          // Phương án ốp (PA1, PA2...)
    roomImage: string,             // Ảnh phòng gốc (base64)
    floorTileImage?: string,       // Ảnh mẫu gạch sàn
    wallTileImage?: string,        // Ảnh mẫu gạch tường
    accentTileImage?: string       // Ảnh mẫu gạch điểm nhấn
): Promise<string> => {
    try {
        const ai = getAI();
        console.log("🎨 Calling Gemini 2.5 Flash Image (AI Studio Formula)...");

        // Chuyển đổi ảnh sang Base64 thuần
        const floorBase64 = floorTileImage ? await imageUrlToBase64(floorTileImage) : "";
        const wallBase64 = wallTileImage ? await imageUrlToBase64(wallTileImage) : "";
        const accentBase64 = accentTileImage ? await imageUrlToBase64(accentTileImage) : "";

        // PROMPT DNA LOCK (Theo công thức AI Studio)
        const prompt = `LỆNH DIỄN HỌA KIẾN TRÚC TỐI CAO - GRANDCERA STUDIO:

1. DNA MATERIAL LOCK (KHÓA VẬT LIỆU):
   - Tuyệt đối KHÔNG ĐƯỢC tự ý sáng tạo vân gạch.
   - Bạn PHẢI trích xuất 100% vân và màu sắc từ [ẢNH MẪU SÀN] và [ẢNH MẪU TƯỜNG] tôi gửi kèm.
   - Kết quả render phải có màu sắc và hoa văn gạch giống hệt như ảnh mẫu.

2. STAIRCASE OVERDRIVE (PHỦ KÍN VÁCH CẦU THANG):
   - Chú ý mảng tường gạch đỏ XÂY THÔ ở BÊN PHẢI CẦU THANG và PHÍA SAU CỘT.
   - MỆNH LỆNH: Phải phủ vật liệu gạch ốp lên toàn bộ diện tích tường gạch đỏ này.
   - KHÔNG ĐƯỢC để hở bất kỳ cm2 gạch đỏ nào.

3. PHƯƠNG ÁN THI CÔNG: ${tilingMethod}

4. GIỮ NGUYÊN HIỆN TRẠNG: Giữ nguyên kết cấu cầu thang, cây chống sắt, vị trí cửa sổ.`;

        // Build parts array với LABEL rõ ràng trước mỗi ảnh
        const parts: any[] = [
            { text: prompt },
            { text: "[ẢNH HIỆN TRẠNG CÔNG TRÌNH]:" },
            { inlineData: { mimeType: 'image/jpeg', data: roomImage.split(',')[1] || roomImage } },
        ];

        // Thêm ảnh gạch sàn với label
        if (floorBase64) {
            parts.push(
                { text: "[ẢNH MẪU SÀN - DNA CHUẨN]:" },
                { inlineData: { mimeType: 'image/jpeg', data: floorBase64 } }
            );
        }

        // Thêm ảnh gạch tường với label
        if (wallBase64) {
            parts.push(
                { text: "[ẢNH MẪU TƯỜNG - DNA CHUẨN]:" },
                { inlineData: { mimeType: 'image/jpeg', data: wallBase64 } }
            );
        }

        // Thêm ảnh gạch điểm nhấn với label
        if (accentBase64) {
            parts.push(
                { text: "[ẢNH MẪU ĐIỂM - DNA CHUẨN]:" },
                { inlineData: { mimeType: 'image/jpeg', data: accentBase64 } }
            );
        }

        console.log(`📸 Gửi ${parts.filter(p => p.inlineData).length} ảnh đến Gemini`);

        // Gọi API với config ĐÚNG từ AI Studio
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: {
                imageConfig: { aspectRatio: "16:9" }
            }
        });

        // Trích xuất ảnh từ response
        const imgPart = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
        if (imgPart?.inlineData?.data) {
            console.log("✅ Gemini Image generated successfully!");
            return `data:image/png;base64,${imgPart.inlineData.data}`;
        }

        throw new Error("Không nhận được ảnh từ Gemini");

    } catch (error: any) {
        console.error("❌ Gemini Image Generation Error:", error);
        throw error;
    }
};

// Legacy function for compatibility
export const renderWithGemini = async (prompt: string, baseImage: string, chatImageRefs: string[] = []) => {
    throw new Error("Use renderWithGeminiImage instead for image generation with reference tiles.");
};
