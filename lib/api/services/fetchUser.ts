import apiService from "../core";

interface UserMeApi {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  role: string;
  github_login: string | null;
  github_avatar_url: string | null;
  created_at: string;
}

interface UserMeApiResponse {
  success: boolean;
  data: UserMeApi;
  message: string | null;
}

/** GET /api/v1/users/me — hồ sơ user hiện tại (camelCase). */
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  role: string;
  githubLogin: string | null;
  githubAvatarUrl: string | null;
  createdAt: string;
}

export interface UserMeResponse {
  success: boolean;
  data: UserProfile;
  message: string | null;
}

function mapUserMe(o: UserMeApi): UserProfile {
  return {
    id: o.id,
    email: o.email,
    fullName: o.full_name,
    isActive: o.is_active,
    role: o.role,
    githubLogin: o.github_login,
    githubAvatarUrl: o.github_avatar_url,
    createdAt: o.created_at,
  };
}

function mapUserMeResponse(body: UserMeApiResponse): UserMeResponse {
  return {
    success: body.success,
    message: body.message ?? null,
    data: mapUserMe(body.data),
  };
}

/** GET /api/v1/users/search — query `q`, `limit`, `offset`. */
export interface UserSearchParams {
  q: string;
  limit?: number;
  offset?: number;
}

interface UserSearchRowApi {
  id: string;
  email: string;
  full_name: string;
  github_id: string | null;
  github_login: string | null;
  github_avatar_url: string | null;
}

interface UserSearchApiResponse {
  success: boolean;
  data: UserSearchRowApi[];
  message: string | null;
}

export interface UserSearchUser {
  id: string;
  email: string;
  fullName: string;
  githubId: string | null;
  githubLogin: string | null;
  githubAvatarUrl: string | null;
}

export interface UserSearchResponse {
  success: boolean;
  data: UserSearchUser[];
  message: string | null;
}

function mapUserSearchRow(row: UserSearchRowApi): UserSearchUser {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    githubId: row.github_id,
    githubLogin: row.github_login,
    githubAvatarUrl: row.github_avatar_url,
  };
}

function mapUserSearchResponse(body: UserSearchApiResponse): UserSearchResponse {
  return {
    success: body.success,
    message: body.message ?? null,
    data: body.data.map(mapUserSearchRow),
  };
}

/** User embed trong GET /orgs/:id/members (camelCase). */
export interface OrgMemberUser {
  id: string;
  email: string;
  fullName: string;
  githubId: string | null;
  githubLogin: string | null;
  githubAvatarUrl: string | null;
}

/** Hàng membership org (camelCase) — list / thêm member. */
export interface OrgMember {
  id: string;
  orgId: string;
  userId: string;
  role: string;
  createdAt: string;
  /** Có khi GET list trả kèm `user`; POST có thể không có. */
  user: OrgMemberUser | null;
}

/** POST /api/v1/orgs/:org_id/members — body `{ identifier, role: "member" }`; `data` không embed `user`. */
export interface AddOrgMemberRequest {
  identifier: string;
  role: "member";
}

interface OrgMemberRowApi {
  id: string;
  org_id: string;
  user_id: string;
  role: string;
  created_at: string;
}

interface OrgMemberUserApi {
  id: string;
  email: string;
  full_name: string;
  github_id: string | null;
  github_login: string | null;
  github_avatar_url: string | null;
}

/** GET list — mỗi hàng thường có `user` embed. */
interface OrgMemberListRowApi extends OrgMemberRowApi {
  user?: OrgMemberUserApi;
}

interface AddOrgMemberApiResponse {
  success: boolean;
  data: OrgMemberRowApi;
  message: string | null;
}

export interface AddOrgMemberResponse {
  success: boolean;
  data: OrgMember;
  message: string | null;
}

function mapOrgMemberUserApi(u: OrgMemberUserApi): OrgMemberUser {
  return {
    id: u.id,
    email: u.email,
    fullName: u.full_name,
    githubId: u.github_id,
    githubLogin: u.github_login,
    githubAvatarUrl: u.github_avatar_url,
  };
}

function mapOrgMemberFromApi(
  row: OrgMemberRowApi,
  embedUser?: OrgMemberUserApi | null
): OrgMember {
  return {
    id: row.id,
    orgId: row.org_id,
    userId: row.user_id,
    role: row.role,
    createdAt: row.created_at,
    user: embedUser ? mapOrgMemberUserApi(embedUser) : null,
  };
}

function mapAddOrgMemberResponse(body: AddOrgMemberApiResponse): AddOrgMemberResponse {
  return {
    success: body.success,
    message: body.message ?? null,
    data: mapOrgMemberFromApi(body.data),
  };
}

export interface OrgMembersListParams {
  q?: string;
  role?: string;
  limit?: number;
  offset?: number;
}

