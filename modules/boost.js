/*
 Highcharts JS v8.0.4 (2020-03-26)

 Boost module

 (c) 2010-2019 Highsoft AS
 Author: Torstein Honsi

 License: www.highcharts.com/license

 This is a Highcharts module that draws long data series on a canvas in order
 to increase performance of the initial load time and tooltip responsiveness.

 Compatible with WebGL compatible browsers (not IE < 11).

 If this module is taken in as part of the core
 - All the loading logic should be merged with core. Update styles in the
   core.
 - Most of the method wraps should probably be added directly in parent
   methods.

 Notes for boost mode
 - Area lines are not drawn
 - Lines are not drawn on scatter charts
 - Zones and negativeColor don't work
 - Dash styles are not rendered on lines.
 - Columns are always one pixel wide. Don't set the threshold too low.
 - Disable animations
 - Marker shapes are not supported: markers will always be circles, except
   heatmap series, where markers are always rectangles.

 Optimizing tips for users
 - Set extremes (min, max) explicitly on the axes in order for Highcharts to
   avoid computing extremes.
 - Set enableMouseTracking to false on the series to improve total rendering
      time.
 - The default threshold is set based on one series. If you have multiple,
   dense series, the combined number of points drawn gets higher, and you may
   want to set the threshold lower in order to use optimizations.
 - If drawing large scatter charts, it's beneficial to set the marker radius
   to a value less than 1. This is to add additional spacing to make the chart
   more readable.
 - If the value increments on both the X and Y axis aren't small, consider
   setting useGPUTranslations to true on the boost settings object. If you do
   this and the increments are small (e.g. datetime axis with small time
   increments) it may cause rendering issues due to floating point rounding
   errors, so your millage may vary.

 Settings
    There are two ways of setting the boost threshold:
    - Per series: boost based on number of points in individual series
    - Per chart: boost based on the number of series

  To set the series boost threshold, set seriesBoostThreshold on the chart
  object.
  To set the series-specific threshold, set boostThreshold on the series
  object.

  In addition, the following can be set in the boost object:
  {
      //Wether or not to use alpha blending
      useAlpha: boolean - default: true
      //Set to true to perform translations on the GPU.
      //Much faster, but may cause rendering issues
      //when using values far from 0 due to floating point
      //rounding issues
      useGPUTranslations: boolean - default: false
      //Use pre-allocated buffers, much faster,
      //but may cause rendering issues with some data sets
      usePreallocated: boolean - default: false
  }
*/
(function(c){"object"===typeof module&&module.exports?(c["default"]=c,module.exports=c):"function"===typeof define&&define.amd?define("highcharts/modules/boost",["highcharts"],function(n){c(n);c.Highcharts=n;return c}):c("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(c){function n(c,L,h,C){c.hasOwnProperty(L)||(c[L]=C.apply(null,h))}c=c?c._modules:{};n(c,"modules/boost/boostables.js",[],function(){return"area arearange column columnrange bar line scatter heatmap bubble treemap".split(" ")});
n(c,"modules/boost/boostable-map.js",[c["modules/boost/boostables.js"]],function(c){var q={};c.forEach(function(c){q[c]=1});return q});n(c,"modules/boost/wgl-shader.js",[c["parts/Utilities.js"]],function(c){var q=c.clamp,h=c.error,C=c.pick;return function(d){function c(){F.length&&h("[highcharts boost] shader error - "+F.join("\n"))}function k(b,a){var e=d.createShader("vertex"===a?d.VERTEX_SHADER:d.FRAGMENT_SHADER);d.shaderSource(e,b);d.compileShader(e);return d.getShaderParameter(e,d.COMPILE_STATUS)?
e:(F.push("when compiling "+a+" shader:\n"+d.getShaderInfoLog(e)),!1)}function v(){function D(a){return d.getUniformLocation(b,a)}var e=k("#version 100\n#define LN10 2.302585092994046\nprecision highp float;\nattribute vec4 aVertexPosition;\nattribute vec4 aColor;\nvarying highp vec2 position;\nvarying highp vec4 vColor;\nuniform mat4 uPMatrix;\nuniform float pSize;\nuniform float translatedThreshold;\nuniform bool hasThreshold;\nuniform bool skipTranslation;\nuniform float xAxisTrans;\nuniform float xAxisMin;\nuniform float xAxisMinPad;\nuniform float xAxisPointRange;\nuniform float xAxisLen;\nuniform bool  xAxisPostTranslate;\nuniform float xAxisOrdinalSlope;\nuniform float xAxisOrdinalOffset;\nuniform float xAxisPos;\nuniform bool  xAxisCVSCoord;\nuniform bool  xAxisIsLog;\nuniform bool  xAxisReversed;\nuniform float yAxisTrans;\nuniform float yAxisMin;\nuniform float yAxisMinPad;\nuniform float yAxisPointRange;\nuniform float yAxisLen;\nuniform bool  yAxisPostTranslate;\nuniform float yAxisOrdinalSlope;\nuniform float yAxisOrdinalOffset;\nuniform float yAxisPos;\nuniform bool  yAxisCVSCoord;\nuniform bool  yAxisIsLog;\nuniform bool  yAxisReversed;\nuniform bool  isBubble;\nuniform bool  bubbleSizeByArea;\nuniform float bubbleZMin;\nuniform float bubbleZMax;\nuniform float bubbleZThreshold;\nuniform float bubbleMinSize;\nuniform float bubbleMaxSize;\nuniform bool  bubbleSizeAbs;\nuniform bool  isInverted;\nfloat bubbleRadius(){\nfloat value = aVertexPosition.w;\nfloat zMax = bubbleZMax;\nfloat zMin = bubbleZMin;\nfloat radius = 0.0;\nfloat pos = 0.0;\nfloat zRange = zMax - zMin;\nif (bubbleSizeAbs){\nvalue = value - bubbleZThreshold;\nzMax = max(zMax - bubbleZThreshold, zMin - bubbleZThreshold);\nzMin = 0.0;\n}\nif (value < zMin){\nradius = bubbleZMin / 2.0 - 1.0;\n} else {\npos = zRange > 0.0 ? (value - zMin) / zRange : 0.5;\nif (bubbleSizeByArea && pos > 0.0){\npos = sqrt(pos);\n}\nradius = ceil(bubbleMinSize + pos * (bubbleMaxSize - bubbleMinSize)) / 2.0;\n}\nreturn radius * 2.0;\n}\nfloat translate(float val,\nfloat pointPlacement,\nfloat localA,\nfloat localMin,\nfloat minPixelPadding,\nfloat pointRange,\nfloat len,\nbool  cvsCoord,\nbool  isLog,\nbool  reversed\n){\nfloat sign = 1.0;\nfloat cvsOffset = 0.0;\nif (cvsCoord) {\nsign *= -1.0;\ncvsOffset = len;\n}\nif (isLog) {\nval = log(val) / LN10;\n}\nif (reversed) {\nsign *= -1.0;\ncvsOffset -= sign * len;\n}\nreturn sign * (val - localMin) * localA + cvsOffset + \n(sign * minPixelPadding);\n}\nfloat xToPixels(float value) {\nif (skipTranslation){\nreturn value;// + xAxisPos;\n}\nreturn translate(value, 0.0, xAxisTrans, xAxisMin, xAxisMinPad, xAxisPointRange, xAxisLen, xAxisCVSCoord, xAxisIsLog, xAxisReversed);// + xAxisPos;\n}\nfloat yToPixels(float value, float checkTreshold) {\nfloat v;\nif (skipTranslation){\nv = value;// + yAxisPos;\n} else {\nv = translate(value, 0.0, yAxisTrans, yAxisMin, yAxisMinPad, yAxisPointRange, yAxisLen, yAxisCVSCoord, yAxisIsLog, yAxisReversed);// + yAxisPos;\nif (v > yAxisLen) {\nv = yAxisLen;\n}\n}\nif (checkTreshold > 0.0 && hasThreshold) {\nv = min(v, translatedThreshold);\n}\nreturn v;\n}\nvoid main(void) {\nif (isBubble){\ngl_PointSize = bubbleRadius();\n} else {\ngl_PointSize = pSize;\n}\nvColor = aColor;\nif (skipTranslation && isInverted) {\ngl_Position = uPMatrix * vec4(aVertexPosition.y + yAxisPos, aVertexPosition.x + xAxisPos, 0.0, 1.0);\n} else if (isInverted) {\ngl_Position = uPMatrix * vec4(yToPixels(aVertexPosition.y, aVertexPosition.z) + yAxisPos, xToPixels(aVertexPosition.x) + xAxisPos, 0.0, 1.0);\n} else {\ngl_Position = uPMatrix * vec4(xToPixels(aVertexPosition.x) + xAxisPos, yToPixels(aVertexPosition.y, aVertexPosition.z) + yAxisPos, 0.0, 1.0);\n}\n}",
"vertex"),q=k("precision highp float;\nuniform vec4 fillColor;\nvarying highp vec2 position;\nvarying highp vec4 vColor;\nuniform sampler2D uSampler;\nuniform bool isCircle;\nuniform bool hasColor;\nvoid main(void) {\nvec4 col = fillColor;\nvec4 tcol;\nif (hasColor) {\ncol = vColor;\n}\nif (isCircle) {\ntcol = texture2D(uSampler, gl_PointCoord.st);\ncol *= tcol;\nif (tcol.r < 0.0) {\ndiscard;\n} else {\ngl_FragColor = col;\n}\n} else {\ngl_FragColor = col;\n}\n}","fragment");if(!e||!q)return b=!1,
c(),!1;b=d.createProgram();d.attachShader(b,e);d.attachShader(b,q);d.linkProgram(b);if(!d.getProgramParameter(b,d.LINK_STATUS))return F.push(d.getProgramInfoLog(b)),c(),b=!1;d.useProgram(b);d.bindAttribLocation(b,0,"aVertexPosition");t=D("uPMatrix");g=D("pSize");p=D("fillColor");u=D("isBubble");w=D("bubbleSizeAbs");E=D("bubbleSizeByArea");f=D("uSampler");a=D("skipTranslation");M=D("isCircle");m=D("isInverted");return!0}function r(a,e){d&&b&&(a=l[a]=l[a]||d.getUniformLocation(b,a),d.uniform1f(a,e))}
var l={},b,t,g,p,u,w,E,a,M,m,F=[],f;return d&&!v()?!1:{psUniform:function(){return g},pUniform:function(){return t},fillColorUniform:function(){return p},setBubbleUniforms:function(a,e,f){var c=a.options,g=Number.MAX_VALUE,m=-Number.MAX_VALUE;d&&b&&"bubble"===a.type&&(g=C(c.zMin,q(e,!1===c.displayNegative?c.zThreshold:-Number.MAX_VALUE,g)),m=C(c.zMax,Math.max(m,f)),d.uniform1i(u,1),d.uniform1i(M,1),d.uniform1i(E,"width"!==a.options.sizeBy),d.uniform1i(w,a.options.sizeByAbsoluteValue),r("bubbleZMin",
g),r("bubbleZMax",m),r("bubbleZThreshold",a.options.zThreshold),r("bubbleMinSize",a.minPxSize),r("bubbleMaxSize",a.maxPxSize))},bind:function(){d&&b&&d.useProgram(b)},program:function(){return b},create:v,setUniform:r,setPMatrix:function(a){d&&b&&d.uniformMatrix4fv(t,!1,a)},setColor:function(a){d&&b&&d.uniform4f(p,a[0]/255,a[1]/255,a[2]/255,a[3])},setPointSize:function(a){d&&b&&d.uniform1f(g,a)},setSkipTranslation:function(f){d&&b&&d.uniform1i(a,!0===f?1:0)},setTexture:function(a){d&&b&&d.uniform1i(f,
a)},setDrawAsCircle:function(a){d&&b&&d.uniform1i(M,a?1:0)},reset:function(){d&&b&&(d.uniform1i(u,0),d.uniform1i(M,0))},setInverted:function(a){d&&b&&d.uniform1i(m,a)},destroy:function(){d&&b&&(d.deleteProgram(b),b=!1)}}}});n(c,"modules/boost/wgl-vbuffer.js",[],function(){return function(c,L,h){function q(){d&&(c.deleteBuffer(d),A=d=!1);r=0;k=h||2;l=[]}var d=!1,A=!1,k=h||2,v=!1,r=0,l;return{destroy:q,bind:function(){if(!d)return!1;c.vertexAttribPointer(A,k,c.FLOAT,!1,0,0)},data:l,build:function(b,
h,g){var p;l=b||[];if(!(l&&0!==l.length||v))return q(),!1;k=g||k;d&&c.deleteBuffer(d);v||(p=new Float32Array(l));d=c.createBuffer();c.bindBuffer(c.ARRAY_BUFFER,d);c.bufferData(c.ARRAY_BUFFER,v||p,c.STATIC_DRAW);A=c.getAttribLocation(L.program(),h);c.enableVertexAttribArray(A);return!0},render:function(b,q,g){var p=v?v.length:l.length;if(!d||!p)return!1;if(!b||b>p||0>b)b=0;if(!q||q>p)q=p;c.drawArrays(c[(g||"points").toUpperCase()],b/k,(q-b)/k);return!0},allocate:function(b){r=-1;v=new Float32Array(4*
b)},push:function(b,c,d,p){v&&(v[++r]=b,v[++r]=c,v[++r]=d,v[++r]=p)}}}});n(c,"modules/boost/wgl-renderer.js",[c["parts/Globals.js"],c["modules/boost/wgl-shader.js"],c["modules/boost/wgl-vbuffer.js"],c["parts/Color.js"],c["parts/Utilities.js"]],function(c,L,h,C,d){var q=C.parse,k=d.isNumber,v=d.merge,r=d.objectEach,l=d.pick,b=c.win.document;return function(d){function g(a){if(a.isSeriesBoosting){var b=!!a.options.stacking;var e=a.xData||a.options.xData||a.processedXData;b=(b?a.data:e||a.options.data).length;
"treemap"===a.type?b*=12:"heatmap"===a.type?b*=6:X[a.type]&&(b*=2);return b}return 0}function p(){e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT)}function u(a,b){function e(a){a&&(b.colorData.push(a[0]),b.colorData.push(a[1]),b.colorData.push(a[2]),b.colorData.push(a[3]))}function c(a,b,c,f,d){e(d);z.usePreallocated?D.push(a,b,c?1:0,f||1):(n.push(a),n.push(b),n.push(c?1:0),n.push(f||1))}function f(){b.segments.length&&(b.segments[b.segments.length-1].to=n.length)}function d(){b.segments.length&&b.segments[b.segments.length-
1].from===n.length||(f(),b.segments.push({from:n.length}))}function g(a,b,f,d,x){e(x);c(a+f,b);e(x);c(a,b);e(x);c(a,b+d);e(x);c(a,b+d);e(x);c(a+f,b+d);e(x);c(a+f,b)}function M(a,e){z.useGPUTranslations||(b.skipTranslation=!0,a.x=r.toPixels(a.x,!0),a.y=t.toPixels(a.y,!0));e?n=[a.x,a.y,0,2].concat(n):c(a.x,a.y,0,2)}var m=a.pointArrayMap&&"low,high"===a.pointArrayMap.join(","),T=a.chart,x=a.options,p=!!x.stacking,k=x.data,l=a.xAxis.getExtremes(),F=l.min;l=l.max;var u=a.yAxis.getExtremes(),h=u.min;u=
u.max;var w=a.xData||x.xData||a.processedXData,v=a.yData||x.yData||a.processedYData,E=a.zData||x.zData||a.processedZData,t=a.yAxis,r=a.xAxis,A=a.chart.plotWidth,L=!w||0===w.length,J=x.connectNulls,y=a.points||!1,K=!1,Z=!1,O;k=p?a.data:w||k;w={x:Number.MAX_VALUE,y:0};var N={x:-Number.MAX_VALUE,y:0},S=0,W=!1,I=-1,Q=!1,U=!1,R="undefined"===typeof T.index,fa=!1,ha=!1;var G=!1;var ua=X[a.type],ia=!1,qa=!0,ra=!0,Y=x.zones||!1,V=!1,sa=x.threshold,ja=!1;if(!(x.boostData&&0<x.boostData.length)){x.gapSize&&
(ja="value"!==x.gapUnit?x.gapSize*a.closestPointRange:x.gapSize);Y&&(Y.some(function(a){return"undefined"===typeof a.value?(V=new C(a.color),!0):!1}),V||(V=a.pointAttribs&&a.pointAttribs().fill||a.color,V=new C(V)));T.inverted&&(A=a.chart.plotHeight);a.closestPointRangePx=Number.MAX_VALUE;d();if(y&&0<y.length)b.skipTranslation=!0,b.drawMode="triangles",y[0].node&&y[0].node.levelDynamic&&y.sort(function(a,b){if(a.node){if(a.node.levelDynamic>b.node.levelDynamic)return 1;if(a.node.levelDynamic<b.node.levelDynamic)return-1}return 0}),
y.forEach(function(b){var c=b.plotY;if("undefined"!==typeof c&&!isNaN(c)&&null!==b.y){c=b.shapeArgs;var e=T.styledMode?b.series.colorAttribs(b):e=b.series.pointAttribs(b);b=e["stroke-width"]||0;G=q(e.fill).rgba;G[0]/=255;G[1]/=255;G[2]/=255;"treemap"===a.type&&(b=b||1,O=q(e.stroke).rgba,O[0]/=255,O[1]/=255,O[2]/=255,g(c.x,c.y,c.width,c.height,O),b/=2);"heatmap"===a.type&&T.inverted&&(c.x=r.len-c.x,c.y=t.len-c.y,c.width=-c.width,c.height=-c.height);g(c.x+b,c.y+b,c.width-2*b,c.height-2*b,G)}});else{for(;I<
k.length-1;){var H=k[++I];if(R)break;if(L){y=H[0];var B=H[1];k[I+1]&&(U=k[I+1][0]);k[I-1]&&(Q=k[I-1][0]);if(3<=H.length){var ta=H[2];H[2]>b.zMax&&(b.zMax=H[2]);H[2]<b.zMin&&(b.zMin=H[2])}}else y=H,B=v[I],k[I+1]&&(U=k[I+1]),k[I-1]&&(Q=k[I-1]),E&&E.length&&(ta=E[I],E[I]>b.zMax&&(b.zMax=E[I]),E[I]<b.zMin&&(b.zMin=E[I]));if(J||null!==y&&null!==B){U&&U>=F&&U<=l&&(fa=!0);Q&&Q>=F&&Q<=l&&(ha=!0);if(m){L&&(B=H.slice(1,3));var ba=B[0];B=B[1]}else p&&(y=H.x,B=H.stackY,ba=B-H.y);null!==h&&"undefined"!==typeof h&&
null!==u&&"undefined"!==typeof u&&(qa=B>=h&&B<=u);y>l&&N.x<l&&(N.x=y,N.y=B);y<F&&w.x>F&&(w.x=y,w.y=B);if(null!==B||!J)if(null!==B&&(qa||fa||ha)){if((U>=F||y>=F)&&(Q<=l||y<=l)&&(ia=!0),ia||fa||ha){ja&&y-Q>ja&&d();Y&&(G=V.rgba,Y.some(function(a,b){b=Y[b-1];if("undefined"!==typeof a.value&&B<=a.value){if(!b||B>=b.value)G=q(a.color).rgba;return!0}return!1}),G[0]/=255,G[1]/=255,G[2]/=255);if(!z.useGPUTranslations&&(b.skipTranslation=!0,y=r.toPixels(y,!0),B=t.toPixels(B,!0),y>A&&"points"===b.drawMode))continue;
if(ua){H=ba;if(!1===ba||"undefined"===typeof ba)H=0>B?B:0;m||p||(H=Math.max(null===sa?h:sa,h));z.useGPUTranslations||(H=t.toPixels(H,!0));c(y,H,0,0,G)}b.hasMarkers&&ia&&!1!==K&&(a.closestPointRangePx=Math.min(a.closestPointRangePx,Math.abs(y-K)));!z.useGPUTranslations&&!z.usePreallocated&&K&&1>Math.abs(y-K)&&Z&&1>Math.abs(B-Z)?z.debug.showSkipSummary&&++S:(x.step&&!ra&&c(y,Z,0,2,G),c(y,B,0,"bubble"===a.type?ta||1:2,G),K=y,Z=B,W=!0,ra=!1)}}else d()}else d()}z.debug.showSkipSummary&&console.log("skipped points:",
S);W||!1===J||"line_strip"!==a.drawMode||(w.x<Number.MAX_VALUE&&M(w,!0),N.x>-Number.MAX_VALUE&&M(N))}f()}}function w(){J=[];W.data=n=[];S=[];D&&D.destroy()}function E(a){f&&(f.setUniform("xAxisTrans",a.transA),f.setUniform("xAxisMin",a.min),f.setUniform("xAxisMinPad",a.minPixelPadding),f.setUniform("xAxisPointRange",a.pointRange),f.setUniform("xAxisLen",a.len),f.setUniform("xAxisPos",a.pos),f.setUniform("xAxisCVSCoord",!a.horiz),f.setUniform("xAxisIsLog",a.isLog),f.setUniform("xAxisReversed",!!a.reversed))}
function a(a){f&&(f.setUniform("yAxisTrans",a.transA),f.setUniform("yAxisMin",a.min),f.setUniform("yAxisMinPad",a.minPixelPadding),f.setUniform("yAxisPointRange",a.pointRange),f.setUniform("yAxisLen",a.len),f.setUniform("yAxisPos",a.pos),f.setUniform("yAxisCVSCoord",!a.horiz),f.setUniform("yAxisIsLog",a.isLog),f.setUniform("yAxisReversed",!!a.reversed))}function M(a,b){f.setUniform("hasThreshold",a);f.setUniform("translatedThreshold",b)}function m(b){if(b)t=b.chartWidth||800,A=b.chartHeight||400;
else return!1;if(!(e&&t&&A&&f))return!1;z.debug.timeRendering&&console.time("gl rendering");e.canvas.width=t;e.canvas.height=A;f.bind();e.viewport(0,0,t,A);f.setPMatrix([2/t,0,0,0,0,-(2/A),0,0,0,0,-2,0,-1,1,-1,1]);1<z.lineWidth&&!c.isMS&&e.lineWidth(z.lineWidth);D.build(W.data,"aVertexPosition",4);D.bind();f.setInverted(b.inverted);J.forEach(function(c,d){var g=c.series.options,m=g.marker;var p="undefined"!==typeof g.lineWidth?g.lineWidth:1;var F=g.threshold,u=k(F),w=c.series.yAxis.getThreshold(F);
F=l(g.marker?g.marker.enabled:null,c.series.xAxis.isRadial?!0:null,c.series.closestPointRangePx>2*((g.marker?g.marker.radius:10)||10));m=K[m&&m.symbol||c.series.symbol]||K.circle;if(!(0===c.segments.length||c.segmentslength&&c.segments[0].from===c.segments[0].to)){m.isReady&&(e.bindTexture(e.TEXTURE_2D,m.handle),f.setTexture(m.handle));b.styledMode?m=c.series.markerGroup&&c.series.markerGroup.getStyle("fill"):(m=c.series.pointAttribs&&c.series.pointAttribs().fill||c.series.color,g.colorByPoint&&(m=
c.series.chart.options.colors[d]));c.series.fillOpacity&&g.fillOpacity&&(m=(new C(m)).setOpacity(l(g.fillOpacity,1)).get());m=q(m).rgba;z.useAlpha||(m[3]=1);"lines"===c.drawMode&&z.useAlpha&&1>m[3]&&(m[3]/=10);"add"===g.boostBlending?(e.blendFunc(e.SRC_ALPHA,e.ONE),e.blendEquation(e.FUNC_ADD)):"mult"===g.boostBlending||"multiply"===g.boostBlending?e.blendFunc(e.DST_COLOR,e.ZERO):"darken"===g.boostBlending?(e.blendFunc(e.ONE,e.ONE),e.blendEquation(e.FUNC_MIN)):e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,
e.ONE,e.ONE_MINUS_SRC_ALPHA);f.reset();0<c.colorData.length&&(f.setUniform("hasColor",1),d=h(e,f),d.build(c.colorData,"aColor",4),d.bind());f.setColor(m);E(c.series.xAxis);a(c.series.yAxis);M(u,w);"points"===c.drawMode&&(g.marker&&k(g.marker.radius)?f.setPointSize(2*g.marker.radius):f.setPointSize(1));f.setSkipTranslation(c.skipTranslation);"bubble"===c.series.type&&f.setBubbleUniforms(c.series,c.zMin,c.zMax);f.setDrawAsCircle(R[c.series.type]||!1);if(0<p||"line_strip"!==c.drawMode)for(p=0;p<c.segments.length;p++)D.render(c.segments[p].from,
c.segments[p].to,c.drawMode);if(c.hasMarkers&&F)for(g.marker&&k(g.marker.radius)?f.setPointSize(2*g.marker.radius):f.setPointSize(10),f.setDrawAsCircle(!0),p=0;p<c.segments.length;p++)D.render(c.segments[p].from,c.segments[p].to,"POINTS")}});z.debug.timeRendering&&console.timeEnd("gl rendering");d&&d();w()}function F(a){p();if(a.renderer.forExport)return m(a);N?m(a):setTimeout(function(){F(a)},1)}var f=!1,D=!1,e=!1,t=0,A=0,n=!1,S=!1,W={},N=!1,J=[],K={},X={column:!0,columnrange:!0,bar:!0,area:!0,arearange:!0},
R={scatter:!0,bubble:!0},z={pointSize:1,lineWidth:1,fillColor:"#AA00AA",useAlpha:!0,usePreallocated:!1,useGPUTranslations:!1,debug:{timeRendering:!1,timeSeriesProcessing:!1,timeSetup:!1,timeBufferCopy:!1,timeKDTree:!1,showSkipSummary:!1}};return W={allocateBufferForSingleSeries:function(a){var b=0;z.usePreallocated&&(a.isSeriesBoosting&&(b=g(a)),D.allocate(b))},pushSeries:function(a){0<J.length&&J[J.length-1].hasMarkers&&(J[J.length-1].markerTo=S.length);z.debug.timeSeriesProcessing&&console.time("building "+
a.type+" series");J.push({segments:[],markerFrom:S.length,colorData:[],series:a,zMin:Number.MAX_VALUE,zMax:-Number.MAX_VALUE,hasMarkers:a.options.marker?!1!==a.options.marker.enabled:!1,showMarkers:!0,drawMode:{area:"lines",arearange:"lines",areaspline:"line_strip",column:"lines",columnrange:"lines",bar:"lines",line:"line_strip",scatter:"points",heatmap:"triangles",treemap:"triangles",bubble:"points"}[a.type]||"line_strip"});u(a,J[J.length-1]);z.debug.timeSeriesProcessing&&console.timeEnd("building "+
a.type+" series")},setSize:function(a,b){t===a&&A===b||!f||(t=a,A=b,f.bind(),f.setPMatrix([2/t,0,0,0,0,-(2/A),0,0,0,0,-2,0,-1,1,-1,1]))},inited:function(){return N},setThreshold:M,init:function(a,c){function d(a,c){var d={isReady:!1,texture:b.createElement("canvas"),handle:e.createTexture()},g=d.texture.getContext("2d");K[a]=d;d.texture.width=512;d.texture.height=512;g.mozImageSmoothingEnabled=!1;g.webkitImageSmoothingEnabled=!1;g.msImageSmoothingEnabled=!1;g.imageSmoothingEnabled=!1;g.strokeStyle=
"rgba(255, 255, 255, 0)";g.fillStyle="#FFF";c(g);try{e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,d.handle),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,d.texture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.bindTexture(e.TEXTURE_2D,null),d.isReady=!0}catch(P){}}var g=0,m=["webgl",
"experimental-webgl","moz-webgl","webkit-3d"];N=!1;if(!a)return!1;for(z.debug.timeSetup&&console.time("gl setup");g<m.length&&!(e=a.getContext(m[g],{}));g++);if(e)c||w();else return!1;e.enable(e.BLEND);e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);e.disable(e.DEPTH_TEST);e.depthFunc(e.LESS);f=L(e);if(!f)return!1;D=h(e,f);d("circle",function(a){a.beginPath();a.arc(256,256,256,0,2*Math.PI);a.stroke();a.fill()});d("square",function(a){a.fillRect(0,0,512,512)});d("diamond",function(a){a.beginPath();
a.moveTo(256,0);a.lineTo(512,256);a.lineTo(256,512);a.lineTo(0,256);a.lineTo(256,0);a.fill()});d("triangle",function(a){a.beginPath();a.moveTo(0,512);a.lineTo(256,0);a.lineTo(512,512);a.lineTo(0,512);a.fill()});d("triangle-down",function(a){a.beginPath();a.moveTo(0,0);a.lineTo(256,512);a.lineTo(512,0);a.lineTo(0,0);a.fill()});N=!0;z.debug.timeSetup&&console.timeEnd("gl setup");return!0},render:F,settings:z,valid:function(){return!1!==e},clear:p,flush:w,setXAxis:E,setYAxis:a,data:n,gl:function(){return e},
allocateBuffer:function(a){var b=0;z.usePreallocated&&(a.series.forEach(function(a){a.isSeriesBoosting&&(b+=g(a))}),D.allocate(b))},destroy:function(){w();D.destroy();f.destroy();e&&(r(K,function(a){K[a].handle&&e.deleteTexture(K[a].handle)}),e.canvas.width=1,e.canvas.height=1)},setOptions:function(a){v(!0,z,a)}}}});n(c,"modules/boost/boost-attach.js",[c["parts/Globals.js"],c["modules/boost/wgl-renderer.js"],c["parts/Utilities.js"]],function(c,n,h){var q=h.error,d=c.win.document,A=d.createElement("canvas");
return function(k,h){var r=k.chartWidth,l=k.chartHeight,b=k,t=k.seriesGroup||h.group,g=d.implementation.hasFeature("www.http://w3.org/TR/SVG11/feature#Extensibility","1.1");b=k.isChartSeriesBoosting()?k:h;g=!1;b.renderTarget||(b.canvas=A,k.renderer.forExport||!g?(b.renderTarget=k.renderer.image("",0,0,r,l).addClass("highcharts-boost-canvas").add(t),b.boostClear=function(){b.renderTarget.attr({href:""})},b.boostCopy=function(){b.boostResizeTarget();b.renderTarget.attr({href:b.canvas.toDataURL("image/png")})}):
(b.renderTargetFo=k.renderer.createElement("foreignObject").add(t),b.renderTarget=d.createElement("canvas"),b.renderTargetCtx=b.renderTarget.getContext("2d"),b.renderTargetFo.element.appendChild(b.renderTarget),b.boostClear=function(){b.renderTarget.width=b.canvas.width;b.renderTarget.height=b.canvas.height},b.boostCopy=function(){b.renderTarget.width=b.canvas.width;b.renderTarget.height=b.canvas.height;b.renderTargetCtx.drawImage(b.canvas,0,0)}),b.boostResizeTarget=function(){r=k.chartWidth;l=k.chartHeight;
(b.renderTargetFo||b.renderTarget).attr({x:0,y:0,width:r,height:l}).css({pointerEvents:"none",mixedBlendMode:"normal",opacity:1});b instanceof c.Chart&&b.markerGroup.translate(k.plotLeft,k.plotTop)},b.boostClipRect=k.renderer.clipRect(),(b.renderTargetFo||b.renderTarget).clip(b.boostClipRect),b instanceof c.Chart&&(b.markerGroup=b.renderer.g().add(t),b.markerGroup.translate(h.xAxis.pos,h.yAxis.pos)));b.canvas.width=r;b.canvas.height=l;b.boostClipRect.attr(k.getBoostClipRect(b));b.boostResizeTarget();
b.boostClear();b.ogl||(b.ogl=n(function(){b.ogl.settings.debug.timeBufferCopy&&console.time("buffer copy");b.boostCopy();b.ogl.settings.debug.timeBufferCopy&&console.timeEnd("buffer copy")}),b.ogl.init(b.canvas)||q("[highcharts boost] - unable to init WebGL renderer"),b.ogl.setOptions(k.options.boost||{}),b instanceof c.Chart&&b.ogl.allocateBuffer(k));b.ogl.setSize(r,l);return b.ogl}});n(c,"modules/boost/boost-utils.js",[c["parts/Globals.js"],c["modules/boost/boostable-map.js"],c["modules/boost/boost-attach.js"],
c["parts/Utilities.js"]],function(c,n,h,C){function d(){for(var b=[],c=0;c<arguments.length;c++)b[c]=arguments[c];var d=-Number.MAX_VALUE;b.forEach(function(b){if("undefined"!==typeof b&&null!==b&&"undefined"!==typeof b.length&&0<b.length)return d=b.length,!0});return d}function q(b,c,d){b&&c.renderTarget&&c.canvas&&!(d||c.chart).isChartSeriesBoosting()&&b.render(d||c.chart)}function k(b,c){b&&c.renderTarget&&c.canvas&&!c.chart.isChartSeriesBoosting()&&b.allocateBufferForSingleSeries(c)}function v(c,
d,k,l,h,a){h=h||0;l=l||3E3;for(var g=h+l,m=!0;m&&h<g&&h<c.length;)m=d(c[h],h),++h;m&&(h<c.length?a?v(c,d,k,l,h,a):b.requestAnimationFrame?b.requestAnimationFrame(function(){v(c,d,k,l,h)}):setTimeout(function(){v(c,d,k,l,h)}):k&&k())}function r(){var c=0,d,k=["webgl","experimental-webgl","moz-webgl","webkit-3d"],h=!1;if("undefined"!==typeof b.WebGLRenderingContext)for(d=t.createElement("canvas");c<k.length;c++)try{if(h=d.getContext(k[c]),"undefined"!==typeof h&&null!==h)return!0}catch(E){}return!1}
var l=C.pick,b=c.win,t=b.document;C={patientMax:d,boostEnabled:function(b){return l(b&&b.options&&b.options.boost&&b.options.boost.enabled,!0)},shouldForceChartSeriesBoosting:function(b){var c=0,g=0,h=l(b.options.boost&&b.options.boost.allowForce,!0);if("undefined"!==typeof b.boostForceChartBoost)return b.boostForceChartBoost;if(1<b.series.length)for(var k=0;k<b.series.length;k++){var a=b.series[k];0!==a.options.boostThreshold&&!1!==a.visible&&"heatmap"!==a.type&&(n[a.type]&&++g,d(a.processedXData,
a.options.data,a.points)>=(a.options.boostThreshold||Number.MAX_VALUE)&&++c)}b.boostForceChartBoost=h&&(g===b.series.length&&0<c||5<c);return b.boostForceChartBoost},renderIfNotSeriesBoosting:q,allocateIfNotSeriesBoosting:k,eachAsync:v,hasWebGLSupport:r,pointDrawHandler:function(b){var c=!0;this.chart.options&&this.chart.options.boost&&(c="undefined"===typeof this.chart.options.boost.enabled?!0:this.chart.options.boost.enabled);if(!c||!this.isSeriesBoosting)return b.call(this);this.chart.isBoosting=
!0;if(b=h(this.chart,this))k(b,this),b.pushSeries(this);q(b,this)}};c.hasWebGLSupport=r;return C});n(c,"modules/boost/boost-init.js",[c["parts/Globals.js"],c["parts/Utilities.js"],c["modules/boost/boost-utils.js"],c["modules/boost/boost-attach.js"]],function(c,n,h,C){var d=n.addEvent,q=n.extend,k=n.fireEvent,v=n.wrap,r=c.Series,l=c.seriesTypes,b=function(){},t=h.eachAsync,g=h.pointDrawHandler,p=h.allocateIfNotSeriesBoosting,u=h.renderIfNotSeriesBoosting,w=h.shouldForceChartSeriesBoosting,E;return function(){q(r.prototype,
{renderCanvas:function(){function a(a,b){var c=!1,d="undefined"===typeof h.index,f=!0;if(!d){if(na){var g=a[0];var m=a[1]}else g=a,m=n[b];ka?(na&&(m=a.slice(1,3)),c=m[0],m=m[1]):la&&(g=a.x,m=a.stackY,c=m-a.y);va||(f=m>=A&&m<=L);if(null!==m&&g>=v&&g<=w&&f)if(a=e.toPixels(g,!0),z){if("undefined"===typeof P||a===R){ka||(c=m);if("undefined"===typeof aa||m>da)da=m,aa=b;if("undefined"===typeof P||c<ca)ca=c,P=b}a!==R&&("undefined"!==typeof P&&(m=l.toPixels(da,!0),x=l.toPixels(ca,!0),ea(a,m,aa),x!==m&&ea(a,
x,P)),P=aa=void 0,R=a)}else m=Math.ceil(l.toPixels(m,!0)),ea(a,m,b)}return!d}function c(){k(d,"renderedCanvas");delete d.buildKDTree;d.buildKDTree();pa.debug.timeKDTree&&console.timeEnd("kd tree building")}var d=this,g=d.options||{},f=!1,h=d.chart,e=this.xAxis,l=this.yAxis,q=g.xData||d.processedXData,n=g.yData||d.processedYData,r=g.data;f=e.getExtremes();var v=f.min,w=f.max;f=l.getExtremes();var A=f.min,L=f.max,X={},R,z=!!d.sampling,T=!1!==g.enableMouseTracking,x=l.getThreshold(g.threshold),ka=d.pointArrayMap&&
"low,high"===d.pointArrayMap.join(","),la=!!g.stacking,ma=d.cropStart||0,va=d.requireSorting,na=!q,ca,da,P,aa,wa="x"===g.findNearestPointBy,oa=this.xData||this.options.xData||this.processedXData||!1,ea=function(a,b,c){a=Math.ceil(a);E=wa?a:a+","+b;T&&!X[E]&&(X[E]=!0,h.inverted&&(a=e.len-a,b=l.len-b),xa.push({x:oa?oa[ma+c]:!1,clientX:a,plotX:a,plotY:b,i:ma+c}))};f=C(h,d);h.isBoosting=!0;var pa=f.settings;if(this.visible){(this.points||this.graph)&&this.destroyGraphics();h.isChartSeriesBoosting()?(this.markerGroup&&
this.markerGroup!==h.markerGroup&&this.markerGroup.destroy(),this.markerGroup=h.markerGroup,this.renderTarget&&(this.renderTarget=this.renderTarget.destroy())):(this.markerGroup===h.markerGroup&&(this.markerGroup=void 0),this.markerGroup=d.plotGroup("markerGroup","markers",!0,1,h.seriesGroup));var xa=this.points=[];d.buildKDTree=b;f&&(p(f,this),f.pushSeries(d),u(f,this,h));h.renderer.forExport||(pa.debug.timeKDTree&&console.time("kd tree building"),t(la?d.data:q||r,a,c))}}});["heatmap","treemap"].forEach(function(a){l[a]&&
v(l[a].prototype,"drawPoints",g)});l.bubble&&(delete l.bubble.prototype.buildKDTree,v(l.bubble.prototype,"markerAttribs",function(a){return this.isSeriesBoosting?!1:a.apply(this,[].slice.call(arguments,1))}));l.scatter.prototype.fill=!0;q(l.area.prototype,{fill:!0,fillOpacity:!0,sampling:!0});q(l.column.prototype,{fill:!0,sampling:!0});c.Chart.prototype.callbacks.push(function(a){d(a,"predraw",function(){a.boostForceChartBoost=void 0;a.boostForceChartBoost=w(a);a.isBoosting=!1;!a.isChartSeriesBoosting()&&
a.didBoost&&(a.didBoost=!1);a.boostClear&&a.boostClear();a.canvas&&a.ogl&&a.isChartSeriesBoosting()&&(a.didBoost=!0,a.ogl.allocateBuffer(a));a.markerGroup&&a.xAxis&&0<a.xAxis.length&&a.yAxis&&0<a.yAxis.length&&a.markerGroup.translate(a.xAxis[0].pos,a.yAxis[0].pos)});d(a,"render",function(){a.ogl&&a.isChartSeriesBoosting()&&a.ogl.render(a)})})}});n(c,"modules/boost/boost-overrides.js",[c["parts/Globals.js"],c["parts/Point.js"],c["parts/Utilities.js"],c["modules/boost/boost-utils.js"],c["modules/boost/boostables.js"],
c["modules/boost/boostable-map.js"]],function(c,n,h,C,d,A){var k=h.addEvent,q=h.error,r=h.isArray,l=h.isNumber,b=h.pick,t=h.wrap,g=C.boostEnabled,p=C.shouldForceChartSeriesBoosting;h=c.Chart;var u=c.Series,w=c.seriesTypes,E=c.getOptions().plotOptions;h.prototype.isChartSeriesBoosting=function(){return b(this.options.boost&&this.options.boost.seriesThreshold,50)<=this.series.length||p(this)};h.prototype.getBoostClipRect=function(a){var b={x:this.plotLeft,y:this.plotTop,width:this.plotWidth,height:this.plotHeight};
a===this&&this.yAxis.forEach(function(a){b.y=Math.min(a.pos,b.y);b.height=Math.max(a.pos-this.plotTop+a.len,b.height)},this);return b};u.prototype.getPoint=function(a){var c=a,d=this.xData||this.options.xData||this.processedXData||!1;!a||a instanceof this.pointClass||(c=(new this.pointClass).init(this,this.options.data[a.i],d?d[a.i]:void 0),c.category=b(this.xAxis.categories?this.xAxis.categories[c.x]:c.x,c.x),c.dist=a.dist,c.distX=a.distX,c.plotX=a.plotX,c.plotY=a.plotY,c.index=a.i,c.isInside=this.isPointInside(a));
return c};t(u.prototype,"searchPoint",function(a){return this.getPoint(a.apply(this,[].slice.call(arguments,1)))});t(n.prototype,"haloPath",function(a){var b=this.series,c=this.plotX,d=this.plotY,f=b.chart.inverted;b.isSeriesBoosting&&f&&(this.plotX=b.yAxis.len-d,this.plotY=b.xAxis.len-c);var g=a.apply(this,Array.prototype.slice.call(arguments,1));b.isSeriesBoosting&&f&&(this.plotX=c,this.plotY=d);return g});t(u.prototype,"markerAttribs",function(a,b){var c=b.plotX,d=b.plotY,f=this.chart.inverted;
this.isSeriesBoosting&&f&&(b.plotX=this.yAxis.len-d,b.plotY=this.xAxis.len-c);var g=a.apply(this,Array.prototype.slice.call(arguments,1));this.isSeriesBoosting&&f&&(b.plotX=c,b.plotY=d);return g});k(u,"destroy",function(){var a=this,b=a.chart;b.markerGroup===a.markerGroup&&(a.markerGroup=null);b.hoverPoints&&(b.hoverPoints=b.hoverPoints.filter(function(b){return b.series===a}));b.hoverPoint&&b.hoverPoint.series===a&&(b.hoverPoint=null)});t(u.prototype,"getExtremes",function(a){return this.isSeriesBoosting&&
this.hasExtremes&&this.hasExtremes()?{}:a.apply(this,Array.prototype.slice.call(arguments,1))});["translate","generatePoints","drawTracker","drawPoints","render"].forEach(function(a){function b(b){var c=this.options.stacking&&("translate"===a||"generatePoints"===a);if(!this.isSeriesBoosting||c||!g(this.chart)||"heatmap"===this.type||"treemap"===this.type||!A[this.type]||0===this.options.boostThreshold)b.call(this);else if(this[a+"Canvas"])this[a+"Canvas"]()}t(u.prototype,a,b);"translate"===a&&"column bar arearange columnrange heatmap treemap".split(" ").forEach(function(c){w[c]&&
t(w[c].prototype,a,b)})});t(u.prototype,"processData",function(a){function b(a){return c.chart.isChartSeriesBoosting()||(a?a.length:0)>=(c.options.boostThreshold||Number.MAX_VALUE)}var c=this,d=this.options.data;g(this.chart)&&A[this.type]?(b(d)&&"heatmap"!==this.type&&"treemap"!==this.type&&!this.options.stacking&&this.hasExtremes&&this.hasExtremes(!0)||(a.apply(this,Array.prototype.slice.call(arguments,1)),d=this.processedXData),(this.isSeriesBoosting=b(d))?(d=this.getFirstValidPoint(this.options.data),
l(d)||r(d)||q(12,!1,this.chart),this.enterBoost()):this.exitBoost&&this.exitBoost()):a.apply(this,Array.prototype.slice.call(arguments,1))});k(u,"hide",function(){this.canvas&&this.renderTarget&&(this.ogl&&this.ogl.clear(),this.boostClear())});u.prototype.enterBoost=function(){this.alteredByBoost=[];["allowDG","directTouch","stickyTracking"].forEach(function(a){this.alteredByBoost.push({prop:a,val:this[a],own:Object.hasOwnProperty.call(this,a)})},this);this.directTouch=this.allowDG=!1;this.stickyTracking=
!0;this.labelBySeries&&(this.labelBySeries=this.labelBySeries.destroy())};u.prototype.exitBoost=function(){(this.alteredByBoost||[]).forEach(function(a){a.own?this[a.prop]=a.val:delete this[a.prop]},this);this.boostClear&&this.boostClear()};u.prototype.hasExtremes=function(a){var b=this.options,c=this.xAxis&&this.xAxis.options,d=this.yAxis&&this.yAxis.options,f=this.colorAxis&&this.colorAxis.options;return b.data.length>(b.boostThreshold||Number.MAX_VALUE)&&l(d.min)&&l(d.max)&&(!a||l(c.min)&&l(c.max))&&
(!f||l(f.min)&&l(f.max))};u.prototype.destroyGraphics=function(){var a=this,b=this.points,c,d;if(b)for(d=0;d<b.length;d+=1)(c=b[d])&&c.destroyElements&&c.destroyElements();["graph","area","tracker"].forEach(function(b){a[b]&&(a[b]=a[b].destroy())})};d.forEach(function(a){E[a]&&(E[a].boostThreshold=5E3,E[a].boostData=[],w[a].prototype.fillOpacity=!0)})});n(c,"modules/boost/named-colors.js",[c["parts/Color.js"]],function(c){var n={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",
azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",
darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dodgerblue:"#1e90ff",feldspar:"#d19275",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",
hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslateblue:"#8470ff",lightslategray:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",
limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",
orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",snow:"#fffafa",springgreen:"#00ff7f",
steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",violetred:"#d02090",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};return c.names=n});n(c,"modules/boost/boost.js",[c["parts/Globals.js"],c["modules/boost/boost-utils.js"],c["modules/boost/boost-init.js"],c["parts/Utilities.js"]],function(c,n,h,C){C=C.error;n=n.hasWebGLSupport;n()?h():"undefined"!==typeof c.initCanvasBoost?c.initCanvasBoost():
C(26)});n(c,"masters/modules/boost.src.js",[],function(){})});
//# sourceMappingURL=boost.js.map