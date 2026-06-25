import { motion, AnimatePresence } from 'motion/react';
import { useTicTacToe } from './hooks/useTicTacToe';
import type { Player } from './types/game';
import Button from './components/Button/Button';
import Square from './components/Square/Square';
import Board from './components/Board/Board';
import styles from './App.module.css';

function App() {
  const {
    squares,
    turn,
    winner,
    isAiMode,
    difficulty,
    updateSquares,
    resetGame,
    toggleAiMode,
    changeDifficulty,
  } = useTicTacToe();

  const capitalizedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return (
    <div className={styles.ticTacToe}>
      <h1>
        TIC-TAC-TOE
        {isAiMode
          ? ` (AI Mode - ${capitalizedDifficulty} Level)`
          : ''}
      </h1>
      <div className={styles.gameControls}>
        <Button resetGame={resetGame} text="Reset Game" />
        <button onClick={toggleAiMode}>
          {isAiMode ? 'Disable AI' : 'Enable AI'}
        </button>
        {isAiMode && (
          <button onClick={changeDifficulty}>
            {capitalizedDifficulty}
          </button>
        )}
      </div>
      <div className={styles.game}>
        <Board squares={squares} updateSquares={updateSquares} />
      </div>
      <div className={`${styles.turn} ${turn === 'x' ? styles.left : styles.right}`}>
        <Square clsName="x" />
        <Square clsName="o" />
      </div>
      <AnimatePresence>
        {winner && (
          <motion.div
            key="parent-box"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.winner}
          >
            <motion.div
              key="child-box"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={styles.text}
            >
              <motion.h2
                initial={{ scale: 0, y: 100 }}
                animate={{
                  scale: 1,
                  y: 0,
                  transition: {
                    y: { delay: 0.7 },
                    duration: 0.7,
                  },
                }}
              >
                {winner === 'x | o' ? 'Tie :/' : 'Winner!! :)'}
              </motion.h2>
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  transition: { delay: 1.3, duration: 0.2 },
                }}
                className={styles.win}
              >
                {winner === 'x | o' ? (
                  <>
                    <Square clsName="x" />
                    <Square clsName="o" />
                  </>
                ) : (
                  <Square clsName={winner as Player} />
                )}
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  transition: { delay: 1.5, duration: 0.3 },
                }}
              >
                <Button resetGame={resetGame} text="Play Again" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
