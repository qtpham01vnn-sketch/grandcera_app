# Cấu Trúc Kỹ Thuật (Architecture)

## 1. Công nghệ Frontend
- **Framework:** React 19 (Sử dụng ESM importmap trực tiếp từ CDN).
- **Styling:** Tailwind CSS (Hệ thống utility-first mạnh mẽ).
- **Icons:** FontAwesome 6.4 (Bộ icon chuyên nghiệp cho kiến trúc).
- **Fonts:** Plus Jakarta Sans (Sắc nét, hiện đại, hỗ trợ tiếng Việt tốt).

## 2. Hệ thống AI (GenAI SDK)
Ứng dụng sử dụng chiến lược đa mô hình của Google Gemini:

### A. Mô hình Diễn họa (Image Generation)
- **Model:** `gemini-2.5-flash-image`
- **Nhiệm vụ:** Phân tích ảnh gốc và thay thế vật liệu (In-painting) dựa trên tham số người dùng chọn.
- **Cấu hình:** Aspect Ratio 16:9 để tối ưu không gian hiển thị kiến trúc.

### B. Mô hình Tư vấn (Text Generation)
- **Model:** `gemini-3-flash-preview`
- **Nhiệm vụ:** Chatbot tư vấn phong thủy, kỹ thuật và tra cứu mã gạch.
- **Công cụ:** Tích hợp `googleSearch` để tìm kiếm dữ liệu thực tế trên website `pnc.net.vn`.

## 3. Hệ thống quản lý dữ liệu (Mock DB)
- **LocalStorage:** Sử dụng để lưu trữ danh sách người dùng, trạng thái phê duyệt và các phương án diễn họa đã lưu.
- **authService.ts:** Module trung tâm xử lý logic đăng nhập, phê duyệt và kiểm tra trạng thái người dùng.