let activePromise = null
let activeSignature = null

const SCRIPT_ID = 'paypal-sdk'
const REQUIRED_COMPONENTS = 'buttons'
const SDK_NAMESPACE = 'paypal_sdk'
const getSdk = () => (typeof window !== 'undefined' ? window[SDK_NAMESPACE] : undefined)

export async function loadPayPalSdk({ clientId, currency = 'CAD' }) {
    if (!clientId) {
        throw new Error('Missing PayPal client ID.')
    }

    if (typeof window !== 'undefined') {
        // PayPal bundles Sentry 5.x; a stray stub without a version trips its loader, so clear it out.
        const existingSentry = window.__SENTRY__
        if (existingSentry && typeof existingSentry.version !== 'string') {
            delete window.__SENTRY__
        }
    }

    const normalizedCurrency = (currency || 'CAD').toUpperCase()
    const targetSignature = `${clientId}:${normalizedCurrency}:${REQUIRED_COMPONENTS}:${SDK_NAMESPACE}`

    if (typeof window !== 'undefined' && getSdk() && activeSignature === targetSignature) {
        return getSdk()
    }

    const existingScript = document.getElementById(SCRIPT_ID)
    if (existingScript) {
        const matches = (
            existingScript.dataset.clientId === clientId &&
            existingScript.dataset.currency === normalizedCurrency &&
            (existingScript.dataset.components || '').includes(REQUIRED_COMPONENTS)
        )
        const sdkNS = getSdk()
        const hasButtons = typeof sdkNS !== 'undefined' && typeof sdkNS.Buttons === 'function'
        if (!matches || !hasButtons) {
            existingScript.remove()
            delete window[SDK_NAMESPACE]
            try { delete window.paypal } catch (_) {}
            activeSignature = null
        } else if (sdkNS) {
            activeSignature = targetSignature
            return getSdk()
        }
    }

    if (activePromise && activeSignature === targetSignature) {
        return activePromise
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${normalizedCurrency}&intent=capture&components=buttons,messages`
    script.async = true
    script.defer = true
    script.dataset.clientId = clientId
    script.dataset.currency = normalizedCurrency
    script.dataset.components = REQUIRED_COMPONENTS
    script.setAttribute('data-namespace', SDK_NAMESPACE)
    script.dataset.namespace = SDK_NAMESPACE

    activeSignature = targetSignature
    activePromise = new Promise((resolve, reject) => {
        const cleanup = () => {
            script.removeEventListener('load', handleLoad)
            script.removeEventListener('error', handleError)
        }

        const handleLoad = () => {
            cleanup()
            activePromise = null
            const sdk = getSdk()
            if (!sdk) {
                activeSignature = null
                reject(new Error('PayPal SDK loaded without namespace.'))
                return
            }
            if (typeof sdk.Buttons !== 'function') {
                activeSignature = null
                reject(new Error('PayPal SDK loaded but Buttons API is unavailable. Ensure components include buttons and no other SDK script overrides it.'))
                return
            }
            // Provide a safe alias for legacy code expecting window.paypal
            if (typeof window !== 'undefined') {
                try {
                    if (!window.paypal || typeof window.paypal.Buttons !== 'function') {
                        window.paypal = sdk
                    }
                } catch (_) { /* no-op */ }
            }
            resolve(sdk)
        }

        const handleError = () => {
            cleanup()
            activePromise = null
            activeSignature = null
            reject(new Error('Failed to load PayPal SDK.'))
        }

        script.addEventListener('load', handleLoad)
        script.addEventListener('error', handleError)
    })

    document.head.appendChild(script)

    if (typeof window !== 'undefined' && !window.__PAYPAL_SDK_OBSERVER__) {
        const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.tagName === 'SCRIPT' && /paypal\.com\/sdk\/js/.test(node.src)) {
                        const ok = (node.dataset && node.dataset.components || '').includes('buttons') && (node.getAttribute('data-namespace') === SDK_NAMESPACE)
                        if (!ok) {
                            try { node.remove() } catch (e) {}
                        }
                    }
                }
            }
        })
        observer.observe(document.documentElement, { childList: true, subtree: true })
        window.__PAYPAL_SDK_OBSERVER__ = observer
    }

    return activePromise
}
