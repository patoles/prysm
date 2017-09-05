!function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var n={};e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=13)}([function(t,e,n){"use strict";var r=function(){function t(t,e){for(var n in e){var r=e[n];r.configurable=!0,r.value&&(r.writable=!0)}Object.defineProperties(t,e)}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),i=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")};Matrix.Translation=function(t){if(2===t.elements.length){var e=Matrix.I(3);return e.elements[2][0]=t.elements[0],e.elements[2][1]=t.elements[1],e}if(3===t.elements.length){var e=Matrix.I(4);return e.elements[0][3]=t.elements[0],e.elements[1][3]=t.elements[1],e.elements[2][3]=t.elements[2],e}throw"Invalid length for Translation"},Matrix.prototype.flatten=function(){var t=[];if(0===this.elements.length)return[];for(var e=0;e<this.elements[0].length;e++)for(var n=0;n<this.elements.length;n++)t.push(this.elements[n][e]);return t},Matrix.prototype.ensure4x4=function(){if(4===this.elements.length&&4===this.elements[0].length)return this;if(this.elements.length>4||this.elements[0].length>4)return null;for(var t=0;t<this.elements.length;t++)for(var e=this.elements[t].length;e<4;e++)t==e?this.elements[t].push(1):this.elements[t].push(0);for(var t=this.elements.length;t<4;t++)0==t?this.elements.push([1,0,0,0]):1==t?this.elements.push([0,1,0,0]):2==t?this.elements.push([0,0,1,0]):3==t&&this.elements.push([0,0,0,1]);return this};var a=function(){function t(){i(this,t),this.mvMatrixStack=[],this.mvMatrix=[]}return r(t,{setupCanvas:{value:function(t,e){var n=document.createElement("canvas");n.style.position="absolute",n.style.top="0",n.style.left="0",n.width=e.clientWidth,n.height=e.clientHeight,t.realWidth=n.width,t.realHeight=n.height;var r=this.webgl_support(n);r.viewport(0,0,n.width,n.height),r.imageSmoothingEnabled=!0,r.imageSmoothingQuality="high",r.enable(r.DEPTH_TEST),r.depthFunc(r.LEQUAL),r.clear(r.COLOR_BUFFER_BIT|r.DEPTH_BUFFER_BIT);var i=window.devicePixelRatio||1,a=r.webkitBackingStorePixelRatio||r.mozBackingStorePixelRatio||r.msBackingStorePixelRatio||r.oBackingStorePixelRatio||r.backingStorePixelRatio||1,o=i/a;i!==a&&(n.width=t.realWidth*o,n.height=t.realHeight*o,n.style.width=t.realWidth+"px",n.style.height=t.realHeight+"px",r.viewport(0,0,n.width,n.height)),n.style.visibility="visible",e.style.visibility="hidden",e.appendChild(n),t.canvas=n,t.ctx=r}},initMeshBuffers:{value:function(t,e){e.normalBuffer=this.buildBuffer(t,t.ARRAY_BUFFER,e.normals,3),e.textureBuffer=this.buildBuffer(t,t.ARRAY_BUFFER,e.textures,2),e.vertexBuffer=this.buildBuffer(t,t.ARRAY_BUFFER,e.vertices,3),e.indexBuffer=this.buildBuffer(t,t.ELEMENT_ARRAY_BUFFER,e.indices,1)}},buildBuffer:{value:function(t,e,n,r){var i=t.createBuffer(),a=e===t.ARRAY_BUFFER?Float32Array:Uint16Array;return t.bindBuffer(e,i),t.bufferData(e,new a(n),t.STATIC_DRAW),i.itemSize=r,i.numItems=n.length/r,i}},getShader:{value:function(t,e){var n;if("fragment"==e.type)n=t.createShader(t.FRAGMENT_SHADER);else{if("vertex"!=e.type)return null;n=t.createShader(t.VERTEX_SHADER)}return t.shaderSource(n,e.source),t.compileShader(n),t.getShaderParameter(n,t.COMPILE_STATUS)?n:(alert("An error occurred compiling the shaders: "+t.getShaderInfoLog(n)),null)}},initShaders:{value:function(t,e,n,r){var i=this.getShader(e,n),a=this.getShader(e,r),o=e.createProgram();e.attachShader(o,a),e.attachShader(o,i),e.linkProgram(o),e.getProgramParameter(o,e.LINK_STATUS)||alert("Unable to initialize the shader program."),e.useProgram(o),o.vertexPositionAttribute=e.getAttribLocation(o,"aVertexPosition"),e.enableVertexAttribArray(o.vertexPositionAttribute),o.vertexNormalAttribute=e.getAttribLocation(o,"aVertexNormal"),e.enableVertexAttribArray(o.vertexNormalAttribute),o.textureCoordAttribute=e.getAttribLocation(o,"aTextureCoord"),e.enableVertexAttribArray(o.textureCoordAttribute),o.samplerUniform=e.getUniformLocation(o,"uSampler"),o.screenRatio=e.getUniformLocation(o,"screenRatio"),t.shaderProgram=o}},webgl_support:{value:function(t){try{return!!window.WebGLRenderingContext&&(t.getContext("webgl")||t.getContext("experimental-webgl"))}catch(t){return!1}}},makePerspective:{value:function(t,e,n,r){var i=n*Math.tan(t*Math.PI/360),a=-i,o=a*e,s=i*e;return this.makeFrustum(o,s,a,i,n,r)}},makeFrustum:{value:function(t,e,n,r,i,a){var o=2*i/(e-t),s=2*i/(r-n),c=(e+t)/(e-t),u=(r+n)/(r-n),f=-(a+i)/(a-i),v=-2*a*i/(a-i);return $M([[o,0,c,0],[0,s,u,0],[0,0,f,v],[0,0,-1,0]])}},loadIdentity:{value:function(){this.mvMatrix=Matrix.I(4)}},multMatrix:{value:function(t){this.mvMatrix=this.mvMatrix.x(t)}},mvTranslate:{value:function(t){this.multMatrix(Matrix.Translation($V([t[0],t[1],t[2]])).ensure4x4())}},setMatrixUniforms:{value:function(t,e,n){var r=t.getUniformLocation(e,"uPMatrix");t.uniformMatrix4fv(r,!1,new Float32Array(n.flatten()));var i=t.getUniformLocation(e,"uMVMatrix");t.uniformMatrix4fv(i,!1,new Float32Array(this.mvMatrix.flatten()));var a=this.mvMatrix.inverse();a=a.transpose();var o=t.getUniformLocation(e,"uNormalMatrix");t.uniformMatrix4fv(o,!1,new Float32Array(a.flatten()))}},mvPushMatrix:{value:function(t){t?(this.mvMatrixStack.push(t.dup()),mvMatrix=t.dup()):this.mvMatrixStack.push(this.mvMatrix.dup())}},mvPopMatrix:{value:function(){if(!this.mvMatrixStack.length)throw"Can't pop from an empty matrix stack.";return this.mvMatrix=this.mvMatrixStack.pop(),this.mvMatrix}},mvRotate:{value:function(t,e){var n=t*Math.PI/180,r=Matrix.Rotation(n,$V([e[0],e[1],e[2]])).ensure4x4();this.multMatrix(r)}},mvRotateMultiple:{value:function(t,e,n,r){var i=t*Math.PI/180,a=Matrix.Rotation(i,$V([e[0],e[1],e[2]])).ensure4x4();i=n*Math.PI/180;var o=Matrix.Rotation(i,$V([r[0],r[1],r[2]])).ensure4x4(),s=a.x(o);this.multMatrix(s)}},mvScale:{value:function(t){var e=Matrix.I(4);e.elements=[[t[0],0,0,0],[0,t[1],0,0],[0,0,t[2],0],[0,0,0,1]],this.multMatrix(e)}}}),t}(),o=new a;t.exports=o},function(t,e,n){"use strict";var r=function(t){return t&&t.__esModule?t.default:t}(n(14)),i=document.getElementById("test");new r(i,{fragment:"water",vertex:"water",params:{fragment:{speed:.02,amplitude:10.1,refraction:.8,width:.12},vertex:{amplitude:.05,frequency:1}}})},function(t,e,n){"use strict";var r=function(){function t(t,e){for(var n in e){var r=e[n];r.configurable=!0,r.value&&(r.writable=!0)}Object.defineProperties(t,e)}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),i=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},a=function(t){return t&&t.__esModule?t.default:t}(n(0)),o=function(){function t(e){i(this,t),a.setupCanvas(this,e),this.frameInfo={fpsInterval:0,startTime:Date.now(),now:0,then:Date.now(),elapsed:0,fps:60,fpsRate:0,screenRatio:this.canvas.height/this.canvas.width},this.frameInfo.fpsInterval=1e3/this.frameInfo.fps,this.shaderProgram=null,this.canvasInfo={width:this.realWidth,height:this.realHeight,center:{x:this.realWidth/2,y:this.realHeight/2}},this.active=!0}return r(t,{checkFrameInterval:{value:function(){return this.frameInfo.now=Date.now(),this.frameInfo.elapsed=this.frameInfo.now-this.frameInfo.then,this.frameInfo.elapsed>this.frameInfo.fpsInterval}},clearScreen:{value:function(){this.ctx.clearColor(0,0,0,0)}},render:{value:function(){this.active&&(requestAnimationFrame(this.render.bind(this)),this.checkFrameInterval()&&(this.frameInfo.then=this.frameInfo.now-this.frameInfo.elapsed%this.frameInfo.fpsInterval,this.clearScreen(),this.draw()))}},draw:{value:function(){}},drawObject:{value:function(t,e){var n=this.ctx;n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT);var r=a.makePerspective(89.95,this.realWidth/this.realHeight,.1,100);a.loadIdentity(),a.mvPushMatrix(),t.translation&&a.mvTranslate(t.translation),t.scale&&a.mvScale([t.scale[0],t.scale[1],t.scale[2]]),t.rotation&&a.mvRotateMultiple(t.rotation[0],[1,0,0],t.rotation[1],[0,1,0]),n.useProgram(this.shaderProgram),n.bindBuffer(n.ARRAY_BUFFER,t.vertexBuffer),n.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute,t.vertexBuffer.itemSize,n.FLOAT,!1,0,0),n.bindBuffer(n.ARRAY_BUFFER,t.normalBuffer),n.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute,t.normalBuffer.itemSize,n.FLOAT,!1,0,0),n.bindBuffer(n.ARRAY_BUFFER,t.textureBuffer),n.vertexAttribPointer(this.shaderProgram.textureCoordAttribute,t.textureBuffer.itemSize,n.FLOAT,!1,0,0),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,t.texture),n.uniform1i(this.shaderProgram.samplerUniform,0),n.uniform2fv(this.shaderProgram.screenRatio,[1,this.frameInfo.screenRatio]),e(),n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.indexBuffer),a.setMatrixUniforms(n,this.shaderProgram,r),n.drawElements(n.TRIANGLES,t.indexBuffer.numItems,n.UNSIGNED_SHORT,0),a.mvPopMatrix()}},handleLoadedTexture:{value:function(t){var e=this.ctx;e.bindTexture(e.TEXTURE_2D,t),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,t.image),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindTexture(e.TEXTURE_2D,null)}},initTexture:{value:function(t,e){var n=this;t.texture=this.ctx.createTexture(),t.texture.image=new Image,t.texture.image.crossOrigin="anonymous",t.texture.image.src=e;var r=function(){n.handleLoadedTexture(t.texture),n.render()};t.texture.image.complete||t.texture.image.width+t.texture.image.height>0?r():t.texture.image.addEventListener("load",function(t){r()})}},createPlane:{value:function(t){for(var e={vertices:[],normals:[],indices:[],textures:[]},n=0;n<=t;++n)for(var r=n*(2/t)-1,i=0;i<=t;++i){var a=i*(2/t)-1;e.vertices=e.vertices.concat([a,r,0]),e.normals=e.normals.concat([0,0,1]),e.textures=e.textures.concat([i/t,1-n/t])}for(var o=t+1,n=0;n<t;++n)for(var s=(n+0)*o,c=(n+1)*o,i=0;i<t;++i){var u=s+i,f=c+i;e.indices=e.indices.concat(u,u+1,f),e.indices=e.indices.concat(f,u+1,f+1)}return e}}}),t}();t.exports=o},function(t,e,n){"use strict";var r=function(t){return t&&t.__esModule?t.default:t},i=function(){function t(t,e){for(var n in e){var r=e[n];r.configurable=!0,r.value&&(r.writable=!0)}Object.defineProperties(t,e)}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),a=function t(e,n,r){var i=Object.getOwnPropertyDescriptor(e,n);if(void 0===i){var a=Object.getPrototypeOf(e);return null===a?void 0:t(a,n,r)}if("value"in i&&i.writable)return i.value;var o=i.get;if(void 0!==o)return o.call(r)},o=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(t.__proto__=e)},s=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},c=r(n(2)),u=r(n(0)),f=r(n(7)),v=r(n(8)),l=function(t){function e(t,n,r,i,o){s(this,e),a(Object.getPrototypeOf(e.prototype),"constructor",this).call(this,t),r=r.charAt(0).toUpperCase()+r.slice(1),i=i.charAt(0).toUpperCase()+i.slice(1),this.fragment=new f[r](this.canvasInfo),this.vertex=new v[i](this.canvasInfo),this.fragment.setParams&&this.fragment.setParams(o.fragment),this.vertex.setParams&&this.vertex.setParams(o.vertex),this.initShaders(),this.initClick(this.canvas);var c=this.createPlane(40);c.translation=[0,0,-1],c.scale=[1/this.frameInfo.screenRatio,1,1],this.meshes={plane:c},u.initMeshBuffers(this.ctx,this.meshes.plane),this.initTexture(this.meshes.plane,n)}return o(e,t),i(e,{initShaders:{value:function(){u.initShaders(this,this.ctx,this.fragment,this.vertex),this.fragment.init&&this.fragment.init(this.ctx,this.shaderProgram),this.vertex.init&&this.vertex.init(this.ctx,this.shaderProgram)}},draw:{value:function(){var t=this;this.drawObject(this.meshes.plane,function(){t.fragment.draw&&t.fragment.draw(t.ctx,t.shaderProgram),t.vertex.draw&&t.vertex.draw(t.ctx,t.shaderProgram)}),this.transform()}},transform:{value:function(){this.fragment.transform&&this.fragment.transform(),this.vertex.transform&&this.vertex.transform()}},initClick:{value:function(t){t.addEventListener("click",this.handleClick.bind(this)),t.addEventListener("touchmove",this.handleTouchMove.bind(this))}},handleClick:{value:function(t){this.fragment.handleClick&&this.fragment.handleClick(t),this.vertex.handleClick&&this.vertex.handleClick(t)}},handleTouchMove:{value:function(t){this.fragment.handleTouchMove&&this.fragment.handleTouchMove(t),this.vertex.handleTouchMove&&this.vertex.handleTouchMove(t)}}}),e}(c);t.exports=l},function(t,e,n){"use strict";var r=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},i=function t(){r(this,t),this.type="fragment",this.source="\n            precision highp float;\n\n\t\t\tvarying highp vec2 vTextureCoord;\n            varying highp vec3 vLighting;\n\t\t\tuniform sampler2D uSampler;\n\n\t\t\tvoid main(void){\n\t\t\t\tvec4 fragmentColor;\n\t\t\t\tfragmentColor = texture2D(uSampler, vTextureCoord);\n\n\t\t\t\tif (fragmentColor.a <= 0.1) discard;\n\n\t\t\t\tgl_FragColor = vec4(fragmentColor.rgb * vLighting, fragmentColor.a);\n\t\t\t}\n\t\t"};t.exports=i},function(t,e,n){"use strict";var r=function(){function t(t,e){for(var n in e){var r=e[n];r.configurable=!0,r.value&&(r.writable=!0)}Object.defineProperties(t,e)}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),i=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},a=function(){function t(e){i(this,t),this.canvasInfo=e,this.type="fragment",this.source="\n\t\t\t#define MAX_WAVE_NBR 10\n            precision highp float;\n\t\t\t\n\t\t\tvarying highp vec2 vTextureCoord;\n\t\t\tvarying highp vec3 vLighting;\n\t\t\tuniform sampler2D uSampler;\n\t\t\tuniform vec2 screenRatio;\n\t\t\t\n\t\t\tstruct waveStruct{\n\t\t\t\tvec2 center;\n\t\t\t\tfloat time;\n\t\t\t\tvec3 shockParams;\n\t\t\t};\n\t\t\tuniform waveStruct wave[MAX_WAVE_NBR];\n\n\t\t\tvoid main(void){\n\t\t\t\tvec2 uv = vTextureCoord.xy;\n\t\t\t\tvec2 texCoord = uv;\n\n\t\t\t\tfor (int count=0;count < MAX_WAVE_NBR;count++)\n\t\t\t\t{\n\t\t\t\t\tfloat distance = distance(uv, wave[count].center);\n\t\t\t\t\tif ((distance <= (wave[count].time + wave[count].shockParams.z)) && (distance >= (wave[count].time - wave[count].shockParams.z)))\n\t\t\t\t\t{\n\t\t\t\t\t\tfloat diff = (distance - wave[count].time); \n\t\t\t\t\t\tfloat powDiff = 1.0 - pow(abs(diff*wave[count].shockParams.x), wave[count].shockParams.y); \n\t\t\t\t\t\tfloat diffTime = diff * powDiff;\n\t\t\t\t\t\tvec2 diffUV = normalize(uv - wave[count].center); \n\t\t\t\t\t\ttexCoord = uv + (diffUV * diffTime);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tvec4 fragmentColor = texture2D(uSampler, texCoord);\n\t\t\t\tif (fragmentColor.a <= 0.1) discard;\n\t\t\t\tgl_FragColor = vec4(fragmentColor.rgb * vLighting, fragmentColor.a);\n\t\t\t}\n\t\t"}return r(t,{setParams:{value:function(t){t=t||{};var e={};e.WAVE_LIST_SIZE=10,e.WAVE_LIFESPAN=1.5,e.lastTouchTime=-1;var n=t&&t.speed||.02,r=[t.amplitude||10.1,t.refraction||.8,t.width||.1];e.waveParams={shockParams:r,speed:n},e.waveList=[];for(var i=0;i<e.WAVE_LIST_SIZE;i++)e.waveList.push({time:0,center:[-100,-100],on:!1,shockParams:e.waveParams.shockParams,speed:e.waveParams.speed});this.shaderParams=e}},init:{value:function(t,e){var n=this.shaderParams;e.wave=new Array(10),n.waveList.forEach(function(n,r){e.wave[r]={},e.wave[r].center=t.getUniformLocation(e,"wave["+r+"].center"),e.wave[r].time=t.getUniformLocation(e,"wave["+r+"].time"),e.wave[r].shockParams=t.getUniformLocation(e,"wave["+r+"].shockParams")})}},draw:{value:function(t,e){this.shaderParams.waveList.forEach(function(n,r){t.uniform2fv(e.wave[r].center,n.center),t.uniform1f(e.wave[r].time,n.time),t.uniform3fv(e.wave[r].shockParams,n.shockParams)})}},transform:{value:function(){var t=this.shaderParams;t.waveList.forEach(function(e){e.on&&(e.time+=e.speed,e.time>t.WAVE_LIFESPAN&&(e.on=!1,e.center=[-100,-100],e.time=0))})}},handleClick:{value:function(t){var e=(this.shaderParams,t.clientX-t.target.getBoundingClientRect().left),n=t.clientY-t.target.getBoundingClientRect().top;this.setWavePos({x:e,y:n})}},handleTouchMove:{value:function(t){var e=this.shaderParams;if(Date.now()-e.lastTouchTime>100){var n=t.touches[0].clientX-t.target.getBoundingClientRect().left,r=t.touches[0].clientY-t.target.getBoundingClientRect().top;this.setWavePos({x:n,y:r}),e.lastTouchTime=Date.now()}}},setWavePos:{value:function(t){var e=this.shaderParams,n=this.canvasInfo,r=t.x/n.width,i=t.y/n.height,a=-1;e.waveList.forEach(function(t,e){t.on||-1!==a||(a=e)}),a>-1&&(e.waveList[a].center=[r,i],e.waveList[a].time=0,e.waveList[a].on=!0)}}}),t}();t.exports=a},function(t,e,n){"use strict";var r=function(){function t(t,e){for(var n in e){var r=e[n];r.configurable=!0,r.value&&(r.writable=!0)}Object.defineProperties(t,e)}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),i=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},a=function(){function t(e){i(this,t),this.canvasInfo=e,this.type="fragment",this.source="\n            #define TAU 6.28318530718\n            #define MAX_ITER 5\n            #define MAX_WAVE_NBR 2\n\n            precision highp float;\n\n\t\t\tvarying highp vec2 vTextureCoord;\n            varying highp vec3 vLighting;\n            uniform sampler2D uSampler;\n            uniform vec2 screenRatio;\n\n            uniform float f_time;\n\n\t\t\tstruct waveStruct{\n\t\t\t\tvec2 center;\n\t\t\t\tfloat time;\n\t\t\t\tvec3 shockParams;\n\t\t\t};\n\t\t\tuniform waveStruct wave[MAX_WAVE_NBR];\n\n            void main(void) \n            {\n                vec2 uv = vTextureCoord.xy;\n\t\t\t\tvec2 texCoord = uv;\n\t\t\t\tfor (int count=0;count < MAX_WAVE_NBR;count++)\n\t\t\t\t{\n\t\t\t\t\tfloat distance = distance(uv, wave[count].center);\n\t\t\t\t\tif ((distance <= (wave[count].time + wave[count].shockParams.z)) && (distance >= (wave[count].time - wave[count].shockParams.z)))\n\t\t\t\t\t{\n\t\t\t\t\t\tfloat diff = (distance - wave[count].time); \n\t\t\t\t\t\tfloat powDiff = 1.0 - pow(abs(diff*wave[count].shockParams.x), wave[count].shockParams.y); \n\t\t\t\t\t\tfloat diffTime = diff * powDiff;\n\t\t\t\t\t\tvec2 diffUV = normalize(uv - wave[count].center); \n\t\t\t\t\t\ttexCoord = uv + (diffUV * diffTime);\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tvec4 fragmentColor = texture2D(uSampler, texCoord);\n                float time = f_time;\n                \n                vec2 p = mod(uv*TAU, TAU)-250.0;\n\n                vec2 i = vec2(p);\n                float c = 1.0;\n                float inten = .005;\n\n                for (int n = 0; n < MAX_ITER; n++)\n                {\n                    float t = time * (1.0 - (3.5 / float(n+1)));\n                    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));\n                    c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));\n                }\n                c /= float(MAX_ITER);\n                c = 1.17-pow(c, 1.4);\n                vec3 colour = vec3(pow(abs(c), 8.0));\n                colour = clamp(colour + vec3(0.0, 0.35, 0.5), 0.0, 1.0);\n                \n                gl_FragColor = vec4(fragmentColor.rgb * vLighting * colour, fragmentColor.a);\n            }\n        "}return r(t,{setParams:{value:function(t){t=t||{};var e={};e.time=0,e.DELTA_TIME=0,e.LAST_TIME=Date.now(),e.WAVE_LIST_SIZE=2,e.WAVE_LIFESPAN=1.5,e.lastTouchTime=-1;var n=t&&t.speed||.02,r=[t.amplitude||10.1,t.refraction||.8,t.width||.1];e.waveParams={shockParams:r,speed:n},e.waveList=[];for(var i=0;i<e.WAVE_LIST_SIZE;i++)e.waveList.push({time:0,center:[-100,-100],on:!1,shockParams:e.waveParams.shockParams,speed:e.waveParams.speed});this.shaderParams=e}},init:{value:function(t,e){var n=this.shaderParams;e.f_time=t.getUniformLocation(e,"f_time"),e.wave=new Array(10),n.waveList.forEach(function(n,r){e.wave[r]={},e.wave[r].center=t.getUniformLocation(e,"wave["+r+"].center"),e.wave[r].time=t.getUniformLocation(e,"wave["+r+"].time"),e.wave[r].shockParams=t.getUniformLocation(e,"wave["+r+"].shockParams")})}},draw:{value:function(t,e){var n=this.shaderParams;t.uniform1f(e.f_time,n.time),n.waveList.forEach(function(n,r){t.uniform2fv(e.wave[r].center,n.center),t.uniform1f(e.wave[r].time,n.time),t.uniform3fv(e.wave[r].shockParams,n.shockParams)})}},transform:{value:function(){var t=this.shaderParams;t.DELTA_TIME=Date.now()-t.LAST_TIME,t.LAST_TIME=Date.now(),t.time+=t.DELTA_TIME/2e3,t.waveList.forEach(function(e){e.on&&(e.time+=t.DELTA_TIME/1e3,e.time>t.WAVE_LIFESPAN&&(e.on=!1,e.center=[-100,-100],e.time=0))})}},handleClick:{value:function(t){var e=(this.shaderParams,t.clientX-t.target.getBoundingClientRect().left),n=t.clientY-t.target.getBoundingClientRect().top;this.setWavePos({x:e,y:n})}},handleTouchMove:{value:function(t){var e=this.shaderParams;if(Date.now()-e.lastTouchTime>500){var n=t.touches[0].clientX-t.target.getBoundingClientRect().left,r=t.touches[0].clientY-t.target.getBoundingClientRect().top;this.setWavePos({x:n,y:r}),e.lastTouchTime=Date.now()}}},setWavePos:{value:function(t){var e=this.shaderParams,n=this.canvasInfo,r=t.x/n.width,i=t.y/n.height,a=-1;e.waveList.forEach(function(t,e){t.on||-1!==a||(a=e)}),a>-1&&(e.waveList[a].center=[r,i],e.waveList[a].time=0,e.waveList[a].on=!0)}}}),t}();t.exports=a},function(t,e,n){"use strict";var r=function(t){return t&&t.__esModule?t.default:t},i=r(n(4)),a=r(n(5)),o=r(n(6));t.exports={Default:i,Shockwave:a,Water:o}},function(t,e,n){"use strict";var r=function(t){return t&&t.__esModule?t.default:t},i=r(n(9)),a=r(n(10));t.exports={Default:i,Water:a}},function(t,e,n){"use strict";var r=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},i=function t(){r(this,t),this.type="vertex",this.source="\n            precision highp float;\n            attribute highp vec3 aVertexNormal;\n            attribute highp vec3 aVertexPosition;\n            attribute highp vec2 aTextureCoord;\n\n            uniform highp mat4 uNormalMatrix;\n            uniform highp mat4 uMVMatrix;\n\t\t\tuniform highp mat4 uPMatrix;\n\n            varying highp vec2 vTextureCoord;\n            varying highp vec3 vLighting;\n\n            void main(void){\n                gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.xy, 0.0, 1.0);\n                vTextureCoord = aTextureCoord;\n\n                highp vec3 ambientLight = vec3(1.0, 1.0, 1.0);\n                highp vec3 directionalLightColor = vec3(1.0, 0.2, 0.0);\n                highp vec3 directionalVector = vec3(0.85, 0.8, -0.40);\n\n                highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);\n\n                highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);\n                vLighting = ambientLight + (directionalLightColor * directional);\n            }\n        "};t.exports=i},function(t,e,n){"use strict";var r=function(){function t(t,e){for(var n in e){var r=e[n];r.configurable=!0,r.value&&(r.writable=!0)}Object.defineProperties(t,e)}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),i=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},a=function(){function t(){i(this,t),this.type="vertex",this.source="\n            precision highp float;\n\n            attribute highp vec3 aVertexNormal;\n            attribute highp vec3 aVertexPosition;\n            attribute highp vec2 aTextureCoord;\n\n            uniform highp mat4 uNormalMatrix;\n\t\t\tuniform highp mat4 uMVMatrix;\n\t\t\tuniform highp mat4 uPMatrix;\n\n            varying highp vec2 vTextureCoord;\n            varying highp vec3 vLighting;\n\n            uniform float\tu_amplitude;\n            uniform float \tu_frequency;\n            uniform float   u_time;\n\n            vec3 mod289(vec3 x)\n            {\n                return x - floor(x * (1.0 / 289.0)) * 289.0;\n            }\n\n            vec4 mod289(vec4 x)\n            {\n                return x - floor(x * (1.0 / 289.0)) * 289.0;\n            }\n\n            vec4 permute(vec4 x)\n            {\n                return mod289(((x*34.0)+1.0)*x);\n            }\n\n            vec4 taylorInvSqrt(vec4 r)\n            {\n                return 1.79284291400159 - 0.85373472095314 * r;\n            }\n\n            vec3 fade(vec3 t) {\n                return t*t*t*(t*(t*6.0-15.0)+10.0);\n            }\n\n            // Classic Perlin noise\n            float cnoise(vec3 P)\n            {\n                vec3 Pi0 = floor(P); // Integer part for indexing\n                vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1\n                Pi0 = mod289(Pi0);\n                Pi1 = mod289(Pi1);\n                vec3 Pf0 = fract(P); // Fractional part for interpolation\n                vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n                vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n                vec4 iy = vec4(Pi0.yy, Pi1.yy);\n                vec4 iz0 = Pi0.zzzz;\n                vec4 iz1 = Pi1.zzzz;\n\n                vec4 ixy = permute(permute(ix) + iy);\n                vec4 ixy0 = permute(ixy + iz0);\n                vec4 ixy1 = permute(ixy + iz1);\n\n                vec4 gx0 = ixy0 * (1.0 / 7.0);\n                vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n                gx0 = fract(gx0);\n                vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n                vec4 sz0 = step(gz0, vec4(0.0));\n                gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n                gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n                vec4 gx1 = ixy1 * (1.0 / 7.0);\n                vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n                gx1 = fract(gx1);\n                vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n                vec4 sz1 = step(gz1, vec4(0.0));\n                gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n                gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n                vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n                vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n                vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n                vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n                vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n                vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n                vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n                vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n                vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n                g000 *= norm0.x;\n                g010 *= norm0.y;\n                g100 *= norm0.z;\n                g110 *= norm0.w;\n                vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n                g001 *= norm1.x;\n                g011 *= norm1.y;\n                g101 *= norm1.z;\n                g111 *= norm1.w;\n\n                float n000 = dot(g000, Pf0);\n                float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n                float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n                float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n                float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n                float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n                float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n                float n111 = dot(g111, Pf1);\n\n                vec3 fade_xyz = fade(Pf0);\n                vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n                vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n                float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n                return 2.2 * n_xyz;\n            }\n\n            void main() {\n\n                float displacement = u_amplitude * cnoise( u_frequency * aVertexPosition + u_time );\n\n                vec3 newPosition = aVertexPosition + aVertexNormal * displacement;\n                gl_Position = uPMatrix * uMVMatrix * vec4(newPosition, 1.0);\n\n                vTextureCoord = aTextureCoord;\n\n                highp vec3 ambientLight = vec3(1.0, 1.0, 1.0);\n                highp vec3 directionalLightColor = vec3(0.0, 0.0, 0.0);\n                highp vec3 directionalVector = vec3(0.85, 0.8, 1.40);\n\n                highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);\n\n                highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);\n                vLighting = ambientLight + (directionalLightColor * directional);\n            }\n        "}return r(t,{setParams:{value:function(t){t=t||{};var e={};e.amplitude=t.amplitude||.05,e.frequency=t.frequency||1,e.time=0,e.DELTA_TIME=0,e.LAST_TIME=Date.now(),this.shaderParams=e}},init:{value:function(t,e){e.u_amplitude=t.getUniformLocation(e,"u_amplitude"),e.u_frequency=t.getUniformLocation(e,"u_frequency"),e.u_time=t.getUniformLocation(e,"u_time")}},draw:{value:function(t,e){var n=this.shaderParams;t.uniform1f(e.u_amplitude,n.amplitude),t.uniform1f(e.u_frequency,n.frequency),t.uniform1f(e.u_time,n.time)}},transform:{value:function(){var t=this.shaderParams;t.DELTA_TIME=Date.now()-t.LAST_TIME,t.LAST_TIME=Date.now(),t.time+=t.DELTA_TIME/1e3}}}),t}();t.exports=a},,function(t,e){t.exports=html2canvas},function(t,e,n){t.exports=n(1)},function(t,e,n){"use strict";var r=function(t){return t&&t.__esModule?t.default:t},i=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},a=r(n(12)),o=r(n(3)),s=function t(e,n){var r=this;i(this,t),n=n||{},this.fragment=null,this.vertex=null,this.canvasInfo=null;var s=function(t){var e=getComputedStyle(t).position;"static"!==e&&""!==e||(t.style.position="relative"),a(t,{useCORS:!0,onrendered:function(e){t.style.border="none";var i=new o(t,e.toDataURL("png"),n.fragment||"default",n.vertex||"default",n.params);r.fragment=i.fragment,r.vertex=i.vertex,r.canvasInfo=i.canvasInfo}})};"string"==typeof e?[].forEach.call(document.getElementsByClassName(e),function(t){s(t)}):s(e)};t.exports=s}]);