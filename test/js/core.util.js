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
  var _util = _gdda.util;
  var _core = _gdda.core;
  var _log = _gdda.util.log;
  
  module('jQuery#gdda#util', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
      this.m = 1;
      this.n = 42;
      this.sum = this.m+this.n;
      this.context_flag = 'xyz';
    }
  });

  asyncTest('origBuildDeferred',function(){
    var that = this;

    var dfd = $.Deferred().done(function(sum){
      var context = this;
      equal(context.flag,that.context_flag,'回调执行，确认上下文环境:'+context.flag);
      equal(sum,that.sum,'回调执行并会传结果:'+sum);
      start();
    });

    var context = {
      flag : that['context_flag']
    };
   
    setTimeout(function(m,n){
      dfd.resolveWith(context,[that.m+that.n]);
    },0);

  });

  asyncTest('buildDeferred',function(){
    var that = this;
    //var doneCallback = function(){} 

    var context = {
      flag : that['context_flag']
    };
    var deferredFun = function(dfd,m,n){
      dfd.resolveWith(context,[m+n]);
    };
    var dfd = _util.buildDeferred(deferredFun,[],[],that.m,that.n);
    dfd.done(function(sum){
      var context = this;
      equal(context.flag,that.context_flag,'回调执行，确认上下文环境:'+context.flag);
      equal(sum,that.sum,'回调执行并会传结果:'+sum);
      start();
    });
  });

}(jQuery));