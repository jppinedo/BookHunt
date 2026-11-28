import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";
import { TURNSTILE_SITE_KEY, isTurnstileEnabled } from "@utils/turnstile";

/**
 * TurnstileWidget — U28: a Cloudflare Turnstile widget in Managed
 * mode, rendered explicitly. Managed is invisible for the vast
 * majority of humans (Cloudflare decides from browser signals);
 * when it does need interaction it draws its own checkbox box in
 * place, so the component is just a container div.
 *
 * The API script (api.js?render=explicit) is loaded ONCE per page
 * through a module-level promise, however many widgets mount over
 * the app's life. Each mount renders a fresh widget into its
 * container and removes it on unmount.
 *
 * Token lifecycle: tokens are SINGLE-USE and expire after ~5
 * minutes, so the parent owns the current token via onToken —
 * called with the token on success and with null on expire/error —
 * and asks for a fresh challenge through the exposed reset()
 * (imperative handle) after any auth attempt that consumed or
 * rejected one. onToken is read through a ref so a parent
 * re-render never re-renders the widget itself.
 *
 * Renders nothing when no site key is configured (see
 * @utils/turnstile) — callers can mount it unconditionally.
 */

const API_URL =
    "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

// Singleton loader: one <script> per page, shared by every widget.
let apiPromise = null;
function loadTurnstileApi() {
    if (typeof window !== "undefined" && window.turnstile) {
        return Promise.resolve(window.turnstile);
    }
    if (!apiPromise) {
        apiPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = API_URL;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                // window.turnstile is defined by the script itself;
                // poll briefly in case it lands a tick after load.
                let attempts = 0;
                const poll = setInterval(() => {
                    attempts += 1;
                    if (window.turnstile) {
                        clearInterval(poll);
                        resolve(window.turnstile);
                    } else if (attempts > 50) {
                        clearInterval(poll);
                        reject(new Error("Turnstile API unavailable"));
                    }
                }, 100);
            };
            script.onerror = () =>
                reject(new Error("Turnstile API failed to load"));
            document.head.appendChild(script);
        });
    }
    return apiPromise;
}

const TurnstileWidget = forwardRef(function TurnstileWidget(
    { onToken },
    ref,
) {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);
    const onTokenRef = useRef(onToken);
    onTokenRef.current = onToken;

    useImperativeHandle(ref, () => ({
        // Fresh challenge after a consumed/rejected token. Also
        // reports null immediately, so the parent drops the stale
        // token instead of offering it to the next auth call.
        reset() {
            onTokenRef.current?.(null);
            if (
                typeof window !== "undefined" &&
                window.turnstile &&
                widgetIdRef.current != null
            ) {
                try {
                    window.turnstile.reset(widgetIdRef.current);
                } catch {
                    // A widget mid-teardown can refuse; the next
                    // mount renders a fresh one anyway.
                }
            }
        },
    }), []);

    useEffect(() => {
        if (!isTurnstileEnabled) return undefined;
        let cancelled = false;
        loadTurnstileApi()
            .then((turnstile) => {
                if (cancelled || !containerRef.current) return;
                widgetIdRef.current = turnstile.render(containerRef.current, {
                    sitekey: TURNSTILE_SITE_KEY,
                    callback: (token) => onTokenRef.current?.(token),
                    "expired-callback": () => onTokenRef.current?.(null),
                    "error-callback": () => onTokenRef.current?.(null),
                });
            })
            .catch(() => onTokenRef.current?.(null));
        return () => {
            cancelled = true;
            if (
                typeof window !== "undefined" &&
                window.turnstile &&
                widgetIdRef.current != null
            ) {
                try {
                    window.turnstile.remove(widgetIdRef.current);
                } catch {
                    // Already gone — nothing to clean up.
                }
                widgetIdRef.current = null;
            }
        };
    }, []);

    if (!isTurnstileEnabled) return null;
    return <div ref={containerRef} />;
});

export default TurnstileWidget;
