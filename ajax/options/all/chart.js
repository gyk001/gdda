{
  type: 'chart',
  module: {
    nope: {

    },
    grid: {
      colNames: ['年份', '资产合计', '负债合计'],
      colModel: [{
        name: 'YEAR_TIME',
        index: 'YEAR_TIME',
        width: 74
      }, {
        name: 'ZZCH',
        index: 'ZZCH',
        width: 110
      }, {
        name: 'FZ',
        index: 'FZ',
        width: 110
      }]
    },
    chart: {
      type: "line",
      dataLabel: true,
      xAxisSel: 'YEAR_TIME',
      seriesInfos: [
        ['合计', 'HJ'],
        ['门急诊人次', 'MJZRC']
      ],
      DDS: {
        pointClick: {
          qid: 'all.chart_dd_chart',
          params: {
            month:{
              type:'query.val',
              val:'month'
            },
            to: {
              type: 'const',
              val: 40
            },
            userName: {
              type: 'ctrl.val',
              val: 'qp_uname'
            },
            chartX:{
              type:'chart.pointX'
            }
          }
        }
      },
        orig: {
          tooltip: {
            formatter: function() {
              return 'QQQQQQ<b>' + this.series.name + '</b><br/>' + this.x + ': ' + this.y + '°C';
            }
          }
        }
      }
    },

    query: {
      url: 'chart.json',
      ctrls: [{
        name: 'year',
        label: '统计年份',
        value: 2015,
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
        value: 2,
        hide: false,
        ignore: true /*查询数据时忽略该查询框的值,比如有查询框联动但只需要下级框的值时使用*/
        ,
        verify: ['num', 'min:1', 'max:12']
      }, {
        name: 'type',
        type: 'select',
        label: '机构类型',
        value: function() {
          return 'return the value for dynamic';
        },
        values: [
          ['sq', '社区服务中心'],
          ['yy', '区属二级医院'],
          ['wsz', '卫生站']
        ],
        callback: {
          change: function($querybox, $cur) {
            //alert($cur.val());
            //var $year = $('[name=year]', $querybox);
            //$year.val($year.val() + $cur.val()).parent().show();
            $('button.querybtn',$querybox).click();
          }
        }
      }],
      params: {
        from: {
          type: 'const',
          val: 20
        },
        to: {
          type: 'const',
          val: 40
        },
        userName: {
          type: 'ctrl.val',
          val: 'qp_uname'
        },
        time: {
          type: 'fun',
          val: function(context) {
            return context.qid;
          }
        },
      }
    }
  }