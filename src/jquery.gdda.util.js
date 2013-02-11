/*global console:false,alert:false*/
(function($){
	"use strict";
	var _gdda = $.gdda;
	var _log = _gdda.log;

	if(!String.prototype.trim) {
		String.prototype.trim = function () {
			return this .replace(/^\s\s*/, '' ).replace(/\s\s*$/, '' );
		};
	}

	function _findDivById(x) {
		if(typeof x === "string") {
			return document.getElementById(x);
		}
		return;
	}

	var _divHolder = function($div){
		//return new function(){
			// TODO:
			// $div后面是否还有兄弟结点
			var isLast = false;
			if(!$div || $div.length<1){
				_log.dir($div);
				return;
			}
			// 取得后面的兄弟结点句柄
			var $next = $div.next();
			var $parent ;
			// 如果找不到后面的兄弟结点，
			// 说明本元素是父元素的最后一个子节点，取得父元素句柄
			if($next.length<1){
				$parent = $div.parent();
				isLast = true;
			}
			return {
				detach:function(){
					return $div.detach();
				},
				retach:function(){
					if(isLast){
						$parent.append($div);
					}else{
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
	var _trim = function(str){
		// TODO:
		if(str){
			if(typeof str === 'string' || str instanceof String ){
				var t = str.trim();
				if(t.length>0){
					return t;
				}
			}
		}
		return undefined;
	};

	$.extend(_gdda,{
		util:{
			trim: _trim,
			divHolder: _divHolder
		}
	});
})(jQuery,undefined);