import apiService from "../core";

/** POST /api/v1/orgs/:org_id/projects — body JSON (snake_case trên wire). */
export interface CreateOrgProjectRequest {
  name: string;
  description: string;
  context: string;
  problems: string;
  stakeholders: string;
  businessGoals: string;
  businessFlows: string;
  businessRules: string;
  proposedSolutions: string;
}

/** PATCH /api/v1/orgs/:org_id/projects/:project_id */
export interface UpdateOrgProjectRequest {
  name: string;
  description: string;
}

interface OrgProjectRowApi {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  description: string;
  context?: string | null;
  problems?: string | null;
  stakeholders?: string | null;
  business_goals?: string | null;
  business_flows?: string | null;
  business_rules?: string | null;
  proposed_solutions?: string | null;
  created_at: string;
}

interface CreateOrgProjectApiBody {
  name: string;
  description: string;
  context: string;
  problems: string;
  stakeholders: string;
  business_goals: string;
  business_flows: string;
  business_rules: string;
  proposed_solutions: string;
}

interface CreateOrgProjectApiResponse {
  success: boolean;
  data: OrgProjectRowApi;
  message: string | null;
}

interface OrgProjectsListApiResponse {
  success: boolean;
  data: OrgProjectRowApi[];
  message: string | null;
}

interface OrgProjectDetailApiResponse {
  success: boolean;
  data: OrgProjectRowApi;
  message: string | null;
}

interface UpdateOrgProjectApiResponse {
  success: boolean;
  data: OrgProjectRowApi;
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
  problems: string;
  stakeholders: string;
  businessGoals: string;
  businessFlows: string;
  businessRules: string;
  proposedSolutions: string;
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

function toCreateOrgProjectApiBody(
  body: CreateOrgProjectRequest
): CreateOrgProjectApiBody {
  return {
    name: trimField(body.name),
    description: trimField(body.description),
    context: trimField(body.context),
    problems: trimField(body.problems),
    stakeholders: trimField(body.stakeholders),
    business_goals: trimField(body.businessGoals),
    business_flows: trimField(body.businessFlows),
    business_rules: trimField(body.businessRules),
    proposed_solutions: trimField(body.proposedSolutions),
  };
}

function mapOrgProjectRow(row: OrgProjectRowApi): OrgProject {
  return {
    id: row.id,
    orgId: row.org_id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    context: row.context ?? "",
    problems: row.problems ?? "",
    stakeholders: row.stakeholders ?? "",
    businessGoals: row.business_goals ?? "",
    businessFlows: row.business_flows ?? "",
    businessRules: row.business_rules ?? "",
    proposedSolutions: row.proposed_solutions ?? "",
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
    data: body.data.map(mapOrgProjectRow),
  };
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
  /** GET /api/v1/orgs/:org_id/projects */
  listOrgProjects: async (orgId: string): Promise<OrgProjectsListResponse> => {
    const response = await apiService.get<OrgProjectsListApiResponse>(
      `/api/v1/orgs/${encodeURIComponent(orgId)}/projects`
    );
    return mapOrgProjectsListResponse(response.data);
  },

  /** GET /api/v1/orgs/:org_id/projects/:project_id */
  getOrgProject: async (
    orgId: string,
    projectId: string
  ): Promise<OrgProjectDetailResponse> => {
    const response = await apiService.get<OrgProjectDetailApiResponse>(
      `/api/v1/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}`
    );
    return mapOrgProjectDetailResponse(response.data);
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
