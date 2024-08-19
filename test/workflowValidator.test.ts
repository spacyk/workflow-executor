import { WorkflowValidator } from '../src/workflowValidator';

describe('WorkflowValidator.validate', () => {
  it.each([
    {
      nodes: [],
      edges: [],
    },
    {
      nodes: [
        { id: 'A', execute: () => console.log('A') },
        { id: 'B', execute: () => console.log('B') },
      ],
      edges: [],
    },
    {
      nodes: [
        { id: 'A', execute: () => console.log('A') },
        { id: 'B', execute: () => console.log('B') },
        { id: 'C', execute: () => console.log('C') },
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
      nodes: [{ id: 'A', execute: () => console.log('A') }],
      edges: [],
    },
    {
      nodes: [
        { id: 'A', execute: () => console.log('A') },
        { id: 'B', execute: () => console.log('B') },
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
