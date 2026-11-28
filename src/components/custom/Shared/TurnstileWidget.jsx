import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { TURNSTILE_SITE_KEY, isTurnstileEnabled } from "@utils/turnstile";

/**
 * TurnstileWidget — Cloudflare Turnstile, the token source for
 * Supabase's built-in CAPTCHA protection.
 *
 * U28 rendered a Managed widget on mount and let it resolve in
 * the background — which left Cloudflare's box sitting visibly
 * under the Login button at all times. Juan called it ugly, and
 * he was right.
 *
 * U29 — invisible at rest, executed at submit time. The widget is
 * rendered with execution: "execute" and appearance:
 * "interaction-only", and NOTHING is loaded or rendered on mount:
 * the API script, the widget and the challenge all stay dormant
 * until the parent calls the imperative execute() at submit time
 * (Supabase verifies the token AS PART of the auth request, so
 * the token has to exist before signIn/signUp/reset is called —
 * execute-then-auth is the only possible order). For the vast
 * majority of humans the challenge passes invisibly and execute()
 * simply resolves with the token; only traffic Cloudflare flags
 * ever sees the interactive box, which then appears in place —
 * the container leaves its zero-size absolute parking spot via
 * the before-interactive callback and returns when the challenge
 * settles.
 *
 * Imperative API:
 *   execute() → Promise<string|null>. Resolves with the token on
 *     success; resolves null on error, expiry, timeout (15s on
 *     the invisible path, extended to 120s once an interactive
 *     challenge is on screen — U34) or
 *     when no site key is configured — it never rejects, so
 *     callers branch on the value. A call while a challenge is
 *     already in flight returns the in-flight promise. Tokens are
 *     single-use, so a widget that already produced one is reset
 *     before being executed again.
 *   reset() → drops any in-flight execute() (resolves it null)
 *     and returns the widget to its ready state, for the
 *     captcha-rejection recovery paths in the auth pages.
 *
 * Renders an inert zero-size container when no site key is
 * configured (see @utils/turnstile) — callers can mount it
 * unconditionally, and execute() resolves null immediately.
 */

const API_URL =
    "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

// U29: an execute() that produces no token within 15s is treated
// as failed (blocked script, stalled challenge) so no auth flow
// can wait on Cloudflare forever.
const EXECUTE_TIMEOUT_MS = 15000;

// U34: that 15s cap is for the invisible path only. Once
// Cloudflare shows its interactive checkbox, a human is in the
// loop — noticing the box, reading it and clicking takes longer
// than 15s, and the old cap killed the login mid-challenge
// ("Verification didn't go through" while the box was still on
// screen). before-interactive re-arms the wait at 120s;
// Cloudflare's own callbacks settle it sooner in practice.
const INTERACTIVE_TIMEOUT_MS = 120000;

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

