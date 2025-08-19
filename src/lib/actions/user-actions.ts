'use server'

import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createUserSchema, updateUserSchema, type CreateUserInput, type UpdateUserInput } from '@/lib/validations/user-validation'
import { auth } from '@/lib/auth-options' // Asumsikan ada auth helper

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return { success: true, data: users }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { success: false, error: 'Gagal mengambil data pengguna' }
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    
    if (!user) {
      return { success: false, error: 'Pengguna tidak ditemukan' }
    }
    
    return { success: true, data: user }
  } catch (error) {
    console.error('Error fetching user:', error)
    return { success: false, error: 'Gagal mengambil data pengguna' }
  }
}

export async function createUser(data: CreateUserInput) {
  try {
    const currentUser = await auth()
    if (!currentUser || currentUser.user.role !== 'SUPER_ADMIN') {
        console.log('Unauthorized attempt to create user:', currentUser?.user.role)
      return { success: false, error: 'Tidak memiliki akses untuk membuat pengguna' }
    }

    const validated = createUserSchema.parse(data)
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    })
    
    if (existingUser) {
      return { success: false, error: 'Email sudah terdaftar' }
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 12)

    // Exclude confirmPassword from the data sent to Prisma
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userCreateData } = validated
    
    const user = await prisma.user.create({
      data: {
        ...userCreateData,
        password: hashedPassword,
      },
    })
    
    revalidatePath('/admin/users')
    return { success: true, data: user }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'Gagal membuat pengguna' }
  }
}

export async function updateUser(id: string, data: UpdateUserInput) {
  try {
    const currentUser = await auth()
    if (!currentUser) {
      return { success: false, error: 'Tidak terautentikasi' }
    }

    // Check permissions
    if (currentUser.user.role !== 'SUPER_ADMIN' && currentUser.user.id !== id) {
      return { success: false, error: 'Tidak memiliki akses untuk mengubah pengguna ini' }
    }

    const validated = updateUserSchema.parse(data)
    
    // Check if email already exists (excluding current user)
    const existingUser = await prisma.user.findFirst({
      where: { 
        email: validated.email,
        NOT: { id },
      },
    })
    
    if (existingUser) {
      return { success: false, error: 'Email sudah terdaftar' }
    }
    
    // Exclude confirmPassword and prepare update data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, password, ...baseUpdateData } = validated
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      ...baseUpdateData,
    }
    
    // Only update password if provided
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 12)
    }
    
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    })
    
    revalidatePath('/admin/users')
    return { success: true, data: user }
  } catch (error) {
    console.error('Error updating user:', error)
    return { success: false, error: 'Gagal memperbarui pengguna' }
  }
}

export async function deleteUser(id: string) {
  try {
    const currentUser = await auth()
    if (!currentUser || currentUser.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Tidak memiliki akses untuk menghapus pengguna' }
    }

    // Prevent self deletion
    if (currentUser.user.id === id) {
      return { success: false, error: 'Tidak dapat menghapus akun sendiri' }
    }
    
    await prisma.user.delete({
      where: { id },
    })
    
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: 'Gagal menghapus users' }
  }
}