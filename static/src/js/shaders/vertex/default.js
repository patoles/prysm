export default class Default{
    constructor(){
        this.type = 'vertex';
        this.source = `
            precision highp float;
            attribute highp vec3 aVertexNormal;
            attribute highp vec3 aVertexPosition;
            attribute highp vec2 aTextureCoord;

            uniform highp mat4 uNormalMatrix;
            uniform highp mat4 uMVMatrix;
			uniform highp mat4 uPMatrix;

            varying highp vec2 vTextureCoord;
            varying highp vec3 vLighting;

            const vec2 madd=vec2(0.5, 0.5);


            void main(void){
                gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.xy, 0.0, 1.0);
                vTextureCoord = aVertexPosition.xy*madd+madd;

                highp vec3 ambientLight = vec3(1.0, 1.0, 1.0);
                highp vec3 directionalLightColor = vec3(1.0, 0.0, 0.0);
                highp vec3 directionalVector = vec3(0.85, 0.8, -0.40);

                highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

                highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
                vLighting = ambientLight + (directionalLightColor * directional);
            }
        `;
        /*
                gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.xy, 0.0, 1.0);
                vTextureCoord = aVertexPosition.xy*madd+madd;
        */
    }
};