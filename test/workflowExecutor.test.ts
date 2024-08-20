// workflowExecutor.test.ts

import { WorkflowExecutor } from '../src/workflowExecutor';
import type { Workflow } from '../src/workflow.interface';
import Mock = jest.Mock;

describe('WorkflowExecutor.nodeById', () => {
  it('get node by ID', () => {
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
  it('get starting node for the workflow', () => {
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
  let mockFunction: Mock;
  beforeEach(() => {
    mockFunction = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('verify each node executes just once even with multiple valid edges.', () => {
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

  it.each([
    [0, ['A', 'B', 'C']],
    [1, ['A', 'B', 'C', 'B', 'C']],
    [2, ['A', 'B', 'C', 'B', 'C', 'B', 'C']],
  ])(
    'verify workflow execution with cycle. cyclesAllowed=%s',
    (cyclesAllowed, expected) => {
      const workflow: Workflow = {
        nodes: [
          { id: 'A', execute: () => mockFunction('A') },
          { id: 'B', execute: () => mockFunction('B') },
          { id: 'C', execute: () => mockFunction('C') },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
          { from: 'C', to: 'B' },
        ],
      };

      const workflowExecutor = new WorkflowExecutor(workflow, cyclesAllowed);
      workflowExecutor.execute();
      expect(mockFunction.mock.calls.map((value) => value[0])).toEqual(
        expected,
      );
    },
  );

  it.each([
    ['false', 'false', 0, ['A', 'B']],
    ['true', 'false', 0, ['A', 'C', 'E']],
    ['true', 'true', 0, ['A', 'C', 'D', 'F', 'G']],
    ['true', 'true', 1, ['A', 'C', 'D', 'F', 'G', 'D', 'F', 'G']],
  ])(
    'verify complex workflow execution with edge conditions ($next) and cycle. A=%s, C=%s, cyclesAllowed=%s',
    (returnValueA, returnValueC, cyclesAllowed, expected) => {
      const workflow: Workflow = {
        nodes: [
          {
            id: 'A',
            execute: () => {
              mockFunction('A');
              return { $next: returnValueA };
            },
          },
          { id: 'B', execute: () => mockFunction('B') },
          {
            id: 'C',
            execute: () => {
              mockFunction('C');
              return { $next: returnValueC };
            },
          },
          { id: 'D', execute: () => mockFunction('D') },
          { id: 'E', execute: () => mockFunction('E') },
          { id: 'F', execute: () => mockFunction('F') },
          { id: 'G', execute: () => mockFunction('G') },
        ],
        edges: [
          { from: 'A', to: 'B', name: 'false' },
          { from: 'A', to: 'C', name: 'true' },
          { from: 'C', to: 'D', name: 'true' },
          { from: 'C', to: 'E', name: 'false' },
          { from: 'D', to: 'F' },
          { from: 'F', to: 'G' },
          { from: 'G', to: 'D' },
        ],
      };

      const workflowExecutor = new WorkflowExecutor(workflow, cyclesAllowed);
      workflowExecutor.execute();
      expect(mockFunction.mock.calls.map((value) => value[0])).toEqual(
        expected,
      );
    },
  );
});
