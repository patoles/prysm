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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
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
			value: function setupCanvas(self, params) {
				var parent = params.parent;
				self.active = true;
				var frameInfo = {
					fpsInterval: 0, startTime: 0, now: 0,
					then: 0, elapsed: 0, fps: 60, fpsRate: 0, screenRatio: 1
				};
				var canvas = document.getElementById(params.id) || document.createElement("canvas");
				canvas.id = params.id;
				canvas.className = "canvas hide";
				canvas.height = parent.clientHeight;
				canvas.width = parent.clientWidth;
				var ctx = this.webgl_support(canvas);
				ctx.viewport(0, 0, canvas.width, canvas.height);
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = "high";
				self.realWidth = canvas.width;
				self.realHeight = canvas.height;
				if (params.hd) {
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
				}
				frameInfo.screenRatio = canvas.height / canvas.width;
				frameInfo.fpsInterval = 1000 / frameInfo.fps;
				frameInfo.then = Date.now();
				frameInfo.startTime = frameInfo.then;
				ctx.clearColor(0, 0, 0, 0);
				ctx.enable(ctx.DEPTH_TEST);
				ctx.depthFunc(ctx.LEQUAL);
				ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
				ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
				if (!document.getElementById(params.id)) parent.appendChild(canvas);
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
				if (shaderObj.type == "x-shader/x-fragment") shader = gl.createShader(gl.FRAGMENT_SHADER);else if (shaderObj.type == "x-shader/x-vertex") shader = gl.createShader(gl.VERTEX_SHADER);else {
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
			value: function initShaders(self, fs, vs) {
				var fragmentShader = this.getShader(self.ctx, fs);
				var vertexShader = this.getShader(self.ctx, vs);
				self.shaderProgram = self.ctx.createProgram();
				self.ctx.attachShader(self.shaderProgram, vertexShader);
				self.ctx.attachShader(self.shaderProgram, fragmentShader);
				self.ctx.linkProgram(self.shaderProgram);
				if (!self.ctx.getProgramParameter(self.shaderProgram, self.ctx.LINK_STATUS)) alert("Unable to initialize the shader program.");
				self.ctx.useProgram(self.shaderProgram);
				self.shaderProgram.vertexPositionAttribute = self.ctx.getAttribLocation(self.shaderProgram, "aVertexPosition");
				self.ctx.enableVertexAttribArray(self.shaderProgram.vertexPositionAttribute);
				self.shaderProgram.vertexNormalAttribute = self.ctx.getAttribLocation(self.shaderProgram, "aVertexNormal");
				self.ctx.enableVertexAttribArray(self.shaderProgram.vertexNormalAttribute);
				self.shaderProgram.samplerUniform = self.ctx.getUniformLocation(self.shaderProgram, "uSampler");
				self.shaderProgram.screenRatio = self.ctx.getUniformLocation(self.shaderProgram, "screenRatio");
			}
		},
		drawObject: {
			value: function drawObject(self, mesh, drawShaders) {
				self.ctx.clear(self.ctx.COLOR_BUFFER_BIT | self.ctx.DEPTH_BUFFER_BIT);
				self.ctx.useProgram(self.shaderProgram);
				self.ctx.bindBuffer(self.ctx.ARRAY_BUFFER, mesh.vertexBuffer);
				self.ctx.vertexAttribPointer(self.shaderProgram.vertexPositionAttribute, mesh.vertexBuffer.itemSize, self.ctx.FLOAT, false, 0, 0);
				self.ctx.bindBuffer(self.ctx.ARRAY_BUFFER, mesh.normalBuffer);
				self.ctx.vertexAttribPointer(self.shaderProgram.vertexNormalAttribute, mesh.normalBuffer.itemSize, self.ctx.FLOAT, false, 0, 0);
				self.ctx.activeTexture(self.ctx.TEXTURE0);
				self.ctx.bindTexture(self.ctx.TEXTURE_2D, mesh.texture);
				self.ctx.uniform1i(self.shaderProgram.samplerUniform, 0);
				self.ctx.uniform2fv(self.shaderProgram.screenRatio, [1, self.frameInfo.screenRatio]);
				drawShaders(self);
				self.ctx.bindBuffer(self.ctx.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
				self.ctx.drawElements(self.ctx.TRIANGLES, mesh.indexBuffer.numItems, self.ctx.UNSIGNED_SHORT, 0);
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
new Shapeshift(item);
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
	function CanvasShader(params) {
		_classCallCheck(this, CanvasShader);

		_get(Object.getPrototypeOf(CanvasShader.prototype), "constructor", this).call(this, params);
		fgShader.setParams && fgShader.setParams(this, params);
		vcShader.setParams && vcShader.setParams(this, params);
		this.initClick(this.canvas);
		this.initShaders(fgShader, vcShader);
		this.meshes = { plan: { vertices: [-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0], vertexNormals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1], textures: [0, 0, 0, 1, 0, 0, 1, 1], indices: [0, 1, 2, 0, 2, 3] } };
		GlUtils.initMeshBuffers(this.ctx, this.meshes.plan);
		this.initTexture(this.meshes.plan, params.texture);
	}

	_inherits(CanvasShader, _WebglEngine);

	_createClass(CanvasShader, {
		initShaders: {
			value: function initShaders(fs, vs) {
				GlUtils.initShaders(this, fs, vs);
				fs.init && fs.init(this);
				vs.init && vs.init(this);
			}
		},
		draw: {
			value: function draw() {
				GlUtils.drawObject(this, this.meshes.plan, function (self) {
					fgShader.draw && fgShader.draw(self);
					vcShader.draw && vcShader.draw(self);
				});
				this.transform();
			}
		},
		transform: {
			value: function transform() {
				fgShader.transform && fgShader.transform(this);
				vcShader.transform && vcShader.transform(this);
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
				fgShader.handleClick && fgShader.handleClick(event, this);
				vcShader.handleClick && vcShader.handleClick(event, this);
			}
		},
		handleTouchMove: {
			value: function handleTouchMove(event) {
				fgShader.handleTouchMove && fgShader.handleTouchMove(event, this);
				vcShader.handleTouchMove && vcShader.handleTouchMove(event, this);
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

var DomToCanvas = (function () {
    function DomToCanvas() {
        _classCallCheck(this, DomToCanvas);
    }

    _createClass(DomToCanvas, {
        getCanvas: {
            value: function getCanvas(target) {
                var _this = this;

                return new Promise(function (resolve, reject) {
                    var wrap = document.createElement("div");
                    var targetCopy = target.cloneNode(true);
                    target.appendChild(targetCopy);
                    var computedStyle = getComputedStyle(target);
                    var backgroundImage = computedStyle["background-image"];
                    targetCopy.style = computedStyle.cssText;
                    targetCopy.style.margin = "0";
                    targetCopy.style.padding = "0";
                    targetCopy.style.WebkitTextFillColor = "";

                    /*
                                var getChild = (main) => {
                                    [].forEach.call(main, (child, key) => {
                    //                    childCopy.style = getComputedStyle(child)["cssText"];
                                        if (child.hasChildNodes())
                                            getChild(child.children);
                                    });
                                }
                                getChild(target.children, targetCopy);
                    */

                    var getSVG = function (bgImg) {
                        var width = computedStyle.width.replace("px", "");
                        var height = computedStyle.height.replace("px", "");
                        if (bgImg) {
                            var bgURI = _this.getBase64Canvas(bgImg, width, height).toDataURL("png");
                            targetCopy.style.backgroundImage = "url(\"" + bgURI + "\")";
                        }
                        wrap.appendChild(targetCopy);
                        _this.addDOMElement(resolve, wrap.innerHTML, width, height);
                    };
                    if (backgroundImage && backgroundImage !== "" && backgroundImage !== "none") {
                        backgroundImage = backgroundImage.match(/\((.*?)\)/)[1].replace(/('|")/g, "");
                        var bgImg = new Image();
                        bgImg.onload = function () {
                            getSVG(bgImg);
                        };
                        _this.setCrossOrigin(bgImg, backgroundImage);
                        //                bgImg.src = backgroundImage;
                        var loadBgInterval = setInterval(function () {
                            if (bgImg.complete || bgImg.width + bgImg.height > 0) {
                                bgImg.onload();
                                clearInterval(loadBgInterval);
                            }
                        }, 50);
                    } else getSVG();
                });
            }
        },
        getBase64Canvas: {
            value: function getBase64Canvas(img, width, height) {
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                var devicePixelRatio = window.devicePixelRatio || 1;
                var backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
                var pixelRatio = devicePixelRatio / backingStoreRatio;
                if (devicePixelRatio !== backingStoreRatio) {
                    canvas.width = width * pixelRatio;
                    canvas.height = height * pixelRatio;
                    canvas.style.width = width + "px";
                    canvas.style.height = height + "px";
                    ctx.scale(pixelRatio, pixelRatio);
                }
                ctx.drawImage(img, 0, 0, width, height);
                return canvas;
            }
        },
        setCrossOrigin: {
            value: function setCrossOrigin(img, imageSource) {
                if (imageSource.substring(0, 4).toLowerCase() === "http") img.crossOrigin = "";else img.crossOrigin = null;
            }
        },
        addDOMElement: {
            value: function addDOMElement(resolve, html, width, height) {
                var _this = this;

                var data = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + width + "\" height=\"" + height + "\" xmlns:xlink= \"http://www.w3.org/1999/xlink\">" + "<foreignObject width=\"" + width + "\" height=\"" + height + "\">" + "<div xmlns=\"http://www.w3.org/1999/xhtml\" style=\"display:block;width:100%;height:100%;position:relative\">" + html + "</div>" + "</foreignObject>" + "</svg>";
                var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(data);
                var img = new Image();
                img.addEventListener("load", function (e) {
                    var canvas = _this.getBase64Canvas(img, width, height);
                    resolve(canvas);
                });
                img.src = url;
            }
        }
    });

    return DomToCanvas;
})();

var _DomToCanvas = new DomToCanvas();

module.exports = _DomToCanvas;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	type: "x-shader/x-fragment",
	source: "\n        #define MAX_WAVE_NBR 10\n\t\tprecision mediump float;\n\t\t\n        varying highp vec2 vTextureCoord;\n        uniform sampler2D uSampler;\n\t\tuniform vec2 screenRatio;\n\t\t\n        struct waveStruct{\n            vec2 center;\n            float time;\n            vec3 shockParams;\n            bool hasShock;\n        };\n        uniform waveStruct wave[MAX_WAVE_NBR];\n\n        void main(void){\n            vec4 fragmentColor;\n\t\t\tfragmentColor = texture2D(uSampler, vTextureCoord);\n\n            if (fragmentColor.a <= 0.1) discard;\n\n            vec2 uv = vTextureCoord.xy;\n            vec2 texCoord = uv;\n\n            for (int count=0;count < MAX_WAVE_NBR;count++)\n            {\n                float distance = distance(uv*screenRatio, wave[count].center*screenRatio);\n                if ((distance <= (wave[count].time + wave[count].shockParams.z)) && (distance >= (wave[count].time - wave[count].shockParams.z)))\n                {\n                    float diff = (distance - wave[count].time); \n                    float powDiff = 1.0 - pow(abs(diff*wave[count].shockParams.x), wave[count].shockParams.y); \n                    float diffTime = diff  * powDiff;\n                    vec2 diffUV = normalize((uv * screenRatio) - (wave[count].center * screenRatio)); \n                    texCoord = uv + (diffUV * diffTime);\n                }\n            }\n            gl_FragColor = texture2D(uSampler, texCoord);\n        }\n    ",
	setParams: function setParams(self, params) {
		self.WAVE_LIST_SIZE = 10;
		self.WAVE_LIFESPAN = 1.5;
		self.lastTouchTime = -1;
		var parent = params.parent;
		var speed = parent.dataset.waveSpeed && parseFloat(parent.dataset.waveSpeed) || 0.02;
		var x = parent.dataset.waveX && parseFloat(parent.dataset.waveX);
		var y = parent.dataset.waveY && parseFloat(parent.dataset.waveY);
		var z = parent.dataset.waveZ && parseFloat(parent.dataset.waveZ);
		var shockParams = [x || 10.1, y || 0.8, z || 0.1];
		self.waveParams = { shockParams: shockParams, speed: speed };
		self.waveList = [];
		for (var x = 0; x < self.WAVE_LIST_SIZE; x++) self.waveList.push({ time: 0, center: [0, 0], on: false, shockParams: self.waveParams.shockParams, speed: self.waveParams.speed });
	},
	init: function init(self) {
		var _this = this;

		self.shaderProgram.wave = new Array(10);
		self.waveList.forEach(function (item, key) {
			self.shaderProgram.wave[key] = {};
			self.shaderProgram.wave[key].center = self.ctx.getUniformLocation(self.shaderProgram, "wave[" + key + "].center");
			self.shaderProgram.wave[key].time = self.ctx.getUniformLocation(self.shaderProgram, "wave[" + key + "].time");
			self.shaderProgram.wave[key].shockParams = self.ctx.getUniformLocation(self.shaderProgram, "wave[" + key + "].shockParams");
			self.shaderProgram.wave[key].hasShock = self.ctx.getUniformLocation(self.shaderProgram, "wave[" + key + "].hasShock");
		});
		var posX = self.realWidth / 2;
		var posY = self.realHeight / 2;
		setInterval(function () {
			_this.setWavePos(self, posX, posY);
		}, 1000);
	},
	draw: function draw(self) {
		self.waveList.forEach(function (item, key) {
			self.ctx.uniform1i(self.shaderProgram.wave[key].hasShock, item.on);
			self.ctx.uniform2fv(self.shaderProgram.wave[key].center, item.center);
			self.ctx.uniform1f(self.shaderProgram.wave[key].time, item.time);
			self.ctx.uniform3fv(self.shaderProgram.wave[key].shockParams, item.shockParams);
		});
	},
	transform: function transform(self) {
		self.waveList.forEach(function (item) {
			if (item.on) {
				item.time += item.speed;
				if (item.time > self.WAVE_LIFESPAN) {
					item.on = false;
					item.center = [0, 0];
					item.time = 0;
				}
			}
		});
	},
	handleClick: function handleClick(event, self) {
		var posX = event.clientX - event.target.getBoundingClientRect().left;
		var posY = event.clientY - event.target.getBoundingClientRect().top;
		this.setWavePos(self, posX, posY);
	},
	handleTouchMove: function handleTouchMove(event, self) {
		if (Date.now() - self.lastTouchTime > 100) {
			var posX = event.touches[0].clientX - event.target.getBoundingClientRect().left;
			var posY = event.touches[0].clientY - event.target.getBoundingClientRect().top;
			this.setWavePos(self, posX, posY);
			self.lastTouchTime = Date.now();
		}
	},
	setWavePos: function setWavePos(self, x, y) {
		var ratioPosX = x / self.realWidth;
		var ratioPosY = 1 - y / self.realHeight;
		var waveId = -1;
		self.waveList.forEach(function (item, key) {
			if (!item.on && waveId === -1) waveId = key;
		});
		if (waveId > -1) {
			self.waveList[waveId].center = [ratioPosX, ratioPosY];
			self.waveList[waveId].time = 0;
			self.waveList[waveId].on = true;
		}
	}
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    type: "x-shader/x-vertex",
    source: "\n        precision mediump float;\n        attribute highp vec3 aVertexNormal;\n        attribute highp vec3 aVertexPosition;\n\n        uniform highp mat4 uNormalMatrix;\n\n        varying highp vec2 vTextureCoord;\n        varying highp vec3 vLighting;\n\n        const vec2 madd=vec2(0.5, 0.5);\n\n\n        void main(void){\n            gl_Position = vec4(aVertexPosition.xy, 0.0, 1.0);\n            vTextureCoord = aVertexPosition.xy*madd+madd;\n\n            highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);\n            highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);\n            highp vec3 directionalVector = vec3(0.85, 0.8, -0.40);\n\n            highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);\n\n            highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);\n            vLighting = ambientLight + (directionalLightColor * directional);\n        }\n    "
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

//import html2canvas from 'html2canvas';

var DomToCanvas = _interopRequire(__webpack_require__(3));

var CanvasShader = _interopRequire(__webpack_require__(2));

var Shapeshift = function Shapeshift(target) {
	_classCallCheck(this, Shapeshift);

	var action = function (item) {
		var positionStyle = getComputedStyle(item).position;
		if (positionStyle === "static" || positionStyle === "") item.style.position = "relative";
		DomToCanvas.getCanvas(item).then(function (canvas) {
			new CanvasShader({ parent: item, id: "canvas-wavify-" + Date.now(), hd: true, texture: canvas.toDataURL("png") });
		});
		/*
  var positionStyle = getComputedStyle(item)["position"];
  if (positionStyle === "static" || positionStyle === "")
  	item.style.position = "relative";
  html2canvas(item).then(function(canvas) {
  	item.style.border = 'none';
  	new CanvasShader({parent:item, id:'canvas-wavify-' + Date.now(), hd:true, texture:canvas.toDataURL('png')});
  });
  */
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
	function WebglEngine(params) {
		_classCallCheck(this, WebglEngine);

		GlUtils.setupCanvas(this, params);
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
		handleLoadedTexture: {
			value: function handleLoadedTexture(texture) {
				this.ctx.pixelStorei(this.ctx.UNPACK_FLIP_Y_WEBGL, true);
				this.ctx.bindTexture(this.ctx.TEXTURE_2D, texture);
				this.ctx.texImage2D(this.ctx.TEXTURE_2D, 0, this.ctx.RGBA, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, texture.image);
				this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MAG_FILTER, this.ctx.LINEAR);
				this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.LINEAR);
				this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_S, this.ctx.CLAMP_TO_EDGE);
				this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_T, this.ctx.CLAMP_TO_EDGE);
				this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);
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
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ })
/******/ ]);