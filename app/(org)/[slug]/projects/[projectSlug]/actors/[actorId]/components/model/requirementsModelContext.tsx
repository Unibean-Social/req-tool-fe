"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";

import type {
  PaletteCreatableKind,
  RequirementEdge,
  RequirementNode,
  RequirementNodeData,
  RequirementNodeKind,
  RequirementsModelState,
  RequirementsViewMode,
} from "./requirementsModelTypes";
import {
  createDefaultNodeData,
  getRequirementsModelActorMeta,
  getRequirementsModelMock,
  type RequirementsModelActorMeta,
  REQUIREMENTS_MOCK_PROJECT_ID,
} from "./requirementsModelMock";
import {
  REQUIREMENT_EDGE_DEFAULT_OPTIONS,
  REQUIREMENT_INVALID_EDGE_STYLE,
} from "./requirementsModelConstants";
import {
  layoutRequirementTree,
  positionChildBelowParent,
} from "./requirementsModelLayout";
import { validateRequirementConnection } from "./requirementsModelValidation";

type RequirementsModelContextValue = {
  nodes: RequirementNode[];
  edges: RequirementEdge[];
  visibleNodes: RequirementNode[];
  visibleEdges: RequirementEdge[];
  viewMode: RequirementsViewMode;
  setViewMode: (mode: RequirementsViewMode) => void;
  selectedNodeId: string | null;
  panelOpen: boolean;
  selectNode: (id: string | null) => void;
  closePanel: () => void;
  updateNodeData: (id: string, patch: Partial<RequirementNodeData>) => void;
  setNodes: React.Dispatch<React.SetStateAction<RequirementNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<RequirementEdge[]>>;
  onNodesChange: OnNodesChange<RequirementNode>;
  onEdgesChange: OnEdgesChange<RequirementEdge>;
  onConnect: OnConnect;
  actorMeta: RequirementsModelActorMeta;
  addNodeFromPalette: (
    kind: PaletteCreatableKind,
    position: { x: number; y: number }
  ) => string;
  quickAddFeature: (epicNodeId: string) => void;
  toggleNodeCollapsed: (nodeId: string) => void;
  runAutoLayout: () => void;
  suggestedActorsForStory: () => string[];
};

const RequirementsModelContext =
  createContext<RequirementsModelContextValue | null>(null);

function filterByViewMode(
  state: RequirementsModelState,
  viewMode: RequirementsViewMode
): RequirementsModelState {
  const hideKinds = new Set<RequirementNodeKind>();
  if (viewMode === "epic") {
    hideKinds.add("feature");
    hideKinds.add("userStory");
  } else if (viewMode === "feature") {
    hideKinds.add("userStory");
  }
  const visibleIds = new Set(
    state.nodes.filter((n) => !hideKinds.has(n.data.kind)).map((n) => n.id)
  );
  const collapsedHidden = new Set<string>();
  for (const n of state.nodes) {
    if (!n.data.collapsed) continue;
    const childEdges = state.edges.filter((e) => e.source === n.id);
    const stack = childEdges.map((e) => e.target);
    while (stack.length) {
      const id = stack.pop()!;
      if (collapsedHidden.has(id)) continue;
      collapsedHidden.add(id);
      state.edges
        .filter((e) => e.source === id)
        .forEach((e) => stack.push(e.target));
    }
  }
  const nodes = state.nodes.filter(
    (n) => visibleIds.has(n.id) && !collapsedHidden.has(n.id)
  );
  const nodeIdSet = new Set(nodes.map((n) => n.id));
  const edges = state.edges.filter(
    (e) =>
      nodeIdSet.has(e.source) &&
      nodeIdSet.has(e.target) &&
      !e.data?.invalid
  );
  return { nodes, edges };
}

