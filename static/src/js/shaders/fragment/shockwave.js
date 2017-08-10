export default class Shockwave{
	constructor(canvasInfo){
		this.canvasInfo = canvasInfo;
		this.type = 'fragment',
		this.source = `
			#define MAX_WAVE_NBR 10
			precision mediump float;
			
			varying highp vec2 vTextureCoord;
			uniform sampler2D uSampler;
			uniform vec2 screenRatio;
			
			struct waveStruct{
				vec2 center;
				float time;
				vec3 shockParams;
				bool hasShock;
			};
			uniform waveStruct wave[MAX_WAVE_NBR];

			void main(void){
				vec4 fragmentColor;
				fragmentColor = texture2D(uSampler, vTextureCoord);

				if (fragmentColor.a <= 0.1) discard;

				vec2 uv = vTextureCoord.xy;
				vec2 texCoord = uv;

				for (int count=0;count < MAX_WAVE_NBR;count++)
				{
					float distance = distance(uv*screenRatio, wave[count].center*screenRatio);
					if ((distance <= (wave[count].time + wave[count].shockParams.z)) && (distance >= (wave[count].time - wave[count].shockParams.z)))
					{
						float diff = (distance - wave[count].time); 
						float powDiff = 1.0 - pow(abs(diff*wave[count].shockParams.x), wave[count].shockParams.y); 
						float diffTime = diff  * powDiff;
						vec2 diffUV = normalize((uv * screenRatio) - (wave[count].center * screenRatio)); 
						texCoord = uv + (diffUV * diffTime);
					}
				}
				gl_FragColor = texture2D(uSampler, texCoord);
			}
		`;
	}
    setParams(params){
		var shaderParams = {};
		shaderParams.WAVE_LIST_SIZE = 10;
        shaderParams.WAVE_LIFESPAN = 1.5;
        shaderParams.lastTouchTime = -1;
		var speed = (params && params.speed) || 0.02;
		var shockParams = params ? [params.x || 10.1, params.y || 0.8, params.z || 0.1] : [10.1, 0.8, 0.1];
		shaderParams.waveParams = {shockParams, speed};
        shaderParams.waveList = [];
		for (var x = 0;x < shaderParams.WAVE_LIST_SIZE;x++)
			shaderParams.waveList.push({time:0, center:[0, 0], on:false, shockParams:shaderParams.waveParams.shockParams, speed:shaderParams.waveParams.speed});
		this.shaderParams = shaderParams;
	}
    init(ctx, shaderProgram){
		var shaderParams = this.shaderParams;
        shaderProgram.wave = new Array(10);
		shaderParams.waveList.forEach((item, key) => {
			shaderProgram.wave[key] = {};
			shaderProgram.wave[key].center = ctx.getUniformLocation(shaderProgram, "wave[" + key + "].center");
			shaderProgram.wave[key].time = ctx.getUniformLocation(shaderProgram, "wave[" + key + "].time");
			shaderProgram.wave[key].shockParams = ctx.getUniformLocation(shaderProgram, "wave[" + key + "].shockParams");
			shaderProgram.wave[key].hasShock = ctx.getUniformLocation(shaderProgram, "wave[" + key + "].hasShock");
		});
    }
	draw(ctx, shaderProgram){
		var shaderParams = this.shaderParams;
		shaderParams.waveList.forEach((item, key) => {
			ctx.uniform1i(shaderProgram.wave[key].hasShock, item.on);
			ctx.uniform2fv(shaderProgram.wave[key].center, item.center);
			ctx.uniform1f(shaderProgram.wave[key].time, item.time);
			ctx.uniform3fv(shaderProgram.wave[key].shockParams, item.shockParams);
		});
	}
	transform(){
		var shaderParams = this.shaderParams;
		shaderParams.waveList.forEach((item) => {
			if (item.on)
			{
				item.time += item.speed;
				if (item.time > shaderParams.WAVE_LIFESPAN)
				{
					item.on = false;
					item.center = [0,0];
					item.time = 0;
				}
			}
		});
	}
    handleClick(event){
		var shaderParams = this.shaderParams;
		var posX = event.clientX - event.target.getBoundingClientRect().left;
		var posY = event.clientY - event.target.getBoundingClientRect().top;
		this.setWavePos({x:posX, y:posY});
	}
	handleTouchMove(event){
		var shaderParams = this.shaderParams;
		if (Date.now() - shaderParams.lastTouchTime > 100)
		{
			var posX = event.touches[0].clientX - event.target.getBoundingClientRect().left;
			var posY = event.touches[0].clientY - event.target.getBoundingClientRect().top;
			this.setWavePos({x:posX, y:posY});
			shaderParams.lastTouchTime = Date.now();
		}
    }
    setWavePos(coord){
		var shaderParams = this.shaderParams;
		var canvasInfo = this.canvasInfo;
		var ratioPosX = coord.x / canvasInfo.width;
		var ratioPosY =  1 - (coord.y / canvasInfo.height);
		var waveId = -1;
		shaderParams.waveList.forEach((item, key) => {
			if (!item.on && waveId === -1)
				waveId = key;
		});
		if (waveId > -1)
		{
			shaderParams.waveList[waveId].center = [ratioPosX, ratioPosY];
			shaderParams.waveList[waveId].time = 0;
			shaderParams.waveList[waveId].on = true;
		}
	}
};