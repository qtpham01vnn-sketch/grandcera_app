
import { TileData, TilingMethod, PaintData } from "../../types";
import { analyzeTileFromImage, getAIChatResponse, describeRoomLayout, renderWithGeminiImage } from "./providers/geminiProvider";
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
            return `ỐP KỊCH TRẦN TOÀN BỘ DIỆN TƯỜNG. Không chừa khoảng trống. Phủ gạch từ sàn lên đến trần nhà.`;

        case 'PA2_half_wall_120':
            return `ỐP LỬNG 1.2M. CHÂN TƯỜNG (0 - 120cm): Ốp gạch ĐẬM. PHẦN TRÊN (>120cm): SƠN NƯỚC màu ${paintName} (${paintHex}).`;

        case 'PA3_half_wall_border':
            return `ỐP 1.2M + VIỀN. CHÂN (0-120cm): Gạch THÂN. VIỀN (120-150cm): Gạch VIỀN. TRÊN (>150cm): SƠN ${paintName}.`;

        case 'PA4_with_accent':
            return `ỐP CÓ GẠCH ĐIỂM NHẤN. CHÂN (0-120cm): Gạch THÂN xen GẠCH ĐIỂM hoa văn. TRÊN: SƠN ${paintName}.`;

        case 'PA5_wainscoting':
            return `WAINSCOTING 80cm. CHÂN (0-80cm): Ốp gạch có chỉ phào. TRÊN: SƠN ${paintName}. Phong cách cổ điển.`;

        case 'PA6_accent_wall':
            return `TƯỜNG ĐIỂM NHẤN. CHỈ ỐP 1 BỨC TƯỜNG CHÍNH kịch trần. CÁC VÁCH KHÁC: SƠN ${paintName}.`;

        default:
            return `Ốp theo phương án đã chọn.`;
    }
};

// ============================================
// BỘ ĐIỀU PHỐI AI (ORCHESTRATOR) - V12.8
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
    console.log("📋 Phương án ốp:", tilingLogic);

    // 2. LẤY ẢNH GẠC THỰC TẾ TỪ TILEDATA
    const floorTileImage = floor?.tile_image_url || "";
    const wallTileImage = dark?.tile_image_url || "";
    const accentTileImage = accent?.tile_image_url || "";

    console.log("🧱 Ảnh gạch sàn:", floorTileImage ? "✅ Có" : "❌ Không");
    console.log("🧱 Ảnh gạch tường:", wallTileImage ? "✅ Có" : "❌ Không");
    console.log("🧱 Ảnh gạch điểm:", accentTileImage ? "✅ Có" : "❌ Không");

    try {
        // BƯỚC A: THỬ GEMINI 2.5 FLASH IMAGE (ƯU TIÊN SỐ 1)
        console.log("🚀 Đang Render với Gemini 2.5 Flash Image (DNA Lock)...");
        try {
            return await renderWithGeminiImage(
                tilingLogic,
                baseImage,
                floorTileImage,
                wallTileImage,
                accentTileImage
            );
        } catch (geminiError: any) {
            console.warn("⚠️ Gemini Image gặp sự cố:", geminiError?.message);
            // Fallback to Imagen 3
            throw geminiError;
        }

    } catch (error: any) {
        console.warn("⚠️ Gemini Image lỗi, chuyển sang Imagen 3...");

        // BƯỚC B: THỬ IMAGEN 3 (DỰ PHÒNG 1)
        const imagenPrompt = `Architectural visualization. ${tilingLogic}. Photorealistic 8K. Keep room structure.`;
        try {
            return await renderWithImagen(imagenPrompt);
        } catch (imagenError) {
            console.warn("⚠️ Imagen 3 cũng lỗi, chuyển sang Flux...");

            // BƯỚC C: FLUX (DỰ PHÒNG 2)
            try {
                return await renderWithFlux(imagenPrompt);
            } catch (fluxError) {
                console.error("❌ Tất cả AI đều lỗi");
                throw new Error("Hệ thống AI đang quá tải, anh thử lại sau 1 phút nhé!");
            }
        }
    }
};

