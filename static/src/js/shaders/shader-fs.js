export default {
    source:`
        #define MAX_WAVE_NBR 2
        precision mediump float;
        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;

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
    `, type:'x-shader/x-fragment'
};