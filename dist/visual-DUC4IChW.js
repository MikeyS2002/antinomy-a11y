import { isRef as e, onScopeDispose as t, ref as n, toValue as r, watch as i } from "vue";
//#region node_modules/tabbable/dist/index.esm.js
var a = [
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
], o = /* @__PURE__ */ a.join(","), s = typeof Element > "u", c = s ? function() {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, l = !s && Element.prototype.getRootNode ? function(e) {
	return e?.getRootNode?.call(e);
} : function(e) {
	return e?.ownerDocument;
}, u = function(e, t) {
	t === void 0 && (t = !0);
	var n = e?.getAttribute?.call(e, "inert");
	return n === "" || n === "true" || t && e && (typeof e.closest == "function" ? e.closest("[inert]") : u(e.parentNode));
}, d = function(e) {
	var t = e?.getAttribute?.call(e, "contenteditable");
	return t === "" || t === "true";
}, f = function(e, t, n) {
	if (u(e)) return [];
	var r = Array.prototype.slice.apply(e.querySelectorAll(o));
	return t && c.call(e, o) && r.unshift(e), r = r.filter(n), r;
}, p = function(e, t, n) {
	for (var r = [], i = Array.from(e); i.length;) {
		var a = i.shift();
		if (!u(a, !1)) if (a.tagName === "SLOT") {
			var s = a.assignedElements(), l = p(s.length ? s : a.children, !0, n);
			n.flatten ? r.push.apply(r, l) : r.push({
				scopeParent: a,
				candidates: l
			});
		} else {
			c.call(a, o) && n.filter(a) && (t || !e.includes(a)) && r.push(a);
			var d = a.shadowRoot || typeof n.getShadowRoot == "function" && n.getShadowRoot(a), f = !u(d, !1) && (!n.shadowRootFilter || n.shadowRootFilter(a));
			if (d && f) {
				var m = p(d === !0 ? a.children : d.children, !0, n);
				n.flatten ? r.push.apply(r, m) : r.push({
					scopeParent: a,
					candidates: m
				});
			} else i.unshift.apply(i, a.children);
		}
	}
	return r;
}, m = function(e) {
	return !isNaN(parseInt(e.getAttribute("tabindex"), 10));
}, h = function(e) {
	if (!e) throw Error("No node provided");
	return e.tabIndex < 0 && (/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || d(e)) && !m(e) ? 0 : e.tabIndex;
}, g = function(e, t) {
	var n = h(e);
	return n < 0 && t && !m(e) ? 0 : n;
}, _ = function(e, t) {
	return e.tabIndex === t.tabIndex ? e.documentOrder - t.documentOrder : e.tabIndex - t.tabIndex;
}, v = function(e) {
	return e.tagName === "INPUT";
}, y = function(e) {
	return v(e) && e.type === "hidden";
}, b = function(e) {
	return e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(e) {
		return e.tagName === "SUMMARY";
	});
}, x = function(e, t) {
	for (var n = 0; n < e.length; n++) if (e[n].checked && e[n].form === t) return e[n];
}, S = function(e) {
	if (!e.name) return !0;
	var t = e.form || l(e), n = function(e) {
		return t.querySelectorAll("input[type=\"radio\"][name=\"" + e + "\"]");
	}, r;
	if (typeof window < "u" && window.CSS !== void 0 && typeof window.CSS.escape == "function") r = n(window.CSS.escape(e.name));
	else try {
		r = n(e.name);
	} catch (e) {
		return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", e.message), !1;
	}
	var i = x(r, e.form);
	return !i || i === e;
}, C = function(e) {
	return v(e) && e.type === "radio";
}, w = function(e) {
	return C(e) && !S(e);
}, T = function(e) {
	var t = e && l(e), n = t?.host, r = !1;
	if (t && t !== e) {
		var i, a, o;
		for (r = !!((i = n) != null && (a = i.ownerDocument) != null && a.contains(n) || e != null && (o = e.ownerDocument) != null && o.contains(e)); !r && n;) {
			var s, c;
			t = l(n), n = t?.host, r = !!((s = n) != null && (c = s.ownerDocument) != null && c.contains(n));
		}
	}
	return r;
}, E = function(e) {
	var t = e.getBoundingClientRect(), n = t.width, r = t.height;
	return n === 0 && r === 0;
}, D = function(e, t) {
	var n = t.displayCheck, r = t.getShadowRoot;
	if (n === "full-native" && "checkVisibility" in e) return !e.checkVisibility({
		checkOpacity: !1,
		opacityProperty: !1,
		contentVisibilityAuto: !0,
		visibilityProperty: !0,
		checkVisibilityCSS: !0
	});
	if (getComputedStyle(e).visibility === "hidden") return !0;
	var i = c.call(e, "details>summary:first-of-type") ? e.parentElement : e;
	if (c.call(i, "details:not([open]) *")) return !0;
	if (!n || n === "full" || n === "full-native" || n === "legacy-full") {
		if (typeof r == "function") {
			for (var a = e; e;) {
				var o = e.parentElement, s = l(e);
				if (o && !o.shadowRoot && r(o) === !0) return E(e);
				e = e.assignedSlot ? e.assignedSlot : !o && s !== e.ownerDocument ? s.host : o;
			}
			e = a;
		}
		if (T(e)) return !e.getClientRects().length;
		if (n !== "legacy-full") return !0;
	} else if (n === "non-zero-area") return E(e);
	return !1;
}, ee = function(e) {
	if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName)) for (var t = e.parentElement; t;) {
		if (t.tagName === "FIELDSET" && t.disabled) {
			for (var n = 0; n < t.children.length; n++) {
				var r = t.children.item(n);
				if (r.tagName === "LEGEND") return c.call(t, "fieldset[disabled] *") ? !0 : !r.contains(e);
			}
			return !0;
		}
		t = t.parentElement;
	}
	return !1;
}, O = function(e, t) {
	return !(t.disabled || y(t) || D(t, e) || b(t) || ee(t));
}, k = function(e, t) {
	return !(w(t) || h(t) < 0 || !O(e, t));
}, A = function(e) {
	var t = parseInt(e.getAttribute("tabindex"), 10);
	return !!(isNaN(t) || t >= 0);
}, j = function(e) {
	var t = [], n = [];
	return e.forEach(function(e, r) {
		var i = !!e.scopeParent, a = i ? e.scopeParent : e, o = g(a, i), s = i ? j(e.candidates) : a;
		o === 0 ? i ? t.push.apply(t, s) : t.push(a) : n.push({
			documentOrder: r,
			tabIndex: o,
			item: e,
			isScope: i,
			content: s
		});
	}), n.sort(_).reduce(function(e, t) {
		return t.isScope ? e.push.apply(e, t.content) : e.push(t.content), e;
	}, []).concat(t);
}, te = function(e, t) {
	return t ||= {}, j(t.getShadowRoot ? p([e], t.includeContainer, {
		filter: k.bind(null, t),
		flatten: !1,
		getShadowRoot: t.getShadowRoot,
		shadowRootFilter: A
	}) : f(e, t.includeContainer, k.bind(null, t)));
}, ne = function(e, t) {
	return t ||= {}, t.getShadowRoot ? p([e], t.includeContainer, {
		filter: O.bind(null, t),
		flatten: !0,
		getShadowRoot: t.getShadowRoot
	}) : f(e, t.includeContainer, O.bind(null, t));
}, M = function(e, t) {
	if (t ||= {}, !e) throw Error("No node provided");
	return c.call(e, o) === !1 ? !1 : k(t, e);
}, re = /* @__PURE__ */ a.concat("iframe:not([inert]):not([inert] *)").join(","), N = function(e, t) {
	if (t ||= {}, !e) throw Error("No node provided");
	return c.call(e, re) === !1 ? !1 : O(t, e);
};
//#endregion
//#region node_modules/focus-trap/dist/focus-trap.esm.js
function P(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function ie(e) {
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
		if (Array.isArray(e) || (n = U(e)) || t) {
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
function ae(e, t, n) {
	return (t = H(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function oe(e) {
	if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function se() {
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
			ae(e, t, n[t]);
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
function ce(e) {
	return ie(e) || oe(e) || U(e) || se();
}
function le(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t);
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function H(e) {
	var t = le(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function U(e, t) {
	if (e) {
		if (typeof e == "string") return P(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? P(e, t) : void 0;
	}
}
var W = {
	getActiveTrap: function(e) {
		return e?.length > 0 ? e[e.length - 1] : null;
	},
	activateTrap: function(e, t) {
		t !== W.getActiveTrap(e) && W.pauseTrap(e);
		var n = e.indexOf(t);
		n === -1 || e.splice(n, 1), e.push(t);
	},
	deactivateTrap: function(e, t) {
		var n = e.indexOf(t);
		n !== -1 && e.splice(n, 1), W.unpauseTrap(e);
	},
	pauseTrap: function(e) {
		W.getActiveTrap(e)?._setPausedState(!0);
	},
	unpauseTrap: function(e) {
		var t = W.getActiveTrap(e);
		t && !t._isManuallyPaused() && t._setPausedState(!1);
	}
}, ue = function(e) {
	return e.tagName && e.tagName.toLowerCase() === "input" && typeof e.select == "function";
}, de = function(e) {
	return e?.key === "Escape" || e?.key === "Esc" || e?.keyCode === 27;
}, G = function(e) {
	return e?.key === "Tab" || e?.keyCode === 9;
}, fe = function(e) {
	return G(e) && !e.shiftKey;
}, pe = function(e) {
	return G(e) && e.shiftKey;
}, K = function(e) {
	return setTimeout(e, 0);
}, q = function(e) {
	var t = [...arguments].slice(1);
	return typeof e == "function" ? e.apply(void 0, t) : e;
}, J = function(e) {
	return e.target.shadowRoot && typeof e.composedPath == "function" ? e.composedPath()[0] : e.target;
}, me = [], he = function(e, t) {
	var n = t?.document || document, r = t?.trapStack || me, i = z({
		returnFocusOnDeactivate: !0,
		escapeDeactivates: !0,
		delayInitialFocus: !0,
		isolateSubtrees: !1,
		isKeyForward: fe,
		isKeyBackward: pe
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
		if (typeof c == "function" && (c = c.apply(void 0, ce(s))), c === !0 && (c = void 0), !c) {
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
			var t = te(e, i.tabbableOptions), n = ne(e, i.tabbableOptions), r = t.length > 0 ? t[0] : void 0, a = t.length > 0 ? t[t.length - 1] : void 0, o = n.find(function(e) {
				return M(e);
			}), s = n.slice().reverse().find(function(e) {
				return M(e);
			});
			return {
				container: e,
				tabbableNodes: t,
				focusableNodes: n,
				posTabIndexesFound: !!t.find(function(e) {
					return h(e) > 0;
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
			e.focus({ preventScroll: !!i.preventScroll }), a.mostRecentlyFocusedNode = e, ue(e) && e.select();
		}
	}, m = function(e) {
		var t = l("setReturnFocus", { params: [e] });
		return t || (t === !1 ? !1 : e);
	}, g = function(e) {
		var t = e.target, n = e.event, r = e.isBackward, o = r === void 0 ? !1 : r;
		t ||= J(n), d();
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
					var m = p === 0 ? a.tabbableGroups.length - 1 : p - 1, g = a.tabbableGroups[m];
					s = h(t) >= 0 ? g.lastTabbableNode : g.lastDomTabbableNode;
				} else G(n) || (s = f.nextTabbableNode(t, !1));
			} else {
				var _ = a.tabbableGroups.findIndex(function(e) {
					var n = e.lastTabbableNode;
					return t === n;
				});
				if (_ < 0 && (f.container === t || N(t, i.tabbableOptions) && !M(t, i.tabbableOptions) && !f.nextTabbableNode(t)) && (_ = u), _ >= 0) {
					var v = _ === a.tabbableGroups.length - 1 ? 0 : _ + 1, y = a.tabbableGroups[v];
					s = h(t) >= 0 ? y.firstTabbableNode : y.firstDomTabbableNode;
				} else G(n) || (s = f.nextTabbableNode(t));
			}
		} else s = l("fallbackFocus");
		return s;
	}, _ = function(e) {
		if (!(c(J(e), e) >= 0)) {
			if (q(i.clickOutsideDeactivates, e)) {
				o.deactivate({ returnFocus: i.returnFocusOnDeactivate });
				return;
			}
			q(i.allowOutsideClick, e) || e.preventDefault();
		}
	}, v = function(e) {
		var t = J(e), n = c(t, e) >= 0;
		if (n || t instanceof Document) n && (a.mostRecentlyFocusedNode = t);
		else {
			e.stopImmediatePropagation();
			var r, o = !0;
			if (a.mostRecentlyFocusedNode) if (h(a.mostRecentlyFocusedNode) > 0) {
				var s = c(a.mostRecentlyFocusedNode), l = a.containerGroups[s].tabbableNodes;
				if (l.length > 0) {
					var d = l.findIndex(function(e) {
						return e === a.mostRecentlyFocusedNode;
					});
					d >= 0 && (i.isKeyForward(a.recentNavEvent) ? d + 1 < l.length && (r = l[d + 1], o = !1) : d - 1 >= 0 && (r = l[d - 1], o = !1));
				}
			} else a.containerGroups.some(function(e) {
				return e.tabbableNodes.some(function(e) {
					return h(e) > 0;
				});
			}) || (o = !1);
			else o = !1;
			o && (r = g({
				target: a.mostRecentlyFocusedNode,
				isBackward: i.isKeyBackward(a.recentNavEvent)
			})), p(r || a.mostRecentlyFocusedNode || u());
		}
		a.recentNavEvent = void 0;
	}, y = function(e) {
		var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
		a.recentNavEvent = e;
		var n = g({
			event: e,
			isBackward: t
		});
		n && (G(e) && e.preventDefault(), p(n));
	}, b = function(e) {
		(i.isKeyForward(e) || i.isKeyBackward(e)) && y(e, i.isKeyBackward(e));
	}, x = function(e) {
		de(e) && q(i.escapeDeactivates, e) !== !1 && (e.preventDefault(), o.deactivate());
	}, S = function(e) {
		c(J(e), e) >= 0 || q(i.clickOutsideDeactivates, e) || q(i.allowOutsideClick, e) || (e.preventDefault(), e.stopImmediatePropagation());
	}, C = function() {
		if (!a.active) return Promise.resolve();
		W.activateTrap(r, o);
		var e;
		return i.delayInitialFocus ? e = new Promise(function(e) {
			a.delayInitialFocusTimer = K(function() {
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
			var t = s(e, "onActivate"), i = s(e, "onPostActivate"), c = s(e, "checkCanFocusTrap"), l = W.getActiveTrap(r), u = !1;
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
				if (l === W.getActiveTrap(r) && u) {
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
			clearTimeout(a.delayInitialFocusTimer), a.delayInitialFocusTimer = void 0, a.paused || o._setSubtreeIsolation(!1), a.alreadySilent.clear(), T(), a.active = !1, a.paused = !1, D(), W.deactivateTrap(r, o);
			var n = s(t, "onDeactivate"), c = s(t, "onPostDeactivate"), l = s(t, "checkCanReturnFocus"), u = s(t, "returnFocus", "returnFocusOnDeactivate");
			n?.();
			var d = function() {
				K(function() {
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
function ge(a, o = {}) {
	let { escapeDeactivates: s = !0, clickOutsideDeactivates: c = !1, returnFocusOnDeactivate: l = !0, initialFocus: u } = o, d = n(!1), f = null, p = null;
	function m() {
		return r(a);
	}
	function h() {
		if (d.value) return;
		let t = m();
		if (t) {
			if (typeof document < "u" && (p = document.activeElement), f) {
				f.activate(), d.value = !0;
				return;
			}
			f = he(t, {
				escapeDeactivates: s,
				clickOutsideDeactivates: c,
				initialFocus: u,
				returnFocusOnDeactivate: !1,
				fallbackFocus: t,
				onActivate() {
					d.value = !0;
				},
				onDeactivate() {
					d.value = !1, o.active && e(o.active) && (o.active.value = !1), l && p && (p.focus(), p = null);
				}
			}), f.activate();
		}
	}
	function g() {
		!d.value || !f || f.deactivate();
	}
	return o.active !== void 0 && (i(() => r(o.active), (e) => {
		e ? h() : g();
	}, { flush: "post" }), i(m, (e) => {
		e && r(o.active) && h();
	}, { flush: "post" })), t(() => {
		f &&= (f.deactivate(), null);
	}), {
		hasFocus: d,
		activate: h,
		deactivate: g
	};
}
//#endregion
//#region src/visual/contrast.js
function Y(e) {
	let t = e.replace("#", "");
	return t.length === 3 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]), {
		r: parseInt(t.slice(0, 2), 16),
		g: parseInt(t.slice(2, 4), 16),
		b: parseInt(t.slice(4, 6), 16)
	};
}
function X(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function Z(e) {
	let t = X(e.r), n = X(e.g), r = X(e.b);
	return .2126 * t + .7152 * n + .0722 * r;
}
function Q(e, t) {
	let n = Z(Y(e)), r = Z(Y(t)), i = Math.max(n, r), a = Math.min(n, r);
	return (i + .05) / (a + .05);
}
function $(e, t) {
	let n = Q(e, t);
	return {
		ratio: Math.round(n * 100) / 100,
		aa: n >= 4.5,
		aaa: n >= 7,
		aaLarge: n >= 3,
		aaaLarge: n >= 4.5
	};
}
function _e(e, t = 4.5) {
	let n = Q("#ffffff", e), r = Q("#000000", e);
	return n >= t ? "#ffffff" : r >= t ? "#000000" : n > r ? "#ffffff" : "#000000";
}
//#endregion
export { _e as a, Z as i, $ as n, ge as o, Y as r, Q as t };
