import React from "react";
import LienzoHorizontalLogo from './LienzoHorizontalLogo';

/**
 * Footer — U17: a simple app footer, rendered once at shell level
 * (App.jsx) so it closes EVERY page, app and auth alike: the
 * copyright line, then "Built with" + the Lienzo lockup. The logo
 * is Juan's own LienzoHorizontalLogo component from the Lienzo repo
 * — a self-contained inline SVG (mark + wordmark), no image asset.
 *
 * Styling follows the U15/U16 hairline (border-pio-grid/60) and the
 * muted small-text register of the breadcrumb meta. The bottom
 * padding below lg is deliberately deep (pb-24): the HubNav pill is
 * position:fixed 14px off the bottom edge, so in-flow content needs
 * ~90px of clearance or the bar floats over the footer. At lg the
 * rail replaces the pill and normal padding returns. The wrapper is
 * .page-shell, and App.jsx renders the footer inside the shell's
 * content column, so the lg rail offset (lg:pl-[72px]) applies.
 *
 * U19 (Juan's review): line 2 is now ONE link to the Lienzo site —
 * "Built with [logo] design system" — opening lienzo.pinedo.cl in a
 * new tab. The hover state (underline on the words, slight fade)
 * and the coral focus ring mark it as clickable without leaving the
 * footer's muted register. NOTE: this footer's rendered height is
 * measured into the .search-home-state min-height in index.css so
 * the home page fits one viewport WITH the footer visible — if the
 * spacing or line count here changes, redo that math.
 */
const Footer = () => (
    <footer className="page-shell mt-10 pb-24 lg:pb-8">
        <div className="border-t border-pio-grid/60 pt-5 flex flex-col items-center gap-2 text-center">
            <p className="text-[13px] leading-snug text-pio-text-muted m-0">
                © 2026 Juan Pablo Pinedo
            </p>
            <a
                href="https://lienzo.pinedo.cl/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[13px] leading-snug text-pio-text-muted no-underline rounded-sm transition hover:underline hover:underline-offset-2 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pio-coral"
            >
                Built with
                <LienzoHorizontalLogo width={82} height={20} />
                design system
            </a>
        </div>
    </footer>
);

export default Footer;
