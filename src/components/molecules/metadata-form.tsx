/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/atoms/input"
import { Textarea } from "@/components/atoms/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Info } from "lucide-react"

interface MetadataFormProps {
    value: string
    onChange: (value: string) => void
}

interface MetadataField {
    key: string
    value: string
    type: 'text' | 'textarea' | 'url' | 'email'
    parentKey?: string // untuk nested fields
    id?: string // tambah unique id untuk stable key
}

interface CustomFieldGroup {
    groupName: string
    fields: MetadataField[]
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
    { key: 'whatsapp', value: '', type: 'text' },
]

const PREDEFINED_GROUPS = [
    'socialMedia',
    'contact',
    'seo',
    'business',
    'location',
    'events',
    'gallery'
]

// Helper function untuk generate unique ID
const generateId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export function MetadataForm({ value, onChange }: MetadataFormProps) {
    const [fields, setFields] = useState<MetadataField[]>([])
    const [customFieldGroups, setCustomFieldGroups] = useState<CustomFieldGroup[]>([])
    const [flatCustomFields, setFlatCustomFields] = useState<MetadataField[]>([])
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
                value: parsed[field.key] || field.value,
                id: generateId()
            }))

            // Initialize contact fields
            const contactFields = CONTACT_FIELDS.map(field => ({
                ...field,
                value: parsed[field.key] || field.value,
                id: generateId()
            }))

            // Process nested objects and flat fields
            const groups: CustomFieldGroup[] = []
            const flatFields: MetadataField[] = []

            Object.entries(parsed).forEach(([key, value]) => {
                if (predefinedKeys.includes(key)) return

                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    // This is a nested object
                    const groupFields: MetadataField[] = Object.entries(value as Record<string, any>).map(([subKey, subValue]) => ({
                        key: subKey,
                        value: String(subValue),
                        type: 'text' as const,
                        parentKey: key,
                        id: generateId()
                    }))

                    groups.push({
                        groupName: key,
                        fields: groupFields
                    })
                } else {
                    // This is a flat field
                    flatFields.push({
                        key,
                        value: String(value),
                        type: 'text' as const,
                        id: generateId()
                    })
                }
            })

            setFields([...seoFields, ...contactFields])
            setCustomFieldGroups(groups)
            setFlatCustomFields(flatFields)
            setIsInitialized(true)
        } catch (error) {
            console.error('Error parsing metadata JSON:', error)
            setFields([...PREDEFINED_FIELDS.map(f => ({ ...f, id: generateId() })), ...CONTACT_FIELDS.map(f => ({ ...f, id: generateId() }))])
            setCustomFieldGroups([])
            setFlatCustomFields([])
            setIsInitialized(true)
        }
    }, [value, isInitialized, predefinedKeys])

    // Function untuk generate JSON dari fields
    const generateJSON = useCallback((currentFields: MetadataField[], currentGroups: CustomFieldGroup[], currentFlatFields: MetadataField[]) => {
        const jsonObject: Record<string, any> = {}

        // Add regular fields
        currentFields.forEach(field => {
            if (field.key && field.value.trim()) {
                jsonObject[field.key] = field.value
            }
        })

        // Add grouped fields as nested objects
        currentGroups.forEach(group => {
            const groupObject: Record<string, string> = {}
            group.fields.forEach(field => {
                if (field.key && field.value.trim()) {
                    groupObject[field.key] = field.value
                }
            })

            if (Object.keys(groupObject).length > 0) {
                jsonObject[group.groupName] = groupObject
            }
        })

        // Add flat custom fields
        currentFlatFields.forEach(field => {
            if (field.key && field.value.trim()) {
                jsonObject[field.key] = field.value
            }
        })

        return Object.keys(jsonObject).length > 0 ? JSON.stringify(jsonObject, null, 2) : ''
    }, [])

    // Update field functions
    const updateField = useCallback((index: number, newValue: string) => {
        setFields(prev => {
            const newFields = [...prev]
            newFields[index] = { ...newFields[index], value: newValue }

            const newJSON = generateJSON(newFields, customFieldGroups, flatCustomFields)
            onChange(newJSON)

            return newFields
        })
    }, [customFieldGroups, flatCustomFields, generateJSON, onChange])

    const updateGroupField = useCallback((groupIndex: number, fieldIndex: number, newValue: string) => {
        setCustomFieldGroups(prev => {
            const newGroups = [...prev]
            newGroups[groupIndex] = {
                ...newGroups[groupIndex],
                fields: [...newGroups[groupIndex].fields]
            }
            newGroups[groupIndex].fields[fieldIndex] = {
                ...newGroups[groupIndex].fields[fieldIndex],
                value: newValue
            }

            const newJSON = generateJSON(fields, newGroups, flatCustomFields)
            onChange(newJSON)

            return newGroups
        })
    }, [fields, flatCustomFields, generateJSON, onChange])

    const updateGroupFieldKey = useCallback((groupIndex: number, fieldIndex: number, newKey: string) => {
        setCustomFieldGroups(prev => {
            const newGroups = [...prev]
            newGroups[groupIndex] = {
                ...newGroups[groupIndex],
                fields: [...newGroups[groupIndex].fields]
            }
            newGroups[groupIndex].fields[fieldIndex] = {
                ...newGroups[groupIndex].fields[fieldIndex],
                key: newKey
            }

            const newJSON = generateJSON(fields, newGroups, flatCustomFields)
            onChange(newJSON)

            return newGroups
        })
    }, [fields, flatCustomFields, generateJSON, onChange])

    const updateFlatField = useCallback((index: number, newValue: string) => {
        setFlatCustomFields(prev => {
            const newFlatFields = [...prev]
            newFlatFields[index] = { ...newFlatFields[index], value: newValue }

            const newJSON = generateJSON(fields, customFieldGroups, newFlatFields)
            onChange(newJSON)

            return newFlatFields
        })
    }, [fields, customFieldGroups, generateJSON, onChange])

    const updateFlatFieldKey = useCallback((index: number, newKey: string) => {
        setFlatCustomFields(prev => {
            const newFlatFields = [...prev]
            newFlatFields[index] = { ...newFlatFields[index], key: newKey }

            const newJSON = generateJSON(fields, customFieldGroups, newFlatFields)
            onChange(newJSON)

            return newFlatFields
        })
    }, [fields, customFieldGroups, generateJSON, onChange])

    // Add new group
    const addNewGroup = useCallback((groupName: string) => {
        const newGroup: CustomFieldGroup = {
            groupName,
            fields: [{ key: '', value: '', type: 'text', id: generateId() }]
        }
        setCustomFieldGroups(prev => [...prev, newGroup])
    }, [])

    // Add field to existing group
    const addFieldToGroup = useCallback((groupIndex: number) => {
        setCustomFieldGroups(prev => {
            const newGroups = [...prev]
            newGroups[groupIndex] = {
                ...newGroups[groupIndex],
                fields: [...newGroups[groupIndex].fields, { key: '', value: '', type: 'text', id: generateId() }]
            }
            return newGroups
        })
    }, [])

    // Remove field from group
    const removeFieldFromGroup = useCallback((groupIndex: number, fieldIndex: number) => {
        setCustomFieldGroups(prev => {
            const newGroups = [...prev]
            newGroups[groupIndex] = {
                ...newGroups[groupIndex],
                fields: newGroups[groupIndex].fields.filter((_, i) => i !== fieldIndex)
            }

            // Remove group if no fields left
            const finalGroups = newGroups.filter(group => group.fields.length > 0)

            const newJSON = generateJSON(fields, finalGroups, flatCustomFields)
            onChange(newJSON)

            return finalGroups
        })
    }, [fields, flatCustomFields, generateJSON, onChange])

    // Add flat custom field
    const addFlatCustomField = useCallback(() => {
        setFlatCustomFields(prev => [...prev, { key: '', value: '', type: 'text', id: generateId() }])
    }, [])

    // Remove flat custom field
    const removeFlatCustomField = useCallback((index: number) => {
        setFlatCustomFields(prev => {
            const newFlatFields = prev.filter((_, i) => i !== index)
            const newJSON = generateJSON(fields, customFieldGroups, newFlatFields)
            onChange(newJSON)
            return newFlatFields
        })
    }, [fields, customFieldGroups, generateJSON, onChange])

    const renderField = (field: MetadataField, index: number, onValueChange: (value: string) => void, onKeyChange?: (key: string) => void, showRemove = false, onRemove?: () => void) => {
        // Gunakan ID yang stabil untuk key, bukan field.key yang berubah
        const stableKey = field.id || `field-${index}`
        const fieldId = `${stableKey}-input`

        return (
            <div key={stableKey} className="space-y-2">
                <div className="flex gap-2">
                    {onKeyChange && (
                        <Input
                            label="Key"
                            value={field.key}
                            onChange={(e) => onKeyChange(e.target.value)}
                            placeholder="field_key"
                            className="flex-1"
                        />
                    )}
                    {showRemove && onRemove && (
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={onRemove}
                            className={onKeyChange ? "mt-6" : ""}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {!onKeyChange && (
                    <Label htmlFor={fieldId} className="text-sm font-medium">
                        {field.key}
                    </Label>
                )}

                {field.type === 'textarea' ? (
                    <Textarea
                        id={fieldId}
                        value={field.value}
                        onChange={(e) => onValueChange(e.target.value)}
                        placeholder={`Masukkan ${field.key}`}
                        rows={3}
                    />
                ) : (
                    <Input
                        id={fieldId}
                        type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
                        value={field.value}
                        onChange={(e) => onValueChange(e.target.value)}
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
                    Kontak
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
                        {getSeoFields().map((field, index) => 
                            renderField(field, index, (value) => updateField(index, value))
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Kontak</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Data kontak untuk ditampilkan di halaman.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {getContactFields().map((field, index) => 
                            renderField(field, index + PREDEFINED_FIELDS.length, (value) => updateField(index + PREDEFINED_FIELDS.length, value))
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Custom Fields Tab */}
            {activeTab === 'custom' && (
                <div className="space-y-4">
                    {/* Grouped Fields */}
                    {customFieldGroups.map((group, groupIndex) => (
                        <Card key={`group-${group.groupName}`}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    {group.groupName}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addFieldToGroup(groupIndex)}
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Field
                                    </Button>
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Fields yang akan dikelompokkan dalam object {group.groupName}.
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {group.fields.map((field, fieldIndex) => 
                                    renderField(
                                        field, 
                                        fieldIndex, 
                                        (value) => updateGroupField(groupIndex, fieldIndex, value),
                                        (key) => updateGroupFieldKey(groupIndex, fieldIndex, key),
                                        true,
                                        () => removeFieldFromGroup(groupIndex, fieldIndex)
                                    )
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    {/* Add New Group */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Group Baru</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Buat group baru untuk mengelompokkan fields dalam nested object.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Select onValueChange={(value) => addNewGroup(value)}>
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Pilih atau ketik nama group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PREDEFINED_GROUPS.map(group => (
                                            <SelectItem key={group} value={group}>
                                                {group}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="mt-2">
                                <Input
                                    placeholder="Atau ketik nama group custom"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            const target = e.target as HTMLInputElement
                                            if (target.value.trim()) {
                                                addNewGroup(target.value.trim())
                                                target.value = ''
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Flat Custom Fields */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Flat Custom Fields
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addFlatCustomField}
                                >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Field
                                </Button>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Fields yang akan disimpan langsung di root level JSON.
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {flatCustomFields.map((field, index) => 
                                renderField(
                                    field, 
                                    index, 
                                    (value) => updateFlatField(index, value),
                                    (key) => updateFlatFieldKey(index, key),
                                    true,
                                    () => removeFlatCustomField(index)
                                )
                            )}

                            {flatCustomFields.length === 0 && (
                                <div className="text-center py-4 text-muted-foreground">
                                    <p className="text-sm">Belum ada flat custom fields.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
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
                    <pre className="bg-muted p-3 rounded text-sm overflow-auto max-h-40">
                        {value || '{}'}
                    </pre>
                </CardContent>
            </Card>
        </div>
    )
}