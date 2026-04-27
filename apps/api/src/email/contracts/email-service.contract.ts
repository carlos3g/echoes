import type { ReactElement } from 'react';

export interface EmailServiceSendInput {
  to: string | string[];
  subject: string;
  react: ReactElement;
}

abstract class EmailServiceContract {
  public abstract send(input: EmailServiceSendInput): Promise<void>;
}

export { EmailServiceContract };
