/*global */
(function($,undefined) {
	"use strict";
	var _gdda = $.gdda;
	var _util = _gdda.util;
	var _log = _util.log;
	/*
	var _prepareData = function(dfd, data, options){
		_log.dir(data);
		dfd.resolve(data);
	};

	var _buildOptions = function(dfd, data, options){
		_log.dir(data);
		dfd.resolve(options);
	};
*/
	var _render = function(dfd, context, data){
		var holders = context.holders;
		var mainHolder = holders.main;
		mainHolder.detach();
		mainHolder.getDiv().text(JSON.stringify(data));
		mainHolder.retach();
		
		dfd.resolve(context);		
	};

	$.extend(true, _gdda, {
		'module': {
			'nope': {
			//	prepareData: _prepareData,
			//	buildOptions: _buildOptions,
				render: _render
			}
		}
	});
})(jQuery);