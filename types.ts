
export type TileType = 'floor' | 'wall';
export type DetailedTileType = 'dark' | 'light' | 'accent' | 'border';
// 7 Phương án ốp lát
export type TilingMethod =
  | 'PA1_full_height'      // Ốp kịch trần - 100% gạch
  | 'PA2_standard_3_1'     // 3 Thân + 1 Viền + Sơn
  | 'PA3_with_accent'      // 3 Thân + 1 Viền + Điểm + Sơn
  | 'PA4_half_wall'        // Ốp lửng 1.2m + Sơn
  | 'PA5_wainscoting'      // Wainscoting 80cm + Sơn
  | 'PA6_accent_wall'      // Tường điểm nhấn + Sơn
  | 'PA7_staggered';       // Ốp so le kịch trần

// Thông tin mô tả từng phương án
export interface TilingMethodInfo {
  id: TilingMethod;
  name: string;
  icon: string;
  description: string;
  requiresPaint: boolean;
  heightCm?: number; // Cao độ ốp (nếu có)
}

export type UserRole = 'admin' | 'guest';
export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  role: UserRole;
  status: UserStatus;
  requestedAt: number;
}

export interface TileData {
  tile_id: string;
  tile_type: TileType;
  detailed_type?: DetailedTileType;
  tile_size: string;
  tile_surface: string;
  tile_material: string;
  tile_coverage_per_box: number;
  tile_image_url: string;
  name: string;
  description: string;
  brand: string;
}

export interface PaintData {
  id: string;
  brand: string;
  code: string;
  name: string;
  hex: string;
}

export interface SavedPA {
  id: string;
  imageUrl: string;
  timestamp: number;
  details: string;
}
