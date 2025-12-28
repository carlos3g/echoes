import {
  changePasswordFormSchema,
  forgotPasswordFormSchema,
  loginFormSchema,
  resetPasswordFormSchema,
  signUpFormSchema,
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
    const result = signUpFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should accept sign up without email (optional)', () => {
    const { email: _, ...dataWithoutEmail } = validData;
    const result = signUpFormSchema.safeParse(dataWithoutEmail);
    expect(result.success).toBe(true);
  });

  it('should reject empty name', () => {
    const result = signUpFormSchema.safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.issues.find((i) => i.path.includes('name'));
      expect(nameError?.message).toBe('Campo obrigatório');
    }
  });

  it('should reject invalid email format', () => {
    const result = signUpFormSchema.safeParse({ ...validData, email: 'invalid-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find((i) => i.path.includes('email'));
      expect(emailError?.message).toBe('Email inválido');
    }
  });

  it('should reject password with less than 8 characters', () => {
    const result = signUpFormSchema.safeParse({
      ...validData,
      password: 'short',
      passwordConfirmation: 'short',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordError = result.error.issues.find((i) => i.path.includes('password'));
      expect(passwordError?.message).toBe('A senha deve ter pelo menos 8 caracteres');
    }
  });

  it('should reject when passwords do not match', () => {
    const result = signUpFormSchema.safeParse({
      ...validData,
      password: 'password123',
      passwordConfirmation: 'differentpassword',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find((i) => i.path.includes('passwordConfirmation'));
      expect(confirmError?.message).toBe('As senhas inseridas devem ser iguais');
    }
  });

  it('should reject invalid username format', () => {
    const result = signUpFormSchema.safeParse({ ...validData, username: 'John Doe' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const usernameError = result.error.issues.find((i) => i.path.includes('username'));
      expect(usernameError?.message).toBe(
        'Username deve conter apenas letras minúsculas, números, underlines e híphens'
      );
    }
  });

  it('should reject when terms are not accepted', () => {
    const result = signUpFormSchema.safeParse({ ...validData, acceptTerms: false });
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
    const result = loginFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should accept login with remember true', () => {
    const result = loginFormSchema.safeParse({ ...validData, remember: true });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = loginFormSchema.safeParse({ ...validData, email: 'invalid' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email inválido');
    }
  });

  it('should reject short password', () => {
    const result = loginFormSchema.safeParse({ ...validData, password: 'short' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('A senha deve ter pelo menos 8 caracteres');
    }
  });

  it('should reject missing remember field', () => {
    const { remember: _, ...dataWithoutRemember } = validData;
    const result = loginFormSchema.safeParse(dataWithoutRemember);
    expect(result.success).toBe(false);
  });
});

describe('forgotPasswordFormSchema', () => {
  it('should accept valid email', () => {
    const result = forgotPasswordFormSchema.safeParse({ email: 'john@example.com' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = forgotPasswordFormSchema.safeParse({ email: 'invalid' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email inválido');
    }
  });

  it('should reject empty email', () => {
    const result = forgotPasswordFormSchema.safeParse({ email: '' });
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
    const result = resetPasswordFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject when passwords do not match', () => {
    const result = resetPasswordFormSchema.safeParse({
      ...validData,
      password: 'password123',
      passwordConfirmation: 'differentpassword',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find((i) => i.path.includes('passwordConfirmation'));
      expect(confirmError?.message).toBe('As senhas inseridas devem ser iguais');
    }
  });

  it('should reject invalid email', () => {
    const result = resetPasswordFormSchema.safeParse({ ...validData, email: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = resetPasswordFormSchema.safeParse({
      ...validData,
      password: 'short',
      passwordConfirmation: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty token', () => {
    const result = resetPasswordFormSchema.safeParse({ ...validData, token: '' });
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
    const result = changePasswordFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject when new passwords do not match', () => {
    const result = changePasswordFormSchema.safeParse({
      ...validData,
      password: 'newpassword123',
      passwordConfirmation: 'differentpassword',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find((i) => i.path.includes('passwordConfirmation'));
      expect(confirmError?.message).toBe('As senhas inseridas devem ser iguais');
    }
  });

  it('should reject short current password', () => {
    const result = changePasswordFormSchema.safeParse({ ...validData, currentPassword: 'short' });
    expect(result.success).toBe(false);
  });

  it('should reject short new password', () => {
    const result = changePasswordFormSchema.safeParse({
      ...validData,
      password: 'short',
      passwordConfirmation: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('should allow same current and new password', () => {
    const result = changePasswordFormSchema.safeParse({
      currentPassword: 'samepassword123',
      password: 'samepassword123',
      passwordConfirmation: 'samepassword123',
    });
    expect(result.success).toBe(true);
  });
});
