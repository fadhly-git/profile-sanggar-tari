/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Link as LinkEditor } from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Highlighter,
    Type,
    Upload,
    Loader2,
} from 'lucide-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { useState, useRef, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

const lowlight = createLowlight()

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
    onImageDelete?: (url: string) => void
}

// Global variable untuk callback
let globalImageDeleteCallback: ((url: string) => void) | null = null
let deletingImages = new Set<string>()
let processedImages = new Set<string>()

// Custom Image Extension dengan kontrol untuk hapus dan ganti
const CustomImage = Image.extend({
    addNodeView() {
        return ({ node, editor, getPos }) => {
            const container = document.createElement('div')
            container.className = 'relative inline-block group'

            const img = document.createElement('img')
            img.src = node.attrs.src
            img.alt = node.attrs.alt || ''
            img.className = 'max-w-full h-auto rounded-lg'

            // Kontrol overlay
            const overlay = document.createElement('div')
            overlay.className = 'absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'

            // Tombol hapus
            const deleteBtn = document.createElement('button')
            deleteBtn.innerHTML = '🗑️'
            deleteBtn.className = 'bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm'
            deleteBtn.title = 'Hapus gambar'
            deleteBtn.onclick = async (e) => {
                e.preventDefault()
                e.stopPropagation()

                const imageUrl = node.attrs.src

                // Cek apakah gambar sudah diproses
                if (deletingImages.has(imageUrl)) return;

                // Hapus node dari editor
                const pos = getPos()
                if (typeof pos === 'number') {
                    editor.chain().focus().deleteRange({ from: pos, to: pos + 1 }).run()
                }

            }

            // Tombol ganti
            const replaceBtn = document.createElement('button')
            replaceBtn.innerHTML = '✏️'
            replaceBtn.className = 'bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm'
            replaceBtn.title = 'Ganti gambar'
            replaceBtn.onclick = (e) => {
                e.preventDefault()

                // Buat input file untuk ganti gambar
                const fileInput = document.createElement('input')
                fileInput.type = 'file'
                fileInput.accept = 'image/*'
                fileInput.style.display = 'none'

                fileInput.onchange = async (event) => {
                    const file = (event.target as HTMLInputElement).files?.[0]
                    if (file) {
                        try {
                            // Upload gambar baru
                            const formData = new FormData()
                            formData.append('file', file)

                            const response = await fetch('/api/admin/upload/image/berita', {
                                method: 'POST',
                                body: formData,
                                credentials: 'include',
                            })

                            const result = await response.json()

                            if (result.success) {

                                // Update node dengan gambar baru menggunakan view.dispatch
                                const pos = getPos()
                                if (typeof pos === 'number') {
                                    const { tr } = editor.state
                                    tr.setNodeMarkup(pos, null, {
                                        ...node.attrs,
                                        src: result.url
                                    })
                                    editor.view.dispatch(tr)
                                }

                                toast.success('Gambar berhasil diganti')
                            } else {
                                toast.error(result.error || 'Gagal mengupload gambar')
                            }
                        } catch (error) {
                            console.error('Error replacing image:', error)
                            toast.error('Terjadi kesalahan saat mengganti gambar')
                        }
                    }
                }

                document.body.appendChild(fileInput)
                fileInput.click()
                document.body.removeChild(fileInput)
            }

            overlay.appendChild(deleteBtn)
            overlay.appendChild(replaceBtn)
            container.appendChild(img)
            container.appendChild(overlay)

            return {
                dom: container,
                update: (updatedNode) => {
                    if (updatedNode.type.name !== 'image') return false
                    img.src = updatedNode.attrs.src
                    img.alt = updatedNode.attrs.alt || ''
                    return true
                }
            }
        }
    }
})

