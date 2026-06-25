import { describe, it, expect, vi, beforeEach } from 'vitest';
import { minimax, findBestMove } from '../ai';
import type { Board } from '../../types/game';

describe('minimax', () => {
  it('returns positive score (10 - depth) when O wins', () => {
    // O wins on top row, depth = 0
    const board: Board = ['o', 'o', 'o', 'x', 'x', '', '', '', ''];
    expect(minimax(board, 0, true)).toBe(10);
  });

  it('returns negative score (depth - 10) when X wins', () => {
    // X wins on top row, depth = 0
    const board: Board = ['x', 'x', 'x', 'o', 'o', '', '', '', ''];
    expect(minimax(board, 0, false)).toBe(-10);
  });

  it('returns 0 for a draw', () => {
    // Full draw board
    const board: Board = ['x', 'o', 'x', 'x', 'o', 'o', 'o', 'x', 'x'];
    expect(minimax(board, 0, true)).toBe(0);
  });

  it('returns correct score for a board one move from O winning', () => {
    // O has top-left and top-center, top-right is empty
    // O will win by playing position 2
    const board: Board = ['o', 'o', '', 'x', 'x', '', '', '', ''];
    // Maximizing (O's turn) should find a winning move
    const score = minimax(board, 0, true);
    expect(score).toBeGreaterThan(0);
  });

  it('returns correct score for a board one move from X winning', () => {
    // X has top-left and top-center, top-right is empty
    // X will win by playing position 2
    const board: Board = ['x', 'x', '', 'o', 'o', '', '', '', ''];
    // Minimizing (X's turn) should find a winning move
    const score = minimax(board, 0, false);
    expect(score).toBeLessThan(0);
  });

  it('accounts for depth in scoring', () => {
    // O wins at depth 0 => score 10
    const board: Board = ['o', 'o', 'o', 'x', 'x', '', '', '', ''];
    const scoreAtDepth0 = minimax(board, 0, true);
    const scoreAtDepth2 = minimax(board, 2, true);
    expect(scoreAtDepth0).toBe(10);
    expect(scoreAtDepth2).toBe(8);
  });
});

describe('findBestMove', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('easy mode: returns a valid empty cell index', () => {
    const board: Board = ['x', '', '', 'o', '', '', '', '', ''];
    const move = findBestMove([...board], 'easy');
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
    expect(board[move]).toBe('');
  });

  it('medium mode: returns a valid empty cell index', () => {
    const board: Board = ['x', '', '', 'o', '', '', '', '', ''];
    const move = findBestMove([...board], 'medium');
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
    expect(board[move]).toBe('');
  });

  it('hard mode: returns a valid empty cell index', () => {
    const board: Board = ['x', '', '', 'o', '', '', '', '', ''];
    const move = findBestMove([...board], 'hard');
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
    expect(board[move]).toBe('');
  });

  it('hard mode: takes winning move when available', () => {
    // O has positions 0,1 — winning move is position 2
    const board: Board = ['o', 'o', '', 'x', 'x', '', '', '', ''];
    const move = findBestMove([...board], 'hard');
    expect(move).toBe(2);
  });

  it('hard mode: blocks opponent winning move', () => {
    // X has positions 0,1 — X would win at position 2, so O must block
    // O is at positions 3,6 (column, not about to win)
    const board: Board = ['x', 'x', '', 'o', '', '', 'o', '', ''];
    const move = findBestMove([...board], 'hard');
    expect(move).toBe(2);
  });

  it('hard mode: returns the only empty cell when one remains', () => {
    // Only position 5 is empty
    const board: Board = ['x', 'o', 'x', 'x', 'o', '', 'o', 'x', 'o'];
    const move = findBestMove([...board], 'hard');
    expect(move).toBe(5);
  });

  it('easy mode: consistently returns valid empty cells across multiple calls', () => {
    const board: Board = ['x', 'o', '', '', '', '', '', '', ''];
    for (let i = 0; i < 10; i++) {
      const move = findBestMove([...board], 'easy');
      expect(board[move]).toBe('');
    }
  });
});
