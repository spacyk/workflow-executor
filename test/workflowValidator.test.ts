import { WorkflowValidator } from '../src/workflowValidator';
import { Edge, Node } from '../src/workflow.interface';

describe('WorkflowValidator.validateSingleStartingNode', () => {
  it.each([
    [[], []],
    [
      [
        { id: 'A', execute: () => {} },
        { id: 'B', execute: () => {} },
      ],
      [],
    ],
    [
      [
        { id: 'A', execute: () => {} },
        { id: 'B', execute: () => {} },
        { id: 'C', execute: () => {} },
      ],
      [{ from: 'A', to: 'B' }],
    ],
  ])(
    'validate invalid workflow, number of starting nodes !== 1',
    (nodes: Node[], edges: Edge[]) => {
      // Execute
      expect(() => {
        WorkflowValidator.validateSingleStartingNode({ nodes, edges });
      }).toThrow(
        'There is exactly one starting node allowed in the workflow. The workflow is invalid.',
      );
    },
  );

  it.each([
    [[{ id: 'A', execute: () => {} }], []],
    [
      [
        { id: 'A', execute: () => {} },
        { id: 'B', execute: () => {} },
      ],
      [{ from: 'A', to: 'B' }],
    ],
  ])(
    'validate valid workflow, number of starting nodes === 1',
    (nodes: Node[], edges: Edge[]) => {
      // Execute
      expect(() => {
        WorkflowValidator.validateSingleStartingNode({ nodes, edges });
      }).not.toThrow(
        'There is exactly one starting node allowed in the workflow. The workflow is invalid.',
      );
    },
  );
  it.each([
    [
      [
        { id: 'A', execute: () => {} },
        { id: 'B', execute: () => {} },
      ],
      [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
      ],
    ],
    [
      [
        { id: 'A', execute: () => {} },
        { id: 'B', execute: () => {} },
        { id: 'C', execute: () => {} },
      ],
      [{ from: 'A', to: 'B' }],
    ],
  ])(
    'validate nodes missing in the workflow definition',
    (nodes: Node[], edges: Edge[]) => {
      // Execute
      expect(() => {
        WorkflowValidator.validateDefinedNodes({ nodes, edges });
      }).toThrow('Some node definitions are missing. The workflow is invalid.');
    },
  );
});
