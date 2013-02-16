/*global console:false,alert:false,_log4javascript:false*/
(function($) {
	"use strict";
	var _gdda = $.gdda;
	var _util = _gdda.util;
	var _log = _util.log;
	
	
	var _deferredRenderMainData = function(dfd){
		
	};

	var _renderMainData = function($qb, options) {
			// 新建一个deferred对象
			var dfd = $.Deferred();
			//dfd.done(_queryDoneCallbacks).fail(_queryFailCallbacks);
			/*
			var _doQuery = function() {
					try {
						var data = {
							a: 1
						};
						dfd.resolve(data);
					} catch(e) {
						dfd.reject();
					}
				};
			setTimeout(_doQuery, 0);
			*/
			return dfd.promise(); // 返回promise对象
		};

	$.extend(true, _gdda, {
		'core': {
			'data': {
				'render': _renderMainData
			}
		}
	});

})(jQuery);