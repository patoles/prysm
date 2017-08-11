export default class Default{
	constructor(){
		this.type = 'fragment',
        this.source = `
            precision mediump float;

            varying highp vec3 vLighting;

			void main(void){
				gl_FragColor = vec4(vec3(0.0, 0.0, 0.3) * vLighting, 1.0);
			}
		`;
	}
};