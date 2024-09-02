import { IsUnguessablePassword } from '@app/shared/validators/is-unguessable-password.validator';
import { Match } from '@app/shared/validators/match.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpRequest {
  @ApiProperty()
  @IsString()
  public name!: string;

  @ApiProperty()
  @IsEmail()
  public email!: string;

  @ApiProperty({ minLength: 8 })
  @IsUnguessablePassword()
  @MinLength(8)
  public password!: string;

  @ApiProperty({ minLength: 8 })
  @MinLength(8)
  @Match('password', { message: 'Passwords do not match' })
  public passwordConfirmation!: string;
}
