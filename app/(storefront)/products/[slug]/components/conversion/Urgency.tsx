import { Zap } from "lucide-react"

export function Urgency() {
    // Logic could be randomized or fixed, but prompt prohibits randomization/fake urgency.
    // We'll use a static message or derived from prop if needed.
    // Prompt says "Text only... No timers... Allowed text: High demand, Limited stock"

    return (
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/10 px-3 py-2 rounded-lg text-sm font-medium border border-amber-100 dark:border-amber-900/20">
            <Zap className="h-4 w-4 fill-amber-600 dark:fill-amber-500" />
            <span>High demand: Ships within 24 hours</span>
        </div>
    )
}
