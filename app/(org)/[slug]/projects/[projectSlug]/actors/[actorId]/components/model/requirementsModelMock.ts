import {
  INVALID_EDGE_MESSAGE,
  REQUIREMENT_EDGE_DEFAULT_OPTIONS,
  REQUIREMENT_INVALID_EDGE_STYLE,
  REQUIREMENT_NODE_DEFAULT_TITLES,
} from "./requirementsModelConstants";
import type {
  ActorNodeData,
  RequirementEdge,
  RequirementNode,
  RequirementNodeData,
  RequirementNodeKind,
  RequirementsModelState,
} from "./requirementsModelTypes";
import { createDefaultEpicRecord } from "../epic/epicTypes";
import { createDefaultFeatureRecord } from "../features/featureTypes";
import { createDefaultUserStoryRecord } from "../userStory/storyTypes";
import {
  ACTOR_USER_STORIES_EMPTY_MOCK_ACTOR_ID,
  ACTOR_USER_STORIES_MOCK_ACTOR_ID,
} from "../userStory/actorUserStoriesMock";

export const REQUIREMENTS_MOCK_PROJECT_ID =
  "3fa85f64-5717-4562-b3fc-2c963f66afa6";

const TS = "2026-05-16T18:53:58.465Z";
const TS_FEATURE = "2026-05-16T18:54:25.794Z";
const TS_STORY = "2026-05-16T18:54:43.354Z";

export type RequirementsModelActorMeta = {
  id: string;
  name: string;
  roleDescription: string;
};

function epicNode(
  id: string,
  position: { x: number; y: number },
  epic: Omit<import("../epic/epicTypes").EpicRecord, "project_id"> & {
    project_id?: string;
  }
): RequirementNode {
  return {
    id,
    type: "epic",
    position,
    data: {
      kind: "epic",
      collapsed: false,
      project_id: epic.project_id ?? REQUIREMENTS_MOCK_PROJECT_ID,
      prefix: epic.prefix,
      title: epic.title,
      description: epic.description,
      status: epic.status,
      priority: epic.priority,
      labels: epic.labels,
      references: epic.references,
      created_at: epic.created_at ?? TS,
      updated_at: epic.updated_at ?? TS,
    },
  };
}

function featureNode(
  id: string,
  position: { x: number; y: number },
  feature: import("../features/featureTypes").FeatureRecord
): RequirementNode {
  return {
    id,
    type: "feature",
    position,
    data: { kind: "feature", collapsed: false, ...feature },
  };
}

function storyNode(
  id: string,
  position: { x: number; y: number },
  story: import("../userStory/storyTypes").UserStoryRecord
): RequirementNode {
  return {
    id,
    type: "userStory",
    position,
    data: { kind: "userStory", collapsed: false, ...story },
  };
}

function actorNode(
  id: string,
  position: { x: number; y: number },
  data: Omit<ActorNodeData, "kind" | "collapsed">
): RequirementNode {
  return {
    id,
    type: "actor",
    position,
    deletable: false,
    selectable: false,
    data: { kind: "actor", collapsed: false, ...data },
  };
}

function edge(
  id: string,
  source: string,
  target: string,
  invalid?: boolean
): RequirementEdge {
  if (invalid) {
    return {
      id,
      source,
      target,
      type: "smoothstep",
      animated: true,
      style: { ...REQUIREMENT_INVALID_EDGE_STYLE },
      data: { invalid: true, message: INVALID_EDGE_MESSAGE },
    };
  }
  return {
    id,
    source,
    target,
    ...REQUIREMENT_EDGE_DEFAULT_OPTIONS,
  };
}

