import { WorkflowValidator } from '../src/workflowValidator';
import { Edge, Node } from '../src/workflow.interface';

describe('WorkflowValidator.validate', () => {
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
        WorkflowValidator.validate({ nodes, edges });
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
        WorkflowValidator.validate({ nodes, edges });
      }).not.toThrow(
        'There is exactly one starting node allowed in the workflow. The workflow is invalid.',
      );
    },
  );
});
