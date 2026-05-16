# API — Mô hình yêu cầu (Actor workspace)

Tài liệu cho màn `actors/[actorId]`: React Flow canvas (cây dọc), palette Epic / Feature / User Story, panel chi tiết bên phải.

**Trạng thái FE hiện tại:** dữ liệu mock (`model/requirementsModelMock.ts`). Chưa gọi API thật.

**Quy ước chung (khớp `lib/api/services/fetchActor.ts`):**

- Base: `/api/v1`
- Envelope: `{ success: boolean; data: T; message: string | null }`
- Wire: **snake_case**; app map sang camelCase trong service layer
- Auth: cookie/session như các API dự án khác

---

## Phạm vi trang

| Thành phần | Hành vi UI | API |
|------------|------------|-----|
| **Actor** | 1 node cố định theo `actorId` route; không panel chi tiết; có thể kéo trên canvas | GET actor (đã có) |
| **Epic** | Kéo từ palette → tự gắn Actor; panel sửa; xóa node | CRUD + liên kết Actor |
| **Feature** | Thuộc Epic; nối tay Epic→Feature; quick-add từ Epic | CRUD |
| **User Story** | Thuộc Feature; nối tay Feature→Story | CRUD |
| **Cạnh** | Epic→Feature, Feature→Story (animated); Actor→Epic khi thả Epic | Quan hệ cha–con hoặc bảng link |

**Phân cấp hợp lệ:**

```text
Actor → Epic → Feature → User Story
```

---

## API đã có (Actor)

### GET — Danh sách actors dự án

`GET /api/v1/projects/{project_id}/actors`

Dùng ở danh sách actors dự án, không phải graph đầy đủ của một actor.

**Response `data[]` (item):**

| Field | Type | Ghi chú |
|-------|------|---------|
| `id` | uuid | |
| `project_id` | uuid | |
| `name` | string | Map UI: `ActorNodeData.title` |
| `role_description` | string | Map UI: `roleDescription` / mô tả ngắn |
| `created_at` | ISO8601 | |

Service: `fetchActor.list` · Query key: `projectActorsQueryKey(projectId)`.

### GET — Chi tiết một actor (đề xuất bổ sung)

`GET /api/v1/projects/{project_id}/actors/{actor_id}`

Cần cho header trang + node Actor trên canvas (thay `getRequirementsModelActorMeta` mock).

Response cùng shape một `ProjectActorRow` như trên.

> **Ghi chú UI:** `ActorNodeData` còn field `description` (đoạn dài trên card). API hiện chỉ có `role_description`. Backend có thể thêm `description` optional hoặc FE gộp `role_description` vào card.

### PATCH / DELETE actor

Đã có trong `fetchActor` nhưng **không dùng** trên màn requirements model (actor không chỉnh từ panel).

---

## API đề xuất — Tải cả cây (ưu tiên)

Một request để hydrate React Flow thay cho mock.

### GET — Requirement model theo actor

`GET /api/v1/projects/{project_id}/actors/{actor_id}/requirement-model`

**Response `data`:**

```json
{
  "actor": {
    "id": "uuid",
    "project_id": "uuid",
    "name": "Quản lý cửa hàng",
    "role_description": "…",
    "description": "…",
    "created_at": "…",
    "updated_at": "…"
  },
  "epics": [ { "…": "EpicRecord + id" } ],
  "features": [ { "…": "FeatureRecord + id" } ],
  "user_stories": [ { "…": "UserStoryRecord + id" } ],
  "canvas": {
    "nodes": [
      { "id": "uuid", "kind": "epic|feature|userStory", "position": { "x": 0, "y": 0 }, "collapsed": false }
    ],
    "edges": [
      { "id": "string", "source": "uuid", "target": "uuid" }
    ]
  }
}
```

**Quy tắc graph:**

- Luôn có đúng **1** actor trong response (khớp `actor_id`).
- Quan hệ suy ra từ FK + `canvas.edges`:
  - `actor` → `epic`: edge hoặc `epic.actor_id` / bảng `actor_epics`
  - `epic` → `feature`: `feature.epic_id`
  - `feature` → `user_story`: `user_story.feature_id`
- Nếu không lưu layout: FE chạy `layoutRequirementTree()` client-side (như mock).

**Query key đề xuất:**

```ts
["projects", projectId, "actors", actorId, "requirement-model"]
```

---

## Entity schemas (khớp types FE)

Các file tham chiếu: `epic/epicTypes.ts`, `features/featureTypes.ts`, `userStory/storyTypes.ts`.

