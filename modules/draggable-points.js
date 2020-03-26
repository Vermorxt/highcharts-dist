/*
 Highcharts JS v8.0.4 (2020-03-26)

 (c) 2009-2019 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(f){"object"===typeof module&&module.exports?(f["default"]=f,module.exports=f):"function"===typeof define&&define.amd?define("highcharts/modules/draggable-points",["highcharts"],function(t){f(t);f.Highcharts=t;return f}):f("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(f){function t(f,m,k,t){f.hasOwnProperty(m)||(f[m]=t.apply(null,k))}f=f?f._modules:{};t(f,"modules/draggable-points.src.js",[f["parts/Globals.js"],f["parts/Point.js"],f["parts/Utilities.js"]],function(f,m,k){function t(a){return{left:"right",
right:"left",top:"bottom",bottom:"top"}[a]}function K(a){var b=["draggableX","draggableY"],c;p(a.dragDropProps,function(a){a.optionName&&b.push(a.optionName)});for(c=b.length;c--;)if(a.options.dragDrop[b[c]])return!0}function L(a){var b=a.series?a.series.length:0;if(a.hasCartesianSeries&&!a.polar)for(;b--;)if(a.series[b].options.dragDrop&&K(a.series[b]))return!0}function M(a){var b=a.series,c=b.options.dragDrop||{};a=a.options&&a.options.dragDrop;var d,e;p(b.dragDropProps,function(a){"x"===a.axis&&
a.move?d=!0:"y"===a.axis&&a.move&&(e=!0)});return(c.draggableX&&d||c.draggableY&&e)&&!(a&&!1===a.draggableX&&!1===a.draggableY)&&b.yAxis&&b.xAxis}function x(a,b){return"undefined"===typeof a.chartX||"undefined"===typeof a.chartY?b.pointer.normalize(a):a}function y(a,b,c,d){var e=b.map(function(b){return u(a,b,c,d)});return function(){e.forEach(function(a){a()})}}function N(a,b,c){var d=b.dragDropData.origin;b=d.chartX;d=d.chartY;var e=a.chartX;a=a.chartY;return Math.sqrt((e-b)*(e-b)+(a-d)*(a-d))>
c}function O(a,b,c){var d={chartX:a.chartX,chartY:a.chartY,guideBox:c&&{x:c.attr("x"),y:c.attr("y"),width:c.attr("width"),height:c.attr("height")},points:{}};b.forEach(function(b){var c={};p(b.series.dragDropProps,function(d,e){d=b.series[d.axis+"Axis"];c[e]=b[e];c[e+"Offset"]=d.toPixels(b[e])-(d.horiz?a.chartX:a.chartY)});c.point=b;d.points[b.id]=c});return d}function P(a){var b=a.series,c=[],d=b.options.dragDrop.groupBy;b.isSeriesBoosting?b.options.data.forEach(function(a,d){c.push((new b.pointClass).init(b,
a));c[c.length-1].index=d}):c=b.points;return a.options[d]?c.filter(function(b){return b.options[d]===a.options[d]}):[a]}function D(a,b){var c=P(b),d=b.series,e=d.chart,q;w(d.options.dragDrop&&d.options.dragDrop.liveRedraw,!0)||(e.dragGuideBox=q=d.getGuideBox(c),e.setGuideBoxState("default",d.options.dragDrop.guideBox).add(d.group));e.dragDropData={origin:O(a,c,q),point:b,groupedPoints:c,isDragging:!0}}function Q(a,b){var c=a.point,d=r(c.series.options.dragDrop,c.options.dragDrop),e={},q=a.updateProp,
C={};p(c.series.dragDropProps,function(a,b){if(!q||q===b&&a.resize&&(!a.optionName||!1!==d[a.optionName]))if(q||a.move&&("x"===a.axis&&d.draggableX||"y"===a.axis&&d.draggableY))e[b]=a});(q?[c]:a.groupedPoints).forEach(function(c){C[c.id]={point:c,newValues:c.getDropValues(a.origin,b,e)}});return C}function E(a,b){var c=a.dragDropData.newPoints;b=!1===b?!1:r({duration:400},a.options.chart.animation);a.isDragDropAnimating=!0;p(c,function(a){a.point.update(a.newValues,!1)});a.redraw(b);setTimeout(function(){delete a.isDragDropAnimating;
a.hoverPoint&&!a.dragHandles&&a.hoverPoint.showDragHandles()},b.duration)}function F(a){var b=a.series&&a.series.chart,c=b&&b.dragDropData;!b||!b.dragHandles||c&&(c.isDragging&&c.draggedPastSensitivity||c.isHoveringHandle===a.id)||b.hideDragHandles()}function G(a){var b=0,c;for(c in a)Object.hasOwnProperty.call(a,c)&&b++;return b}function H(a){for(var b in a)if(Object.hasOwnProperty.call(a,b))return a[b]}function R(a,b){if(!b.zoomOrPanKeyPressed(a)){var c=b.dragDropData;var d=0;if(c&&c.isDragging){var e=
c.point;d=e.series.options.dragDrop;a.preventDefault();c.draggedPastSensitivity||(c.draggedPastSensitivity=N(a,b,w(e.options.dragDrop&&e.options.dragDrop.dragSensitivity,d&&d.dragSensitivity,2)));c.draggedPastSensitivity&&(c.newPoints=Q(c,a),b=c.newPoints,d=G(b),b=1===d?H(b):null,e.firePointEvent("drag",{origin:c.origin,newPoints:c.newPoints,newPoint:b&&b.newValues,newPointId:b&&b.point.id,numNewPoints:d,chartX:a.chartX,chartY:a.chartY},function(){var b=e.series,c=b.chart,d=c.dragDropData,f=r(b.options.dragDrop,
e.options.dragDrop),g=f.draggableX,l=f.draggableY;b=d.origin;var h=a.chartX-b.chartX,z=a.chartY-b.chartY,n=h;d=d.updateProp;c.inverted&&(h=-z,z=-n);if(w(f.liveRedraw,!0))E(c,!1),e.showDragHandles();else if(d){g=h;c=z;n=e.series;l=n.chart;d=l.dragDropData;f=n.dragDropProps[d.updateProp];var k=d.newPoints[e.id].newValues;var m="function"===typeof f.resizeSide?f.resizeSide(k,e):f.resizeSide;f.beforeResize&&f.beforeResize(l.dragGuideBox,k,e);l=l.dragGuideBox;n="x"===f.axis&&n.xAxis.reversed||"y"===f.axis&&
n.yAxis.reversed?t(m):m;g="x"===f.axis?g-(d.origin.prevdX||0):0;c="y"===f.axis?c-(d.origin.prevdY||0):0;switch(n){case "left":var p={x:l.attr("x")+g,width:Math.max(1,l.attr("width")-g)};break;case "right":p={width:Math.max(1,l.attr("width")+g)};break;case "top":p={y:l.attr("y")+c,height:Math.max(1,l.attr("height")-c)};break;case "bottom":p={height:Math.max(1,l.attr("height")+c)}}l.attr(p)}else c.dragGuideBox.translate(g?h:0,l?z:0);b.prevdX=h;b.prevdY=z}))}}}function B(a,b){var c=b.dragDropData;if(c&&
c.isDragging&&c.draggedPastSensitivity){var d=c.point,e=c.newPoints,q=G(e),f=1===q?H(e):null;b.dragHandles&&b.hideDragHandles();a.preventDefault();b.cancelClick=!0;d.firePointEvent("drop",{origin:c.origin,chartX:a.chartX,chartY:a.chartY,newPoints:e,numNewPoints:q,newPoint:f&&f.newValues,newPointId:f&&f.point.id},function(){E(b)})}delete b.dragDropData;b.dragGuideBox&&(b.dragGuideBox.destroy(),delete b.dragGuideBox)}function S(a){var b=a.container,c=f.doc;L(a)&&(y(b,["mousedown","touchstart"],function(b){b=
x(b,a);var c=a.hoverPoint,d=r(c&&c.series.options.dragDrop,c&&c.options.dragDrop),f=d.draggableX||!1;d=d.draggableY||!1;a.cancelClick=!1;!f&&!d||a.zoomOrPanKeyPressed(b)||a.hasDraggedAnnotation||(a.dragDropData&&a.dragDropData.isDragging?B(b,a):c&&M(c)&&(a.mouseIsDown=!1,D(b,c),c.firePointEvent("dragStart",b)))}),y(b,["mousemove","touchmove"],function(b){R(x(b,a),a)}),u(b,"mouseleave",function(b){B(x(b,a),a)}),a.unbindDragDropMouseUp=y(c,["mouseup","touchend"],function(b){B(x(b,a),a)}),a.hasAddedDragDropEvents=
!0,u(a,"destroy",function(){a.unbindDragDropMouseUp&&a.unbindDragDropMouseUp()}))}"";var u=k.addEvent,T=k.clamp,r=k.merge,p=k.objectEach,w=k.pick,g=f.seriesTypes;k=function(a){a=a.shapeArgs||a.graphic.getBBox();var b=a.r||0,c=a.height/2;return["M",0,b,"L",0,c-5,"A",1,1,0,0,0,0,c+5,"A",1,1,0,0,0,0,c-5,"M",0,c+5,"L",0,a.height-b]};var A=g.line.prototype.dragDropProps={x:{axis:"x",move:!0},y:{axis:"y",move:!0}};g.flags&&(g.flags.prototype.dragDropProps=A);var h=g.column.prototype.dragDropProps={x:{axis:"x",
move:!0},y:{axis:"y",move:!1,resize:!0,beforeResize:function(a,b,c){var d=c.series.translatedThreshold,e=a.attr("y");b.y>=c.series.options.threshold?(b=a.attr("height"),a.attr({height:Math.max(0,Math.round(b+(d?d-(e+b):0)))})):a.attr({y:Math.round(e+(d?d-e:0))})},resizeSide:function(a,b){var c=b.series.chart.dragHandles;a=a.y>=(b.series.options.threshold||0)?"top":"bottom";b=t(a);c[b]&&(c[b].destroy(),delete c[b]);return a},handlePositioner:function(a){var b=a.shapeArgs||a.graphic.getBBox();return{x:b.x,
y:a.y>=(a.series.options.threshold||0)?b.y:b.y+b.height}},handleFormatter:function(a){a=a.shapeArgs;var b=a.r||0,c=a.width/2;return["M",b,0,"L",c-5,0,"A",1,1,0,0,0,c+5,0,"A",1,1,0,0,0,c-5,0,"M",c+5,0,"L",a.width-b,0]}}};g.bullet&&(g.bullet.prototype.dragDropProps={x:h.x,y:h.y,target:{optionName:"draggableTarget",axis:"y",move:!0,resize:!0,resizeSide:"top",handlePositioner:function(a){var b=a.targetGraphic.getBBox();return{x:a.barX,y:b.y+b.height/2}},handleFormatter:h.y.handleFormatter}});g.columnrange&&
(g.columnrange.prototype.dragDropProps={x:{axis:"x",move:!0},low:{optionName:"draggableLow",axis:"y",move:!0,resize:!0,resizeSide:"bottom",handlePositioner:function(a){a=a.shapeArgs||a.graphic.getBBox();return{x:a.x,y:a.y+a.height}},handleFormatter:h.y.handleFormatter,propValidate:function(a,b){return a<=b.high}},high:{optionName:"draggableHigh",axis:"y",move:!0,resize:!0,resizeSide:"top",handlePositioner:function(a){a=a.shapeArgs||a.graphic.getBBox();return{x:a.x,y:a.y}},handleFormatter:h.y.handleFormatter,
propValidate:function(a,b){return a>=b.low}}});g.boxplot&&(g.boxplot.prototype.dragDropProps={x:h.x,low:{optionName:"draggableLow",axis:"y",move:!0,resize:!0,resizeSide:"bottom",handlePositioner:function(a){return{x:a.shapeArgs.x,y:a.lowPlot}},handleFormatter:h.y.handleFormatter,propValidate:function(a,b){return a<=b.q1}},q1:{optionName:"draggableQ1",axis:"y",move:!0,resize:!0,resizeSide:"bottom",handlePositioner:function(a){return{x:a.shapeArgs.x,y:a.q1Plot}},handleFormatter:h.y.handleFormatter,
propValidate:function(a,b){return a<=b.median&&a>=b.low}},median:{axis:"y",move:!0},q3:{optionName:"draggableQ3",axis:"y",move:!0,resize:!0,resizeSide:"top",handlePositioner:function(a){return{x:a.shapeArgs.x,y:a.q3Plot}},handleFormatter:h.y.handleFormatter,propValidate:function(a,b){return a<=b.high&&a>=b.median}},high:{optionName:"draggableHigh",axis:"y",move:!0,resize:!0,resizeSide:"top",handlePositioner:function(a){return{x:a.shapeArgs.x,y:a.highPlot}},handleFormatter:h.y.handleFormatter,propValidate:function(a,
b){return a>=b.q3}}});g.ohlc&&(g.ohlc.prototype.dragDropProps={x:h.x,low:{optionName:"draggableLow",axis:"y",move:!0,resize:!0,resizeSide:"bottom",handlePositioner:function(a){return{x:a.shapeArgs.x,y:a.plotLow}},handleFormatter:h.y.handleFormatter,propValidate:function(a,b){return a<=b.open&&a<=b.close}},high:{optionName:"draggableHigh",axis:"y",move:!0,resize:!0,resizeSide:"top",handlePositioner:function(a){return{x:a.shapeArgs.x,y:a.plotHigh}},handleFormatter:h.y.handleFormatter,propValidate:function(a,
b){return a>=b.open&&a>=b.close}},open:{optionName:"draggableOpen",axis:"y",move:!0,resize:!0,resizeSide:function(a){return a.open>=a.close?"top":"bottom"},handlePositioner:function(a){return{x:a.shapeArgs.x,y:a.plotOpen}},handleFormatter:h.y.handleFormatter,propValidate:function(a,b){return a<=b.high&&a>=b.low}},close:{optionName:"draggableClose",axis:"y",move:!0,resize:!0,resizeSide:function(a){return a.open>=a.close?"bottom":"top"},handlePositioner:function(a){return{x:a.shapeArgs.x,y:a.plotClose}},
handleFormatter:h.y.handleFormatter,propValidate:function(a,b){return a<=b.high&&a>=b.low}}});if(g.arearange){A=g.columnrange.prototype.dragDropProps;var I=function(a){a=a.graphic?a.graphic.getBBox().width/2+1:4;return["M",0-a,0,"a",a,a,0,1,0,2*a,0,"a",a,a,0,1,0,-2*a,0]};g.arearange.prototype.dragDropProps={x:A.x,low:{optionName:"draggableLow",axis:"y",move:!0,resize:!0,resizeSide:"bottom",handlePositioner:function(a){return(a=a.lowerGraphic&&a.lowerGraphic.getBBox())?{x:a.x+a.width/2,y:a.y+a.height/
2}:{x:-999,y:-999}},handleFormatter:I,propValidate:A.low.propValidate},high:{optionName:"draggableHigh",axis:"y",move:!0,resize:!0,resizeSide:"top",handlePositioner:function(a){return(a=a.upperGraphic&&a.upperGraphic.getBBox())?{x:a.x+a.width/2,y:a.y+a.height/2}:{x:-999,y:-999}},handleFormatter:I,propValidate:A.high.propValidate}}}g.waterfall&&(g.waterfall.prototype.dragDropProps={x:h.x,y:r(h.y,{handleFormatter:function(a){return a.isSum||a.isIntermediateSum?null:h.y.handleFormatter(a)}})});if(g.xrange){var J=
function(a,b){var c=a.series,d=c.xAxis,e=c.yAxis,f=c.chart.inverted;b=d.toPixels(a[b],!0);var g=e.toPixels(a.y,!0);a=c.columnMetrics?c.columnMetrics.offset:-a.shapeArgs.height/2;f&&(b=d.len-b,g=e.len-g);return{x:Math.round(b),y:Math.round(g+a)}};k=g.xrange.prototype.dragDropProps={y:{axis:"y",move:!0},x:{optionName:"draggableX1",axis:"x",move:!0,resize:!0,resizeSide:"left",handlePositioner:function(a){return J(a,"x")},handleFormatter:k,propValidate:function(a,b){return a<=b.x2}},x2:{optionName:"draggableX2",
axis:"x",move:!0,resize:!0,resizeSide:"right",handlePositioner:function(a){return J(a,"x2")},handleFormatter:k,propValidate:function(a,b){return a>=b.x}}};g.gantt&&(g.gantt.prototype.dragDropProps={y:k.y,start:r(k.x,{optionName:"draggableStart",validateIndividualDrag:function(a){return!a.milestone}}),end:r(k.x2,{optionName:"draggableEnd",validateIndividualDrag:function(a){return!a.milestone}})})}"gauge pie sunburst wordcloud sankey histogram pareto vector windbarb treemap bellcurve sma map mapline".split(" ").forEach(function(a){g[a]&&
(g[a].prototype.dragDropProps=null)});var U={"default":{className:"highcharts-drag-box-default",lineWidth:1,lineColor:"#888",color:"rgba(0, 0, 0, 0.1)",cursor:"move",zIndex:900}},V={className:"highcharts-drag-handle",color:"#fff",lineColor:"rgba(0, 0, 0, 0.6)",lineWidth:1,zIndex:901};f.Chart.prototype.setGuideBoxState=function(a,b){var c=this.dragGuideBox;b=r(U,b);a=r(b["default"],b[a]);return c.attr({className:a.className,stroke:a.lineColor,strokeWidth:a.lineWidth,fill:a.color,cursor:a.cursor,zIndex:a.zIndex}).css({pointerEvents:"none"})};
m.prototype.getDropValues=function(a,b,c){var d=this,e=d.series,f=r(e.options.dragDrop,d.options.dragDrop),g={},h=a.points[d.id],k;for(k in c)if(Object.hasOwnProperty.call(c,k)){if("undefined"!==typeof m){var m=!1;break}m=!0}p(c,function(a,c){var q=h[c],n=e[a.axis+"Axis"];n=n.toValue((n.horiz?b.chartX:b.chartY)+h[c+"Offset"]);var v=a.axis.toUpperCase(),k=e[v.toLowerCase()+"Axis"].categories?1:0;k=w(f["dragPrecision"+v],k);var l=w(f["dragMin"+v],-Infinity);v=w(f["dragMax"+v],Infinity);k&&(n=Math.round(n/
k)*k);n=T(n,l,v);m&&a.propValidate&&!a.propValidate(n,d)||"undefined"===typeof q||(g[c]=n)});return g};f.Series.prototype.getGuideBox=function(a){var b=this.chart,c=Infinity,d=-Infinity,e=Infinity,f=-Infinity,g;a.forEach(function(a){(a=a.graphic&&a.graphic.getBBox()||a.shapeArgs)&&(a.width||a.height||a.x||a.y)&&(g=!0,c=Math.min(a.x,c),d=Math.max(a.x+a.width,d),e=Math.min(a.y,e),f=Math.max(a.y+a.height,f))});return g?b.renderer.rect(c,e,d-c,f-e):b.renderer.g()};m.prototype.showDragHandles=function(){var a=
this,b=a.series,c=b.chart,d=c.renderer,f=r(b.options.dragDrop,a.options.dragDrop);p(b.dragDropProps,function(e,g){var h=r(V,e.handleOptions,f.dragHandle),k={className:h.className,"stroke-width":h.lineWidth,fill:h.color,stroke:h.lineColor},m=h.pathFormatter||e.handleFormatter,l=e.handlePositioner;var p=e.validateIndividualDrag?e.validateIndividualDrag(a):!0;e.resize&&p&&e.resizeSide&&m&&(f["draggable"+e.axis.toUpperCase()]||f[e.optionName])&&!1!==f[e.optionName]&&(c.dragHandles||(c.dragHandles={group:d.g("drag-drop-handles").add(b.markerGroup||
b.group)}),c.dragHandles.point=a.id,l=l(a),k.d=p=m(a),m="function"===typeof e.resizeSide?e.resizeSide(a.options,a):e.resizeSide,!p||0>l.x||0>l.y||(k.cursor=h.cursor||"x"===e.axis!==!!c.inverted?"ew-resize":"ns-resize",(e=c.dragHandles[m])||(e=c.dragHandles[m]=d.path().add(c.dragHandles.group)),e.translate(l.x,l.y).attr(k),y(e.element,["touchstart","mousedown"],function(b){b=x(b,c);var d=a.series.chart;d.zoomOrPanKeyPressed(b)||(d.mouseIsDown=!1,D(b,a),d.dragDropData.updateProp=b.updateProp=g,a.firePointEvent("dragStart",
b),b.stopPropagation(),b.preventDefault())}),u(c.dragHandles.group.element,"mouseover",function(){c.dragDropData=c.dragDropData||{};c.dragDropData.isHoveringHandle=a.id}),y(c.dragHandles.group.element,["touchend","mouseout"],function(){var b=a.series.chart;b.dragDropData&&a.id===b.dragDropData.isHoveringHandle&&delete b.dragDropData.isHoveringHandle;b.hoverPoint||F(a)})))})};f.Chart.prototype.hideDragHandles=function(){this.dragHandles&&(p(this.dragHandles,function(a,b){"group"!==b&&a.destroy&&a.destroy()}),
this.dragHandles.group&&this.dragHandles.group.destroy&&this.dragHandles.group.destroy(),delete this.dragHandles)};u(m,"mouseOver",function(){var a=this;setTimeout(function(){var b=a.series,c=b&&b.chart,d=c&&c.dragDropData,e=c&&c.is3d&&c.is3d();!c||d&&d.isDragging&&d.draggedPastSensitivity||c.isDragDropAnimating||!b.options.dragDrop||e||(c.dragHandles&&c.hideDragHandles(),a.showDragHandles())},12)});u(m,"mouseOut",function(){var a=this;setTimeout(function(){a.series&&F(a)},10)});u(m,"remove",function(){var a=
this.series.chart,b=a.dragHandles;b&&b.point===this.id&&a.hideDragHandles()});f.Chart.prototype.zoomOrPanKeyPressed=function(a){var b=this.userOptions.chart||{},c=b.panKey&&b.panKey+"Key";return a[b.zoomKey&&b.zoomKey+"Key"]||a[c]};u(f.Chart,"render",function(){this.hasAddedDragDropEvents||S(this)})});t(f,"masters/modules/draggable-points.src.js",[],function(){})});
//# sourceMappingURL=draggable-points.js.map