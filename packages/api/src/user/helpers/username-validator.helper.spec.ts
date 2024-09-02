import { UsernameValidatorHelper } from './username-validator.helper';

describe('UsernameValidatorHelper', () => {
  describe('validate', () => {
    it('should return false if the username is too short', () => {
      const shortUsername = 'ab';

      const result = UsernameValidatorHelper.validate(shortUsername);

      expect(result).toBe(false);
    });

    it('should return false if the username is too long', () => {
      const longUsername = 'a'.repeat(21);

      const result = UsernameValidatorHelper.validate(longUsername);

      expect(result).toBe(false);
    });

    it('should return false if the username contains invalid characters', () => {
      const invalidUsername = 'user!name';

      const result = UsernameValidatorHelper.validate(invalidUsername);

      expect(result).toBe(false);
    });

    it('should return true if username is valid', () => {
      const validUsername = 'valid_username-123';

      const result = UsernameValidatorHelper.validate(validUsername);

      expect(result).toBe(true);
    });

    it('should return false if the username contains uppercase letters', () => {
      const validUsername = 'valid_useRname-123';

      const result = UsernameValidatorHelper.validate(validUsername);

      expect(result).toBe(false);
    });

    it('should return false if the username contains spaces', () => {
      const invalidUsername = 'user name';

      const result = UsernameValidatorHelper.validate(invalidUsername);

      expect(result).toBe(false);
    });
  });
});
