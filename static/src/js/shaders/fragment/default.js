export default class Default{
	constructor(){
		this.type = 'fragment',
		this.source = `
			void main(void){
				gl_FragColor = vec4(0.0, 0.0, 0.8, 1.0);
			}
		`;
	}
};