### Epic

| Field | Type | Enum / ghi chú |
|-------|------|----------------|
| `id` | uuid | |
| `project_id` | uuid | |
| `actor_id` | uuid | Gắn epic với actor trang hiện tại |
| `prefix` | string | VD: `EPIC-01` |
| `title` | string | |
| `description` | string | |
| `status` | string | `draft` \| `active` \| `done` \| `archived` |
| `priority` | string | `low` \| `medium` \| `high` \| `critical` |
| `labels` | string | Chuỗi, phân tách `,` hoặc `;` |
| `references` | string | |
| `created_at` | ISO8601 | |
| `updated_at` | ISO8601 | |

### Feature

| Field | Type | Enum / ghi chú |
|-------|------|----------------|
| `id` | uuid | |
| `epic_id` | uuid | |
| `prefix` | string | |
| `title` | string | |
| `description` | string | |
| `status` | string | Cùng enum epic |
| `priority` | string | Cùng enum epic |
| `labels` | string | |
| `nfr_note` | string | |
| `references` | string | |
| `warnings` | string[] | |
| `created_at` | ISO8601 | |
| `updated_at` | ISO8601 | |

### User Story

| Field | Type | Enum / ghi chú |
|-------|------|----------------|
| `id` | uuid | |
| `feature_id` | uuid | |
| `prefix` | string | |
| `title` | string | |
| `description` | string | |
| `actor_ref` | string | Tên actor (gợi ý = actor hiện tại) |
| `action_text` | string | |
| `goal_text` | string | |
| `status` | string | Cùng enum epic |
| `priority` | string | Cùng enum epic |
| `labels` | string | |
| `references` | string | |
| `story_points` | number | |
| `sprint_id` | uuid \| null | |
| `acceptance_criteria` | array | `{ id, text, done }[]` |
| `created_at` | ISO8601 | |
| `updated_at` | ISO8601 | |

---

## CRUD — Epic

Gắn với `project_id` + `actor_id` (actor trang).

| Method | Path | UI trigger |
|--------|------|------------|
| `POST` | `/api/v1/projects/{project_id}/actors/{actor_id}/epics` | Kéo Epic từ palette |
| `PATCH` | `/api/v1/projects/{project_id}/epics/{epic_id}` | Panel chi tiết (debounce / Save) |
| `DELETE` | `/api/v1/projects/{project_id}/epics/{epic_id}` | Xóa node trên canvas |

**POST body (snake_case):** các field writable của Epic (không gửi `id`, `created_at`).

**PATCH body:** partial các field trên.

**POST response:** epic đầy đủ + có thể trả sẵn `canvas_node` `{ position, collapsed }` nếu client gửi `position` trong body.

---

## CRUD — Feature

| Method | Path | UI trigger |
|--------|------|------------|
| `POST` | `/api/v1/projects/{project_id}/epics/{epic_id}/features` | Palette / quick-add (+) trên Epic |
| `PATCH` | `/api/v1/projects/{project_id}/features/{feature_id}` | Panel chi tiết |
| `DELETE` | `/api/v1/projects/{project_id}/features/{feature_id}` | Xóa node |

**POST body:** `epic_id` implicit từ path; các field Feature.

Xóa feature: backend nên cascade hoặc chặn nếu còn user stories (trả 409 + message).

---

## CRUD — User Story

| Method | Path | UI trigger |
|--------|------|------------|
| `POST` | `/api/v1/projects/{project_id}/features/{feature_id}/user-stories` | Kéo từ palette |
| `PATCH` | `/api/v1/projects/{project_id}/user-stories/{user_story_id}` | Panel (gồm `acceptance_criteria`) |
| `DELETE` | `/api/v1/projects/{project_id}/user-stories/{user_story_id}` | Xóa node |

**PATCH `acceptance_criteria`:** gửi full mảng (FE đã quản lý list trong form).

---

## Liên kết (edges) — tùy thiết kế backend

### Cách A — Chỉ FK (đơn giản)

Không cần API edge riêng:

- Gắn Epic→Actor: `POST` epic kèm `actor_id` hoặc `POST .../actor-epic-links`
- Gắn Feature→Epic: `feature.epic_id` khi create / `PATCH` đổi parent
- Gắn Story→Feature: `user_story.feature_id`

Nối tay trên canvas (kéo handle) = `PATCH` đổi parent id.

### Cách B — Bảng link + layout (linh hoạt)

