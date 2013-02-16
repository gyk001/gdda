/* jslint: devel:true */

(function($,undefined){
	"use strict";
	var _gdda = $.gdda;
	//var _util = _gdda.util;
	//var _log = _util.log;
	var _QB_KEYS = _gdda.defaults.KEYS.QUERYBOX;
	//var _QB_HIDDEN = _QB_KEYS.HIDDEN;
	var _QB_VALUE = _QB_KEYS.VALUE;
	//var _QB_LABEL = _QB_KEYS.LABEL;
	//var _QB_TYPE = _QB_KEYS.TYPE;
	//var _QB_NAME = _QB_KEYS.NAME;
	var _QB_SELECT_VALUES = _QB_KEYS.SELECT_VALUES;
	//var _QB_CALLBACK = _QB_KEYS.CALLBACK;
	var _QB_CTRL_CLS = _QB_KEYS.CTRL_CLS;

	var _text = function(ctrlId, name, $ctrlBox, ctrlCfg) {
		var node = ['<input name="', name, '" id="', ctrlId, '"/>'].join('');
		var $ctrl = $(node).appendTo($ctrlBox);
		//var value = 
		return $ctrl.val(ctrlCfg[_QB_VALUE]);

		//['<input name="',name,'" id="',qbId,'_',name,'" />']
		//$('<input/>').attr('name',name).attr('id',[qbId,'_',name,'_',_QB_KEYS.LABEL].join('')).appendTo($querybox);
	};

	var _select = function(ctrlId, name, $ctrlBox, ctrlCfg) {
		var node = ['<select name="', name, '" id="', ctrlId, '"/>'].join('');
		var $ctrl = $(node).appendTo($ctrlBox);
		var val = ctrlCfg[_QB_VALUE];
		//配置的下拉选项
		var opts = ctrlCfg[_QB_SELECT_VALUES];
		if(opts && opts instanceof Array) {
			for(var i = 0, len = opts.length; i < len; i++) {
				var opt = opts[i];
				//忽略空元素
				if(!opt || opt.length < 1) {
					continue;
				}
				//添加选项
				$('<option/>').attr('value', opt[0]).text(opt[1]).attr('selected', (val && val === opt[0])).appendTo($ctrl);
			}
		}
		return $ctrl;
	};

	var _hidden = function (ctrlId, name, $ctrlBox, ctrlCfg){
		var node = ['<input type="hidden" name="', name, '" id="', ctrlId, '"/>'].join('');
		var $ctrl = $(node).appendTo($ctrlBox);
		return $ctrl.val(ctrlCfg[_QB_VALUE]);		
	};

	$.extend(_gdda.core.querybox.ctrl,{
		text: _text,
		select: _select,
		hidden: _hidden
	});

})(jQuery);