export function RichTextEditor({ content, onChange, onImageDelete }: RichTextEditorProps) {
    const [linkUrl, setLinkUrl] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [isLinkOpen, setIsLinkOpen] = useState(false)
    const [isImageOpen, setIsImageOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            CustomImage.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            LinkEditor.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 hover:text-blue-700 underline',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            Underline,
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'p-4 rounded-lg',
                },
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
            },
        },
    })


    // Listener untuk keyboard delete
    useEffect(() => {
        if (!editor) return

        const handleTransaction = (transaction: any) => {
            // hanya proses jika ada perubahan pada dokumen
            if (!transaction.docChanged) return;
            // Cek apakah ada node image yang dihapus
            const prevDoc = transaction.before
            const newDoc = transaction.doc

            prevDoc.descendants((node: any) => {
                if (node.type.name === 'image') {
                    const imageUrl = node.attrs.src
                    // Cek apakah node ini ada di dokumen baru
                    let stillExists = false
                    newDoc.descendants((newNode: any) => {
                        if (newNode.type.name === 'image' && newNode.attrs.src === imageUrl) {
                            stillExists = true
                        }
                    })
                    // Jika tidak ada di dokumen baru, panggil callback untuk hapus
                    if (!stillExists && !processedImages.has(imageUrl)) {
                        processedImages.add(imageUrl)
                        // delay untuk memastikan callback tidak dipanggil berulang kali
                        setTimeout(() => {
                            const callback = globalImageDeleteCallback
                            if (callback) callback(imageUrl);
                            // Hapus dari set setelah callback dipanggil
                            setTimeout(() => {
                                processedImages.delete(imageUrl)
                            }, 5000)
                        }, 200)
                    }
                }
            })
        }

        editor.on('transaction', handleTransaction)

        return () => {
            editor.off('transaction', handleTransaction)
        }
    }, [editor, onImageDelete])

    const handleFileUpload = useCallback(async (file: File) => {
        if (!file) return

        // Validasi tipe file
        if (!file.type.startsWith('image/')) {
            toast.error('File harus berupa gambar')
            return
        }

        // Validasi ukuran (max 5MB)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            toast.error('Ukuran file terlalu besar. Maksimal 5MB')
            return
        }

        setIsUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/admin/upload/image/berita', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            })

            const result = await response.json()

            if (result.success) {
                editor?.chain().focus().setImage({ src: result.url }).run()
                setIsImageOpen(false)
                toast.success('Gambar berhasil diupload')
            } else {
                toast.error(result.error || 'Gagal mengupload gambar')
            }
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Terjadi kesalahan saat mengupload')
        } finally {
            setIsUploading(false)
        }
    }, [editor])

    if (!editor) {
        return null
    }

    const openFileDialog = () => {
        fileInputRef.current?.click()
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            handleFileUpload(file)
        }
    }

    const addLink = () => {
        if (linkUrl) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
            setLinkUrl('')
            setIsLinkOpen(false)
        }
    }

    const addImage = () => {
        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run()
            setImageUrl('')
            setIsImageOpen(false)
        }
    }

    return (
        <div className="border border-foreground rounded-lg overflow-hidden">
            {/* Toolbar - sama seperti sebelumnya */}
            <div className="border-b bg-background p-3">
                <div className="flex flex-wrap gap-1">
                    {/* Text Formatting */}
                    <Button
                        type="button"
                        variant={editor.isActive('bold') ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                    >
                        <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive('italic') ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                    >
                        <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive('underline') ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                    >
                        <UnderlineIcon className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive('strike') ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                    >
                        <Strikethrough className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive('code') ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleCode().run()}
                    >
                        <Code className="w-4 h-4" />
                    </Button>

                    <Separator orientation="vertical" className="mx-1 h-8" />

                    {/* Headings */}
                    <Button
                        type="button"
                        variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    >
                        <Heading1 className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    >
                        <Heading2 className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    >
                        <Heading3 className="w-4 h-4" />
                    </Button>

                    <Separator orientation="vertical" className="mx-1 h-8" />

                    {/* Lists */}
                    <Button
                        type="button"
                        variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                    >
                        <List className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    >
                        <ListOrdered className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    >
                        <Quote className="w-4 h-4" />
                    </Button>

                    <Separator orientation="vertical" className="mx-1 h-8" />

                    {/* Alignment */}
                    <Button
                        type="button"
                        variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    >
                        <AlignLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    >
                        <AlignCenter className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    >
                        <AlignRight className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    >
                        <AlignJustify className="w-4 h-4" />
                    </Button>

                    <Separator orientation="vertical" className="mx-1 h-8" />

                    {/* Color & Highlight */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button type="button" variant="ghost" size="sm">
                                <Type className="w-4 h-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48">
                            <div className="space-y-2">
                                <Label>Text Color</Label>
                                <div className="flex gap-2 flex-wrap">
                                    {['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map((color) => (
                                        <button
                                            type="button"
                                            key={color}
                                            className="w-6 h-6 rounded border"
                                            style={{ backgroundColor: color }}
                                            onClick={() => editor.chain().focus().setColor(color).run()}
                                        />
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" type="button">
                                <Highlighter className="w-4 h-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48">
                            <div className="space-y-2">
                                <Label>Highlight Color</Label>
                                <div className="flex gap-2 flex-wrap">
                                    {['#ffff00', '#ff00ff', '#00ffff', '#ff0000', '#00ff00', '#0000ff'].map((color) => (
                                        <button
                                            type="button"
                                            key={color}
                                            className="w-6 h-6 rounded border"
                                            style={{ backgroundColor: color }}
                                            onClick={() => editor.chain().focus().setHighlight({ color }).run()}
                                        />
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Separator orientation="vertical" className="mx-1 h-8" />

                    {/* Link */}
                    <Popover open={isLinkOpen} onOpenChange={setIsLinkOpen}>
                        <PopoverTrigger asChild>
                            <Button type="button" variant="ghost" size="sm">
                                <LinkIcon className="w-4 h-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="space-y-2">
                                <Label>Add Link</Label>
                                <Input
                                    placeholder="https://example.com"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                />
                                <Button type="button" onClick={addLink} size="sm">
                                    Add Link
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Image */}
                    <Popover open={isImageOpen} onOpenChange={setIsImageOpen}>
                        <PopoverTrigger asChild>
                            <Button type="button" variant="ghost" size="sm">
                                <ImageIcon className="w-4 h-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Upload Gambar</Label>
                                    <Button type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={openFileDialog}
                                        disabled={isUploading}
                                        className="w-full"
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 mr-2" />
                                                Upload Gambar
                                            </>
                                        )}
                                    </Button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-px bg-border"></div>
                                    <span className="text-xs text-muted-foreground">atau</span>
                                    <div className="flex-1 h-px bg-border"></div>
                                </div>

                                <div className="space-y-2">
                                    <Label>URL Gambar</Label>
                                    <Input
                                        placeholder="https://example.com/image.jpg"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                    />
                                    <Button onClick={addImage} size="sm" className="w-full" type="button">
                                        Tambah Gambar
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Undo/Redo */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                    >
                        <Undo className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                    >
                        <Redo className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Editor Content */}
            <div className="bg-secondary">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}