/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */
  window._GDDA_DEBUG = true;
  var _gdda = $.gdda;
  var _core = _gdda.core;
  var _log = $.gdda.util.log;
  var _core_module = _core.module;


  module('jQuery#gdda#core#module', {
    setup: function() {
      this.moduleType = 'nope';
      this.demoData = {
        "success": true,
        "items": [{
          "TYPE_NAME": "内科",
          "TYPE_CODE": "NK",
          "COUNT": 10847
        }, {
          "TYPE_NAME": "外科",
          "TYPE_CODE": "WK",
          "COUNT": 2333
        }, {
          "TYPE_NAME": "产科",
          "TYPE_CODE": "CK",
          "COUNT": 2007
        }, {
          "TYPE_NAME": "中医",
          "TYPE_CODE": "ZY",
          "COUNT": 660
        }, {
          "TYPE_NAME": "其他科",
          "TYPE_CODE": "QTK",
          "COUNT": 3794
        }]
      };
      this.demoOption = {
        did:'nope'
      };
    }
  });

  asyncTest('jQuery#gdda#core#module',6, function() {
    var _test = this;
    var moduleType = this.moduleType;
    var demoData = this.demoData;
    var demoOption = this.demoOption;

    _log.log('test mdoule:' + moduleType);
    //断言：$.gdda.core.module 已加载
    ok( !! _core_module, '$.gdda.core.module exist');

    var moduleImpl = _core_module.prepare(moduleType);
    //断言： 调用的模块已经加载
    ok( !! moduleImpl, moduleType + ' exist');
    //开始准备数据
    _core_module.prepareData(moduleImpl, demoData).done(function(data){
      //断言： 准备数据
      deepEqual(data,demoData,'nope module prepareData');
      //开始构建模块配置
      _core_module.buildModuleOptions(moduleImpl, data, demoOption).done(function(options){
        //断言： 生成配置
        deepEqual(options,demoOption,'nope module buildModuleOptions');
        //开始渲染
        _core_module.render(moduleImpl, data, options).done(function($obj){
            ok($obj && $obj.text ,'渲染回调参数存在');
            deepEqual( JSON.parse($obj.text()), data, '渲染结果正确');
        }).fail(function(e){
          ok(false,'render fail:'+e.message);
        }).always(function(){
          _log.log('adsfdsfdfffadda');
          QUnit.start();
        });
      }).fail(function(e){
        ok(false, 'buildModuleOptions fail:'+e.message);
      });
    }).fail(function(e){
      ok(false, 'prepareData fail'+e.message);
    });


  });



}(jQuery));