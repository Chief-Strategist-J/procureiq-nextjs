import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LoginForm } from '../../components/login-form';
import { ForgotPasswordForm } from '../../components/forgot-password-form';
import { authSlice } from '../../store/auth-slice';

function renderWithRedux(ui: React.ReactElement) {
  const store = configureStore({
    reducer: { auth: authSlice.reducer },
  });
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('Auth Module - User Acceptance Testing (UAT)', () => {
  it('UAT Journey 1: User fills in valid login credentials and submits form', () => {
    const handleLoginSubmit = vi.fn();
    renderWithRedux(<LoginForm onSubmit={handleLoginSubmit} />);

    // User types work email
    fireEvent.change(screen.getByLabelText(/work email/i), {
      target: { value: 'lead.strategist@procureiq.com' },
    });

    // User types secure password
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), {
      target: { value: 'EnterprisePass2026!' },
    });

    // User clicks submit button
    fireEvent.click(screen.getByRole('button', { name: /sign in to procureiq/i }));

    expect(handleLoginSubmit).toHaveBeenCalledWith({
      email: 'lead.strategist@procureiq.com',
      password: 'EnterprisePass2026!',
    });
  });

  it('UAT Journey 2: User requests password recovery link', () => {
    const handleForgotSubmit = vi.fn();
    render(<ForgotPasswordForm onSubmit={handleForgotSubmit} />);

    fireEvent.change(screen.getByLabelText(/work email address/i), {
      target: { value: 'recovery@procureiq.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /send password reset link/i }));

    expect(handleForgotSubmit).toHaveBeenCalledWith({
      email: 'recovery@procureiq.com',
    });
  });
});
