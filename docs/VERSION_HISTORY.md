
# Nhật ký Cập nhật Grandcera AI

## Phiên bản Hiện tại: V12.8 (Tháng 1/2026)

### V12.8 - "Gemini 2.5 Flash Image & DNA Lock" (19/01/2026)
- **Chuyển đổi AI Engine:** Từ Imagen 3 (Text-to-Image) sang **Gemini 2.5 Flash Image** (Image-to-Image với Reference).
- **DNA Material Lock:** Prompt đặc biệt ép AI sử dụng 100% texture từ ảnh mẫu gạch thực tế, không tự ý sáng tạo vân gạch.
- **Multi-Image Reference:** Gửi đồng thời Ảnh phòng + Ảnh gạch sàn + Ảnh gạch tường + Ảnh gạch điểm vào một request.
- **Label-Based Prompting:** Mỗi ảnh được gắn nhãn rõ ràng (`[ẢNH MẪU SÀN - DNA CHUẨN]:`) để AI hiểu vai trò.
- **Image Config:** Sử dụng `imageConfig: { aspectRatio: "16:9" }` thay vì responseModalities.
- **Helper imageUrlToBase64:** Tự động chuyển đổi URL ảnh gạch từ TileData sang Base64.

### V12.7 - "Enhanced Spatial Mapping Prompt" (18/01/2026)
- **Spatial Description Upgrade:** Nâng cấp `describeRoomLayout()` để mô tả chi tiết vị trí LEFT/RIGHT/CENTER.
- **10-Point Analysis:** Camera viewpoint, Staircase position, Windows, Doors, Columns, Ceiling, Walls, Floor, Lighting, Objects.
- **Mandatory Constraints:** Thêm các ràng buộc bắt buộc để giữ nguyên vị trí cầu thang, cửa sổ.
- **Negative Prompt:** Liệt kê rõ các thứ AI KHÔNG ĐƯỢC làm.

### V12.6 - "Smart Workflow & History" (18/01/2026)
- **Structured Technical Prompt:** Nâng cấp AI Orchestrator với logic mô tả hình học 3D và Negative Prompt bảo vệ cấu trúc.
- **Smart Tile Chat:** AI tự động phân tích ảnh gạch trong Chat, trả về dữ liệu có cấu trúc JSON.
- **Tile Save Modal:** Khi bấm "Lưu vào kho", hiện Modal hỏi người dùng chọn loại gạch (Sàn/Tường/Điểm nhấn).
- **Render History Slider:** Tự động lưu lịch sử render, cho phép so sánh trực quan giữa các Phương Án ốp lát.
- **UX Enhancements:** Auto-select gạch sau khi lưu từ Chat, giới hạn 10 ảnh trong History.

### V12.5 - "Vercel Production Deployment" (18/01/2026)
- **Environment Variables**: Cấu hình `GOOGLE_CREDENTIALS` trên Vercel để bảo mật Service Account Key.
- **Production Ready**: Imagen 3 hoạt động ổn định trên cả Local và Production.
- **Backend Flexibility**: Code tự động detect credentials từ Env Var hoặc File.
- **Deployment Success**: Website chính thức chạy Imagen 3 với chất lượng Photorealistic.

### V12.4 - "Imagen 3 Integration (Vertex AI)" (18/01/2026)
- **Tích hợp Imagen 3 (Google Vertex AI):** Thay thế Gemini Image Gen (chưa hỗ trợ) bằng model chuyên dụng `imagen-3.0-generate-001`.
- **Backend API Proxy:** Xây dựng cơ chế Serverless Function & Local Proxy để bảo mật Service Account Key.
- **Smart Key Detection:** Tự động tìm kiếm file key `service-account.json` ở cả thư mục gốc và thư mục cha.
- **AI Pipeline v2:** Luồng xử lý mới: Gemini 2.0 Flash (Phân tích) → Imagen 3 (Render) → Flux (Fallback).
- **Aspect Ratio 4:3:** Chuẩn hóa tỷ lệ khung hình đầu ra.

### V12.3 - "Gemini SDK Migration & Pollinations Update" (17/01/2026)
- Chuyển đổi từ **REST API fetch** sang **SDK @google/genai** để gọi Gemini API ổn định hơn.
- Sử dụng model **gemini-2.0-flash** (mới nhất của Google AI).
- Thiết lập **Google Cloud Billing** với $300 free credit để vượt qua giới hạn free tier.
- Cập nhật **Pollinations.ai endpoint mới** (`pollinations.ai/p/`) do endpoint cũ đã ngừng hoạt động.
- Giảm số phương án ốp lát từ **7 PA xuống 6 PA** (loại bỏ PA7 Ốp So Le).
- Thêm hiển thị **số phiên bản v1.0.2** trên sidebar để theo dõi deployment.

### V12.2 - "GitHub Sync & Vercel Deployment"
- Khởi tạo hệ thống quản lý phiên bản Git cho toàn bộ dự án.
- Kết nối thành công với GitHub Repository (`grandcera_app`).
- Triển khai ứng dụng lên môi trường Production (Vercel).
- Thiết lập quy trình CI/CD tự động cập nhật khi có thay đổi code.

