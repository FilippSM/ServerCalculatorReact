import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

export const updateUserSchema = z
  .object({
    email: z.string().email().optional(),
    name: z.string().min(2).optional(),
  })
  .refine((data) => data.email !== undefined || data.name !== undefined, {
    message: "At least one field must be provided",
  });

export const userIdSchema = z.object({
  id: z.string().min(1),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParams = z.infer<typeof userIdSchema>;
