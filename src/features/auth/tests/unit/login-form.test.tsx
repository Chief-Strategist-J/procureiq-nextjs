import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from '../../components/login-form';

describe('LoginForm UI Component - Unit Tests', () => {
  it('renders input fields and submit button correctly', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in to procureiq/i })).toBeInTheDocument();
  });

  it('triggers onSubmit callback when form is submitted', () => {
    const handleSubmit = vi.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/work email/i), {
      target: { value: 'jaydeep@procureiq.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'SecurePass123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in to procureiq/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'jaydeep@procureiq.com',
      password: 'SecurePass123!',
    });
  });

  it('disables submit button in loading state', () => {
    render(<LoginForm isLoading />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
