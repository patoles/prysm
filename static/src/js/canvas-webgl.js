import GlUtils from './gl-utils.js';

class CanvasWebgl{
	constructor(params){
		GlUtils.setupCanvas(this, params);
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
	checkFrameInterval(){
		this.frameInfo.now = Date.now();
		this.frameInfo.elapsed = this.frameInfo.now - this.frameInfo.then;
		return this.frameInfo.elapsed > this.frameInfo.fpsInterval;
	}
	clearScreen(){
		this.ctx.clearColor(0.0, 0.0, 0.0, 0.0);
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
	initShaders(fgShader, vcShader){
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
			this.render();
			this.canvas.className = 'canvas';
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
			this.ctx.uniform2fv(this.shaderProgram.screenRatio, [1.0, this.frameInfo.screenRatio]);
			this.waveList.forEach((item, key) => {
				this.ctx.uniform1i(this.shaderProgram.wave[key].hasShock, item.on);
				this.ctx.uniform2fv(this.shaderProgram.wave[key].center, item.center);
				this.ctx.uniform1f(this.shaderProgram.wave[key].time, item.time);
				this.ctx.uniform3fv(this.shaderProgram.wave[key].shockParams, item.shockParams);
			});
		}
		this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
		this.ctx.drawElements(this.ctx.TRIANGLES, mesh.indexBuffer.numItems, this.ctx.UNSIGNED_SHORT, 0);
	}
}

export default CanvasWebgl;
