import GlUtils from './gl-utils.js';

class WebglEngine{
	constructor(parent){
		GlUtils.setupCanvas(this, parent);
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
	draw(){}
	drawObject(mesh, drawShaders){
		var ctx = this.ctx;
		ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
		var perspectiveMatrix = GlUtils.makePerspective(90.6, this.realWidth/this.realHeight, 0.1, 100.0);
		GlUtils.loadIdentity();
		GlUtils.mvPushMatrix();
		mesh.translation && GlUtils.mvTranslate(mesh.translation);
		mesh.scale && GlUtils.mvScale([mesh.scale[0],mesh.scale[1],mesh.scale[2]]);

		ctx.useProgram(this.shaderProgram);
		ctx.bindBuffer(ctx.ARRAY_BUFFER, mesh.vertexBuffer);
		ctx.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, mesh.vertexBuffer.itemSize, ctx.FLOAT, false, 0, 0);
		ctx.bindBuffer(ctx.ARRAY_BUFFER, mesh.normalBuffer);
		ctx.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, mesh.normalBuffer.itemSize, ctx.FLOAT, false, 0, 0);
		ctx.activeTexture(ctx.TEXTURE0);
		ctx.bindTexture(ctx.TEXTURE_2D, mesh.texture);
		ctx.uniform1i(this.shaderProgram.samplerUniform, 0);
		ctx.uniform2fv(this.shaderProgram.screenRatio, [1.0, this.frameInfo.screenRatio]);
		drawShaders();
		ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
		GlUtils.setMatrixUniforms(ctx, this.shaderProgram, perspectiveMatrix);
//		ctx.drawElements(ctx.TRIANGLES, mesh.indexBuffer.numItems, ctx.UNSIGNED_SHORT, 0);
		ctx.drawElements(ctx.LINE_STRIP, mesh.indexBuffer.numItems, ctx.UNSIGNED_SHORT, 0);
		GlUtils.mvPopMatrix();
}
	handleLoadedTexture(texture){
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
}

export default WebglEngine;
