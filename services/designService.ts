import { db } from './firebase';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    deleteDoc,
    doc
} from 'firebase/firestore';

export interface SavedDesign {
    id?: string;
    userEmail: string;
    visualUrl: string;
    originalUrl: string;
    timestamp: number;
    params: {
        floor: string;
        dark?: string;
        light?: string;
        accent?: string;
        paint?: string;
        method: string;
    };
}

const DESIGNS_COLLECTION = 'designs';

export const designService = {
    // Lưu một bản phối mới
    saveDesign: async (design: SavedDesign) => {
        try {
            const docRef = await addDoc(collection(db, DESIGNS_COLLECTION), {
                ...design,
                timestamp: Date.now()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error saving design:", error);
            throw error;
        }
    },

    // Lắng nghe danh sách thiết kế của một người dùng (Real-time)
    subscribeUserDesigns: (email: string, callback: (designs: SavedDesign[]) => void) => {
        // Tạm thời bỏ orderBy để tránh lỗi Composite Index
        // Bạn cần click vào link trong console để tạo Index cho email + timestamp
        const q = query(
            collection(db, DESIGNS_COLLECTION),
            where("userEmail", "==", email)
        );

        return onSnapshot(q, (snapshot) => {
            const designs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SavedDesign[];

            // Sắp xếp thủ công phía client để không cần index ngay lập tức
            designs.sort((a, b) => b.timestamp - a.timestamp);

            callback(designs);
        }, (error) => {
            console.warn("Firestore Snapshot Error (Có thể do thiếu Index):", error);
        });
    },

    // Xóa một bản phối
    deleteDesign: async (designId: string) => {
        await deleteDoc(doc(db, DESIGNS_COLLECTION, designId));
    }
};
