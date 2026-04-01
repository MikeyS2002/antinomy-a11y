import { AnimatePresence as e, motion as t, useReducedMotion as n } from "motion-v";
import { computed as r, defineComponent as i, getCurrentInstance as a, h as o, onMounted as s, ref as c } from "vue";
//#region src/motion/config.js
var l = {
	translation: 50,
	scale: .15,
	rotation: 10
}, u = {
	spatial: "linear",
	opacity: [
		0,
		0,
		.58,
		1
	]
}, d = {
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
function f(e = {}) {
	e.thresholds && (l = {
		...l,
		...e.thresholds
	}), e.reducedEasing && (u = {
		...u,
		...e.reducedEasing
	});
}
//#endregion
//#region src/motion/classify.js
function p(e, t, n) {
	let r = d[e];
	if (!r) return "unknown";
	if (r === "safe") return "low";
	let i = typeof t == "string" ? parseFloat(t) : t, a = typeof n == "string" ? parseFloat(n) : n;
	if (isNaN(i) || isNaN(a)) return "unknown";
	let o;
	return o = r === "scale" ? Math.max(Math.abs(i - 1), Math.abs(a - 1)) : Math.abs(i - a), r === "spatial" ? o > l.translation ? "high" : "moderate" : r === "scale" ? o > l.scale ? "high" : "moderate" : r === "rotation" ? o > l.rotation ? "high" : "moderate" : "unknown";
}
//#endregion
//#region src/motion/easing.js
var m = [
	"linear",
	"ease",
	"ease-in",
	"ease-out",
	"ease-in-out"
];
function h(e) {
	if (!e) return !0;
	if (typeof e == "string") return m.includes(e);
	if (Array.isArray(e) && e.length === 4) {
		let [, t, , n] = e;
		return t >= 0 && t <= 1 && n >= 0 && n <= 1;
	}
	return !1;
}
function g(e) {
	return e ? ["spring", "inertia"].includes(e) : !1;
}
//#endregion
//#region src/motion/adaptMotion.js
function _(e, t, n) {
	let r = {}, i = new Set([
		...Object.keys(e),
		...Object.keys(t),
		...Object.keys(n)
	]), a = !1;
	for (let o of i) if (o in n) switch (p(o, e[o] ?? T(o), t[o] ?? T(o))) {
		case "high":
			!a && !("opacity" in n) && C(o, e[o], t[o]) ? (r.opacity = w(o, n[o]) ? 0 : 1, a = !0) : r[o] = T(o);
			break;
		case "moderate":
			r[o] = b(o, n[o]);
			break;
		case "low":
			r[o] = n[o];
			break;
		case "unknown":
			r[o] = n[o];
			break;
	}
	return r;
}
function v(e, t, r = {}, i = null) {
	if (!n().value) {
		let n = {
			initial: e,
			animate: t,
			transition: r
		};
		return i && (n.exit = i), n;
	}
	let a = new Set([
		...Object.keys(e),
		...Object.keys(t),
		...i ? Object.keys(i) : []
	]), o = {
		initial: _(e, t, e),
		animate: _(e, t, t),
		transition: x(r, a)
	};
	return i && (o.exit = _(e, t, i)), o;
}
function y(e) {
	let t = e.initial || {}, n = e.animate || {}, r = {};
	for (let [i, a] of Object.entries(e)) r[i] = _(t, n, a);
	return r;
}
function b(e, t) {
	let n = d[e], r = typeof t == "string" ? parseFloat(t) : t;
	return isNaN(r) ? t : n === "spatial" ? Math.max(-l.translation, Math.min(l.translation, r)) : n === "scale" ? Math.max(1 - l.scale, Math.min(1 + l.scale, r)) : n === "rotation" ? Math.max(-l.rotation, Math.min(l.rotation, r)) : t;
}
function x(e, t) {
	let n = { ...e };
	g(e.type) && (n.type = void 0, n.stiffness = void 0, n.damping = void 0, n.bounce = void 0, n.mass = void 0, n.velocity = void 0);
	let r = [...t].some((e) => {
		let t = d[e];
		return t === "spatial" || t === "scale" || t === "rotation";
	}), i = t.has("opacity"), a = h(e.ease) ? e.ease : u.spatial;
	return i && !r ? n.ease = u.opacity : n.ease = a, n;
}
function S(e) {
	if (typeof e != "string") return !1;
	let t = parseFloat(e);
	return !isNaN(t) && Math.abs(t) >= 100 && e.trim().endsWith("%");
}
function C(e, t, n) {
	let r = d[e];
	return r === "spatial" ? S(t) || S(n) : r === "scale" ? t === 0 || n === 0 : !1;
}
function w(e, t) {
	let n = d[e];
	return n === "spatial" ? S(t) : n === "scale" ? t === 0 : !1;
}
function T(e) {
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
function E(e, t) {
	let n = { ...e };
	g(e.type) && (n.type = void 0, n.stiffness = void 0, n.damping = void 0, n.bounce = void 0, n.mass = void 0, n.velocity = void 0);
	let r = [...t].some((e) => {
		let t = d[e];
		return t === "spatial" || t === "scale" || t === "rotation";
	}), i = t.has("opacity"), a = h(e.ease) ? e.ease : u.spatial;
	return i && !r ? n.ease = u.opacity : n.ease = a, n;
}
function D(e, t) {
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
function O(e) {
	return i({
		name: `adaptedMotion.${e}`,
		inheritAttrs: !1,
		setup(i, { attrs: l, slots: u }) {
			let d = n(), f = c(null);
			s(() => {
				if (!d.value || !D(l.initial, l.animate)) return;
				let e = (a()?.proxy?.$el)?.getAttribute?.("data-ap");
				if (!e || document.querySelectorAll(`[data-ap="${e}"]`).length <= 1) return;
				f.value = !1;
				let t = (l.transition?.duration ?? .3) * 1e3;
				setTimeout(() => {
					f.value = null;
				}, t);
			});
			let p = r(() => {
				if (!d.value) return l;
				let e = { ...l };
				e.variants && typeof e.variants == "object" && (e.variants = y(e.variants));
				let t = e.initial && typeof e.initial == "object" ? e.initial : null, n = e.animate && typeof e.animate == "object" ? e.animate : null;
				if (t && n && (e.initial = _(t, n, t), e.animate = _(t, n, n), e.exit && typeof e.exit == "object" && (e.exit = _(t, n, e.exit))), e.exit && typeof e.exit == "object" && e.exit.transition) {
					let t = e.exit.transition, { transition: n, ...r } = e.exit, i = new Set(Object.keys(r));
					e.exit = {
						...r,
						transition: E(t, i)
					};
				}
				if (e.transition && typeof e.transition == "object") {
					let r = new Set([...Object.keys(t || {}), ...Object.keys(n || {})]);
					e.transition = E(e.transition, r);
				}
				if (n && n.transition) {
					let { transition: t, ...n } = e.animate, r = new Set(Object.keys(n));
					e.animate = {
						...n,
						transition: E(t, r)
					};
				}
				return f.value === !1 && (e.animate = { opacity: 0 }), e;
			});
			return () => o(t[e], p.value, u);
		}
	});
}
var k = {}, A = i({
	name: "AdaptedAnimatePresence",
	setup(t, { attrs: i, slots: a }) {
		let s = n(), c = r(() => s.value ? {
			...i,
			mode: "wait"
		} : i);
		return () => o(e, c.value, a);
	}
}), j = new Proxy({ AnimatePresence: A }, { get(e, t) {
	return t in e ? e[t] : (k[t] || (k[t] = O(t)), k[t]);
} });
//#endregion
export { h as a, f as c, l as d, y as i, d as l, _ as n, g as o, v as r, p as s, j as t, u };
