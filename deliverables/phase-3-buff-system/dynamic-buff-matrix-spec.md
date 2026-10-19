# 📜 ĐẶC TẢ HỆ SINH THÁI TỐI THIỂU 243 BUFFS (N ≥ 243) & CƠ CHẾ SINH 9 BUFF DỰA 100% VÀO LỊCH SỬ LỰA CHỌN
*(Phase 3 Deliverable • Thiết lập bởi `buff-systems-designer` • Căn cứ triển khai cho `backend-engineer` & `frontend-engineer`)*

---

## 🌸 1. TRIẾT LÝ THIẾT KẾ: TIẾN HÓA TỰ NHIÊN DỰA TRÊN LỊCH SỬ (100% HISTORY-DRIVEN EVOLUTION)

Nhằm đảm bảo tính công bằng toán học và chiều sâu chiến thuật cực hạn của *Valkyrie Protocol: Zero*, hệ thống Buff tuân thủ **nguyên tắc tiến hóa thuần túy dựa trên các buff đã chọn từ trước**:

> [!IMPORTANT]
> **NGUYÊN TẮC BẤT DI BẤT DỊCH (CORE PARADIGM):**
> 1. **QUY MÔ TỐI THIỂU 243 BUFFS (N ≥ 243, KHÔNG CỐ ĐỊNH TRẦN):** Con số 243 Buffs ($3^5 = 243$) là **ngưỡng tối thiểu bắt buộc (Floor Constraint)** nhằm đảm bảo độ sâu tổ hợp. Hệ thống được kiến trúc mở theo mô hình Vector DB, cho phép mở rộng không giới hạn (300+, 500+ buffs thông qua các bản cập nhật/DLC) mà không làm thay đổi giải thuật cốt lõi.
> 2. **KHÔNG PHÂN CHIA CỨNG THEO ROUND:** Hệ thống tuyệt đối KHÔNG kiểm tra hay phân chia cứng biến `currentRound` (như "Round 1 chỉ ra Tier 1, Round 5 chỉ ra Tier 5").
> 3. **XUẤT HIỆN TỪ LỊCH SỬ TRƯỚC ĐÓ:** Danh mục 9 Buff hiển thị trong mỗi lượt Draft bắt buộc phải là **hàm phản ứng trực tiếp dựa trên toàn bộ chuỗi Buff mà Người chơi A và Đối thủ B đã chọn từ các lượt trước**.
> 4. **TÍNH QUYẾT ĐỊNH THẮNG THUA TỰ NHIÊN:** Càng về sau, người chơi càng tích lũy nhiều buff (độ sâu lịch sử $|\mathcal{H}_A|, |\mathcal{H}_B|$ càng lớn), các ngưỡng cộng hưởng (Resonance Thresholds) tự động được kích hoạt, dẫn đến việc các Buff cấp tối thượng mang tính **Quyết Định Thắng Thua (Game-Deciding / Apex Overwrites)** tự nhiên mở khóa và xuất hiện với trọng số áp đảo, tạo nên những bước ngoặt xoay chuyển cục diện ván cờ!

---

## ⚡ 2. CẤU TRÚC HỆ SINH THÁI TỐI THIỂU 243 BUFFS THEO CÂY TIẾN HÓA & MA TRẬN PHẢN ỨNG (BUFF EVOLUTION GRAPH)

