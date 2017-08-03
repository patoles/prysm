import CanvasWebgl from './canvas-webgl';
import GlUtils from './gl-utils.js';
import fgShader from './shaders/shader-fs';
import vcShader from './shaders/shader-vs';

class CanvasShader extends CanvasWebgl{
	constructor(params){
		super(params);
		fgShader.setParams && fgShader.setParams(this, params);
		vcShader.setParams && vcShader.setParams(this, params);
		this.initClick(this.canvas);
		this.initShaders(fgShader, vcShader);
		this.meshes = {};
		this.meshList = [{name:'plan', texture:params.texture}];
		var meshObj = {"plan":{"vertices":[-1,-1,0,1,-1,0,1,1,0,-1,1,0],"vertexNormals":[0,0,1,0,0,1,0,0,1,0,0,1],"textures":[0,0,0,1,0,0,1,1],"indices":[0,1,2,0,2,3]}};
		this.meshList.forEach((item, key) => {
			this.meshes[item.name] = [];
			for (var mesh in meshObj[item.name])
				this.meshes[item.name][mesh] = meshObj[item.name][mesh];
			GlUtils.initMeshBuffers(this.ctx, this.meshes[item.name]);
			if (this.meshes[item.name].textures.length && item.texture !== '')
				this.initTexture(this.meshes[item.name], item.texture);
		});
	}
	initShaders(fs, vs){
		super.initShaders(fs, vs);
		fs.init && fs.init(this);
		vs.init && vs.init(this);
	}
	draw(){
		this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
		this.meshList.forEach((item, key) => {
			this.drawObject(this.meshes[item.name], [1.0, 1.0, 1.0, 1.0]);
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
