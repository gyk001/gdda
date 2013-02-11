/*global console:false,alert:false*/
(function($){
	"use strict";
	var _gdda = $.gdda;
	_gdda.log = {
		log:function(arg){
			if(window._GDDA_DEBUG){
				console.log(arg);					
			}
		},
		dir:function(arg){
			if(window._GDDA_DEBUG){
				console.dir(arg);					
			}	
		}
	};



/*
		// TODO:
		//_log = window.console;
	var funs = ['dir','debug','log'];
	for (var i = funs.length - 1; i >= 0; i--) {
		console.log('---'+i);
		var fun = funs[i];
		console.log(fun);
		_gdda.log[fun] = function(){
			if(window._GDDA_DEBUG){
				console[fun].apply(console,arguments);					
			}
		};
	};
*/
})(jQuery);