Thay vì phân chia theo Round, kho dữ liệu $\ge 243$ Buffs được tổ chức thành một **Đồ Thị Tiến Hóa Có Hướng (Directed Acyclic Evolution Graph - DAG)** gồm 5 Cấp Độ Sâu (Evolution Depths $\mathcal{D}_1 \to \mathcal{D}_5$):

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│           HỆ THỐNG BUFFS (N ≥ 243) PHÂN BỔ THEO ĐỘ SÂU TIẾN HÓA LỊCH SỬ                 │
├─────────┬──────────────────────┬──────────┬─────────────────────────────────────────────┤
│ CẤP ĐỘ  │ ĐIỀU KIỆN TIÊN QUYẾT │ SỐ LƯỢNG │ TÍNH CHẤT CHIẾN THUẬT & MỨC ĐỘ TÁC ĐỘNG    │
├─────────┼──────────────────────┼──────────┼─────────────────────────────────────────────┤
│ Depth 1 │ Khởi Nguyên (Root)   │ ≥ 45 Buff│ Mở khóa khi chưa có lịch sử; định hình lối  │
│ Depth 2 │ Nhánh Rẽ (Branching) │ ≥ 54 Buff│ Cần ≥ 1 Buff Depth 1 cùng hệ / Faction      │
│ Depth 3 │ Khắc Chế & Đột Biến  │ ≥ 54 Buff│ Kích hoạt khi đối thủ có ≥ 1 Buff tương     │
│         │ (Reactive Counter)   │          │ ứng hoặc người chơi đạt ≥ 2 Buff cùng hệ    │
│ Depth 4 │ Trừng Phạt Cực Hạn   │ ≥ 45 Buff│ Kích hoạt khi chuỗi lịch sử tích lũy ≥ 3    │
│         │ (Apex Counter)       │          │ hoặc đối thủ đạt ngưỡng giáp/khống chế cao │
│ Depth 5 │ ĐỊNH ĐOẠT CHUNG CUỘC │ ≥ 45 Buff│ GAME-DECIDING OVERWRITES: Kích hoạt khi hội │
│         │ (Game-Deciding God)  │          │ đủ chuỗi tương tác lịch sử sâu (≥ 3 buff)   │
├─────────┴──────────────────────┴──────────┴─────────────────────────────────────────────┤
│ TỔNG CỘNG                      │ ≥ 243 BUF│ CỰC ĐẠI HÓA ĐA DẠNG CHIẾN THUẬT             │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 👑 3. DANH MỤC CÁC BUFF CẤP TỐI THƯỢNG QUYẾT ĐỊNH THẮNG THUA (DEPTH 5 - GAME-DECIDING APEX BUFFS)

Khi chuỗi lịch sử của hai người chơi tích lũy đủ các tiền đề (Prerequisites từ các lượt chọn trước), các Buff cấp Tối Thượng (Game-Deciding Overwrites) sẽ xuất hiện để định đoạt kết quả trận đấu (tối thiểu 45 mẫu cốt lõi):

### 🌟 Nhóm A: Bẻ Gãy & Tái Thiết Luật Chơi (Rule-Bending Game-Breakers - 15 Buffs)
1. **`BUFF-APEX-01`: Tuyệt Diệt Băng Hỏa Trùng Phùng (Absolute Zero Supernova)**
   - *Điều kiện lịch sử:* Người chơi đã chọn ít nhất 1 buff nhánh Băng (Neo-Valhalla) và 1 buff nhánh Hỏa (Sol-Dynasty) từ các lượt trước.
   - *Hiệu ứng Định Đoạt:* Ngay giây thứ 5 của trận đấu, đóng băng 100% đối thủ trong 3s, sau đó kích nổ nhiệt lượng gây sát thương chuẩn bằng 50% HP hiện tại của toàn bộ đội hình đối phương.
2. **`BUFF-APEX-02`: Vực Thẳm Khuất Phục Tuyệt Đối (Erotic Domination Overwrite)**
   - *Điều kiện lịch sử:* Người chơi đã chọn chuỗi $\ge 2$ buff Abyssal Eden / Seduction từ trước.
   - *Hiệu ứng Định Đoạt:* Bất kỳ Valkyrie nào của đối thủ rơi xuống máu rách giáp Tier 3 ($HP < 30\%$) sẽ **lập tức bị quyến rũ vĩnh viễn và quay sang chiến đấu cho bạn đến hết ván đấu**!
3. **`BUFF-APEX-03`: Vỡ Vụn Thần Thánh (Aegis Annihilation)**
   - *Điều kiện lịch sử:* Đối thủ đã tích lũy từ $\ge 2$ buff Giáp hoặc Khiên ở các lượt chọn trước.
   - *Hiệu ứng Định Đoạt:* Xóa bỏ vĩnh viễn 100% Giáp và Lá Chắn của toàn bộ đội hình đối phương. Mọi sát thương họ nhận vào đều biến thành Sát Thương Chuẩn.
