import { createClient } from '@/lib/supabase-server'

export default async function BillingOverviewPage() {
    const supabase = await createClient()

    // 1. Fetch Plan Distribution
    const { data: stores } = await supabase
        .from('stores')
        .select('subscription_plan')

    const planStats = stores?.reduce((acc: any, store: any) => {
        const plan = store.subscription_plan || 'free'
        acc[plan] = (acc[plan] || 0) + 1
        return acc
    }, {})

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-black border-b pb-4">Platform Billing</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <BillingStatCard label="Total Subscriptions" value={stores?.length || 0} />
                <BillingStatCard label="Pro Plans" value={planStats?.pro || 0} color="text-blue-600" />
                <BillingStatCard label="Enterprise" value={planStats?.enterprise || 0} color="text-purple-600" />
                <BillingStatCard label="Monthly Recurring Revenue" value="₹0" suffix="(Draft)" />
            </div>

            <div className="bg-white p-8 rounded-xl border shadow-sm text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04 المعلمة 2 2 0 00-2 2v3.24a12.332 12.332 0 002.205 7.034 5.961 5.961 0 012.75 3.02 12.188 12.188 0 0011.326 0 5.96 5.96 0 012.75-3.02 12.332 12.332 0 002.205-7.034V7.994a2 2 0 00-2-2z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold">Payment Integration</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                    Platform-wide billing is currently in **simulation mode**. Connect your Razorpay/Stripe Enterprise account to sync real-time revenue data.
                </p>
                <button className="px-6 py-2 bg-black text-white rounded-lg font-medium">
                    Configure Enterprise Gateway
                </button>
            </div>
        </div>
    )
}

function BillingStatCard({ label, value, color = 'text-black', suffix = '' }: { label: string; value: string | number; color?: string; suffix?: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{label}</p>
            <div className="flex items-baseline gap-2">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                {suffix && <span className="text-xs text-gray-400 font-normal">{suffix}</span>}
            </div>
        </div>
    )
}
