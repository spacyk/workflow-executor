import { Workflow } from './workflow.interface';
import { WorkflowExecutor } from './workflow';

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

const workflowExecutor = new WorkflowExecutor(workflow);
workflowExecutor.execute();
