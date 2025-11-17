export function getPrimaryText(address) {
    if (!address) return ''

    // For POIs we want to show the name more prominently
    if (address.type === 'poi' && address.name && address.name !== 'Unnamed') {
        return address.name
    }

    // For addresses we want to show the description
    return address.description || address.name || 'Unknown location'
}

export function getSecondaryText(address) {
    if (!address) return ''

    if (address.type === 'address') {
        return address.description || address.name || ''
    }

    if (address.type === 'poi') {
        const parts = []
        if (address.street) parts.push(address.street)
        if (address.city) parts.push(address.city)
        return parts.join(', ') || 'Location details unavailable'
    }

    return ''
}

export function getFullAddressText(address) {
    if (!address) return ''

    if (address.type === 'address') {
        return address.description || 'Unknown address'
    } else if (address.type === 'poi') {
        const parts = []
        if (address.name && address.name !== 'Unnamed') parts.push(address.name)
        if (address.street) parts.push(address.street)
        if (address.city) parts.push(address.city)
        return parts.length > 0 ? parts.join(', ') : address.name || 'Unknown location'
    }

    return address.description || address.name || 'Unknown location'
}
