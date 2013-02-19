/*global console:false*/
(function($, _win, undefined) {
	"use strict";
	var _gdda = $.gdda;
	var _array_slice = Array.prototype.slice;
	var _array_push = Array.prototype.push;
	var _obj_toString = Object.prototype.toString;

	var _objectType = function(obj) {
			if(typeof obj === "undefined") {
				return "undefined";

				// consider: typeof null === object
			}
			if(obj === null) {
				return "null";
			}

			var type = _obj_toString.call(obj).match(/^\[object\s(.*)\]$/)[1] || '';

			switch(type) {
			case 'Number':
				if(isNaN(obj)) {
					return "nan";
				}
				return "number";
			case 'String':
			case 'Boolean':
			case 'Array':
			case 'Date':
			case 'RegExp':
			case 'Function':
				return type.toLowerCase();
			}
			if(typeof obj === "object") {
				return "object";
			}
			return undefined;
		};

	var _log = {
		log: function(arg) {
			if(window._GDDA_DEBUG) {
				try {
					undefined.a = 1;
				} catch(e) {
					console.log(arg + e.stack.split('\n')[2]);
				}
			}
		},
		dir: function(arg) {
			if(window._GDDA_DEBUG) {
				//console.dir(arg );
				try {
					undefined.a = 1;
				} catch(e) {
					console.group(e.stack.split('\n')[2]);
					console.dir(arg);
					console.groupEnd();
				}
			}
		}
	};

	var _hide_querybox_container = false;

	if(!String.prototype.trim) {
		String.prototype.trim = function() {
			return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		};
	}

	var _getHideQueryboxContainer = function() {
			if(!_hide_querybox_container) {
				_hide_querybox_container = $('<div/>').hide().appendTo($('body'));
			}
			return _hide_querybox_container;
		};

	var _findNodeById = function(id) {
			if(typeof id === "string") {
				return document.getElementById(id);
			}
			return;
		};


	var _throwError = function(msg) {
			throw new Error(msg);
		};

	var _divHolder = function($div) {
			//return new function(){
			// TODO:
			// $div后面是否还有兄弟结点
			var isLast = false;
			if(!$div || $div.length < 1) {
				_log.dir($div);
				return;
			}
			// 取得后面的兄弟结点句柄
			var $next = $div.next();
			var $parent;
			// 如果找不到后面的兄弟结点，
			// 说明本元素是父元素的最后一个子节点，取得父元素句柄
			if($next.length < 1) {
				$parent = $div.parent();
				isLast = true;
			}
			return {
				detach: function() {
					return $div.detach();
				},
				retach: function() {
					if(isLast) {
						$parent.append($div);
					} else {
						$next.before($div);
					}
				}
			};
			//};
		};
	/**
	 * 去除字符串两边的空白
	 * @param  {String } str 需处理的字符串，可以为undefined
	 * @return {String } 返回去除空白后的字符串或者undefined。
	 *                   永远不会返回空串！
	 *                   对空白字符串调用返回undefined
	 *                   对非字符串调用返回undefined
	 */
	var _trim = function(str) {
			// TODO:
			if(str) {
				if(typeof str === 'string' || str instanceof String) {
					var t = str.trim();
					if(t.length > 0) {
						return t;
					}
				}
			}
			return undefined;
		};

	var _buildDeferred = function(deferredCall, doneCallbacks, failCallbacks) {
			// 新建一个deferred对象
			var dfd = $.Deferred();
			// 注册成功，失败回调链
			dfd.done(doneCallbacks).fail(failCallbacks);

			var args;

			if(_objectType(deferredCall) !== 'function') {
				//_throwError('deferredCall must be a function');
				dfd.reject(new Error('deferredCall must be a function'));
			} else {
				try {
					args = [deferredCall, 0, dfd];
					if(arguments.length > 3) {
						var extArgs = _array_slice.apply(arguments).slice(3);
						_array_push.apply(args, extArgs);
					}
					// 设置延迟调用函数
					setTimeout.apply(_win, args);
				} catch(e) {
					dfd.reject(e);
				}
			}
			return dfd.promise(); // 返回promise对象
		};

	$.extend(true, _gdda, {
		util: {
			trim: _trim,
			findNodeById: _findNodeById,
			divHolder: _divHolder,
			getHideQBParent: _getHideQueryboxContainer,
			log: _log,
			buildDeferred: _buildDeferred,
			throwError: _throwError,
			objectType: _objectType
		}
	});
})(jQuery, window);