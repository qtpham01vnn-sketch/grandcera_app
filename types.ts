
export type TileType = 'floor' | 'wall';
export type DetailedTileType = 'dark' | 'light' | 'accent' | 'border';
// 6 Phương án ốp lát
export type TilingMethod =
  | 'PA1_full_height'      // Ốp kịch trần - Full 4 vách + góc khuất
  | 'PA2_half_wall_120'    // Ốp lửng 1.2m + Sơn
  | 'PA3_half_wall_border' // Ốp 1.2m + Viền (~1.5m) + Sơn
  | 'PA4_with_accent'      // Ốp có gạch điểm nhấn + Sơn
  | 'PA5_wainscoting'      // Wainscoting 80cm + Sơn
  | 'PA6_accent_wall';     // Tường điểm nhấn (1 bức) + Sơn

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
