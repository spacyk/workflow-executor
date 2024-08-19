// workflow.test.ts

import { WorkflowExecutor } from '../src/workflow';
import type { Workflow } from '../src/workflow.interface';

describe('WorkflowExecutor.createEdgesByFrom', () => {
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

describe('WorkflowExecutor.nodeById', () => {
  it('test getting node by ID', () => {
    const workflow: Workflow = {
      nodes: [
        { id: 'A', execute: () => {} },
        { id: 'B', execute: () => {} },
        { id: 'C', execute: () => {} },
      ],
      edges: [],
    };

    const workflowExecutor = new WorkflowExecutor(workflow);
    expect(JSON.stringify(workflowExecutor.nodeById('A'))).toBe(
      JSON.stringify({ id: 'A', execute: () => {} }),
    );
  });
});

describe('WorkflowExecutor.execute', () => {
  it('test execute with $next path specified, [A, C, E]', () => {
    const workflow: Workflow = {
      nodes: [
        {
          id: 'A',
          execute: () => {
            console.log('A');
            return { $next: 'false' };
          },
        },
        { id: 'B', execute: () => console.log('B') },
        { id: 'C', execute: () => console.log('C') },
        { id: 'D', execute: () => console.log('D') },
        { id: 'E', execute: () => console.log('E') },
      ],
      edges: [
        { name: 'true', from: 'A', to: 'B' },
        { name: 'false', from: 'A', to: 'C' },
        { from: 'B', to: 'D' },
        { from: 'D', to: 'E' },
        { from: 'C', to: 'E' },
      ],
    };
    const consoleLogMock = jest.spyOn(console, 'log');

    const workflowExecutor = new WorkflowExecutor(workflow);
    workflowExecutor.execute();
    expect(consoleLogMock.mock.calls).toEqual([['A'], ['C'], ['E']]);

    consoleLogMock.mockRestore();
  });

  it('test execute with multiple valid edges for one node, [A, B, C, D]', () => {
    const workflow: Workflow = {
      nodes: [
        { id: 'A', execute: () => console.log('A') },
        { id: 'B', execute: () => console.log('B') },
        { id: 'C', execute: () => console.log('C') },
        { id: 'D', execute: () => console.log('D') },
      ],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
        { from: 'B', to: 'D' },
        { from: 'C', to: 'D' },
      ],
    };
    const consoleLogMock = jest.spyOn(console, 'log');

    const workflowExecutor = new WorkflowExecutor(workflow);
    workflowExecutor.execute();
    expect(consoleLogMock.mock.calls).toEqual([['A'], ['B'], ['C'], ['D']]);

    consoleLogMock.mockRestore();
  });
});
