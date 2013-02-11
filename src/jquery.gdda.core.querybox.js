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
			
			// 控件类型
			var type = _util.trim(ctrlCfg[_QB_TYPE]);
			if(!type){
				type = 'input';
			}
			var fun = _renderCtrl[type];
			if(typeof fun ==='function'){
				fun(ctrlId,name,$querybox,ctrlCfg);
			}else{
				throw new Error('querybox ctrl type unknown:'+type);
			}
		}
	};
	_renderCtrl.input = function(ctrlId,name,$querybox,ctrlCfg){
		var node = ['<input name="',name,'" id="',ctrlId,'"/>'].join('');
		var $ctrl = $(node).appendTo($querybox);
		var value = 
		$ctrl.val(ctrlCfg[_QB_VALUE]);
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
				'render': _renderQueryBox
			}
		}
	});

})(jQuery);