import WebglEngine from './webgl-engine';
import GlUtils from './gl-utils.js';
import fgShader from './shaders/shader-fs';
import vcShader from './shaders/shader-vs';

class CanvasShader extends WebglEngine{
	constructor(parent, texture, fragment, vertex, params){
		super(parent);
		fragment = fragment.charAt(0).toUpperCase() + fragment.slice(1);
		vertex = vertex.charAt(0).toUpperCase() + vertex.slice(1);
		this.fragment = new fgShader[fragment](this.canvasInfo);
		this.vertex = new vcShader[vertex](this.canvasInfo);
		this.fragment.setParams && this.fragment.setParams(params);
		this.vertex.setParams && this.vertex.setParams(params);
		this.initClick(this.canvas);
		this.initShaders(this.fragment, this.vertex);
		this.meshes = {"plan":{"vertices":[-1,-1,0,1,-1,0,1,1,0,-1,1,0],"vertexNormals":[0,0,1,0,0,1,0,0,1,0,0,1],"textures":[0,0,0,1,0,0,1,1],"indices":[0,1,2,0,2,3]}};
		GlUtils.initMeshBuffers(this.ctx, this.meshes.plan);
		this.initTexture(this.meshes.plan, texture);
	}
	initShaders(fs, vs){
		GlUtils.initShaders(this, this.ctx, fs, vs);
		fs.init && fs.init(this.ctx, this.shaderProgram);
		vs.init && vs.init(this.ctx, this.shaderProgram);
	}
	draw(){
		this.drawObject(this.meshes.plan, () => {
			this.fragment.draw && this.fragment.draw(this.ctx, this.shaderProgram);
			this.vertex.draw && this.vertex.draw(this.ctx, this.shaderProgram);
		});
		this.transform();
	}
	transform(){
		this.fragment.transform && this.fragment.transform();
		this.vertex.transform && this.vertex.transform();
	}
	initClick(target){
		target.addEventListener("click", this.handleClick.bind(this));
		target.addEventListener("touchmove", this.handleTouchMove.bind(this));
	}
	handleClick(event){
		this.fragment.handleClick && this.fragment.handleClick(event);
		this.vertex.handleClick && this.vertex.handleClick(event);
	}
	handleTouchMove(event){
		this.fragment.handleTouchMove && this.fragment.handleTouchMove(event);
		this.vertex.handleTouchMove && this.vertex.handleTouchMove(event);
	}
}

export default CanvasShader;
