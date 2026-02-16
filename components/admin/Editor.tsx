'use client'

import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import {
    Bold, Italic, List, ListOrdered, Link as LinkIcon,
    Undo, Redo, Heading1, Heading2, Underline as UnderlineIcon
} from 'lucide-react'

interface EditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null

    const addLink = () => {
        const url = window.prompt('URL')
        if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
        }
    }

    const btnClass = (isActive = false) => `
        p-2 rounded-lg transition-all
        ${isActive ? 'bg-blue-50 text-primary' : 'hover:bg-secondary text-muted-foreground'}
    `

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b bg-muted rounded-t-2xl">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}>
                <Bold className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}>
                <Italic className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))}>
                <UnderlineIcon className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-accent mx-1 self-center" />
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))}>
                <Heading1 className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}>
                <Heading2 className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-accent mx-1 self-center" />
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}>
                <List className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}>
                <ListOrdered className="w-4 h-4" />
            </button>
            <button type="button" onClick={addLink} className={btnClass(editor.isActive('link'))}>
                <LinkIcon className="w-4 h-4" />
            </button>
            <div className="flex-1" />
            <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btnClass()}>
                <Undo className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btnClass()}>
                <Redo className="w-4 h-4" />
            </button>
        </div>
    )
}

export function Editor({ value, onChange, placeholder }: EditorProps) {
    const [isCodeMode, setIsCodeMode] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer'
                }
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-xl max-w-full h-auto'
                }
            })
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 text-sm'
            }
        }
    })

    // Sync editor content when value changes externally (e.g. form reset)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value)
        }
    }, [value, editor])

    return (
        <div className="border rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all bg-card">
            <div className="flex items-center justify-between bg-muted px-4 py-1 border-b">
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setIsCodeMode(false)}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-t-lg transition-all ${!isCodeMode ? 'bg-card border-x border-t -mb-[1px] text-primary' : 'text-muted-foreground hover:text-muted-foreground'}`}
                    >
                        Visual
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsCodeMode(true)}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-t-lg transition-all ${isCodeMode ? 'bg-card border-x border-t -mb-[1px] text-primary' : 'text-muted-foreground hover:text-muted-foreground'}`}
                    >
                        Code
                    </button>
                </div>
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">
                    {isCodeMode ? 'Direct HTML Editing' : 'WYSIWYG Editor'}
                </div>
            </div>

            {!isCodeMode && <MenuBar editor={editor} />}

            <div className="relative">
                {isCodeMode ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full min-h-[300px] p-4 text-xs font-mono bg-neutral-900 text-green-400 focus:outline-none"
                        placeholder="Paste your HTML here..."
                    />
                ) : (
                    <EditorContent editor={editor} />
                )}
            </div>
        </div>
    )
}
