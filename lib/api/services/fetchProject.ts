import apiService from "../core";

/** POST /api/v1/orgs/:org_id/projects */
export interface CreateOrgProjectRequest {
  name: string;
  description: string;
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
  created_at: string;
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

function mapOrgProjectRow(row: OrgProjectRowApi): OrgProject {
  return {
    id: row.id,
    orgId: row.org_id,
    name: row.name,
    slug: row.slug,
    description: row.description,
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
      {
        name: body.name.trim(),
        description: body.description.trim(),
      }
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