function buildRichMock(actor: RequirementsModelActorMeta): RequirementsModelState {
  const actorId = actor.id;
  const name = actor.name;

  const epicShiftId = "e1111111-1111-4111-8111-111111111101";
  const epicInventoryId = "e1111111-1111-4111-8111-111111111102";
  const featRosterId = "f2222222-2222-4222-8222-222222222201";
  const featSwapId = "f2222222-2222-4222-8222-222222222202";
  const featAttendanceId = "f2222222-2222-4222-8222-222222222203";
  const featStocktakeId = "f2222222-2222-4222-8222-222222222204";
  const featLowStockId = "f2222222-2222-4222-8222-222222222205";
  const storyViewId = "s3333333-3333-4333-8333-333333333301";
  const storyPrintId = "s3333333-3333-4333-8333-333333333302";
  const storySwapId = "s3333333-3333-4333-8333-333333333303";
  const storyClockId = "s3333333-3333-4333-8333-333333333304";
  const storyScanId = "s3333333-3333-4333-8333-333333333305";
  const storyAlertListId = "s3333333-3333-4333-8333-333333333306";
  const storyApproveOrderId = "s3333333-3333-4333-8333-333333333307";

  return {
    nodes: [
      actorNode(actorId, { x: 80, y: 200 }, {
        title: name,
        roleDescription: actor.roleDescription,
        description:
          "Người vận hành chính: ca làm, duyệt đơn và giám sát tồn kho tại cửa hàng.",
      }),

      epicNode(epicShiftId, { x: 360, y: 60 }, {
        prefix: "EPIC-01",
        title: "Quản lý ca làm việc",
        description:
          "Phân ca, đổi ca, chấm công và báo cáo nhân sự theo ca tại cửa hàng.",
        status: "active",
        priority: "high",
        labels: "operations,scheduling,hr",
        references: "BRD §3.2 · OKR Q2-OPS",
        created_at: TS,
        updated_at: TS,
      }),
      epicNode(epicInventoryId, { x: 360, y: 340 }, {
        prefix: "EPIC-02",
        title: "Tồn kho & đơn hàng cửa hàng",
        description:
          "Kiểm kê, cảnh báo tồn thấp và phê duyệt đơn bán tại quầy.",
        status: "active",
        priority: "high",
        labels: "inventory,checkout",
        references: "BRD §4.1 · Policy INV-07",
        created_at: TS,
        updated_at: TS,
      }),

      featureNode(featRosterId, { x: 640, y: 0 }, {
        epic_id: epicShiftId,
        prefix: "FEAT-01",
        title: "Lịch ca tuần",
        description: "Xem, chỉnh và xuất lịch ca theo tuần cho từng cửa hàng.",
        status: "active",
        priority: "high",
        labels: "mvp,ui",
        nfr_note: "Tải lịch 50 ca/tuần < 2s (P95).",
        references: "Figma: Schedule-Week-v3",
        warnings: [],
        created_at: TS_FEATURE,
        updated_at: TS_FEATURE,
      }),
      featureNode(featSwapId, { x: 640, y: 140 }, {
        epic_id: epicShiftId,
        prefix: "FEAT-02",
        title: "Duyệt đổi ca",
        description: "Luồng nhân viên gửi yêu cầu đổi ca và quản lý phê duyệt.",
        status: "active",
        priority: "medium",
        labels: "workflow",
        nfr_note: "Thông báo push trong 30s sau khi gửi.",
        references: "Policy HR-12",
        warnings: ["Thiếu rule nghỉ phép liên tiếp"],
        created_at: TS_FEATURE,
        updated_at: TS_FEATURE,
      }),
      featureNode(featAttendanceId, { x: 640, y: 280 }, {
        epic_id: epicShiftId,
        prefix: "FEAT-03",
        title: "Chấm công ca",
        description: "Ghi nhận giờ vào/ra và đối soát với lịch ca.",
        status: "draft",
        priority: "medium",
        labels: "attendance",
        nfr_note: "Offline queue tối đa 24h.",
        references: "",
        warnings: [],
        created_at: TS_FEATURE,
        updated_at: TS_FEATURE,
      }),
      featureNode(featStocktakeId, { x: 640, y: 420 }, {
        epic_id: epicInventoryId,
        prefix: "FEAT-04",
        title: "Kiểm kê nhanh",
        description: "Quét mã và đối chiếu số lượng thực tế với hệ thống.",
        status: "active",
        priority: "high",
        labels: "inventory,scanner",
        nfr_note: "Hỗ trợ quét liên tục 200 SKU/phiên.",
        references: "API: /stocktake/sessions",
        warnings: [],
        created_at: TS_FEATURE,
        updated_at: TS_FEATURE,
      }),
      featureNode(featLowStockId, { x: 640, y: 560 }, {
        epic_id: epicInventoryId,
        prefix: "FEAT-05",
        title: "Cảnh báo tồn thấp",
        description: "Danh sách SKU sắp hết và đặt hàng bổ sung từ cửa hàng.",
        status: "draft",
        priority: "medium",
        labels: "alerts,replenishment",
        nfr_note: "",
        references: "BRD §4.3",
        warnings: ["Chưa có SLA cảnh báo theo ngành hàng"],
        created_at: TS_FEATURE,
        updated_at: TS_FEATURE,
      }),

      storyNode(storyViewId, { x: 920, y: -20 }, {
        feature_id: featRosterId,
        prefix: "US-01",
        title: "Xem lịch ca tuần",
        description: "Màn hình lịch ca mặc định khi mở module Nhân sự.",
        actor_ref: name,
        action_text: "mở tab Lịch ca và chọn tuần hiện tại",
        goal_text: "nắm được ai trực ca nào trong tuần",
        status: "done",
        priority: "medium",
        labels: "ui,read-only",
        references: "",
        story_points: 3,
        sprint_id: "SPR-2026-18",
        acceptance_criteria: [
          { id: "ac-01-1", text: "Hiển thị ca theo tuần (T2–CN)", done: true },
          { id: "ac-01-2", text: "Lọc theo vai trò / khu vực", done: true },
          { id: "ac-01-3", text: "Highlight ca đang diễn ra", done: true },
        ],
        created_at: TS_STORY,
        updated_at: TS_STORY,
      }),
      storyNode(storyPrintId, { x: 920, y: 80 }, {
        feature_id: featRosterId,
        prefix: "US-02",
        title: "In lịch ca PDF",
        description: "Xuất lịch tuần để dán tại khu vực nhân viên.",
        actor_ref: name,
        action_text: "nhấn In lịch và chọn khổ A4 ngang",
        goal_text: "chia sẻ lịch cho nhân viên không dùng app",
        status: "active",
        priority: "low",
        labels: "export",
        references: "",
        story_points: 2,
        sprint_id: "SPR-2026-19",
        acceptance_criteria: [
          { id: "ac-02-1", text: "PDF có logo cửa hàng và tuần", done: true },
          { id: "ac-02-2", text: "Tải xong trong < 5s", done: false },
        ],
        created_at: TS_STORY,
        updated_at: TS_STORY,
      }),
      storyNode(storySwapId, { x: 920, y: 200 }, {
        feature_id: featSwapId,
        prefix: "US-03",
        title: "Duyệt yêu cầu đổi ca",
        description: "Quản lý xem hàng đợi và quyết định đổi ca.",
        actor_ref: name,
        action_text: "mở hàng đợi Đổi ca và chọn Duyệt / Từ chối",
        goal_text: "xử lý yêu cầu trong ngày làm việc",
        status: "active",
        priority: "high",
        labels: "workflow",
        references: "Policy HR-12 §2",
        story_points: 5,
        sprint_id: "SPR-2026-19",
        acceptance_criteria: [
          { id: "ac-03-1", text: "Duyệt → cập nhật lịch cả hai nhân viên", done: false },
          { id: "ac-03-2", text: "Từ chối → bắt buộc lý do", done: false },
          { id: "ac-03-3", text: "Gửi thông báo cho nhân viên liên quan", done: false },
        ],
        created_at: TS_STORY,
        updated_at: TS_STORY,
      }),
      storyNode(storyClockId, { x: 920, y: 320 }, {
        feature_id: featAttendanceId,
        prefix: "US-04",
        title: "Ghi nhận giờ vào/ra",
        description: "Chấm công gắn với ca đã phân trong lịch.",
        actor_ref: name,
        action_text: "quét QR cửa hàng hoặc nhập mã ca",
        goal_text: "đối soát chấm công với lịch đã duyệt",
        status: "draft",
        priority: "medium",
        labels: "mobile",
        references: "",
        story_points: 8,
        sprint_id: null,
        acceptance_criteria: [
          { id: "ac-04-1", text: "Cảnh báo nếu chấm ngoài khung ca ±15 phút", done: false },
          { id: "ac-04-2", text: "Lưu offline và đồng bộ khi có mạng", done: false },
        ],
        created_at: TS_STORY,
        updated_at: TS_STORY,
      }),
      storyNode(storyScanId, { x: 920, y: 440 }, {
        feature_id: featStocktakeId,
        prefix: "US-05",
        title: "Quét mã kiểm kê",
        description: "Phiên kiểm kê với danh sách chênh lệch theo thời gian thực.",
        actor_ref: name,
        action_text: "tạo phiên kiểm kê và quét từng SKU",
        goal_text: "hoàn tất kiểm kê zone A trong một ca",
        status: "active",
        priority: "high",
        labels: "scanner,inventory",
        references: "",
        story_points: 5,
        sprint_id: "SPR-2026-19",
        acceptance_criteria: [
          { id: "ac-05-1", text: "Âm thanh khi quét trùng mã trong phiên", done: true },
          { id: "ac-05-2", text: "Hiện chênh lệch ngay sau mỗi lần quét", done: true },
          { id: "ac-05-3", text: "Khóa phiên khi hoàn tất", done: false },
        ],
        created_at: TS_STORY,
        updated_at: TS_STORY,
      }),
      storyNode(storyAlertListId, { x: 920, y: 560 }, {
        feature_id: featLowStockId,
        prefix: "US-06",
        title: "Xem SKU sắp hết hàng",
        description: "Bảng cảnh báo theo ngưỡng tồn từng cửa hàng.",
        actor_ref: name,
        action_text: "mở Cảnh báo tồn và sắp xếp theo mức độ",
        goal_text: "ưu tiên đặt hàng bổ sung trước khi hết hàng",
        status: "draft",
        priority: "medium",
        labels: "dashboard",
        references: "BRD §4.3.2",
        story_points: 3,
        sprint_id: null,
        acceptance_criteria: [
          { id: "ac-06-1", text: "Badge đỏ / vàng theo % tồn còn lại", done: false },
          { id: "ac-06-2", text: "Lọc theo ngành hàng", done: false },
        ],
        created_at: TS_STORY,
        updated_at: TS_STORY,
      }),
      storyNode(storyApproveOrderId, { x: 920, y: 680 }, {
        feature_id: featLowStockId,
        prefix: "US-07",
        title: "Duyệt đơn đặt hàng",
        description:
          "Xem đơn chờ duyệt, kiểm tra tồn và phê duyệt hoặc từ chối tại quầy.",
        actor_ref: name,
        action_text:
          "mở tab Đơn chờ, chọn đơn, nhấn Duyệt hoặc Từ chối",
        goal_text: "giảm thời gian chờ duyệt trung bình dưới 4 giờ",
        status: "active",
        priority: "critical",
        labels: "checkout,bán hàng",
        references: "Figma: Order-Approval-v2",
        story_points: 8,
        sprint_id: "SPR-2026-19",
        acceptance_criteria: [
          {
            id: "ac-07-1",
            text: "Duyệt → trạng thái Đã duyệt, gửi email khách",
            done: false,
          },
          {
            id: "ac-07-2",
            text: "Từ chối → bắt buộc nhập lý do",
            done: false,
          },
          {
            id: "ac-07-3",
            text: "Tồn không đủ → chặn duyệt và hiện cảnh báo",
            done: false,
          },
        ],
        created_at: TS_STORY,
        updated_at: TS_STORY,
      }),
    ],
    edges: [
      edge("e-a-e1", actorId, epicShiftId),
      edge("e-a-e2", actorId, epicInventoryId),
      edge("e-e1-f1", epicShiftId, featRosterId),
      edge("e-e1-f2", epicShiftId, featSwapId),
      edge("e-e1-f3", epicShiftId, featAttendanceId),
      edge("e-e2-f4", epicInventoryId, featStocktakeId),
      edge("e-e2-f5", epicInventoryId, featLowStockId),
      edge("e-f1-us1", featRosterId, storyViewId),
      edge("e-f1-us2", featRosterId, storyPrintId),
      edge("e-f2-us3", featSwapId, storySwapId),
      edge("e-f3-us4", featAttendanceId, storyClockId),
      edge("e-f4-us5", featStocktakeId, storyScanId),
      edge("e-f5-us6", featLowStockId, storyAlertListId),
      edge("e-f5-us7", featLowStockId, storyApproveOrderId),
    ],
  };
}

