import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Square from '../Square/Square';

// Mock motion/react to avoid animation issues in tests
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, onClick, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} onClick={onClick}>{children}</div>
    ),
    span: ({ children, className, ...rest }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span className={className}>{children}</span>
    ),
  },
}));

describe('Square', () => {
  it('renders without crashing', () => {
    const { container } = render(<Square clsName="" />);
    expect(container).toBeTruthy();
  });

  it('renders an X mark when clsName is "x"', () => {
    const { container } = render(<Square clsName="x" />);
    const span = container.querySelector('span.x');
    expect(span).toBeInTheDocument();
  });

  it('renders an O mark when clsName is "o"', () => {
    const { container } = render(<Square clsName="o" />);
    const span = container.querySelector('span.o');
    expect(span).toBeInTheDocument();
  });

  it('renders no mark when clsName is empty string', () => {
    const { container } = render(<Square clsName="" />);
    const spans = container.querySelectorAll('span');
    expect(spans).toHaveLength(0);
  });

  it('calls updateSquares with the correct index on click', async () => {
    const user = userEvent.setup();
    const updateSquares = vi.fn();
    const { container } = render(
      <Square ind={3} updateSquares={updateSquares} clsName="" />,
    );
    const squareDiv = container.querySelector('.square')!;
    await user.click(squareDiv);
    expect(updateSquares).toHaveBeenCalledTimes(1);
    expect(updateSquares).toHaveBeenCalledWith(3);
  });

  it('does not crash when clicked without updateSquares prop', async () => {
    const user = userEvent.setup();
    const { container } = render(<Square clsName="" />);
    const squareDiv = container.firstElementChild!;
    await user.click(squareDiv);
    // Should not throw
  });
});
