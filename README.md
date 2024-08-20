# workflow-executor ⚡

### Implements Node.js function to execute a workflow defined by a graph

Accepts a workflow and executes its methods based on its structure. The workflow is represented as a **Directed Graph** (can contain cycles), where each node represents a task and edges represent the possible execution paths between nodes.

The workflow can contain **conditional nodes** that make decisions based on the result of their execution. Specifically, a node can return a value indicating which **edge (path) to follow next**.

Additionally, the workflow **can contain cycles**, and you can decide on how many iterations to allow.

**Example workflows:**

**Workflow 1 - conditional nodes**
```typescript
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
![Screenshot 2024-08-19 at 12 38 03](https://github.com/user-attachments/assets/fc5f3c59-9bb8-48a9-8a11-969cf5ebe434)

**Output:**
```
A
C
E
```
**Workflow 2 - conditional nodes and cycle**
```typescript
workflow = {
  nodes: [
    {id: 'A', execute: () => {console.log('A'); return { $next: 'true' }; }},
    { id: 'B', execute: () => console.log('B') },
    {id: 'C', execute: () => { console.log('C'); return { $next: 'true' }; }},
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
```

![Screenshot 2024-08-20 at 14 49 38](https://github.com/user-attachments/assets/628495b9-5c26-40f0-8490-54374003aef4)


**Output with one cycle iteration allowed:**
```
A
C
D
F
G
D
F
G
```

**Usage:**
```typescript
import { WorkflowExecutor } from './workflowExecutor';

const numberOfCyclesAllowed: number = 1
const workflowExecutor = new WorkflowExecutor(workflow, numberOfCyclesAllowed);
workflowExecutor.execute();

```



