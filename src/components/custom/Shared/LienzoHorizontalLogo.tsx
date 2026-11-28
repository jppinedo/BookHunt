import React from "react";

export type LienzoHorizontalLogoProps = {
  /** `onDark` lightens the mark and wordmark for dark backgrounds (e.g. Storybook sidebar). */
  variant?: "default" | "onDark";
  className?: string;
  width?: number | string;
  height?: number | string;
};

const MARK = {
  default: "#1d1e2b",
  onDark: "#e8e8ed",
} as const;

const WORDMARK = {
  default: "#1d1e2b",
  onDark: "#f5f5f5",
} as const;

/**
 * Horizontal Lienzo lockup: icon left, "LIENZO" right.
 * Wordmark is half the icon height and vertically centered; gap ~28 between mark and text.
 */
const LienzoHorizontalLogo = ({
  variant = "default",
  className,
  width = 140,
  height = 32,
}: LienzoHorizontalLogoProps) => {
  const markFill = MARK[variant];
  const wordFill = WORDMARK[variant];

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 250 61"
      role="img"
      aria-label="Lienzo"
    >
      {/* Icon: original group normalized so bbox starts near (0,0) */}
      <g transform="translate(-8.24,-2.12)">
        <g transform="translate(-66.546568,-170.53828)">
          <path
            style={{
              fill: markFill,
              fillOpacity: 1,
              stroke: "none",
            }}
            d="m 105.05614,172.65497 a 30.268673,30.268673 0 0 0 -30.26868,30.26869 30.268673,30.268673 0 0 0 27.45891,30.13044 l 0.90874,-17.31107 3.75779,-0.0366 0.85483,17.35536 a 30.268673,30.268673 0 0 0 27.55711,-30.13814 30.268673,30.268673 0 0 0 -30.2687,-30.26869 z m 1.62534,24.11776 c 0,0 2.69566,6.67233 2.19599,9.37888 -0.49967,2.70654 -1.92635,3.53929 -3.82133,3.66421 0,0 -2.22788,0.0832 -3.05505,-1.74894 -0.82718,-1.83212 -0.66743,-4.19856 1.58798,-6.45397 0.65346,-0.65345 1.67366,-1.57783 2.34309,-2.5075 0.66941,-0.92966 0.74932,-2.33268 0.74932,-2.33268 z m -0.0262,14.49361 0.0851,2.38659 -3.5102,0.0243 0.0793,-2.40508 z"
          />
          <circle style={{ fill: "#4c9e8f", fillOpacity: 0.996078, stroke: "none" }} cx="86.381226" cy="197.88084" r="2.7035062" />
          <circle style={{ fill: "#44b7a2", fillOpacity: 0.996078, stroke: "none" }} cx="121.08441" cy="209.87459" r="3.3425171" />
          <circle style={{ fill: "#ffb061", fillOpacity: 0.996078, stroke: "none" }} cx="88.937263" cy="210.12036" r="3.5882876" />
          <circle style={{ fill: "#f74f30", fillOpacity: 0.996078, stroke: "none" }} cx="92.767067" cy="220.29645" r="1.8678743" />
          <circle style={{ fill: "#ce7c6d", fillOpacity: 0.996078, stroke: "none" }} cx="116.9565" cy="220.49199" r="1.8187196" />
          <circle style={{ fill: "#5ca698", fillOpacity: 0.996078, stroke: "none" }} cx="116.36555" cy="184.21581" r="1.769565" />
          <circle style={{ fill: "#febf81", fillOpacity: 0.996078, stroke: "none" }} cx="113.12038" cy="190.41621" r="1.5306793" />
          <circle style={{ fill: "#343540", fillOpacity: 0.996078, stroke: "none" }} cx="114.63431" cy="198.58191" r="1.0928133" />
          <circle style={{ fill: "#515365", fillOpacity: 0.996078, stroke: "none" }} cx="96.435104" cy="198.84142" r="1.0928133" />
          <circle style={{ fill: "#ff6c51", fillOpacity: 0.996078, stroke: "none" }} cx="98.473267" cy="186.2803" r="4.9154634" />
          <circle style={{ fill: "#7d5d3d", fillOpacity: 0.996078, stroke: "none" }} cx="123.44385" cy="197.19266" r="3.1950531" />
        </g>
      </g>

      {/*
        Wordmark: half previous scale (icon/2), vertically centered, gap ~28 after icon.
        translate(88.54, 15.135) = iconRight(60.54) + gap(28), (iconH - textH) / 2
      */}
      <g
        aria-label="LIENZO"
        transform="translate(88.54,15.135) scale(0.560555) translate(-213.744,-1558)"
        style={{
          fontWeight: "bold",
          fill: wordFill,
        }}
      >
        <path d="m 239.88038,1612.0023 h -26.13601 v -52.704 h 6.264 v 46.728 h 19.87201 z" />
        <path d="m 262.92037,1612.0023 h -6.192 v -52.704 h 6.192 z" />
        <path d="m 314.90435,1565.4183 h -24.48 v 15.12 h 24.264 v 6.048 h -24.264 v 19.296 h 24.264 v 6.12 h -30.456 v -52.704 h 30.672 z" />
        <path d="m 374.8803,1612.0023 h -1.872 l -33.408,-38.232 v 38.232 h -6.336 v -52.704 h 1.872 l 33.624,38.736 v -38.736 h 6.12 z" />
        <path d="m 423.48028,1559.2983 -21.6,46.656 h 20.232 v 6.048 h -29.808 l 21.816,-46.728 h -19.152 v -5.976 z" />
        <path d="m 467.11225,1558.0023 q 7.704,0 14.184,3.672 6.48,3.6 10.152,10.008 3.744,6.408 3.744,13.968 0,7.488 -3.672,13.896 -3.672,6.408 -10.08,10.08 -6.408,3.672 -13.968,3.672 -7.488,0 -13.968,-3.6 -6.48,-3.672 -10.152,-10.008 -3.672,-6.408 -3.672,-13.896 0,-7.56 3.672,-13.968 3.672,-6.48 10.008,-10.152 6.408,-3.672 13.752,-3.672 z m 0.216,49.248 q 9,0 15.192,-6.12 6.264,-6.12 6.264,-15.336 0,-9.216 -6.336,-15.48 -6.264,-6.264 -15.12,-6.264 -9.072,0 -15.192,6.336 -6.048,6.264 -6.048,15.336 0,9 6.264,15.264 6.264,6.264 14.976,6.264 z" />
      </g>
    </svg>
  );
};

export default LienzoHorizontalLogo;
