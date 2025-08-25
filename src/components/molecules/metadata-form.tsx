"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/atoms/input"
import { Textarea } from "@/components/atoms/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Info } from "lucide-react"

interface MetadataFormProps {
    value: string
    onChange: (value: string) => void
}

interface MetadataField {
    key: string
    value: string
    type: 'text' | 'textarea' | 'url' | 'email'
}

const PREDEFINED_FIELDS: MetadataField[] = [
    { key: 'keywords', value: 'sanggar tari, ngesti laras budaya, boja, meteseh boja, Kab. Kendal, seni tari, budaya', type: 'textarea' },
    { key: 'description', value: '', type: 'textarea' },
    { key: 'author', value: '', type: 'text' },
    { key: 'og:title', value: '', type: 'text' },
    { key: 'og:description', value: '', type: 'textarea' },
    { key: 'og:image', value: '', type: 'url' },
    { key: 'twitter:title', value: '', type: 'text' },
    { key: 'twitter:description', value: '', type: 'textarea' },
    { key: 'twitter:image', value: '', type: 'url' },
]

const CONTACT_FIELDS: MetadataField[] = [
    { key: 'alamat', value: '', type: 'textarea' },
    { key: 'telepon', value: '', type: 'text' },
    { key: 'email', value: '', type: 'email' },
    { key: 'website', value: '', type: 'url' },
    { key: 'facebook', value: '', type: 'url' },
    { key: 'instagram', value: '', type: 'url' },
    { key: 'youtube', value: '', type: 'url' },
    { key: 'whatsapp', value: '', type: 'text' },
]

