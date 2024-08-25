import { paginate, type PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { prismaQuoteToQuoteAdapter } from '@app/quote/adapters';
import type { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import type {
  QuoteRepositoryCreateInput,
  QuoteRepositoryDeleteInput,
  QuoteRepositoryFindManyInput,
  QuoteRepositoryFindManyPaginatedInput,
  QuoteRepositoryFindUniqueOrThrowInput,
  QuoteRepositoryUpdateInput,
} from '@app/quote/dtos/quote-repository-dtos';
import type { Quote } from '@app/quote/entities/quote.entity';
import { Injectable } from '@nestjs/common';
import type { Quote as PrismaQuote } from '@prisma/client';

type FindManyReturn = PrismaQuote;

@Injectable()
export class PrismaQuoteRepository implements QuoteRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async findUniqueOrThrow(input: QuoteRepositoryFindUniqueOrThrowInput) {
    const entity = await this.prismaManager.getClient().quote.findUniqueOrThrow({
      where: input.where,
    });

    return prismaQuoteToQuoteAdapter(entity);
  }

  public async findManyPaginated(input: QuoteRepositoryFindManyPaginatedInput): Promise<PaginatedResult<Quote>> {
    const { ...where } = input.where || {};
    const { perPage = 20, page = 1 } = input.options || {};

    const result = await paginate<FindManyReturn, 'Quote'>(
      this.prismaManager.getClient().quote,
      {
        where: {
          ...where,
        },
        orderBy: [{ createdAt: 'desc' }],
      },
      { page, perPage }
    );

    return {
      ...result,
      data: result.data.map(prismaQuoteToQuoteAdapter),
    };
  }

  public async findMany(input?: QuoteRepositoryFindManyInput): Promise<Quote[]> {
    const { ...where } = input?.where || {};

    const entities = await this.prismaManager.getClient().quote.findMany({
      where: {
        ...where,
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return entities.map(prismaQuoteToQuoteAdapter);
  }

  public async create(input: QuoteRepositoryCreateInput) {
    const entity = await this.prismaManager.getClient().quote.create({
      data: input,
    });

    return prismaQuoteToQuoteAdapter(entity);
  }

  public async update(input: QuoteRepositoryUpdateInput) {
    const entity = await this.prismaManager.getClient().quote.update({
      where: input.where,
      data: input.data,
    });

    return prismaQuoteToQuoteAdapter(entity);
  }

  public async delete(input: QuoteRepositoryDeleteInput): Promise<void> {
    const { where } = input;

    await this.prismaManager.getClient().quote.delete({ where });
  }
}
