/**
 * 确保queryId对应的图表配置已经加载，如果没有则立即加载
 * @param queryId [必须]图图表查询Id
 * @param successFunc [必须]图加载成功（或已经存在）的回调函数
 * @param errorFunc [必须]图加载失败的回调函数
 * @param loadingDiv 显示加载状态信息的div
 */
function chartConfigExist(queryId,successFunc,errorFunc,loadingDiv){
	//begin
	dfb();
	if( typeof hsasCharts['chartscfg'][queryId] ==='undefined' ){
		  var loading = undefined;
		  if(typeof loadingDiv !=='undefined'){
			  //TODO:old loading
			  loading = jQuery('<img src="images/bussiness/loading.gif"></img>').appendTo('#'+loadingDiv);			  
		  }
		  var ajaxId = 'ajax_chart_js_'+ queryId +'_'+Math.floor(Math.random()*2000+1);
 
		    hsasGolbal.addAjaxToTimelenessInfo(ajaxId,
			    jQuery.ajax({
			        'url':'js/business/chart2/'+queryId+'.js',
			        'type':'GET',
			        'dataType':'script',
			        'success':function( ){
			        	hsasGolbal.removeAjaxFromTimelenessInfo(ajaxId);
			        	if(typeof loading !== 'undefined'){
			        		jQuery(loading).remove();
			        	}
			        	if(typeof successFunc ==='function'){
				        	successFunc();			        		
			        	}
			        },
			        'error':function( xhr, etype, eobj ){
			        	
			        	hsasGolbal.removeAjaxFromTimelenessInfo(ajaxId);
			        	if(typeof loading !== 'undefined'){
			        		jQuery(loading).remove();
			        	}
			        	
			            if(etype != undefined && etype !== 'abort'){
			            	if(typeof errorFunc === 'function'){
			            		errorFunc();  	
			            	}
			            }
			            
			        }
			    })
			    
			 );

	}else{
		successFunc();
	}
	//end
	dfe();
};


function pointClickFunc(clickEvent ,pointClick ){
     	var ce = jQuery.extend(true,{},clickEvent);
    	//点击的chart
    	var clickChart = ce.currentTarget.series.chart;
        //取当前chart上的divIds
        var divIds =  jQuery( clickChart ).data('divIds');
        var chartDiv = divIds.chartDiv;
        
        if( pointClick.type === 'chart' ){//钻取图表
            
            var newDivIds = jQuery.extend(true,{},divIds);   	
        	var pointClickChartConfig = pointClick.config;
            var newQueryId = pointClickChartConfig.queryId;
        	
            function chartPopup(popupPage){
        		var popWidth = (jQuery(window).width()>860) ? 860 : (jQuery(window).width()-20);
        		var popHeight = (jQuery(window).height()>640) ? 640 : (jQuery(window).height()-20);
        		
        		newDivIds =  {popuped:true,chartDiv:'cp_content_chart',searchDiv:'cp_content_searchBox',titleDiv:'cp_content_title'};
        		jQuery.fancybox({
        			'type':'ajax',
        			'content': popupPage,
        			'hideOnContentClick': false,
        			'autoDimensions':false,
        			'width':popWidth,
        			'height':popHeight,
        			'onStart':function(){//加载弹出页面
        				//$.fancybox.showActivity();
        			},
        			'onCancel':function(){//取消弹出页面加载
        				//$.fancybox.hideActivity();
        			},
        			'onClosed':function(){//关闭弹出窗口
        				//$.fancybox.hideActivity();
        			},
        			'onComplete':function(){//弹出窗口加载完成,准备渲染图表
        				//jQuery('#fancybox-wrap').draggable({handle:'#cp_content_title',cursor:'move',opacity:0.5});
        				//$.fancybox.showActivity();
        				 chartConfigExist(newQueryId, function() {
        					 renderChartWithCfg(newQueryId, newDivIds, undefined, pointClickChartConfig.params, clickChart, ce ,function(){
              	   	    	    	//$.fancybox.hideActivity();  
          	   	    	      },function(){
          	   	    	    	//$.fancybox.hideActivity();
          	   	    	      },divIds);
        				 }, function(xhr, etype, eobj) {
        					 if (etype !== 'abort') {
        						 alert('加载js失败！');
        					 }
        				});
        			}
        		});
        	};
        	
        	if(typeof newDivIds['popup'] === 'string'){
        		chartPopup( newDivIds['popup'] );
        	}else if(typeof pointClick.popup === 'string'){
        		chartPopup( pointClick.popup );
        	}else{
                chartConfigExist(newQueryId, function(){
                	//debugger;
	   	    	    renderChartWithCfg(newQueryId, newDivIds, undefined ,pointClickChartConfig.params, clickChart, ce);
                },function(xhr,etype,eobj){
                    if( etype !== 'abort'){
                        alert('加载js失败！');
                    }
                });
        	}
        }else if(pointClick.type ==='grid'){//TODO:钻取表格
            
            var newDivIds = jQuery.extend(true,{},divIds);   	
        	var pointClickChartConfig = pointClick.config;
            var newQueryId = pointClickChartConfig.queryId;
            
        	gridConfigExist(newQueryId,function(){
	   	    	    renderGridWithCfg(newQueryId, newDivIds, pointClickChartConfig.params, clickChart, ce);
        	},function(xhr,etype,eobj){
                    if( etype !== 'abort'){
                        alert('加载js失败！');
                    }
        	});
        }else if(pointClick.type === 'multi'){
        	var clickPoint = ce.point;
        	if(typeof clickPoint!== 'undefined'){
        		pointClickFunc(clickEvent ,pointClick[ clickPoint['series']['name'] ] );
        	}else{
        		//TODO:
        		throw new Error('pointClickFunc():a point must be clicked!');
        	}
        }else{
           throw new Error('sysTohc():pointClick.type must be chart,grid or multi,but it\'s '+pointClick.type);
        }
    
}

/**
 * 将图表的系统配置及数据转换为HighCharts的配置
 * @param theChartSysCfg
 * @param data
 * 
 * @param curChart
 * @returns 
 */