const TurnstileWidget = forwardRef(function TurnstileWidget(_, ref) {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);
    const turnstileRef = useRef(null);
    // The in-flight execute(): { promise, resolve, timer }.
    const pendingRef = useRef(null);
    // True once the widget has run a challenge since the last
    // reset — a spent widget must be reset before executing again.
    const executedRef = useRef(false);
    // True only while Cloudflare is showing an interactive
    // challenge; the container is parked at zero size otherwise.
    const [interactive, setInteractive] = useState(false);

    const settlePending = (value) => {
        if (pendingRef.current) {
            const { resolve, timer } = pendingRef.current;
            pendingRef.current = null;
            if (timer) {
                clearTimeout(timer);
            }
            resolve(value);
        }
    };

    // Explicit render, deferred until the first execute() so the
    // page pays nothing — and shows nothing — before submit time.
    const renderWidget = (turnstile) => {
        if (widgetIdRef.current != null || !containerRef.current) {
            return widgetIdRef.current;
        }
        widgetIdRef.current = turnstile.render(containerRef.current, {
            sitekey: TURNSTILE_SITE_KEY,
            execution: "execute",
            appearance: "interaction-only",
            // U33: the app is light-theme only, so pin the widget
            // to light — the default follows the OS theme and
            // rendered dark on Juan's machine.
            theme: "light",
            callback: (token) => {
                executedRef.current = true;
                setInteractive(false);
                settlePending(token);
            },
            "error-callback": () => {
                executedRef.current = true;
                setInteractive(false);
                settlePending(null);
            },
            "expired-callback": () => {
                setInteractive(false);
                settlePending(null);
            },
            "timeout-callback": () => {
                executedRef.current = true;
                setInteractive(false);
                settlePending(null);
            },
            "unsupported-callback": () => {
                setInteractive(false);
                settlePending(null);
            },
            // The only moments the container takes up layout space:
            // Cloudflare is about to show its interactive box.
            "before-interactive-callback": () => {
                setInteractive(true);
                // U34: a human is now in the loop — give them the
                // long allowance instead of the 15s invisible cap.
                armPendingTimer(INTERACTIVE_TIMEOUT_MS);
            },
            "after-interactive-callback": () => setInteractive(false),
        });
        return widgetIdRef.current;
    };

    const resetWidget = () => {
        if (turnstileRef.current && widgetIdRef.current != null) {
            try {
                turnstileRef.current.reset(widgetIdRef.current);
            } catch {
                // A widget mid-teardown can refuse; the next
                // execute re-renders or reuses it as-is.
            }
        }
        executedRef.current = false;
    };

    // (Re)arms the in-flight execute()'s give-up timer. The
    // invisible path gets EXECUTE_TIMEOUT_MS; once an interactive
    // challenge is on screen, before-interactive re-arms it with
    // INTERACTIVE_TIMEOUT_MS so the wait can outlast the human.
    const armPendingTimer = (ms) => {
        if (!pendingRef.current) {
            return;
        }
        if (pendingRef.current.timer) {
            clearTimeout(pendingRef.current.timer);
        }
        pendingRef.current.timer = setTimeout(() => {
            // No token in time: fail the wait and clear any
            // challenge box that might be on screen, so the
            // caller's recovery starts from a clean widget.
            settlePending(null);
            setInteractive(false);
            resetWidget();
        }, ms);
    };

    useImperativeHandle(ref, () => ({
        execute() {
            if (!isTurnstileEnabled) {
                return Promise.resolve(null);
            }
            if (pendingRef.current) {
                return pendingRef.current.promise;
            }
            let resolveFn;
            const promise = new Promise((resolve) => {
                resolveFn = resolve;
            });
            pendingRef.current = { promise, resolve: resolveFn, timer: null };
            armPendingTimer(EXECUTE_TIMEOUT_MS);
            (async () => {
                try {
                    const turnstile = await loadTurnstileApi();
                    turnstileRef.current = turnstile;
                    if (!pendingRef.current) {
                        return; // settled while loading (reset/unmount)
                    }
                    const widgetId = renderWidget(turnstile);
                    if (widgetId == null) {
                        settlePending(null);
                        return;
                    }
                    if (executedRef.current) {
                        // Tokens are single-use: a widget that
                        // already produced one starts over.
                        resetWidget();
                    }
                    turnstile.execute(widgetId);
                } catch {
                    settlePending(null);
                }
            })();
            return promise;
        },
        reset() {
            settlePending(null);
            setInteractive(false);
            resetWidget();
        },
    }));

    // Unmount: never leave an execute() promise hanging, and
    // remove the widget if one was ever rendered.
    useEffect(
        () => () => {
            settlePending(null);
            if (turnstileRef.current && widgetIdRef.current != null) {
                try {
                    turnstileRef.current.remove(widgetIdRef.current);
                } catch {
                    // Already gone — nothing to clean up.
                }
                widgetIdRef.current = null;
            }
        },
        [],
    );

    if (!isTurnstileEnabled) return null;
    return (
        <div
            ref={containerRef}
            aria-hidden={!interactive}
            // Parked out of flow at zero size while idle, so the
            // widget leaves no gap in any layout; it only takes up
            // space if an interactive challenge actually appears.
            style={
                interactive
                    ? undefined
                    : {
                          position: "absolute",
                          width: 0,
                          height: 0,
                          overflow: "hidden",
                      }
            }
        />
    );
});

export default TurnstileWidget;
