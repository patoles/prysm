import CanvasWebgl from './canvas-webgl';
import GlUtils from './gl-utils.js';
import fgShader from './shaders/shader-fs';
import vcShader from './shaders/shader-vs';

class Canvas3D extends CanvasWebgl{
	constructor(params){
		super(params);
		/* INIT WAVE */
		this.WAVE_LIST_SIZE = 2;
		this.WAVE_LIFESPAN = 1.5;
		var parent = params.parent;
		var speed = (parent.dataset.waveSpeed && parseFloat(parent.dataset.waveSpeed)) || 0.02;
		var x = parent.dataset.waveX && parseFloat(parent.dataset.waveX);
		var y = parent.dataset.waveY && parseFloat(parent.dataset.waveY);
		var z = parent.dataset.waveZ && parseFloat(parent.dataset.waveZ);
		var shockParams = [x || 10.1, y || 0.8, z || 0.1];
		this.waveParams = {shockParams, speed};
		this.waveList = [];
		this.initWaveList();
		/* END INIT WAVE */
		this.initClick(this.canvas);
		this.lastTouchTime = -1;
		this.meshes = {};
		this.meshList = [{name:'plan', texture:params.texture}];
		this.initShaders(fgShader, vcShader);
		var meshObj = {"plan":{"vertices":[-1,-1,0,1,-1,0,1,1,0,-1,1,0],"vertexNormals":[0,0,1,0,0,1,0,0,1,0,0,1],"textures":[0,0,0,1,0,0,1,1],"indices":[0,1,2,0,2,3]}};
		this.objStart(meshObj);
	}
	objStart(meshObj){
		this.meshList.forEach((item, key) => {
			this.meshes[item.name] = [];
			for (var mesh in meshObj[item.name])
				this.meshes[item.name][mesh] = meshObj[item.name][mesh];
			GlUtils.initMeshBuffers(this.ctx, this.meshes[item.name]);
			if (this.meshes[item.name].textures.length && item.texture !== '')
				this.initTexture(this.meshes[item.name], item.texture);
		});
	}
	updateTexture(object, url){
		object.texture = this.ctx.createTexture();
		object.texture.image = new Image();
		object.texture.image.crossOrigin = "anonymous";
		object.texture.image.onload = () => {
			this.handleLoadedTexture(object.texture);
		};
		object.texture.image.src = url;
	}
	render(){
		super.render();
	}
	draw(){
		this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
		this.meshList.forEach((item, key) => {
			this.drawObject(this.meshes[item.name], [1.0, 1.0, 1.0, 1.0]);
		});
		this.transform();
	}
	transform(){
		this.waveList.forEach((item) => {
			if (item.on)
			{
				item.time += item.speed;
				if (item.time > this.WAVE_LIFESPAN)
				{
					item.on = false;
					item.center = [0,0];
					item.time = 0;
				}
			}
		});
	}
	initWaveList(){
		var shockParams = this.waveParams.shockParams;
		var speed = this.waveParams.speed;
		for (var x = 0;x < this.WAVE_LIST_SIZE;x++)
			this.waveList.push({time:0, center:[0, 0], on:false, shockParams, speed});
	}
	initClick(target){
		target.addEventListener("click", this.handleClick.bind(this));
		target.addEventListener("touchmove", this.handleTouchMove.bind(this));
	}
	handleClick(event){
		var posX = event.clientX - event.target.getBoundingClientRect().left;
		var posY = event.clientY - event.target.getBoundingClientRect().top;
		this.setWavePos(posX, posY);
	}
	handleTouchMove(event){
		if (Date.now() - this.lastTouchTime > 100)
		{
			var posX = event.touches[0].clientX;
			var posY = event.touches[0].clientY;
			this.setWavePos(posX, posY);
			this.lastTouchTime = Date.now();
		}
	}
	setWavePos(x, y){
		var ratioPosX = x / this.realWidth;
		var ratioPosY =  1 - (y / this.realHeight);
		var waveId = -1;
		this.waveList.forEach((item, key) => {
			if (!item.on && waveId === -1)
				waveId = key;
		});
		if (waveId > -1)
		{
			this.waveList[waveId].center = [ratioPosX, ratioPosY];
			this.waveList[waveId].time = 0;
			this.waveList[waveId].on = true;
		}
	}
}

export default Canvas3D;
