import { MaintenanceTask } from '@/types/maintenance';

export const maintenanceTasks: MaintenanceTask[] = [
  // Daily Tasks
  {
    id: 'daily-1',
    title: 'Platform Check',
    description: 'Check platform is free of objects/debris',
    category: 'daily',
    completed: false,
  },
  {
    id: 'daily-2',
    title: 'Waste Ink Bottle Level',
    description: 'Check waste ink bottle level',
    category: 'daily',
    completed: false,
  },
  {
    id: 'daily-3',
    title: 'Ink Supply Check',
    description: 'Check ink supply in tanks',
    category: 'daily',
    completed: false,
  },
  {
    id: 'daily-4',
    title: 'Capping Station & Wipers',
    description: 'Check capping station and wipers',
    category: 'daily',
    completed: false,
  },
  {
    id: 'daily-5',
    title: 'Printhead Condition',
    description: 'Check printhead condition (start and end of day)',
    category: 'daily',
    completed: false,
  },
  {
    id: 'daily-6',
    title: 'Environment Check',
    description: 'Check for dust, proper temperature/humidity',
    category: 'daily',
    completed: false,
  },
  // Weekly Tasks
  {
    id: 'weekly-1',
    title: 'Deep Printhead Cleaning',
    description: 'Perform deep printhead cleaning',
    category: 'weekly',
    completed: false,
  },
  {
    id: 'weekly-2',
    title: 'Slider Rail & Gears',
    description: 'Maintenance of slider rail and gears',
    category: 'weekly',
    completed: false,
  },
  // Monthly Tasks
  {
    id: 'monthly-1',
    title: 'Ink Path Check',
    description: 'Check ink path (tubes and dampers)',
    category: 'monthly',
    completed: false,
  },
  {
    id: 'monthly-2',
    title: 'Encoder Strip Cleaning',
    description: 'Clean encoder strip',
    category: 'monthly',
    completed: false,
  },
  // Quarterly Tasks
  {
    id: 'quarterly-1',
    title: 'Clean Ink Cartridges/Tanks',
    description: 'Clean ink cartridges and tanks',
    category: 'quarterly',
    completed: false,
  },
  {
    id: 'quarterly-2',
    title: 'Circuit Inspection',
    description: 'Inspect electrical circuits',
    category: 'quarterly',
    completed: false,
  },
  // Yearly Tasks
  {
    id: 'yearly-1',
    title: 'Electric Control Box',
    description: 'Inspect and clean electric control box',
    category: 'yearly',
    completed: false,
  },
  {
    id: 'yearly-2',
    title: 'Computer Cleaning',
    description: 'Clean computer system',
    category: 'yearly',
    completed: false,
  },
  // Non-printing Tasks
  {
    id: 'non-printing-1',
    title: 'Head Test & Auto Clean',
    description: 'Perform head test and auto clean every week during non-printing periods',
    category: 'non-printing',
    completed: false,
  },
  {
    id: 'non-printing-2',
    title: 'Head Clean & Nozzle Check',
    description: 'Head clean and nozzle check every 3-5 days during idle periods',
    category: 'non-printing',
    completed: false,
  },
  {
    id: 'non-printing-3',
    title: 'Cleaning Fluid in Capping Core',
    description: 'Pour cleaning fluid into capping core monthly if idle',
    category: 'non-printing',
    completed: false,
  },
];