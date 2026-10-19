# 🛡️ ENTERPRISE QUALITY GATE CHECKLIST (SONARQUBE / COVERITY / BLACK DUCK)

## A. SonarQube Clean Code Checklist
- [ ] **Zero `any` & Type Suppressions:** Không có `: any`, `as any`, `@ts-ignore`, `@ts-expect-error`, `eslint-disable`.
- [ ] **Cognitive Complexity <= 15:** Không có hàm nào lồng quá 3 tầng điều kiện/vòng lặp.
- [ ] **Function Length <= 60 lines:** Các hàm xử lý giao tranh 3x3 và render UI được chia nhỏ theo nguyên lý Single Responsibility (SRP).
- [ ] **No Floating Promises:** Mọi lời gọi bất đồng bộ đều được `await` hoặc gắn `.catch()`.
- [ ] **No Magic Numbers:** Toàn bộ thông số Game Design được trích xuất ra hằng số định danh.

## B. Coverity SAST Defect Checklist
- [ ] **Zero Resource Leaks:**
  - Mọi `setInterval` / `setTimeout` có `clearInterval` / `clearTimeout` tương ứng.
  - Mọi `addEventListener` / `socket.on` có `removeEventListener` / `socket.off` trong cleanup.
- [ ] **Null & Bounds Safety:** Truy cập mảng 9 ô (`0..8`) luôn kiểm tra biên (`index >= 0 && index < 9`) và kiểm tra tồn tại phần tử.
- [ ] **Arithmetic Safety:** Phép chia trong Cosine Similarity và giảm sát thương Giáp/Kháng phép có guard chống chia cho `0` (`NaN` / `Infinity`).
- [ ] **Input Sanitization:** Dữ liệu từ WebSocket client được kiểm tra schema chặt chẽ trước khi thực thi.

## C. Black Duck SCA Checklist
- [ ] **License Compliance:** 100% dependencies trong `package.json` thuộc nhóm Permissive (`MIT`, `Apache-2.0`, `BSD`, `ISC`). Không có `GPL`, `AGPL`, `LGPL`, `SSPL`.
- [ ] **Dependency Pinning:** Không dùng dải phiên bản lỏng lẻo như `"*"` hoặc `"latest"` trong `package.json`.
- [ ] **Minimal Footprint:** Không cài thư viện ngoài cho các tác vụ mảng/toán học cơ bản.
