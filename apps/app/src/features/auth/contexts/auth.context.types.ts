import type { SignInOutput } from '@/features/auth/contracts/auth-service.contract';
import type { User } from '@/types/entities';

export type Token = string | null;

export type AuthContextValue = {
  handleSignIn: (apiResponse: SignInOutput) => void;
  handleSignOut: () => void;
  user?: User;
  token: Token;
  refreshToken: Token;
  isAuth: boolean;
  updateUser: () => Promise<void>;
};
