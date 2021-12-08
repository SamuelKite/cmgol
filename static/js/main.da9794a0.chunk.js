(this.webpackJsonpcmgol=this.webpackJsonpcmgol||[]).push([[0],{16:function(t,e,n){},17:function(t,e,n){},28:function(t,e,n){},30:function(t,e,n){"use strict";n.r(e);var i=n(2),s=n.n(i),o=n(4),a=n.n(o),l=(n(16),n(17),n(1)),c=n(9),r=n(8),h=n(5),u=n(6),d=n(10),f=n(11),g=n(7),b=n.n(g),p=(n(28),n(0)),v=function(t){var e=t.init,n=t.draw,i=(t.rows,t.next,t.dim,Object(f.a)(t,["init","draw","rows","next","dim"]));return Object(p.jsx)(b.a,Object(d.a)({setup:function(t,n){t.createCanvas(n.offsetWidth,n.offsetWidth).parent(n);e(t)},draw:n},i))},j=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1;Object(h.a)(this,t),this.R=e,this.G=n,this.B=i,this.steps=s}return Object(u.a)(t,[{key:"increment",value:function(t){this.hasOwnProperty(t)&&this[t]<this.steps&&(this[t]+=1)}},{key:"decrement",value:function(t){this.hasOwnProperty(t)&&this[t]>0&&(this[t]-=1)}}]),t}(),m=function(t){Object(c.a)(n,t);var e=Object(r.a)(n);function n(t){var i;return Object(h.a)(this,n),(i=e.call(this,t)).state={dim:28,cells:[],next:[],p5:null,paused:!1,coloringFunction:i.colorInCells,filterName:"All",steps:1,gDecay:!0},i.draw=i.draw.bind(Object(l.a)(i)),i.doDrawing=i.doDrawing.bind(Object(l.a)(i)),i.init=i.init.bind(Object(l.a)(i)),i.generate=i.generate.bind(Object(l.a)(i)),i.pause=i.pause.bind(Object(l.a)(i)),i.swapFilter=i.swapFilter.bind(Object(l.a)(i)),i.toggleCellSize=i.toggleCellSize.bind(Object(l.a)(i)),i.toggleSteps=i.toggleSteps.bind(Object(l.a)(i)),i.toggleGDecay=i.toggleGDecay.bind(Object(l.a)(i)),i.colorInCells=i.colorInCells.bind(Object(l.a)(i)),i.colorInGreen=i.colorInGreen.bind(Object(l.a)(i)),i.colorInBlue=i.colorInBlue.bind(Object(l.a)(i)),i.colorInRed=i.colorInRed.bind(Object(l.a)(i)),i.state.coloringFunction=i.state.coloringFunction.bind(Object(l.a)(i)),i}return Object(u.a)(n,[{key:"componentDidMount",value:function(){}},{key:"componentDidUpdate",value:function(t,e,n){e.dim!==this.state.dim?(this.init(this.state.p5),this.doDrawing(this.state.p5,this.state.coloringFunction)):e.coloringFunction!==this.state.coloringFunction&&this.doDrawing(this.state.p5,this.state.coloringFunction)}},{key:"toggleCellSize",value:function(){var t;this.setState({dim:null!==(t={16:20,20:24,24:28,28:4,4:8,8:12,12:16}[this.state.dim])&&void 0!==t?t:28})}},{key:"toggleSteps",value:function(){var t;this.setState({steps:null!==(t={1:2,2:3,3:4,4:5,5:1}[this.state.steps])&&void 0!==t?t:1})}},{key:"init",value:function(t){null!=this.state.p5&&(t=this.state.p5);for(var e=Math.floor(t.height/this.state.dim),n=Math.floor(t.width/this.state.dim),i=Array.from(Array(e),(function(){return new Array(n)})),s=Array.from(Array(e),(function(){return new Array(n)})),o=0;o<e;o++)for(var a=0;a<n;a++)i[o][a]=0==o||0==a||o==e-1||a==n-1?new j(0,0,0,this.state.steps):new j(Math.floor(2*Math.random()),0,Math.floor(2*Math.random()),this.state.steps),s[o][a]=new j(0,0,0,this.state.steps);this.setState({cells:i,next:s,p5:t}),t.background(255),this.generate(t),this.doDrawing(t,this.state.coloringFunction)}},{key:"generate",value:function(t){var e=this;if(this.state.cells.length>0){for(var n=1;n<this.state.cells.length-1;n++)for(var i=function(t){for(var i=e.state.cells[n][t],s={R:0,G:0,B:0},o=-1;o<=1;o++)for(var a=function(a){var l=e.state.cells[n+o][t+a];if(i===l)return"continue";["R","G","B"].forEach((function(t){s[t]+=l[t]>0?1:0}))},l=-1;l<=1;l++)a(l);i.B>0&&i.R>0?i.increment("G"):i.G>0&&i.R<i.G&&i.B<i.G&&(Math.random()>.5?i.increment("B"):i.increment("R"),!0===e.state.gDecay&&i.decrement("G"));var c=e.state.next[n][t];["R","G","B"].forEach((function(t){i[t]>0&&s[t]<2||i[t]>0&&s[t]>3?c.decrement(t):0==i[t]&&3==s[t]?c.increment(t):c[t]=i[t]}))},s=1;s<this.state.cells[n].length-1;s++)i(s);var o=this.state.cells;this.state.cells=this.state.next,this.state.next=o}}},{key:"draw",value:function(t){this.state.paused||this.doDrawing(t,this.state.coloringFunction)}},{key:"doDrawing",value:function(t,e){var n;t&&((null===(n=this.state.cells)||void 0===n?void 0:n.length)>0&&(t.background(255),this.generate(t),e(t)))}},{key:"colorAnyCell",value:function(t,e){for(var n=0;n<this.state.cells.length;n++)for(var i=0;i<this.state.cells[n].length;i++){e(this.state.cells[n][i]),t.stroke(0),t.rect(n*this.state.dim,i*this.state.dim,this.state.dim-1,this.state.dim-1)}}},{key:"colorInCells",value:function(t){this.colorAnyCell(t,(function(e){t.fill(e.R/e.steps*255,e.G/e.steps*255,e.B/e.steps*255)}))}},{key:"colorInGreen",value:function(t){this.colorAnyCell(t,(function(e){e.G>0?t.fill(e.R/e.steps*255,e.G/e.steps*255,e.B/e.steps*255):t.fill(0)}))}},{key:"colorInRed",value:function(t){this.colorAnyCell(t,(function(e){e.R>0?t.fill(255*e.R,255*e.G,255*e.B):t.fill(0)}))}},{key:"colorInBlue",value:function(t){this.colorAnyCell(t,(function(e){e.B>0?t.fill(255*e.R,255*e.G,255*e.B):t.fill(0)}))}},{key:"pause",value:function(){this.setState({paused:!this.state.paused})}},{key:"toggleGDecay",value:function(){this.setState({gDecay:!this.state.gDecay})}},{key:"swapFilter",value:function(t){var e=this.state.filterName,n=this.state.coloringFunction;"All"===this.state.filterName?(n=this.colorInBlue,e="Blue"):"Blue"===this.state.filterName?(n=this.colorInRed,e="Red"):"Red"===this.state.filterName?(n=this.colorInGreen,e="Green"):(n=this.colorInCells,e="All"),this.setState({coloringFunction:n,filterName:e})}},{key:"render",value:function(){var t=this,e=this.state,n=e.paused,i=e.filterName,s=e.dim,o=e.steps,a=e.p5,l=e.next,c=e.coloringFunction,r=e.cells,h=e.gDecay;return Object(p.jsxs)("div",{className:"Grid",children:[Object(p.jsxs)("div",{className:"GridBtns",children:[Object(p.jsx)("button",{onClick:this.init,children:"Init"}),Object(p.jsx)("button",{onClick:this.pause,children:n?"unpause":"pause"}),Object(p.jsx)("button",{onClick:this.swapFilter,children:i}),Object(p.jsxs)("button",{onClick:this.toggleCellSize,children:["cell size: ",s]}),Object(p.jsxs)("button",{onClick:this.toggleSteps,children:["steps: ",o]}),Object(p.jsx)("button",{onClick:function(){return t.doDrawing(a,c)},children:"Increment"}),Object(p.jsx)("button",{onClick:this.toggleGDecay,children:h?"G Decays":"G Doesn't Decay"})]}),Object(p.jsx)(v,{init:this.init,dim:s,rows:r,next:l,draw:this.draw})]})}}]),n}(s.a.Component);var y=function(){return Object(p.jsx)("div",{className:"App",children:Object(p.jsx)(m,{})})},O=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,31)).then((function(e){var n=e.getCLS,i=e.getFID,s=e.getFCP,o=e.getLCP,a=e.getTTFB;n(t),i(t),s(t),o(t),a(t)}))};a.a.render(Object(p.jsx)(s.a.StrictMode,{children:Object(p.jsx)(y,{})}),document.getElementById("root")),O()}},[[30,1,2]]]);
//# sourceMappingURL=main.da9794a0.chunk.js.map