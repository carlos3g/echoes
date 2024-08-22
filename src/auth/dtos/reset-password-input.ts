import { Match } from '@app/shared/validators/match.validator';
import { IsEmail, IsString, Length } from 'class-validator';

export class ResetPasswordInput {
  @IsEmail()
  public email!: string;

  @IsString()
  public token!: string;

  @Length(8)
  public password!: string;

  @Length(8)
  @Match('password')
  public passwordConfirmation!: string;
}
