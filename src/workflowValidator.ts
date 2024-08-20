import { Workflow } from './workflow.interface';

export class WorkflowValidator {
  static validate(workflow: Workflow): void {
    WorkflowValidator.validateSingleStartingNode(workflow);
    WorkflowValidator.validateDefinedNodes(workflow);
  }

  static validateDefinedNodes(workflow: Workflow): void {
    const definedNodes = new Set(workflow.nodes.map((node) => node.id));

    const edgeNodes = new Set(
      workflow.edges.flatMap((edge) => [edge.from, edge.to]),
    );

    if (
      definedNodes.size !== edgeNodes.size ||
      [...definedNodes].some((x) => !edgeNodes.has(x))
    ) {
      throw new Error(
        'Some node definitions are missing. The workflow is invalid.',
      );
    }
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
