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
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
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

		this.mvMatrixStack = [];
		this.mvMatrix = [];
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
				//		ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
				ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
				canvas.style.visibility = "visible";
				parent.appendChild(canvas);
				parent.style.visibility = "hidden";
				self.frameInfo = frameInfo;
				self.canvas = canvas;
				self.ctx = ctx;
				self.shaderProgram = null;
				self.canvasInfo = {
					width: self.realWidth, height: self.realHeight,
					center: { x: self.realWidth / 2, y: self.realHeight / 2 }
				};
			}
		},
		initMeshBuffers: {
			value: function initMeshBuffers(gl, mesh) {
				mesh.normalBuffer = this.buildBuffer(gl, gl.ARRAY_BUFFER, mesh.normals, 3);
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
				shaderProgram.textureCoordAttribute = ctx.getAttribLocation(shaderProgram, "aTextureCoord");
				ctx.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
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
		},
		makePerspective: {
			value: function makePerspective(fovy, aspect, znear, zfar) {
				var ymax = znear * Math.tan(fovy * Math.PI / 360);
				var ymin = -ymax;
				var xmin = ymin * aspect;
				var xmax = ymax * aspect;

				return this.makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
			}
		},
		makeFrustum: {
			value: function makeFrustum(left, right, bottom, top, znear, zfar) {
				var X = 2 * znear / (right - left);
				var Y = 2 * znear / (top - bottom);
				var A = (right + left) / (right - left);
				var B = (top + bottom) / (top - bottom);
				var C = -(zfar + znear) / (zfar - znear);
				var D = -2 * zfar * znear / (zfar - znear);

				return $M([[X, 0, A, 0], [0, Y, B, 0], [0, 0, C, D], [0, 0, -1, 0]]);
			}
		},
		loadIdentity: {
			value: function loadIdentity() {
				this.mvMatrix = Matrix.I(4);
			}
		},
		multMatrix: {
			value: function multMatrix(m) {
				this.mvMatrix = this.mvMatrix.x(m);
			}
		},
		mvTranslate: {
			value: function mvTranslate(v) {
				this.multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
			}
		},
		setMatrixUniforms: {
			value: function setMatrixUniforms(gl, shaderProgram, perspectiveMatrix) {
				var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
				gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));
				var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
				gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.mvMatrix.flatten()));
				var normalMatrix = this.mvMatrix.inverse();
				normalMatrix = normalMatrix.transpose();
				var nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
				gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));
			}
		},
		mvPushMatrix: {
			value: function mvPushMatrix(m) {
				if (m) {
					this.mvMatrixStack.push(m.dup());
					mvMatrix = m.dup();
				} else {
					this.mvMatrixStack.push(this.mvMatrix.dup());
				}
			}
		},
		mvPopMatrix: {
			value: function mvPopMatrix() {
				if (!this.mvMatrixStack.length) {
					throw "Can't pop from an empty matrix stack.";
				}
				this.mvMatrix = this.mvMatrixStack.pop();
				return this.mvMatrix;
			}
		},
		mvRotate: {
			value: function mvRotate(angle, v) {
				var inRadians = angle * Math.PI / 180;
				var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
				this.multMatrix(m);
			}
		},
		mvRotateMultiple: {
			value: function mvRotateMultiple(angleA, vA, angleB, vB) {
				var inRadians = angleA * Math.PI / 180;
				var mA = Matrix.Rotation(inRadians, $V([vA[0], vA[1], vA[2]])).ensure4x4();
				inRadians = angleB * Math.PI / 180;
				var mB = Matrix.Rotation(inRadians, $V([vB[0], vB[1], vB[2]])).ensure4x4();
				var m = mA.x(mB);
				this.multMatrix(m);
			}
		},
		mvScale: {
			value: function mvScale(size) {
				var m = Matrix.I(4);
				m.elements = [[size[0], 0, 0, 0], [0, size[1], 0, 0], [0, 0, size[2], 0], [0, 0, 0, 1]];
				this.multMatrix(m);
			}
		}
	});

	return GlUtils;
})();

Matrix.Translation = function (v) {
	if (v.elements.length == 2) {
		var r = Matrix.I(3);
		r.elements[2][0] = v.elements[0];
		r.elements[2][1] = v.elements[1];
		return r;
	}
	if (v.elements.length == 3) {
		var r = Matrix.I(4);
		r.elements[0][3] = v.elements[0];
		r.elements[1][3] = v.elements[1];
		r.elements[2][3] = v.elements[2];
		return r;
	}
	throw "Invalid length for Translation";
};

Matrix.prototype.flatten = function () {
	var result = [];
	if (this.elements.length == 0) return [];

	for (var j = 0; j < this.elements[0].length; j++) for (var i = 0; i < this.elements.length; i++) result.push(this.elements[i][j]);
	return result;
};

Matrix.prototype.ensure4x4 = function () {
	if (this.elements.length == 4 && this.elements[0].length == 4) return this;

	if (this.elements.length > 4 || this.elements[0].length > 4) return null;
	for (var i = 0; i < this.elements.length; i++) {
		for (var j = this.elements[i].length; j < 4; j++) {
			if (i == j) this.elements[i].push(1);else this.elements[i].push(0);
		}
	}
	for (var i = this.elements.length; i < 4; i++) {
		if (i == 0) this.elements.push([1, 0, 0, 0]);else if (i == 1) this.elements.push([0, 1, 0, 0]);else if (i == 2) this.elements.push([0, 0, 1, 0]);else if (i == 3) this.elements.push([0, 0, 0, 1]);
	}
	return this;
};

