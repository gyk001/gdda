/*global console:false,alert:false,_log4javascript:false*/
(function($) {
	"use strict";
	var _gdda = $.gdda;
	var _util = _gdda.util;
	var _log = _gdda.log;
	var _KEYS = _gdda.defaults.cfgKeys;
	var _QB_VALUE = _KEYS.QB_VALUE;
	var _QB_LABEL = _KEYS.QB_LABEL;
	var _QB_TYPE = _KEYS.QB_TYPE;
	var _QB_NAME = _KEYS.QB_NAME;
	var _QB_SELECT_VALUES = _KEYS.QB_SELECT_VALUES;
	var _QB_CALLBACK = _KEYS.QB_CALLBACK;
	var _QB_CTRL_CLS = _KEYS.QB_CTRL_CLS;

/**
 * 为查询控件绑定回调
 * @param  {[type]}   $ctrl     控件
 * @param  {[type]}   $querybox 控件所在的查询框
 * @param  {Function} callback  回调对象,形如:
 *    {
 *      change:function($querybox,$ctrl) {
 *        var $year = $('[name=year]',$querybox);
 *        $year.val($year.val()+$ctrl.val());
 *      }
 *    }
 * @return {[type]}             [description]
 */
	var _bindCtrlCallBack = function($ctrl,$querybox,callbacks){
		var _caller = function (event){
			var cb = event.data.cb;
			cb($querybox,$ctrl,event);
		};
		for (var eType in callbacks) {
			var callback = callbacks[eType];
			if(typeof callback === 'function'){
				$querybox.on(eType+'.gdda','#'+$ctrl.attr('id'),{cb:callback},_caller);
			}
		}
		return $ctrl;
	};

/**
 * 生成一个查询控件，包括解析控件配置，生成dom元素，绑定回调事件等操作
 * @param  {[type]} $querybox 控件所在查询框
 * @param  {[type]} ctrlCfg   控件配置
 * @return {[type]}           返回生成的控件
 */
	var _renderCtrl = function($querybox,ctrlCfg){
		// TODO:
		//console.dir(ctrlCfg);
		//忽略空对象（写配置时多写逗号会有该现象）
		if(! ctrlCfg || ctrlCfg.length<1){
			return;
		}
		// 查询框父Div的ID
		var qbId = $querybox.attr('id');
		// 控件名
		var name = _util.trim(ctrlCfg[_QB_NAME]);
		if( name ){
			var ctrlId = [qbId,'_',name].join('');
			// 控件标签
			var label = _util.trim(ctrlCfg[_QB_LABEL]);
			if( label ){
				$('<label/>').text(label).attr('for',ctrlId)/*.attr('id',[ctrlId,'_',_KEYS.QB_LABEL].join(''))*/.appendTo($querybox);
			}
			
			// 控件类型(默认为input)
			var type = _util.trim(ctrlCfg[_QB_TYPE]) || 'input';
			// 控件生成函数
			var genCtrl = _renderCtrl[type];
			if(typeof genCtrl ==='function'){
				//生成控件
				var $ctrl = genCtrl(ctrlId,name,$querybox,ctrlCfg);
				if($ctrl && $ctrl.length){
					//取回调配置
					var callback = ctrlCfg[_QB_CALLBACK];
					//绑定回调
					if(callback){
						_bindCtrlCallBack($ctrl,$querybox,callback);
					}
					return $ctrl.addClass(_QB_CTRL_CLS);
				}
			}else{
				throw new Error('querybox ctrl type unknown:'+type);
			}
		}
	};
	_renderCtrl.input = function(ctrlId,name,$querybox,ctrlCfg){
		var node = ['<input name="',name,'" id="',ctrlId,'"/>'].join('');
		var $ctrl = $(node).appendTo($querybox);
		//var value = 
		return $ctrl.val(ctrlCfg[_QB_VALUE]);

		//['<input name="',name,'" id="',qbId,'_',name,'" />']
		//$('<input/>').attr('name',name).attr('id',[qbId,'_',name,'_',_KEYS.QB_LABEL].join('')).appendTo($querybox);
	};
	_renderCtrl.select = function(ctrlId,name,$querybox,ctrlCfg){
		var node = ['<select name="',name,'" id="',ctrlId,'"/>'].join('');
		var $ctrl = $(node).appendTo($querybox);
		var val = ctrlCfg[_QB_VALUE];
		//配置的下拉选项
		var opts = ctrlCfg[_QB_SELECT_VALUES];
		if(opts && opts instanceof Array){
			for (var i = 0,len= opts.length; i<len; i++) {
				var opt = opts[i];
				//忽略空元素
				if(!opt || opt.length<1){
					continue;
				}
				//添加选项
				$('<option/>').attr('value',opt[0]).text(opt[1]).attr('selected',(val && val === opt[0])).appendTo($ctrl);
			}
		}
		return $ctrl;
	};


	var _findDivById = function(id){
		if(typeof id === 'undefined'){
			return;
		}else{
			return document.getElementById(id);
		}
	};

	var _renderQueryBox = function(querboxDiv, paramsCfg , params) {
		
		var qb = _findDivById(querboxDiv);
		if(!qb) {
			_log.log('div not exist!');
			return;
		}
		// 取得查询框对象
		var $qb = $(qb);
		// 取得divHolder对象，方便元素从DOM上分离和附加
		var qbHolder =  _util.divHolder($qb);
		// 分离元素
		qbHolder.detach();
		// 清空查询框
		$qb.empty();
		// 遍历参数配置，生成查询控件
		if(paramsCfg){
			var len = paramsCfg.length;
			for (var i = 0; i < len; i++) {
				var cfg = $.extend({},paramsCfg[i]);
				//_log.dir(cfg);
				if(params ){
					var newVal = params[cfg[_QB_NAME]];
					if(newVal){
						cfg[_QB_VALUE] = newVal;
					}
				}
				_renderCtrl($qb,cfg);
			}
		} 
		//附加元素至DOM
		qbHolder.retach();
	};

	$.extend(_gdda,{
		'core':{
			'querybox':{
				'render': _renderQueryBox,
				'ctrl':_renderCtrl
			}
		}
	});

})(jQuery);