/**
 * Utility functions for date/time formatting and calculations
 */

/**
 * Format a date string for display (e.g., "Mon, Nov 25, 2:30 PM")
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
    return new Date(dateString).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    })
}

/**
 * Format just the time portion (e.g., "2:30 PM")
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted time string
 */
export function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })
}

/**
 * Format a ride status for display
 * @param {string} status - The status code (e.g., 'SCHEDULED', 'IN_PROGRESS')
 * @returns {string} Human-readable status
 */
export function formatStatus(status) {
    const statusMap = {
        'SCHEDULED': 'Scheduled',
        'REQUESTED': 'Requested',
        'ACCEPTED': 'Accepted',
        'IN_PROGRESS': 'In Progress',
        'STARTED': 'Started',
        'COMPLETED': 'Completed',
        'CANCELLED': 'Cancelled'
    }
    return statusMap[status] || status
}

/**
 * Get a human-readable time until a future date
 * @param {string|Date} dateString - The future date
 * @returns {string} Time until string (e.g., "Departing in 2h 30m")
 */
export function getTimeUntil(dateString) {
    const now = new Date()
    const targetTime = new Date(dateString)
    const diffMs = targetTime - now

    if (diffMs < 0) {
        return 'Departed'
    }

    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
        return `Departing in ${diffMins} ${pluralize('minute', diffMins)}`
    } else if (diffHours < 24) {
        const remainingMins = diffMins % 60
        if (remainingMins > 0) {
            return `Departing in ${diffHours}h ${remainingMins}m`
        }
        return `Departing in ${diffHours} ${pluralize('hour', diffHours)}`
    } else {
        const remainingHours = diffHours % 24
        if (remainingHours > 0) {
            return `Departing in ${diffDays}d ${remainingHours}h`
        }
        return `Departing in ${diffDays} ${pluralize('day', diffDays)}`
    }
}

/**
 * Get departure info with time (e.g., "Leaves in 2 hours (2:30 PM)")
 * @param {string|Date} startTime - The departure time
 * @returns {string} Departure info string
 */
export function getDepartureInfo(startTime) {
    const now = new Date()
    const start = new Date(startTime)
    const diffMs = start - now

    if (diffMs <= 0) return 'Departed'

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    let timeString = ''
    if (diffHours > 0) {
        timeString = `Leaves in ${diffHours} ${pluralize('hour', diffHours)}`
    } else {
        timeString = `Leaves in ${diffMinutes} ${pluralize('minute', diffMinutes)}`
    }

    const formattedTime = formatTime(startTime)
    return `${timeString} (${formattedTime})`
}

/**
 * Get CSS class for time urgency styling
 * @param {string|Date} dateString - The date to evaluate
 * @returns {string} CSS class string
 */
export function getTimeUntilClass(dateString) {
    const now = new Date()
    const targetTime = new Date(dateString)
    const diffMs = targetTime - now
    const diffHours = diffMs / (1000 * 60 * 60)

    if (diffMs < 0) {
        return 'text-gray-500'
    } else if (diffHours < 1) {
        return 'text-orange-600 font-medium'
    } else if (diffHours < 24) {
        return 'text-blue-600'
    } else {
        return 'text-gray-600'
    }
}

/**
 * Helper to pluralize a word based on count
 * @param {string} word - The word to pluralize
 * @param {number} count - The count
 * @returns {string} Pluralized word
 */
export function pluralize(word, count) {
    return count === 1 ? word : `${word}s`
}

/**
 * Format a number with proper pluralization
 * @param {number} count - The count
 * @param {string} singular - Singular form
 * @param {string} [plural] - Optional plural form (defaults to singular + 's')
 * @returns {string} Formatted string (e.g., "3 seats" or "1 seat")
 */
export function formatCount(count, singular, plural) {
    const pluralForm = plural || `${singular}s`
    return `${count} ${count === 1 ? singular : pluralForm}`
}
