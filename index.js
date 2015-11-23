/*!
 * Fibrio v0.1.0
 * Chen Yijun (@ethantw) | MIT License
 * https://github.com/ethantw/fibrio
 *
 * Original algorithm from:
 * https://github.com/padolsey/findAndReplaceDOMText
 */

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var _bind = Function.prototype.bind;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _core = __webpack_require__(1);

	var _core2 = _interopRequireDefault(_core);

	var _elmt = __webpack_require__(5);

	var _elmt2 = _interopRequireDefault(_elmt);

	__webpack_require__(6);

	var Fibrio = function Fibrio() {
	  for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
	    arg[_key] = arguments[_key];
	  }

	  return new (_bind.apply(_core2['default'], [null].concat(arg)))();
	};

	Object.assign(Fibrio, {
	  ELMT: _elmt2['default'],
	  fn: _core2['default'].prototype,
	  matches: _core2['default'].matches
	});

	Fibrio.Fibrio = Fibrio.version = '0.1.0';

	// ES6 module
	exports['default'] = Fibrio;

	// NPM (CommonJS) module
	EXPORT_ONCE(Fibrio);
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _fnEscapeReg = __webpack_require__(2);

	var _fnEscapeReg2 = _interopRequireDefault(_fnEscapeReg);

	var _fnManipulate = __webpack_require__(3);

	var _fnSetAct = __webpack_require__(4);

	var _fnSetAct2 = _interopRequireDefault(_fnSetAct);

	// NPM modules:
	var $ = require('cheerio');
	var root = function root(html) {
	  return $('<fibrio-root>' + html + '</fibrio-root>');
	};

	var Finder = (function () {
	  /**
	   * Create a new finder with an HTML context.
	   * @constructor
	   *
	   * @param {String} HTML string
	   * @param {Boolean} [noPreset=false]
	   * @return {Fibrio} The instance itself
	   */

	  function Finder(html) {
	    var noPreset = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	    _classCallCheck(this, Finder);

	    this.ohtml = html;
	    this.context = root(html);
	    this.phase = [];

	    if (noPreset === true) {
	      this.avoid = new Set();
	      this.bdry = new Set();
	    }
	  }

	  /**
	   * Check if a node matches with the configured
	   * selectors.
	   *
	   * @param {Cheerio|CheerioDOMObject|HTMLString}
	   *   The node to be checked with.
	   * @param {String}
	   *   The Selectors to be matched.
	   */

	  _createClass(Finder, [{
	    key: 'mode',

	    /**
	     * Indicates whether to re-use the existing portions
	     * while replacing a match with text or to place the
	     * the entire replacement in the first found match
	     * portion’s node.
	     *
	     * @param {String} [mode='retain']
	     *   Either 'retain' or 'first'
	     */
	    value: function mode(_mode) {
	      this.portionMode = /^first$/i.test(_mode) ? 'first' : 'retain';
	      return this;
	    }

	    /**
	     * The default function to be called on every element
	     * encountered by the finder. Once the function returns
	     * false, the element will be avoided.
	     *
	     * @param {Cheerio|CheerioDOMObject}
	     */
	  }, {
	    key: 'filterFn',
	    value: function filterFn(node) {
	      var avoid = this.avoid || new Set();
	      if (avoid.has(_fnManipulate.prop.call(node, 'name'))) return false;

	      var selector = Array.from(avoid).filter(function (s) {
	        return !/^[\w\-]+$/i.test(s);
	      }).join(',');
	      return !Finder.matches(node, selector);
	    }

	    /**
	     * The default function to be called on every element
	     * encountered by the finder. Once the function returns
	     * true, the finder will start a new text aggregation
	     * context; otherwise the previous text continues.
	     *
	     * @param {Cheerio|CheerioDOMObject}
	     */
	  }, {
	    key: 'bdryFn',
	    value: function bdryFn(node) {
	      var bdry = this.bdry || new Set();
	      if (bdry.has('*')) return true;
	      if (bdry.has(_fnManipulate.prop.call(node, 'name'))) return true;

	      var selector = Array.from(bdry).filter(function (s) {
	        return !/^[\w\-]+$/i.test(s);
	      }).join(',');
	      return Finder.matches(node, selector);
	    }

	    /**
	     * Add new CSS selectors that, when matched with an
	     * element in text processing, the element will be
	     * avoided by the finder.
	     *
	     * @param {String|Array} CSS selectors
	     */
	  }, {
	    key: 'addAvoid',
	    value: function addAvoid(selector) {
	      var _context;

	      if (!this.hasOwnProperty('avoid')) {
	        this.avoid = new Set(Finder.ELMT.NON_TEXT);
	      }

	      (_context = this.avoid, _fnSetAct2['default']).call(_context, 'add', selector);
	      return this;
	    }

	    /**
	     * Remove the avoiding CSS selectors
	     *
	     * @param {String|Array|null}
	     *   CSS selectors
	     *   Or, if left blank, the method clears the entire
	     *   avoiding selector set.
	     */
	  }, {
	    key: 'removeAvoid',
	    value: function removeAvoid(selector) {
	      var _context2;

	      if (!this.hasOwnProperty('avoid')) {
	        this.avoid = new Set(Finder.ELMT.NON_TEXT);
	      }

	      if (typeof selector === 'undefined') {
	        this.bdry.clear();
	        return this;
	      }

	      (_context2 = this.avoid, _fnSetAct2['default']).call(_context2, 'delete', selector);
	      return this;
	    }

	    /**
	     * Add new CSS selectors that, when matched with an
	     * element in text aggregating, the element will
	     * start a new text aggregation context.
	     *
	     * @param {String|Array|null} CSS selectors
	     */
	  }, {
	    key: 'addBdry',
	    value: function addBdry(selector) {
	      var _context3;

	      if (!this.hasOwnProperty('bdry')) {
	        this.bdry = new Set(Finder.ELMT.BDRY);
	      }

	      (_context3 = this.bdry, _fnSetAct2['default']).call(_context3, 'add', selector);
	      return this;
	    }

	    /**
	     * Remove the boundary CSS selectors
	     *
	     * @param {String|Array|null}
	     *   CSS selectors
	     *   Or, if left blank, the method clears the entire
	     *   boundary selector set.
	     */
	  }, {
	    key: 'removeBdry',
	    value: function removeBdry(selector) {
	      var _context4;

	      if (!this.hasOwnProperty('bdry')) {
	        this.bdry = new Set(Finder.ELMT.BDRY);
	      }

	      if (typeof selector === 'undefined') {
	        this.bdry.clear();
	        return this;
	      }

	      (_context4 = this.bdry, _fnSetAct2['default']).call(_context4, 'delete', selector);
	      return this;
	    }

	    /**
	     * Set actions to the instance without the actual
	     * procedure for future processing.
	     *
	     * @param {Object} Actions
	     * @return {Fibrio} The instance
	     */
	  }, {
	    key: 'action',
	    value: function action(_action) {
	      if (typeof _action !== 'object') return this;
	      if (_action.mode) this.mode(_action.mode);
	      if (_action.find) this.find(_action.find);

	      this.wrapper = _action.wrap || null;
	      this.replacement = _action.replace || null;
	      this.newActionProcessed = false;
	      return this;
	    }

	    /**
	     * Replace the matched text with configured
	     * replacements.
	     *
	     * @arg {RegExp|String} [find=this.find]
	     *   A pattern for the Finder to grep
	     * @arg {String|Function}
	     *   What to replace each match with
	     * @return {Fibrio}
	     *   The instance
	     */
	  }, {
	    key: 'replace',
	    value: function replace() {
	      for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
	        arg[_key] = arguments[_key];
	      }

	      this.replacement = arg.pop();
	      this.wrapper = null;
	      this.newActionProcessed = false;

	      if (arg[0]) this.find(arg[0]);
	      return this.process();
	    }

	    /**
	     * Wrap the matched text with configured
	     * element/node.
	     *
	     * @arg {RegExp|String} [find=this.find]
	     *   A pattern for the Finder to grep
	     * @arg {String|Function}
	     *   What to wrap each match with
	     * @return {Fibrio}
	     *   The instance
	     */
	  }, {
	    key: 'wrap',
	    value: function wrap() {
	      for (var _len2 = arguments.length, arg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        arg[_key2] = arguments[_key2];
	      }

	      this.wrapper = arg.pop();
	      this.replacement = null;
	      this.newActionProcessed = false;

	      if (arg[0]) this.find(arg[0]);
	      return this.process();
	    }

	    /**
	     * Process (replace/wrap) the matched text.
	     *
	     * @return {Fibrio} The instance
	     */
	  }, {
	    key: 'process',
	    value: function process() {
	      if (this.newActionProcessed === false) {
	        this.newActionProcessed = true;
	        this.processMatch();
	      }
	      return this;
	    }

	    /**
	     * Process (replace/wrap) the matched text and
	     * return the processed HTML.
	     *
	     * @return {string}
	     *   The processed HTML of the context
	     */
	  }, {
	    key: 'render',
	    value: function render() {
	      this.process();
	      return this.html;
	    }
	  }, {
	    key: 'revert',
	    value: function revert() {
	      var level = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

	      level = typeof level === 'string' && level === 'all' ? 'all' : Number.parseInt(level, 10);

	      if (level === 1) {
	        this.context = root(this.phase.pop());
	        return this;
	      }

	      var length = this.phase.length;
	      var lastIdx = length - 1;
	      var all = level === 'all' || level >= length || Number.isNaN(level) ? true : false;

	      if (all) {
	        this.phase = [this.ohtml];
	        this.context = root(this.ohtml);
	        return this;
	      }

	      this.context = root(this.phase.splice(lastIdx - level, length)[0]);
	      return this;
	    }
	  }, {
	    key: 'text',
	    get: function get() {
	      return this.aggregate();
	    }
	  }, {
	    key: 'match',
	    get: function get() {
	      return this.grep();
	    }
	  }, {
	    key: 'html',
	    get: function get() {
	      return this.context.html().replace(/<\/?fibrio\-text>/gi, '');
	    }
	  }], [{
	    key: 'matches',
	    value: function matches(node, selector) {
	      node = $(node);

	      if (typeof node === 'object' && node.is && typeof node.is === 'function') {
	        return node.is(selector);
	      }
	      return false;
	    }
	  }]);

	  return Finder;
	})();

	Finder.version = '0.1.0';
	Finder.fn = Finder.prototype;

	exports['default'] = Finder;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var escapee = /([\.\*\+\?\^\=\!\:\$\{\}\(\)\|\[\]\/\\])/g;
	var escapeReg = function escapeReg(str) {
	  return new String(str).replace(escapee, '\\$1');
	};

	exports['default'] = escapeReg;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var $ = require('cheerio');

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
	    return $.html(this);
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
	    content = typeof content === 'string' ? $(content) : content;

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

	    mani.replaceWith.call(this, '<fibrio-fake>' + ($.html(content) + $.html(this)) + '</fibrio-fake>');

	    parent.children = Array.from($($.html(parent).replace(/<\/?fibrio\-fake>/gi, '')).contents());

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
	    var newNode = typeof content === 'string' ? $(content) : content;

	    if (idx < 0) return;
	    if (!newNode.type && newNode[0]) newNode = newNode[0];

	    sib[idx] = newNode;
	    return sib[idx];
	  },

	  createText: function createText(text) {
	    return $('<fibrio-text>' + text + '</fibrio-text>');
	  }
	};

	exports['default'] = mani;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	
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
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	exports['default'] = function (action, selector) {
	  var _this = this;

	  if (!/^(add|delete)$/i.test(action)) {
	    return this;
	  }

	  action = action.toLowerCase();

	  if (typeof selector === 'string') {
	    selector = selector.replace(/\,\s*/, ',').split(',');
	  }
	  if (Array.isArray(selector)) {
	    selector.map(function (s) {
	      return _this[action](s);
	    });
	  }
	  return this;
	};

	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _core = __webpack_require__(1);

	var _core2 = _interopRequireDefault(_core);

	var NON_TEXT = new Set(['br', 'hr',
	// Media and Source elmtents
	'script', 'style', 'img', 'video', 'audio', 'canvas', 'svg', 'map', 'object',
	// Input elmtents
	'input', 'textarea', 'select', 'option', 'optgroup', 'button']);

	var BDRY = new Set([
	// Block elmtents
	'address', 'article', 'aside', 'blockquote', 'dd', 'div', 'dl', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'main', 'nav', 'noscript', 'ol', 'output', 'p', 'pre', 'section', 'ul',
	// Other misc. elmtents that are not part of continuous inline prose
	'br', 'li', 'summary', 'dt', 'details', 'rp', 'rt', 'rtc',
	// Media and Source elmtents
	'script', 'style', 'img', 'video', 'audio', 'canvas', 'svg', 'map', 'object',
	// Input elmtents
	'input', 'textarea', 'select', 'option', 'optgroup', 'button',
	// Table related elmtents
	'table', 'tbody', 'thead', 'th', 'tr', 'td', 'caption', 'col', 'tfoot', 'colgroup']);

	var ELMT = { NON_TEXT: NON_TEXT, BDRY: BDRY };

	Object.assign(_core2['default'], { ELMT: ELMT });
	exports['default'] = ELMT;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(5);

	__webpack_require__(7);

	__webpack_require__(8);

	__webpack_require__(9);

	__webpack_require__(10);

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _core = __webpack_require__(1);

	var _core2 = _interopRequireDefault(_core);

	Object.assign(_core2['default'].fn, {
	  version: '0.1.0',
	  portionMode: 'retain',
	  context: undefined,

	  avoid: new Set(_core2['default'].ELMT.NON_TEXT),
	  bdry: new Set(_core2['default'].ELMT.BDRY)
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _core = __webpack_require__(1);

	var _core2 = _interopRequireDefault(_core);

	var _fnManipulate = __webpack_require__(3);

	Object.assign(_core2['default'].fn, {
	  /**
	   * Get the text aggregate of a node w/o resorting to
	   * `$node.text()`
	   *
	   * @param {Cheerio}
	   * @return {Array}
	   *   The entire text aggregation of the instance’s
	   *   context node w/o the avoided parts.
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _core = __webpack_require__(1);

	var _core2 = _interopRequireDefault(_core);

	var _fnEscapeReg = __webpack_require__(2);

	var _fnEscapeReg2 = _interopRequireDefault(_fnEscapeReg);

	Object.assign(_core2['default'].fn, {
	  /**
	   * Set up the text pattern for the finder to process.
	   *
	   * @param {String|RegExp}
	   * @param {Boolean} [returnMatch=false]
	   * @return {Fibrio|Array}
	   *   The instance or the matches (array) depends on
	   *   the second @param, `returnMatch`
	   */
	  find: function find(regex) {
	    var returnMatch = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	    this.pattern = regex;
	    var ret = this.grep();
	    return returnMatch === true ? ret : this;
	  },

	  /**
	   * Gre(p) the matches with the text aggregation.
	   *
	   * @return {Array}
	   *   The matches within the instance’s context node
	   */
	  grep: function grep() {
	    var aggr = this.text;
	    var prepMat = this.prepMat;
	    var regex = typeof this.pattern === 'string' ? new RegExp((0, _fnEscapeReg2['default'])(this.pattern), 'g') : this.pattern;

	    var mat = undefined;
	    var matIdx = 0;
	    var offset = 0;
	    var match = [];

	    void (function matchAggr(aggr) {
	      for (var i = 0, l = aggr.length; i < l; ++i) {
	        var text = aggr[i];

	        if (typeof text !== 'string') {
	          // Deal with nested contexts
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
	   * Prepare the single match object with the its
	   * metadata.
	   *
	   * @return {Object} Match
	   */
	  prepMat: function prepMat(mat, matIdx, offset) {
	    if (!mat[0]) throw new Error('Fibrio cannot handle zero-length matches');

	    mat.idx = mat.index;
	    mat.startIdx = offset + mat.idx;
	    mat.endIdx = offset + mat.idx + mat[0].length;

	    mat.idx = mat.index = matIdx;
	    return mat;
	  }
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _core = __webpack_require__(1);

	var _core2 = _interopRequireDefault(_core);

	var _fnManipulate = __webpack_require__(3);

	var $ = require('cheerio');

	Object.assign(_core2['default'].fn, {
	  /**
	   * Process (wrap/replace) the matched text with the
	   * instance’s previous set wrapper/replacement.
	   *
	   * @return {Fibrio} The instance
	   */
	  processMatch: function processMatch() {
	    var match = this.match;
	    var context = this.context;

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

	    this.phase.push(this.html);

	    out: while (true) {
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
	        var _context2;

	        var old = Object.assign({}, current);

	        // Method `replaceMat` returns the end portion node,
	        // and then we continue the recursion from its next
	        // node.
	        atIdx -= endPortion.node.data.length - endPortion.endIdxInNode;

	        current = this.replaceMat(mat, startPortion, innerPortion, endPortion);

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
	        if (current.rerendered && !(_context2 = current, _fnManipulate.next).call(_context2)) {
	          // The `rerenderedLevel` variable here is to
	          // indicate how many level we have to go back.
	          var rerenderedLevel = 1;
	          {
	            var cloned = Array.from(nodeStack);

	            cloned.shift(); // Omit the root element
	            cloned.pop(); // Omit current text node’s parent element

	            while ($.contains(cloned.pop(), old)) {
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

	        // Move down
	      } else if (!doAvoidNode && (_context = current, _fnManipulate.first).call(_context)) {
	          var _context3;

	          nodeStack.push(current);
	          current = (_context3 = current, _fnManipulate.first).call(_context3);
	          continue;
	          // Move forward
	        } else if (!doAvoidNode && (_context = current, _fnManipulate.next).call(_context)) {
	            var _context4;

	            current = (_context4 = current, _fnManipulate.next).call(_context4);
	            continue;
	          }

	      while (true) {
	        var _context5;

	        // Move forward
	        if ((_context5 = current, _fnManipulate.next).call(_context5)) {
	          var _context6;

	          current = (_context6 = current, _fnManipulate.next).call(_context6);
	          break;
	        }
	        // Move up (and move forward again)
	        current = nodeStack.pop();

	        // Done with the assigned context from the Finder
	        if (current === context) break out;
	      }
	    }
	    return this;
	  },

	  /**
	   * Replace the matched text portion(s) with the configured
	   * replacement (node/element) and return the endPortion
	   * node for `processMatch` to iterate.
	   *
	   * @return {CheerioDOMObject}
	   */
	  replaceMat: function replaceMat(mat, startPortion, innerPortion, endPortion) {
	    var _this = this;

	    var context = this.context;
	    var matStartNode = startPortion.node;
	    var matEndNode = endPortion.node;

	    var preceeding = '';
	    var following = '';
	    var label = ['{{fibrio-replacement: ' + Date.now() + '}}', '{{fibrio-replacement: ' + Date.now() + '}}[[end]]'];

	    if (matStartNode === matEndNode) {
	      var _context7;

	      var matNode = matStartNode;
	      var data = matNode.data;
	      var matElmt = context.find(_fnManipulate.parent.call(matNode));

	      if (!matElmt[0]) matElmt = context;

	      var idx = matElmt[0].children.indexOf(matNode);
	      var replacement = undefined;

	      // Grab the text before the match
	      if (startPortion.idxInNode > 0) {
	        preceeding = data.substring(0, startPortion.idxInNode);
	      }

	      // Get the replacement
	      replacement = (_context7 = this.getPortionReplacementElmt(endPortion, mat), _fnManipulate.html).call(_context7);

	      // Grab the text after the match
	      if (endPortion.endIdxInNode < data.length) {
	        following = data.substring(endPortion.endIdxInNode);
	      }

	      matNode.data = label[0];

	      matElmt.html(matElmt.html().replace(label[0], preceeding + replacement + following));

	      // Return the new node
	      return matElmt.contents()[preceeding ? idx + 1 : idx];
	    } else {
	      var _context8;

	      var _context9;

	      var _ret = (function () {
	        // matStartNode -> matInnerNode -> matEndNode

	        var matStartElmt = context.find(_fnManipulate.parent.call(matStartNode));
	        var matEndElmt = context.find(_fnManipulate.parent.call(matEndNode));
	        var areNotEqual = true;

	        if (!matStartElmt[0]) matStartElmt = context;
	        if (!matEndElmt[0]) matEndElmt = context;

	        preceeding = matStartNode.data.substring(0, startPortion.idxInNode);
	        following = matEndNode.data.substring(endPortion.endIdxInNode);

	        var first = (_context8 = _this.getPortionReplacementElmt(startPortion, mat), _fnManipulate.html).call(_context8);

	        for (var i = 0, l = innerPortion.length; i < l; ++i) {
	          var portion = innerPortion[i];
	          (_context9 = portion.node, _fnManipulate.replaceWith).call(_context9, _this.getPortionReplacementElmt(portion, mat));
	        }

	        var last = (_context8 = _this.getPortionReplacementElmt(endPortion, mat).attr('data-fibrio-mat-elmt', 'last'), _fnManipulate.html).call(_context8);

	        matStartNode.data = label[0];
	        matEndNode.data = label[1];

	        matStartElmt.html(matStartElmt.html().replace(label[0], preceeding + first).replace(label[1], function () {
	          areNotEqual = false;
	          return last + following;
	        }));

	        matEndElmt.html((matEndElmt.html() || '').replace(label[1], last + following));

	        var ret = (areNotEqual ? matEndElmt : matStartElmt).find('[data-fibrio-mat-elmt="last"]').removeAttr('data-fibrio-mat-elmt')[0];

	        if (!_fnManipulate.next.call(ret)) ret.rerendered = true;
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
	    var _context10;

	    var replacement = this.replacement || '$&';
	    var wrapper = this.wrapper;

	    if (wrapper && (_context10 = wrapper, _fnManipulate.prop).call(_context10, 'type') && (_context10 = wrapper, _fnManipulate.prop).call(_context10, 'type') !== 'text') {
	      // Clone the element from its HTML
	      wrapper = $($.html(wrapper));
	    }

	    if (typeof replacement === 'function') {
	      var _context11;

	      replacement = replacement(portion, mat, matIdx);

	      if (replacement && (_context11 = replacement, _fnManipulate.prop).call(_context11, 'type')) {
	        return replacement;
	      }

	      return (0, _fnManipulate.createText)(replacement);
	    }

	    var elmt = typeof wrapper === 'string' ? /^<([\w\-]+)\s?.*>.*<\/\1>$/gi.test(wrapper) ? $(wrapper) : $('<' + wrapper + '></' + wrapper + '>') : wrapper;

	    replacement = (0, _fnManipulate.createText)(this.prepReplacementString(replacement, portion, mat, matIdx));

	    if (!(_context10 = (_context10 = replacement, _fnManipulate.first).call(_context10), _fnManipulate.prop).call(_context10, 'data')) {
	      return replacement;
	    }
	    if (!elmt) {
	      return replacement;
	    }

	    elmt.append(replacement);
	    return elmt;
	  },

	  /**
	   * Prepare the replacement text according to the given
	   * portion.
	   *
	   * @return {String}
	   */
	  prepReplacementString: function prepReplacementString(string, portion, mat, matIdx) {
	    var mode = this.portionMode;

	    if (mode === 'first' && portion.idxInMat > 0) {
	      return '';
	    }

	    string = string.replace(/\$(\d+|&|`|')/g, function ($0, t) {
	      var replacement = undefined;

	      switch (t) {
	        case '&':
	          replacement = mat[0];
	          break;
	        case '`':
	          replacement = mat.input.substring(0, mat.startIdx);
	          break;
	        case '\'':
	          replacement = mat.input.substring(mat.endIdx);
	          break;
	        default:
	          replacement = mat[+t];
	      }
	      return replacement;
	    });

	    if (mode === 'first') return string;
	    if (portion.isEnd) {
	      return string.substring(portion.idxInMat);
	    }
	    return string.substring(portion.idxInMat, portion.idxInMat + portion.text.length);
	  }
	});

/***/ }
/******/ ]);
function IMPORT( mod ) { return require( mod ) }
function EXPORT_ONCE( mod ) { module.exports = mod }
