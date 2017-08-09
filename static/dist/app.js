/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var GlUtils = (function () {
	function GlUtils() {
		_classCallCheck(this, GlUtils);
	}

	_createClass(GlUtils, {
		setupCanvas: {
			value: function setupCanvas(self, parent) {
				self.active = true;
				var frameInfo = {
					fpsInterval: 0, startTime: 0, now: 0,
					then: 0, elapsed: 0, fps: 60, fpsRate: 0, screenRatio: 1
				};
				var canvas = document.createElement("canvas");
				canvas.className = "canvas hide";
				canvas.height = parent.clientHeight;
				canvas.width = parent.clientWidth;
				var ctx = this.webgl_support(canvas);
				ctx.viewport(0, 0, canvas.width, canvas.height);
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = "high";
				self.realWidth = canvas.width;
				self.realHeight = canvas.height;
				/*** HD */
				var devicePixelRatio = window.devicePixelRatio || 1;
				var backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
				var pixelRatio = devicePixelRatio / backingStoreRatio;
				if (devicePixelRatio !== backingStoreRatio) {
					canvas.width = self.realWidth * pixelRatio;
					canvas.height = self.realHeight * pixelRatio;
					canvas.style.width = self.realWidth + "px";
					canvas.style.height = self.realHeight + "px";
					ctx.viewport(0, 0, canvas.width, canvas.height);
				}
				/* HD ***/
				frameInfo.screenRatio = canvas.height / canvas.width;
				frameInfo.fpsInterval = 1000 / frameInfo.fps;
				frameInfo.then = Date.now();
				frameInfo.startTime = frameInfo.then;
				ctx.clearColor(0, 0, 0, 0);
				ctx.enable(ctx.DEPTH_TEST);
				ctx.depthFunc(ctx.LEQUAL);
				ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
				ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
				parent.appendChild(canvas);
				self.frameInfo = frameInfo;
				self.canvas = canvas;
				self.ctx = ctx;
				self.shaderProgram = null;
			}
		},
		initMeshBuffers: {
			value: function initMeshBuffers(gl, mesh) {
				mesh.normalBuffer = this.buildBuffer(gl, gl.ARRAY_BUFFER, mesh.vertexNormals, 3);
				mesh.textureBuffer = this.buildBuffer(gl, gl.ARRAY_BUFFER, mesh.textures, 2);
				mesh.vertexBuffer = this.buildBuffer(gl, gl.ARRAY_BUFFER, mesh.vertices, 3);
				mesh.indexBuffer = this.buildBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, mesh.indices, 1);
			}
		},
		buildBuffer: {
			value: function buildBuffer(gl, type, data, itemSize) {
				var buffer = gl.createBuffer();
				var arrayView = type === gl.ARRAY_BUFFER ? Float32Array : Uint16Array;
				gl.bindBuffer(type, buffer);
				gl.bufferData(type, new arrayView(data), gl.STATIC_DRAW);
				buffer.itemSize = itemSize;
				buffer.numItems = data.length / itemSize;
				return buffer;
			}
		},
		getShader: {
			value: function getShader(gl, shaderObj) {
				var shader;
				if (shaderObj.type == "fragment") shader = gl.createShader(gl.FRAGMENT_SHADER);else if (shaderObj.type == "vertex") shader = gl.createShader(gl.VERTEX_SHADER);else {
					return null;
				}gl.shaderSource(shader, shaderObj.source);
				gl.compileShader(shader);
				if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
					return null;
				}
				return shader;
			}
		},
		initShaders: {
			value: function initShaders(self, ctx, fs, vs) {
				var fragmentShader = this.getShader(ctx, fs);
				var vertexShader = this.getShader(ctx, vs);
				var shaderProgram = ctx.createProgram();
				ctx.attachShader(shaderProgram, vertexShader);
				ctx.attachShader(shaderProgram, fragmentShader);
				ctx.linkProgram(shaderProgram);
				if (!ctx.getProgramParameter(shaderProgram, ctx.LINK_STATUS)) alert("Unable to initialize the shader program.");
				ctx.useProgram(shaderProgram);
				shaderProgram.vertexPositionAttribute = ctx.getAttribLocation(shaderProgram, "aVertexPosition");
				ctx.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
				shaderProgram.vertexNormalAttribute = ctx.getAttribLocation(shaderProgram, "aVertexNormal");
				ctx.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
				shaderProgram.samplerUniform = ctx.getUniformLocation(shaderProgram, "uSampler");
				shaderProgram.screenRatio = ctx.getUniformLocation(shaderProgram, "screenRatio");
				self.shaderProgram = shaderProgram;
			}
		},
		webgl_support: {
			value: function webgl_support(canvas) {
				try {
					return !!window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
				} catch (e) {
					return false;
				}
			}
		}
	});

	return GlUtils;
})();

