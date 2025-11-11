import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnimatedInput } from './animated-input';

describe('AnimatedInput', () => {
  it('renders input with placeholder', () => {
    render(<AnimatedInput placeholder="Email" />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

  it('passes through input props', () => {
    render(<AnimatedInput type="password" disabled data-testid="password-input" />);
    const input = screen.getByTestId('password-input');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<AnimatedInput className="custom-input" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-input');
  });
});
