import type { ActorUserStory, StoryStatus } from "./actorUserStoryTypes";

/**
 * ID mẫu thiết kế flow — dùng chung giữa trang actor và metadata sidebar (demo).
 * Khi API có, thay bằng dữ liệu thật theo `actorId` route.
 */
export const ACTOR_USER_STORIES_MOCK_ACTOR_ID =
  "3fa85f64-5717-4562-b3fc-2c963f66afa6";

/** Actor demo: chưa có user story — để thử luồng «Thêm user story». */
export const ACTOR_USER_STORIES_EMPTY_MOCK_ACTOR_ID =
  "00000000-0000-4000-8000-000000000001";

const MOCK_FIXED_TIME = "2026-05-15T18:23:09.007Z";

type StorySeed = Pick<
  ActorUserStory,
  | "feature_id"
  | "title"
  | "description"
  | "action_text"
  | "goal_text"
  | "priority"
  | "labels"
  | "story_points"
> & {
  prefix?: string;
  status?: StoryStatus;
  acceptance_criteria?: string[];
};

function toMockStory(seed: StorySeed, actorRef: string): ActorUserStory {
  return {
    id: seed.feature_id,
    feature_id: seed.feature_id,
    prefix: seed.prefix ?? "",
    title: seed.title,
    description: seed.description,
    actor_ref: actorRef,
    action_text: seed.action_text,
    goal_text: seed.goal_text,
    status: seed.status ?? "draft",
    priority: seed.priority,
    labels: seed.labels,
    references: "",
    story_points: seed.story_points,
    sprint_id: null,
    acceptance_criteria: seed.acceptance_criteria ?? [],
    created_at: MOCK_FIXED_TIME,
    updated_at: MOCK_FIXED_TIME,
  };
}

const MOCK_STORIES_TEMPLATE: StorySeed[] = [
  {
    feature_id: "a1b2c3d4-e5f6-4789-a012-3456789abcde",
    prefix: "US-001",
    title: "Duyệt đơn đặt hàng",
    description:
      "Actor xem đơn chờ duyệt, kiểm tra tồn kho và phê duyệt hoặc từ chối.",
    action_text:
      "Mở tab Đơn hàng chờ, chọn đơn, nhấn Duyệt hoặc Từ chối.",
    goal_text:
      "Giảm thời gian chờ duyệt trung bình dưới 4 giờ.",
    priority: "high",
    status: "draft",
    labels: ["checkout", "bán hàng"],
    story_points: 5,
    acceptance_criteria: [
      "Duyệt → đơn Đã duyệt, khách nhận email.",
      "Từ chối → bắt buộc nhập lý do.",
      "Tồn kho không đủ → hiện cảnh báo.",
    ],
  },
  {
    feature_id: "b2c3d4e5-f6a7-4890-b123-456789abcdef",
    prefix: "US-002",
    title: "Nhận thông báo SLA sắp vượt",
    description: "Cảnh báo khi ticket hỗ trợ gần hạn xử lý.",
    action_text:
      "Đọc toast/push, mở ticket và cập nhật trạng thái",
    goal_text: "Không để quá 10% ticket vượt SLA tháng.",
    priority: "medium",
    status: "draft",
    labels: ["thông báo", "hỗ trợ"],
    story_points: 3,
    acceptance_criteria: [
      "Thông báo hiển thị trước hạn X giờ.",
      "Đánh dấu đã đọc là lưu trên server.",
    ],
  },
  {
    feature_id: "c3d4e5f6-a7b8-4901-c234-567890abcdef",
    prefix: "US-003",
    title: "Xuất báo cáo tuần",
    description: "Tải file CSV tổng hợp giao dịch theo bộ lọc đã lưu.",
    action_text:
      "Vào Báo cáo → Tuần → Chọn bộ lọc → Xuất CSV",
    goal_text: "Tiết kiệm 30 phút so với xuất thủ công.",
    priority: "low",
    status: "draft",
    labels: ["báo cáo"],
    story_points: 2,
    acceptance_criteria: ["File CSV UTF-8, tên file theo ISO tuần."],
  },
  {
    feature_id: "d4e5f6a7-b8c9-4012-d345-67890abcdef0",
    prefix: "US-004",
    title: "Phân quyền xem chi tiết khách VIP",
    description:
      "Chỉ actor vai trò này được xem trường nhạy cảm trên hồ sơ VIP.",
    action_text: "Mở hồ sơ khách → tab Nhạy cảm",
    goal_text: "Tuân thủ chính sách dữ liệu nội bộ.",
    priority: "critical",
    status: "draft",
    labels: ["bảo mật", "CRM"],
    story_points: 8,
    acceptance_criteria: [
      "User không VIP không thấy tab Nhạy cảm.",
      "Audit log mỗi lần xem field nhạy cảm.",
    ],
  },
];

export type ActorUserStoriesMockView = {
  actor: {
    id: string;
    name: string;
    roleDescription: string;
  };
  stories: ActorUserStory[];
};

/**
 * Tạm thời: luôn trả mock, `actor_ref` và hub `id` khớp `actorId` từ URL.
 */
export function getActorUserStoriesMockView(
  actorId: string
): ActorUserStoriesMockView {
  const id = actorId.trim();

  if (id === ACTOR_USER_STORIES_EMPTY_MOCK_ACTOR_ID) {
    return {
      actor: {
        id,
        name: "Actor trống (demo)",
        roleDescription:
          "Chưa có user story trên sơ đồ. Thêm story mới để xem kết nối từ actor.",
      },
      stories: [],
    };
  }

  return {
    actor: {
      id,
      name: "Người dùng cuối (mẫu)",
      roleDescription:
        "Người xác nhận yêu cầu và thao tác trên các luồng nghiệp vụ chính.",
    },
    stories: MOCK_STORIES_TEMPLATE.map((s) => toMockStory(s, id)),
  };
}
