import { z } from 'zod';

export const createApplicationSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      answer: z.string().min(1),
    })
  ),
});


export const updateApplicationStatusSchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]),
});