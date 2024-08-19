# workflow-executor

### Implements Node.js function to execute a workflow defined by graph

Logic accepts a workflow and executes the methods in the workflow based on its structure. The workflow is represented as a Directed Acyclic Graph (DAG), where each node represents a task, and edges represent the possible paths of execution between nodes.

The workflow can contain conditional nodes that make decisions based on the result of their execution. Specifically, a node can return a value indicating which edge (path) to follow next.

Example workflow:
```
const workflow = {
  nodes: [
    { id: 'A', execute: () => { console.log('A'); return { $next: 'false' }; }},
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
    { from: 'C', to: 'E' }
  ]
};
```
Output:
```
A
C
E
```