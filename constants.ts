import { RoomConfig } from './types';

export const INITIAL_TIME = 600; // 10 minutes in seconds

export const ROOMS: RoomConfig[] = [
  {
    id: 'room1',
    view: 'room1',
    name: 'ASYNC HANDLER',
    description: 'Debug the reactor startup sequence. The system status is returning undefined.',
    icon: 'schedule',
    difficulty: 'Low',
    locked: false,
    hint: "The function 'systemCheck' returns a Promise. You can't use its value directly without waiting for it to resolve."
  },
  {
    id: 'room2',
    view: 'room2',
    name: 'CIRCUIT LOGIC',
    description: 'Configure the safety interlock gates. The scram signal is not triggering correctly.',
    icon: 'schema',
    difficulty: 'Medium',
    locked: true, // Unlocks after room1
    hint: "We need the alarm to trigger if ANY danger signal is true. The current gate requires ALL of them to be true."
  },
  {
    id: 'room3',
    view: 'room3',
    name: 'BITWISE OPERATIONS',
    description: 'Calculate the correct permission flags for the override command.',
    icon: 'memory',
    difficulty: 'High',
    locked: true, // Unlocks after room2
    hint: "XOR (^) toggles bits. If you start with 0110 (6) and XOR with 0010 (2), the second bit flips to 0."
  },
  {
    id: 'room4',
    view: 'room4',
    name: 'ALGORITHM OPTIMIZER',
    description: 'The sensor log analysis is causing a heap overflow. Optimize the complexity.',
    icon: 'speed',
    difficulty: 'Medium',
    locked: true, // Unlocks after room3
    hint: "Nested loops cause O(N²) complexity. Using a Set or Hash Map allows for O(N) lookup time."
  },
  {
    id: 'room5',
    view: 'room5',
    name: 'VISUAL OVERRIDE',
    description: 'The emergency shutoff button is unclickable. Debug the stacking context.',
    icon: 'layers',
    difficulty: 'Low',
    locked: true, // Unlocks after room4
    hint: "The invisible overlay has a higher z-index than the button. You need to allow pointer events to pass through it."
  },
  {
    id: 'room6',
    view: 'room6',
    name: 'DEADLOCK RESOLUTION',
    description: 'Two processes are gridlocked holding resources. Force a release sequence.',
    icon: 'lock_open',
    difficulty: 'Critical',
    locked: true, // Unlocks after room5
    hint: "Process B is waiting for Resource 1. Terminate Process A to release Resource 1 first."
  },
];