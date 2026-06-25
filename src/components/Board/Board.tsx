import type { Board as BoardType, CellValue } from '../../types/game';
import Square from '../Square/Square';

interface BoardProps {
  squares: BoardType;
  updateSquares: (ind: number) => void;
}

const Board = ({ squares, updateSquares }: BoardProps) => {
  return (
    <>
      {Array.from({ length: 9 }, (_, ind) => (
        <Square
          key={ind}
          ind={ind}
          updateSquares={updateSquares}
          clsName={squares[ind] as CellValue}
        />
      ))}
    </>
  );
};

export default Board;