function sysTohc(queryId, theChartSysCfg, data, divIds, curChart){
	//beign
	dfb();
	
	//有配置信息即可渲染的Div 【1】
    //var titleDiv = divIds['titleDiv'];
    //var colRemarkDiv = divIds['colRemarkDiv'];
    //var searchDiv = divIds['searchDiv'];
    //var refsDiv = divIds['refsDiv'];
    //有配置和数据才能渲染
    //var gridDiv = divIds['gridDiv'];
    //有图表对象才能渲染
    //var linkDiv = divIds['linkDiv'];
    //var toolBtnDiv = divIds['toolBtnDiv']; 
	var chartDiv = divIds['chartDiv'];
	
	var finalSysChartConfig = theChartSysCfg;
	//------------------------ Begin 解析数据 ----------------------------
    var xAxisSel = finalSysChartConfig.xAxisSel;
    var seriesInfo =  finalSysChartConfig.seriesInfos;

    var chartXAxis =  {
        'categories' : JSONSelect.match(('.items .'+xAxisSel),data)
    };
    //列名(全部)
    var colNames = JSONSelect.match('string:nth-child(2)',seriesInfo) ;
    //列名称(全部)
    var colTitles = JSONSelect.match('string:nth-child(1)',seriesInfo) ;
    var chartSeries = new Array();
  
    //饼图
    if(finalSysChartConfig.type === 'pie'){
    	//如果有pie配置项，需要对返回的单行数据进行转换
    	if(typeof finalSysChartConfig['item'] !=='undefined'){
    		if(finalSysChartConfig['item']==='single'){
    			//debugger;
    			//var item_key = finalSysChartConfig['item-key'];
    			var single_item = data.items[0];
    			 var colValues = new Array();
    			jQuery(colNames).each(function(cni,cnv){
    				colValues.push( [colTitles[cni],single_item[cnv]] );
    			});
    			chartSeries.push({
    	              'data' : colValues
    	        });
    		}else{
    			//do nothing
    		}
    	}else{
            //遍历列名,每次迭代生成一列数据配置
            jQuery(colNames).each(function(colIndex,colName){
                ////console.log(colName+'------>');
                //一列数据
                var colValues = new Array();

                //遍历数据行,每次迭代向列数据中压入一个数据项
                jQuery(data.items).each(function( rowIndex,rowData){

                    //一个单元格数据
                    var cellVal = rowData[colName];

                        //将一行数据该列的数据压到colValues里		
                        if( typeof cellVal ==='undefined' ){
                            //无数据需压入null,压入undefined会出错
                            colValues.push([chartXAxis['categories'][rowIndex],null]);
                        }else{
                            colValues.push( [chartXAxis['categories'][rowIndex],cellVal] );					
                        }           	
                });
                //生成列配置
                chartSeries.push({
                  //  'name' : colTitles[colIndex],
                    'data' : colValues
                });
            });	    		
    	}

    }else{ //其他图
        //遍历列名,每次迭代生成一列数据配置
        jQuery(colNames).each(function(colIndex,colName){	
            //一列数据
            var colValues = new Array();

            //遍历数据行,每次迭代向列数据中压入一个数据项
            jQuery(data.items).each(function( rowIndex,rowData){

                //一个单元格数据
                var cellVal = rowData[colName];

                    //将一行数据该列的数据压到colValues里		
                    if( typeof cellVal ==='undefined' ){
                        //无数据需压入null,压入undefined会出错
                        colValues.push(null);
                    }else{
                        colValues.push( cellVal );					
                    }           	
     
            });
            //生成列配置
            chartSeries.push({
                'name' : colTitles[colIndex],
                'data' : colValues
            });
        });	
    }
  
    //------------------------ END 解析数据 ----------------------------
    //------------------------ BEGIN 生成指标点点击 ---------------------------------
	    var pointSelectCfg = {
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
	};
    // ---------------------------END
	// 生成指标点点击------------------------------------------
    
    // 基础配置
    var baseHcConfig =  hsasCharts['common']['chartBase'];
    //当前图表的highChart配置
    var currentHcConfig = hsasCharts['charts'][queryId] ;
    //解析生成的配置
    var cfgFromSys = null;
    //统计分析中可能需要改变DIV大小（数据特别多时看不到指标）
    if(hsasGolbal._currentMenuItem==='hsas_menu_item_fenxi' || divIds['popuped'] === true 
    		//处理统计专题绩效管理标签中div
    		|| (hsasGolbal._currentMenuItem==='hsas_menu_item_zhuanti' 
    		&& hsasGolbal._menuInfos['hsas_menu_item_zhuanti'].timelinessInfo._ztTabCurrent === "zt_jxgl"
)){
	    if(typeof finalSysChartConfig.height === 'number'){
	    	//配置值为数字
	    	jQuery('#'+chartDiv).height(finalSysChartConfig.height);
	    }else if(typeof finalSysChartConfig.height === 'string'){
	    	//配置值为字符串
	    	
	    	var heightstr  = finalSysChartConfig.height;
	    	var hsChar = heightstr.substring(0,1);
	    	var hsNumber = parseInt(heightstr.substring(1,heightstr.length));
	    	if(hsChar === 'x'){
	    		if( hsNumber == NaN ){
	    			throw new Error('sysTohc():when typeof height is string,format must like x123 or y123');
	    		}else{
	    			jQuery('#'+chartDiv).height( (chartSeries[0]['data'].length)*hsNumber );
	    		}		
	    	}
	    	/* TODO: 配置图表高度(y123型)，暂不需要
	    	else if( hsChar ==='y'){
	    		if( hsNumber == NaN ){
	    			throw new Error('sysTohc():when typeof height is string,format must like x123 or y123');
	    		}else{
	    			jQuery('#'+chartDiv).height( (chartSeries[0]['data'].length)*hsNumber );
	    		}
	    	}
	    	*/
	    	else{
				throw new Error('sysTohc():when typeof height is string,format must like x123 or y123');
	    	}
	    }else{
	    	//do nothing
	    }
    }
	cfgFromSys ={
        'chart' : {
            'defaultSeriesType': finalSysChartConfig.type,
            'renderTo':chartDiv/*,
        	'width' : jQuery('#'+chartDiv).width()-7,
    	    'height' : jQuery('#'+chartDiv).height()-7*/ 
        },
        'xAxis':chartXAxis,
        'series' :chartSeries
    };
	
	//TODO：这个要改，临时方案(IE需要减小，否则会出现滚动条)
	if( jQuery.browser.msie ){
		if(jQuery('#'+chartDiv).width()>7){
			cfgFromSys['chart']['width'] = jQuery('#'+chartDiv).width()-7;
		}
		if(jQuery('#'+chartDiv).height()>7){
			cfgFromSys['chart']['height'] = jQuery('#'+chartDiv).height()-7;
		}	
	}

	
	//alert(cfgFromSys.chart.height);
	var chartTypeCfg = {plotOptions : {series:{} }};
	chartTypeCfg['plotOptions'][finalSysChartConfig.type] ={};

	//饼图允许选择点（点击时有切片效果）
	if(finalSysChartConfig.type === 'pie'){
		chartTypeCfg['plotOptions'][finalSysChartConfig.type]['allowPointSelect'] = true;
	}
	//可以钻取时使鼠标为箭头图标<strike>手型</strike>
	
    if(typeof finalSysChartConfig['pointClick']!=='undefined'){
    	//chrome设置gif光标会出现多个指标项时无法正常导出excel
    	chartTypeCfg['plotOptions']['series']['cursor']='pointer';
    	/*
    	if(hsasGolbal.ie){
    		chartTypeCfg['plotOptions']['series']['cursor']='pointer';
    	}else{
    		chartTypeCfg['plotOptions']['series']['cursor']='url("images/bussiness/arrow2.gif")';
    	}
    	*/
    }
    
    //显示数据
    if(typeof finalSysChartConfig['dataLabel'] !=='undefined'){
    	chartTypeCfg['plotOptions'][finalSysChartConfig.type]['dataLabels'] =  {enabled : finalSysChartConfig['dataLabel'] };
    }
    //指标叠加效果
    if(typeof finalSysChartConfig['stacking'] !=='undefined'){
    	chartTypeCfg['plotOptions']['series']['stacking'] = finalSysChartConfig['stacking'];
    }
    var extHcConfig = finalSysChartConfig.cfg;
    /*
     * 生成HighChart配置
     */
    var finalHcConfig = jQuery.extend( true,{},baseHcConfig, currentHcConfig,extHcConfig, cfgFromSys, chartTypeCfg ,pointSelectCfg);
	//end
	dfe();
//	console.dir(finalHcConfig);
    return finalHcConfig;
};

