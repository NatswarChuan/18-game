import { ValkyrieDefinition } from '../types.js';

export const VALKYRIE_ROSTER: readonly ValkyrieDefinition[] = [
  // --- NEO-VALHALLA (VALK-01 to VALK-09) ---
  {
    id: 'VALK-01',
    name: 'Freyja',
    title: 'Ngọn Lửa Tiên Phong',
    faction: 'NEO_VALHALLA',
    role: 'FRONTLINE_BREAKER',
    optimalSlot: 1,
    stats: { maxHp: 1200, attack: 65, armor: 30, attackSpeed: 1.0, attackRange: 1, maxEnergy: 100 },
    ultimate: { name: 'Infernal Rupture', description: 'Nện đại kiếm plasma quét ngang hàng 1 kẻ địch, gây 250% sát thương nhiệt và giảm 40% giáp.', energyCost: 100, cooldownTicks: 100 },
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
    stats: { maxHp: 850, attack: 95, armor: 15, attackSpeed: 1.4, attackRange: 1, maxEnergy: 80 },
    ultimate: { name: 'Shadow Assassination', description: 'Dịch chuyển tức thời ra sau lưng mục tiêu yếu máu nhất, chém 3 nhát chí mạng gây 360% sát thương.', energyCost: 80, cooldownTicks: 90 },
    battleDamage: {
      tier1Description: 'Bộ đồ lặn tàng hình Nano bó sát cơ thể đường cong quyến rũ, đoản đao song nguyệt sắc lẹm.',
      tier2Description: 'Lớp vải nano tàng hình rách nát để lộ đôi vai trần và làn da ửng hồng trong khói lửa chiến tranh.',
      tier3Description: 'Trang phục rách tơi tả, mắt lóe sáng đỏ thẫm cuồng sát trong cơn hưng phấn cực điểm.',
      battleVoiceLine: 'Ngươi còn không nhận ra được lưỡi dao của ta từ hướng nào tới đâu...'
    }
  },
  {
    id: 'VALK-04',
    name: 'Kara',
    title: 'Bão Tố Phẫn Nộ',
    faction: 'NEO_VALHALLA',
    role: 'FRONTLINE_BERSERKER',
    optimalSlot: 2,
    stats: { maxHp: 1350, attack: 75, armor: 25, attackSpeed: 1.1, attackRange: 1, maxEnergy: 100 },
    ultimate: { name: 'Tempest Overdrive', description: 'Kích hoạt cơn thịnh nộ bão tố, tăng 60% tốc đánh và hồi máu 40% theo sát thương gây ra.', energyCost: 100, cooldownTicks: 110 },
    battleDamage: {
      tier1Description: 'Chiến giáp Valkyrie truyền thống pha lẫn công nghệ phản lực, rìu chiến đôi phát điện.',
      tier2Description: 'Dây đai da và giáp ngực nứt toác, mồ hôi ướt đẫm cơ thể cuộn trào sinh lực.',
      tier3Description: 'Giáp vỡ hoàn toàn chỉ còn tàn tích vải chiến đấu, đôi rìu xoay vòng bão sét hoang dại.',
      battleVoiceLine: 'Đau đớn này chỉ làm ta thêm phần phấn khích! Đập tan tất cả!'
    }
  },
  {
    id: 'VALK-05',
    name: 'Alvitr',
    title: 'Chân Lý Toàn Tri',
    faction: 'NEO_VALHALLA',
    role: 'MIDLINE_TACTICIAN',
    optimalSlot: 4,
    stats: { maxHp: 900, attack: 55, armor: 20, attackSpeed: 0.9, attackRange: 2, maxEnergy: 85 },
    ultimate: { name: 'Tactical Foresight', description: 'Giải mã ma trận kẻ địch, tăng 35% sát thương chí mạng cho toàn đội và làm chậm 30% đối thủ.', energyCost: 85, cooldownTicks: 100 },
    battleDamage: {
      tier1Description: 'Áo choàng học giả quân sự kết hợp kính hiển thị số liệu ba chiều tinh vi.',
      tier2Description: 'Áo sơ mi công nghệ rách cúc áo ngực, mái tóc xõa buông khi hệ thống tính toán quá tải.',
      tier3Description: 'Chiến phục tả tơi, cơ thể phát ra hào quang tính toán lượng tử đẹp mê hồn.',
      battleVoiceLine: 'Mọi đường đi nước bước của ngươi... ta đều đã phân tích thấu triệt!'
    }
  },
  {
    id: 'VALK-06',
    name: 'Mist',
    title: 'Xạ Thủ Màn Sương',
    faction: 'NEO_VALHALLA',
    role: 'BACKLINE_ARTILLERY',
    optimalSlot: 7,
    stats: { maxHp: 800, attack: 90, armor: 10, attackSpeed: 1.2, attackRange: 3, maxEnergy: 95 },
    ultimate: { name: 'Vaporizing Beam', description: 'Kích hoạt pháo xung kích hạng nặng bắn xuyên thẳng hàng dọc đối phương, thiêu rụi 320% sát thương.', energyCost: 95, cooldownTicks: 105 },
    battleDamage: {
      tier1Description: 'Bộ đồng phục thiện xạ ôm khít gợi cảm cùng súng bắn tỉa trường lực khổng lồ.',
      tier2Description: 'Vớ da chân xé rách và tà áo sau đứt bung vì độ giật cực lớn của pháo xung kích.',
      tier3Description: 'Vũ trang rách nát để lộ đường cong gợi tình, pháo tích tụ nguồn năng lượng hủy diệt.',
      battleVoiceLine: 'Ngắm bắn... Khóa mục tiêu... Bốc hơi đi cưng!'
    }
  },
  {
    id: 'VALK-07',
    name: 'Herja',
    title: 'Tia Sét Trừng Phạt',
    faction: 'NEO_VALHALLA',
    role: 'MIDLINE_SKIRMISHER',
    optimalSlot: 5,
    stats: { maxHp: 950, attack: 70, armor: 22, attackSpeed: 1.3, attackRange: 1, maxEnergy: 90 },
    ultimate: { name: 'Lightning Cascade', description: 'Phóng luồng điện cao thế nhảy chuyền qua 4 mục tiêu, gây choáng 1.5s và 220% sát thương lôi điện.', energyCost: 90, cooldownTicks: 95 },
    battleDamage: {
      tier1Description: 'Trang phục chiến binh lôi điện bó sát với đôi găng phóng sét sáng chói.',
      tier2Description: 'Ống tay áo cháy xém và vạt áo rách toạc lộ vòng eo thon quyến rũ.',
      tier3Description: 'Chiến giáp bốc khói hồ quang, đôi mắt sáng rực dòng điện áp cao đầy quyến rũ ma mị.',
      battleVoiceLine: 'Hồ quang điện thế này có làm tim ngươi đập nhanh hơn không?'
    }
  },
  {
    id: 'VALK-08',
    name: 'Rota',
    title: 'Bão Tố Hủy Diệt',
    faction: 'NEO_VALHALLA',
    role: 'BACKLINE_SORCERESS',
    optimalSlot: 6,
    stats: { maxHp: 780, attack: 85, armor: 12, attackSpeed: 0.9, attackRange: 3, maxEnergy: 100 },
    ultimate: { name: 'Maelstrom Genesis', description: 'Triệu hồi vòng xoáy bão táp trên toàn bộ bàn cờ kẻ thù, hất tung và gây 280% sát thương diện rộng.', energyCost: 100, cooldownTicks: 115 },
    battleDamage: {
      tier1Description: 'Váy dạ hội ma thuật công nghệ cao thướt tha, vương trượng lốc xoáy lấp lánh.',
      tier2Description: 'Váy rách tà xẻ sâu quyến rũ, luồng phong áp xoáy quanh làm bay tung mái tóc bạc.',
      tier3Description: 'Váy rách tả tơi ôm sát những đường nét bỏng mắt, pháp lực bão tố đạt đỉnh điểm cuồng phong.',
      battleVoiceLine: 'Hãy chìm sâu vào vòng xoáy hủy diệt ngút ngàn này!'
    }
  },
  {
    id: 'VALK-09',
    name: 'Gondul',
    title: 'Cây Gậy Thần Trượng',
    faction: 'NEO_VALHALLA',
    role: 'BACKLINE_ENCHANTER',
    optimalSlot: 8,
    stats: { maxHp: 820, attack: 45, armor: 18, attackSpeed: 1.0, attackRange: 2, maxEnergy: 75 },
    ultimate: { name: 'Valkyrie Hymn', description: 'Khúc ca thiên sứ hồi 350 máu cho toàn bộ đồng minh và ban lá chắn kháng hiệu ứng trong 4s.', energyCost: 75, cooldownTicks: 85 },
    battleDamage: {
      tier1Description: 'Lễ phục nữ tu công nghệ thanh khiết với đôi cánh cơ khí lấp lánh ánh hào quang.',
      tier2Description: 'Cánh cơ khí gãy một bên, tà váy trắng tinh khôi bị xé toạc làm lộ bờ vai và cặp đùi trắng ngần.',
      tier3Description: 'Y phục tan biến để lộ thân hình quyến rũ ngập tràn ánh sáng hồi sinh thánh thiện.',
      battleVoiceLine: 'Hỡi các chị em... Hãy đứng lên và nhận lấy phúc lành của ta!'
    }
  },

  // --- ABYSSAL EDEN (VALK-10 to VALK-18) ---
  {
    id: 'VALK-10',
    name: 'Eir',
    title: 'Dược Thảo Thủy Cung',
    faction: 'ABYSSAL_EDEN',
    role: 'BACKLINE_ENCHANTER',
    optimalSlot: 8,
    stats: { maxHp: 860, attack: 42, armor: 20, attackSpeed: 1.0, attackRange: 2, maxEnergy: 70 },
    ultimate: { name: 'Abyssal Regeneration', description: 'Phóng bào tử sinh học hồi phục liên tục 8% HP mỗi giây cho 2 đồng minh thấp máu nhất.', energyCost: 70, cooldownTicks: 80 },
    battleDamage: {
      tier1Description: 'Bộ váy sinh học công nghệ Eden màu xanh ngọc lam bóng mượt ôm trọn đường nét cơ thể.',
      tier2Description: 'Lớp màng sinh học rách rưới để lộ cơ thể ửng đỏ vì nhiệt độ nước biển sâu gia tăng.',
      tier3Description: 'Vũ phục biến thành các sợi dây sinh học quấn lỏng lẻo quanh cơ thể mê hoặc.',
      battleVoiceLine: 'Dòng nước sâu thẳm sẽ chữa lành mọi vết thương... Đừng sợ hãi.'
    }
  },
  {
    id: 'VALK-11',
    name: 'Geiravor',
    title: 'Mũi Thương Vực Sâu',
    faction: 'ABYSSAL_EDEN',
    role: 'FRONTLINE_BREAKER',
    optimalSlot: 1,
    stats: { maxHp: 1250, attack: 68, armor: 28, attackSpeed: 1.05, attackRange: 1, maxEnergy: 95 },
    ultimate: { name: 'Tidal Impalement', description: 'Đâm mũi thương áp lực nước xuyên phá hàng trước, gây 270% sát thương và hất lui kẻ địch.', energyCost: 95, cooldownTicks: 100 },
    battleDamage: {
      tier1Description: 'Bộ giáp thủy sinh Eden màu xanh lục bảo lấp lánh như vảy rồng biển sâu.',
      tier2Description: 'Vảy giáp nứt toác, phần áo ngực rách hở để lộ bầu ngực căng tràn nhựa sống.',
      tier3Description: 'Giáp vỡ nát hoàn toàn, thủy lực bùng nổ quanh cơ thể ướt át gợi cảm khôn cùng.',
      battleVoiceLine: 'Ngọn thương này mang sức nặng của cả đại dương ngàn dặm!'
    }
  },
  {
    id: 'VALK-12',
    name: 'Hlokk',
    title: 'Xích Sắt Giam Cầm',
    faction: 'ABYSSAL_EDEN',
    role: 'MIDLINE_INFILTRATOR',
    optimalSlot: 5,
    stats: { maxHp: 920, attack: 88, armor: 18, attackSpeed: 1.35, attackRange: 1, maxEnergy: 85 },
    ultimate: { name: 'Chains of Agony', description: 'Phóng xích gai nano trói chặt mục tiêu gây choáng 2.5s và rút 40 năng lượng chuyển cho bản thân.', energyCost: 85, cooldownTicks: 90 },
    battleDamage: {
      tier1Description: 'Trang phục da bó sát màu đen tuyền kết hợp xích gai công nghệ Eden bí ẩn quyến rũ.',
      tier2Description: 'Dây da đứt gãy, xích gai quấn quanh đùi tứa máu nhẹ trong tư thế khêu gợi đầy nguy hiểm.',
      tier3Description: 'Trang phục rách toạc từng mảng lớn, ánh mắt đắm chìm trong khoái cảm trừng phạt tột cùng.',
      battleVoiceLine: 'Muốn thoát khỏi xiềng xích của ta ư? Hãy cầu xin ta đi nào...'
    }
  },
  {
    id: 'VALK-13',
    name: 'Herfjotur',
    title: 'Kẻ Trói Buộc Linh Hồn',
    faction: 'ABYSSAL_EDEN',
    role: 'FRONTLINE_VANGUARD',
    optimalSlot: 0,
    stats: { maxHp: 1600, attack: 35, armor: 55, attackSpeed: 0.75, attackRange: 1, maxEnergy: 90 },
    ultimate: { name: 'Soul Bastion', description: 'Tạo tường thành linh hồn hấp thụ tới 800 sát thương và phản lại 30% sát thương nhận vào.', energyCost: 90, cooldownTicks: 110 },
    battleDamage: {
      tier1Description: 'Bộ giáp trọng giáp vỏ sò sinh học dày đặc bảo vệ kiên cố tuyệt đối.',
      tier2Description: 'Mặt khiên nứt vỡ, phần giáp hông và eo bị cào rách lộ làn da trắng muốt.',
      tier3Description: 'Vỏ sò sinh học vỡ vụn, lõi năng lượng phát sáng rực rỡ bảo vệ chủ nhân đến hơi thở cuối.',
      battleVoiceLine: 'Các đòn đánh của ngươi... chỉ như gãi ngứa mà thôi!'
    }
  },
  {
    id: 'VALK-14',
    name: 'Hrund',
    title: 'Gai Nhọn Độc Tố',
    faction: 'ABYSSAL_EDEN',
    role: 'MIDLINE_SKIRMISHER',
    optimalSlot: 3,
    stats: { maxHp: 980, attack: 72, armor: 22, attackSpeed: 1.25, attackRange: 1, maxEnergy: 85 },
    ultimate: { name: 'Venomous Spikes', description: 'Phun mưa gai độc nano gây nhiễm độc toàn hàng đối thủ, rút 6% HP tối đa mỗi giây trong 5s.', energyCost: 85, cooldownTicks: 95 },
    battleDamage: {
      tier1Description: 'Chiến phục gai độc sinh học màu tím thẫm ôm khít tôn vinh vóc dáng săn chắc.',
      tier2Description: 'Gai nhọn gãy vụn làm rách toạc áo chiến đấu, dịch độc tím phát sáng quanh vết rách gợi tình.',
      tier3Description: 'Áo giáp tan rã trong dịch độc, cơ thể phát ra hương thơm quyến rũ chết người.',
      battleVoiceLine: 'Độc dược của ta ngọt ngào lắm... uống cạn đi nào!'
    }
  },
  {
    id: 'VALK-15',
    name: 'Geirahod',
    title: 'Phóng Lao Sấm Sét',
    faction: 'ABYSSAL_EDEN',
    role: 'BACKLINE_ARTILLERY',
    optimalSlot: 6,
    stats: { maxHp: 810, attack: 92, armor: 12, attackSpeed: 1.15, attackRange: 3, maxEnergy: 90 },
    ultimate: { name: 'Harpoon Barrage', description: 'Phóng liên tiếp 3 ngọn lao thủy lôi xuyên thủng hàng sau địch, gây 330% sát thương diện rộng.', energyCost: 90, cooldownTicks: 100 },
    battleDamage: {
      tier1Description: 'Đồng phục thợ săn biển sâu ngắn cũn cỡn khoe đôi chân dài miên man và bệ phóng lao khổng lồ.',
      tier2Description: 'Vạt áo rách toạc để lộ eo thon và hông nở nang khi liên tục vận hành bệ phóng lao nặng.',
      tier3Description: 'Y phục tơi tả bay trong gió biển, lao tích tụ áp lực sấm sét đại dương dữ dội.',
      battleVoiceLine: 'Ngọn lao này sẽ ghim chặt ngươi xuống đáy vực sâu thẳm!'
    }
  },
  {
    id: 'VALK-16',
    name: 'Skuld',
    title: 'Tiên Tri Định Mệnh',
    faction: 'ABYSSAL_EDEN',
    role: 'MIDLINE_TACTICIAN',
    optimalSlot: 4,
    stats: { maxHp: 890, attack: 60, armor: 24, attackSpeed: 0.95, attackRange: 2, maxEnergy: 85 },
    ultimate: { name: 'Destiny Alteration', description: 'Bẻ cong dòng thời gian, đảo ngược 50% sát thương nhận vào trong 3s thành hồi máu.', energyCost: 85, cooldownTicks: 105 },
    battleDamage: {
      tier1Description: 'Áo choàng gấm nhung Eden sang trọng thêu chỉ vàng phát quang cổ ngữ bí thuật.',
      tier2Description: 'Áo choàng rách vụn để lộ yếm lụa mỏng manh ép sát lồng ngực phập phồng hồi hộp.',
      tier3Description: 'Lụa mỏng tơi bời, chuỗi vòng cổ phát sáng rực rỡ hé lộ chân dung nữ thần định mệnh tuyệt sắc.',
      battleVoiceLine: 'Tương lai của ngươi... đã được ta định đoạt từ trước rồi!'
    }
  },
  {
    id: 'VALK-17',
    name: 'Radgrid',
    title: 'Sóng Thần Thao Túng',
    faction: 'ABYSSAL_EDEN',
    role: 'BACKLINE_SORCERESS',
    optimalSlot: 7,
    stats: { maxHp: 790, attack: 86, armor: 14, attackSpeed: 0.9, attackRange: 3, maxEnergy: 100 },
    ultimate: { name: 'Tsunami Cataclysm', description: 'Cuộn trào sóng thần khổng lồ nhấn chìm toàn bộ chiến trường đối thủ, giảm 50% tốc đánh trong 6s.', energyCost: 100, cooldownTicks: 120 },
    battleDamage: {
      tier1Description: 'Váy dạ yến lụa nước bồng bềnh như sóng đại dương, tay cầm quả cầu thủy tinh đại dương.',
      tier2Description: 'Váy ướt sũng dính chặt vào da thịt phô diễn từng đường cong nghẹt thở.',
      tier3Description: 'Váy rách tả tơi nổi bồng bềnh trên mặt nước ma thuật, sóng thần dâng cao nghìn trượng.',
      battleVoiceLine: 'Cơn thịnh nộ của biển cả sẽ cuốn trôi tất cả những kẻ ngạo mạn!'
    }
  },
  {
    id: 'VALK-18',
    name: 'Svipul',
    title: 'Cuồng Nộ Thủy Quái',
    faction: 'ABYSSAL_EDEN',
    role: 'FRONTLINE_BERSERKER',
    optimalSlot: 2,
    stats: { maxHp: 1400, attack: 74, armor: 26, attackSpeed: 1.1, attackRange: 1, maxEnergy: 95 },
    ultimate: { name: 'Leviathan Rampage', description: 'Hóa thân thủy quái Leviathan cắn xé liên hoàn hàng trước đối phương, gây 300% sát thương xé rách.', energyCost: 95, cooldownTicks: 105 },
    battleDamage: {
      tier1Description: 'Chiến giáp móng vuốt quái vật biển sâu gai góc đầy uy lực hung tợn.',
      tier2Description: 'Giáp ngực nứt toác để lộ lồng ngực thở dốc và móng vuốt nhuốm máu chiến trường.',
      tier3Description: 'Giáp nát vụn hoàn toàn, cơ thể bừng cháy bản năng hoang dại quyến rũ đến rợn ngườ.',
      battleVoiceLine: 'Hương vị của máu... Thật là ngọt ngào làm sao!'
    }
  },

  // --- SOL DYNASTY (VALK-19 to VALK-27) ---
  {
    id: 'VALK-19',
    name: 'Thrud',
    title: 'Sức Mạnh Thái Dương',
    faction: 'SOL_DYNASTY',
    role: 'FRONTLINE_BREAKER',
    optimalSlot: 1,
    stats: { maxHp: 1300, attack: 72, armor: 32, attackSpeed: 0.95, attackRange: 1, maxEnergy: 100 },
    ultimate: { name: 'Solar Smite', description: 'Vung chiến chùy mặt trời giáng xuống hàng đầu đối phương, gây 280% sát thương quang học và choáng 2s.', energyCost: 100, cooldownTicks: 105 },
    battleDamage: {
      tier1Description: 'Giáp vàng ròng phong cách hoàng gia Sol Dynasty uy nghiêm tráng lệ.',
      tier2Description: 'Áo giáp nứt toác từng mảng để lộ cơ bụng số 11 săn chắc và vòng một bốc lửa.',
      tier3Description: 'Giáp vàng nóng chảy rực rỡ, ánh quang tỏa ra từ làn da rám nắng tuyệt mỹ.',
      battleVoiceLine: 'Ánh dương rực rỡ này sẽ thiêu rụi bóng tối của các ngươi!'
    }
  },
  {
    id: 'VALK-20',
    name: 'Randgrid',
    title: 'Bức Tường Hoàng Kim',
    faction: 'SOL_DYNASTY',
    role: 'FRONTLINE_VANGUARD',
    optimalSlot: 0,
    stats: { maxHp: 1550, attack: 38, armor: 52, attackSpeed: 0.8, attackRange: 1, maxEnergy: 90 },
    ultimate: { name: 'Golden Bulwark', description: 'Dựng tường thành ánh sáng tăng 60 giáp cho toàn bộ đồng đội trong 5s.', energyCost: 90, cooldownTicks: 110 },
    battleDamage: {
      tier1Description: 'Đại khiên hoàng kim hình mặt trời chói lọi và giáp trụ vệ binh tinh nhuệ.',
      tier2Description: 'Khiên rạn nứt vì va chạm cực mạnh, giáp vai rách rời khoe bờ vai thon nuột nà.',
      tier3Description: 'Khiên tan vỡ thành nghìn mảnh vàng, trường năng lượng hộ thân phát sáng cực độ.',
      battleVoiceLine: 'Danh dự của vương triều sẽ không bao giờ bị vấy bẩn!'
    }
  },
  {
    id: 'VALK-21',
    name: 'Skogul',
    title: 'Vũ Điệu Lửa Thiêng',
    faction: 'SOL_DYNASTY',
    role: 'MIDLINE_INFILTRATOR',
    optimalSlot: 3,
    stats: { maxHp: 870, attack: 96, armor: 16, attackSpeed: 1.4, attackRange: 1, maxEnergy: 80 },
    ultimate: { name: 'Inferno Dance', description: 'Múa song kiếm hỏa diệm xoay vòng quanh đối thủ, gây 350% sát thương thiêu đốt liên tục.', energyCost: 80, cooldownTicks: 90 },
    battleDamage: {
      tier1Description: 'Xường xám cách tân công nghệ xẻ tà cao màu đỏ rực lửa khoe trọn cặp đùi mật ong quyến rũ.',
      tier2Description: 'Vạt xường xám cháy xém rách toạc tới tận hông, từng giọt mồ hôi lăn dài trên thềm ngực phập phồng.',
      tier3Description: 'Xường xám cháy rụi chỉ còn những dải lụa lửa quấn hờ hững quanh thân hình bốc lửa ngút ngàn.',
      battleVoiceLine: 'Cùng nhảy múa trong biển lửa rực rỡ này với ta nào!'
    }
  },
  {
    id: 'VALK-22',
    name: 'Hildr',
    title: 'Chiến Tranh Vô Tận',
    faction: 'SOL_DYNASTY',
    role: 'FRONTLINE_BERSERKER',
    optimalSlot: 2,
    stats: { maxHp: 1380, attack: 76, armor: 26, attackSpeed: 1.15, attackRange: 1, maxEnergy: 95 },
    ultimate: { name: 'Eternal War-Cry', description: 'Tiếng thét xung trận tăng 40% công kích và bất tử trong 2.5s khi máu dưới 20%.', energyCost: 95, cooldownTicks: 115 },
    battleDamage: {
      tier1Description: 'Chiến bào nữ tướng Sol Dynasty với áo choàng đỏ thắm và trường đao sắc bén.',
      tier2Description: 'Áo choàng tưa rách, áo giáp trước ngực vỡ vụn để lộ làn da mịn màng thấm mồ hôi chiến đấu.',
      tier3Description: 'Chiến bào nát tươm, ánh mắt rực lửa chiến binh kiêu hãnh bất phục.',
      battleVoiceLine: 'Chiến tranh là sinh mệnh của ta... Chừng nào ta còn thở, các ngươi đừng mong chiến thắng!'
    }
  },
  {
    id: 'VALK-23',
    name: 'Olrun',
    title: 'Mật Mã Tối Thượng',
    faction: 'SOL_DYNASTY',
    role: 'MIDLINE_TACTICIAN',
    optimalSlot: 4,
    stats: { maxHp: 910, attack: 58, armor: 22, attackSpeed: 1.0, attackRange: 2, maxEnergy: 85 },
    ultimate: { name: 'Cipher Overload', description: 'Gây nhiễu mã độc vào hệ thống địch, khóa không cho đối phương dùng Tuyệt Kỹ trong 4s.', energyCost: 85, cooldownTicks: 100 },
    battleDamage: {
      tier1Description: 'Trang phục nữ tình báo công nghệ cao với áo khoác da dài và kính phân tích dữ liệu.',
      tier2Description: 'Áo khoác da bị xé toạc, áo sơ mi bên trong đứt cúc hé lộ khe ngực đầy đặn mê hoặc.',
      tier3Description: 'Trang phục rách tan tành, các dòng mã số vàng kim chạy dọc trên làn da nõn nà quyến rũ.',
      battleVoiceLine: 'Hệ thống phòng thủ của các ngươi đã hoàn toàn bị ta vô hiệu hóa!'
    }
  },
  {
    id: 'VALK-24',
    name: 'Kára',
    title: 'Cung Tên Nhật Nguyệt',
    faction: 'SOL_DYNASTY',
    role: 'BACKLINE_ARTILLERY',
    optimalSlot: 7,
    stats: { maxHp: 820, attack: 94, armor: 12, attackSpeed: 1.2, attackRange: 3, maxEnergy: 90 },
    ultimate: { name: 'Supernova Volley', description: 'Bắn loạt mũi tên ánh sáng mặt trời rơi từ trên trời xuống, gây 340% sát thương toàn bộ hàng sau.', energyCost: 90, cooldownTicks: 100 },
    battleDamage: {
      tier1Description: 'Trang phục cung thủ hoàng gia duyên dáng với cánh cung ánh sáng mặt trời rực rỡ.',
      tier2Description: 'Ống tay áo và vớ dài xé rách để lộ bờ vai trần và đôi chân thon thả.',
      tier3Description: 'Chiến y rách nát để lộ thân hình thiếu nữ thanh xuân tràn trề nhựa sống, cung ánh sáng căng cực hạn.',
      battleVoiceLine: 'Mũi tên này mang sức nóng của một triệu mặt trời!'
    }
  },
  {
    id: 'VALK-25',
    name: 'Sanngridr',
    title: 'Lưỡi Kiếm Công Lý',
    faction: 'SOL_DYNASTY',
    role: 'MIDLINE_SKIRMISHER',
    optimalSlot: 5,
    stats: { maxHp: 960, attack: 74, armor: 24, attackSpeed: 1.3, attackRange: 1, maxEnergy: 85 },
    ultimate: { name: 'Judgment Flash', description: 'Lướt chém xuyên qua đội hình đối phương, gây 240% sát thương chuẩn bỏ qua toàn bộ giáp.', energyCost: 85, cooldownTicks: 90 },
    battleDamage: {
      tier1Description: 'Bộ lễ phục kiếm sĩ hoàng kim với tà áo thướt tha và thanh kiếm sắc bén như gương.',
      tier2Description: 'Tà áo bị chém rách để lộ vòng eo con kiến và cặp mông tròn trịa quyến rũ.',
      tier3Description: 'Chiến phục rách tả tơi ôm sát những đường cong bỏng rát, kiếm quang lóe sáng công lý tuyệt đối.',
      battleVoiceLine: 'Thanh kiếm công lý này không bao giờ chùn bước trước kẻ thù!'
    }
  },
  {
    id: 'VALK-26',
    name: 'Reginleif',
    title: 'Mặt Trời Bất Diệt',
    faction: 'SOL_DYNASTY',
    role: 'BACKLINE_SORCERESS',
    optimalSlot: 6,
    stats: { maxHp: 790, attack: 88, armor: 14, attackSpeed: 0.95, attackRange: 3, maxEnergy: 100 },
    ultimate: { name: 'Solar Corona', description: 'Thả quả cầu lửa mặt trời thiêu đốt chiến trường, gây 290% sát thương và giảm 30% giáp kẻ địch trong 6s.', energyCost: 100, cooldownTicks: 110 },
    battleDamage: {
      tier1Description: 'Áo choàng pháp sư thái dương dệt bằng sợi quang học vàng rực rỡ quý phái.',
      tier2Description: 'Áo choàng đứt bung, yếm ngực lụa vàng mỏng dính sát vào cơ thể đẫm mồ hôi nồng nàn.',
      tier3Description: 'Áo choàng biến thành những vệt hào quang vàng óng che hờ thân thể tuyệt mỹ.',
      battleVoiceLine: 'Hãy cúi đầu trước ánh sáng vinh quang của vương triều Sol!'
    }
  },
  {
    id: 'VALK-27',
    name: 'Svafa',
    title: 'Ân Sủng Hoàng Gia',
    faction: 'SOL_DYNASTY',
    role: 'BACKLINE_ENCHANTER',
    optimalSlot: 8,
    stats: { maxHp: 840, attack: 44, armor: 20, attackSpeed: 1.05, attackRange: 2, maxEnergy: 75 },
    ultimate: { name: 'Imperial Blessing', description: 'Ban ân sủng hoàng gia tăng 30% công kích và hồi 40 năng lượng cho đồng minh có công kích cao nhất.', energyCost: 75, cooldownTicks: 85 },
    battleDamage: {
      tier1Description: 'Bộ đầm công chúa Sol Dynasty yêu kiều với vương miện ngọc bích và quyền trượng ánh sáng.',
      tier2Description: 'Đầm dạ hội bị rách tà áo lộ đôi chân ngọc ngà và vòng một căng mọng kiều diễm.',
      tier3Description: 'Đầm lộng lẫy tả tơi bay theo làn gió quang năng, toát lên vẻ quyến rũ thần thánh không thể xâm phạm.',
      battleVoiceLine: 'Chiến thắng này xin dành tặng cho những chiến binh dũng cảm nhất!'
    }
  }
];

export function getValkyrieById(id: string): ValkyrieDefinition | undefined {
  return VALKYRIE_ROSTER.find((v) => v.id === id);
}
