'use client'

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
    return (
        <div className="w-full bg-white border rounded overflow-hidden">
            <div className="bg-gray-50 h-10 border-b flex items-center px-4 gap-4">
                {Array.from({ length: cols }).map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: i === 0 ? '10%' : '20%' }} />
                ))}
            </div>
            <div className="divide-y">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex px-4 py-4 gap-4 items-center">
                        {Array.from({ length: cols }).map((_, j) => (
                            <div key={j} className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: j === 0 ? '5%' : '20%' }} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export function OrderListSkeleton() {
    return <TableSkeleton rows={10} cols={6} />
}

export function ProductListSkeleton() {
    return <TableSkeleton rows={10} cols={8} />
}
