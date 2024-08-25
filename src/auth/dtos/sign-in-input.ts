import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class SignInInput {
  @ApiProperty()
  @IsEmail()
  public email!: string;

  @ApiProperty({ minLength: 8 })
  @Length(8)
  public password!: string;
}
