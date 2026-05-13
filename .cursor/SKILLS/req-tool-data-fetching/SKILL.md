---
name: req-tool-data-fetching
description: >-
  Đọc GET qua TanStack Query với cache (useCachedGet, queryKeys, invalidate
  có chủ đích). Dùng khi thêm endpoint đọc, hook data, hoặc sửa lib/api +
  hooks.
---

# req-tool-fe — Data fetching và cache

## Khi nào dùng skill này

- Thêm hoặc sửa hook gọi API đọc (GET).
- Thêm service trong `lib/api/services`.
- Sau khi mutation cần cập nhật UI/list/detail.

## Quy tắc bắt buộc

1. **GET** → `useCachedGet({ queryKey, queryFn })` hoặc `useQuery` với cùng default stale/gc (xem `lib/query/defaults.ts`). Không lặp GET thuần trong `useEffect` nếu có thể dùng query.
2. **`queryKey`** → luôn qua `lib/query/query-keys.ts`; thêm namespace mới khi domain mới (ví dụ `projects`, `subjects`).
3. **Làm mới dữ liệu** → `invalidateQueries({ queryKey: ... })` đúng nhánh key; không gọi `invalidateQueries()` không tham số trừ khi toàn app cần refetch.
4. **Login/logout** → đã dùng `queryKeys.auth.all`; các query user/session nên dùng key con của `auth` để invalidation khớp.

## Tham chiếu nhanh

- Defaults: `lib/query/defaults.ts`
- Keys: `lib/query/query-keys.ts`
- Hook: `hooks/useCachedGet.ts`
- Provider: `lib/providers/query-provider.tsx`
- Ví dụ mutation + invalidate: `hooks/useAuth.ts`
