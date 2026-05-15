"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { useCachedGet } from "@/hooks/useCachedGet";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { fetchProject } from "@/lib/api/services/fetchProject";
import { orgProjectQueryKey, orgProjectsQueryKey } from "@/lib/query/query-keys";

import type {
  CreateOrgProjectRequest,
  CreateOrgProjectResponse,
  OrgProject,
  OrgProjectDetailResponse,
  OrgProjectsListResponse,
  UpdateOrgProjectRequest,
  UpdateOrgProjectResponse,
} from "@/lib/api/services/fetchProject";

type CreateOrgProjectVariables = {
  orgId: string;
  body: CreateOrgProjectRequest;
};

type UpdateOrgProjectVariables = {
  orgId: string;
  projectId: string;
  body: UpdateOrgProjectRequest;
};

type DeleteOrgProjectVariables = { orgId: string; projectId: string };

/**
 * GET /api/v1/orgs/:org_id/projects — `orgId` rỗng thì `enabled: false`.
 */
export function useOrgProjects(
  orgId: string | null | undefined,
  options?: { enabled?: boolean }
) {
  const id = orgId?.trim() ?? "";
  const enabled = Boolean(id) && (options?.enabled ?? true);

  return useCachedGet<OrgProjectsListResponse, Error, OrgProject[]>({
    queryKey: orgProjectsQueryKey(id),
    queryFn: async () => fetchProject.listOrgProjects(id),
    select: (res) => res.data,
    enabled,
  });
}

export function useOrgProjectsFull(
  orgId: string | null | undefined,
  options?: { enabled?: boolean }
) {
  const id = orgId?.trim() ?? "";
  const enabled = Boolean(id) && (options?.enabled ?? true);

  return useCachedGet({
    queryKey: orgProjectsQueryKey(id),
    queryFn: () => fetchProject.listOrgProjects(id),
    enabled,
  });
}

/**
 * GET /api/v1/orgs/:org_id/projects/:project_id — thiếu id thì `enabled: false`.
 */
export function useOrgProject(
  orgId: string | null | undefined,
  projectId: string | null | undefined,
  options?: { enabled?: boolean }
) {
  const oid = orgId?.trim() ?? "";
  const pid = projectId?.trim() ?? "";
  const enabled = Boolean(oid && pid) && (options?.enabled ?? true);

  return useCachedGet<OrgProjectDetailResponse, Error, OrgProject>({
    queryKey: orgProjectQueryKey(oid, pid),
    queryFn: async () => fetchProject.getOrgProject(oid, pid),
    select: (res) => res.data,
    enabled,
  });
}

export function useOrgProjectFull(
  orgId: string | null | undefined,
  projectId: string | null | undefined,
  options?: { enabled?: boolean }
) {
  const oid = orgId?.trim() ?? "";
  const pid = projectId?.trim() ?? "";
  const enabled = Boolean(oid && pid) && (options?.enabled ?? true);

  return useCachedGet({
    queryKey: orgProjectQueryKey(oid, pid),
    queryFn: () => fetchProject.getOrgProject(oid, pid),
    enabled,
  });
}

/**
 * POST /api/v1/orgs/:org_id/projects — invalidate danh sách dự án theo org.
 */
export function useCreateOrgProject(
  options?: Omit<
    UseMutationOptions<
      CreateOrgProjectResponse,
      Error,
      CreateOrgProjectVariables
    >,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } =
    options ?? {};

  return useMutation({
    ...rest,
    mutationFn: async ({
      orgId,
      body,
    }: CreateOrgProjectVariables): Promise<CreateOrgProjectResponse> => {
      const result = await fetchProject.createProject(orgId, body);
      if (!result.success) {
        throw new Error(result.message ?? "Tạo dự án thất bại");
      }
      return result;
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      const key = orgProjectsQueryKey(variables.orgId);
      queryClient.setQueryData<OrgProjectsListResponse>(key, (old) => {
        const created = data.data;
        if (!old?.data?.length) {
          return { success: true, data: [created], message: data.message };
        }
        if (
          old.data.some(
            (p) => p.id === created.id || p.slug === created.slug
          )
        ) {
          return old;
        }
        return { ...old, data: [...old.data, created] };
      });
      void queryClient.invalidateQueries({ queryKey: key });
      toast.success("Đã tạo dự án");
      userOnSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error, "Tạo dự án thất bại"));
      userOnError?.(error, variables, onMutateResult, context);
    },
  });
}

/**
 * PATCH /api/v1/orgs/:org_id/projects/:project_id — invalidate list + detail.
 */
export function useUpdateOrgProject(
  options?: Omit<
    UseMutationOptions<
      UpdateOrgProjectResponse,
      Error,
      UpdateOrgProjectVariables
    >,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } =
    options ?? {};

  return useMutation({
    ...rest,
    mutationFn: async ({
      orgId,
      projectId,
      body,
    }: UpdateOrgProjectVariables): Promise<UpdateOrgProjectResponse> => {
      const result = await fetchProject.updateOrgProject(
        orgId,
        projectId,
        body
      );
      if (!result.success) {
        throw new Error(result.message ?? "Cập nhật dự án thất bại");
      }
      return result;
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        queryKey: orgProjectsQueryKey(variables.orgId),
      });
      void queryClient.invalidateQueries({
        queryKey: orgProjectQueryKey(variables.orgId, variables.projectId),
      });
      toast.success("Đã cập nhật dự án");
      userOnSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error, "Cập nhật dự án thất bại"));
      userOnError?.(error, variables, onMutateResult, context);
    },
  });
}

/**
 * DELETE /api/v1/orgs/:org_id/projects/:project_id — invalidate list, xóa cache detail.
 */
export function useDeleteOrgProject(
  options?: Omit<
    UseMutationOptions<void, Error, DeleteOrgProjectVariables>,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } =
    options ?? {};

  return useMutation({
    ...rest,
    mutationFn: async ({
      orgId,
      projectId,
    }: DeleteOrgProjectVariables): Promise<void> => {
      await fetchProject.deleteOrgProject(orgId, projectId);
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.removeQueries({
        queryKey: orgProjectQueryKey(variables.orgId, variables.projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: orgProjectsQueryKey(variables.orgId),
      });
      toast.success("Đã xóa dự án");
      userOnSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error, "Xóa dự án thất bại"));
      userOnError?.(error, variables, onMutateResult, context);
    },
  });
}

export type {
  CreateOrgProjectRequest,
  CreateOrgProjectResponse,
  OrgProject,
  OrgProjectDetailResponse,
  OrgProjectsListResponse,
  UpdateOrgProjectRequest,
  UpdateOrgProjectResponse,
} from "@/lib/api/services/fetchProject";
