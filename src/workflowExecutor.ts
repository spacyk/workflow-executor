import { Workflow, Node, Edge } from './workflow.interface';
import { Queue } from './queue';
import { WorkflowValidator } from './workflowValidator';
import { WorkflowGraph } from './workflowGraph';

export class WorkflowExecutor {
  edges: Edge[];
  nodes: Node[];
  graph: WorkflowGraph;
  nodesQueue: Queue<Node>;
  executedNodes: Set<Node>;

  constructor(workflow: Workflow) {
    WorkflowValidator.validate(workflow);
    this.edges = workflow.edges;
    this.nodes = workflow.nodes;
    this.graph = new WorkflowGraph(workflow);
    this.nodesQueue = new Queue<Node>();
    this.executedNodes = new Set<Node>();
  }

  nodeById(id: string): Node | undefined {
    return this.nodes.find((node) => node.id === id);
  }

  getStartingNode(): Node {
    const connectedNodes = new Set<string>();
    this.edges.forEach((edge) => connectedNodes.add(edge.to));
    return this.nodes.filter((node) => !connectedNodes.has(node.id))[0]!;
  }

  private enqueueNode(node: Node) {
    this.nodesQueue.enqueue(node);
  }

  private executeNode(node: Node) {
    this.executedNodes.add(node);
    const result = node.execute();
    const allowedEdgeName = result?.$next;

    const nextEdges = this.graph.edges[node.id];
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
    const startingNode = this.getStartingNode();
    this.enqueueNode(startingNode);

    while (!this.nodesQueue.isEmpty()) {
      this.executeNode(this.nodesQueue.dequeue()!);
    }
  }
}
