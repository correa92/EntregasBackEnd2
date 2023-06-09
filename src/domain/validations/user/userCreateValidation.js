import z from 'zod';

const userCreateValidation = z.object({
  firstName: z.string().min(2).max(35),
  lastName: z.string().min(2).max(35),
  email: z.string().email(),
  age: z.number(),
  password: z.string(),
  isAdmin: z.boolean()
});

export default userCreateValidation;