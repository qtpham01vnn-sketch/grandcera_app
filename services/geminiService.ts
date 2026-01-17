
import { GoogleGenAI } from "@google/genai";
import { TileData, TilingMethod, PaintData } from "../types";

// Xóa khởi tạo global để tránh lỗi startup
// const ai = new GoogleGenAI({ apiKey });

// Chat session cho tư vấn (Lưu lịch sử đơn giản cho multimodal)
let chatHistory: any[] = [];

// Helper để lấy AI instance an toàn
const getAI = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error("API Key không tìm thấy. Vui lòng kiểm tra file .env.local");
  return new GoogleGenAI({ apiKey: key });
};

// ============================================
// HÀM PHÂN TÍCH ẢNH GẠCH - HỎI 6 CÂU HỎI
// ============================================
export const analyzeTileFromImage = async (imageBase64: string): Promise<string> => {
  const prompt = `BẠN LÀ CHUYÊN GIA VẬT LIỆU XÂY DỰNG CỦA GRANDCERA.

Hãy phân tích ảnh mẫu gạch này và ĐỀ XUẤT thông tin chi tiết:

📋 PHÂN TÍCH VẬT LIỆU:

1. **CHỦNG LOẠI:** [Gạch ốp tường] hoặc [Gạch lát sàn]
2. **PHÂN LOẠI CHI TIẾT:** [Thân Đậm] / [Thân Nhạt] / [Viên Điểm trang trí]
3. **KÍCH THƯỚC ƯỚC TÍNH:** [300x600] / [400x800] / [600x600] / [800x800]
4. **BỀ MẶT:** [Bóng kiếng] / [Mờ Matt] / [Sugar nhám nhẹ] / [Nhám chống trơn]
5. **CHẤT LIỆU:** [Ceramic] / [Porcelain] / [Granite] / [Gạch men]
6. **MÔ TẢ MÀU SẮC:** Mô tả ngắn gọn vân đá và tông màu chủ đạo.

🎯 YÊU CẦU:
- Hãy trả lời ngắn gọn, rõ ràng
- Cuối cùng hỏi khách hàng: "Thông tin trên đã chính xác chưa? Anh/chị có muốn điều chỉnh gì không?"
- Sau khi khách xác nhận, hỏi: "Anh/chị muốn đặt TÊN/MÃ cho mẫu gạch này là gì?"`;

  const parts = [
    { text: prompt },
    { inlineData: { mimeType: 'image/jpeg', data: imageBase64.split(',')[1] || imageBase64 } }
  ];

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: [{ role: 'user', parts }]
  });

  return response.text || "";
};

// ============================================
// HÀM TẠO PROMPT CHO TỪNG PHƯƠNG ÁN ỐP
// ============================================
const getTilingPrompt = (method: TilingMethod, paint?: PaintData | null): string => {
  const paintName = paint?.name || 'Trắng Sứ';
  const paintHex = paint?.hex || '#FFFFFF';

  switch (method) {
    case 'PA1_full_height':
      return `
📐 PHƯƠNG ÁN 1: ỐP KỊCH TRẦN (Full Height)
- Ốp gạch 100% từ SÀN lên đến TRẦN nhà trên tất cả 4 VÁCH TƯỜNG
- Phủ kín hoàn toàn các GÓC KHUẤT và vách tường cầu thang
- KHÔNG có phần sơn nước
- Phù hợp: Phòng tắm, nhà bếp, spa`;

    case 'PA2_half_wall_120':
      return `
📐 PHƯƠNG ÁN 2: ỐP LỬNG 1.2M
- CHÂN TƯỜNG (0 - 120cm): Ốp 4 hàng gạch ĐẬM màu
- PHẦN TRÊN (>120cm): SƠN NƯỚC màu ${paintName} (${paintHex})
- Đường phân cách ốp-sơn ở độ cao 1.2 mét
- Phù hợp: Nhà vệ sinh, khu dịch vụ`;

    case 'PA3_half_wall_border':
      return `
📐 PHƯƠNG ÁN 3: ỐP 1.2M + VIỀN (~1.5M)
- CHÂN TƯỜNG (0 - 120cm): Ốp gạch THÂN ĐẬM
- VIỀN (120 - 150cm): Ốp 1 hàng gạch VIỀN trang trí khác màu
- PHẦN TRÊN (>150cm): SƠN NƯỚC màu ${paintName} (${paintHex})
- Phù hợp: Phòng khách, hành lang, cầu thang`;

    case 'PA4_with_accent':
      return `
📐 PHƯƠNG ÁN 4: ỐP CÓ GẠCH ĐIỂM NHẤN
- CHÂN TƯỜNG (0 - 120cm): Ốp gạch THÂN ĐẬM, XEN KẼ viên gạch ĐIỂM hoa văn
- Viên ĐIỂM tạo focal point ngang tầm mắt
- PHẦN TRÊN (>120cm): SƠN NƯỚC màu ${paintName} (${paintHex})
- Phù hợp: Phòng khách, phòng ăn cao cấp`;

    case 'PA5_wainscoting':
      return `
📐 PHƯƠNG ÁN 5: WAINSCOTING (Cổ điển 80cm)
- CHÂN TƯỜNG (0 - 80cm): Ốp 2-3 hàng gạch có chỉ phào trang trí ở viền trên
- PHẦN TRÊN (>80cm): SƠN NƯỚC màu ${paintName} (${paintHex})
- Phong cách tân cổ điển, Indochine
- Phù hợp: Biệt thự, căn hộ cao cấp`;

    case 'PA6_accent_wall':
      return `
📐 PHƯƠNG ÁN 6: TƯỜNG ĐIỂM NHẤN (Accent Wall)
- CHỈ ỐP 1 BỨC TƯỜNG CHÍNH làm điểm nhấn (kịch trần)
- CÁC VÁCH KHÁC: SƠN NƯỚC màu ${paintName} (${paintHex})
- Tạo focal point cho không gian
- Phù hợp: Phòng ngủ, phòng khách hiện đại`;

    default:
      return `Ốp theo phương án đã chọn.`;
  }
};

