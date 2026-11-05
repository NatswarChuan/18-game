import { ValkyrieDefinition } from './valkyrie-types.js';

/**
 * Neo-Valhalla Faction Valkyrie Roster (VALK-01 to VALK-09).
 */
export const VALHALLA_ROSTER: readonly ValkyrieDefinition[] = [
  {
    id: 'VALK-01',
    name: 'Freyja',
    title: 'Ngọn Lửa Tiên Phong',
    faction: 'NEO_VALHALLA',
    role: 'FRONTLINE_BREAKER',
    optimalSlot: 1,
    stats: { maxHp: 1200, attack: 65, armor: 30, attackSpeed: 1.0, attackRange: 1, maxEnergy: 100 },
    ultimate: { name: 'Infernal Rupture', description: 'Nện đại kiếm plasma quét ngang hàng 1 kẻ địch, gây 250% sát thương nhiệt và giảm 40% giáp trong 5s.', energyCost: 100, cooldownTicks: 100 },
    battleDamage: {
      tier1Description: 'Giáp Titan đỏ thẫm bóng bẩy ôm sát, đại kiếm nhiệt hạch rực sáng uy dũng.',
      tier2Description: 'Yếm giáp ngực nứt vỡ lóe tia hồ quang, vạt áo tưa rách sau những đợt xung kích dồn dập.',
      tier3Description: 'Giáp năng lượng quá tải rực lửa, lưỡi kiếm plasma bùng cháy cuồng nhiệt quyết tử.',
      battleVoiceLine: 'Toàn bộ nhiệt lượng đã tập trung vào lưỡi kiếm này... Tiến lên!'
    }
  },
  {
    id: 'VALK-02',
    name: 'Brynhildr',
    title: 'Khiên Băng Tuyệt Đối',
    faction: 'NEO_VALHALLA',
    role: 'FRONTLINE_VANGUARD',
    optimalSlot: 0,
    stats: { maxHp: 1500, attack: 40, armor: 50, attackSpeed: 0.8, attackRange: 1, maxEnergy: 90 },
    ultimate: { name: 'Absolute Glaciation', description: 'Cắm khiên tạo lá chắn băng giá bao bọc đồng đội, giảm 50% sát thương nhận vào trong 6s.', energyCost: 90, cooldownTicks: 120 },
    battleDamage: {
      tier1Description: 'Giáp Hiệp Sĩ Băng Giá toàn thân kiêu sa, trường khiên tinh thể vững như thái sơn.',
      tier2Description: 'Giáp vai vỡ vụn do chịu lực chấn động, sương băng tỏa ra quanh vết rách chiến bào.',
      tier3Description: 'Khiên băng rạn nứt phát sáng cực độ, trường lực phòng thủ kích hoạt trạng thái kiên cố cuối cùng.',
      battleVoiceLine: 'Bức tường băng giá này sẽ không bao giờ sụp đổ trước mũi thương của các ngươi!'
    }
  },
  {
    id: 'VALK-03',
    name: 'Sigrun',
    title: 'Sát Thủ Bóng Đêm',
    faction: 'NEO_VALHALLA',
    role: 'MIDLINE_INFILTRATOR',
    optimalSlot: 3,
    stats: { maxHp: 850, attack: 90, armor: 15, attackSpeed: 1.6, attackRange: 1, maxEnergy: 80 },
    ultimate: { name: 'Shadow Dance: Decapitate', description: 'Lướt ra sau lưng kẻ địch có máu thấp nhất, tung 6 nhát chém chí mạng 100% bạo kích.', energyCost: 80, cooldownTicks: 80 },
    battleDamage: {
      tier1Description: 'Bộ đồ tàng hình nano đen nhánh linh hoạt, song kiếm plasma phát ánh lam sắc lẹm.',
      tier2Description: 'Vải nano rách từng vệt chéo sau các pha áp sát liều lĩnh, tốc độ di chuyển tăng vọt.',
      tier3Description: 'Lớp ngụy trang quá tải phóng điện tích, ánh mắt rực sáng trong bóng đêm truy sát.',
      battleVoiceLine: 'Ngươi vừa chớp mắt đấy à? Quá muộn rồi.'
    }
  },
  {
    id: 'VALK-04',
    name: 'Kara',
    title: 'Xạ Thủ Trùng Pháo',
    faction: 'NEO_VALHALLA',
    role: 'BACKLINE_ARTILLERY',
    optimalSlot: 6,
    stats: { maxHp: 800, attack: 85, armor: 12, attackSpeed: 0.9, attackRange: 3, maxEnergy: 110 },
    ultimate: { name: 'Valkyrie Annihilation Shell', description: 'Bắn pháo chùm vào trung tâm đối phương, gây sát thương diện rộng 3x3 và làm choáng 2s.', energyCost: 110, cooldownTicks: 140 },
    battleDamage: {
      tier1Description: 'Quân phục tương lai sắc nét cùng kính ngắm CyberHUD hiện đại, trọng pháo sẵn sàng.',
      tier2Description: 'Khói thuốc súng bám đầy quân phục rách góc, nòng pháo quá nhiệt đỏ rực.',
      tier3Description: 'Kính HUD nứt vỡ, chuyển sang ngắm bắn thủ công toàn lực công phá.',
      battleVoiceLine: 'Tọa độ đã khóa... Khai hỏa toàn bộ cơ số đạn!'
    }
  },
  {
    id: 'VALK-05',
    name: 'Alvitr',
    title: 'Pháp Sư Thiên Lôi',
    faction: 'NEO_VALHALLA',
    role: 'BACKLINE_SORCERESS',
    optimalSlot: 8,
    stats: { maxHp: 780, attack: 95, armor: 10, attackSpeed: 1.1, attackRange: 3, maxEnergy: 100 },
    ultimate: { name: 'Chain Lightning Tempest', description: 'Triệu hồi bão điện lan qua 6 mục tiêu, giảm hồi phục năng lượng đối thủ 50%.', energyCost: 100, cooldownTicks: 110 },
    battleDamage: {
      tier1Description: 'Lễ phục quý phái màu tím thẫm đính ngọc Cyber, quả cầu lôi điện tử xoay quanh.',
      tier2Description: 'Tà áo bị sét xé tưa từng dải, hồ quang điện nhảy múa dữ dội trên đầu ngón tay.',
      tier3Description: 'Lôi vân bao bọc toàn thân, điện thế kích hoạt ngưỡng cực hạn xé rách không gian.',
      battleVoiceLine: 'Cảm nhận uy lực của bầu trời sấm sét giáng xuống đầu ngươi đi!'
    }
  },
  {
    id: 'VALK-06',
    name: 'Mist',
    title: 'Thánh Nữ Cứu Rỗi',
    faction: 'NEO_VALHALLA',
    role: 'MIDLINE_TACTICIAN',
    optimalSlot: 4,
    stats: { maxHp: 950, attack: 35, armor: 25, attackSpeed: 1.0, attackRange: 2, maxEnergy: 85 },
    ultimate: { name: 'Sanctuary of Valkyries', description: 'Hào quang phục hồi 40% HP tối đa cho toàn đội và hóa giải mọi hiệu ứng bất lợi.', energyCost: 85, cooldownTicks: 130 },
    battleDamage: {
      tier1Description: 'Y phục thánh nữ công nghệ tao nhã, thánh trượng nano tỏa ánh hào quang thuần khiết.',
      tier2Description: 'Chiến bào tưa rách vì che chắn cho đồng đội, ánh sáng trị liệu càng thêm rực rỡ.',
      tier3Description: 'Đôi cánh quang học bung mở cực đại, hy sinh năng lượng bản thân để bảo vệ tiền tuyến.',
      battleVoiceLine: 'Ánh sáng của Valhalla sẽ chữa lành mọi vết thương cho các bạn!'
    }
  },
  {
    id: 'VALK-07',
    name: 'Herja',
    title: 'Cuồng Nộ Thương Thủ',
    faction: 'NEO_VALHALLA',
    role: 'FRONTLINE_BERSERKER',
    optimalSlot: 2,
    stats: { maxHp: 1100, attack: 75, armor: 22, attackSpeed: 1.3, attackRange: 1, maxEnergy: 90 },
    ultimate: { name: 'Thunder Spear Blitz', description: 'Lao xuyên qua hàng phòng thủ đối phương, gây sát thương xuyên giáp và tăng 50% tốc đánh.', energyCost: 90, cooldownTicks: 90 },
    battleDamage: {
      tier1Description: 'Giáp da chiến binh phương Bắc dẻo dai kết hợp ngọn thương sấm sét Gungnir Replica.',
      tier2Description: 'Phiến giáp vỡ nát dưới đòn phản kích, cơ bắp căng tràn khí thế tấn công.',
      tier3Description: 'Thương thần tích điện cực đại, tiếng gầm chiến trận xé toạc phòng tuyến địch.',
      battleVoiceLine: 'Càng bị dồn vào chân tường, ngọn thương này càng trở nên sắc bén!'
    }
  },
  {
    id: 'VALK-08',
    name: 'Rota',
    title: 'Kiếm Vũ Cơ Xung Kích',
    faction: 'NEO_VALHALLA',
    role: 'MIDLINE_SKIRMISHER',
    optimalSlot: 5,
    stats: { maxHp: 900, attack: 70, armor: 20, attackSpeed: 1.4, attackRange: 2, maxEnergy: 75 },
    ultimate: { name: 'Whirlwind Blade Waltz', description: 'Xoay tròn tạo lốc kiếm khí hất tung kẻ địch trong phạm vi 1 ô xung quanh và gây sát thương liên tục.', energyCost: 75, cooldownTicks: 85 },
    battleDamage: {
      tier1Description: 'Chiến phục vũ đạo lướt gió tinh xảo, 4 thanh kiếm bay lơ lửng điều khiển bằng sóng não.',
      tier2Description: 'Tà áo tưa rách theo từng vòng xoay kiếm thuật, quỹ đạo đòn đánh ngày càng khó lường.',
      tier3Description: 'Kiếm trận phân thân tốc độ cao, vũ điệu gió bão bao trùm trung tâm giao tranh.',
      battleVoiceLine: 'Hãy thưởng thức vũ điệu tử thần này đi nào!'
    }
  },
  {
    id: 'VALK-09',
    name: 'Gondul',
    title: 'Kỹ Sư Ma Trận Khiên',
    faction: 'NEO_VALHALLA',
    role: 'BACKLINE_ENCHANTER',
    optimalSlot: 7,
    stats: { maxHp: 820, attack: 50, armor: 18, attackSpeed: 1.0, attackRange: 3, maxEnergy: 95 },
    ultimate: { name: 'Overclock Forcefield', description: 'Cấp khiên chắn 30% HP cho 3 đồng minh thấp máu nhất và tăng 30% sát thương bạo kích.', energyCost: 95, cooldownTicks: 110 },
    battleDamage: {
      tier1Description: 'Áo khoác blouse trắng hiện đại cách tân, bàn phím điều khiển ba chiều hologram sắc sảo.',
      tier2Description: 'Trang phục bị khói chập mạch làm cháy góc, các thông số thuật toán hiển thị đỏ rực.',
      tier3Description: 'Hệ thống drone ép xung 200%, kích hoạt lá chắn bảo hộ toàn diện cho đồng đội.',
      battleVoiceLine: 'Mọi thông số chiến trường đều nằm trong tầm kiểm soát của tôi!'
    }
  }
];
