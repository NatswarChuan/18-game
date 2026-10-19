# 🎨 DESIGN SYSTEM TOKENS (VALKYRIE PROTOCOL: ZERO)
*(Phase 2 Deliverable • Thiết lập bởi `art-designer` • Nền tảng UI/UX cho `frontend-engineer`)*

---

## 1. BẢNG MÃ MÀU CHỦ ĐẠO (DARK CYBERPUNK NEON PALETTE)

| Tên Token | Mã Hex | RGB / HSL | Mục Đích Sử Dụng |
| :--- | :--- | :--- | :--- |
| `color-primary-neon` | `#FF2A85` | `rgb(255, 42, 133)` | Điểm nhấn chính, Viền nút bấm Climax, Viền áo rách rực sáng, HP Waifu |
| `color-accent-cyan` | `#00F0FF` | `rgb(0, 240, 255)` | Mana Bar, Ô cờ hợp lệ khi kéo thả, Hiệu ứng phòng thủ khiên năng lượng |
| `color-mystic-purple`| `#8A2BE2` | `rgb(138, 43, 226)` | Thẻ bài Buff Huyền Thoại, Viền thẻ nhân vật S-Tier, Hiệu ứng mê hoặc |
| `color-bg-base` | `#0D0E15` | `rgb(13, 14, 21)` | Màu nền chính Dark Cyberpunk, chống mỏi mắt cho game thủ cày đêm |
| `color-surface-glass`| `rgba(22, 24, 38, 0.75)` | Blur 16px | Nền thẻ bài, Dialog, Bảng thông tin nhân vật chuẩn Glassmorphism |
| `color-warning-red` | `#FF3344` | `rgb(255, 51, 68)` | Cảnh báo ô cờ trùng, Máu báo động < 30% (Tier 3 Climax Extreme) |

---

## 2. HIỆU ỨNG THỊ GIÁC GLASSMORPHISM & BORDER GLOW

```css
/* Token: Surface Glassmorphism Cyberpunk */
.glass-panel {
  background: rgba(22, 24, 38, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 42, 133, 0.25);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.45),
              inset 0 0 12px 0 rgba(255, 42, 133, 0.1);
  border-radius: 12px;
}

/* Token: Neon Glow Hover Effect */
.neon-glow-primary {
  box-shadow: 0 0 15px rgba(255, 42, 133, 0.6),
              0 0 30px rgba(255, 42, 133, 0.3);
}
```

---

## 3. CÔNG THÁI HỌC CẢM ỨNG & KÍCH THƯỚC (TOUCH ERGONOMICS)

- **Kích thước ô cờ 3x3 trên màn hình:** Tối thiểu $72\text{px} \times 72\text{px}$ (Mobile) và $96\text{px} \times 96\text{px}$ (Desktop Web).
- **Khoảng cách giữa các ô (Grid Gap):** Chính xác $8\text{px}$ để đảm bảo vùng thả (Drop zone) không bị dính vào nhau.
- **Vùng kích hoạt cảm ứng (Touch Target):** Tối thiểu $48\text{px} \times 48\text{px}$ theo tiêu chuẩn WCAG Accessibility.
- **Typography:**
  - Font tiêu đề: `Orbitron` hoặc `Rajdhani` (Đậm chất Sci-Fi Cyberpunk).
  - Font nội dung & số liệu: `Inter` hoặc `JetBrains Mono` (Hiển thị số sát thương rõ nét, dễ đọc tức thì).
