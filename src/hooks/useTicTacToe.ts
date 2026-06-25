import { useState, useEffect } from 'react';
import type { Board, Player, Winner, Difficulty, GameState } from '../types/game';
import { checkWinner, checkEndTheGame } from '../engine/rules';
import { findBestMove } from '../engine/ai';

export const useTicTacToe = (): GameState => {
  const [squares, setSquares] = useState<Board>(Array(9).fill(''));
  const [turn, setTurn] = useState<Player>('x');
  const [winner, setWinner] = useState<Winner>(null);
  const [isAiMode, setIsAiMode] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const updateSquares = (ind: number): void => {
    if (squares[ind] || winner || (isAiMode && turn === 'o')) {
      return;
    }
    const s = [...squares];
    s[ind] = turn;
    setSquares(s);
    setTurn(turn === 'x' ? 'o' : 'x');
    const W = checkWinner(s);
    if (W) {
      setWinner(W);
    } else if (checkEndTheGame(s)) {
      setWinner('x | o');
    }
  };

  // AI move logic
  useEffect(() => {
    if (isAiMode && turn === 'o' && !winner) {
      const bestMove = findBestMove([...squares], difficulty);
      if (bestMove !== -1) {
        const s = [...squares];
        s[bestMove] = 'o';
        setSquares(s);
        setTurn('x');
        const W = checkWinner(s);
        if (W) {
          setWinner(W);
        } else if (checkEndTheGame(s)) {
          setWinner('x | o');
        }
      }
    }
  }, [squares, turn, isAiMode, winner, difficulty]);

  const resetGame = (): void => {
    setSquares(Array(9).fill(''));
    setTurn('x');
    setWinner(null);
  };

  const toggleAiMode = (): void => {
    setIsAiMode(!isAiMode);
    resetGame();
  };

  const changeDifficulty = (): void => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
    const currentIndex = difficulties.indexOf(difficulty);
    const nextDifficulty = difficulties[(currentIndex + 1) % difficulties.length]!;
    setDifficulty(nextDifficulty);
    resetGame();
  };

  return {
    squares,
    turn,
    winner,
    isAiMode,
    difficulty,
    updateSquares,
    resetGame,
    toggleAiMode,
    changeDifficulty,
  };
};
