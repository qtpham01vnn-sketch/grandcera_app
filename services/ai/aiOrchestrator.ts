
import { TileData, TilingMethod, PaintData } from "../../types";
import { analyzeTileFromImage, getAIChatResponse, describeRoomLayout, renderWithGemini } from "./providers/geminiProvider";
import { renderWithFlux } from "./providers/fluxProvider";

// Xuất lại các hàm tư vấn từ Gemini
export { analyzeTileFromImage, getAIChatResponse, describeRoomLayout };

// ============================================
// HÀM TẠO PROMPT CHO TỪNG PHƯƠNG ÁN ỐP
// ============================================
const getTilingPrompt = (method: TilingMethod, paint?: PaintData | null): string => {
    const paintName = paint?.name || 'Trắng Sứ';
    const paintHex = paint?.hex || '#FFFFFF';

    switch (method) {
        case 'PA1_full_height':
            return `PHƯƠNG ÁN 1: ỐP KỊCH TRẦN (Full Height). Ốp gạch 100% từ SÀN lên đến TRẦN nhà trên tất cả 4 VÁCH TƯỜNG và CÁC GÓC KHUẤT. KHÔNG có phần sơn nước. Toàn bộ tường gạch thô phải được phủ kín hoàn toàn.`;

        case 'PA2_half_wall_120':
            return `PHƯƠNG ÁN 2: ỐP LỬNG 1.2M. CHÂN TƯỜNG (0 - 120cm): Ốp 4 hàng gạch ĐẬM màu. PHẦN TRÊN (>120cm): SƠN NƯỚC màu ${paintName} (${paintHex}). Đường phân cách ốp-sơn ở độ cao 1.2 mét.`;

        case 'PA3_half_wall_border':
            return `PHƯƠNG ÁN 3: ỐP 1.2M + VIỀN (~1.5M). CHÂN TƯỜNG (0 - 120cm): Ốp gạch THÂN ĐẬM. VIỀN (120 - 150cm): Ốp 1 hàng gạch VIỀN trang trí khác màu. PHẦN TRÊN (>150cm): SƠN NƯỚC màu ${paintName} (${paintHex}).`;

        case 'PA4_with_accent':
            return `PHƯƠNG ÁN 4: ỐP CÓ GẠCH ĐIỂM NHẤN. CHÂN TƯỜNG (0 - 120cm): Ốp gạch THÂN ĐẬM, XEN KẼ viên gạch ĐIỂM hoa văn để tạo focal point. PHẦN TRÊN (>120cm): SƠN NƯỚC màu ${paintName} (${paintHex}).`;

        case 'PA5_wainscoting':
            return `PHƯƠNG ÁN 5: WAINSCOTING (Cổ điển 80cm). CHÂN TƯỜNG (0 - 80cm): Ốp 2-3 hàng gạch có chỉ phào trang trí ở viền trên. PHẦN TRÊN (>80cm): SƠN NƯỚC màu ${paintName} (${paintHex}). Phong cách tân cổ điển.`;

        case 'PA6_accent_wall':
            return `PHƯƠNG ÁN 6: TƯỜNG ĐIỂM NHẤN. CHỈ ỐP 1 BỨC TƯỜNG CHÍNH làm điểm nhấn (kịch trần). CÁC VÁCH KHÁC: SƠN NƯỚC màu ${paintName} (${paintHex}).`;

        default:
            return `Ốp theo phương án đã chọn.`;
    }
};

