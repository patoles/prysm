import CanvasWebgl from './canvas-webgl';
import OBJ from 'webgl-obj-loader';

const perspectiveValue = 80;
const WAVE_LIST_SIZE = 2;
const WAVE_LIFESPAN = 1.5;

const meshesConf = {
	"meshes":[
		{
			"name":"cube",
			"obj":"/static/assets/models/plan.obj",
			"objName":"plan",
			"texture":"",
			"translation":[0.0, 0.0, 0.0],
			"color":[0.6, 0.6, 0.4, 1.0]
		}
	]
}

var objList = {
	plan:"/static/assets/models/plan.obj"
};
var objPool = null;

class Canvas3D extends CanvasWebgl{
	constructor(params){
		super(params);
		this.yRotation = 0;
		this.xRotation = 0;
		this.lastTouchTime = -1;
		this.meshes;
		this.hd = params.hd;
		this.getConf(() => {
			this.totalTextures = 0;
			this.loadedTextures = 0;
			this.meshList.forEach((item, key) => {
				if (item.texture !== "")
					this.totalTextures++;
			});
			var downloadObject = {};
			var bufferList = [];
			this.meshList.forEach((item, key) => {
				downloadObject[item.name] = item.obj;
				if (item.clickable)
					bufferList.push(item);
			});
			this.initShaders();
			if (!objPool)
				OBJ.downloadMeshes(objList, this.objStart.bind(this));
			else
				this.objStart(objPool);
		}, params.texture);
	}
	getConf(cb, texture){
		this.meshList = JSON.parse(JSON.stringify(meshesConf.meshes));
		this.meshList[0].texture = texture;
		cb();
	}
	objStart(meshes){
		objPool = meshes;
		this.meshes = {};
		this.meshList.forEach((item, key) => {
			this.meshes[item.name] = [];
			for (var mesh in objPool[item.objName])
				this.meshes[item.name][mesh] = objPool[item.objName][mesh];
		});
		this.meshList.forEach((item, key) => {
			OBJ.initMeshBuffers(this.ctx, this.meshes[item.name]);
			if (this.meshes[item.name].textures.length && item.texture !== '')
				this.initTexture(this.meshes[item.name], item.texture);
		});
		if (this.totalTextures === 0)
		{
			this.render();
			this.canvas.className = 'canvas';
		}
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
		this.perspectiveMatrix = this.glUtils.makePerspective(perspectiveValue, this.screenWidth/this.screenHeight, 0.1, 100.0);
		this.glUtils.loadIdentity();
		this.meshList.forEach((item, key) => {
			this.glUtils.mvPushMatrix();
			this.glUtils.mvRotateMultiple(this.xRotation, [1,0,0], this.yRotation, [0,1,0]);
			this.glUtils.mvTranslate(item.translation);
			if (item.scale)
				this.glUtils.mvScale([item.scale[0],item.scale[1],item.scale[2]]);
			if (item.objName === 'sphere' || item.objName === 'cube')
				this.glUtils.mvRotateMultiple(this.ballRotation, [1,0,0], this.ballRotation, [0,1,0]);
			this.drawObject(this.meshes[item.name], item.color || [0.5, 1.0, 1.0, 1.0]);
			this.glUtils.mvPopMatrix();
		});
		this.transform();
	}
	transform(){
		this.waveList.forEach((item) => {
			if (item.on)
			{
				item.time += item.speed;
				if (item.time > WAVE_LIFESPAN)
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
		for (var x = 0;x < WAVE_LIST_SIZE;x++)
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
		var ratioPosX = x / this.oldWidth;
		var ratioPosY =  1 - (y / this.oldHeight);
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
