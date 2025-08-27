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
    type: 'text' | 'textarea' | 'url' | 'email' | 'image'
    parentKey?: string
    id?: string
}

type TemplateField = {
    key: string;
    value: string;
    type: MetadataField['type'];
    id: string;
}

interface CustomFieldGroup {
    groupName: string
    fields: MetadataField[]
}

interface ArrayItem {
    id: string
    fields: MetadataField[]
}

interface ArrayField {
    arrayName: string
    items: ArrayItem[]
    template: MetadataField[] // template untuk item baru
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

const ARRAY_TEMPLATES: Record<string, TemplateField[]> = {
    missions: [
        { key: 'title', value: '', type: 'text', id: '' },
        { key: 'description', value: '', type: 'textarea', id: '' },
        { key: 'image', value: '', type: 'image', id: '' }
    ],
    services: [
        { key: 'name', value: '', type: 'text', id: '' },
        { key: 'description', value: '', type: 'textarea', id: '' },
        { key: 'image', value: '', type: 'image', id: '' }
    ],
    team: [
        { key: 'name', value: '', type: 'text', id: '' },
        { key: 'position', value: '', type: 'text', id: '' },
        { key: 'bio', value: '', type: 'textarea', id: '' },
        { key: 'avatar', value: '', type: 'image', id: '' },
        { key: 'email', value: '', type: 'email', id: '' },
        { key: 'website', value: '', type: 'url', id: '' }
    ],
    testimonials: [
        { key: 'name', value: '', type: 'text', id: '' },
        { key: 'message', value: '', type: 'textarea', id: '' },
        { key: 'photo', value: '', type: 'image', id: '' }
    ]
}
// Helper function untuk generate unique ID
const generateId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export function MetadataForm({ value, onChange }: MetadataFormProps) {
    const [fields, setFields] = useState<MetadataField[]>([])
    const [customFieldGroups, setCustomFieldGroups] = useState<CustomFieldGroup[]>([])
    const [flatCustomFields, setFlatCustomFields] = useState<MetadataField[]>([])
    const [arrayFields, setArrayFields] = useState<ArrayField[]>([])
    const [activeTab, setActiveTab] = useState<'seo' | 'contact' | 'custom' | 'arrays'>('seo')
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

            // Process nested objects, arrays, and flat fields
            const groups: CustomFieldGroup[] = []
            const flatFields: MetadataField[] = []
            const arrays: ArrayField[] = []

            Object.entries(parsed).forEach(([key, value]) => {
                if (predefinedKeys.includes(key)) return

                if (Array.isArray(value)) {
                    // This is an array field
                    const items: ArrayItem[] = value.map((item: any) => {
                        const itemFields: MetadataField[] = Object.entries(item).map(([itemKey, itemValue]) => ({
                            key: itemKey,
                            value: String(itemValue),
                            type: itemKey === 'image' || itemKey === 'photo' || itemKey === 'avatar' ? 'image' as const :
                                itemKey === 'description' || itemKey === 'bio' || itemKey === 'message' ? 'textarea' as const :
                                    itemKey === 'email' ? 'email' as const :
                                        itemKey === 'website' ? 'url' as const : 'text' as const,
                            id: generateId()
                        }))

                        return {
                            id: generateId(),
                            fields: itemFields
                        }
                    })

                    // Determine template from existing data or predefined templates
                    let template = ARRAY_TEMPLATES[key as keyof typeof ARRAY_TEMPLATES]
                    if (!template && items.length > 0) {
                        template = items[0].fields.map(field => ({
                            key: field.key,
                            value: '',
                            type: field.type,
                            id: generateId()
                        }))
                    }

                    arrays.push({
                        arrayName: key,
                        items,
                        template: template || [{ key: 'title', value: '', type: 'text', id: generateId() }]
                    })
                } else if (typeof value === 'object' && value !== null) {
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
            setArrayFields(arrays)
            setIsInitialized(true)
        } catch (error) {
            console.error('Error parsing metadata JSON:', error)
            setFields([...PREDEFINED_FIELDS.map(f => ({ ...f, id: generateId() })), ...CONTACT_FIELDS.map(f => ({ ...f, id: generateId() }))])
            setCustomFieldGroups([])
            setFlatCustomFields([])
            setArrayFields([])
            setIsInitialized(true)
        }
    }, [value, isInitialized, predefinedKeys])

    // Function untuk generate JSON dari fields
    const generateJSON = useCallback((currentFields: MetadataField[], currentGroups: CustomFieldGroup[], currentFlatFields: MetadataField[], currentArrays: ArrayField[]) => {
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

        // Add array fields
        currentArrays.forEach(arrayField => {
            const arrayItems = arrayField.items
                .map(item => {
                    const itemObject: Record<string, string> = {}
                    item.fields.forEach(field => {
                        if (field.key && field.value.trim()) {
                            itemObject[field.key] = field.value
                        }
                    })
                    return Object.keys(itemObject).length > 0 ? itemObject : null
                })
                .filter(item => item !== null)

            if (arrayItems.length > 0) {
                jsonObject[arrayField.arrayName] = arrayItems
            }
        })

        return Object.keys(jsonObject).length > 0 ? JSON.stringify(jsonObject, null, 2) : ''
    }, [])

    // Update field functions (existing ones)
    const updateField = useCallback((index: number, newValue: string) => {
        setFields(prev => {
            const newFields = [...prev]
            newFields[index] = { ...newFields[index], value: newValue }

            const newJSON = generateJSON(newFields, customFieldGroups, flatCustomFields, arrayFields)
            onChange(newJSON)

            return newFields
        })
    }, [customFieldGroups, flatCustomFields, arrayFields, generateJSON, onChange])

    // Array field functions
    const addNewArray = useCallback((arrayName: string, template?: MetadataField[]) => {
        const baseTemplate = template || ARRAY_TEMPLATES[arrayName as keyof typeof ARRAY_TEMPLATES]

        // Convert template to MetadataField[] with proper typing
        const newTemplate: MetadataField[] = baseTemplate
            ? baseTemplate.map(field => ({
                ...field,
                id: generateId(),
                // Ensure type compatibility
                type: field.type as MetadataField['type']
            }))
            : [{ key: 'title', value: '', type: 'text' as const, id: generateId() }]

        const newArray: ArrayField = {
            arrayName,
            items: [],
            template: newTemplate
        }

        setArrayFields(prev => [...prev, newArray])
    }, [])

    const addItemToArray = useCallback((arrayIndex: number) => {
        setArrayFields(prev => {
            const newArrays = [...prev]
            const template = newArrays[arrayIndex].template

            const newItem: ArrayItem = {
                id: generateId(),
                fields: template.map(field => ({
                    ...field,
                    value: '',
                    id: generateId()
                }))
            }

            newArrays[arrayIndex] = {
                ...newArrays[arrayIndex],
                items: [...newArrays[arrayIndex].items, newItem]
            }

            const newJSON = generateJSON(fields, customFieldGroups, flatCustomFields, newArrays)
            onChange(newJSON)

            return newArrays
        })
    }, [fields, customFieldGroups, flatCustomFields, generateJSON, onChange])

    const updateArrayItemField = useCallback((arrayIndex: number, itemIndex: number, fieldIndex: number, newValue: string) => {
        setArrayFields(prev => {
            const newArrays = [...prev]
            const newItems = [...newArrays[arrayIndex].items]
            const newFields = [...newItems[itemIndex].fields]

            newFields[fieldIndex] = { ...newFields[fieldIndex], value: newValue }
            newItems[itemIndex] = { ...newItems[itemIndex], fields: newFields }
            newArrays[arrayIndex] = { ...newArrays[arrayIndex], items: newItems }

            const newJSON = generateJSON(fields, customFieldGroups, flatCustomFields, newArrays)
            onChange(newJSON)

            return newArrays
        })
    }, [fields, customFieldGroups, flatCustomFields, generateJSON, onChange])

    const removeArrayItem = useCallback((arrayIndex: number, itemIndex: number) => {
        setArrayFields(prev => {
            const newArrays = [...prev]
            newArrays[arrayIndex] = {
                ...newArrays[arrayIndex],
                items: newArrays[arrayIndex].items.filter((_, i) => i !== itemIndex)
            }

            const newJSON = generateJSON(fields, customFieldGroups, flatCustomFields, newArrays)
            onChange(newJSON)

            return newArrays
        })
    }, [fields, customFieldGroups, flatCustomFields, generateJSON, onChange])

    const removeArray = useCallback((arrayIndex: number) => {
        setArrayFields(prev => {
            const newArrays = prev.filter((_, i) => i !== arrayIndex)
            const newJSON = generateJSON(fields, customFieldGroups, flatCustomFields, newArrays)
            onChange(newJSON)
            return newArrays
        })
    }, [fields, customFieldGroups, flatCustomFields, generateJSON, onChange])


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

            const newJSON = generateJSON(fields, newGroups, flatCustomFields, arrayFields)
            onChange(newJSON)

            return newGroups
        })
    }, [fields, flatCustomFields, generateJSON, onChange, arrayFields])

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

            const newJSON = generateJSON(fields, newGroups, flatCustomFields, arrayFields)
            onChange(newJSON)

            return newGroups
        })
    }, [fields, flatCustomFields, generateJSON, onChange, arrayFields])

    const updateFlatField = useCallback((index: number, newValue: string) => {
        setFlatCustomFields(prev => {
            const newFlatFields = [...prev]
            newFlatFields[index] = { ...newFlatFields[index], value: newValue }

            const newJSON = generateJSON(fields, customFieldGroups, newFlatFields, arrayFields)
            onChange(newJSON)

            return newFlatFields
        })
    }, [fields, customFieldGroups, generateJSON, onChange, arrayFields])

    const updateFlatFieldKey = useCallback((index: number, newKey: string) => {
        setFlatCustomFields(prev => {
            const newFlatFields = [...prev]
            newFlatFields[index] = { ...newFlatFields[index], key: newKey }

            const newJSON = generateJSON(fields, customFieldGroups, newFlatFields, arrayFields)
            onChange(newJSON)

            return newFlatFields
        })
    }, [fields, customFieldGroups, generateJSON, onChange, arrayFields])

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

            const newJSON = generateJSON(fields, finalGroups, flatCustomFields, arrayFields)
            onChange(newJSON)

            return finalGroups
        })
    }, [fields, flatCustomFields, generateJSON, onChange, arrayFields])

    // Add flat custom field
    const addFlatCustomField = useCallback(() => {
        setFlatCustomFields(prev => [...prev, { key: '', value: '', type: 'text', id: generateId() }])
    }, [])

    // Remove flat custom field
    const removeFlatCustomField = useCallback((index: number) => {
        setFlatCustomFields(prev => {
            const newFlatFields = prev.filter((_, i) => i !== index)
            const newJSON = generateJSON(fields, customFieldGroups, newFlatFields, arrayFields)
            onChange(newJSON)
            return newFlatFields
        })
    }, [fields, customFieldGroups, generateJSON, onChange, arrayFields])

    const renderField = (field: MetadataField, index: number, onValueChange: (value: string) => void, onKeyChange?: (key: string) => void, showRemove = false, onRemove?: () => void) => {
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
                        {field.key} {field.type === 'image' && '(Image/Icon)'}
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
                ) : field.type === 'image' ? (
                    <div className="space-y-2">
                        <Input
                            id={fieldId}
                            type="text"
                            value={field.value}
                            onChange={(e) => onValueChange(e.target.value)}
                            placeholder="URL gambar atau icon name (misal: square-kanban, 🏛️)"
                        />
                        <p className="text-xs text-muted-foreground">
                            Bisa berupa URL gambar, icon name (lucide), atau emoji
                        </p>
                    </div>
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
                    Objects
                </Button>
                <Button
                    type="button"
                    variant={activeTab === 'arrays' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('arrays')}
                    className="flex-1"
                >
                    Arrays
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

            {/* Arrays Tab */}
            {activeTab === 'arrays' && (
                <div className="space-y-4">
                    {/* Existing Arrays */}
                    {arrayFields.map((arrayField, arrayIndex) => (
                        <Card key={`array-${arrayField.arrayName + arrayIndex}`}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    {arrayField.arrayName}
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addItemToArray(arrayIndex)}
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            Add Item
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeArray(arrayIndex)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Array untuk {arrayField.arrayName}. Total: {arrayField.items.length} items.
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {arrayField.items.map((item, itemIndex) => (
                                    <Card key={item.id} className="bg-muted/50">
                                        <CardHeader className="pb-0">
                                            <CardTitle className="text-sm flex items-center justify-between">
                                                Item {itemIndex + 1}
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeArrayItem(arrayIndex, itemIndex)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {item.fields.map((field, fieldIndex) =>
                                                renderField(
                                                    field,
                                                    fieldIndex,
                                                    (value) => updateArrayItemField(arrayIndex, itemIndex, fieldIndex, value)
                                                )
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}

                                {arrayField.items.length === 0 && (
                                    <div className="text-center py-4 text-muted-foreground">
                                        <p className="text-sm">Belum ada items. Klik &quot;Add Item&quot; untuk menambah.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    {/* Add New Array */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Array Baru</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Buat array baru untuk data yang berulang seperti missions, services, testimonials, dll.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <Label className='mb-2'>Pilih Template Array</Label>
                                    <Select onValueChange={(value) => addNewArray(value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih template yang sudah tersedia" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(ARRAY_TEMPLATES).map(template => (
                                                <SelectItem key={template} value={template}>
                                                    {template} ({ARRAY_TEMPLATES[template as keyof typeof ARRAY_TEMPLATES].map(f => f.key).join(', ')})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className='mb-2'>Atau Buat Array Custom</Label>
                                    <Input
                                        placeholder="Nama array (misal: features, team, portfolio)"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                const target = e.target as HTMLInputElement
                                                if (target.value.trim()) {
                                                    addNewArray(target.value.trim())
                                                    target.value = ''
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {arrayFields.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-8">
                                <p className="text-muted-foreground mb-4">Belum ada array fields.</p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addNewArray('missions')}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Mulai dengan Missions
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
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