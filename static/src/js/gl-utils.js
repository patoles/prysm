class GlUtils{
	setupCanvas(self, parent){
		self.active = true;
		var frameInfo = {
			fpsInterval:0, startTime:0, now:0,
			then:0, elapsed:0, fps:60, fpsRate:0, screenRatio:1
		};
		var canvas = document.createElement('canvas');
		canvas.className = 'canvas hide';
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
		if (devicePixelRatio !== backingStoreRatio)
		{
			canvas.width = self.realWidth * pixelRatio;
			canvas.height = self.realHeight * pixelRatio;
			canvas.style.width = self.realWidth + 'px';
			canvas.style.height = self.realHeight + 'px';
			ctx.viewport(0, 0, canvas.width, canvas.height);
		}
		/* HD ***/
		frameInfo.screenRatio = canvas.height / canvas.width;
		frameInfo.fpsInterval = 1000 / frameInfo.fps;
		frameInfo.then = Date.now();
		frameInfo.startTime = frameInfo.then;
		ctx.clearColor(0.0, 0.0, 0.0, 0.0);
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
	initMeshBuffers(gl, mesh ){
		mesh.normalBuffer = this.buildBuffer(gl, gl.ARRAY_BUFFER, mesh.vertexNormals, 3);
		mesh.textureBuffer = this.buildBuffer(gl, gl.ARRAY_BUFFER, mesh.textures, 2);
		mesh.vertexBuffer = this.buildBuffer(gl, gl.ARRAY_BUFFER, mesh.vertices, 3);
		mesh.indexBuffer = this.buildBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, mesh.indices, 1);
	}
	buildBuffer(gl, type, data, itemSize){
		var buffer = gl.createBuffer();
		var arrayView = type === gl.ARRAY_BUFFER ? Float32Array : Uint16Array;
		gl.bindBuffer(type, buffer);
		gl.bufferData(type, new arrayView(data), gl.STATIC_DRAW);
		buffer.itemSize = itemSize;
		buffer.numItems = data.length / itemSize;
		return buffer;
	}
	getShader(gl, shaderObj) {
		var shader;		
		if (shaderObj.type == "fragment")
			shader = gl.createShader(gl.FRAGMENT_SHADER);
		else if (shaderObj.type == "vertex")
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
	initShaders(self, ctx, fs, vs){
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
		shaderProgram.samplerUniform = ctx.getUniformLocation(shaderProgram, "uSampler");
		shaderProgram.screenRatio = ctx.getUniformLocation(shaderProgram, "screenRatio");
		self.shaderProgram = shaderProgram;
	}
	webgl_support(canvas){
		try{
			return !! window.WebGLRenderingContext && ( 
				canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) );
		}catch( e ) { return false; } 
	}
}

const _GlUtils = new GlUtils();

export default _GlUtils;