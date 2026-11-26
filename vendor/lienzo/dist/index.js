import e, { cloneElement as t, useCallback as n, useEffect as r, useId as i, useLayoutEffect as a, useMemo as o, useRef as s, useState as c } from "react";
import { Fragment as l, jsx as u, jsxs as d } from "react/jsx-runtime";
import { Check as f, ChevronDown as p, ChevronLeft as m, ChevronRight as h, Copy as g } from "react-feather";
import { DayFlag as _, DayPicker as v, SelectionState as y, UI as b, getDefaultClassNames as x } from "react-day-picker";
import "react-day-picker/style.css";
import { Highlight as S } from "prism-react-renderer";
import { CartesianGrid as ee, Line as C, LineChart as w, ReferenceLine as T, ResponsiveContainer as E, Tooltip as D, XAxis as O, YAxis as k } from "recharts";
import { createPortal as A } from "react-dom";
// src/components/atoms/Background/nextBackgroundSvgId.ts
var j = 0;
function M(e) {
	return j += 1, `${e}-${j}-${Math.random().toString(36).slice(2, 11)}`;
}
// src/components/atoms/Background/GradientBackground.tsx
var N = ({ colors: e, isHexColors: t, children: n, className: r, rounded: i = !1 }) => {
	let a = s(M("bg-gradient")).current, o = s(M("bg-turbulence")).current, c = e.map((n, r) => /* @__PURE__ */ u("stop", {
		offset: `${r / (e.length - 1 || 1) * 100}%`,
		style: { stopColor: t ? n : `var(--${n})` }
	}, r));
	return /* @__PURE__ */ d("div", {
		style: {
			boxSizing: "border-box",
			position: "relative",
			width: "100%",
			height: "100%"
		},
		className: `${r || ""} ${i ? "rounded-3xl" : ""} overflow-hidden`.trim(),
		children: [/* @__PURE__ */ d("svg", {
			style: {
				position: "absolute",
				width: "100%",
				height: "100%",
				overflow: "hidden",
				zIndex: 1
			},
			xmlns: "http://www.w3.org/2000/svg",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ d("defs", { children: [/* @__PURE__ */ u("linearGradient", {
				id: a,
				x1: "0%",
				y1: "0%",
				x2: "100%",
				y2: "100%",
				children: c
			}), /* @__PURE__ */ d("filter", {
				id: o,
				x: "0",
				y: "0",
				children: [/* @__PURE__ */ u("feTurbulence", {
					type: "turbulence",
					baseFrequency: "0.01",
					numOctaves: "2",
					result: "turbulence"
				}), /* @__PURE__ */ u("feDisplacementMap", {
					in2: "turbulence",
					in: "SourceGraphic",
					scale: "50",
					xChannelSelector: "R",
					yChannelSelector: "G"
				})]
			})] }), /* @__PURE__ */ u("rect", {
				x: "-30",
				y: "-30",
				width: "130%",
				height: "130%",
				fill: `url(#${a})`,
				filter: `url(#${o})`
			})]
		}), n != null && /* @__PURE__ */ u("div", {
			style: {
				position: "relative",
				zIndex: 2,
				width: "100%",
				height: "100%"
			},
			children: n
		})]
	});
};
// src/components/atoms/Background/resolveBackgroundColor.ts
function P(e, t) {
	return t ? e : `rgb(var(--lz-${e}) / 1)`;
}
// src/components/atoms/Background/DottedBackground.tsx
var F = ({ colors: e, darkColors: t, isHexColors: n, children: r, className: i, rounded: a = !1, vignette: o = !1, vignetteColor: s, darkVignetteColor: c }) => {
	let l = e[0], f = e[1] ?? e[0], p = s ?? l, m = !!t?.length, h = t?.[0], g = t?.[1] ?? h, _ = c ?? h, v = m && h ? {
		"--bg-dotted-fill-light": P(l, n),
		"--bg-dotted-dot-light": P(f, n),
		"--bg-dotted-vignette-light": P(p, n),
		"--bg-dotted-fill-dark": P(h, n),
		"--bg-dotted-dot-dark": P(g ?? h, n),
		"--bg-dotted-vignette-dark": P(_ ?? h, n)
	} : {
		"--bg-dotted-fill": P(l, n),
		"--bg-dotted-dot": P(f, n),
		"--bg-dotted-vignette": P(p, n)
	};
	return /* @__PURE__ */ d("div", {
		className: `bg-dotted ${m ? "bg-dotted--themeable" : ""} ${a ? "rounded-3xl" : ""} ${i || ""}`.trim(),
		style: v,
		children: [
			/* @__PURE__ */ u("div", {
				className: "bg-dotted__pattern",
				"aria-hidden": "true"
			}),
			o && /* @__PURE__ */ u("div", {
				className: "bg-dotted__vignette",
				"aria-hidden": "true"
			}),
			r != null && /* @__PURE__ */ u("div", {
				className: "bg-dotted__content",
				children: r
			})
		]
	});
}, I = (e) => {
	switch (e.type ?? "gradient") {
		case "dotted": return /* @__PURE__ */ u(F, { ...e }, "dotted");
		default: return /* @__PURE__ */ u(N, { ...e }, "gradient");
	}
}, L = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold font-jakarta border", te = {
	coral: "bg-pio-coral-pale text-pio-coral border-pio-coral-opacity-20",
	teal: "bg-pio-teal-dark-opacity-14 text-pio-teal-dark border-pio-teal-dark-opacity-20 dark:text-pio-teal-dark-muted",
	amber: "bg-pio-amber-pale text-pio-amber-dark border-pio-amber-opacity-20 dark:text-pio-amber"
}, ne = {
	coral: "bg-pio-coral",
	teal: "bg-pio-teal-dark",
	amber: "bg-pio-amber"
}, R = ({ label: e, tone: t = "coral", dot: n = !1, className: r }) => /* @__PURE__ */ d("span", {
	className: `${L} ${te[t]} ${r || ""}`.trim(),
	children: [n && /* @__PURE__ */ u("span", {
		className: `w-1.5 h-1.5 rounded-full shrink-0 ${ne[t]}`,
		"aria-hidden": "true"
	}), e]
}), z = {
	default: "bg-pio-grid p-1 rounded-3xl overflow-hidden text-black dark:bg-gray-800 dark:text-blue-200",
	glass: "bg-white-opacity-14 border border-gray-100 dark:border-gray-600 dark:bg-gray-opacity-14 rounded-3xl p-5 dark:text-white"
}, re = {
	soft: "shadow-pio-soft",
	card: "shadow-pio-card",
	none: ""
}, ie = "bg-pio-bg-light rounded-[1.3rem] overflow-hidden dark:bg-gray-900", B = "px-5 pt-5 pb-2", ae = "px-3 py-3", oe = ({ children: e, className: t, type: n = "default", header: r, footer: i, headerOutside: a = !1, shadow: o = "none" }) => {
	let s = re[o];
	if (n === "glass") return /* @__PURE__ */ d("div", {
		className: `${z.glass} ${s} ${t || ""}`,
		children: [
			r != null && /* @__PURE__ */ u("div", {
				"data-box-header": !0,
				children: r
			}),
			e,
			i != null && /* @__PURE__ */ u("div", {
				"data-box-footer": !0,
				children: i
			})
		]
	});
	let c = r == null ? null : /* @__PURE__ */ u("div", {
		"data-box-header": !0,
		className: a ? ae : B,
		children: r
	});
	return /* @__PURE__ */ d("div", {
		className: `${z.default} ${s} ${t || ""}`,
		children: [
			a && c,
			/* @__PURE__ */ d("div", {
				"data-box-content-area": !0,
				className: ie,
				children: [!a && c, /* @__PURE__ */ u("div", {
					"data-box-content": !0,
					className: "p-5",
					children: e
				})]
			}),
			i != null && /* @__PURE__ */ u("div", {
				"data-box-footer": !0,
				className: "px-5 py-3",
				children: i
			})
		]
	});
}, V = {
	default: {
		solid: "bg-gray-100 hover:bg-gray-opacity-30 text-gray-700",
		outline: "text-gray-700 border-gray-300 border-2 bg-transparent hover:bg-gray-opacity-14 dark:text-blue-200",
		ghost: "text-gray-700 bg-transparent hover:bg-gray-opacity-14 dark:text-blue-200"
	},
	green: {
		solid: "bg-pio-teal-dark hover:bg-pio-teal-dark-hover text-white",
		outline: "text-pio-teal-dark border-pio-teal-dark border-2 bg-transparent hover:bg-pio-teal-dark-opacity-14",
		ghost: "text-pio-teal-dark bg-transparent hover:bg-pio-teal-dark-opacity-14"
	},
	yellow: {
		solid: "bg-pio-amber hover:bg-pio-amber-hover text-pio-amber-dark",
		outline: "text-pio-amber-dark border-pio-amber hover:bg-pio-amber-opacity-14 border-2 bg-transparent dark:text-pio-amber",
		ghost: "text-pio-amber-dark bg-transparent hover:bg-pio-amber-opacity-14"
	},
	red: {
		solid: "bg-pio-coral hover:bg-pio-coral-hover text-white",
		outline: "text-pio-coral border-pio-coral border-2 bg-transparent hover:bg-pio-coral-opacity-14",
		ghost: "text-pio-coral bg-transparent hover:bg-pio-coral-opacity-14"
	},
	mode: {
		default: "flex items-center justify-center",
		tool: "items-center flex flex-col"
	},
	size: {
		default: {
			xs: "px-2 py-0.5 text-xs rounded-lg",
			sm: "px-2.5 py-1 text-sm rounded-lg",
			md: "px-3 py-1 text-sm rounded-xl",
			lg: "px-4 py-1.5 text-base rounded-xl",
			xl: "px-5 py-2 text-lg rounded-2xl"
		},
		tool: {
			xs: "text-[10px] py-1 px-1.5 rounded-sm",
			sm: "text-xs py-1.5 px-2 rounded-sm",
			md: "text-xs py-2 px-3 rounded-md",
			lg: "text-sm py-2.5 px-4 rounded-md",
			xl: "text-base py-3 px-5 rounded-lg"
		}
	}
}, H = {
	default: {
		xs: "14",
		sm: "16",
		md: "18",
		lg: "20",
		xl: "22"
	},
	tool: {
		xs: "20",
		sm: "24",
		md: "32",
		lg: "36",
		xl: "40"
	}
}, U = {
	default: {
		solid: "text-gray-300",
		outline: "text-gray-300",
		ghost: "text-gray-300"
	},
	green: {
		solid: "text-white",
		outline: "text-pio-teal-dark",
		ghost: "text-pio-teal-dark"
	},
	yellow: {
		solid: "text-pio-amber-dark",
		outline: "text-pio-amber-dark dark:text-pio-amber",
		ghost: "text-pio-amber-dark dark:text-pio-amber"
	},
	red: {
		solid: "text-white",
		outline: "text-pio-coral",
		ghost: "text-pio-coral"
	}
}, se = ({ label: n, onClick: r, ariaLabel: i, mode: a = "default", type: o = "default", fill: s = "solid", size: c = "md", icon: f, iconPosition: p = "left" }) => {
	let m = V.mode[a], h = V.size[a][c], g = V[o][s], _ = (n) => e.isValidElement(f) && !f.props.size ? t(f, { size: n }) : f;
	return /* @__PURE__ */ u("button", {
		className: `lz-button-${a} ${m} ${h} ${g}`,
		onClick: r,
		"aria-label": i,
		children: u(a === "tool" ? () => {
			let e;
			f && (e = _(H.tool[c]));
			let t = U[o][s], r = /* @__PURE__ */ u("span", {
				className: t,
				children: e
			});
			return /* @__PURE__ */ d(l, { children: [
				f && p === "top" && r,
				n && n,
				f && p === "bottom" && r
			] });
		} : () => {
			let e;
			f && (e = _(H.default[c]));
			let t = /* @__PURE__ */ u("span", {
				className: `${p === "left" ? "mr-2" : "ml-2"} ${U[o]}`,
				children: e
			});
			return /* @__PURE__ */ d(l, { children: [
				f && p === "left" && t,
				n && n,
				f && p === "right" && t
			] });
		}, {})
	});
}, ce = {
	"2xl": "rounded-2xl",
	"3xl": "rounded-3xl"
}, le = {
	white: "bg-white dark:bg-gray-800",
	subtle: "bg-pio-bg-light dark:bg-gray-900",
	transparent: "bg-transparent dark:bg-transparent"
}, ue = {
	soft: "shadow-pio-soft",
	card: "shadow-pio-card",
	none: ""
}, de = "border border-pio-grid overflow-hidden text-pio-text dark:border-gray-600 dark:text-blue-200", fe = "p-6 sm:p-7", pe = ({ children: e, className: t, padded: n = !0, radius: r = "3xl", surface: i = "white", shadow: a = "soft" }) => {
	let o = [
		de,
		ce[r],
		le[i],
		ue[a],
		n ? fe : "",
		t || ""
	].filter(Boolean).join(" ");
	return /* @__PURE__ */ u("div", {
		className: o,
		children: e
	});
}, me = "flex inline-flex items-center justify-center cursor-pointer outline-hidden border transition-colors duration-150", he = {
	sm: "h-4 w-4 p-0.5 rounded-md",
	md: "h-5 w-5 p-1 rounded-md",
	lg: "h-6 w-6 p-1 rounded-lg"
}, ge = "bg-pio-bg border-pio-grid dark:bg-gray-700 dark:border-gray-600", _e = {
	default: "bg-gray-600 border-gray-600 dark:bg-gray-500 dark:border-gray-500",
	green: "bg-pio-teal-dark border-pio-teal-dark",
	red: "bg-pio-coral border-pio-coral",
	yellow: "bg-pio-amber border-pio-amber"
}, ve = {
	default: "text-white",
	green: "text-white",
	red: "text-white",
	yellow: "text-pio-amber-dark"
}, ye = ({ size: e = "md", type: t = "default", onChange: n, isChecked: i = !1, className: a }) => {
	let [o, s] = c(i), l = () => {
		s(!o), n && n(!o);
	};
	r(() => {
		s(i);
	}, [i]);
	let d = o ? _e[t] : ge, p = a || "";
	return /* @__PURE__ */ u("div", {
		className: `${me} ${d} ${he[e]} ${p}`,
		onClick: l,
		role: "checkbox",
		"aria-checked": o,
		tabIndex: 0,
		children: o && /* @__PURE__ */ u(f, { className: ve[t] })
	});
}, be = ({ colorClass: e = "bg-pio-coral", thickness: t = 1, size: n = "6rem" }) => /* @__PURE__ */ u("div", {
	className: "circle-spinner border-gray-opacity-30",
	style: {
		borderWidth: `${t}rem`,
		width: n,
		height: n
	},
	children: /* @__PURE__ */ u("div", {
		className: `inner-circle ${e}`,
		style: {
			width: `${t}rem`,
			height: `${t}rem`,
			transformOrigin: `-${parseInt(n) / 2 - t}rem 0px`
		}
	})
}), xe = {
	none: "rounded-none",
	default: "rounded-sm",
	sm: "rounded-xs",
	md: "rounded-md",
	lg: "rounded-lg",
	full: "rounded-full"
}, W = {
	default: {
		solid: {
			container: "bg-gray-opacity-14 hover:bg-gray-opacity-20 border-2 px-3",
			focused: "border-pio-coral",
			unfocused: "border-transparent",
			icon: "text-gray-300",
			hint: "text-gray-300",
			input: "placeholder:text-gray-300 text-gray-700 dark:text-blue-200"
		},
		outline: {
			container: "bg-transparent border hover:bg-gray-opacity-14 px-3",
			focused: "border-pio-coral",
			unfocused: "border-gray-300",
			icon: "text-gray-300",
			hint: "text-gray-300",
			input: "placeholder:text-gray-300 text-gray-700 dark:text-blue-200"
		},
		ghost: {
			container: "bg-transparent hover:bg-gray-opacity-14 border-2 px-3",
			focused: "border-pio-coral",
			unfocused: "border-transparent",
			icon: "text-gray-300",
			hint: "text-gray-300",
			input: "placeholder:text-gray-300 text-gray-700 dark:text-blue-200"
		}
	},
	red: {
		solid: {
			container: "bg-pio-coral-opacity-14 hover:bg-pio-coral-opacity-20 border-2 px-2",
			focused: "border-pio-coral",
			unfocused: "border-transparent",
			icon: "text-pio-coral-muted",
			hint: "text-pio-coral-muted",
			input: "placeholder:text-pio-coral-muted text-pio-coral-dark"
		},
		outline: {
			container: "bg-transparent border hover:bg-pio-coral-opacity-14 px-3",
			focused: "border-pio-coral",
			unfocused: "border-pio-coral-muted",
			icon: "text-pio-coral-muted",
			hint: "text-pio-coral-muted",
			input: "placeholder:text-pio-coral-muted text-pio-coral-dark"
		},
		ghost: {
			container: "bg-transparent hover:bg-pio-coral-opacity-14 border-2 px-2",
			focused: "border-pio-coral",
			unfocused: "border-transparent",
			icon: "text-pio-coral-muted",
			hint: "text-pio-coral-muted",
			input: "placeholder:text-pio-coral-muted text-pio-coral-dark"
		}
	},
	green: {
		solid: {
			container: "bg-pio-teal-dark-opacity-14 hover:bg-pio-teal-dark-opacity-20 border-2 px-2",
			focused: "border-pio-teal-dark",
			unfocused: "border-transparent",
			icon: "text-pio-teal-dark-muted",
			hint: "text-pio-teal-dark-muted",
			input: "placeholder:text-pio-teal-dark-muted text-pio-teal-dark"
		},
		outline: {
			container: "bg-transparent border hover:bg-pio-teal-dark-opacity-14 px-3",
			focused: "border-pio-teal-dark",
			unfocused: "border-pio-teal-dark-muted",
			icon: "text-pio-teal-dark-muted",
			hint: "text-pio-teal-dark-muted",
			input: "placeholder:text-pio-teal-dark-muted text-pio-teal-dark"
		},
		ghost: {
			container: "bg-transparent hover:bg-pio-teal-dark-opacity-14 border-2 px-2",
			focused: "border-pio-teal-dark",
			unfocused: "border-transparent",
			icon: "text-pio-teal-dark-muted",
			hint: "text-pio-teal-dark-muted",
			input: "placeholder:text-pio-teal-dark-muted text-pio-teal-dark"
		}
	},
	label: "text-gray-700 dark:text-blue-200 font-jakarta text-sm font-medium",
	container: "input-group flex items-center gap-2 h-12 min-h-12 box-border w-full",
	input: "grow bg-transparent h-full outline-hidden min-w-0 font-jakarta text-[15px]"
}, Se = ({ type: e = "default", htmlType: n = "text", fill: r = "solid", rounded: i = "lg", label: a, placeholder: o = "Enter your text", icon: s, iconPosition: f = "left", hint: p, initialValue: m, value: h, id: g, name: _, disabled: v, readOnly: y, autoComplete: b, onChange: x }) => {
	let [S, ee] = c(m || ""), [C, w] = c(!1), T = h !== void 0, E = T ? h : S, D = (e) => {
		T || ee(e.target.value), x?.(e);
	}, O = W[e][r], k = [
		W.container,
		xe[i],
		O.container,
		C ? O.focused : O.unfocused
	].join(" "), A = [W.input, O.input].join(" "), j = s && !s.props.size ? t(s, { size: 18 }) : s, M = j && /* @__PURE__ */ u("div", {
		className: O.icon,
		children: j
	}), N = /* @__PURE__ */ d(l, { children: [/* @__PURE__ */ d("div", {
		className: k,
		children: [
			M && f === "left" && M,
			/* @__PURE__ */ u("input", {
				className: A,
				type: n,
				id: g,
				name: _,
				disabled: v,
				readOnly: y,
				autoComplete: b,
				value: E,
				onChange: D,
				onFocus: () => w(!0),
				onBlur: () => w(!1),
				placeholder: o
			}),
			M && f === "right" && M
		]
	}), p && /* @__PURE__ */ u("p", {
		className: `text-sm ${O.hint}`,
		children: p
	})] });
	return a ? /* @__PURE__ */ d("label", {
		className: `input ${W.label}`,
		children: [a, N]
	}) : /* @__PURE__ */ u("div", {
		className: "input",
		children: N
	});
}, G = {
	default: {
		label: "text-gray-700 dark:text-blue-200",
		items: "bg-gray-300 text-white",
		icon: "text-gray-300"
	},
	red: {
		label: "text-pio-coral",
		items: "bg-pio-coral-hover text-white",
		icon: "text-pio-coral-hover"
	},
	yellow: {
		label: "text-pio-amber-dark dark:text-pio-amber",
		items: "bg-pio-amber text-pio-amber-dark",
		icon: "text-pio-amber"
	},
	green: {
		label: "text-pio-teal-dark",
		items: "bg-pio-teal-dark-hover text-white",
		icon: "text-pio-teal-dark-hover"
	},
	container: "flex whitespace-nowrap"
}, Ce = ({ className: e, items: t, icon: n, type: r = "default", text: i }) => /* @__PURE__ */ d("div", {
	className: `items-center ${G.container} ${e}`,
	children: [
		n && /* @__PURE__ */ u("span", {
			className: `${G[r].icon} mr-2`,
			children: n
		}),
		/* @__PURE__ */ u("span", {
			className: G[r].label,
			children: i
		}),
		t && /* @__PURE__ */ u("span", {
			className: `${G[r].items} ml-2 text-xs lz-label-badge rounded-md`,
			children: t
		})
	]
}), we = ({ options: e, placeholder: t = "Select an option" }) => {
	let [n, r] = c(!1), [i, a] = c(null), o = () => r(!n), s = (e) => {
		a(e), r(!1);
	};
	return /* @__PURE__ */ d("div", {
		className: "relative",
		children: [/* @__PURE__ */ d("div", {
			className: "flex items-center justify-between px-4 py-2 bg-white border rounded-sm cursor-pointer",
			onClick: o,
			children: [/* @__PURE__ */ u("span", { children: i ? i.label : t }), /* @__PURE__ */ u("svg", {
				className: "w-6 h-6 text-gray-500",
				fill: "none",
				stroke: "currentColor",
				viewBox: "0-9 17 17",
				children: /* @__PURE__ */ u("path", {
					strokeLinecap: "round",
					strokeLinejoin: "round",
					strokeWidth: "2",
					d: "M19 9l-7 7-7-7"
				})
			})]
		}), n && /* @__PURE__ */ u("div", {
			className: "absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-sm shadow-lg",
			children: e.map((e, t) => /* @__PURE__ */ u("div", {
				className: "px-4 py-2 cursor-pointer hover:bg-gray-100",
				onClick: () => s(e),
				children: e.label
			}, t))
		})]
	});
}, Te = ({ colorClass: e = "border-pio-coral", size: t = "60px", thickness: n = "16px" }) => /* @__PURE__ */ u("div", {
	className: `spinner ${e}`,
	style: {
		borderWidth: n,
		width: t,
		height: t
	}
}), Ee = {
	sm: {
		container: "h-3 w-6",
		thumb: "top-0.5 left-0.5 h-2 w-2",
		thumbOn: "translate-x-3"
	},
	md: {
		container: "h-5 w-9",
		thumb: "top-0.5 left-0.5 h-4 w-4",
		thumbOn: "translate-x-full"
	},
	lg: {
		container: "h-6 w-12",
		thumb: "top-0.5 left-0.5 h-5 w-5",
		thumbOn: "translate-x-6"
	}
}, De = "bg-pio-grid dark:bg-gray-600", Oe = {
	default: "bg-gray-600 dark:bg-gray-500",
	green: "bg-pio-teal-dark",
	red: "bg-pio-coral",
	yellow: "bg-pio-amber"
}, ke = "absolute rounded-full bg-white border border-pio-grid dark:border-none transition-transform duration-200 ease-in-out", Ae = "relative inline-grid grid-cols-2 items-stretch rounded-full border p-0.5", je = {
	default: "bg-pio-bg-light border-pio-grid dark:bg-gray-800 dark:border-gray-700",
	green: "bg-pio-teal-dark-pale border-pio-teal-dark-opacity-20 dark:bg-pio-teal-dark-opacity-20 dark:border-pio-teal-dark",
	red: "bg-pio-coral-pale border-pio-coral-opacity-20 dark:bg-pio-coral-opacity-20 dark:border-pio-coral",
	yellow: "bg-pio-amber-pale border-pio-amber-opacity-20 dark:bg-pio-amber-opacity-20 dark:border-pio-amber"
}, Me = "absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-white shadow-xs border border-pio-grid/60 transition-transform duration-200 ease-in-out pointer-events-none dark:bg-gray-900 dark:border-gray-600", Ne = {
	sm: {
		option: "gap-1 px-2 py-1 text-[10px] leading-none",
		icon: "[&_svg]:w-3 [&_svg]:h-3"
	},
	md: {
		option: "gap-1.5 px-3 py-1.5 text-xs leading-none",
		icon: "[&_svg]:w-3.5 [&_svg]:h-3.5"
	},
	lg: {
		option: "gap-1.5 px-3.5 py-2 text-sm leading-none",
		icon: "[&_svg]:w-4 [&_svg]:h-4"
	}
}, Pe = "relative z-10 flex items-center justify-center rounded-full font-jakarta select-none cursor-pointer transition-colors duration-200", Fe = {
	default: "font-bold text-pio-text dark:text-white",
	green: "font-bold text-pio-teal-dark dark:text-pio-teal-dark-pale",
	red: "font-bold text-pio-coral dark:text-pio-coral-pale",
	yellow: "font-bold text-pio-amber dark:text-pio-amber-pale"
}, Ie = "font-medium text-pio-text-muted dark:text-gray-300", Le = ({ size: e = "md", type: t = "default", isActive: n = !1, onChange: i, className: a, offLabel: o, onLabel: s, offIcon: l, onIcon: f }) => {
	let [p, m] = c(n), h = !!(o || s || l || f);
	r(() => {
		m(n);
	}, [n]);
	let g = (e) => {
		e !== p && (m(e), i?.(e));
	}, _ = () => g(!p), v = (e) => {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), _());
	}, y = a || "";
	if (h) {
		let n = Ne[e], r = t !== "default", i = (e, i, a, o) => /* @__PURE__ */ d("div", {
			className: [
				Pe,
				n.option,
				n.icon,
				e ? Fe[t] : Ie
			].join(" "),
			onClick: (e) => {
				e.stopPropagation(), o();
			},
			onKeyDown: (e) => {
				(e.key === "Enter" || e.key === " ") && (e.preventDefault(), e.stopPropagation(), o());
			},
			role: "presentation",
			children: [a != null && /* @__PURE__ */ u("span", {
				className: ["flex items-center justify-center", e ? r ? "[&_svg]:text-current" : "" : "text-pio-text-muted dark:text-gray-400 [&_svg]:text-current"].filter(Boolean).join(" "),
				"aria-hidden": !0,
				children: a
			}), i != null && i !== "" && /* @__PURE__ */ u("span", { children: i })]
		});
		return /* @__PURE__ */ d("div", {
			className: `${Ae} ${je[t]} ${y}`,
			onClick: _,
			onKeyDown: v,
			role: "switch",
			"aria-checked": p,
			tabIndex: 0,
			children: [
				/* @__PURE__ */ u("div", {
					className: `${Me} ${p ? "translate-x-full" : "translate-x-0"}`,
					"aria-hidden": !0
				}),
				i(!p, o, l, () => g(!1)),
				i(p, s, f, () => g(!0))
			]
		});
	}
	let b = Ee[e], x = p ? Oe[t] : De;
	return /* @__PURE__ */ u("div", {
		className: `relative ${b.container} rounded-full cursor-pointer ${x} ${y}`,
		onClick: _,
		onKeyDown: v,
		role: "switch",
		"aria-checked": p,
		tabIndex: 0,
		children: /* @__PURE__ */ u("div", { className: `${ke} ${b.thumb} ${p ? b.thumbOn : "translate-x-0"}` })
	});
}, K = {
	default: "",
	sm: "text-base",
	md: "text-lg",
	lg: "text-xl",
	xl: "text-2xl",
	xxl: "text-3xl",
	xxxl: "text-5xl",
	xxxxl: "text-7xl",
	base: "text-gray-600 dark:text-white",
	colorMuted: "text-pio-text-muted",
	colorDisplay: "text-pio-text dark:text-white",
	uppercase: "uppercase tracking-widest",
	playfairTracking: "tracking-tight",
	withDot: "inline-flex items-center gap-2.5",
	fontFamily: {
		lexend: "font-lexend",
		poppins: "font-poppins",
		playfair: "font-playfair",
		jakarta: "font-jakarta"
	},
	thikness: {
		thin: "font-thin",
		regular: "font-regular",
		bold: "font-bold"
	},
	fontFamilyCss: {
		lexend: "'Lexend', sans-serif",
		poppins: "'Poppins', sans-serif",
		playfair: "'Playfair Display', Georgia, serif",
		jakarta: "'Plus Jakarta Sans', system-ui, sans-serif"
	},
	thiknessCss: {
		thin: 100,
		regular: 400,
		bold: 700
	},
	color: {
		coral: "text-pio-coral",
		teal: "text-pio-teal-dark",
		amber: "text-pio-amber",
		stone: "text-pio-stone"
	},
	gradient: {
		"amber-dawn": "lz-title-gradient-amber-dawn",
		"studio-teal": "lz-title-gradient-studio-teal",
		"charcoal-depth": "lz-title-gradient-charcoal-depth",
		"coral-ember": "lz-title-gradient-coral-ember",
		"teal-mist": "lz-title-gradient-teal-mist",
		"deep-coral": "lz-title-gradient-deep-coral"
	},
	dot: {
		coral: "w-2 h-2 rounded-full shrink-0 bg-pio-coral",
		teal: "w-2 h-2 rounded-full shrink-0 bg-pio-teal-dark",
		amber: "w-2 h-2 rounded-full shrink-0 bg-pio-amber"
	}
}, Re = ({ size: e = "md", children: t, thikness: n = "regular", fontFamily: r = "poppins", className: i, uppercase: a = !1, dot: o = !1, dotTone: s = "coral", gradient: c, color: l }) => {
	let f = {
		sm: "h5",
		md: "h4",
		lg: "h3",
		xl: "h2",
		xxl: "h1",
		xxxl: "h1",
		xxxxl: "h1"
	}[e], p = [
		"m-0",
		c ? K.gradient[c] : l ? K.color[l] : a ? K.colorMuted : r === "playfair" ? K.colorDisplay : K.base,
		K[e],
		K.thikness[n],
		K.fontFamily[r],
		a ? K.uppercase : "",
		r === "playfair" ? K.playfairTracking : "",
		o ? K.withDot : "",
		i || ""
	].filter(Boolean).join(" ");
	return /* @__PURE__ */ d(f, {
		className: p,
		style: {
			fontFamily: K.fontFamilyCss[r],
			fontWeight: K.thiknessCss[n]
		},
		children: [o ? /* @__PURE__ */ u("span", {
			className: K.dot[s],
			"aria-hidden": "true"
		}) : null, t]
	});
}, q = x(), ze = {
	...q,
	[b.Root]: "rdp-root w-fit bg-pio-bg-light rounded-xl p-4 font-lexend text-pio-text dark:bg-gray-800 dark:text-blue-200",
	[b.MonthCaption]: "rdp-month_caption flex items-center justify-center gap-2 pb-3 min-w-0",
	[b.CaptionLabel]: "rdp-caption_label text-pio-text font-lexend font-regular text-center dark:text-blue-200",
	[b.Nav]: "rdp-nav flex items-center justify-between w-full gap-2",
	[b.PreviousMonthButton]: "rdp-button_previous inline-flex items-center justify-center w-9 h-9 rounded-lg text-pio-text hover:bg-gray-opacity-14 dark:text-blue-200 dark:hover:bg-gray-opacity-14 transition-colors focus-visible:ring-2 focus-visible:ring-pio-teal-dark",
	[b.NextMonthButton]: "rdp-button_next inline-flex items-center justify-center w-9 h-9 rounded-lg text-pio-text hover:bg-gray-opacity-14 dark:text-blue-200 dark:hover:bg-gray-opacity-14 transition-colors focus-visible:ring-2 focus-visible:ring-pio-teal-dark",
	[b.Chevron]: "rdp-chevron w-4 h-4 text-pio-text dark:text-blue-200",
	[b.Weekdays]: "rdp-weekdays grid grid-cols-7 mb-1",
	[b.Weekday]: "rdp-weekday text-pio-text text-center text-sm font-lexend py-1 dark:text-gray-300",
	[b.MonthGrid]: "rdp-month_grid w-full border-collapse",
	[b.Weeks]: "rdp-weeks space-y-0",
	[b.Week]: "rdp-week grid grid-cols-7",
	[b.Day]: "rdp-day relative p-0 text-center",
	[b.DayButton]: "rdp-day_button w-9 h-9 rounded-full inline-flex items-center justify-center text-sm font-lexend text-pio-text hover:scale-105 transition-all focus-visible:ring-2 focus-visible:ring-pio-teal-dark dark:text-blue-200 dark:hover:scale-105",
	[_.outside]: [
		q[_.outside],
		"text-pio-text-muted",
		"opacity-60",
		"dark:opacity-50"
	].join(" "),
	[_.today]: [q[_.today]].join(" "),
	[_.disabled]: [
		q[_.disabled],
		"opacity-40",
		"cursor-not-allowed"
	].join(" "),
	[y.selected]: q[y.selected],
	[y.range_start]: [q[y.range_start]].join(" "),
	[y.range_middle]: [q[y.range_middle]].join(" "),
	[y.range_end]: [q[y.range_end]].join(" ")
};
// src/components/molecules/Calendar/Calendar.tsx
function Be(e) {
	let { orientation: t = "left", disabled: n, size: r = 24, className: i, ...a } = e, o = {
		size: r,
		className: i,
		...a
	};
	return t === "left" ? /* @__PURE__ */ u(m, {
		...o,
		"aria-hidden": !0
	}) : t === "right" ? /* @__PURE__ */ u(h, {
		...o,
		"aria-hidden": !0
	}) : null;
}
var Ve = ({ mode: e = "single", selected: t, onSelect: r, defaultMonth: i, caption: a, className: o, disabled: s, showOutsideDays: c = !0, animate: l = !0 }) => {
	let f = n((e) => {
		r?.(e);
	}, [r]), p = n((e) => {
		r?.(e);
	}, [r]), m = {
		Chevron: Be,
		MonthCaption: n(({ children: e, calendarMonth: t, displayIndex: n, className: r, ...i }) => /* @__PURE__ */ d("div", {
			className: r,
			...i,
			children: [a ? /* @__PURE__ */ u("span", {
				className: "rdp-caption_title block w-full text-center text-xs font-lexend font-regular text-pio-text-muted dark:text-blue-200/70 mb-1",
				children: a
			}) : null, e]
		}), [a])
	}, h = {
		...ze,
		[b.MonthCaption]: [ze[b.MonthCaption], a ? "flex-col gap-0" : ""].filter(Boolean).join(" ")
	};
	return e === "range" ? /* @__PURE__ */ u(v, {
		mode: "range",
		selected: t,
		onSelect: p,
		defaultMonth: i,
		classNames: h,
		components: m,
		showOutsideDays: c,
		animate: l,
		disabled: s,
		className: o,
		navLayout: "around",
		captionLayout: "label"
	}) : /* @__PURE__ */ u(v, {
		mode: "single",
		selected: t,
		onSelect: f,
		defaultMonth: i,
		classNames: h,
		components: m,
		showOutsideDays: c,
		animate: l,
		disabled: s,
		className: o,
		navLayout: "around",
		captionLayout: "label"
	});
}, He = "px-6 py-4 bg-pio-bg-light border-b border-pio-grid flex items-center justify-between gap-3 dark:bg-gray-800 dark:border-gray-600", Ue = "flex items-center min-w-0", We = "text-xs font-jetbrains text-pio-text-muted truncate dark:text-blue-200", Ge = "inline-flex items-center gap-1.5 text-xs font-semibold font-jakarta px-3 py-1.5 rounded-full border border-pio-grid bg-white text-pio-text hover:bg-pio-coral-pale hover:text-pio-coral hover:border-pio-coral-opacity-20 transition-all shrink-0 dark:bg-gray-700 dark:text-blue-200 dark:border-gray-600", Ke = "bg-pio-teal-dark-opacity-14 text-pio-teal-dark border-pio-teal-dark-opacity-20 hover:bg-pio-teal-dark-opacity-14 hover:text-pio-teal-dark hover:border-pio-teal-dark-opacity-20", qe = "p-6 overflow-x-auto text-xs sm:text-sm font-jetbrains leading-relaxed m-0", Je = {
	dark: "text-pio-teal-dark-pale",
	light: "text-pio-text"
}, Ye = {
	dark: "rgb(var(--lz-dark-canvas))",
	light: "rgb(var(--lz-white))"
}, Xe = "m-0 p-0 overflow-visible font-jetbrains text-xs sm:text-sm leading-relaxed", Ze = [
	{
		types: [
			"comment",
			"prolog",
			"doctype",
			"cdata"
		],
		style: {
			color: "rgb(var(--lz-pio-text-muted))",
			fontStyle: "italic"
		}
	},
	{
		types: [
			"keyword",
			"operator",
			"boolean"
		],
		style: {
			color: "rgb(var(--lz-pio-coral))",
			fontWeight: "600"
		}
	},
	{
		types: [
			"string",
			"attr-value",
			"char",
			"inserted"
		],
		style: { color: "rgb(var(--lz-pio-teal-dark-muted))" }
	},
	{
		types: [
			"tag",
			"function",
			"class-name",
			"maybe-class-name"
		],
		style: { color: "rgb(var(--lz-pio-coral-hover))" }
	},
	{
		types: [
			"number",
			"constant",
			"symbol",
			"builtin",
			"attr-name"
		],
		style: { color: "rgb(var(--lz-pio-amber))" }
	}
], Qe = {
	plain: {
		color: "rgb(var(--lz-pio-teal-dark-pale))",
		backgroundColor: "transparent"
	},
	styles: [...Ze, {
		types: ["punctuation", "plain"],
		style: { color: "rgb(var(--lz-pio-teal-dark-pale))" }
	}]
}, $e = {
	plain: {
		color: "rgb(var(--lz-pio-text))",
		backgroundColor: "transparent"
	},
	styles: [...Ze, {
		types: ["punctuation", "plain"],
		style: { color: "rgb(var(--lz-pio-text))" }
	}]
}, et = 2200, tt = ({ code: e, filename: t, language: n, className: i, codeMode: a = "dark" }) => {
	let [o, l] = c(!1), f = s(null), p = a === "light" ? $e : Qe, m = { backgroundColor: Ye[a] }, h = `${qe} ${Je[a]} ${Xe}`;
	r(() => () => {
		f.current && clearTimeout(f.current);
	}, []);
	let _ = async () => {
		try {
			await navigator.clipboard.writeText(e), l(!0), f.current && clearTimeout(f.current), f.current = setTimeout(() => l(!1), et);
		} catch {
			l(!1);
		}
	}, v = n ? /* @__PURE__ */ u(S, {
		theme: p,
		code: e.trimEnd(),
		language: n,
		children: ({ style: e, tokens: t, getLineProps: n, getTokenProps: r }) => /* @__PURE__ */ u("pre", {
			className: h,
			style: {
				...e,
				...m
			},
			children: /* @__PURE__ */ u("code", { children: t.map((e, t) => /* @__PURE__ */ u("div", {
				...n({ line: e }),
				children: e.map((e, t) => /* @__PURE__ */ u("span", { ...r({ token: e }) }, t))
			}, t)) })
		})
	}) : /* @__PURE__ */ u("pre", {
		className: h,
		style: m,
		children: /* @__PURE__ */ u("code", { children: e.trimEnd() })
	});
	return /* @__PURE__ */ d(pe, {
		padded: !1,
		surface: "transparent",
		className: i,
		children: [/* @__PURE__ */ d("div", {
			className: He,
			children: [/* @__PURE__ */ u("div", {
				className: Ue,
				children: t ? /* @__PURE__ */ u("span", {
					className: We,
					children: t
				}) : null
			}), /* @__PURE__ */ d("button", {
				type: "button",
				className: `${Ge} ${o ? Ke : ""}`.trim(),
				onClick: _,
				"aria-label": o ? "Copied" : "Copy snippet",
				children: [/* @__PURE__ */ u(g, {
					size: 14,
					"aria-hidden": "true"
				}), /* @__PURE__ */ u("span", { children: o ? "Copied" : "Copy Snippet" })]
			})]
		}), v]
	});
}, nt = "flex w-full flex-col gap-4", rt = "m-0 flex list-none flex-wrap items-center gap-6 p-0", it = "flex items-center gap-2", at = "h-3 w-3 shrink-0 rounded-full shadow-xs", ot = "text-xs font-bold font-jakarta text-pio-text dark:text-blue-200", st = "rgb(var(--lz-pio-teal-dark))", ct = "rgb(var(--lz-pio-stone))", lt = "rgb(var(--lz-pio-text-muted))", ut = "rgb(var(--lz-pio-grid))", dt = "rgb(var(--lz-pio-bg-light))", ft = "rgb(var(--lz-pio-text))", pt = ({ data: e, series: t, xAxisKey: n, width: r = "100%", height: i = 280, showGrid: a = !1, showTooltip: o = !0, showLegend: s = !1, showDots: c = !0, curveType: l = "monotone", yAxisDomain: f = [0, "auto"], referenceLines: p = [] }) => /* @__PURE__ */ d("div", {
	className: nt,
	"data-purpose": "line-chart",
	children: [s ? /* @__PURE__ */ u("ul", {
		className: rt,
		"data-purpose": "line-chart-legend",
		children: t.map((e) => {
			let t = e.stroke ?? st;
			return /* @__PURE__ */ d("li", {
				className: it,
				children: [/* @__PURE__ */ u("span", {
					className: at,
					style: { backgroundColor: t },
					"aria-hidden": "true"
				}), /* @__PURE__ */ u("span", {
					className: ot,
					children: e.name ?? e.dataKey
				})]
			}, e.dataKey);
		})
	}) : null, /* @__PURE__ */ u(E, {
		width: r,
		height: i,
		children: /* @__PURE__ */ d(w, {
			data: e,
			margin: {
				top: 8,
				right: 12,
				left: 8,
				bottom: 8
			},
			children: [
				a && /* @__PURE__ */ u(ee, {
					strokeDasharray: "3 3",
					stroke: ut,
					vertical: !1
				}),
				/* @__PURE__ */ u(O, {
					dataKey: n,
					axisLine: !1,
					tickLine: !1,
					tick: {
						fill: lt,
						fontSize: 12
					},
					tickMargin: 14
				}),
				/* @__PURE__ */ u(k, {
					domain: f,
					axisLine: !1,
					tickLine: !1,
					tick: {
						fill: lt,
						fontSize: 12
					},
					tickMargin: 32,
					width: 48
				}),
				o && /* @__PURE__ */ u(D, {
					contentStyle: {
						backgroundColor: dt,
						border: `1px solid ${ut}`,
						borderRadius: 8
					},
					labelStyle: { color: ft }
				}),
				p.map((e) => /* @__PURE__ */ u(T, {
					y: e.y,
					stroke: e.stroke ?? ct,
					strokeDasharray: e.strokeDasharray ?? "4 4",
					label: e.label ? {
						value: e.label,
						fill: lt,
						fontSize: 12,
						position: "insideTopRight"
					} : void 0
				}, `ref-y-${e.y}-${e.label ?? ""}`)),
				t.map((e) => {
					let t = e.stroke ?? st, n = e.showDots ?? c, r = e.type ?? l;
					return /* @__PURE__ */ u(C, {
						type: r,
						dataKey: e.dataKey,
						name: e.name ?? e.dataKey,
						stroke: t,
						strokeWidth: e.strokeWidth ?? 2,
						strokeDasharray: e.strokeDasharray,
						dot: n ? {
							r: 4,
							fill: e.dotFill ?? t,
							stroke: e.dotStroke ?? t,
							strokeWidth: 2
						} : !1,
						activeDot: n ? {
							r: 5,
							fill: e.dotFill ?? t,
							stroke: e.dotStroke ?? t,
							strokeWidth: 2
						} : !1,
						isAnimationActive: !0
					}, e.dataKey);
				})
			]
		})
	})]
}), J = {
	container: "menu bg-white dark:bg-gray-900 shadow-md rounded-md dark:shadow-none dark:border dark:border-gray-700 inline-block",
	label: "px-4 py-2 text-gray-700 dark:text-blue-200",
	items: "menu-items",
	itemsSeparator: "border-t border-gray-300 dark:border-gray-700",
	item: "menu-item px-6 py-2 hover:bg-gray-opacity-14 cursor-pointer"
}, mt = ({ label: e, items: t, pointer: n, separator: i = !1, onClickOutside: a }) => {
	let o = s(null);
	return r(() => {
		function e(e) {
			o.current && !o.current.contains(e.target) && a?.();
		}
		return document.addEventListener("mousedown", e), () => {
			document.removeEventListener("mousedown", e);
		};
	}, [a]), /* @__PURE__ */ d("div", {
		ref: o,
		className: `${J.container} lz-menu-container ${n}`,
		children: [e && /* @__PURE__ */ u("div", {
			className: J.label,
			children: e
		}), /* @__PURE__ */ u("ul", {
			className: `${J.items} ${i ? J.itemsSeparator : ""}`,
			children: t.map((e, t) => /* @__PURE__ */ u("li", {
				className: J.item,
				tabIndex: 0,
				role: "menuitem",
				onClick: e.onClick,
				children: /* @__PURE__ */ u(Ce, { ...e.label })
			}, t))
		})]
	});
}, ht = {
	underline: "border-b border-gray-300 flex flex-nowrap max-w-full min-w-0 overflow-x-auto dark:border-gray-700",
	pills: "inline-flex flex-nowrap p-1.5 rounded-full bg-white border border-pio-grid shadow-xs gap-1 max-w-full min-w-0 overflow-x-auto list-none m-0 dark:bg-gray-900 dark:border-gray-700",
	segmented: "inline-flex flex-nowrap p-1 rounded-full bg-pio-bg-light border border-pio-grid gap-1 max-w-full min-w-0 overflow-x-auto list-none m-0 dark:bg-gray-800 dark:border-gray-700"
}, gt = {
	underline: "relative shrink-0",
	pills: "shrink-0 list-none",
	segmented: "shrink-0 list-none"
}, _t = {
	active: "py-2 px-6 block outline-hidden whitespace-nowrap font-jakarta font-semibold text-pio-coral dark:text-pio-coral",
	inactive: "py-2 px-6 block outline-hidden opacity-80 hover:opacity-100 whitespace-nowrap font-jakarta text-pio-text-muted hover:text-pio-text dark:text-blue-200"
}, vt = {
	active: "px-4 py-2 rounded-full text-xs font-semibold font-jakarta whitespace-nowrap transition-all duration-200 bg-pio-coral text-white shadow-md",
	inactive: "px-4 py-2 rounded-full text-xs font-semibold font-jakarta whitespace-nowrap text-pio-text-muted hover:text-pio-text hover:bg-pio-border-subtle transition-all duration-200 dark:hover:text-white dark:hover:bg-gray-800"
}, yt = {
	active: "px-2.5 py-1.5 rounded-full text-xs font-bold font-jakarta whitespace-nowrap bg-white shadow-xs text-pio-text text-center transition-all duration-200 dark:bg-gray-900 dark:text-white",
	inactive: "px-2.5 py-1.5 rounded-full text-xs font-medium font-jakarta whitespace-nowrap text-pio-stone hover:text-pio-text text-center transition-all duration-200 dark:text-gray-300 dark:hover:text-white"
}, bt = (e, t) => e === "pills" ? t ? vt.active : vt.inactive : e === "segmented" ? t ? yt.active : yt.inactive : t ? _t.active : _t.inactive, xt = (e) => `absolute bottom-0 left-0 h-0.5 bg-pio-coral transition-all duration-200 ${e ? "w-full" : "w-0"}`, St = ({ id: e, label: t, active: n, onClick: r, variant: i = "underline" }) => /* @__PURE__ */ d("li", {
	role: "presentation",
	className: gt[i],
	children: [/* @__PURE__ */ u("button", {
		type: "button",
		role: "tab",
		id: `tab-${e}`,
		"aria-controls": `tabpanel-${e}`,
		"aria-selected": n,
		className: bt(i, n),
		onClick: () => r(e),
		children: t
	}), i === "underline" && /* @__PURE__ */ u("div", { className: xt(n) })]
}, e), Ct = ({ activeTab: e, tabs: t, variant: n = "underline" }) => {
	let [r, i] = c(e || t[0].id), a = (e) => {
		i(e);
	};
	return /* @__PURE__ */ d("div", {
		className: "w-full min-w-0 max-w-full",
		children: [/* @__PURE__ */ u("nav", {
			className: "min-w-0 max-w-full",
			children: /* @__PURE__ */ u("ul", {
				role: "tablist",
				className: ht[n],
				children: t.map((e) => /* @__PURE__ */ u(St, {
					id: e.id,
					label: e.label,
					active: r === e.id,
					onClick: a,
					variant: n
				}, e.id))
			})
		}), t.map((e) => r === e.id ? /* @__PURE__ */ u("div", {
			id: `tabpanel-${e.id}`,
			role: "tabpanel",
			"aria-labelledby": `tab-${e.id}`,
			className: "py-5",
			children: e.content
		}, e.id) : null)]
	});
}, wt = (e) => e === 0 ? "" : "border-l border-gray-300 dark:border-gray-700", Tt = {
	default: "rounded-sm",
	sm: "rounded-xs",
	md: "rounded-md",
	lg: "rounded-lg",
	full: "rounded-full"
}, Et = (e) => ({
	itemBorder: wt,
	toolbar: [
		"toolbar",
		"relative",
		"max-w-full",
		"min-w-0",
		"bg-white",
		"dark:bg-gray-900",
		"px-1",
		!e || e === "none" ? "" : Tt[e] ?? "",
		"shadow-xs dark:shadow-none dark:border dark:border-gray-700"
	].filter(Boolean).join(" "),
	toolbarScroll: "toolbar__scroll flex flex-nowrap max-w-full min-w-0 overflow-x-auto list-none m-0 p-0"
}), Dt = (e) => ({
	toolbarItem: "text-gray-700 dark:text-blue-200 cursor-pointer shrink-0",
	menuIcon: "ml-1 shrink-0",
	menuContainer: [
		"fixed",
		"z-50",
		"inline-block",
		"outline-hidden",
		e === "top" ? "pb-2" : "pt-2"
	].join(" "),
	itemContainer: "toolbar__item-inner py-2 px-1 flex items-center whitespace-nowrap"
}), Ot = ({ item: e, menuPosition: t = "bottom", open: n, setOpen: i }) => {
	let o = s(null), l = s(null), f = Dt(t), [m, h] = c({
		top: 0,
		left: 0
	}), g = () => {
		let e = o.current;
		if (!e) return;
		let n = e.getBoundingClientRect();
		h({
			top: t === "bottom" ? n.bottom : n.top,
			left: n.left + n.width / 2
		});
	};
	a(() => {
		n && g();
	}, [n, t]), r(() => {
		if (!n) return;
		let e = () => g(), t = (e) => {
			let t = e.target;
			o.current?.contains(t) || l.current?.contains(t) || i(!1);
		}, r = (e) => {
			e.key === "Escape" && i(!1);
		};
		return window.addEventListener("resize", e), window.addEventListener("scroll", e, !0), document.addEventListener("mousedown", t), document.addEventListener("keydown", r), () => {
			window.removeEventListener("resize", e), window.removeEventListener("scroll", e, !0), document.removeEventListener("mousedown", t), document.removeEventListener("keydown", r);
		};
	}, [
		n,
		t,
		i
	]);
	let _ = (t) => {
		t.stopPropagation(), e.menu && i(!n), e.onClick();
	}, v = t === "bottom" ? {
		top: m.top,
		left: m.left,
		transform: "translateX(-50%)"
	} : {
		top: m.top,
		left: m.left,
		transform: "translate(-50%, -100%)"
	};
	return /* @__PURE__ */ d("div", {
		className: f.toolbarItem,
		onClick: _,
		children: [/* @__PURE__ */ d("div", {
			className: f.itemContainer,
			ref: o,
			children: [e.item, e.menu && /* @__PURE__ */ u("div", {
				className: f.menuIcon,
				children: /* @__PURE__ */ u(p, { size: 16 })
			})]
		}), e.menu && n && A(/* @__PURE__ */ u("div", {
			id: "menu",
			className: f.menuContainer,
			ref: l,
			style: v,
			children: /* @__PURE__ */ u(mt, {
				...e.menu,
				pointer: t === "bottom" ? "top" : "bottom"
			})
		}), document.body)]
	});
}, kt = ({ items: e, menuPosition: t = "bottom", type: n = "label", rounded: r = "default" }) => {
	let [i, a] = c(null), o = Et(r);
	return /* @__PURE__ */ u("div", {
		className: o.toolbar,
		children: /* @__PURE__ */ u("ul", {
			className: o.toolbarScroll,
			children: e.map((e, r) => /* @__PURE__ */ u("li", {
				className: `shrink-0 ${o.itemBorder(r)}`,
				children: /* @__PURE__ */ u(Ot, {
					item: e,
					open: e.id === i,
					setOpen: () => a(e.id === i ? null : e.id),
					menuPosition: t,
					type: n
				})
			}, r))
		})
	});
};
// src/hooks/useContainerWidth.ts
function At(e, t) {
	let [n, r] = c(null);
	return a(() => {
		let n = e.current;
		if (!n || typeof ResizeObserver > "u") return;
		let i = (e) => {
			let n = e < t;
			r((e) => e === n ? e : n);
		};
		i(n.getBoundingClientRect().width);
		let a = new ResizeObserver((e) => {
			let t = e[0];
			t && i(t.contentRect.width);
		});
		return a.observe(n), () => a.disconnect();
	}, [e, t]), n;
}
// src/hooks/useControllableState.ts
function jt({ value: e, defaultValue: t, onChange: i }) {
	let [a, o] = c(t), l = e !== void 0, u = l ? e : a;
	return s(l), r(() => {}, [l]), [u, n((e) => {
		l || o(e), i?.(e);
	}, [l, i])];
}
// src/components/molecules/WeekCalendar/WeekCalendarStyles.ts
var Mt = [6, 22], Nt = [
	0,
	1,
	2,
	3,
	4,
	5,
	6
], Pt = "week-calendar @container w-full rounded-3xl bg-pio-bg-soft dark:bg-gray-900 border border-pio-grid dark:border-gray-700 shadow-pio-soft font-jakarta text-pio-text dark:text-blue-200", Ft = "week-calendar__scroll w-full overflow-x-auto", It = "week-calendar__inner min-w-full", Lt = "week-calendar__header grid border-b border-pio-border-subtle dark:border-gray-700", Rt = "week-calendar__gutter-spacer sticky left-0 z-20 bg-pio-bg-soft dark:bg-gray-900", zt = "week-calendar__day-header relative flex flex-col items-center justify-center gap-0.5 px-2 py-4 text-center", Bt = "week-calendar__day-header-label text-[11px] font-medium tracking-wide text-pio-text-muted dark:text-blue-200/70", Vt = "text-pio-coral dark:text-pio-coral-hover font-bold", Ht = "week-calendar__day-header-number text-xs font-medium text-pio-text dark:text-blue-200", Ut = "text-pio-coral dark:text-pio-coral-hover font-bold", Wt = "week-calendar__today-bar absolute top-0 left-3 right-3 h-1 rounded-b-full bg-pio-coral", Gt = "week-calendar__body grid", Kt = "week-calendar__gutter sticky left-0 z-20 bg-pio-bg-soft dark:bg-gray-900 relative", qt = "week-calendar__hour-label absolute right-2 text-[10px] leading-none font-regular text-pio-text-muted dark:text-blue-200/50 select-none whitespace-nowrap", Jt = "week-calendar__day-column relative min-w-0 px-1.5", Yt = "week-calendar__day-column--today bg-pio-coral-opacity-14", Xt = "week-calendar__all-day flex flex-col gap-1.5 px-0.5 pt-2 pb-2 min-h-2", Zt = "week-calendar__hour-grid relative", Qt = "week-calendar__hour-line absolute left-0 right-0 border-t border-pio-grid/60 dark:border-gray-700/80 pointer-events-none", $t = "week-calendar__list flex flex-col gap-1.5 p-2 pb-4", en = "week-calendar__now-line absolute left-0 right-0 z-10 pointer-events-none h-px bg-pio-coral", tn = "week-calendar__now-marker absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-l-[7px] border-l-pio-coral", nn = "week-calendar-event relative box-border w-full overflow-hidden rounded-xl border-0 p-0 text-left shadow-pio-soft transition-opacity font-jakarta", rn = "week-calendar-event__inner box-border flex h-full min-h-0 flex-col overflow-hidden px-2.5 py-1.5", an = "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pio-teal-dark focus-visible:ring-offset-2 focus-visible:ring-offset-pio-bg-soft dark:focus-visible:ring-offset-gray-900", on = {
	coral: "bg-pio-coral-pale text-pio-coral-dark dark:bg-pio-coral/30 dark:text-white",
	teal: "bg-pio-teal-dark-pale text-pio-teal-black dark:bg-pio-teal-dark/40 dark:text-white",
	amber: "bg-pio-amber-pale text-pio-amber-dark dark:bg-pio-amber/30 dark:text-pio-amber-pale",
	neutral: "bg-pio-bg-light text-pio-text dark:bg-gray-800 dark:text-blue-200",
	muted: "week-calendar-event--muted bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-blue-200"
}, sn = "week-calendar-event__subtitle text-[9px] leading-tight font-regular opacity-80 mb-0.5", cn = "week-calendar-event__title text-[11px] font-bold leading-snug", ln = "week-calendar-event__body mt-0.5 text-[10px] font-regular leading-snug opacity-90", un = "week-calendar-event__status mt-auto -mx-2.5 -mb-1.5 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide bg-gray-opacity-20 dark:bg-black-opacity-20 text-gray-700 dark:text-blue-200", dn = "absolute overflow-hidden", fn = "week-calendar-day flex flex-col gap-3 p-3 @md:p-4", pn = "week-calendar-day__header flex items-center justify-between gap-3", mn = "week-calendar-day__month font-jakarta text-base @md:text-lg font-bold text-pio-text dark:text-blue-200", hn = "week-calendar-day__nav flex items-center gap-1.5", gn = "week-calendar-day__nav-btn inline-flex h-8 w-8 items-center justify-center rounded-full border border-pio-grid dark:border-gray-700 bg-pio-bg-light dark:bg-gray-800 text-pio-text dark:text-blue-200 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pio-teal-dark focus-visible:ring-offset-2 focus-visible:ring-offset-pio-bg-soft dark:focus-visible:ring-offset-gray-900", _n = "week-calendar-day__strip flex items-stretch gap-1 rounded-2xl bg-pio-bg-light dark:bg-gray-800/80 p-1.5", vn = "week-calendar-day__pill relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 border-0 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pio-teal-dark focus-visible:ring-offset-2 focus-visible:ring-offset-pio-bg-soft dark:focus-visible:ring-offset-gray-900", yn = "bg-transparent", bn = "bg-pio-coral dark:bg-pio-coral shadow-pio-soft", xn = "week-calendar-day__pill-letter text-[10px] font-medium leading-none text-pio-text-muted dark:text-blue-200/60", Sn = "text-white/90 dark:text-white/90", Cn = "text-pio-coral dark:text-pio-coral-hover font-bold", wn = "week-calendar-day__pill-number text-sm font-semibold leading-none text-pio-text dark:text-blue-200", Tn = "text-white dark:text-white", En = "text-pio-coral dark:text-pio-coral-hover", Dn = "week-calendar-day__pill-dot mt-0.5 h-1 w-1 rounded-full bg-pio-coral", On = "bg-white", kn = "week-calendar-day__summary flex items-baseline justify-between gap-3 px-0.5", An = "text-sm font-semibold text-pio-text dark:text-blue-200", jn = "text-xs font-regular text-pio-text-muted dark:text-blue-200/60", Mn = "week-calendar-day__all-day flex items-start gap-2 border-b border-pio-border-subtle dark:border-gray-700 pb-2", Nn = "shrink-0 pt-1.5 text-[10px] font-semibold uppercase tracking-wide text-pio-text-muted dark:text-blue-200/60 w-14 @md:w-[52px]", Pn = "flex min-w-0 flex-1 flex-col gap-1.5", Fn = "week-calendar-day__body relative flex gap-0", In = "week-calendar-day__gutter relative shrink-0 w-12 @md:w-[52px]", Ln = "week-calendar-day__grid relative min-w-0 flex-1 touch-pan-y", Rn = "flex flex-col gap-1.5 py-1", zn = "week-calendar-day__swipe-hint mx-auto mt-2 inline-flex items-center gap-1.5 rounded-full bg-pio-bg-light dark:bg-gray-800 px-3 py-1 text-[10px] font-medium text-pio-text-muted dark:text-blue-200/60", Bn = "week-calendar-agenda flex flex-col gap-0 p-3 @md:p-4", Vn = "week-calendar-agenda__day relative pb-4", Hn = "week-calendar-agenda__day--today rounded-2xl bg-pio-coral-opacity-14 pb-3 -mx-1", Un = "week-calendar-agenda__day-header sticky top-0 z-10 flex items-center justify-between gap-3 bg-pio-bg-soft dark:bg-gray-900 py-2 px-1", Wn = "relative rounded-t-2xl bg-pio-coral/25 dark:bg-pio-coral/35 px-3 py-2.5", Gn = "absolute left-0 top-2 bottom-2 w-1 rounded-full bg-pio-coral", Kn = "text-sm font-semibold text-pio-text dark:text-blue-200", qn = "text-pio-coral dark:text-pio-coral-hover", Jn = "text-xs font-regular text-pio-text-muted dark:text-blue-200/60", Yn = "week-calendar-agenda__cards flex flex-col gap-2 pl-1", Xn = "px-2 pt-3", Zn = "week-calendar-agenda__empty flex items-center gap-3 py-2 px-1 text-xs font-regular text-pio-text-muted dark:text-blue-200/50", Qn = "flex-1 border-t border-dashed border-pio-grid dark:border-gray-700", $n = "week-calendar-event__inner--agenda box-border flex flex-col gap-1 px-2.5 py-2", er = "flex items-baseline justify-between gap-2 min-w-0", tr = "week-calendar-event__subtitle--agenda shrink-0 text-[10px] font-regular text-pio-text-muted dark:text-blue-200/60 text-right", nr = "week-calendar-event__time text-[11px] font-regular leading-snug text-pio-text-muted dark:text-blue-200/70", rr = "uppercase tracking-wider text-[10px]";
// src/components/molecules/WeekCalendar/WeekCalendarTypes.ts
function Y(...e) {
	return e.filter(Boolean).join(" ");
}
// src/components/molecules/WeekCalendar/WeekCalendarUtils.ts
var ir = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
], ar = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
], or = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
function X(e) {
	if (e instanceof Date) return new Date(e.getFullYear(), e.getMonth(), e.getDate());
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? /* @__PURE__ */ new Date(NaN) : new Date(t.getFullYear(), t.getMonth(), t.getDate());
}
function sr(e, t) {
	let n = (e.getDay() - t + 7) % 7;
	return new Date(e.getFullYear(), e.getMonth(), e.getDate() - n);
}
function cr(e, t) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate() + t);
}
function Z(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
function lr(e) {
	return e.getDay();
}
function ur(e) {
	return ir[e.getDay()];
}
function Q(e) {
	return `${ar[e.getDay()]}, ${or[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`;
}
var dr = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
function fr(e) {
	return ir[e.getDay()].charAt(0);
}
function pr(e) {
	return `${or[e.getMonth()]} ${e.getFullYear()}`;
}
function mr(e) {
	return `${ar[e.getDay()]}, ${dr[e.getMonth()]} ${e.getDate()}`;
}
function hr(e) {
	return `${ur(e)} ${e.getDate()}`;
}
function $(e) {
	return `${e.getFullYear()}-${e.getMonth()}-${e.getDate()}`;
}
function gr(e, t, n) {
	let r = sr(X(e), t), i = new Set(n), a = [];
	for (let e = 0; e < 7; e += 1) {
		let t = cr(r, e);
		i.has(lr(t)) && a.push(t);
	}
	return a;
}
function _r(e) {
	if (!e) return null;
	let t = /^(\d{1,2}):(\d{2})$/.exec(e.trim());
	if (!t) return null;
	let n = Number(t[1]), r = Number(t[2]);
	return !Number.isFinite(n) || !Number.isFinite(r) || n < 0 || n > 23 || r < 0 || r > 59 ? null : n * 60 + r;
}
function vr(e) {
	let t = (e % 24 + 24) % 24, n = t < 12 ? "AM" : "PM";
	return `${t % 12 == 0 ? 12 : t % 12} ${n}`;
}
function yr(e) {
	let t = _r(e);
	if (t == null) return null;
	let n = Math.floor(t / 60), r = t % 60, i = n < 12 ? "AM" : "PM";
	return `${n % 12 == 0 ? 12 : n % 12}:${String(r).padStart(2, "0")} ${i}`;
}
function br(e) {
	let t = [...e].sort((e, t) => e.startMin === t.startMin ? e.endMin - t.endMin : e.startMin - t.startMin), n = /* @__PURE__ */ new Map();
	if (t.length === 0) return n;
	let r = [], i = 0, a = 0, o = 0, s = (e, t, i) => {
		for (let a = e; a < t; a += 1) {
			let e = r[a];
			n.set(e.id, {
				column: e.column,
				columnCount: i
			});
		}
	};
	for (let e of t) {
		r.filter((t, n) => n >= i && t.endMin > e.startMin).length === 0 && r.length > i && (s(i, r.length, o), i = r.length, a = 0, o = 0);
		let t = new Set(r.filter((t, n) => n >= i && t.endMin > e.startMin).map((e) => e.column)), n = 0;
		for (; t.has(n);) n += 1;
		n >= a && (a = n + 1), r.push({
			id: e.id,
			startMin: e.startMin,
			endMin: e.endMin,
			column: n
		}), o = Math.max(o, a);
	}
	return r.length > i && s(i, r.length, o), n;
}
function xr(e, t, n) {
	let r = t * 60, i = n * 60;
	return Math.min(i, Math.max(r, e));
}
function Sr(e, t, n) {
	return (e - t * 60) / 60 * n;
}
function Cr(e, t, n, r) {
	let i = Math.max(0, t - e);
	return Math.max(r, i / 60 * n);
}
// src/components/molecules/WeekCalendar/WeekCalendarEventCard.tsx
function wr({ event: e, className: t, style: n, variant: r = "default" }) {
	let i = e.tone ?? "neutral", a = typeof e.onClick == "function", o = Y(nn, on[i], a && an, t), s = r === "agenda" ? /* @__PURE__ */ u(Tr, {
		event: e,
		tone: i
	}) : /* @__PURE__ */ d("div", {
		className: rn,
		children: [
			e.subtitle != null && /* @__PURE__ */ u("div", {
				className: sn,
				children: e.subtitle
			}),
			/* @__PURE__ */ u("div", {
				className: cn,
				children: e.title
			}),
			e.body != null && /* @__PURE__ */ u("div", {
				className: ln,
				children: e.body
			}),
			i === "muted" && e.status != null && /* @__PURE__ */ u("div", {
				className: un,
				children: e.status
			})
		]
	});
	return a ? /* @__PURE__ */ u("button", {
		type: "button",
		className: o,
		style: n,
		onClick: e.onClick,
		children: s
	}) : /* @__PURE__ */ u("div", {
		className: o,
		style: n,
		children: s
	});
}
function Tr({ event: e, tone: t }) {
	let n = yr(e.start), r = e.meta, i = n != null || r != null;
	return /* @__PURE__ */ d("div", {
		className: $n,
		children: [
			/* @__PURE__ */ d("div", {
				className: er,
				children: [/* @__PURE__ */ u("div", {
					className: cn,
					children: e.title
				}), e.subtitle != null && /* @__PURE__ */ u("div", {
					className: tr,
					children: e.subtitle
				})]
			}),
			i && /* @__PURE__ */ d("div", {
				className: nr,
				children: [
					n != null && /* @__PURE__ */ u("span", { children: n }),
					n != null && r != null && /* @__PURE__ */ u("span", { children: " · " }),
					r != null && /* @__PURE__ */ u("span", {
						className: rr,
						children: r
					})
				]
			}),
			e.body != null && /* @__PURE__ */ u("div", {
				className: ln,
				children: e.body
			}),
			t === "muted" && e.status != null && /* @__PURE__ */ u("div", {
				className: un,
				children: e.status
			})
		]
	});
}
// src/components/molecules/WeekCalendar/WeekCalendarAgendaView.tsx
function Er({ days: e, today: t, eventsByDay: n, hideEmptyDays: r = !1, emptyDayLabel: i = "No events", renderEvent: a }) {
	let o = e.map((e) => ({
		day: e,
		events: n.get($(e)) ?? []
	})).filter(({ events: e }) => !r || e.length > 0);
	return /* @__PURE__ */ u("div", {
		className: Bn,
		role: "list",
		children: o.map(({ day: e, events: n }) => {
			let r = Z(e, t), o = $(e), s = `agenda-day-${o}`;
			return n.length === 0 ? /* @__PURE__ */ d("div", {
				role: "listitem",
				className: Zn,
				"aria-labelledby": s,
				children: [/* @__PURE__ */ d("span", {
					id: s,
					children: [
						hr(e),
						" · ",
						i
					]
				}), /* @__PURE__ */ u("span", {
					className: Qn,
					"aria-hidden": "true"
				})]
			}, o) : /* @__PURE__ */ d("section", {
				role: "group",
				"aria-labelledby": s,
				"aria-current": r ? "date" : void 0,
				className: Y(Vn, r && Hn),
				children: [/* @__PURE__ */ d("header", {
					className: Y(Un, r && Wn),
					children: [
						r && /* @__PURE__ */ u("span", {
							className: Gn,
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ u("h3", {
							id: s,
							className: Y(Kn, r && qn, r && "pl-3"),
							children: r ? `${hr(e)} · Today` : hr(e)
						}),
						/* @__PURE__ */ u("span", {
							className: Jn,
							children: n.length === 1 ? "1 event" : `${n.length} events`
						})
					]
				}), /* @__PURE__ */ u("div", {
					className: Y(Yn, r && Xn),
					role: "list",
					"aria-label": Q(e),
					children: n.map((e) => a ? /* @__PURE__ */ u("div", {
						role: "listitem",
						children: a(e)
					}, e.id) : /* @__PURE__ */ u("div", {
						role: "listitem",
						children: /* @__PURE__ */ u(wr, {
							event: e,
							variant: "agenda"
						})
					}, e.id))
				})]
			}, o);
		})
	});
}
// src/components/molecules/WeekCalendar/WeekCalendarDayView.tsx
function Dr({ days: e, weekStart: t, selectedDate: r, onSelectedDateChange: a, onWeekStartChange: o, today: c, showHours: f, showSwipeHint: p, hours: g, safeRangeStart: _, safeRangeEnd: v, gridHeight: y, showNowIndicator: b, nowOffset: x, eventsByDay: S, bucketsByDay: ee, renderEvent: C }) {
	let w = i(), T = e.find((e) => Z(e, r)) ?? e[0] ?? r, E = $(T), D = `${w}-panel`, O = `${w}-tab-${E}`, k = S.get(E) ?? [], A = ee.get(E) ?? {
		allDay: [],
		timed: []
	}, j = k.length, M = Z(T, c), N = s(null), P = n((t) => {
		let n = e.findIndex((e) => Z(e, T));
		if (n < 0) return;
		let r = e[n + t];
		r && a(r);
	}, [
		e,
		a,
		T
	]), F = (e, t, n) => C ? /* @__PURE__ */ u("div", {
		className: t,
		style: n,
		children: C(e)
	}, e.id) : /* @__PURE__ */ u(wr, {
		event: e,
		className: t,
		style: n
	}, e.id), I = (e) => {
		document.getElementById(`${w}-tab-${$(e)}`)?.focus();
	}, L = (t) => {
		if (t.key === "ArrowRight" || t.key === "ArrowDown") {
			t.preventDefault();
			let n = e[e.findIndex((e) => Z(e, T)) + 1];
			n && (a(n), requestAnimationFrame(() => I(n)));
		} else if (t.key === "ArrowLeft" || t.key === "ArrowUp") {
			t.preventDefault();
			let n = e[e.findIndex((e) => Z(e, T)) - 1];
			n && (a(n), requestAnimationFrame(() => I(n)));
		} else if (t.key === "Home") t.preventDefault(), e[0] && (a(e[0]), requestAnimationFrame(() => I(e[0])));
		else if (t.key === "End") {
			t.preventDefault();
			let n = e[e.length - 1];
			n && (a(n), requestAnimationFrame(() => I(n)));
		}
	}, te = (e) => {
		N.current = {
			x: e.clientX,
			y: e.clientY
		};
	}, ne = (e) => {
		let t = N.current;
		if (N.current = null, !t) return;
		let n = e.clientX - t.x, r = e.clientY - t.y;
		Math.abs(n) < 48 || Math.abs(n) <= Math.abs(r) || P(n < 0 ? 1 : -1);
	}, R = () => {
		N.current = null;
	}, z = br(A.timed.map((e) => ({
		id: e.event.id,
		startMin: e.startMin,
		endMin: e.endMin
	})));
	return /* @__PURE__ */ d("div", {
		className: fn,
		children: [
			/* @__PURE__ */ d("div", {
				className: pn,
				children: [/* @__PURE__ */ u("h2", {
					className: mn,
					children: pr(T)
				}), /* @__PURE__ */ d("div", {
					className: hn,
					children: [/* @__PURE__ */ u("button", {
						type: "button",
						className: gn,
						"aria-label": "Previous week",
						onClick: () => o?.(cr(t, -7)),
						disabled: !o,
						children: /* @__PURE__ */ u(m, {
							size: 16,
							"aria-hidden": "true"
						})
					}), /* @__PURE__ */ u("button", {
						type: "button",
						className: gn,
						"aria-label": "Next week",
						onClick: () => o?.(cr(t, 7)),
						disabled: !o,
						children: /* @__PURE__ */ u(h, {
							size: 16,
							"aria-hidden": "true"
						})
					})]
				})]
			}),
			/* @__PURE__ */ u("div", {
				className: _n,
				role: "tablist",
				"aria-label": "Days of the week",
				children: e.map((e) => {
					let t = $(e), n = Z(e, T), r = Z(e, c), i = (S.get(t)?.length ?? 0) > 0, o = `${w}-tab-${t}`;
					return /* @__PURE__ */ d("button", {
						type: "button",
						role: "tab",
						id: o,
						"aria-selected": n,
						"aria-controls": D,
						tabIndex: n ? 0 : -1,
						"aria-label": Q(e),
						className: Y(vn, n ? bn : yn),
						onClick: () => a(e),
						onKeyDown: L,
						children: [
							/* @__PURE__ */ u("span", {
								className: Y(xn, n && Sn, !n && r && Cn),
								"aria-hidden": "true",
								children: fr(e)
							}),
							/* @__PURE__ */ u("span", {
								className: Y(wn, n && Tn, !n && r && En),
								"aria-hidden": "true",
								children: e.getDate()
							}),
							i && /* @__PURE__ */ u("span", {
								className: Y(Dn, n && On),
								"aria-hidden": "true"
							})
						]
					}, t);
				})
			}),
			/* @__PURE__ */ d("div", {
				className: kn,
				children: [/* @__PURE__ */ u("span", {
					className: An,
					children: mr(T)
				}), /* @__PURE__ */ u("span", {
					className: jn,
					children: j === 1 ? "1 event" : `${j} events`
				})]
			}),
			/* @__PURE__ */ u("div", {
				role: "tabpanel",
				id: D,
				"aria-labelledby": O,
				children: f ? /* @__PURE__ */ d(l, { children: [A.allDay.length > 0 && /* @__PURE__ */ d("div", {
					className: Mn,
					children: [/* @__PURE__ */ u("span", {
						className: Nn,
						children: "All day"
					}), /* @__PURE__ */ u("div", {
						className: Pn,
						children: A.allDay.map((e) => F(e))
					})]
				}), /* @__PURE__ */ d("div", {
					className: Fn,
					children: [/* @__PURE__ */ u("div", {
						className: In,
						"aria-hidden": "true",
						children: /* @__PURE__ */ u("div", {
							className: Zt,
							style: { height: y },
							children: g.map((e) => {
								let t = (e - _) * 52;
								return /* @__PURE__ */ u("span", {
									className: qt,
									style: {
										top: e === _ ? t + 2 : t,
										transform: e === _ ? void 0 : "translateY(-50%)"
									},
									children: vr(e)
								}, e);
							})
						})
					}), /* @__PURE__ */ d("div", {
						className: Y(Ln, Zt),
						style: { height: y },
						onPointerDown: te,
						onPointerUp: ne,
						onPointerCancel: R,
						children: [
							g.map((e) => /* @__PURE__ */ u("div", {
								className: Qt,
								style: { top: (e - _) * 52 },
								"aria-hidden": "true"
							}, e)),
							A.timed.map(({ event: e, startMin: t, endMin: n }) => {
								let r = xr(t, _, v), i = xr(n, _, v);
								if (i <= _ * 60 || r >= v * 60) return null;
								let a = Sr(r, _, 52), o = Cr(r, i, 52, 48), s = z.get(e.id) ?? {
									column: 0,
									columnCount: 1
								}, c = 100 / s.columnCount, l = s.column * c;
								return F(e, dn, {
									top: a,
									height: o,
									left: `calc(${l}% + 2px)`,
									width: `calc(${c}% - 4px)`
								});
							}),
							M && b && /* @__PURE__ */ u("div", {
								className: en,
								style: { top: x },
								"aria-hidden": "true",
								children: /* @__PURE__ */ u("span", { className: tn })
							})
						]
					})]
				})] }) : /* @__PURE__ */ u("div", {
					className: Rn,
					onPointerDown: te,
					onPointerUp: ne,
					onPointerCancel: R,
					children: k.map((e) => F(e))
				})
			}),
			p && e.length > 1 && /* @__PURE__ */ d("div", {
				className: zn,
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ u(m, { size: 12 }),
					/* @__PURE__ */ u("span", { children: "swipe for other days" }),
					/* @__PURE__ */ u(h, { size: 12 })
				]
			})
		]
	});
}
// src/components/molecules/WeekCalendar/WeekCalendarWeekView.tsx
function Or({ days: e, today: t, showHours: n, hours: r, safeRangeStart: i, safeRangeEnd: a, gridHeight: o, showNowIndicator: s, nowOffset: c, eventsByDay: f, bucketsByDay: p, renderEvent: m }) {
	let h = n ? `52px repeat(${e.length}, minmax(132px, 1fr))` : `repeat(${e.length}, minmax(132px, 1fr))`, g = (e, t, n) => m ? /* @__PURE__ */ u("div", {
		className: t,
		style: n,
		children: m(e)
	}, e.id) : /* @__PURE__ */ u(wr, {
		event: e,
		className: t,
		style: n
	}, e.id), _ = (e) => {
		let n = p.get($(e)) ?? {
			allDay: [],
			timed: []
		}, l = br(n.timed.map((e) => ({
			id: e.event.id,
			startMin: e.startMin,
			endMin: e.endMin
		}))), f = Z(e, t);
		return /* @__PURE__ */ d("div", {
			className: Zt,
			style: { height: o },
			children: [
				r.map((e) => /* @__PURE__ */ u("div", {
					className: Qt,
					style: { top: (e - i) * 52 },
					"aria-hidden": "true"
				}, e)),
				n.timed.map(({ event: e, startMin: t, endMin: n }) => {
					let r = xr(t, i, a), o = xr(n, i, a);
					if (o <= i * 60 || r >= a * 60) return null;
					let s = Sr(r, i, 52), c = Cr(r, o, 52, 48), u = l.get(e.id) ?? {
						column: 0,
						columnCount: 1
					}, d = 100 / u.columnCount, f = u.column * d;
					return g(e, dn, {
						top: s,
						height: c,
						left: `calc(${f}% + 2px)`,
						width: `calc(${d}% - 4px)`
					});
				}),
				f && s && /* @__PURE__ */ u("div", {
					className: en,
					style: { top: c },
					"aria-hidden": "true",
					children: /* @__PURE__ */ u("span", { className: tn })
				})
			]
		});
	};
	return /* @__PURE__ */ u("div", {
		className: Ft,
		children: /* @__PURE__ */ d("div", {
			className: It,
			style: { minWidth: n ? 52 + e.length * 132 : e.length * 132 },
			children: [/* @__PURE__ */ d("div", {
				className: Lt,
				style: { gridTemplateColumns: h },
				children: [n && /* @__PURE__ */ u("div", {
					className: Rt,
					"aria-hidden": "true"
				}), e.map((e) => {
					let n = Z(e, t);
					return /* @__PURE__ */ d("div", {
						className: Y(zt, n && Yt),
						children: [
							n && /* @__PURE__ */ u("span", {
								className: Wt,
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ u("span", {
								className: Y(Bt, n && Vt),
								children: ur(e)
							}),
							/* @__PURE__ */ u("span", {
								className: Y(Ht, n && Ut),
								children: e.getDate()
							})
						]
					}, `header-${$(e)}`);
				})]
			}), n ? /* @__PURE__ */ d(l, { children: [/* @__PURE__ */ d("div", {
				className: Gt,
				style: { gridTemplateColumns: h },
				children: [/* @__PURE__ */ u("div", {
					className: Kt,
					"aria-hidden": "true"
				}), e.map((e) => {
					let n = Z(e, t), r = p.get($(e))?.allDay ?? [];
					return /* @__PURE__ */ u("section", {
						className: Y(Jt, n && Yt),
						"aria-label": `${Q(e)} all-day`,
						children: /* @__PURE__ */ u("div", {
							className: Xt,
							children: r.map((e) => g(e))
						})
					}, `allday-${$(e)}`);
				})]
			}), /* @__PURE__ */ d("div", {
				className: Gt,
				style: { gridTemplateColumns: h },
				children: [/* @__PURE__ */ u("div", {
					className: Kt,
					"aria-hidden": "true",
					children: /* @__PURE__ */ u("div", {
						className: Zt,
						style: { height: o },
						children: r.map((e) => {
							let t = (e - i) * 52;
							return /* @__PURE__ */ u("span", {
								className: qt,
								style: {
									top: e === i ? t + 2 : t,
									transform: e === i ? void 0 : "translateY(-50%)"
								},
								children: vr(e)
							}, e);
						})
					})
				}), e.map((e) => {
					let n = Z(e, t);
					return /* @__PURE__ */ u("section", {
						className: Y(Jt, n && Yt),
						"aria-label": Q(e),
						"aria-current": n ? "date" : void 0,
						children: _(e)
					}, `hours-${$(e)}`);
				})]
			})] }) : /* @__PURE__ */ u("div", {
				className: Gt,
				style: { gridTemplateColumns: h },
				children: e.map((e) => {
					let n = Z(e, t), r = f.get($(e)) ?? [];
					return /* @__PURE__ */ u("section", {
						className: Y(Jt, n && Yt),
						"aria-label": Q(e),
						"aria-current": n ? "date" : void 0,
						children: /* @__PURE__ */ u("div", {
							className: $t,
							children: r.map((e) => g(e))
						})
					}, $(e));
				})
			})]
		})
	});
}
// src/components/molecules/WeekCalendar/WeekCalendar.tsx
function kr(e, t) {
	return e ?? (t ? "day" : "agenda");
}
function Ar(e, t, n, r) {
	return e === "auto" ? t === null ? r : t ? n : "week" : e;
}
function jr(e, t) {
	return e.find((e) => Z(e, t)) ?? e[0] ?? t;
}
function Mr(e, t) {
	return t.length === 0 ? e : t.find((t) => Z(t, e)) ?? t[0];
}
var Nr = ({ weekStart: e, visibleDays: t = [...Nt], weekStartsOn: n = 1, events: i, showHours: a = !0, hourRange: l = Mt, today: f, renderEvent: p, className: m, layout: h = "auto", mobileLayout: g, autoBreakpoint: _ = 640, initialLayout: v, onLayoutChange: y, onWeekStartChange: b, selectedDate: x, defaultSelectedDate: S, onSelectedDateChange: ee, showSwipeHint: C = !0, hideEmptyDays: w = !1, emptyDayLabel: T }) => {
	let E = s(null), D = At(E, _), [O, k] = c(() => /* @__PURE__ */ new Date());
	r(() => {
		if (f) return;
		let e = window.setInterval(() => {
			k(/* @__PURE__ */ new Date());
		}, 6e4);
		return () => window.clearInterval(e);
	}, [f]);
	let A = o(() => X(f ?? O), [f, O]), j = o(() => gr(e, n, t), [
		e,
		n,
		t
	]), M = kr(g, a), N = Ar(h, D, M, v ?? M), P = s(null);
	r(() => {
		P.current !== N && (P.current = N, y?.(N));
	}, [N, y]);
	let F = o(() => S == null ? jr(j, A) : Mr(X(S), j), [
		S,
		j,
		A
	]), [I, L] = jt({
		value: x == null ? void 0 : Mr(X(x), j),
		defaultValue: F,
		onChange: ee
	});
	r(() => {
		let e = Mr(I, j);
		Z(e, I) || L(e);
	}, [
		j,
		I,
		L
	]);
	let [te, ne] = l, R = Math.min(Math.max(0, te), 23), z = Math.min(24, Math.max(R + 1, ne)), re = (z - R) * 52, ie = o(() => new Set(j.map($)), [j]), B = o(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of j) e.set($(t), []);
		for (let t of i) {
			let n = X(t.date);
			if (Number.isNaN(n.getTime())) continue;
			let r = $(n);
			ie.has(r) && e.get(r)?.push(t);
		}
		return e;
	}, [
		i,
		j,
		ie
	]), ae = o(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of j) {
			let n = B.get($(t)) ?? [], r = [], i = [];
			for (let e of n) {
				let t = _r(e.start);
				if (t == null) {
					r.push(e);
					continue;
				}
				let n = _r(e.end), a = n != null && n > t ? n : t + 60;
				i.push({
					event: e,
					startMin: t,
					endMin: a
				});
			}
			e.set($(t), {
				allDay: r,
				timed: i
			});
		}
		return e;
	}, [j, B]), oe = o(() => {
		let e = [];
		for (let t = R; t < z; t += 1) e.push(t);
		return e;
	}, [R, z]), V = f ?? O, H = V.getHours() * 60 + V.getMinutes(), U = a && H >= R * 60 && H <= z * 60, se = Sr(H, R, 52), ce = U && j.some((e) => Z(e, A));
	return /* @__PURE__ */ d("div", {
		ref: E,
		className: Y(Pt, N === "week" && "overflow-hidden", m),
		"data-layout": N,
		children: [
			N === "week" && /* @__PURE__ */ u(Or, {
				days: j,
				today: A,
				showHours: a,
				hours: oe,
				safeRangeStart: R,
				safeRangeEnd: z,
				gridHeight: re,
				showNowIndicator: ce,
				nowOffset: se,
				eventsByDay: B,
				bucketsByDay: ae,
				renderEvent: p
			}),
			N === "day" && /* @__PURE__ */ u(Dr, {
				days: j,
				weekStart: e,
				selectedDate: I,
				onSelectedDateChange: L,
				onWeekStartChange: b,
				today: A,
				showHours: a,
				showSwipeHint: C,
				hours: oe,
				safeRangeStart: R,
				safeRangeEnd: z,
				gridHeight: re,
				showNowIndicator: U,
				nowOffset: se,
				eventsByDay: B,
				bucketsByDay: ae,
				renderEvent: p
			}),
			N === "agenda" && /* @__PURE__ */ u(Er, {
				days: j,
				today: A,
				eventsByDay: B,
				hideEmptyDays: w,
				emptyDayLabel: T,
				renderEvent: p
			})
		]
	});
}, Pr = "relative w-full max-w-[340px] min-h-[600px] rounded-[48px] bg-pio-text dark:bg-gray-900 p-3 shadow-[0_30px_70px_rgba(31,36,33,0.28)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.55)] border border-white/40 dark:border-white/10 ring-1 ring-black/10", Fr = "w-full h-full min-h-[576px] rounded-[38px] bg-pio-bg dark:bg-gray-900 p-3.5 flex flex-col gap-3 overflow-hidden border border-pio-grid/80 dark:border-gray-600 text-pio-text dark:text-blue-200", Ir = "flex items-center justify-between px-1 pt-0.5 text-pio-text dark:text-blue-200 shrink-0", Lr = "font-bold text-[12px] tracking-tight", Rr = "h-6 px-3 bg-black text-white rounded-full flex items-center justify-between gap-2 shadow-xs", zr = "w-2 h-2 rounded-full bg-[#111] border border-white/20 flex items-center justify-center", Br = "w-1 h-1 rounded-full bg-[#1A2E44]", Vr = "w-1.5 h-1.5 rounded-full bg-pio-coral animate-pulse", Hr = "flex items-center gap-1.5 text-[12px] text-pio-text dark:text-blue-200", Ur = "flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto", Wr = "w-32 h-1 bg-black/40 dark:bg-white/40 rounded-full mx-auto mt-0.5 shrink-0", Gr = () => /* @__PURE__ */ d("svg", {
	"aria-hidden": "true",
	className: "w-[13px] h-[13px]",
	fill: "currentColor",
	viewBox: "0 0 24 24",
	children: [
		/* @__PURE__ */ u("rect", {
			x: "2",
			y: "16",
			width: "3",
			height: "5",
			rx: "0.5"
		}),
		/* @__PURE__ */ u("rect", {
			x: "7.5",
			y: "12",
			width: "3",
			height: "9",
			rx: "0.5"
		}),
		/* @__PURE__ */ u("rect", {
			x: "13",
			y: "8",
			width: "3",
			height: "13",
			rx: "0.5"
		}),
		/* @__PURE__ */ u("rect", {
			x: "18.5",
			y: "4",
			width: "3",
			height: "17",
			rx: "0.5",
			opacity: "0.35"
		})
	]
}), Kr = () => /* @__PURE__ */ d("svg", {
	"aria-hidden": "true",
	className: "w-[15px] h-[15px]",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "1.6",
	viewBox: "0 0 24 24",
	children: [
		/* @__PURE__ */ u("rect", {
			x: "2",
			y: "7",
			width: "18",
			height: "10",
			rx: "2"
		}),
		/* @__PURE__ */ u("path", {
			d: "M22 11v2",
			strokeLinecap: "round"
		}),
		/* @__PURE__ */ u("path", {
			d: "M8 12h4M10 10v4",
			strokeLinecap: "round"
		})
	]
}), qr = ({ children: e, className: t, time: n = "9:41" }) => {
	let r = [Pr, t].filter(Boolean).join(" ");
	return /* @__PURE__ */ u("div", {
		className: r,
		"data-purpose": "phone-frame",
		children: /* @__PURE__ */ d("div", {
			className: Fr,
			"data-purpose": "phone-screen",
			children: [
				/* @__PURE__ */ d("div", {
					className: Ir,
					"data-purpose": "phone-status-bar",
					children: [
						/* @__PURE__ */ u("span", {
							className: Lr,
							children: n
						}),
						/* @__PURE__ */ d("div", {
							className: Rr,
							"aria-hidden": "true",
							children: [/* @__PURE__ */ u("div", {
								className: zr,
								children: /* @__PURE__ */ u("div", { className: Br })
							}), /* @__PURE__ */ u("div", { className: Vr })]
						}),
						/* @__PURE__ */ d("div", {
							className: Hr,
							children: [
								/* @__PURE__ */ u(Gr, {}),
								/* @__PURE__ */ u("span", {
									className: "text-[10px] font-semibold",
									children: "5G"
								}),
								/* @__PURE__ */ u(Kr, {})
							]
						})
					]
				}),
				/* @__PURE__ */ u("div", {
					className: Ur,
					"data-purpose": "phone-content",
					children: e
				}),
				/* @__PURE__ */ u("div", {
					className: Wr,
					"aria-hidden": "true"
				})
			]
		})
	});
};
export { I as Background, R as Badge, oe as Box, se as Button, Ve as Calendar, pe as Card, ye as Checkbox, be as CircleSpinner, tt as CodeBlock, Se as Input, Ce as Label, pt as LineChart, mt as Menu, qr as Phone, we as Select, Te as Spinner, Le as Switch, Ct as Tabs, Re as Title, kt as Toolbar, Nr as WeekCalendar, At as useContainerWidth, jt as useControllableState };

//# sourceMappingURL=index.js.map