import { ValkyrieDefinition } from './valkyrie-types.js';

/**
 * Sol Dynasty Faction Valkyrie Roster (VALK-19 to VALK-27).
 */
export const SOL_ROSTER: readonly ValkyrieDefinition[] = [
  {
    id: 'VALK-19',
    name: 'Amaterasu',
    title: 'Thái Dương Thánh Cơ',
    faction: 'SOL_DYNASTY',
    role: 'FRONTLINE_BREAKER',
    optimalSlot: 1,
    stats: { maxHp: 1220, attack: 70, armor: 30, attackSpeed: 1.0, attackRange: 1, maxEnergy: 100 },
    ultimate: { name: 'Solar Flare Cremation', description: 'Bùng nổ nhiệt hạch thiêu đốt hàng 1 của địch, gây sát thương lửa liên tục và cấm hồi máu trong 5s.', energyCost: 100, cooldownTicks: 110 },
    battleDamage: {
      tier1Description: 'Kimono cách tân lộng lẫy thêu rồng phượng, giáp vai mạ vàng rực rỡ, gương thần Yata.',
      tier2Description: 'Tà áo kimono bị lửa thiêu tưa rách, gương thần tích tụ nhiệt lượng mặt trời chói lòa.',
      tier3Description: 'Vầng hào quang thái dương bừng nở, biến sàn đấu thành biển lửa nhiệt hạch.',
      battleVoiceLine: 'Ánh sáng của Thái Dương sẽ thanh tẩy mọi bóng tối gian tà!'
    }
  },
  {
    id: 'VALK-20',
    name: 'Valkyrie-Zero: Genesis',
    title: 'Cổ Mẫu Nguyên Bản',
    faction: 'SOL_DYNASTY',
    role: 'FRONTLINE_VANGUARD',
    optimalSlot: 0,
    stats: { maxHp: 1600, attack: 45, armor: 55, attackSpeed: 0.8, attackRange: 1, maxEnergy: 90 },
    ultimate: { name: 'Zero Protocol: Aegis Overdrive', description: 'Lá chắn mặt trời hấp thụ 100% sát thương nhận vào trong 4s và phản lại 50% cho kẻ tấn công.', energyCost: 90, cooldownTicks: 120 },
    battleDamage: {
      tier1Description: 'Bộ giáp nguyên mẫu hoàn thiện với các đường dẫn plasma vàng kim rực sáng uy lực.',
      tier2Description: 'Giáp ngoài rạn vỡ để lộ khung titan sinh học bên trong chịu đựng đòn đánh mãnh liệt.',
      tier3Description: 'Giao thức số 0 mở khóa giới hạn, hấp thụ toàn bộ năng lượng xung quanh để phản kích.',
      battleVoiceLine: 'Khởi động Giao Thức Zero... Bắt đầu tái định hình chiến trường!'
    }
  },
  {
    id: 'VALK-21',
    name: 'Tomoe',
    title: 'Bá Vương Trảm Đao',
    faction: 'SOL_DYNASTY',
    role: 'FRONTLINE_BERSERKER',
    optimalSlot: 2,
    stats: { maxHp: 1150, attack: 78, armor: 25, attackSpeed: 1.2, attackRange: 1, maxEnergy: 85 },
    ultimate: { name: 'Naginata Crescent Decapitation', description: 'Chém vòng bán nguyệt hất tung và gây sát thương bạo kích 300% cho mục tiêu phía trước.', energyCost: 85, cooldownTicks: 95 },
    battleDamage: {
      tier1Description: 'Giáp ngực samurai truyền thống kết hợp đại đao naginata nhiệt hạch kiêu hùng.',
      tier2Description: 'Tấm che ngực vỡ một phần sau cuộc đọ kiếm nảy lửa, đại đao bốc khói nhiệt độ cao.',
      tier3Description: 'Bá khí cuồng bạo phóng ra từ lưỡi đao, một nhát trảm chẻ đôi làn sóng tấn công.',
      battleVoiceLine: 'Dưới lưỡi naginata này, không kẻ thù nào có thể đứng vững!'
    }
  },
  {
    id: 'VALK-22',
    name: 'Kaguya',
    title: 'Nguyệt Cung Pháo Thủ',
    faction: 'SOL_DYNASTY',
    role: 'BACKLINE_ARTILLERY',
    optimalSlot: 6,
    stats: { maxHp: 790, attack: 86, armor: 14, attackSpeed: 1.0, attackRange: 3, maxEnergy: 100 },
    ultimate: { name: 'Moonbeam Orbital Strike', description: 'Cột sáng laser từ vệ tinh quỹ đạo bắn thẳng xuống hàng sau đối phương làm bốc hơi kẻ địch.', energyCost: 100, cooldownTicks: 130 },
    battleDamage: {
      tier1Description: 'Trang phục công chúa tương lai bằng tơ tằm óng ả, ngồi trên cỗ pháo lơ lửng mặt trăng.',
      tier2Description: 'Váy áo tưa rách vì sóng phản xạ nhiệt từ bệ phóng vệ tinh.',
      tier3Description: 'Vệ tinh đồng bộ năng lượng 100%, luồng laser hội tụ quét sạch hàng sau địch.',
      battleVoiceLine: 'Lệnh bắn từ quỹ đạo không gian... Bốc hơi ngay lập tức!'
    }
  },
  {
    id: 'VALK-23',
    name: 'Susanoo',
    title: 'Lôi Đình Cuồng Nộ',
    faction: 'SOL_DYNASTY',
    role: 'MIDLINE_INFILTRATOR',
    optimalSlot: 3,
    stats: { maxHp: 870, attack: 88, armor: 18, attackSpeed: 1.5, attackRange: 1, maxEnergy: 80 },
    ultimate: { name: 'Storm God: Dual Slash', description: 'Biến thành tia chớp lướt chéo bàn cờ chém liên hoàn 8 nhát gây chảy máu kéo dài.', energyCost: 80, cooldownTicks: 85 },
    battleDamage: {
      tier1Description: 'Giáp ninja bọc vải bó sát, mặt nạ Oni kiêu hùng, song kiếm Muramasa bốc lửa.',
      tier2Description: 'Mặt nạ vỡ nát dưới áp lực tốc độ, sấm sét bao quanh từng bước di chuyển.',
      tier3Description: 'Bão lôi thần giải phóng hoàn toàn, lưỡi kiếm lướt nhanh như ánh sáng xé gió.',
      battleVoiceLine: 'Tia chớp của thần bão tố sẽ trừng phạt các ngươi!'
    }
  },
  {
    id: 'VALK-24',
    name: 'Himiko',
    title: 'Nữ Vương Vu Nữ',
    faction: 'SOL_DYNASTY',
    role: 'MIDLINE_TACTICIAN',
    optimalSlot: 4,
    stats: { maxHp: 960, attack: 50, armor: 26, attackSpeed: 1.0, attackRange: 2, maxEnergy: 85 },
    ultimate: { name: 'Imperial Blessing Rite', description: 'Rung chuông thánh tăng 40% Tốc Đánh và 25% Kháng Sát Thương cho toàn đội trong 6s.', energyCost: 85, cooldownTicks: 110 },
    battleDamage: {
      tier1Description: 'Trang phục vu nữ Miko trắng đỏ tôn nghiêm, chuông thánh Kagura Suzu kết hợp drone bay.',
      tier2Description: 'Tà áo vu nữ rách nhẹ sau các đợt cản phá chấn động, lời ca thanh tẩy vang vọng.',
      tier3Description: 'Trâm cài bung mở, luồng linh lực thánh khiết bao bọc toàn bộ đồng minh kiên cường.',
      battleVoiceLine: 'Cầu chúc cho thanh kiếm của các dũng sĩ luôn tràn đầy sức mạnh thần thánh!'
    }
  },
  {
    id: 'VALK-25',
    name: 'Oichi',
    title: 'Hắc Huyết Hoa Anh Đào',
    faction: 'SOL_DYNASTY',
    role: 'BACKLINE_SORCERESS',
    optimalSlot: 8,
    stats: { maxHp: 770, attack: 94, armor: 12, attackSpeed: 1.1, attackRange: 3, maxEnergy: 105 },
    ultimate: { name: 'Black Sakura Petal Storm', description: 'Ô lụa phóng ngàn cánh hoa anh đào bén như dao cạo, làm mù mục tiêu trong 3s.', energyCost: 105, cooldownTicks: 120 },
    battleDamage: {
      tier1Description: 'Kimono đen tuyền dệt hoa anh đào đỏ, chiếc ô lụa Cyberpunk che chắn bí ẩn.',
      tier2Description: 'Cánh ô rách từng mảng sau những lần hứng đạn pháo, hoa anh đào đỏ bay lượn.',
      tier3Description: 'Ô xoay cực đại giải phóng bão hoa sắc nhọn cắt đứt tầm nhìn toàn bộ hàng phòng ngự.',
      battleVoiceLine: 'Hoa anh đào nở trong đêm tối... chính là hồi chuông tiễn biệt các ngươi.'
    }
  },
  {
    id: 'VALK-26',
    name: 'Chiyome',
    title: 'Ảnh Vô Ảnh Nhẫn Giả',
    faction: 'SOL_DYNASTY',
    role: 'MIDLINE_SKIRMISHER',
    optimalSlot: 5,
    stats: { maxHp: 890, attack: 76, armor: 20, attackSpeed: 1.4, attackRange: 2, maxEnergy: 75 },
    ultimate: { name: 'Chain Binding Entanglement', description: 'Phóng xích trói mục tiêu mạnh nhất của địch, kéo về ô đối diện và làm choáng 3s.', energyCost: 75, cooldownTicks: 85 },
    battleDamage: {
      tier1Description: 'Trang phục kunoichi gọn gàng, dây xích Kusarigama gắn dao găm nano linh hoạt.',
      tier2Description: 'Xích sắt chấn động va đập làm rách giáp tay, các mắt xích phóng điện giật đối thủ.',
      tier3Description: 'Dây xích khóa chặt trung tâm bàn cờ, phong tỏa hoàn toàn đường tiến của kẻ địch.',
      battleVoiceLine: 'Bị xích trói rồi thì đừng mong thoát khỏi tầm mắt của tôi.'
    }
  },
  {
    id: 'VALK-27',
    name: 'Izanami',
    title: 'Hoàng Tuyền Minh Mẫu',
    faction: 'SOL_DYNASTY',
    role: 'BACKLINE_ENCHANTER',
    optimalSlot: 7,
    stats: { maxHp: 850, attack: 52, armor: 22, attackSpeed: 1.0, attackRange: 3, maxEnergy: 100 },
    ultimate: { name: 'Underworld Rebirth Domain', description: 'Tạo vùng đất Hoàng Tuyền 6s, đồng minh ngã xuống được hồi sinh lập tức với 40% HP (tối đa 1 lần/ván).', energyCost: 100, cooldownTicks: 150 },
    battleDamage: {
      tier1Description: 'Hoàng bào Minh Mẫu lộng lẫy thêu họa tiết âm phủ, gương soi linh hồn huyền bí.',
      tier2Description: 'Hoàng bào rách tưa từng mảnh theo chấn động chiến trường, sương cõi âm lan tỏa.',
      tier3Description: 'Linh hồn cổ xưa thức tỉnh, trao cho các chiến binh cơ hội thứ hai để lật ngược tình thế.',
      battleVoiceLine: 'Dưới sự che chở của Minh Mẫu, cái chết không phải là dấu chấm hết!'
    }
  }
];