interface OrgMembersListApiResponse {
  success: boolean;
  data: OrgMemberListRowApi[];
  message: string | null;
}

export interface OrgMembersResponse {
  success: boolean;
  data: OrgMember[];
  message: string | null;
}

function mapOrgMembersListResponse(body: OrgMembersListApiResponse): OrgMembersResponse {
  return {
    success: body.success,
    message: body.message ?? null,
    data: body.data.map((row) => mapOrgMemberFromApi(row, row.user ?? null)),
  };
}

/** GET /api/v1/orgs/:org_id/members/search?q= */
interface OrgMemberSearchUserApi {
  id: string;
  email: string;
  full_name: string;
  github_login: string | null;
}

interface OrgMemberSearchApiResponse {
  success: boolean;
  data: OrgMemberSearchUserApi[];
  message: string | null;
}

export interface OrgMemberSearchUser {
  id: string;
  email: string;
  fullName: string;
  githubLogin: string;
}

export interface OrgMemberSearchResponse {
  success: boolean;
  data: OrgMemberSearchUser[];
  message: string | null;
}

function mapSearchUser(u: OrgMemberSearchUserApi): OrgMemberSearchUser {
  return {
    id: u.id,
    email: u.email,
    fullName: u.full_name,
    githubLogin: u.github_login ?? "",
  };
}

function mapOrgMemberSearchResponse(
  body: OrgMemberSearchApiResponse
): OrgMemberSearchResponse {
  return {
    success: body.success,
    message: body.message ?? null,
    data: body.data.map(mapSearchUser),
  };
}

/** DELETE /api/v1/orgs/:org_id/members/:user_id — body lỗi validation (FastAPI). */
export interface OrgMemberDeleteValidationItem {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: string;
  ctx?: Record<string, unknown>;
}

export interface OrgMemberDeleteErrorBody {
  detail: OrgMemberDeleteValidationItem[];
}

export const fetchUser = {
  /** GET /api/v1/users/me */
  getMe: async (): Promise<UserMeResponse> => {
    const response = await apiService.get<UserMeApiResponse>("/api/v1/users/me");
    return mapUserMeResponse(response.data);
  },

  /** GET /api/v1/users/search — `q`, `limit`, `offset`. */
  searchUsers: async (params: UserSearchParams): Promise<UserSearchResponse> => {
    const q = params.q.trim();
    const searchParams: Record<string, string | number> = { q };
    if (params.limit !== undefined) searchParams.limit = params.limit;
    if (params.offset !== undefined) searchParams.offset = params.offset;

    const response = await apiService.get<UserSearchApiResponse>(
      "/api/v1/users/search",
      searchParams
    );
    return mapUserSearchResponse(response.data);
  },

  /** GET /api/v1/orgs/:org_id/members — query `q`, `role`, `limit`, `offset` (path `org_id`). */
  listOrgMembers: async (
    orgId: string,
    params?: OrgMembersListParams
  ): Promise<OrgMembersResponse> => {
    const searchParams: Record<string, string | number> = {};
    const q = params?.q?.trim();
    const role = params?.role?.trim();
    if (q) searchParams.q = q;
    if (role) searchParams.role = role;
    if (params?.limit !== undefined) searchParams.limit = params.limit;
    if (params?.offset !== undefined) searchParams.offset = params.offset;

    const response = await apiService.get<OrgMembersListApiResponse>(
      `/api/v1/orgs/${encodeURIComponent(orgId)}/members`,
      Object.keys(searchParams).length > 0 ? searchParams : undefined
    );
    return mapOrgMembersListResponse(response.data);
  },

  /** POST /api/v1/orgs/:org_id/members — path `org_id`, body `identifier` + `role` (member). */
  addOrgMember: async (
    orgId: string,
    body: AddOrgMemberRequest
  ): Promise<AddOrgMemberResponse> => {
    const response = await apiService.post<AddOrgMemberApiResponse>(
      `/api/v1/orgs/${encodeURIComponent(orgId)}/members`,
      {
        identifier: body.identifier.trim(),
        role: body.role,
      }
    );
    return mapAddOrgMemberResponse(response.data);
  },

  /** GET /api/v1/orgs/:org_id/members/search */
  searchOrgMembers: async (
    orgId: string,
    q: string
  ): Promise<OrgMemberSearchResponse> => {
    const response = await apiService.get<OrgMemberSearchApiResponse>(
      `/api/v1/orgs/${encodeURIComponent(orgId)}/members/search`,
      { q }
    );
    return mapOrgMemberSearchResponse(response.data);
  },

  /** DELETE /api/v1/orgs/:org_id/members/:user_id */
  removeOrgMember: async (orgId: string, userId: string): Promise<void> => {
    await apiService.delete<unknown>(
      `/api/v1/orgs/${encodeURIComponent(orgId)}/members/${encodeURIComponent(userId)}`
    );
  },
};
