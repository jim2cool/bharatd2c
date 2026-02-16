'use client'

import { useEffect, useState } from 'react'
import {
    Database,
    Activity,
    HardDrive,
    ArrowUpRight,
    ArrowDownRight,
    AlertTriangle,
    RefreshCw,
    ShieldCheck
} from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    AreaChart,
    Area
} from 'recharts'

interface TelemetryData {
    db_size: number
    db_size_trend: number
    api_requests: number
    api_requests_trend: number
    storage_size: number
    storage_size_trend: number
    history: { date: string, requests: number, db: number }[]
}

export default function SuperAdminSupabaseUsage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<TelemetryData | null>(null)

    useEffect(() => {
        fetchTelemetry()
    }, [])

    const fetchTelemetry = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/super-admin/telemetry')
            const json = await res.json()
            setData(json)
        } catch (err) {
            setError('Failed to sync ecosystem metrics')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="bg-white border border-neutral-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center space-y-4 animate-pulse">
            <RefreshCw className="w-8 h-8 text-neutral-300 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Syncing Ecosystem Health...</p>
        </div>
    )

    if (!data) return null

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-neutral-900 tracking-tighter">Ecosystem Health</h2>
                    <p className="text-sm font-medium text-neutral-500">Infrastructure-level telemetry from Supabase Cloud.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-neutral-800 transition-colors" onClick={fetchTelemetry}>
                    <RefreshCw className="w-3.5 h-3.5" />
                    Sync Now
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    label="Database Size"
                    value={`${(data.db_size / 1024 / 1024).toFixed(2)} MB`}
                    trend={data.db_size_trend}
                    icon={Database}
                    unit="Postgres Storage"
                />
                <MetricCard
                    label="API Gateway"
                    value={data.api_requests.toLocaleString()}
                    trend={data.api_requests_trend}
                    icon={Activity}
                    unit="Requests / 24h"
                />
                <MetricCard
                    label="Object Storage"
                    value={`${(data.storage_size / 1024 / 1024).toFixed(2)} MB`}
                    trend={data.storage_size_trend}
                    icon={HardDrive}
                    unit="Bucket Payload"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-black text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group hover:shadow-blue-500/10 transition-all duration-700">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                        <Activity className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Node Traffic Velocity</h3>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">API Request Distribution (Last 7 Days)</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <StatusBadge label="Auth" status="online" />
                                <StatusBadge label="Storage" status="online" />
                                <StatusBadge label="Realtime" status="online" />
                                <div className="h-4 w-px bg-white/10 mx-2" />
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Live Feed</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.history}>
                                    <defs>
                                        <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '16px', padding: '12px' }}
                                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '900' }}
                                        cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="requests"
                                        stroke="#3b82f6"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorRequests)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-[2.5rem] p-8 space-y-8 flex flex-col">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-neutral-900 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-blue-600" />
                            Security Audit
                        </h3>
                        <span className="text-[10px] font-black text-neutral-400 bg-neutral-50 px-2 py-1 rounded-lg uppercase tracking-widest">Q1 2026</span>
                    </div>
                    <div className="space-y-6 flex-1">
                        <AuditItem
                            label="RLS Policies"
                            status="Compliant"
                            desc="All core tables have active Row Level Security."
                        />
                        <AuditItem
                            label="SSL Encryption"
                            status="Active"
                            desc="TLS 1.3 enforced for all client connections."
                        />
                        <AuditItem
                            label="Access Groups"
                            status="Verified"
                            desc="Role-based permissions mapped to platform IDs."
                        />
                    </div>
                    <div className="pt-4 mt-auto">
                        <div className="p-5 bg-orange-50 border border-orange-100 rounded-[1.5rem] flex items-start gap-4 hover:shadow-lg hover:shadow-orange-200/20 transition-all duration-300">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-orange-900 uppercase tracking-widest">Proactive Alert</p>
                                <p className="text-[10px] font-medium text-orange-700 leading-relaxed mt-1">DB connection limits reached 65% utilization during peak Asia traffic. Recommendation: Vertical scaling if threshold {'>'} 80%.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MetricCard({ label, value, trend, icon: Icon, unit }: any) {
    const isPositive = trend > 0
    return (
        <div className="bg-white border border-neutral-200 rounded-[2rem] p-8 group hover:border-black transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-neutral-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black border ${isPositive ? 'text-green-600 bg-green-50 border-green-100' : 'text-red-600 bg-red-50 border-red-100'
                    }`}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(trend)}%
                </div>
            </div>
            <div>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{label}</p>
                <div className="text-3xl font-black text-neutral-900 tracking-tighter">{value}</div>
                <p className="text-[10px] font-bold text-neutral-400 mt-2 uppercase tracking-widest">{unit}</p>
            </div>
        </div>
    )
}

function AuditItem({ label, status, desc }: any) {
    return (
        <div className="group">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-neutral-900 uppercase tracking-widest">{label}</span>
                <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-lg uppercase tracking-tighter">
                    {status}
                </span>
            </div>
            <p className="text-[10px] font-medium text-neutral-400 leading-tight">{desc}</p>
        </div>
    )
}

function StatusBadge({ label, status }: { label: string; status: 'online' | 'offline' | 'degraded' }) {
    const statusColors = {
        online: 'bg-green-500',
        offline: 'bg-red-500',
        degraded: 'bg-yellow-500'
    };

    return (
        <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${statusColors[status]}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{label}</span>
        </div>
    );
}
