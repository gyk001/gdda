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
  var _log = _gdda.util.log;
  var _core_option = _core.option;

  module('jQuery#gdda#core#option', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
      this.qid = 'querybox.query.query_0100';
      this.expectedOptions = {
        query: [{
          name: 'year',
          label: '统计年份',
          value: 2012,
          hide: false,
          verify: ['num', 'len:4', 'min:1990', 'max:2013'],
          callback: {
            blur: function($querybox, $cur) {
              $cur.val($cur.val() + '...');
            }
          }
        }, {
          name: 'month',
          label: '统计月份',
          value: 3,
          hide: false,
          verify: ['num', 'min:1', 'max:12']
        }, {
          name: 'type',
          type: 'select',
          label: '机构类型',
          value: 'yy',
          values: [
            ['sq', '社区服务中心'],
            ['yy', '区属二级医院'],
            ['wsz', '卫生站']
          ],
          callback: {
            change: function($querybox, $cur) {
              //alert($cur.val());
              var $year = $('[name=year]', $querybox);
              $year.val($year.val() + $cur.val()).parent().show();
            }
          }
        }],
        url: 'zlrc_ks_0100.json'
      };
    }
  });

  asyncTest('option load', function() {
    expect(3);
    var _qunit_this = this;
    equal(_core_option.get(_qunit_this.qid),undefined,'before load option is not exist');
    _log.dir(_core_option.get(_qunit_this.qid));
    //stop();
    //expect(_qunit_this.elems.length);
    _core_option.addLoadDoneCallback(function(opt) {
      notEqual(_core_option.get(_qunit_this.qid),undefined,'after load option is exist');
       _log.dir(_core_option.get(_qunit_this.qid));
      ok(true,'TODO: deepEqual options ignore functions!!');
      //deepEqual(opt, _qunit_this.expectedOptions, 'load option');
    });
    _log.log('3333');
    _core_option.load(_qunit_this.qid).always(start);
  });

  /*
  var did = 'config_01';
  var did2 = 'config_02';
  var _qid = 'bmi.year.grid_0100'; 

  var _qb = $.gdda.core.querybox;

  $.gdda.core.config.addLoadDoneCallback(function(){
    _log.log('callback1');
  });

  $.gdda.core.config.addLoadDoneCallback(function(){
    //alert({xx:'callback2'});
    _log.log('callback2');
  });

  //$('#'+did).gdda(_qid);
  _qb.addQueryDoneCallback(function(){});
  
  $('#'+did).gdda({qid:_qid});
  setTimeout(function(){
    $.gdda.core.querybox.addQueryDoneCallback(function(){/*alert(2);});
    $('#'+did2).gdda({qid:_qid});
  },2000);
  */
}(jQuery));