# Hướng dẫn Triển khai (Deployment Guide) - GitHub & Vercel

## 1. Quản lý mã nguồn với GitHub
Dự án được đồng bộ lên Repository: `https://github.com/qtpham01vnn-sketch/grandcera_app`

### Quy trình cập nhật (Workfow)
Khi có sự thay đổi mã nguồn, thực hiện các bước sau tại Terminal:
1.  `git add .`
2.  `git commit -m "Mô tả nội dung thay đổi (ví dụ: Cập nhật prompt V12.2)"`
3.  `git push origin main`

## 2. Triển khai lên Vercel (Production)
Dự án được Host tại: `grandcera-app.vercel.app` (Hoặc tên domain tương tự).

### Cấu hình Biến môi trường (BẮT BUỘC)
Để ứng dụng chạy ổn định trên Vercel, anh cần copy các mã trong file `.env.local` vào phần **Settings > Environment Variables** của dự án trên Vercel Dashboard:

| Tên Biến | Mô tả |
|----------|-------|
| `VITE_GEMINI_API_KEY` | Mã API Key lấy từ Google AI Studio. |
| `VITE_FIREBASE_API_KEY` | Chìa khóa kết nối Firebase. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Tên miền xác thực Firebase. |
| `VITE_FIREBASE_PROJECT_ID` | ID dự án Google Cloud. |
| `VITE_FIREBASE_APP_ID` | ID định danh của ứng dụng. |
| `GOOGLE_CREDENTIALS` | **Service Account Key JSON** (toàn bộ nội dung file `service-account.json`) cho Imagen 3 API. |

> **Lưu ý quan trọng về `GOOGLE_CREDENTIALS`:**
> - Copy **toàn bộ** nội dung file `service-account.json` (từ `{` đến `}`).
> - Chọn áp dụng cho cả 3 môi trường: **Production**, **Preview**, **Development**.
> - File `service-account.json` **KHÔNG** được push lên GitHub (đã có trong `.gitignore`).

### Cơ chế Auto-Deploy
Mỗi khi anh thực hiện lệnh `git push` lên GitHub, Vercel sẽ tự động:
1.  Kéo mã mới về.
2.  Tiến hành Build (`npm run build`).
3.  Cập nhật trang web trực tuyến trong vòng 30-60 giây.

## 3. Khắc phục sự cố thường gặp
- **Màn hình đen:** Do thiếu biến môi trường hoặc Firebase bị chặn (Check Console F12).
- **Lỗi 404 Gemini:** Kiểm tra API Key đã hết hạn hoặc chưa kích hoạt model "Gemini 1.5 Flash" chưa.
- **Lỗi Build:** Kiểm tra xem có file nào bị viết hoa/thường sai lệch tên không (Linux của Vercel phân biệt hoa thường).
