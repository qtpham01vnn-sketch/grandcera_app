# Chức năng & Logic Ứng dụng - V12.2

## 1. Hệ thống 7 Phương án Ốp lát (Standard Tiling)
Đây là cốt lõi của tính năng cấu hình phối bộ:

| Mã PA | Tên | Logic AI | Đặc điểm |
|-------|-----|----------|----------|
| **PA1** | Ốp Kịch Trần | Full wall height | Gạch phủ kín từ sàn lên trần. |
| **PA2** | 3 Thân + 1 Viền | 3 Dark + 1 Border + Paint | Kiểu ốp truyền thống 1.2m + sơn. |
| **PA3** | 3 Thân + Viền + Điểm | 3 Dark + Border + Accent + Paint | Có thêm viên gạch hoa văn tạo điểm nhấn. |
| **PA4** | Ốp Lửng 1.2m | 4 rows of Dark | Đơn giản, hiện đại, phối với sơn nước. |
| **PA5** | Wainscoting 80cm | Classic 80cm height | Phong cách Indochine/Cổ điển. |
| **PA6** | Tường Điểm Nhấn | One wall accent | Chỉ ốp mảng tường chính, vách khác sơn. |
| **PA7** | Ốp So Le | Staggered pattern | Full height nhưng gạch xếp so le 1/2. |

## 2. Design History & Cloud Save
Thay đổi lớn nhất từ phiên bản V12.1 trở đi là khả năng lưu trữ:
- **Tự động gắn thẻ:** Mỗi thiết kế lưu kèm thông tin Floor, Dark, Light, Paint và PA đã chọn.
- **Firebase Firestore:** Dữ liệu được đẩy lên Server Google, cho phép xem lại trên đa thiết bị.
- **UI Lịch sử:** Tab "LƯU" hiển thị danh sách các bản phối theo thời gian thực (Real-time).

## 3. Quản lý Kho Vật liệu Thông minh
- **Phân loại tự động:** Gạch được chia thành Sàn, Đậm, Nhạt, Điểm.
- **Lưu từ Chat:** Người dùng chụp ảnh gạch ở Showroom, AI hỏi thông tin và tự động lưu vào kho để ướm thử ngay.
- **Smart Search:** Lọc gạch theo từ khóa "sàn", "ốp", "sơn" hoặc theo màu sắc "vàng", "xám".

## 4. Xác thực & Phê duyệt (Auth Flow)
- **Guest Access:** Khách hàng vào app, nhập email để hệ thống định danh.
- **Waitroom:** Màn hình chờ hiện đại nếu chưa được Admin duyệt.
- **Admin Dashboard:** Tab "DUYỆT" hiển thị danh sách khách đang chờ. Admin nhấn nút, hệ thống đồng bộ ngay lập tức để mở cửa app cho khách.

## 5. Logic Phối Paint (Sơn tường)
- **Tự động bắt lỗi:** Khi chọn PA2, PA3, PA4, PA5, PA6 mà chưa chọn màu sơn, hệ thống sẽ cảnh báo.
- **Pha màu AI:** AI Render sẽ tự động pha màu sơn theo mã Hex chính xác của Dulux/Jotun mà khách chọn.
