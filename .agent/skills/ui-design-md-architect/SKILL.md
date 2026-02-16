---
name: ui-design-md-architect
description: >
  Synthesizes a semantic design system into `DESIGN.md` as a source of truth for 
  visual style, atmosphere, and project identity.
---

# Design System Architect (DESIGN.md)

## Core Protocol
- **Extract Identity**: Define the project's brand personality and target atmosphere.
- **Atmosphere Mapping**: Use CSS/Tailwind headers and visual signals to define "mood".
- **Color Palette**: Map primary, secondary, and accent colors from `tailwind.config` or CSS variables.
- **Typography & Geometry**: Define font scales, border-radii, and spacing rhythms.
- **Depth & Elevation**: Define shadow systems and layering logic.

## Analysis Instructions
1. **Source Discovery**: Search for existing `tailwind.config.js`, `globals.css`, or design tokens.
2. **Synthesis**: Create a structured `DESIGN.md` at the project root.
3. **Validation**: Ensure the design system is accessible and consistent across all components.

## Output Format (DESIGN.md)
- **Atmosphere**: Key adjectives and visual goals.
- **Colors**: Hex codes and semantic mappings (e.g., `primary-foreground`).
- **Typography**: Font families and size/weight scales.
- **Components**: Standard styling patterns for buttons, inputs, and cards.
