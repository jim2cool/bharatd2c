"use client"

import React from 'react';
import { cn } from "@/lib/utils";
import { Camera, AlertCircle } from "lucide-react";
import { CategoryType, MoodCardKey } from "@/types/architecture";

interface PhotographyGuidanceProps {
    moodCard: MoodCardKey;
    category: CategoryType;
    tier: 'tier1' | 'tier2' | 'tier3';
}

export function PhotographyGuidance({ moodCard, category, tier }: PhotographyGuidanceProps) {
    if (tier === 'tier1') return null;

    const mood = moodCard;

    const getGuidance = () => {
        // 1. Category-Specific Guidance (Takes Priority for Technical Specs)
        const categoryGuidance: Partial<Record<CategoryType, string>> = {
            jewellery: "Use macro photography to highlight intricate details and hallmarks. Soft, diffused lighting prevents harsh reflections on metal.",
            fashion: "High-quality lifestyle shots showing the fit and drape. Use a mix of full-length and detail (texture) shots.",
            beauty: "Clean, well-lit product shots with emphasis on texture and packaging. Use macro shots for swatches.",
            electronics: "Clear, multi-angle shots showing all ports and features. Use high-contrast lighting to highlight build quality.",
            furniture: "Show the product in a relevant room setting to demonstrate scale and style compatibility. Provide clear dimensions.",
            food: "Food and sensory products look their best in warm, natural light. A wooden surface or fabric backdrop adds warmth.",
            spiritual: "Sacred products deserve careful photography. A plain cloth backdrop in warm, indirect light will do justice to your product.",
            digital: "High-quality mockups showing the product on relevant devices. Emphasize instant delivery visuals.",
            art: "High-resolution, front-on shots with accurate color representation. Include a lifestyle shot to show scale on a wall.",
            pets: "Playful and heartwarming lifestyle shots. Use fast shutter speeds to capture pets in motion.",
            baby: "Soft, gentle lighting and safe-feeling environments. Emphasize organic materials and safety features through close-ups.",
            stationery: "Focus on texture, paper quality, and color accuracy. Top-down (flat lay) shots work exceptionally well.",
            automotive: "Sharp, technical shots highlighting compatibility and durability. Use clean, industrial backgrounds.",
            sports: "High-action lifestyle shots showing the product in use. Emphasize performance features and materials.",
            gardening: "Natural, outdoor lighting showing the product with greenery. Emphasize watering needs or light requirements visually.",
            b2b: "Professional, bulk-focused shots. Emphasize technical specs, packaging/quantity, and quality standards.",
            experience: "Evocative lifestyle shots of participants enjoying the experience. Focus on the vibe and location.",
            renewed: "Honest, high-clearance shots showing actual condition. Highlight 'Certified' badges and clean surfaces.",
            consultation: "Professional headshot or clean mockups showing the value of the session (e.g., worksheets or digital meeting feel).",
            home: "Show the product in a lifestyle setting to convey scale and utility. Use natural light for a lived-in feel."
        };

        if (categoryGuidance[category]) {
            return categoryGuidance[category];
        }

        // 2. Mood-Specific Fallback (Visual Vibe)
        switch (mood) {
            case 'Minimal':
            case 'Professional':
                return "A clean white background photo will show your product clearly. Try photographing against a white wall in daylight.";
            case 'Bold':
            case 'Urban':
                return "High-energy stores perform best with bold, high-contrast images. A well-lit product on a dark or white background will amplify your store's impact.";
            case 'Heritage':
            case 'Earth':
                return "Your store's organic aesthetic comes alive with warm, natural lighting. Try photographing your product on a wooden surface or earth tones in natural light.";
            case 'Luxury':
            case 'Quiet Luxury':
                return "Luxury stores require clean, elegant photography. Place your product on a plain white, cream, or marble surface. Even lighting, no harsh shadows.";
            case 'Organic':
            case 'Clinical':
            case 'Zen':
                return "Natural light and simple backgrounds — a white wall, light wood, or greenery — work beautifully for conscious and wellness products.";
            case 'Fresh':
            case 'Vibrant':
            case 'Playful':
                return "Bright, vibrant images work best for your store's energy. Photograph in daylight with a clean, bright background.";
            case 'Sleek':
            case 'Industrial':
                return "Your product should be the star. A dark background or pure black surface with good directional lighting creates the clean, powerful aesthetic your store calls for.";
            default:
                return "Good lighting and a clean background help increase conversion.";
        }
    };

    const isHardFlag = tier === 'tier3' && ['Luxury', 'Spiritual', 'Quiet Luxury'].includes(mood);

    return (
        <div className={cn(
            "p-4 rounded-xl border flex gap-4 items-start transition-all",
            isHardFlag ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
        )}>
            <div className={cn(
                "p-2 rounded-lg shrink-0",
                isHardFlag ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
            )}>
                {isHardFlag ? <AlertCircle className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            </div>

            <div className="flex flex-col gap-1">
                <h4 className={cn(
                    "text-sm font-bold uppercase tracking-wider",
                    isHardFlag ? "text-red-900" : "text-amber-900"
                )}>
                    {isHardFlag ? "Photography Hard Flag" : "Photography Guidance"}
                </h4>
                <p className={cn(
                    "text-sm leading-relaxed",
                    isHardFlag ? "text-red-700" : "text-amber-800"
                )}>
                    {isHardFlag && <span className="font-bold underline">Warning:</span>} {getGuidance()}
                </p>
            </div>
        </div>
    );
}