/**
 * 渲染图表（及附加部分）到divIds中指定的对应div上
 * @param queryId [必须]查询ID
 * @param divIds [必须]图渲染图表所需的div的Id集合
 * @param paramsCfg [非必须]图表查询参数配置
 * @param chart [非必须]当前图表
 * @param ce [非必须]当前触发的事件
 * @param successFunc 渲染成功的回调函数
 * @param errorFunc 渲染失败的回调函数
 */
function renderChartWithCfg(queryId, divIds, extSysCfg, paramsCfg, chart, ce , successFunc,errorFunc,oldDivIds){
	//begin
	dfb();
	//debugger;
	//没有传该参数则认为在原页面上钻取
	if(typeof oldDivIds ==='undefined'){
		oldDivIds = divIds;
	}else{
		//新图表div信息
		if(typeof divIds['idSuffix'] === 'undefined'){
			divIds['idSuffix'] = '_'+Math.floor(Math.random()*1024+1);
		}else{
			//do nothing
		}
	}
	

    var paramsData = undefined;
    //清空搜索框之前先判断是否需要从当前界面取参，如钻取时要先取参后清空页面
	if(typeof paramsCfg !== 'undefined'){
		paramsData = makeParamsData( paramsCfg ,oldDivIds['idSuffix'] ,chart,ce);
	}

	renderChartWithParams(queryId, divIds, extSysCfg ,paramsData, chart, ce, successFunc,errorFunc);
    //end
	dfe();
};

/**
 * 渲染图表（及附加部分）到divIds中指定的对应div上
 * @param queryId [必须]查询ID
 * @param divIds [必须]图渲染图表所需的div的Id集合
 * @param paramsData [非必须]图表查询参数信息
 * @param chart [非必须]当前图表
 * @param successFunc 渲染成功的回调函数
 * @param errorFunc 渲染失败的回调函数
 */
function renderChartWithParams(queryId, divIds, extSysCfg ,paramsData, chart, ce, successFunc,errorFunc){
	//begin
	dfb();
	//该图表相关的页面控件ID后缀
	if(typeof divIds['idSuffix'] === 'undefined'){
		 divIds['idSuffix'] = '_'+Math.floor(Math.random()*1024+1);
	}
	
	//try{
		//渲染图表静态部分
		renderChartStaticPart(queryId, divIds, extSysCfg ,paramsData);
	    //刷新图表数据并渲染动态部分
		renderChartDynamicPart(queryId, divIds, extSysCfg, paramsData, chart, ce,successFunc,errorFunc);
	/*
	}catch(err){
		//加载或渲染过程出现错误
		(function (errDiv){
			jQuery('#'+errDiv).children().remove();
			var ct =jQuery('<div></div>').addClass('chart_state').height(jQuery('#'+errDiv).height()).appendTo(  jQuery('#'+errDiv) );
			jQuery( ct ).append( jQuery('<div></div>').addClass('alpha')) ;
			jQuery( ct ).append( jQuery('<div><font>加载失败!</font></div>').addClass('fail') );
		})(divIds['chartDiv']);
	}
	*/
	dfe();
};

