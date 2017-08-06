import WebglEngine from './webgl-engine';
import GlUtils from './gl-utils.js';
import fgShader from './shaders/shader-fs';
import vcShader from './shaders/shader-vs';

class CanvasShader extends WebglEngine{
	constructor(params){
		super(params);
		fgShader.setParams && fgShader.setParams(this, params);
		vcShader.setParams && vcShader.setParams(this, params);
		this.initClick(this.canvas);
		this.initShaders(fgShader, vcShader);
		this.meshes = {"plan":{"vertices":[-1,-1,0,1,-1,0,1,1,0,-1,1,0],"vertexNormals":[0,0,1,0,0,1,0,0,1,0,0,1],"textures":[0,0,0,1,0,0,1,1],"indices":[0,1,2,0,2,3]}};
		GlUtils.initMeshBuffers(this.ctx, this.meshes.plan);
		this.initTexture(this.meshes.plan, params.texture);
	}
	initShaders(fs, vs){
		GlUtils.initShaders(this, fs, vs);
		fs.init && fs.init(this);
		vs.init && vs.init(this);
	}
	draw(){
		GlUtils.drawObject(this, this.meshes.plan, (self) => {
			fgShader.draw && fgShader.draw(self);
			vcShader.draw && vcShader.draw(self);
		});
		this.transform();
	}
	transform(){
		fgShader.transform && fgShader.transform(this);
		vcShader.transform && vcShader.transform(this);
	}
	initClick(target){
		target.addEventListener("click", this.handleClick.bind(this));
		target.addEventListener("touchmove", this.handleTouchMove.bind(this));
	}
	handleClick(event){
		fgShader.handleClick && fgShader.handleClick(event, this);
		vcShader.handleClick && vcShader.handleClick(event, this);
	}
	handleTouchMove(event){
		fgShader.handleTouchMove && fgShader.handleTouchMove(event, this);
		vcShader.handleTouchMove && vcShader.handleTouchMove(event, this);
	}
}

export default CanvasShader;
