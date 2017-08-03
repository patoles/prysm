export default {
    type:'x-shader/x-fragment',
    source:`
        #define MAX_WAVE_NBR 2
        precision mediump float;
        varying highp vec2 vTextureCoord;

        uniform sampler2D uSampler;
        uniform vec4 uColor;
        uniform bool uHasTexure;

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
            if(uHasTexure)
                fragmentColor = texture2D(uSampler, vTextureCoord);
            else
                fragmentColor = vec4(uColor.rgb, uColor.a);
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
    `,
    setParams(self, params){
		self.WAVE_LIST_SIZE = 2;
        self.WAVE_LIFESPAN = 1.5;
        self.lastTouchTime = -1;
		var parent = params.parent;
		var speed = (parent.dataset.waveSpeed && parseFloat(parent.dataset.waveSpeed)) || 0.02;
		var x = parent.dataset.waveX && parseFloat(parent.dataset.waveX);
		var y = parent.dataset.waveY && parseFloat(parent.dataset.waveY);
		var z = parent.dataset.waveZ && parseFloat(parent.dataset.waveZ);
		var shockParams = [x || 10.1, y || 0.8, z || 0.1];
		self.waveParams = {shockParams, speed};
        self.waveList = [];
		for (var x = 0;x < self.WAVE_LIST_SIZE;x++)
			self.waveList.push({time:0, center:[0, 0], on:false, shockParams:self.waveParams.shockParams, speed:self.waveParams.speed});
    },
    init(self){
        self.shaderProgram.wave = new Array(10);
		self.waveList.forEach((item, key) => {
			self.shaderProgram.wave[key] = {};
			self.shaderProgram.wave[key].center = self.ctx.getUniformLocation(self.shaderProgram, "wave[" + key + "].center");
			self.shaderProgram.wave[key].time = self.ctx.getUniformLocation(self.shaderProgram, "wave[" + key + "].time");
			self.shaderProgram.wave[key].shockParams = self.ctx.getUniformLocation(self.shaderProgram, "wave[" + key + "].shockParams");
			self.shaderProgram.wave[key].hasShock = self.ctx.getUniformLocation(self.shaderProgram, "wave[" + key + "].hasShock");
		})
    },
    transform(self){
		self.waveList.forEach((item) => {
			if (item.on)
			{
				item.time += item.speed;
				if (item.time > self.WAVE_LIFESPAN)
				{
					item.on = false;
					item.center = [0,0];
					item.time = 0;
				}
			}
		});
    },
    handleClick(event, self){
		var posX = event.clientX - event.target.getBoundingClientRect().left;
		var posY = event.clientY - event.target.getBoundingClientRect().top;
		this.setWavePos(self, posX, posY);
	},
	handleTouchMove(event, self){
		if (Date.now() - self.lastTouchTime > 100)
		{
			var posX = event.touches[0].clientX - event.target.getBoundingClientRect().left;
			var posY = event.touches[0].clientY - event.target.getBoundingClientRect().top;
			this.setWavePos(self, posX, posY);
			self.lastTouchTime = Date.now();
		}
    },
    setWavePos(self, x, y){
		var ratioPosX = x / self.realWidth;
		var ratioPosY =  1 - (y / self.realHeight);
		var waveId = -1;
		self.waveList.forEach((item, key) => {
			if (!item.on && waveId === -1)
				waveId = key;
		});
		if (waveId > -1)
		{
			self.waveList[waveId].center = [ratioPosX, ratioPosY];
			self.waveList[waveId].time = 0;
			self.waveList[waveId].on = true;
		}
	}
};