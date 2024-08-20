import { Workflow } from './workflow.interface';
import { WorkflowExecutor } from './workflowExecutor';

const workflow: Workflow = {
  nodes: [
    {
      id: 'A',
      execute: () => {
        console.log('A');
        return { $next: 'true' };
      },
    },
    { id: 'B', execute: () => console.log('B') },
    {
      id: 'C',
      execute: () => {
        console.log('C');
        return { $next: 'true' };
      },
    },
    { id: 'D', execute: () => console.log('D') },
    { id: 'E', execute: () => console.log('E') },
    { id: 'F', execute: () => console.log('F') },
    { id: 'G', execute: () => console.log('G') },
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
//
const workflowExecutor = new WorkflowExecutor(workflow, 1);
workflowExecutor.execute();
