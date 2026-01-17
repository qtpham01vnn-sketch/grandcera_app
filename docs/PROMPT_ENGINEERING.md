# Thư viện Prompt Engineering - V12.2

## 1. Prompt Phân tích bối cảnh (Vision Analysis)
Sử dụng cho `gemini-1.5-flash`:
```text
Act as an Architect. Analyze this interior image and describe the structural layout 
in detail (walls, furniture, stairs). Reply in English, concisely.
```

## 2. Prompt Diễn họa chính (Rendering Prompt)
Đây là Prompt được tổng hợp bởi `aiOrchestrator.ts`:

### Cấu trúc cơ bản:
```text
PHUONG NAM STUDIO ARCHITECTURAL RENDER. 
ROOM CONTEXT: {roomDescription} (Mô tả từ Gemini Vision)
STRICT MANDATE: Existing raw construction site with brick walls and concrete structure. 
DO NOT CHANGE the room geometry, stairs, or doors.

TILES TO APPLY: 
- Floor: {floor_name} ({surface}, {size})
- Lower Walls: {dark_tile_name}
- Upper Walls: {light_tile_name}
- Paint: {paint_name} ({hex_code})

TILING METHOD: {PA_Logic} (Ví dụ: 3 rows of dark tiles + border)
STYLE: Ultra-realistic architecture photography, 8K, sharp tiling textures, professional lighting.
```

## 3. Quy tắc Negative (Ràng buộc phủ định)
Để AI không "vẽ rắn thêm chân", chúng tôi luôn sử dụng:
- `NO furniture addition` (Không thêm nội thất ngoài bối cảnh).
- `NO extra windows` (Không thêm cửa sổ).
- `NO plants/nature` (Không thêm cây cối nếu nhà đang thô).

## 4. Logic 7 Phương án (PA1 - PA7) trong Prompt
Mỗi PA được dịch sang ngôn ngữ AI một cách chuẩn xác:
- **PA2 (3 Thân + 1 Viền):** "Install 3 rows of dark tiles at the bottom, then 1 row of accent border, the rest of the wall is painted with {paint}."
- **PA5 (Wainscoting):** "Classic wainscoting style at 80cm height with decorative molding."
- **PA6 (Tường điểm nhấn):** "Only apply tiles to the main focal wall, other walls are purely painted."
