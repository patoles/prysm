// Matrices operations helpers.
Matrix.Translation = function(v){
	if (v.elements.length === 2){
		var r = Matrix.I(3);
		r.elements[2][0] = v.elements[0];
		r.elements[2][1] = v.elements[1];
		return r;
	}
	if (v.elements.length === 3){
		var r = Matrix.I(4);
		r.elements[0][3] = v.elements[0];
		r.elements[1][3] = v.elements[1];
		r.elements[2][3] = v.elements[2];
		return r;
	}
	throw "Invalid length for Translation";
}
Matrix.prototype.flatten = function(){
	var result = [];
	if (this.elements.length === 0)
		return [];
	for (var j = 0; j < this.elements[0].length; j++)
		for (var i = 0; i < this.elements.length; i++)
			result.push(this.elements[i][j]);
	return result;
}
Matrix.prototype.ensure4x4 = function(){
	if (this.elements.length === 4 && this.elements[0].length === 4)
		return this;
	if (this.elements.length > 4 || this.elements[0].length > 4)
		return null;
	for (var i = 0; i < this.elements.length; i++) {
		for (var j = this.elements[i].length; j < 4; j++) {
			if (i == j)
				this.elements[i].push(1);
			else
				this.elements[i].push(0);
		}
	}
	for (var i = this.elements.length; i < 4; i++) {
		if (i == 0)
			this.elements.push([1, 0, 0, 0]);
		else if (i == 1)
			this.elements.push([0, 1, 0, 0]);
		else if (i == 2)
			this.elements.push([0, 0, 1, 0]);
		else if (i == 3)
			this.elements.push([0, 0, 0, 1]);
	}
	return this;
};

