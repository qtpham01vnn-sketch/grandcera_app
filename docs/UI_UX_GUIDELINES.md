
# GRANDCERA UI/UX Guidelines

## 1. Màu sắc Thương hiệu (Branding Colors)

### Bảng màu chính
| Tên màu | Mã Hex | Ứng dụng |
|---------|--------|----------|
| **Maroon Deep** | `#701a1a` | Màu chủ đạo, nút bấm chính, tiêu đề |
| **Dark Navy** | `#1a1a2e` | Nền chính của ứng dụng |
| **Slate Gray** | `#0f172a` | Nền sidebar và panel |
| **Emerald** | `#10b981` | Nút lưu, trạng thái thành công |
| **Amber** | `#f59e0b` | Cảnh báo, chờ xử lý |

### Logo & Thương hiệu
- **Logo:** Đầu sư tử trong khiên (GRANDCERA)
- **Font:** Plus Jakarta Sans (sắc nét, hỗ trợ tiếng Việt)
- **Tagline:** "AI Architectural Intelligence"

---

## 2. Bố cục & Kích thước (Layout)

### Sidebar Width
- **Độ rộng chuẩn:** `500px` cho cả hai thanh bên
- **Lý do:** Đủ rộng để hiển thị thẻ gạch và nội dung chat dễ đọc
- **Có thể thu gọn khi cần tập trung vào ảnh render

### Responsive
- Tối ưu cho màn hình Desktop (≥1440px)
- Tablet: Sidebar tự động thu gọn
- Mobile: Chế độ Tab đơn

---

## 3. Hiệu ứng Tương tác (Interactive Effects)

### Glassmorphism
```css
backdrop-filter: blur(20px);
background: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.2);
```
- Áp dụng cho: Panel điều khiển, Card gạch, Modal

### Dynamic Buttons (Lift & Glow)
```css
transform: translateY(-2px);
box-shadow: 0 10px 40px rgba(112, 26, 26, 0.4);
```
- Khi hover: Nút nổi lên 2px, bóng đổ mở rộng
- Animation: 300ms ease-out

### Shimmer Effect (Ánh kim)
- Sử dụng cho: Loading state, Skeleton screens
- Gradient di chuyển từ trái sang phải
- Tạo cảm giác "đang xử lý"

### Ring Active (Vòng sáng trạng thái)
```css
ring-2 ring-offset-2 ring-emerald-500
```
- Áp dụng cho: Item đang được chọn
- Màu: Emerald (#10b981)

---

## 4. Trải nghiệm Người dùng (UX Principles)

### Feedback trực quan
- **Loading:** Hiệu ứng radar quét ảnh + thông điệp cụ thể
  - VD: "Đang phủ gạch vách tường cầu thang..."
- **Success:** Toast notification màu xanh lá
- **Error:** Toast notification màu đỏ với gợi ý khắc phục

### Dấu tích chọn (Checkmark)
- Chỉ hiện khi mẫu **thực sự được chọn** để phối
- Vị trí: Góc phải trên của thẻ gạch
- Màu: Emerald (#10b981)

### Zoom View
- Fullscreen với backdrop blur
- Click anywhere to close
- Hỗ trợ pinch-to-zoom trên mobile

---

## 5. Typography (Kiểu chữ)

### Tiêu đề
- **H1:** 24px, Bold, Maroon
- **H2:** 20px, SemiBold, White
- **H3:** 16px, Medium, Slate

### Nội dung
- **Body:** 14px, Regular, Light Gray
- **Caption:** 12px, Light, Muted Gray
- **Code/Mã gạch:** Monospace, Emerald

---

## 6. Icons (Biểu tượng)

### Thư viện: FontAwesome 6.4
- Sử dụng style: Solid & Regular
- Kích thước chuẩn: 16px, 20px, 24px

### Icons thường dùng
| Chức năng | Icon |
|-----------|------|
| Tìm kiếm | `fa-magnifying-glass` |
| Lưu | `fa-bookmark` |
| Zoom | `fa-expand` |
| Đăng xuất | `fa-right-from-bracket` |
| Admin | `fa-shield-halved` |
| Chat | `fa-comments` |
| Upload | `fa-cloud-arrow-up` |
