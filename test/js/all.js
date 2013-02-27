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
  var _qb = $.gdda.core.querybox;
  var _log = $.gdda.util.log;

  _gdda.defaults.callbacks.progress.push(function(action,obj){
      _log.log('0000000:'+action);
    });

  module('jQuery#gdda', {
    setup: function() {
      this.elem = $('#test1');
      this.qid='all.chart';
    }
  });
  

  asyncTest('jQuery.gdda' , function() {
    var that = this;
    var $mainDiv = this.elem;
    _log.dir($mainDiv);
    var qid=this.qid;
    var context = $mainDiv.gdda({qid:qid});

    context.dfd.done(function(chart){
      ok(!! context,'TODO:回调需要获取上下文');
      equal(context.qid, that.qid, '校验上下文环境和qid');

      start();
    }).fail(function(e){
      ok(false,'渲染失败!'+e.message);
    });
  });

  

}(jQuery));