function ValidateSearchParams(queryId,divIds,isgrid){
	var res = true;
	if(divIds && queryId){
		var idSuffix = divIds['idSuffix'];
		
		var cfg = isgrid ? hsasGrids['gridscfg'][queryId] : hsasCharts['chartscfg'][queryId];
		if(cfg && cfg['params'] ){
			jQuery.each(cfg['params'],function( pi,paramCfg ){
				
				if(paramCfg && paramCfg['validate'] && paramCfg['type']=='pageCtrlValue' ){
					//控件Id
					var ctrlId = paramCfg['value']+( idSuffix || '');
					//控件值
					var ctrlVal = jQuery('#'+ctrlId).val() ;
					//遍历所有约束
					jQuery.each( paramCfg['validate'],function( vi,vali ){
						//非空
						if( vali =='required' ){
							if( /^\s*$/.test(ctrlVal)){
								res = false;
							}
						}else if( vali == 'int'){
							if( ! /^-?\d+$/.test(ctrlVal)){
								res = false;
							}
						}else if( vali == 'date'){
							if( ! /^([1-2]\d{3})[\/|\-](0?[1-9]|10|11|12)[\/|\-]([1-2]?[0-9]|0[1-9]|30|31)$/.test(ctrlVal)){
								res = false;
							}
						}else{
							var valiArr = vali.split(':');
							if(valiArr.length>1){
								if(valiArr[0]==='len'){
									var valLen = ctrlVal.trim().length;
									if( valLen != valiArr[1]){
										res = false;
									} 
									
								}else if(valiArr[0]==='max'){
								    var maxNum = Number(valiArr[1]);
									if(ctrlVal> maxNum){
										res=false;
									}
								}else if(valiArr[0]==='min'){
								    var minNum = Number(valiArr[1]);
									if(ctrlVal< minNum ){
										res=false;
									}
								}else{
									//other
								}
							}
						}
						if( res == false ){
							//校验失败
							jQuery('#'+ctrlId).focus().css('background','#FF0000');
							//跳出循环
							return false;
						}
					});
					//跳出循环
					if( res == false ){
						return false;
					}else{
						//校验成功，恢复可能的红色背景
						jQuery('#'+ctrlId).css('background','#FFF');
					}
				}
			});
		}
	}
	
	return res;
}
function renderChartStaticPart(queryId, divIds, extSysCfg, paramsData){
	dfb();
	/**
	 * 加载图表时展示加载状态
	 * @param loadingDiv 展示加载状态的div
	 */
	function loadingChart(loadingDiv){
		jQuery('#'+loadingDiv).addClass('shadow').children().remove();
		var ct =jQuery('<div></div>').addClass('chart_state').height(jQuery('#'+loadingDiv).height()).appendTo(  jQuery('#'+loadingDiv) );
		jQuery( ct ).append( jQuery('<div></div>').addClass('alpha')) ;
		jQuery( ct ).append( jQuery('<div><font>正在加载...</font></div>').addClass('loading') );
	}
	
	//该图表相关的页面控件ID后缀
	var idSuffix = divIds['idSuffix'];
	if(typeof idSuffix === 'undefined'){
		idSuffix = '';
	}
	//有配置信息即可渲染的Div 【1】
    var titleDiv = divIds['titleDiv'];
    var colRemarkDiv = divIds['colRemarkDiv'];
    var searchDiv = divIds['searchDiv'];
    var refsDiv = divIds['refsDiv'];
    //有配置和数据才能渲染
    var gridDiv = divIds['gridDiv'];
    var chartDiv = divIds['chartDiv'];
    //有图表对象才能渲染
    var linkDiv = divIds['linkDiv'];
    var toolBtnDiv = divIds['toolBtnDiv']; 
    
    var theChartSysCfg =  jQuery.extend(true,{},hsasCharts['chartscfg'][queryId]);
    //附加配置
    if(typeof extSysCfg !== 'undefined'){
    	//不能用extend,否则附加配置中的undefined冲不掉默认配置
    	jQuery.each(extSysCfg,function( pName,pVal ){
    		theChartSysCfg[pName] = pVal;
    	});
    	//theChartSysCfg= jQuery.extend( true, {} , theChartSysCfg, extSysCfg );
    }
    //console.dir(theChartSysCfg);
    /*
     * 清div内容并渲染 【1】部分
     */
    //清link
	 if(typeof linkDiv !== 'undefined'){
         jQuery('#'+linkDiv).children().remove();
         jQuery('#'+linkDiv).parent().hide(); 
	 }
	
	//清按钮
	 if(typeof toolBtnDiv !== 'undefined'){
         jQuery('#'+toolBtnDiv).children().remove();
     }
    //title
	 if(typeof titleDiv !== 'undefined'){
         jQuery('#'+titleDiv).children().remove();
         jQuery('#'+titleDiv).append( jQuery('<h1></h1>').text(theChartSysCfg['title']) );		
     }
	 //comment
     if(typeof commentDiv !== 'undefined'){
         jQuery('#'+commentDiv).children().remove();
         jQuery('#'+commentDiv).text( theChartSysCfg['comment'] );		
     }
 	
     //colRemark
     if( typeof colRemarkDiv !== 'undefined'){
         jQuery('#'+colRemarkDiv).children().remove();
         var crUl = jQuery('<ul></ul>').appendTo(jQuery('#'+colRemarkDiv));
         jQuery.each(theChartSysCfg['seriesInfos'],function(index,si){
             crName = si[0];
             crIndex = si[1];
             crContent = hsasCharts['common']['chartsColRemark'][crIndex] ;
             if(typeof crContent ==='undefined'){
                 crContent = '暂无说明';
             }
             jQuery('<li></li>').appendTo(crUl).text(crName+':'+crContent);
         });
     }
     //清空gridDiv
     if(typeof gridDiv !== 'undefined'){
     		jQuery('#'+gridDiv).children().remove();
     }
     if( typeof chartDiv !== 'undefined'){
         loadingChart( chartDiv );
     }
     //refs
     if( typeof refsDiv !== 'undefined'){
         jQuery('#'+refsDiv).children().remove();
         if( typeof theChartSysCfg['refs'] !== 'undefined' ){
        	 jQuery('#'+refsDiv).parent().show(); 
             var crUl = jQuery('<ul></ul>').appendTo( jQuery('#'+refsDiv).addClass('') );
             jQuery.each(theChartSysCfg['refs'],function(index,ri){
                 riTitle = ri.title;
                 riUrl = ri.url;
                 jQuery('<li></li>').append( jQuery('<a target="_blank">'+riTitle+'</a>').attr('href','references/'+ri.url) ).appendTo(crUl);
             });			
         }else{
        	 jQuery('#'+refsDiv).parent().hide(); 
         }
     }
    //search
    //----------------------------Begin 生成searchBox-------------------------------------
    ////console.dir(theChartSysCfg);
    if( typeof searchDiv !== 'undefined' ){
        var searchBox = jQuery('#'+searchDiv);
        searchBox.children().remove();
        searchBox.append(jQuery('<span><strong>统计条件</strong></span>'));
        //遍历生成查询条件
        if(typeof theChartSysCfg['searchBox'] !== 'undefined'){
            jQuery.each( theChartSysCfg['searchBox'],function(index,val){
            	//console.debug('searchBox['+index+']');
            	//控件和控件标题的父容器
            	var ctrlBox = jQuery('<span></span>');
                if(typeof val !== 'undefined'){
                	 if( val.type === 'label'){
              		   jQuery('<span></span>').appendTo(ctrlBox).text( val.title );
              		   jQuery('<input type="text" disabled="disabled"></input>').attr('id',val.prefix+idSuffix).appendTo(ctrlBox).val( val.defaultValue ).attr('style',val.style);
              	   }else if( val.type === 'hide'){
              		   jQuery('<input type="hidden"></input>').attr('id',val.prefix+idSuffix).appendTo(ctrlBox).val( val.defaultValue );
              	   }else if( val.type === 'text' ){//文本框
                        jQuery('<span></span>').appendTo(searchBox).text( val.title ).attr('style',val.style);
                      //默认值
                        jQuery('<input type="text"></input>').attr('id',val.prefix+idSuffix).appendTo(ctrlBox).val( val.defaultValue ).attr('style',val.style);
                        jQuery("#"+val.prefix+idSuffix).attr('disabled',val['disable']);
                    }else if( val.type === 'select' ){//下拉框
                        jQuery('<span></span>').appendTo(searchBox).text( val.title );
                        var sel = jQuery('<select></select>').attr('id',val.prefix+idSuffix).appendTo(ctrlBox);
                        jQuery("#"+val.prefix+idSuffix).attr('disabled',val['disable']);
                        //遍历生成下拉框内容
                        jQuery.each(val.options ,function(oi,option){
                            var opt = jQuery('<option></option>').appendTo(sel).val( option.value ).text( option.title );
                            if( option.value === val.defaultValue ){
                            	//默认值
                                opt.attr('selected',true);
                            }
                        });
                        sel.attr('style',val.style);
                    }/*else if(val.type === 'label'){
                    	 jQuery('<span></span>').appendTo(searchBox).text( val.title );
                         jQuery('<input type="text"></input>').attr('id',val.prefix+idSuffix).appendTo(searchBox).val( val.defaultValue );
                         jQuery('<input type="text"></input>').attr('id',val.prefix+idSuffix+'_label').appendTo(searchBox).val( val.defaultLabel );
                                                 //TODO:                	 
                    }*/else{
                        throw new Error('renderChartStaticPart(): type ['+ val.type +'] in searchBox is not supported ' );
                    }
              	   jQuery(ctrlBox).appendTo(searchBox);
            	   //设置隐藏
            	   if( typeof val['display'] !=undefined ){
            		   jQuery(ctrlBox).css('display',val['display']);
            	   }
            	   //绑定事件
            	   var binds = val['bind'];
            	   if(typeof binds != undefined){
            		   jQuery(binds).each(function(i,bind){
            			   //传入divIds，函数中可用event.data.divIds取得
            			   jQuery('#'+val.prefix+idSuffix).bind(bind['name'],{divIds:divIds},bind['fun']);
            		   });
            	   }
                }
            });
            //搜索按钮
            jQuery('<input type="button" class="btn_surch" value="查询"/>').appendTo( searchBox ).click(function(){
            	/*
            	var currentChart = hsasGolbal.getMenuItemTimelinessInfo2('currentChart');
        		if(typeof currentChart !=='undefined'){
            		currentChart.showLoading();
            	}
            	*/
            	if( ValidateSearchParams(queryId,divIds) ){
            		renderChartDynamicPart(queryId,divIds);
            	}
            });
            
            //如果传入params参数，则重新设定查询框控件中的值(钻取,后退等时传递的参数会覆盖掉默认值)
            //
            //console.dir(paramsData);
            if( typeof paramsData !=='undefined' ){
            //	console.dir(paramCfgs);
            	jQuery.each(paramsData,function(pName,pValue){
            		//console.log('>> '+pName+':'+pValue);
            		var paramCfgs = theChartSysCfg['params'];
                	if( typeof paramCfgs !=='undefined'){
                		//查找该参数项在params中配置
                		param = undefined;
                		jQuery.each(paramCfgs,function(pcIndex,paramCfg){
                    		//console.log('>> '+pName+':'+pValue);
                			//console.log(paramCfg.name+":"+labreg.test(paramCfg.name));
                			if( paramCfg.name === pName ){
                				//console.log('            >> '+pName+':'+pValue);
                				param = paramCfg;
                				//退出循环
                				return false;
                			}
                		});
                		//如果找到则判断该参数是否是控件（pageCtrlValue），是则赋新值
                		if( typeof param !=='undefined'){
                			if( param['type'] === 'pageCtrlValue' ){
                				//console.log('                           ## '+'#'+param['value']+idSuffix+':'+pValue);
                				jQuery('#'+param['value']+idSuffix).val(pValue);  
                			}
                		}
                	}
      
            	});
              	//console.log('================');

            }
        }

    }

    //----------------------------End 生成searchBox-------------------------------------
    dfe();
}

