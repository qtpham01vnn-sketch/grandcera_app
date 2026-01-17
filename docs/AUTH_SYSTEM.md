# Hệ thống Xác thực & Phê duyệt (Auth System) - V12.2

## 1. Nguyên lý Duyệt khách (Approval Engine)
Ứng dụng sử dụng mô hình xác thực "Bán đóng" (Semi-Closed) để bảo vệ tài nguyên AI (Gemini/Flux) chỉ dành cho khách hàng thực sự của Showroom.

### Luồng xử lý:
1.  **Đăng ký/Đăng nhập:** Người dùng nhập Email -> `firebase.auth().signInWithEmailLink()`.
2.  **Trạng thái Chờ:** Sau khi vào, hệ thống kiểm tra Document của người dùng trên Firestore (`users/{email}`).
    - Nếu `status === 'pending'`: Hiển thị màn hình chờ phê duyệt.
    - Nếu `status === 'approved'`: Mở cửa vào Studio chính.
3.  **Hành động của Admin:** Admin truy cập Tab "DUYỆT", nhấn nút "Duyệt". Lệnh này thực hiện `updateDoc(userRef, { status: 'approved' })`.
4.  **Phản hồi tức thì:** Nhờ hàm `onSnapshot()`, máy tính của khách hàng sẽ nhận được thay đổi trạng thái ngay lập tức và tự chuyển trang mà không cần F5.

## 2. Cấu trúc dữ liệu Firebase (Firestore Schema)

### Collection `users`
```json
{
  "email": "khachhang@gmail.com",
  "status": "approved", // hoặc 'pending'
  "role": "guest",      // hoặc 'admin'
  "createdAt": "timestamp"
}
```

### Collection `designs` (Lịch sử bản phối)
```json
{
  "userId": "XYZ",
  "baseImage": "url_hoac_base64",
  "renderedImage": "url_ai_render",
  "config": {
    "floor": "ID_Gach",
    "dark": "ID_Gach",
    "light": "ID_Gach",
    "paint": "ID_Son",
    "method": "PA2"
  },
  "timestamp": "serverTimestamp"
}
```

## 3. Vai trò Admin tối thượng
Mã định danh `qtpham01vnn@gmail.com` được mã hóa cứng làm Admin. Chỉ Admin mới có quyền thấy Tab "DUYỆT" và thực hiện các thay đổi trạng thái người dùng.