// ============================================
// HÀM CHAT AI TƯ VẤN
// ============================================
export const getAIChatResponse = async (message: string, imageBase64?: string) => {
  const systemInstruction = `BẠN LÀ CHUYÊN GIA TƯ VẤN CỦA GRANDCERA - PHƯƠNG NAM STUDIO.
  
PHONG CÁCH PHẢN HỒI:
- Ngắn gọn, sang trọng, chuyên nghiệp
- Sử dụng ngôn ngữ kiến trúc: "phối bộ", "vân đá", "diện tích phủ", "tông màu chủ đạo"
- Luôn trả lời bằng tiếng Việt

NHIỆM VỤ KHI NHẬN ẢNH GẠCH:
Nếu khách gửi ảnh mẫu gạch, hãy hỏi 6 câu hỏi để lưu vào kho:
1. Chủng loại: Ốp tường hay Lát sàn?
2. Phân loại: Thân Đậm / Thân Nhạt / Viên Điểm?
3. Kích thước: 300x600 / 400x800 / 600x600 / 800x800?
4. Bề mặt: Bóng / Mờ / Sugar / Nhám?
5. Chất liệu: Ceramic / Porcelain / Granite?
6. Tên/Mã gạch muốn đặt?

NHIỆM VỤ KHÁC:
- Nếu khách gửi ảnh phòng: Nhận xét và đề xuất phương án ốp lát phù hợp từ 6 PA.
- Sử dụng Google Search tìm mã gạch trên pnc.net.vn khi cần.`;

  const parts: any[] = [{ text: message }];
  if (imageBase64) {
    parts.push({
      inlineData: { mimeType: 'image/jpeg', data: imageBase64.split(',')[1] || imageBase64 }
    });
  }

  const contents = [...chatHistory.slice(-6), { role: 'user', parts }];
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents,
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }]
    }
  });

  const aiText = response.text || "";
  chatHistory.push({ role: 'user', parts });
  chatHistory.push({ role: 'model', parts: [{ text: aiText }] });
  return aiText;
};