// GLUtils class contains tools to interact with webgl.
class GlUtils{
	constructor(){
		this.mvMatrixStack = [];
		this.mvMatrix = [];
	}
	setupCanvas(engine, parent){
		// Creates the canvas.
		var canvas = document.createElement('canvas');
		canvas.style.position = 'absolute';
		canvas.style.top = '0';
		canvas.style.left = '0';
		canvas.width = parent.clientWidth;
		canvas.height = parent.clientHeight;
		engine.realWidth = canvas.width;
		engine.realHeight = canvas.height;
		// Creates the webgl context and define the settings.
		var ctx = this.webgl_support(canvas);
		ctx.viewport(0, 0, canvas.width, canvas.height);
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = "high";
		ctx.enable(ctx.DEPTH_TEST);
		ctx.depthFunc(ctx.LEQUAL);
		ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
		// Scales to the device's pixel ratio.
		var devicePixelRatio = window.devicePixelRatio || 1;
		var backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
		var pixelRatio = devicePixelRatio / backingStoreRatio;
		if (devicePixelRatio !== backingStoreRatio)
		{
			canvas.width = engine.realWidth * pixelRatio;
			canvas.height = engine.realHeight * pixelRatio;
			canvas.style.width = engine.realWidth + 'px';
			canvas.style.height = engine.realHeight + 'px';
			ctx.viewport(0, 0, canvas.width, canvas.height);
		}
		// Hides the parent container.
		canvas.style.visibility = 'visible';
		parent.style.visibility = 'hidden';
		parent.appendChild(canvas);
		engine.canvas = canvas;
		engine.ctx = ctx;
	}
	// initMeshBuffers(xtx, mesh) initializes the buffers for the normals, textures, vertices and indices of the mesh.
	initMeshBuffers(ctx, mesh){
		mesh.normalBuffer = this.buildBuffer(ctx, ctx.ARRAY_BUFFER, mesh.normals, 3);
		mesh.textureBuffer = this.buildBuffer(ctx, ctx.ARRAY_BUFFER, mesh.textures, 2);
		mesh.vertexBuffer = this.buildBuffer(ctx, ctx.ARRAY_BUFFER, mesh.vertices, 3);
		mesh.indexBuffer = this.buildBuffer(ctx, ctx.ELEMENT_ARRAY_BUFFER, mesh.indices, 1);
	}
	// buildBuffer(ctx, type, data, itemSize) returns a webgl context buffer.
	buildBuffer(ctx, type, data, itemSize){
		var buffer = ctx.createBuffer();
		var arrayView = type === ctx.ARRAY_BUFFER ? Float32Array : Uint16Array;
		ctx.bindBuffer(type, buffer);
		ctx.bufferData(type, new arrayView(data), ctx.STATIC_DRAW);
		buffer.itemSize = itemSize;
		buffer.numItems = data.length / itemSize;
		return buffer;
	}
	// getShader(ctx, shaderItem) loads and compiles the shader's source.
	getShader(ctx, shaderItem) {
		var shader;		
		if (shaderItem.type == "fragment")
			shader = ctx.createShader(ctx.FRAGMENT_SHADER);
		else if (shaderItem.type == "vertex")
			shader = ctx.createShader(ctx.VERTEX_SHADER);
		else
			return null;
		ctx.shaderSource(shader, shaderItem.source);
		ctx.compileShader(shader);  
		if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {  
			alert("An error occurred compiling the shaders: " + ctx.getShaderInfoLog(shader));  
			return null;  
		}
		return shader;
	}
	// initShaders(engine, ctx, fs, vs) initializes the fragment and vertex shader and sets the default GLSL parameters.
	initShaders(engine, ctx, fs, vs){
		var fragmentShader = this.getShader(ctx, fs);
		var vertexShader = this.getShader(ctx, vs);
		var shaderProgram = ctx.createProgram();
		ctx.attachShader(shaderProgram, vertexShader);
		ctx.attachShader(shaderProgram, fragmentShader);
		ctx.linkProgram(shaderProgram);
		if (!ctx.getProgramParameter(shaderProgram, ctx.LINK_STATUS))
			alert("Unable to initialize the shader program.");
		ctx.useProgram(shaderProgram);
		shaderProgram.vertexPositionAttribute = ctx.getAttribLocation(shaderProgram, "aVertexPosition");
		ctx.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
		shaderProgram.vertexNormalAttribute = ctx.getAttribLocation(shaderProgram, "aVertexNormal");
		ctx.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
		shaderProgram.textureCoordAttribute = ctx.getAttribLocation(shaderProgram, "aTextureCoord");
		ctx.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
		shaderProgram.samplerUniform = ctx.getUniformLocation(shaderProgram, "uSampler");
		shaderProgram.screenRatio = ctx.getUniformLocation(shaderProgram, "screenRatio");
		engine.shaderProgram = shaderProgram;
	}
	// webgl_support(canvas) returns a webgl context or false if it's not supported by the browser.
	webgl_support(canvas){
		try{
			return !!window.WebGLRenderingContext && ( 
				canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
		}catch(e){return false;} 
	}
	// Tools for matrices operations.
	makePerspective(fovy, aspect, znear, zfar){
		var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
		var ymin = -ymax;
		var xmin = ymin * aspect;
		var xmax = ymax * aspect;
		return this.makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
	}
	makeFrustum(left, right, bottom, top, znear, zfar){
		var X = 2 * znear / (right - left);
		var Y = 2 * znear / (top - bottom);
		var A = (right + left) / (right - left);
		var B = (top + bottom) / (top - bottom);
		var C = -(zfar + znear) / (zfar - znear);
		var D = -2 * zfar * znear / (zfar - znear);
		return $M([[X, 0, A, 0],
		[0, Y, B, 0],
		[0, 0, C, D],
		[0, 0, -1, 0]]);
	}
	loadIdentity(){
		this.mvMatrix = Matrix.I(4);
	}
	multMatrix(m){
		this.mvMatrix = this.mvMatrix.x(m);
	}
	mvTranslate(v){
		this.multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
	}
	setMatrixUniforms(gl, shaderProgram, perspectiveMatrix){
		var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
		gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));
		var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
		gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.mvMatrix.flatten()));
		var normalMatrix = this.mvMatrix.inverse();
		normalMatrix = normalMatrix.transpose();
		var nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
		gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));
	}
	mvPushMatrix(m){
		if (m){
			this.mvMatrixStack.push(m.dup());
			mvMatrix = m.dup();
		}
		else
			this.mvMatrixStack.push(this.mvMatrix.dup());
	}
	mvPopMatrix(){
		if (!this.mvMatrixStack.length)
			throw("Can't pop from an empty matrix stack.");
		this.mvMatrix = this.mvMatrixStack.pop();
		return this.mvMatrix;
	}
	mvRotate(angle, v){
		var inRadians = angle * Math.PI / 180.0;
		var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
		this.multMatrix(m);
	}
	mvRotateMultiple(angleA, vA, angleB, vB){
		var inRadians = angleA * Math.PI / 180.0;
		var mA = Matrix.Rotation(inRadians, $V([vA[0], vA[1], vA[2]])).ensure4x4();
		inRadians = angleB * Math.PI / 180.0;
		var mB = Matrix.Rotation(inRadians, $V([vB[0], vB[1], vB[2]])).ensure4x4();
		var m = mA.x(mB);
		this.multMatrix(m);
	}
	mvScale(size){
		var m = Matrix.I(4);
		m.elements = [
			[size[0], 0, 0, 0],
			[0, size[1], 0, 0],
			[0, 0, size[2], 0],
			[0, 0, 0, 1]
		];
		this.multMatrix(m);
	}
}

const _GlUtils = new GlUtils();

export default _GlUtils;