var _GlUtils = new GlUtils();

module.exports = _GlUtils;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Shapeshift = _interopRequire(__webpack_require__(6));

var item = document.getElementsByClassName("wavify")[0];
new Shapeshift(item, "shockwave", null, { speed: 0.02, x: 10.1, y: 0.8, z: 0.1 });
//	new Shapeshift('wavify');

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var WebglEngine = _interopRequire(__webpack_require__(7));

var GlUtils = _interopRequire(__webpack_require__(0));

var fgShader = _interopRequire(__webpack_require__(4));

var vcShader = _interopRequire(__webpack_require__(5));

var CanvasShader = (function (_WebglEngine) {
	function CanvasShader(parent, texture, fragment, vertex, params) {
		_classCallCheck(this, CanvasShader);

		_get(Object.getPrototypeOf(CanvasShader.prototype), "constructor", this).call(this, parent);
		fragment = fragment.charAt(0).toUpperCase() + fragment.slice(1);
		vertex = vertex.charAt(0).toUpperCase() + vertex.slice(1);
		this.fgShader = new fgShader[fragment]();
		this.vcShader = new vcShader[vertex]();
		this.shaderParams = {};
		this.fgShader.setParams && this.fgShader.setParams(this.shaderParams, params);
		this.vcShader.setParams && this.vcShader.setParams(this.shaderParams, params);
		this.initClick(this.canvas);
		this.initShaders(this.fgShader, this.vcShader);
		this.meshes = { plan: { vertices: [-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0], vertexNormals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1], textures: [0, 0, 0, 1, 0, 0, 1, 1], indices: [0, 1, 2, 0, 2, 3] } };
		GlUtils.initMeshBuffers(this.ctx, this.meshes.plan);
		this.initTexture(this.meshes.plan, texture);
	}

	_inherits(CanvasShader, _WebglEngine);

	_createClass(CanvasShader, {
		initShaders: {
			value: function initShaders(fs, vs) {
				GlUtils.initShaders(this, this.ctx, fs, vs);
				fs.init && fs.init(this.ctx, this.shaderProgram, this.shaderParams, { width: this.realWidth, height: this.realHeight });
				vs.init && vs.init(this.ctx, this.shaderProgram, this.shaderParams, { width: this.realWidth, height: this.realHeight });
			}
		},
		draw: {
			value: function draw() {
				var _this = this;

				this.drawObject(this.meshes.plan, function () {
					_this.fgShader.draw && _this.fgShader.draw(_this.ctx, _this.shaderProgram, _this.shaderParams);
					_this.vcShader.draw && _this.vcShader.draw(_this.ctx, _this.shaderProgram, _this.shaderParams);
				});
				this.transform();
			}
		},
		transform: {
			value: function transform() {
				this.fgShader.transform && this.fgShader.transform(this.shaderParams);
				this.vcShader.transform && this.vcShader.transform(this.shaderParams);
			}
		},
		initClick: {
			value: function initClick(target) {
				target.addEventListener("click", this.handleClick.bind(this));
				target.addEventListener("touchmove", this.handleTouchMove.bind(this));
			}
		},
		handleClick: {
			value: function handleClick(event) {
				this.fgShader.handleClick && this.fgShader.handleClick(event, this.shaderParams, { width: this.realWidth, height: this.realHeight });
				this.vcShader.handleClick && this.vcShader.handleClick(event, this.shaderParams, { width: this.realWidth, height: this.realHeight });
			}
		},
		handleTouchMove: {
			value: function handleTouchMove(event) {
				this.fgShader.handleTouchMove && this.fgShader.handleTouchMove(event, this.shaderParams, { width: this.realWidth, height: this.realHeight });
				this.vcShader.handleTouchMove && this.vcShader.handleTouchMove(event, this.shaderParams, { width: this.realWidth, height: this.realHeight });
			}
		}
	});

	return CanvasShader;
})(WebglEngine);

