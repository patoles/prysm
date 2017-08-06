import GlUtils from './gl-utils.js';

class WebglEngine{
	constructor(params){
		GlUtils.setupCanvas(this, params);
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
}

export default WebglEngine;
