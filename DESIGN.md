# Design System (DESIGN.md)

## Atmosphere
- **Premium & Trustworthy**: Clean lines, generous whitespace, and high-contrast typography.
- **Modern & Dynamic**: Subtle animations, rounded corners (2xl/3xl), and glassmorphism hints.
- **Authority**: Strong, bold headings with refined body text.

## Colors
### Primary
- **Background**: `#ffffff` (White)
- **Foreground**: `#171717` (Neutral-900)
- **Brand/Accent**: `#2563eb` (Blue-600) - For primary actions.
- **Success**: `#22c55e` (Green-500)
- **Error**: `#ef4444` (Red-500)

### Secondary / Surface
- **Surface-50**: `#f9fafb` (Neutral-50) - Page backgrounds, secondary cards.
- **Surface-100**: `#f3f4f6` (Neutral-100) - Borders, dividers.
- **Surface-200**: `#e5e7eb` (Neutral-200) - Heavy borders.
- **Text-Muted**: `#737373` (Neutral-500)

## Typography
- **Headings**: Sans-serif, Bold/Black weights, Uppercase tracking for labels (`tracking-widest`).
- **Body**: Sans-serif, readable line-heights.
- **Labels**: Small, uppercase, bold/black (`text-[10px] uppercase tracking-widest`).

## Components

### Buttons
- **Primary**: `bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700`
- **Secondary**: `bg-white border border-neutral-200 text-neutral-900 rounded-xl hover:bg-neutral-50`
- **Ghost**: `text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg`

### Cards
- **Container**: `bg-white border border-neutral-100 rounded-[2rem] shadow-sm`
- **Inner**: `bg-neutral-50/50 rounded-2xl`

### Inputs
- **Field**: `bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500`
- **Label**: `text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 block`

### Badges/Tags
- **Base**: `px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide`
- **Neutral**: `bg-neutral-100 text-neutral-600`
- **Success**: `bg-green-50 text-green-700 border border-green-100`
- **Blue**: `bg-blue-50 text-blue-700 border border-blue-100`

## Spacing & Geometry
- **Radius**: `rounded-xl`, `rounded-2xl`, `rounded-2xl`
- **Padding**: Generous. `p-6`, `p-8` for cards.
- **Gap**: `gap-4`, `gap-6` for layouts.

## Elevation
- **Card**: `shadow-sm` or `shadow-[0_2px_10px_rgba(0,0,0,0.03)]`
- **Floating**: `shadow-xl`
