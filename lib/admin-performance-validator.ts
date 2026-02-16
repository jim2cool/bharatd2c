/**
 * Admin Performance Validator
 * 
 * Validates admin customizations against performance budgets to prevent
 * sellers from degrading site performance through uploads or customizations.
 */

export interface ValidationResult {
    valid: boolean;
    error?: string;
    warning?: string;
}

// Performance budget limits
const LIMITS = {
    IMAGE_MAX_SIZE: 500 * 1024, // 500KB
    CUSTOM_CSS_MAX_SIZE: 10 * 1024, // 10KB
    MAX_THIRD_PARTY_SCRIPTS: 3,
} as const;

/**
 * Validates image upload size
 */
export function validateImageUpload(file: File): ValidationResult {
    if (file.size > LIMITS.IMAGE_MAX_SIZE) {
        return {
            valid: false,
            error: `Image size (${formatBytes(file.size)}) exceeds limit of ${formatBytes(LIMITS.IMAGE_MAX_SIZE)}. Please compress your image.`,
        };
    }

    // Warn if image is larger than 200KB but under limit
    if (file.size > 200 * 1024) {
        return {
            valid: true,
            warning: `Image size is ${formatBytes(file.size)}. Consider compressing for better performance.`,
        };
    }

    return { valid: true };
}

/**
 * Validates custom CSS size
 */
export function validateCustomCSS(css: string): ValidationResult {
    const sizeInBytes = new Blob([css]).size;

    if (sizeInBytes > LIMITS.CUSTOM_CSS_MAX_SIZE) {
        return {
            valid: false,
            error: `Custom CSS size (${formatBytes(sizeInBytes)}) exceeds limit of ${formatBytes(LIMITS.CUSTOM_CSS_MAX_SIZE)}.`,
        };
    }

    return { valid: true };
}

/**
 * Validates third-party script count
 */
export function validateThirdPartyScripts(scriptUrls: string[]): ValidationResult {
    if (scriptUrls.length > LIMITS.MAX_THIRD_PARTY_SCRIPTS) {
        return {
            valid: false,
            error: `You can only add up to ${LIMITS.MAX_THIRD_PARTY_SCRIPTS} third-party scripts. Currently: ${scriptUrls.length}`,
        };
    }

    return { valid: true };
}

/**
 * Validates theme customization payload
 */
export interface ThemeCustomization {
    customCSS?: string;
    thirdPartyScripts?: string[];
}

export function validateThemeCustomization(customization: ThemeCustomization): ValidationResult {
    // Validate custom CSS if provided
    if (customization.customCSS) {
        const cssResult = validateCustomCSS(customization.customCSS);
        if (!cssResult.valid) return cssResult;
    }

    // Validate third-party scripts if provided
    if (customization.thirdPartyScripts) {
        const scriptsResult = validateThirdPartyScripts(customization.thirdPartyScripts);
        if (!scriptsResult.valid) return scriptsResult;
    }

    return { valid: true };
}

// Utility function
function formatBytes(bytes: number): string {
    return `${(bytes / 1024).toFixed(2)} KB`;
}
