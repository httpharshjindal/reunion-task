import {z} from "zod"

export const signupBody = z.object({
    username:z.string(),
    email:z.string().email(),
    password: z.string().min(8)
})

export const signinBody = z.object({
    email:z.string(),
    password:z.string()
})

export const createTaskBody = z.object({
    title:z.string(),
    description:z.string().optional(),
    status:z.string().optional(),
    startDate:z.coerce.date(),
    endDate:z.coerce.date(),
    priority:z.number().min(1).max(5)
})

export const  authHeader = z.string()
// export type signinBody = z.infer<typeof signinBody>
// export type signupBody = z.infer<typeof signupBody>
// export type updateTaskBody = z.infer<typeof updateTaskBody>
// export type createTaskBody = z.infer<typeof createTaskBody>
