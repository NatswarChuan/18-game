---
trigger: always_on
description: "Tiêu chuẩn code Production bắt buộc: Ngữ pháp & Design Pattern nghiêm ngặt, SonarQube Clean Code, Coverity SAST và Black Duck SCA."
---

# QUY TẮC CODE PRODUCTION: SONARQUBE / COVERITY / BLACK DUCK (ALWAYS-ON)

Mọi dòng code được sinh ra hoặc chỉnh sửa trong dự án phải tuân thủ tuyệt đối tài liệu `@[Production Coding Standards](CODING_STANDARDS_PRODUCTION.md)`:

1. **Ngữ pháp Ngôn ngữ & Kiến trúc (Language & Pattern Strictness):**
   - **TypeScript Strict 100%:** Cấm sử dụng `any`, `@ts-ignore`, `@ts-expect-error`, `eval()`, và toán tử `!` (non-null assertion). Mọi hàm xuất ra (exported functions) phải khai báo kiểu trả về (Explicit Return Type) rõ ràng.
   - **Clean Architecture:** Tách biệt hoàn toàn `domain/` (luật bàn cờ 3x3, Vector 8D, công thức sát thương thuần túy, không phụ thuộc framework) khỏi `infrastructure/` (WebSocket, DB) và `presentation/` (Expo UI/Skia).
   - **Pattern bàn cờ 3x3:** Sử dụng **Strategy Pattern** hoặc **Lookup Table bất biến (`Readonly<Record<SlotIndex, SlotBehavior>>`)** thay vì viết `if/else` hay `switch/case` dài dòng cho 9 ô cờ.

2. **Chốt chặn SonarQube (Maintainability & Reliability):**
   - **Cognitive Complexity `<= 15`** và **Cyclomatic Complexity `<= 10`** cho mỗi hàm.
   - Chiều dài hàm tối đa **`60 dòng`**, chiều dài file tối đa **`350 dòng`**, số tham số hàm tối đa **`4`** (nếu nhiều hơn phải dùng Object parameter).
   - **Cấm Magic Numbers:** Mọi hằng số (`1000` HP, `50` ATK, `0.15` Mana Frontline, `0.25` Flanking, `20` giây Draft) phải đặt trong file `constants.ts` với `as const`.
   - Cấm để lại `console.log` (phải dùng Structured Logger), code chết (dead code), hoặc Promise không có `await`/`catch`.

3. **Chốt chặn Coverity SAST (Defect & Security Prevention):**
   - **Chống Null/Undefined Dereference:** Luôn kiểm tra phần tử mảng trước khi truy xuất (`noUncheckedIndexedAccess`).
   - **Chống Rò rỉ Tài nguyên (`RESOURCE_LEAK`):** Mọi timer (`setInterval`, `setTimeout`), WebSocket listener, Animation frame và GPU texture/shader trên Expo hoặc MatchRoom trên Server phải có cơ chế `dispose()` / `cleanup()` tường minh.
   - **Chống NaN / Chia cho 0 (`DIVIDE_BY_ZERO`):** Mọi phép chia trong Cosine Similarity 8 chiều và công thức Giáp phải có nhánh bảo vệ khi mẫu số tiến về `0`.
   - **Xác thực Đầu vào (`TAINTED_DATA`):** Mọi payload từ Client gửi lên Server phải được validate bằng Schema (như `zod` hoặc Type Guard) trước khi đưa vào Engine.

4. **Chốt chặn Black Duck SCA (License & Vulnerability Compliance):**
   - Chỉ được dùng thư viện có giấy phép thương mại an toàn (`MIT`, `Apache-2.0`, `BSD`, `ISC`). **Cấm tuyệt đối** thêm thư viện dính giấy phép Copyleft (`GPL`, `AGPL`, `LGPL`, `SSPL`, `CC-BY-NC`).
   - Cấm thêm gói thư viện ngoài cho các phép toán có thể viết bằng TypeScript thuần dưới 30 dòng (như tích vô hướng và chuẩn hóa Vector 8 chiều).
   - Không được phép tồn tại bất kỳ lỗ hổng `High` hoặc `Critical` CVE nào trong `package.json`.
