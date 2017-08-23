export default class Water{
    constructor(){
        this.type = 'fragment';
        this.source = `
            #define TAU 6.28318530718
            #define MAX_ITER 5

            precision mediump float;

			varying highp vec2 vTextureCoord;
            varying highp vec3 vLighting;
			uniform sampler2D uSampler;

            uniform float f_time;

            vec3 iResolution = vec3(1, 1, 0);

            void main(void) 
            {
                vec4 fragmentColor;
				fragmentColor = texture2D(uSampler, vTextureCoord);
                float time = f_time;
                vec2 uv = vTextureCoord.xy / iResolution.xy;
                
                vec2 p = mod(uv*TAU, TAU)-250.0;

                vec2 i = vec2(p);
                float c = 1.0;
                float inten = .005;

                for (int n = 0; n < MAX_ITER; n++) 
                {
                    float t = time * (1.0 - (3.5 / float(n+1)));
                    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
                    c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
                }
                c /= float(MAX_ITER);
                c = 1.17-pow(c, 1.4);
                vec3 colour = vec3(pow(abs(c), 8.0));
                colour = clamp(colour + vec3(0.0, 0.35, 0.5), 0.0, 1.0);
                
                gl_FragColor = vec4(fragmentColor.rgb * vLighting * colour, fragmentColor.a);
            }
        `;
    }
	setParams(params){
        params = params || {};
		var shaderParams = {};
        shaderParams.time = 0.0;
        shaderParams.DELTA_TIME = 0;
        shaderParams.LAST_TIME = Date.now();
		this.shaderParams = shaderParams;
	}
    init(ctx, shaderProgram){
        shaderProgram.f_time = ctx.getUniformLocation(shaderProgram, "f_time");
    }
    draw(ctx, shaderProgram){
        var shaderParams = this.shaderParams;
        ctx.uniform1f(shaderProgram.f_time, shaderParams.time);
    }
	transform(){
        var shaderParams = this.shaderParams;
        shaderParams.DELTA_TIME = Date.now() - shaderParams.LAST_TIME;
        shaderParams.LAST_TIME = Date.now();
        shaderParams.time += shaderParams.DELTA_TIME / 2000;
    }
};
