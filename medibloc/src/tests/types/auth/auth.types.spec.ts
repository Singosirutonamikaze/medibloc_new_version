import { describe, it, expect } from 'vitest';
import type { AuthUser, LoginCredentials, RegisterData, AuthResponse } from '../../../types/auth/auth.types';

describe('Auth Types', () => {
  it('devrait valider le type AuthUser', () => {
    const user: AuthUser = {
      id: 1,
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'PATIENT',
    };

    expect(user.id).toBe(1);
    expect(user.email).toBe('user@example.com');
    expect(typeof user.firstName).toBe('string');
    expect(typeof user.lastName).toBe('string');
  });

  it('devrait valider le type LoginCredentials', () => {
    const credentials: LoginCredentials = {
      email: 'user@example.com',
      password: 'password123',
    };

    expect(credentials.email).toBe('user@example.com');
    expect(credentials.password).toBe('password123');
  });

  it('devrait valider le type RegisterData', () => {
    const registerData: RegisterData = {
      email: 'new@example.com',
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'PATIENT',
    };

    expect(registerData.email).toBe('new@example.com');
    expect(registerData.firstName).toBe('Jane');
  });

  it('devrait valider le type AuthResponse', () => {
    const response: AuthResponse = {
      user: {
        id: 1,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'PATIENT',
      },
      token: 'jwt_token_here',
    };

    expect(response.user).toBeDefined();
    expect(response.token).toBe('jwt_token_here');
  });
});
