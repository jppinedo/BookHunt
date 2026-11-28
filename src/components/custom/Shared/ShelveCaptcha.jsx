import React, { useRef, useState } from "react";
import { Check } from "react-feather";

/**
 * ShelveCaptcha — U23: a playful human check for the register form,
 * replacing a stock captcha now that email confirmation is off. A
 * bookshelf row (pure CSS/divs, no images) has one empty gap; the
 * loose book below it has to be dragged into the gap. One gesture,
 * ~5 seconds for a human, and the drag itself is the signal.
 *
 * Pointer Events only — pointerdown/move/up with setPointerCapture
 * is a single code path for mouse and touch; `touch-none`
 * (touch-action: none) stops the page scrolling mid-drag on mobile.
 * While dragging, the book lifts (scale + float shadow) with NO
 * transition so it tracks the pointer 1:1; on release the transition
 * comes back with a spring-like cubic-bezier, so the book either
 * snaps into the gap or springs back to its tray spot.
 * prefers-reduced-motion skips the spring entirely (0ms = instant
 * placement, same end states).
 *
 * Snap test: on release, the book's rendered center (its rect
 * includes the drag transform) is compared to the gap's center — a
 * generous 64px radius counts as "close enough", and the final
 * offset is corrected by the exact center delta, so a solved book
 * parks dead-center in the gap whatever the user's aim was.
 *
 * The gap slot and the loose book's color are randomized on mount
 * and on Reset. Solved state is reported through onSolve(boolean);
 * Reset reports false so the parent can re-gate the submit.
 *
 * U24: registration is now a multi-round flow — the parent mounts
 * a fresh ShelveCaptcha per round (key remount, so the gap
 * re-randomizes). The anti-bot timing guard moved in here from the
 * register page: a "solve" landing less than a second after THIS
 * shelf mounted can't be a human drag, so it doesn't count — the
 * book springs back like a miss and nothing is reported. Each
 * round's shelf times itself.
 */

// The shelf's seven slots. Heights/widths vary like real books; two
// carry tiny vertical spine titles (kept only where they stay clean
// at 8px). Colors are Lienzo palette tokens.
const SHELF_SLOTS = [
    { w: 24, h: 62, color: "bg-pio-teal-dark", title: "DUNE" },
    { w: 20, h: 54, color: "bg-pio-amber" },
    { w: 28, h: 64, color: "bg-pio-coral" },
    { w: 22, h: 58, color: "bg-pio-stone", title: "1984" },
    { w: 26, h: 63, color: "bg-pio-teal-dark-muted" },
    { w: 21, h: 56, color: "bg-pio-amber-muted" },
    { w: 25, h: 60, color: "bg-pio-coral-muted" },
];

// The loose book is 26x62; the gap placeholder matches its height
// and is 2px wider, so a parked book sits centered with 1px to spare.
const GAP_W = 28;
const GAP_H = 62;
const LOOSE_COLORS = ["bg-pio-coral", "bg-pio-teal-dark", "bg-pio-amber", "bg-pio-teal-dark-muted"];
const SNAP_DISTANCE = 64;

const randomGap = () => Math.floor(Math.random() * SHELF_SLOTS.length);
const randomColor = () => LOOSE_COLORS[Math.floor(Math.random() * LOOSE_COLORS.length)];

