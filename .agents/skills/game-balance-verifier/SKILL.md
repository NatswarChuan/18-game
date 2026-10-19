---
name: game-balance-verifier
description: "Chạy mô phỏng toán học kiểm tra cân bằng đối xứng của thuật toán Vector 12D và giả lập 1,000,000 trận đấu để đảm bảo không tồn tại meta bất khả chiến bại."
---

# QUY TRÌNH KIỂM TOÁN CÂN BẰNG TOÁN HỌC (/game-balance-verifier)

Khi kích hoạt kỹ năng này, `qa-balance-tester` sẽ thực hiện kiểm toán giải thuật 12D Vector và cân bằng giao tranh:

## Bước 1: Kiểm Tra Độ Lệch Bất Đối Xứng (12D Cosine Asymmetry & Orthogonality Test)
- Chạy script kiểm toán:
  ```bash
  python3 .agents/skills/game-balance-verifier/scripts/verify_12d_equilibrium.py
  ```
- Kiểm tra tính toán Cosine Similarity trong không gian 12 chiều giữa hai người chơi:
  - 12 Chiều: Physical, Magic, Armor, Shield, Crit, Energy, CC, Spatial 3x3, Erotic/Cloth Damage, Synergy Depth, Counter Intensity, Decisive Impact.
- Đảm bảo độ lệch đối xứng của các Buff Synergy:
  $$|\text{cos}(\vec{V}_{syn1}, \vec{P}_1) - \text{cos}(\vec{V}_{syn2}, \vec{P}_2)| \le 0.05$$
- Xác minh Buff Pivot/Counter trực giao: $|\text{cos}(\vec{V}_b, \vec{P}_k)| \le 0.15$.
- Xác minh mẫu số chia cho `0` luôn được bảo vệ bởi $\epsilon \ge 10^{-9}$.

## Bước 2: Giả Lập 1 Triệu Trận Đấu (1M Battle Monte-Carlo Sim)
- Giả lập 1,000,000 trận đấu đối kháng giữa các trường phái Buff chủ đạo (Defense, Burst, Ranged, Sustain, True Dmg, Evasion, Control, Spatial).
- Phân tích biểu đồ phân phối tỷ lệ thắng (Winrate Distribution):
  - Ngưỡng Winrate chuẩn: $48\% - 52\%$.
  - **Ngưỡng Hard-Limit Cấm Vượt:** $\le 53\%$. Nếu có bất kỳ trường phái nào đạt Winrate $> 53\%$, gắn cờ `OVERPOWERED_META_DETECTED` và yêu cầu giảm chỉ số.

## Bước 3: Xuất Báo Cáo Cân Bằng (Balance Verification Report)
- Ghi nhận kết quả vào [SOLUTION.md](../../memory/SOLUTION.md) và [PLAYTEST_SCORECARD.md](../../memory/PLAYTEST_SCORECARD.md).