function pushDrillHistory(data){
	var pushChartStack = hsasGolbal.getMenuItemTimelinessInfo2('pushChartStack');
	if (typeof pushChartStack === 'function') {
		//console.dir(data);
		//debugger;
		pushChartStack(data);
	}		
}

function renderChartDynamicPart(queryId, divIds, extSysCfg,paramsData, chart, ce, successFunc,errorFunc){
	dfb();  
	/**
	 * 条件错误后展示失败信息
	 * @param errDiv 展示失败信息的div
	 */
	function chartParamError(errDiv){
		if(errDiv){
			jQuery('#'+errDiv).children().remove();
			var ct =jQuery('<div></div>').addClass('chart_state').height(jQuery('#'+errDiv).height()).appendTo(  jQuery('#'+errDiv) );
			jQuery( ct ).append( jQuery('<div></div>').addClass('alpha')) ;
			jQuery( ct ).append( jQuery('<div><font>查询条件输入错误。!</font></div>').addClass('paramsError') );
		}
	}
	
	/**
	 * 加载图表失败后展示失败信息
	 * @param errDiv 展示失败信息的div
	 */
	function loadChartError(errDiv){
		if(errDiv){
			jQuery('#'+errDiv).children().remove();
			var ct =jQuery('<div></div>').addClass('chart_state').height(jQuery('#'+errDiv).height()).appendTo(  jQuery('#'+errDiv) );
			jQuery( ct ).append( jQuery('<div></div>').addClass('alpha')) ;
			jQuery( ct ).append( jQuery('<div><font>加载失败!</font></div>').addClass('fail') );
		}
	}
	/**
	 * 加载图表时展示加载状态
	 * @param loadingDiv 展示加载状态的div
	 */
	function loadingChart(loadingDiv){
		if(loadingDiv ){
			jQuery('#'+loadingDiv)/*.addClass('shadow')*/.children().remove();
			var ct =jQuery('<div></div>').addClass('chart_state').height(jQuery('#'+loadingDiv).height()).appendTo(  jQuery('#'+loadingDiv) );
			jQuery( ct ).append( jQuery('<div></div>').addClass('alpha')) ;
			jQuery( ct ).append( jQuery('<div><font>正在加载...</font></div>').addClass('loading') );
		}
	}
	
    //var chartDiv = divIds['chartDiv'];
    var linkDiv = divIds['linkDiv'];
    var gridDiv = divIds['gridDiv'];
    var toolBtnDiv = divIds['toolBtnDiv'];
    var chartDiv = divIds['chartDiv']; 
    
    var theChartSysCfg =  jQuery.extend(true,{},hsasCharts['chartscfg'][queryId]);
    //附加配置
    if(typeof extSysCfg !== 'undefined'){
    	//不能用extend,否则附加配置中的undefined冲不掉默认配置
    	jQuery.each(extSysCfg,function( pName,pVal ){
    		theChartSysCfg[pName] = pVal;
    	});
    	//theChartSysCfg= jQuery.extend( true, {} , theChartSysCfg, extSysCfg );
    }
    //console.dir(extSysCfg);
    //console.dir(theChartSysCfg);

	//该图表相关的页面控件ID后缀
	var idSuffix = divIds['idSuffix'];
	if(typeof idSuffix === 'undefined'){
		idSuffix = '';
	}
	
	 if(hsasGolbal._currentMenuItem==='hsas_menu_item_fenxi'){
		//chartDiv高度先恢复默认值，否则以前撑大的Div不会还原
	    jQuery('#'+chartDiv).height(400);
	 }
 	if( typeof chartDiv !== 'undefined'){
        //jQuery('#'+chartDiv).children().remove();
       // jQuery('<div></div>').attr('style','background:#FFF url(images/bussiness/bluebar_loading.gif) no-repeat center;').addClass('div_alpha_80').height(jQuery('#'+chartDiv).height()).appendTo( jQuery('#'+chartDiv) );
 		loadingChart(chartDiv);
    }
	if( typeof gridDiv !== 'undefined'){
        jQuery('#'+gridDiv).children().remove();
    }
	
	//console.log('--------------------------');
	var queryParams ;
	if(typeof paramsData !== 'undefined'){
		//直接使用传参的对象（已经是参数对象，不需要解析）
		queryParams = paramsData;
	}else{
		//构造查询参数
		queryParams = makeParamsData( theChartSysCfg.params ,idSuffix ,chart, ce);
	}

	//console.dir(queryParams);
    //console.log('==========================');
    //请求图表数据
    var ajaxId = 'chart_data_'+queryId+'_'+Math.floor(Math.random()*1024+1);
    //防止缓存
	queryParams['_']= ajaxId;
	

	
    hsasGolbal.addAjaxToTimelenessInfo(ajaxId,
	    jQuery.ajax({
	        'url':theChartSysCfg['queryUrl'],
	        'type':'POST',
	        'data': queryParams,
	        'dataType':'json',
	        'success':function( chartData ){
                //console.log('===begin====');
	        	hsasGolbal.removeAjaxFromTimelenessInfo(ajaxId);
	            if(chartData.success === true){
	                if( chartData.items.length === 0 ){
	                	var noDataMsg = '暂无数据';
	                    //console.debug( noDataMsg );
	                	 jQuery('#'+chartDiv).children().remove();
	                    jQuery('<span style="text-align:center;"></span>').text( noDataMsg ).appendTo( jQuery('#'+chartDiv) );
				    	//alert(noDataMsg);
	                    //占位元素，无用
	                    pushDrillHistory({
	                    	type: 'chart',
							divIds : divIds,
							queryParams : {},
							queryId : ''
						});
						var chartBack = hsasGolbal.getMenuItemTimelinessInfo2('chartBack');
						if (typeof chartBack === 'function') {
							//chartBack();
						}
	                    return true;
	                }else{
	                	// !! 不能销毁原chart，如钻取弹出框
	                	/*
	                	if(typeof chart !== 'undefined'){
	                		alert('xx');
	                		//console.dir(typeof chart);
	                		jQuery(chart).data('divIds');
	                		chart.destroy ();
	                	}
	                	*/
	                	
	                    //渲染图表
	                	var hcCfg = sysTohc(queryId, theChartSysCfg, chartData, divIds );
	                	
	                	//hcCfg.chart.width = jQuery('#'+divIds.chartDiv).width() ;
	                	//hcCfg.chart.height = jQuery('#'+divIds.chartDiv).height() ;
	                	//console.dir(hcCfg);
	                	//console.log('-->new chart:'+chartDiv);
	                	
	                	var newChart ;
	                	try{
	                		newChart =new Highcharts.Chart( hcCfg );
	                	}catch(e){
	                		//debugger;
	                		loadChartError(chartDiv);
	                		return true;
	                	}
	                	//debugger;
	                	//记录相关信息至图表控件
	                	jQuery( newChart ).data('divIds',divIds);
	                	jQuery( newChart ).data('queryParams',queryParams);
	                	jQuery( newChart ).data('queryId',queryId);
	                	jQuery( newChart ).data('items',chartData);
	                	
					    	hsasGolbal.setMenuItemTimelinessInfo('currentChart',newChart);
							pushDrillHistory({
								type:'chart',
								divIds : divIds,
								queryParams : queryParams,
								queryId : queryId
							});
							 //---------------------------- BEGIN 生成link ---------------------------
						    if( typeof linkDiv === 'string' ){
						        jQuery('#'+linkDiv).children().remove();
						        //var currentSysConfig =  hsasChartsConfig['chartscfg'][queryId] ;
						        var links = theChartSysCfg['links'];
						        //console.log('xx');
						        //console.dir(links);
						        if( typeof links !== 'undefined' ){
						        	jQuery('#'+linkDiv).parent().show();
						        	var linkDivUl = jQuery('<ul></ul>').appendTo(jQuery('#'+linkDiv));
						            jQuery.each( links,function(index,link){
						                if( link.show == true ){
						                    if(link.type=='url'){
						                    	var uLi = jQuery('<li></li>').appendTo(linkDivUl);
						                        jQuery('<a></a>').text( link.title ).appendTo( uLi ).click(function(){
						                            var queryurl = link.url;
						                            if( typeof link.params !== 'undefined' ){
						                                queryurl += makeParamsString(link.params,chart);
						                            };
						                            window.open(encodeURI(queryurl),"");
						                        });
						                    }else if(link.type=='chart'){
						                    	var uLi = jQuery('<li></li>').appendTo(linkDivUl);
						                        jQuery('<a></a>').text( link.title ).appendTo( uLi ).click(function(){
						                        	newChart.showLoading();
						                            var newQueryId = link.queryId;
						                            chartConfigExist(newQueryId,function(){
						                            	renderChartWithCfg( newQueryId, divIds, undefined, link.params,newChart);
						                            },function(){
						                            	alert('失败');
						                            },divIds['chartDiv']);
						                        });			

						                    }
						                }
						            });
						        }else{
						        	jQuery('#'+linkDiv).parent().hide();
						        }
						    }
						    //---------------------------- END 生成link -----------------------------
						    //-----------------------------Begin 生成grid-----------------------------
						    if( typeof gridDiv === 'string'){
						        //console.debug('生成grid');
						        jQuery('#'+gridDiv).children().remove();
						        var gridId = gridDiv+'_grid';
						        jQuery('<table></table>').attr('id',gridId).appendTo(jQuery('#'+gridDiv));

						        //取得grid配置
						        var gridcfg = jQuery.extend(true,{},theChartSysCfg.grid, hsasCharts['common']['gridBase'] , { height:'100%',width:'100%'});
						        $(gridcfg.colModel).each(function(cmi,cmv){
						        	if(cmv){
						        		cmv.sortable=false;
						        	}
						        });
						        //debugger;
						        //初始化grid
						        jQuery("#"+gridId).jqGrid( gridcfg );
						        //加载grid和chart数据

						        jQuery("#"+gridId).jqGrid('clearGridData');
						        for ( var i = 0; i <= chartData.items.length; i++) {
						            jQuery('#'+gridId).jqGrid('addRowData', i + 1, chartData.items[i]);
						        }
						    }
						    //-----------------------------End 生成grid-----------------------------
						  
						    //生成button
							if(typeof toolBtnDiv ==='string'){
								jQuery('#'+toolBtnDiv).children().remove();
							    var favBtn = jQuery('<input/>').attr('type','button')/*.val('收藏')*/.addClass('btn_fav').attr('style','float:left;').attr('id','btn_fav_'+queryId+idSuffix).attr('title','收藏当前图表');
								var printBtn = jQuery('<input/>').attr('type','button')/*.val('打印')*/.addClass('btn_print').attr('style','float:left').attr('id','btn_pnt_'+queryId+idSuffix).attr('title','打印当前图表');
								var exportPngBtn = jQuery('<input/>').attr('type','button')/*.val('导出')*/.addClass('btn_export_png').attr('style','float:left;').attr('id','btn_exp_'+queryId+idSuffix).attr('title','导出为PNG图片');
								var exportXlsBtn = jQuery('<input/>').attr('type','button')/*.val('导出excel')*/.addClass('btn_export_xls').attr('style','float:left;').attr('id','btn_expexcel_'+queryId+idSuffix).attr('title','导出为Excel文档');;
								var addCompareBtn = jQuery('<input/>').attr('type','button')/*.val('加入对比栏')*/.addClass('btn_add_compare').attr('style','float:left;').attr('id','btn_add_compare_'+queryId+idSuffix).attr('title','添加到对比栏');
								
								//jQuery('.compare_add_move').attr('id','btn_add_compare_'+queryId+idSuffix);
								
								var showCompareBtn = jQuery('<input/>').attr('type','button')/*.val('查看对比栏')*/.addClass('btn_compare').attr('style','float:left;').attr('id','btn_show_compare_'+queryId+idSuffix).attr('title','查看对比栏');
								//jQuery('.compare_show_move').attr('id','btn_show_compare_'+queryId+idSuffix);
							
						   		jQuery('#'+toolBtnDiv)/*.attr('style','margin-bottom:10px;padding-bottom:20px; float:left;height:400px')*/.append(favBtn).append(printBtn).append(exportPngBtn).append(exportXlsBtn).append(addCompareBtn).append(showCompareBtn);
								
								//jQuery('#'+toolBtnDiv).append(favBtn).append(printBtn).append(exportPngBtn).append(exportXlsBtn);
						   		//添加对比按钮 事件
						   		jQuery('#btn_add_compare_'+queryId+idSuffix).unbind('click').click(function(){
						   			hsasGolbal.pushCompare({
										type:'chart',
										title:theChartSysCfg['title'],
										queryParams : queryParams,
										queryId : queryId
						   			});
						   			/////
						   			//jQuery('.compare_box .compare_list').append('<li style="color:#E07E13; font-size:12px; ">'+theChartSysCfg['title']
						   			//		+'<img src="images/bussiness/compare_remove.jpg" class="compare_remove" style="cursor:pointer; height:15px; "  data-key="'+hsasGolbal['compareList'].length+'" /></li>');
						   			jQuery('.compare_box .compare_list').append('<li><div><img src="images/bussiness/compare_remove.jpg" data-key="'+hsasGolbal['compareList'].length+'"/><span>'+theChartSysCfg['title']+'</span></div></li>');
						   			alert('添加成功！');
									$('.compare_box .compare_list li div img').die().live('click',function(){
										var items = $('.compare_box .compare_list li div img');
			        		    		var current_index = null;
			        		    		var remove = $(this);
			        		    		$.each(items,function(items_index , items_data ){
			        		    			if( $(items_data).data('key') == jQuery(remove).data('key')){
			        		    				current_index = items_index;
			        		    			}
			        		    		});	
			        		    		//从列表中移除
			        		    		hsasGolbal.compareList.splice(current_index,1);
			        		    		//移除对比栏中的标题
			        		    		jQuery(jQuery('.compare_box .compare_list').children()[current_index]).remove();
			        		    	});
									/////
								});
						   		//查看对比按钮 事件
						   		jQuery('#btn_show_compare_'+queryId+idSuffix+',.compare_box img.compare_go').unbind('click').click(function(){
						   			var height = jQuery(window).height()-40;
						   			if(hsasGolbal.compareList.length>1){
						   				height = 480*(hsasGolbal.compareList.length);
						   			}
						   			jQuery.fancybox({
						        			'type':'ajax',
						        			'content': 'jsp/popup/compare.jsp',
						        			'hideOnContentClick': false,
						        			'autoDimensions':false,
						        			'width':jQuery(window).width()-280,
						        			'height': height,
						        			'onComplete':function(){
						        			//	加载对比栏数据
						        				var compareList = hsasGolbal['compareList'];
						        				$.each(compareList,function(cli,clobj){
						        					var idSuffix = '_'+Math.floor(Math.random()*1024+1);
						        					//console.dir(clobj);
						        					var divIds = {
						        						chartDiv : 'compare_chart'+idSuffix,
						        						searchDiv : 'compare_searchBox'+idSuffix,
						        						idSuffix:  idSuffix,
						        						popuped:true
						        					};
						        					var title = clobj['title'] || '';
						        					var queryId = clobj['queryId'];
						        					var type = clobj['type'];
						        					var paramsData = clobj['queryParams'];
						        					//console.dir(cli);
						        					var item = $('<div class="item" />').appendTo( $('#compare_page_content') )
						        									.append('<div class="item_title">'+title+'<div class="item_remove" data-key="'
						        											+cli+'" style="background-image:url(images/bussiness/compare_remove.jpg)"></div>'
						        											+'</div>')
						        						.append( $('<div class="searchBox"></div>').attr('id','compare_searchBox'+idSuffix) )
						        						.append( $('<div class="chart"></div>').attr('id','compare_chart'+idSuffix) );
						        					hsasGolbal.loadRenderChart(queryId , divIds, {pointClick:undefined}, paramsData );
						        				});
						        				
						        				//chart_popup内容区大小
						        				$('#cp_content').width(100); 
						        		    	//内容区内部div调节，滚动条和高度
						        				$('#fancybox-content').css('overflow','auto');
						        				$('#fancybox-content').children('div').attr("style","");
						        				$('#fancybox-overlay').width(jQuery(window).width());
						        		    	//为删除按钮绑定事件
						        		    	$('#compare_page_content .item .item_remove').unbind().bind('click',function(){
						        		    		var items = $('#compare_page_content .item .item_remove');
						        		    		var current_index = null;
						        		    		var remove = $(this);
						        		    		$.each(items,function(items_index , items_data ){
						        		    			if( $(items_data).data('key') == jQuery(remove).data('key')){
						        		    				current_index = items_index;
						        		    			}
						        		    		});	
						        		    		//从列表中移除
						        		    		hsasGolbal.compareList.splice(current_index,1);
						        		    		//从div中移除当前项
						        		    		jQuery(this).parent().parent().remove();
						        		    		//移除对比栏中的标题
						        		    		jQuery(jQuery('.compare_list').children()[current_index]).remove();
						        		    	});
						        		    	//居中（IE7不会自动居中）
						        		    	$.fancybox.center() ;
						        			}
						   			});
								});						   		
						   		//为导出按钮绑定事件
								jQuery('#btn_exp_'+queryId+idSuffix).unbind('click').click(function(){
									newChart.exportChart(/*{filename: theChartSysCfg['title']}*/);
								});
								//为打印按钮绑定事件
								jQuery('#btn_pnt_'+queryId+idSuffix).unbind('click').click(function(){
									newChart.print();
								});
								//为收藏按钮绑定事件
								jQuery('#btn_fav_'+queryId+idSuffix).unbind('click').click(function(){
									//TODO:收藏按钮
									addFav(theChartSysCfg['queryUrl'],queryParams,chartData);
								});
								//为导出excel按钮绑定事件
								jQuery('#btn_expexcel_'+queryId+idSuffix).unbind('click').click(function(){
									chartExportExcel(theChartSysCfg,chartData,newChart);
								});
						    }
	                }
		            if( typeof successFunc ==='function'){
		            	successFunc(newChart);
		            }
//	                console.log('--end----');
	            }else{
	            	//TODO:需要否？
	            	pushDrillHistory({
	            			type:'chart',
							divIds : divIds,
							queryParams : queryParams,
							queryId : queryId
						});
	            	//TODO:检查错误码
	                //alert('加载数据失败！');
	            	loadChartError(chartDiv);
	            	if(typeof errorFunc === 'function'){
			            errorFunc();	            	
		            }
	            }

	            
	        },
	        'error':function( xhr, etype, eobj ){
	        	hsasGolbal.removeAjaxFromTimelenessInfo(ajaxId);
	        	//占位
	        	pushDrillHistory({
        			type:'chart',
					divIds : divIds,
					queryParams : undefined,
					queryId : undefined
				});
	        	
	        	if(xhr.status !== 400){
		    		 //alert("加载失败:"+error);
		        	if(etype !== 'abort'){
		        		loadChartError(chartDiv);     
			            if(typeof errorFunc === 'function'){
				            errorFunc();	            	
			            }
		            }
		    	 }else{
		    		 chartParamError(chartDiv);
		    		 //alert("输入条件有误");
		    	 }
	        	
	        	

	            

	        }
	    })
	 );
    
    //END
    dfe();
}

