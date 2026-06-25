interface ButtonProps {
  resetGame: () => void;
  text: string;
}

const Button = ({ resetGame, text }: ButtonProps) => {
  return <button onClick={() => resetGame()}>{text}</button>;
};

export default Button;
