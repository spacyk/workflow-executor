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
    const mockFunction = jest.fn();
    const workflow: Workflow = {
      nodes: [
        {
          id: 'A',
          execute: () => {
            mockFunction('A');
            return { $next: 'false' };
          },
        },
        { id: 'B', execute: () => mockFunction('B') },
        { id: 'C', execute: () => mockFunction('C') },
        { id: 'D', execute: () => mockFunction('D') },
        { id: 'E', execute: () => mockFunction('E') },
      ],
      edges: [
        { name: 'true', from: 'A', to: 'B' },
        { name: 'false', from: 'A', to: 'C' },
        { from: 'B', to: 'D' },
        { from: 'D', to: 'E' },
        { from: 'C', to: 'E' },
      ],
    };

    const workflowExecutor = new WorkflowExecutor(workflow);
    workflowExecutor.execute();
    expect(mockFunction.mock.calls).toEqual([['A'], ['C'], ['E']]);
  });

  it('test execute with multiple valid edges for one node, [A, B, C, D]', () => {
    const mockFunction = jest.fn();
    const workflow: Workflow = {
      nodes: [
        { id: 'A', execute: () => mockFunction('A') },
        { id: 'B', execute: () => mockFunction('B') },
        { id: 'C', execute: () => mockFunction('C') },
        { id: 'D', execute: () => mockFunction('D') },
      ],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
        { from: 'B', to: 'D' },
        { from: 'C', to: 'D' },
      ],
    };

    const workflowExecutor = new WorkflowExecutor(workflow);
    workflowExecutor.execute();
    expect(mockFunction.mock.calls).toEqual([['A'], ['B'], ['C'], ['D']]);
  });

  it('workflow with cycle. Cycle nodes not executed by default [A, B, C, D]', () => {
    const mockFunction = jest.fn();
    const workflow: Workflow = {
      nodes: [
        { id: 'A', execute: () => mockFunction('A') },
        { id: 'B', execute: () => mockFunction('B') },
        { id: 'C', execute: () => mockFunction('C') },
        { id: 'D', execute: () => mockFunction('D') },
      ],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'D' },
        { from: 'D', to: 'C' },
      ],
    };

    const workflowExecutor = new WorkflowExecutor(workflow);
    workflowExecutor.execute();
    expect(mockFunction.mock.calls).toEqual([['A'], ['B'], ['C'], ['D']]);
  });

  it('workflow with cycle. Allow 1 cycle [A, B, C, D, C, D]', () => {
    const mockFunction = jest.fn();
    const workflow: Workflow = {
      nodes: [
        { id: 'A', execute: () => mockFunction('A') },
        { id: 'B', execute: () => mockFunction('B') },
        { id: 'C', execute: () => mockFunction('C') },
        { id: 'D', execute: () => mockFunction('D') },
      ],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'D' },
        { from: 'D', to: 'C' },
      ],
    };

    const workflowExecutor = new WorkflowExecutor(workflow, 1);
    workflowExecutor.execute();
    expect(mockFunction.mock.calls).toEqual([
      ['A'],
      ['B'],
      ['C'],
      ['D'],
      ['C'],
      ['D'],
    ]);
  });

  it('workflow with cycle. Allow 2 cycles [A, B, C, D, C, D, C, D]', () => {
    const mockFunction = jest.fn();
    const workflow: Workflow = {
      nodes: [
        { id: 'A', execute: () => mockFunction('A') },
        { id: 'B', execute: () => mockFunction('B') },
        { id: 'C', execute: () => mockFunction('C') },
        { id: 'D', execute: () => mockFunction('D') },
      ],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'D' },
        { from: 'D', to: 'C' },
      ],
    };

    const workflowExecutor = new WorkflowExecutor(workflow, 2);
    workflowExecutor.execute();
    expect(mockFunction.mock.calls).toEqual([
      ['A'],
      ['B'],
      ['C'],
      ['D'],
      ['C'],
      ['D'],
      ['C'],
      ['D'],
    ]);
  });
});
