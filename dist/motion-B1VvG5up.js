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
}, f = {
	spatial: "linear",
	opacity: [
		0,
		0,
		.58,
		1
	]
}, p = {
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
function m(e = {}) {
	e.thresholds && (l = {
		...l,
		...e.thresholds
	}), e.largeElementThresholds && (d = {
		...d,
		...e.largeElementThresholds
	}), e.largeElementBreakpoint !== void 0 && (u = e.largeElementBreakpoint), e.reducedEasing && (f = {
		...f,
		...e.reducedEasing
	});
}
//#endregion
//#region src/motion/classify.js
function h(e) {
	return e ? Math.max(e.width, e.height) > u : !1;
}
function g(e, t, n, r = null) {
	let i = p[e];
	if (!i) return "unknown";
	if (i === "safe") return "low";
	let a = typeof t == "string" ? parseFloat(t) : t, o = typeof n == "string" ? parseFloat(n) : n;
	if (isNaN(a) || isNaN(o)) return "unknown";
	let s;
	s = i === "scale" ? Math.max(Math.abs(a - 1), Math.abs(o - 1)) : Math.abs(a - o);
	let c = h(r) ? d : l;
	return i === "spatial" ? s > c.translation ? "high" : "moderate" : i === "scale" ? s > c.scale ? "high" : "moderate" : i === "rotation" ? s > c.rotation ? "high" : "moderate" : "unknown";
}
//#endregion
//#region src/motion/easing.js
var _ = [
	"linear",
	"ease",
	"ease-in",
	"ease-out",
	"ease-in-out"
];
function v(e) {
	if (!e) return !0;
	if (typeof e == "string") return _.includes(e);
	if (Array.isArray(e) && e.length === 4) {
		let [, t, , n] = e;
		return t >= 0 && t <= 1 && n >= 0 && n <= 1;
	}
	return !1;
}
function y(e) {
	return e ? ["spring", "inertia"].includes(e) : !1;
}
//#endregion
//#region src/motion/adaptMotion.js
function b(e) {
	return e ? Math.max(e.width, e.height) > u : !1;
}
function x(e, t, n, r = null) {
	let i = {}, a = new Set([
		...Object.keys(e),
		...Object.keys(t),
		...Object.keys(n)
	]), o = !1;
	for (let s of a) if (s in n) switch (g(s, e[s] ?? k(s), t[s] ?? k(s), r)) {
		case "high":
			!o && !("opacity" in n) && D(s, e[s], t[s]) ? (i.opacity = O(s, n[s]) ? 0 : 1, o = !0) : i[s] = k(s);
			break;
		case "moderate":
			i[s] = w(s, n[s], r);
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
function S(e, t, r = {}, i = null, a = null) {
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
		initial: x(e, t, e, a),
		animate: x(e, t, t, a),
		transition: T(r, o)
	};
	return i && (s.exit = x(e, t, i, a)), s;
}
function C(e, t = null) {
	let n = e.initial || {}, r = e.animate || {}, i = {};
	for (let [a, o] of Object.entries(e)) i[a] = x(n, r, o, t);
	return i;
}
function w(e, t, n = null) {
	let r = p[e], i = typeof t == "string" ? parseFloat(t) : t;
	if (isNaN(i)) return t;
	let a = b(n) ? d : l;
	return r === "spatial" ? Math.max(-a.translation, Math.min(a.translation, i)) : r === "scale" ? Math.max(1 - a.scale, Math.min(1 + a.scale, i)) : r === "rotation" ? Math.max(-a.rotation, Math.min(a.rotation, i)) : t;
}
function T(e, t) {
	let n = { ...e };
	y(e.type) && (n.type = void 0, n.stiffness = void 0, n.damping = void 0, n.bounce = void 0, n.mass = void 0, n.velocity = void 0);
	let r = [...t].some((e) => {
		let t = p[e];
		return t === "spatial" || t === "scale" || t === "rotation";
	}), i = t.has("opacity"), a = v(e.ease) ? e.ease : f.spatial;
	return i && !r ? n.ease = f.opacity : n.ease = a, n;
}
function E(e) {
	if (typeof e != "string") return !1;
	let t = parseFloat(e);
	return !isNaN(t) && Math.abs(t) >= 100 && e.trim().endsWith("%");
}
function D(e, t, n) {
	let r = p[e];
	return r === "spatial" ? E(t) || E(n) : r === "scale" ? t === 0 || n === 0 : !1;
}
function O(e, t) {
	let n = p[e];
	return n === "spatial" ? E(t) : n === "scale" ? t === 0 : !1;
}
function k(e) {
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
function A(e, t) {
	let n = { ...e };
	y(e.type) && (n.type = void 0, n.stiffness = void 0, n.damping = void 0, n.bounce = void 0, n.mass = void 0, n.velocity = void 0);
	let r = [...t].some((e) => {
		let t = p[e];
		return t === "spatial" || t === "scale" || t === "rotation";
	}), i = t.has("opacity"), a = v(e.ease) ? e.ease : f.spatial;
	return i && !r ? n.ease = f.opacity : n.ease = a, n;
}
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
				if (!t || document.querySelectorAll(`[data-ap="${t}"]`).length <= 1) return;
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
				e.variants && typeof e.variants == "object" && (e.variants = C(e.variants, t));
				let n = e.initial && typeof e.initial == "object" ? e.initial : null, r = e.animate && typeof e.animate == "object" ? e.animate : null;
				if (n && r && (e.initial = x(n, r, n, t), e.animate = x(n, r, r, t), e.exit && typeof e.exit == "object" && (e.exit = x(n, r, e.exit, t))), e.exit && typeof e.exit == "object" && e.exit.transition) {
					let t = e.exit.transition, { transition: n, ...r } = e.exit, i = new Set(Object.keys(r));
					e.exit = {
						...r,
						transition: A(t, i)
					};
				}
				if (e.transition && typeof e.transition == "object") {
					let t = new Set([...Object.keys(n || {}), ...Object.keys(r || {})]);
					e.transition = A(e.transition, t);
				}
				if (r && r.transition) {
					let { transition: t, ...n } = e.animate, r = new Set(Object.keys(n));
					e.animate = {
						...n,
						transition: A(t, r)
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
export { v as a, m as c, l as d, C as i, p as l, x as n, y as o, S as r, g as s, F as t, f as u };
