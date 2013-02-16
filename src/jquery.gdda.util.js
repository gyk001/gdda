/*global console:false,alert:false*/
(function($){
	"use strict";
	var _gdda = $.gdda;
	
	var _log = {
		log:function(arg){
			if(window._GDDA_DEBUG){
				try{
					undefined.a = 1;
				}catch(e){
					console.log(arg+e.stack.split('\n')[2]);
				}
			}
		},
		dir:function(arg){
			if(window._GDDA_DEBUG){
				try{
					undefined.a =1 ;
				}catch(e){
					console.dir(arg+e.stack.split('\n')[2]);					
				}
			}	
		}
	};

	var _hide_querybox_container=false;

	if(!String.prototype.trim) {
		String.prototype.trim = function () {
			return this .replace(/^\s\s*/, '' ).replace(/\s\s*$/, '' );
		};
	}

	var _getHideQueryboxContainer = function(){
		if(! _hide_querybox_container){
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

	$.extend(true,_gdda,{
		util:{
			trim: _trim,
			findNodeById:_findNodeById,
			divHolder: _divHolder,
			getHideQBParent:_getHideQueryboxContainer,
			log: _log
		}
	});
})(jQuery,undefined);