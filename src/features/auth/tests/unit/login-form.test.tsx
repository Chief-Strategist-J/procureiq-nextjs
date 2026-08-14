import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LoginForm } from '../../components/login-form';
import { authSlice } from '../../store/auth-slice';

function renderWithRedux(ui: React.ReactElement) {
  const store = configureStore({
    reducer: { auth: authSlice.reducer },
  });
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('LoginForm UI Component - Unit Tests', () => {
  it('renders input fields and submit button correctly', () => {
    renderWithRedux(<LoginForm />);
    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password', { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in to procureiq/i })).toBeInTheDocument();
  });

  it('triggers onSubmit callback when form is submitted', () => {
    const handleSubmit = vi.fn();
    renderWithRedux(<LoginForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/work email/i), {
      target: { value: 'jaydeep@procureiq.com' },
    });
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), {
      target: { value: 'SecurePass123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in to procureiq/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'jaydeep@procureiq.com',
      password: 'SecurePass123!',
    });
  });

  it('disables submit button in loading state', () => {
    renderWithRedux(<LoginForm isLoading />);
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
  });
});
