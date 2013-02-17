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
  $.gdda = {
    defaults:{//暴露默认配置,允许运行时更改
    debug : true,
    suffix : {
      query : '_query',
      tool : '_tool'
    },
    prefix:{
      optionUrl:'http://localhost:8000/ajax/options1/',
      dataUrl:'http://localhost:8000/ajax/json/'
    },
    KEYS:{
      QUERYBOX:{
        CTRL_CLS:'qbctrl',
        HIDDEN:'hide',
        LABEL:'label',
        NAME:'name',
        VALUE:'value',
        VERIFY:'verify',
        TYPE:'type',
        SELECT_VALUES:'values',
        CALLBACK:'callback'
      }
    }
  },
    _ajaxs :{}
  };

/*
  // TODO: Static method.
  $.gdda = function(selector,qid_or_options,options_null) {
    //至少有两个参数
    if(arguments.length>1){
      var $dom = $(selector);
      if($dom.length<1){
        return;
      }
      $dom.each(function(){
        var $this = $(this);
        var id = $this.attr('id');
        if(id){
          //qid_or_options为string，则视为qid
          if(typeof qid_or_options ==='string'){
            if(! options_null){
              options_null = {
                did:id
              }
            }else{
              options_null.did = id;
            }
            _gdda_with_qid.call(this,qid_or_options,options_null);
          }else{
            qid_or_options.did = id;
            _gdda_with_options.apply(this,qid_or_options);
          }
          
        }
      });
    }else{
      throw new Error('$.gdda() must has at least 2 params!');
    }
  };
*/
 
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
