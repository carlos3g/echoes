export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  username: string;
  avatar?: Express.Multer.File;
}

export interface UpdateUserInput {
  userId: number;
  name?: string;
  email?: string;
  password?: string;
}
