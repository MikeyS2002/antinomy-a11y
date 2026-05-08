import { AnimatePresence as e, motion as t, useReducedMotion as n, useTransform as r } from "motion-v";
import { computed as i, defineComponent as a, getCurrentInstance as o, h as s, onMounted as c, ref as l } from "vue";
//#region src/motion/config.js
var u = {
	translation: 50,
	scale: .15,
	rotation: 10
}, d = 400, f = {
	translation: 20,
	scale: 0,
	rotation: 0
}, p = .3, m = {
	spatial: "linear",
	opacity: [
		0,
		0,
		.58,
		1
	]
}, h = {
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
function g(e = {}) {
	e.thresholds && (u = {
		...u,
		...e.thresholds
	}), e.largeElementThresholds && (f = {
		...f,
		...e.largeElementThresholds
	}), e.largeElementBreakpoint !== void 0 && (d = e.largeElementBreakpoint), e.maxDuration !== void 0 && (p = e.maxDuration), e.reducedEasing && (m = {
		...m,
		...e.reducedEasing
	});
}
//#endregion
//#region src/motion/classify.js
function _(e) {
	return e ? Math.max(e.width, e.height) > d : !1;
}
function v(e, t, n) {
	let r = _(n) ? f : u;
	return e === "spatial" ? t > r.translation ? "high" : "moderate" : e === "scale" ? t > r.scale ? "high" : "moderate" : e === "rotation" ? t > r.rotation ? "high" : "moderate" : "unknown";
}
function y(e, t, n, r = null) {
	let i = h[e];
	if (!i) return "unknown";
	if (i === "safe") return "low";
	if (Array.isArray(t) || Array.isArray(n)) {
		let e = [...Array.isArray(t) ? t : [t], ...Array.isArray(n) ? n : [n]].map((e) => typeof e == "string" ? parseFloat(e) : e);
		if (e.some(isNaN)) return "unknown";
		let a = 0;
		if (i === "scale") for (let t of e) a = Math.max(a, Math.abs(t - 1));
		else for (let t = 1; t < e.length; t++) a = Math.max(a, Math.abs(e[t] - e[t - 1]));
		return v(i, a, r);
	}
	let a = typeof t == "string" ? parseFloat(t) : t, o = typeof n == "string" ? parseFloat(n) : n;
	if (isNaN(a) || isNaN(o)) return "unknown";
	let s;
	return s = i === "scale" ? Math.max(Math.abs(a - 1), Math.abs(o - 1)) : Math.abs(a - o), v(i, s, r);
}
//#endregion
//#region src/motion/easing.js
var b = [
	"linear",
	"ease",
	"ease-in",
	"ease-out",
	"ease-in-out"
];
function x(e) {
	if (!e) return !0;
	if (typeof e == "string") return b.includes(e);
	if (Array.isArray(e) && e.length === 4) {
		let [, t, , n] = e;
		return t >= 0 && t <= 1 && n >= 0 && n <= 1;
	}
	return !1;
}
function S(e) {
	return e ? ["spring", "inertia"].includes(e) : !1;
}
//#endregion
//#region src/motion/adaptMotion.js
function C(e) {
	return e ? Math.max(e.width, e.height) > d : !1;
}
function w(e, t, n, r = null) {
	let i = {}, a = new Set([
		...Object.keys(e),
		...Object.keys(t),
		...Object.keys(n)
	]), o = !1;
	for (let s of a) if (s in n) switch (y(s, e[s] ?? M(s), t[s] ?? M(s), r)) {
		case "high":
			!o && !("opacity" in n) && A(s, e[s], t[s]) ? (i.opacity = j(s, n[s]) ? 0 : 1, o = !0) : Array.isArray(n[s]) ? i[s] = n[s].map(() => M(s)) : i[s] = M(s);
			break;
		case "moderate":
			Array.isArray(n[s]) ? i[s] = n[s].map((e) => D(s, e, r)) : i[s] = D(s, n[s], r);
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
function T(e, t, r = {}, i = null, a = null) {
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
		initial: w(e, t, e, a),
		animate: w(e, t, t, a),
		transition: O(r, o)
	};
	return i && (s.exit = w(e, t, i, a)), s;
}
function E(e, t = null) {
	let n = e.initial || {}, r = e.animate || {}, i = {};
	for (let [a, o] of Object.entries(e)) i[a] = w(n, r, o, t);
	return i;
}
function D(e, t, n = null) {
	let r = h[e], i = typeof t == "string" ? parseFloat(t) : t;
	if (isNaN(i)) return t;
	let a = C(n) ? f : u;
	return r === "spatial" ? Math.max(-a.translation, Math.min(a.translation, i)) : r === "scale" ? Math.max(1 - a.scale, Math.min(1 + a.scale, i)) : r === "rotation" ? Math.max(-a.rotation, Math.min(a.rotation, i)) : t;
}
function O(e, t) {
	let n = { ...e };
	S(e.type) && (n.type = void 0, n.stiffness = void 0, n.damping = void 0, n.bounce = void 0, n.mass = void 0, n.velocity = void 0), n.repeat = 0, n.repeatType = void 0, n.repeatDelay = void 0;
	let r = [...t].some((e) => {
		let t = h[e];
		return t === "spatial" || t === "scale" || t === "rotation";
	}), i = t.has("opacity"), a = x(e.ease) ? e.ease : m.spatial;
	return i && !r ? n.ease = m.opacity : n.ease = a, n.duration !== void 0 && n.duration > p && (n.duration = p), n;
}
function k(e) {
	if (typeof e != "string") return !1;
	let t = parseFloat(e);
	return !isNaN(t) && Math.abs(t) >= 100 && e.trim().endsWith("%");
}
function A(e, t, n) {
	let r = h[e];
	return r === "spatial" ? k(t) || k(n) : r === "scale" ? t === 0 || n === 0 : !1;
}
function j(e, t) {
	let n = h[e];
	return n === "spatial" ? k(t) : n === "scale" ? t === 0 : !1;
}
function M(e) {
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
function N(e) {
	let t = {};
	for (let n of Object.keys(e)) t[n] = M(n);
	return t;
}
var P = new Set([
	"x",
	"y",
	"translateX",
	"translateY"
]);
function F(e) {
	return typeof e == "object" && !!e && typeof e.get == "function";
}
function I(e) {
	if (typeof e != "string") return !1;
	let t = parseFloat(e);
	return !isNaN(t) && Math.abs(t) >= 100 && e.trim().endsWith("%");
}
function L(e, t) {
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
function R(e) {
	return a({
		name: `adaptedMotion.${e}`,
		inheritAttrs: !1,
		setup(a, { attrs: u, slots: d }) {
			let f = n(), p = l(null), m = l(null), h = (() => {
				if (!u.style || typeof u.style != "object") return null;
				for (let [e, t] of Object.entries(u.style)) if (P.has(e) && F(t) && I(t.get())) return r(t, (e) => {
					let t = Math.abs(typeof e == "string" ? parseFloat(e) : e);
					return isNaN(t) ? 1 : Math.max(0, Math.min(1, 1 - t / 100));
				});
				return null;
			})();
			c(() => {
				let e = o()?.proxy?.$el;
				if (e?.getBoundingClientRect) {
					let { width: t, height: n } = e.getBoundingClientRect();
					m.value = {
						width: t,
						height: n
					};
				}
				if (!f.value || !L(u.initial, u.animate)) return;
				let t = e?.getAttribute?.("data-ap");
				if (!t || typeof document > "u" || document.querySelectorAll(`[data-ap="${t}"]`).length <= 1) return;
				p.value = !1;
				let n = (u.transition?.duration ?? .3) * 1e3;
				setTimeout(() => {
					p.value = null;
				}, n);
			});
			let g = i(() => {
				if (!f.value) return u;
				let e = { ...u }, t = m.value ?? {
					width: Infinity,
					height: Infinity
				};
				e.variants && typeof e.variants == "object" && (e.variants = E(e.variants, t));
				let n = e.initial && typeof e.initial == "object" ? e.initial : null, r = e.animate && typeof e.animate == "object" ? e.animate : null, i = null, a = null;
				if (r ? a = r : e.whileInView && typeof e.whileInView == "object" ? (i = "whileInView", a = e.whileInView) : e["while-in-view"] && typeof e["while-in-view"] == "object" && (i = "while-in-view", a = e["while-in-view"]), n && a) {
					e.initial = w(n, a, n, t);
					let r = w(n, a, a, t);
					i ? e[i] = r : e.animate = r, e.exit && typeof e.exit == "object" && (e.exit = w(n, a, e.exit, t));
				}
				for (let [n, r] of [
					["whileHover", "while-hover"],
					["whileTap", "while-tap"],
					["whileFocus", "while-focus"],
					["whileDrag", "while-drag"]
				]) {
					let i = e[n] === void 0 ? r : n, a = e[i];
					!a || typeof a != "object" || (e[i] = w(N(a), a, a, t));
				}
				if (e.exit && typeof e.exit == "object" && e.exit.transition) {
					let t = e.exit.transition, { transition: n, ...r } = e.exit, i = new Set(Object.keys(r));
					e.exit = {
						...r,
						transition: O(t, i)
					};
				}
				if (e.transition && typeof e.transition == "object") {
					let t = new Set([...Object.keys(n || {}), ...Object.keys(r || {})]);
					e.transition = O(e.transition, t);
				}
				if (r && r.transition) {
					let { transition: t, ...n } = e.animate, r = new Set(Object.keys(n));
					e.animate = {
						...n,
						transition: O(t, r)
					};
				}
				if (p.value === !1 && (e.animate = { opacity: 0 }), e.style && typeof e.style == "object") {
					let t = {};
					for (let [n, r] of Object.entries(e.style)) F(r) || (t[n] = r);
					h && t.opacity === void 0 && (t.opacity = h), e.style = t;
				}
				return e;
			});
			return () => s(t[e], g.value, d);
		}
	});
}
var z = {}, B = a({
	name: "AdaptedAnimatePresence",
	setup(t, { attrs: r, slots: a }) {
		let o = n(), c = i(() => o.value ? {
			...r,
			mode: "wait"
		} : r);
		return () => s(e, c.value, a);
	}
}), V = new Proxy({ AnimatePresence: B }, { get(e, t) {
	return t in e ? e[t] : (z[t] || (z[t] = R(t)), z[t]);
} });
//#endregion
export { m as _, O as a, A as c, x as d, S as f, h as g, p as h, E as i, j as l, g as m, w as n, D as o, y as p, T as r, M as s, V as t, k as u, u as v };