4. **`BUFF-APEX-04`: Luân Hồi Bất Diệt (Infinite Valkyrie Samsara)**
   - *Điều kiện lịch sử:* Người chơi đã chọn ít nhất 1 buff Hy Sinh/Tử Vọng từ trước và đang có số ván thắng ít hơn đối thủ.
   - *Hiệu ứng Định Đoạt:* 3 Valkyrie đầu tiên tử trận sẽ hồi sinh ngay lập tức tại vị trí cũ với 100% HP, 100% Mana và kích hoạt chiêu Ultimate Climax ngay trong khoảnh khắc sống lại.
5. **`BUFF-APEX-05`: Thời Khắc Tận Diệt (Chronos EMP Freeze)**
   - *Điều kiện lịch sử:* Đã chọn chuỗi buff Tốc Đánh và Khống Chế ở các lượt trước.
   - *Hiệu ứng Định Đoạt:* Đóng băng thời gian của đối thủ trong 4s đầu trận (họ không thể di chuyển, đánh thường, tích Mana). Đội của bạn tự do xả sát thương.
6. **`BUFF-APEX-06`: Huyết Tế Cuồng Nộ (Sacrificial Bloodbath)**
   - *Điều kiện lịch sử:* Đã chọn ít nhất 1 buff Berserk hoặc Hy Sinh Hàng Sau.
   - *Hiệu ứng Định Đoạt:* Hy sinh ngay lập tức 2 Valkyrie ở Hàng 2 để truyền 150% chỉ số ATK và 100% Tốc Đánh của họ cho Valkyrie chủ lực ở Hàng 1, ban cho nàng trạng thái Bất Tử trong 8s.
7. **`BUFF-APEX-07`: Sấm Sét Khởi Nguyên (Genesis Divine Wrath)**
   - *Điều kiện lịch sử:* Đã chọn chuỗi buff Phép Thuật & Bạo Kích.
   - *Hiệu ứng Định Đoạt:* Mỗi đòn đánh thường của toàn đội triệu hồi một tia sét trừng phạt gây 200 sát thương chuẩn và làm choáng 0.5s (không có hồi chiêu).
8. **`BUFF-APEX-08`: Ma Trận Phản Đòn Tuyệt Đối (Total Reflection Prism)**
   - *Điều kiện lịch sử:* Đối thủ đã chọn chuỗi $\ge 2$ buff Sát Thương Dồn (Burst Damage).
   - *Hiệu ứng Định Đoạt:* Trong 6s đầu giao tranh, 70% toàn bộ sát thương mà đội bạn phải nhận sẽ được phản thẳng vào mặt kẻ gây sát thương.
9. **`BUFF-APEX-09`: Đao Trảm Linh Hồn (Soul Reaper Execution)**
   - *Điều kiện lịch sử:* Đã chọn buff Sát Thủ hoặc Xuyên Thấu.
   - *Hiệu ứng Định Đoạt:* Mục tiêu có máu dưới 35% sẽ bị chém đứt lìa (Execute tức thì), không kích hoạt bất kỳ kỹ năng hồi sinh hay khiên bảo hộ nào.
10. **`BUFF-APEX-10`: Hư Vô Hút Cạn (Abyssal Black Hole)**
    - *Điều kiện lịch sử:* Đã chọn chuỗi buff Khống Chế Diện Rộng & Spatial.
    - *Hiệu ứng Định Đoạt:* Ô trung tâm (Ô 5) biến thành Hố Đen Hư Vô, hút toàn bộ quân cờ đối phương vào giữa và liên tục thiêu đốt 8% HP tối đa mỗi giây.
11. **`BUFF-APEX-11`: Thần Khí Quá Tải (God-Armor Overdrive)**
    - *Điều kiện lịch sử:* Đã chọn buff Liều Mạng (Risk-Reward) từ trước.
    - *Hiệu ứng Định Đoạt:* Cả 6 Valkyrie lập tức bước vào trạng thái Rách Giáp Tier 3 ngay đầu trận, nhận 150% Tốc Đánh, 100% Tỷ lệ Bạo Kích và 50% Hút Máu toàn phần.
12. **`BUFF-APEX-12`: Bản Giao Hưởng Bất Tử (Immortal Valkyrie Requiem)**
    - *Điều kiện lịch sử:* Đã chọn chuỗi buff Hồi Phục & Bền Bỉ.
    - *Hiệu ứng Định Đoạt:* Miễn nhiễm 100% với cái chết trong 6s đầu tiên của trận đấu. Mọi sát thương nhận vào trong thời gian này sẽ hồi lại thành máu khi hết 6s.
