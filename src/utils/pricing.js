const currency = 'CAD'

// Default pricing model parameters; tweak as backend policies evolve.
const BASE_FARE = 3.5
const PER_KM_RATE = 1.35
const PLATFORM_FEE_RATE = 0.18
const TAX_RATE = 0.13
const TIP_RATE = 0
const EXTERNAL_FEE_FLAT = 0.35

const roundToCents = (value) => Math.round(value * 100) / 100

export function calculateRidePricing(distanceKm = 0, options = {}) {
    const baseFare = options.baseFare ?? BASE_FARE
    const perKmRate = options.perKmRate ?? PER_KM_RATE
    const platformFeeRate = options.platformFeeRate ?? PLATFORM_FEE_RATE
    const taxRate = options.taxRate ?? TAX_RATE
    const tipRate = options.tipRate ?? TIP_RATE
    const externalFeeFlat = options.externalFeeFlat ?? EXTERNAL_FEE_FLAT

    const safeDistance = Number.isFinite(distanceKm) && distanceKm > 0 ? distanceKm : 0

    const subtotal = roundToCents(baseFare + safeDistance * perKmRate)
    const platformFee = roundToCents(subtotal * platformFeeRate)
    const externalFee = roundToCents(externalFeeFlat)
    const tip = roundToCents(subtotal * tipRate)
    const tax = roundToCents(subtotal * taxRate)
    const gross = roundToCents(subtotal + tax + tip)
    const driverEarnings = roundToCents(Math.max(subtotal - platformFee, 0) + tip)

    return {
        currency,
        subtotalAmount: subtotal,
        taxAmount: tax,
        tipAmount: tip,
        platformFeeAmount: platformFee,
        externalFeeAmount: externalFee,
        grossAmount: gross,
        driverEarningsAmount: driverEarnings
    }
}

const formatterCache = {}

export function formatCurrency(amount, locale = 'en-CA') {
    const cacheKey = `${locale}:${currency}`
    if (!formatterCache[cacheKey]) {
        formatterCache[cacheKey] = new Intl.NumberFormat(locale, { style: 'currency', currency })
    }
    return formatterCache[cacheKey].format(amount ?? 0)
}
