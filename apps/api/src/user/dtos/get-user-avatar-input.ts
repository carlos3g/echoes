import type { Response } from 'express';

export interface GetUserAvatarInput {
  userUuid: string;
  response: Response;
}
