/*global devel:false*/
(function($,undefined) {
	"use strict";
	var _gdda = $.gdda;
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



	$.extend(true, _gdda, {
		'core': {
			'querybox': {
			}
		}
	});

})(jQuery);