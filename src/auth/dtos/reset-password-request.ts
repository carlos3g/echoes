import { Match } from '@app/shared/validators/match.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class ResetPasswordRequest {
  @ApiProperty()
  @IsEmail()
  public email!: string;

  @ApiProperty({ minLength: 8 })
  @Length(8)
  public password!: string;

  @ApiProperty({ minLength: 8 })
  @Length(8)
  @Match('password')
  public passwordConfirmation!: string;
}
