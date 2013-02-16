/*
 * 确保queryId对应的图表配置已经加载，如果没有则立即加载
 * @param queryId [必须]图图表查询Id
 * @param successFunc [必须]图加载成功（或已经存在）的回调函数
 * @param errorFunc [必须]图加载失败的回调函数
 * @param loadingDiv 显示加载状态信息的div
 */
function gridConfigExist(queryId,successFunc,errorFunc,loadingDiv){
	//begin
	dfb();
	if( typeof hsasGrids['gridscfg'][queryId] ==='undefined' ){
		  var loading;
		  if(typeof loadingDiv !=='undefined'){
			  loading = jQuery('<img src="images/bussiness/loading.gif"></img>').appendTo('#'+loadingDiv);			  
		  }
		  var ajaxId = 'ajax_grid_js_'+ queryId +'_'+Math.floor(Math.random()*2000+1);
		    hsasGolbal.addAjaxToTimelenessInfo(ajaxId,
			    jQuery.ajax({
			        'url':'js/business/grid/'+queryId+'.js',
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
			            if(etype !== 'abort'){
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
function renderGridWithCfg(queryId, divIds, paramsCfg, chart, ce, extObj, successFunc,errorFunc){
	//begin
	dfb();
	//该图表相关的页面控件ID后缀
	var idSuffix = divIds['idSuffix'];
	if(typeof idSuffix === 'undefined'){
		idSuffix = '';
	}
    var paramsData = undefined;
    //清空搜索框之前先判断是否需要从当前界面取参，如钻取时要先取参后清空页面
	if(typeof paramsCfg !== 'undefined'){
		paramsData = makeParamsData( paramsCfg ,idSuffix ,chart ,ce ,extObj);
	}

	renderGridWithParams(queryId, divIds, paramsData, chart, ce, extObj, successFunc, errorFunc);
    //end
	dfe();
};function renderGridWithParams(queryId, divIds, paramsData, chart, ce, extObj, successFunc, errorFunc){
		/**
		 * 加载报表失败后展示失败信息
		 * @param errDiv 展示失败信息的div
		 */
		function loadGridError(errDiv){
			jQuery('#'+errDiv).children().remove();
			var ct =jQuery('<div></div>').addClass('chart_state').height(jQuery('#'+errDiv).height()).appendTo(  jQuery('#'+errDiv) );
			jQuery( ct ).append( jQuery('<div></div>').addClass('alpha')) ;
			jQuery( ct ).append( jQuery('<div>加载失败!</div>').addClass('fail') );
		}
		/**
		 * 加载包表时展示加载状态
		 * @param loadingDiv 展示加载状态的div
		 */
		function loadingGrid(loadingDiv){
			jQuery('#'+loadingDiv).children().remove();
			var ct =jQuery('<div></div>').addClass('chart_state').height(jQuery('#'+loadingDiv).height()).appendTo(  jQuery('#'+loadingDiv) );
			jQuery( ct ).append( jQuery('<div></div>').addClass('alpha')) ;
			jQuery( ct ).append( jQuery('<div>正在加载...</div>').addClass('loading') );
		}
		
		var idSuffix = divIds['idSuffix'];
		if(typeof idSuffix === 'undefined'){
			idSuffix = '';
		}
		
	   var titleDiv = divIds['titleDiv'];
       var colRemarkDiv = divIds['colRemarkDiv'];
       var searchDiv = divIds['searchDiv'];
       var refsDiv = divIds['refsDiv'];
       		//有配置和数据才能渲染
       var gridDiv = divIds['gridDiv'];
       		//有图表对象才能渲染
       var linkDiv = divIds['linkDiv'];
       var toolBtnDiv = divIds['toolBtnDiv'];
       var chartDiv = divIds['chartDiv'];
       //设置标题
       if( typeof titleDiv !== 'undefined'){
       	//var h1 =  jQuery('<h1>医疗卫生人员信息</h1>');
       	var title = jQuery('<h1>'+hsasGrids.gridscfg[queryId].title+'</h1>');
       	jQuery('#'+titleDiv).children().remove();
       	jQuery('#'+titleDiv).append(title);
       //	console.dir('添加标题');
       }
       //清空refsDiv
       if(typeof refsDiv !== 'undefined'){
       	jQuery('#'+refsDiv).children().remove();
        jQuery('#'+refsDiv).parent().hide();        	
       } //清空colRemarkDiv
       if(typeof colRemarkDiv !== 'undefined'){
    	   jQuery('#'+colRemarkDiv).children().remove();
       }
       //清空linkDiv
       if(typeof linkDiv !== 'undefined'){
    	   jQuery('#'+linkDiv).children().remove();
           jQuery('#'+linkDiv).parent().hide();     	   
       }
       //清空toolBtnDiv
       if(typeof toolBtnDiv !== 'undefined'){
    	   jQuery('#'+toolBtnDiv).children().remove();
       }

       if(hsasGolbal._currentMenuItem==='hsas_menu_item_fenxi'){
	 		//chartDiv高度先恢复默认值，否则以前撑大的Div不会还原
	 	    jQuery('#'+chartDiv).height(400);
	 	 }

       //清空gridDiv
       if(typeof gridDiv !== 'undefined'){
       		jQuery('#'+gridDiv).children().remove();
       }
       //清空chartDiv
       if( typeof chartDiv !== 'undefined'){
           jQuery('#'+chartDiv).children().remove();
           jQuery('<div></div>').attr('style','background:url(images/bussiness/bluebar_loading.gif) no-repeat center;').height(jQuery('#'+chartDiv).height()).appendTo( jQuery('#'+chartDiv) );
       }
       
       var gridIdSuffix = divIds['idSuffix'];
       if(typeof gridIdSuffix ==='undefined'){
    	   gridIdSuffix = '';
       }
       var gridBaseCfg = hsasGrids['common']['gridBase'];
     
       var theGridSysCfg = jQuery.extend({},true, hsasGrids['gridscfg'][queryId],gridBaseCfg);
       

       
       //----------------------------Begin 生成searchBox-------------------------------------
       ////console.dir(theChartSysCfg);
       if( typeof searchDiv !== 'undefined' ){
           var searchBox = jQuery('#'+searchDiv);
           searchBox.children().remove();
           searchBox.append(jQuery('<span><strong>统计条件</strong></span>'));
           //遍历生成查询条件
           if(typeof theGridSysCfg['searchBox'] !== 'undefined'){
               jQuery.each( theGridSysCfg['searchBox'],function(index,val){
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
                           jQuery('<span></span>').appendTo(ctrlBox).text( val.title );
                         //默认值
                           jQuery('<input type="text"></input>').attr('id',val.prefix+idSuffix).appendTo(ctrlBox).val( val.defaultValue ).attr('style',val.style);
                       }else if( val.type === 'select' ){//下拉框
                           jQuery('<span></span>').appendTo(ctrlBox).text( val.title );
                           var sel = jQuery('<select></select>').attr('id',val.prefix+idSuffix).appendTo(ctrlBox);
                           //遍历生成下拉框内容
                           jQuery.each(val.options ,function(oi,option){
                               var opt = jQuery('<option></option>').appendTo(sel).val( option.value ).text( option.title );
                               if( option.value === val.defaultValue ){
                               	//默认值
                                   opt.attr('selected',true);
                               }
                           });
                           sel.attr('style',val.style);
                       }else{
                           throw new Error('renderGridWithParams(): type ['+ val.type +'] in searchBox is not supported ' );
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
            	   if( ValidateSearchParams(queryId,divIds,true) ){
            		   var pd =  makeParamsData( theGridSysCfg.params, idSuffix);
            		   renderGridWithParams(queryId,divIds,pd);
            	   }else{
            		   alert('请输入正确的查询条件！');
            	   }
               });
               
               //如果传入params参数，则重新设定查询框控件中的值(钻取,后退等时传递的参数会覆盖掉默认值)
               //
               //console.dir(paramsData);
               if( typeof paramsData !=='undefined' ){
           		var paramCfgs = theGridSysCfg['params']; 
           		
               //	console.log('------------------');
               //	console.dir(paramCfgs);
               	jQuery.each(paramsData,function(pName,pValue){
               		//console.log('>> '+pName+':'+pValue);
                   	if( typeof paramCfgs !=='undefined'){
                   		
                   		//查找该参数项在params中配置
                   		param = undefined;
                   		jQuery.each(paramCfgs,function(pcIndex,paramCfg){
                   			if( paramCfg.name === pName ){
                   				param = paramCfg;
                   				//退出循环
                   				return false;
                   			}
                   		});
                   		
                   		//如果找到则判断该参数是否是控件（pageCtrlValue），是则赋新值
                   		if( typeof param !=='undefined'){
                   			if( param['type'] === 'pageCtrlValue' ){
                   			////	console.log('## '+'#'+param['value']+idSuffix+':'+pValue);
                   				jQuery('#'+param['value']+idSuffix).val(pValue);
                   			}
                   		}
                   	}
         
               	});
               }
           }

       }
       //----------------------------End 生成searchBox-------------------------------------
        
       //请求表格数据
       var ajaxId = 'grid_data_'+queryId+'_'+Math.floor(Math.random()*1024+1);
       hsasGolbal.addAjaxToTimelenessInfo(ajaxId,
       jQuery.ajax({
    	   url:theGridSysCfg.queryUrl,
    	   type:'POST',
    	   dataType:'json',
    	   data:paramsData,
    	   success:function(data){
    		    hsasGolbal.removeAjaxFromTimelenessInfo(ajaxId);
    		    if( typeof data !== 'undefined'){
	    		    if(data.success === true){
	    		    	//清除加载状态
	    		    	jQuery('#'+chartDiv).children().remove();
	    		    	var gridId = chartDiv+'_grid';
	    		        jQuery('<table></table>').attr('id',gridId).appendTo(jQuery('#'+chartDiv));
	
	    		        //取得grid配置
	    		        var gridcfg = jQuery.extend(true,{}, hsasGrids['common']['gridBase'] /*, { height:'100%',width:'100%'}*/);
	    		        gridcfg['colNames'] = theGridSysCfg['colNames'];
	    		        gridcfg['colModel'] = theGridSysCfg['colModel'];
	    		        $(gridcfg['colModel']).each(function(_cmi,_cmm){
	    		        	if(_cmm){
		    		     		_cmm['sortable']=false;
		    		     	}
	    		        });
	    		        
	    		        if( hsasGrids['gridscfg'][queryId]['grouping'] ){
	    		        	gridcfg['grouping'] =  hsasGrids['gridscfg'][queryId]['grouping'];
	    		        	gridcfg['groupingView'] = hsasGrids['gridscfg'][queryId]['groupingView'];
	    		        	gridcfg['sortname'] = gridcfg['groupingView']['groupField'][0];
	    		        }
	    		        
	    		        var dbClickRowCfg = theGridSysCfg['dbClickRow'] ; 
	    		        if(typeof dbClickRowCfg !== 'undefined'){
	    		        	//双击事件
	    		        	gridcfg['ondblClickRow'] = function(rowid,iRow,iCol,e){
	    		        		dbClickRowFunc(e,dbClickRowCfg,rowid,iRow,iCol);
	    		 		     };
	    		        }
	    		        if(typeof theGridSysCfg['cellClick']	 !== 'undefined'){
	    		        	//单元格点击事件
	    		        	gridcfg['onCellSelect'] = function(rowid,iCol,cellcontent,e){
	    		        		gridCellSelect(theGridSysCfg,rowid,iCol,cellcontent,e);
	    		 		     };
	    		        }
	    		        if(typeof theGridSysCfg['cellClickAll']	 !== 'undefined'){
	    		        	//单元格点击事件
	    		        	gridcfg['onCellSelect'] = function(rowid,iCol,cellcontent,e){
	    		        		gridCellAllSelect(theGridSysCfg,rowid,iCol,cellcontent,e);
	    		 		     };
	    		        }	    		        
	    		        //TODO:单击鼠标样式
	    		        /*
	    		          if(typeof theGridSysCfg['cellClick'] !== 'undefined'){
	    		        	jQuery.each(theGridSysCfg['cellClick'],function(cci,cc){
	    		        		//console.dir(cc);
	    		        		var cin = cc.colIndex;
	    		        		
	    		        	});
	    		        }*/
	    		        //合计行
	    		        var userData = {};
	    		        //底行，一般用于统计数据
	    		        if( true === theGridSysCfg['showUserData'] ){
	    		        	gridcfg['footerrow'] = true;
	    					gridcfg['userDataOnFooter'] = true;
	    		        }
	    		        
	    		        //列排序
	    		        if( typeof theGridSysCfg['sortname'] !=='undefined' ){
	    		        	gridcfg['sortname'] = theGridSysCfg['sortname'] ;
	    		        }
	    		        if( typeof theGridSysCfg['sortorder'] !=='undefined' ){
	    		        	gridcfg['sortorder'] = theGridSysCfg['sortorder'] ;
	    		        }    		        
	    		        //TODO:
	    		    //   debugger;
	    		    //    gridcfg.width='400px';
	    		    //    gridcfg.height='200px';
	    		        //初始化grid
	    		        jQuery("#"+gridId).jqGrid( gridcfg );
	    		        
	    		        //加载grid数据
	    		        jQuery("#"+gridId).data({divIds:divIds});
	    		        jQuery("#"+gridId).jqGrid('clearGridData');
	    		        if(data.items){
	    		        	for ( var i = 0; i <= data.items.length; i++) {
	    		        		jQuery('#'+gridId).jqGrid('addRowData', i + 1, data.items[i]);
	    		        	}
	    		        }
	    		        
	    		       
	    		        
	    		        
	/*
	    		        if(divIds['popuped']){
	    		        	var popWidth = (jQuery(window).width()>860) ? 860 : (jQuery(window).width()-20);
	    		        	var popHeight = (jQuery(window).height()>640) ? 640 : (jQuery(window).height()-20);
	    		        	var gw = popWidth;
	    		        	/*
	    		        	var gw = jQuery("#"+gridId).jqGrid('getGridParam','width');
	    		        	if(gw < 800){
	    		        		gw = 800;
	    		        	}
	    		        	debugger;
	    		        	
	    		        	//chart_popup内容区大小
	    		        	$('#cp_content').width(gw);
	    		        	//fancybox 窗口大小
	    		        	$('#fancybox-wrap').width(gw+40);
	    		        	//fancybox内容区宽度
	    		        	$('#fancybox-content').width(gw+22);
	    		        	//内容区内部div调节，滚动条和高度
	    		        	$('#fancybox-content').children('div').attr("style","overflow: auto;position:relative;width: initial;").height( ($('#fancybox-wrap').height()-20) );
	    		        	//居中（IE7不会自动居中）
	    		        	$.fancybox.center() ;
	    		        
	    		        }
	    		        
	    		   */
				    	 
	
	    		       
	    		        
	    		        
	   		    	 jQuery.each( gridcfg['colModel'],function(cmi,cm){
	   		    		 if(typeof cm === 'undefined'){
	   		    			 return true;
	   		    		 }
			    		 //TODO:列头颜色
			    		 if(cm && typeof cm['style'] !=='undefined'){
			    			 $(".ui-jqgrid-sortable[id $='"+cm['name']+"' ]").attr('style',cm['style']);
			    		 }
			    		 var userDataCfg = cm['userData'];
			    		 if(userDataCfg){
				    		 if(typeof userDataCfg === 'string'){
				    			 //结果值
				    			 var userDataValue = 0;
				    			 //数据列
			    				 var datalist = JSONSelect.match( '.'+cm['name'],data.items);
			    				 
			    				 if( datalist.length >0){
				    				 //求和
				    				 jQuery.each(datalist,function(dli,dld){
				    					 if( ! isNaN (dld)){
				    						 userDataValue += dld ;
				    					 }
					    			 });		    			
					    			
				    				 if(userDataCfg === 'sum'){ //求和
					    				 userData[cm['name']] = userDataValue.toFixed(2);	
					    			 }else if(userDataCfg === 'avg'){
					    				 userData[cm['name']] = (userDataValue/ datalist.length).toFixed(2);
					    			 }else{
					    				 throw new Error('unknown value of userData config for colModel:'+cm['name']);
					    			 }
			    				 }			    			 
				    		 }else if(typeof userDataCfg === 'function'){
				    			 //传入数据对象和当前userData对象
				    			 userData[cm['name']] = userDataCfg(jQuery("#"+gridId),userData);
				    		 }else{
				    			 throw new Error('unknown type of userData config for colModel:'+cm['name']);
				    		 }
			    		 }
			    	 });
	
	    		        //加载底行数据
	    		        if( gridcfg['userDataOnFooter'] ){
	    		        	if( data['userdata'] ){
	    		        		jQuery('#'+gridId).footerData('set',data['userdata'],true);
	    		        	}else{ 
	    		        		jQuery('#'+gridId).footerData('set',userData,true);	
	    		        	}
	    		        	
	    		        }
	    		        /*
	    		        if( hsasGrids['gridscfg'][queryId]['grouping'] ){
	    		        	jQuery("#"+gridId).jqGrid('groupingGroupBy', gridcfg['groupingView']['groupField']);
	    		        }
	    		        */
	      		       //TODO:多表头
				    	 //多表头
				    	 var groupHeaders = theGridSysCfg.groupHeaders;
				    	 if(typeof groupHeaders !== 'undefined'){
					    	// 没有多表头时IE调用会出错
				    		 if(jQuery("#"+gridId).data('groupHeader') === true){
				    			// alert(9);
						    	 jQuery("#"+gridId).jqGrid('destroyGroupHeader');			    			 
				    		 }
				    		 jQuery("#"+gridId).jqGrid('setGroupHeaders',groupHeaders);
				    		 jQuery("#"+gridId).data('groupHeader',true);
				    		 
				    	 }
	
	    		        /*
	    		        //grid 超宽时设置grid宽度，使之不超宽
	    		        var parentDivWidth = jQuery('#'+chartDiv).width();
	    		        var gridWidth = jQuery('#'+gridId).jqGrid('getGridParam','width');
	    		        if( isNaN(parentDivWidth) || isNaN(gridWidth) ){
	    		        	//console.dir(parentDivWidth+'|'+gridWidth);
	    		        }else{
	    		        	if( parentDivWidth < gridWidth){
	    		        		jQuery('#'+gridId).jqGrid('setGridWidth', parentDivWidth );
	    		        	}
	    		        }
	    		        */
	    		        
	    		        
	     		       

		    		        //冻结列
		     		        jQuery('#'+gridId).jqGrid('setFrozenColumns');
		     		        //TODO:[已解决]有bug，chrome 下四十一行会截断为20行，原因不明
		     		        jQuery("#"+gridId).trigger('reloadGrid');
	     		        
	     		        
	     		       //TODO:调整弹出窗口宽高
	    		       //弹出框根据grid的大小调整弹出框大小；
	    		       //非弹出框更加父元素调整grid大小
	     		       var gw = jQuery("#"+gridId).jqGrid('getGridParam','width');
	     		       var gh = 21 * data.items.length; 
	    		       // if(divIds['popuped']){
	    		        	 //grid 超宽时设置grid宽度，使之不超宽
		    		        var parentDivWidth = jQuery('#'+chartDiv).width();
		    		        var parentDivHeight = jQuery('#'+chartDiv).height();
	    		        	if( isNaN(parentDivWidth) || isNaN(gw) ){
	 	    		        	//console.dir(parentDivWidth+'|'+gridWidth);
	 	    		        }else{
	 	    		        	//if( parentDivWidth < gw){
	 	    		        		jQuery('#'+gridId).jqGrid('setGridWidth', parentDivWidth-20 );
	 	    		        //	}
	 	    		        }
	    		        	if(isNaN(parentDivHeight) || isNaN(gh) ){
	    		        		
	    		        	}else{
	    		        	//	if( parentDivHeight < gh){
	 	    		        		jQuery('#'+gridId).jqGrid('setGridHeight', parentDivHeight-20 );
	 	    		       // 	}
	    		        	}
	    		  //      }else{
	    		       	
	    		//        }
	     		        

	     		        
	    		        pushDrillHistory({
	    		        	type:'grid',
	    					divIds : divIds,
	    					queryParams : paramsData,
	    					queryId :queryId 
	    				},jQuery("#"+gridId),chart);
		            	if(typeof successFunc === 'function'){
		            		successFunc();	            	
			            }
	    		    }else{
	           			//加载失败，同样需要压入操作记录，否则会回退到上上一次
		            	pushDrillHistory({
		            			type:'grid',
								divIds : divIds,
								queryParams : paramsData,
								queryId : queryId
							});
		            	//TODO:检查错误码
		                //alert('加载数据失败！');
		            	loadGridError(chartDiv);
		            	if(typeof errorFunc === 'function'){
				            errorFunc();	            	
			            }
	    		    }
    		    }else{//返回null
    		    	//加载失败，同样需要压入操作记录，否则会回退到上上一次
	            	pushDrillHistory({
	            			type:'grid',
							divIds : divIds,
							queryParams : paramsData,
							queryId : queryId
						});
	            	//TODO:检查错误码
	                //alert('加载数据失败！');
	            	loadGridError(chartDiv);
	            	if(typeof errorFunc === 'function'){
			            errorFunc();	            	
		            }
    		    }
    		    
		    }
       		,error:function(xhr,etype,eobj){
       			hsasGolbal.removeAjaxFromTimelenessInfo(ajaxId);
       			//加载失败，同样需要压入操作记录，否则会回退到上上一次
            	pushDrillHistory({
            			type:'grid',
						divIds : divIds,
						queryParams : paramsData,
						queryId : queryId
					});
            	
            	if(xhr.status !== 400){
		    		 //alert("加载失败:"+error);
		        	if(etype !== 'abort'){
		        		loadGridError( divIds.chartDiv );    
			            if(typeof errorFunc === 'function'){
				            errorFunc();	            	
			            }
		            }
		    	 }else{
		    		 chartParamError(divIds.chartDiv);
		    		 //alert("输入条件有误");
		    	 }
            	
    	   }
       }));
};

function gridCellSelect(theGridSysCfg,rowid,iCol,cellcontent,clickEvent){
	var clickCol = theGridSysCfg.colModel[iCol-1]['index'];
	var cellClickCfg = theGridSysCfg.cellClick[clickCol]; 
	if(typeof cellClickCfg !== 'undefined' ){
     	var ce = jQuery.extend(true,{},clickEvent);
    	//点击的grid
    	var clickGrid = jQuery(ce.currentTarget);
        //取当前chart上的divIds
        var divIds =  jQuery( clickGrid ).data('divIds');
        var type = cellClickCfg.type; 
        if( type === 'chart' ){//TODO：未测试 钻取图表
        	// 显示加载标志
        	//clickChart.showLoading();
 
            chartConfigExist(newQueryId, function(){
	   	        renderChartWithCfg(newQueryId, newDivIds, undefined ,cellClickCfg.params, clickGrid, ce , {rowId:rowid,iCol:iCol,cellContent:cellcontent} );
            },function(xhr,etype,eobj){
                if( etype !== 'abort'){
                     alert('加载js失败！');
               }
            });
        	//debugger;
        }else if(type ==='grid'){//TODO：未测试钻取表格
        	
            var newDivIds = jQuery.extend(true,{},divIds);   	
        	var clickEventCfg = cellClickCfg.config;
        	if( typeof clickEventCfg === 'undefined' ){
        		clickEventCfg = cellClickCfg;
        	}
            var newQueryId = clickEventCfg.queryId;
        	gridConfigExist(newQueryId,function(){
	   	    	    renderGridWithCfg(newQueryId, newDivIds, clickEventCfg.params, clickGrid , ce, {rowId:rowid,iCol:iCol,cellContent:cellcontent}  );
        	},function(xhr,etype,eobj){
                if( etype !== 'abort'){
                    alert('加载js失败！');
                }
        	});
        }else if(type ==='url'){
            var queryurl = cellClickCfg.url;
            if( typeof cellClickCfg.params !== 'undefined' ){
                queryurl += makeParamsString( cellClickCfg.params , clickGrid , divIds.idSuffix , ce, {rowId:rowid,iCol:iCol,cellContent:cellcontent} );
            };
            window.open(encodeURI(queryurl),"");        	
        }else if(type === 'function'){
        	//TODO：grid cell 点击配置为function参数设计有待斟酌
        	var funName = cellClickCfg['fun'];
        	var f = eval(funName);
        	if(typeof f ==='function'){
        		arg = jQuery.merge([divIds,{rowId:rowid,iCol:iCol,cellContent:cellcontent,event:ce} ], cellClickCfg['args']);
        		f.apply( clickEvent,arg );
        	}
        }else{
           throw new Error('sysTohc():pointClick.type must be chart,but it\'s '+type);
        }	
	}else{
		//该列没有事件，do nothing
	}

};

function gridCellAllSelect(theGridSysCfg,rowid,iCol,cellcontent,clickEvent){

	var clickCol = theGridSysCfg.colModel[iCol-1]['index'];
	var cellClickCfg = theGridSysCfg.cellClickAll; 
	
	if(typeof cellClickCfg !== 'undefined' ){
		//空白单元格不能点击
		if( ! cellClickCfg['emptyCellSelect']){
			if( ! cellcontent || cellcontent == '&nbsp;'){
				return;
			}
		}
		var noClick = false;
		var exclude = cellClickCfg['exclude'] || [];
		jQuery(exclude).each(function(exIdx,exColName){
			if( clickCol === exColName ){
				noClick = true;
				return false;
			}
		});
		if(noClick){
			return;
		}
     	var ce = jQuery.extend(true,{},clickEvent);
    	//点击的grid
    	var clickGrid = jQuery(ce.currentTarget);
        //取当前chart上的divIds
        var divIds =  jQuery( clickGrid ).data('divIds');
        var type = cellClickCfg.type; 
        if( type === 'chart' ){//TODO：未测试 钻取图表
        	// 显示加载标志
        	//clickChart.showLoading();
 
            chartConfigExist(newQueryId, function(){
	   	        renderChartWithCfg(newQueryId, newDivIds, undefined ,cellClickCfg.params, clickGrid, ce , {rowId:rowid,iCol:iCol,cellContent:cellcontent} );
            },function(xhr,etype,eobj){
                if( etype !== 'abort'){
                     alert('加载js失败！');
               }
            });
        	//debugger;
        }else if(type ==='grid'){//TODO：未测试钻取表格
        	
            var newDivIds = jQuery.extend(true,{},divIds);   	
        	var clickEventCfg = cellClickCfg.config;
        	if( typeof clickEventCfg === 'undefined' ){
        		clickEventCfg = cellClickCfg;
        	}
            var newQueryId = clickEventCfg.queryId;
        	gridConfigExist(newQueryId,function(){
	   	    	    renderGridWithCfg(newQueryId, newDivIds, clickEventCfg.params, clickGrid , ce, {rowId:rowid,iCol:iCol,cellContent:cellcontent}  );
        	},function(xhr,etype,eobj){
                if( etype !== 'abort'){
                    alert('加载js失败！');
                }
        	});
        }else if(type ==='url'){
            var queryurl = cellClickCfg.url;
            if( typeof cellClickCfg.params !== 'undefined' ){
                queryurl += makeParamsString( cellClickCfg.params , clickGrid , divIds.idSuffix , ce, {rowId:rowid,iCol:iCol,cellContent:cellcontent} );
            };
            window.open(encodeURI(queryurl),"");        	
        }else if(type === 'function'){
        	//TODO：grid cell 点击配置为function参数设计有待斟酌
        	var funName = cellClickCfg['fun'];
        	var f = eval(funName);
        	if(typeof f ==='function'){
        		arg = jQuery.merge([divIds,{rowId:rowid,iCol:iCol,cellContent:cellcontent} ], cellClickCfg['args']);
        		f.apply( clickEvent,arg );
        	}
        }else{
           throw new Error('sysTohc():pointClick.type must be chart,but it\'s '+type);
        }	
	}else{
		//该列没有事件，do nothing
	}

};

function dbClickRowFunc(clickEvent ,dbClickRowCfg,rowid,iRow,iCol ){
	   //debugger;
     	var ce = jQuery.extend(true,{},clickEvent);
    	//点击的grid
    	var clickGrid = jQuery(ce.currentTarget);
        //取当前chart上的divIds
        var divIds =  jQuery( clickGrid ).data('divIds');
      
        //var chartDiv = divIds.chartDiv;
        var type = dbClickRowCfg.type; 
        if( type === 'chart' ){//钻取图表
        	// 显示加载标志
        	//clickChart.showLoading();
            chartConfigExist(newQueryId, function(){
	   	        renderChartWithCfg(newQueryId, newDivIds, undefined ,pointClickChartConfig.params, clickGrid, ce , {rowId:rowid,iRow:iRow,iCol:iCol} );
            },function(xhr,etype,eobj){
                if( etype !== 'abort'){
                     alert('加载js失败！');
               }
            });
        	//debugger;
        }else if(type ==='grid'){//TODO:钻取表格
        	
            var newDivIds = jQuery.extend(true,{},divIds);   	
        	var clickRowCfg = dbClickRowCfg.config;
            var newQueryId = clickRowCfg.queryId;
        	
        	gridConfigExist(newQueryId,function(){
	   	    	    renderGridWithCfg(newQueryId, newDivIds, clickRowCfg.params, clickGrid , ce, {rowId:rowid,iRow:iRow,iCol:iCol} );
        	},function(xhr,etype,eobj){
                if( etype !== 'abort'){
                    alert('加载js失败！');
                }
        	});
        }else if(type ==='url'){
            var queryurl = dbClickRowCfg.url;
            if(typeof dbClickRowCfg['paramsType'] !== 'undefined' &&  dbClickRowCfg['paramsType']==='restful'){
	            if( typeof dbClickRowCfg.params !== 'undefined' ){
	                queryurl += makeParamsStringRestful( dbClickRowCfg.params , clickGrid , divIds.idSuffix , ce, {rowId:rowid,iRow:iRow,iCol:iCol} );
	            };          	
            }else{

	            if( typeof dbClickRowCfg.params !== 'undefined' ){
	                queryurl += makeParamsString( dbClickRowCfg.params , clickGrid , divIds.idSuffix , ce, {rowId:rowid,iRow:iRow,iCol:iCol} );
	            };
            }
            window.open(encodeURI(queryurl),"");        	
        }else{
           throw new Error('sysTohc():pointClick.type must be chart,but it\'s '+type);
        }
}

