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
    return this.each(function() {
      $(this).html('gdda');
    });
  };

  // Static method.
  $.gdda = function() {
    "strict";
    return 'gdda';
  };

  $.expr[':'].gdda = function(elem) {
    "strict";
    if($(elem).attr('gdda')){
      return true;
    }
  };

}(jQuery));
