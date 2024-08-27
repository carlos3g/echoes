import { calcSkip, getMeta, paginate } from '@app/lib/prisma/helpers/pagination';
import type { ModelDelegates } from '@app/lib/prisma/types';
import type { ValueOf } from 'type-fest';

const makeModelMock = () => ({
  count: jest.fn(),
  findMany: jest.fn(),
});

describe('calcSkip', () => {
  it('should return 0 when page is 1', () => {
    expect(calcSkip(1, 10)).toBe(0);
  });

  it('should return correct skip value when page is greater than 1', () => {
    expect(calcSkip(2, 10)).toBe(10);
    expect(calcSkip(3, 20)).toBe(40);
  });

  it('should return 0 when page is 0 or negative', () => {
    expect(calcSkip(0, 10)).toBe(0);
    expect(calcSkip(-1, 10)).toBe(0);
  });
});

describe('getMeta', () => {
  it('should return correct metadata for the first page', () => {
    const meta = getMeta(100, 1, 10);

    expect(meta).toEqual({
      total: 100,
      lastPage: 10,
      currentPage: 1,
      perPage: 10,
      prev: null,
      next: 2,
    });
  });

  it('should return correct metadata for an intermediate page', () => {
    const meta = getMeta(100, 5, 10);

    expect(meta).toEqual({
      total: 100,
      lastPage: 10,
      currentPage: 5,
      perPage: 10,
      prev: 4,
      next: 6,
    });
  });

  it('should return correct metadata for the last page', () => {
    const meta = getMeta(100, 10, 10);

    expect(meta).toEqual({
      total: 100,
      lastPage: 10,
      currentPage: 10,
      perPage: 10,
      prev: 9,
      next: null,
    });
  });

  it('should return correct metadata for a single page', () => {
    const meta = getMeta(5, 1, 10);

    expect(meta).toEqual({
      total: 5,
      lastPage: 1,
      currentPage: 1,
      perPage: 10,
      prev: null,
      next: null,
    });
  });

  it('should handle page greater than lastPage', () => {
    const meta = getMeta(50, 6, 10);

    expect(meta).toEqual({
      total: 50,
      lastPage: 5,
      currentPage: 6,
      perPage: 10,
      prev: 5,
      next: null,
    });
  });
});

describe('paginate', () => {
  let model: {
    count: jest.Mock;
    findMany: jest.Mock;
  };

  beforeEach(() => {
    model = makeModelMock();
  });

  it('should calculate skip correctly', () => {
    expect(calcSkip(1, 20)).toBe(0);
    expect(calcSkip(2, 20)).toBe(20);
    expect(calcSkip(3, 20)).toBe(40);
  });

  it('should calculate metadata correctly', () => {
    const meta = getMeta(100, 2, 20);
    expect(meta).toEqual({
      total: 100,
      lastPage: 5,
      currentPage: 2,
      perPage: 20,
      prev: 1,
      next: 3,
    });
  });

  it('should paginate results correctly', async () => {
    model.count.mockResolvedValue(100);
    model.findMany.mockResolvedValue(['item1', 'item2']);

    const result = await paginate(model as unknown as ValueOf<ModelDelegates>, {}, { page: 2, perPage: 20 });

    expect(model.count).toHaveBeenCalledWith({ where: undefined });
    expect(model.findMany).toHaveBeenCalledWith({
      take: 20,
      skip: 20,
    });
    expect(result).toEqual({
      data: ['item1', 'item2'],
      meta: {
        total: 100,
        lastPage: 5,
        currentPage: 2,
        perPage: 20,
        prev: 1,
        next: 3,
      },
    });
  });

  it('should handle default values for page and perPage', async () => {
    model.count.mockResolvedValue(50);
    model.findMany.mockResolvedValue(['item1', 'item2', 'item3', 'item4']);

    const result = await paginate(model as unknown as ValueOf<ModelDelegates>, {}, {});

    expect(result.meta.currentPage).toBe(1);
    expect(result.meta.perPage).toBe(20);
  });

  it('should handle pagination when there is only one page', async () => {
    model.count.mockResolvedValue(10);
    model.findMany.mockResolvedValue(['item1', 'item2']);

    const result = await paginate(model as unknown as ValueOf<ModelDelegates>, {}, { page: 1, perPage: 10 });

    expect(result.meta).toEqual({
      total: 10,
      lastPage: 1,
      currentPage: 1,
      perPage: 10,
      prev: null,
      next: null,
    });
  });

  it('should return empty data if no items found', async () => {
    model.count.mockResolvedValue(0);
    model.findMany.mockResolvedValue([]);

    const result = await paginate(model as unknown as ValueOf<ModelDelegates>, {}, { page: 1, perPage: 10 });

    expect(result.data).toEqual([]);
    expect(result.meta.total).toBe(0);
  });
});