// ============================================
// HÀM RENDER DIỄN HỌA - 6 PHƯƠNG ÁN
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

  // Lấy prompt theo phương án
  const tilingLogic = getTilingPrompt(method, paint);

  const prompt = `YÊU CẦU DIỄN HỌA KIẾN TRÚC GRANDCERA V12.0

═══════════════════════════════════════════════════════════
1. MỆNH LỆNH PHỦ KÍN (STRICT COVERAGE COMMAND)
═══════════════════════════════════════════════════════════
⚠️ CẢNH BÁO QUAN TRỌNG:
- BẠN PHẢI ốp lát 100% diện tích tường gạch đỏ, cột bê tông thô.
- BẮT BUỘC PHỦ KÍN VÁCH TƯỜNG BÊN PHẢI CẠNH CẦU THANG.
- TUYỆT ĐỐI không để hở bất kỳ mảng gạch đỏ xây thô nào.
- Quét sạch mọi ngóc ngách, hốc tường, cột bê tông.

═══════════════════════════════════════════════════════════
2. VẬT LIỆU SỬ DỤNG (HYBRID TEXTURE LOCK)
═══════════════════════════════════════════════════════════
📦 TỪ KHO VẬT LIỆU:
- Gạch sàn: ${floor.name} (${floor.tile_size}, ${floor.tile_surface})
- Gạch tường Đậm: ${dark?.name || 'Không chọn'}
- Gạch tường Nhạt: ${light?.name || 'Không chọn'}
- Gạch điểm: ${accent?.name || 'Không chọn'}
- Màu sơn: ${paint?.name || 'Không cần'} ${paint?.hex ? `(${paint.hex})` : ''}

📸 TỪ ẢNH THỰC TẾ (Reference Images):
- Nếu có ảnh mẫu gạch đính kèm: LẤY CHÍNH XÁC VÂN ĐÁ từ ảnh đó.
- ƯU TIÊN ảnh thực tế hơn mẫu trong kho.

═══════════════════════════════════════════════════════════
3. PHƯƠNG ÁN ỐP LÁT
═══════════════════════════════════════════════════════════
${tilingLogic}

═══════════════════════════════════════════════════════════
4. YÊU CẦU THẨM MỸ
═══════════════════════════════════════════════════════════
✨ Độ bóng: Gạch sàn phản chiếu ánh sáng tự nhiên
✨ Ánh sáng: High exposure, không tối
✨ Vân đá: Giữ nguyên 100% từ mẫu đã chọn
✨ Chất lượng: 4K, sắc nét

═══════════════════════════════════════════════════════════
5. NEGATIVE CONSTRAINTS (KHÔNG ĐƯỢC LÀM)
═══════════════════════════════════════════════════════════
❌ KHÔNG thêm cây xanh, hoa lá
❌ KHÔNG đổi màu gạch sàn nếu không yêu cầu
❌ KHÔNG thêm cửa sổ, nội thất mới
❌ KHÔNG thay đổi cấu trúc cầu thang`;

  const parts: any[] = [
    { text: prompt },
    { inlineData: { mimeType: 'image/jpeg', data: baseImage.split(',')[1] || baseImage } }
  ];

  // Thêm ảnh tham khảo từ chat
  chatImageRefs.forEach(img => {
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: img.split(',')[1] || img } });
  });

  // Kiểm tra API Key và khởi tạo AI
  let ai;
  try {
    ai = getAI();
  } catch (e) {
    console.error("❌ THIẾU API KEY:", e);
    alert("⚠️ LỖI KẾT NỐI: Chưa tìm thấy API Key!\n\nVui lòng kiểm tra file .env.local và dòng VITE_GEMINI_API_KEY.");
    throw new Error("Missing API Key");
  }

  try {
    // Sử dụng model 1.5 Flash cho ổn định và hạn mức free tốt hơn
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts }]
    });

    // Nếu model trả về image (tương lai), xử lý tại đây.
    // Hiện tại: In ra console text để debug
    console.log("Gemini Render Advice:", response.text);

    // TODO: Khi Google mở API Imagen 3, sẽ gọi ở đây.
    // Hiện tại để không crash app, trả về ảnh gốc và thông báo
    alert("⚠️ TÍNH NĂNG RENDER ĐANG BẢO TRÌ:\nGoogle Gemini API hiện chưa hỗ trợ tạo ảnh trực tiếp qua kết nối này.\n\nAI đã phân tích yêu cầu của bạn (xem Console). Vui lòng chờ cập nhật Model Imagen 3.");

    return baseImage; // Fallback về ảnh gốc để không đen màn hình

  } catch (error: any) {
    console.error("❌ LỖI RENDER GEMINI:", error);
    const errorMsg = error?.message || JSON.stringify(error);
    alert(`LỖI CHI TIẾT TỪ GOOGLE AI:\n${errorMsg}\n\nVui lòng kiểm tra lại API Key hoặc kết nối mạng.`);
    throw error;
  }
};

