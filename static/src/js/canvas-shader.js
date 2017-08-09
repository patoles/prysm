import WebglEngine from './webgl-engine';
import GlUtils from './gl-utils.js';
import fgShader from './shaders/shader-fs';
import vcShader from './shaders/shader-vs';

class CanvasShader extends WebglEngine{
	constructor(parent, texture, fragment, vertex, params){
		super(parent);
		fragment = fragment.charAt(0).toUpperCase() + fragment.slice(1);
		vertex = vertex.charAt(0).toUpperCase() + vertex.slice(1);
		this.fgShader = new fgShader[fragment]();
		this.vcShader = new vcShader[vertex]();
		this.shaderParams = {};
		this.fgShader.setParams && this.fgShader.setParams(this.shaderParams, params);
		this.vcShader.setParams && this.vcShader.setParams(this.shaderParams, params);
		this.initClick(this.canvas);
		this.initShaders(this.fgShader, this.vcShader);
		this.meshes = {"plan":{"vertices":[-1,-1,0,1,-1,0,1,1,0,-1,1,0],"vertexNormals":[0,0,1,0,0,1,0,0,1,0,0,1],"textures":[0,0,0,1,0,0,1,1],"indices":[0,1,2,0,2,3]}};
		GlUtils.initMeshBuffers(this.ctx, this.meshes.plan);
		this.initTexture(this.meshes.plan, texture);
	}
	initShaders(fs, vs){
		GlUtils.initShaders(this, this.ctx, fs, vs);
		fs.init && fs.init(this.ctx, this.shaderProgram, this.shaderParams, {width:this.realWidth, height:this.realHeight});
		vs.init && vs.init(this.ctx, this.shaderProgram, this.shaderParams, {width:this.realWidth, height:this.realHeight});
	}
	draw(){
		this.drawObject(this.meshes.plan, () => {
			this.fgShader.draw && this.fgShader.draw(this.ctx, this.shaderProgram, this.shaderParams);
			this.vcShader.draw && this.vcShader.draw(this.ctx, this.shaderProgram, this.shaderParams);
		});
		this.transform();
	}
	transform(){
		this.fgShader.transform && this.fgShader.transform(this.shaderParams);
		this.vcShader.transform && this.vcShader.transform(this.shaderParams);
	}
	initClick(target){
		target.addEventListener("click", this.handleClick.bind(this));
		target.addEventListener("touchmove", this.handleTouchMove.bind(this));
	}
	handleClick(event){
		this.fgShader.handleClick && this.fgShader.handleClick(event, this.shaderParams, {width:this.realWidth, height:this.realHeight});
		this.vcShader.handleClick && this.vcShader.handleClick(event, this.shaderParams, {width:this.realWidth, height:this.realHeight});
	}
	handleTouchMove(event){
		this.fgShader.handleTouchMove && this.fgShader.handleTouchMove(event, this.shaderParams, {width:this.realWidth, height:this.realHeight});
		this.vcShader.handleTouchMove && this.vcShader.handleTouchMove(event, this.shaderParams, {width:this.realWidth, height:this.realHeight});
	}
}

export default CanvasShader;
