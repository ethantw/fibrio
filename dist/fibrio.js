/*!
 * Fibrio v0.1.1
 * Chen Yijun (@ethantw) | MIT License
 * https://github.com/ethantw/fibrio
 *
 * Original algorithms from:
 * https://github.com/padolsey/findAndReplaceDOMText
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("cheerio"), require("normalize-selector"), require("split-css-selector"));
	else if(typeof define === 'function' && define.amd)
		define(["cheerio", "normalize-selector", "split-css-selector"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("cheerio"), require("normalize-selector"), require("split-css-selector")) : factory(root["cheerio"], root["normalize-selector"], root["split-css-selector"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	var _bind = Function.prototype.bind;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _core = __webpack_require__(1);
	
	var _core2 = _interopRequireDefault(_core);
	
	__webpack_require__(10);
	
	__webpack_require__(11);
	
	__webpack_require__(12);
	
	__webpack_require__(13);
	
	__webpack_require__(14);
	
	var Fibrio = function Fibrio() {
	  for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
	    arg[_key] = arguments[_key];
	  }
	
	  return new (_bind.apply(_core2['default'], [null].concat(arg)))();
	};
	
	Object.assign(Fibrio, {
	  preset: _core2['default'].preset,
	  finder: _core2['default'],
	  fn: _core2['default'].prototype,
	  matches: _core2['default'].matches
	});
	
	Fibrio.fibrio = Fibrio.version = Fibrio.fn.fibrio = Fibrio.fn.version = '0.1.1';
	
	// ES6 module:
	exports['default'] = Fibrio;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _cheerio = __webpack_require__(2);
	
	var _cheerio2 = _interopRequireDefault(_cheerio);
	
	var _fnEscapeReg = __webpack_require__(3);
	
	var _fnEscapeReg2 = _interopRequireDefault(_fnEscapeReg);
	
	var _fnRoot = __webpack_require__(4);
	
	var _fnRoot2 = _interopRequireDefault(_fnRoot);
	
	var _fnManipulate = __webpack_require__(5);
	
	var _fnSetAct = __webpack_require__(6);
	
	var _fnSetAct2 = _interopRequireDefault(_fnSetAct);
	
	var _fnRevertTo = __webpack_require__(9);
	
	var _fnRevertTo2 = _interopRequireDefault(_fnRevertTo);
	
	var Finder = (function () {
	  /**
	   * @constructor
	   * Create a new Finder instance with an HTML
	   * string to be processed.
	   *
	   * @param {String} HTML string
	   * @param {Boolean} [noPreset=false]
	   * @return {Fibrio} The instance itself
	   */
	
	  function Finder(html) {
	    var noPreset = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
	    _classCallCheck(this, Finder);
	
	    this.ohtml = html;
	    this.context = _fnRoot2['default'](html);
	    this.phase = [];
	
	    if (noPreset === true) {
	      this.avoid = new Set();
	      this.bdry = new Set();
	    }
	  }
	
	  /**
	   * Check if an element matches with the configured
	   * selector(s).
	   *
	   * @param {CheerioDOMObject|HTMLString}
	   *   The element to be checked with.
	   * @param {String}
	   *   The CSS selector(s) to test.
	   */
	
	  Finder.matches = function matches(elmt, selector) {
	    elmt = _cheerio2['default'](elmt);
	
	    if (typeof elmt === 'object' && elmt.is && typeof elmt.is === 'function') {
	      return elmt.is(selector);
	    }
	    return false;
	  };
	
	  Finder.html = function html(node) {
	    return _cheerio2['default'].html(node).replace(/<\/?fibrio\-(root|text)>/gi, '');
	  };
	
	  /**
	   * Return an array of the text aggregation
	   * of the root element.
	   *
	   */
	
	  /**
	   * Get the descendants of the root element or
	   * current set of matched elements—filtered by
	   * CSS selector(s)—which are the effected context
	   * for the next text-processing action.
	   *
	   * @param {String}
	   *   CSS selector(s) to filter descendants.
	   *
	   */
	
	  Finder.prototype.qsa = function qsa(selector) {
	    if (!this.root) {
	      this.root = this.context;
	    }
	    this.context = this.context.find(selector);
	    return this;
	  };
	
	  /**
	   * End all filtering operations and use the root
	   * element as the effected context for the next
	   * text-processing action.
	   */
	
	  Finder.prototype.end = function end() {
	    if (this.root) {
	      this.context = this.root;
	      this.root = null;
	    }
	    return this;
	  };
	
	  /**
	   * Indicate whether to re-use the existing portions
	   * while replacing a match with text or to place the
	   * the entire replacement in the first found match
	   * portion’s node.
	   *
	   * @param {String} [mode='retain']
	   *   Either 'retain' or 'first'.
	   */
	
	  Finder.prototype.mode = function mode(_mode) {
	    this.portionMode = /^first$/i.test(_mode) ? 'first' : 'retain';
	    return this;
	  };
	
	  /**
	   * The default function to be invoked during DOM
	   * traversing. Once the function returns *false*,
	   * the content of that element will be ignored.
	   *
	   * @param {CheerioDOMObject}
	   * @return {Boolean}
	   *   True if the node matches with CSS selectors in
	   *   `this.avoid` set.
	   */
	
	  Finder.prototype.filterFn = function filterFn(node) {
	    var avoid = this.avoid || new Set();
	    if (avoid.has(_fnManipulate.prop.call(node, 'name'))) return false;
	
	    var selector = Array.from(avoid).filter(function (s) {
	      return !/^[\w\-]+$/i.test(s);
	    }).join(',');
	    return !Finder.matches(node, selector);
	  };
	
	  /**
	   * The default function to be invoked during DOM
	   * traversing. Once the function returns *true*,
	   * Finder will start a new context with the current
	   * element; otherwise, the previous text aggregation
	   * continues.
	   *
	   * @param {CheerioDOMObject}
	   * @return {Boolean}
	   *   True if the node matches with CSS selectors in
	   *   `this.bdry` set.
	   */
	
	  Finder.prototype.bdryFn = function bdryFn(node) {
	    var bdry = this.bdry || new Set();
	    if (bdry.has('*')) return true;
	    if (bdry.has(_fnManipulate.prop.call(node, 'name'))) return true;
	
	    var selector = Array.from(bdry).filter(function (s) {
	      return !/^[\w\-]+$/i.test(s);
	    }).join(',');
	    return Finder.matches(node, selector);
	  };
	
	  /**
	   * Add CSS selector(s) to the avoiding set that,
	   * when matched with certain elements during
	   * text-processing, the content of these elements
	   * will be ignored and remain the same.
	   *
	   * @param {String|Array} CSS selector(s)
	   */
	
	  Finder.prototype.addAvoid = function addAvoid(selector) {
	    var _context;
	
	    if (!this.hasOwnProperty('avoid')) {
	      this.avoid = new Set(this.avoid);
	    }
	
	    (_context = this.avoid, _fnSetAct2['default']).call(_context, 'add', selector);
	    return this;
	  };
	
	  /**
	   * Remove certain avoiding CSS selector(s) or
	   * clear the entire avoiding CSS selector set.
	   *
	   * @param {String|Array|null}
	   *   CSS selector(s)
	   *   Or, if left blank, the method clears the entire
	   *   avoiding selector set.
	   */
	
	  Finder.prototype.removeAvoid = function removeAvoid(selector) {
	    var _context2;
	
	    if (!this.hasOwnProperty('avoid')) {
	      this.avoid = new Set(this.avoid);
	    }
	
	    if (typeof selector === 'undefined') {
	      this.bdry.clear();
	      return this;
	    }
	
	    (_context2 = this.avoid, _fnSetAct2['default']).call(_context2, 'delete', selector);
	    return this;
	  };
	
	  /**
	   * Add CSS selector(s) to the boundary set that,
	   * when matched with certain elements during
	   * text-processing, the content of these elements
	   * will form a new self-contained context that are
	   * not an aggregating entity with its previous
	   * sibling(s).
	   *
	   * @param {String|Array|null} CSS selector(s)
	   */
	
	  Finder.prototype.addBdry = function addBdry(selector) {
	    var _context3;
	
	    if (!this.hasOwnProperty('bdry')) {
	      this.bdry = new Set(this.bdry);
	    }
	
	    (_context3 = this.bdry, _fnSetAct2['default']).call(_context3, 'add', selector);
	    return this;
	  };
	
	  /**
	   * Remove certain boundary CSS selector(s) or
	   * clear the entire boundary CSS selector set.
	   *
	   * @param {String|Array|null}
	   *   CSS selector(s)
	   *   Or, if left blank, the method clears the entire
	   *   boundary selector set.
	   */
	
	  Finder.prototype.removeBdry = function removeBdry(selector) {
	    var _context4;
	
	    if (!this.hasOwnProperty('bdry')) {
	      this.bdry = new Set(this.bdry);
	    }
	
	    if (typeof selector === 'undefined') {
	      this.bdry.clear();
	      return this;
	    }
	
	    (_context4 = this.bdry, _fnSetAct2['default']).call(_context4, 'delete', selector);
	    return this;
	  };
	
	  /**
	   * Set up the searching text pattern (regular expression),
	   * portion mode, text replacement and/or wrapper at once
	   * that will be later processed.
	   *
	   * @param {Object} Actions
	   * @return {Fibrio} The instance
	   */
	
	  Finder.prototype.action = function action(_action) {
	    if (typeof _action !== 'object') return this;
	    if (_action.mode) this.mode(_action.mode);
	    if (_action.find) this.find(_action.find);
	
	    this.wrapper = _action.wrap || null;
	    this.replacement = _action.replace || null;
	    this.newActionProcessed = false;
	    return this;
	  };
	
	  /**
	   * Set up the searching text pattern for text-processing.
	   *
	   * @param {String|RegExp}
	   * @param {Boolean} [returnMatch=false]
	   * @return {Fibrio|Array}
	   *   The instance or the matches (array) depends on
	   *   the second @param, `returnMatch`
	   */
	
	  Finder.prototype.find = function find(regex) {
	    var returningMatch = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	
	    this.pattern = regex;
	    return returningMatch === true ? this.match : this;
	  };
	
	  /**
	   * Replace the matched text with a configured replacement.
	   *
	   * @arg {RegExp|String} [find=this.find]
	   *   A pattern for the Finder to grep
	   * @arg {String|Function}
	   *   What to replace each match with
	   * @return {Fibrio}
	   *   The instance
	   */
	
	  Finder.prototype.replace = function replace() {
	    for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
	      arg[_key] = arguments[_key];
	    }
	
	    this.replacement = arg.pop();
	    this.wrapper = null;
	    this.newActionProcessed = false;
	
	    if (arg[0]) this.find(arg[0]);
	    return this.process();
	  };
	
	  /**
	   * Wrap each matched text with a clone of
	   * the configured stencil element.
	   *
	   * @arg {RegExp|String} [find=this.find]
	   *   A pattern for the Finder to grep
	   * @arg {String|Function}
	   *   What to wrap each match with
	   * @return {Fibrio}
	   *   The instance
	   */
	
	  Finder.prototype.wrap = function wrap() {
	    for (var _len2 = arguments.length, arg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      arg[_key2] = arguments[_key2];
	    }
	
	    this.wrapper = arg.pop();
	    this.replacement = null;
	    this.newActionProcessed = false;
	
	    if (arg[0]) this.find(arg[0]);
	    return this.process();
	  };
	
	  /**
	   * Process the previously defined text-processing
	   * (replacing/wrapping) actions in the instance.
	   *
	   * @return {Fibrio} The instance
	   */
	
	  Finder.prototype.process = function process() {
	    if (this.newActionProcessed === true) return this;
	
	    {
	      var cloned = this.root ? this.root.clone() : null;
	      this.phase.push({
	        html: this.html,
	        root: cloned,
	        context: cloned ? cloned.find(this.context) : null
	      });
	    }
	
	    if (!this.root) {
	      this.processMatch();
	    } else {
	      var context = this.context;
	      var i = context.length;
	
	      while (i--) {
	        this.processMatch({
	          context: context.eq(i),
	          match: this.grep(this.aggregate(context[i]))
	        });
	      }
	    }
	    this.newActionProcessed = true;
	    return this;
	  };
	
	  /**
	   * Process the previously defined text-processing
	   * (replacing/wrapping) actions in the instance
	   * and return the rendered HTML.
	   *
	   * @return {string}
	   *   The processed HTML of the context
	   */
	
	  Finder.prototype.render = function render() {
	    this.process();
	    return this.html;
	  };
	
	  /**
	   * Revert to the original state or a certain
	   * text-processing phase of the instance.
	   *
	   * @param {Number|String} [level=1]
	   *   The level — a number or a string of `all` —
	   *   to be reverted.
	   * @return {Fibrio}
	   *   The instance.
	   *
	   */
	
	  Finder.prototype.revert = function revert() {
	    var level = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
	
	    level = typeof level === 'string' && level === 'all' ? 'all' : Number.parseInt(level, 10);
	
	    if (level === 1) {
	      _fnRevertTo2['default'].call(this, this.phase.pop());
	      return this;
	    }
	
	    var length = this.phase.length;
	
	    // If we’re to revert back to the original state.
	    if (level === 'all' || level >= length || Number.isNaN(level)) {
	      _fnRevertTo2['default'].call(this, this.phase[0]);
	      this.phase = [];
	      return this;
	    }
	
	    _fnRevertTo2['default'].call(this, this.phase.splice(length - level, length)[0]);
	    return this;
	  };
	
	  _createClass(Finder, [{
	    key: 'text',
	    get: function get() {
	      if (!this.root) {
	        return this.aggregate();
	      }
	
	      var i = this.context.length;
	      var ret = [];
	
	      while (i--) {
	        ret.unshift(this.aggregate(this.context[i]));
	      }
	      return ret;
	    }
	
	    /**
	     * Return an array of the matched text with their
	     * metadata.
	     *
	     */
	  }, {
	    key: 'match',
	    get: function get() {
	      if (!this.root) {
	        return this.grep();
	      }
	
	      var i = this.context.length;
	      var ret = [];
	
	      while (i--) {
	        ret.unshift(this.grep(this.aggregate(this.context[i])));
	      }
	      return ret;
	    }
	
	    /**
	     * Return a string of the current HTML of the
	     * root element.
	     *
	     */
	  }, {
	    key: 'html',
	    get: function get() {
	      return Finder.html(this.root || this.context);
	    }
	  }]);
	
	  return Finder;
	})();
	
	Finder.version = '0.1.1';
	Finder.fn = Finder.prototype;
	
	Finder.fn.filter = Finder.fn.query = Finder.fn.$ = Finder.fn.qsa;
	
	exports['default'] = Finder;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	
	var escapeReg = function escapeReg(str) {
	  return new String(str).replace(/([\.\*\+\?\^\=\!\:\$\{\}\(\)\|\[\]\/\\])/g, '\\$1');
	};
	
	exports['default'] = escapeReg;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _cheerio = __webpack_require__(2);
	
	var _cheerio2 = _interopRequireDefault(_cheerio);
	
	exports['default'] = function (html) {
	  return _cheerio2['default']('<fibrio-root>' + html + '</fibrio-root>');
	};
	
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _cheerio = __webpack_require__(2);
	
	var _cheerio2 = _interopRequireDefault(_cheerio);
	
	var mani = {
	
	  prop: function prop(_prop) {
	    if (_prop === undefined || typeof this !== 'object') {
	      return undefined;
	    } else if (!this[0] && this[_prop]) {
	      return typeof this[_prop] === 'function' ? this[_prop]() : this[_prop];
	    } else if (this[0] && this[0][_prop]) {
	      return this[0][_prop];
	    }
	    return undefined;
	  },
	
	  content: function content() {
	    if (this.children && Array.isArray(this.children)) {
	      return this.children;
	    } else if (typeof this.contents === 'function') {
	      return this.contents();
	    }
	    return [null];
	  },
	
	  type: function type() {
	    return mani.prop.call(this, 'type');
	  },
	  first: function first() {
	    return mani.content.call(this)[0];
	  },
	  prev: function prev() {
	    return mani.prop.call(this, 'prev');
	  },
	  next: function next() {
	    return mani.prop.call(this, 'next');
	  },
	  parent: function parent() {
	    return mani.prop.call(this, 'parent');
	  },
	  html: function html() {
	    return _cheerio2['default'].html(this);
	  },
	
	  empty: function empty() {
	    if (typeof this !== 'object') {
	      return;
	    } else if (typeof this.empty === 'function') {
	      return this.empty();
	    }
	
	    if (mani.type.call(this) === 'text') {
	      this.data = '';
	    } else {
	      this.children = [];
	    }
	
	    return this;
	  },
	
	  before: function before(content) {
	    content = typeof content === 'string' ? _cheerio2['default'](content) : content;
	
	    if (typeof this !== 'object') {
	      return;
	    } else if (typeof this.before === 'function') {
	      return this.before.apply(this, content);
	    }
	
	    var parent = this.parent || this.root;
	
	    if (!parent || !Array.isArray(parent.children)) {
	      return;
	    }
	
	    var idxBefore = parent.children.indexOf(this);
	    var idxAfter = idxBefore + content.contents().length;
	
	    mani.replaceWith.call(this, '<fibrio-fake>' + (_cheerio2['default'].html(content) + _cheerio2['default'].html(this)) + '</fibrio-fake>');
	
	    parent.children = Array.from(_cheerio2['default'](_cheerio2['default'].html(parent).replace(/<\/?fibrio\-fake>/gi, '')).contents());
	
	    return parent.children[idxAfter];
	  },
	
	  rm: function rm() {
	    if (typeof this !== 'object') {
	      return;
	    } else if (typeof this.remove === 'function') {
	      return this.remove();
	    }
	
	    var parent = this.parent || this.root;
	
	    if (!parent || !Array.isArray(parent.children)) {
	      return;
	    }
	
	    var sib = parent.children;
	    var idx = sib.indexOf(this);
	
	    if (idx < 0) return;
	    sib.splice(idx, 1);
	    if (this.prev) this.prev.next = this.next;
	    if (this.next) this.next.prev = this.prev;
	    this.prev = this.next = this.parent = this.root = null;
	    return this;
	  },
	
	  replaceWith: function replaceWith(content) {
	    if (typeof this !== 'object') {
	      return;
	    } else if (typeof this.replaceWith === 'function') {
	      return this.replaceWith(content);
	    }
	
	    var parent = this.parent || this.root;
	
	    if (!parent || !Array.isArray(parent.children)) {
	      return;
	    }
	
	    var sib = parent.children;
	    var idx = sib.indexOf(this);
	    var newNode = typeof content === 'string' ? _cheerio2['default'](content) : content;
	
	    if (idx < 0) return;
	    if (!newNode.type && newNode[0]) newNode = newNode[0];
	
	    sib[idx] = newNode;
	    return sib[idx];
	  },
	
	  createText: function createText(text) {
	    return _cheerio2['default']('<fibrio-text>' + text + '</fibrio-text>');
	  }
	};
	
	exports['default'] = mani;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _normalizeSelector = __webpack_require__(7);
	
	var _normalizeSelector2 = _interopRequireDefault(_normalizeSelector);
	
	var _splitCssSelector = __webpack_require__(8);
	
	var _splitCssSelector2 = _interopRequireDefault(_splitCssSelector);
	
	/**
	 * Add or delete elements of a set using CSS selectors.
	 *
	 * @this {Set}
	 *   The set to be manipulate.
	 * @param {String}
	 *   Action to apply on the set, either 'add' or 'delete'.
	 * @param {String|Array}
	 *   CSS selector to be added to or deleted from the set.
	 */
	
	exports['default'] = function (action, selector) {
	  var _this = this;
	
	  if (!/^(add|delete)$/i.test(action)) {
	    return this;
	  }
	
	  action = action.toLowerCase();
	
	  if (typeof selector === 'string') {
	    selector = _splitCssSelector2['default'](selector);
	  }
	  if (selector && Array.isArray(selector)) {
	    selector.forEach(function (sel) {
	      return _this[action](_normalizeSelector2['default'](sel));
	    });
	  }
	  return this;
	};
	
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _root = __webpack_require__(4);
	
	var _root2 = _interopRequireDefault(_root);
	
	exports['default'] = function (phase) {
	  if (!phase.context) {
	    this.context = _root2['default'](phase.html);
	    return;
	  }
	  this.root = phase.root;
	  this.context = phase.context;
	};
	
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _core = __webpack_require__(1);
	
	var _core2 = _interopRequireDefault(_core);
	
	// HTML5 elements categorised by function:
	// http://www.w3.org/TR/html-markup/elements-by-function.html
	
	var NON_TEXT = [
	// Outside `<body>`:
	'head', 'title',
	// Line-breaks and rules:
	'br', 'hr',
	// Embeded content (media) and scripting:
	'script', 'style', 'img', 'video', 'audio', 'canvas', 'svg', 'map', 'object',
	// Forms:
	'input', 'textarea', 'select', 'option', 'optgroup', 'button'];
	
	var BDRY = [
	// Grouping content and sections:
	'body', 'address', 'article', 'aside', 'blockquote', 'dd', 'div', 'dl', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'main', 'nav', 'noscript', 'ol', 'output', 'p', 'pre', 'section', 'ul',
	// Other misc. elements:
	'br', 'li', 'summary', 'dt', 'details', 'rp', 'rt', 'rtc',
	// Embeded content (media) and scripting:
	'script', 'style', 'img', 'video', 'audio', 'canvas', 'svg', 'map', 'object',
	// Forms:
	'input', 'textarea', 'select', 'option', 'optgroup', 'button',
	// Tables:
	'table', 'tbody', 'thead', 'th', 'tr', 'td', 'caption', 'col', 'tfoot', 'colgroup'];
	
	var preset = { HTML5: {
	    NON_TEXT: NON_TEXT,
	    BDRY: BDRY
	  } };
	
	Object.assign(_core2['default'], { preset: preset });
	
	exports['default'] = preset;
	module.exports = exports['default'];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _core = __webpack_require__(1);
	
	var _core2 = _interopRequireDefault(_core);
	
	Object.assign(_core2['default'].fn, {
	  portionMode: 'retain',
	  context: undefined,
	  avoid: new Set(_core2['default'].preset.HTML5.NON_TEXT),
	  bdry: new Set(_core2['default'].preset.HTML5.BDRY)
	});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _core = __webpack_require__(1);
	
	var _core2 = _interopRequireDefault(_core);
	
	var _fnManipulate = __webpack_require__(5);
	
	Object.assign(_core2['default'].fn, {
	  /**
	   * Get the text aggregation of a node w/o being
	   * normalized and resorting to `$node.text()`.
	   *
	   * @param {CheerioDOMObject}
	   * @return {Array}
	   *   An array of the text aggregation of the given node,
	   *   divided by boundaries, w/o the content of the
	   *   ignored elements.
	   */
	  aggregate: function aggregate() {
	    var _context;
	
	    var node = arguments.length <= 0 || arguments[0] === undefined ? this.context : arguments[0];
	
	    // Found the text and return it.
	    if ((_context = node, _fnManipulate.type).call(_context) === 'text') return [node.data];
	
	    // Exclude unwanted elements.
	    if (this.filterFn && !this.filterFn(node)) return [];
	
	    var ret = [''];
	    var i = 0;
	
	    if (node = (_context = node, _fnManipulate.first).call(_context)) do {
	      var _context2, _context3;
	
	      if ((_context2 = node, _fnManipulate.type).call(_context2) === 'text') {
	        ret[i] += node.data;
	        continue;
	      }
	
	      var innerText = this.aggregate(node);
	
	      if (/^(tag|script|style)$/i.test((_context2 = node, _fnManipulate.type).call(_context2)) && this.bdryFn && this.bdryFn(node)) {
	        ret[++i] = innerText;
	        ret[++i] = '';
	      } else {
	        if (typeof innerText[0] === 'string') {
	          ret[i] += innerText.shift();
	        }
	        if (innerText.length > 0) {
	          ret[++i] = innerText;
	          ret[++i] = '';
	        }
	      }
	    } while (node = (_context3 = node, _fnManipulate.next).call(_context3));
	    return ret;
	  }
	});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _core = __webpack_require__(1);
	
	var _core2 = _interopRequireDefault(_core);
	
	var _fnEscapeReg = __webpack_require__(3);
	
	var _fnEscapeReg2 = _interopRequireDefault(_fnEscapeReg);
	
	Object.assign(_core2['default'].fn, {
	  /**
	   * Gre(p) using the text aggregation.
	   *
	   * @param {Array}
	   *   Text aggragation.
	   * @return {Array}
	   *   The matches and their metadata.
	   */
	  grep: function grep() {
	    var aggr = arguments.length <= 0 || arguments[0] === undefined ? this.text : arguments[0];
	
	    var prepMat = this.prepMat;
	    var regex = typeof this.pattern === 'string' ? new RegExp(_fnEscapeReg2['default'](this.pattern), 'g') : this.pattern;
	
	    var mat = undefined;
	    var matIdx = 0;
	    var offset = 0;
	    var match = [];
	
	    void (function matchAggr(aggr) {
	      for (var i = 0, l = aggr.length; i < l; ++i) {
	        var text = aggr[i];
	
	        if (typeof text !== 'string') {
	          // Deal with nested contexts:
	          matchAggr(text);
	          continue;
	        }
	
	        if (regex.global) {
	          while (mat = regex.exec(text)) {
	            match.push(prepMat(mat, matIdx++, offset));
	          }
	        } else {
	          if (mat = text.match(regex)) {
	            match.push(prepMat(mat, 0, offset));
	          }
	        }
	        offset += text.length;
	      }
	    })(aggr);
	
	    return match;
	  },
	
	  /**
	   * Prepare metadata for single match array (returned
	   * by `RegExp.fn.exec` or `String.fn.match`).
	   *
	   * @param {Array}  Match
	   * @param {Number} Index of the match
	   * @param {Number} Offset of the match
	   *
	   * @return {Array}
	   *   The original match array with addtional metadata.
	   */
	  prepMat: function prepMat(mat, matIdx, offset) {
	    if (!mat[0]) throw new Error('Fibrio cannot handle zero-length matches.');
	
	    mat.idx = mat.index;
	    mat.startIdx = offset + mat.idx;
	    mat.endIdx = offset + mat.idx + mat[0].length;
	
	    mat.idx = mat.index = matIdx;
	    return mat;
	  }
	});

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _cheerio = __webpack_require__(2);
	
	var _cheerio2 = _interopRequireDefault(_cheerio);
	
	var _core = __webpack_require__(1);
	
	var _core2 = _interopRequireDefault(_core);
	
	var _fnManipulate = __webpack_require__(5);
	
	Object.assign(_core2['default'].fn, {
	  /**
	   * Process (wrapping/replacing) the matched text
	   * with the previously defined wrapper and/or
	   * replacement.
	   *
	   * @return {Fibrio} The instance
	   */
	  processMatch: function processMatch() {
	    var item = arguments.length <= 0 || arguments[0] === undefined ? {
	      match: this.match,
	      context: this.context
	    } : arguments[0];
	
	    var match = item.match;
	    var context = item.context;
	
	    if (match.length === 0) return this;
	
	    var startPortion = undefined;
	    var endPortion = undefined;
	    var innerPortion = [];
	    var current = context;
	    var mat = match.shift();
	    var atIdx = 0;
	    var matIdx = 0;
	    var portionIdx = 0;
	    var nodeStack = [context];
	    var doAvoidNode = undefined;
	
	    traverse: while (true) {
	      var _context;
	
	      if ((_context = current, _fnManipulate.type).call(_context) === 'text') {
	        // The match end
	        if (!endPortion && current.data.length + atIdx >= mat.endIdx) {
	          endPortion = {
	            node: current,
	            idx: portionIdx++,
	            index: portionIdx,
	            text: current.data.substring(mat.startIdx - atIdx, mat.endIdx - atIdx),
	            idxInMat: atIdx - mat.startIdx,
	            endIdxInNode: mat.endIdx - atIdx,
	            isEnd: true,
	            // always zero for end-portions
	            idxInNode: mat.startIdx - atIdx
	          };
	
	          // Intersecting node
	        } else if (startPortion) {
	            innerPortion.push({
	              node: current,
	              idx: portionIdx++,
	              index: portionIdx,
	              text: current.data,
	              idxInMat: atIdx - mat.startIdx,
	              // always zero for inner-portions
	              idxInNode: 0
	            });
	          }
	
	        // The match start
	        if (!startPortion && current.data.length + atIdx > mat.startIdx) {
	          startPortion = {
	            node: current,
	            idx: portionIdx++,
	            index: portionIdx,
	            idxInMat: 0,
	            idxInNode: mat.startIdx - atIdx,
	            endIdxInNode: mat.endIdx - atIdx,
	            text: current.data.substring(mat.startIdx - atIdx, mat.endIdx - atIdx)
	          };
	        }
	        atIdx += current.data.length;
	      }
	
	      doAvoidNode = /^(tag|style|script)$/i.test((_context = current, _fnManipulate.type).call(_context)) && this.filterFn && !this.filterFn(current);
	
	      if (startPortion && endPortion) {
	        var old = Object.assign({}, current);
	
	        // Method `.replaceMat()` returns the end portion node,
	        // and then we continue the recursion from its next
	        // sibling.
	        atIdx -= endPortion.node.data.length - endPortion.endIdxInNode;
	
	        current = this.replaceMat(context, mat, startPortion, innerPortion, endPortion);
	
	        startPortion = null;
	        endPortion = null;
	        innerPortion = [];
	        mat = match.shift();
	        portionIdx = 0;
	        matIdx++;
	
	        // No more matches.
	        if (!mat) break;
	
	        // We have to update `nodeStack` once the current
	        // element is re-rendered from its parental side via
	        // `$parent.html( newHTML )` method.
	        if (current && current.rerendered) {
	          // The `rerenderedLevel` variable here is to
	          // indicate how many level we have to go back.
	          var rerenderedLevel = 1;
	          {
	            var cloned = Array.from(nodeStack);
	
	            cloned.shift(); // Omit the root element.
	            cloned.pop(); // Omit current text node’s parent element.
	
	            while (_cheerio2['default'].contains(cloned.pop(), old)) {
	              rerenderedLevel++;
	            }
	          }
	
	          var len = nodeStack.length;
	          var last = context.find(current);
	          var update = [];
	
	          for (var i = 0, l = rerenderedLevel; i < l; i++) {
	            last = last.parent();
	            update.unshift(last);
	          }
	
	          nodeStack.splice(len - rerenderedLevel, len);
	          nodeStack = nodeStack.concat(update);
	        }
	
	        // Move down:
	      } else if (!doAvoidNode && (_context = current, _fnManipulate.first).call(_context)) {
	          var _context2;
	
	          nodeStack.push(current);
	          current = (_context2 = current, _fnManipulate.first).call(_context2);
	          continue traverse;
	          // Move forward:
	        } else if (!doAvoidNode && (_context = current, _fnManipulate.next).call(_context)) {
	            var _context3;
	
	            current = (_context3 = current, _fnManipulate.next).call(_context3);
	            continue traverse;
	          }
	
	      // Move forward to the next node or finish
	      // the traversing.
	      moveForward: while (true) {
	        var _context4;
	
	        // Move forward:
	        if ((_context4 = current, _fnManipulate.next).call(_context4)) {
	          var _context5;
	
	          current = (_context5 = current, _fnManipulate.next).call(_context5);
	          break moveForward;
	        }
	        // Move up (and move forward again):
	        current = nodeStack.pop();
	
	        // Done with the given context:
	        if (current === context) {
	          break traverse;
	        }
	      }
	    }
	    return this;
	  },
	
	  /**
	   * Replace the matched text portion(s) with the configured
	   * replacement (node/element) and return the endPortion
	   * node for `.processMatch()` to iterate.
	   *
	   * @return {CheerioDOMObject}
	   */
	  replaceMat: function replaceMat(context, mat, startPortion, innerPortion, endPortion) {
	    var _this = this;
	
	    var matStartNode = startPortion.node;
	    var matEndNode = endPortion.node;
	
	    var preceding = '';
	    var following = '';
	    var label = ['{{fibrio-replacement: ' + Date.now() + '}}[[start]]', '{{fibrio-replacement: ' + Date.now() + '}}[[end]]'];
	
	    if (matStartNode === matEndNode) {
	      var _context6;
	
	      var matNode = matStartNode;
	      var data = matNode.data;
	      var matElmt = context.find(_fnManipulate.parent.call(matNode));
	
	      if (!matElmt[0]) matElmt = context;
	
	      var idx = matElmt[0].children.indexOf(matNode);
	      var replacement = undefined;
	
	      // Grab the text before the match:
	      if (startPortion.idxInNode > 0) {
	        preceding = data.substring(0, startPortion.idxInNode);
	      }
	
	      // Get the processed replacement:
	      replacement = (_context6 = this.getPortionReplacementElmt(endPortion, mat), _fnManipulate.html).call(_context6);
	
	      // Grab the text after the match:
	      if (endPortion.endIdxInNode < data.length) {
	        following = data.substring(endPortion.endIdxInNode);
	      }
	
	      matNode.data = label[0];
	
	      matElmt.html(matElmt.html().replace(label[0], preceding + replacement + following));
	
	      // Return the new node:
	      return matElmt.contents()[preceding ? idx + 1 : idx];
	    } else {
	      var _context7;
	
	      var _context8;
	
	      var _ret = (function () {
	        // matStartNode -> matInnerNode -> matEndNode
	
	        var matStartElmt = context.find(_fnManipulate.parent.call(matStartNode));
	        var matEndElmt = context.find(_fnManipulate.parent.call(matEndNode));
	        var areNotEqual = true;
	
	        if (!matStartElmt[0]) matStartElmt = context;
	        if (!matEndElmt[0]) matEndElmt = context;
	
	        preceding = matStartNode.data.substring(0, startPortion.idxInNode);
	        following = matEndNode.data.substring(endPortion.endIdxInNode);
	
	        var first = (_context7 = _this.getPortionReplacementElmt(startPortion, mat), _fnManipulate.html).call(_context7);
	
	        for (var i = 0, l = innerPortion.length; i < l; ++i) {
	          var portion = innerPortion[i];
	          (_context8 = portion.node, _fnManipulate.replaceWith).call(_context8, _this.getPortionReplacementElmt(portion, mat));
	        }
	
	        var last = (_context7 = _this.getPortionReplacementElmt(endPortion, mat).attr('data-fibrio-mat-elmt', 'last'), _fnManipulate.html).call(_context7);
	
	        matStartNode.data = label[0];
	        matEndNode.data = label[1];
	
	        matStartElmt.html(matStartElmt.html().replace(label[0], preceding + first).replace(label[1], function () {
	          areNotEqual = false;
	          return last + following;
	        }));
	
	        matEndElmt.html((matEndElmt.html() || '').replace(label[1], last + following));
	
	        var ret = (areNotEqual ? matEndElmt : matStartElmt).find('[data-fibrio-mat-elmt="last"]').removeAttr('data-fibrio-mat-elmt')[0];
	
	        if (ret) ret.rerendered = true;
	        return {
	          v: ret
	        };
	      })();
	
	      if (typeof _ret === 'object') return _ret.v;
	    }
	  },
	
	  /**
	   * Get the replacement node/element according to the
	   * given portion.
	   *
	   * @return {CheerioDOMNode}
	   */
	  getPortionReplacementElmt: function getPortionReplacementElmt(portion, mat, matIdx) {
	    var _context9;
	
	    var replacement = this.replacement || '$&';
	    var wrapper = this.wrapper;
	
	    if (wrapper && (_context9 = wrapper, _fnManipulate.prop).call(_context9, 'type') && (_context9 = wrapper, _fnManipulate.prop).call(_context9, 'type') !== 'text') {
	      // Clone the element from its HTML:
	      wrapper = _cheerio2['default'](_cheerio2['default'].html(wrapper));
	    }
	
	    if (typeof replacement === 'function') {
	      var _context10;
	
	      replacement = replacement(portion, mat, matIdx);
	
	      if (replacement && (_context10 = replacement, _fnManipulate.prop).call(_context10, 'type')) {
	        return replacement;
	      }
	
	      return _fnManipulate.createText(replacement);
	    }
	
	    var elmt = typeof wrapper === 'string' ? /^<([\w\-]+)\s?.*>.*<\/\1>$/gi.test(wrapper) //// TODO: more accurate and strict.
	    ? _cheerio2['default'](wrapper) : _cheerio2['default']('<' + wrapper + '></' + wrapper + '>') : wrapper;
	
	    replacement = _fnManipulate.createText(this.prepReplacementString(replacement, portion, mat, matIdx));
	
	    if (!(_context9 = (_context9 = replacement, _fnManipulate.first).call(_context9), _fnManipulate.prop).call(_context9, 'data')) {
	      return replacement;
	    }
	    if (!elmt) {
	      return replacement;
	    }
	
	    elmt.append(replacement);
	    return elmt;
	  },
	
	  /**
	   * Work on the replacement (if passed a string) according
	   * to the given portion and returned the processed one.
	   *
	   * @return {String}
	   */
	  prepReplacementString: function prepReplacementString(string, portion, mat, matIdx) {
	    var mode = this.portionMode;
	
	    if (mode === 'first' && portion.idxInMat > 0) {
	      return '';
	    }
	
	    string = string.replace(/\$(\d+|&|`|')/g, function (_, t) {
	      var replacement = undefined;
	
	      switch (t) {
	        // The entire match:
	        case '&':
	          replacement = mat[0];
	          break;
	
	        // Text preceding the match:
	        case '`':
	          replacement = mat.input.substring(0, mat.startIdx);
	          break;
	
	        // Text following the match:
	        case '\'':
	          replacement = mat.input.substring(mat.endIdx);
	          break;
	
	        // `0`: The entire match; or,
	        // `n`: Captured groups (parenthesised submatches):
	        default:
	          replacement = mat[+t];
	      }
	      return replacement;
	    });
	
	    if (mode === 'first') return string;
	    if (portion.isEnd) {
	      return string.substring(portion.idxInMat);
	    }
	    return string.substr(portion.idxInMat, portion.text.length);
	  }
	});

/***/ }
/******/ ])
});
;
//# sourceMappingURL=fibrio.js.map