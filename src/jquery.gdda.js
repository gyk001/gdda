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
    KEYS:{
      QUERYBOX:{
        CTRL_CLS:'qbctrl',
        LABEL:'label',
        NAME:'name',
        VALUE:'value',
        VERIFY:'verify',
        TYPE:'type',
        SELECT_VALUES:'values',
        CALLBACK:'callback'
      }
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
