---
name: game-balance-verifier
description: "Chạy mô phỏng toán học kiểm tra cân bằng đối xứng của thuật toán Vector 8D và giả lập 1,000,000 trận đấu để đảm bảo không tồn tại meta bất khả chiến bại."
---

# QUY TRÌNH KIỂM TOÁN CÂN BẰNG TOÁN HỌC (/game-balance-verifier)

Khi kích hoạt kỹ năng này, `qa-balance-tester` sẽ thực hiện kiểm toán giải thuật 8D Vector và cân bằng giao tranh:

## Bước 1: Kiểm Tra Độ Lệch Bất Đối Xứng (Cosine Asymmetry Test)
- Kiểm tra tính toán Cosine Similarity trong không gian 8 chiều giữa hai người chơi.
- Đảm bảo độ lệch đối xứng của 2 Buff Synergy:
  $$|\text{cos}(\vec{V}_{syn1}, \vec{P}_1) - \text{cos}(\vec{V}_{syn2}, \vec{P}_2)| \le 0.05$$
- Xác minh 2 Buff Pivot trực giao: $|\text{cos}(\vec{V}_b, \vec{P}_k)| \le 0.15$.
- Xác minh mẫu số chia cho `0` luôn được bảo vệ bởi $\epsilon \ge 10^{-9}$.

## Bước 2: Giả Lập 1 Triệu Trận Đấu (1M Battle Monte-Carlo Sim)
- Chạy script mô phỏng 1,000,000 trận đấu đối kháng ngẫu nhiên giữa 8 trường phái Buff chủ đạo (Defense, Burst, Ranged, Sustain, True Dmg, Evasion, Control, Spatial).
- Phân tích biểu đồ phân phối tỷ lệ thắng (Winrate Distribution):
  - Ngưỡng Winrate chuẩn: $48\% - 52\%$.
  - **Ngưỡng Hard-Limit Cấm Vượt:** $\le 53\%$. Nếu có bất kỳ trường phái nào đạt Winrate $> 53\%$, gắn cờ `OVERPOWERED_META_DETECTED` và yêu cầu giảm chỉ số.

## Bước 3: Xuất Báo Cáo Cân Bằng (Balance Verification Report)
- Ghi nhận kết quả vào `.agents/memory/SOLUTION.md` và `.agents/memory/PLAYTEST_SCORECARD.md`.
