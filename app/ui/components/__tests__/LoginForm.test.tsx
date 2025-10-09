import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '@/app/ui/components/LoginForm';
import '@testing-library/jest-dom';

jest.mock('@/app/actions/auth', () => ({
  authenticate: jest.fn(),
}));

describe('LoginForm Component', () => {
  it('should render all input fields and the submit button', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('should allow typing in the email and password fields', () => {
    render(<LoginForm />);
    const emailInput = screen.getByTestId('input-email') as HTMLInputElement;
    const passwordInput = screen.getByTestId('input-password') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('should toggle password visibility when checkbox is clicked', () => {
    render(<LoginForm />);
    const passwordInput = screen.getByTestId('input-password') as HTMLInputElement;
    const checkbox = screen.getByLabelText(/mostrar senha/i);

    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(checkbox);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(checkbox);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});