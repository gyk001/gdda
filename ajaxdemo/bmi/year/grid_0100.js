{
	type:'grid',
	url:'ajaxdemo/json/bmi.year.grid_0100.json',
	query: [{
		name: 'pYear',
		label: '统计年份',
		value: 2012,
		hide: true,
		verify: ['num', 'len:4', 'min:1990', 'max:2013'],
		callback: {
			blur: function($querybox, $cur) {
				$cur.val($cur.val() + '...');
			}
		}
	}, {
		name: 'pType',
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
	params:{
		pYear:{
			type:'page.ctrl',
			value:'_the_ctrl_id_'
		},
		pType:{
			type:'gdda.var',
			value:'_the_var_name_'
		}
	}
};