# Bharat Base Theme

This theme is a **presentation-only layer**.

## It CAN:
- Render product data
- Choose PDP layouts
- Render UI components
- Control spacing, typography, layout

## It CANNOT:
- Fetch data
- Mutate data
- Define routes
- Change schemas
- Access Supabase directly

## Architecture Rule
Route → Data Layer → Theme Renderer

Breaking this rule means refactor later.
