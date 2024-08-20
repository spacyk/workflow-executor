import { AdjacentEdges, Edge } from './workflow.interface';
import Graph from 'tarjan-graph';

export class WorkflowGraph {
  adjacentEdges: AdjacentEdges;
  graph: Graph;
  cyclicNodesIds: string[];
  constructor(edges: Edge[]) {
    this.adjacentEdges = WorkflowGraph.buildAdjacentEdges(edges);
    this.graph = WorkflowGraph.buildGraph(this.adjacentEdges);
    this.cyclicNodesIds = WorkflowGraph.getAllCyclicNodes(this.graph);
  }

  static buildAdjacentEdges(edges: Edge[]): AdjacentEdges {
    const adjacentEdges: AdjacentEdges = {};
    edges.forEach((edge) => {
      const from = edge.from;
      if (from in adjacentEdges) {
        adjacentEdges[from]?.push(edge);
      } else {
        adjacentEdges[from] = [edge];
      }
    });
    return adjacentEdges;
  }

  static buildGraph(adjacentEdges: AdjacentEdges): Graph {
    const graph = new Graph();
    Object.keys(adjacentEdges).forEach((key) => {
      const connectedNodes: string[] = adjacentEdges[key]!.map((edge) => {
        return edge.to;
      });
      graph.add(key, connectedNodes);
    });
    return graph;
  }

  /**
   * Flattens the structure to get the list of cyclic node IDs.
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
