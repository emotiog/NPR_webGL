precision mediump float;

varying vec3 v_Normal;
varying vec4 v_Position;
varying vec4 v_Color;
varying vec2 v_TexCoord;

uniform vec3 u_LightColor;
uniform vec3 u_LightPosition;
uniform vec3 u_AmbientLight;

uniform sampler2D u_Sampler;

float setThreshold(in float value);

void main() 
{
    vec3 lDir       = normalize(u_LightPosition - v_Position.xyz);
    vec3 lookDir    = normalize(-v_Position.xyz);
    vec3 reflectDir = normalize(-reflect(lookDir, v_Normal));

    float nDotL = max(dot(lDir, v_Normal), 0.0);
    vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;

    float refL = pow( max(dot(reflectDir, lookDir), 0.0), 1000.0);
    vec3  specular = refL * vec3(1.0, 1.0, 1.0) *u_LightColor;

    if (nDotL == 0.0) 
        specular = vec3 (0.0, 0.0, 0.0);

    vec3 ambient = u_AmbientLight * v_Color.rgb;

    vec4 lightColor = vec4 (diffuse + specular + ambient, v_Color.a) ; 
    float thresX    = setThreshold(lightColor.x *3.);
    float thresY    = setThreshold(lightColor.y *3.);
    float thresZ    = setThreshold(lightColor.z *3.);

    gl_FragColor    = vec4(thresX, thresY, thresZ, v_Color.a);
}


float setThreshold(in float value)
{
    if(value > 0. && value < 0.25)
        return 0.2;

    else if(value > 0.25 && value < 0.5)
        return 0.4;

    else if(value > 0.5 && value < 0.75)
        return 0.7;

    else
        return .85;
}