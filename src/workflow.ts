import {
  Edge,
  EdgesByFrom,
  NodesById,
  Workflow,
  Node,
} from './workflow.interface';
import { Queue } from './queue';

export class WorkflowExecutor {
  workflow: Workflow;
  nodesQueue: Queue<Node>;
  nodes: NodesById;
  edges: EdgesByFrom;

  constructor(workflow: Workflow) {
    this.workflow = workflow;
    this.nodesQueue = new Queue<Node>();
    this.nodes = WorkflowExecutor.createNodesById(workflow.nodes);
    this.edges = WorkflowExecutor.createEdgesByFrom(workflow.edges);
  }

  static createNodesById(nodes: Node[]): NodesById {
    const nodesById: NodesById = {};
    nodes.forEach((node) => {
      nodesById[node.id] = node;
    });
    return nodesById;
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
    node.execute();

    const nextEdges = this.edges[node.id];
    nextEdges?.forEach((nextEdge) => {
      const nextNode = this.nodes[nextEdge.to]!;
      this.enqueueNode(nextNode);
    });
  }

  public execute() {
    // We need to add validation of the workflow
    const startingNode = this.workflow.nodes[0]!;

    this.enqueueNode(startingNode);

    while (!this.nodesQueue.isEmpty()) {
      this.executeNode(this.nodesQueue.dequeue()!);
    }

    console.log('Workflow executed');
  }
}
