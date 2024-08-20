export interface Node<NodeId extends string = string> {
  id: NodeId;
  execute: () => { $next: string } | void; // `$next` is the name of the next edge to follow
  executionCount?: number;
}

export interface Edge<NodeId extends string = string> {
  name?: string;
  from: NodeId;
  to: NodeId;
}

export interface Workflow<NodeId extends string = string> {
  nodes: Node<NodeId>[];
  edges: Edge<NodeId>[];
}

export interface AdjacentEdges {
  [key: string]: Edge[];
}