Matrix.prototype.make3x3 = function () {
	if (this.elements.length != 4 || this.elements[0].length != 4) return null;

	return Matrix.create([[this.elements[0][0], this.elements[0][1], this.elements[0][2]], [this.elements[1][0], this.elements[1][1], this.elements[1][2]], [this.elements[2][0], this.elements[2][1], this.elements[2][2]]]);
};

var _GlUtils = new GlUtils();

module.exports = _GlUtils;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Shapeshift = _interopRequire(__webpack_require__(11));

var item = document.getElementsByClassName("wavify")[0];
var shape = new Shapeshift(item, {
    fragment: "water",
    //    vertex:"water",
    params: {
        fragment: { speed: 0.02, x: 10.1, y: 0.8, z: 0.12 },
        vertex: { amplitude: 0.05, frequency: 1 }
    }
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var WebglEngine = _interopRequire(__webpack_require__(12));

var GlUtils = _interopRequire(__webpack_require__(0));

var fgShader = _interopRequire(__webpack_require__(7));

var vcShader = _interopRequire(__webpack_require__(8));

var CanvasShader = (function (_WebglEngine) {
	function CanvasShader(parent, texture, fragment, vertex, params) {
		_classCallCheck(this, CanvasShader);

		_get(Object.getPrototypeOf(CanvasShader.prototype), "constructor", this).call(this, parent);
		fragment = fragment.charAt(0).toUpperCase() + fragment.slice(1);
		vertex = vertex.charAt(0).toUpperCase() + vertex.slice(1);
		this.fragment = new fgShader[fragment](this.canvasInfo);
		this.vertex = new vcShader[vertex](this.canvasInfo);
		this.fragment.setParams && this.fragment.setParams(params.fragment);
		this.vertex.setParams && this.vertex.setParams(params.vertex);
		this.initClick(this.canvas);
		this.initShaders();
		var plane = this.createPlane(40);
		plane.translation = [0, 0, -1];
		plane.scale = [1 / this.frameInfo.screenRatio, 1, 1];
		this.meshes = { plane: plane };
		GlUtils.initMeshBuffers(this.ctx, this.meshes.plane);
		this.initTexture(this.meshes.plane, texture);
	}

	_inherits(CanvasShader, _WebglEngine);

	_createClass(CanvasShader, {
		initShaders: {
			value: function initShaders() {
				GlUtils.initShaders(this, this.ctx, this.fragment, this.vertex);
				this.fragment.init && this.fragment.init(this.ctx, this.shaderProgram);
				this.vertex.init && this.vertex.init(this.ctx, this.shaderProgram);
			}
		},
		draw: {
			value: function draw() {
				var _this = this;

				this.drawObject(this.meshes.plane, function () {
					_this.fragment.draw && _this.fragment.draw(_this.ctx, _this.shaderProgram);
					_this.vertex.draw && _this.vertex.draw(_this.ctx, _this.shaderProgram);
				});
				this.transform();
			}
		},
		transform: {
			value: function transform() {
				this.fragment.transform && this.fragment.transform();
				this.vertex.transform && this.vertex.transform();
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
				this.fragment.handleClick && this.fragment.handleClick(event);
				this.vertex.handleClick && this.vertex.handleClick(event);
			}
		},
		handleTouchMove: {
			value: function handleTouchMove(event) {
				this.fragment.handleTouchMove && this.fragment.handleTouchMove(event);
				this.vertex.handleTouchMove && this.vertex.handleTouchMove(event);
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

var Cloud = (function () {
	function Cloud(canvasInfo) {
		_classCallCheck(this, Cloud);

		this.canvasInfo = canvasInfo;
		this.type = "fragment";
		this.source = "\n            precision mediump float;\n\n\t\t\tvarying highp vec2 vTextureCoord;\n            varying highp vec3 vLighting;\n            uniform sampler2D uSampler;\n            uniform vec2 screenRatio;\n\n            uniform float f_time;\n\n\t\t\tfloat iqhash( float n )\n\t\t\t{\n\t\t\t\treturn fract(sin(n)*43758.5453);\n\t\t\t}\n\n\t\t\tfloat noise(vec3 x)\n\t\t\t{\n\t\t\t\tvec3 p = floor(x);\n\t\t\t\tvec3 f = fract(x);\n\t\t\t\tf = f * f * (3.0 - 2.0 * f);\n\t\t\t\tfloat n = p.x + p.y*57.0 + 113.0*p.z;\n\t\t\t\treturn mix(mix(mix( iqhash(n+0.0  ), iqhash(n+1.0  ),f.x),\n                   mix( iqhash(n+57.0 ), iqhash(n+58.0 ),f.x),f.y),\n               mix(mix( iqhash(n+113.0), iqhash(n+114.0),f.x),\n                   mix( iqhash(n+170.0), iqhash(n+171.0),f.x),f.y),f.z);\n\t\t\t}\n\n\t\t\tfloat map5( vec3 p )\n\t\t\t{\n\t\t\t\tvec3 q = p - vec3(0.0,0.1,1.0)*f_time;\n\t\t\t\tfloat f;\n\t\t\t\tf  = 0.50000*noise( q ); q = q*2.02;\n\t\t\t\tf += 0.25000*noise( q ); q = q*2.03;\n\t\t\t\tf += 0.12500*noise( q ); q = q*2.01;\n\t\t\t\tf += 0.06250*noise( q ); q = q*2.02;\n\t\t\t\tf += 0.03125*noise( q );\n\t\t\t\treturn clamp( 1.5 - p.y - 2.0 + 1.75*f, 0.0, 1.0 );\n\t\t\t}\n\n\t\t\tfloat map4( vec3 p )\n\t\t\t{\n\t\t\t\tvec3 q = p - vec3(0.0,0.1,1.0)*f_time;\n\t\t\t\tfloat f;\n\t\t\t\tf  = 0.50000*noise( q ); q = q*2.02;\n\t\t\t\tf += 0.25000*noise( q ); q = q*2.03;\n\t\t\t\tf += 0.12500*noise( q ); q = q*2.01;\n\t\t\t\tf += 0.06250*noise( q );\n\t\t\t\treturn clamp( 1.5 - p.y - 2.0 + 1.75*f, 0.0, 1.0 );\n\t\t\t}\n\t\t\tfloat map3( vec3 p )\n\t\t\t{\n\t\t\t\tvec3 q = p - vec3(0.0,0.1,1.0)*f_time;\n\t\t\t\tfloat f;\n\t\t\t\tf  = 0.50000*noise( q ); q = q*2.02;\n\t\t\t\tf += 0.25000*noise( q ); q = q*2.03;\n\t\t\t\tf += 0.12500*noise( q );\n\t\t\t\treturn clamp( 1.5 - p.y - 2.0 + 1.75*f, 0.0, 1.0 );\n\t\t\t}\n\t\t\tfloat map2( vec3 p )\n\t\t\t{\n\t\t\t\tvec3 q = p - vec3(0.0,0.1,1.0)*f_time;\n\t\t\t\tfloat f;\n\t\t\t\tf  = 0.50000*noise( q ); q = q*2.02;\n\t\t\t\tf += 0.25000*noise( q );;\n\t\t\t\treturn clamp( 1.5 - p.y - 2.0 + 1.75*f, 0.0, 1.0 );\n\t\t\t}\n\n\t\t\tvec3 sundir = normalize( vec3(-1.0,0.0,-1.0) );\n\n\t\t\tvec4 integrate( vec4 sum, float dif, float den, vec3 bgcol, float t )\n\t\t\t{\n\t\t\t\t// lighting\n\t\t\t\tvec3 lin = vec3(0.65,0.7,0.75)*1.4 + vec3(1.0, 0.6, 0.3)*dif;        \n\t\t\t\tvec4 col = vec4( mix( vec3(1.0,0.95,0.8), vec3(0.25,0.3,0.35), den ), den );\n\t\t\t\tcol.xyz *= lin;\n\t\t\t\tcol.xyz = mix( col.xyz, bgcol, 1.0-exp(-0.003*t*t) );\n\t\t\t\t// front to back blending    \n\t\t\t\tcol.a *= 0.4;\n\t\t\t\tcol.rgb *= col.a;\n\t\t\t\treturn sum + col*(1.0-sum.a);\n\t\t\t}\n\n\t\t\t#define MARCH(STEPS,MAPLOD) for(int i=0; i<STEPS; i++) { vec3  pos = ro + t*rd; if( pos.y<-3.0 || pos.y>2.0 || sum.a > 0.99 ) break; float den = MAPLOD( pos ); if( den>0.01 ) { float dif =  clamp((den - MAPLOD(pos+0.3*sundir))/0.6, 0.0, 1.0 ); sum = integrate( sum, dif, den, bgcol, t ); } t += max(0.05,0.02*t); }\n\n\t\t\tvec4 raymarch( vec3 ro, vec3 rd, vec3 bgcol, ivec2 px )\n\t\t\t{\n\t\t\t\tvec4 sum = vec4(0.0);\n\n\t\t\t\tfloat t = 0.0;\n\n\t\t\t\tMARCH(30,map5);\n\t\t\t\tMARCH(30,map4);\n\t\t\t\tMARCH(30,map3);\n\t\t\t\tMARCH(30,map2);\n\n\t\t\t\treturn clamp( sum, 0.0, 1.0 );\n\t\t\t}\n\n\t\t\tmat3 setCamera( vec3 ro, vec3 ta, float cr )\n\t\t\t{\n\t\t\t\tvec3 cw = normalize(ta-ro);\n\t\t\t\tvec3 cp = vec3(sin(cr), cos(cr),0.0);\n\t\t\t\tvec3 cu = normalize( cross(cw,cp) );\n\t\t\t\tvec3 cv = normalize( cross(cu,cw) );\n\t\t\t\treturn mat3( cu, cv, cw );\n\t\t\t}\n\n\t\t\tvec4 render(vec3 ro, vec3 rd, ivec2 px)\n\t\t\t{\n\t\t\t\t// background sky     \n\t\t\t\tfloat sun = clamp( dot(sundir,rd), 0.0, 1.0 );\n\t\t\t\tvec3 col = vec3(0.6,0.71,0.75) - rd.y*0.2*vec3(1.0,0.5,1.0) + 0.15*0.5;\n\t\t\t\tcol += 0.2*vec3(1.0,.6,0.1)*pow( sun, 8.0 );\n\n\t\t\t\t// clouds    \n\t\t\t\tvec4 res = raymarch( ro, rd, col, px );\n\t\t\t\tcol = col*(1.0-res.w) + res.xyz;\n\t\t\t\t\n\t\t\t\t// sun glare    \n\t\t\t\tcol += 0.2*vec3(1.0,0.4,0.2)*pow( sun, 3.0 );\n\n\t\t\t\treturn vec4( col, 1.0 );\n\t\t\t}\n\n\t\t\tvoid main(void)\n\t\t\t{\n\t\t\t\tvec2 iResolution = vec2(1.0, 1.0);\n\t\t\t\tvec2 p = (-iResolution.xy + 2.0 * vTextureCoord.xy) / iResolution.y;\n\n\t\t\t\tvec2 m = vec2(0.4,0.5) / iResolution.xy;\n\t\t\t\t\n\t\t\t\t// camera\n\t\t\t\tvec3 ro = 4.0 * normalize(vec3(sin(3.0 * m.x), 0.4 * m.y, cos(3.0 * m.x)));\n\t\t\t\tvec3 ta = vec3(0.0, -1.5, 0.0);\n\t\t\t\tmat3 ca = setCamera( ro, ta, 0.0 );\n\t\t\t\t// ray\n\t\t\t\tvec3 rd = ca * normalize( vec3(p.xy, 1.5));\n\t\t\t\t\n\t\t\t\tgl_FragColor = render(ro, rd, ivec2(vTextureCoord - 0.5) );\n\t\t\t}\n        ";
	}

	_createClass(Cloud, {
		setParams: {
			value: function setParams(params) {
				params = params || {};
				var shaderParams = {};
				shaderParams.time = 0;
				shaderParams.DELTA_TIME = 0;
				shaderParams.LAST_TIME = Date.now();
				this.shaderParams = shaderParams;
			}
		},
		init: {
			value: function init(ctx, shaderProgram) {
				var shaderParams = this.shaderParams;
				shaderProgram.f_time = ctx.getUniformLocation(shaderProgram, "f_time");
			}
		},
		draw: {
			value: function draw(ctx, shaderProgram) {
				var shaderParams = this.shaderParams;
				ctx.uniform1f(shaderProgram.f_time, shaderParams.time);
			}
		},
		transform: {
			value: function transform() {
				var shaderParams = this.shaderParams;
				shaderParams.DELTA_TIME = Date.now() - shaderParams.LAST_TIME;
				shaderParams.LAST_TIME = Date.now();
				shaderParams.time += shaderParams.DELTA_TIME / 1000;
			}
		}
	});

	return Cloud;
})();

module.exports = Cloud;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Default = function Default() {
	_classCallCheck(this, Default);

	this.type = "fragment", this.source = "\n            precision highp float;\n\n\t\t\tvarying highp vec2 vTextureCoord;\n            varying highp vec3 vLighting;\n\t\t\tuniform sampler2D uSampler;\n\n\t\t\tvoid main(void){\n\t\t\t\tvec4 fragmentColor;\n\t\t\t\tfragmentColor = texture2D(uSampler, vTextureCoord);\n\n\t\t\t\tif (fragmentColor.a <= 0.1) discard;\n\n\t\t\t\tgl_FragColor = vec4(fragmentColor.rgb * vLighting, fragmentColor.a);\n\t\t\t}\n\t\t";
};

module.exports = Default;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Shockwave = (function () {
	function Shockwave(canvasInfo) {
		_classCallCheck(this, Shockwave);

		this.canvasInfo = canvasInfo;
		this.type = "fragment", this.source = "\n\t\t\t#define MAX_WAVE_NBR 10\n            precision highp float;\n\t\t\t\n\t\t\tvarying highp vec2 vTextureCoord;\n\t\t\tvarying highp vec3 vLighting;\n\t\t\tuniform sampler2D uSampler;\n\t\t\tuniform vec2 screenRatio;\n\t\t\t\n\t\t\tstruct waveStruct{\n\t\t\t\tvec2 center;\n\t\t\t\tfloat time;\n\t\t\t\tvec3 shockParams;\n\t\t\t};\n\t\t\tuniform waveStruct wave[MAX_WAVE_NBR];\n\n\t\t\tvoid main(void){\n\t\t\t\tvec2 uv = vTextureCoord.xy;\n\t\t\t\tvec2 texCoord = uv;\n\n\t\t\t\tfor (int count=0;count < MAX_WAVE_NBR;count++)\n\t\t\t\t{\n\t\t\t\t\tfloat distance = distance(uv, wave[count].center);\n\t\t\t\t\tif ((distance <= (wave[count].time + wave[count].shockParams.z)) && (distance >= (wave[count].time - wave[count].shockParams.z)))\n\t\t\t\t\t{\n\t\t\t\t\t\tfloat diff = (distance - wave[count].time); \n\t\t\t\t\t\tfloat powDiff = 1.0 - pow(abs(diff*wave[count].shockParams.x), wave[count].shockParams.y); \n\t\t\t\t\t\tfloat diffTime = diff * powDiff;\n\t\t\t\t\t\tvec2 diffUV = normalize(uv - wave[count].center); \n\t\t\t\t\t\ttexCoord = uv + (diffUV * diffTime);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tvec4 fragmentColor = texture2D(uSampler, texCoord);\n\t\t\t\tif (fragmentColor.a <= 0.1) discard;\n\t\t\t\tgl_FragColor = vec4(fragmentColor.rgb * vLighting, fragmentColor.a);\n\t\t\t}\n\t\t";
		// Amplitude?, Refraction?, Width?
	}

	_createClass(Shockwave, {
		setParams: {
			value: function setParams(params) {
				params = params || {};
				var shaderParams = {};
				shaderParams.WAVE_LIST_SIZE = 10;
				shaderParams.WAVE_LIFESPAN = 1.5;
				shaderParams.lastTouchTime = -1;
				var speed = params && params.speed || 0.02;
				var shockParams = [params.x || 10.1, params.y || 0.8, params.z || 0.1];
				shaderParams.waveParams = { shockParams: shockParams, speed: speed };
				shaderParams.waveList = [];
				for (var x = 0; x < shaderParams.WAVE_LIST_SIZE; x++) shaderParams.waveList.push({ time: 0, center: [-100, -100], on: false, shockParams: shaderParams.waveParams.shockParams, speed: shaderParams.waveParams.speed });
				this.shaderParams = shaderParams;
			}
		},
		init: {
			value: function init(ctx, shaderProgram) {
				var shaderParams = this.shaderParams;
				shaderProgram.wave = new Array(10);
				shaderParams.waveList.forEach(function (item, key) {
					shaderProgram.wave[key] = {};
					shaderProgram.wave[key].center = ctx.getUniformLocation(shaderProgram, "wave[" + key + "].center");
					shaderProgram.wave[key].time = ctx.getUniformLocation(shaderProgram, "wave[" + key + "].time");
					shaderProgram.wave[key].shockParams = ctx.getUniformLocation(shaderProgram, "wave[" + key + "].shockParams");
				});
			}
		},
		draw: {
			value: function draw(ctx, shaderProgram) {
				var shaderParams = this.shaderParams;
				shaderParams.waveList.forEach(function (item, key) {
					ctx.uniform2fv(shaderProgram.wave[key].center, item.center);
					ctx.uniform1f(shaderProgram.wave[key].time, item.time);
					ctx.uniform3fv(shaderProgram.wave[key].shockParams, item.shockParams);
				});
			}
		},
		transform: {
			value: function transform() {
				var shaderParams = this.shaderParams;
				shaderParams.waveList.forEach(function (item) {
					if (item.on) {
						item.time += item.speed;
						if (item.time > shaderParams.WAVE_LIFESPAN) {
							item.on = false;
							item.center = [-100, -100];
							item.time = 0;
						}
					}
				});
			}
		},
		handleClick: {
			value: function handleClick(event) {
				var shaderParams = this.shaderParams;
				var posX = event.clientX - event.target.getBoundingClientRect().left;
				var posY = event.clientY - event.target.getBoundingClientRect().top;
				this.setWavePos({ x: posX, y: posY });
			}
		},
		handleTouchMove: {
			value: function handleTouchMove(event) {
				var shaderParams = this.shaderParams;
				if (Date.now() - shaderParams.lastTouchTime > 100) {
					var posX = event.touches[0].clientX - event.target.getBoundingClientRect().left;
					var posY = event.touches[0].clientY - event.target.getBoundingClientRect().top;
					this.setWavePos({ x: posX, y: posY });
					shaderParams.lastTouchTime = Date.now();
				}
			}
		},
		setWavePos: {
			value: function setWavePos(coord) {
				var shaderParams = this.shaderParams;
				var canvasInfo = this.canvasInfo;
				var ratioPosX = coord.x / canvasInfo.width;
				var ratioPosY = coord.y / canvasInfo.height;
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Water = (function () {
	function Water(canvasInfo) {
		_classCallCheck(this, Water);

		this.canvasInfo = canvasInfo;
		this.type = "fragment";
		this.source = "\n            #define TAU 6.28318530718\n            #define MAX_ITER 5\n            #define MAX_WAVE_NBR 2\n\n            precision highp float;\n\n\t\t\tvarying highp vec2 vTextureCoord;\n            varying highp vec3 vLighting;\n            uniform sampler2D uSampler;\n            uniform vec2 screenRatio;\n\n            uniform float f_time;\n\n\t\t\tstruct waveStruct{\n\t\t\t\tvec2 center;\n\t\t\t\tfloat time;\n\t\t\t\tvec3 shockParams;\n\t\t\t};\n\t\t\tuniform waveStruct wave[MAX_WAVE_NBR];\n\n            void main(void) \n            {\n                vec2 uv = vTextureCoord.xy;\n\t\t\t\tvec2 texCoord = uv;\n\t\t\t\tfor (int count=0;count < MAX_WAVE_NBR;count++)\n\t\t\t\t{\n\t\t\t\t\tfloat distance = distance(uv, wave[count].center);\n\t\t\t\t\tif ((distance <= (wave[count].time + wave[count].shockParams.z)) && (distance >= (wave[count].time - wave[count].shockParams.z)))\n\t\t\t\t\t{\n\t\t\t\t\t\tfloat diff = (distance - wave[count].time); \n\t\t\t\t\t\tfloat powDiff = 1.0 - pow(abs(diff*wave[count].shockParams.x), wave[count].shockParams.y); \n\t\t\t\t\t\tfloat diffTime = diff * powDiff;\n\t\t\t\t\t\tvec2 diffUV = normalize(uv - wave[count].center); \n\t\t\t\t\t\ttexCoord = uv + (diffUV * diffTime);\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tvec4 fragmentColor = texture2D(uSampler, texCoord);\n                float time = f_time;\n                \n                vec2 p = mod(uv*TAU, TAU)-250.0;\n\n                vec2 i = vec2(p);\n                float c = 1.0;\n                float inten = .005;\n\n                for (int n = 0; n < MAX_ITER; n++)\n                {\n                    float t = time * (1.0 - (3.5 / float(n+1)));\n                    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));\n                    c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));\n                }\n                c /= float(MAX_ITER);\n                c = 1.17-pow(c, 1.4);\n                vec3 colour = vec3(pow(abs(c), 8.0));\n                colour = clamp(colour + vec3(0.0, 0.35, 0.5), 0.0, 1.0);\n                \n                gl_FragColor = vec4(fragmentColor.rgb * vLighting * colour, fragmentColor.a);\n            }\n        ";
	}

	_createClass(Water, {
		setParams: {
			value: function setParams(params) {
				params = params || {};
				var shaderParams = {};
				shaderParams.time = 0;
				shaderParams.DELTA_TIME = 0;
				shaderParams.LAST_TIME = Date.now();
				shaderParams.WAVE_LIST_SIZE = 2;
				shaderParams.WAVE_LIFESPAN = 1.5;
				shaderParams.lastTouchTime = -1;
				var speed = params && params.speed || 0.02;
				var shockParams = [params.x || 10.1, params.y || 0.8, params.z || 0.1];
				shaderParams.waveParams = { shockParams: shockParams, speed: speed };
				shaderParams.waveList = [];
				for (var x = 0; x < shaderParams.WAVE_LIST_SIZE; x++) shaderParams.waveList.push({ time: 0, center: [-100, -100], on: false, shockParams: shaderParams.waveParams.shockParams, speed: shaderParams.waveParams.speed });
				this.shaderParams = shaderParams;
			}
		},
		init: {
			value: function init(ctx, shaderProgram) {
				var shaderParams = this.shaderParams;
				shaderProgram.f_time = ctx.getUniformLocation(shaderProgram, "f_time");
				shaderProgram.wave = new Array(10);
				shaderParams.waveList.forEach(function (item, key) {
					shaderProgram.wave[key] = {};
					shaderProgram.wave[key].center = ctx.getUniformLocation(shaderProgram, "wave[" + key + "].center");
					shaderProgram.wave[key].time = ctx.getUniformLocation(shaderProgram, "wave[" + key + "].time");
					shaderProgram.wave[key].shockParams = ctx.getUniformLocation(shaderProgram, "wave[" + key + "].shockParams");
				});
			}
		},
		draw: {
			value: function draw(ctx, shaderProgram) {
				var shaderParams = this.shaderParams;
				ctx.uniform1f(shaderProgram.f_time, shaderParams.time);
				shaderParams.waveList.forEach(function (item, key) {
					ctx.uniform2fv(shaderProgram.wave[key].center, item.center);
					ctx.uniform1f(shaderProgram.wave[key].time, item.time);
					ctx.uniform3fv(shaderProgram.wave[key].shockParams, item.shockParams);
				});
			}
		},
		transform: {
			value: function transform() {
				var shaderParams = this.shaderParams;
				shaderParams.DELTA_TIME = Date.now() - shaderParams.LAST_TIME;
				shaderParams.LAST_TIME = Date.now();
				shaderParams.time += shaderParams.DELTA_TIME / 2000;
				shaderParams.waveList.forEach(function (item) {
					if (item.on) {
						item.time += shaderParams.DELTA_TIME / 1000;
						if (item.time > shaderParams.WAVE_LIFESPAN) {
							item.on = false;
							item.center = [-100, -100];
							item.time = 0;
						}
					}
				});
			}
		},
		handleClick: {
			value: function handleClick(event) {
				var shaderParams = this.shaderParams;
				var posX = event.clientX - event.target.getBoundingClientRect().left;
				var posY = event.clientY - event.target.getBoundingClientRect().top;
				this.setWavePos({ x: posX, y: posY });
			}
		},
		handleTouchMove: {
			value: function handleTouchMove(event) {
				var shaderParams = this.shaderParams;
				if (Date.now() - shaderParams.lastTouchTime > 500) {
					var posX = event.touches[0].clientX - event.target.getBoundingClientRect().left;
					var posY = event.touches[0].clientY - event.target.getBoundingClientRect().top;
					this.setWavePos({ x: posX, y: posY });
					shaderParams.lastTouchTime = Date.now();
				}
			}
		},
		setWavePos: {
			value: function setWavePos(coord) {
				var shaderParams = this.shaderParams;
				var canvasInfo = this.canvasInfo;
				var ratioPosX = coord.x / canvasInfo.width;
				var ratioPosY = coord.y / canvasInfo.height;
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

	return Water;
})();

module.exports = Water;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Default = _interopRequire(__webpack_require__(4));

var Shockwave = _interopRequire(__webpack_require__(5));

var Water = _interopRequire(__webpack_require__(6));

var Cloud = _interopRequire(__webpack_require__(3));

module.exports = { Default: Default, Shockwave: Shockwave, Water: Water, Cloud: Cloud };

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Default = _interopRequire(__webpack_require__(9));

var Water = _interopRequire(__webpack_require__(10));

module.exports = { Default: Default, Water: Water };

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Default = function Default() {
    _classCallCheck(this, Default);

    this.type = "vertex";
    this.source = "\n            precision highp float;\n            attribute highp vec3 aVertexNormal;\n            attribute highp vec3 aVertexPosition;\n            attribute highp vec2 aTextureCoord;\n\n            uniform highp mat4 uNormalMatrix;\n            uniform highp mat4 uMVMatrix;\n\t\t\tuniform highp mat4 uPMatrix;\n\n            varying highp vec2 vTextureCoord;\n            varying highp vec3 vLighting;\n\n            void main(void){\n                gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.xy, 0.0, 1.0);\n                vTextureCoord = aTextureCoord;\n\n                highp vec3 ambientLight = vec3(1.0, 1.0, 1.0);\n                highp vec3 directionalLightColor = vec3(1.0, 0.2, 0.0);\n                highp vec3 directionalVector = vec3(0.85, 0.8, -0.40);\n\n                highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);\n\n                highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);\n                vLighting = ambientLight + (directionalLightColor * directional);\n            }\n        ";
};

module.exports = Default;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Water = (function () {
    function Water() {
        _classCallCheck(this, Water);

        this.type = "vertex";
        this.source = "\n            precision highp float;\n\n            attribute highp vec3 aVertexNormal;\n            attribute highp vec3 aVertexPosition;\n            attribute highp vec2 aTextureCoord;\n\n            uniform highp mat4 uNormalMatrix;\n\t\t\tuniform highp mat4 uMVMatrix;\n\t\t\tuniform highp mat4 uPMatrix;\n\n            varying highp vec2 vTextureCoord;\n            varying highp vec3 vLighting;\n\n            uniform float\tu_amplitude;\n            uniform float \tu_frequency;\n            uniform float   u_time;\n\n            vec3 mod289(vec3 x)\n            {\n                return x - floor(x * (1.0 / 289.0)) * 289.0;\n            }\n\n            vec4 mod289(vec4 x)\n            {\n                return x - floor(x * (1.0 / 289.0)) * 289.0;\n            }\n\n            vec4 permute(vec4 x)\n            {\n                return mod289(((x*34.0)+1.0)*x);\n            }\n\n            vec4 taylorInvSqrt(vec4 r)\n            {\n                return 1.79284291400159 - 0.85373472095314 * r;\n            }\n\n            vec3 fade(vec3 t) {\n                return t*t*t*(t*(t*6.0-15.0)+10.0);\n            }\n\n            // Classic Perlin noise\n            float cnoise(vec3 P)\n            {\n                vec3 Pi0 = floor(P); // Integer part for indexing\n                vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1\n                Pi0 = mod289(Pi0);\n                Pi1 = mod289(Pi1);\n                vec3 Pf0 = fract(P); // Fractional part for interpolation\n                vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n                vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n                vec4 iy = vec4(Pi0.yy, Pi1.yy);\n                vec4 iz0 = Pi0.zzzz;\n                vec4 iz1 = Pi1.zzzz;\n\n                vec4 ixy = permute(permute(ix) + iy);\n                vec4 ixy0 = permute(ixy + iz0);\n                vec4 ixy1 = permute(ixy + iz1);\n\n                vec4 gx0 = ixy0 * (1.0 / 7.0);\n                vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n                gx0 = fract(gx0);\n                vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n                vec4 sz0 = step(gz0, vec4(0.0));\n                gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n                gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n                vec4 gx1 = ixy1 * (1.0 / 7.0);\n                vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n                gx1 = fract(gx1);\n                vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n                vec4 sz1 = step(gz1, vec4(0.0));\n                gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n                gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n                vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n                vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n                vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n                vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n                vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n                vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n                vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n                vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n                vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n                g000 *= norm0.x;\n                g010 *= norm0.y;\n                g100 *= norm0.z;\n                g110 *= norm0.w;\n                vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n                g001 *= norm1.x;\n                g011 *= norm1.y;\n                g101 *= norm1.z;\n                g111 *= norm1.w;\n\n                float n000 = dot(g000, Pf0);\n                float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n                float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n                float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n                float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n                float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n                float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n                float n111 = dot(g111, Pf1);\n\n                vec3 fade_xyz = fade(Pf0);\n                vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n                vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n                float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n                return 2.2 * n_xyz;\n            }\n\n            void main() {\n\n                float displacement = u_amplitude * cnoise( u_frequency * aVertexPosition + u_time );\n\n                vec3 newPosition = aVertexPosition + aVertexNormal * displacement;\n                gl_Position = uPMatrix * uMVMatrix * vec4(newPosition, 1.0);\n\n                vTextureCoord = aTextureCoord;\n\n                highp vec3 ambientLight = vec3(1.0, 1.0, 1.0);\n                highp vec3 directionalLightColor = vec3(0.0, 0.0, 0.0);\n                highp vec3 directionalVector = vec3(0.85, 0.8, 1.40);\n\n                highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);\n\n                highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);\n                vLighting = ambientLight + (directionalLightColor * directional);\n            }\n        ";
    }

    _createClass(Water, {
        setParams: {
            value: function setParams(params) {
                params = params || {};
                var shaderParams = {};
                shaderParams.amplitude = params.amplitude || 0.05;
                shaderParams.frequency = params.frequency || 1;
                shaderParams.time = 0;
                shaderParams.DELTA_TIME = 0;
                shaderParams.LAST_TIME = Date.now();
                this.shaderParams = shaderParams;
            }
        },
        init: {
            value: function init(ctx, shaderProgram) {
                shaderProgram.u_amplitude = ctx.getUniformLocation(shaderProgram, "u_amplitude");
                shaderProgram.u_frequency = ctx.getUniformLocation(shaderProgram, "u_frequency");
                shaderProgram.u_time = ctx.getUniformLocation(shaderProgram, "u_time");
            }
        },
        draw: {
            value: function draw(ctx, shaderProgram) {
                var shaderParams = this.shaderParams;
                ctx.uniform1f(shaderProgram.u_amplitude, shaderParams.amplitude);
                ctx.uniform1f(shaderProgram.u_frequency, shaderParams.frequency);
                ctx.uniform1f(shaderProgram.u_time, shaderParams.time);
            }
        },
        transform: {
            value: function transform() {
                var shaderParams = this.shaderParams;
                shaderParams.DELTA_TIME = Date.now() - shaderParams.LAST_TIME;
                shaderParams.LAST_TIME = Date.now();
                shaderParams.time += shaderParams.DELTA_TIME / 1000;
            }
        }
    });

    return Water;
})();

module.exports = Water;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var html2canvas = _interopRequire(__webpack_require__(13));

//import DomToCanvas from './domToCanvas';

var CanvasShader = _interopRequire(__webpack_require__(2));

var Shapeshift = function Shapeshift(target, options) {
	var _this = this;

	_classCallCheck(this, Shapeshift);

	options = options || {};
	this.fragment = null;
	this.vertex = null;
	this.canvasInfo = null;
	var action = function (item) {
		var positionStyle = getComputedStyle(item).position;
		if (positionStyle === "static" || positionStyle === "") item.style.position = "relative";
		html2canvas(item, {
			useCORS: true,
			onrendered: function (canvas) {
				item.style.border = "none";
				var shader = new CanvasShader(item, canvas.toDataURL("png"), options.fragment || "default", options.vertex || "default", options.params);
				_this.fragment = shader.fragment;
				_this.vertex = shader.vertex;
				_this.canvasInfo = shader.canvasInfo;
			}
		});
	};
	if (typeof target === "string") [].forEach.call(document.getElementsByClassName(target), function (item) {
		action(item);
	});else action(target);
};

module.exports = Shapeshift;

/***/ }),
/* 12 */
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
				var perspectiveMatrix = GlUtils.makePerspective(89.95, this.realWidth / this.realHeight, 0.1, 100);
				GlUtils.loadIdentity();
				GlUtils.mvPushMatrix();
				mesh.translation && GlUtils.mvTranslate(mesh.translation);
				mesh.scale && GlUtils.mvScale([mesh.scale[0], mesh.scale[1], mesh.scale[2]]);
				mesh.rotation && GlUtils.mvRotateMultiple(mesh.rotation[0], [1, 0, 0], mesh.rotation[1], [0, 1, 0]);
				ctx.useProgram(this.shaderProgram);
				ctx.bindBuffer(ctx.ARRAY_BUFFER, mesh.vertexBuffer);
				ctx.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, mesh.vertexBuffer.itemSize, ctx.FLOAT, false, 0, 0);
				ctx.bindBuffer(ctx.ARRAY_BUFFER, mesh.normalBuffer);
				ctx.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, mesh.normalBuffer.itemSize, ctx.FLOAT, false, 0, 0);
				ctx.bindBuffer(ctx.ARRAY_BUFFER, mesh.textureBuffer);
				ctx.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, mesh.textureBuffer.itemSize, ctx.FLOAT, false, 0, 0);

				ctx.activeTexture(ctx.TEXTURE0);
				ctx.bindTexture(ctx.TEXTURE_2D, mesh.texture);
				ctx.uniform1i(this.shaderProgram.samplerUniform, 0);
				ctx.uniform2fv(this.shaderProgram.screenRatio, [1, this.frameInfo.screenRatio]);
				drawShaders();
				ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
				GlUtils.setMatrixUniforms(ctx, this.shaderProgram, perspectiveMatrix);
				ctx.drawElements(ctx.TRIANGLES, mesh.indexBuffer.numItems, ctx.UNSIGNED_SHORT, 0);
				//		ctx.drawElements(ctx.LINE_STRIP, mesh.indexBuffer.numItems, ctx.UNSIGNED_SHORT, 0);
				GlUtils.mvPopMatrix();
			}
		},
		handleLoadedTexture: {
			value: function handleLoadedTexture(texture) {
				var ctx = this.ctx;
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
		},
		createPlane: {
			value: function createPlane(quads) {
				var plan = {
					vertices: [], normals: [], indices: [], textures: []
				};
				for (var y = 0; y <= quads; ++y) {
					var v = -1 + y * (2 / quads);
					for (var x = 0; x <= quads; ++x) {
						var u = -1 + x * (2 / quads);
						plan.vertices = plan.vertices.concat([u, v, 0]);
						plan.normals = plan.normals.concat([0, 0, 1]);
						plan.textures = plan.textures.concat([x / quads, 1 - y / quads]);
					}
				}
				var rowSize = quads + 1;
				for (var y = 0; y < quads; ++y) {
					var rowOffset0 = (y + 0) * rowSize;
					var rowOffset1 = (y + 1) * rowSize;
					for (var x = 0; x < quads; ++x) {
						var offset0 = rowOffset0 + x;
						var offset1 = rowOffset1 + x;
						plan.indices = plan.indices.concat(offset0, offset0 + 1, offset1);
						plan.indices = plan.indices.concat(offset1, offset0 + 1, offset1 + 1);
					}
				}
				return plan;
			}
		}
	});

	return WebglEngine;
})();

module.exports = WebglEngine;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = html2canvas;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ })
/******/ ]);