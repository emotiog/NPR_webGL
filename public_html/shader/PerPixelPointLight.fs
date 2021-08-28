precision mediump float;

varying vec3 v_Normal;
varying vec4 v_Position;
varying vec4 v_Color;
varying vec2 v_TexCoord;

uniform vec3 u_LightColor;
uniform vec3 u_LightPosition;
uniform vec3 u_AmbientLight;

uniform sampler2D u_Sampler;
uniform bool      uSilhouette;

// 0 : Light on/off
#define SH_MODE_LIGHT 1

void main() 
{    
    vec3 lDir       = normalize(u_LightPosition - v_Position.xyz);
    vec3 lookDir    = normalize(-v_Position.xyz);
    vec3 reflectDir = normalize(-reflect(lookDir, v_Normal));

    float nDotL     = max(dot(lDir, v_Normal), 0.0);
    vec3 diffuse    = u_LightColor * v_Color.rgb * nDotL;

    float refL      = pow( max(dot(reflectDir, lookDir), 0.0), 1000.0);
    vec3  specular  = refL * vec3(1.0, 1.0, 1.0)*u_LightColor;

    if (nDotL == 0.0) 
        specular = vec3 (0.0, 0.0, 0.0);

    vec3 ambient = u_AmbientLight * v_Color.rgb;

    vec4 texColor   = texture2D(u_Sampler, v_TexCoord);
    vec3 lightColor = diffuse + specular + ambient;
    lightColor      = lightColor * texColor.rgb;
    vec4 color      = vec4 (lightColor, v_Color.a);

    gl_FragColor    = color;
}