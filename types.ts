export type ViewState = 
  | 'landing'
  | 'rules'
  | 'hub'
  | 'room1'
  | 'room2'
  | 'room3'
  | 'room4'
  | 'room5'
  | 'room6'
  | 'success'
  | 'failure';

export interface GameState {
  currentView: ViewState;
  solvedPuzzles: string[]; // IDs of solved rooms
  timeLeft: number;
  isGameActive: boolean;
}

export interface PuzzleProps {
  onSolve: () => void;
  onBack: () => void;
  isSolved: boolean;
  hint: string;
  onPenalty: (amount: number) => void;
}

export interface RoomConfig {
  id: string;
  view: ViewState;
  name: string;
  description: string;
  icon: string;
  difficulty: 'Low' | 'Medium' | 'High' | 'Critical';
  locked: boolean;
  hint: string;
}