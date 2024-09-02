import type { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';
import * as zxcvbn from 'zxcvbn';

// see: https://github.com/dropbox/zxcvbn
@ValidatorConstraint({ name: 'IsUnguessablePassword' })
export class IsUnguessablePasswordConstraint implements ValidatorConstraintInterface {
  public validate(value: any, _: ValidationArguments) {
    if (!value || typeof value !== 'string') {
      return false;
    }

    const { score } = zxcvbn(value);

    return score >= 3;
  }

  public defaultMessage(_?: ValidationArguments): string {
    return 'Password too weak';
  }
}

export function IsUnguessablePassword(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsUnguessablePasswordConstraint,
    });
  };
}
