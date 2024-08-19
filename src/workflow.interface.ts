export interface Edge<EdgeId extends string = string> {
  from: string;
  id?: EdgeId;
  to: string;
}

export interface Node<EdgeId extends string = string> {
  execute: () => { $next: EdgeId } | void;
  id: string;
}

export interface Workflow<EdgeId extends string = string> {
  edges: Edge<EdgeId>[];
  nodes: Node<EdgeId>[];
}

export const defineWorkflow = <EdgeId extends string>(
  workflow: Workflow<EdgeId>,
): Workflow<EdgeId> => {
  return workflow;
};

export interface EdgesByFrom<EdgeId extends string = string> {
  [key: string]: Edge<EdgeId>[];
}
