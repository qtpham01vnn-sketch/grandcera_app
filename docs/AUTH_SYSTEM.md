
# Hệ thống Xác thực & Phê duyệt

## 1. Phân quyền (RBAC)
- **Admin (qtpham01vnn@gmail.com):** Toàn quyền hệ thống, quản lý danh sách khách hàng.
- **Khách hàng (Guest):** Có quyền cấu hình và diễn họa nhưng phải qua bước duyệt.

## 2. Quy trình Phê duyệt (Approval Flow)
1. Khách hàng đăng nhập bằng Email.
2. Hệ thống tạo Profile `pending`.
3. Admin nhận thông báo trong Tab **Duyệt**.
4. Admin nhấn "Duyệt" -> Trạng thái đổi thành `approved`.

## 3. Cơ chế Real-time (Firebase)
Hệ thống sử dụng **Firestore OnSnapshot**. Khi Admin vừa nhấn duyệt trên máy của mình, Snapshot trên máy Khách hàng sẽ nhận tín hiệu ngay lập tức (không trễ) để mở cửa Studio.

## 4. Dữ liệu Đám mây
- Profile người dùng được lưu trữ an toàn trên Google Cloud.
- Lịch sử thiết kế được gắn định danh (UID) để đồng bộ trên mọi thiết bị khi đăng nhập cùng Email.
