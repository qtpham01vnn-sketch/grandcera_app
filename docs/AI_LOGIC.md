
# AI Logic & Rendering Strategy

## 1. Mệnh lệnh "Vách tường cầu thang" (The Staircase Wall Rule)
Đây là quy tắc **QUAN TRỌNG NHẤT** trong Prompt Engineering của dự án:

### Vấn đề
Các mô hình AI hình ảnh thường bỏ qua các diện tích tường sâu bên trong hoặc cạnh cầu thang, để lộ gạch đỏ xây thô.

### Giải pháp
Sử dụng ngôn ngữ **"Strict Command"** trong prompt:
```
MỆNH LỆNH TỐI HẬU: Phải phủ kín 100% diện tích vách tường bên phải cầu thang. 
Tuyệt đối không để lộ bất kỳ khoảng trống gạch đỏ nào.
Quét sạch mọi mảng tường thô, cột bê tông và hốc tường xây dở.
```

---

## 2. Strict Texture Lock (Khóa vân gạch tuyệt đối)

### Nguyên tắc
- AI **KHÔNG ĐƯỢC** tự ý thay đổi màu sắc hoặc vân đá của mẫu gạch đã chọn.
- Nếu khách chọn "Vàng kem", AI không được render ra "Trắng" hoặc "Xám".
- Độ bóng và độ đậm nhạt phải giữ nguyên so với ảnh mẫu gốc.

### Negative Constraints (Ràng buộc phủ định)
```
DO NOT add plants, trees or vegetation.
DO NOT change the floor tile if not requested.
DO NOT add windows, doors or furniture.
DO NOT modify the staircase structure.
```

---

## 3. Hybrid Texture Lock (Kết hợp Kho + Chat)

### Vật liệu từ Kho
- Lấy metadata (tên, kích thước, mã sản phẩm) để AI hiểu thuộc tính bề mặt (bóng/mờ).
- Mặc định sử dụng khi khách chọn từ giao diện.

### Vật liệu từ Chat
- Khi khách gửi ảnh gạch thực tế (ví dụ: xanh ngọc, vân gỗ), AI được lệnh:
  - Trích xuất **vân và màu** từ ảnh đó
  - Ốp trực tiếp lên diện tích yêu cầu
  - **ƯU TIÊN ảnh chat** hơn gạch trong kho nếu cả hai được cung cấp

### Logic Phối hợp
- Nếu chọn Sàn từ Kho + Tường từ Chat → AI kết hợp cả hai nguồn
- Nếu chỉ có ảnh Chat → AI dùng ảnh đó làm Master Sample

---

## 4. Logic Ốp Lát - 7 Phương án (V12.0)

| PA | Tên Phương án | Mô tả | Cần sơn? |
|:--:|---------------|-------|:--------:|
| **PA1** | Ốp Kịch Trần | 100% gạch từ sàn lên trần | ❌ |
| **PA2** | 3 Thân + 1 Viền | 3 hàng thân + 1 viền, phần trên sơn | ✅ |
| **PA3** | 3 Thân + Viền + Điểm | Như PA2 + viên điểm hoa văn | ✅ |
| **PA4** | Ốp Lửng 1.2m | Ốp đến 1.2m, phần trên sơn | ✅ |
| **PA5** | Wainscoting 80cm | Kiểu cổ điển 80cm + sơn | ✅ |
| **PA6** | Tường Điểm Nhấn | Chỉ 1 bức tường, còn lại sơn | ✅ |
| **PA7** | Ốp So Le | Kịch trần kiểu gạch xây | ❌ |

### Chi tiết từng PA

#### PA1: Ốp Kịch Trần (Full Height)
- Phủ gạch 100% diện tích tường từ sàn lên trần
- **KHÔNG** có phần sơn nước
- Phù hợp: Phòng tắm, nhà bếp, spa

#### PA2: Ốp 3 Thân + 1 Viền (Standard 3+1)
- 3 hàng gạch Đậm ở dưới cùng (~90cm)
- 1 hàng gạch Viền trang trí
- Phần trên (>120cm): Sơn tường
- **BẮT BUỘC** chọn màu sơn

#### PA3: Ốp 3 Thân + Viền + Điểm
- Tương tự PA2 + gạch Điểm (hoa văn) xen kẽ
- Gạch Điểm tạo focal point ngang tầm mắt
- **BẮT BUỘC** chọn màu sơn

#### PA4: Ốp Lửng 1.2m (Half-Wall)
- Ốp 4 hàng gạch đến cao độ 1.2m
- Phần trên: Sơn nước
- Kiểu dáng đơn giản, tiết kiệm chi phí

#### PA5: Wainscoting (Cổ điển 80cm)
- Ốp 2-3 hàng gạch + chỉ phào trang trí
- Phong cách tân cổ điển, Indochine
- Phù hợp: Biệt thự, căn hộ cao cấp

#### PA6: Tường Điểm Nhấn (Accent Wall)
- Chỉ ốp 1 bức tường làm focal point
- Các vách khác: Sơn nước
- Phù hợp: Phòng ngủ, phòng khách hiện đại

#### PA7: Ốp So Le (Staggered)
- Ốp kịch trần 100% theo pattern so le 1/2 viên
- Tạo hiệu ứng chiều sâu
- **KHÔNG** có sơn nước

---

## 5. Validation Màu Sơn

Hệ thống tự động kiểm tra:
```javascript
if (currentPA.requiresPaint && !selectedPaint) {
  alert("Vui lòng chọn màu sơn cho phần tường còn lại!");
  return;
}
```

---

## 6. Quy tắc Ánh sáng (Lighting Rules)
- **High Exposure**: Không để ảnh render bị tối
- **Glossy Reflection**: Độ bóng phản chiếu nổi bật
- **4K Resolution**: Vân gạch phải nhìn rõ
---

## 7. AI Orchestrator & Fallback Strategy (V12.1)

### Cơ chế Hoạt động (Phễu AI)

1.  **Bước 1: Phân tích (Vision)**
    - Gemini quét ảnh gốc để mô tả kiến trúc (`describeRoomLayout`).
    - Kết quả: "Phòng khách, có cầu thang bên phải, tường gạch đỏ thô".
2.  **Bước 2: Diễn họa (Rendering)**
    - Ưu tiên Gemini Render (nếu API khả dụng).
    - **Fallback ( fluxes):** Nếu Gemini lỗi, hệ thống tự động kích hoạt Flux với Prompt đã được tối ưu từ thông tin bối cảnh ở Bước 1.

### Lợi ích
- **Độ tin cậy:** Không bao giờ bị treo (Black screen).
- **Độ chính xác:** Giữ nguyên được kiến trúc nhà thô của khách hàng nhờ vào bộ phân tích bối cảnh độc lập.