module.exports = CanvasShader;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Shockwave = (function () {
	function Shockwave() {
		_classCallCheck(this, Shockwave);

		this.type = "fragment", this.source = "\n\t\t\t#define MAX_WAVE_NBR 10\n\t\t\tprecision mediump float;\n\t\t\t\n\t\t\tvarying highp vec2 vTextureCoord;\n\t\t\tuniform sampler2D uSampler;\n\t\t\tuniform vec2 screenRatio;\n\t\t\t\n\t\t\tstruct waveStruct{\n\t\t\t\tvec2 center;\n\t\t\t\tfloat time;\n\t\t\t\tvec3 shockParams;\n\t\t\t\tbool hasShock;\n\t\t\t};\n\t\t\tuniform waveStruct wave[MAX_WAVE_NBR];\n\n\t\t\tvoid main(void){\n\t\t\t\tvec4 fragmentColor;\n\t\t\t\tfragmentColor = texture2D(uSampler, vTextureCoord);\n\n\t\t\t\tif (fragmentColor.a <= 0.1) discard;\n\n\t\t\t\tvec2 uv = vTextureCoord.xy;\n\t\t\t\tvec2 texCoord = uv;\n\n\t\t\t\tfor (int count=0;count < MAX_WAVE_NBR;count++)\n\t\t\t\t{\n\t\t\t\t\tfloat distance = distance(uv*screenRatio, wave[count].center*screenRatio);\n\t\t\t\t\tif ((distance <= (wave[count].time + wave[count].shockParams.z)) && (distance >= (wave[count].time - wave[count].shockParams.z)))\n\t\t\t\t\t{\n\t\t\t\t\t\tfloat diff = (distance - wave[count].time); \n\t\t\t\t\t\tfloat powDiff = 1.0 - pow(abs(diff*wave[count].shockParams.x), wave[count].shockParams.y); \n\t\t\t\t\t\tfloat diffTime = diff  * powDiff;\n\t\t\t\t\t\tvec2 diffUV = normalize((uv * screenRatio) - (wave[count].center * screenRatio)); \n\t\t\t\t\t\ttexCoord = uv + (diffUV * diffTime);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tgl_FragColor = texture2D(uSampler, texCoord);\n\t\t\t}\n\t\t";
	}

	_createClass(Shockwave, {
		setParams: {
			value: function setParams(shaderParams, params) {
				shaderParams.WAVE_LIST_SIZE = 10;
				shaderParams.WAVE_LIFESPAN = 1.5;
				shaderParams.lastTouchTime = -1;
				var speed = params && params.speed || 0.02;
				var shockParams = params ? [params.x || 10.1, params.y || 0.8, params.z || 0.1] : [10.1, 0.8, 0.1];
				shaderParams.waveParams = { shockParams: shockParams, speed: speed };
				shaderParams.waveList = [];
				for (var x = 0; x < shaderParams.WAVE_LIST_SIZE; x++) shaderParams.waveList.push({ time: 0, center: [0, 0], on: false, shockParams: shaderParams.waveParams.shockParams, speed: shaderParams.waveParams.speed });
			}
		},
		init: {
			value: function init(ctx, shaderProgram, shaderParams, canvasInfo) {
				var _this = this;

				shaderProgram.wave = new Array(10);
				shaderParams.waveList.forEach(function (item, key) {
					shaderProgram.wave[key] = {};
					shaderProgram.wave[key].center = ctx.getUniformLocation(shaderProgram, "wave[" + key + "].center");
					shaderProgram.wave[key].time = ctx.getUniformLocation(shaderProgram, "wave[" + key + "].time");
					shaderProgram.wave[key].shockParams = ctx.getUniformLocation(shaderProgram, "wave[" + key + "].shockParams");
					shaderProgram.wave[key].hasShock = ctx.getUniformLocation(shaderProgram, "wave[" + key + "].hasShock");
				});
				var posX = canvasInfo.width / 2;
				var posY = canvasInfo.height / 2;
				setInterval(function () {
					_this.setWavePos(posX, posY, shaderParams, canvasInfo);
				}, 1000);
			}
		},
		draw: {
			value: function draw(ctx, shaderProgram, shaderParams) {
				shaderParams.waveList.forEach(function (item, key) {
					ctx.uniform1i(shaderProgram.wave[key].hasShock, item.on);
					ctx.uniform2fv(shaderProgram.wave[key].center, item.center);
					ctx.uniform1f(shaderProgram.wave[key].time, item.time);
					ctx.uniform3fv(shaderProgram.wave[key].shockParams, item.shockParams);
				});
			}
		},
		transform: {
			value: function transform(shaderParams) {
				shaderParams.waveList.forEach(function (item) {
					if (item.on) {
						item.time += item.speed;
						if (item.time > shaderParams.WAVE_LIFESPAN) {
							item.on = false;
							item.center = [0, 0];
							item.time = 0;
						}
					}
				});
			}
		},
		handleClick: {
			value: function handleClick(event, shaderParams, canvasInfo) {
				var posX = event.clientX - event.target.getBoundingClientRect().left;
				var posY = event.clientY - event.target.getBoundingClientRect().top;
				this.setWavePos(posX, posY, shaderParams, canvasInfo);
			}
		},
		handleTouchMove: {
			value: function handleTouchMove(event, shaderParams, canvasInfo) {
				if (Date.now() - shaderParams.lastTouchTime > 100) {
					var posX = event.touches[0].clientX - event.target.getBoundingClientRect().left;
					var posY = event.touches[0].clientY - event.target.getBoundingClientRect().top;
					this.setWavePos(posX, posY, shaderParams, canvasInfo);
					shaderParams.lastTouchTime = Date.now();
				}
			}
		},
		setWavePos: {
			value: function setWavePos(x, y, shaderParams, canvasInfo) {
				var ratioPosX = x / canvasInfo.width;
				var ratioPosY = 1 - y / canvasInfo.height;
				var waveId = -1;
				shaderParams.waveList.forEach(function (item, key) {
					if (!item.on && waveId === -1) waveId = key;
				});
				if (waveId > -1) {
					shaderParams.waveList[waveId].center = [ratioPosX, ratioPosY];
					shaderParams.waveList[waveId].time = 0;
					shaderParams.waveList[waveId].on = true;
				}
			}
		}
	});

	return Shockwave;
})();

