import * as z from 'zod';

export const createTagFormSchema = z.object({
  title: z.string(),
});