13. **`BUFF-APEX-13`: Khế Ước Quỷ Dữ (Devil's Checkmate)**
    - *Điều kiện lịch sử:* Đã chọn buff Nguyền Rủa của Abyssal Eden.
    - *Hiệu ứng Định Đoạt:* Ngay khi bắt đầu trận, chọn ngẫu nhiên 1 Valkyrie mạnh nhất của đối thủ và giam cầm nàng trong Lồng Giam Hư Vô, loại bỏ hoàn toàn khỏi trận chiến trong 10s.
14. **`BUFF-APEX-14`: Bão Cát Thời Gian (Temporal Sandstorm)**
    - *Điều kiện lịch sử:* Đối thủ đã chọn chuỗi buff Tốc Đánh Cao (Haste).
    - *Hiệu ứng Định Đoạt:* Giảm 70% Tốc Độ Tấn Công và 60% Tốc Độ Hồi Mana của toàn bộ kẻ địch trong suốt thời gian diễn ra ván đấu.
15. **`BUFF-APEX-15`: Phán Quyết Số 0: Thần Thoại Tái Sinh (Protocol Zero: Deicide)**
    - *Điều kiện lịch sử:* Đã tích lũy đủ 3 buff đại diện cho 3 trường phái khác nhau.
    - *Hiệu ứng Định Đoạt:* Kích hoạt toàn bộ sức mạnh tối thượng của Cổ Mẫu Nguyên Bản. Nếu bạn chiến thắng ván đấu này, ván đấu được tính là Thắng Tuyệt Đối (Flawless Victory).

### ⚔️ Nhóm B: Đột Phá Khắc Chế Cực Hạn (Extreme Apex Counter - 15 Buffs)
16. **`BUFF-APEX-16`: Xuyên Phá Vạn Vật (Omni-Armor Dissolution):** Giảm 80% Giáp và Kháng Phép của mục tiêu trúng đòn đầu tiên, hiệu ứng lan truyền sang ô bên cạnh. (Kích hoạt khi đối thủ chọn nhiều buff Giáp/Kháng).
17. **`BUFF-APEX-17`: Lôi Đình Vạn Trượng (Heavenly Thunderclap):** Mỗi lần Valkyrie dùng Ultimate, giáng sấm sét làm choáng toàn bộ đội hình đối phương trong 2s.
18. **`BUFF-APEX-18`: Lời Nguyền Trọng Lực (Zero Gravity Cataclysm):** Đảo ngược trọng lực, hất toàn bộ Hàng 1 của đối thủ văng ra Hàng 3 và làm choáng 3s. (Kích hoạt khi đối thủ xếp dồn Hàng 1).
19. **`BUFF-APEX-19`: Bạo Kích Vô Tận (Infinity Edge Resonance):** Sát thương bạo kích tăng lên 350%, đòn bạo kích hồi lại 30% lượng sát thương gây ra thành máu.
20. **`BUFF-APEX-20`: Băng Hà Bất Hoại (Absolute Permafrost):** Khi kẻ địch bị đóng băng, chúng nhận thêm 100% sát thương từ mọi nguồn.
21. **`BUFF-APEX-21`: Kháng Ma Thuật Vĩnh Hằng (Anti-Magic Shell):** Toàn đội miễn nhiễm 100% với mọi kỹ năng phép thuật và hiệu ứng bất lợi trong 8s. (Kích hoạt khi đối thủ theo hướng Magic Burst).
22. **`BUFF-APEX-22`: Mũi Tên Thiên Khải (Apocalypse Ballista):** Xạ thủ Hàng 3 bắn xuyên qua toàn bộ các hàng cờ theo đường thẳng, gây sát thương chuẩn cực đại.
23. **`BUFF-APEX-23`: Phản Lực Hạt Nhân (Nuclear Retaliation):** Khi Valkyrie nhận sát thương bạo kích, phát nổ plasma gây sát thương ngược lại cho toàn bộ quân địch trên cùng hàng.
24. **`BUFF-APEX-24`: Ma Nhãn Diệt Vong (Evil Eye of Extinction):** Mục tiêu bị nhìn trúng sẽ bị khóa chặt Mana ở mức 0 và nhận sát thương gấp đôi.
25. **`BUFF-APEX-25`: Đại Hồng Thủy Vực Thẳm (Tiamat's Deluge):** Nhấn chìm sàn đấu trong nước biển sâu, giảm 50% Tốc đánh địch và tăng 50% Tốc đánh đồng minh.
26. **`BUFF-APEX-26`: Trảm Đao Thần Tốc (Godspeed Decapitation):** Sát thủ Hàng 2 lướt trảm liên tục 12 nhát vào 3 mục tiêu yếu máu nhất, 100% bạo kích.
27. **`BUFF-APEX-27`: Khiên Hấp Thụ Tuyệt Đối (Singularity Shield):** Hấp thụ toàn bộ sát thương của đòn đánh đầu tiên từ mỗi kẻ địch và chuyển hóa thành khiên vĩnh viễn.
28. **`BUFF-APEX-28`: Tiếng Hát Siren Mê Đắm (Siren's Call of Doom):** Khiến 3 kẻ địch có ATK cao nhất quay sang ôm lấy nhau trong 4s, không thể tấn công.
29. **`BUFF-APEX-29`: Tia Sáng Thái Dương Hủy Diệt (Sol Ray Annihilation):** Bắn chùm sáng thiêu rụi toàn bộ Hàng 2 của đối phương, biến họ thành tro bụi sau 5s.
30. **`BUFF-APEX-30`: Khế Ước Bất Diệt (Unbreakable Sisters):** Miễn là còn ít nhất 2 Valkyrie sống sót, cả hai không thể bị hạ gục (máu không thể tụt dưới 1 HP).

### 💋 Nhóm C: Kích Nổ Khiêu Gợi & Cực Khoái Chiến Trận (Erotic Climax Overload - 15 Buffs)
31. **`BUFF-APEX-31`: Cực Khoái Tuyệt Đích (Ultimate Climax Rapture):** Khi đạt rách giáp Tier 3, Valkyrie phát ra tiếng rên rỉ thánh thót làm choáng toàn bộ kẻ địch trong 3.5s vì đê mê.
32. **`BUFF-APEX-32`: Làn Da Vàng Ròng (Gilded Skin Temptation):** Toàn bộ giáp biến mất, đổi lại cơ thể trần trụi phát sáng quyến rũ khiến kẻ địch tấn công bị mê muội đánh trượt 60%.
33. **`BUFF-APEX-33`: Vết Cắn Ma Cà Rồng Thuần Khiết (Carmilla's Pure Kiss):** Hút 50% máu tối đa của đối thủ và biến đối thủ thành nô lệ trung thành.
34. **`BUFF-APEX-34`: Hơi Thở Kích Dục Lan Tỏa (Aphrodisiac Mist):** Sương mù màu hồng bao phủ bàn cờ, khiến kẻ địch giảm 50% Giáp và tăng 100% sát thương nhận vào từ dàn Waifu.
35. **`BUFF-APEX-35`: Vũ Điệu Thoát Y Bão Tố (Striptease Gale):** Cứ mỗi mảnh vải rơi xuống, toàn đội tăng 30% Tốc Đánh và 20% Bạo Kích (cộng dồn vô hạn).
36. **`BUFF-APEX-36`: Trừng Phạt Nữ Vương (Queen's Domination Spank):** Roi gai quất trúng kẻ địch sẽ khiến chúng quỳ rạp xuống sàn đấu trong 3s, mất toàn bộ khả năng phòng ngự.
37. **`BUFF-APEX-37`: Nước Mắt Nữ Tu (Nun's Ecstatic Tears):** Hồi phục 100% HP cho toàn bộ đồng minh khi có Valkyrie ngã xuống trong trạng thái rách giáp.
38. **`BUFF-APEX-38`: Xích Trói Shibari Thần Thánh (Sacred Shibari Binding):** Trói chặt toàn bộ Hàng 1 của đối thủ bằng xích phát sáng, khiến chúng chịu chung 100% sát thương.
39. **`BUFF-APEX-39`: Ngọn Lửa Tình Dục Rực Cháy (Lust Fire Conflagration):** Kẻ địch bị thiêu đốt sẽ phát cuồng vì khoái cảm, liên tục tự cào rách giáp của chính mình.
40. **`BUFF-APEX-40`: Phục Tùng Vĩnh Cửu (Eternal Submission):** Khi kẻ địch bị kết liễu bởi đòn Climax, chúng quỳ gối dâng hiến toàn bộ Mana còn lại cho đội bạn.
41. **`BUFF-APEX-41`: Nụ Hôn Tử Thần Của Hela (Hela's Fatal Embrace):** Ôm chầm lấy kẻ địch mạnh nhất và cùng phát nổ, tiêu diệt cả hai ngay lập tức.
42. **`BUFF-APEX-42`: Thần Khí Lõa Thể (Naked Valkyrie Majesty):** Đội hình của bạn chiến đấu trong trạng thái không mảnh vải che thân, nhận 100% Kháng Mọi Hiệu Ứng Bất Lợi và tăng 50% ATK.
43. **`BUFF-APEX-43`: Điệu Múa Quyến Rũ Cuối Cùng (The Final Temptation Dance):** Trì hoãn cái chết của toàn đội thêm 5s sau khi HP về 0 để tung ra đợt phản công tất sát.
44. **`BUFF-APEX-44`: Bão Cảm Xúc Thăng Hoa (Emotional Climax Blast):** Xả toàn bộ Mana của 6 Valkyrie cùng lúc, tạo nên vụ nổ ánh sáng quét sạch 80% máu của đối thủ.
45. **`BUFF-APEX-45`: Khải Hoàn Ca Nữ Thần (Hymn of the Victorious Goddess):** Đòn đánh cuối cùng kết liễu trận đấu hiển thị màn Cut-in chiến thắng đặc biệt với tạo hình 18+ lộng lẫy nhất của Valkyrie MVP!

---

## 🎲 4. PHÂN BỔ CÁC BUFFS TIẾN HÓA & PHẢN ỨNG (DEPTH 1 $\to$ DEPTH 4 - TỐI THIỂU 198 BUFFS CƠ SỞ)

*(Danh mục cơ sở tối thiểu 198 Buffs, sẵn sàng mở rộng thêm thông qua các bản cập nhật season mà không giới hạn trần)*

- **Depth 1 (Cấp Khởi Nguyên - Tối thiểu 45 Buffs):**
  - Mở khóa mặc định khi $\mathcal{H}_A = \emptyset$.
  - 15 Buffs Nền tảng Faction (`Neo-Valhalla Initiate`, `Eden Acolyte`, `Sol Disciple`).
  - 15 Buffs Khởi tạo Class (`Vanguard Shielding`, `Infiltrator Agility`, `Sorceress Spark`).
  - 15 Buffs Vị trí cơ bản (`Frontline Wall`, `Midline Support`, `Backline Aim`).
- **Depth 2 (Cấp Chuyên Hóa Nhánh - 54 Buffs):**
  - Kích hoạt khi lịch sử A có ít nhất 1 buff Depth 1 cùng hệ.
  - 18 Buffs Chuyên sâu Faction Depth 2 (`Frost Nova`, `Venom Spread`, `Solar Radiance`).
  - 18 Buffs Khắc chế sơ khai (`Armor Crack`, `Spell Dampener`, `Bleed Infliction`).
  - 18 Buffs Tương tác Rách Giáp Tier 2 (`Torn Armor Resilience`, `Blush Haste`, `Adrenaline Flush`).
- **Depth 3 (Cấp Bước Ngoặt & Đột Biến - 54 Buffs):**
  - Kích hoạt khi A có $\ge 2$ buff cùng hệ, HOẶC B đã chọn buff gây mất cân bằng.
  - 18 Buffs Bước ngoặt chiến thuật (`Position Swap`, `Flank Ambush`, `Emergency Barrier`).
  - 18 Buffs Hình học bàn cờ 3x3 nâng cao (`Diagonal Harmony`, `Center Dominance`, `Pincer Strike`).
  - 18 Buffs Phản ứng khắc chế lịch sử (`Anti-Shield Smasher`, `True Damage Infusion`, `Silence Wave`).
- **Depth 4 (Cấp Trừng Phạt Đỉnh Cao - 45 Buffs):**
  - Kích hoạt khi lịch sử tích lũy $\ge 3$ buff hoặc đối thủ tích tụ chỉ số cực đoan.
  - 15 Buffs Trừng phạt chiến thuật sâu (`Anti-Synergy Virus`, `Overload Punisher`, `Armor Meltdown`).
  - 15 Buffs Lật kèo cao cấp (`Comeback Vengeance`, `Desperation Surge`, `Immortal Will`).
  - 15 Buffs Tương tác Rách Giáp Tier 3 tiền Climax (`Extreme Pain to Power`, `Ecstasy Bloodlust`).

---

## 🧮 5. CƠ CHẾ SINH 9 BUFF DỰA 100% VÀO LỊCH SỬ CHỌN (KHÔNG CHIA ROUND)

### 5.1. Công Thức Lọc Khả Dụng & Mở Khóa Đồ Thị (Graph Prerequisite Unlocking)
Một Buff $b \in \mathcal{B}_{243}$ được coi là **hợp lệ (eligible)** để đưa vào hàng chờ chấm điểm nếu và chỉ nếu:
1. $b \notin \mathcal{H}_A$ (Không trùng với bất kỳ buff nào A đã chọn trước đây).
2. Toàn bộ điều kiện tiên quyết $P(b)$ thỏa mãn đối với bộ đôi $(\mathcal{H}_A, \mathcal{H}_B)$:
   $$P_{\text{synergy}}(b) \subseteq \text{Tags}(\mathcal{H}_A) \quad \text{HOẶC} \quad P_{\text{counter}}(b) \cap \text{Tags}(\mathcal{H}_B) \neq \emptyset$$

### 5.2. Công Thức Chấm Điểm Thích Ứng Lịch Sử (Pure History Scoring Function)
Không sử dụng bất kỳ biến `round` nào! Điểm số của buff $b$ được xác định dựa trên mức độ tích lũy lịch sử:

$$\text{FinalScore}(b \mid \mathcal{H}_A, \mathcal{H}_B) = \Big(w_1 \cdot \text{Score}_{\text{syn}}(b, \vec{S}_A) + w_2 \cdot \text{Score}_{\text{counter}}(b, \vec{S}_B) + w_3 \cdot \text{Score}_{\text{pivot}}(b, \Delta \vec{S})\Big) \times \left(1 + \lambda \cdot |\mathcal{H}_A|\right)^{\text{Depth}(b) - 1}$$

- $\vec{S}_A = \sum_{h \in \mathcal{H}_A} \vec{h}$: Vector trạng thái tích lũy của A.
- $\vec{S}_B = \sum_{h \in \mathcal{H}_B} \vec{h}$: Vector trạng thái tích lũy của B.
- $|\mathcal{H}_A|$: **Số lượng Buff A đã chọn trong lịch sử**. Càng chọn nhiều buff từ trước, hệ số khuếch đại cho các buff có `Depth(b)` cao (Depth 4 và Depth 5) càng tăng vọt theo cấp số nhân!
- $\lambda = 0.6$: Hệ số gia tốc tiến hóa lịch sử (History Evolution Acceleration).

> **Hệ Quả Tự Nhiên Tuyệt Đối:**
> - Lần chọn đầu ($|\mathcal{H}_A| = 0$): Các buff Depth 1 có điểm số cao nhất vì thỏa mãn điều kiện Root. Các buff Depth 4/5 chưa thỏa mãn prerequisite nên không xuất hiện.
> - Các lần chọn kế tiếp ($|\mathcal{H}_A| \ge 2, 3, 4$): Nhờ số lượng buff đã tích lũy, các Buff cấp cao (Depth 4 & Depth 5 Game-Deciding) tự động vượt trội về điểm số và chiếm trọn danh sách 9 buff, tạo nên màn so tài đỉnh cao mà không cần bất kỳ can thiệp thủ công nào theo số round!

### 5.3. Cơ Cấu 9 Ô Lựa Chọn (3-3-3 History Allocation)
Khi hiển thị trên giao diện Client, 9 Buff được chia thành 3 nhóm chiến lược xuất phát 100% từ phân tích lịch sử:
1. **3 Buff Cường Hóa Nhánh Lịch Sử (Evolution & Deep Synergy):** Thúc đẩy các lựa chọn mà A đã đầu tư ở các lượt trước lên đỉnh cao mới.
2. **3 Buff Phản Chấn Trực Diện (Reactive Counter to B's Build):** Trực tiếp vô hiệu hóa các chỉ số/buff mà đối thủ B đã chọn từ trước.
3. **3 Buff Đột Biến Định Đoạt (Decisive Apex Overwrites):** Kích hoạt khi lịch sử đạt độ sâu hoặc khi bị dẫn điểm, trao cho người chơi khả năng lật ngược thế cờ trong nháy mắt.

---

## 🔄 6. CƠ CHẾ KẾ THỪA & TÁI XUẤT HIỆN BUFF XUYÊN TẦNG (CROSS-DEPTH RESURFACING & RE-OFFERING)

### 6.1. Xử Lý Trường Hợp Ván Sau Vẫn Hiển Thị Buff Của Ván Trước (The "Round 1-2 Leads to Round 2 Buff in Round 3" Case)
Trong thực tế thi đấu thể thức BO5:
> **Tình huống điển hình:**
> - Ở Round 1, Player A chọn `BUFF-01` (Depth 1).
> - Ở Round 2, Player A chọn `BUFF-02` (Depth 2).
> - Sự kết hợp giữa `[BUFF-01 + BUFF-02]` tạo ra một khoảng trống chiến thuật hoặc kích hoạt một nhánh phụ cực kỳ mạnh mẽ mà mảnh ghép lý tưởng nhất lại là một **Buff Depth 2 khác** (ví dụ: mảnh kích hoạt đòn rách giáp đôi hoặc bổ trợ kháng phép).
> - **Hành vi chuẩn xác của hệ thống:** Tại Round 3 của thể thức BO5, danh sách 9 Buff **HOÀN TOÀN CÓ THỂ hiển thị một hoặc nhiều Buff thuộc Depth 2** (vốn dĩ có thể xuất hiện từ Round 2), chứ **KHÔNG HỀ BỊ CỨNG NHẮC CHỈ ĐƯỢC PHÉP HIỂN THỊ CÁC BUFF THUỘC ROUND 3**!

### 6.2. Ba Quy Tắc Kiểm Soát Tái Xuất Hiện (Resurfacing Governance Rules)

1. **Quy Tắc 1: Cấm Trùng Tuyệt Đối Với Buff Đã Chọn (Strict Non-Repeat of Owned Buffs):**
   $$b \in \mathcal{H}_A \implies b \text{ bị loại bỏ vĩnh viễn khỏi mọi lượt Draft tiếp theo của A}$$
   Người chơi không bao giờ bị hiển thị lại một Buff mà bản thân đã sở hữu.

2. **Quy Tắc 2: Cho Phép Tái Xuất Hiện Buff Chưa Chọn (Resurfacing of Unchosen / Skipped Buffs):**
   - Nếu một Buff $b$ từng nằm trong 9 lựa chọn của lượt trước nhưng người chơi không chọn (bị bỏ lỡ do phải ưu tiên buff khác):
     - Buff đó **KHÔNG BỊ XÓA BỎ VĨNH VIỄN**!
     - Nếu các lựa chọn tiếp theo làm tăng độ tương hợp Cosine $\cos(\vec{b}, \vec{S}_A)$, hoặc đối thủ B đưa ra lựa chọn khiến $b$ trở thành phương án phản công tối ưu, $b$ sẽ được **tái đề xuất (Re-offered)** vào 9 Buff của lượt sau với huy hiệu chiến thuật `[HOÀN THIỆN NHÁNH / BUILD COMPLETION]`.

3. **Quy Tắc 3: Tổ Hợp Hỗn Hợp Đa Cấp Độ Sâu (Cross-Depth Hybrid Cohort):**
   - Tại bất kỳ lượt Draft nào (dù là Ván 3, 4 hay 5 của BO5), danh sách 9 Buff luôn là một **tập hợp hỗn hợp (Hybrid Pool)** gồm nhiều Cấp Độ Sâu khác nhau (ví dụ: 1 Depth 2, 4 Depth 3, 3 Depth 4, 1 Depth 5).
   - Tỷ lệ xuất hiện của từng Depth được quyết định bởi **Hàm Điểm Thích Ứng Vector và Độ Phù Hợp Lịch Sử**, hoàn toàn xóa bỏ tư duy chia vách ngăn giả tạo giữa các round!

