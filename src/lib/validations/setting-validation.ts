// @/lib/validations/setting-validation.ts
import { z } from "zod"

export const createSettingSchema = z.object({
  key: z
    .string()
    .min(1, "Key harus diisi")
    .regex(/^[a-zA-Z0-9_]+$/, "Key hanya boleh mengandung huruf, angka, dan underscore"),
  value: z.string().min(1, "Value harus diisi"),
  type: z.enum(["TEXT", "TEXTAREA", "IMAGE", "BOOLEAN", "JSON"]),
})

export const updateSettingSchema = z.object({
  id: z.string().min(1, "ID harus diisi"),
  key: z
    .string()
    .min(1, "Key harus diisi")
    .regex(/^[a-zA-Z0-9_]+$/, "Key hanya boleh mengandung huruf, angka, dan underscore"),
  value: z.string(),
  type: z.enum(["TEXT", "TEXTAREA", "IMAGE", "BOOLEAN", "JSON"]),
})

export type CreateSettingInput = z.infer<typeof createSettingSchema>
export type UpdateSettingInput = z.infer<typeof updateSettingSchema>