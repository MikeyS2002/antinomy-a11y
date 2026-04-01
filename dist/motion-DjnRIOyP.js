import { motion as e, useReducedMotion as t } from "motion-v";
import { computed as n, defineComponent as r, h as i } from "vue";
//#region src/motion/config.js
var a = {
	translation: 50,
	scale: .15,
	rotation: 10
}, o = {
	spatial: "linear",
	opacity: [
		0,
		0,
		.58,
		1
	]
}, s = {
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
function c(e = {}) {
	e.thresholds && (a = {
		...a,
		...e.thresholds
	}), e.reducedEasing && (o = {
		...o,
		...e.reducedEasing
	});
}
//#endregion
//#region src/motion/classify.js
function l(e, t, n) {
	let r = s[e];
	if (!r) return "unknown";
	if (r === "safe") return "low";
	let i = typeof t == "string" ? parseFloat(t) : t, o = typeof n == "string" ? parseFloat(n) : n;
	if (isNaN(i) || isNaN(o)) return "unknown";
	let c;
	return c = r === "scale" ? Math.max(Math.abs(i - 1), Math.abs(o - 1)) : Math.abs(i - o), r === "spatial" ? c > a.translation ? "high" : "moderate" : r === "scale" ? c > a.scale ? "high" : "moderate" : r === "rotation" ? c > a.rotation ? "high" : "moderate" : "unknown";
}
//#endregion
//#region src/motion/easing.js
var u = [
	"linear",
	"ease",
	"ease-in",
	"ease-out",
	"ease-in-out"
];
function d(e) {
	if (!e) return !0;
	if (typeof e == "string") return u.includes(e);
	if (Array.isArray(e) && e.length === 4) {
		let [, t, , n] = e;
		return t >= 0 && t <= 1 && n >= 0 && n <= 1;
	}
	return !1;
}
function f(e) {
	return e ? ["spring", "inertia"].includes(e) : !1;
}
//#endregion
//#region src/motion/adaptMotion.js
function p(e, t, n) {
	let r = {}, i = new Set([
		...Object.keys(e),
		...Object.keys(t),
		...Object.keys(n)
	]), a = !1;
	for (let o of i) if (o in n) switch (l(o, e[o] ?? b(o), t[o] ?? b(o))) {
		case "high":
			y(o) && (v(e[o]) || v(t[o])) && !a && !("opacity" in n) ? (r.opacity = v(n[o]) ? 0 : 1, a = !0) : r[o] = b(o);
			break;
		case "moderate":
			r[o] = g(o, n[o]);
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
function m(e, n, r = {}, i = null) {
	if (!t().value) {
		let t = {
			initial: e,
			animate: n,
			transition: r
		};
		return i && (t.exit = i), t;
	}
	let a = new Set([
		...Object.keys(e),
		...Object.keys(n),
		...i ? Object.keys(i) : []
	]), o = {
		initial: p(e, n, e),
		animate: p(e, n, n),
		transition: _(r, a)
	};
	return i && (o.exit = p(e, n, i)), o;
}
function h(e) {
	let t = e.initial || {}, n = e.animate || {}, r = {};
	for (let [i, a] of Object.entries(e)) r[i] = p(t, n, a);
	return r;
}
function g(e, t) {
	let n = s[e], r = typeof t == "string" ? parseFloat(t) : t;
	return isNaN(r) ? t : n === "spatial" ? Math.max(-a.translation, Math.min(a.translation, r)) : n === "scale" ? Math.max(1 - a.scale, Math.min(1 + a.scale, r)) : n === "rotation" ? Math.max(-a.rotation, Math.min(a.rotation, r)) : t;
}
function _(e, t) {
	let n = { ...e };
	f(e.type) && (n.type = void 0, n.stiffness = void 0, n.damping = void 0, n.bounce = void 0, n.mass = void 0, n.velocity = void 0);
	let r = [...t].some((e) => {
		let t = s[e];
		return t === "spatial" || t === "scale" || t === "rotation";
	}), i = t.has("opacity"), a = d(e.ease) ? e.ease : o.spatial;
	return i && !r ? n.ease = o.opacity : n.ease = a, n;
}
function v(e) {
	if (typeof e != "string") return !1;
	let t = e.trim();
	return t === "100%" || t === "-100%";
}
function y(e) {
	return e === "x" || e === "y" || e === "translateX" || e === "translateY";
}
function b(e) {
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
function x(e, t) {
	let n = { ...e };
	f(e.type) && (n.type = void 0, n.stiffness = void 0, n.damping = void 0, n.bounce = void 0, n.mass = void 0, n.velocity = void 0);
	let r = [...t].some((e) => {
		let t = s[e];
		return t === "spatial" || t === "scale" || t === "rotation";
	}), i = t.has("opacity"), a = d(e.ease) ? e.ease : o.spatial;
	return i && !r ? n.ease = o.opacity : n.ease = a, n;
}
function S(a) {
	return r({
		name: `adaptedMotion.${a}`,
		inheritAttrs: !1,
		setup(r, { attrs: o, slots: s }) {
			let c = t(), l = n(() => {
				if (!c.value) return o;
				let e = { ...o };
				e.variants && typeof e.variants == "object" && (e.variants = h(e.variants));
				let t = e.initial && typeof e.initial == "object" ? e.initial : null, n = e.animate && typeof e.animate == "object" ? e.animate : null;
				if (t && n && (e.initial = p(t, n, t), e.animate = p(t, n, n), e.exit && typeof e.exit == "object" && (e.exit = p(t, n, e.exit))), e.exit && typeof e.exit == "object" && e.exit.transition) {
					let t = e.exit.transition, { transition: n, ...r } = e.exit, i = new Set(Object.keys(r));
					e.exit = {
						...r,
						transition: x(t, i)
					};
				}
				if (e.transition && typeof e.transition == "object") {
					let r = new Set([...Object.keys(t || {}), ...Object.keys(n || {})]);
					e.transition = x(e.transition, r);
				}
				if (n && n.transition) {
					let { transition: t, ...n } = e.animate, r = new Set(Object.keys(n));
					e.animate = {
						...n,
						transition: x(t, r)
					};
				}
				return e;
			});
			return () => i(e[a], l.value, s);
		}
	});
}
var C = {}, w = new Proxy({}, { get(e, t) {
	return C[t] || (C[t] = S(t)), C[t];
} });
//#endregion
export { d as a, c, a as d, h as i, s as l, p as n, f as o, m as r, l as s, w as t, o as u };
