import type { NodeTypes } from "@/components/ui/react-flow";

import { ActorNodeCard } from "../actor/actorNodeCard";
import { EpicNodeCard } from "../epic/epicNodeCard";
import { FeatureNodeCard } from "../features/featureNodeCard";
import { UserStoryNodeCard } from "../userStory/userStoryNodeCard";

export const requirementsFlowNodeTypes = {
  actor: ActorNodeCard,
  epic: EpicNodeCard,
  feature: FeatureNodeCard,
  userStory: UserStoryNodeCard,
} satisfies NodeTypes;
