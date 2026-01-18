# Logic AI & Chiến lược Diễn họa (AI Logic) - V12.3

## 1. Hệ thống AI Orchestrator (Đa tầng)
Đây là "bộ não" điều khiển toàn bộ quá trình render, đảm bảo tính ổn định và chính xác.

### Nguyên lý hoạt động (The Pipeline)
1.  **Input:** Base Image (Ảnh hiện trạng) + Vật liệu (Tiles/Paint) + Phương án (PA).
2.  **Giai đoạn 1 - Vision Analysis (Gemini 2.0 Flash):**
    - Sử dụng **SDK @google/genai** với model `gemini-2.0-flash` để phân tích cấu trúc phòng.
    - Output: Một đoạn văn mô tả tiếng Anh về vị trí tường, sàn, cầu thang, cửa.
3.  **Giai đoạn 2 - Prompt Synthesis:**
    - Kết hợp mô tả bối cảnh từ GĐ1 + Metadata vật liệu + Logic ốp lát của PA đã chọn.
    - Tạo ra một Prompt cực kỳ chi tiết cho bước diễn họa.
4.  **Giai đoạn 3 - Rendering (Imagen 3 - Vertex AI):**
    - **Primary:** Gọi API `imagen-3.0-generate-001` thông qua Secure Proxy. Đây là model tạo ảnh SOTA của Google hiện nay.
    - **Fallback:** Tự động chuyển sang **Flux (Pollinations.ai)** nếu Vertex AI gặp sự cố (quota/network).

## 2. Quy tắc "Khóa Kiến trúc" (Structural Integrity)
Để giải quyết vấn đề AI tự ý thay đổi khung nhà, chúng tôi áp dụng 3 lớp bảo vệ:
- **Lớp 1 (Vision Context):** Ép AI Render phải đọc mô tả về căn phòng hiện hữu trước khi vẽ.
- **Lớp 2 (Strict Prompt):** Sử dụng các từ khóa mạnh (`STRICT MANDATE`, `DO NOT CHANGE geometry`, `KEEP staircase`).
- **Lớp 3 (Construction Mode):** Khi Gemini không nhìn thấy ảnh (lỗi Vision), hệ thống sẽ gửi mặc định mô tả "Nhà thô, tường gạch bê tông" để AI bám sát hiện trạng công trình đang thi công.

## 3. Logic "Mệnh lệnh vách tường cầu thang"
- **Vị trí:** Vách tường bên phải hoặc phía dưới chân cầu thang thường bị AI bỏ qua.
- **Giải pháp:** Trong mọi Prompt luôn có lệnh phủ kín 100% diện tích này, quét sạch mọi hốc tường xây dở để gạch được ốp liền mạch.

## 4. Đặc điểm Vật liệu (Tile Surface Logic)
- **Glossy (Bóng):** AI được lệnh tạo phản chiếu ánh sáng mạnh (Reflections).
- **Matt (Mờ):** AI giảm độ chói, tập trung vào chiều sâu vân đá.
- **8K Resolution:** Ép AI tạo textures cực kỳ sắc nét để nhìn rõ từng đường ron gạch.
