import z from "zod";

const loginValidation = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});

export default loginValidation;
