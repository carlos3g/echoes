import type { UseCaseHandler } from '@app/shared/interfaces';
import type { CreateTagInput } from '@app/tag/dtos/create-tag-input';
import type { Tag } from '@app/tag/entities/tag.entity';
import { TagService } from '@app/tag/services/tag.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateTagUseCase implements UseCaseHandler {
  public constructor(private readonly tagService: TagService) {}

  public async handle(input: CreateTagInput): Promise<Tag> {
    const { user, ...rest } = input;

    const result = await this.tagService.create({
      ...rest,
      userId: user.id,
    });

    return result;
  }
}
