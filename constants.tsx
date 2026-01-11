
import { TileData, PaintData } from './types';

export const MOCK_TILES: TileData[] = [
  // --- GẠCH TƯỜNG ĐẬM (Dark) ---
  {
    tile_id: 'GR39005-D2',
    tile_type: 'wall',
    detailed_type: 'dark',
    tile_size: '300x600',
    tile_surface: 'Glossy',
    tile_material: 'Ceramic',
    tile_coverage_per_box: 1.44,
    tile_image_url: 'https://images.unsplash.com/photo-1588412079929-790b9f593d8e?auto=format&fit=crop&q=80&w=400',
    name: 'GR39005 Đậm',
    description: 'Vàng kem vân đá đậm.',
    brand: 'Phương Nam'
  },
  {
    tile_id: 'CE-GREY-DARK',
    tile_type: 'wall',
    detailed_type: 'dark',
    tile_size: '300x600',
    tile_surface: 'Matt',
    tile_material: 'Porcelain',
    tile_coverage_per_box: 1.44,
    tile_image_url: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&q=80&w=400',
    name: 'Cement Grey Dark',
    description: 'Xám bê tông hiện đại.',
    brand: 'Phương Nam'
  },
  {
    tile_id: 'MARBLE-BLACK-GOLD',
    tile_type: 'wall',
    detailed_type: 'dark',
    tile_size: '400x800',
    tile_surface: 'Poli',
    tile_material: 'Porcelain',
    tile_coverage_per_box: 1.28,
    tile_image_url: 'https://images.unsplash.com/photo-1616486701797-0f33f6100211?auto=format&fit=crop&q=80&w=400',
    name: 'Laurent Black',
    description: 'Đen tia chớp vàng sang trọng.',
    brand: 'Phương Nam'
  },
  {
    tile_id: 'DARK-STONE-01',
    tile_type: 'wall',
    detailed_type: 'dark',
    tile_size: '300x600',
    tile_surface: 'Sugar',
    tile_material: 'Ceramic',
    tile_coverage_per_box: 1.44,
    tile_image_url: 'https://images.unsplash.com/photo-1504198266310-85949d88581e?auto=format&fit=crop&q=80&w=400',
    name: 'Stone Anthracite',
    description: 'Đá phiến đen mờ.',
    brand: 'Phương Nam'
  },

  // --- GẠCH TƯỜNG NHẠT (Light) ---
  {
    tile_id: 'GR39005-L',
    tile_type: 'wall',
    detailed_type: 'light',
    tile_size: '300x600',
    tile_surface: 'Glossy',
    tile_material: 'Ceramic',
    tile_coverage_per_box: 1.44,
    tile_image_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=400',
    name: 'GR39005 Nhạt',
    description: 'Trắng khói thanh lịch.',
    brand: 'Phương Nam'
  },
  {
    tile_id: 'CALA-WHITE-LUX',
    tile_type: 'wall',
    detailed_type: 'light',
    tile_size: '300x600',
    tile_surface: 'Glossy',
    tile_material: 'Ceramic',
    tile_coverage_per_box: 1.44,
    tile_image_url: 'https://images.unsplash.com/photo-1628592102751-ba83b0314276?auto=format&fit=crop&q=80&w=400',
    name: 'Calacatta White',
    description: 'Trắng vân mây xám nhẹ.',
    brand: 'Phương Nam'
  },
  {
    tile_id: 'SAND-BEIGE-01',
    tile_type: 'wall',
    detailed_type: 'light',
    tile_size: '300x600',
    tile_surface: 'Matt',
    tile_material: 'Ceramic',
    tile_coverage_per_box: 1.44,
    tile_image_url: 'https://images.unsplash.com/photo-1599619351208-3e6c839d6828?auto=format&fit=crop&q=80&w=400',
    name: 'Sand Beige',
    description: 'Màu kem cát ấm áp.',
    brand: 'Phương Nam'
  },

  // --- VIÊN ĐIỂM / TRANG TRÍ (Accent) ---
  {
    tile_id: 'GR39005-D',
    tile_type: 'wall',
    detailed_type: 'accent',
    tile_size: '300x600',
    tile_surface: 'Glossy Decor',
    tile_material: 'Ceramic',
    tile_coverage_per_box: 1.44,
    tile_image_url: 'https://images.unsplash.com/photo-1523413555809-0fb1d4da238d?auto=format&fit=crop&q=80&w=400',
    name: 'Điểm Hoa Ly',
    description: 'Họa tiết hoa ly.',
    brand: 'Phương Nam'
  },
  {
    tile_id: 'WOOD-FISHBONE',
    tile_type: 'wall',
    detailed_type: 'accent',
    tile_size: '300x600',
    tile_surface: 'Matt',
    tile_material: 'Porcelain',
    tile_coverage_per_box: 1.44,
    tile_image_url: 'https://images.unsplash.com/photo-1622322368149-6500806443c5?auto=format&fit=crop&q=80&w=400',
    name: 'Gỗ Xương Cá',
    description: 'Vân gỗ ghép xương cá.',
    brand: 'Phương Nam'
  },
  {
    tile_id: 'MOSAIC-BLUE-02',
    tile_type: 'wall',
    detailed_type: 'accent',
    tile_size: '300x300',
    tile_surface: 'Glossy',
    tile_material: 'Glass',
    tile_coverage_per_box: 0.9,
    tile_image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
    name: 'Mosaic Blue',
    description: 'Xanh đại dương rực rỡ.',
    brand: 'Phương Nam'
  },
  {
    tile_id: 'TERRAZZO-ACCENT',
    tile_type: 'wall',
    detailed_type: 'accent',
    tile_size: '300x600',
    tile_surface: 'Matt',
    tile_material: 'Porcelain',
    tile_coverage_per_box: 1.44,
    tile_image_url: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&q=80&w=400',
    name: 'Terrazzo Multi',
    description: 'Đá mài hạt màu hiện đại.',
    brand: 'Phương Nam'
  },

  // --- GẠCH SÀN (Floor) ---
  {
    tile_id: 'MARBLE-GOLD-80',
    tile_type: 'floor',
    tile_size: '800x800',
    tile_surface: 'Bóng kiếng',
    tile_material: 'Porcelain',
    tile_coverage_per_box: 1.92,
    tile_image_url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=400',
    name: 'Marble Vàng 80x80',
    brand: 'Phương Nam',
    description: 'Vàng hoàng gia.'
  },
  {
    tile_id: 'MARBLE-WHITE-80',
    tile_type: 'floor',
    tile_size: '800x800',
    tile_surface: 'Bóng kiếng',
    tile_material: 'Porcelain',
    tile_coverage_per_box: 1.92,
    tile_image_url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=400',
    name: 'Marble Trắng 80x80',
    brand: 'Phương Nam',
    description: 'Trắng vân mây.'
  },
  {
    tile_id: 'GREY-STONE-80',
    tile_type: 'floor',
    tile_size: '800x800',
    tile_surface: 'Matt',
    tile_material: 'Porcelain',
    tile_coverage_per_box: 1.92,
    tile_image_url: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=400',
    name: 'Xám Đá 80x80',
    brand: 'Phương Nam',
    description: 'Vân đá xám tự nhiên.'
  },
  {
    tile_id: 'ROYAL-BLUE-80',
    tile_type: 'floor',
    tile_size: '800x800',
    tile_surface: 'Bóng kiếng',
    tile_material: 'Porcelain',
    tile_coverage_per_box: 1.92,
    tile_image_url: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=400',
    name: 'Xanh Navy 80x80',
    brand: 'Phương Nam',
    description: 'Màu xanh biển sâu cao cấp.'
  },
  {
    tile_id: 'WOOD-DARK-FLOOR',
    tile_type: 'floor',
    tile_size: '600x600',
    tile_surface: 'Matt',
    tile_material: 'Porcelain',
    tile_coverage_per_box: 1.44,
    tile_image_url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=400',
    name: 'Gỗ Óc Chó 60x60',
    brand: 'Phương Nam',
    description: 'Gỗ tối màu ấm cúng.'
  },
  {
    tile_id: 'VINTAGE-TERRAZZO',
    tile_type: 'floor',
    tile_size: '600x600',
    tile_surface: 'Semi-gloss',
    tile_material: 'Porcelain',
    tile_coverage_per_box: 1.44,
    tile_image_url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=400',
    name: 'Terrazzo Cổ Điển',
    brand: 'Phương Nam',
    description: 'Họa tiết đá mài vintage.'
  }
];

export const MOCK_PAINTS: PaintData[] = [
  { id: 'P-WHITE', brand: 'Dulux', code: '50YY 83/029', name: 'Trắng Sứ Lux', hex: '#F2F4F2' },
  { id: 'P-CREAM', brand: 'Jotun', code: '1001', name: 'Kem Vàng Nhẹ', hex: '#F5F0E1' },
  { id: 'P-GREY', brand: 'Dulux', code: '30BB 72/003', name: 'Xám Khói', hex: '#D1D5D8' },
  { id: 'P-BLUE', brand: 'Jotun', code: '4477', name: 'Deco Blue', hex: '#3B4D61' },
  { id: 'P-SAGE', brand: 'Dulux', code: '10GY 56/058', name: 'Xanh Sage', hex: '#A7B49F' }
];
