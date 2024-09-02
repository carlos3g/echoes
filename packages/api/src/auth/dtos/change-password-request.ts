import { IsUnguessablePassword } from '@app/shared/validators/is-unguessable-password.validator';
import { Match } from '@app/shared/validators/match.validator';
import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class ChangePasswordRequest {
  @ApiProperty({ minLength: 8 })
  @MinLength(8)
  public currentPassword!: string;

  @ApiProperty({ minLength: 8 })
  @IsUnguessablePassword()
  @MinLength(8)
  public password!: string;

  @ApiProperty({ minLength: 8 })
  @MinLength(8)
  @Match('password', { message: 'Passwords do not match' })
  public passwordConfirmation!: string;
}
