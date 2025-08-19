import { z } from 'zod'

export const createUserSchema = z.object({
    email: z.string().email('Email tidak valid').min(1, 'Email wajib diisi'),
    name: z.string().min(1, 'Nama wajib diisi').min(2, 'Nama minimal 2 karakter'),
    role: z.enum(['ADMIN', 'SUPER_ADMIN'], {
        error: 'Role wajib dipilih',
    }),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string().min(8, 'Konfirmasi password wajib diisi'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Password dan konfirmasi password tidak cocok',
})

export const updateUserSchema = z.object({
    email: z.string().email('Email tidak valid').min(1, 'Email wajib diisi'),
    name: z.string().min(1, 'Nama wajib diisi').min(2, 'Nama minimal 2 karakter'),
    role: z.enum(['ADMIN', 'SUPER_ADMIN'], {
        error: 'Role wajib dipilih',
    }),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
}).refine((data) => !data.password || data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Password tidak sama"
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>