export type Player = 'x' | 'o';
export type CellValue = Player | '';
export type Board = CellValue[];
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Winner = Player | 'x | o' | null;

export interface GameState {
  squares: Board;
  turn: Player;
  winner: Winner;
  isAiMode: boolean;
  difficulty: Difficulty;
  updateSquares: (ind: number) => void;
  resetGame: () => void;
  toggleAiMode: () => void;
  changeDifficulty: () => void;
}
