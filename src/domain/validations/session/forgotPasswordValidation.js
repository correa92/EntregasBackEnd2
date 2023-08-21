import z from "zod";

const forgotPasswordValidation = z.object({
  email: z.string().email(),
});

export default forgotPasswordValidation;
