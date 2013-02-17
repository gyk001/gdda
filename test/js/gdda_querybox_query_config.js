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

  var _options = {
    params: params,
    querybox: paramsCfg,
    url: '/ajaxdemo/json/zlrc_ks_0100.json'
  };

  module('jQuery#gdda#core#querybox#query', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
      this.expectItems = [{
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
      }];
    }
  });

  asyncTest('query with extra params', function() {
    //module setup方法中的this对象句柄
    var _mod = this;
    // 运行测试数断言(参数个数+2个返回数据测试)
    expect(paramsCfg.length + 2);
    // 清空回调
    _qb.clearRenderDoneCallback();
    
    _qb.addRenderDoneCallback(function($qb) {
      _log.dir(paramsCfg);
      //校验查询框
      $.each(paramsCfg, function(i, param) {
        var _val = params[param.name] || param.value;
        equal($(['#', $qb.attr('id'), '_', param.name].join('')).val(), _val, ['查询框:', qbDivId, '>控件:', param.name, '值:', _val].join(''));
        _log.log(_val);
        //start();
      });
    });

    _qb.addQueryDoneCallback(function(data) {
      _log.dir(data);
      //校验返回数据
      ok(data && data.success === true, 'data.success === true');
      deepEqual(data.items, _mod.expectItems, 'data.items is expected');
      //_log.dir(data)
    });

    //开启测试流程：渲染查询框->执行查询->开启Qunit测试
    _qb.addRenderDoneCallback(function($qb) {
      _qb.query($qb, _options).always(start);
    });

    //渲染查询框失败，终止测试
    _qb.addRenderFailCallback(function(e) {
      ok(false, '渲染查询框出错:' + e.message);
    });

    _qb.addQueryFailCallback(function(e){
      var msg = '执行查询失败：'+e.message;
      ok(false, msg);
      //console.trace();
      //_log.log(msg);
    });

    var qbDivIds = ['test_qb_b_x_query'];
    for(var i = 0, len = qbDivIds.length; i < len; i++) {
      var qbDivId = qbDivIds[i];
      _qb.render(qbDivId, paramsCfg, params);
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