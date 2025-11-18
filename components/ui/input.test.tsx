import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from './input';

describe('Input', () => {
  it('renders input with placeholder', () => {
    render(<Input placeholder="Email" />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

  it('passes through input props', () => {
    render(<Input type="password" disabled data-testid="password-input" />);
    const input = screen.getByTestId('password-input');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Input className="custom-input" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-input');
  });
});