function chartExportExcel(chartCfg,chartData,chartObj){
	//debugger;
	var xlsForm = jQuery('<form method="POST" accept-charset="UTF-8" enctype="application/x-www-form-urlencoded" style="display:none"></form>').attr('action','exportExcelServlet');
	xlsForm.append( jQuery('<input type="hidden" name="title"></input>').val(chartCfg['title']) );
	
	if( chartObj ){
		xlsForm.append( jQuery('<input type="hidden" name="svg"></input>').val( chartObj.getSVG() ) );										
	}
	/*
	//有grid则向后台传输grid相关信息
	if(typeof gridDiv !=='undefined'){
        //获取grid中文表头
        var colNames = theChartSysCfg.grid.colNames;
        //获取grid英文表头
        var colIndex = theChartSysCfg.grid.colModel;
    	for( var ni=0; ni<colNames.length ;ni++   ){
    		xlsForm.append( jQuery('<input type="hidden" name="colNames"></input>').val( colNames[ni] ) );
    		xlsForm.append( jQuery('<input type="hidden" name="colIndexs"></input>').val( colIndex[ni].name ) );
    	}
	}
	//添加查询条件
	jQuery.each(chartData.params,function( pname,pval){
		xlsForm.append( jQuery('<input type="hidden" name="p.'+pname+'"></input>').val( pval ) );
	});
	*/
	if( chartCfg.grid ){
		//获取grid中文表头
        var colNames = chartCfg.grid.colNames;
        //获取grid英文表头索引
        var colIndex = chartCfg.grid.colModel;
        var colIndexs = [];
    	for( var ni=0; ni<colNames.length ;ni++   ){
    		colIndexs.push(colIndex[ni].name);
    	}
        var gridJson = {
        	colNames: colNames,
        	colIndexs: colIndexs,
        	items: chartData.items
        };
        xlsForm.append( jQuery('<input type="hidden" name="gridJson"></input>').val( JSON.stringify(gridJson) ) );
	}
	xlsForm.appendTo('body');
	//提交表单
	xlsForm.eq(0).submit();
	
	//xlsForm.remove(); 
}


