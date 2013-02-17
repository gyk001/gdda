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
  var _qb = $.gdda.core.querybox;
  var _log = $.gdda.util.log;
  _log.log('begin');
  var paramsCfg = [{
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
    }];
    var params = {
      year: 12,
      type: 'wsz'
    };

  module('jQuery#gdda#core#querybox#render', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });
  

  asyncTest('render querybox without extra params',  function() {
    expect(paramsCfg.length * 2);

    _qb.addRenderDoneCallback(function($qb) {
      $.each(paramsCfg, function(i, param) {
        var _val = param.value;
        equal($(['#', $qb.attr('id'), '_', param.name].join('')).val(), _val, ['查询框:', qbDivId, '>控件:', param.name,'值:', _val].join(''));
      });
    });

    _qb.addRenderFailCallback(function(e) {
      ok(false, '渲染查询框出错:' + e.message);
    });

    var _startTest = function() {
      //alert(123);
      start();
    };

    var qbDivIds = ['test_qb_b', 'test_qb_t'];
    for(var i = 0, len = qbDivIds.length; i < len; i++) {
      var qbDivId = qbDivIds[i];
      _qb.render(qbDivId, paramsCfg).always(_startTest);
    }
  });


  asyncTest('render querybox with extra params',  function() {
    expect(paramsCfg.length * 2);
    _qb.clearRenderDoneCallback();
    _qb.addRenderDoneCallback(function($qb) {
      $.each(paramsCfg, function(i, param) {
        var _val = params[param.name] || param.value;
        equal($(['#', $qb.attr('id'), '_', param.name].join('')).val(), _val, ['查询框:', qbDivId, '>控件:', param.name,'值:', _val].join(''));
      });
    });

    _qb.addRenderFailCallback(function(e) {
      ok(false, '渲染查询框出错:' + e.message);
    });

    var _startTest = function() {
      start();
    };

    var qbDivIds = ['test_qb_b_e', 'test_qb_t_e'];
    for(var i = 0, len = qbDivIds.length; i < len; i++) {
      var qbDivId = qbDivIds[i];
      _qb.render(qbDivId, paramsCfg, params).always(_startTest);
    }
  });


  /*
  test('is gdda', 1, function() {
   // debugger;
    strictEqual(this.elems.gdda({debug:false}).text(), 'gddagddagdda', 'should be thoroughly gdda');
  });

  module('jQuery.gdda');

  test('is gdda', 1, function() {
    strictEqual($.gdda(), 'gdda', 'should be thoroughly gdda');
  });

  module(':gdda selector', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is gdda', 1, function() {
    // Use deepEqual & .get() when comparing jQuery objects.
    deepEqual($('span:gdda').text(),'awesome test markup', 'knows gdda when it sees it');
  });

 module('jQuery#gdda#core', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });
  test('gdda extends', 1, function() {
    expect(4);
    ok( !! $.gdda.core,'gdda.core is exist!' );
    ok( ! $.gdda.core.test,'before extend gdda.core.test is not exist!' );
    $.extend($.gdda.core,{'test':function(){return 'gdda.core.test!';}});
    ok( !! $.gdda.core.test,'before extend gdda.core.test is exist!' );
    equal($.gdda.core.test(),'gdda.core.test!','gdda.core.test result is OK!');
  });
*/
}(jQuery));