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
}, ee = function(e) {
	return y(e) && e.type === "radio";
}, w = function(e) {
	return ee(e) && !C(e);
}, T = function(e) {
	var t = e && u(e), n = t?.host, r = !1;
	if (t && t !== e) {
		var i, a, o;
		for (r = !!((i = n) != null && (a = i.ownerDocument) != null && a.contains(n) || e != null && (o = e.ownerDocument) != null && o.contains(e)); !r && n;) {
			var s, c;
			t = u(n), n = t?.host, r = !!((s = n) != null && (c = s.ownerDocument) != null && c.contains(n));
		}
	}
	return r;
}, E = function(e) {
	var t = e.getBoundingClientRect(), n = t.width, r = t.height;
	return n === 0 && r === 0;
}, te = function(e, t) {
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
				if (o && !o.shadowRoot && r(o) === !0) return E(e);
				e = e.assignedSlot ? e.assignedSlot : !o && s !== e.ownerDocument ? s.host : o;
			}
			e = a;
		}
		if (T(e)) return !e.getClientRects().length;
		if (n !== "legacy-full") return !0;
	} else if (n === "non-zero-area") return E(e);
	return !1;
}, ne = function(e) {
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
}, D = function(e, t) {
	return !(t.disabled || b(t) || te(t, e) || x(t) || ne(t));
}, O = function(e, t) {
	return !(w(t) || g(t) < 0 || !D(e, t));
}, re = function(e) {
	var t = parseInt(e.getAttribute("tabindex"), 10);
	return !!(isNaN(t) || t >= 0);
}, ie = function(e) {
	var t = [], n = [];
	return e.forEach(function(e, r) {
		var i = !!e.scopeParent, a = i ? e.scopeParent : e, o = _(a, i), s = i ? ie(e.candidates) : a;
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
}, ae = function(e, t) {
	return t ||= {}, ie(t.getShadowRoot ? m([e], t.includeContainer, {
		filter: O.bind(null, t),
		flatten: !1,
		getShadowRoot: t.getShadowRoot,
		shadowRootFilter: re
	}) : p(e, t.includeContainer, O.bind(null, t)));
}, oe = function(e, t) {
	return t ||= {}, t.getShadowRoot ? m([e], t.includeContainer, {
		filter: D.bind(null, t),
		flatten: !0,
		getShadowRoot: t.getShadowRoot
	}) : p(e, t.includeContainer, D.bind(null, t));
}, k = function(e, t) {
	if (t ||= {}, !e) throw Error("No node provided");
	return l.call(e, s) === !1 ? !1 : O(t, e);
}, se = /* @__PURE__ */ o.concat("iframe:not([inert]):not([inert] *)").join(","), A = function(e, t) {
	if (t ||= {}, !e) throw Error("No node provided");
	return l.call(e, se) === !1 ? !1 : D(t, e);
};
//#endregion
//#region node_modules/focus-trap/dist/focus-trap.esm.js
function j(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function ce(e) {
	if (Array.isArray(e)) return j(e);
}
function le(e, t, n, r, i, a, o) {
	try {
		var s = e[a](o), c = s.value;
	} catch (e) {
		n(e);
		return;
	}
	s.done ? t(c) : Promise.resolve(c).then(r, i);
}
function ue(e) {
	return function() {
		var t = this, n = arguments;
		return new Promise(function(r, i) {
			var a = e.apply(t, n);
			function o(e) {
				le(a, r, i, o, s, "next", e);
			}
			function s(e) {
				le(a, r, i, o, s, "throw", e);
			}
			o(void 0);
		});
	};
}
function de(e, t) {
	var n = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (!n) {
		if (Array.isArray(e) || (n = be(e)) || t) {
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
function fe(e, t, n) {
	return (t = ye(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function pe(e) {
	if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function me() {
	throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function he(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function ge(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? he(Object(n), !0).forEach(function(t) {
			fe(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : he(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function M() {
	var e, t, n = typeof Symbol == "function" ? Symbol : {}, r = n.iterator || "@@iterator", i = n.toStringTag || "@@toStringTag";
	function a(n, r, i, a) {
		var c = r && r.prototype instanceof s ? r : s, l = Object.create(c.prototype);
		return N(l, "_invoke", function(n, r, i) {
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
	var u = [][r] ? t(t([][r]())) : (N(t = {}, r, function() {
		return this;
	}), t), d = l.prototype = s.prototype = Object.create(u);
	function f(e) {
		return Object.setPrototypeOf ? Object.setPrototypeOf(e, l) : (e.__proto__ = l, N(e, i, "GeneratorFunction")), e.prototype = Object.create(d), e;
	}
	return c.prototype = l, N(d, "constructor", l), N(l, "constructor", c), c.displayName = "GeneratorFunction", N(l, i, "GeneratorFunction"), N(d), N(d, i, "Generator"), N(d, r, function() {
		return this;
	}), N(d, "toString", function() {
		return "[object Generator]";
	}), (M = function() {
		return {
			w: a,
			m: f
		};
	})();
}
function N(e, t, n, r) {
	var i = Object.defineProperty;
	try {
		i({}, "", {});
	} catch {
		i = 0;
	}
	N = function(e, t, n, r) {
		function a(t, n) {
			N(e, t, function(e) {
				return this._invoke(t, n, e);
			});
		}
		t ? i ? i(e, t, {
			value: n,
			enumerable: !r,
			configurable: !r,
			writable: !r
		}) : e[t] = n : (a("next", 0), a("throw", 1), a("return", 2));
	}, N(e, t, n, r);
}
function _e(e) {
	return ce(e) || pe(e) || be(e) || me();
}
function ve(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t);
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function ye(e) {
	var t = ve(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function be(e, t) {
	if (e) {
		if (typeof e == "string") return j(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? j(e, t) : void 0;
	}
}
var P = {
	getActiveTrap: function(e) {
		return e?.length > 0 ? e[e.length - 1] : null;
	},
	activateTrap: function(e, t) {
		t !== P.getActiveTrap(e) && P.pauseTrap(e);
		var n = e.indexOf(t);
		n === -1 || e.splice(n, 1), e.push(t);
	},
	deactivateTrap: function(e, t) {
		var n = e.indexOf(t);
		n !== -1 && e.splice(n, 1), P.unpauseTrap(e);
	},
	pauseTrap: function(e) {
		P.getActiveTrap(e)?._setPausedState(!0);
	},
	unpauseTrap: function(e) {
		var t = P.getActiveTrap(e);
		t && !t._isManuallyPaused() && t._setPausedState(!1);
	}
}, xe = function(e) {
	return e.tagName && e.tagName.toLowerCase() === "input" && typeof e.select == "function";
}, Se = function(e) {
	return e?.key === "Escape" || e?.key === "Esc" || e?.keyCode === 27;
}, F = function(e) {
	return e?.key === "Tab" || e?.keyCode === 9;
}, Ce = function(e) {
	return F(e) && !e.shiftKey;
}, we = function(e) {
	return F(e) && e.shiftKey;
}, Te = function(e) {
	return setTimeout(e, 0);
}, I = function(e) {
	var t = [...arguments].slice(1);
	return typeof e == "function" ? e.apply(void 0, t) : e;
}, L = function(e) {
	return e.target.shadowRoot && typeof e.composedPath == "function" ? e.composedPath()[0] : e.target;
}, Ee = [], De = function(e, t) {
	var n = t?.document || document, r = t?.trapStack || Ee, i = ge({
		returnFocusOnDeactivate: !0,
		escapeDeactivates: !0,
		delayInitialFocus: !0,
		isolateSubtrees: !1,
		isKeyForward: Ce,
		isKeyBackward: we
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
		if (typeof c == "function" && (c = c.apply(void 0, _e(s))), c === !0 && (c = void 0), !c) {
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
		if (e === void 0 || e && !A(e, i.tabbableOptions)) if (c(n.activeElement) >= 0) e = n.activeElement;
		else {
			var t = a.tabbableGroups[0];
			e = t && t.firstTabbableNode || l("fallbackFocus");
		}
		else e === null && (e = l("fallbackFocus"));
		if (!e) throw Error("Your focus-trap needs to have at least one focusable element");
		return e;
	}, d = function() {
		if (a.containerGroups = a.containers.map(function(e) {
			var t = ae(e, i.tabbableOptions), n = oe(e, i.tabbableOptions), r = t.length > 0 ? t[0] : void 0, a = t.length > 0 ? t[t.length - 1] : void 0, o = n.find(function(e) {
				return k(e);
			}), s = n.slice().reverse().find(function(e) {
				return k(e);
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
						return k(e);
					}) : n.slice(0, n.indexOf(e)).reverse().find(function(e) {
						return k(e);
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
			e.focus({ preventScroll: !!i.preventScroll }), a.mostRecentlyFocusedNode = e, xe(e) && e.select();
		}
	}, m = function(e) {
		var t = l("setReturnFocus", { params: [e] });
		return t || (t === !1 ? !1 : e);
	}, h = function(e) {
		var t = e.target, n = e.event, r = e.isBackward, o = r === void 0 ? !1 : r;
		t ||= L(n), d();
		var s = null;
		if (a.tabbableGroups.length > 0) {
			var u = c(t, n), f = u >= 0 ? a.containerGroups[u] : void 0;
			if (u < 0) s = o ? a.tabbableGroups[a.tabbableGroups.length - 1].lastTabbableNode : a.tabbableGroups[0].firstTabbableNode;
			else if (o) {
				var p = a.tabbableGroups.findIndex(function(e) {
					var n = e.firstTabbableNode;
					return t === n;
				});
				if (p < 0 && (f.container === t || A(t, i.tabbableOptions) && !k(t, i.tabbableOptions) && !f.nextTabbableNode(t, !1)) && (p = u), p >= 0) {
					var m = p === 0 ? a.tabbableGroups.length - 1 : p - 1, h = a.tabbableGroups[m];
					s = g(t) >= 0 ? h.lastTabbableNode : h.lastDomTabbableNode;
				} else F(n) || (s = f.nextTabbableNode(t, !1));
			} else {
				var _ = a.tabbableGroups.findIndex(function(e) {
					var n = e.lastTabbableNode;
					return t === n;
				});
				if (_ < 0 && (f.container === t || A(t, i.tabbableOptions) && !k(t, i.tabbableOptions) && !f.nextTabbableNode(t)) && (_ = u), _ >= 0) {
					var v = _ === a.tabbableGroups.length - 1 ? 0 : _ + 1, y = a.tabbableGroups[v];
					s = g(t) >= 0 ? y.firstTabbableNode : y.firstDomTabbableNode;
				} else F(n) || (s = f.nextTabbableNode(t));
			}
		} else s = l("fallbackFocus");
		return s;
	}, _ = function(e) {
		if (!(c(L(e), e) >= 0)) {
			if (I(i.clickOutsideDeactivates, e)) {
				o.deactivate({ returnFocus: i.returnFocusOnDeactivate });
				return;
			}
			I(i.allowOutsideClick, e) || e.preventDefault();
		}
	}, v = function(e) {
		var t = L(e), n = c(t, e) >= 0;
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
		n && (F(e) && e.preventDefault(), p(n));
	}, b = function(e) {
		(i.isKeyForward(e) || i.isKeyBackward(e)) && y(e, i.isKeyBackward(e));
	}, x = function(e) {
		Se(e) && I(i.escapeDeactivates, e) !== !1 && (e.preventDefault(), o.deactivate());
	}, S = function(e) {
		c(L(e), e) >= 0 || I(i.clickOutsideDeactivates, e) || I(i.allowOutsideClick, e) || (e.preventDefault(), e.stopImmediatePropagation());
	}, C = function() {
		if (!a.active) return Promise.resolve();
		P.activateTrap(r, o);
		var e;
		return i.delayInitialFocus ? e = new Promise(function(e) {
			a.delayInitialFocusTimer = Te(function() {
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
	}, ee = function(e) {
		a.active && !a.paused && o._setSubtreeIsolation(!1), a.adjacentElements.clear(), a.alreadySilent.clear();
		var t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), r = de(e), i;
		try {
			for (r.s(); !(i = r.n()).done;) {
				var s = i.value;
				t.add(s);
				for (var c = typeof ShadowRoot < "u" && s.getRootNode() instanceof ShadowRoot, l = s; l;) {
					t.add(l);
					var u = l.parentElement, d = [];
					u ? d = u.children : !u && c && (d = l.getRootNode().children, u = l.getRootNode().host, c = typeof ShadowRoot < "u" && u.getRootNode() instanceof ShadowRoot);
					var f = de(d), p;
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
	}, w = function() {
		if (a.active) return n.removeEventListener("focusin", v, !0), n.removeEventListener("mousedown", _, !0), n.removeEventListener("touchstart", _, !0), n.removeEventListener("click", S, !0), n.removeEventListener("keydown", b, !0), n.removeEventListener("keydown", x), o;
	}, T = typeof window < "u" && "MutationObserver" in window ? new MutationObserver(function(e) {
		e.some(function(e) {
			return Array.from(e.removedNodes).some(function(e) {
				return e === a.mostRecentlyFocusedNode;
			});
		}) && p(u());
	}) : void 0, E = function() {
		T && (T.disconnect(), a.active && !a.paused && a.containers.map(function(e) {
			T.observe(e, {
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
			var t = s(e, "onActivate"), i = s(e, "onPostActivate"), c = s(e, "checkCanFocusTrap"), l = P.getActiveTrap(r), u = !1;
			if (l && !l.paused) {
				var p;
				(p = l._setSubtreeIsolation) == null || p.call(l, !1), u = !0;
			}
			try {
				c || d(), a.active = !0, a.paused = !1, a.nodeFocusedBeforeActivation = f(n), t?.();
				var m = /* @__PURE__ */ function() {
					var e = ue(/* @__PURE__ */ M().m(function e() {
						return M().w(function(e) {
							for (;;) switch (e.n) {
								case 0: return c && d(), e.n = 1, C();
								case 1: o._setSubtreeIsolation(!0), E(), i?.();
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
				if (l === P.getActiveTrap(r) && u) {
					var h;
					(h = l._setSubtreeIsolation) == null || h.call(l, !0);
				}
				throw e;
			}
			return this;
		},
		deactivate: function(e) {
			if (!a.active) return this;
			var t = ge({
				onDeactivate: i.onDeactivate,
				onPostDeactivate: i.onPostDeactivate,
				checkCanReturnFocus: i.checkCanReturnFocus
			}, e);
			clearTimeout(a.delayInitialFocusTimer), a.delayInitialFocusTimer = void 0, a.paused || o._setSubtreeIsolation(!1), a.alreadySilent.clear(), w(), a.active = !1, a.paused = !1, E(), P.deactivateTrap(r, o);
			var n = s(t, "onDeactivate"), c = s(t, "onPostDeactivate"), l = s(t, "checkCanReturnFocus"), u = s(t, "returnFocus", "returnFocusOnDeactivate");
			n?.();
			var d = function() {
				Te(function() {
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
			}), i.isolateSubtrees && ee(a.containers), a.active && (d(), a.paused || o._setSubtreeIsolation(!0)), E(), this;
		}
	}, Object.defineProperties(o, {
		_isManuallyPaused: { value: function() {
			return a.manuallyPaused;
		} },
		_setPausedState: { value: function(e, t) {
			if (a.paused === e) return this;
			if (a.paused = e, e) {
				var n = s(t, "onPause"), r = s(t, "onPostPause");
				n?.(), w(), o._setSubtreeIsolation(!1), E(), r?.();
			} else {
				var i = s(t, "onUnpause"), c = s(t, "onPostUnpause");
				i?.(), (/* @__PURE__ */ (function() {
					var e = ue(/* @__PURE__ */ M().m(function e() {
						return M().w(function(e) {
							for (;;) switch (e.n) {
								case 0: return d(), e.n = 1, C();
								case 1: o._setSubtreeIsolation(!0), E(), c?.();
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
function Oe(e, o = {}) {
	let { escapeDeactivates: s = !0, clickOutsideDeactivates: c = !1, returnFocusOnDeactivate: l = !0, initialFocus: u } = o, d = r(!1), f = null, p = null;
	function m() {
		let t = i(e);
		return t ? typeof t == "object" && !(t instanceof Element) && t.$el ? t.$el : t : null;
	}
	function h() {
		if (d.value) return;
		let e = m();
		if (e) {
			if (typeof document < "u" && (p = document.activeElement), f) {
				f.activate(), d.value = !0;
				return;
			}
			f = De(e, {
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
function R(e) {
	let t = e.replace("#", "");
	return t.length === 3 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]), {
		r: parseInt(t.slice(0, 2), 16),
		g: parseInt(t.slice(2, 4), 16),
		b: parseInt(t.slice(4, 6), 16)
	};
}
function z(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function B(e) {
	let t = z(e.r), n = z(e.g), r = z(e.b);
	return .2126 * t + .7152 * n + .0722 * r;
}
function V(e, t) {
	let n = B(R(e)), r = B(R(t)), i = Math.max(n, r), a = Math.min(n, r);
	return (i + .05) / (a + .05);
}
function ke(e, t) {
	let n = V(e, t);
	return {
		ratio: Math.round(n * 100) / 100,
		aa: n >= 4.5,
		aaa: n >= 7,
		aaLarge: n >= 3,
		aaaLarge: n >= 4.5
	};
}
function H(e, t = 4.5) {
	let n = V("#ffffff", e), r = V("#000000", e);
	return n >= t ? "#ffffff" : r >= t ? "#000000" : n > r ? "#ffffff" : "#000000";
}
function U() {
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
function Ae(t, n) {
	let r = U();
	return e(() => {
		let e = i(t), a = i(n), o = V(e, a), s = r.value === "more" ? 4.5 : 3;
		return o >= s ? e : H(a, s);
	});
}
//#endregion
//#region src/visual/vContrast.js
function W(e) {
	let t = e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
	return t ? "#" + [
		parseInt(t[1]),
		parseInt(t[2]),
		parseInt(t[3])
	].map((e) => e.toString(16).padStart(2, "0")).join("") : null;
}
function je(e) {
	let t = e;
	for (; t && t !== document.documentElement;) {
		let e = getComputedStyle(t).backgroundColor;
		if (e && e !== "transparent" && e !== "rgba(0, 0, 0, 0)") return W(e);
		t = t.parentElement;
	}
	return "#ffffff";
}
function G(e, t) {
	let n = W(getComputedStyle(e).color), r = je(e);
	!n || !r || V(n, r) < t && (e.style.color = H(r, t));
}
var K = null, q = "no-preference", J = /* @__PURE__ */ new Set();
function Me() {
	return typeof window > "u" ? "no-preference" : (K || (K = window.matchMedia("(prefers-contrast: more)"), K.addEventListener("change", () => {
		q = K.matches ? "more" : "no-preference";
		for (let { el: e, target: t } of J) e.style.color = "", G(e, q === "more" ? Math.max(4.5, t) : t);
	}), q = K.matches ? "more" : "no-preference"), q);
}
var Ne = {
	mounted(e, t) {
		let n = typeof t.value == "number" ? t.value : 3, r = Me() === "more" ? Math.max(4.5, n) : n, i = {
			el: e,
			target: n
		};
		J.add(i), e._contrastEntry = i, requestAnimationFrame(() => G(e, r));
	},
	unmounted(e) {
		e._contrastEntry && (J.delete(e._contrastEntry), delete e._contrastEntry);
	}
};
//#endregion
//#region src/visual/contrastAudit.js
function Pe(e) {
	let t = e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
	return t ? "#" + [
		t[1],
		t[2],
		t[3]
	].map((e) => parseInt(e).toString(16).padStart(2, "0")).join("") : null;
}
function Fe(e) {
	let t = e;
	for (; t && t !== document.documentElement;) {
		let e = getComputedStyle(t).backgroundColor;
		if (e && e !== "transparent" && e !== "rgba(0, 0, 0, 0)") return Pe(e);
		t = t.parentElement;
	}
	return "#ffffff";
}
function Ie(e) {
	for (let t of e.childNodes) if (t.nodeType === Node.TEXT_NODE && t.textContent.trim()) return !0;
	return !1;
}
var Le = /* @__PURE__ */ new WeakSet();
function Re(e, { fix: t, target: n }) {
	if (Le.has(e)) return;
	let r = getComputedStyle(e);
	if (r.display === "none" || r.visibility === "hidden" || r.opacity === "0" || !Ie(e)) return;
	let i = Pe(r.color), a = Fe(e);
	if (!i || !a) return;
	let o = V(i, a);
	if (o >= n) return;
	Le.add(e);
	let s = Math.round(o * 100) / 100;
	console.warn(`[a11y-contrast] ${s}:1 — below ${n}:1  fg: ${i}  bg: ${a}`, e), t && (e.style.color = H(a, n));
}
var ze = "p, span, h1, h2, h3, h4, h5, h6, a, li, td, th, label, button, code, pre, blockquote, figcaption, small, strong, em";
function Be(e) {
	let t = document.querySelectorAll(ze);
	for (let n of t) Re(n, e);
}
var Ve = { install(e, t = {}) {
	if (typeof window > "u") return;
	let n = t.fix ?? !1, r = t.target ?? 3;
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			Be({
				fix: n,
				target: r
			});
		});
	});
} };
//#endregion
//#region src/visual/vFocusIndicator.js
function He(e) {
	let t = e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
	return t ? "#" + [
		t[1],
		t[2],
		t[3]
	].map((e) => parseInt(e).toString(16).padStart(2, "0")).join("") : null;
}
function Ue(e) {
	let t = e;
	for (; t && t !== document.documentElement;) {
		let e = getComputedStyle(t).backgroundColor;
		if (e && e !== "transparent" && e !== "rgba(0, 0, 0, 0)") return He(e);
		t = t.parentElement;
	}
	return "#ffffff";
}
function We(e) {
	for (let t of [
		"#2563eb",
		"#1d4ed8",
		"#ffffff",
		"#000000"
	]) if (V(t, e) >= 3) return t;
	return "#2563eb";
}
var Ge = {
	width: "2px",
	offset: "2px",
	style: "solid",
	color: null
};
function Ke(e, t) {
	let n = Ue(e), r = t.color || We(n);
	e._focusIndicatorHandlers = {
		focus: () => {
			e.style.outline = `${t.width} ${t.style} ${r}`, e.style.outlineOffset = t.offset;
		},
		blur: () => {
			e.style.outline = "", e.style.outlineOffset = "";
		}
	}, e.addEventListener("focus", e._focusIndicatorHandlers.focus), e.addEventListener("blur", e._focusIndicatorHandlers.blur), !e.hasAttribute("tabindex") && !qe(e) && e.setAttribute("tabindex", "0");
}
function qe(e) {
	let t = e.tagName.toLowerCase();
	return !!([
		"a",
		"button",
		"input",
		"textarea",
		"select",
		"details",
		"summary"
	].includes(t) || e.hasAttribute("contenteditable"));
}
function Je(e) {
	e._focusIndicatorHandlers && (e.removeEventListener("focus", e._focusIndicatorHandlers.focus), e.removeEventListener("blur", e._focusIndicatorHandlers.blur), delete e._focusIndicatorHandlers);
}
var Ye = {
	mounted(e, t) {
		let n = {
			...Ge,
			...t.value || {}
		};
		requestAnimationFrame(() => Ke(e, n));
	},
	unmounted(e) {
		Je(e);
	}
};
//#endregion
//#region src/visual/focusIndicator.js
function Xe(e) {
	let t = e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
	return t ? "#" + [
		t[1],
		t[2],
		t[3]
	].map((e) => parseInt(e).toString(16).padStart(2, "0")).join("") : null;
}
function Ze(e) {
	let t = e;
	for (; t && t !== document.documentElement;) {
		let e = getComputedStyle(t).backgroundColor;
		if (e && e !== "transparent" && e !== "rgba(0, 0, 0, 0)") return Xe(e);
		t = t.parentElement;
	}
	return "#ffffff";
}
function Qe(e, t) {
	let n = [
		t,
		"#2563eb",
		"#ffffff",
		"#000000"
	];
	for (let t of n) if (V(t, e) >= 3) return t;
	return t;
}
var $e = "a[href], button, input:not([type=hidden]), textarea, select, details, summary, [tabindex]:not([tabindex='-1']), [role=button], [role=link]";
function et(e) {
	return e.matches ? e.matches($e) : !1;
}
var Y = "data-a11y-original-tabindex", tt = /* @__PURE__ */ new WeakSet(), nt = null;
function rt(e) {
	let t = e.parentElement;
	for (; t && t !== document.documentElement;) {
		let e = getComputedStyle(t);
		if (e.opacity === "0" || e.visibility === "hidden") return t;
		t = t.parentElement;
	}
	return null;
}
function it(e) {
	if (e.hasAttribute(Y)) return;
	let t = e.getAttribute("tabindex");
	e.setAttribute(Y, t ?? "__none__"), e.setAttribute("tabindex", "-1");
}
function at(e) {
	if (!e.hasAttribute(Y)) return;
	let t = e.getAttribute(Y);
	e.removeAttribute(Y), t === "__none__" ? e.removeAttribute("tabindex") : e.setAttribute("tabindex", t);
}
function ot(e) {
	let t = rt(e);
	t ? (it(e), st(t)) : at(e);
}
function st(e) {
	tt.has(e) || (tt.add(e), nt?.observe(e, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}));
}
function ct() {
	let e = document.querySelectorAll($e);
	for (let t of e) ot(t);
}
function lt() {
	typeof window > "u" || (nt = new MutationObserver(() => {
		ct();
	}), requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			ct();
		});
	}));
}
var X = null;
function ut(e) {
	let t = e.target;
	if (!et(t) || !t.matches(":focus-visible")) return;
	let n = Qe(Ze(t), X.color);
	t.dataset._a11yFocusOriginalOutline = t.style.outline || "", t.dataset._a11yFocusOriginalOffset = t.style.outlineOffset || "", t.style.outline = `${X.width} ${X.style} ${n}`, t.style.outlineOffset = X.offset;
}
function dt(e) {
	let t = e.target;
	"_a11yFocusOriginalOutline" in t.dataset && (t.style.outline = t.dataset._a11yFocusOriginalOutline, t.style.outlineOffset = t.dataset._a11yFocusOriginalOffset, delete t.dataset._a11yFocusOriginalOutline, delete t.dataset._a11yFocusOriginalOffset);
}
var ft = {
	width: "2px",
	offset: "2px",
	style: "solid",
	color: "#2563eb"
}, pt = { install(e, t = {}) {
	typeof window > "u" || (X = {
		...ft,
		...t
	}, document.addEventListener("focusin", ut, !0), document.addEventListener("focusout", dt, !0), lt());
} };
//#endregion
//#region src/visual/vAriaLabel.js
function mt(e) {
	let t = e.getAttribute("aria-label");
	if (t && t.trim()) return t.trim();
	let n = e.getAttribute("aria-labelledby");
	if (n) {
		let e = document.getElementById(n);
		if (e && e.textContent.trim()) return e.textContent.trim();
	}
	let r = e.textContent?.trim();
	if (r) return r;
	if (e.tagName === "INPUT") {
		if (e.id) {
			let t = document.querySelector(`label[for="${e.id}"]`);
			if (t && t.textContent.trim()) return t.textContent.trim();
		}
		if (e.getAttribute("title")) return e.getAttribute("title");
		if (e.getAttribute("placeholder")) return e.getAttribute("placeholder");
	}
	return null;
}
function ht(e) {
	return `<${e.tagName.toLowerCase()}${typeof e.className == "string" && e.className.trim() ? "." + e.className.trim().split(/\s+/)[0] : ""}>`;
}
var gt = {
	mounted(e, t) {
		typeof t.value == "string" && t.value.trim() && e.setAttribute("aria-label", t.value.trim()), requestAnimationFrame(() => {
			mt(e) || console.warn(`[a11y-aria] ${ht(e)} has no accessible name — add v-aria-label="'...'" or text content`, e);
		});
	},
	updated(e, t) {
		typeof t.value == "string" && t.value.trim() && e.setAttribute("aria-label", t.value.trim());
	}
};
//#endregion
//#region src/visual/ariaAudit.js
function _t(e) {
	let t = e.getAttribute("aria-label");
	if (t && t.trim()) return t.trim();
	let n = e.getAttribute("aria-labelledby");
	if (n) {
		let e = document.getElementById(n);
		if (e && e.textContent.trim()) return e.textContent.trim();
	}
	let r = e.textContent?.trim();
	if (r) return r;
	if (e.tagName === "INPUT" || e.tagName === "TEXTAREA" || e.tagName === "SELECT") {
		if (e.id) {
			let t = document.querySelector(`label[for="${e.id}"]`);
			if (t && t.textContent.trim()) return t.textContent.trim();
		}
		if (e.getAttribute("title")) return e.getAttribute("title");
	}
	if (e.tagName === "IMG") {
		let t = e.getAttribute("alt");
		if (t !== null) return t;
	}
	return null;
}
function vt(e) {
	return `<${e.tagName.toLowerCase()}${e.id ? `#${e.id}` : ""}${typeof e.className == "string" && e.className.trim() ? "." + e.className.trim().split(/\s+/)[0] : ""}>`;
}
var Z = /* @__PURE__ */ new WeakSet();
function yt(e) {
	if (Z.has(e)) return;
	let t = getComputedStyle(e);
	if (!(t.display === "none" || t.visibility === "hidden") && !_t(e)) {
		if (e.tagName === "IMG") {
			e.getAttribute("alt") === null && (Z.add(e), console.warn(`[a11y-aria] ${vt(e)} is missing alt attribute`, e));
			return;
		}
		Z.add(e), console.warn(`[a11y-aria] ${vt(e)} has no accessible name`, e);
	}
}
var bt = "button, a[href], input:not([type=hidden]), textarea, select, [role=button], [role=link], img";
function xt() {
	let e = document.querySelectorAll(bt);
	for (let t of e) yt(t);
}
var St = { install() {
	typeof window > "u" || requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			xt();
		});
	});
} };
//#endregion
//#region src/visual/keyboardAudit.js
function Ct(e) {
	return `<${e.tagName.toLowerCase()}${e.id ? `#${e.id}` : ""}${typeof e.className == "string" && e.className.trim() ? "." + e.className.trim().split(/\s+/)[0] : ""}>`;
}
var Q = /* @__PURE__ */ new WeakSet();
function wt() {
	let e = document.querySelectorAll("[tabindex]");
	for (let t of e) {
		if (Q.has(t)) continue;
		let e = parseInt(t.getAttribute("tabindex"));
		e > 0 && (Q.add(t), console.warn(`[a11y-keyboard] ${Ct(t)} has tabindex="${e}" — positive values disrupt natural tab order (WCAG 2.4.3)`, t));
	}
}
function Tt() {
	let e = document.querySelectorAll("div, span");
	for (let t of e) {
		if (Q.has(t) || !(t.onclick !== null || t.getAttribute("onclick"))) continue;
		let e = t.getAttribute("role"), n = t.getAttribute("tabindex");
		(!(n !== null && n !== "-1") || !(e === "button" || e === "link")) && (Q.add(t), console.warn(`[a11y-keyboard] ${Ct(t)} has a click handler but is not keyboard-accessible — add role="button" and tabindex="0" or use a <button> (WCAG 2.1.1)`, t));
	}
}
function Et() {
	document.querySelector("main, [role=main]") || console.warn("[a11y-keyboard] page has no <main> landmark — keyboard users cannot skip past repeated content (WCAG 2.4.1)");
}
function Dt() {
	wt(), Tt(), Et();
}
var Ot = { install() {
	typeof window > "u" || requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			Dt();
		});
	});
} };
//#endregion
//#region src/visual/semanticAudit.js
function $(e) {
	return `<${e.tagName.toLowerCase()}${e.id ? `#${e.id}` : ""}${typeof e.className == "string" && e.className.trim() ? "." + e.className.trim().split(/\s+/)[0] : ""}>`;
}
function kt() {
	let e = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
	if (e.length === 0) return;
	let t = document.querySelectorAll("h1");
	t.length === 0 ? console.warn("[a11y-semantic] page has no <h1> — every page should have exactly one top-level heading (WCAG 1.3.1)") : t.length > 1 && console.warn(`[a11y-semantic] page has ${t.length} <h1> elements — there should be exactly one (WCAG 1.3.1)`, Array.from(t));
	let n = 0;
	for (let t of e) {
		let e = parseInt(t.tagName.charAt(1));
		n > 0 && e > n + 1 && console.warn(`[a11y-semantic] ${$(t)} skips from h${n} to h${e} — use sequential heading levels (WCAG 1.3.1)`, t), n = e;
	}
}
function At() {
	document.querySelector("main, [role=main]") || console.warn("[a11y-semantic] page has no <main> landmark — screen readers rely on this to identify primary content (WCAG 1.3.1)");
	let e = document.querySelectorAll("main, [role=main]");
	e.length > 1 && console.warn(`[a11y-semantic] page has ${e.length} <main> landmarks — there should be exactly one (WCAG 1.3.1)`, Array.from(e));
}
function jt() {
	let e = document.querySelectorAll("button, a[href]");
	for (let t of e) t.querySelector("button, a[href]") && console.warn(`[a11y-semantic] ${$(t)} contains a nested interactive element — interactive elements should not be nested (WCAG 1.3.1, 4.1.2)`, t);
}
function Mt() {
	let e = document.querySelectorAll("input:not([type=hidden]):not([type=submit]):not([type=button]), textarea, select");
	for (let t of e) {
		let e = t.id, n = e && document.querySelector(`label[for="${e}"]`), r = t.getAttribute("aria-label"), i = t.getAttribute("aria-labelledby"), a = t.closest("label");
		!n && !r && !i && !a && console.warn(`[a11y-semantic] ${$(t)} has no associated <label> — form fields need explicit labels (WCAG 4.1.2)`, t);
	}
}
function Nt() {
	kt(), At(), jt(), Mt();
}
var Pt = { install() {
	typeof window > "u" || requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			Nt();
		});
	});
} };
//#endregion
export { pt as a, Ne as c, R as d, B as f, Oe as g, U as h, gt as i, V as l, Ae as m, Ot as n, Ye as o, H as p, St as r, Ve as s, Pt as t, ke as u };
