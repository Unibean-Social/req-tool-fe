import apiService from "../core";

/** POST /api/v1/orgs/:org_id/projects — body JSON (snake_case trên wire). */
export interface CreateOrgProjectRequest {
  name: string;
  description: string;
  context: string;
  problems: string[];
  stakeholders: string[];
  businessGoals: string[];
  businessFlows: string[];
  businessRules: string[];
  proposedSolutions: string[];
}

/** PATCH /api/v1/orgs/:org_id/projects/:project_id */
export interface UpdateOrgProjectRequest {
  name: string;
  description: string;
}

/** Một dự án trên wire (GET list/detail/create). */
export interface OrgProjectApiRow {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  description: string;
  context: string;
  problems: string[];
  stakeholders: string[];
  business_goals: string[];
  business_flows: string[];
  business_rules: string[];
  proposed_solutions: string[];
  created_at: string;
}

/** GET /api/v1/orgs/{org_id}/projects — path param `org_id`. */
export interface ListOrgProjectsParams {
  orgId: string;
}

/** GET /api/v1/orgs/{org_id}/projects/{project_id} — path `org_id`, `project_id`. */
export interface GetOrgProjectParams {
  orgId: string;
  projectId: string;
}

interface CreateOrgProjectApiBody {
  name: string;
  description: string;
  context: string;
  problems: string[];
  stakeholders: string[];
  business_goals: string[];
  business_flows: string[];
  business_rules: string[];
  proposed_solutions: string[];
}

interface CreateOrgProjectApiResponse {
  success: boolean;
  data: OrgProjectApiRow;
  message: string | null;
}

interface OrgProjectsListApiResponse {
  success: boolean;
  data: OrgProjectApiRow[];
  message: string | null;
}

interface OrgProjectDetailApiResponse {
  success: boolean;
  data: OrgProjectApiRow;
  message: string | null;
}

interface UpdateOrgProjectApiResponse {
  success: boolean;
  data: OrgProjectApiRow;
  message: string | null;
}

/** Dự án org (camelCase). */
export interface OrgProject {
  id: string;
  orgId: string;
  name: string;
  slug: string;
  description: string;
  context: string;
  problems: string[];
  stakeholders: string[];
  businessGoals: string[];
  businessFlows: string[];
  businessRules: string[];
  proposedSolutions: string[];
  createdAt: string;
}

export interface CreateOrgProjectResponse {
  success: boolean;
  data: OrgProject;
  message: string | null;
}

export interface OrgProjectsListResponse {
  success: boolean;
  data: OrgProject[];
  message: string | null;
}

export interface OrgProjectDetailResponse {
  success: boolean;
  data: OrgProject;
  message: string | null;
}

export interface UpdateOrgProjectResponse {
  success: boolean;
  data: OrgProject;
  message: string | null;
}

function trimField(s: string): string {
  return s.trim();
}

function normalizeStringList(items: string[]): string[] {
  return items.map((s) => s.trim()).filter(Boolean);
}

function mapStringListFromApi(value: string[] | null | undefined): string[] {
  if (!value?.length) return [];
  return value.map((s) => String(s).trim()).filter(Boolean);
}

/** Hiển thị mảng dự án trong textarea (mỗi dòng một mục). */
export function orgProjectListToLines(
  items: string[] | null | undefined
): string {
  return (items ?? []).join("\n");
}

