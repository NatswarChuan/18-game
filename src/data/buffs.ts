import { BuffDefinition } from '../types.js';

export const DYNAMIC_BUFFS: readonly BuffDefinition[] = [
  // --- TIER 1: DEPTH 1 (FOUNDATIONS) ---
  {
    id: 'BUFF-01',
    name: 'Khởi Nguyên Trảm Kích',
    depth: 1,
    category: 'VANGUARD',
    weights: [0.8, 0, 0, 0.2, 0, 0, 0.1, 0.1, 0, 0, 0, 0],
    description: 'Tăng 25% công kích cho toàn bộ hàng Tiên Phong (Frontline).',
    statBoost: { attackPercent: 25 }
  },
  {
    id: 'BUFF-02',
    name: 'Hộ Thể Kim Cương',
    depth: 1,
    category: 'DEFENSE',
    weights: [0, 0, 0, 0.8, 0.5, 0.3, 0, 0, 0, 0, 0, 0],
    description: 'Tăng 35 Giáp vật lý và 20% Máu tối đa cho toàn đội hình.',
    statBoost: { armorFlat: 35, hpPercent: 20 }
  },
  {
    id: 'BUFF-03',
    name: 'Tia Chớp Đột Kích',
    depth: 1,
    category: 'FLANK',
    weights: [0.3, 0, 0, 0, 0, 0, 0.7, 0.5, 0.2, 0, 0.4, 0],
    description: 'Tăng 40% Tốc độ đánh cho các Sát Thủ và Tiên Phong Đột Kích.',
    statBoost: { attackPercent: 15, critChance: 25 }
  },
  {
    id: 'BUFF-04',
    name: 'Dòng Chảy Lượng Tử',
    depth: 1,
    category: 'ENERGY',
    weights: [0, 0.4, 0, 0, 0, 0, 0, 0, 0.9, 0, 0, 0],
    description: 'Tăng 50% Tốc độ hồi phục Năng lượng khi tấn công và khi nhận sát thương.',
    statBoost: { energyRegen: 50 }
  },

  // --- TIER 2: DEPTH 2 (SYNERGIES) ---
  {
    id: 'BUFF-05',
    name: 'Cực Quang Valhalla',
    depth: 2,
    category: 'FACTION_VALHALLA',
    weights: [0.5, 0.5, 0.2, 0.3, 0.3, 0, 0.2, 0.3, 0.4, 0, 0, 0],
    description: 'Các Valkyrie Neo-Valhalla tăng 35% Sát thương và hồi máu 20% khi dùng Tuyệt Kỹ.',
    statBoost: { attackPercent: 35, hpPercent: 15 }
  },
  {
    id: 'BUFF-06',
    name: 'Thâm Uyên Thủy Tộc',
    depth: 2,
    category: 'FACTION_EDEN',
    weights: [0.2, 0.7, 0.3, 0.4, 0.4, 0.5, 0, 0, 0.3, 0.3, 0, 0],
    description: 'Phe Abyssal Eden nhận 50 Giáp và phản lại 25% sát thương nhận vào cho kẻ địch.',
    statBoost: { armorFlat: 50, hpPercent: 25 }
  },
  {
    id: 'BUFF-07',
    name: 'Thái Dương Hoàng Kim',
    depth: 2,
    category: 'FACTION_SOL',
    weights: [0.6, 0.4, 0.4, 0.2, 0.2, 0, 0.4, 0.6, 0.2, 0, 0, 0],
    description: 'Phe Sol Dynasty tăng 45% Tỉ lệ chí mạng và gây sát thương chuẩn bỏ qua giáp.',
    statBoost: { critChance: 45, attackPercent: 20 }
  },
  {
    id: 'BUFF-08',
    name: 'Pháo Kích Hậu Phương',
    depth: 2,
    category: 'BACKLINE',
    weights: [0.4, 0.6, 0.3, 0, 0, 0, 0.3, 0.5, 0.3, 0, 0, 0],
    description: 'Hàng sau (Backline) tăng 40% Tầm bắn và 35% Sát thương kỹ năng.',
    statBoost: { attackPercent: 35 }
  },

  // --- TIER 3: DEPTH 3 (CLIMAX OVERDRIVE) ---
  {
    id: 'BUFF-09',
    name: 'Bộc Phá Áo Giáp Climax',
    depth: 3,
    category: 'CLIMAX',
    weights: [0.7, 0.7, 0.6, 0, 0, 0, 0.6, 0.8, 0.8, 0, 0, 0],
    description: 'Khi rơi xuống trạng thái Rách Giáp (Tier 2 & 3), nhận 80% Công kích và đầy 100 Năng lượng ngay lập tức!',
    statBoost: { attackPercent: 80, energyRegen: 100 }
  },
  {
    id: 'BUFF-10',
    name: 'Thiên Sứ Bất Tử',
    depth: 3,
    category: 'DECISIVE',
    weights: [0.3, 0.3, 0, 0.8, 0.8, 0.8, 0, 0, 0.5, 0, 0, 0],
    description: 'Mỗi Valkyrie sống sót với 1 HP trong 3 giây khi nhận đòn chí tử đầu tiên.',
    statBoost: { hpPercent: 30, armorFlat: 40 }
  }
];

export function getRandomDraftBuffs(count: number = 3): BuffDefinition[] {
  const shuffled = [...DYNAMIC_BUFFS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
