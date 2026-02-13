'use client'

import { useState, useRef, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Send,
    Loader2,
    Sparkles,
    User,
    Bot,
    RotateCcw
} from 'lucide-react'

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

interface ChatFlowProps {
    step: 'urls' | 'extracting' | 'review' | 'generating' | 'final'
    setStep: (step: any) => void
    urls: string[]
    setUrls: (urls: string[]) => void
    extractedData: any
    setExtractedData: (data: any) => void
    setFinalContent: (data: any) => void
    storeSlug: string
}

export default function ChatFlow({
    step,
    setStep,
    urls,
    setUrls,
    extractedData,
    setExtractedData,
    setFinalContent,
    storeSlug
}: ChatFlowProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hello! Share a product inspiration in the form of a product page link from sites like Amazon, Meesho, Flipkart, any Shopify or WooCommerce site, Alibaba, or other major marketplaces. I'll analyze the details to draft your unique listing.",
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, step]) // Auto-scroll on messages or step change

    const handleReset = () => {
        setStep('urls')
        setUrls([])
        setExtractedData(null)
        setFinalContent(null)
        setMessages([{
            role: 'assistant',
            content: "Hello! Share a product inspiration link (Amazon, Meesho, Flipkart, Shopify, etc.) and I'll draft your listing based on those details.",
            timestamp: new Date()
        }])
        setInput('')
    }

    const handleSend = () => {
        if (!input.trim()) return

        const newUrl = input.trim()

        // Single URL Logic: Clear previous if any, set new
        setUrls([newUrl])
        setMessages(prev => [
            ...prev,
            { role: 'user', content: newUrl, timestamp: new Date() },
            { role: 'assistant', content: "Got it. Analyzing this URL...", timestamp: new Date() }
        ])
        setInput('')

        // Auto-start extraction for single URL flow
        startExtraction(newUrl)
    }

    // ... (startExtraction logic continues below)

    const startExtraction = async (url: string) => {
        setStep('extracting')

        try {
            const response = await fetch('/api/admin/products/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls: [url], storeSlug })
            })

            if (!response.ok) throw new Error('Extraction failed')

            const data = await response.json()
            setExtractedData(data)

            setStep('review')
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I've gathered the details! Please review the specs and images in the right panel. If everything looks good, click 'Confirm & Generate'.",
                timestamp: new Date()
            }])
        } catch (error) {
            setStep('urls')
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I encountered an error while analyzing that URL. It might be protected or invalid. Please try another one.",
                timestamp: new Date()
            }])
            setUrls([]) // Reset on error
        }
    }

    const generateFinalContent = async () => {
        setStep('generating')
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: "Great! I'm now drafting your highly optimized listing document and structuring the A+ content layout...",
            timestamp: new Date()
        }])

        try {
            const response = await fetch('/api/admin/products/generate/build', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    specs: extractedData.specs,
                    images: extractedData.images,
                    pricing: extractedData.pricing
                })
            })

            if (!response.ok) throw new Error('Build failed')

            const data = await response.json()
            setFinalContent(data)
            setStep('final')
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "🎉 Done! Your product content is ready. You can find the listing document and A+ layout in the preview panel. Click 'Create Product & Edit' to save it.",
                timestamp: new Date()
            }])
        } catch (error) {
            setStep('review')
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Oops, something went wrong while generating the final content. Let's try that again.",
                timestamp: new Date()
            }])
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : ''}`}>
                            {m.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                    <Bot className="w-5 h-5 text-blue-600" />
                                </div>
                            )}
                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${m.role === 'user'
                                ? 'bg-neutral-900 text-white rounded-tr-none'
                                : 'bg-neutral-50 text-neutral-800 rounded-tl-none border border-neutral-100'
                                }`}>
                                {m.content}
                            </div>
                            {m.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
                                    <User className="w-5 h-5 text-neutral-600" />
                                </div>
                            )}
                        </div>
                    ))}
                    {(step === 'extracting' || step === 'generating') && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 animate-pulse">
                                <Bot className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="p-4 rounded-2xl text-sm font-medium bg-neutral-50 border border-neutral-100 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {step === 'extracting' ? 'Analyzing URL...' : 'Generating Listing & A+ Content...'}
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            {/* Input / UI Actions */}
            <div className="p-6 border-t border-neutral-100 bg-neutral-50/30">
                {step === 'urls' && (
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste product URL..."
                            className="rounded-full px-6 border-neutral-200"
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            autoFocus
                        />
                        <Button onClick={handleSend} disabled={!input.trim()} className="rounded-full bg-neutral-900 hover:bg-neutral-800 px-6">
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {step !== 'urls' && (
                    <div className="flex gap-2 w-full">
                        <Button
                            variant="outline"
                            className="rounded-full w-12 h-12 p-0 border-neutral-200 hover:bg-neutral-100 hover:text-red-600 shrink-0"
                            onClick={handleReset}
                            title="Start Over"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>

                        {step === 'review' && (
                            <Button
                                className="flex-1 rounded-full bg-green-600 hover:bg-green-700 text-xs font-black uppercase tracking-widest h-12 gap-2"
                                onClick={generateFinalContent}
                            >
                                Confirm & Generate Content
                                <Sparkles className="w-4 h-4" />
                            </Button>
                        )}

                        {step === 'final' && (
                            <div className="flex-1 flex items-center justify-center text-xs text-neutral-400 font-medium">
                                Content Ready via Preview Panel 👉
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
