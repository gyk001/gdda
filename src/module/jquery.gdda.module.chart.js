/*global Highcharts,JSONSelect*/
(function($, undefined) {
	"use strict";
	var _gdda = $.gdda;
	var _util = _gdda.util;
	var _throwError = _util.throrError;
	var _log = _util.log;
	var _module = _gdda.module;
	//highchart默认配置
	var _highchartsDefaults = {
		"credits": { // 不显示highchart标记
			"enabled": false
		},
		"exporting": {
			"url": "the/url/for/highchart/export/action"
		},
		"title": {
			"text": null
		},
		"xAxis": {
			"title": {
				"text": null
			}
		},
		"yAxis": {
			"title": {
				"text": null
			}
		},
		"navigation": {
			buttonOptions: {
				enabled: false
			}
		}
	};

	var _prepareData = function(dfd, data, chartModuleConfig, context) {
			_log.dir(data);
			//------------------------ Begin 解析数据 ----------------------------
			var xAxisSel = chartModuleConfig.xAxisSel;
			var seriesInfo = chartModuleConfig.seriesInfos;
			var chartXAxis = {
				categories: JSONSelect.match(('.items .' + xAxisSel), data)
			};
			//列名(全部)
			var colNames = JSONSelect.match('string:nth-child(2)', seriesInfo);
			//列名称(全部)
			var colTitles = JSONSelect.match('string:nth-child(1)', seriesInfo);
			var chartSeries = [];

			//饼图
			if(chartModuleConfig.type === 'pie') {

			} else { //其他图
				//遍历列名,每次迭代生成一列数据配置
				$.each(colNames, function(colIndex, colName) {
					//一列数据
					var colValues = [];
					//遍历数据行,每次迭代向列数据中压入一个数据项
					$.each(data.items, function(rowIndex, rowData) {
						//一个单元格数据
						var cellVal = rowData[colName];
						//将一行数据该列的数据压到colValues里		
						if(!cellVal) {
							//无数据需压入null,压入undefined会出错
							colValues.push(null);
						} else {
							colValues.push(cellVal);
						}
					});
					//生成列配置
					chartSeries.push({
						name: colTitles[colIndex],
						data: colValues
					});
				});
			}
			//------------------------ END 解析数据 ----------------------------
			return {
				xAxis: chartXAxis,
				series: chartSeries
			};

			//dfd.resolve(data);
		};
	/*
		function(clickEvent) {
							// TODO: 链接显隐
							// 判断配置点击的事件类型
							var pointClick = finalSysChartConfig['pointClick'];
							if (typeof pointClick !== 'undefined') {// 有点击事件配置
								pointClickFunc(clickEvent, pointClick);
							} else {// 没有点击事件配置，do nothing
								// console.debug('no pointClick config');
							}		
						}

	"plotOptions" : {
			"series" : {
				"point" : {
					"events" : {
						"click" : function(clickEvent) {
							// TODO: 链接显隐
							// 判断配置点击的事件类型
							var pointClick = finalSysChartConfig['pointClick'];
							if (typeof pointClick !== 'undefined') {// 有点击事件配置
								pointClickFunc(clickEvent, pointClick);
							} else {// 没有点击事件配置，do nothing
								// console.debug('no pointClick config');
							}		
						}
					}
				}
			}
		}
*/
	var _pointClickFunc = function(context, ddCfg, clickEvent) {
			//var ce = jQuery.extend(true,{},clickEvent);
			//点击的chart
			//var clickChart = ce.currentTarget.series.chart;
			//取参数
			var ddParams = {
				abcdefg: 123456
			};
			var $mainDiv = context.holders.main.getDiv();
			var lastChart = context.chart;
			if(lastChart && lastChart.destory) {
				lastChart.destory();
			}
			$mainDiv.gdda({
				qid: ddCfg.qid
			}, ddParams);

		};
	var _drilldownCallbacks = {
		pointClick: function(context, ddCfg) {
			var pointclick = {
				plotOptions: {
					series: {
						point: {
							events: {
								click: function(event) {
									_pointClickFunc(context, ddCfg, event);
									_log.log('--------');
								}
							}
						},
						cursor: 'pointer'
					}
				}
			};
			//['plotOptions']['series']['cursor']='pointer';
			return pointclick;
		}
	};

	var _buildOptions = function(dfd, data, chartModuleConfig, mainHolder, context) {
			context.dfd.notifyWith(context, ['option.start', data]);
			_log.dir(data);
			//配置中的数据部分
			var cfg = _prepareData(dfd, data, chartModuleConfig, context);
			//图表类型和渲染目标
			var typeDestcfg = {
				chart: {
					type: chartModuleConfig.type,
					renderTo: mainHolder.getDiv()[0]
				}
			};
			//合并默认配置和用户自定义配置
			$.extend(true, cfg, typeDestcfg, _module.chart.defaluts, chartModuleConfig.orig);
			//取钻取配置
			var drilldown = chartModuleConfig.drilldown;
			//遍历钻取配置生成并合并入HighCharts配置
			$.each(drilldown, function(ddType, ddCfg) {
				var drilldownCallback = _drilldownCallbacks[ddType];
				if(!drilldownCallback) {
					_throwError('未知钻取类型:' + ddType);
				}
				var ddd = drilldownCallback(context, ddCfg);
				$.extend(true, cfg, ddd);
			});
			context.dfd.notifyWith(context, ['option.ok', cfg]);
			return cfg;
		};

	var _render = function(dfd, context, data) {
			var options = context.options;
			var chartModuleConfig = options.module['chart'];
			context.dfd.notifyWith(context, ['render.start', data]);
			//从dom分离主数据区
			var holders = context.holders;
			var mainHolder = holders.main;
			mainHolder.detach();
			//整理数据
			//var chartData = _prepareData(dfd,data,chartModuleConfig,context);
			//生成配置
			var chartOption = _buildOptions(dfd, data, chartModuleConfig, mainHolder, context);
			_log.dir(chartOption);
			//渲染图表
			var chart = new Highcharts.Chart(chartOption);
			context.chart = chart;
			//重新附加至dom
			mainHolder.retach();
			//发送完成消息
			context.dfd.resolveWith(context, [chart]);
		};

	$.extend(true, _gdda, {
		module: {
			chart: {
				defaluts: _highchartsDefaults,
				//	prepareData: _prepareData,
				//	buildOptions: _buildOptions,
				render: _render
			}
		}
	});
})(jQuery);