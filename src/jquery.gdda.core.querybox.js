/*global devel:false*/
(function($, undefined) {
	"use strict";
	var _gdda = $.gdda;
	var _core = _gdda.core;
	var _util = _gdda.util;
	var _log = _util.log;
	var _default = _gdda.defaults;
	var _prefix = _default.prefix;
	var _dataUrlPrefix = _prefix.dataUrl;

	var _QB_KEYS = _gdda.defaults.KEYS.QUERYBOX;
	var _QB_HIDDEN = _QB_KEYS.HIDDEN;
	var _QB_VALUE = _QB_KEYS.VALUE;
	var _QB_LABEL = _QB_KEYS.LABEL;
	var _QB_TYPE = _QB_KEYS.TYPE;
	var _QB_NAME = _QB_KEYS.NAME;
	//var _QB_SELECT_VALUES = _QB_KEYS.SELECT_VALUES;
	var _QB_CALLBACK = _QB_KEYS.CALLBACK;
	var _QB_CTRL_CLS = _QB_KEYS.CTRL_CLS;



	//查询成功回调链
	var _queryDoneCallbacks = [];
	//查询失败回调链
	var _queryFailCallbacks = [];

	/**
	 * 添加查询成功回调函数
	 * @param {Function} callback 查询成功后进行回调的函数
	 */
	var _addQueryDoneCallback = function(callback) {
			_queryDoneCallbacks.push(callback);
		};

	/**
	 * 添加查询失败回调函数
	 * @param {Function} callback 查询失败后进行回调的函数
	 */
	var _addQueryFailCallback = function(callback) {
			_queryFailCallbacks.push(callback);
		};

	var _clearQueryDoneCallback = function() {
			_queryDoneCallbacks.length = 0;
		};

	var _clearQueryFailCallback = function() {
			_queryFailCallbacks.length = 0;
		};

	var _renderDoneCallbacks = [];
	var _renderFailCallbacks = [];

	var _addRenderDoneCallback = function(callback) {
			_renderDoneCallbacks.push(callback);
			//console.dir(_renderDoneCallbacks);
		};

	var _addRenderFailCallback = function(callback) {
			_renderFailCallbacks.push(callback);
		};

	var _clearRenderDoneCallback = function() {
			_renderDoneCallbacks.length = 0;
		};

	var _clearRenderFailCallback = function() {
			_renderFailCallbacks.length = 0;
		};


	/**
	 * 为查询控件绑定回调
	 * @param  {jQuery}   $ctrl     控件
	 * @param  {jQuery}   $querybox 控件所在的查询框
	 * @param  {Object} callback  回调对象,形如:
	 *    {
	 *      change:function($querybox,$ctrl) {
	 *        var $year = $('[name=year]',$querybox);
	 *        $year.val($year.val()+$ctrl.val());
	 *      }
	 *    }
	 * @return {jQuery}             返回生成的控件对象
	 */
	var _bindCtrlCallBack = function($ctrl, $querybox, callbacks) {
			var _caller = function(event) {
					var cb = event.data.cb;
					cb($querybox, $ctrl, event);
				};
			for(var eType in callbacks) {
				var callback = callbacks[eType];
				if(typeof callback === 'function') {
					$querybox.on(eType + '.gdda', '#' + $ctrl.attr('id'), {
						cb: callback
					}, _caller);
				}
			}
			return $ctrl;
		};

	/**
	 * 生成一个查询控件，包括解析控件配置，生成dom元素，绑定回调事件等操作
	 * @param  {jQuery} $querybox 控件所在查询框
	 * @param  {Object} ctrlCfg   控件配置
	 * @return {jQuery}           返回生成的控件
	 */
	var _renderCtrl = function($querybox, ctrlCfg) {
			// TODO:
			//console.dir(ctrlCfg);
			//忽略空对象（写配置时多写逗号会有该现象）
			if(!ctrlCfg || ctrlCfg.length < 1) {
				return;
			}
			// 查询框父Div的ID
			var qbId = $querybox.attr('id');
			// 控件名
			var name = _util.trim(ctrlCfg[_QB_NAME]);
			if(name) {
				var ctrlId = [qbId, '_', name].join('');
				var hide = ctrlCfg[_QB_HIDDEN] || false;

				// 控件父元素，span
				var $ctrlBox = $('<span/>');
				//控件隐藏时仍需要需生成label（其他控件的回调可能会显示该控件），不过需要设置隐藏
				if(hide === true) {
					$ctrlBox.css('display', 'none');
				}
				// 控件标签
				var labelText = _util.trim(ctrlCfg[_QB_LABEL]);
				if(labelText) {
					var $label = $('<label/>').text(labelText).attr('for', ctrlId).appendTo($ctrlBox);
				}

				// 控件类型(默认为input)
				var type = _util.trim(ctrlCfg[_QB_TYPE]) || 'text';
				// 控件生成函数
				var genCtrl = _renderCtrl[type];
				if(typeof genCtrl === 'function') {
					//生成控件
					var $ctrl = genCtrl(ctrlId, name, $ctrlBox, ctrlCfg);


					if($ctrl && $ctrl.length) {
						//取回调配置
						var callback = ctrlCfg[_QB_CALLBACK];
						//绑定回调
						if(callback) {
							_bindCtrlCallBack($ctrl, $querybox, callback);
						}
						$ctrl.addClass(_QB_CTRL_CLS);
						//追加生成的控件父元素（内含控件和label）至查询框
						$ctrlBox.appendTo($querybox);
						return $ctrl;
					}
				} else {
					throw new Error('querybox ctrl type unknown:' + type);
				}
			}
		};
	var _renderQueryButton = function(context, $querybox){
		$('<button>').text('查询').appendTo($querybox).on('click', context,function(event){
			_core.requery(event.data);
		});	
	};
	/**
	 * 执行实际渲染查询框的操作并改变dfd对象状态. </br>
	 * 该函数读取配置下下的query.ctrls结点渲染查询框，
	 * 并设置各个控件的默认值，如果参数 params中有覆盖值则使用该覆盖值作为默认值.</br>
	 * 
	 * 注意：渲染查询框并不读取query.params结点，<br/>
	 * 该结点是查询数据操作时用来控制向后台发送参数的,可以附加，修饰参数等，<br/>
	 * 比如使用页面上某个不在查询框里的控件的值
	 * 
	 * @param  {Deferred} dfd         [description]
	 * @param  {String} $querybox 查询框句柄
	 * @param  {Object} queryCfg   查询框配置对象
	 * @param  {Object} params      查询条件覆盖值
	 * @return {undefined}			无
	 */
	var _deferredRenderQueryBox = function(dfd, context, $querybox, queryCfg, params) {
			try {
				// 取得divHolder对象，方便元素从DOM上分离和附加
				var qbHolder = context.holders.querybox;
				// 分离元素
				qbHolder.detach();
				// TODO:清空查询框
				$querybox.empty();
				// 遍历参数配置，生成查询控件
				if(queryCfg) {
					var ctrls = queryCfg.ctrls;
					var len = ctrls.length;
					for(var i = 0; i < len; i++) {
						var cfg = $.extend({}, ctrls[i]);
						//_log.dir(cfg);
						if(params) {
							var newVal = params[cfg[_QB_NAME]];
							if(newVal) {
								cfg[_QB_VALUE] = newVal;
							}
						}
						_renderCtrl($querybox, cfg);
					}
					_renderQueryButton(context, $querybox);
				}
				//附加元素至DOM
				qbHolder.retach();
				//return $qb;
				// 改变Deferred对象的执行状态
				dfd.resolveWith(context, [$querybox]);
			} catch(e) {
				// 改变Deferred对象的执行状态
				dfd.rejectWith(context, [e]);
			}
		};

	/**
	 * 渲染整个查询框
	 * @param  {String} $querybox 查询框句柄
	 * @param  {Object} queryCfg  配置
	 * @param  {Object} params     覆盖参数
	 * @return {Deferred}            返回Deferred对象
	 */
	var _renderQueryBox = function($querybox, queryCfg, params) {
			var context = this;
			return _util.buildDeferred(_deferredRenderQueryBox, _renderDoneCallbacks, _renderFailCallbacks, context, $querybox, queryCfg, params);
		};

	var _doDeferredQuery = function(dfd, context, $qb, queryCfg, params) {
			_log.dir(arguments);

			var p = _core.params.buildWhenQuery(context, params);
			
			$.ajax({
				url: _dataUrlPrefix + queryCfg.url,
				type:'GET',
				data: p,
				dataType: 'json'
			}).done(function(data) {
				dfd.resolveWith(context, [data]);
			}).fail(function(e) {
				dfd.rejectWith(context, [e]);
			});
		};

	var _query = function($qb, options, params) {
		var context = this;
			return _util.buildDeferred(_doDeferredQuery, _queryDoneCallbacks, _queryFailCallbacks, context, $qb, options, params);
		};

	$.extend(true, _gdda, {
		'core': {
			'querybox': {
				'render': _renderQueryBox,
				'addRenderDoneCallback': _addRenderDoneCallback,
				'addRenderFailCallback': _addRenderFailCallback,
				'clearRenderDoneCallback': _clearRenderDoneCallback,
				'clearRenderFailCallback': _clearRenderFailCallback,
				'query': _query,
				'addQueryDoneCallback': _addQueryDoneCallback,
				'addQueryFailCallback': _addQueryFailCallback,
				'clearQueryDoneCallback': _clearQueryDoneCallback,
				'clearQueryFailCallback': _clearQueryFailCallback,
				'ctrl': _renderCtrl
			}
		}
	});

})(jQuery);