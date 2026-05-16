import apiService from "../core";

interface ProjectActorRowApi {
  id: string;
  project_id: string;
  name: string;
  role_description: string;
  created_at: string;
}

interface CreateProjectActorApiResponse {
  success: boolean;
  data: ProjectActorRowApi;
  message: string | null;
}

interface ListProjectActorsApiResponse {
  success: boolean;
  data: ProjectActorRowApi[];
  message: string | null;
}

/** POST body (camelCase trong app → snake_case trên wire). */
export interface CreateProjectActorRequest {
  name: string;
  roleDescription: string;
}

export interface ProjectActor {
  id: string;
  projectId: string;
  name: string;
  roleDescription: string;
  createdAt: string;
}

export interface CreateProjectActorResponse {
  success: boolean;
  data: ProjectActor;
  message: string | null;
}

/** PATCH — cùng body/envelope với POST. */
export type UpdateProjectActorRequest = CreateProjectActorRequest;

export type UpdateProjectActorResponse = CreateProjectActorResponse;

export interface ProjectActorsListResponse {
  success: boolean;
  data: ProjectActor[];
  message: string | null;
}

function mapProjectActorRow(row: ProjectActorRowApi): ProjectActor {
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    roleDescription: row.role_description,
    createdAt: row.created_at,
  };
}

function toCreateProjectActorApiBody(body: CreateProjectActorRequest) {
  return {
    name: body.name.trim(),
    role_description: body.roleDescription.trim(),
  };
}

function mapCreateProjectActorResponse(
  body: CreateProjectActorApiResponse
): CreateProjectActorResponse {
  return {
    success: body.success,
    message: body.message ?? null,
    data: mapProjectActorRow(body.data),
  };
}

function mapProjectActorsListResponse(
  body: ListProjectActorsApiResponse
): ProjectActorsListResponse {
  return {
    success: body.success,
    message: body.message ?? null,
    data: body.data.map(mapProjectActorRow),
  };
}

export const fetchActor = {
  /** GET /api/v1/projects/:project_id/actors */
  list: async (projectId: string): Promise<ProjectActorsListResponse> => {
    const response = await apiService.get<ListProjectActorsApiResponse>(
      `/api/v1/projects/${encodeURIComponent(projectId)}/actors`
    );
    return mapProjectActorsListResponse(response.data);
  },

  /** POST /api/v1/projects/:project_id/actors */
  create: async (
    projectId: string,
    body: CreateProjectActorRequest
  ): Promise<CreateProjectActorResponse> => {
    const response = await apiService.post<CreateProjectActorApiResponse>(
      `/api/v1/projects/${encodeURIComponent(projectId)}/actors`,
      toCreateProjectActorApiBody(body)
    );
    return mapCreateProjectActorResponse(response.data);
  },

  /** PATCH /api/v1/projects/:project_id/actors/:actor_id */
  update: async (
    projectId: string,
    actorId: string,
    body: UpdateProjectActorRequest
  ): Promise<UpdateProjectActorResponse> => {
    const response = await apiService.patch<CreateProjectActorApiResponse>(
      `/api/v1/projects/${encodeURIComponent(projectId)}/actors/${encodeURIComponent(actorId)}`,
      toCreateProjectActorApiBody(body)
    );
    return mapCreateProjectActorResponse(response.data);
  },

  /** DELETE /api/v1/projects/:project_id/actors/:actor_id */
  delete: async (projectId: string, actorId: string): Promise<void> => {
    await apiService.delete<unknown>(
      `/api/v1/projects/${encodeURIComponent(projectId)}/actors/${encodeURIComponent(actorId)}`
    );
  },
};
