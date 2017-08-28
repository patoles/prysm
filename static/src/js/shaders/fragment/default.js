export default class Default{
	constructor(){
		this.type = 'fragment',
        this.source = `
            precision highp float;

			varying highp vec2 vTextureCoord;
            varying highp vec3 vLighting;
			uniform sampler2D uSampler;

			void main(void){
				vec4 fragmentColor;
				fragmentColor = texture2D(uSampler, vTextureCoord);

				if (fragmentColor.a <= 0.1) discard;

				gl_FragColor = vec4(fragmentColor.rgb * vLighting, fragmentColor.a);
			}
		`;
	}
};