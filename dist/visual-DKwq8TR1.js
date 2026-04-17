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
function M(e, t, n, r, i, a, o) {
	try {
		var s = e[a](o), c = s.value;
	} catch (e) {
		n(e);
		return;
	}
	s.done ? t(c) : Promise.resolve(c).then(r, i);
}
function N(e) {
	return function() {
		var t = this, n = arguments;
		return new Promise(function(r, i) {
			var a = e.apply(t, n);
			function o(e) {
				M(a, r, i, o, s, "next", e);
			}
			function s(e) {
				M(a, r, i, o, s, "throw", e);
			}
			o(void 0);
		});
	};
}
function le(e, t) {
	var n = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (!n) {
		if (Array.isArray(e) || (n = I(e)) || t) {
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
function ue(e, t, n) {
	return (t = _e(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function de(e) {
	if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function fe() {
	throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function pe(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function me(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? pe(Object(n), !0).forEach(function(t) {
			ue(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : pe(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function P() {
	var e, t, n = typeof Symbol == "function" ? Symbol : {}, r = n.iterator || "@@iterator", i = n.toStringTag || "@@toStringTag";
	function a(n, r, i, a) {
		var c = r && r.prototype instanceof s ? r : s, l = Object.create(c.prototype);
		return F(l, "_invoke", function(n, r, i) {
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
	var u = [][r] ? t(t([][r]())) : (F(t = {}, r, function() {
		return this;
	}), t), d = l.prototype = s.prototype = Object.create(u);
	function f(e) {
		return Object.setPrototypeOf ? Object.setPrototypeOf(e, l) : (e.__proto__ = l, F(e, i, "GeneratorFunction")), e.prototype = Object.create(d), e;
	}
	return c.prototype = l, F(d, "constructor", l), F(l, "constructor", c), c.displayName = "GeneratorFunction", F(l, i, "GeneratorFunction"), F(d), F(d, i, "Generator"), F(d, r, function() {
		return this;
	}), F(d, "toString", function() {
		return "[object Generator]";
	}), (P = function() {
		return {
			w: a,
			m: f
		};
	})();
}
function F(e, t, n, r) {
	var i = Object.defineProperty;
	try {
		i({}, "", {});
	} catch {
		i = 0;
	}
	F = function(e, t, n, r) {
		function a(t, n) {
			F(e, t, function(e) {
				return this._invoke(t, n, e);
			});
		}
		t ? i ? i(e, t, {
			value: n,
			enumerable: !r,
			configurable: !r,
			writable: !r
		}) : e[t] = n : (a("next", 0), a("throw", 1), a("return", 2));
	}, F(e, t, n, r);
}
function he(e) {
	return ce(e) || de(e) || I(e) || fe();
}
function ge(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t);
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function _e(e) {
	var t = ge(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function I(e, t) {
	if (e) {
		if (typeof e == "string") return j(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? j(e, t) : void 0;
	}
}
var L = {
	getActiveTrap: function(e) {
		return e?.length > 0 ? e[e.length - 1] : null;
	},
	activateTrap: function(e, t) {
		t !== L.getActiveTrap(e) && L.pauseTrap(e);
		var n = e.indexOf(t);
		n === -1 || e.splice(n, 1), e.push(t);
	},
	deactivateTrap: function(e, t) {
		var n = e.indexOf(t);
		n !== -1 && e.splice(n, 1), L.unpauseTrap(e);
	},
	pauseTrap: function(e) {
		L.getActiveTrap(e)?._setPausedState(!0);
	},
	unpauseTrap: function(e) {
		var t = L.getActiveTrap(e);
		t && !t._isManuallyPaused() && t._setPausedState(!1);
	}
}, ve = function(e) {
	return e.tagName && e.tagName.toLowerCase() === "input" && typeof e.select == "function";
}, ye = function(e) {
	return e?.key === "Escape" || e?.key === "Esc" || e?.keyCode === 27;
}, R = function(e) {
	return e?.key === "Tab" || e?.keyCode === 9;
}, be = function(e) {
	return R(e) && !e.shiftKey;
}, xe = function(e) {
	return R(e) && e.shiftKey;
}, Se = function(e) {
	return setTimeout(e, 0);
}, z = function(e) {
	var t = [...arguments].slice(1);
	return typeof e == "function" ? e.apply(void 0, t) : e;
}, B = function(e) {
	return e.target.shadowRoot && typeof e.composedPath == "function" ? e.composedPath()[0] : e.target;
}, Ce = [], we = function(e, t) {
	var n = t?.document || document, r = t?.trapStack || Ce, i = me({
		returnFocusOnDeactivate: !0,
		escapeDeactivates: !0,
		delayInitialFocus: !0,
		isolateSubtrees: !1,
		isKeyForward: be,
		isKeyBackward: xe
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
		if (typeof c == "function" && (c = c.apply(void 0, he(s))), c === !0 && (c = void 0), !c) {
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
			e.focus({ preventScroll: !!i.preventScroll }), a.mostRecentlyFocusedNode = e, ve(e) && e.select();
		}
	}, m = function(e) {
		var t = l("setReturnFocus", { params: [e] });
		return t || (t === !1 ? !1 : e);
	}, h = function(e) {
		var t = e.target, n = e.event, r = e.isBackward, o = r === void 0 ? !1 : r;
		t ||= B(n), d();
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
				} else R(n) || (s = f.nextTabbableNode(t, !1));
			} else {
				var _ = a.tabbableGroups.findIndex(function(e) {
					var n = e.lastTabbableNode;
					return t === n;
				});
				if (_ < 0 && (f.container === t || A(t, i.tabbableOptions) && !k(t, i.tabbableOptions) && !f.nextTabbableNode(t)) && (_ = u), _ >= 0) {
					var v = _ === a.tabbableGroups.length - 1 ? 0 : _ + 1, y = a.tabbableGroups[v];
					s = g(t) >= 0 ? y.firstTabbableNode : y.firstDomTabbableNode;
				} else R(n) || (s = f.nextTabbableNode(t));
			}
		} else s = l("fallbackFocus");
		return s;
	}, _ = function(e) {
		if (!(c(B(e), e) >= 0)) {
			if (z(i.clickOutsideDeactivates, e)) {
				o.deactivate({ returnFocus: i.returnFocusOnDeactivate });
				return;
			}
			z(i.allowOutsideClick, e) || e.preventDefault();
		}
	}, v = function(e) {
		var t = B(e), n = c(t, e) >= 0;
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
		n && (R(e) && e.preventDefault(), p(n));
	}, b = function(e) {
		(i.isKeyForward(e) || i.isKeyBackward(e)) && y(e, i.isKeyBackward(e));
	}, x = function(e) {
		ye(e) && z(i.escapeDeactivates, e) !== !1 && (e.preventDefault(), o.deactivate());
	}, S = function(e) {
		c(B(e), e) >= 0 || z(i.clickOutsideDeactivates, e) || z(i.allowOutsideClick, e) || (e.preventDefault(), e.stopImmediatePropagation());
	}, C = function() {
		if (!a.active) return Promise.resolve();
		L.activateTrap(r, o);
		var e;
		return i.delayInitialFocus ? e = new Promise(function(e) {
			a.delayInitialFocusTimer = Se(function() {
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
		var t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), r = le(e), i;
		try {
			for (r.s(); !(i = r.n()).done;) {
				var s = i.value;
				t.add(s);
				for (var c = typeof ShadowRoot < "u" && s.getRootNode() instanceof ShadowRoot, l = s; l;) {
					t.add(l);
					var u = l.parentElement, d = [];
					u ? d = u.children : !u && c && (d = l.getRootNode().children, u = l.getRootNode().host, c = typeof ShadowRoot < "u" && u.getRootNode() instanceof ShadowRoot);
					var f = le(d), p;
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
			var t = s(e, "onActivate"), i = s(e, "onPostActivate"), c = s(e, "checkCanFocusTrap"), l = L.getActiveTrap(r), u = !1;
			if (l && !l.paused) {
				var p;
				(p = l._setSubtreeIsolation) == null || p.call(l, !1), u = !0;
			}
			try {
				c || d(), a.active = !0, a.paused = !1, a.nodeFocusedBeforeActivation = f(n), t?.();
				var m = /* @__PURE__ */ function() {
					var e = N(/* @__PURE__ */ P().m(function e() {
						return P().w(function(e) {
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
				if (l === L.getActiveTrap(r) && u) {
					var h;
					(h = l._setSubtreeIsolation) == null || h.call(l, !0);
				}
				throw e;
			}
			return this;
		},
		deactivate: function(e) {
			if (!a.active) return this;
			var t = me({
				onDeactivate: i.onDeactivate,
				onPostDeactivate: i.onPostDeactivate,
				checkCanReturnFocus: i.checkCanReturnFocus
			}, e);
			clearTimeout(a.delayInitialFocusTimer), a.delayInitialFocusTimer = void 0, a.paused || o._setSubtreeIsolation(!1), a.alreadySilent.clear(), w(), a.active = !1, a.paused = !1, E(), L.deactivateTrap(r, o);
			var n = s(t, "onDeactivate"), c = s(t, "onPostDeactivate"), l = s(t, "checkCanReturnFocus"), u = s(t, "returnFocus", "returnFocusOnDeactivate");
			n?.();
			var d = function() {
				Se(function() {
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
					var e = N(/* @__PURE__ */ P().m(function e() {
						return P().w(function(e) {
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
function Te(e, o = {}) {
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
			f = we(e, {
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
function V(e) {
	let t = e.replace("#", "");
	return t.length === 3 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]), {
		r: parseInt(t.slice(0, 2), 16),
		g: parseInt(t.slice(2, 4), 16),
		b: parseInt(t.slice(4, 6), 16)
	};
}
function H(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function U(e) {
	let t = H(e.r), n = H(e.g), r = H(e.b);
	return .2126 * t + .7152 * n + .0722 * r;
}
function W(e, t) {
	let n = U(V(e)), r = U(V(t)), i = Math.max(n, r), a = Math.min(n, r);
	return (i + .05) / (a + .05);
}
function Ee(e, t) {
	let n = W(e, t);
	return {
		ratio: Math.round(n * 100) / 100,
		aa: n >= 4.5,
		aaa: n >= 7,
		aaLarge: n >= 3,
		aaaLarge: n >= 4.5
	};
}
function G(e, t = 4.5) {
	let n = W("#ffffff", e), r = W("#000000", e);
	return n >= t ? "#ffffff" : r >= t ? "#000000" : n > r ? "#ffffff" : "#000000";
}
function K() {
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
function De(t, n) {
	let r = K();
	return e(() => {
		let e = i(t), a = i(n), o = W(e, a), s = r.value === "more" ? 4.5 : 3;
		return o >= s ? e : G(a, s);
	});
}
//#endregion
//#region src/visual/vContrast.js
function q(e) {
	let t = e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
	return t ? "#" + [
		parseInt(t[1]),
		parseInt(t[2]),
		parseInt(t[3])
	].map((e) => e.toString(16).padStart(2, "0")).join("") : null;
}
function Oe(e) {
	let t = e;
	for (; t && t !== document.documentElement;) {
		let e = getComputedStyle(t).backgroundColor;
		if (e && e !== "transparent" && e !== "rgba(0, 0, 0, 0)") return q(e);
		t = t.parentElement;
	}
	return "#ffffff";
}
function J(e, t) {
	let n = q(getComputedStyle(e).color), r = Oe(e);
	!n || !r || W(n, r) < t && (e.style.color = G(r, t));
}
var Y = null, X = "no-preference", Z = /* @__PURE__ */ new Set();
function ke() {
	return typeof window > "u" ? "no-preference" : (Y || (Y = window.matchMedia("(prefers-contrast: more)"), Y.addEventListener("change", () => {
		X = Y.matches ? "more" : "no-preference";
		for (let { el: e, target: t } of Z) e.style.color = "", J(e, X === "more" ? Math.max(4.5, t) : t);
	}), X = Y.matches ? "more" : "no-preference"), X);
}
var Ae = {
	mounted(e, t) {
		let n = typeof t.value == "number" ? t.value : 3, r = ke() === "more" ? Math.max(4.5, n) : n, i = {
			el: e,
			target: n
		};
		Z.add(i), e._contrastEntry = i, requestAnimationFrame(() => J(e, r));
	},
	unmounted(e) {
		e._contrastEntry && (Z.delete(e._contrastEntry), delete e._contrastEntry);
	}
};
//#endregion
//#region src/visual/contrastAudit.js
function je(e) {
	let t = e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
	return t ? "#" + [
		t[1],
		t[2],
		t[3]
	].map((e) => parseInt(e).toString(16).padStart(2, "0")).join("") : null;
}
function Me(e) {
	let t = e;
	for (; t && t !== document.documentElement;) {
		let e = getComputedStyle(t).backgroundColor;
		if (e && e !== "transparent" && e !== "rgba(0, 0, 0, 0)") return je(e);
		t = t.parentElement;
	}
	return "#ffffff";
}
function Ne(e) {
	for (let t of e.childNodes) if (t.nodeType === Node.TEXT_NODE && t.textContent.trim()) return !0;
	return !1;
}
var Pe = /* @__PURE__ */ new WeakSet();
function Fe(e, { fix: t, target: n }) {
	if (Pe.has(e)) return;
	let r = getComputedStyle(e);
	if (r.display === "none" || r.visibility === "hidden" || r.opacity === "0" || !Ne(e)) return;
	let i = je(r.color), a = Me(e);
	if (!i || !a) return;
	let o = W(i, a);
	if (o >= n) return;
	Pe.add(e);
	let s = Math.round(o * 100) / 100;
	console.warn(`[a11y-contrast] ${s}:1 — below ${n}:1  fg: ${i}  bg: ${a}`, e), t && (e.style.color = G(a, n));
}
var Ie = "p, span, h1, h2, h3, h4, h5, h6, a, li, td, th, label, button, code, pre, blockquote, figcaption, small, strong, em";
function Le(e) {
	let t = document.querySelectorAll(Ie);
	for (let n of t) Fe(n, e);
}
var Re = { install(e, t = {}) {
	if (typeof window > "u") return;
	let n = t.fix ?? !1, r = t.target ?? 3;
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			Le({
				fix: n,
				target: r
			});
		});
	});
} };
//#endregion
//#region src/visual/vFocusIndicator.js
function ze(e) {
	let t = e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
	return t ? "#" + [
		t[1],
		t[2],
		t[3]
	].map((e) => parseInt(e).toString(16).padStart(2, "0")).join("") : null;
}
function Be(e) {
	let t = e;
	for (; t && t !== document.documentElement;) {
		let e = getComputedStyle(t).backgroundColor;
		if (e && e !== "transparent" && e !== "rgba(0, 0, 0, 0)") return ze(e);
		t = t.parentElement;
	}
	return "#ffffff";
}
function Ve(e) {
	for (let t of [
		"#2563eb",
		"#1d4ed8",
		"#ffffff",
		"#000000"
	]) if (W(t, e) >= 3) return t;
	return "#2563eb";
}
var He = {
	width: "2px",
	offset: "2px",
	style: "solid",
	color: null
};
function Ue(e, t) {
	let n = Be(e), r = t.color || Ve(n);
	e._focusIndicatorHandlers = {
		focus: () => {
			e.style.outline = `${t.width} ${t.style} ${r}`, e.style.outlineOffset = t.offset;
		},
		blur: () => {
			e.style.outline = "", e.style.outlineOffset = "";
		}
	}, e.addEventListener("focus", e._focusIndicatorHandlers.focus), e.addEventListener("blur", e._focusIndicatorHandlers.blur), !e.hasAttribute("tabindex") && !We(e) && e.setAttribute("tabindex", "0");
}
function We(e) {
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
function Ge(e) {
	e._focusIndicatorHandlers && (e.removeEventListener("focus", e._focusIndicatorHandlers.focus), e.removeEventListener("blur", e._focusIndicatorHandlers.blur), delete e._focusIndicatorHandlers);
}
var Ke = {
	mounted(e, t) {
		let n = {
			...He,
			...t.value || {}
		};
		requestAnimationFrame(() => Ue(e, n));
	},
	unmounted(e) {
		Ge(e);
	}
};
//#endregion
//#region src/visual/focusIndicator.js
function qe(e) {
	let t = e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
	return t ? "#" + [
		t[1],
		t[2],
		t[3]
	].map((e) => parseInt(e).toString(16).padStart(2, "0")).join("") : null;
}
function Je(e) {
	let t = e;
	for (; t && t !== document.documentElement;) {
		let e = getComputedStyle(t).backgroundColor;
		if (e && e !== "transparent" && e !== "rgba(0, 0, 0, 0)") return qe(e);
		t = t.parentElement;
	}
	return "#ffffff";
}
function Ye(e, t) {
	let n = [
		t,
		"#2563eb",
		"#ffffff",
		"#000000"
	];
	for (let t of n) if (W(t, e) >= 3) return t;
	return t;
}
var Xe = "a[href], button, input:not([type=hidden]), textarea, select, details, summary, [tabindex]:not([tabindex='-1']), [role=button], [role=link]";
function Ze(e) {
	return e.matches ? e.matches(Xe) : !1;
}
var Q = null;
function Qe(e) {
	let t = e.target;
	if (!Ze(t) || !t.matches(":focus-visible")) return;
	let n = Ye(Je(t), Q.color);
	t.dataset._a11yFocusOriginalOutline = t.style.outline || "", t.dataset._a11yFocusOriginalOffset = t.style.outlineOffset || "", t.style.outline = `${Q.width} ${Q.style} ${n}`, t.style.outlineOffset = Q.offset;
}
function $e(e) {
	let t = e.target;
	"_a11yFocusOriginalOutline" in t.dataset && (t.style.outline = t.dataset._a11yFocusOriginalOutline, t.style.outlineOffset = t.dataset._a11yFocusOriginalOffset, delete t.dataset._a11yFocusOriginalOutline, delete t.dataset._a11yFocusOriginalOffset);
}
var et = {
	width: "2px",
	offset: "2px",
	style: "solid",
	color: "#2563eb"
}, tt = { install(e, t = {}) {
	typeof window > "u" || (Q = {
		...et,
		...t
	}, document.addEventListener("focusin", Qe, !0), document.addEventListener("focusout", $e, !0));
} };
//#endregion
//#region src/visual/vAriaLabel.js
function nt(e) {
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
function rt(e) {
	return `<${e.tagName.toLowerCase()}${typeof e.className == "string" && e.className.trim() ? "." + e.className.trim().split(/\s+/)[0] : ""}>`;
}
var it = {
	mounted(e, t) {
		typeof t.value == "string" && t.value.trim() && e.setAttribute("aria-label", t.value.trim()), requestAnimationFrame(() => {
			nt(e) || console.warn(`[a11y-aria] ${rt(e)} has no accessible name — add v-aria-label="'...'" or text content`, e);
		});
	},
	updated(e, t) {
		typeof t.value == "string" && t.value.trim() && e.setAttribute("aria-label", t.value.trim());
	}
};
//#endregion
//#region src/visual/ariaAudit.js
function at(e) {
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
function ot(e) {
	return `<${e.tagName.toLowerCase()}${e.id ? `#${e.id}` : ""}${typeof e.className == "string" && e.className.trim() ? "." + e.className.trim().split(/\s+/)[0] : ""}>`;
}
var $ = /* @__PURE__ */ new WeakSet();
function st(e) {
	if ($.has(e)) return;
	let t = getComputedStyle(e);
	if (!(t.display === "none" || t.visibility === "hidden") && !at(e)) {
		if (e.tagName === "IMG") {
			e.getAttribute("alt") === null && ($.add(e), console.warn(`[a11y-aria] ${ot(e)} is missing alt attribute`, e));
			return;
		}
		$.add(e), console.warn(`[a11y-aria] ${ot(e)} has no accessible name`, e);
	}
}
var ct = "button, a[href], input:not([type=hidden]), textarea, select, [role=button], [role=link], img";
function lt() {
	let e = document.querySelectorAll(ct);
	for (let t of e) st(t);
}
var ut = { install() {
	typeof window > "u" || requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			lt();
		});
	});
} };
//#endregion
export { Re as a, Ee as c, G as d, De as f, Ke as i, V as l, Te as m, it as n, Ae as o, K as p, tt as r, W as s, ut as t, U as u };
