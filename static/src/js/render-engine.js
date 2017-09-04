import GlUtils from './gl-utils.js';

// RenderEngine class handle the render loop, draws the plane mesh and update the GLSL parameters.
class RenderEngine{
	constructor(parent){
		// Creates and initializes the canvas and the webgl context.
		GlUtils.setupCanvas(this, parent);
		// Sets the engine parameters.
		this.frameInfo = {
			fpsInterval:0, startTime:Date.now(), now:0,
			then:Date.now(), elapsed:0, fps:60, fpsRate:0, screenRatio:this.canvas.height / this.canvas.width
		};
		this.frameInfo.fpsInterval = 1000 / this.frameInfo.fps;
		this.shaderProgram = null;
		this.canvasInfo = {
			width:this.realWidth, height:this.realHeight,
			center:{x:this.realWidth / 2, y:this.realHeight / 2}
		};
		this.active = true;
	}
	// checkFrameInterval() checks if it's time for the next draw call.
	checkFrameInterval(){
		this.frameInfo.now = Date.now();
		this.frameInfo.elapsed = this.frameInfo.now - this.frameInfo.then;
		return this.frameInfo.elapsed > this.frameInfo.fpsInterval;
	}
	// clearScreen() clears the canvas.
	clearScreen(){
		this.ctx.clearColor(0.0, 0.0, 0.0, 0.0);
	}
	// render() is the main loop of the engine. It will make a draw call every X milliseconds depending on the engine's defined FPS.
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
	// draw() is called in each render loop. It can be overloaded in the child class.
	draw(){}
	// drawObject(mesh, drawShaders) defines the perspective, transforms (translate, rotate, scale) and draws the mesh, and calls the shaders's draw() methods.
	drawObject(mesh, drawShaders){
		var ctx = this.ctx;
		ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
		var perspectiveMatrix = GlUtils.makePerspective(89.95, this.realWidth/this.realHeight, 0.1, 100.0);
		GlUtils.loadIdentity();
		GlUtils.mvPushMatrix();
		mesh.translation && GlUtils.mvTranslate(mesh.translation);
		mesh.scale && GlUtils.mvScale([mesh.scale[0],mesh.scale[1],mesh.scale[2]]);
		mesh.rotation && GlUtils.mvRotateMultiple(mesh.rotation[0], [1,0,0], mesh.rotation[1], [0,1,0]);
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
		ctx.uniform2fv(this.shaderProgram.screenRatio, [1.0, this.frameInfo.screenRatio]);
		drawShaders();
		ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
		GlUtils.setMatrixUniforms(ctx, this.shaderProgram, perspectiveMatrix);
		ctx.drawElements(ctx.TRIANGLES, mesh.indexBuffer.numItems, ctx.UNSIGNED_SHORT, 0);
		GlUtils.mvPopMatrix();
	}
	// handleLoadedTexture(texture) bind the texture to the webgl context and sets the texture parameters.
	handleLoadedTexture(texture){
		var ctx = this.ctx;
		ctx.bindTexture(ctx.TEXTURE_2D, texture);
		ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, texture.image);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
		ctx.bindTexture(ctx.TEXTURE_2D, null);
	}
	// initTexture(object, url) loads and creates the webgl texture.
	initTexture(object, url){
		object.texture = this.ctx.createTexture();
		object.texture.image = new Image();
		object.texture.image.crossOrigin = "anonymous";
		object.texture.image.src = url;
		var action = () => {
			this.handleLoadedTexture(object.texture);
			this.render();
		};
		if (object.texture.image.complete || object.texture.image.width+object.texture.image.height > 0)
			action();
		else
			object.texture.image.addEventListener('load', (event) => {action();});
	}
	// createPlane(quads) creates a plane mesh with X quads.
	createPlane(quads){
		var plane = {
			vertices:[], normals:[], indices:[], textures:[]
		};
		for (var y = 0; y <= quads; ++y) {
			var v = -1 + (y * (2 / quads));
			for (var x = 0; x <= quads; ++x) {
				var u = -1 + (x * (2 / quads));
				plane.vertices = plane.vertices.concat([u, v, 0])
				plane.normals = plane.normals.concat([0, 0, 1])
				plane.textures = plane.textures.concat([x / quads, 1 - (y / quads)]);
			}
		}
		var rowSize = (quads + 1);
		for (var y = 0; y < quads; ++y) {
			var rowOffset0 = (y + 0) * rowSize;
			var rowOffset1 = (y + 1) * rowSize;
			for (var x = 0; x < quads; ++x) {
				var offset0 = rowOffset0 + x;
				var offset1 = rowOffset1 + x;
				plane.indices = plane.indices.concat(offset0, offset0 + 1, offset1);
				plane.indices = plane.indices.concat(offset1, offset0 + 1, offset1 + 1);
			}
		}
		return plane;
	}
}

export default RenderEngine;
