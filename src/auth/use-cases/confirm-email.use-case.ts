import type { ConfirmEmailInput } from '@app/auth/dtos/confirm-email-input';
import { EmailConfirmationService } from '@app/auth/services/email-confirmation.service';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfirmEmailUseCase implements UseCaseHandler {
  public constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

  public async handle(input: ConfirmEmailInput) {
    await this.emailConfirmationService.confirmEmail(input);
  }
}
