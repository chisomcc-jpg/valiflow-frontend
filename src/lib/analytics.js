import { v4 as uuidv4 } from 'uuid';

/**
 * Valiflow First-Party Analytics Client
 * GDPR-Compliant, Consent-Aware, Heartbeat-Driven.
 */

const ENDPOINT = 'http://localhost:4000/api/analytics/event'; // Adjust for prod env if needed (relative path in real prod)
const HEARTBEAT_INTERVAL_MS = 30000;

let heartbeatTimer = null;
let currentSessionId = null;

// --- State Management ---

function getConsent() {
    return localStorage.getItem('analyticsConsent') === 'true';
}

function getVisitorId() {
    let vid = localStorage.getItem('v_vid');
    if (!vid) {
        vid = uuidv4();
        localStorage.setItem('v_vid', vid);
    }
    return vid;
}

function getSessionId() {
    // Session persists for the duration of the browser session (sessionStorage)
    // OR we can cycle it. Requirement: "session_start on first load".
    let sid = sessionStorage.getItem('v_sid');
    if (!sid) {
        sid = uuidv4();
        sessionStorage.setItem('v_sid', sid);
        // Track session start immediately
        trackEvent('session_start', { referrer: document.referrer });
    }
    return sid;
}

// --- API ---

export async function trackEvent(name, payload = {}) {
    // 1. Consent Check
    if (!getConsent()) {
        // Only allow explicit consent actions to be tracked?? Usually no.
        // If consent is missing, we drop.
        // Exception: If this event IS the consent grant, we process it? 
        // For now, strict: no consent = no track.
        // But how do we track 'consent_granted'? 
        // We assume if user calls trackEvent, they might have checked logic or we allow 'consent_update' event.
        if (name !== 'consent_update') return;
    }

    const eventData = {
        name,
        sessionId: getSessionId(), // Ensure session exists
        visitorId: getVisitorId(),
        path: window.location.pathname,
        referrer: document.referrer,
        payload: {
            ...payload,
            url: window.location.href, // Add full URL in payload for deeper debugging
        }
    };

    try {
        // Use navigator.sendBeacon for critical events if unloading? 
        // JSON fetch is standard for now.
        await fetch('/api/analytics/event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });
    } catch (err) {
        console.error('[Analytics] Failed to send event', err);
    }
}

// --- Heartbeat ---

function startHeartbeat() {
    if (heartbeatTimer) clearInterval(heartbeatTimer);

    heartbeatTimer = setInterval(() => {
        if (document.visibilityState === 'visible' && getConsent()) {
            trackEvent('heartbeat', { active: true });
        }
    }, HEARTBEAT_INTERVAL_MS);
}

// --- Initialization ---

export function initAnalytics() {
    if (!getConsent()) {
        console.log('[Analytics] Consent not granted. Tracking disabled.');
        return;
    }

    // Ensure Identity
    getVisitorId();
    getSessionId(); // Triggers session_start if new

    // Start Heartbeat
    startHeartbeat();

    // Visibility Listener
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            trackEvent('app_foreground');
            startHeartbeat(); // Restart/Resume
        } else {
            trackEvent('app_background');
            if (heartbeatTimer) clearInterval(heartbeatTimer);
        }
    });

    // History Listener (SPAs)
    // We hook into history pushState or rely on App.jsx useEffect.
    // App.jsx integration is preferred for React.
}

export function grantConsent() {
    localStorage.setItem('analyticsConsent', 'true');
    initAnalytics();
    trackEvent('consent_update', { status: 'granted' });
}

export function revokeConsent() {
    trackEvent('consent_update', { status: 'revoked' });
    localStorage.setItem('analyticsConsent', 'false');
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    sessionStorage.removeItem('v_sid'); // Clear session
}
