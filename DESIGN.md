# Easy D2C Design System (DESIGN.md)

## Atmosphere & Identity
**Keywords**: Editorial, Luxury, Premium, Minimalist, Direct-to-Consumer (D2C).
**Visual Goals**: 
- High-contrast typography for a magazine-like feel.
- Spacious layouts with an 8pt grid.
- Clean, bone-colored backgrounds to emphasize product imagery.
- Subtle micro-interactions (lifts, scales) for a premium tactile feel.

## Color Palette
### Core Neutrals
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `--white` | `#FFFFFF` | Surface areas, cards. |
| `--beige-50` | `#FDFDFD` | Background (Page). |
| `--beige-100` | `#F6F6F6` | Background (Sections). |
| `--charcoal-900` | `#1A1A1A` | Primary Text, Headers. |

### Brand Accents (Saffron System)
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `--saffron-500` | `#E26A00` | Primary CTA, Accent highlights. |
| `--saffron-100` | `#FFF1E6` | Muted backgrounds, secondary highlights. |

## Typography
- **Sans-Serif**: `Inter` (UI elements, body text, secondary headers).
- **Serif**: `Playfair Display` (Hero titles, section headings, editorial callouts).
- **Scale**: 8pt Grid (12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px, 48px).

## Geometry & Elevation
- **Border Radii**: 
  - `sm`: 6px (Buttons, Inputs).
  - `md`: 8px (Cards).
  - `xl`: 16px (Hero blocks).
- **Shadows**:
  - `sm`: 0 1px 2px rgba(0,0,0,0.05).
  - `lg`: 0 10px 25px rgba(0,0,0,0.1).
- **Transitions**: 300ms cubic-bezier(0.4, 0, 0.2, 1).

## Layout Variations (Phase 26)
### Announcement Bar
- **Static**: Centered, high-contrast bar.
- **Marquee**: Infinite horizontal scroll for urgency/features.

### Header Styles
- **Default**: Centered logo, navigation between logo and actions.
- **Modern**: Logo left, inline navigation, actions right.
- **Minimal**: Floating/Compact logo with icon-first navigation.

### Footer Styles
- **Standard**: Multi-column with social and legal sections.
- **Minimal**: Single-line copyright and essential links.
