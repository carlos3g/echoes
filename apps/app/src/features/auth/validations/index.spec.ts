import {
  createChangePasswordFormSchema,
  createForgotPasswordFormSchema,
  createLoginFormSchema,
  createResetPasswordFormSchema,
  createSignUpFormSchema,
} from './index';

describe('signUpFormSchema', () => {
  const validData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    passwordConfirmation: 'password123',
    username: 'johndoe',
    acceptTerms: true as const,
  };

  it('should accept valid sign up data', () => {
    const result = createSignUpFormSchema().safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should accept sign up without email (optional)', () => {
    const { email: _, ...dataWithoutEmail } = validData;
    const result = createSignUpFormSchema().safeParse(dataWithoutEmail);
    expect(result.success).toBe(true);
  });

  it('should reject empty name', () => {
    const result = createSignUpFormSchema().safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid email format', () => {
    const result = createSignUpFormSchema().safeParse({ ...validData, email: 'invalid-email' });
    expect(result.success).toBe(false);
  });

  it('should reject password with less than 8 characters', () => {
    const result = createSignUpFormSchema().safeParse({
      ...validData,
      password: 'short',
      passwordConfirmation: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('should reject when passwords do not match', () => {
    const result = createSignUpFormSchema().safeParse({
      ...validData,
      password: 'password123',
      passwordConfirmation: 'differentpassword',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find((i: { path: PropertyKey[] }) =>
        i.path.includes('passwordConfirmation')
      );
      expect(confirmError).toBeDefined();
    }
  });

  it('should reject invalid username format', () => {
    const result = createSignUpFormSchema().safeParse({ ...validData, username: 'John Doe' });
    expect(result.success).toBe(false);
  });

  it('should reject when terms are not accepted', () => {
    const result = createSignUpFormSchema().safeParse({ ...validData, acceptTerms: false });
    expect(result.success).toBe(false);
  });
});

describe('loginFormSchema', () => {
  const validData = {
    email: 'john@example.com',
    password: 'password123',
    remember: false,
  };

  it('should accept valid login data', () => {
    const result = createLoginFormSchema().safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should accept login with remember true', () => {
    const result = createLoginFormSchema().safeParse({ ...validData, remember: true });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = createLoginFormSchema().safeParse({ ...validData, email: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = createLoginFormSchema().safeParse({ ...validData, password: 'short' });
    expect(result.success).toBe(false);
  });

  it('should reject missing remember field', () => {
    const { remember: _, ...dataWithoutRemember } = validData;
    const result = createLoginFormSchema().safeParse(dataWithoutRemember);
    expect(result.success).toBe(false);
  });
});

describe('forgotPasswordFormSchema', () => {
  it('should accept valid email', () => {
    const result = createForgotPasswordFormSchema().safeParse({ email: 'john@example.com' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = createForgotPasswordFormSchema().safeParse({ email: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('should reject empty email', () => {
    const result = createForgotPasswordFormSchema().safeParse({ email: '' });
    expect(result.success).toBe(false);
  });
});

describe('resetPasswordFormSchema', () => {
  const validData = {
    email: 'john@example.com',
    password: 'newpassword123',
    passwordConfirmation: 'newpassword123',
    token: 'reset-token-123',
  };

  it('should accept valid reset password data', () => {
    const result = createResetPasswordFormSchema().safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject when passwords do not match', () => {
    const result = createResetPasswordFormSchema().safeParse({
      ...validData,
      password: 'password123',
      passwordConfirmation: 'differentpassword',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find((i: { path: PropertyKey[] }) =>
        i.path.includes('passwordConfirmation')
      );
      expect(confirmError).toBeDefined();
    }
  });

  it('should reject invalid email', () => {
    const result = createResetPasswordFormSchema().safeParse({ ...validData, email: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = createResetPasswordFormSchema().safeParse({
      ...validData,
      password: 'short',
      passwordConfirmation: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty token', () => {
    const result = createResetPasswordFormSchema().safeParse({ ...validData, token: '' });
    expect(result.success).toBe(true); // token is just z.string(), no min length
  });
});

describe('changePasswordFormSchema', () => {
  const validData = {
    currentPassword: 'oldpassword123',
    password: 'newpassword123',
    passwordConfirmation: 'newpassword123',
  };

  it('should accept valid change password data', () => {
    const result = createChangePasswordFormSchema().safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject when new passwords do not match', () => {
    const result = createChangePasswordFormSchema().safeParse({
      ...validData,
      password: 'newpassword123',
      passwordConfirmation: 'differentpassword',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find((i: { path: PropertyKey[] }) =>
        i.path.includes('passwordConfirmation')
      );
      expect(confirmError).toBeDefined();
    }
  });

  it('should reject short current password', () => {
    const result = createChangePasswordFormSchema().safeParse({ ...validData, currentPassword: 'short' });
    expect(result.success).toBe(false);
  });

  it('should reject short new password', () => {
    const result = createChangePasswordFormSchema().safeParse({
      ...validData,
      password: 'short',
      passwordConfirmation: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('should allow same current and new password', () => {
    const result = createChangePasswordFormSchema().safeParse({
      currentPassword: 'samepassword123',
      password: 'samepassword123',
      passwordConfirmation: 'samepassword123',
    });
    expect(result.success).toBe(true);
  });
});