function buildEmptyActorMock(actor: RequirementsModelActorMeta): RequirementsModelState {
  return {
    nodes: [
      actorNode(actor.id, { x: 120, y: 160 }, {
        title: actor.name,
        roleDescription: actor.roleDescription,
        description: "Kéo Epic từ palette để gắn vào actor này.",
      }),
    ],
    edges: [],
  };
}

export function getRequirementsModelActorMeta(
  actorId: string
): RequirementsModelActorMeta {
  if (actorId === ACTOR_USER_STORIES_EMPTY_MOCK_ACTOR_ID) {
    return {
      id: actorId,
      name: "Actor demo (trống)",
      roleDescription: "Chưa có epic — kéo Epic từ palette trái.",
    };
  }
  if (actorId === ACTOR_USER_STORIES_MOCK_ACTOR_ID) {
    return {
      id: actorId,
      name: "Quản lý cửa hàng",
      roleDescription: "Vận hành ca làm và phê duyệt đơn trong cửa hàng.",
    };
  }
  return {
    id: actorId,
    name: "Actor",
    roleDescription: "Vai trò trong dự án.",
  };
}

export function getRequirementsModelMock(
  actorId: string
): RequirementsModelState {
  const actor = getRequirementsModelActorMeta(actorId);
  if (actorId === ACTOR_USER_STORIES_EMPTY_MOCK_ACTOR_ID) {
    return buildEmptyActorMock(actor);
  }
  return buildRichMock(actor);
}

export function createDefaultNodeData(
  kind: RequirementNodeKind,
  opts?: {
    projectId?: string;
    epicId?: string;
    featureId?: string;
    actorRef?: string;
  }
): RequirementNodeData {
  const projectId = opts?.projectId ?? REQUIREMENTS_MOCK_PROJECT_ID;

  switch (kind) {
    case "actor":
      return {
        kind: "actor",
        title: REQUIREMENT_NODE_DEFAULT_TITLES.actor,
        description: "",
        roleDescription: "",
        collapsed: false,
      };
    case "epic":
      return {
        kind: "epic",
        collapsed: false,
        ...createDefaultEpicRecord(projectId),
      };
    case "feature":
      return {
        kind: "feature",
        collapsed: false,
        ...createDefaultFeatureRecord(opts?.epicId ?? ""),
      };
    case "userStory": {
      const base = createDefaultUserStoryRecord(opts?.featureId ?? "");
      return {
        kind: "userStory",
        collapsed: false,
        ...base,
        actor_ref: opts?.actorRef?.trim() || base.actor_ref,
      };
    }
  }
}
