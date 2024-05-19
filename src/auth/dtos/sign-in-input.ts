import { IsEmail, Length } from 'class-validator';

export class SignInInput {
  @IsEmail()
  public email: string;

  @Length(8)
  public password: string;
}
