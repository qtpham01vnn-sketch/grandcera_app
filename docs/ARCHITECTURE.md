# Cấu Trúc Kỹ Thuật (Architecture) - V12.2

## 1. Công nghệ Core (Tech Stack)
- **Framework:** React 19 (Vite) - Tối ưu tốc độ tải và trải nghiệm mượt mà.
- **Backend-as-a-Service:** **Firebase** (Google Cloud)
    - **Authentication:** Quản lý đăng nhập và định danh người dùng.
    - **Cloud Firestore:** Cơ sở dữ liệu thời gian thực để lưu trữ lịch sử bản phối và trạng thái phê duyệt.
- **Hosting:** **Vercel** - Tự động hóa triển khai (CI/CD) từ GitHub.
- **Styling:** Vanilla CSS + Tailwind CSS (Cấu hình Maroon #701a1a).

## 2. Hệ thống AI Orchestrator (Đầu não Diễn họa)
Ứng dụng sử dụng một bộ điều phối Hybrid AI để đảm bảo độ ổn định 100%:

### A. Phân tích Bối cảnh (Vision)
- **Model:** `gemini-1.5-flash` (Gọi qua Direct REST API v1).
- **Nhiệm vụ:** Phân tích ảnh hiện trạng (Base Image) để trích xuất cấu trúc phòng (tường, cầu thang, cửa).
- **Kết quả:** Cung cấp "Context" cho bước diễn họa, giúp giữ nguyên kiến trúc nhà thô.

### B. Diễn họa Kiến trúc (Rendering)
- **Primary:** Gemini In-painting (Khi API hỗ trợ đầy đủ).
- **Fallback ( fluxes):** **Pollinations Flux (Gen v2)**.
    - Tự động kích hoạt khi Gemini gặp lỗi hoặc quá tải.
    - Sử dụng Prompt nâng cao kết hợp kết quả phân tích bối cảnh từ bước A.

## 3. Quản lý Dữ liệu Đám mây
- **Design Synchronization:** Toàn bộ lịch sử bản phối được lưu trữ theo UID của người dùng trên Firestore.
- **Real-time Approval:** Sử dụng Snapshot listener để nhận diện lệnh duyệt từ Admin ngay lập tức mà không cần tải lại trang.

## 4. Bảo mật & Biến môi trường
- Toàn bộ API Keys được quản lý qua file `.env.local` (Local) và Environment Variables (Vercel).
- **Bắt buộc:** Phải khai báo `VITE_GEMINI_API_KEY` và bộ mã `VITE_FIREBASE_*` để ứng dụng hoạt động.