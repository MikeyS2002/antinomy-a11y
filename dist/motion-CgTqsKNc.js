import { AnimatePresence as e, motion as t, useReducedMotion as n } from "motion-v";
import { computed as r, defineComponent as i, getCurrentInstance as a, h as o, onMounted as s, ref as c } from "vue";
//#region src/motion/config.js
var l = {
	translation: 50,
	scale: .15,
	rotation: 10
}, u = 400, d = {
	translation: 20,
	scale: 0,
	rotation: 0
}, f = .3, p = {
	spatial: "linear",
	opacity: [
		0,
		0,
		.58,
		1
	]
}, m = {
	x: "spatial",
	y: "spatial",
	z: "spatial",
	translateX: "spatial",
	translateY: "spatial",
	translateZ: "spatial",
	perspective: "spatial",
	scale: "scale",
	scaleX: "scale",
	scaleY: "scale",
	scaleZ: "scale",
	rotate: "rotation",
	rotateX: "rotation",
	rotateY: "rotation",
	rotateZ: "rotation",
	skew: "rotation",
	skewX: "rotation",
	skewY: "rotation",
	opacity: "safe",
	clipPath: "safe"
};
function h(e = {}) {
	e.thresholds && (l = {
		...l,
		...e.thresholds
	}), e.largeElementThresholds && (d = {
		...d,
		...e.largeElementThresholds
	}), e.largeElementBreakpoint !== void 0 && (u = e.largeElementBreakpoint), e.maxDuration !== void 0 && (f = e.maxDuration), e.reducedEasing && (p = {
		...p,
		...e.reducedEasing
	});
}
//#endregion
//#region src/motion/classify.js
function g(e) {
	return e ? Math.max(e.width, e.height) > u : !1;
}
function _(e, t, n) {
	let r = g(n) ? d : l;
	return e === "spatial" ? t > r.translation ? "high" : "moderate" : e === "scale" ? t > r.scale ? "high" : "moderate" : e === "rotation" ? t > r.rotation ? "high" : "moderate" : "unknown";
}
function v(e, t, n, r = null) {
	let i = m[e];
	if (!i) return "unknown";
	if (i === "safe") return "low";
	if (Array.isArray(t) || Array.isArray(n)) {
		let e = [...Array.isArray(t) ? t : [t], ...Array.isArray(n) ? n : [n]].map((e) => typeof e == "string" ? parseFloat(e) : e);
		if (e.some(isNaN)) return "unknown";
		let a = 0;
		if (i === "scale") for (let t of e) a = Math.max(a, Math.abs(t - 1));
		else for (let t = 1; t < e.length; t++) a = Math.max(a, Math.abs(e[t] - e[t - 1]));
		return _(i, a, r);
	}
	let a = typeof t == "string" ? parseFloat(t) : t, o = typeof n == "string" ? parseFloat(n) : n;
	if (isNaN(a) || isNaN(o)) return "unknown";
	let s;
	return s = i === "scale" ? Math.max(Math.abs(a - 1), Math.abs(o - 1)) : Math.abs(a - o), _(i, s, r);
}
//#endregion
//#region src/motion/easing.js
var y = [
	"linear",
	"ease",
	"ease-in",
	"ease-out",
	"ease-in-out"
];
function b(e) {
	if (!e) return !0;
	if (typeof e == "string") return y.includes(e);
	if (Array.isArray(e) && e.length === 4) {
		let [, t, , n] = e;
		return t >= 0 && t <= 1 && n >= 0 && n <= 1;
	}
	return !1;
}
function x(e) {
	return e ? ["spring", "inertia"].includes(e) : !1;
}
//#endregion
//#region src/motion/adaptMotion.js
function S(e) {
	return e ? Math.max(e.width, e.height) > u : !1;
}
function C(e, t, n, r = null) {
	let i = {}, a = new Set([
		...Object.keys(e),
		...Object.keys(t),
		...Object.keys(n)
	]), o = !1;
	for (let s of a) if (s in n) switch (v(s, e[s] ?? j(s), t[s] ?? j(s), r)) {
		case "high":
			!o && !("opacity" in n) && k(s, e[s], t[s]) ? (i.opacity = A(s, n[s]) ? 0 : 1, o = !0) : Array.isArray(n[s]) ? i[s] = n[s].map(() => j(s)) : i[s] = j(s);
			break;
		case "moderate":
			Array.isArray(n[s]) ? i[s] = n[s].map((e) => E(s, e, r)) : i[s] = E(s, n[s], r);
			break;
		case "low":
			i[s] = n[s];
			break;
		case "unknown":
			i[s] = n[s];
			break;
	}
	return i;
}
function w(e, t, r = {}, i = null, a = null) {
	if (!n().value) {
		let n = {
			initial: e,
			animate: t,
			transition: r
		};
		return i && (n.exit = i), n;
	}
	let o = new Set([
		...Object.keys(e),
		...Object.keys(t),
		...i ? Object.keys(i) : []
	]), s = {
		initial: C(e, t, e, a),
		animate: C(e, t, t, a),
		transition: D(r, o)
	};
	return i && (s.exit = C(e, t, i, a)), s;
}
function T(e, t = null) {
	let n = e.initial || {}, r = e.animate || {}, i = {};
	for (let [a, o] of Object.entries(e)) i[a] = C(n, r, o, t);
	return i;
}
function E(e, t, n = null) {
	let r = m[e], i = typeof t == "string" ? parseFloat(t) : t;
	if (isNaN(i)) return t;
	let a = S(n) ? d : l;
	return r === "spatial" ? Math.max(-a.translation, Math.min(a.translation, i)) : r === "scale" ? Math.max(1 - a.scale, Math.min(1 + a.scale, i)) : r === "rotation" ? Math.max(-a.rotation, Math.min(a.rotation, i)) : t;
}
function D(e, t) {
	let n = { ...e };
	x(e.type) && (n.type = void 0, n.stiffness = void 0, n.damping = void 0, n.bounce = void 0, n.mass = void 0, n.velocity = void 0), n.repeat = 0, n.repeatType = void 0, n.repeatDelay = void 0;
	let r = [...t].some((e) => {
		let t = m[e];
		return t === "spatial" || t === "scale" || t === "rotation";
	}), i = t.has("opacity"), a = b(e.ease) ? e.ease : p.spatial;
	return i && !r ? n.ease = p.opacity : n.ease = a, n.duration !== void 0 && n.duration > f && (n.duration = f), n;
}
function O(e) {
	if (typeof e != "string") return !1;
	let t = parseFloat(e);
	return !isNaN(t) && Math.abs(t) >= 100 && e.trim().endsWith("%");
}
function k(e, t, n) {
	let r = m[e];
	return r === "spatial" ? O(t) || O(n) : r === "scale" ? t === 0 || n === 0 : !1;
}
function A(e, t) {
	let n = m[e];
	return n === "spatial" ? O(t) : n === "scale" ? t === 0 : !1;
}
function j(e) {
	switch (e) {
		case "x":
		case "y":
		case "z":
		case "translateX":
		case "translateY":
		case "translateZ":
		case "perspective":
		case "rotate":
		case "rotateX":
		case "rotateY":
		case "rotateZ":
		case "skew":
		case "skewX":
		case "skewY": return 0;
		case "scale":
		case "scaleX":
		case "scaleY":
		case "scaleZ": return 1;
		default: return 0;
	}
}
//#endregion
//#region src/motion/adaptedMotion.js
function M(e, t) {
	if (!e || !t) return !1;
	for (let n of [
		"x",
		"y",
		"translateX",
		"translateY"
	]) {
		let r = e[n], i = t[n], a = (e) => {
			if (typeof e != "string") return !1;
			let t = parseFloat(e);
			return !isNaN(t) && Math.abs(t) >= 100 && e.trim().endsWith("%");
		};
		if (a(r) || a(i)) return !0;
	}
	for (let n of [
		"scale",
		"scaleX",
		"scaleY"
	]) if (e[n] === 0 || t[n] === 0) return !0;
	return !1;
}
function N(e) {
	return i({
		name: `adaptedMotion.${e}`,
		inheritAttrs: !1,
		setup(i, { attrs: l, slots: u }) {
			let d = n(), f = c(null), p = c(null);
			s(() => {
				let e = a()?.proxy?.$el;
				if (e?.getBoundingClientRect) {
					let { width: t, height: n } = e.getBoundingClientRect();
					p.value = {
						width: t,
						height: n
					};
				}
				if (!d.value || !M(l.initial, l.animate)) return;
				let t = e?.getAttribute?.("data-ap");
				if (!t || typeof document > "u" || document.querySelectorAll(`[data-ap="${t}"]`).length <= 1) return;
				f.value = !1;
				let n = (l.transition?.duration ?? .3) * 1e3;
				setTimeout(() => {
					f.value = null;
				}, n);
			});
			let m = r(() => {
				if (!d.value) return l;
				let e = { ...l }, t = p.value ?? {
					width: Infinity,
					height: Infinity
				};
				e.variants && typeof e.variants == "object" && (e.variants = T(e.variants, t));
				let n = e.initial && typeof e.initial == "object" ? e.initial : null, r = e.animate && typeof e.animate == "object" ? e.animate : null;
				if (n && r && (e.initial = C(n, r, n, t), e.animate = C(n, r, r, t), e.exit && typeof e.exit == "object" && (e.exit = C(n, r, e.exit, t))), e.exit && typeof e.exit == "object" && e.exit.transition) {
					let t = e.exit.transition, { transition: n, ...r } = e.exit, i = new Set(Object.keys(r));
					e.exit = {
						...r,
						transition: D(t, i)
					};
				}
				if (e.transition && typeof e.transition == "object") {
					let t = new Set([...Object.keys(n || {}), ...Object.keys(r || {})]);
					e.transition = D(e.transition, t);
				}
				if (r && r.transition) {
					let { transition: t, ...n } = e.animate, r = new Set(Object.keys(n));
					e.animate = {
						...n,
						transition: D(t, r)
					};
				}
				if (f.value === !1 && (e.animate = { opacity: 0 }), e.style && typeof e.style == "object") {
					let t = {};
					for (let [n, r] of Object.entries(e.style)) typeof r == "object" && r && typeof r.get == "function" || (t[n] = r);
					e.style = t;
				}
				return e;
			});
			return () => o(t[e], m.value, u);
		}
	});
}
var P = {}, F = i({
	name: "AdaptedAnimatePresence",
	setup(t, { attrs: i, slots: a }) {
		let s = n(), c = r(() => s.value ? {
			...i,
			mode: "wait"
		} : i);
		return () => o(e, c.value, a);
	}
}), I = new Proxy({ AnimatePresence: F }, { get(e, t) {
	return t in e ? e[t] : (P[t] || (P[t] = N(t)), P[t]);
} });
//#endregion
export { p as _, D as a, k as c, b as d, x as f, m as g, f as h, T as i, A as l, h as m, C as n, E as o, v as p, w as r, j as s, I as t, O as u, l as v };
