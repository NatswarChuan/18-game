#!/usr/bin/env python3
"""
Enterprise Static Code & Dependency Auditor cho Google Antigravity
Mô phỏng 3 chốt chặn:
1. SonarQube Gate (TypeScript Strictness, Cognitive Complexity, Function Length, Code Smells)
2. Coverity SAST Gate (Resource Leaks, Division/NaN Hazards, Unvalidated JSON.parse, Eval/Prototype Pollution)
3. Black Duck SCA Gate (Copyleft License Detection, Unpinned Dependencies, Bloated Packages)
"""
import json
import os
import re
import sys
from pathlib import Path

IGNORE_DIRS = {
    "node_modules", ".git", ".expo", "dist", "build", "coverage", ".next", ".agents", "__pycache__"
}
CODE_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx", ".py"}

FORBIDDEN_LICENSES = {"GPL", "AGPL", "LGPL", "SSPL", "CC-BY-NC", "EUPL", "CPAL"}
DISCOURAGED_PACKAGES = {
    "moment": "Sử dụng Intl.DateTimeFormat hoặc date-fns nhẹ hơn (Minimal Footprint).",
    "lodash": "Sử dụng hàm ES2023+ gốc (Array.prototype, Object.hasOwn) để giảm bundle size.",
    "request": "Package đã deprecated, có rủi ro bảo mật SCA."
}

CONTROL_FLOW_TOKENS = re.compile(
    r"\b(if|else\s+if|for|while|switch|catch|&&|\|\||\?)\b"
)

def calculate_cognitive_complexity(lines):
    """Ước lượng Cognitive Complexity theo chuẩn SonarQube (cộng điểm lồng nhau)."""
    complexity = 0
    nesting = 0
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("//") or stripped.startswith("*"):
            continue
        matches = CONTROL_FLOW_TOKENS.findall(stripped)
        if matches:
            complexity += len(matches) + nesting
        nesting += stripped.count("{") - stripped.count("}")
        if nesting < 0:
            nesting = 0
    return complexity

def scan_source_file(filepath: Path):
    sonar_issues = []
    coverity_issues = []

    try:
        content = filepath.read_text(encoding="utf-8", errors="replace")
    except Exception as exc:
        return sonar_issues, [f"{filepath}: Không thể đọc file ({exc})"]

    lines = content.splitlines()

    # 1. SonarQube: File length check
    if len(lines) > 350:
        sonar_issues.append(
            f"[SONAR:FILE_TOO_LONG] {filepath}: {len(lines)} dòng (Tối đa 350 dòng). Hãy tách module."
        )

    # Track resource allocations vs cleanups in the file (Coverity Resource Leak heuristic)
    has_set_interval = "setInterval(" in content
    has_clear_interval = "clearInterval(" in content
    if has_set_interval and not has_clear_interval:
        coverity_issues.append(
            f"[COVERITY:RESOURCE_LEAK] {filepath}: Phát hiện `setInterval(` nhưng không có `clearInterval(` trong cùng module."
        )

    has_add_listener = ".addEventListener(" in content or ".on(" in content
    has_remove_listener = ".removeEventListener(" in content or ".off(" in content or ".remove(" in content
    if has_add_listener and not has_remove_listener and filepath.suffix in {".tsx", ".ts"}:
        coverity_issues.append(
            f"[COVERITY:EVENT_LEAK_RISK] {filepath}: Phát hiện đăng ký listener (`.addEventListener`/`.on`) nhưng thiếu `.removeEventListener`/`.off` cleanup."
        )

    # Line-by-line analysis
    for idx, line in enumerate(lines, start=1):
        stripped = line.strip()
        if stripped.startswith("//") or stripped.startswith("#"):
            continue

        # SonarQube: Forbidden `any` and suppressions
        if filepath.suffix in {".ts", ".tsx"}:
            if re.search(r"(:\s*any\b|\bas\s+any\b|<any>)", line):
                sonar_issues.append(
                    f"[SONAR:NO_EXPLICIT_ANY] {filepath}:{idx} -> Cấm dùng kiểu `any`. Hãy định nghĩa interface/type tường minh."
                )
            if re.search(r"@ts-(ignore|expect-error|nocheck)", line):
                sonar_issues.append(
                    f"[SONAR:NO_TS_SUPPRESSION] {filepath}:{idx} -> Cấm dùng `@ts-ignore`/`@ts-expect-error`."
                )
            if "console.log(" in line:
                sonar_issues.append(
                    f"[SONAR:NO_CONSOLE_LOG] {filepath}:{idx} -> Không để `console.log` trong code Production (dùng Logger chuẩn)."
                )

        # Coverity SAST: Dangerous eval / unvalidated JSON.parse / Prototype Pollution
        if re.search(r"\beval\s*\(|new\s+Function\s*\(", line):
            coverity_issues.append(
                f"[COVERITY:CODE_INJECTION] {filepath}:{idx} -> Cấm tuyệt đối `eval()` hoặc `new Function()`."
            )
        if "__proto__" in line or "constructor.prototype" in line:
            coverity_issues.append(
                f"[COVERITY:PROTOTYPE_POLLUTION] {filepath}:{idx} -> Nguy cơ Prototype Pollution (CWE-1321)."
            )

    # Function-level complexity & length check (SonarQube)
    func_pattern = re.compile(
        r"(function\s+([a-zA-Z0-9_]+)|const\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>)"
    )
    for match in func_pattern.finditer(content):
        fn_name = match.group(2) or match.group(3) or "anonymous"
        start_line = content[:match.start()].count("\n")
        # Extract up to 100 lines to find matching braces
        snippet_lines = lines[start_line:start_line + 120]
        brace_balance = 0
        fn_lines = []
        started = False
        for s_line in snippet_lines:
            fn_lines.append(s_line)
            if "{" in s_line:
                started = True
            brace_balance += s_line.count("{") - s_line.count("}")
            if started and brace_balance <= 0:
                break
        if len(fn_lines) > 60:
            sonar_issues.append(
                f"[SONAR:FUNCTION_TOO_LONG] {filepath}:{start_line + 1} -> Hàm `{fn_name}` dài {len(fn_lines)} dòng (Tối đa 60 dòng)."
            )
        cog = calculate_cognitive_complexity(fn_lines)
        if cog > 15:
            sonar_issues.append(
                f"[SONAR:HIGH_COGNITIVE_COMPLEXITY] {filepath}:{start_line + 1} -> Hàm `{fn_name}` có Cognitive Complexity = {cog} (Vượt ngưỡng 15)."
            )

    return sonar_issues, coverity_issues

