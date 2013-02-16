/*jslint evil:true, devel:true */
(function($,undefined) {
	"use strict";
	var _gdda = $.gdda;
	var _util = _gdda.util;
	var _log = _util.log;
	var _default = _gdda.defaults;
	var _URL_PREFIX = _default.urlPrefix;
	var _ajaxs = _gdda._ajaxs;

	// 已加载的配置
	var _config_loaded = {};
	// 配置加载完成回调链
	var _loadDoneCallbacks = [];
	// 配置加载异常回调链
	var _loadFailCallbacks = [];

	/**
	 * 判断给定查询ID的配置是否已加载
	 * 
	 * @param  {String} qid 查询ID
	 * @return {Boolean}    已加载返回true，未加载返回false
	 */
	var _config_exists = function(qid){
		return !!_config_loaded[qid];
	};

	/**
	 * 获取给定查询ID的配置对象
	 * @param  {String} qid 查询ID
	 * @return {Object}     存在返回配置对象，不存在返回undefined
	 */
	var _get_config = function(qid){
		return _config_loaded[qid];
	};
	/**
	 * 加载对应查询ID的配置文件
	 * @param  {String} qid 查询ID
	 * @return {$.Deferred()}  done回调中传入已加载的配置对象
	 */
	var _load = function (qid){
		//构造Defferred对象
		var dfd = $.Deferred();
		// 注册成功，失败回调链
		dfd.done(_loadDoneCallbacks).fail(_loadFailCallbacks);
		//尝试取已存在的配置
		var _config = _config_loaded[qid];
		//配置项已存在则直接进入已加载完成状态，done回调中传入已加载的配置
		if(_config){
			return dfd.resolve(_config).promise();
		}
		//根据qid句点分割规则构造加载URL地址
		var _url = [_URL_PREFIX].concat(qid.split('.').join('/'),'.js').join('');
		//_log.log(_url);
		//构造请求对象并送入Ajax暂存区
		_ajaxs[qid]= $.ajax({
			url: _url,
			type: 'GET',
			dataType: 'text',
			crossDomain: true,
			processData: false
		}).done(function(js){
			//alert('done');
			//处理返回的内容
			var str = ['(function(){return ',js,';})();'].join('');
			try{
				//解析并存储配置对象
				_config = _config_loaded[qid] = eval(str);
				//_log.dir(_config);
				// 标记已成功并传入配置对象
				dfd.resolve(_config);
			}catch(e){
				//console.dir(e);
				//alert('加载失败!');
				//标记加载失败
				dfd.reject(e);

			}
		}).fail(function(e){
			//alert('fail');
			//标记加载失败
			dfd.reject(e);
		}).always(function(){
			//alert('always');
			delete _ajaxs[qid] ;
			//alert('al');
		});
		return dfd.promise();
	};

	var _addLoadDoneCallback = function(callback){
		_loadDoneCallbacks.push(callback);
	};
	var _addLoadFailCallback = function(callback){
		_loadFailCallbacks.push(callback);
	};


	var _generate = function(qid){
		
	};

	$.extend(true,_gdda, {
		'core': {
			'config': {
				load: _load,
				addLoadDoneCallback: _addLoadDoneCallback,
				addLoadFailCallback:_addLoadFailCallback,
				exists: _config_exists,
				get: _get_config,
				generate:_generate
			}
		}
	});

})(jQuery);