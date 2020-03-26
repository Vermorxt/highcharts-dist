/*
 Highcharts JS v8.0.4 (2020-03-26)

 (c) 2016-2019 Highsoft AS
 Authors: Jon Arild Nygard

 License: www.highcharts.com/license
*/
(function(b){"object"===typeof module&&module.exports?(b["default"]=b,module.exports=b):"function"===typeof define&&define.amd?define("highcharts/modules/wordcloud",["highcharts"],function(l){b(l);b.Highcharts=l;return b}):b("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(b){function l(b,e,y,h){b.hasOwnProperty(e)||(b[e]=h.apply(null,y))}b=b?b._modules:{};l(b,"mixins/draw-point.js",[],function(){var b=function(e){var b=this,h=b.graphic,l=e.animatableAttribs,t=e.onComplete,w=e.css,r=
e.renderer;if(b.shouldDraw())h||(b.graphic=h=r[e.shapeType](e.shapeArgs).add(e.group)),h.css(w).attr(e.attribs).animate(l,e.isNew?!1:void 0,t);else if(h){var q=function(){b.graphic=h=h.destroy();"function"===typeof t&&t()};Object.keys(l).length?h.animate(l,void 0,function(){q()}):q()}};return function(e){(e.attribs=e.attribs||{})["class"]=this.getClassName();b.call(this,e)}});l(b,"mixins/polygon.js",[b["parts/Globals.js"],b["parts/Utilities.js"]],function(b,e){var l=e.find,h=e.isArray,r=e.isNumber,
t=b.deg2rad,w=function(a,c){c=r(c)?c:14;c=Math.pow(10,c);return Math.round(a*c)/c},H=function(a,c){var b=c[0]-a[0];a=c[1]-a[1];return[[-a,b],[a,-b]]},q=function(a,c){a=a.map(function(a){return a[0]*c[0]+a[1]*c[1]});return{min:Math.min.apply(this,a),max:Math.max.apply(this,a)}},E=function(a,c){var b=a[0];a=a[1];var k=t*-c;c=Math.cos(k);k=Math.sin(k);return[w(b*c-a*k),w(b*k+a*c)]},x=function(a,c,b){a=E([a[0]-c[0],a[1]-c[1]],b);return[a[0]+c[0],a[1]+c[1]]},B=function(a){var c=a.axes;if(!h(c)){c=[];var b=
b=a.concat([a[0]]);b.reduce(function(a,b){var k=H(a,b)[0];l(c,function(a){return a[0]===k[0]&&a[1]===k[1]})||c.push(k);return b});a.axes=c}return c},F=function(a,c){a=B(a);c=B(c);return a.concat(c)};return{getBoundingBoxFromPolygon:function(a){return a.reduce(function(a,b){var c=b[0];b=b[1];a.left=Math.min(c,a.left);a.right=Math.max(c,a.right);a.bottom=Math.max(b,a.bottom);a.top=Math.min(b,a.top);return a},{left:Number.MAX_VALUE,right:-Number.MAX_VALUE,bottom:-Number.MAX_VALUE,top:Number.MAX_VALUE})},
getPolygon:function(a,b,e,k,h){var c=[a,b],l=a-e/2;a+=e/2;e=b-k/2;b+=k/2;return[[l,e],[a,e],[a,b],[l,b]].map(function(a){return x(a,c,-h)})},isPolygonsColliding:function(a,b){var c=F(a,b);return!l(c,function(c){var e=q(a,c);c=q(b,c);return!!(c.min>e.max||c.max<e.min)})},movePolygon:function(a,b,e){return e.map(function(c){return[c[0]+a,c[1]+b]})},rotate2DToOrigin:E,rotate2DToPoint:x}});l(b,"modules/wordcloud.src.js",[b["parts/Globals.js"],b["parts/Utilities.js"],b["mixins/draw-point.js"],b["mixins/polygon.js"]],
function(b,e,l,h){function r(g,d){var f=!1,a=g.rect,b=g.polygon,e=g.lastCollidedWith,k=function(d){var f=d.rect;(f=!(f.left>a.right||f.right<a.left||f.top>a.bottom||f.bottom<a.top))&&(g.rotation%90||d.rotation%90)&&(f=C(b,d.polygon));return f};e&&((f=k(e))||delete g.lastCollidedWith);f||(f=!!c(d,function(d){var f=k(d);f&&(g.lastCollidedWith=d);return f}));return f}function t(g,d){d=4*g;var f=Math.ceil((Math.sqrt(d)-1)/2),a=2*f+1,b=Math.pow(a,2),c=!1;--a;1E4>=g&&("boolean"===typeof c&&d>=b-a&&(c={x:f-
(b-d),y:-f}),b-=a,"boolean"===typeof c&&d>=b-a&&(c={x:-f,y:-f+(b-d)}),b-=a,"boolean"===typeof c&&(c=d>=b-a?{x:-f+(b-d),y:f}:{x:f,y:f-(b-d-a)}),c.x*=5,c.y*=5);return c}function w(g,d,f){var a=2*Math.max(Math.abs(f.top),Math.abs(f.bottom));f=2*Math.max(Math.abs(f.left),Math.abs(f.right));return Math.min(0<f?1/f*g:1,0<a?1/a*d:1)}function H(g,d,a){a=a.reduce(function(a,g){g=g.dimensions;var d=Math.max(g.width,g.height);a.maxHeight=Math.max(a.maxHeight,g.height);a.maxWidth=Math.max(a.maxWidth,g.width);
a.area+=d*d;return a},{maxHeight:0,maxWidth:0,area:0});a=Math.max(a.maxHeight,a.maxWidth,.85*Math.sqrt(a.area));var f=g>d?g/d:1;g=d>g?d/g:1;return{width:a*f,height:a*g,ratioX:f,ratioY:g}}function q(a,d,f,b){var g=!1;k(a)&&k(d)&&k(f)&&k(b)&&0<a&&-1<d&&b>f&&(g=f+d%a*((b-f)/(a-1||1)));return g}function E(a,d){var g,b=[];for(g=1;1E4>g;g++)b.push(a(g,d));return function(a){return 1E4>=a?b[a-1]:!1}}function x(a,d){var g=d.width/2,b=-(d.height/2),c=d.height/2;return!(-(d.width/2)<a.left&&g>a.right&&b<a.top&&
c>a.bottom)}function B(g,d){var b=d.placed,c=d.field,e=d.rectangle,k=d.polygon,h=d.spiral,l=1,p={x:0,y:0},n=g.rect=a({},e);g.polygon=k;for(g.rotation=d.rotation;!1!==p&&(r(g,b)||x(n,c));)p=h(l),z(p)&&(n.left=e.left+p.x,n.right=e.right+p.x,n.top=e.top+p.y,n.bottom=e.bottom+p.y,g.polygon=K(p.x,p.y,k)),l++;return p}function F(a,d){if(z(a)&&z(d)){var g=d.bottom-d.top;var b=d.right-d.left;d=a.ratioX;var c=a.ratioY;g=b*d>g*c?b:g;a=I(a,{width:a.width+g*d*2,height:a.height+g*c*2})}return a}var a=e.extend,
c=e.find,y=e.isArray,k=e.isNumber,z=e.isObject,I=e.merge;e=e.seriesType;var A=b.noop,J=h.getBoundingBoxFromPolygon,L=h.getPolygon,C=h.isPolygonsColliding,K=h.movePolygon,D=b.Series;e("wordcloud","column",{allowExtendPlayingField:!0,animation:{duration:500},borderWidth:0,clip:!1,colorByPoint:!0,minFontSize:1,maxFontSize:25,placementStrategy:"center",rotation:{from:0,orientations:2,to:90},showInLegend:!1,spiral:"rectangular",style:{fontFamily:"sans-serif",fontWeight:"900",whiteSpace:"nowrap"},tooltip:{followPointer:!0,
pointFormat:'<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.weight}</b><br/>'}},{animate:D.prototype.animate,animateDrilldown:A,animateDrillupFrom:A,setClip:A,bindAxes:function(){var g={endOnTick:!1,gridLineWidth:0,lineWidth:0,maxPadding:0,startOnTick:!1,title:null,tickPositions:[]};D.prototype.bindAxes.call(this);a(this.yAxis.options,g);a(this.xAxis.options,g)},pointAttribs:function(a,d){a=b.seriesTypes.column.prototype.pointAttribs.call(this,a,d);delete a.stroke;delete a["stroke-width"];
return a},deriveFontSize:function(a,d,b){a=k(a)?a:0;d=k(d)?d:1;b=k(b)?b:1;return Math.floor(Math.max(b,a*d))},drawPoints:function(){var b=this,d=b.hasRendered,c=b.xAxis,e=b.yAxis,l=b.group,h=b.options,q=h.animation,t=h.allowExtendPlayingField,p=b.chart.renderer,n=p.text().add(l),r=[],x=b.placementStrategy[h.placementStrategy],y=h.rotation,A=b.points.map(function(a){return a.weight}),C=Math.max.apply(null,A),G=b.points.concat().sort(function(a,b){return b.weight-a.weight});b.group.attr({scaleX:1,scaleY:1});
G.forEach(function(d){var c=b.deriveFontSize(1/C*d.weight,h.maxFontSize,h.minFontSize);c=a({fontSize:c+"px"},h.style);n.css(c).attr({x:0,y:0,text:d.name});c=n.getBBox(!0);d.dimensions={height:c.height,width:c.width}});var u=H(c.len,e.len,G);var D=E(b.spirals[h.spiral],{field:u});G.forEach(function(c){var g=b.deriveFontSize(1/C*c.weight,h.maxFontSize,h.minFontSize);g=a({fontSize:g+"px"},h.style);var f=x(c,{data:G,field:u,placed:r,rotation:y}),e=a(b.pointAttribs(c,c.selected&&"select"),{align:"center",
"alignment-baseline":"middle",x:f.x,y:f.y,text:c.name,rotation:f.rotation}),n=L(f.x,f.y,c.dimensions.width,c.dimensions.height,f.rotation),m=J(n),v=B(c,{rectangle:m,polygon:n,field:u,placed:r,spiral:D,rotation:f.rotation});!v&&t&&(u=F(u,m),v=B(c,{rectangle:m,polygon:n,field:u,placed:r,spiral:D,rotation:f.rotation}));if(z(v)){e.x+=v.x;e.y+=v.y;m.left+=v.x;m.right+=v.x;m.top+=v.y;m.bottom+=v.y;f=u;if(!k(f.left)||f.left>m.left)f.left=m.left;if(!k(f.right)||f.right<m.right)f.right=m.right;if(!k(f.top)||
f.top>m.top)f.top=m.top;if(!k(f.bottom)||f.bottom<m.bottom)f.bottom=m.bottom;u=f;r.push(c);c.isNull=!1}else c.isNull=!0;if(q){var w={x:e.x,y:e.y};d?(delete e.x,delete e.y):(e.x=0,e.y=0)}c.draw({animatableAttribs:w,attribs:e,css:g,group:l,renderer:p,shapeArgs:void 0,shapeType:"text"})});n=n.destroy();c=w(c.len,e.len,u);b.group.attr({scaleX:c,scaleY:c})},hasData:function(){return z(this)&&!0===this.visible&&y(this.points)&&0<this.points.length},placementStrategy:{random:function(a,b){var c=b.field;
b=b.rotation;return{x:Math.round(c.width*(Math.random()+.5)/2)-c.width/2,y:Math.round(c.height*(Math.random()+.5)/2)-c.height/2,rotation:q(b.orientations,a.index,b.from,b.to)}},center:function(a,b){b=b.rotation;return{x:0,y:0,rotation:q(b.orientations,a.index,b.from,b.to)}}},pointArrayMap:["weight"],spirals:{archimedean:function(a,b){var c=b.field;b=!1;c=c.width*c.width+c.height*c.height;var d=.8*a;1E4>=a&&(b={x:d*Math.cos(d),y:d*Math.sin(d)},Math.min(Math.abs(b.x),Math.abs(b.y))<c||(b=!1));return b},
rectangular:function(a,b){a=t(a,b);b=b.field;a&&(a.x*=b.ratioX,a.y*=b.ratioY);return a},square:t},utils:{extendPlayingField:F,getRotation:q,isPolygonsColliding:C,rotate2DToOrigin:h.rotate2DToOrigin,rotate2DToPoint:h.rotate2DToPoint},getPlotBox:function(){var a=this.chart,b=a.inverted,c=this[b?"yAxis":"xAxis"];b=this[b?"xAxis":"yAxis"];return{translateX:(c?c.left:a.plotLeft)+(c?c.len:a.plotWidth)/2,translateY:(b?b.top:a.plotTop)+(b?b.len:a.plotHeight)/2,scaleX:1,scaleY:1}}},{draw:l,shouldDraw:function(){return!this.isNull},
isValid:function(){return!0},weight:1})});l(b,"masters/modules/wordcloud.src.js",[],function(){})});
//# sourceMappingURL=wordcloud.js.map