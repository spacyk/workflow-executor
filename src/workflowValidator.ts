import { Workflow } from './workflow.interface';

export class WorkflowValidator {
  static validate(workflow: Workflow): void {
    WorkflowValidator.validateSingleStartingNode(workflow);
  }
  static validateSingleStartingNode(workflow: Workflow): void {
    const connectedNodes = new Set<string>();
    workflow.edges.forEach((edge) => connectedNodes.add(edge.to));
    const startingNodes = workflow.nodes.filter(
      (node) => !connectedNodes.has(node.id),
    );
    if (startingNodes.length !== 1) {
      throw new Error(
        'There is exactly one starting node allowed in the workflow. The workflow is invalid.',
      );
    }
  }
}
