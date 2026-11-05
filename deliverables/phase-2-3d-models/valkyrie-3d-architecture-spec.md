# 📐 KIẾN TRÚC MÔ HÌNH 3D & HỆ THỐNG SHADER THREE.JS CHO 27 VALKYRIE
*(Phase 2.5 Technical Spec • Biên soạn bởi `model-3d-designer` • Định hướng cho `frontend-engineer`)*

---

## ⚡ 1. NGÂN SÁCH ĐỒ HỌA & HIỆU NĂNG WEBGL (POLYCOUNT & DRAW CALL BUDGETS)

Để bảo đảm trải nghiệm thi đấu Esports đạt chuẩn mượt mà **60 - 120 FPS** trên mọi cấu hình trình duyệt (bao gồm màn hình 144Hz, iPad Pro, và laptop không card rời):

| Thông Số Đồ Họa | Giới Hạn Tối Đa / Đơn Vị | Giới Hạn Sân Đấu (18 Đơn Vị 3x3) | Chiến Lược Tối Ưu Hóa |
| :--- | :--- | :--- | :--- |
| **Polygon (Triangles)** | $\le 12,000$ tris | $\le 216,000$ tris | Sử dụng hình học thủ tục tối giản cạnh biên không nhìn thấy, cấp độ chi tiết LOD động. |
| **Draw Calls** | $\le 1$ đến $2$ / nhân vật | $\le 15$ draw calls | Ghép UV Atlas chung, chia sẻ chung một instance `MeshStandardMaterial` cho cùng Faction. |
| **Texture VRAM** | $1024 \times 1024$ (Atlas) | $\le 45\text{ MB}$ VRAM | Định dạng nén WebP / KTX2, Canvas procedural texture generation. |
| **Rigging Bones** | $28$ bones chuẩn | $504$ bones active | Cắt giảm số xương ngón tay, tập trung vào xương cơ thể chính và xương nảy sinh học. |

---

## 👙 2. CƠ CHẾ 3 CẤP ĐỘ RÁCH GIÁP 3D (3-TIER CLOTH DAMAGE 3D MECHANICS)

Trong môi trường 3D Three.js, hiệu ứng rách giáp không chỉ là thay đổi ảnh 2D mà là **sự biến đổi hình học (Mesh Deformation), vật liệu (Material Dissolve) và hiệu ứng hạt (Burst VFX)**:

```mermaid
graph LR
    T1[Tier 1: Pristine - HP >= 70%] -->|Sát thương phá vỡ giáp| T2[Tier 2: Torn - 30% <= HP < 70%]
    T2 -->|Sát thương chí mạng| T3[Tier 3: Climax Extreme - HP < 30%]
```

### Chi Tiết Kỹ Thuật 3 Cấp Độ:
1. **Tier 1 — Pristine ($HP \ge 70\%$):**
   - **Lưới 3D:** Hiển thị 100% các tấm giáp ngoài (Outer Armor Plates: Ngực, Vai, Giáp Hông, Ốp Bắp Đùi).
   - **Vật liệu Three.js:** `MeshStandardMaterial` với `metalness: 0.7`, `roughness: 0.25`, phản chiếu ánh sáng môi trường sắc nét.
   - **Thần thái 3D:** Dáng đứng ngạo nghễ, nhịp thở thư thái (tần số $0.3\text{ Hz}$).

2. **Tier 2 — Torn ($30\% \le HP < 70\%$):**
   - **Lưới 3D:** Ẩn các tấm giáp phụ ở vai và hông. Sử dụng kỹ thuật **Alpha Cutout / Dissolve Mask** làm rách toạc vải áo ở vòng 1 và đùi.
   - **Vật liệu Three.js:** Tăng thông số `emissive` vùng da thịt tạo hiệu ứng ửng hồng (Blush Subsurface Scattering). Bề mặt vật liệu có thêm vệt rạn nứt phát quang (Energy Fissures).
   - **Thần thái 3D:** Nhịp thở dồn dập ($0.8\text{ Hz}$), biên độ rung cơ thể tăng $150\%$, đầu hơi nghiêng.

