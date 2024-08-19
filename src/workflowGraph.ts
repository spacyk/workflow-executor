import { Edge, EdgesByFrom } from './workflow.interface';
import Graph from 'tarjan-graph';

export class WorkflowGraph {
  edges: EdgesByFrom;
  graph: Graph;
  cyclicNodesIds: string[];
  constructor(edges: Edge[]) {
    this.edges = WorkflowGraph.createEdgesByFrom(edges);
    this.graph = WorkflowGraph.constructGraph(this.edges);
    this.cyclicNodesIds = WorkflowGraph.getAllCyclicNodes(this.graph);
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

  static constructGraph(edges: EdgesByFrom): Graph {
    const graph = new Graph();
    Object.keys(edges).forEach((key) => {
      const connectedNodes: string[] = edges[key]!.map((edge) => {
        return edge.to;
      });
      graph.add(key, connectedNodes);
    });
    return graph;
  }

  /**
   * Flattens the structure to get the list of cyclic IDs.
   *
   * @param graph
   * @returns The list of nodes (IDs) that are part of the cycle.
   */
  static getAllCyclicNodes(graph: Graph): string[] {
    return graph
      .getCycles()
      .reduce((accumulator, value) => accumulator.concat(value), [])
      .map((value) => value.name);
  }
}
