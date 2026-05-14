---
name: req-tool-file-naming
description: >-
  Đặt tên file TS/TSX trong App Router (camelCase cho `app/**/components/*`),
  giữ page/layout Next. Dùng khi tạo route mới, tách component, hoặc rename
  file dưới app/.
---

# req-tool-fe — Đặt tên file

## Bắt buộc đọc

- Rule chi tiết: `.cursor/RULES/file-naming.mdc`

## Tóm tắt

| Vị trí | Quy ước |
|--------|---------|
| `app/**/components/*.tsx` (và `.ts` cùng cấp) | **camelCase** — `orgAppHeader.tsx`, `membersSidePanel.tsx` |
| `app/**/page.tsx`, `layout.tsx`, … | Giữ tên Next.js |
| `components/ui/*` | Theo shadcn / repo (thường kebab) |
| `hooks/`, `lib/` | camelCase |

Khi đổi tên file: cập nhật mọi import tương đối / alias; ưu tiên **giữ tên export** (component/hàm) nếu không cần đổi API công khai.

**Context:** hook + `createContext` nên nằm file riêng cùng route, không đặt trong `layout.tsx` rồi import từ descendant (tránh duplicate context khi bundle).
