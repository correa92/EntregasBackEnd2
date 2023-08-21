import z from "zod";

const userCreateValidation = z.object({
  firstName: z.string().min(2).max(35),
  lastName: z.string().min(2).max(35),
  email: z.string().email(),
  age: z.number().min(18).max(100),
  password: z.string(),
});

export default userCreateValidation;
