import apiService from "../core";

interface OrgApi {
  id: string;
  name: string;
  slug: string;
  owner_id: string | null;
  created_at: string;
}

interface OrgsMeApiResponse {
  success: boolean;
  data: OrgApi[];
  message: string | null;
}

export interface Org {
  id: string;
  name: string;
  slug: string;
  ownerId: string | null;
  createdAt: string;
}

export interface OrgsMeResponse {
  success: boolean;
  data: Org[];
  message: string | null;
}

export interface CreateOrgRequest {
  name: string;
}

interface CreateOrgApiResponse {
  success: boolean;
  data: OrgApi;
  message: string | null;
}

export interface CreateOrgResponse {
  success: boolean;
  data: Org;
  message: string | null;
}

interface OrgByIdApiResponse {
  success: boolean;
  data: OrgApi;
  message: string | null;
}

/** GET /api/v1/orgs/:id — một org. */
export type OrgDetailResponse = CreateOrgResponse;

function mapOrg(o: OrgApi): Org {
  return {
    id: o.id,
    name: o.name,
    slug: o.slug,
    ownerId: o.owner_id,
    createdAt: o.created_at,
  };
}

function mapOrgsMeResponse(body: OrgsMeApiResponse): OrgsMeResponse {
  return {
    success: body.success,
    message: body.message ?? null,
    data: body.data.map(mapOrg),
  };
}

function mapCreateOrgResponse(body: CreateOrgApiResponse): CreateOrgResponse {
  return {
    success: body.success,
    message: body.message ?? null,
    data: mapOrg(body.data),
  };
}

function mapOrgByIdResponse(body: OrgByIdApiResponse): OrgDetailResponse {
  return {
    success: body.success,
    message: body.message ?? null,
    data: mapOrg(body.data),
  };
}

export const fetchOrg = {
  /** GET /api/v1/orgs/me — danh sách org của user hiện tại. */
  getMine: async (): Promise<OrgsMeResponse> => {
    const response = await apiService.get<OrgsMeApiResponse>("/api/v1/orgs/me");
    return mapOrgsMeResponse(response.data);
  },

  /** POST /api/v1/orgs — tạo org. */
  create: async (body: CreateOrgRequest): Promise<CreateOrgResponse> => {
    const response = await apiService.post<CreateOrgApiResponse>("/api/v1/orgs", body);
    return mapCreateOrgResponse(response.data);
  },

  /** GET /api/v1/orgs/:org_id — chi tiết một org. */
  getById: async (orgId: string): Promise<OrgDetailResponse> => {
    const response = await apiService.get<OrgByIdApiResponse>(
      `/api/v1/orgs/${encodeURIComponent(orgId)}`
    );
    return mapOrgByIdResponse(response.data);
  },
};
