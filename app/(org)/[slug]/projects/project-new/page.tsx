"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import type { CreateOrgProjectRequest } from "@/lib/api/services/fetchProject";
import { useCreateOrgProject } from "@/hooks/useProject";

import { useOrgWorkspace } from "../../orgWorkspaceContext";
import { ProjectNewFooter } from "./components/projectNewFooter";
import { ProjectNewHeader } from "./components/projectNewHeader";
import { ProjectNewPreviewDialog } from "./components/projectNewPreviewDialog";
import { ProjectNewStepBasics } from "./components/steps/projectNewStepBasics";
import { ProjectNewStepContext } from "./components/steps/projectNewStepContext";
import { ProjectNewStepFlowsRules } from "./components/steps/projectNewStepFlowsRules";
import { ProjectNewStepSolution } from "./components/steps/projectNewStepSolution";
import { ProjectNewStepStakeholders } from "./components/steps/projectNewStepStakeholders";

const TOTAL_STEPS = 5;

function emptyCreateProjectForm(): CreateOrgProjectRequest {
  return {
    name: "",
    description: "",
    context: "",
    problems: "",
    stakeholders: "",
    businessGoals: "",
    businessFlows: "",
    businessRules: "",
    proposedSolutions: "",
  };
}

export default function OrgProjectNewPage() {
  const router = useRouter();
  const { orgId, slug } = useOrgWorkspace();
  const encSlug = encodeURIComponent(slug);
  const projectsBase = `/${encSlug}/projects`;

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CreateOrgProjectRequest>(emptyCreateProjectForm);
  const [previewOpen, setPreviewOpen] = useState(false);

  const createProject = useCreateOrgProject({
    onSuccess: (res) => {
      router.push(
        `${projectsBase}/${encodeURIComponent(res.data.slug)}/dashboard`
      );
    },
  });

  const patchForm = useCallback((patch: Partial<CreateOrgProjectRequest>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const exitWizard = useCallback(() => {
    router.replace(projectsBase);
  }, [router, projectsBase]);

  const nameOk = form.name.trim().length > 0;
  const isLast = step === TOTAL_STEPS - 1;
  const nextDisabled = isLast
    ? !nameOk || createProject.isPending
    : step === 0
      ? !nameOk
      : false;

  const handleNext = () => {
    if (isLast) {
      if (!nameOk || createProject.isPending) return;
      createProject.mutate({ orgId, body: form });
      return;
    }
    setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const stepContent = (() => {
    switch (step) {
      case 0:
        return (
          <ProjectNewStepBasics
            form={form}
            onPatch={patchForm}
            disabled={createProject.isPending}
          />
        );
      case 1:
        return (
          <ProjectNewStepContext
            form={form}
            onPatch={patchForm}
            disabled={createProject.isPending}
          />
        );
      case 2:
        return (
          <ProjectNewStepStakeholders
            form={form}
            onPatch={patchForm}
            disabled={createProject.isPending}
          />
        );
      case 3:
        return (
          <ProjectNewStepFlowsRules
            form={form}
            onPatch={patchForm}
            disabled={createProject.isPending}
          />
        );
      case 4:
        return (
          <ProjectNewStepSolution
            form={form}
            onPatch={patchForm}
            disabled={createProject.isPending}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <ProjectNewHeader
        projectsHref={projectsBase}
        onPreview={() => setPreviewOpen(true)}
        onExit={exitWizard}
      />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-8 sm:py-10">
        {stepContent}
      </div>
      <ProjectNewFooter
        currentStepIndex={step}
        totalSteps={TOTAL_STEPS}
        canGoBack={step > 0}
        onBack={handleBack}
        isLastStep={isLast}
        nextDisabled={nextDisabled}
        nextLoading={createProject.isPending}
        onNext={handleNext}
      />
      <ProjectNewPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        form={form}
      />
    </div>
  );
}