module.exports = Shockwave;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Shockwave = _interopRequire(__webpack_require__(3));

module.exports = { Shockwave: Shockwave };

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Default = _interopRequire(__webpack_require__(10));

module.exports = { Default: Default };

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var html2canvas = _interopRequire(__webpack_require__(8));

//import DomToCanvas from './domToCanvas';

var CanvasShader = _interopRequire(__webpack_require__(2));

var Shapeshift = function Shapeshift(target, fragmentShader, vertexShader, params) {
	_classCallCheck(this, Shapeshift);

	var action = function (item) {
		var positionStyle = getComputedStyle(item).position;
		if (positionStyle === "static" || positionStyle === "") item.style.position = "relative";
		/*
  	DomToCanvas.getCanvas(item).then(function(canvas){
  		new CanvasShader({parent:item, id:'canvas-wavify-' + Date.now(), hd:true, texture:canvas.toDataURL('png')});
  	});
  */
		html2canvas(item, {
			onrendered: function onrendered(canvas) {
				item.style.border = "none";
				new CanvasShader(item, canvas.toDataURL("png"), fragmentShader || "shockwave", vertexShader || "default", params);
			}
		});
	};
	if (typeof target === "string") [].forEach.call(document.getElementsByClassName(target), function (item) {
		action(item);
	});else action(target);
};

module.exports = Shapeshift;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var GlUtils = _interopRequire(__webpack_require__(0));

