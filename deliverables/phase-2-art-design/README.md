# 🎨 KẾT QUẢ GIAI ĐOẠN 2: THIẾT KẾ ĐỒ HỌA, UI/UX & NGHỆ THUẬT WAIFU 18+ (PHASE 2 DELIVERABLES)
*(Tác tử chủ trì: `art-designer` • Căn cứ triển khai cho `frontend-engineer`, `backend-engineer` & `qa-balance-tester`)*

---

## 📌 1. TỔNG QUAN THƯ MỤC LƯU TRỮ (DELIVERABLES REPOSITORY)

Thư mục này chứa toàn bộ các bản thiết kế nghệ thuật, bảng mã màu Design Tokens, tạo hình nhân vật với 3 cấp độ rách giáp (*Battle Damage Tiers*), Wireframes bố cục bàn cờ 3x3 và kịch bản phân cảnh chiêu thức tối thượng do tác tử **`art-designer`** ban hành sau khi nghiệm thu **Cổng 2 (Gate 2)**.

Tất cả các tác tử ở giai đoạn sau (`frontend-engineer` ở Pha 4, `backend-engineer` ở Pha 3 để lấy hằng số kỹ năng, `qa-balance-tester` ở Pha 5 để thẩm định visual feel) **bắt buộc phải căn cứ (base on)** các tài liệu trong thư mục này:

| Tên Tài Liệu Deliverable | Mô Tả Trọng Tâm | Tác Tử Tiêu Thụ Chính |
| :--- | :--- | :--- |
| [`design-system-tokens.md`](design-system-tokens.md) | Bảng mã màu Dark Cyberpunk Neon, Glassmorphism, khoảng cách chạm, phông chữ. | `frontend-engineer` |
| [`character-roster-18plus.md`](character-roster-18plus.md) | Dàn 27 Valkyries (3 Factions: Neo-Valhalla, Abyssal Eden, Sol-Dynasty): Lore, Visual Specs, 3 Cấp độ rách giáp (Pristine $\rightarrow$ Torn $\rightarrow$ Climax Extreme). | `frontend-engineer`, `backend-engineer` |
| [`ui-wireframes-3x3.md`](ui-wireframes-3x3.md) | Wireframes chi tiết 3 màn hình cốt lõi: Draft 9 Buff, Xếp cờ 3x3 (Magnetic Snap) và Combat HUD. | `frontend-engineer`, `qa-balance-tester` |
| [`vfx-climax-storyboard.md`](vfx-climax-storyboard.md) | Kịch bản phân cảnh Ultimate Cut-In cận cảnh, hiệu ứng rung chấn và tia lửa hạt Skia. | `frontend-engineer` |
| [`audio-voice-spec.md`](audio-voice-spec.md) | Đặc tả âm thanh va chạm kim loại, nhạc nền synthwave dồn dập, và danh mục voice-lines tiếng Nhật gợi cảm. | `frontend-engineer` |
| [`assets/`](assets/README.md) | Thư mục lưu trữ assets hình ảnh concept art, waifu portrait được sinh ra từ `generate_image`. | `frontend-engineer` |

---

## 🔗 2. QUY CHUẨN KẾ THỪA CHO CÁC PHA TIẾP THEO

1. **Dành cho `frontend-engineer` (Pha 4):**
   - Áp dụng chính xác mã màu hex trong [`design-system-tokens.md`](design-system-tokens.md) vào CSS / Skia Paint.
   - Hiện thực hóa hoạt cảnh chuyển tầng rách giáp theo đúng mô tả tại [`character-roster-18plus.md`](character-roster-18plus.md).
   - Lập trình bàn cờ 3x3 tuân thủ công thái học tại [`ui-wireframes-3x3.md`](ui-wireframes-3x3.md) với phản hồi cảm ứng $< 16\text{ms}$.
   - Tích hợp Cut-In theo timing chính xác tại [`vfx-climax-storyboard.md`](vfx-climax-storyboard.md).

2. **Dành cho `backend-engineer` (Pha 3):**
   - Đảm bảo các mốc trigger sự kiện `CLOTH_DAMAGE_TRIGGER` ($70\%$ và $30\%$ HP) và `CLIMAX_ULTIMATE_CAST` ($100$ Mana) khớp với đặc tả của Art Director.

3. **Dành cho `qa-balance-tester` (Pha 5):**
   - Sử dụng `browser_subagent` để chụp ảnh màn hình và đối chiếu trực tiếp với Wireframes và tiêu chí gợi cảm $\ge 8.5/10$.
   - Nếu phát hiện rách giáp bị lỗi layer hoặc giật khung hình, ghi ticket vào [../../.agents/memory/TICKETS.md](../../.agents/memory/TICKETS.md).