// ============================================
// BỘ ĐIỀU PHỐI AI (ORCHESTRATOR)
// ============================================
export const renderVisual = async (
    floor: TileData,
    dark: TileData | null,
    light: TileData | null,
    accent: TileData | null,
    paint: PaintData | null,
    method: TilingMethod,
    baseImage: string,
    chatImageRefs: string[] = []
): Promise<string> => {
    // 1. CHUẨN BỊ LOGIC ỐP LÁT
    const tilingLogic = getTilingPrompt(method, paint);

    // 2. TỔNG HỢP MÔ TẢ VẬT LIỆU CHI TIẾT (Lấy từ constants)
    const floorDesc = `${floor.name}: ${floor.description || ''}, surface: ${floor.tile_surface}`;
    const darkDesc = dark ? `${dark.name}: ${dark.description || ''}, surface: ${dark.tile_surface}` : 'N/A';
    const lightDesc = light ? `${light.name}: ${light.description || ''}, surface: ${light.tile_surface}` : 'N/A';
    const accentDesc = accent ? `${accent.name}: ${accent.description || ''}, surface: ${accent.tile_surface}` : 'N/A';
    const paintDesc = paint ? `${paint.name} (${paint.hex})` : 'White';

    // 3. TẠO PROMPT DÀNH CHO FLUX (Phối hợp Tiếng Anh + Cấu trúc)
    let fluxPrompt = `PHUONG NAM STUDIO ARCHITECTURAL VISUALIZATION. 
    SCENE: The original room.
    TASK: Change wall and floor materials while STRICTLY KEEPING THE ARCHITECTURAL STRUCTURE.
    MATERIALS:
    - Floor: ${floorDesc}
    - Wall Bottom: ${darkDesc}
    - Wall Top: ${lightDesc}
    - Paint: ${paintDesc}
    METHOD: ${tilingLogic}.
    STYLE: Highly realistic showroom style, sharp textures, 8K.`;

    try {
        // BƯỚC A: PHÂN TÍCH BỐI CẢNH (Bọc kỹ để không làm sập cả hàm)
        console.log("🔍 Đang phân tích cấu trúc phòng...");
        const roomDescription = await describeRoomLayout(baseImage);

        // Cập nhật Flux Prompt với bối cảnh chi tiết hơn
        fluxPrompt = `PHUONG NAM STUDIO ARCHITECTURAL RENDER. 
ROOM CONTEXT: ${roomDescription}. 
STRICT MANDATE: Existing raw construction site with brick walls and concrete structure. DO NOT CHANGE the room geometry, stairs, or doors.
TILES TO APPLY: Use ${floorDesc} for flooring, ${darkDesc} for lower walls, and ${lightDesc} for upper walls following ${tilingLogic}.
STYLE: Ultra-realistic architecture photography, 8K resolution, sharp tiling textures, professional lighting.`;

        const vietnamesePrompt = `YÊU CẦU DIỄN HỌA KIẾN TRÚC GRANDCERA V12.0
        - BỐI CẢNH: ${roomDescription}
        - VẬT LIỆU: Sàn (${floorDesc}), Tường Đậm (${darkDesc}), Tường Nhạt (${lightDesc}).
        - PHƯƠNG ÁN: ${tilingLogic}
        - QUY ĐỊNH: GIỮ NGUYÊN KIẾN TRÚC NHÀ, chỉ thay đổi mảng gạch và sơn.`;

        // BƯỚC B: THỬ RENDER VỚI GEMINI
        console.log("🚀 Đang thử Render với Gemini...");
        return await renderWithGemini(vietnamesePrompt, baseImage, chatImageRefs);

    } catch (error: any) {
        console.warn("⚠️ CẢNH BÁO: Gemini gặp sự cố (Có thể do API Key), chuyển sang Flux!", error?.message);

        // BƯỚC C: HỆ THỐNG DỰ PHÒNG FLUX (Luôn chạy nếu Gemini lỗi)
        console.log("🔥 Đang kích hoạt hệ thống dự phòng Flux...");
        try {
            return await renderWithFlux(fluxPrompt);
        } catch (fluxError) {
            console.error("❌ Cả 2 hệ thống AI đều lỗi:", fluxError);
            throw new Error("Tạm thời hệ thống AI đang quá tải, Anh Tuấn thử lại sau 1 phút nhé!");
        }
    }
};
