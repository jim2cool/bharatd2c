'use client'

import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    containerClassName?: string
}

export function SearchInput({
    label,
    value = '',
    onChange,
    placeholder,
    className,
    containerClassName,
    ...props
}: SearchInputProps) {
    const [isFocused, setIsFocused] = useState(false)
    const hasValue = value.toString().length > 0

    return (
        <div className={cn("relative group/search", containerClassName)}>
            {/* Search Icon */}
            <Search
                className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none transition-all duration-300",
                    // The icon disappears when the user starts typing or if there's focus
                    // This prevents overlap with the infield label/text
                    (isFocused || hasValue) ? "opacity-0 -translate-x-4" : "opacity-100"
                )}
            />

            {/* Floating / Infield Label */}
            {label && (
                <span
                    className={cn(
                        "absolute left-4 transition-all duration-300 pointer-events-none uppercase tracking-widest font-black",
                        (isFocused || hasValue)
                            ? "top-2.5 text-[10px] text-blue-600 opacity-100"
                            : "top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 pl-8 opacity-100"
                    )}
                >
                    {label}
                </span>
            )}

            <input
                {...props}
                value={value}
                onChange={onChange}
                onFocus={(e) => {
                    setIsFocused(true)
                    props.onFocus?.(e)
                }}
                onBlur={(e) => {
                    setIsFocused(false)
                    props.onBlur?.(e)
                }}
                className={cn(
                    "w-full pr-4 bg-white border border-slate-300 rounded-xl outline-none transition-all font-medium text-sm shadow-sm",
                    "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
                    // Padding Adjustments
                    (isFocused || hasValue) ? "pt-7 pb-2 pl-4" : "py-3 pl-12",
                    className
                )}
                // We use a pseudo-placeholder or the label itself
                placeholder={(isFocused && !hasValue) ? placeholder : ""}
            />

            {/* Manual Placeholder for when focused and empty */}
            {isFocused && !hasValue && placeholder && (
                <span className="absolute left-4 top-[29px] text-sm text-neutral-300 pointer-events-none font-medium truncate max-w-[calc(100%-2rem)]">
                    {placeholder}
                </span>
            )}
        </div>
    )
}
