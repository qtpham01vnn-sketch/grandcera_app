
# Gemini Prompt Engineering Library

## 1. Prompt Diễn họa (Visualizer Prompt)

### Model: `gemini-2.5-flash-image`

### Cấu trúc Prompt Chuẩn
```
GRANDCERA V11.5 - Architectural Visualization

MỆNH LỆNH TỐI HẬU:
1. Phải phủ kín 100% diện tích vách tường bên phải cầu thang
2. Tuyệt đối không để lộ gạch đỏ xây thô
3. Quét sạch mọi cột bê tông và hốc tường

VẬT LIỆU:
- Gạch sàn: [Tên mẫu] - [Kích thước] - [Bề mặt]
- Gạch tường Đậm: [Tên mẫu]
- Gạch tường Nhạt: [Tên mẫu]
- Màu sơn (nếu PA2/PA3): [Tên màu] - [Mã Hex]

PHƯƠNG ÁN: [PA1/PA2/PA3]
- PA1: Ốp kịch trần 100%
- PA2: 3 thân + 1 viền, phần trên sơn nước
- PA3: 3 thân + 1 viền + điểm hoa văn

NEGATIVE CONSTRAINTS:
- DO NOT add plants or vegetation
- DO NOT change floor if not requested
- DO NOT modify staircase structure
- KEEP exact texture and color from samples

LIGHTING: High exposure, realistic shadows, glossy reflection
OUTPUT: 4K resolution, 16:9 aspect ratio
```

---

## 2. Prompt Tư vấn (Chatbot Prompt)

### Model: `gemini-3-flash-preview`

### System Instruction
```
Bạn là chuyên gia tư vấn vật liệu xây dựng của GRANDCERA - Phương Nam Studio.

NHIỆM VỤ:
- Tư vấn phong thủy màu sắc theo ngũ hành
- Tra cứu mã gạch trên website pnc.net.vn
- Gợi ý phối màu hài hòa
- Giải đáp kỹ thuật ốp lát

PHONG CÁCH:
- Ngắn gọn, súc tích, đủ ý
- Không dài dòng văn tự
- Tập trung vào giải pháp và mã gạch cụ thể
- Luôn kết thúc bằng gợi ý hành động

CÔNG CỤ:
- googleSearch: Tra cứu thông tin gạch từ pnc.net.vn
```

---

## 3. Reference Images Management

### Khi nhận ảnh từ Chat
```
USER_REFERENCE_IMAGE:
Đây là ảnh mẫu gạch thực tế từ khách hàng.
ƯU TIÊN SỐ 1: Trích xuất chính xác VÂN và MÀU từ ảnh này.
Áp dụng trực tiếp lên diện tích yêu cầu.
KHÔNG sử dụng gạch mặc định từ kho nếu có ảnh tham khảo.
```

### Logic Hybrid (Kho + Chat)
```
Nếu có cả mẫu từ Kho và ảnh từ Chat:
- Sàn: Lấy từ nguồn mà user chỉ định
- Tường: Lấy từ nguồn mà user chỉ định
- Kết hợp linh hoạt hai nguồn dữ liệu
```

---

## 4. Error Handling Prompts

### Khi ảnh quá tối
```
"Ảnh hiện trạng hơi tối, bạn hãy chụp lại với ánh sáng tốt hơn 
để GRANDCERA AI hỗ trợ chính xác nhất nhé!"
```

### Khi không nhận diện được vật liệu
```
"Không thể nhận diện rõ mẫu gạch. Vui lòng chọn lại từ Kho vật liệu 
hoặc gửi ảnh mẫu gạch rõ nét hơn."
```