var WebglEngine = (function () {
	function WebglEngine(parent) {
		_classCallCheck(this, WebglEngine);

		GlUtils.setupCanvas(this, parent);
	}

	_createClass(WebglEngine, {
		checkFrameInterval: {
			value: function checkFrameInterval() {
				this.frameInfo.now = Date.now();
				this.frameInfo.elapsed = this.frameInfo.now - this.frameInfo.then;
				return this.frameInfo.elapsed > this.frameInfo.fpsInterval;
			}
		},
		clearScreen: {
			value: function clearScreen() {
				this.ctx.clearColor(0, 0, 0, 0);
			}
		},
		render: {
			value: function render() {
				if (this.active) {
					requestAnimationFrame(this.render.bind(this));
					if (this.checkFrameInterval()) {
						this.frameInfo.then = this.frameInfo.now - this.frameInfo.elapsed % this.frameInfo.fpsInterval;
						this.clearScreen();
						this.draw();
					}
				}
			}
		},
		draw: {
			value: function draw() {}
		},
		drawObject: {
			value: function drawObject(mesh, drawShaders) {
				var ctx = this.ctx;
				ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
				ctx.useProgram(this.shaderProgram);
				ctx.bindBuffer(ctx.ARRAY_BUFFER, mesh.vertexBuffer);
				ctx.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, mesh.vertexBuffer.itemSize, ctx.FLOAT, false, 0, 0);
				ctx.bindBuffer(ctx.ARRAY_BUFFER, mesh.normalBuffer);
				ctx.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, mesh.normalBuffer.itemSize, ctx.FLOAT, false, 0, 0);
				ctx.activeTexture(ctx.TEXTURE0);
				ctx.bindTexture(ctx.TEXTURE_2D, mesh.texture);
				ctx.uniform1i(this.shaderProgram.samplerUniform, 0);
				ctx.uniform2fv(this.shaderProgram.screenRatio, [1, this.frameInfo.screenRatio]);
				drawShaders();
				ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
				ctx.drawElements(ctx.TRIANGLES, mesh.indexBuffer.numItems, ctx.UNSIGNED_SHORT, 0);
			}
		},
		handleLoadedTexture: {
			value: function handleLoadedTexture(texture) {
				var ctx = this.ctx;
				ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);
				ctx.bindTexture(ctx.TEXTURE_2D, texture);
				ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, texture.image);
				ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
				ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
				ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
				ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
				ctx.bindTexture(ctx.TEXTURE_2D, null);
			}
		},
		initTexture: {
			value: function initTexture(object, url) {
				var _this = this;

				object.texture = this.ctx.createTexture();
				object.texture.image = new Image();
				object.texture.image.crossOrigin = "anonymous";
				object.texture.image.src = url;
				var action = function () {
					_this.handleLoadedTexture(object.texture);
					_this.render();
					_this.canvas.className = "canvas";
				};
				if (object.texture.image.complete || object.texture.image.width + object.texture.image.height > 0) action();else object.texture.image.addEventListener("load", function (event) {
					action();
				});
			}
		}
	});

	return WebglEngine;
})();

module.exports = WebglEngine;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = html2canvas;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Default = function Default() {
    _classCallCheck(this, Default);

    this.type = "vertex";
    this.source = "\n            precision mediump float;\n            attribute highp vec3 aVertexNormal;\n            attribute highp vec3 aVertexPosition;\n\n            uniform highp mat4 uNormalMatrix;\n\n            varying highp vec2 vTextureCoord;\n            varying highp vec3 vLighting;\n\n            const vec2 madd=vec2(0.5, 0.5);\n\n\n            void main(void){\n                gl_Position = vec4(aVertexPosition.xy, 0.0, 1.0);\n                vTextureCoord = aVertexPosition.xy*madd+madd;\n\n                highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);\n                highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);\n                highp vec3 directionalVector = vec3(0.85, 0.8, -0.40);\n\n                highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);\n\n                highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);\n                vLighting = ambientLight + (directionalLightColor * directional);\n            }\n        ";
};

module.exports = Default;

/***/ })
/******/ ]);