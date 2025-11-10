import type { WorkflowTask } from '../types'

export const mockWorkflowTasks: WorkflowTask[] = [
  {
    id: 'task-1',
    bookingId: 'booking-1',
    title: 'Prepare materials for electrical repair',
    description: 'Gather all necessary tools and materials for kitchen wiring repair',
    status: 'Completed',
    priority: 'High',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Customer mentioned faulty wiring in kitchen',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'task-2',
    bookingId: 'booking-1',
    title: 'Complete electrical repair job',
    description: 'Fix faulty wiring in customer kitchen',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Scheduled for 10:00 AM',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'task-3',
    bookingId: 'booking-9',
    title: 'Diagnose washing machine issue',
    description: 'Inspect and identify the problem with customer washing machine',
    status: 'Not Started',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Customer reported machine not spinning',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'task-4',
    bookingId: 'booking-9',
    title: 'Order replacement parts',
    description: 'Order necessary parts for washing machine repair',
    status: 'Blocked',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Waiting for diagnosis to determine parts needed',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
]

