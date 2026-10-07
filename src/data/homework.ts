import type { HomeworkTask } from '../types'

export const homeworkTasks: HomeworkTask[] = [
  {
    id: 'hw-1',
    title: 'Shadow footwork',
    detail: '10 minutes daily — focus on staying light on the feet, not the speed.',
    assignedDate: '2026-07-06',
    dueDate: '2026-07-13',
    metricKey: 'sixCornerFootwork',
    status: 'done',
  },
  {
    id: 'hw-2',
    title: 'Serve target practice',
    detail: '20 serves into a taped target zone, 3x this week.',
    assignedDate: '2026-07-06',
    dueDate: '2026-07-13',
    metricKey: 'serveAccuracy',
    status: 'done',
  },
  {
    id: 'hw-3',
    title: 'Wall rally control',
    detail: 'Keepy-uppy against a wall — aim for 15+ consecutive touches.',
    assignedDate: '2026-07-13',
    dueDate: '2026-07-20',
    metricKey: 'cornerAccuracy',
    status: 'pending',
  },
  {
    id: 'hw-4',
    title: 'Tournament clip review',
    detail: 'Watch the Jul 25 tournament clip together and call out one shot choice to discuss next session.',
    assignedDate: '2026-07-13',
    dueDate: '2026-07-20',
    status: 'pending',
  },
]
