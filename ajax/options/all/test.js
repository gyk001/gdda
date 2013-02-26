return {
	type: 'grid',
	query: {
		url:'query/url/for/data',
		box: [{
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
			hide: true,
			ignore:true/*查询数据时忽略该查询框的值,比如有查询框联动但只需要下级框的值时使用*/,
			verify: ['num', 'min:1', 'max:12']
		}, {
			name: 'type',
			type: 'select',
			label: '机构类型',
			value: function(){
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
					var $year = $('[name=year]', $querybox);
					$year.val($year.val() + $cur.val()).parent().show();
				}
			}
		}],
		params:{
			from:{
				type:'const',
				val:20
			},
			to:{
				type:'const',
				val:40
			},
			userName:{
				type:'ctrl.val',
				val:'the_page_ctrl_id'
			},
			time:{
				type:'fun',
				val:function(paramsObj,$querybox){
					return 'any value you can return here';
				}
			}
		}
	},
	module:{
		nope:{
			query:{
				params:{
					xtype:{
						type:'const',
						val:'xxx'
					}
				}
			}
		},
		grid:{
			drilldown:{
				rowclick:{},
				cellclick:{},
				rowdbclick:{},
				celldbclick:{}
			}
		}
	}
};