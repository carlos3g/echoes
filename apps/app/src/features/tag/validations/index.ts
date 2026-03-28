import * as z from 'zod';

export const createTagFormSchema = z.object({
  title: z.string().min(1, { message: 'Campo obrigatório' }).max(50, { message: 'Máximo de 50 caracteres' }),
});
