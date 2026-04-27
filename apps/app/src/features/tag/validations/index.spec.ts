import { createTagFormSchema } from './index';

describe('createTagFormSchema', () => {
  it('should accept valid tag title', () => {
    const result = createTagFormSchema().safeParse({ title: 'My Tag' });
    expect(result.success).toBe(true);
  });

  it('should accept single character title', () => {
    const result = createTagFormSchema().safeParse({ title: 'A' });
    expect(result.success).toBe(true);
  });

  it('should accept titles up to 50 characters', () => {
    const result = createTagFormSchema().safeParse({ title: 'A'.repeat(50) });
    expect(result.success).toBe(true);
  });

  it('should reject titles longer than 50 characters', () => {
    const result = createTagFormSchema().safeParse({ title: 'A'.repeat(51) });
    expect(result.success).toBe(false);
  });

  it('should accept titles with special characters', () => {
    const validTitles = ['Tag #1', 'My-Tag', 'Tag_Name', 'Tag with spaces', 'Citação Favorita'];

    validTitles.forEach((title) => {
      const result = createTagFormSchema().safeParse({ title });
      expect(result.success).toBe(true);
    });
  });

  it('should reject empty string', () => {
    const result = createTagFormSchema().safeParse({ title: '' });
    expect(result.success).toBe(false);
  });

  it('should reject non-string title', () => {
    expect(createTagFormSchema().safeParse({ title: 123 }).success).toBe(false);
    expect(createTagFormSchema().safeParse({ title: null }).success).toBe(false);
    expect(createTagFormSchema().safeParse({ title: undefined }).success).toBe(false);
  });

  it('should reject missing title field', () => {
    const result = createTagFormSchema().safeParse({});
    expect(result.success).toBe(false);
  });
});