## Phiên bản: V12.1 (Tháng 1/2026)

### V12.1 - "Firebase Cloud & Robust AI Orchestration"
- Tích hợp **Firebase Authentication** và **Cloud Firestore** cho toàn bộ hệ thống.
- Triển khai **Design History** - Tự động lưu và đồng bộ lịch sử bản phối lên đám mây.
- Xây dựng bộ điều phối **AI Orchestrator**:
  - Ưu tiên Gemini phân tích bối cảnh để giữ kiến trúc.
  - Tự động Fallback sang Flux (Pollinations) khi gặp lỗi API Key hoặc quá tải.
- Chuyển đổi sang **Direct REST API** cho Gemini để sửa lỗi thư viện SDK.
- Tối ưu hóa Prompt giữ nguyên "Nhà thô" (Construction site mode).

### V12.0 - "7 Tiling Methods & Smart Tile Save" (MỚI NHẤT)
- Nâng cấp lên **7 Phương án ốp lát** (PA1-PA7):
  - PA1: Ốp Kịch Trần | PA2: 3 Thân + 1 Viền
  - PA3: 3 Thân + Viền + Điểm | PA4: Ốp Lửng 1.2m
  - PA5: Wainscoting 80cm | PA6: Tường Điểm Nhấn
  - PA7: Ốp So Le
- Triển khai **Validation màu sơn** tự động cho PA cần sơn.
- Thêm hàm **`analyzeTileFromImage()`** - AI hỏi 6 câu hỏi khi nhận ảnh gạch.
- Cập nhật prompt lên **V12.0** với chi tiết từng PA.
- UI dropdown hiển thị **icon + mô tả** cho từng phương án.
- Badge **"Cần sơn"** highlight PA yêu cầu chọn màu sơn.

### V11.5 - "Smart Search & Documentation"
- Nâng cấp **Thanh tìm kiếm thông minh** với khả năng lọc theo từ khóa:
  - `"ốp"` / `"tường"` → Hiển thị gạch ốp tường
  - `"lát sàn"` / `"sàn"` → Hiển thị gạch lát nền
  - `"sơn"` → Hiển thị bảng màu sơn Dulux/Jotun
- Khởi tạo hệ thống tài liệu **docs/** toàn diện.
- Khôi phục và ổn định hệ thống **Auth Admin**.
- Hiển thị chi tiết thông số vật liệu (Tên, Kích thước, Bề mặt, Mã sản phẩm).

### V11.0 - "Staircase Wall Command"
- Triển khai **"Mệnh lệnh vách tường cầu thang"** - Ép AI phủ kín 100% vách bên phải cầu thang.
- Tích hợp logic **Hybrid AI** (Kết hợp gạch từ kho + ảnh thực tế từ chat).
- Thêm nút **"Lưu vào kho gạch"** từ ảnh chat.

### V10.5 - "Showroom Professional Layout"
- Tái cấu trúc giao diện **3 vùng Showroom**:
  - Trái: Cấu hình + Chat AI + Kho lưu
  - Giữa: Workspace diễn họa
  - Phải: Kho vật liệu mẫu
- Thêm Tab **"QUẢN TRỊ"** duyệt người dùng cho Admin.
- Mở rộng độ rộng Sidebar lên **500px** để dễ thao tác.

### V10.0 - "Multimodal Chat"
- Tích hợp **Chat đa phương thức** - Gửi ảnh trực tiếp vào chat.
- AI có thể phân tích ảnh vật liệu từ chat để diễn họa.
- Nâng cấp **Branding GRANDCERA** với logo sư tử và màu Maroon (#701a1a).

### V9.0 - "Authentication System"
- Xây dựng hệ thống **Xác thực & Phê duyệt**:
  - Admin: `qtpham01vnn@gmail.com`
  - Khách hàng: Chờ phê duyệt trước khi vào Studio
- Triển khai **Polling tự động** (3 giây/lần) để khách tự động vào khi được duyệt.
- Thêm màn hình **Login sang trọng** với form nhập email.

### V8.0 - "Strict Texture Lock"
- Triển khai logic **Khóa vân gạch 100%** - AI không được tự ý đổi màu/vân.
- Bổ sung **Negative Constraints** để AI không vẽ thêm cây cối/nội thất.
- Định nghĩa rõ 3 **Phương án ốp lát**: PA1 (Kịch trần), PA2 (3+1 Viền), PA3 (3+1+Điểm).

### V7.0 - "Dynamic UI Effects"
- Thêm hiệu ứng **Lift & Glow** cho các nút bấm.
- Tích hợp hiệu ứng **Shimmer** (ánh kim) cho loading.
- Nâng cấp **Glassmorphism** cho các panel điều khiển.

### V6.0 - "Material Fidelity"
- Xây dựng kho vật liệu với **Gạch Grandcera (GR39005)** và các bộ sưu tập.
- Tích hợp mô hình **gemini-2.5-flash-image** cho diễn họa.
- Tích hợp mô hình **gemini-3-flash-preview** cho chatbot tư vấn.
- Thêm **Google Search Grounding** tra cứu mã gạch từ pnc.net.vn.
