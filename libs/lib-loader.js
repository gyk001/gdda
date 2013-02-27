(function() {
  // Get any jquery=___ param from the query string.
  var jqversion = location.search.match(/[?&]jquery=(.*?)(?=&|$)/);
  var path;
  if(jqversion) {
    // A version was specified, load that version from code.jquery.com.
    path = 'http://code.jquery.com/jquery-' + jqversion[1] + '.js';
  } else {
    // No version was specified, load the local version.
    path = '../libs/jquery/1.8.3/jquery-1.8.3.js';
  }
  // This is the only time I'll ever use document.write, I promise!
  var nodes = ['<script src="' + path + '"></script>',
  // highcharts
  '<script src="../libs/highcharts/js/highcharts.js"></script>',
  //jsonselect
  '<script src="../libs/JSONSelect/jsonselect.js"></script>',
  // jqgrid
  '<script src="../libs/jqgrid/js/jquery.jqGrid.min.js"></script>',
  '<link rel="stylesheet" href="../libs/jqgrid/css/ui.jqgrid.css" media="screen">',
  // log4javascript
  '<link rel="stylesheet" type="text/css" media="screen,print" href="../libs/log/main.css"/>',
  '<script type="text/javascript" src="../libs/log/log4javascript.js"></script>',
  '<script type="text/javascript">',
  // <![CDATA[
  'var _log4javascript = log4javascript.getLogger("main");', 
  '_log4javascript.addAppender(new log4javascript.PopUpAppender());',
  //'log.debug("This is debugging message from the log4javascript basic demo page");',
  // ]]>
  '</script>',
  '<script src="../src/jquery.gdda.js"></script>',
  '<script src="../src/jquery.gdda.util.js"></script>', 
  '<script src="../src/jquery.gdda.core.option.js"></script>', 
  '<script src="../src/jquery.gdda.core.module.js"></script>',
  '<script src="../src/jquery.gdda.core.querybox.js"></script>',
  '<script src="../src/jquery.gdda.core.querybox.ctrls.js"></script>',
  '<script src="../src/jquery.gdda.core.js"></script>',
  '<script src="../src/module/jquery.gdda.module.nope.js"></script>',
  '<script src="../src/module/jquery.gdda.module.chart.js"></script>']

  for(var i = 0; i < nodes.length; i++) {
    document.write(nodes[i]);
  };

}());