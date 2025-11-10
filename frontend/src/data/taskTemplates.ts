import type { TaskTemplate } from '../types'

export const taskTemplates: TaskTemplate[] = [
  {
    id: 'template-electrical-repair',
    name: 'Electrical Repair Workflow',
    description: 'Standard workflow for electrical repair jobs',
    category: 'Electrical',
    tasks: [
      {
        title: 'Initial assessment and diagnosis',
        description: 'Inspect the electrical issue and identify the root cause',
        priority: 'High',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 1,
        tags: ['assessment', 'diagnosis']
      },
      {
        title: 'Prepare materials and tools',
        description: 'Gather all necessary tools and materials for the repair',
        priority: 'High',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 0.5,
        tags: ['preparation']
      },
      {
        title: 'Perform repair work',
        description: 'Complete the electrical repair according to safety standards',
        priority: 'Urgent',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 3,
        tags: ['repair', 'work']
      },
      {
        title: 'Test and verify',
        description: 'Test the repaired system to ensure it works correctly',
        priority: 'High',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 0.5,
        tags: ['testing', 'verification']
      },
      {
        title: 'Clean up and documentation',
        description: 'Clean work area and document the work completed',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 0.5,
        tags: ['cleanup', 'documentation']
      }
    ]
  },
  {
    id: 'template-plumbing-repair',
    name: 'Plumbing Repair Workflow',
    description: 'Standard workflow for plumbing repair jobs',
    category: 'Plumbing',
    tasks: [
      {
        title: 'Inspect plumbing issue',
        description: 'Identify the source of the plumbing problem',
        priority: 'High',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 1,
        tags: ['inspection', 'diagnosis']
      },
      {
        title: 'Gather plumbing supplies',
        description: 'Collect necessary pipes, fittings, and tools',
        priority: 'High',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 0.5,
        tags: ['preparation']
      },
      {
        title: 'Perform plumbing repair',
        description: 'Fix the plumbing issue using proper techniques',
        priority: 'Urgent',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 2.5,
        tags: ['repair', 'work']
      },
      {
        title: 'Test water flow',
        description: 'Verify that water flows correctly and there are no leaks',
        priority: 'High',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 0.5,
        tags: ['testing']
      }
    ]
  },
  {
    id: 'template-cleaning-service',
    name: 'Cleaning Service Workflow',
    description: 'Standard workflow for cleaning service jobs',
    category: 'Cleaning',
    tasks: [
      {
        title: 'Prepare cleaning supplies',
        description: 'Gather all cleaning materials and equipment',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 0.5,
        tags: ['preparation']
      },
      {
        title: 'Initial assessment',
        description: 'Assess the cleaning requirements and areas to focus on',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 0.5,
        tags: ['assessment']
      },
      {
        title: 'Perform cleaning service',
        description: 'Complete the cleaning according to service standards',
        priority: 'High',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 4,
        tags: ['cleaning', 'work']
      },
      {
        title: 'Final inspection',
        description: 'Verify all areas are cleaned to satisfaction',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 0.5,
        tags: ['inspection']
      }
    ]
  },
  {
    id: 'template-appliance-repair',
    name: 'Appliance Repair Workflow',
    description: 'Standard workflow for appliance repair jobs',
    category: 'Appliance',
    tasks: [
      {
        title: 'Diagnose appliance issue',
        description: 'Identify the problem with the appliance',
        priority: 'High',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 1.5,
        tags: ['diagnosis']
      },
      {
        title: 'Order replacement parts',
        description: 'Order necessary parts if needed',
        priority: 'High',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 0.5,
        tags: ['ordering']
      },
      {
        title: 'Perform repair',
        description: 'Repair or replace faulty components',
        priority: 'Urgent',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 2,
        tags: ['repair']
      },
      {
        title: 'Test appliance',
        description: 'Test the appliance to ensure it works properly',
        priority: 'High',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 0.5,
        tags: ['testing']
      }
    ]
  }
]

