import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';
import '@testing-library/jest-dom';

describe('Button Component', () => {
  it('should render without crashing', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('should render the correct children', () => {
    render(<Button>Submit Form</Button>);
    expect(screen.getByRole('button', { name: /submit form/i })).toBeInTheDocument();
  });

  it('should apply the correct classes for a given variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    const buttonElement = screen.getByRole('button', { name: /delete/i });
    expect(buttonElement).toHaveClass('inline-flex');
    expect(buttonElement).toHaveClass('bg-destructive');
  });

  it('should be disabled when the disabled prop is true', () => {
    render(<Button disabled>Cannot Click</Button>);
    const buttonElement = screen.getByRole('button', { name: /cannot click/i });
    expect(buttonElement).toBeDisabled();
  });
});