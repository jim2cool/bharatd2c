'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'
import ChatFlow from './components/ChatFlow'
import SidePreview from './components/SidePreview'

export default function GenerateProductPage() {
    const [step, setStep] = useState<'urls' | 'extracting' | 'review' | 'generating' | 'final'>('urls')
    const [urls, setUrls] = useState<string[]>([])
    const [extractedData, setExtractedData] = useState<any>(null)
    const [finalContent, setFinalContent] = useState<any>(null)
    const [storeSlug] = useState('demo-store')

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] space-y-4 p-6">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                        Generate Product Content
                    </h1>
                    <p className="text-sm text-neutral-500 font-medium">AI-powered listing & A+ content generator</p>
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                <div className="flex-[1.5] flex flex-col min-w-0 h-full">
                    <Card className="flex-1 border-neutral-100 shadow-sm rounded-[2rem] overflow-hidden flex flex-col bg-white">
                        <ChatFlow
                            step={step}
                            setStep={setStep}
                            urls={urls}
                            setUrls={setUrls}
                            extractedData={extractedData}
                            setExtractedData={setExtractedData}
                            setFinalContent={setFinalContent}
                            storeSlug={storeSlug}
                        />
                    </Card>
                </div>

                <div className="flex-1 min-w-0 h-full">
                    <Card className="h-full border-neutral-100 shadow-sm rounded-[2rem] overflow-hidden bg-white">
                        <SidePreview
                            step={step}
                            urls={urls}
                            extractedData={extractedData}
                            setExtractedData={setExtractedData}
                            finalContent={finalContent}
                        />
                    </Card>
                </div>
            </div>
        </div>
    )
}
