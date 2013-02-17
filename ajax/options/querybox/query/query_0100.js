{
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
}