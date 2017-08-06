class GlUtils{
	setupCanvas(self, params){
		var parent = params.parent;
		self.active = true;
		var frameInfo = {
			fpsInterval:0, startTime:0, now:0,
			then:0, elapsed:0, fps:60, fpsRate:0, screenRatio:1
		};
		var canvas = document.getElementById(params.id) || document.createElement('canvas');
		canvas.id = params.id;
		canvas.className = 'canvas hide';
		canvas.height = parent.clientHeight;
		canvas.width = parent.clientWidth;
		var ctx = this.webgl_support(canvas);
		ctx.viewport(0, 0, canvas.width, canvas.height);
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = "high";
		self.realWidth = canvas.width;
		self.realHeight = canvas.height;
		if (params.hd)
		{
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
		}
		frameInfo.screenRatio = canvas.height / canvas.width;
		frameInfo.fpsInterval = 1000 / frameInfo.fps;
		frameInfo.then = Date.now();
		frameInfo.startTime = frameInfo.then;
		ctx.clearColor(0.0, 0.0, 0.0, 0.0);
		ctx.enable(ctx.DEPTH_TEST);
		ctx.depthFunc(ctx.LEQUAL);
		ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
		ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
		if (!document.getElementById(params.id))
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
	initShaders(self, fs, vs){
		var fragmentShader = this.getShader(self.ctx, fs);
		var vertexShader = this.getShader(self.ctx, vs);
		self.shaderProgram = self.ctx.createProgram();
		self.ctx.attachShader(self.shaderProgram, vertexShader);
		self.ctx.attachShader(self.shaderProgram, fragmentShader);
		self.ctx.linkProgram(self.shaderProgram);
		if (!self.ctx.getProgramParameter(self.shaderProgram, self.ctx.LINK_STATUS))
			alert("Unable to initialize the shader program.");
		self.ctx.useProgram(self.shaderProgram);
		self.shaderProgram.vertexPositionAttribute = self.ctx.getAttribLocation(self.shaderProgram, "aVertexPosition");
		self.ctx.enableVertexAttribArray(self.shaderProgram.vertexPositionAttribute);
		self.shaderProgram.vertexNormalAttribute = self.ctx.getAttribLocation(self.shaderProgram, "aVertexNormal");
		self.ctx.enableVertexAttribArray(self.shaderProgram.vertexNormalAttribute);
		self.shaderProgram.samplerUniform = self.ctx.getUniformLocation(self.shaderProgram, "uSampler");
		self.shaderProgram.screenRatio = self.ctx.getUniformLocation(self.shaderProgram, "screenRatio");
	}
	drawObject(self, mesh, drawShaders){
		self.ctx.clear(self.ctx.COLOR_BUFFER_BIT | self.ctx.DEPTH_BUFFER_BIT);
		self.ctx.useProgram(self.shaderProgram);
		self.ctx.bindBuffer(self.ctx.ARRAY_BUFFER, mesh.vertexBuffer);
		self.ctx.vertexAttribPointer(self.shaderProgram.vertexPositionAttribute, mesh.vertexBuffer.itemSize, self.ctx.FLOAT, false, 0, 0);
		self.ctx.bindBuffer(self.ctx.ARRAY_BUFFER, mesh.normalBuffer);
		self.ctx.vertexAttribPointer(self.shaderProgram.vertexNormalAttribute, mesh.normalBuffer.itemSize, self.ctx.FLOAT, false, 0, 0);
		self.ctx.activeTexture(self.ctx.TEXTURE0);
		self.ctx.bindTexture(self.ctx.TEXTURE_2D, mesh.texture);
		self.ctx.uniform1i(self.shaderProgram.samplerUniform, 0);
		self.ctx.uniform2fv(self.shaderProgram.screenRatio, [1.0, self.frameInfo.screenRatio]);
		drawShaders(self);
		self.ctx.bindBuffer(self.ctx.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
		self.ctx.drawElements(self.ctx.TRIANGLES, mesh.indexBuffer.numItems, self.ctx.UNSIGNED_SHORT, 0);
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