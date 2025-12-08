import { z } from 'zod';

// Schema para criar um exemplo
export const CreateExampleSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
});

export type CreateExampleInput = z.infer<typeof CreateExampleSchema>;

// Schema para atualizar um exemplo
export const UpdateExampleSchema = z.object({
  id: z.number().int().positive('ID inválido'),
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
});

export type UpdateExampleInput = z.infer<typeof UpdateExampleSchema>;
