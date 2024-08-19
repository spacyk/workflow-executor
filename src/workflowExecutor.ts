import { Workflow, Node, Edge } from './workflow.interface';
import { Queue } from './queue';
import { WorkflowValidator } from './workflowValidator';
import { WorkflowGraph } from './workflowGraph';

export class WorkflowExecutor {
  edges: Edge[];
  nodes: Node[];
  numberOfCyclesAllowed: number;
  graph: WorkflowGraph;
  nodesQueue: Queue<Node>;

  /**
   * workflowExecutor constructor.
   *
   * @param workflow - Workflow to be executed
   * @param numberOfCyclesAllowed - Number of cyclic node executions we want to allow
   * in case the Workflow contains cycles
   */
  constructor(workflow: Workflow, numberOfCyclesAllowed: number = 0) {
    WorkflowValidator.validate(workflow);
    this.edges = workflow.edges;
    this.nodes = workflow.nodes;
    this.numberOfCyclesAllowed = numberOfCyclesAllowed;
    this.graph = new WorkflowGraph(workflow.edges);
    this.nodesQueue = new Queue<Node>();
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
    node.executionCount = (node.executionCount || 0) + 1;
    const result = node.execute();
    const allowedEdgeName = result?.$next;

    const nextEdges = this.graph.edges[node.id];
    nextEdges?.forEach((nextEdge) => {
      const nextNode = this.nodeById(nextEdge.to)!;

      // Conditional node, the edge is not allowed and shouldn't be followed
      if (allowedEdgeName && allowedEdgeName !== nextEdge?.name) return;

      const maxAllowedExecutions: number = this.graph.cyclicNodesIds.includes(
        nextNode.id,
      )
        ? 1 + this.numberOfCyclesAllowed
        : 1;

      // Node was already executed (we don't support double execution)
      if (
        nextNode.executionCount &&
        nextNode.executionCount >= maxAllowedExecutions
      )
        return;
      // Node is already queued
      if (
        this.nodesQueue.has(nextNode) &&
        nextNode.executionCount &&
        nextNode.executionCount >= maxAllowedExecutions - 1
      )
        return;

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
