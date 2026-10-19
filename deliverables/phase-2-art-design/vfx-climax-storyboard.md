# 💥 KỊCH BẢN PHÂN CẢNH HIỆU ỨNG CLIMAX CUT-IN & VFX (VFX & STORYBOARD SPECIFICATION)
*(Phase 2 Deliverable • Thiết lập bởi `art-designer` • Căn cứ diễn hoạt cho `frontend-engineer`)*

---

## 1. TIMELINE HOẠT CẢNH CLIMAX CUT-IN (TỔNG THỜI GIAN: 1.2 GIÂY)

Khi Valkyrie đạt 100 Mana, Server phát sự kiện `CLIMAX_ULTIMATE_CAST`. Client thực thi chuỗi diễn hoạt:

| Thời Điểm (Timeline) | Diễn Biến Hoạt Cảnh (Visual Action) | Hiệu Ứng VFX Skia & Shaders | Âm Thanh Tương Ứng |
| :--- | :--- | :--- | :--- |
| **0.00s — 0.15s** | Màn hình tối dần ($70\%$ Black Overlay), thời gian chiến trường chậm lại (Bullet-time 0.2x). | Vignette mờ dần, vòng sáng Neon tụ về tâm nhân vật. | Âm thanh nén khí điện từ `charge_up.wav`. |
| **0.15s — 0.60s** | Cut-in 2D trượt chéo từ góc phải vào: Cận cảnh gương mặt Waifu thở dốc, mắt ngập tràn ánh sáng linh lực, vệt mồ hôi rơi gợi cảm. | Hiệu ứng vệt chém điện quang chớp tắt, tia lửa hạt nổ tung tóe. | Voice-line chiêu cuối tiếng Nhật quyến rũ vang lên. |
| **0.60s — 0.90s** | Nhân vật vung vũ khí tung chiêu sát thương diện rộng hoặc kích nổ. | Screen Shake (Rung chấn màn hình biên độ 12px), Vệt kiếm Plasma neon xé toạc màn hình. | Tiếng nổ va đập kim loại cực lớn `slash_impact_heavy.wav`. |
| **0.90s — 1.20s** | Màn hình trở lại độ sáng bình thường, khói và hạt ánh sáng tan biến dần. | Hạt bụi ánh sáng (Light particles) lấp lánh rơi xuống sàn đấu. | Tiếng thở phào nhẹ nhõm hoặc cười khẽ `sensual_sigh.wav`. |

---

## 2. QUY CHUẨN KỸ THUẬT HIỆU NĂNG SKIA (60–120 FPS GUARANTEE)

- **Không tạo Garbage Collector trồi sụt:** Tái sử dụng các Object `SkPaint`, `SkPath` và `SkShader` tĩnh, không khởi tạo lại trong hàm render mỗi frame.
- **Particle Count:** Tối đa 150 hạt ánh sáng cùng lúc trên màn hình.
- **Screen Shake:** Dùng hàm điều hòa giảm chấn $A(t) = A_0 \cdot e^{-\lambda t} \cdot \cos(\omega t)$ để rung lắc êm ái, không gây chóng mặt.
