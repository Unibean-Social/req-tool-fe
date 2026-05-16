"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { useCachedGet } from "@/hooks/useCachedGet";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  fetchActor,
  type CreateProjectActorRequest,
  type CreateProjectActorResponse,
  type ProjectActor,
  type ProjectActorsListResponse,
  type UpdateProjectActorRequest,
  type UpdateProjectActorResponse,
} from "@/lib/api/services/fetchActor";
import { projectActorsQueryKey } from "@/lib/query/query-keys";

type CreateProjectActorVariables = {
  projectId: string;
  body: CreateProjectActorRequest;
};

type UpdateProjectActorVariables = {
  projectId: string;
  actorId: string;
  body: UpdateProjectActorRequest;
};

type DeleteProjectActorVariables = { projectId: string; actorId: string };

/**
 * GET /api/v1/projects/:project_id/actors — thiếu `projectId` thì `enabled: false`.
 */
export function useProjectActors(
  projectId: string | null | undefined,
  options?: { enabled?: boolean }
) {
  const pid = projectId?.trim() ?? "";
  const enabled = Boolean(pid) && (options?.enabled ?? true);

  return useCachedGet<ProjectActorsListResponse, Error, ProjectActor[]>({
    queryKey: projectActorsQueryKey(pid),
    queryFn: async () => fetchActor.list(pid),
    select: (res) => res.data,
    enabled,
  });
}

export function useProjectActorsFull(
  projectId: string | null | undefined,
  options?: { enabled?: boolean }
) {
  const pid = projectId?.trim() ?? "";
  const enabled = Boolean(pid) && (options?.enabled ?? true);

  return useCachedGet({
    queryKey: projectActorsQueryKey(pid),
    queryFn: () => fetchActor.list(pid),
    enabled,
  });
}

/**
 * POST /api/v1/projects/:project_id/actors — invalidate cache actors theo dự án.
 */
export function useCreateProjectActor(
  options?: Omit<
    UseMutationOptions<
      CreateProjectActorResponse,
      Error,
      CreateProjectActorVariables
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
      projectId,
      body,
    }: CreateProjectActorVariables): Promise<CreateProjectActorResponse> => {
      const result = await fetchActor.create(projectId, body);
      if (!result.success) {
        throw new Error(result.message ?? "Tạo actor thất bại");
      }
      return result;
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        queryKey: projectActorsQueryKey(variables.projectId),
      });
      toast.success("Đã tạo actor");
      userOnSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error, "Tạo actor thất bại"));
      userOnError?.(error, variables, onMutateResult, context);
    },
  });
}

/**
 * PATCH /api/v1/projects/:project_id/actors/:actor_id — invalidate danh sách actors.
 */
export function useUpdateProjectActor(
  options?: Omit<
    UseMutationOptions<
      UpdateProjectActorResponse,
      Error,
      UpdateProjectActorVariables
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
      projectId,
      actorId,
      body,
    }: UpdateProjectActorVariables): Promise<UpdateProjectActorResponse> => {
      const result = await fetchActor.update(projectId, actorId, body);
      if (!result.success) {
        throw new Error(result.message ?? "Cập nhật actor thất bại");
      }
      return result;
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        queryKey: projectActorsQueryKey(variables.projectId),
      });
      toast.success("Đã cập nhật actor");
      userOnSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error, "Cập nhật actor thất bại"));
      userOnError?.(error, variables, onMutateResult, context);
    },
  });
}

/**
 * DELETE /api/v1/projects/:project_id/actors/:actor_id — invalidate danh sách actors.
 */
export function useDeleteProjectActor(
  options?: Omit<
    UseMutationOptions<void, Error, DeleteProjectActorVariables>,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } =
    options ?? {};

  return useMutation({
    ...rest,
    mutationFn: async ({
      projectId,
      actorId,
    }: DeleteProjectActorVariables): Promise<void> => {
      await fetchActor.delete(projectId, actorId);
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        queryKey: projectActorsQueryKey(variables.projectId),
      });
      toast.success("Đã xóa actor");
      userOnSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      toast.error(getApiErrorMessage(error, "Xóa actor thất bại"));
      userOnError?.(error, variables, onMutateResult, context);
    },
  });
}

export type {
  CreateProjectActorRequest,
  CreateProjectActorResponse,
  ProjectActor,
  ProjectActorsListResponse,
  UpdateProjectActorRequest,
  UpdateProjectActorResponse,
} from "@/lib/api/services/fetchActor";
