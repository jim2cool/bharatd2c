'use client'

import { ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export type ChecklistState = {
    hasProducts: boolean
    hasDomain: boolean
    hasShipping: boolean
    hasTheme: boolean
}

export function OnboardingChecklist({ checklist }: { checklist: ChecklistState }) {
    const router = useRouter()

    const steps = [
        {
            key: 'hasProducts',
            title: 'Add your first product',
            description: 'Write a description, add photos, and set pricing for the products you plan to sell.',
            action: 'Add product',
            href: '/admin/products/new',
            isDone: checklist.hasProducts
        },
        {
            key: 'hasTheme',
            title: 'Customize your online store',
            description: 'Choose a theme and add your logo, colors, and images to reflect your brand.',
            action: 'Customize theme',
            href: '/admin/settings/appearance', // Updated link to correct settings page
            isDone: checklist.hasTheme
        },
        {
            key: 'hasDomain',
            title: 'Add a custom domain',
            description: 'Your customers will use this to find your online store.',
            action: 'Add domain',
            href: '/admin/settings/domains',
            isDone: checklist.hasDomain
        },
        {
            key: 'hasShipping',
            title: 'Set shipping policy',
            description: 'Let customers know how you ship and when they can expect their orders.',
            action: 'Add policy',
            href: '/admin/settings', // General settings for now
            isDone: checklist.hasShipping
        }
    ]

    const completedCount = steps.filter(s => s.isDone).length
    const progress = Math.round((completedCount / steps.length) * 100)

    if (completedCount === steps.length) return null // Hide if complete

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Setup Guide</h1>
                <p className="text-gray-600">Use this personalized guide to get your store up and running.</p>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-black h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{completedCount} of {steps.length} completed</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b bg-gray-50">
                    <h2 className="font-semibold text-lg">Just a few steps to launch</h2>
                </div>

                <div className="divide-y">
                    {steps.map((step) => (
                        <div key={step.key} className="p-6 flex gap-4 items-start hover:bg-gray-50 transition-colors">
                            {step.isDone ? (
                                <CheckCircle2 className="text-green-600 w-6 h-6 mt-1 flex-shrink-0" />
                            ) : (
                                <Circle className="text-gray-300 w-6 h-6 mt-1 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                                <h3 className={`font-medium text-lg ${step.isDone ? 'text-gray-500 line-through' : 'text-black'}`}>
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 text-sm mt-1 mb-3">{step.description}</p>
                                {!step.isDone && (
                                    <button
                                        onClick={() => router.push(step.href)}
                                        className="text-sm bg-black text-white px-4 py-2 rounded font-medium inline-flex items-center hover:bg-gray-800 transition-colors"
                                    >
                                        {step.action} <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
