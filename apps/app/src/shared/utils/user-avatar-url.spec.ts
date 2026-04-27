import { userAvatarUrl } from './user-avatar-url';

describe('userAvatarUrl', () => {
  it('should return the correct avatar URL with API base URL', () => {
    const user = { uuid: '123e4567-e89b-12d3-a456-426614174000' };
    const result = userAvatarUrl(user, 'https://api.example.com');

    expect(result).toBe('https://api.example.com/users/123e4567-e89b-12d3-a456-426614174000.webp');
  });

  it('should work with different API URLs', () => {
    const user = { uuid: 'abc-123' };
    const result = userAvatarUrl(user, 'http://localhost:3000');

    expect(result).toBe('http://localhost:3000/users/abc-123.webp');
  });

  it('should handle undefined API URL', () => {
    const user = { uuid: 'test-uuid' };
    const result = userAvatarUrl(user, undefined);

    expect(result).toBe('undefined/users/test-uuid.webp');
  });

  it('should only require uuid from User type', () => {
    const partialUser = { uuid: 'partial-uuid' };
    const result = userAvatarUrl(partialUser, 'https://api.example.com');

    expect(result).toBe('https://api.example.com/users/partial-uuid.webp');
  });

  it('should handle URLs with trailing slash', () => {
    const user = { uuid: 'uuid-123' };
    const result = userAvatarUrl(user, 'https://api.example.com/');

    expect(result).toBe('https://api.example.com//users/uuid-123.webp');
  });

  it('should work with various uuid formats', () => {
    const user1 = { uuid: 'simple-uuid' };
    const user2 = { uuid: '550e8400-e29b-41d4-a716-446655440000' };
    const user3 = { uuid: '123' };

    expect(userAvatarUrl(user1, 'https://api.com')).toBe('https://api.com/users/simple-uuid.webp');
    expect(userAvatarUrl(user2, 'https://api.com')).toBe(
      'https://api.com/users/550e8400-e29b-41d4-a716-446655440000.webp'
    );
    expect(userAvatarUrl(user3, 'https://api.com')).toBe('https://api.com/users/123.webp');
  });
});
