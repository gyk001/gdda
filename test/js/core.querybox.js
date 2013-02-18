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

  module('jQuery#gdda#core#querybox#render', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });
  

  asyncTest('render querybox without extra params',  function() {
    expect(paramsCfg.length * 2);
    //暂停测试
    stop();

    //渲染成功后运行测试断言
    _qb.addRenderDoneCallback(function($qb) {
      $.each(paramsCfg, function(i, param) {
        var _val = param.value;
        equal($(['#', $qb.attr('id'), '_', param.name].join('')).val(), _val, ['查询框:', $qb.attr('id'), '>控件:', param.name,'值:', _val].join(''));
      });
    });
    //渲染失败直接断言失败
    _qb.addRenderFailCallback(function(e) {
      ok(false, '渲染查询框出错:' + e.message);
    });

    var qbDivIds = ['test_qb_b', 'test_qb_t'];
    
    var deferreds = [];
    for(var i = 0, len = qbDivIds.length; i < len; i++) {
      // 将所有的延迟对象压入数组
      deferreds.push( _qb.render(qbDivIds[i], paramsCfg));//.always(_startTest);
    }
    //当所有延迟操作都完成后启动测试
    $.when.apply($,deferreds).always(start);
  });

  
  asyncTest('render querybox with extra params',  function() {
    expect(paramsCfg.length * 2);
    stop();
    //清空所有回调
    _qb.clearRenderDoneCallback();
    //渲染成功后运行测试断言
    _qb.addRenderDoneCallback(function($qb) {
      $.each(paramsCfg, function(i, param) {
        var _val = params[param.name] || param.value;
        equal($(['#', $qb.attr('id'), '_', param.name].join('')).val(), _val, ['查询框:', $qb.attr('id'), '>控件:', param.name,'值:', _val].join(''));
      });
    });
    //渲染失败直接断言失败
    _qb.addRenderFailCallback(function(e) {
      ok(false, '渲染查询框出错:' + e.message);
    });

    var deferreds = [];
    var qbDivIds = ['test_qb_b_e', 'test_qb_t_e'];
    for(var i = 0, len = qbDivIds.length; i < len; i++) {
      // 将所有的延迟对象压入数组
       deferreds.push(_qb.render(qbDivIds[i], paramsCfg, params));
    }
    //当所有延迟操作都完成后启动测试
    $.when.apply($,deferreds).always(start);   
  });

}(jQuery));