import type { CoachingClass } from '../types'

/** Seeded classes, grouped by shared objective + band. */
export const seedClasses: CoachingClass[] = [
  {
    id: 'cls-jr-competitive-b',
    name: 'Junior Competitive · Band B',
    objective: 'competitive',
    band: 'B',
    coachName: 'Coach Priya',
    schedule: 'Tue & Sat · 4:00–5:30pm',
    capacity: 8,
    memberIds: ['p-vikram', 'p-ethan'],
  },
  {
    id: 'cls-kids-fitness-b',
    name: 'Kids Fitness · Band B',
    objective: 'fitness',
    band: 'B',
    coachName: 'Coach Mara',
    schedule: 'Mon & Thu · 4:00–5:00pm',
    capacity: 10,
    memberIds: ['p-zoe', 'p-kai'],
  },
  {
    id: 'cls-just-for-fun-b',
    name: 'Just-for-Fun · Band B',
    objective: 'fun',
    band: 'B',
    coachName: 'Coach Dan',
    schedule: 'Sat · 10:00–11:00am',
    capacity: 12,
    memberIds: ['p-noah', 'p-sara'],
  },
  {
    id: 'cls-minis-a',
    name: 'Minis · Band A',
    objective: 'fun',
    band: 'A',
    coachName: 'Coach Dan',
    schedule: 'Sat · 9:00–9:45am',
    capacity: 10,
    memberIds: ['p-mia'],
  },
]
