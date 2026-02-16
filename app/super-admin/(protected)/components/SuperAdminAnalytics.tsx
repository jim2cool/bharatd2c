'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // Assuming these exist from shadcn
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'

interface AnalyticsProps {
    revenueData: any[]
    storeData: any[]
}

export default function SuperAdminAnalytics({ revenueData, storeData }: AnalyticsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest mb-6">Platform Revenue (Last 30 Days)</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#999' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#999' }}
                                tickFormatter={(val) => `₹${val / 1000}k`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                            />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#000"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#000', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, fill: '#000', strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest mb-6">Top Stores by Orders</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={storeData} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#666', fontWeight: 600 }}
                                width={100}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="orders" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                                {storeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#000' : '#d1d5db'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
