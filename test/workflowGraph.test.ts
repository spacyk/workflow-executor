import { WorkflowGraph } from '../src/workflowGraph';

describe('WorkflowGraph.createEdgesByFrom', () => {
  it.each([
    {
      data: [{ name: 'true', from: 'A', to: 'B' }],
      expected: { A: [{ name: 'true', from: 'A', to: 'B' }] },
    },
    {
      data: [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
        { from: 'A', to: 'D' },
      ],
      expected: {
        A: [
          { from: 'A', to: 'B' },
          { from: 'A', to: 'C' },
          { from: 'A', to: 'D' },
        ],
      },
    },
    {
      data: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'D' },
      ],
      expected: {
        A: [{ from: 'A', to: 'B' }],
        B: [{ from: 'B', to: 'C' }],
        C: [{ from: 'C', to: 'D' }],
      },
    },
  ])('test extracting edges for every node', ({ data, expected }) => {
    // Execute
    expect(WorkflowGraph.createEdgesByFrom(data)).toEqual(expected);
  });
});
