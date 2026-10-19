---
name: production-quality-gate
description: "Chạy bộ kiểm toán Production Quality Gate toàn diện theo chuẩn SonarQube (Clean Code/Complexity), Coverity (SAST/Memory Leaks/Null Safety) và Black Duck (SCA/Licenses/CVEs)."
---

# QUY TRÌNH KIỂM TOÁN CHẤT LƯỢNG CODE PRODUCTION (/production-quality-gate)

Khi kỹ năng này được kích hoạt (trực tiếp qua lệnh `/production-quality-gate` hoặc nằm trong vòng lặp `/autonomous-playtest-loop`), hãy thực hiện nghiêm ngặt các bước sau:

## Bước 1: Chạy Trình Quét Tĩnh SonarQube / Coverity / Black Duck
Chạy lệnh sau trong Terminal để quét toàn bộ source code hiện tại:

```bash
python3 .agents/skills/production-quality-gate/scripts/audit_sonar_coverity_blackduck.py .
```

## Bước 2: Kiểm tra Trình biên dịch & Linter Nghiêm ngặt
- Nếu dự án có `tsconfig.json`, chạy `npx tsc --noEmit --strict` để đảm bảo 0 lỗi kiểu dữ liệu.
- Nếu dự án có `package.json`, kiểm tra `npm audit --audit-level=high` (nếu có mạng) hoặc đối chiếu danh sách thư viện qua script ở Bước 1.

## Bước 3: Triệu hồi Subagent `secops-quality-gate`
- Dùng `invoke_subagent` gọi `secops-quality-gate` để phân tích báo cáo từ Bước 1 & Bước 2 kết hợp với `@[Enterprise Gate Checklist](references/enterprise-gate-checklist.md)`.
- Nếu có bất kỳ vi phạm nào thuộc nhóm **SonarQube Complexity/Type Safety**, **Coverity Resource Leak/Null Hazard**, hoặc **Black Duck License/CVE**, lập tức refactor code theo đúng Design Pattern chuẩn trước khi cho phép chuyển sang bước tiếp theo.
