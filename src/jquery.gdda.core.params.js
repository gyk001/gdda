/*global devel:false*/
(function($, undefined) {
	"use strict";
	var _gdda = $.gdda;
	var _core = _gdda.core;
	var _util = _gdda.util;
	var _throwError = _util.throwError;
	var _log = _util.log;

	$.extend(true,_core,{
		params:{
			types:{}
		}
	});

	var _core_params = _core.params;
	var _core_params_types = _core_params.types;

	/**
	 * 将查询框内的控件组装成参数对象，设置ignore=true的控件将被忽略
	 * @param {Object} context 上下文
	 * @param  {jQuery} $querybox 查询框句柄
	 * @param  {Object} queryCfg 查询选项，queryCfg.ctrls为查询框内的控件
	 * @return {Object}           组装好的参数对象,形如{year:2012,orgType:'yy'}
	 */
	var _calcQueryboxCtrlValue = function(context, $querybox, queryCfg){
		var boxParams = {};
		//遍历查询框控件并取值存入boxParams
		$.each(queryCfg.ctrls,function(ctrlIndex,ctrl){
			//配置项为空(多写逗号)或者配置中明确指定忽略该控件
			if(!ctrl || ctrl.ignore ){
				_log.log(!!ctrl?ctrl.name:'?');
				//继续循环
				return true;
			}
			var ctrlName = ctrl.name;
			if(!ctrlName){
				_throwError(context.qid+' querybox ctrl['+ctrlIndex+'] has no name!');
			}
			boxParams[ctrlName]= $('[name='+ctrlName+']',$querybox).val();
			_log.log(ctrl.name+'->'+ctrl.type);
		});
		_log.dir(boxParams);
		return boxParams;
	};

	var _calcOptionParamsValue = function(context, queryParamsCfg){
		var params = {};
		//查询框句柄
		var $qb = context.holders.querybox.getDiv;
		//遍历附加参数选项，并计算值
		$.each(queryParamsCfg,function(qpcName,qpc){
			//_log.log(qpcName+'->'+qpc.type);
			if(!qpcName || ! qpc  ){
				return true;
			}
			var type = qpc.type;
			var typeFunc = _core_params_types[type];
			if(_util.objectType(typeFunc)==='function'){
				params[qpcName]= typeFunc(context, qpc, $qb);
			}else{
				_throwError('未知的params类型:'+type);
			}
		});
		return params;
	};

	var _buildParamsWhenQuery = function(context, params){
		var boxParams = {};
		//查询框句柄
		var $qb = context.holders.querybox.getDiv;
		//查询选项
		var queryCfg = context.options.query;
		//查询框内部控件选项
		if(queryCfg && queryCfg.ctrls){
			boxParams = _calcQueryboxCtrlValue(context, $qb, queryCfg);
		}
		//生成配置项里的参数对象
		var optionParams = _calcOptionParamsValue(context,queryCfg.params);
		return $.extend(boxParams, optionParams, params);
	};

	var _buildParamsWhenDrilldown = function(context, ddCfg, event){
		//生成配置项里的参数对象
		var optionParams = _calcOptionParamsValue(context,ddCfg.params);
		return optionParams;
	};



	var _paramsTypeConst = function(context, queryParamItemCfg){
		return queryParamItemCfg.val;
	};


	var _paramsTypeQueryVal = function(context, queryParamItemCfg, $querybox){
		return $('[name='+queryParamItemCfg.val+']',$querybox).val();
	};

	var _paramsTypeCtrlVal = function(context, queryParamItemCfg){
		var ctrlId =  queryParamItemCfg.val;
		if( ctrlId ){
			var $ctrl = $('#'+ctrlId);
			if($ctrl.length>0){
				return $ctrl.val();
			}
		}
		_throwError('query params配置type为['+queryParamItemCfg.type+']时，val必须为页面上的控件ID');
	};

	var _paramsTypeFun = function(context, queryParamItemCfg){
		var fun = queryParamItemCfg.val;
		if(_util.objectType(fun)==='function'){
			return fun(context);
		}
		_throwError('query params配置type为['+queryParamItemCfg.type+']时，val必须为函数');
	};

	$.extend(true,_core_params,{
		buildWhenQuery: _buildParamsWhenQuery,
		buildWhenDrilldown:_buildParamsWhenDrilldown,
		types:{
			'const': _paramsTypeConst,
			'query.val': _paramsTypeQueryVal,
			'ctrl.val': _paramsTypeCtrlVal,
			'fun': _paramsTypeFun
		}	
	});


})(jQuery);