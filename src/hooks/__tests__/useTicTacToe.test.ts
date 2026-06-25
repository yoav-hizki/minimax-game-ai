import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTicTacToe } from '../useTicTacToe';

// Mock the AI module so AI moves don't fire during tests
vi.mock('../../engine/ai', () => ({
  findBestMove: vi.fn().mockReturnValue(-1),
}));

describe('useTicTacToe', () => {
  describe('Initialization', () => {
    it('squares is an array of 9 empty strings', () => {
      const { result } = renderHook(() => useTicTacToe());
      expect(result.current.squares).toEqual(Array(9).fill(''));
      expect(result.current.squares).toHaveLength(9);
    });

    it('turn starts as x', () => {
      const { result } = renderHook(() => useTicTacToe());
      expect(result.current.turn).toBe('x');
    });

    it('winner starts as null', () => {
      const { result } = renderHook(() => useTicTacToe());
      expect(result.current.winner).toBeNull();
    });

    it('isAiMode starts as false', () => {
      const { result } = renderHook(() => useTicTacToe());
      expect(result.current.isAiMode).toBe(false);
    });

    it('difficulty starts as easy', () => {
      const { result } = renderHook(() => useTicTacToe());
      expect(result.current.difficulty).toBe('easy');
    });
  });

  describe('updateSquares', () => {
    it('placing a mark updates the squares array at the given index', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => {
        result.current.updateSquares(0);
      });

      expect(result.current.squares[0]).toBe('x');
    });

    it('turn switches from x to o after placing', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => {
        result.current.updateSquares(0);
      });

      expect(result.current.turn).toBe('o');
    });

    it('cannot place on an already-occupied square', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => {
        result.current.updateSquares(0);
      });

      // Square 0 is now 'x', try to place again
      act(() => {
        result.current.updateSquares(0);
      });

      expect(result.current.squares[0]).toBe('x');
      // Turn should still be 'o' (no change from the failed placement)
      expect(result.current.turn).toBe('o');
    });

    it('cannot place when there is a winner', () => {
      const { result } = renderHook(() => useTicTacToe());

      // X wins with top row: 0, 1, 2
      act(() => {
        result.current.updateSquares(0); // x at 0
      });
      act(() => {
        result.current.updateSquares(3); // o at 3
      });
      act(() => {
        result.current.updateSquares(1); // x at 1
      });
      act(() => {
        result.current.updateSquares(4); // o at 4
      });
      act(() => {
        result.current.updateSquares(2); // x at 2 -> X wins
      });

      expect(result.current.winner).toBe('x');

      // Try to place on an empty square after winner is decided
      act(() => {
        result.current.updateSquares(5);
      });

      expect(result.current.squares[5]).toBe('');
    });
  });

  describe('Turn switching', () => {
    it('after X plays, turn becomes o', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => {
        result.current.updateSquares(0); // x plays
      });

      expect(result.current.turn).toBe('o');
    });

    it('after O plays, turn becomes x', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => {
        result.current.updateSquares(0); // x plays
      });
      act(() => {
        result.current.updateSquares(1); // o plays
      });

      expect(result.current.turn).toBe('x');
    });
  });

  describe('Winner detection', () => {
    it('playing a winning sequence for X sets winner to x', () => {
      const { result } = renderHook(() => useTicTacToe());

      // X: 0, 1, 2 (top row)  O: 3, 4
      act(() => {
        result.current.updateSquares(0); // x
      });
      act(() => {
        result.current.updateSquares(3); // o
      });
      act(() => {
        result.current.updateSquares(1); // x
      });
      act(() => {
        result.current.updateSquares(4); // o
      });
      act(() => {
        result.current.updateSquares(2); // x wins
      });

      expect(result.current.winner).toBe('x');
    });

    it('playing a winning sequence for O sets winner to o', () => {
      const { result } = renderHook(() => useTicTacToe());

      // X: 0, 1, 6   O: 3, 4, 5 (middle row)
      act(() => {
        result.current.updateSquares(0); // x
      });
      act(() => {
        result.current.updateSquares(3); // o
      });
      act(() => {
        result.current.updateSquares(1); // x
      });
      act(() => {
        result.current.updateSquares(4); // o
      });
      act(() => {
        result.current.updateSquares(6); // x (not a winning move)
      });
      act(() => {
        result.current.updateSquares(5); // o wins (3,4,5)
      });

      expect(result.current.winner).toBe('o');
    });
  });

  describe('Draw detection', () => {
    it('filling all squares without a winner sets winner to x | o', () => {
      const { result } = renderHook(() => useTicTacToe());

      // Play a draw game:
      // X O X
      // X X O
      // O X O
      // Moves: x=0, o=1, x=2, o=5, x=3, o=6, x=4, o=8, x=7
      act(() => {
        result.current.updateSquares(0); // x
      });
      act(() => {
        result.current.updateSquares(1); // o
      });
      act(() => {
        result.current.updateSquares(2); // x
      });
      act(() => {
        result.current.updateSquares(5); // o
      });
      act(() => {
        result.current.updateSquares(3); // x
      });
      act(() => {
        result.current.updateSquares(6); // o
      });
      act(() => {
        result.current.updateSquares(4); // x
      });
      act(() => {
        result.current.updateSquares(8); // o
      });
      act(() => {
        result.current.updateSquares(7); // x - fills the board, draw
      });

      expect(result.current.winner).toBe('x | o');
    });
  });

  describe('resetGame', () => {
    it('resets squares to 9 empty strings', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => {
        result.current.updateSquares(0);
      });
      act(() => {
        result.current.updateSquares(1);
      });

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.squares).toEqual(Array(9).fill(''));
    });

    it('resets turn to x', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => {
        result.current.updateSquares(0); // turn becomes 'o'
      });

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.turn).toBe('x');
    });

    it('resets winner to null', () => {
      const { result } = renderHook(() => useTicTacToe());

      // Create a winner
      act(() => {
        result.current.updateSquares(0); // x
      });
      act(() => {
        result.current.updateSquares(3); // o
      });
      act(() => {
        result.current.updateSquares(1); // x
      });
      act(() => {
        result.current.updateSquares(4); // o
      });
      act(() => {
        result.current.updateSquares(2); // x wins
      });

      expect(result.current.winner).toBe('x');

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.winner).toBeNull();
    });
  });

  describe('toggleAiMode', () => {
    it('toggles isAiMode from false to true', () => {
      const { result } = renderHook(() => useTicTacToe());

      expect(result.current.isAiMode).toBe(false);

      act(() => {
        result.current.toggleAiMode();
      });

      expect(result.current.isAiMode).toBe(true);
    });

    it('toggles back from true to false', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => {
        result.current.toggleAiMode();
      });

      expect(result.current.isAiMode).toBe(true);

      act(() => {
        result.current.toggleAiMode();
      });

      expect(result.current.isAiMode).toBe(false);
    });

    it('resets the game when toggling', () => {
      const { result } = renderHook(() => useTicTacToe());

      // Make some moves first
      act(() => {
        result.current.updateSquares(0);
      });
      act(() => {
        result.current.updateSquares(1);
      });

      expect(result.current.squares[0]).toBe('x');
      expect(result.current.squares[1]).toBe('o');

      act(() => {
        result.current.toggleAiMode();
      });

      // Board should be reset
      expect(result.current.squares).toEqual(Array(9).fill(''));
      expect(result.current.turn).toBe('x');
      expect(result.current.winner).toBeNull();
    });
  });

  describe('changeDifficulty', () => {
    // Need AI mode enabled so difficulty is relevant, but we test the cycling regardless
    it('cycles from easy to medium', () => {
      const { result } = renderHook(() => useTicTacToe());

      expect(result.current.difficulty).toBe('easy');

      act(() => {
        result.current.changeDifficulty();
      });

      expect(result.current.difficulty).toBe('medium');
    });

    it('cycles from medium to hard', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => {
        result.current.changeDifficulty(); // easy -> medium
      });
      act(() => {
        result.current.changeDifficulty(); // medium -> hard
      });

      expect(result.current.difficulty).toBe('hard');
    });

    it('cycles from hard back to easy', () => {
      const { result } = renderHook(() => useTicTacToe());

      act(() => {
        result.current.changeDifficulty(); // easy -> medium
      });
      act(() => {
        result.current.changeDifficulty(); // medium -> hard
      });
      act(() => {
        result.current.changeDifficulty(); // hard -> easy
      });

      expect(result.current.difficulty).toBe('easy');
    });

    it('resets the game when changing difficulty', () => {
      const { result } = renderHook(() => useTicTacToe());

      // Make some moves first
      act(() => {
        result.current.updateSquares(0);
      });
      act(() => {
        result.current.updateSquares(1);
      });

      expect(result.current.squares[0]).toBe('x');
      expect(result.current.squares[1]).toBe('o');

      act(() => {
        result.current.changeDifficulty();
      });

      // Board should be reset
      expect(result.current.squares).toEqual(Array(9).fill(''));
      expect(result.current.turn).toBe('x');
      expect(result.current.winner).toBeNull();
    });
  });
});
