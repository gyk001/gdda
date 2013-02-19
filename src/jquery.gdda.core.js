/*
 * gdda
 * https://github.com/gyk001/gdda
 *
 * Copyright (c) 2012 gyk001
 * Licensed under the GPL license.
 */
/*jslint devel:true*/
(function($,undefined) {
  "use strict";


  
  
  var _gdda = $.gdda;
  var _util = _gdda.util;
  var _log = _util.log;
  var _throwError = _util.throwError;
  var _defaults = _gdda.defaults;
  var _core = _gdda.core;
  var _core_option = _gdda.option;
  var _core_querybox = _core.querybox;
  var _core_module = _core.module;

  var _doGdda = function($div,extraOptions){
    var did = $($div).attr('id');
    if(!did){
      _throwError('main div must has attr id!');
    }
    var qid = extraOptions.qid;
    if(!qid){
      _throwError('must has qid!');
    }
    _core_option.load(qid).done(function(){
      var option_loaded = _core_option.get(qid);
      //console.dir(_cfg);
      var mergeOption = $.extend(true, {}, _defaults, option_loaded, extraOptions);
      _doGddaWithOptions(qid,did,mergeOption);
    }).fail(function(){
      alert('err!');
    });
  };

  var _renderModule = function(data,options){
    _log.dir(data);
  };

  var _queryData = function($qb,options){
    //执行查询
    _core_querybox.query($qb,options).done(function(data){
      //查询完成后渲染模块
      _renderModule(data,options);
    }).fail(function(e){
      _throwError('查询数据失败:'+ ((e && e.message) ? e.message :''));
    });
  };

  var _doGddaWithOptions = function(qid,did,options){
    //取查询框ID后缀
    var queryBoxSuffix = options.suffix.query;
    //构造查询框ID
    var qbId = [did,queryBoxSuffix].join('');
    //页面没有查询框容器则在隐藏域生成一个容器
    if( ! _util.findNodeById(qbId)){
      $('<div/>').attr('id',qbId).appendTo(_util.getHideQBParent());
    }
    //渲染查询框
    _core_querybox.render(qbId,options.query).done(function($qb){
      //查询框渲染完成后执行查询
      _queryData($qb,options);
    }).fail(function(){
      _log.log('渲染查询框出错!');
      //alert('渲染查询框出错!');
    });
  };

  //TODO: Collection method.
  $.fn.gdda = function(options) {
    return this.each(function(index,$div) {
      _doGdda($div,options);
    });
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
