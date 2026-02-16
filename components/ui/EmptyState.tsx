'use client'

import React from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from './button'

interface EmptyStateProps {
    title: string
    description: string
    icon?: React.ReactNode
    action?: {
        label: string
        href?: string
        onClick?: () => void
    }
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-[2.5rem] border border-dashed border-border">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6 text-muted-foreground">
                {icon || <Search className="w-8 h-8 opacity-20" />}
            </div>
            <h3 className="text-lg font-black text-foreground tracking-tight mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm max-w-xs mb-8">{description}</p>
            {action && (
                <Button
                    onClick={action.onClick}
                    className="bg-neutral-900 text-primary-foreground rounded-xl px-6"
                >
                    {action.label}
                </Button>
            )}
        </div>
    )
}
