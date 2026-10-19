/**
 * Valkyrie entities and full roster for Valkyrie Protocol: Zero (16+ Edition).
 * Thực thể Valkyrie và danh sách 27 nữ chiến binh.
 */

export type FactionId = 'NEO_VALHALLA' | 'ABYSSAL_EDEN' | 'SOL_DYNASTY';

export type TacticalRole =
  | 'FRONTLINE_BREAKER'
  | 'FRONTLINE_VANGUARD'
  | 'FRONTLINE_BERSERKER'
  | 'MIDLINE_INFILTRATOR'
  | 'MIDLINE_TACTICIAN'
  | 'MIDLINE_SKIRMISHER'
  | 'BACKLINE_ARTILLERY'
  | 'BACKLINE_SORCERESS'
  | 'BACKLINE_ENCHANTER';

export interface ValkyrieStats {
  readonly maxHp: number;
  readonly attack: number;
  readonly armor: number;
  readonly attackSpeed: number; // Attacks per second
  readonly attackRange: number; // 1 = Melee, 2 = Mid, 3 = Long
  readonly maxEnergy: number; // 80 - 110
}

export interface ValkyrieUltimate {
  readonly name: string;
  readonly description: string;
  readonly energyCost: number;
  readonly cooldownTicks: number;
}

export interface ValkyrieBattleDamageMeta {
  readonly tier1Description: string; // Pristine
  readonly tier2Description: string; // Battle-Torn
  readonly tier3Description: string; // Critical Burst / Overdrive
  readonly battleVoiceLine: string;
}

export interface ValkyrieDefinition {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly faction: FactionId;
  readonly role: TacticalRole;
  readonly optimalSlot: number; // 0..8
  readonly stats: ValkyrieStats;
  readonly ultimate: ValkyrieUltimate;
  readonly battleDamage: ValkyrieBattleDamageMeta;
}

export const VALKYRIE_ROSTER: readonly ValkyrieDefinition[] = [
  // --- NEO-VALHALLA (1 to 9) ---
  {
    id: 'VALK-01',
    name: 'Freyja',
    title: 'Ngọn Lửa Tiên Phong',
    faction: 'NEO_VALHALLA',
    role: 'FRONTLINE_BREAKER',
    optimalSlot: 1, // Row 1, Center (0-indexed slot 1)
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
  },

  // --- ABYSSAL EDEN (10 to 18) ---
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
  },

  // --- SOL-DYNASTY (19 to 27) ---
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

/**
 * Lookup Valkyrie by ID.
 * Tìm kiếm Valkyrie theo mã định danh.
 */
export function getValkyrieById(id: string): ValkyrieDefinition | undefined {
  return VALKYRIE_ROSTER.find((v) => v.id === id);
}