| Method | Path | Mô tả |
|--------|------|--------|
| `POST` | `.../requirement-links` | `{ source_id, target_id, kind }` — validate Epic→Feature, Feature→Story |
| `DELETE` | `.../requirement-links/{link_id}` | Gỡ link |
| `PUT` | `.../actors/{actor_id}/canvas-layout` | Lưu `nodes[].position`, `collapsed` |

**Link kinds hợp lệ (khớp `requirementsModelValidation.ts`):**

| source_kind | target_kind |
|-------------|-------------|
| `epic` | `feature` |
| `feature` | `user_story` |

Actor→Epic: tạo khi `POST` epic dưới actor, không nối tay.

---

## Canvas layout (tùy chọn)

| Method | Path | Body |
|--------|------|------|
| `PUT` | `/api/v1/projects/{project_id}/actors/{actor_id}/canvas-layout` | `{ nodes: [{ id, kind, x, y, collapsed }] }` |

Gọi khi: kéo thả node (debounce), hoặc nút **Auto-layout** chỉ client (không bắt buộc persist).

---

## Map hành động UI → API

| Hành động FE (`requirementsModelContext`) | API đề xuất |
|-------------------------------------------|-------------|
| Mount trang / đổi `actorId` | `GET .../requirement-model` |
| `updateNodeData` (panel) | `PATCH` epic / feature / user-story |
| `addNodeFromPalette('epic')` | `POST` epic + link actor |
| `addNodeFromPalette('feature' \| 'userStory')` | `POST` + `POST` link nếu cần |
| `onConnect` (hợp lệ) | `PATCH` parent id hoặc `POST` link |
| `onConnect` (không hợp lệ) | Không gọi API (chỉ UX đỏ) |
| `onNodesChange` remove | `DELETE` entity tương ứng |
| `quickAddFeature` | `POST` feature under epic |
| `runAutoLayout` | Client-only hoặc `PUT` canvas-layout |
| Click Actor | Không mở panel — không PATCH |

---

## Gợi ý triển khai FE

1. `lib/api/services/fetchRequirementModel.ts` — GET graph, map snake_case → types hiện có.
2. `fetchEpic.ts` / `fetchFeature.ts` / `fetchUserStory.ts` — CRUD (hoặc gộp một service).
3. Hooks TanStack Query theo `req-tool-data-fetching`:
   - `useRequirementModel(projectId, actorId)` — GET
   - Mutations invalidate `requirementModelQueryKey(projectId, actorId)` (và list epic theo project nếu có màn khác).
4. Thay `RequirementsModelProvider` mock bằng `initialData` từ query + optimistic updates khi PATCH panel.

---

## Lỗi thường gặp

| HTTP | Trường hợp |
|------|------------|
| `400` | Link sai phân cấp (Story→Epic trực tiếp) |
| `404` | `actor_id` / `epic_id` không thuộc project |
| `409` | Xóa feature còn stories; duplicate `prefix` trong project |
| `422` | Enum `status` / `priority` không hợp lệ |

Message hiển thị qua `getApiErrorMessage` + `sonner` như các màn actor list.

---

## Tóm tắt endpoint

| # | Method | Path |
|---|--------|------|
| 1 | GET | `/api/v1/projects/{project_id}/actors/{actor_id}` |
| 2 | GET | `/api/v1/projects/{project_id}/actors/{actor_id}/requirement-model` |
| 3 | POST | `/api/v1/projects/{project_id}/actors/{actor_id}/epics` |
| 4 | PATCH | `/api/v1/projects/{project_id}/epics/{epic_id}` |
| 5 | DELETE | `/api/v1/projects/{project_id}/epics/{epic_id}` |
| 6 | POST | `/api/v1/projects/{project_id}/epics/{epic_id}/features` |
| 7 | PATCH | `/api/v1/projects/{project_id}/features/{feature_id}` |
| 8 | DELETE | `/api/v1/projects/{project_id}/features/{feature_id}` |
| 9 | POST | `/api/v1/projects/{project_id}/features/{feature_id}/user-stories` |
| 10 | PATCH | `/api/v1/projects/{project_id}/user-stories/{user_story_id}` |
| 11 | DELETE | `/api/v1/projects/{project_id}/user-stories/{user_story_id}` |
| 12 | PUT | `/api/v1/projects/{project_id}/actors/{actor_id}/canvas-layout` *(optional)* |

*Đã có sẵn trong repo: list/create/update/delete actors ở cấp project (`fetchActor.ts`), không liệt kê lại.*
