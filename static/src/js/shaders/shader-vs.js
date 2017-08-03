export default {
    source:`
        precision mediump float;
        attribute highp vec3 aVertexNormal;
        attribute highp vec3 aVertexPosition;

        uniform highp mat4 uNormalMatrix;
        uniform highp mat4 uMVMatrix;
        uniform highp mat4 uPMatrix;

        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;

        const vec2 madd=vec2(0.5, 0.5);
        attribute vec2 vertexIn;


        void main(void){
            gl_Position = vec4(aVertexPosition.xy, 0.0, 1.0);
            vTextureCoord = aVertexPosition.xy*madd+madd;

            highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);
            highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);
            highp vec3 directionalVector = vec3(0.85, 0.8, -0.40);

            highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

            highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
            vLighting = ambientLight + (directionalLightColor * directional);
        }
    `, type:'x-shader/x-vertex'
};