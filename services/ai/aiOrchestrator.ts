
import { TileData, TilingMethod, PaintData } from "../../types";
import { analyzeTileFromImage, getAIChatResponse, describeRoomLayout, renderWithGemini } from "./providers/geminiProvider";
import { renderWithFlux } from "./providers/fluxProvider";
import { renderWithImagen } from "./providers/imagenProvider";

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
        // BƯỚC A: PHÂN TÍCH BỐI CẢNH CHI TIẾT
        console.log("🔍 Đang phân tích cấu trúc phòng chi tiết...");
        const roomDescription = await describeRoomLayout(baseImage);
        console.log("📋 Mô tả không gian:", roomDescription);

        // BƯỚC B: XÂY DỰNG PROMPT SIÊU CHI TIẾT CHO IMAGEN 3
        // Prompt này được thiết kế để ép AI giữ đúng vị trí không gian
        const imagenPrompt = `
[ARCHITECTURAL VISUALIZATION TASK - GRANDCERA STUDIO]

[CRITICAL SPATIAL LAYOUT - MUST MATCH EXACTLY]:
${roomDescription}

[MANDATORY CONSTRAINTS]:
1. STAIRCASE POSITION: Keep the staircase in the EXACT SAME position as described above (LEFT/RIGHT/CENTER). DO NOT MOVE IT.
2. WINDOWS: Keep ALL windows in their EXACT positions. Same number, same wall.
3. COLUMNS/PILLARS: Preserve ALL structural columns in their original positions.
4. CAMERA ANGLE: Maintain the SAME perspective and viewpoint.
5. ROOM SHAPE: The room geometry MUST remain identical.

[MATERIAL APPLICATION]:
- FLOOR: Apply ${floorDesc}. Perspective-aligned tiles.
- WALLS: ${tilingLogic}
  - Dark/Main Tile: ${darkDesc}
  - Light Tile: ${lightDesc}
  - Accent: ${accentDesc}

[STYLE]:
- Photorealistic, 8K resolution
- Natural lighting from existing windows
- Sharp tile textures, visible grout lines
- Keep raw construction site atmosphere where tiles are not applied

[NEGATIVE PROMPT - THINGS TO AVOID]:
- DO NOT add furniture
- DO NOT change room structure
- DO NOT move staircase
- DO NOT remove windows
- DO NOT add or remove doors
`;

        // BƯỚC C: GỌI IMAGEN 3
        console.log("🚀 Đang Render với Imagen 3 (Vertex AI)...");
        try {
            return await renderWithImagen(imagenPrompt);
        } catch (imagenError: any) {
            console.warn("⚠️ Imagen 3 gặp sự cố, chuyển sang Flux!", imagenError?.message);
            // Fallback prompt ngắn gọn hơn cho Flux
            const fluxFallbackPrompt = `Architectural interior: ${roomDescription}. Floor: ${floorDesc}. Walls: ${tilingLogic}. Photorealistic 8K. Keep exact room layout.`;
            return await renderWithFlux(fluxFallbackPrompt);
        }

    } catch (error: any) {
        console.warn("⚠️ CẢNH BÁO: AI chính gặp sự cố, chuyển sang Flux!", error?.message);

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
