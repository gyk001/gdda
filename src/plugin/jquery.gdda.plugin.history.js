/*global devel:false*/
(function($, undefined) {
	"use strict";
	var _gdda = $.gdda;
	var _core = _gdda.core;
	var _util = _gdda.util;
	var _log = _util.log;
	var _core_querybox = _core.querybox;

	var _storeHistoryThenUpdateButton = function(data,params){
		var context = this;
		var history = context._history;

		if(_util.objectType(history.stack)!=='array'){
			history.stack = [];
		}

		var stack = history.stack;
		if(history.isback){
			history.isback = false;
		}else{
			stack.push(params);
		}
		var len = stack.length-1;
		history.btn.attr('disabled',len<1).text('后退('+len+')');//.removeAttr('disabled');
	};

	var _renderHistoryButton = function($querybox){
		var context = this;
		var $btn = $('<button>').text('回退').attr('disabled','disabled').click(function(){
			_historyBack.call(context);
		});
		$btn.appendTo($querybox);
		if(!context._history){
			context._history = {
				stack:[],
				btn:$btn
			};
		}
	};

	_core_querybox.addQueryDoneCallback(_storeHistoryThenUpdateButton);
	_core_querybox.addRenderDoneCallback(_renderHistoryButton);


	var _historyBack = function(){
		var context = this;
		var history = context._history;
		var stack = history.stack;
		history.isback = true;
		var params = stack.pop();
		_core.requery(context, params);
	};

	$.extend(true, _gdda, {
		'plugin': {
			'history': {

			}
		}
	});

})(jQuery);