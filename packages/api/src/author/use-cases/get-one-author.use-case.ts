import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import type { GetOneAuthorInput } from '@app/author/dtos/get-one-author-input';
import type { Author } from '@app/author/entities/author.entity';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetOneAuthorUseCase implements UseCaseHandler {
  public constructor(private readonly authorRepository: AuthorRepositoryContract) {}

  public async handle(input: GetOneAuthorInput): Promise<Author> {
    const { uuid } = input;

    const result = await this.authorRepository.findUniqueOrThrow({
      where: { uuid },
    });

    return result;
  }
}
