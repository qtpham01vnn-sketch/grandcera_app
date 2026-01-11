import { db } from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { UserProfile, UserStatus } from '../types';

const ADMIN_EMAIL = 'qtpham01vnn@gmail.com';
const USERS_COLLECTION = 'users';

export const authService = {
  // Đăng nhập (Lưu/Cập nhật thông tin vào Firestore)
  loginWithGoogle: async (email: string, name: string, photoURL: string): Promise<UserProfile> => {
    const userRef = doc(db, USERS_COLLECTION, email);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    } else {
      const isAdmin = email === ADMIN_EMAIL;
      const newUser: UserProfile = {
        id: Date.now().toString(),
        email,
        name,
        photoURL,
        role: isAdmin ? 'admin' : 'guest',
        status: isAdmin ? 'approved' : 'pending',
        requestedAt: Date.now()
      };
      await setDoc(userRef, newUser);
      return newUser;
    }
  },

  // Kiểm tra trạng thái mới nhất (Dùng cho Polling - bây giờ là Realtime)
  checkUserStatus: (email: string, callback: (status: UserStatus) => void) => {
    const userRef = doc(db, USERS_COLLECTION, email);
    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data().status as UserStatus);
      }
    });
  },

  // Lấy danh sách chờ duyệt (Realtime cho Admin)
  subscribePendingUsers: (callback: (users: UserProfile[]) => void) => {
    const q = query(collection(db, USERS_COLLECTION), where("status", "==", "pending"));
    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => doc.data() as UserProfile);
      callback(users);
    });
  },

  // Phê duyệt người dùng
  approveUser: async (email: string) => {
    const userRef = doc(db, USERS_COLLECTION, email);
    await updateDoc(userRef, { status: 'approved' });
  },

  // Từ chối người dùng
  rejectUser: async (email: string) => {
    const userRef = doc(db, USERS_COLLECTION, email);
    await updateDoc(userRef, { status: 'rejected' });
  }
};