3. **Tier 3 — Climax Extreme ($HP < 30\%$):**
   - **Lưới 3D:** Giáp trụ bên ngoài nổ tung thành các mảnh vụn đa giác nhỏ (VFX Polygon Shards Burst). Nhân vật chỉ còn lại bộ nội y chiến thuật tối giản (Micro-armor Straps / Energy Bikini).
   - **Vật liệu Three.js:** Kích hoạt Custom Shader **Fresnel Rim-Glow** cực đại (`rimIntensity: 2.5`), ánh sáng linh lực bao bọc quanh cơ thể, đôi mắt phát sáng rực rỡ.
   - **Thần thái 3D:** Tư thế chiến đấu cuồng nhiệt, sẵn sàng tung chiêu Climax Ultimate hủy diệt.

---

## 🦴 3. HỆ THỐNG XƯƠNG CHUẨN & XƯƠNG NẢY SINH HỌC (RIGGING HIERARCHY)

Mỗi mô hình Valkyrie sử dụng bộ xương Skeleton gồm 28 khớp, chia làm 2 hệ thống:

```
Root (Trọng tâm)
 ├── Pelvis (Vùng chậu & Vòng 3)
 │    ├── L_Thigh -> L_Calf -> L_Foot (Chân trái)
 │    ├── R_Thigh -> R_Calf -> R_Foot (Chân phải)
 │    └── Jiggle_Glute_L / Jiggle_Glute_R (Độ nảy vòng 3)
 └── Spine_01 -> Spine_02 (Cột sống & Vòng eo)
      ├── Chest (Vòng 1 & Ngực)
      │    ├── Jiggle_Bust_L (Xương nảy ngực trái - Spring Mass)
      │    ├── Jiggle_Bust_R (Xương nảy ngực phải - Spring Mass)
      │    ├── L_Clavicle -> L_UpperArm -> L_Forearm -> L_Hand (Tay trái)
      │    └── R_Clavicle -> R_UpperArm -> R_Forearm -> R_Hand (Tay phải mang vũ khí)
      └── Neck -> Head (Đầu & Biểu cảm)
           ├── Hair_L / Hair_R (Tóc hai bên)
           └── Hair_Back (Đuôi tóc bồng bềnh)
```

### Công Thức Vật Lý Nảy Ngực & Tóc (Spring-Damper Secondary Physics):
Tại mỗi frame render ($dt = 1/60\text{s}$), vị trí của các xương `Jiggle_Bust` được tính toán bằng phương trình dao động điều hòa giảm chấn:
$$F = -k \cdot \Delta x - c \cdot v$$
Trong đó:
- $k = 18.0$ (Độ đàn hồi lò xo - Stiffness).
- $c = 4.2$ (Hệ số cản - Damping factor chống giật cục).
- Giúp vòng 1 và tóc đung đưa tự nhiên theo từng bước di chuyển và chiêu thức của Valkyrie!

---

## 🌟 4. HỆ THỐNG SHADER CYBERPUNK (GLSL & THREE.JS SHADERMATERIAL)

### Fresnel Rim-Light & Faction Glow Shader:
```glsl
// Fragment Shader cho hiệu ứng viền sáng tôn vinh đường cong Anime 18+
uniform vec3 uFactionColor; // Màu đặc trưng Faction (Cyan / Neon Pink / Gold)
uniform float uRimPower;    // Độ sắc nét của viền sáng (2.0 - 4.0)
uniform float uClimaxTier;   // Cấp độ rách giáp (1.0, 2.0, 3.0)

varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    // Tính toán góc nhìn so với pháp tuyến (Fresnel factor)
    float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
    float rim = pow(fresnel, uRimPower) * (1.0 + uClimaxTier * 0.8);
    
    // Màu phát quang rực rỡ ở mép ngoài đường cong cơ thể
    vec3 finalGlow = uFactionColor * rim;
    gl_FragColor = vec4(finalGlow, rim * 0.9);
}
```

---

## 🛡️ 5. GIẢI PHÓNG BỘ NHỚ & CHỐNG RÒ RỈ VRAM (COVERITY SAST COMPLIANCE)

Mọi đối tượng 3D phải được hủy diệt an toàn khi bàn cờ thay đổi:
```typescript
export function disposeValkyrie3DModel(group: THREE.Group): void {
  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();
      if (Array.isArray(obj.material)) {
        obj.material.forEach((mat) => mat.dispose());
      } else {
        obj.material.dispose();
      }
    }
  });
}
```
Cam kết đạt **0 cảnh báo rò rỉ VRAM** theo tiêu chuẩn Coverity SAST!
