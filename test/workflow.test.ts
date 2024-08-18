// workflow.test.ts

import { WorkflowExecutor } from '../src/workflow';
import type { Node, NodesById } from '../src/workflow.interface';

describe('WorkflowExecutor.createNodesById', () => {
  it('test organizing nodes by ID', () => {
    const data: Node[] = [
      { id: 'A', execute: () => {} },
      { id: 'B', execute: () => {} },
      { id: 'C', execute: () => {} },
    ];
    const expected: NodesById = {
      A: { id: 'A', execute: () => {} },
      B: { id: 'B', execute: () => {} },
      C: { id: 'C', execute: () => {} },
    };
    // Execute
    expect(JSON.stringify(WorkflowExecutor.createNodesById(data))).toBe(
      JSON.stringify(expected),
    );
  });
});

describe('WorkflowExecutor.createNodesById', () => {
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
    expect(WorkflowExecutor.createEdgesByFrom(data)).toEqual(expected);
  });
});
