import type {
  AuthServiceContract,
  ForgotPasswordOutput,
  ForgotPasswordPayload,
  MeOutput,
  RefreshTokenOutput,
  RefreshTokenPayload,
  ResetPasswordOutput,
  ResetPasswordPayload,
  SignInOutput,
  SignInPayload,
  SignUpOutput,
  SignUpPayload,
} from '@/features/auth/contracts/auth-service.contract';
import type { HttpClientServiceContract } from '@/shared/contracts/http-client-service.contract';

export class AuthService implements AuthServiceContract {
  constructor(private readonly httpClientService: HttpClientServiceContract) {}

  public async signIn(payload: SignInPayload): Promise<SignInOutput> {
    return this.httpClientService.post<SignInOutput, SignInPayload>('/auth/sign-in', payload);
  }

  public async signUp(payload: SignUpPayload): Promise<SignUpOutput> {
    return this.httpClientService.post<SignUpOutput, SignUpPayload>('/auth/sign-up', payload);
  }

  public async forgotPassword(payload: ForgotPasswordPayload): Promise<ForgotPasswordOutput> {
    return this.httpClientService.post<ForgotPasswordOutput, ForgotPasswordPayload>('/auth/forgot-password', payload);
  }

  public async resetPassword(payload: ResetPasswordPayload): Promise<ResetPasswordOutput> {
    return this.httpClientService.post<ResetPasswordOutput, ResetPasswordPayload>(
      `/auth/reset-password/${payload.token}`,
      payload
    );
  }

  public refreshToken(payload: RefreshTokenPayload): Promise<RefreshTokenOutput> {
    return this.httpClientService.post<RefreshTokenOutput, RefreshTokenPayload>('/auth/refresh', payload);
  }

  public me(): Promise<MeOutput> {
    return this.httpClientService.get<MeOutput, unknown>('/auth/me');
  }
}
