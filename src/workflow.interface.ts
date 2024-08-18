export interface Node {
  id: string;
  execute: () => { $next: string } | void; // `$next` is the name of the next edge to follow
}

export interface Edge {
  name?: string;
  from: string;
  to: string;
}

export interface Workflow {
  nodes: Node[];
  edges: Edge[];
}

export interface NodesById {
  [key: string]: Node;
}

export interface EdgesByFrom {
  [key: string]: Edge[];
}