export function MetadataForm({ value, onChange }: MetadataFormProps) {
    const [fields, setFields] = useState<MetadataField[]>([])
    const [customFields, setCustomFields] = useState<MetadataField[]>([])
    const [activeTab, setActiveTab] = useState<'seo' | 'contact' | 'custom'>('seo')
    const [isInitialized, setIsInitialized] = useState(false)

    // Memoized predefined keys untuk mencegah re-creation
    const predefinedKeys = useMemo(() => {
        return [...PREDEFINED_FIELDS, ...CONTACT_FIELDS].map(f => f.key)
    }, [])

    // Initialize fields dari JSON value (hanya sekali)
    useEffect(() => {
        if (isInitialized) return

        try {
            const parsed = value ? JSON.parse(value) : {}

            // Initialize predefined SEO fields
            const seoFields = PREDEFINED_FIELDS.map(field => ({
                ...field,
                value: parsed[field.key] || field.value
            }))

            // Initialize contact fields
            const contactFields = CONTACT_FIELDS.map(field => ({
                ...field,
                value: parsed[field.key] || field.value
            }))

            // Find custom fields
            const customFieldEntries = Object.entries(parsed).filter(([key]) => !predefinedKeys.includes(key))
            const customFieldsData = customFieldEntries.map(([key, value]) => ({
                key,
                value: String(value),
                type: 'text' as const
            }))

            setFields([...seoFields, ...contactFields])
            setCustomFields(customFieldsData)
            setIsInitialized(true)
        } catch (error) {
            console.error('Error parsing metadata JSON:', error)
            setFields([...PREDEFINED_FIELDS, ...CONTACT_FIELDS])
            setCustomFields([])
            setIsInitialized(true)
        }
    }, [value, isInitialized, predefinedKeys])

    // Function untuk generate JSON dari fields
    const generateJSON = useCallback((currentFields: MetadataField[], currentCustomFields: MetadataField[]) => {
        const allFields = [...currentFields, ...currentCustomFields]
        const jsonObject: Record<string, string> = {}

        allFields.forEach(field => {
            if (field.key && field.value.trim()) {
                jsonObject[field.key] = field.value
            }
        })

        return Object.keys(jsonObject).length > 0 ? JSON.stringify(jsonObject, null, 2) : ''
    }, [])

    // Update field functions dengan immediate JSON update
    const updateField = useCallback((index: number, newValue: string, isCustom = false) => {
        if (isCustom) {
            setCustomFields(prev => {
                const newCustomFields = [...prev]
                newCustomFields[index] = { ...newCustomFields[index], value: newValue }

                // Update JSON immediately
                const newJSON = generateJSON(fields, newCustomFields)
                onChange(newJSON)

                return newCustomFields
            })
        } else {
            setFields(prev => {
                const newFields = [...prev]
                newFields[index] = { ...newFields[index], value: newValue }

                // Update JSON immediately
                const newJSON = generateJSON(newFields, customFields)
                onChange(newJSON)

                return newFields
            })
        }
    }, [fields, customFields, generateJSON, onChange])

    const updateCustomFieldKey = useCallback((index: number, newKey: string) => {
        setCustomFields(prev => {
            const newCustomFields = [...prev]
            newCustomFields[index] = { ...newCustomFields[index], key: newKey }

            // Update JSON immediately
            const newJSON = generateJSON(fields, newCustomFields)
            onChange(newJSON)

            return newCustomFields
        })
    }, [fields, generateJSON, onChange])

    const addCustomField = useCallback(() => {
        setCustomFields(prev => [...prev, { key: '', value: '', type: 'text' }])
    }, [])

    const removeCustomField = useCallback((index: number) => {
        setCustomFields(prev => {
            const newCustomFields = prev.filter((_, i) => i !== index)

            // Update JSON immediately
            const newJSON = generateJSON(fields, newCustomFields)
            onChange(newJSON)

            return newCustomFields
        })
    }, [fields, generateJSON, onChange])

    const renderField = (field: MetadataField, index: number, isCustom = false) => {
        const fieldId = `${isCustom ? 'custom-' : ''}${field.key}-${index}`

        return (
            <div key={fieldId} className="space-y-2">
                {isCustom && (
                    <div className="flex gap-2">
                        <Input
                            label="Key"
                            value={field.key}
                            onChange={(e) => updateCustomFieldKey(index, e.target.value)}
                            placeholder="custom_key"
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeCustomField(index)}
                            className="mt-6"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {!isCustom && (
                    <Label htmlFor={fieldId} className="text-sm font-medium">
                        {field.key}
                    </Label>
                )}

                {field.type === 'textarea' ? (
                    <Textarea
                        id={fieldId}
                        value={field.value}
                        onChange={(e) => updateField(index, e.target.value, isCustom)}
                        placeholder={`Masukkan ${field.key}`}
                        rows={3}
                    />
                ) : (
                    <Input
                        id={fieldId}
                        type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
                        value={field.value}
                        onChange={(e) => updateField(index, e.target.value, isCustom)}
                        placeholder={`Masukkan ${field.key}`}
                    />
                )}
            </div>
        )
    }

    const getSeoFields = () => fields.slice(0, PREDEFINED_FIELDS.length)
    const getContactFields = () => fields.slice(PREDEFINED_FIELDS.length)

    // Tampilkan loading state sampai initialized
    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-sm text-muted-foreground">Loading metadata form...</div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                <Button
                    type="button"
                    variant={activeTab === 'seo' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('seo')}
                    className="flex-1"
                >
                    SEO Meta
                </Button>
                <Button
                    type="button"
                    variant={activeTab === 'contact' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('contact')}
                    className="flex-1"
                >
                    Kontak & Sosmed
                </Button>
                <Button
                    type="button"
                    variant={activeTab === 'custom' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('custom')}
                    className="flex-1"
                >
                    Custom Fields
                </Button>
            </div>

            {/* SEO Meta Tab */}
            {activeTab === 'seo' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            SEO Metadata
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Informasi untuk optimasi mesin pencari dan social media sharing.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {getSeoFields().map((field, index) => renderField(field, index))}
                    </CardContent>
                </Card>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Kontak & Social Media</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Data kontak dan link social media untuk ditampilkan di halaman.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {getContactFields().map((field, index) => renderField(field, index + PREDEFINED_FIELDS.length))}
                    </CardContent>
                </Card>
            )}

            {/* Custom Fields Tab */}
            {activeTab === 'custom' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Custom Fields</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Tambahkan field custom sesuai kebutuhan spesifik halaman.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {customFields.map((field, index) => renderField(field, index, true))}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={addCustomField}
                            className="w-full"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Field Custom
                        </Button>

                        {customFields.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>Belum ada custom fields.</p>
                                <p className="text-sm">Klik tombol di atas untuk menambah field baru.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* JSON Preview */}
            <Card>
                <CardHeader>
                    <CardTitle>JSON Preview</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Preview data dalam format JSON yang akan disimpan.
                    </p>
                </CardHeader>
                <CardContent>
                    <pre className="bg-muted p-3 rounded text-sm overflow-auto max-h-32">
                        {value || '{}'}
                    </pre>
                </CardContent>
            </Card>
        </div>
    )
}