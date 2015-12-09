/*!
 * Fibrio v0.1.0
 * Chen Yijun (@ethantw) | MIT License
 * https://github.com/ethantw/fibrio
 *
 * Original algorithms from:
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

	__webpack_require__(7);

	__webpack_require__(8);

	__webpack_require__(9);

	__webpack_require__(10);

	__webpack_require__(11);

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

	Fibrio.fibrio = Fibrio.version = '0.1.0';

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

	var _fnRoot = __webpack_require__(3);

	var _fnRoot2 = _interopRequireDefault(_fnRoot);

	var _fnManipulate = __webpack_require__(4);

	var _fnSetAct = __webpack_require__(5);

	var _fnSetAct2 = _interopRequireDefault(_fnSetAct);

	var _fnRevertTo = __webpack_require__(6);

	var _fnRevertTo2 = _interopRequireDefault(_fnRevertTo);

	// NPM modules:
	var $ = require('cheerio');

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
	    this.context = (0, _fnRoot2['default'])(html);
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
	   * @param {CheerioDOMObject|HTMLString}
	   *   The element to be checked with.
	   * @param {String}
	   *   The CSS Selector(s) to test.
	   */

	  _createClass(Finder, [{
	    key: 'qsa',
	    value: function qsa(selector) {
	      if (!this.root) {
	        this.root = this.context;
	      }
	      this.context = this.context.find(selector);
	      return this;
	    }

	    /**
	     * Indicate whether to re-use the existing portions
	     * while replacing a match with text or to place the
	     * the entire replacement in the first found match
	     * portion’s node.
	     *
	     * @param {String} [mode='retain']
	     *   Either 'retain' or 'first'.
	     */
	  }, {
	    key: 'mode',
	    value: function mode(_mode) {
	      this.portionMode = /^first$/i.test(_mode) ? 'first' : 'retain';
	      return this;
	    }

	    /**
	     * The default function to be called on every element
	     * encountered by the finder. Once the function returns
	     * false, the element will be avoided.
	     *
	     * @param {CheerioDOMObject}
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
	     * @param {CheerioDOMObject}
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
	        this.avoid = new Set(Finder.preset.HTML5.NON_TEXT);
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
	        this.avoid = new Set(Finder.preset.HTML5.NON_TEXT);
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
	        this.bdry = new Set(Finder.preset.HTML5.BDRY);
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
	        this.bdry = new Set(Finder.preset.HTML5.BDRY);
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
	     * Set up the text pattern for the finder to process.
	     *
	     * @param {String|RegExp}
	     * @param {Boolean} [returnMatch=false]
	     * @return {Fibrio|Array}
	     *   The instance or the matches (array) depends on
	     *   the second @param, `returnMatch`
	     */
	  }, {
	    key: 'find',
	    value: function find(regex) {
	      var returnMatch = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	      this.pattern = regex;
	      return returnMatch === true ? this.match : this;
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
	      if (this.newActionProcessed === true) return this;

	      {
	        var cloned = typeof this.root !== 'undefined' ? this.root.clone() : null;
	        this.phase.push({
	          html: this.html,
	          root: cloned,
	          context: cloned ? cloned.find(this.context) : null
	        });
	      }

	      if (typeof this.root === 'undefined') {
	        this.processMatch();
	      } else {
	        var i = this.context.length;

	        while (i--) {
	          var context = this.context.eq(i);
	          var match = this.match[i];
	          this.processMatch({ context: context, match: match });
	        }
	      }
	      this.newActionProcessed = true;
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

	    /**
	     * Revert to a certain text-processing phase of
	     * the instance.
	     *
	     * @param {Number|String} [level=1]
	     *   The level — a number or a string of `all` —
	     *   to be reverted.
	     * @return {Fibrio}
	     *   The instance.
	     *
	     */
	  }, {
	    key: 'revert',
	    value: function revert() {
	      var level = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

	      level = typeof level === 'string' && level === 'all' ? 'all' : Number.parseInt(level, 10);

	      if (level === 1) {
	        _fnRevertTo2['default'].call(this, this.phase.pop());
	        return this;
	      }

	      var length = this.phase.length;

	      // If we’re to revert back to the original state
	      if (level === 'all' || level >= length || Number.isNaN(level)) {
	        _fnRevertTo2['default'].call(this, this.phase[0]);
	        this.phase = [];
	        return this;
	      }

	      _fnRevertTo2['default'].call(this, this.phase.splice(length - level, length)[0]);
	      return this;
	    }
	  }, {
	    key: 'text',
	    get: function get() {
	      if (typeof this.root === 'undefined') {
	        return this.aggregate();
	      }

	      var i = this.context.length;
	      var ret = [];

	      while (i--) {
	        ret.unshift(this.aggregate(this.context[i]));
	      }
	      return ret;
	    }
	  }, {
	    key: 'match',
	    get: function get() {
	      if (typeof this.root === 'undefined') {
	        return this.grep();
	      }

	      var i = this.text.length;
	      var ret = [];

	      while (i--) {
	        ret.unshift(this.grep(this.text[i]));
	      }
	      return ret;
	    }
	  }, {
	    key: 'html',
	    get: function get() {
	      return (this.root || this.context).html().replace(/<\/?fibrio\-text>/gi, '');
	    }
	  }], [{
	    key: 'matches',
	    value: function matches(elmt, selector) {
	      elmt = $(elmt);

	      if (typeof elmt === 'object' && elmt.is && typeof elmt.is === 'function') {
	        return elmt.is(selector);
	      }
	      return false;
	    }
	  }]);

	  return Finder;
	})();

	Finder.version = '0.1.0';
	Finder.fn = Finder.prototype;

	Finder.fn.filter = Finder.fn.query = Finder.fn.$ = Finder.fn.qsa;

	exports['default'] = Finder;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var escapeReg = function escapeReg(str) {
	  return new String(str).replace(/([\.\*\+\?\^\=\!\:\$\{\}\(\)\|\[\]\/\\])/g, '\\$1');
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
	var root = function root(html) {
	  return $('<fibrio-root>' + html + '</fibrio-root>');
	};

	exports['default'] = root;
	module.exports = exports['default'];

/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var normalize = require('normalize-selector');
	var split = require('split-css-selector');

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
	    selector = split(selector);
	  }
	  if (selector && Array.isArray(selector)) {
	    selector.forEach(function (sel) {
	      return _this[action](normalize(sel));
	    });
	  }
	  return this;
	};

	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _root = __webpack_require__(3);

	var _root2 = _interopRequireDefault(_root);

	exports['default'] = function (phase) {
	  if (!phase.context) {
	    this.context = (0, _root2['default'])(phase.html);
	    return;
	  }
	  this.root = phase.root;
	  this.context = phase.context;
	};

	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _core = __webpack_require__(1);

	var _core2 = _interopRequireDefault(_core);

	Object.assign(_core2['default'].fn, {
	  version: '0.1.0',
	  portionMode: 'retain',
	  context: undefined,
	  avoid: new Set(_core2['default'].preset.HTML5.NON_TEXT),
	  bdry: new Set(_core2['default'].preset.HTML5.BDRY)
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _core = __webpack_require__(1);

	var _core2 = _interopRequireDefault(_core);

	var _fnManipulate = __webpack_require__(4);

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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _core = __webpack_require__(1);

	var _core2 = _interopRequireDefault(_core);

	var _fnEscapeReg = __webpack_require__(2);

	var _fnEscapeReg2 = _interopRequireDefault(_fnEscapeReg);

	Object.assign(_core2['default'].fn, {
	  /**
	   * Gre(p) the matches with the text aggregation.
	   *
	   * @return {Array}
	   *   The matches within the instance’s context node
	   */
	  grep: function grep() {
	    var aggr = arguments.length <= 0 || arguments[0] === undefined ? this.text : arguments[0];

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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _core = __webpack_require__(1);

	var _core2 = _interopRequireDefault(_core);

	var _fnManipulate = __webpack_require__(4);

	var $ = require('cheerio');

	Object.assign(_core2['default'].fn, {
	  /**
	   * Process (wrap/replace) the matched text with the
	   * instance’s previous set wrapper/replacement.
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
	  replaceMat: function replaceMat(context, mat, startPortion, innerPortion, endPortion) {
	    var _this = this;

	    var matStartNode = startPortion.node;
	    var matEndNode = endPortion.node;

	    var preceding = '';
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
	        preceding = data.substring(0, startPortion.idxInNode);
	      }

	      // Get the replacement
	      replacement = (_context7 = this.getPortionReplacementElmt(endPortion, mat), _fnManipulate.html).call(_context7);

	      // Grab the text after the match
	      if (endPortion.endIdxInNode < data.length) {
	        following = data.substring(endPortion.endIdxInNode);
	      }

	      matNode.data = label[0];

	      matElmt.html(matElmt.html().replace(label[0], preceding + replacement + following));

	      // Return the new node
	      return matElmt.contents()[preceding ? idx + 1 : idx];
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

	        preceding = matStartNode.data.substring(0, startPortion.idxInNode);
	        following = matEndNode.data.substring(endPortion.endIdxInNode);

	        var first = (_context8 = _this.getPortionReplacementElmt(startPortion, mat), _fnManipulate.html).call(_context8);

	        for (var i = 0, l = innerPortion.length; i < l; ++i) {
	          var portion = innerPortion[i];
	          (_context9 = portion.node, _fnManipulate.replaceWith).call(_context9, _this.getPortionReplacementElmt(portion, mat));
	        }

	        var last = (_context8 = _this.getPortionReplacementElmt(endPortion, mat).attr('data-fibrio-mat-elmt', 'last'), _fnManipulate.html).call(_context8);

	        matStartNode.data = label[0];
	        matEndNode.data = label[1];

	        matStartElmt.html(matStartElmt.html().replace(label[0], preceding + first).replace(label[1], function () {
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