/**
 * 构造提交参数对象
 * @param paramsConfig 参数配置
 * @param idSuffix 该图表相关的页面控件ID后缀
 * @param chart 当前图表
 * @returns 返回构造后的参数对象，如{a:1,b:4}
 */
function makeParamsData( paramsConfig, idSuffix, chartOrGrid , ce ,extObj){
	dfb();
	////console.dir(paramsConfig);
	if(typeof idSuffix === 'undefined'){
		idSuffix = '';
	}
	var chart = chartOrGrid;
	var grid = chartOrGrid;
	
    var paramsData = {};
	if( paramsConfig==null || typeof paramsConfig ==='undefined'){
		return paramsData;
	}
    jQuery.each( paramsConfig,function(index,val){
    	if( typeof val ==='undefined' ){
    		//忽略无效配置，但是要继续执行循环
    		return true;
    	}
    	var pName = val.name;
        var pType = val.type;
        var pValue = val.value;
        ////console.log('@ '+pName+'-'+pType+'-'+pValue +'-'+idSuffix );

        //定值
        if( pType === 'constValue' ){
            paramsData[pName] = pValue;
        }else if( pType === 'pageCtrlValue' ){//页面控件的值，即用jQuery的val()取到的值
            paramsData[pName] = jQuery('#'+pValue+idSuffix).val();
           // debugger;
           
            ////console.log('#'+pValue+idSuffix+'  '+paramsData[pName]);
        }else if( pType === 'pointClick' ){ //图表选择点
           /*
        	if( typeof chart ==='undefined' ){
                throw new Error("makeParamsData():when type is pointClick,arg chart must be set!");
            }
            */
            if( typeof ce ==='undefined' ){
                throw new Error("makeParamsData():when type is pointClick,arg ce must be set!");
            }
            var pointClick = ce.point;
            if( typeof pointClick =='undefined' ){
                //TODO 没有选择点
            	throw new Error("makeParamsData()::when type is pointClick,a point must be click!");
                //continue;
            }else{
            	//debugger;
            	//console.dir('~~~~~Begin~~~~~~:'+jQuery.hasData(chart));
                if( pValue ==='xVal' ){
                	//console.dir(pointClick);
                    paramsData[pName] = pointClick.category; 
                }else if( pValue ==='yVal' ) {
                    //TODO
                    paramsData[pName] = pointClick.y;
                }else if( pValue ==='seriesName' ) {
                    //TODO
                    paramsData[pName] = pointClick['series']['name']; 
                }else if( pValue ==='seriesIndex' ) {
                    //TODO
                    paramsData[pName] = pointClick['series']['index']; 					
                }else if( pValue === 'xCode'){
                	//TODO:xCode
                	
                	var ddd = jQuery( ce.currentTarget.series.chart ).data('items');
                	//var xxxx = jQuery(chart).data('divIds');
                	if(typeof ddd === 'undefined'){
                		//console.dir(xxxx);
                        throw new Error("makeParamsData():type is pointClick,value is xCode,but no data items on the Chart!");
                	}
                	if(typeof val.code === 'undefined'){
                        throw new Error("makeParamsData():when type is pointClick and value is xCode, code must be set!");
                	}
                	paramsData[pName] = ddd.items[pointClick.x][val.code];
                }else {
                    throw new Error("makeParamsData():when type is pointClick,value must be xVal、yVal、xCode、seriesName、seriesIndex!");
                }	
                //console.dir('~~~~~~END~~~~~~~~~');
            }

        }else if(pType === 'chartValue' ){
            if( typeof chart ==='undefined' ){
                throw new Error("makeParamsData():when type is chartValue,arg chart must be set!");
            }
            if( pValue ==='xDataMax' ){
                ////console.dir(chart.series);
                paramsData[pName] = chart.xAxis[0].getExtremes().dataMax;
            }else if(pValue ==='xDataMin'){
                paramsData[pName] = chart.xAxis[0].getExtremes().dataMax;
            }else{
                //console.dir(val);
                throw new Error("makeParamsData():when type is chartValue, value must be xDataMax、xDataMin!");
            }
        }else if(pType === 'gridRowClick'){
        	/*
        	if( typeof grid ==='undefined' ){
                throw new Error("makeParamsData():when type is gridRowClick,arg grid must be set!");
            }
		    */
        	if( typeof ce ==='undefined' ){
                throw new Error("makeParamsData():when type is gridRowClick,arg ce must be set!");
            }
            if( typeof ce.currentTarget =='undefined' ){
                 //TODO 没有选择点
             	throw new Error("makeParamsData()::when type is gridRowClick,ce.currentTarget must be a grid!");
             }
        	if( typeof extObj ==='undefined' ){
                throw new Error("makeParamsData():when type is gridRowClick,arg extObj must be set!");
            }
             //debugger;
		     var rowData = jQuery( ce.currentTarget ).jqGrid('getRowData',extObj.rowId);
		 	 paramsData[pName] = rowData[ pValue ];
        	 //debugger;
        }else if(pType ==='fomatter'){
        	if(typeof pValue !== 'function'){
        		throw new Error('makeParamsData():when type if fomatter,value must be a function');
        	}else{
        		//do nothing
        	}
        	var argObj = {
        			"idSuffix" :idSuffix,
        			"extObj":extObj,
        			"event":ce
        	};
        	paramsData[pName] = pValue(argObj);
        }else{
            throw new Error("makeParamsData():params type must be constValue,pageCtrlValue,chartValue, pointClick or fomatter! but it's "+ pType);
        }
    } );
    //console.dir(paramsData);
	
	dfe();

    return paramsData;
}

