import { IsEmail, IsString, Length } from 'class-validator';

export class SignUpInput {
  @IsString()
  public name!: string;

  @IsEmail()
  public email!: string;

  @Length(8)
  public password!: string;
}
