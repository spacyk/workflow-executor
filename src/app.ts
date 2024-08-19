import { defineWorkflow } from './workflow.interface';
import { WorkflowExecutor } from './workflow';

const workflow = defineWorkflow({
  nodes: [
    {
      id: 'A',
      execute: () => {
        console.log('A');
        return { $next: 'true' };
      },
    },
    { id: 'B', execute: () => console.log('B') },
    { id: 'C', execute: () => console.log('C') },
    { id: 'D', execute: () => console.log('D') },
    { id: 'E', execute: () => console.log('E') },
  ],
  edges: [
    { id: 'true', from: 'A', to: 'B' },
    { id: 'false', from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'D', to: 'E' },
    { from: 'C', to: 'E' },
  ],
});

const workflowExecutor = new WorkflowExecutor(workflow);
workflowExecutor.execute();
