//#region src/motion/config.js
var e = {
	translation: 50,
	scale: .2,
	rotation: 10
}, t = .2, n = {
	spatial: "linear",
	opacity: [
		0,
		0,
		.58,
		1
	]
}, r = {
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
//#endregion
//#region src/motion/classify.js
function i(t, n, i) {
	let a = r[t];
	if (!a) return "unknown";
	if (a === "safe") return "low";
	let o = typeof n == "string" ? parseFloat(n) : n, s = typeof i == "string" ? parseFloat(i) : i;
	if (isNaN(o) || isNaN(s)) return "unknown";
	let c;
	return c = a === "scale" ? Math.max(Math.abs(o - 1), Math.abs(s - 1)) : Math.abs(o - s), a === "spatial" ? c > e.translation ? "high" : "moderate" : a === "scale" ? c > e.scale ? "high" : "moderate" : a === "rotation" ? c > e.rotation ? "high" : "moderate" : "unknown";
}
//#endregion
export { i as classifyProperty, t as maxDuration, r as propertyCategories, n as reducedEasing, e as thresholds };