function makeParamsStringRestful(paramsConfig, chart, idSuffix, ce, extObj ){
    var paramData =  makeParamsData( paramsConfig, idSuffix,chart ,ce ,extObj );
    //console.dir(paramData);
    var queryString ='';

    jQuery.each( paramData ,function(key,val){
        queryString = queryString + '/' + val ;
    });

    if(queryString.length < 1 ){
        return '';
    }else{
        return '/' + queryString.substring(1,queryString.length);
    }
}

function makeParamsString(paramsConfig, chart, idSuffix, ce, extObj ){
    var paramData =  makeParamsData( paramsConfig, idSuffix,chart ,ce ,extObj );
    //console.dir(paramData);
    var queryString ='';

    jQuery.each( paramData ,function(key,val){
        queryString = queryString + '&' + key + '=' + val ;
    });

    if(queryString.length < 1 ){
        return '';
    }else{
        return '?' + queryString.substring(1,queryString.length);
    }
}

function makeStringToParams(queryUrl){
	return jQuery.url(queryUrl).param();  
}

//添加收藏
function addFav(url,queryParams,data){
	//console.dir(data);
	//var pageQueryId = hsasGolbal.getMenuItemTimelinessInfo().pageQueryId;
	var qid = data.queryId;
	
	var queryUrl = url+'?offset=0&limit=1000&pageQueryId=0';
	jQuery.each(data.params,function(index,val){
		queryUrl = queryUrl +'&'+  index + '=' +val;
	});
	//console.dir(queryUrl);
	
	var ajaxId = 'ajax_fav_'+qid;
	hsasGolbal.addAjaxToTimelenessInfo(ajaxId,
				jQuery.ajax({
					url:'fav/add/'+qid,
					type:'POST',
					data:{
						'queryURL':queryUrl,
						'rn':hsasGolbal.rn()
					},
					dataType:'json',
					success:function(data){
						hsasGolbal.removeAjaxFromTimelenessInfo( ajaxId );
						if(data.success === true){
							alert('添加成功！');
						}else if(data.success === false){
							if(data.errCode==101){
								alert('该收藏已存在！');
							}else{
								alert('添加失败！');
							}
						}
						return false;
					},
					error:function(xhr,etype,eobj){
						if(etype!== 'abort'){
	   						hsasGolbal.removeAjaxFromTimelenessInfo( ajaxId );
	   						alert('添加失败');  	   							
						}
						return false;
					}
				}));
};
