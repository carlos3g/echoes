import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordInput {
  @ApiProperty()
  @IsEmail()
  public email!: string;
}
