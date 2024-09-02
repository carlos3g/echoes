export class UsernameValidatorHelper {
  private static readonly minLength = 3;

  private static readonly maxLength = 20;

  private static readonly pattern = /^[a-z0-9_-]+$/;

  public static validate(username: string): boolean {
    if (username.length < UsernameValidatorHelper.minLength || username.length > UsernameValidatorHelper.maxLength) {
      return false;
    }

    if (!UsernameValidatorHelper.pattern.test(username)) {
      return false;
    }

    return true;
  }
}
