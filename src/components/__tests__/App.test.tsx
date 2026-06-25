import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

// Mock motion/react to avoid animation issues in tests
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, onClick }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} onClick={onClick}>{children}</div>
    ),
    span: ({ children, className }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span className={className}>{children}</span>
    ),
    h2: ({ children, className }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className={className}>{children}</h2>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('App', () => {
  it('renders the game title "TIC-TAC-TOE"', () => {
    render(<App />);
    expect(screen.getByText(/TIC-TAC-TOE/)).toBeInTheDocument();
  });

  it('renders 9 board squares', () => {
    const { container } = render(<App />);
    const squares = container.querySelectorAll('.square');
    expect(squares.length).toBeGreaterThanOrEqual(9);
  });

  it('renders the "Reset Game" button', () => {
    render(<App />);
    expect(screen.getByText('Reset Game')).toBeInTheDocument();
  });

  it('renders the "Enable AI" button', () => {
    render(<App />);
    expect(screen.getByText('Enable AI')).toBeInTheDocument();
  });

  it('clicking "Enable AI" changes button text to "Disable AI"', async () => {
    const user = userEvent.setup();
    render(<App />);
    const aiButton = screen.getByText('Enable AI');
    await user.click(aiButton);
    expect(screen.getByText('Disable AI')).toBeInTheDocument();
    expect(screen.queryByText('Enable AI')).not.toBeInTheDocument();
  });

  it('clicking "Enable AI" shows a difficulty toggle button', async () => {
    const user = userEvent.setup();
    render(<App />);
    // Initially no difficulty button
    expect(screen.queryByText('Easy')).not.toBeInTheDocument();
    const aiButton = screen.getByText('Enable AI');
    await user.click(aiButton);
    // After enabling AI, difficulty button should appear (default is 'easy' => 'Easy')
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('board squares are clickable and update the game state', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    // Get all squares from the game board area
    const squares = container.querySelectorAll('.square');
    // The board squares are rendered by the Board component (first 9 in the game area)
    // plus 2 turn indicator squares. Click the first game square.
    const gameSquares = Array.from(squares);

    // Find a square that has no span child (empty) - should be one of the board squares
    const emptySquare = gameSquares.find(
      (sq) => sq.querySelectorAll('span').length === 0,
    );
    expect(emptySquare).toBeTruthy();

    await user.click(emptySquare!);

    // After click, the square should have a mark (span with class 'x' since X goes first)
    const markedSpan = emptySquare!.querySelector('span.x');
    expect(markedSpan).toBeInTheDocument();
  });
});
