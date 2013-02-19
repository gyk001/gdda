/*jslint*/
(function($,undefined) {
	"use strict";
	var _gdda = $.gdda;
	var _util = _gdda.util;
	var _log = _util.log;
	var _throwError = _util.throwError;
	var _default = _gdda.defaults;
	var _prefix = _default.prefix;
	var _dataUrlPrefix = _prefix.dataUrl;

	var _prepareDataDoneCallbacks = [];
	var _prepareDataFailCallbacks = [];

	var _prepareModuleConfigDoneCallbacks = [];
	var _prepareModuleConfigFailCallbacks = [];


	var _renderModuleDoneCallbacks = [];
	var _renderModuleFailCallbacks = [];

	var _prepare_module = function( options ){
		var moduleType = options.type || 'nope';
		var moduleImpl = _gdda.getModule(moduleType);
		if(!moduleImpl){
			_throwError('unknown module type:'+moduleType);
		}
		return moduleImpl;
	};

	var _prepare_data = function(moduleImpl, data, options ){
		return _util.buildDeferred(moduleImpl.prepareData, _prepareDataDoneCallbacks,
			_prepareDataFailCallbacks,data,options);
	};

	var _make_module_config = function(moduleImpl, data,options) {
		return _util.buildDeferred(moduleImpl.buildOptions, _prepareModuleConfigDoneCallbacks,
			_prepareModuleConfigFailCallbacks, data, options);
		};

	var _render_module = function(moduleImpl,data,options) {
		return _util.buildDeferred(moduleImpl.render, _renderModuleDoneCallbacks,
			_renderModuleFailCallbacks, data, options);
		};

	$.extend(true, _gdda, {
		core: {
			module: {
				prepare: _prepare_module,
				prepareData: _prepare_data,
				buildModuleOptions: _make_module_config,
				render: _render_module
			}
		}
	});

})(jQuery);