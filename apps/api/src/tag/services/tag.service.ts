import { createUuidV4 } from '@app/shared/utils';
import { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import type { TagServiceCreate } from '@app/tag/dtos/tag-service-dtos';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
  public constructor(private readonly tagRepository: TagRepositoryContract) {}

  public async create(input: TagServiceCreate) {
    return this.tagRepository.create({ ...input, uuid: createUuidV4() });
  }
}
