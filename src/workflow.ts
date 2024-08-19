import { Edge, EdgesByFrom, Workflow, Node } from './workflow.interface';
import { Queue } from './queue';

export class WorkflowExecutor {
  workflow: Workflow;
  edges: EdgesByFrom;
  nodesQueue: Queue<Node>;
  executedNodes: Set<Node>;

  constructor(workflow: Workflow) {
    this.workflow = workflow;
    this.edges = WorkflowExecutor.createEdgesByFrom(workflow.edges);
    this.nodesQueue = new Queue<Node>();
    this.executedNodes = new Set<Node>();
  }

  nodeById(id: string): Node | undefined {
    return this.workflow.nodes.find((node) => node.id === id);
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

  private enqueueNode(node: Node) {
    this.nodesQueue.enqueue(node);
  }

  private executeNode(node: Node) {
    this.executedNodes.add(node);
    const result = node.execute();
    const allowedEdgeName = result?.$next;

    const nextEdges = this.edges[node.id];
    nextEdges?.forEach((nextEdge) => {
      const nextNode = this.nodeById(nextEdge.to)!;

      // Conditional node, the edge is not allowed and shouldn't be followed
      if (allowedEdgeName && allowedEdgeName !== nextEdge?.name) return;
      // Node is already queued
      if (this.nodesQueue.has(nextNode)) return;
      // Node was already executed (we don't support double execution)
      if (this.executedNodes.has(nextNode)) return;

      this.enqueueNode(nextNode);
    });
  }

  public execute() {
    const startingNode = this.workflow.nodes[0];
    if (startingNode === undefined) return;
    this.enqueueNode(startingNode);

    while (!this.nodesQueue.isEmpty()) {
      this.executeNode(this.nodesQueue.dequeue()!);
    }
  }
}
