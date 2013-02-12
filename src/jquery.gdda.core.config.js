/*jslint evil:true, devel:true */
(function($,undefined) {
	"use strict";
	var _gdda = $.gdda;
	var _util = _gdda.util;
	var _log = _gdda.log;
	var _default = _gdda.defaults;
	var _URL_PREFIX = _default.urlPrefix;

	var _config_loaded = {};

	var _config_exists = function(qid){
		return !!_config_loaded[qid];
	};

	var _get_config = function(qid){
		return _config_loaded[qid];
	};

	var _load = function (qid){
		var _ajaxs = _gdda._ajaxs;
		var _config = _config_loaded[qid];
		//配置项已存在则直接进入已加载完成状态
		if(_config){
			return $.Deferred().resolve().promise();
		}

		var _url = [_URL_PREFIX].concat(qid.split('.').join('/'),'.js').join('');
		//_log.log(_url);
		return _ajaxs[qid]= $.ajax({
			url: _url,
			type: 'GET',
			dataType: 'text',
			crossDomain: true,
			processData: false
		}).done(function(js){
			var str = ['(function(){return ',js,';})();'].join('');
			try{
				_config = _config_loaded[qid] = eval(str);
				_log.dir(_config);
			}catch(e){
				console.dir(e);
				alert('加载失败!');
			}
		}).fail(function(){
			//debugger;
			//TODO
			alert('fail');
		}).always(function(){
			delete _ajaxs[qid] ;
			//alert('al');
		});
		//_log.log(requset);
	};

	var _loader = {};

	var _module = {};

	var _generate = function(qid){
		
	};

	$.extend(true,_gdda, {
		'core': {
			'config': {
				loader:_loader,
				load: _load,
				exists: _config_exists,
				get: _get_config,
				module:_module,
				generate:_generate
			}
		}
	});

})(jQuery);