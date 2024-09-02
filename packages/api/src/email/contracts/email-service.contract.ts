export interface EmailServiceSendInput {
  to: string | string[];
  subject: string;
  template: string;
  context: Record<string, unknown>;
}

abstract class EmailServiceContract {
  public abstract send(input: EmailServiceSendInput): Promise<void>;
}

export { EmailServiceContract };
