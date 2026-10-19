# 🔊 ĐẶC TẢ ÂM THANH & VOICE-LINES GỢI CẢM (AUDIO & VOICE SPECIFICATION)
*(Phase 2 Deliverable • Thiết lập bởi `art-designer` • Nền tảng Âm thanh cho `frontend-engineer`)*

---

## 1. PHÂN LỚP ÂM THANH TRONG GAME (AUDIO BUS ARCHITECTURE)

- **Master Bus:**
  - **BGM Bus (Volume: 70%):** Nhạc nền Cyberpunk Synthwave dồn dập (140 BPM), tiết tấu nhanh thúc đẩy hưng phấn giao tranh.
  - **SFX Bus (Volume: 100%):** Tiếng va đập kim loại, tiếng súng pháo, hiệu ứng kéo thả cờ snap-to-grid giòn giã.
  - **Voice Bus (Volume: 90%):** Giọng lồng tiếng Nhật Bản gợi cảm của dàn nữ chiến binh Waifu (Thở gấp, rên khẽ khi rách giáp, hô chiêu đầy uy lực).

---

## 2. DANH MỤC SFX CỐT LÕI

| Sound ID | Tên File Âm Thanh | Sự Kiện Kích Hoạt | Mô Tả Âm Sắc |
| :--- | :--- | :--- | :--- |
| `SFX_SNAP_GRID` | `sfx_snap_grid.wav` | Thả quân cờ vào ô 3x3 hợp lệ | Tiếng "Click" cơ học đanh thép, chắc nịch |
| `SFX_CLOTH_TEAR_1` | `sfx_cloth_tear_light.wav` | Kích hoạt Rách giáp Tier 2 (<70% HP) | Tiếng vải xé toạc nhẹ nhàng kèm hơi thở dốc |
| `SFX_CLOTH_TEAR_2` | `sfx_cloth_tear_heavy.wav` | Kích hoạt Rách giáp Tier 3 (<30% HP) | Tiếng kim loại vỡ vụn + vải toạc lớn |
| `SFX_CLIMAX_BURST`| `sfx_climax_burst.wav` | Kích hoạt Ultimate Cut-In | Âm bass rung chấn trầm sâu, bùng nổ năng lượng |

---

## 3. DANH MỤC VOICE-LINES TIẾNG NHẬT GỢI CẢM
- Khi vào trận (Match Start): *"Chúng ta cùng nhau dâng hiến trận đấu này nhé..."*
- Khi trúng đòn rách giáp (Damage Taken): *"Kyah... Chỗ đó... không được!"*
- Khi tung chiêu tối thượng (Climax Cast): *"Hãy cảm nhận trọn vẹn sức mạnh của ta đi!"*
- Khi chiến thắng (Victory): *"Fufu... Ngươi đã thỏa mãn chưa?"*