const ShelveCaptcha = ({ onSolve }) => {
    const [gapIndex, setGapIndex] = useState(randomGap);
    const [looseColor, setLooseColor] = useState(randomColor);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [solved, setSolved] = useState(false);

    const bookRef = useRef(null);
    const gapRef = useRef(null);
    // U24: when this shelf mounted — the too-fast-solve guard is
    // measured against it (see endDrag).
    const mountRef = useRef(Date.now());
    // Active drag: the pointer it belongs to, where it started, and
    // the book offset at that moment. Null between drags.
    const dragRef = useRef(null);

    const prefersReduced = useRef(
        typeof window !== "undefined" && typeof window.matchMedia === "function"
            ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
            : false
    ).current;

    // No transition while dragging (the book must track the pointer);
    // the spring only exists for the release animation.
    const transition = dragging
        ? "none"
        : `transform ${prefersReduced ? 0 : 450}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;

    const handlePointerDown = (e) => {
        if (solved) {
            return;
        }
        e.preventDefault();
        bookRef.current?.setPointerCapture?.(e.pointerId);
        dragRef.current = {
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            baseX: offset.x,
            baseY: offset.y,
        };
        setDragging(true);
    };

    const handlePointerMove = (e) => {
        const drag = dragRef.current;
        if (!drag || e.pointerId !== drag.pointerId) {
            return;
        }
        setOffset({
            x: drag.baseX + (e.clientX - drag.startX),
            y: drag.baseY + (e.clientY - drag.startY),
        });
    };

    const endDrag = (e) => {
        const drag = dragRef.current;
        if (!drag || e.pointerId !== drag.pointerId) {
            return;
        }
        dragRef.current = null;
        setDragging(false);

        const bookEl = bookRef.current;
        const gapEl = gapRef.current;
        if (!bookEl || !gapEl) {
            setOffset({ x: 0, y: 0 });
            return;
        }
        // Both rects are viewport-space and the book's includes its
        // drag transform, so the centers are where the user actually
        // sees the two shapes right now.
        const bookRect = bookEl.getBoundingClientRect();
        const gapRect = gapEl.getBoundingClientRect();
        const bookCx = bookRect.left + bookRect.width / 2;
        const bookCy = bookRect.top + bookRect.height / 2;
        const gapCx = gapRect.left + gapRect.width / 2;
        const gapCy = gapRect.top + gapRect.height / 2;

        if (Math.hypot(gapCx - bookCx, gapCy - bookCy) <= SNAP_DISTANCE) {
            // U24: a solve less than a second after this shelf
            // mounted is inhuman — it doesn't count. The book
            // springs back to its tray spot like a miss and the
            // round stays open.
            if (Date.now() - mountRef.current < 1000) {
                setOffset({ x: 0, y: 0 });
                return;
            }
            // Park it exactly: shift the offset by the center delta.
            setOffset({ x: offset.x + (gapCx - bookCx), y: offset.y + (gapCy - bookCy) });
            setSolved(true);
            onSolve?.(true);
        } else {
            setOffset({ x: 0, y: 0 });
        }
    };

    const handleReset = () => {
        dragRef.current = null;
        setDragging(false);
        setGapIndex(randomGap());
        setLooseColor(randomColor());
        setOffset({ x: 0, y: 0 });
        setSolved(false);
        onSolve?.(false);
    };

    return (
        <div className="w-full text-left">
            {/* Status row: the instruction, swapped for the success
                line once solved. aria-live makes the swap announce
                itself to assistive tech. */}
            <div className="flex items-center justify-between gap-2">
                <div aria-live="polite" className="text-[13px]">
                    {solved ? (
                        <span className="flex items-center gap-1.5 font-medium text-pio-teal-dark">
                            <Check size={14} className="shrink-0" aria-hidden="true" />
                            You&rsquo;re on the shelf.
                        </span>
                    ) : (
                        <span className="text-pio-text-muted">Drag the book onto the shelf</span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={handleReset}
                    className="shrink-0 text-xs text-pio-text-muted underline-offset-2 hover:underline"
                >
                    Reset
                </button>
            </div>

            {/* The shelf: books bottom-aligned on the board, one slot
                left empty (dashed outline = the drop hint). */}
            <div className="mt-2" aria-hidden="true">
                <div className="flex items-end justify-center gap-1 px-2">
                    {SHELF_SLOTS.map((slot, i) => (i === gapIndex ? (
                        <div
                            key={`gap-${i}`}
                            ref={gapRef}
                            style={{ width: GAP_W, height: GAP_H }}
                            className="shrink-0 rounded-t-md border border-dashed border-pio-text-muted/40 bg-pio-text-muted/5"
                        />
                    ) : (
                        <div
                            key={i}
                            style={{ width: slot.w, height: slot.h }}
                            className={`relative shrink-0 rounded-t-md rounded-b-[2px] shadow-sm ${slot.color}`}
                        >
                            <div className="mx-1 mt-1.5 h-1 rounded bg-white/25" />
                            {slot.title && (
                                <span
                                    className="absolute left-1/2 top-4 -translate-x-1/2 text-[8px] font-semibold uppercase tracking-widest text-white/75"
                                    style={{ writingMode: "vertical-rl" }}
                                >
                                    {slot.title}
                                </span>
                            )}
                        </div>
                    )))}
                </div>
                <div className="h-2 rounded-sm bg-pio-stone-dark shadow-pio-soft" />
            </div>

            {/* The tray: the loose book rests centered on a faint
                floor line until it's dragged up to the shelf. */}
            <div className="mt-1 flex h-[70px] items-end justify-center border-b border-pio-border-subtle">
                <div
                    ref={bookRef}
                    role="img"
                    aria-label="Loose book — drag it onto the shelf"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    className={`relative z-20 shrink-0 select-none rounded-t-md rounded-b-[2px] ${looseColor} ${solved ? "" : "cursor-grab touch-none active:cursor-grabbing"}`}
                    style={{
                        width: 26,
                        height: 62,
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${dragging ? 1.06 : 1})`,
                        transition,
                        boxShadow: dragging
                            ? "0 12px 32px -6px rgba(31, 36, 33, 0.12), 0 4px 12px -2px rgba(31, 36, 33, 0.06)"
                            : undefined,
                    }}
                >
                    <div className="mx-1 mt-1.5 h-1 rounded bg-white/25" />
                </div>
            </div>
        </div>
    );
};

export default ShelveCaptcha;
