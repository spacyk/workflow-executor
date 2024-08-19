import { Edge, EdgesByFrom, Workflow } from './workflow.interface';

export class WorkflowGraph {
  edges: EdgesByFrom;
  constructor(workflow: Workflow) {
    this.edges = WorkflowGraph.createEdgesByFrom(workflow.edges);
  }

  static createEdgesByFrom(edges: Edge[]): EdgesByFrom {
    const edgesByFrom: EdgesByFrom = {};
    edges.forEach((edge) => {
      const from = edge.from;
      if (from in edgesByFrom) {
        edgesByFrom[from]?.push(edge);
      } else {
        edgesByFrom[from] = [edge];
      }
    });
    return edgesByFrom;
  }
}
