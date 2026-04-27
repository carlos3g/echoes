import { paginate, type PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { prismaQuoteToQuoteAdapter } from '@app/quote/adapters';
import type { FolderQuoteRepositoryContract } from '@app/folder/contracts/folder-quote-repository.contract';
import type {
  FolderQuoteRepositoryCreateInput,
  FolderQuoteRepositoryDeleteInput,
  FolderQuoteRepositoryFindInput,
  FolderQuoteRepositoryFindManyPaginatedInput,
  FolderQuoteRepositoryUpdatePositionsInput,
} from '@app/folder/dtos/folder-quote-repository-dtos';
import type { Quote } from '@app/quote/entities/quote.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaFolderQuoteRepository implements FolderQuoteRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async create(input: FolderQuoteRepositoryCreateInput): Promise<void> {
    await this.prismaManager.getClient().folderQuote.create({
      data: input,
    });
  }

  public async delete(input: FolderQuoteRepositoryDeleteInput): Promise<void> {
    await this.prismaManager.getClient().folderQuote.deleteMany({
      where: input.where,
    });
  }

  public async exists(input: FolderQuoteRepositoryFindInput): Promise<boolean> {
    const count = await this.prismaManager.getClient().folderQuote.count({
      where: input.where,
    });

    return count > 0;
  }

  public async findManyPaginated(input: FolderQuoteRepositoryFindManyPaginatedInput): Promise<PaginatedResult<Quote>> {
    const { perPage = 20, page = 1 } = input.options || {};

    const result = await paginate<{ quote: Parameters<typeof prismaQuoteToQuoteAdapter>[0] }, 'FolderQuote'>(
      this.prismaManager.getClient().folderQuote,
      {
        where: { folderId: input.where.folderId },
        include: { quote: true },
        orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
      },
      { page, perPage }
    );

    return {
      ...result,
      data: result.data.map((fq) => prismaQuoteToQuoteAdapter(fq.quote)),
    };
  }

  public async updatePositions(input: FolderQuoteRepositoryUpdatePositionsInput): Promise<void> {
    const client = this.prismaManager.getClient();

    await client.$transaction(
      input.orderedQuoteIds.map((quoteId, index) =>
        client.folderQuote.updateMany({
          where: { folderId: input.folderId, quoteId },
          data: { position: index },
        })
      )
    );
  }

  public async getMaxPosition(folderId: number): Promise<number> {
    const result = await this.prismaManager.getClient().folderQuote.aggregate({
      where: { folderId },
      _max: { position: true },
    });

    return result._max.position ?? -1;
  }
}
