# 📱 ĐẶC TẢ WIREFRAMES BỐ CỤC BÀN CỜ 3x3 & 3 MÀN HÌNH CHÍNH (UI WIREFRAMES SPECIFICATION)
*(Phase 2 Deliverable • Thiết lập bởi `art-designer` • Nền tảng Layout cho `frontend-engineer`)*

---

## 1. MÀN HÌNH 1: DRAFT 9 BUFF (GIAI ĐOẠN 20 GIÂY ĐẦU TRẬN)

```
┌────────────────────────────────────────────────────────┐
│ [MATCH 1v1 BO3]   Round: 1/3     ⏱️ Đếm ngược: 18s     │
├────────────────────────────────────────────────────────┤
│           CHỌN 1 TRONG 9 BUFF CHIẾN THUẬT (CƠ CẤU 3-3-3)  │
│                                                        │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│ │ [SYNERGY 1]  │ │ [SYNERGY 2]  │ │ [SYNERGY 3]  │     │
│ │ Hỏa Long     │ │ Khiên Băng   │ │ Cuồng Bạo Vũ │     │
│ └──────────────┘ └──────────────┘ └──────────────┘     │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│ │ [COUNTER 1]  │ │ [COUNTER 2]  │ │ [COUNTER 3]  │     │
│ │ Khắc Xuyên   │ │ Khắc Sát Thủ │ │ Chống Hồi Máu│     │
│ └──────────────┘ └──────────────┘ └──────────────┘     │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│ │ [DECISIVE 1] │ │ [DECISIVE 2] │ │ [DECISIVE 3] │     │
│ │ Tuyệt Kỹ Apex│ │ Định Đoạt Trận││ Hoán Đổi Cờ  │     │
│ └──────────────┘ └──────────────┘ └──────────────┘     │
│                                                        │
│ [ Chi tiết Buff được chọn hiển thị tại đây kèm Art 18+]│
└────────────────────────────────────────────────────────┘
```

---

## 2. MÀN HÌNH 2: XẾP ĐỘI HÌNH TRÊN LƯỚI 3x3 (20 GIÂY CHUẨN BỊ)

Quy tắc công thái học: Người chơi chọn 6 Valkyrie từ Pool 27 Nữ Chiến Binh (hoặc Đội hình đã lưu) và kéo thả từ Hàng Chờ (Bench) 6 quân vào Lưới 9 ô:
- **Hàng 1 (Frontline):** Ô 1 (Vanguard), Ô 2 (Breaker/Đột phá), Ô 3 (Guardian).
- **Hàng 2 (Midline):** Ô 4 (Flank Trái), Ô 5 (Core/Tactician), Ô 6 (Flank Phải).
- **Hàng 3 (Backline):** Ô 7 (Xạ thủ), Ô 8 (Pháo hỗ trợ), Ô 9 (Pháp sư/Trị liệu).

```
┌────────────────────────────────────────────────────────┐
│ ĐỐI THỦ: [Ẩn Đội Hình - Fog of Placement ❓❓❓]      │
├────────────────────────────────────────────────────────┤
│                       BÀN CỜ CỦA BẠN (3x3)             │
│                                                        │
│    [ Ô 1: Tiên Phong ]   [ Ô 2: ĐỘT PHÁ ]   [ Ô 3: Vệ Binh ] │ <- Hàng 1
│    [ Ô 4: Bọc Sườn Trái] [ Ô 5: TRUNG TÂM ] [ Ô 6: Bọc Sườn Phải] <- Hàng 2
│    [ Ô 7: Xạ Thủ ]       [ Ô 8: Hỗ Trợ ]    [ Ô 9: Pháp Sư ] │ <- Hàng 3
│                                                        │
│ [Quân đã đặt: 6/6 • Ô trống: 3] [Lock-in: SẴN SÀNG 🔒]  │
├────────────────────────────────────────────────────────┤
│ HÀNG CHỜ QUÂN CỜ (DRAG & DROP BENCH):                  │
│ [Freyja] [Brynhildr] [Sigrun] [Kara] [Alvitr] [Mist]   │
└────────────────────────────────────────────────────────┘
```

---

## 3. MÀN HÌNH 3: AUTO-COMBAT 20 TICKS/S & CLIMAX VFX

- **Camera View:** Góc nhìn xéo Isometric $2.5\text{D}$ góc $45^\circ$, hiển thị toàn cảnh 2 bên chiến tuyến.
- **Thanh Máu & Mana:** Nổi bên trên đầu mỗi Valkyrie.
- **Lớp Biến Hình:** Khi máu giảm qua mốc $70\%$ và $30\%$, texture tự động morphing sang Tier 2 / Tier 3 mà không giật khung hình.
- **Climax Cut-In Layer:** Chiếm $60\%$ màn hình với hoạt cảnh 2D cận cảnh khuôn mặt đỏ ửng trong $0.6$ giây trước khi phóng chiêu.
