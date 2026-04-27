import { Paginate } from '@app/shared/dtos/paginate';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchUsersQuery extends Paginate {
  @IsString()
  @IsNotEmpty()
  public q!: string;
}
