import z from "zod";

const signup = z.object({
    firstName: z.string().min(2).max(35),
    lastName: z.string().min(2).max(35),
    email: z.string().email(),
    age: z.number().min(18).max(100),
    password: z.string().min(6).max(24),
    rol: z.string()
})

export default signup;
