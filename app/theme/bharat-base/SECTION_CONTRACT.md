BHARAT BASE — SECTION CONTRACT
(Universal Sections × Theme Skins)

Status: LOCKED
Audience: Designers, Frontend Devs, Theme Authors
Applies to: /app/components/**

1. Purpose of This Contract

This document exists to ensure:

Sections are built once

Themes only skin, never reimplement

No CSS fights between globals, Tailwind, and inline styles

Bharat Base remains stable and scalable

If a section violates this contract, it is invalid, even if it “looks better”.

2. Core Architecture Principle

Sections are UNIVERSAL.
Themes are VISUAL SKINS.

Separation of Responsibility
Layer	Owns	Must NOT Own
Section (/components)	Structure, data, behavior	Colors, radius, typography
Theme (/theme/bharat-base)	Visual identity	Markup, logic
globals.css	Tokens + base rules	Page-specific hacks
3. Folder Responsibilities (Confirmed)

Based on your structure:

/app/components

✅ Universal, theme-agnostic
❌ No visual styling logic

Contains:

HeroCarousel.tsx

Carousel.tsx

ProductCard.tsx

TestimonialCard.tsx

TrustBar.tsx

/app/theme/bharat-base

✅ Theme-specific CSS, tokens, overrides
❌ No JSX duplication of sections

Contains:

Design system docs

Theme tokens

Optional theme CSS layers

/app/globals.css

✅ Single source of visual truth
❌ No component-specific hacks

4. Allowed vs Forbidden Styling in Sections
✅ ALLOWED (Layout & Structure Only)

Tailwind utilities ONLY for:

Layout
flex, grid, gap-*, items-*, justify-*

Positioning
relative, absolute, sticky

Visibility
hidden, block, responsive md:*

Sizing (non-visual)
w-full, max-w-*, aspect-*

Example (GOOD):

<section className="section">
  <div className="container flex flex-col gap-6">
    {children}
  </div>
</section>

❌ FORBIDDEN (Visual Authority Violations)

A section must not contain:

❌ text-* (color or opacity)

❌ bg-*

❌ rounded-*

❌ shadow-*

❌ font-*

❌ opacity-*

❌ tracking-*

❌ Hardcoded hex / RGB values

❌ Inline style={{}}

Example (BAD):

<button className="bg-orange-500 rounded-full text-white">


This breaks theming and is not allowed.

5. Design System Class Hooks (Mandatory)

Sections must rely on semantic class hooks only.

Examples (Correct Usage)
<button className="btn btn-accent">Explore Collection</button>

<h2 className="section-title">Featured Products</h2>

<div className="card">
  <div className="card-body">...</div>
</div>


These classes:

Are defined in globals.css

Are skinned by the active theme

Never change markup

6. Section Anatomy (Standard Pattern)

Every section must follow this structure:

<section className="section">
  <div className="container">
    {/* Optional */}
    <header className="section-header">
      <h2 className="section-title" />
      <p className="section-subtitle" />
    </header>

    {/* Section content */}
  </div>
</section>


No deviations without review.

7. Buttons — Absolute Rule

Buttons must NEVER be styled inside sections

Allowed:

<button className="btn btn-accent" />


Forbidden:

<button className="rounded-full bg-yellow-500 px-6" />


Why:

Button shape, color, and feel are theme decisions

Hero, PDP, PLP, Footer CTAs must look consistent

8. Hero Is NOT Special

Hero sections:

❌ Do not get custom radius

❌ Do not get custom button styles

❌ Do not get opacity tricks

Hero differs only by:

Layout

Content hierarchy

Behavior (carousel)

Not by visual law.

9. How Themes Upgrade Look & Feel

Themes may change:

CSS tokens

Typography scale

Spacing rhythm

Border radius

Motion (optional)

Themes may NOT:

Add Tailwind utilities to sections

Rewrite JSX

Fork components

10. Enforcement Rule (Important)

If a visual issue appears:

First check section for forbidden utilities

Remove them

Let globals.css win

Never “patch over” with stronger CSS.

11. Migration Plan (What We’ll Do Next)

Now that this contract is locked:

Next steps (in order):

Refactor HeroCarousel.tsx to comply 100%

Remove hero-carousel.css if it violates contract

Refactor ProductCard.tsx

Refactor TestimonialCard.tsx

Each file:

One at a time

Clean, final

No regressions

12. Final Status

✅ Section architecture is now decided permanently
✅ Future themes will be fast and clean
✅ CSS fights will stop