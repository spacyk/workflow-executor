import { WorkflowValidator } from '../src/workflowValidator';

describe('WorkflowValidator.validate', () => {
  it.each([
    {
      nodes: [],
      edges: [],
    },
    {
      nodes: [
        { id: 'A', execute: () => {} },
        { id: 'B', execute: () => {} },
      ],
      edges: [],
    },
    {
      nodes: [
        { id: 'A', execute: () => {} },
        { id: 'B', execute: () => {} },
        { id: 'C', execute: () => {} },
      ],
      edges: [{ from: 'A', to: 'B' }],
    },
  ])('test invalid workflow, number of starting nodes !== 1', (workflow) => {
    // Execute
    expect(() => {
      WorkflowValidator.validate(workflow);
    }).toThrow(
      'There is exactly one starting node allowed in the workflow. The workflow is invalid.',
    );
  });

  it.each([
    {
      nodes: [{ id: 'A', execute: () => {} }],
      edges: [],
    },
    {
      nodes: [
        { id: 'A', execute: () => {} },
        { id: 'B', execute: () => {} },
      ],
      edges: [{ from: 'A', to: 'B' }],
    },
  ])('test valid workflow, number of starting nodes === 1', (workflow) => {
    // Execute
    expect(() => {
      WorkflowValidator.validate(workflow);
    }).not.toThrow(
      'There is exactly one starting node allowed in the workflow. The workflow is invalid.',
    );
  });
});
