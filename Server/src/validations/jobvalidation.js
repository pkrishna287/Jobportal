import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(2),
  department: z.string().min(2),
  location: z.string().min(2),
  salary: z.string().min(2),
  status: z.enum(['ACTIVE', 'CLOSED']).optional(),
  questions: z.array(z.string().min(1)),
});

export const updateJobSchema = createJobSchema;

export const toggleStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'CLOSED']),
});
