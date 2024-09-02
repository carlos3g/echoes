import { Match } from '@app/shared/validators/match.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class ResetPasswordRequest {
  @ApiProperty()
  @IsEmail()
  public email!: string;

  @ApiProperty({ minLength: 8 })
  @MinLength(8)
  public password!: string;

  @ApiProperty({ minLength: 8 })
  @MinLength(8)
  @Match('password', { message: 'Passwords do not match' })
  public passwordConfirmation!: string;
}
