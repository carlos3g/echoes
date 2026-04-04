import type { z } from 'zod';
import type {
  createChangePasswordFormSchema,
  createForgotPasswordFormSchema,
  createLoginFormSchema,
  createResetPasswordFormSchema,
  createSignUpFormSchema,
} from '@/features/auth/validations';
import type { User } from '@/types/entities';

export type SignInPayload = z.infer<ReturnType<typeof createLoginFormSchema>>;

export type SignInOutput = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type SignUpPayload = z.infer<ReturnType<typeof createSignUpFormSchema>>;

export type SignUpOutput = {
  name: string;
  email: string;
  username: string;
  password: string;
  passwordConfirmation: string;
};

export type ResetPasswordPayload = z.infer<ReturnType<typeof createResetPasswordFormSchema>>;

export type ResetPasswordOutput = {
  password: string;
  passwordConfirmation: string;
};

export type ForgotPasswordPayload = z.infer<ReturnType<typeof createForgotPasswordFormSchema>>;

export type ForgotPasswordOutput = {
  email: string;
};

export type ChangePasswordPayload = z.infer<ReturnType<typeof createChangePasswordFormSchema>>;

export type ChangePasswordOutput = {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
};

export type RefreshTokenPayload = {
  refreshToken: string;
};

export type RefreshTokenOutput = {
  accessToken: string;
  refreshToken: string;
};

export type MeOutput = {
  user: User;
};

export interface UpdateProfilePayload {
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
}

export type UpdateProfileOutput = void;

export abstract class AuthServiceContract {
  public abstract signIn(payload: SignInPayload): Promise<SignInOutput>;

  public abstract signUp(payload: SignUpPayload): Promise<SignUpOutput>;

  public abstract resetPassword(payload: ResetPasswordPayload): Promise<ResetPasswordOutput>;

  public abstract forgotPassword(payload: ForgotPasswordPayload): Promise<ForgotPasswordOutput>;

  public abstract changePassword(payload: ChangePasswordPayload): Promise<ChangePasswordOutput>;

  public abstract refreshToken(payload: RefreshTokenPayload): Promise<RefreshTokenOutput>;

  public abstract me(): Promise<MeOutput>;

  public abstract updateProfile(payload: UpdateProfilePayload): Promise<UpdateProfileOutput>;
}
