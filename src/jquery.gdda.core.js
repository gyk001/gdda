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
  var _divHolder = _util.divHolder;
  var _throwError = _util.throwError;
  var _defaults = _gdda.defaults;
  var _callbacks = _defaults.callbacks;
  var _core = _gdda.core;
  var _core_option = _core.option;
  var _core_querybox = _core.querybox;
  var _core_module = _core.module;



  var _doGddaWithOptions = function(context,options,params){
    context.options = options;
    //取查询框ID后缀
    var queryBoxSuffix = options.suffix.query;
    var divHolder = context.holders;
    var mainDivHolder = divHolder.main;
    //构造查询框ID
    var qbId = [mainDivHolder.getId(),queryBoxSuffix].join('');
    var $qbDiv;// = undefined;
    //页面没有查询框容器则在隐藏域生成一个容器
    if( ! _util.findNodeById(qbId)){
      $qbDiv = $('<div/>').attr('id',qbId).appendTo(_util.getHideQBParent());
    }else{
      $qbDiv = $('#'+qbId);
    }
    divHolder.querybox = _divHolder($qbDiv);
    var queryCfg = options.query;
    //渲染查询框
    _core_querybox.render.call(context, $qbDiv, queryCfg, params).done(function($qb){
      //查询框渲染完成后执行查询
      _queryData(context,$qb, queryCfg,params);
    }).fail(function(){
      _log.log('渲染查询框出错!');
      //alert('渲染查询框出错!');
    });
  };


  var _doGdda = function(htmlDiv,option,params){
    //todo: 可以先不生成jquery对象
    var $div = $(htmlDiv);
    //主数据区域
    if(!$div.attr('id')){
      _throwError('main div must has attr:id!');
    }
    
    //true表示不是从配置文件加载的配置，而是就地生成的配置项
    var spotOption =  !option.qid;
    //没有查询id则生成一个随机ID,而且不需要加载配置文件
    var qid = spotOption ?  'R'+Math.random() :option.qid ;
    //构造上下文环境
    var context = {
      spotOption: spotOption,
      qid: qid,
      holders :{
        main:_divHolder($div)
      },
      //TODO:实例
      dfd:$.Deferred().progress(_callbacks.progress)
    };
    if(spotOption){
      _doGddaWithOptions(context,$.extend(true, {}, _defaults ,option),params);
    }else{
      //加载配置文件
      var dfd_load = _core_option.load(qid,context);
      dfd_load.done(function(origOption){
        _doGddaWithOptions(context,$.extend(true, {}, _defaults , origOption, option),params);
      });
      dfd_load.fail(function(e){
        _log.dir(e.message);
        this.dfd.reject(e);
      });
    }
    return context;
  };



  var _renderModule = function(context, data){
    _core_module.render(context, data);
    //context.dfd.resolve(context);
    _log.dir(context);
    _log.dir(data);
  };

  var _queryData = function(context, $qb, queryCfg, params){
    //执行查询
    _core_querybox.query.call(context, $qb, queryCfg, params).done(function(data){
      //查询完成后渲染模块
      _renderModule(context, data);
    }).fail(function(e){
      _throwError('查询数据失败:'+ ((e && e.message) ? e.message :''));
    });
  };

  //TODO: Collection method.
  $.fn.gdda = function(options,params) {
    var deferreds = [];
    if(this.length===1){
      return _doGdda(this[0],options,params);
    }else{
      _throwError('only can process one div');
    }
    //debugger;
    /*
    this.each(function(index,htmlDiv) {
      deferreds.push(_doGdda(htmlDiv,options));
    });
    return $.when(deferreds);
    */
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
