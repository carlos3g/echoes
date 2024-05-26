import { IsEmail } from 'class-validator';

export class ForgotPasswordInput {
  @IsEmail()
  public email: string;
}
