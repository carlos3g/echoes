import { calcSkip, getMeta } from '@app/lib/prisma/helpers/pagination';

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
