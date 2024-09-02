export class SignUpInput {
  public name!: string;

  public email!: string;

  public password!: string;

  public username!: string;

  public passwordConfirmation!: string;

  public avatar?: Express.Multer.File;
}