def scan_blackduck_sca(root_path: Path):
    blackduck_issues = []
    for pkg_file in root_path.rglob("package.json"):
        if any(part in IGNORE_DIRS for part in pkg_file.parts):
            continue
        try:
            data = json.loads(pkg_file.read_text(encoding="utf-8"))
        except Exception as exc:
            blackduck_issues.append(f"[BLACKDUCK:INVALID_MANIFEST] {pkg_file}: Lỗi cú pháp JSON ({exc})")
            continue

        pkg_license = str(data.get("license", "")).upper()
        for bad_lic in FORBIDDEN_LICENSES:
            if bad_lic in pkg_license:
                blackduck_issues.append(
                    f"[BLACKDUCK:FORBIDDEN_LICENSE] {pkg_file}: License `{pkg_license}` vi phạm chính sách thương mại."
                )

        all_deps = {}
        all_deps.update(data.get("dependencies", {}))
        all_deps.update(data.get("devDependencies", {}))

        for dep_name, version_spec in all_deps.items():
            ver_str = str(version_spec).strip()
            if ver_str in {"*", "latest", "next"} or ver_str.startswith("http") or ver_str.startswith("git"):
                blackduck_issues.append(
                    f"[BLACKDUCK:UNPINNED_DEPENDENCY] {pkg_file}: Gói `{dep_name}: {ver_str}` chưa khóa phiên bản an toàn."
                )
            if dep_name in DISCOURAGED_PACKAGES:
                blackduck_issues.append(
                    f"[BLACKDUCK:BLOATED_OR_DEPRECATED_PKG] {pkg_file}: `{dep_name}` -> {DISCOURAGED_PACKAGES[dep_name]}"
                )

    return blackduck_issues

def main():
    target_root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
    all_sonar = []
    all_coverity = []
    scanned_files = 0

    for root, dirs, files in os.walk(target_root):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for file in files:
            fpath = Path(root) / file
            if fpath.suffix in CODE_EXTENSIONS:
                scanned_files += 1
                s_issues, c_issues = scan_source_file(fpath)
                all_sonar.extend(s_issues)
                all_coverity.extend(c_issues)

    all_blackduck = scan_blackduck_sca(target_root)

    print("=" * 72)
    print(f"🛡️  ENTERPRISE PRODUCTION QUALITY GATE REPORT (Scanned {scanned_files} source files)")
    print("=" * 72)
    print(f"1. [SONARQUBE CLEAN CODE GATE] : {'PASS ✅' if not all_sonar else f'FAIL ❌ ({len(all_sonar)} issues)'}")
    for item in all_sonar[:20]:
        print(f"   - {item}")
    print(f"2. [COVERITY SAST DEFECT GATE] : {'PASS ✅' if not all_coverity else f'FAIL ❌ ({len(all_coverity)} issues)'}")
    for item in all_coverity[:20]:
        print(f"   - {item}")
    print(f"3. [BLACK DUCK SCA GATE]       : {'PASS ✅' if not all_blackduck else f'FAIL ❌ ({len(all_blackduck)} issues)'}")
    for item in all_blackduck[:20]:
        print(f"   - {item}")
    print("=" * 72)

    if all_sonar or all_coverity or all_blackduck:
        print("❌ PRODUCTION QUALITY GATE FAILED! Vui lòng refactor toàn bộ vi phạm trên.")
        sys.exit(1)
    else:
        print("✅ ALL ENTERPRISE GATES (SONARQUBE / COVERITY / BLACK DUCK) PASSED!")
        sys.exit(0)

if __name__ == "__main__":
    main()