export function RequirementsModelProvider({
  actorId,
  children,
}: {
  actorId: string;
  children: ReactNode;
}) {
  const actorMeta = useMemo(
    () => getRequirementsModelActorMeta(actorId),
    [actorId]
  );
  const initial = useMemo(() => {
    const mock = getRequirementsModelMock(actorId);
    return {
      nodes: layoutRequirementTree(mock.nodes, mock.edges, actorId),
      edges: mock.edges,
    };
  }, [actorId]);

  const [nodes, setNodes, onNodesChangeBase] = useNodesState<RequirementNode>(
    initial.nodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<RequirementEdge>(
    initial.edges
  );

  const [viewMode, setViewMode] = useState<RequirementsViewMode>("full");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const panelOpen = selectedNodeId != null;

  useEffect(() => {
    setNodes(initial.nodes);
    setEdges(initial.edges);
    setSelectedNodeId(null);
  }, [actorId, initial, setEdges, setNodes]);

  const onNodesChange: OnNodesChange<RequirementNode> = useCallback(
    (changes) => {
      const filtered = changes.filter(
        (change) => !(change.type === "remove" && change.id === actorId)
      );
      onNodesChangeBase(filtered);
    },
    [actorId, onNodesChangeBase]
  );

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({ ...n, selected: n.id === selectedNodeId }))
    );
  }, [selectedNodeId, setNodes]);

  const { visibleNodes, visibleEdges } = useMemo(() => {
    const filtered = filterByViewMode({ nodes, edges }, viewMode);
    return { visibleNodes: filtered.nodes, visibleEdges: filtered.edges };
  }, [nodes, edges, viewMode]);

  const selectNode = useCallback((id: string | null) => {
    setSelectedNodeId(id);
  }, []);

  const closePanel = useCallback(() => setSelectedNodeId(null), []);

  const updateNodeData = useCallback(
    (id: string, patch: Partial<RequirementNodeData>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id
            ? { ...n, data: { ...n.data, ...patch } as RequirementNodeData }
            : n
        )
      );
    },
    [setNodes]
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      const result = validateRequirementConnection(
        nodes,
        connection.source,
        connection.target
      );
      if (!result.valid) {
        setEdges((eds) =>
          addEdge(
            {
              ...connection,
              id: `invalid-${connection.source}-${connection.target}`,
              animated: true,
              style: { ...REQUIREMENT_INVALID_EDGE_STYLE },
              data: { invalid: true, message: result.message },
            },
            eds
          )
        );
        setTimeout(() => {
          setEdges((eds) =>
            eds.filter(
              (e) =>
                !(
                  e.source === connection.source &&
                  e.target === connection.target &&
                  e.data?.invalid
                )
            )
          );
        }, 900);
        return;
      }
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            ...REQUIREMENT_EDGE_DEFAULT_OPTIONS,
          },
          eds
        )
      );
    },
    [nodes, setEdges]
  );

  const addNodeFromPalette = useCallback(
    (kind: PaletteCreatableKind, position: { x: number; y: number }) => {
      const id = `node-${kind}-${crypto.randomUUID().slice(0, 8)}`;
      const newNode: RequirementNode = {
        id,
        type: kind,
        position,
        selected: true,
        data: createDefaultNodeData(kind, {
          projectId: REQUIREMENTS_MOCK_PROJECT_ID,
          actorRef: actorMeta.name,
        }),
      };
      setNodes((nds) => [
        ...nds.map((n) => ({ ...n, selected: false })),
        newNode,
      ]);
      if (kind === "epic") {
        setEdges((eds) =>
          addEdge(
            {
              id: `e-${actorId}-${id}`,
              source: actorId,
              target: id,
              ...REQUIREMENT_EDGE_DEFAULT_OPTIONS,
            },
            eds
          )
        );
      }
      setSelectedNodeId(id);
      return id;
    },
    [actorId, actorMeta.name, setEdges, setNodes]
  );

  const quickAddFeature = useCallback(
    (epicNodeId: string) => {
      const epic = nodes.find((n) => n.id === epicNodeId);
      if (!epic) return;
      const id = `node-feature-${crypto.randomUUID().slice(0, 8)}`;
      const siblingCount = edges.filter(
        (e) => e.source === epicNodeId && !e.data?.invalid
      ).length;
      const newNode: RequirementNode = {
        id,
        type: "feature",
        position: positionChildBelowParent(epic, "feature", siblingCount),
        selected: true,
        data: createDefaultNodeData("feature", { epicId: epicNodeId }),
      };
      setNodes((nds) => [
        ...nds.map((n) => ({ ...n, selected: false })),
        newNode,
      ]);
      setEdges((eds) =>
        addEdge(
          {
            id: `e-${epicNodeId}-${id}`,
            source: epicNodeId,
            target: id,
            ...REQUIREMENT_EDGE_DEFAULT_OPTIONS,
          },
          eds
        )
      );
      setSelectedNodeId(id);
    },
    [edges, nodes, setEdges, setNodes]
  );

  const toggleNodeCollapsed = useCallback(
    (nodeId: string) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, collapsed: !n.data.collapsed } }
            : n
        )
      );
    },
    [setNodes]
  );

  const runAutoLayout = useCallback(() => {
    setNodes((nds) => layoutRequirementTree(nds, edges, actorId));
  }, [actorId, edges, setNodes]);

  const suggestedActorsForStory = useCallback(() => {
    const root = nodes.find((n) => n.id === actorId);
    if (root?.data.kind === "actor") {
      const name = root.data.title.trim() || actorMeta.name.trim();
      return name ? [name] : [];
    }
    return actorMeta.name.trim() ? [actorMeta.name.trim()] : [];
  }, [actorId, actorMeta.name, nodes]);

  const value: RequirementsModelContextValue = {
    actorMeta,
    nodes,
    edges,
    visibleNodes,
    visibleEdges,
    viewMode,
    setViewMode,
    selectedNodeId,
    panelOpen,
    selectNode,
    closePanel,
    updateNodeData,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNodeFromPalette,
    quickAddFeature,
    toggleNodeCollapsed,
    runAutoLayout,
    suggestedActorsForStory,
  };

  return (
    <RequirementsModelContext.Provider value={value}>
      {children}
    </RequirementsModelContext.Provider>
  );
}

export function useRequirementsModel() {
  const ctx = useContext(RequirementsModelContext);
  if (!ctx) {
    throw new Error(
      "useRequirementsModel must be used within RequirementsModelProvider"
    );
  }
  return ctx;
}
