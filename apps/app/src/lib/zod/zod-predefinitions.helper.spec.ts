import { validateEmail, validatePassword, validateUsername, validateUuid } from './zod-predefinitions.helper';

describe('validateUuid', () => {
  const schema = validateUuid();

  it('should accept valid UUID v4', () => {
    const validUuids = [
      '550e8400-e29b-41d4-a716-446655440000',
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    ];

    validUuids.forEach((uuid) => {
      expect(schema.safeParse(uuid).success).toBe(true);
    });
  });

  it('should reject invalid UUIDs', () => {
    const invalidUuids = ['not-a-uuid', '123', '', 'g47ac10b-58cc-4372-a567-0e02b2c3d479', '550e8400-e29b-41d4-a716'];

    invalidUuids.forEach((uuid) => {
      const result = schema.safeParse(uuid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Inválido');
      }
    });
  });

  it('should reject non-string values', () => {
    expect(schema.safeParse(123).success).toBe(false);
    expect(schema.safeParse(null).success).toBe(false);
    expect(schema.safeParse(undefined).success).toBe(false);
  });
});

describe('validatePassword', () => {
  const schema = validatePassword();

  it('should accept passwords with 8 or more characters', () => {
    const validPasswords = ['12345678', 'password123', 'verylongpassword', 'P@ssw0rd!'];

    validPasswords.forEach((password) => {
      expect(schema.safeParse(password).success).toBe(true);
    });
  });

  it('should reject passwords with less than 8 characters', () => {
    const invalidPasswords = ['1234567', 'short', 'abc', ''];

    invalidPasswords.forEach((password) => {
      const result = schema.safeParse(password);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('A senha deve ter pelo menos 8 caracteres');
      }
    });
  });

  it('should reject non-string values', () => {
    expect(schema.safeParse(12345678).success).toBe(false);
    expect(schema.safeParse(null).success).toBe(false);
  });
});

describe('validateEmail', () => {
  const schema = validateEmail();

  it('should accept valid email addresses', () => {
    const validEmails = ['test@example.com', 'user.name@domain.org', 'user+tag@example.co.uk', 'a@b.co'];

    validEmails.forEach((email) => {
      expect(schema.safeParse(email).success).toBe(true);
    });
  });

  it('should reject invalid email addresses', () => {
    const invalidEmails = ['notanemail', 'missing@domain', '@nodomain.com', 'spaces in@email.com', ''];

    invalidEmails.forEach((email) => {
      const result = schema.safeParse(email);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email inválido');
      }
    });
  });

  it('should reject non-string values', () => {
    expect(schema.safeParse(123).success).toBe(false);
    expect(schema.safeParse(null).success).toBe(false);
  });
});

describe('validateUsername', () => {
  const schema = validateUsername();

  it('should accept valid usernames', () => {
    const validUsernames = ['john', 'john_doe', 'john-doe', 'john123', 'user_name-123'];

    validUsernames.forEach((username) => {
      expect(schema.safeParse(username).success).toBe(true);
    });
  });

  it('should reject usernames with less than 3 characters', () => {
    const result = schema.safeParse('ab');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Username deve ter pelo menos 3 caracteres');
    }
  });

  it('should reject usernames with more than 20 characters', () => {
    const result = schema.safeParse('a'.repeat(21));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Username deve ter no máximo 20 caracteres');
    }
  });

  it('should reject usernames with uppercase letters', () => {
    const result = schema.safeParse('JohnDoe');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Username deve conter apenas letras minúsculas, números, underlines e híphens'
      );
    }
  });

  it('should reject usernames with invalid characters', () => {
    const invalidUsernames = ['john doe', 'john.doe', 'john@doe', 'john!doe', 'ação'];

    invalidUsernames.forEach((username) => {
      const result = schema.safeParse(username);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Username deve conter apenas letras minúsculas, números, underlines e híphens'
        );
      }
    });
  });

  it('should accept edge case valid usernames', () => {
    expect(schema.safeParse('abc').success).toBe(true);
    expect(schema.safeParse('a'.repeat(20)).success).toBe(true);
    expect(schema.safeParse('___').success).toBe(true);
    expect(schema.safeParse('---').success).toBe(true);
    expect(schema.safeParse('123').success).toBe(true);
  });
});
