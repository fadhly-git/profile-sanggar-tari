export function isValidUrl(string: string) {
    try {
        // Allow relative URLs and absolute URLs
        if (string.startsWith('/') || string.startsWith('#')) {
            return true
        }
        new URL(string)
        return true
    } catch {
        return false
    }
}

export function isValidImageUrl(string: string) {
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    // Handle relative paths and absolute URLs
    if (string.startsWith('/')) {
        return validImageExtensions.some(ext => string.endsWith(ext))
    }
    try {
        const url = new URL(string)
        return validImageExtensions.some(ext => url.pathname.endsWith(ext))
    } catch {
        return false
    }
}