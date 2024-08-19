// workflowExecutor.test.ts

import { WorkflowExecutor } from '../src/workflowExecutor';
import type { Workflow } from '../src/workflow.interface';

describe('WorkflowExecutor.nodeById', () => {
  it('test getting node by ID', () => {
    const workflow: Workflow = {
      nodes: [
        { id: 'A', execute: () => {} },
        { id: 'B', execute: () => {} },
        { id: 'C', execute: () => {} },
      ],
      edges: [
        { name: 'true', from: 'A', to: 'B' },
        { name: 'true', from: 'C', to: 'A' },
      ],
    };

    const workflowExecutor = new WorkflowExecutor(workflow);
    expect(JSON.stringify(workflowExecutor.nodeById('A'))).toBe(
      JSON.stringify({ id: 'A', execute: () => {} }),
    );
  });
});

describe('WorkflowExecutor.getStartingNode', () => {
  it('test get starting node', () => {
    const workflow: Workflow = {
      nodes: [
        { id: 'A', execute: () => {} },
        { id: 'B', execute: () => {} },
        { id: 'C', execute: () => {} },
      ],
      edges: [
        { name: 'true', from: 'A', to: 'B' },
        { name: 'true', from: 'C', to: 'A' },
      ],
    };

    const workflowExecutor = new WorkflowExecutor(workflow);
    expect(JSON.stringify(workflowExecutor.getStartingNode())).toBe(
      JSON.stringify({ id: 'C', execute: () => {} }),
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

  it("test execute, cycle won't be executed [A, B, C, D]", () => {
    const workflow: Workflow = {
      nodes: [
        { id: 'A', execute: () => console.log('A') },
        { id: 'B', execute: () => console.log('B') },
        { id: 'C', execute: () => console.log('C') },
        { id: 'D', execute: () => console.log('D') },
      ],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'D' },
        { from: 'D', to: 'C' },
      ],
    };
    const consoleLogMock = jest.spyOn(console, 'log');

    const workflowExecutor = new WorkflowExecutor(workflow);
    workflowExecutor.execute();
    expect(consoleLogMock.mock.calls).toEqual([['A'], ['B'], ['C'], ['D']]);

    consoleLogMock.mockRestore();
  });
});
