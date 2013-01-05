/*
 * gdda
 * https://github.com/gyk001/gdda
 *
 * Copyright (c) 2012 gyk001
 * Licensed under the GPL license.
 */

(function($) {

  // Collection method.
  $.fn.gdda = function() {
    "strict";
    var options = $.extend(this.defaults, options); 
    return this.each(function(options) {
      $(this).html('gdda');
    });
  };

  // Static method.
  $.gdda = function() {
    "strict";
    return 'gdda';
  };

  //暴露默认配置,允许运行时更改 
  $.fn.gdda.defaults={
    
  };


  $.expr[':'].gdda = function(elem) {
    "strict";
    if($(elem).attr('gdda')){
      return true;
    }
  };

}(jQuery));
