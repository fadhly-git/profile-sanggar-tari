// @/components/molecules/setting-form-dialog.tsx
"use client"

import { useEffect, useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Setting, SettingType } from "@prisma/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/atoms/input"
import { Textarea } from "@/components/atoms/textarea"
// Import komponen yang sudah ada
// import { ImageUpload } from "@/components/atoms/image-upload"
import { ImageSelector } from "@/components/molecules/image-selector"
import { toast } from "sonner"
import { createSetting, updateSetting } from "@/lib/actions/setting-actions"
import {
  createSettingSchema,
  updateSettingSchema,
  type CreateSettingInput,
  type UpdateSettingInput,
} from "@/lib/validations/setting-validation"

interface SettingFormDialogProps {
  setting?: Setting | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const typeOptions = [
  { value: "TEXT", label: "Teks" },
  { value: "TEXTAREA", label: "Area Teks" },
  { value: "IMAGE", label: "Gambar" },
  { value: "BOOLEAN", label: "Boolean" },
  { value: "JSON", label: "JSON" },
]

// JSON Editor component menggunakan textarea dengan basic validation
function JsonEditor({ value, onChange, error }: {
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  const [localValue, setLocalValue] = useState(value)
  
  const handleChange = (newValue: string, event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(newValue)
    
    // Auto-close brackets and braces
    const cursorPos = event.target.selectionStart
    let processedValue = newValue
    
    if (newValue.charAt(cursorPos - 1) === '{') {
      processedValue = newValue.slice(0, cursorPos) + '}' + newValue.slice(cursorPos)
    } else if (newValue.charAt(cursorPos - 1) === '[') {
      processedValue = newValue.slice(0, cursorPos) + ']' + newValue.slice(cursorPos)
    }
    
    onChange(processedValue)
  }
  
  return (
    <Textarea
      value={localValue}
      onChange={(e) => handleChange(e.target.value, e)}
      className="font-mono text-sm"
      rows={6}
      placeholder='{"key": "value"}'
      error={error}
    />
  )
}

export function SettingFormDialog({ 
  setting, 
  open, 
  onOpenChange, 
  onSuccess 
}: SettingFormDialogProps) {
  const [isPending, startTransition] = useTransition()
  const isEdit = !!setting

  const form = useForm<CreateSettingInput | UpdateSettingInput>({
    resolver: zodResolver(isEdit ? updateSettingSchema : createSettingSchema),
    defaultValues: {
      key: "",
      value: "",
      type: "TEXT" as SettingType,
      ...(isEdit && setting && { id: setting.id }),
    },
  })

  const selectedType = form.watch("type")

  useEffect(() => {
    if (setting && isEdit) {
      form.reset({
        id: setting.id,
        key: setting.key,
        value: setting.value,
        type: setting.type,
      })
    } else {
      form.reset({
        key: "",
        value: "",
        type: "TEXT" as SettingType,
      })
    }
  }, [setting, isEdit, form])

  const onSubmit = async (data: CreateSettingInput | UpdateSettingInput) => {
    startTransition(async () => {
      try {
        // Validate JSON if type is JSON
        if (data.type === "JSON") {
          try {
            JSON.parse(data.value)
          } catch {
            toast.error("Format JSON tidak valid")
            return
          }
        }

        const result = isEdit 
          ? await updateSetting(data as UpdateSettingInput)
          : await createSetting(data as CreateSettingInput)

        if (result.success) {
          toast.success(isEdit ? "Pengaturan berhasil diperbarui" : "Pengaturan berhasil dibuat")
          onOpenChange(false)
          onSuccess?.()
        } else {
          toast.error(result.error || "Terjadi kesalahan")
        }
      } catch {
        toast.error("Terjadi kesalahan tidak terduga")
      }
    })
  }

  const renderValueField = () => {
    switch (selectedType) {
      case "TEXTAREA":
        return (
          <FormField
            control={form.control}
            name="value"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Masukkan value..."
                    error={fieldState.error?.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "BOOLEAN":
        return (
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Value</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Aktif atau tidak aktif
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === "true"}
                    onCheckedChange={(checked) => 
                      field.onChange(checked ? "true" : "false")
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )

      case "IMAGE":
        return (
          <FormField
            control={form.control}
            name="value"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Value (URL Gambar)</FormLabel>
                <FormControl>
                  <ImageSelector 
                    label="Pilih Gambar"
                    value={field.value}
                    onChange={field.onChange}
                    helperText="Unggah atau pilih URL gambar"
                    required={true}
                    error={fieldState.error?.message}
                  />
                  
                  {/* Temporary fallback
                  <Input
                    {...field}
                    placeholder="https://example.com/image.jpg"
                    error={fieldState.error?.message}
                  /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "JSON":
        return (
          <FormField
            control={form.control}
            name="value"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Value (JSON)</FormLabel>
                <FormControl>
                  <JsonEditor
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )

      default:
        return (
          <FormField
            control={form.control}
            name="value"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Masukkan value..."
                    error={fieldState.error?.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Pengaturan" : "Tambah Pengaturan"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="key"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Key</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="site_name"
                      error={fieldState.error?.message}
                      helperText="Gunakan format: huruf, angka, dan underscore saja"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {typeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderValueField()}

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="flex-1"
              >
                {isPending ? "Menyimpan..." : (isEdit ? "Perbarui" : "Simpan")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}