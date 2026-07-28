import { describe, expect, it } from 'vitest';
import access from './access';

describe('access', () => {
  it('should return canAdmin true when user has admin access', () => {
    const initialState = {
      currentUser: {
        userid: '1',
        name: 'Admin User',
        avatar: 'https://example.com/avatar.png',
        access: 'admin',
      },
    };

    const result = access(initialState);

    expect(result.canAdmin).toBe(true);
  });

  it('should return canAdmin false when user has non-admin access', () => {
    const initialState = {
      currentUser: {
        userid: '2',
        name: 'Regular User',
        avatar: 'https://example.com/avatar.png',
        access: 'user',
      },
    };

    const result = access(initialState);

    expect(result.canAdmin).toBe(false);
  });

  it('should return canAdmin false when user access is undefined', () => {
    const initialState = {
      currentUser: {
        userid: '3',
        name: 'Guest User',
        avatar: 'https://example.com/avatar.png',
      },
    };

    const result = access(initialState);

    expect(result.canAdmin).toBe(false);
  });

  it('should return canAdmin false when currentUser is undefined', () => {
    const initialState = {
      currentUser: undefined,
    };

    const result = access(initialState);

    expect(result.canAdmin).toBeFalsy();
  });

  it('should return canAdmin false when initialState is undefined', () => {
    const result = access(undefined);

    expect(result.canAdmin).toBeFalsy();
  });

  it('should return canDashboard true when user has admin access', () => {
    const initialState = {
      currentUser: { userid: '1', name: 'Admin', access: 'admin' },
    };

    const result = access(initialState);

    expect(result.canDashboard).toBe(true);
  });

  it('should return canDashboard true when user has ai_assistant access', () => {
    const initialState = {
      currentUser: { userid: '2', name: 'AI Assistant', access: 'ai_assistant' },
    };

    const result = access(initialState);

    expect(result.canDashboard).toBe(true);
  });

  it('should return canDashboard false when user has user access', () => {
    const initialState = {
      currentUser: { userid: '3', name: 'Regular User', access: 'user' },
    };

    const result = access(initialState);

    expect(result.canDashboard).toBe(false);
  });

  it('should return canDashboard false when initialState is undefined', () => {
    const result = access(undefined);

    expect(result.canDashboard).toBeFalsy();
  });
});
