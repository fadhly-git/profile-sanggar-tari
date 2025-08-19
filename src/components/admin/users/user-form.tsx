'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/atoms/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createUserSchema, updateUserSchema, type CreateUserInput, type UpdateUserInput } from '@/lib/validations/user-validation'
import { createUser, updateUser } from '@/lib/actions/user-actions'
import { toast } from 'sonner'
import { User } from '@prisma/client'
import { Role } from '@prisma/client'

interface UserFormProps {
    user?: Pick<User, 'id' | 'email' | 'name' | 'role'>
    onSuccess?: () => void
    onCancel?: () => void
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
    const [loading, setLoading] = useState(false)
    const isEdit = !!user

    const schema = isEdit ? updateUserSchema : createUserSchema
    type FormData = CreateUserInput | UpdateUserInput

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: isEdit
            ? {
                email: user.email,
                name: user.name,
                role: user.role as Role,
                password: '',
                confirmPassword: '',
            }
            : {
                email: '',
                name: '',
                role: 'ADMIN',
                password: '',
                confirmPassword: '',
            },
    })

    const watchedRole = watch('role')

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true)

            const result = isEdit
                ? await updateUser(user!.id, data as UpdateUserInput)
                : await createUser(data as CreateUserInput)

            if (result.success) {
                toast.success(isEdit ? 'Pengguna berhasil diperbarui' : 'Pengguna berhasil dibuat')
                onSuccess?.()
            } else {
                toast.error(result.error)
            }
        } catch {
            toast.error('Terjadi kesalahan')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Email"
                type="email"
                placeholder="Masukkan email"
                error={errors.email?.message}
                {...register('email')}
            />

            <Input
                label="Nama"
                placeholder="Masukkan nama"
                error={errors.name?.message}
                {...register('name')}
            />

            <Input
                label={isEdit ? 'Password Baru (opsional)' : 'Password'}
                type="password"
                placeholder={isEdit ? 'Kosongkan jika tidak ingin mengubah' : 'Masukkan password'}
                error={errors.password?.message}
                helperText={isEdit ? 'Kosongkan jika tidak ingin mengubah password' : 'Minimal 8 karakter'}
                {...register('password')}
            />
            
            <Input
                label={isEdit ? 'Konfirmasi Password Baru (opsional)' : 'Konfirmasi Password'}
                type="password"
                placeholder={isEdit ? 'Kosongkan jika tidak ingin mengubah' : 'Ulangi password'}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
            />

            <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select
                    value={watchedRole}
                    onValueChange={(value) => setValue('role', value as 'ADMIN' | 'SUPER_ADMIN')}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    </SelectContent>
                </Select>
                {errors.role && (
                    <p className="text-sm text-red-500">{errors.role.message}</p>
                )}
            </div>

            <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Buat'}
                </Button>
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Batal
                    </Button>
                )}
            </div>
        </form>
    )
}