import { useReducedMotion as e } from "motion-v";
//#region src/motion/config.js
var t = {
	translation: 50,
	scale: .2,
	rotation: 10
}, n = .2, r = {
	spatial: "linear",
	opacity: [
		0,
		0,
		.58,
		1
	]
}, i = {
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
function a(e = {}) {
	e.thresholds && (t = {
		...t,
		...e.thresholds
	}), e.maxDuration !== void 0 && (n = e.maxDuration), e.reducedEasing && (r = {
		...r,
		...e.reducedEasing
	});
}
//#endregion
//#region src/motion/classify.js
function o(e, n, r) {
	let a = i[e];
	if (!a) return "unknown";
	if (a === "safe") return "low";
	let o = typeof n == "string" ? parseFloat(n) : n, s = typeof r == "string" ? parseFloat(r) : r;
	if (isNaN(o) || isNaN(s)) return "unknown";
	let c;
	return c = a === "scale" ? Math.max(Math.abs(o - 1), Math.abs(s - 1)) : Math.abs(o - s), a === "spatial" ? c > t.translation ? "high" : "moderate" : a === "scale" ? c > t.scale ? "high" : "moderate" : a === "rotation" ? c > t.rotation ? "high" : "moderate" : "unknown";
}
//#endregion
//#region src/motion/easing.js
var s = [
	"linear",
	"ease",
	"ease-in",
	"ease-out",
	"ease-in-out"
];
function c(e) {
	if (!e) return !0;
	if (typeof e == "string") return s.includes(e);
	if (Array.isArray(e) && e.length === 4) {
		let [, t, , n] = e;
		return t >= 0 && t <= 1 && n >= 0 && n <= 1;
	}
	return !1;
}
function l(e) {
	return e ? ["spring", "inertia"].includes(e) : !1;
}
//#endregion
//#region src/motion/adaptMotion.js
function u(t, n, r = {}) {
	if (!e().value) return {
		initial: t,
		animate: n,
		transition: r
	};
	let i = {}, a = {}, s = new Set([...Object.keys(t), ...Object.keys(n)]);
	for (let e of s) {
		let r = t[e] ?? p(e), s = n[e] ?? p(e);
		switch (o(e, r, s)) {
			case "high": {
				let r = p(e);
				e in t && (i[e] = r), e in n && (a[e] = r);
				break;
			}
			case "moderate":
				e in t && (i[e] = d(e, r)), e in n && (a[e] = d(e, s));
				break;
			case "low":
				e in t && (i[e] = t[e]), e in n && (a[e] = n[e]);
				break;
			case "unknown":
				e in t && (i[e] = t[e]), e in n && (a[e] = n[e]);
				break;
		}
	}
	return {
		initial: i,
		animate: a,
		transition: f(r, s)
	};
}
function d(e, n) {
	let r = i[e], a = typeof n == "string" ? parseFloat(n) : n;
	return isNaN(a) ? n : r === "spatial" ? Math.max(-t.translation, Math.min(t.translation, a)) : r === "scale" ? Math.max(1 - t.scale, Math.min(1 + t.scale, a)) : r === "rotation" ? Math.max(-t.rotation, Math.min(t.rotation, a)) : n;
}
function f(e, t) {
	let a = {
		...e,
		duration: Math.min(e.duration ?? n, n)
	};
	l(e.type) && (a.type = void 0, a.stiffness = void 0, a.damping = void 0, a.bounce = void 0, a.mass = void 0, a.velocity = void 0);
	let o = [...t].some((e) => {
		let t = i[e];
		return t === "spatial" || t === "scale" || t === "rotation";
	}), s = t.has("opacity"), u = c(e.ease) ? e.ease : r.spatial;
	return o && s ? (a.ease = u, a.opacity = {
		duration: Math.min(e.duration ?? n, n),
		ease: r.opacity
	}) : s && !o ? a.ease = r.opacity : a.ease = u, a;
}
function p(e) {
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
export { u as adaptMotion, o as classifyProperty, a as configureMotion, c as isSafeEasing, l as isUnsafeTransitionType, n as maxDuration, i as propertyCategories, r as reducedEasing, t as thresholds };
