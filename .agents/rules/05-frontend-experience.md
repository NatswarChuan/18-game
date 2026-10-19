---
trigger: glob
globs:
  - "apps/client/**"
description: "Quy tắc Client 60-120 FPS, bảng cờ 3x3 kéo thả siêu nhạy <16ms, layer hoạt ảnh rách giáp 18+ và dọn dẹp bộ nhớ đồ họa."
---

# QUY TẮC PHÁT TRIỂN CLIENT: 60 FPS & CẢM GIÁC CHƠI ĐỈNH CAO (FRONTEND EXPERIENCE)

Khi phát triển hoặc tối ưu hóa mã nguồn Client:

1. **Chuẩn Mực Khung Hình 60–120 FPS Bất Biến:**
   - Không được phép thực hiện các tác vụ tính toán nặng trên Main Thread làm giảm FPS xuống dưới 60.
   - Sử dụng Canvas / WebGL / Skia để diễn họa chuyển động nhân vật và tia đạn chiến đấu.
   - Sử dụng `Zustand` với selector cụ thể để tránh re-render component toàn trang.
2. **Kéo Thả 3x3 Tức Thì (< 16ms Latency):**
   - Thao tác kéo thả 6 quân cờ vào 9 ô phải có độ trễ cực thấp, snap-to-grid chính xác vào tâm ô cờ.
   - Phản hồi xúc giác tức thời (âm thanh click kim loại, viền sáng neon).
3. **Hiển Thị Rách Giáp & Climax Cut-In 18+:**
   - Đồng bộ mượt mà sự kiện `ClothDamageUpdate` từ Server, chuyển đổi texture nhẹ nhàng không gây khựng hình.
   - Layer Cut-In phóng to Waifu phải tối ưu texture nén (WebP/AVIF), tự động hủy sau 0.8 giây.
4. **Không Rò Rỉ Bộ Nhớ (Zero Memory Leaks):**
   - Mọi `useEffect` đăng ký WebSocket listener, animation frame, hoặc audio buffer phải có hàm `cleanup()` khi unmount.
   - Sạch hoàn toàn lỗi `console.error` hoặc cảnh báo trong DevTools.
5. **Nền Tảng Expo Universal (React Native Cho Web & Mobile):**
   - Viết 100% bằng **TypeScript Strict Mode** trên nền tảng **Expo SDK 52+**.
   - Đảm bảo mã nguồn component chia sẻ được giữa Web (HTML5/Canvas) và Mobile Native (iOS/Android).
