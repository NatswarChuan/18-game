import { ValkyrieDefinition } from './valkyrie-types.js';

/**
 * Abyssal Eden Faction Valkyrie Roster (VALK-10 to VALK-18).
 */
export const EDEN_ROSTER: readonly ValkyrieDefinition[] = [
  {
    id: 'VALK-10',
    name: 'Lilith',
    title: 'Nữ Vương Vực Thẳm',
    faction: 'ABYSSAL_EDEN',
    role: 'FRONTLINE_BREAKER',
    optimalSlot: 1,
    stats: { maxHp: 1250, attack: 60, armor: 32, attackSpeed: 1.1, attackRange: 1, maxEnergy: 100 },
    ultimate: { name: 'Pleasure & Torment Whip', description: 'Quất roi gai trói chặt 2 kẻ địch hàng đầu, hút 20% HP tối đa của chúng hồi máu cho bản thân.', energyCost: 100, cooldownTicks: 100 },
    battleDamage: {
      tier1Description: 'Chiến phục da Gothic ma quái đính đinh tán kim loại, roi gai hạt nhân phát sáng tím.',
      tier2Description: 'Trang phục rách vỡ để lộ những vết khắc ma thuật vực thẳm bùng cháy.',
      tier3Description: 'Năng lượng bóng đêm bùng phát cực đại, roi gai biến hình thành lưỡi hái năng lượng hút hồn.',
      battleVoiceLine: 'Đau đớn chính là món quà tuyệt vời nhất mà Vực Thẳm dành cho ngươi!'
    }
  },
  {
    id: 'VALK-11',
    name: 'Carmilla',
    title: 'Huyết Ma Đao Thủ',
    faction: 'ABYSSAL_EDEN',
    role: 'FRONTLINE_VANGUARD',
    optimalSlot: 0,
    stats: { maxHp: 1350, attack: 55, armor: 38, attackSpeed: 1.0, attackRange: 1, maxEnergy: 85 },
    ultimate: { name: 'Crimson Feast', description: 'Giải phóng sóng huyết kiếm gây sát thương chuẩn và nhận 100% hút máu trong 6s.', energyCost: 85, cooldownTicks: 100 },
    battleDamage: {
      tier1Description: 'Lễ phục chiến binh huyết sắc ma mị, đôi liềm huyết đao khổng lồ nhuốm màu đỏ thẫm.',
      tier2Description: 'Áo giáp nứt toạc dưới đòn công phá, dòng năng lượng đỏ rực chảy dọc theo lưỡi đao.',
      tier3Description: 'Huyết khí sôi trào toàn thân, đòn tấn công hút sinh lực chuyển hóa thành giáp bảo vệ.',
      battleVoiceLine: 'Mùi vị của chiến trường này... thật là kích thích!'
    }
  },
  {
    id: 'VALK-12',
    name: 'Morgana',
    title: 'Xà Nữ Độc Dược',
    faction: 'ABYSSAL_EDEN',
    role: 'MIDLINE_INFILTRATOR',
    optimalSlot: 3,
    stats: { maxHp: 880, attack: 80, armor: 16, attackSpeed: 1.5, attackRange: 1, maxEnergy: 80 },
    ultimate: { name: 'Venomous Kiss of Death', description: 'Phóng nọc độc tê liệt mục tiêu 3s và gây sát thương độc tố theo thời gian bằng 15% HP.', energyCost: 80, cooldownTicks: 90 },
    battleDamage: {
      tier1Description: 'Bộ giáp vảy rắn phát quang công nghệ nano ôm sát, móng vuốt độc sắc lẹm.',
      tier2Description: 'Lớp vảy bong tróc do đạn bắn, nọc độc xanh lục bốc hơi tỏa khói nguy hiểm.',
      tier3Description: 'Khí độc bao bọc toàn thân, móng vuốt biến đổi sang dạng acid xuyên thủng mọi lớp giáp.',
      battleVoiceLine: 'Một giọt nọc độc này là quá đủ để kết thúc trò chơi.'
    }
  },
  {
    id: 'VALK-13',
    name: 'Hela',
    title: 'Phán Quan Tử Linh',
    faction: 'ABYSSAL_EDEN',
    role: 'BACKLINE_SORCERESS',
    optimalSlot: 6,
    stats: { maxHp: 800, attack: 92, armor: 14, attackSpeed: 1.0, attackRange: 3, maxEnergy: 105 },
    ultimate: { name: 'Soul Harvest Requiem', description: 'Quét lưỡi hái tử thần, lập tức kết liễu mục tiêu có HP < 15% và hồi 50 năng lượng.', energyCost: 105, cooldownTicks: 120 },
    battleDamage: {
      tier1Description: 'Áo choàng ma quái màu tro tàn với vương miện xương, lưỡi hái tử thần đen tuyền.',
      tier2Description: 'Áo choàng rách đôi lộ hoa văn cổ ngữ linh hồn phát sáng u uất.',
      tier3Description: 'Lưỡi hái vỡ vụn linh hồn giải phóng làn sóng hắc ám kết liễu kẻ thù.',
      battleVoiceLine: 'Bản án tử đã được tuyên, không ai có thể trốn chạy.'
    }
  },
  {
    id: 'VALK-14',
    name: 'Nyx',
    title: 'Ảo Ảnh Vô Tận',
    faction: 'ABYSSAL_EDEN',
    role: 'MIDLINE_SKIRMISHER',
    optimalSlot: 4,
    stats: { maxHp: 920, attack: 75, armor: 22, attackSpeed: 1.3, attackRange: 2, maxEnergy: 85 },
    ultimate: { name: 'Shadow Clone Mirage', description: 'Tạo 2 phân thân thừa hưởng 50% chỉ số tấn công quấy nhiễu trận địa trong 8s.', energyCost: 85, cooldownTicks: 110 },
    battleDamage: {
      tier1Description: 'Chiến phục ninja bóng đêm cách tân, phi tiêu hắc ám xoay quanh cổ tay.',
      tier2Description: 'Mặt nạ và áo giáp nứt vỡ, ảo ảnh bóng đêm bắt đầu chập chờn phân tách.',
      tier3Description: 'Hòa mình hoàn toàn vào bóng tối, các phân thân lao vào tấn công liên tục.',
      battleVoiceLine: 'Ngươi nghĩ đòn đánh đó trúng vào ta thật sao?'
    }
  },
  {
    id: 'VALK-15',
    name: 'Selene',
    title: 'Nữ Thần Trăng Khuyết',
    faction: 'ABYSSAL_EDEN',
    role: 'BACKLINE_ENCHANTER',
    optimalSlot: 8,
    stats: { maxHp: 840, attack: 45, armor: 20, attackSpeed: 1.0, attackRange: 3, maxEnergy: 90 },
    ultimate: { name: 'Moonlight Slumber', description: 'Gảy đàn ru ngủ toàn bộ đối thủ trong 2s, ngăn chặn mọi hành động tấn công và dùng chiêu.', energyCost: 90, cooldownTicks: 130 },
    battleDamage: {
      tier1Description: 'Lụa ánh trăng nước mềm mại, cây đàn hạc nguyệt quang lấp lánh bụi sao.',
      tier2Description: 'Dải lụa bị xé rách, âm thanh đàn hạc chuyển sang giai điệu bi tráng thôi miên.',
      tier3Description: 'Ánh trăng bạc phủ sáng khắp sàn đấu, khúc ru tử thần ru ngủ toàn bộ chiến trường.',
      battleVoiceLine: 'Hãy chìm vào giấc ngủ vĩnh hằng dưới ánh trăng dịu êm này.'
    }
  },
  {
    id: 'VALK-16',
    name: 'Tiamat',
    title: 'Mẫu Thần Hỗn Mang',
    faction: 'ABYSSAL_EDEN',
    role: 'FRONTLINE_BERSERKER',
    optimalSlot: 2,
    stats: { maxHp: 1400, attack: 65, armor: 28, attackSpeed: 0.9, attackRange: 1, maxEnergy: 95 },
    ultimate: { name: 'Abyssal Tsunami Crush', description: 'Đập chùy tạo sóng thần hất lùi đối phương 1 ô và làm choáng diện rộng.', energyCost: 95, cooldownTicks: 110 },
    battleDamage: {
      tier1Description: 'Giáp vảy rồng biển sâu uy nghi màu chàm, đại chùy gai Biển Sâu sừng sững.',
      tier2Description: 'Phiến vảy rồng nứt toác, bọt biển và sóng xung kích bốc hơi ầm ầm.',
      tier3Description: 'Sức mạnh nguyên thủy đại dương bùng nổ, chùy gai vung ra cuốn phăng chướng ngại.',
      battleVoiceLine: 'Sóng thần của Mẫu Thần sẽ nghiền nát tất cả những kẻ cản đường!'
    }
  },
  {
    id: 'VALK-17',
    name: 'Pandora',
    title: 'Hộp Tai Ương Công Nghệ',
    faction: 'ABYSSAL_EDEN',
    role: 'BACKLINE_ARTILLERY',
    optimalSlot: 7,
    stats: { maxHp: 810, attack: 88, armor: 15, attackSpeed: 1.1, attackRange: 3, maxEnergy: 100 },
    ultimate: { name: 'Cataclysmic Box Unleashed', description: 'Mở rương nano phóng hàng loạt tên lửa mini tầm nhiệt bắn phá ngẫu nhiên toàn bộ đối thủ.', energyCost: 100, cooldownTicks: 120 },
    battleDamage: {
      tier1Description: 'Đồ bay chiến thuật liền thân phong cách phi công Cyberpunk, rương nano Pandora gọn gàng.',
      tier2Description: 'Vỏ rương quá tải bung chốt khói mịt mù, dàn phóng tên lửa mở rộng gấp đôi.',
      tier3Description: 'Rương mở khóa toàn bộ kho đạn cấm, cơn bão hỏa tiễn dội xuống không thương tiếc.',
      battleVoiceLine: 'Chiếc hộp này mở ra... đồng nghĩa với ngày tàn của các ngươi!'
    }
  },
  {
    id: 'VALK-18',
    name: 'Medusa',
    title: 'Ánh Mắt Hóa Đá',
    faction: 'ABYSSAL_EDEN',
    role: 'MIDLINE_TACTICIAN',
    optimalSlot: 5,
    stats: { maxHp: 930, attack: 58, armor: 24, attackSpeed: 1.0, attackRange: 2, maxEnergy: 85 },
    ultimate: { name: 'Petrifying Gaze Overdrive', description: 'Tháo kính phát luồng sáng hóa đá làm cứng đờ kẻ địch trong 2.5s và giảm 60% tốc độ chạy.', energyCost: 85, cooldownTicks: 100 },
    battleDamage: {
      tier1Description: 'Trang phục sợi carbon đen tuyền, kính bảo hộ công nghệ cao, tóc cáp quang xanh neon.',
      tier2Description: 'Kính bảo hộ rạn nứt phát ra các xung ánh sáng chói lòa nguy hiểm.',
      tier3Description: 'Kính vỡ hoàn toàn, ánh nhìn hóa đá trực tiếp biến đối thủ thành tượng đá.',
      battleVoiceLine: 'Đừng nhìn thẳng vào ta... nếu ngươi không muốn hóa thành tro đá!'
    }
  }
];
