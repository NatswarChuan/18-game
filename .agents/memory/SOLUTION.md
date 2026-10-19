# 💡 NHẬT KÝ GIẢI PHÁP KỸ THUẬT & KIẾN TRÚC (ARCHITECTURAL SOLUTIONS)
*(Valkyrie Protocol: Zero • Antigravity Ecosystem)*

---

## 🛠️ DANH SÁCH GIẢI PHÁP ĐÃ THÔNG QUA

### 1. Phân Tách Client / Server & Deployment Từ Con Số 0
- **Vấn đề:** Tránh lẫn lộn logic tính toán giữa Client và Server; đảm bảo có tài liệu triển khai Production đầy đủ.
- **Giải pháp:**
  - Tổ chức Monorepo chuẩn mực với `packages/shared-domain` (0 dependency).
  - Soạn thảo tài liệu triển khai chi tiết từng bước tại [`DEPLOYMENT_GUIDE.md`](../../DEPLOYMENT_GUIDE.md).
  - Đóng gói toàn bộ hệ thống bằng Docker Compose (Nginx SSL, Client Nginx, Server Node.js, Redis).

### 2. Hệ Thống 5 Agent Độc Lập Theo Mô Hình Waterfall
- **Vấn đề:** Cần phân tách rõ ràng trách nhiệm giữa Kiến trúc, Thiết kế, Backend, Frontend, và QA mà không bị chồng chéo.
- **Giải pháp:**
  - Thiết lập 5 file `agent.md` độc lập trong `.agents/agents/`.
  - Thiết lập tài liệu quy trình Waterfall 6 giai đoạn tại [`WATERFALL_WORKFLOW.md`](../../WATERFALL_WORKFLOW.md) với các Cổng nghiệm thu (Gate 1 đến Gate 6) khắt khe.

### 3. Đồng Nhất Bản Sắc Anime 18+ & Game Thủ Khó Tính
- **Vấn đề:** Tạo ra trải nghiệm vừa có chiều sâu chiến thuật công bằng tuyệt đối (Pure-Skill 3x3), vừa mang đậm tính thẩm mỹ quyến rũ của dòng game Anime 18+.
- **Giải pháp:**
  - Thiết kế cơ chế **3 Cấp Độ Rách Giáp (Battle Damage Tiers: Pristine $\rightarrow$ Torn $\rightarrow$ Climax Extreme)** phản ứng theo HP thực tế trong ván đấu.
  - Hoạt cảnh **Climax Ultimate Cut-In** phóng đại cận cảnh khuôn mặt Waifu khi đạt 100 Mana.
  - Giữ vững công thức cân bằng đối xứng **8D Vector 2-2-2-3 Formula** để không bao giờ có Buff nào bị mất cân bằng.

### 4. Tự Động Cài Đặt Môi Trường & Chạy Local Không Cần Deploy
- **Vấn đề:** Người dùng muốn chạy thử nghiệm ngay trên máy local mà không cần phải deploy hay cấu hình Docker/Redis phức tạp.
- **Giải pháp:**
  - Soạn thảo cẩm nang [`LOCAL_SETUP_GUIDE.md`](../../LOCAL_SETUP_GUIDE.md) và kỹ năng `/local-dev-bootstrap`.
  - Tích hợp cờ `USE_IN_MEMORY_STORE=true` cho Server Node.js: Tự động lưu phòng đấu trên RAM nếu không có Redis.
  - Trao quyền cho Agent chủ động dùng `run_command` chạy background daemon servers (`IsDaemon: true`) mà không cần hỏi xin phép.

### 5. Chuẩn Hóa Code-Style, Design Patterns & Khả Năng Bảo Trì (Maintainability)
- **Vấn đề:** Dự án cần đảm bảo chất lượng mã nguồn chuẩn công nghiệp, dễ mở rộng, dễ đọc hiểu và dễ bảo trì lâu dài.
- **Giải pháp:**
  - Ban hành quy tắc [`08-code-style-design-patterns-maintainability.md`](../rules/08-code-style-design-patterns-maintainability.md) (Always-On).
  - Triển khai toàn diện **5 nguyên lý SOLID** và danh mục **7 Design Patterns chuẩn mực**: Strategy Pattern (lưới 3x3), State Machine (vòng đời BO3/BO5), Command Pattern (Intents người chơi), Observer Pattern (sự kiện combat), Adapter Pattern (kho lưu trữ phòng đấu), Factory Pattern (khởi tạo Valkyrie & Buff), và Result Pattern (xử lý lỗi an toàn không exception).
  - Áp dụng chuẩn cú pháp **Google / Airbnb TypeScript Style Guide**, quy ước đặt tên chặt chẽ (`is`/`has` boolean, PascalCase, camelCase, UPPER_SNAKE_CASE), tính bất biến tuyệt đối (`readonly`, không mutate state), và bắt buộc viết chú thích TSDoc song ngữ Anh/Việt cho toàn bộ hàm domain xuất bản.

### 6. Kiến Trúc Công Nghệ Thống Nhất: Expo (Universal Web & Mobile), NestJS, NoSQL & 100% TypeScript
- **Vấn đề:** Cần đồng nhất mã nguồn giữa Web và Mobile từ 1 codebase duy nhất, xây dựng Server chuẩn Enterprise mạnh mẽ, và sử dụng cơ sở dữ liệu NoSQL phù hợp với đặc thù dữ liệu game.
- **Giải pháp:**
  - **Client:** Sử dụng **Expo SDK 52+** (React Native Universal) biên dịch đồng thời cho cả Web (HTML5/Canvas) và Mobile (iOS/Android), kết hợp `@shopify/react-native-skia` và `react-native-reanimated` đạt chuẩn 60–120 FPS.
  - **Server:** Sử dụng **NestJS Framework** với cấu trúc module Dependency Injection, `@WebSocketGateway()` xử lý vòng lặp chiến đấu 20 ticks/s.
  - **Database NoSQL:** Sử dụng **MongoDB (Mongoose)** cho dữ liệu bền vững (Player, MatchHistory, Waifu collection) và **Redis / In-Memory RAM** cho dữ liệu phòng đấu thời gian thực.
  - **Ngôn ngữ:** Ép buộc **100% TypeScript Strict Mode** trên toàn bộ Monorepo (`apps/client`, `apps/server`, `packages/shared-domain`).

### 7. Thư Mục Lưu Trữ Kết Quả Deliverables & Chuẩn Bàn Giao Cho Từng Phase
- **Vấn đề:** Các agent triển khai code (BE, FE) và kiểm thử (QA) cần có thư mục lưu trữ kết quả bàn giao chính thức từ `system-architect` và `art-designer` để căn cứ vào đó thực thi.
- **Giải pháp:**
  - Thiết lập thư mục [`deliverables/phase-1-architecture/`](../../deliverables/phase-1-architecture/README.md) chứa toàn bộ spec kiến trúc, hợp đồng WebSocket và schema NoSQL.
  - Thiết lập thư mục [`deliverables/phase-2-art-design/`](../../deliverables/phase-2-art-design/README.md) chứa toàn bộ Design Tokens, dàn 27 Valkyries, 3 cấp độ Cloth Damage, Wireframes 3x3, Storyboard Cut-In, Audio Spec và Assets Concept Art.
  - Áp dụng triệt để đường dẫn tương đối (Relative Paths) trên toàn bộ hệ thống tài liệu.
