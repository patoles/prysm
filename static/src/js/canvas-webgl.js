import GlUtils from './gl-utils.js';
import fgShader from './shaders/shader-fs';
import vcShader from './shaders/shader-vs';

class CanvasWebgl{
	constructor(params){
		this.frameInfo = {
			fpsInterval:0, startTime:0, now:0,
			then:0, elapsed:0, fps:60, fpsRate:0
		};
		this.glUtils = new GlUtils();
		this.waveParams = params.waveParams || {shockParams:[10.1,0.8,0.1], speed:0.02};
		this.waveList = [];
		this.initWaveList();
		var app = params.parent || document.getElementById('main');
		this.screenHeight = params.height || app.clientHeight;
		this.screenWidth = params.width || app.clientWidth;
		this.canvas = document.getElementById(params.id) || document.createElement('canvas');
		this.active = true;
		this.canvas.id = params.id;
		this.canvas.className = 'canvas hide';
		this.canvas.height = this.screenHeight;
		this.canvas.width = this.screenWidth;
		this.ctx = this.glUtils.webgl_support(this.canvas);
		this.hidden = params.hide;
		this.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.font = "14px Arial";
		this.ctx.fillStyle="#ffffff";
		this.ctx.imageSmoothingEnabled = true;
		this.ctx.imageSmoothingQuality = "high";
		this.oldWidth = this.canvas.width;
		this.oldHeight = this.canvas.height;
		if (params.hd)
		{
			this.devicePixelRatio = window.devicePixelRatio || 1,
			this.backingStoreRatio = this.ctx.webkitBackingStorePixelRatio || this.ctx.mozBackingStorePixelRatio || this.ctx.msBackingStorePixelRatio || this.ctx.oBackingStorePixelRatio || this.ctx.backingStorePixelRatio || 1;
			this.pixelRatio = this.devicePixelRatio / this.backingStoreRatio;
			if (this.devicePixelRatio !== this.backingStoreRatio)
			{
				this.canvas.width = this.oldWidth * this.pixelRatio;
				this.canvas.height = this.oldHeight * this.pixelRatio;
				this.canvas.style.width = this.oldWidth + 'px';
				this.canvas.style.height = this.oldHeight + 'px';
				this.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
			}
		}
		this.screenRatio = this.canvas.height / this.canvas.width;
		this.frameInfo.fpsInterval = 1000 / this.frameInfo.fps;
		this.frameInfo.then = Date.now();
		this.frameInfo.startTime = this.frameInfo.then;
		this.shaderProgram = null;
		this.perspectiveMatrix;
		this.clearScreen();
		this.ctx.enable(this.ctx.DEPTH_TEST);
		this.ctx.depthFunc(this.ctx.LEQUAL);
		this.ctx.pixelStorei(this.ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
		this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
		if (this.hidden)
			this.canvas.className = 'canvas hide';
		if (!document.getElementById(params.id))
			app.appendChild(this.canvas);
		this.initShaders();
		this.initClick(this.canvas);
	}
	checkFrameInterval(){
		this.frameInfo.now = Date.now();
		this.frameInfo.elapsed = this.frameInfo.now - this.frameInfo.then;
		return this.frameInfo.elapsed > this.frameInfo.fpsInterval;
	}
	clearScreen(){
		this.ctx.clearColor(0.0, 0.0, 0.0, 0.0);
	}
	render(){
		if (this.active)
		{
			requestAnimationFrame(this.render.bind(this));
			if (this.checkFrameInterval())
			{
				this.frameInfo.then = this.frameInfo.now - (this.frameInfo.elapsed % this.frameInfo.fpsInterval);
				this.clearScreen();
				this.draw();
			}
		}
	}
	destruct(){
		this.active = false;
	}
	hide(cb){
		this.canvas.className = "canvas hide";
		setTimeout(() => {
			this.destruct();
			if (cb)
				cb();
		}, 500);
	}
	getFPS(){
		if (this.frameInfo.elapsed !== 0)
		{
			var fpsFilter = 50;
			var frameFPS = 1000 / this.frameInfo.elapsed;
			this.frameInfo.fpsRate += (frameFPS - this.frameInfo.fpsRate) / fpsFilter;
		}
		return this.frameInfo.fpsRate;
	}
	getShader(gl, shaderObj) {
		var shader;		
		if (shaderObj.type == "x-shader/x-fragment")
			shader = gl.createShader(gl.FRAGMENT_SHADER);
		else if (shaderObj.type == "x-shader/x-vertex")
			shader = gl.createShader(gl.VERTEX_SHADER);
		else
			return null;
		gl.shaderSource(shader, shaderObj.source);
		gl.compileShader(shader);  
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
			alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
			return null;  
		}
		return shader;
	}
	initShaders(){
		var fragmentShader = this.getShader(this.ctx, fgShader);
		var vertexShader = this.getShader(this.ctx, vcShader);
		this.shaderProgram = this.ctx.createProgram();
		this.ctx.attachShader(this.shaderProgram, vertexShader);
		this.ctx.attachShader(this.shaderProgram, fragmentShader);
		this.ctx.linkProgram(this.shaderProgram);
		if (!this.ctx.getProgramParameter(this.shaderProgram, this.ctx.LINK_STATUS)) {
			alert("Unable to initialize the shader program.");
		}
		this.ctx.useProgram(this.shaderProgram);
		this.shaderProgram.vertexPositionAttribute = this.ctx.getAttribLocation(this.shaderProgram, "aVertexPosition");
		this.ctx.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
		this.shaderProgram.vertexNormalAttribute = this.ctx.getAttribLocation(this.shaderProgram, "aVertexNormal");
		this.ctx.enableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
		this.shaderProgram.hasTexure = this.ctx.getUniformLocation(this.shaderProgram, "uHasTexure");
		this.shaderProgram.samplerUniform = this.ctx.getUniformLocation(this.shaderProgram, "uSampler");
		this.shaderProgram.modelColor = this.ctx.getUniformLocation(this.shaderProgram, "uColor");
		this.shaderProgram.screenRatio = this.ctx.getUniformLocation(this.shaderProgram, "screenRatio");
		this.shaderProgram.wave = new Array(10);
		this.waveList.forEach((item, key) => {
			this.shaderProgram.wave[key] = {};
			this.shaderProgram.wave[key].center = this.ctx.getUniformLocation(this.shaderProgram, "wave[" + key + "].center");
			this.shaderProgram.wave[key].time = this.ctx.getUniformLocation(this.shaderProgram, "wave[" + key + "].time");
			this.shaderProgram.wave[key].shockParams = this.ctx.getUniformLocation(this.shaderProgram, "wave[" + key + "].shockParams");
			this.shaderProgram.wave[key].hasShock = this.ctx.getUniformLocation(this.shaderProgram, "wave[" + key + "].hasShock");
		})
	}
	handleLoadedTexture(texture){
		this.ctx.pixelStorei(this.ctx.UNPACK_FLIP_Y_WEBGL, true);
		this.ctx.bindTexture(this.ctx.TEXTURE_2D, texture);
		this.ctx.texImage2D(this.ctx.TEXTURE_2D, 0, this.ctx.RGBA, this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, texture.image);
		this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MAG_FILTER, this.ctx.LINEAR);
		this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.LINEAR);
		this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_S, this.ctx.CLAMP_TO_EDGE);
		this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_T, this.ctx.CLAMP_TO_EDGE);
		this.ctx.bindTexture(this.ctx.TEXTURE_2D, null);
	}
	initTexture(object, url){
		object.texture = this.ctx.createTexture();
		object.texture.image = new Image();
		object.texture.image.crossOrigin = "anonymous";
		object.texture.image.src = url;
		var action = () => {
			this.handleLoadedTexture(object.texture);
			this.loadedTextures++;
			if (this.loadedTextures === this.totalTextures)
			{
				this.render();
				if (!this.hidden)
					this.canvas.className = 'canvas';
				else
					this.canvas.className = 'canvas hide';
			}
		};
		if (object.texture.image.complete || object.texture.image.width+object.texture.image.height > 0)
			action();
		else
			object.texture.image.addEventListener('load', (event) => {action();});
	}
	drawObject(mesh, color){
		this.ctx.useProgram(this.shaderProgram);
		this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, mesh.vertexBuffer);
		this.ctx.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, mesh.vertexBuffer.itemSize, this.ctx.FLOAT, false, 0, 0);
		this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, mesh.normalBuffer);
		this.ctx.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, mesh.normalBuffer.itemSize, this.ctx.FLOAT, false, 0, 0);
		if('texture' in mesh)
		{
			this.ctx.activeTexture(this.ctx.TEXTURE0);
			this.ctx.bindTexture(this.ctx.TEXTURE_2D, mesh.texture);
			this.ctx.uniform1i(this.shaderProgram.samplerUniform, 0);
			this.ctx.uniform1i(this.shaderProgram.hasTexure, true);
			this.ctx.uniform2fv(this.shaderProgram.screenRatio, [1.0, this.screenRatio]);
			this.waveList.forEach((item, key) => {
				this.ctx.uniform1i(this.shaderProgram.wave[key].hasShock, item.on);
				this.ctx.uniform2fv(this.shaderProgram.wave[key].center, item.center);
				this.ctx.uniform1f(this.shaderProgram.wave[key].time, item.time);
				this.ctx.uniform3fv(this.shaderProgram.wave[key].shockParams, item.shockParams);
			});
		}
		else
		{
			this.ctx.disableVertexAttribArray(this.shaderProgram.textureCoordAttribute);
			this.ctx.uniform1i(this.shaderProgram.hasTexure, false);
			this.ctx.uniform4fv(this.shaderProgram.modelColor, color);
		}
		this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
		this.glUtils.setMatrixUniforms(this.ctx, this.shaderProgram, this.perspectiveMatrix);
		this.ctx.drawElements(this.ctx.TRIANGLES, mesh.indexBuffer.numItems, this.ctx.UNSIGNED_SHORT, 0);
	}
}

export default CanvasWebgl;
