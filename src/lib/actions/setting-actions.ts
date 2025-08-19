// @/lib/actions/setting-actions.ts
"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import {
    createSettingSchema,
    updateSettingSchema,
    type CreateSettingInput,
    type UpdateSettingInput,
} from "@/lib/validations/setting-validation"

export async function getAllSettings() {
    try {
        const settings = await prisma.setting.findMany({
            orderBy: {
                key: "asc",
            },
        })
        return { success: true, data: settings }
    } catch (error) {
        console.error("Error fetching settings:", error)
        return { success: false, error: "Gagal mengambil data pengaturan" }
    }
}

export async function getSettingById(id: string) {
    try {
        const setting = await prisma.setting.findUnique({
            where: { id },
        })

        if (!setting) {
            return { success: false, error: "Pengaturan tidak ditemukan" }
        }

        return { success: true, data: setting }
    } catch (error) {
        console.error("Error fetching setting:", error)
        return { success: false, error: "Gagal mengambil data pengaturan" }
    }
}

export async function createSetting(input: CreateSettingInput) {
    try {
        const validatedInput = createSettingSchema.parse(input)

        // Check if key already exists
        const existingSetting = await prisma.setting.findUnique({
            where: { key: validatedInput.key },
        })

        if (existingSetting) {
            return { success: false, error: "Key pengaturan sudah ada" }
        }

        const setting = await prisma.setting.create({
            data: validatedInput,
        })

        revalidatePath("/admin/settings")
        return { success: true, data: setting }
    } catch (error) {
        console.error("Error creating setting:", error)
        return { success: false, error: "Gagal membuat pengaturan" }
    }
}

export async function updateSetting(input: UpdateSettingInput) {
    try {
        const validatedInput = updateSettingSchema.parse(input)

        // Check if setting exists
        const existingSetting = await prisma.setting.findUnique({
            where: { id: validatedInput.id },
        })

        if (!existingSetting) {
            return { success: false, error: "Pengaturan tidak ditemukan" }
        }

        // Check if key already exists (excluding current setting)
        if (validatedInput.key !== existingSetting.key) {
            const keyExists = await prisma.setting.findUnique({
                where: { key: validatedInput.key },
            })

            if (keyExists) {
                return { success: false, error: "Key pengaturan sudah ada" }
            }
        }

        const setting = await prisma.setting.update({
            where: { id: validatedInput.id },
            data: {
                key: validatedInput.key,
                value: validatedInput.value,
                type: validatedInput.type,
            },
        })

        revalidatePath("/admin/settings")
        return { success: true, data: setting }
    } catch (error) {
        console.error("Error updating setting:", error)
        return { success: false, error: "Gagal memperbarui pengaturan" }
    }
}

export async function deleteSetting(id: string) {
    try {
        const setting = await prisma.setting.findUnique({
            where: { id },
        })

        if (!setting) {
            return { success: false, error: "Pengaturan tidak ditemukan" }
        }

        await prisma.setting.delete({
            where: { id },
        })

        revalidatePath("/admin/settings")
        return { success: true }
    } catch (error) {
        console.error("Error deleting setting:", error)
        return { success: false, error: "Gagal menghapus pengaturan" }
    }
}

// Initialize predefined settings
export async function initializePredefinedSettings() {
    try {
        const predefinedSettings = [
            { key: "site_name", value: "Website Saya", type: "TEXT" as const },
            { key: "site_description", value: "Deskripsi website", type: "TEXTAREA" as const },
            { key: "site_logo", value: "", type: "IMAGE" as const },
            { key: "site_favicon", value: "", type: "IMAGE" as const },
            { key: "site_maintenance", value: "false", type: "BOOLEAN" as const },
            { key: "site_analytics", value: "{}", type: "JSON" as const },
        ]

        for (const setting of predefinedSettings) {
            const exists = await prisma.setting.findUnique({
                where: { key: setting.key },
            })

            if (!exists) {
                await prisma.setting.create({
                    data: setting,
                })
            }
        }

        return { success: true }
    } catch (error) {
        console.error("Error initializing settings:", error)
        return { success: false, error: "Gagal inisialisasi pengaturan" }
    }
}