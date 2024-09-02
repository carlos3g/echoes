import { UsernameValidatorHelper } from '@app/user/helpers/username-validator.helper';
import type { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint, registerDecorator } from 'class-validator';

@ValidatorConstraint({ name: 'IsValidUsername', async: false })
export class IsUsernameValidConstraint implements ValidatorConstraintInterface {
  public validate(username: string, _: ValidationArguments) {
    if (!username || typeof username !== 'string') {
      return false;
    }

    return UsernameValidatorHelper.validate(username);
  }

  public defaultMessage(_: ValidationArguments) {
    return 'Username must be between 3 and 20 characters long and can only contain lowercase letters, numbers, underscores, and hyphens.';
  }
}

export function IsUsernameValid(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameValidConstraint,
    });
  };
}
