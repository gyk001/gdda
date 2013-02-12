/*
 * gdda
 * https://github.com/gyk001/gdda
 *
 * Copyright (c) 2012 gyk001
 * Licensed under the GPL license.
 */
 /*global console:false*/

(function($) {
  "use strict";
  //TODO: 暴露默认配置,允许运行时更改 
  var defaults = {
    debug : true,
    suffix : {
      search : '_search',
      tool : '_tool'
    },
    cfgKeys:{
      QB_CTRL_CLS:'qbctrl',
      QB_LABEL:'label',
      QB_NAME:'name',
      QB_VALUE:'value',
      QB_VERIFY:'verify',
      QB_TYPE:'type',
      QB_SELECT_VALUES:'values',
      QB_CALLBACK:'callback'
    }
  };


  //TODO: Collection method.
  $.fn.gdda = function(options) {
    //
    var opts = $.extend($.gdda.defaults, options); 
    /*
    var isdebug = opts.debug;
    var log = function(obj){
        db.log(obj,isdebug);
    };
    var dir = function(obj){
        db.dir(obj,isdebug);
    };

    dir(opts);
    */
    return this.each(function(opts) {
      $(this).html('gdda');
    });
  };

  // TODO: Static method.
  $.gdda = function() {
  };

  $.gdda.defaults = defaults;
  /*
  $.gdda.predefine={

  };
  
  $.gdda.core={
    clear:function(){

    },
    loadconfig:function(){
      
    }
  };

  $.gdda.etc={
  };

  $.gdda.stretch={
  };
  */
/*
  // TODO:
  $.expr[':'].gdda = function(elem) {
    if($(elem).attr('gdda')){
      return true;
    }
  };
*/
}(jQuery));
