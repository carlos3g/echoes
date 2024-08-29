import { Match } from '@app/shared/validators/match.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class SignUpInput {
  @ApiProperty()
  @IsString()
  public name!: string;

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
