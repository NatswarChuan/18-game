# 🗿 GIAI ĐOẠN 2.5: ĐẶC TẢ MÔ HÌNH 3D & KIẾN TRÚC THREE.JS CHO 27 VALKYRIE
*(Deliverable Repository • Chủ trì bởi `model-3d-designer` • Chuyển giao trực tiếp cho `frontend-engineer`)*

---

## 🌟 1. MỤC TIÊU & TẦM NHÌN KỸ THUẬT (3D TECHNICAL ART VISION)

Tài liệu này được biên soạn bởi **Lead 3D Technical Artist & Valkyrie Model Architect (`model-3d-designer`)** nhằm thiết lập cầu nối kỹ thuật chuẩn mực giữa bản vẽ ý niệm 2D (từ `art-designer`) và mã nguồn lập trình đồ họa Three.js / WebGL của `frontend-engineer`.

### 3 Trụ Cột Tối Thượng:
1. **Thẩm Mỹ 3D Anime 18+ Đỉnh Cao (Ecchi/Stylized 3D Fidelity):**
   - Tái hiện trọn vẹn đường cong giải phẫu nữ tính quyến rũ cho toàn bộ 27 Valkyrie.
   - Cơ chế biến dạng lưới 3 Cấp độ Rách Giáp (**3-Tier Cloth Damage Mesh Deformation**).
   - Hệ thống xương phụ diễn hoạt độ nảy ngực, tóc, vạt áo (Bust/Hair Jiggle Secondary Physics).
2. **Hiệu Năng 60-120 FPS Chuẩn Mực Esports (WebGL Optimization):**
   - Ngân sách đa giác tối đa $\le 12,000$ triangles / Valkyrie.
   - Tổng 18 nhân vật trên sân đấu (9 quân ta + 9 quân địch) đạt $\le 216,000$ triangles.
   - Hạn chế tối đa draw calls thông qua shared materials và instancing.
3. **Không Phụ Thuộc Tải Mạng Nặng Nề (Zero Latency Procedural Pipeline):**
   - Hỗ trợ xây dựng nhân vật 3D thủ tục bằng Three.js BufferGeometries (Capsule, Cylinder, Torus, ExtrudeGeometry) kết hợp Dynamic Canvas Textures và Custom Shaders, hiển thị tức thì 0ms mà không cần đợi tải các file 3D GLTF 50MB.

---

## 📂 2. CẤU TRÚC DANH MỤC TÀI LIỆU (DELIVERABLES MANIFEST)

| Tài Liệu Kỹ Thuật | Trách Nhiệm | Nội Dung Chính |
| :--- | :--- | :--- |
| [`valkyrie-3d-architecture-spec.md`](./valkyrie-3d-architecture-spec.md) | `model-3d-designer` | Kiến trúc Three.js, Polycount budget, Shaders PBR, Rigging Hierarchy, và Shader Rách Giáp 3D. |
| [`character-3d-specs-27-valkyries.md`](./character-3d-specs-27-valkyries.md) | `model-3d-designer` | Hồ sơ 3D chi tiết cho 27 Valkyries: Tỉ lệ cơ thể, Vũ khí, Biến dạng giáp 3 Tier, Hoạt ảnh 3D. |
| [`threejs-implementation-guide.md`](./threejs-implementation-guide.md) | `model-3d-designer` $\rightarrow$ `frontend-engineer` | Code Blueprint Three.js TypeScript mẫu, Factory tạo nhân vật 3D, Quản lý VRAM chống rò rỉ. |

---

## 🤝 3. KÝ DUYỆT BÀN GIAO & CỔNG CHẤT LƯỢNG (STAGE-GATE CRITERIA)
- [x] Đã hoàn thành 100% hồ sơ 3D cho 27 Valkyries theo thiết kế của `art-designer`.
- [x] Đảm bảo ngân sách đa giác $\le 12,000$ triangles / unit.
- [x] Cung cấp mã nguồn Three.js mẫu không rò rỉ bộ nhớ GPU (`Coverity SAST`).
- [ ] Ký duyệt bàn giao cho `frontend-engineer` tích hợp vào `apps/client`.
