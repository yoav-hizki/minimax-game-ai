import type { Board, Difficulty } from '../types/game';
import { checkWinner, checkEndTheGame } from './rules';

export const minimax = (board: Board, depth: number, isMaximizing: boolean): number => {
  const result = checkWinner(board);

  if (result === 'o') return 10 - depth;
  if (result === 'x') return depth - 10;
  if (checkEndTheGame(board)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'o';
        const score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'x';
        const score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

const getRandomEmptySquare = (board: Board): number => {
  const emptySquares = board.reduce<number[]>(
    (acc, sq, idx) => (sq === '' ? [...acc, idx] : acc),
    [],
  );
  return emptySquares[Math.floor(Math.random() * emptySquares.length)]!;
};

export const findBestMove = (board: Board, difficulty: Difficulty): number => {
  if (difficulty === 'easy') {
    return getRandomEmptySquare(board);
  }

  if (difficulty === 'medium') {
    if (Math.random() < 0.5) {
      return getRandomEmptySquare(board);
    }
  }

  let bestScore = -Infinity;
  let bestMove = -1;

  const prioritySquares = [4, 0, 2, 6, 8];

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'o';
      const winner = checkWinner(board);
      board[i] = '';
      if (winner === 'o') return i;
    }
  }

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'x';
      const winner = checkWinner(board);
      board[i] = '';
      if (winner === 'x') return i;
    }
  }

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'o';
      const score = minimax(board, 0, false);
      board[i] = '';

      const priorityBonus = prioritySquares.includes(i) ? 0.5 : 0;

      if (score + priorityBonus > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
};
