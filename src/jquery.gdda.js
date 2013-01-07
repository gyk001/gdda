/*
 * gdda
 * https://github.com/gyk001/gdda
 *
 * Copyright (c) 2012 gyk001
 * Licensed under the GPL license.
 */
 /*global console:false*/

(function($) {
  "strict";
  //TODO: 暴露默认配置,允许运行时更改 
  var defaults = {
    debug : true
  };

  var db = {
    dir:function(obj,isdebug){
      if(isdebug){
        var c = window.console;
        if(c && c.dir){
          c.dir(obj);
        }
      } 
    },
    log:function(obj,isdebug){
      if(isdebug){
        var c = window.console;
        if(c && c.log){
          c.log(obj);
        }
      } 
    }   
  };



  //TODO: Collection method.
  $.fn.gdda = function(options) {
    //
    var opts = $.extend($.gdda.defaults, options); 
    var isdebug = opts.debug;
    var log = function(obj){
        db.log(obj,isdebug);
    };
    var dir = function(obj){
        db.dir(obj,isdebug);
    };
    dir(opts);
    return this.each(function(opts) {
      $(this).html('gdda');
    });
  };



  //TODO: Static method.
  $.gdda = function() {
    return 'gdda';
  };

  $.gdda.defaults = defaults;

  //TODO:
  $.expr[':'].gdda = function(elem) {
    if($(elem).attr('gdda')){
      return true;
    }
  };

}(jQuery));
