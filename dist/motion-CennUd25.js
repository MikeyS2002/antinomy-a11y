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
	translateX: "spatial",
	translateY: "spatial",
	scale: "scale",
	scaleX: "scale",
	scaleY: "scale",
	rotate: "rotation",
	rotateX: "rotation",
	rotateY: "rotation",
	rotateZ: "rotation",
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
function _(e, t, n, r = null) {
	let i = m[e];
	if (!i) return "unknown";
	if (i === "safe") return "low";
	let a = typeof t == "string" ? parseFloat(t) : t, o = typeof n == "string" ? parseFloat(n) : n;
	if (isNaN(a) || isNaN(o)) return "unknown";
	let s;
	s = i === "scale" ? Math.max(Math.abs(a - 1), Math.abs(o - 1)) : Math.abs(a - o);
	let c = g(r) ? d : l;
	return i === "spatial" ? s > c.translation ? "high" : "moderate" : i === "scale" ? s > c.scale ? "high" : "moderate" : i === "rotation" ? s > c.rotation ? "high" : "moderate" : "unknown";
}
//#endregion
//#region src/motion/easing.js
var v = [
	"linear",
	"ease",
	"ease-in",
	"ease-out",
	"ease-in-out"
];
function y(e) {
	if (!e) return !0;
	if (typeof e == "string") return v.includes(e);
	if (Array.isArray(e) && e.length === 4) {
		let [, t, , n] = e;
		return t >= 0 && t <= 1 && n >= 0 && n <= 1;
	}
	return !1;
}
function b(e) {
	return e ? ["spring", "inertia"].includes(e) : !1;
}
//#endregion
//#region src/motion/adaptMotion.js
function x(e) {
	return e ? Math.max(e.width, e.height) > u : !1;
}
function S(e, t, n, r = null) {
	let i = {}, a = new Set([
		...Object.keys(e),
		...Object.keys(t),
		...Object.keys(n)
	]), o = !1;
	for (let s of a) if (s in n) switch (_(s, e[s] ?? A(s), t[s] ?? A(s), r)) {
		case "high":
			!o && !("opacity" in n) && O(s, e[s], t[s]) ? (i.opacity = k(s, n[s]) ? 0 : 1, o = !0) : i[s] = A(s);
			break;
		case "moderate":
			i[s] = T(s, n[s], r);
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
function C(e, t, r = {}, i = null, a = null) {
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
		initial: S(e, t, e, a),
		animate: S(e, t, t, a),
		transition: E(r, o)
	};
	return i && (s.exit = S(e, t, i, a)), s;
}
function w(e, t = null) {
	let n = e.initial || {}, r = e.animate || {}, i = {};
	for (let [a, o] of Object.entries(e)) i[a] = S(n, r, o, t);
	return i;
}
function T(e, t, n = null) {
	let r = m[e], i = typeof t == "string" ? parseFloat(t) : t;
	if (isNaN(i)) return t;
	let a = x(n) ? d : l;
	return r === "spatial" ? Math.max(-a.translation, Math.min(a.translation, i)) : r === "scale" ? Math.max(1 - a.scale, Math.min(1 + a.scale, i)) : r === "rotation" ? Math.max(-a.rotation, Math.min(a.rotation, i)) : t;
}
function E(e, t) {
	let n = { ...e };
	b(e.type) && (n.type = void 0, n.stiffness = void 0, n.damping = void 0, n.bounce = void 0, n.mass = void 0, n.velocity = void 0);
	let r = [...t].some((e) => {
		let t = m[e];
		return t === "spatial" || t === "scale" || t === "rotation";
	}), i = t.has("opacity"), a = y(e.ease) ? e.ease : p.spatial;
	return i && !r ? n.ease = p.opacity : n.ease = a, n.duration !== void 0 && n.duration > f && (n.duration = f), n;
}
function D(e) {
	if (typeof e != "string") return !1;
	let t = parseFloat(e);
	return !isNaN(t) && Math.abs(t) >= 100 && e.trim().endsWith("%");
}
function O(e, t, n) {
	let r = m[e];
	return r === "spatial" ? D(t) || D(n) : r === "scale" ? t === 0 || n === 0 : !1;
}
function k(e, t) {
	let n = m[e];
	return n === "spatial" ? D(t) : n === "scale" ? t === 0 : !1;
}
function A(e) {
	switch (e) {
		case "x":
		case "y":
		case "translateX":
		case "translateY":
		case "rotate":
		case "rotateX":
		case "rotateY":
		case "rotateZ": return 0;
		case "scale":
		case "scaleX":
		case "scaleY": return 1;
		default: return 0;
	}
}
//#endregion
//#region src/motion/adaptedMotion.js
function j(e, t) {
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
function M(e) {
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
				if (!d.value || !j(l.initial, l.animate)) return;
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
				e.variants && typeof e.variants == "object" && (e.variants = w(e.variants, t));
				let n = e.initial && typeof e.initial == "object" ? e.initial : null, r = e.animate && typeof e.animate == "object" ? e.animate : null;
				if (n && r && (e.initial = S(n, r, n, t), e.animate = S(n, r, r, t), e.exit && typeof e.exit == "object" && (e.exit = S(n, r, e.exit, t))), e.exit && typeof e.exit == "object" && e.exit.transition) {
					let t = e.exit.transition, { transition: n, ...r } = e.exit, i = new Set(Object.keys(r));
					e.exit = {
						...r,
						transition: E(t, i)
					};
				}
				if (e.transition && typeof e.transition == "object") {
					let t = new Set([...Object.keys(n || {}), ...Object.keys(r || {})]);
					e.transition = E(e.transition, t);
				}
				if (r && r.transition) {
					let { transition: t, ...n } = e.animate, r = new Set(Object.keys(n));
					e.animate = {
						...n,
						transition: E(t, r)
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
var N = {}, P = i({
	name: "AdaptedAnimatePresence",
	setup(t, { attrs: i, slots: a }) {
		let s = n(), c = r(() => s.value ? {
			...i,
			mode: "wait"
		} : i);
		return () => o(e, c.value, a);
	}
}), F = new Proxy({ AnimatePresence: P }, { get(e, t) {
	return t in e ? e[t] : (N[t] || (N[t] = M(t)), N[t]);
} });
//#endregion
export { p as _, E as a, O as c, y as d, b as f, m as g, f as h, w as i, k as l, h as m, S as n, T as o, _ as p, C as r, A as s, F as t, D as u, l as v };
