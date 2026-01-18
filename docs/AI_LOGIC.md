# Logic AI & Chiến lược Diễn họa (AI Logic) - V12.8

## 1. Hệ thống AI Orchestrator (Đa tầng) - V12.8

### Nguyên lý hoạt động (The Pipeline)
1.  **Input:** Base Image (Ảnh hiện trạng) + Tile Images (Ảnh mẫu gạch thực tế) + Phương án (PA).
2.  **Giai đoạn 1 - Multi-Image Packaging:**
    - Thu thập ảnh gạch từ `TileData.tile_image_url` (Sàn, Tường, Điểm nhấn).
    - Chuyển đổi sang Base64 bằng helper `imageUrlToBase64()`.
3.  **Giai đoạn 2 - DNA Lock Prompt:**
    - Xây dựng prompt với lệnh "DNA MATERIAL LOCK" - ép AI sử dụng 100% texture từ ảnh mẫu.
    - Gắn LABEL rõ ràng cho mỗi ảnh: `[ẢNH MẪU SÀN - DNA CHUẨN]:`, `[ẢNH MẪU TƯỜNG - DNA CHUẨN]:`
4.  **Giai đoạn 3 - Rendering (Gemini 2.5 Flash Image):**
    - **Primary:** Model `gemini-2.5-flash-image` với `imageConfig: { aspectRatio: "16:9" }`.
    - **Fallback 1:** Imagen 3 (Vertex AI) - Text-to-Image.
    - **Fallback 2:** Flux (Pollinations.ai).

### So sánh V12.4 vs V12.8:
| Tính năng | V12.4 (Imagen 3) | V12.8 (Gemini 2.5 Flash Image) |
|-----------|------------------|--------------------------------|
| Loại model | Text-to-Image | Image-to-Image + Reference |
| Nhận ảnh gạch | ❌ Chỉ đọc mô tả chữ | ✅ Nhận trực tiếp ảnh mẫu |
| Kết quả gạch | Tự tưởng tượng texture | Sao chép 100% từ mẫu |
| Multi-image | ❌ Không hỗ trợ | ✅ Lên đến 14 ảnh |

## 2. DNA Material Lock (Khóa Vật liệu DNA)
Đây là cơ chế **quan trọng nhất** trong V12.8 để đảm bảo mẫu gạch render đúng với mẫu khách chọn.

### Prompt Template:
```
LỆNH DIỄN HỌA KIẾN TRÚC TỐI CAO - GRANDCERA STUDIO:

1. DNA MATERIAL LOCK (KHÓA VẬT LIỆU):
   - Tuyệt đối KHÔNG ĐƯỢC tự ý sáng tạo vân gạch.
   - Bạn PHẢI trích xuất 100% vân và màu sắc từ [ẢNH MẪU SÀN] và [ẢNH MẪU TƯỜNG].
   - Kết quả render phải có màu sắc và hoa văn gạch giống hệt như ảnh mẫu.

2. STAIRCASE OVERDRIVE (PHỦ KÍN VÁCH CẦU THANG):
   - Phải phủ vật liệu gạch ốp lên toàn bộ diện tích tường gạch đỏ.
   - KHÔNG ĐƯỢC để hở bất kỳ cm2 gạch đỏ nào.

3. PHƯƠNG ÁN THI CÔNG: [Từ getTilingPrompt()]

4. GIỮ NGUYÊN HIỆN TRẠNG: Giữ nguyên kết cấu cầu thang, cây chống sắt, vị trí cửa sổ.
```

## 3. Label-Based Image Prompting
Mỗi ảnh gửi đến AI được gắn nhãn văn bản phía trước:
- `[ẢNH HIỆN TRẠNG CÔNG TRÌNH]:`
- `[ẢNH MẪU SÀN - DNA CHUẨN]:`
- `[ẢNH MẪU TƯỜNG - DNA CHUẨN]:`
- `[ẢNH MẪU ĐIỂM - DNA CHUẨN]:`

## 4. Spatial Mapping (V12.7)
Hàm `describeRoomLayout()` phân tích ảnh và trả về mô tả 10 điểm:
1. Camera Viewpoint
2. Staircase Position (LEFT/RIGHT/CENTER)
3. Windows (số lượng, vị trí tường)
4. Doors
5. Columns/Pillars
6. Ceiling
7. Walls
8. Floor
9. Lighting direction
10. People/Objects

## 5. Fallback Strategy
```
Gemini 2.5 Flash Image (Primary)
         ↓ (nếu lỗi)
    Imagen 3 (Vertex AI)
         ↓ (nếu lỗi)
    Flux (Pollinations.ai)
```
