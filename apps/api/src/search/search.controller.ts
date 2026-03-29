import { Controller, Get, Query, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchUseCase } from '@app/search/use-cases/search.use-case';
import { SearchQueryDto } from '@app/search/dtos/search-query.dto';
import { UserDecorator } from '@app/auth/decorators/user.decorator';
import type { User } from '@app/user/entities/user.entity';
import { Public } from '@app/auth/decorators/public.decorator';

@ApiTags('search')
@Controller('search')
export class SearchController {
  public constructor(private readonly searchUseCase: SearchUseCase) {}

  @Get()
  @Version('1')
  @Public()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Full-text search across quotes, authors, and categories' })
  public async search(@Query() query: SearchQueryDto, @UserDecorator() user: User) {
    return this.searchUseCase.execute(query, user);
  }
}