/** Parse textarea thành mảng gửi API (mỗi dòng không rỗng = một mục). */
export function linesToOrgProjectList(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function toCreateOrgProjectApiBody(
  body: CreateOrgProjectRequest
): CreateOrgProjectApiBody {
  return {
    name: trimField(body.name),
    description: trimField(body.description),
    context: trimField(body.context),
    problems: normalizeStringList(body.problems),
    stakeholders: normalizeStringList(body.stakeholders),
    business_goals: normalizeStringList(body.businessGoals),
    business_flows: normalizeStringList(body.businessFlows),
    business_rules: normalizeStringList(body.businessRules),
    proposed_solutions: normalizeStringList(body.proposedSolutions),
  };
}

function resolveOrgId(orgIdOrParams: string | ListOrgProjectsParams): string {
  const id =
    typeof orgIdOrParams === "string" ? orgIdOrParams : orgIdOrParams.orgId;
  const trimmed = id.trim();
  if (!trimmed) {
    throw new Error("org_id là bắt buộc");
  }
  return trimmed;
}

function resolveGetOrgProjectParams(
  orgIdOrParams: string | GetOrgProjectParams,
  projectIdArg?: string
): GetOrgProjectParams {
  if (typeof orgIdOrParams === "object") {
    const orgId = orgIdOrParams.orgId.trim();
    const projectId = orgIdOrParams.projectId.trim();
    if (!orgId) throw new Error("org_id là bắt buộc");
    if (!projectId) throw new Error("project_id là bắt buộc");
    return { orgId, projectId };
  }
  const orgId = orgIdOrParams.trim();
  const projectId = (projectIdArg ?? "").trim();
  if (!orgId) throw new Error("org_id là bắt buộc");
  if (!projectId) throw new Error("project_id là bắt buộc");
  return { orgId, projectId };
}

function mapOrgProjectRow(row: OrgProjectApiRow): OrgProject {
  return {
    id: row.id,
    orgId: row.org_id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    context: row.context ?? "",
    problems: mapStringListFromApi(row.problems),
    stakeholders: mapStringListFromApi(row.stakeholders),
    businessGoals: mapStringListFromApi(row.business_goals),
    businessFlows: mapStringListFromApi(row.business_flows),
    businessRules: mapStringListFromApi(row.business_rules),
    proposedSolutions: mapStringListFromApi(row.proposed_solutions),
    createdAt: row.created_at,
  };
}

function mapCreateOrgProjectResponse(
  body: CreateOrgProjectApiResponse
): CreateOrgProjectResponse {
  return {
    success: body.success,
    message: body.message ?? null,
    data: mapOrgProjectRow(body.data),
  };
}

function mapOrgProjectsListResponse(
  body: OrgProjectsListApiResponse
): OrgProjectsListResponse {
  return {
    success: body.success,
    message: body.message ?? null,
    data: (body.data ?? []).map(mapOrgProjectRow),
  };
}

function assertOrgProjectsListSuccess(
  body: OrgProjectsListApiResponse
): OrgProjectsListApiResponse {
  if (!body.success) {
    throw new Error(body.message ?? "Không tải được danh sách dự án");
  }
  return body;
}

function assertOrgProjectDetailSuccess(
  body: OrgProjectDetailApiResponse
): OrgProjectDetailApiResponse {
  if (!body.success) {
    throw new Error(body.message ?? "Không tải được dự án");
  }
  if (!body.data?.id) {
    throw new Error("Dữ liệu dự án không hợp lệ");
  }
  return body;
}

function mapOrgProjectDetailResponse(
  body: OrgProjectDetailApiResponse
): OrgProjectDetailResponse {
  return {
    success: body.success,
    message: body.message ?? null,
    data: mapOrgProjectRow(body.data),
  };
}

function mapUpdateOrgProjectResponse(
  body: UpdateOrgProjectApiResponse
): UpdateOrgProjectResponse {
  return {
    success: body.success,
    message: body.message ?? null,
    data: mapOrgProjectRow(body.data),
  };
}

export const fetchProject = {
  /**
   * GET /api/v1/orgs/{org_id}/projects
   * @param orgIdOrParams — `org_id` trên path (string hoặc `{ orgId }`)
   */
  listOrgProjects: async (
    orgIdOrParams: string | ListOrgProjectsParams
  ): Promise<OrgProjectsListResponse> => {
    const orgId = resolveOrgId(orgIdOrParams);
    const response = await apiService.get<OrgProjectsListApiResponse>(
      `/api/v1/orgs/${encodeURIComponent(orgId)}/projects`
    );
    return mapOrgProjectsListResponse(
      assertOrgProjectsListSuccess(response.data)
    );
  },

  /**
   * GET /api/v1/orgs/{org_id}/projects/{project_id}
   * @param orgIdOrParams — `org_id` + `project_id` (object hoặc hai string)
   */
  getOrgProject: async (
    orgIdOrParams: string | GetOrgProjectParams,
    projectId?: string
  ): Promise<OrgProjectDetailResponse> => {
    const { orgId, projectId: pid } = resolveGetOrgProjectParams(
      orgIdOrParams,
      projectId
    );
    const response = await apiService.get<OrgProjectDetailApiResponse>(
      `/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(pid)}`
    );
    return mapOrgProjectDetailResponse(
      assertOrgProjectDetailSuccess(response.data)
    );
  },

  /** POST /api/v1/orgs/:org_id/projects */
  createProject: async (
    orgId: string,
    body: CreateOrgProjectRequest
  ): Promise<CreateOrgProjectResponse> => {
    const response = await apiService.post<CreateOrgProjectApiResponse>(
      `/api/v1/orgs/${encodeURIComponent(orgId)}/projects`,
      toCreateOrgProjectApiBody(body)
    );
    return mapCreateOrgProjectResponse(response.data);
  },

  /** PATCH /api/v1/orgs/:org_id/projects/:project_id */
  updateOrgProject: async (
    orgId: string,
    projectId: string,
    body: UpdateOrgProjectRequest
  ): Promise<UpdateOrgProjectResponse> => {
    const response = await apiService.patch<UpdateOrgProjectApiResponse>(
      `/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}`,
      {
        name: body.name.trim(),
        description: body.description.trim(),
      }
    );
    return mapUpdateOrgProjectResponse(response.data);
  },

  /** DELETE /api/v1/orgs/:org_id/projects/:project_id */
  deleteOrgProject: async (orgId: string, projectId: string): Promise<void> => {
    await apiService.delete<unknown>(
      `/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}`
    );
  },
};
