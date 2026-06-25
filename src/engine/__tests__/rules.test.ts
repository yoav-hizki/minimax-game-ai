import { describe, it, expect } from 'vitest';
import { WINNING_COMBOS, checkWinner, checkEndTheGame } from '../rules';
import type { Board } from '../../types/game';

const emptyBoard: Board = ['', '', '', '', '', '', '', '', ''];

describe('WINNING_COMBOS', () => {
  it('contains exactly 8 winning combinations', () => {
    expect(WINNING_COMBOS).toHaveLength(8);
  });

  it('each combo has exactly 3 indices', () => {
    for (const combo of WINNING_COMBOS) {
      expect(combo).toHaveLength(3);
    }
  });

  it('all indices are between 0 and 8', () => {
    for (const combo of WINNING_COMBOS) {
      for (const index of combo) {
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThanOrEqual(8);
      }
    }
  });
});

describe('checkWinner', () => {
  it('returns null for an empty board', () => {
    expect(checkWinner(emptyBoard)).toBeNull();
  });

  it('returns null for a board with moves but no winner', () => {
    const board: Board = ['x', 'o', 'x', '', 'o', '', '', '', ''];
    expect(checkWinner(board)).toBeNull();
  });

  it.each([
    { combo: [0, 1, 2], label: 'top row' },
    { combo: [3, 4, 5], label: 'middle row' },
    { combo: [6, 7, 8], label: 'bottom row' },
    { combo: [0, 3, 6], label: 'left column' },
    { combo: [1, 4, 7], label: 'middle column' },
    { combo: [2, 5, 8], label: 'right column' },
    { combo: [0, 4, 8], label: 'main diagonal' },
    { combo: [2, 4, 6], label: 'anti diagonal' },
  ])('returns "x" when X wins via $label ($combo)', ({ combo }) => {
    const board: Board = [...emptyBoard];
    for (const idx of combo) {
      board[idx] = 'x';
    }
    expect(checkWinner(board)).toBe('x');
  });

  it.each([
    { combo: [0, 1, 2], label: 'top row' },
    { combo: [3, 4, 5], label: 'middle row' },
    { combo: [6, 7, 8], label: 'bottom row' },
    { combo: [0, 3, 6], label: 'left column' },
    { combo: [1, 4, 7], label: 'middle column' },
    { combo: [2, 5, 8], label: 'right column' },
    { combo: [0, 4, 8], label: 'main diagonal' },
    { combo: [2, 4, 6], label: 'anti diagonal' },
  ])('returns "o" when O wins via $label ($combo)', ({ combo }) => {
    const board: Board = [...emptyBoard];
    for (const idx of combo) {
      board[idx] = 'o';
    }
    expect(checkWinner(board)).toBe('o');
  });

  it('returns null for a full board with no winner (draw)', () => {
    // Classic draw board:
    // x | o | x
    // x | o | o
    // o | x | x
    const board: Board = ['x', 'o', 'x', 'x', 'o', 'o', 'o', 'x', 'x'];
    expect(checkWinner(board)).toBeNull();
  });

  it('returns the winner even when the board is not full', () => {
    // X wins top row, board not full
    const board: Board = ['x', 'x', 'x', 'o', 'o', '', '', '', ''];
    expect(checkWinner(board)).toBe('x');
  });
});

describe('checkEndTheGame', () => {
  it('returns false for an empty board', () => {
    expect(checkEndTheGame(emptyBoard)).toBe(false);
  });

  it('returns false for a partially filled board', () => {
    const board: Board = ['x', 'o', '', '', '', '', '', '', ''];
    expect(checkEndTheGame(board)).toBe(false);
  });

  it('returns true for a completely filled board', () => {
    const board: Board = ['x', 'o', 'x', 'o', 'x', 'o', 'o', 'x', 'o'];
    expect(checkEndTheGame(board)).toBe(true);
  });

  it('returns true for a draw board (full, no winner)', () => {
    const board: Board = ['x', 'o', 'x', 'x', 'o', 'o', 'o', 'x', 'x'];
    expect(checkEndTheGame(board)).toBe(true);
    expect(checkWinner(board)).toBeNull();
  });
});
