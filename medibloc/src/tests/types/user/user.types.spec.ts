import { describe, it, expect } from 'vitest';
import type { User, CreateUserDto, UpdateUserDto } from '../../../types/user/user.types';

describe('User Types', () => {
  it('devrait valider le type User', () => {
    const user: User = {
      id: 1,
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'PATIENT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(user.id).toBe(1);
    expect(user.email).toBe('user@example.com');
    expect(user.role).toBe('PATIENT');
  });

  it('devrait valider CreateUserDto', () => {
    const createDto: CreateUserDto = {
      email: 'new@example.com',
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'PATIENT',
    };

    expect(createDto.email).toBe('new@example.com');
    expect(createDto.firstName).toBe('Jane');
  });

  it('devrait valider UpdateUserDto', () => {
    const updateDto: UpdateUserDto = {
      email: 'updated@example.com',
      firstName: 'Johnny',
    };

    expect(updateDto.email).toBe('updated@example.com');
    expect(updateDto.firstName).toBe('Johnny');
  });
});
