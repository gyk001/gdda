/*global Highcharts,JSONSelect*/
(function($, undefined) {
	"use strict";
	var _gdda = $.gdda;
	var _core = _gdda.core;
	var _core_params = _core.params;
	var _util = _gdda.util;
	var _throwError = _util.throrError;
	var _log = _util.log;
	var _module = _gdda.module;
	//确保存在chart模块及子钻取模块
	$.extend(true, _module, {
		chart: {
			DDS:{
			}
		}
	});
	var _moduleChart = _module.chart;
	var _moduleChartDDS = _moduleChart.DDS;

	var _doPointClickFunc = function(context, ddCfg, clickEvent) {
			//var ce = jQuery.extend(true,{},clickEvent);
			//点击的chart
			//var clickChart = ce.currentTarget.series.chart;
			//取参数
			var ddParams =/* {
				abcdefg: 123456,
				year:3012
			};
			*/
			_core_params.buildWhenDrilldown(context,ddCfg,clickEvent);
			_log.log('^^^^^');
			_log.dir(ddParams);


			var $mainDiv = context.holders.main.getDiv();
			var lastChart = context.chart;
			if(lastChart && lastChart.destory) {
				lastChart.destory();
			}
			$mainDiv.gdda({
				qid: ddCfg.qid
			}, ddParams);

		};
	//指标点点击钻取
	var _ddPointClick = function(context, ddCfg) {
			return {
				plotOptions: {
					series: {
						point: {
							events: {
								click: function(event) {
									_doPointClickFunc(context, ddCfg, event);
									_log.log('--------');
								}
							}
						},
						cursor: 'pointer'
					}
				}
			};
		};

	

	$.extend(true, _moduleChartDDS, {
		pointClick: _ddPointClick
	});
})(jQuery);