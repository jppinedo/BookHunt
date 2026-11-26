import React from "react";
import { Spinner } from "@jppinedo/lienzo";

/**
 * LoadingResults — was MUI Paper + CircularProgress, then a Lienzo Card
 * around a Spinner. D2: restyled as a small floating pill in the same
 * visual family as the search field (white, warm hairline, soft
 * shadow) with a text label, so the loading state reads as part of the
 * search flow instead of a stray panel.
 */
const LoadingResults = ({ className }) => (
  <div className={`flex justify-center ${className || ''}`}>
    <div
      role="status"
      aria-label="Searching"
      className="flex items-center gap-3 bg-white border border-pio-grid rounded-full pl-4 pr-5 py-2.5 shadow-pio-soft"
    >
      <Spinner size="20px" thickness="3px" />
      <span className="text-sm font-medium text-pio-text-muted">Searching&hellip;</span>
    </div>
  </div>
);

export default LoadingResults;
