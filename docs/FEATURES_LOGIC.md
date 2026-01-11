
# Chức năng & Logic Ứng dụng

## 1. Thanh tìm kiếm thông minh (Smart Search)

### Cơ chế hoạt động
Thanh tìm kiếm được lập trình để **nhận diện ý định** của người dùng qua từ khóa:

| Từ khóa | Hành vi |
|---------|---------|
| `"ốp"` / `"tường"` | Ẩn danh mục sàn, chỉ hiển thị gạch ốp tường Đậm/Nhạt |
| `"lát sàn"` / `"sàn"` | Chỉ hiển thị gạch lát nền 80x80 hoặc 60x60 |
| `"màu sơn"` / `"sơn"` | Hiển thị bảng màu sơn Dulux, Jotun kèm mã Hex |
| `"mã gạch"` (VD: GR39005) | Tìm kiếm chính xác mã định danh |

### Hiển thị thông tin vật liệu
Mỗi thẻ vật liệu hiển thị đầy đủ:
- **Tên sản phẩm**
- **Kích thước** (VD: 80x80cm, 60x120cm)
- **Bề mặt** (Bóng, Mờ, Nhám)
- **Mã sản phẩm**

---

## 2. Bố cục 3 vùng (Three-Panel Layout)

### Vùng Trái (500px) - Configuration Panel
- **Tab CẤU HÌNH:** Chọn phương án ốp (PA1/PA2/PA3), màu sơn
- **Tab TƯ VẤN AI:** Chatbot đa phương thức (text + hình ảnh)
- **Tab LƯU:** Kho lưu trữ các phương án đã render

### Vùng Giữa - Workspace
- Hiển thị ảnh render chất lượng cao (4K)
- Nút **ZOOM** phóng to toàn màn hình
- Nút **LƯU PHƯƠNG ÁN** (màu xanh lá)
- Overlay loading với hiệu ứng radar

### Vùng Phải (500px) - Showroom
- Kho vật liệu mẫu **luôn hiện diện**
- Thanh tìm kiếm thông minh ở trên cùng
- Phân loại: Gạch Sàn | Tường Đậm | Tường Nhạt | Viên Điểm | Màu Sơn
- Dấu tích xanh (✓) hiển thị khi mẫu được chọn

---

## 3. Quản lý Phương án (Saved Gallery)

### Tính năng Lưu
- Mỗi bản render có thể được lưu lại bằng nút **"LƯU PHƯƠNG ÁN"**
- Lưu trữ trong **localStorage** (Local Persistence)
- Giới hạn **5 phương án gần nhất** để tránh tràn bộ nhớ

### Xem lại & So sánh
- Các phương án đã lưu hiển thị trong **Tab LƯU** ở sidebar trái
- Nhấn vào thumbnail để xem toàn màn hình
- So sánh các bản phối khác nhau trước khi khách chốt hợp đồng

---

## 4. Chat AI Đa phương thức (Multimodal Chat)

### Gửi văn bản
- Hỏi về phong thủy, kỹ thuật ốp lát, tra cứu mã gạch
- AI tích hợp **Google Search** để lấy dữ liệu thực từ pnc.net.vn

### Gửi hình ảnh
- Nhấn nút **Ghim (📎)** để đính kèm ảnh mẫu gạch
- AI phân tích và có thể áp dụng vân gạch vào diễn họa
- Nút **"Lưu vào kho gạch"** để thêm mẫu mới từ chat

---

## 5. Lưu gạch từ Chat vào Kho

### Quy trình
1. Khách gửi ảnh mẫu gạch thực tế vào chat
2. Nhấn nút **"Lưu vào kho gạch"** bên dưới ảnh
3. Hệ thống hỏi: "Đây là gạch Sàn hay Tường?"
4. Mẫu được thêm vào kho vật liệu bên phải
5. Tự động chọn mẫu đó để phối ngay
