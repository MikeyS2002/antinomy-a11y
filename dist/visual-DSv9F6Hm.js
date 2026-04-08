import { computed as e, isRef as t, onScopeDispose as n, ref as r, toValue as i, watch as a } from "vue";
//#region node_modules/tabbable/dist/index.esm.js
var o = [
	"input:not([inert]):not([inert] *)",
	"select:not([inert]):not([inert] *)",
	"textarea:not([inert]):not([inert] *)",
	"a[href]:not([inert]):not([inert] *)",
	"button:not([inert]):not([inert] *)",
	"[tabindex]:not(slot):not([inert]):not([inert] *)",
	"audio[controls]:not([inert]):not([inert] *)",
	"video[controls]:not([inert]):not([inert] *)",
	"[contenteditable]:not([contenteditable=\"false\"]):not([inert]):not([inert] *)",
	"details>summary:first-of-type:not([inert]):not([inert] *)",
	"details:not([inert]):not([inert] *)"
], s = /* @__PURE__ */ o.join(","), c = typeof Element > "u", l = c ? function() {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, u = !c && Element.prototype.getRootNode ? function(e) {
	return e?.getRootNode?.call(e);
} : function(e) {
	return e?.ownerDocument;
}, d = function(e, t) {
	t === void 0 && (t = !0);
	var n = e?.getAttribute?.call(e, "inert");
	return n === "" || n === "true" || t && e && (typeof e.closest == "function" ? e.closest("[inert]") : d(e.parentNode));
}, f = function(e) {
	var t = e?.getAttribute?.call(e, "contenteditable");
	return t === "" || t === "true";
}, p = function(e, t, n) {
	if (d(e)) return [];
	var r = Array.prototype.slice.apply(e.querySelectorAll(s));
	return t && l.call(e, s) && r.unshift(e), r = r.filter(n), r;
}, m = function(e, t, n) {
	for (var r = [], i = Array.from(e); i.length;) {
		var a = i.shift();
		if (!d(a, !1)) if (a.tagName === "SLOT") {
			var o = a.assignedElements(), c = m(o.length ? o : a.children, !0, n);
			n.flatten ? r.push.apply(r, c) : r.push({
				scopeParent: a,
				candidates: c
			});
		} else {
			l.call(a, s) && n.filter(a) && (t || !e.includes(a)) && r.push(a);
			var u = a.shadowRoot || typeof n.getShadowRoot == "function" && n.getShadowRoot(a), f = !d(u, !1) && (!n.shadowRootFilter || n.shadowRootFilter(a));
			if (u && f) {
				var p = m(u === !0 ? a.children : u.children, !0, n);
				n.flatten ? r.push.apply(r, p) : r.push({
					scopeParent: a,
					candidates: p
				});
			} else i.unshift.apply(i, a.children);
		}
	}
	return r;
}, h = function(e) {
	return !isNaN(parseInt(e.getAttribute("tabindex"), 10));
}, g = function(e) {
	if (!e) throw Error("No node provided");
	return e.tabIndex < 0 && (/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || f(e)) && !h(e) ? 0 : e.tabIndex;
}, _ = function(e, t) {
	var n = g(e);
	return n < 0 && t && !h(e) ? 0 : n;
}, v = function(e, t) {
	return e.tabIndex === t.tabIndex ? e.documentOrder - t.documentOrder : e.tabIndex - t.tabIndex;
}, y = function(e) {
	return e.tagName === "INPUT";
}, b = function(e) {
	return y(e) && e.type === "hidden";
}, x = function(e) {
	return e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(e) {
		return e.tagName === "SUMMARY";
	});
}, S = function(e, t) {
	for (var n = 0; n < e.length; n++) if (e[n].checked && e[n].form === t) return e[n];
}, C = function(e) {
	if (!e.name) return !0;
	var t = e.form || u(e), n = function(e) {
		return t.querySelectorAll("input[type=\"radio\"][name=\"" + e + "\"]");
	}, r;
	if (typeof window < "u" && window.CSS !== void 0 && typeof window.CSS.escape == "function") r = n(window.CSS.escape(e.name));
	else try {
		r = n(e.name);
	} catch (e) {
		return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", e.message), !1;
	}
	var i = S(r, e.form);
	return !i || i === e;
}, w = function(e) {
	return y(e) && e.type === "radio";
}, T = function(e) {
	return w(e) && !C(e);
}, E = function(e) {
	var t = e && u(e), n = t?.host, r = !1;
	if (t && t !== e) {
		var i, a, o;
		for (r = !!((i = n) != null && (a = i.ownerDocument) != null && a.contains(n) || e != null && (o = e.ownerDocument) != null && o.contains(e)); !r && n;) {
			var s, c;
			t = u(n), n = t?.host, r = !!((s = n) != null && (c = s.ownerDocument) != null && c.contains(n));
		}
	}
	return r;
}, D = function(e) {
	var t = e.getBoundingClientRect(), n = t.width, r = t.height;
	return n === 0 && r === 0;
}, ee = function(e, t) {
	var n = t.displayCheck, r = t.getShadowRoot;
	if (n === "full-native" && "checkVisibility" in e) return !e.checkVisibility({
		checkOpacity: !1,
		opacityProperty: !1,
		contentVisibilityAuto: !0,
		visibilityProperty: !0,
		checkVisibilityCSS: !0
	});
	if (getComputedStyle(e).visibility === "hidden") return !0;
	var i = l.call(e, "details>summary:first-of-type") ? e.parentElement : e;
	if (l.call(i, "details:not([open]) *")) return !0;
	if (!n || n === "full" || n === "full-native" || n === "legacy-full") {
		if (typeof r == "function") {
			for (var a = e; e;) {
				var o = e.parentElement, s = u(e);
				if (o && !o.shadowRoot && r(o) === !0) return D(e);
				e = e.assignedSlot ? e.assignedSlot : !o && s !== e.ownerDocument ? s.host : o;
			}
			e = a;
		}
		if (E(e)) return !e.getClientRects().length;
		if (n !== "legacy-full") return !0;
	} else if (n === "non-zero-area") return D(e);
	return !1;
}, O = function(e) {
	if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName)) for (var t = e.parentElement; t;) {
		if (t.tagName === "FIELDSET" && t.disabled) {
			for (var n = 0; n < t.children.length; n++) {
				var r = t.children.item(n);
				if (r.tagName === "LEGEND") return l.call(t, "fieldset[disabled] *") ? !0 : !r.contains(e);
			}
			return !0;
		}
		t = t.parentElement;
	}
	return !1;
}, k = function(e, t) {
	return !(t.disabled || b(t) || ee(t, e) || x(t) || O(t));
}, A = function(e, t) {
	return !(T(t) || g(t) < 0 || !k(e, t));
}, te = function(e) {
	var t = parseInt(e.getAttribute("tabindex"), 10);
	return !!(isNaN(t) || t >= 0);
}, j = function(e) {
	var t = [], n = [];
	return e.forEach(function(e, r) {
		var i = !!e.scopeParent, a = i ? e.scopeParent : e, o = _(a, i), s = i ? j(e.candidates) : a;
		o === 0 ? i ? t.push.apply(t, s) : t.push(a) : n.push({
			documentOrder: r,
			tabIndex: o,
			item: e,
			isScope: i,
			content: s
		});
	}), n.sort(v).reduce(function(e, t) {
		return t.isScope ? e.push.apply(e, t.content) : e.push(t.content), e;
	}, []).concat(t);
}, ne = function(e, t) {
	return t ||= {}, j(t.getShadowRoot ? m([e], t.includeContainer, {
		filter: A.bind(null, t),
		flatten: !1,
		getShadowRoot: t.getShadowRoot,
		shadowRootFilter: te
	}) : p(e, t.includeContainer, A.bind(null, t)));
}, re = function(e, t) {
	return t ||= {}, t.getShadowRoot ? m([e], t.includeContainer, {
		filter: k.bind(null, t),
		flatten: !0,
		getShadowRoot: t.getShadowRoot
	}) : p(e, t.includeContainer, k.bind(null, t));
}, M = function(e, t) {
	if (t ||= {}, !e) throw Error("No node provided");
	return l.call(e, s) === !1 ? !1 : A(t, e);
}, ie = /* @__PURE__ */ o.concat("iframe:not([inert]):not([inert] *)").join(","), N = function(e, t) {
	if (t ||= {}, !e) throw Error("No node provided");
	return l.call(e, ie) === !1 ? !1 : k(t, e);
};
//#endregion
//#region node_modules/focus-trap/dist/focus-trap.esm.js
function P(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function ae(e) {
	if (Array.isArray(e)) return P(e);
}
function F(e, t, n, r, i, a, o) {
	try {
		var s = e[a](o), c = s.value;
	} catch (e) {
		n(e);
		return;
	}
	s.done ? t(c) : Promise.resolve(c).then(r, i);
}
function I(e) {
	return function() {
		var t = this, n = arguments;
		return new Promise(function(r, i) {
			var a = e.apply(t, n);
			function o(e) {
				F(a, r, i, o, s, "next", e);
			}
			function s(e) {
				F(a, r, i, o, s, "throw", e);
			}
			o(void 0);
		});
	};
}
function L(e, t) {
	var n = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (!n) {
		if (Array.isArray(e) || (n = H(e)) || t) {
			n && (e = n);
			var r = 0, i = function() {};
			return {
				s: i,
				n: function() {
					return r >= e.length ? { done: !0 } : {
						done: !1,
						value: e[r++]
					};
				},
				e: function(e) {
					throw e;
				},
				f: i
			};
		}
		throw TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	var a, o = !0, s = !1;
	return {
		s: function() {
			n = n.call(e);
		},
		n: function() {
			var e = n.next();
			return o = e.done, e;
		},
		e: function(e) {
			s = !0, a = e;
		},
		f: function() {
			try {
				o || n.return == null || n.return();
			} finally {
				if (s) throw a;
			}
		}
	};
}
function oe(e, t, n) {
	return (t = de(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function se(e) {
	if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function ce() {
	throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function R(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function z(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? R(Object(n), !0).forEach(function(t) {
			oe(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : R(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function B() {
	var e, t, n = typeof Symbol == "function" ? Symbol : {}, r = n.iterator || "@@iterator", i = n.toStringTag || "@@toStringTag";
	function a(n, r, i, a) {
		var c = r && r.prototype instanceof s ? r : s, l = Object.create(c.prototype);
		return V(l, "_invoke", function(n, r, i) {
			var a, s, c, l = 0, u = i || [], d = !1, f = {
				p: 0,
				n: 0,
				v: e,
				a: p,
				f: p.bind(e, 4),
				d: function(t, n) {
					return a = t, s = 0, c = e, f.n = n, o;
				}
			};
			function p(n, r) {
				for (s = n, c = r, t = 0; !d && l && !i && t < u.length; t++) {
					var i, a = u[t], p = f.p, m = a[2];
					n > 3 ? (i = m === r) && (c = a[(s = a[4]) ? 5 : (s = 3, 3)], a[4] = a[5] = e) : a[0] <= p && ((i = n < 2 && p < a[1]) ? (s = 0, f.v = r, f.n = a[1]) : p < m && (i = n < 3 || a[0] > r || r > m) && (a[4] = n, a[5] = r, f.n = m, s = 0));
				}
				if (i || n > 1) return o;
				throw d = !0, r;
			}
			return function(i, u, m) {
				if (l > 1) throw TypeError("Generator is already running");
				for (d && u === 1 && p(u, m), s = u, c = m; (t = s < 2 ? e : c) || !d;) {
					a || (s ? s < 3 ? (s > 1 && (f.n = -1), p(s, c)) : f.n = c : f.v = c);
					try {
						if (l = 2, a) {
							if (s || (i = "next"), t = a[i]) {
								if (!(t = t.call(a, c))) throw TypeError("iterator result is not an object");
								if (!t.done) return t;
								c = t.value, s < 2 && (s = 0);
							} else s === 1 && (t = a.return) && t.call(a), s < 2 && (c = TypeError("The iterator does not provide a '" + i + "' method"), s = 1);
							a = e;
						} else if ((t = (d = f.n < 0) ? c : n.call(r, f)) !== o) break;
					} catch (t) {
						a = e, s = 1, c = t;
					} finally {
						l = 1;
					}
				}
				return {
					value: t,
					done: d
				};
			};
		}(n, i, a), !0), l;
	}
	var o = {};
	function s() {}
	function c() {}
	function l() {}
	t = Object.getPrototypeOf;
	var u = [][r] ? t(t([][r]())) : (V(t = {}, r, function() {
		return this;
	}), t), d = l.prototype = s.prototype = Object.create(u);
	function f(e) {
		return Object.setPrototypeOf ? Object.setPrototypeOf(e, l) : (e.__proto__ = l, V(e, i, "GeneratorFunction")), e.prototype = Object.create(d), e;
	}
	return c.prototype = l, V(d, "constructor", l), V(l, "constructor", c), c.displayName = "GeneratorFunction", V(l, i, "GeneratorFunction"), V(d), V(d, i, "Generator"), V(d, r, function() {
		return this;
	}), V(d, "toString", function() {
		return "[object Generator]";
	}), (B = function() {
		return {
			w: a,
			m: f
		};
	})();
}
function V(e, t, n, r) {
	var i = Object.defineProperty;
	try {
		i({}, "", {});
	} catch {
		i = 0;
	}
	V = function(e, t, n, r) {
		function a(t, n) {
			V(e, t, function(e) {
				return this._invoke(t, n, e);
			});
		}
		t ? i ? i(e, t, {
			value: n,
			enumerable: !r,
			configurable: !r,
			writable: !r
		}) : e[t] = n : (a("next", 0), a("throw", 1), a("return", 2));
	}, V(e, t, n, r);
}
function le(e) {
	return ae(e) || se(e) || H(e) || ce();
}
function ue(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t);
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function de(e) {
	var t = ue(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function H(e, t) {
	if (e) {
		if (typeof e == "string") return P(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? P(e, t) : void 0;
	}
}
var U = {
	getActiveTrap: function(e) {
		return e?.length > 0 ? e[e.length - 1] : null;
	},
	activateTrap: function(e, t) {
		t !== U.getActiveTrap(e) && U.pauseTrap(e);
		var n = e.indexOf(t);
		n === -1 || e.splice(n, 1), e.push(t);
	},
	deactivateTrap: function(e, t) {
		var n = e.indexOf(t);
		n !== -1 && e.splice(n, 1), U.unpauseTrap(e);
	},
	pauseTrap: function(e) {
		U.getActiveTrap(e)?._setPausedState(!0);
	},
	unpauseTrap: function(e) {
		var t = U.getActiveTrap(e);
		t && !t._isManuallyPaused() && t._setPausedState(!1);
	}
}, fe = function(e) {
	return e.tagName && e.tagName.toLowerCase() === "input" && typeof e.select == "function";
}, pe = function(e) {
	return e?.key === "Escape" || e?.key === "Esc" || e?.keyCode === 27;
}, W = function(e) {
	return e?.key === "Tab" || e?.keyCode === 9;
}, me = function(e) {
	return W(e) && !e.shiftKey;
}, he = function(e) {
	return W(e) && e.shiftKey;
}, G = function(e) {
	return setTimeout(e, 0);
}, K = function(e) {
	var t = [...arguments].slice(1);
	return typeof e == "function" ? e.apply(void 0, t) : e;
}, q = function(e) {
	return e.target.shadowRoot && typeof e.composedPath == "function" ? e.composedPath()[0] : e.target;
}, ge = [], _e = function(e, t) {
	var n = t?.document || document, r = t?.trapStack || ge, i = z({
		returnFocusOnDeactivate: !0,
		escapeDeactivates: !0,
		delayInitialFocus: !0,
		isolateSubtrees: !1,
		isKeyForward: me,
		isKeyBackward: he
	}, t), a = {
		containers: [],
		containerGroups: [],
		tabbableGroups: [],
		adjacentElements: /* @__PURE__ */ new Set(),
		alreadySilent: /* @__PURE__ */ new Set(),
		nodeFocusedBeforeActivation: null,
		mostRecentlyFocusedNode: null,
		active: !1,
		paused: !1,
		manuallyPaused: !1,
		delayInitialFocusTimer: void 0,
		recentNavEvent: void 0
	}, o, s = function(e, t, n) {
		return e && e[t] !== void 0 ? e[t] : i[n || t];
	}, c = function(e, t) {
		var n = typeof t?.composedPath == "function" ? t.composedPath() : void 0;
		return a.containerGroups.findIndex(function(t) {
			var r = t.container, i = t.tabbableNodes;
			return r.contains(e) || n?.includes(r) || i.find(function(t) {
				return t === e;
			});
		});
	}, l = function(e) {
		var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = t.hasFallback, a = r === void 0 ? !1 : r, o = t.params, s = o === void 0 ? [] : o, c = i[e];
		if (typeof c == "function" && (c = c.apply(void 0, le(s))), c === !0 && (c = void 0), !c) {
			if (c === void 0 || c === !1) return c;
			throw Error(`\`${e}\` was specified but was not a node, or did not return a node`);
		}
		var l = c;
		if (typeof c == "string") {
			try {
				l = n.querySelector(c);
			} catch (t) {
				throw Error(`\`${e}\` appears to be an invalid selector; error="${t.message}"`);
			}
			if (!l && !a) throw Error(`\`${e}\` as selector refers to no known node`);
		}
		return l;
	}, u = function() {
		var e = l("initialFocus", { hasFallback: !0 });
		if (e === !1) return !1;
		if (e === void 0 || e && !N(e, i.tabbableOptions)) if (c(n.activeElement) >= 0) e = n.activeElement;
		else {
			var t = a.tabbableGroups[0];
			e = t && t.firstTabbableNode || l("fallbackFocus");
		}
		else e === null && (e = l("fallbackFocus"));
		if (!e) throw Error("Your focus-trap needs to have at least one focusable element");
		return e;
	}, d = function() {
		if (a.containerGroups = a.containers.map(function(e) {
			var t = ne(e, i.tabbableOptions), n = re(e, i.tabbableOptions), r = t.length > 0 ? t[0] : void 0, a = t.length > 0 ? t[t.length - 1] : void 0, o = n.find(function(e) {
				return M(e);
			}), s = n.slice().reverse().find(function(e) {
				return M(e);
			});
			return {
				container: e,
				tabbableNodes: t,
				focusableNodes: n,
				posTabIndexesFound: !!t.find(function(e) {
					return g(e) > 0;
				}),
				firstTabbableNode: r,
				lastTabbableNode: a,
				firstDomTabbableNode: o,
				lastDomTabbableNode: s,
				nextTabbableNode: function(e) {
					var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, i = t.indexOf(e);
					return i < 0 ? r ? n.slice(n.indexOf(e) + 1).find(function(e) {
						return M(e);
					}) : n.slice(0, n.indexOf(e)).reverse().find(function(e) {
						return M(e);
					}) : t[i + (r ? 1 : -1)];
				}
			};
		}), a.tabbableGroups = a.containerGroups.filter(function(e) {
			return e.tabbableNodes.length > 0;
		}), a.tabbableGroups.length <= 0 && !l("fallbackFocus")) throw Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
		if (a.containerGroups.find(function(e) {
			return e.posTabIndexesFound;
		}) && a.containerGroups.length > 1) throw Error("At least one node with a positive tabindex was found in one of your focus-trap's multiple containers. Positive tabindexes are only supported in single-container focus-traps.");
	}, f = function(e) {
		var t = e.activeElement;
		if (t) return t.shadowRoot && t.shadowRoot.activeElement !== null ? f(t.shadowRoot) : t;
	}, p = function(e) {
		if (e !== !1 && e !== f(document)) {
			if (!e || !e.focus) {
				p(u());
				return;
			}
			e.focus({ preventScroll: !!i.preventScroll }), a.mostRecentlyFocusedNode = e, fe(e) && e.select();
		}
	}, m = function(e) {
		var t = l("setReturnFocus", { params: [e] });
		return t || (t === !1 ? !1 : e);
	}, h = function(e) {
		var t = e.target, n = e.event, r = e.isBackward, o = r === void 0 ? !1 : r;
		t ||= q(n), d();
		var s = null;
		if (a.tabbableGroups.length > 0) {
			var u = c(t, n), f = u >= 0 ? a.containerGroups[u] : void 0;
			if (u < 0) s = o ? a.tabbableGroups[a.tabbableGroups.length - 1].lastTabbableNode : a.tabbableGroups[0].firstTabbableNode;
			else if (o) {
				var p = a.tabbableGroups.findIndex(function(e) {
					var n = e.firstTabbableNode;
					return t === n;
				});
				if (p < 0 && (f.container === t || N(t, i.tabbableOptions) && !M(t, i.tabbableOptions) && !f.nextTabbableNode(t, !1)) && (p = u), p >= 0) {
					var m = p === 0 ? a.tabbableGroups.length - 1 : p - 1, h = a.tabbableGroups[m];
					s = g(t) >= 0 ? h.lastTabbableNode : h.lastDomTabbableNode;
				} else W(n) || (s = f.nextTabbableNode(t, !1));
			} else {
				var _ = a.tabbableGroups.findIndex(function(e) {
					var n = e.lastTabbableNode;
					return t === n;
				});
				if (_ < 0 && (f.container === t || N(t, i.tabbableOptions) && !M(t, i.tabbableOptions) && !f.nextTabbableNode(t)) && (_ = u), _ >= 0) {
					var v = _ === a.tabbableGroups.length - 1 ? 0 : _ + 1, y = a.tabbableGroups[v];
					s = g(t) >= 0 ? y.firstTabbableNode : y.firstDomTabbableNode;
				} else W(n) || (s = f.nextTabbableNode(t));
			}
		} else s = l("fallbackFocus");
		return s;
	}, _ = function(e) {
		if (!(c(q(e), e) >= 0)) {
			if (K(i.clickOutsideDeactivates, e)) {
				o.deactivate({ returnFocus: i.returnFocusOnDeactivate });
				return;
			}
			K(i.allowOutsideClick, e) || e.preventDefault();
		}
	}, v = function(e) {
		var t = q(e), n = c(t, e) >= 0;
		if (n || t instanceof Document) n && (a.mostRecentlyFocusedNode = t);
		else {
			e.stopImmediatePropagation();
			var r, o = !0;
			if (a.mostRecentlyFocusedNode) if (g(a.mostRecentlyFocusedNode) > 0) {
				var s = c(a.mostRecentlyFocusedNode), l = a.containerGroups[s].tabbableNodes;
				if (l.length > 0) {
					var d = l.findIndex(function(e) {
						return e === a.mostRecentlyFocusedNode;
					});
					d >= 0 && (i.isKeyForward(a.recentNavEvent) ? d + 1 < l.length && (r = l[d + 1], o = !1) : d - 1 >= 0 && (r = l[d - 1], o = !1));
				}
			} else a.containerGroups.some(function(e) {
				return e.tabbableNodes.some(function(e) {
					return g(e) > 0;
				});
			}) || (o = !1);
			else o = !1;
			o && (r = h({
				target: a.mostRecentlyFocusedNode,
				isBackward: i.isKeyBackward(a.recentNavEvent)
			})), p(r || a.mostRecentlyFocusedNode || u());
		}
		a.recentNavEvent = void 0;
	}, y = function(e) {
		var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
		a.recentNavEvent = e;
		var n = h({
			event: e,
			isBackward: t
		});
		n && (W(e) && e.preventDefault(), p(n));
	}, b = function(e) {
		(i.isKeyForward(e) || i.isKeyBackward(e)) && y(e, i.isKeyBackward(e));
	}, x = function(e) {
		pe(e) && K(i.escapeDeactivates, e) !== !1 && (e.preventDefault(), o.deactivate());
	}, S = function(e) {
		c(q(e), e) >= 0 || K(i.clickOutsideDeactivates, e) || K(i.allowOutsideClick, e) || (e.preventDefault(), e.stopImmediatePropagation());
	}, C = function() {
		if (!a.active) return Promise.resolve();
		U.activateTrap(r, o);
		var e;
		return i.delayInitialFocus ? e = new Promise(function(e) {
			a.delayInitialFocusTimer = G(function() {
				p(u()), e();
			});
		}) : (e = Promise.resolve(), p(u())), n.addEventListener("focusin", v, !0), n.addEventListener("mousedown", _, {
			capture: !0,
			passive: !1
		}), n.addEventListener("touchstart", _, {
			capture: !0,
			passive: !1
		}), n.addEventListener("click", S, {
			capture: !0,
			passive: !1
		}), n.addEventListener("keydown", b, {
			capture: !0,
			passive: !1
		}), n.addEventListener("keydown", x), e;
	}, w = function(e) {
		a.active && !a.paused && o._setSubtreeIsolation(!1), a.adjacentElements.clear(), a.alreadySilent.clear();
		var t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), r = L(e), i;
		try {
			for (r.s(); !(i = r.n()).done;) {
				var s = i.value;
				t.add(s);
				for (var c = typeof ShadowRoot < "u" && s.getRootNode() instanceof ShadowRoot, l = s; l;) {
					t.add(l);
					var u = l.parentElement, d = [];
					u ? d = u.children : !u && c && (d = l.getRootNode().children, u = l.getRootNode().host, c = typeof ShadowRoot < "u" && u.getRootNode() instanceof ShadowRoot);
					var f = L(d), p;
					try {
						for (f.s(); !(p = f.n()).done;) {
							var m = p.value;
							n.add(m);
						}
					} catch (e) {
						f.e(e);
					} finally {
						f.f();
					}
					l = u;
				}
			}
		} catch (e) {
			r.e(e);
		} finally {
			r.f();
		}
		t.forEach(function(e) {
			n.delete(e);
		}), a.adjacentElements = n;
	}, T = function() {
		if (a.active) return n.removeEventListener("focusin", v, !0), n.removeEventListener("mousedown", _, !0), n.removeEventListener("touchstart", _, !0), n.removeEventListener("click", S, !0), n.removeEventListener("keydown", b, !0), n.removeEventListener("keydown", x), o;
	}, E = typeof window < "u" && "MutationObserver" in window ? new MutationObserver(function(e) {
		e.some(function(e) {
			return Array.from(e.removedNodes).some(function(e) {
				return e === a.mostRecentlyFocusedNode;
			});
		}) && p(u());
	}) : void 0, D = function() {
		E && (E.disconnect(), a.active && !a.paused && a.containers.map(function(e) {
			E.observe(e, {
				subtree: !0,
				childList: !0
			});
		}));
	};
	return o = {
		get active() {
			return a.active;
		},
		get paused() {
			return a.paused;
		},
		activate: function(e) {
			if (a.active) return this;
			var t = s(e, "onActivate"), i = s(e, "onPostActivate"), c = s(e, "checkCanFocusTrap"), l = U.getActiveTrap(r), u = !1;
			if (l && !l.paused) {
				var p;
				(p = l._setSubtreeIsolation) == null || p.call(l, !1), u = !0;
			}
			try {
				c || d(), a.active = !0, a.paused = !1, a.nodeFocusedBeforeActivation = f(n), t?.();
				var m = /* @__PURE__ */ function() {
					var e = I(/* @__PURE__ */ B().m(function e() {
						return B().w(function(e) {
							for (;;) switch (e.n) {
								case 0: return c && d(), e.n = 1, C();
								case 1: o._setSubtreeIsolation(!0), D(), i?.();
								case 2: return e.a(2);
							}
						}, e);
					}));
					return function() {
						return e.apply(this, arguments);
					};
				}();
				if (c) return c(a.containers.concat()).then(m, m), this;
				m();
			} catch (e) {
				if (l === U.getActiveTrap(r) && u) {
					var h;
					(h = l._setSubtreeIsolation) == null || h.call(l, !0);
				}
				throw e;
			}
			return this;
		},
		deactivate: function(e) {
			if (!a.active) return this;
			var t = z({
				onDeactivate: i.onDeactivate,
				onPostDeactivate: i.onPostDeactivate,
				checkCanReturnFocus: i.checkCanReturnFocus
			}, e);
			clearTimeout(a.delayInitialFocusTimer), a.delayInitialFocusTimer = void 0, a.paused || o._setSubtreeIsolation(!1), a.alreadySilent.clear(), T(), a.active = !1, a.paused = !1, D(), U.deactivateTrap(r, o);
			var n = s(t, "onDeactivate"), c = s(t, "onPostDeactivate"), l = s(t, "checkCanReturnFocus"), u = s(t, "returnFocus", "returnFocusOnDeactivate");
			n?.();
			var d = function() {
				G(function() {
					u && p(m(a.nodeFocusedBeforeActivation)), c?.();
				});
			};
			return u && l ? (l(m(a.nodeFocusedBeforeActivation)).then(d, d), this) : (d(), this);
		},
		pause: function(e) {
			return a.active ? (a.manuallyPaused = !0, this._setPausedState(!0, e)) : this;
		},
		unpause: function(e) {
			return !a.active || (a.manuallyPaused = !1, r[r.length - 1] !== this) ? this : this._setPausedState(!1, e);
		},
		updateContainerElements: function(e) {
			return a.containers = [].concat(e).filter(Boolean).map(function(e) {
				return typeof e == "string" ? n.querySelector(e) : e;
			}), i.isolateSubtrees && w(a.containers), a.active && (d(), a.paused || o._setSubtreeIsolation(!0)), D(), this;
		}
	}, Object.defineProperties(o, {
		_isManuallyPaused: { value: function() {
			return a.manuallyPaused;
		} },
		_setPausedState: { value: function(e, t) {
			if (a.paused === e) return this;
			if (a.paused = e, e) {
				var n = s(t, "onPause"), r = s(t, "onPostPause");
				n?.(), T(), o._setSubtreeIsolation(!1), D(), r?.();
			} else {
				var i = s(t, "onUnpause"), c = s(t, "onPostUnpause");
				i?.(), (/* @__PURE__ */ (function() {
					var e = I(/* @__PURE__ */ B().m(function e() {
						return B().w(function(e) {
							for (;;) switch (e.n) {
								case 0: return d(), e.n = 1, C();
								case 1: o._setSubtreeIsolation(!0), D(), c?.();
								case 2: return e.a(2);
							}
						}, e);
					}));
					return function() {
						return e.apply(this, arguments);
					};
				})())();
			}
			return this;
		} },
		_setSubtreeIsolation: { value: function(e) {
			i.isolateSubtrees && a.adjacentElements.forEach(function(t) {
				if (e) switch (i.isolateSubtrees) {
					case "aria-hidden":
						(t.ariaHidden === "true" || t.getAttribute("aria-hidden")?.toLowerCase() === "true") && a.alreadySilent.add(t), t.setAttribute("aria-hidden", "true");
						break;
					default:
						(t.inert || t.hasAttribute("inert")) && a.alreadySilent.add(t), t.setAttribute("inert", !0);
						break;
				}
				else if (!a.alreadySilent.has(t)) switch (i.isolateSubtrees) {
					case "aria-hidden":
						t.removeAttribute("aria-hidden");
						break;
					default:
						t.removeAttribute("inert");
						break;
				}
			});
		} }
	}), o.updateContainerElements(e), o;
};
//#endregion
//#region src/visual/focus.js
function ve(e, o = {}) {
	let { escapeDeactivates: s = !0, clickOutsideDeactivates: c = !1, returnFocusOnDeactivate: l = !0, initialFocus: u } = o, d = r(!1), f = null, p = null;
	function m() {
		return i(e);
	}
	function h() {
		if (d.value) return;
		let e = m();
		if (e) {
			if (typeof document < "u" && (p = document.activeElement), f) {
				f.activate(), d.value = !0;
				return;
			}
			f = _e(e, {
				escapeDeactivates: s,
				clickOutsideDeactivates: c,
				initialFocus: u,
				returnFocusOnDeactivate: !1,
				fallbackFocus: e,
				onActivate() {
					d.value = !0;
				},
				onDeactivate() {
					d.value = !1, o.active && t(o.active) && (o.active.value = !1), l && p && (p.focus(), p = null);
				}
			}), f.activate();
		}
	}
	function g() {
		!d.value || !f || f.deactivate();
	}
	return o.active !== void 0 && (a(() => i(o.active), (e) => {
		e ? h() : g();
	}, { flush: "post" }), a(m, (e) => {
		e && i(o.active) && h();
	}, { flush: "post" })), n(() => {
		f &&= (f.deactivate(), null);
	}), {
		hasFocus: d,
		activate: h,
		deactivate: g
	};
}
//#endregion
//#region src/visual/contrast.js
function J(e) {
	let t = e.replace("#", "");
	return t.length === 3 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]), {
		r: parseInt(t.slice(0, 2), 16),
		g: parseInt(t.slice(2, 4), 16),
		b: parseInt(t.slice(4, 6), 16)
	};
}
function Y(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function X(e) {
	let t = Y(e.r), n = Y(e.g), r = Y(e.b);
	return .2126 * t + .7152 * n + .0722 * r;
}
function Z(e, t) {
	let n = X(J(e)), r = X(J(t)), i = Math.max(n, r), a = Math.min(n, r);
	return (i + .05) / (a + .05);
}
function ye(e, t) {
	let n = Z(e, t);
	return {
		ratio: Math.round(n * 100) / 100,
		aa: n >= 4.5,
		aaa: n >= 7,
		aaLarge: n >= 3,
		aaaLarge: n >= 4.5
	};
}
function Q(e, t = 4.5) {
	let n = Z("#ffffff", e), r = Z("#000000", e);
	return n >= t ? "#ffffff" : r >= t ? "#000000" : n > r ? "#ffffff" : "#000000";
}
function $() {
	if (typeof window > "u") return e(() => "no-preference");
	let t = r("no-preference"), i = {
		more: window.matchMedia("(prefers-contrast: more)"),
		less: window.matchMedia("(prefers-contrast: less)"),
		custom: window.matchMedia("(prefers-contrast: custom)")
	};
	function a() {
		i.more.matches ? t.value = "more" : i.less.matches ? t.value = "less" : i.custom.matches ? t.value = "custom" : t.value = "no-preference";
	}
	a();
	for (let e of Object.values(i)) e.addEventListener("change", a);
	return n(() => {
		for (let e of Object.values(i)) e.removeEventListener("change", a);
	}), e(() => t.value);
}
function be(t, n) {
	let r = $();
	return e(() => {
		let e = i(t), a = i(n);
		return r.value !== "more" || Z(e, a) >= 4.5 ? e : Q(a, 4.5);
	});
}
//#endregion
export { Q as a, ve as c, X as i, ye as n, be as o, J as r, $ as s, Z as t };
