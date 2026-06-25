import { motion } from 'motion/react';
import type { CellValue } from '../../types/game';
import styles from './Square.module.css';

interface SquareProps {
  ind?: number;
  updateSquares?: (ind: number) => void;
  clsName: CellValue;
}

const Square = ({ ind, updateSquares, clsName }: SquareProps) => {
  const handleClick = () => {
    if (ind !== undefined && updateSquares) {
      updateSquares(ind);
    }
  };
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`${styles.square} square`}
      onClick={handleClick}
    >
      {clsName && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`${styles[clsName]} ${clsName}`}
        ></motion.span>
      )}
    </motion.div>
  );
};

export default Square;
