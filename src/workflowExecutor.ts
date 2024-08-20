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
   * @remarks
   * Valid workflow should contain only a single starting node. (Node without any receiving edges)
   * If the workflow contains cycles, the starting node is not allowed to be part of the cycle.
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
    node.executionCount = node.executionCount || 0;
    this.nodesQueue.enqueue(node);
  }

  /**
   * Checks whether we can enqueue the provided node for execution.
   * We allow multiple executions for nodes that are part of the cycle.
   *
   * @remarks
   * Don't allow to enqueue if:
   *  - node execution has exceeded the max number of times
   *  - node is already queued and with that it has exceeded the max number
   *
   * @param node - The node we want to verify
   * @returns boolean
   */
  isNodeAllowedToEnqueue(node: Node): boolean {
    const maxAllowedExecutions: number = this.graph.cyclicNodesIds.includes(
      node.id,
    )
      ? 1 + this.numberOfCyclesAllowed
      : 1;

    if (node.executionCount! >= maxAllowedExecutions) return false;
    if (
      this.nodesQueue.has(node) &&
      node.executionCount! >= maxAllowedExecutions - 1
    )
      return false;
    return true;
  }

  private executeNode(node: Node) {
    node.executionCount = node.executionCount! + 1;
    const result = node.execute();
    const allowedEdgeName = result?.$next;

    const nextEdges = this.graph.edges[node.id];
    nextEdges?.forEach((nextEdge) => {
      const nextNode = this.nodeById(nextEdge.to)!;

      /* Conditional node, the edge is not allowed and won't be followed */
      if (allowedEdgeName && allowedEdgeName !== nextEdge?.name) return;

      if (this.isNodeAllowedToEnqueue(nextNode)) {
        this.enqueueNode(nextNode);
      }
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
