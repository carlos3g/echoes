import type { ResendEmailConfirmationInput } from '@app/auth/dtos/resend-email-confirmation-input';
import { EmailConfirmationService } from '@app/auth/services/email-confirmation.service';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResendEmailConfirmationUseCase implements UseCaseHandler {
  public constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

  public async handle(input: ResendEmailConfirmationInput) {
    await this.emailConfirmationService.sendConfirmEmail(input);
  }
}
