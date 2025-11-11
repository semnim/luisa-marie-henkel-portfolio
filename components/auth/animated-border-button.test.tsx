import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnimatedBorderButton } from './animated-border-button';

describe('AnimatedBorderButton', () => {
  it('renders button with children', () => {
    render(<AnimatedBorderButton>Click Me</AnimatedBorderButton>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('passes through button props', () => {
    render(<AnimatedBorderButton disabled>Submit</AnimatedBorderButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<AnimatedBorderButton className="custom-class">Test</AnimatedBorderButton>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
