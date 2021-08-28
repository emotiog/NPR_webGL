precision mediump float;

varying vec3 v_Normal;
varying vec4 v_Position;
varying vec4 v_Color;
varying vec2 v_TexCoord;

uniform vec3 u_LightColor;
uniform vec3 u_LightPosition;
uniform vec3 u_AmbientLight;

uniform sampler2D hatch1;
uniform sampler2D hatch2;
uniform sampler2D hatch3;


//float shininess = 1.0;

void main() 
{ 
    vec4 inkColor   = vec4(0.8, 0.7, 0.7, 1.0);
    vec3 lDir       = normalize(u_LightPosition - v_Position.xyz);
    vec3 lookDir    = normalize(-v_Position.xyz);
    vec3 reflectDir = normalize(-reflect(lookDir, v_Normal));
    //vec3 halfVec  = normalize(lDir + lookDir);

    float nDotL = max(dot(lDir, v_Normal), 0.0);    
    float refL = pow( max(dot(reflectDir, lookDir), 0.0), 1000.0);
   
    //vec3 amdif = u_AmbientLight + (u_LightColor * nDotL);
    //vec3 spec = u_LightColor * pow( max( dot(halfVec, v_Normal), 0.0), shininess );

    vec3 ambient    = u_AmbientLight * v_Color.rgb;
    vec3 diffuse    = u_LightColor * v_Color.rgb * nDotL;
    vec3 specular   = refL * v_Normal *u_LightColor;

    //vec4 phong_color = vec4(amdif, 1.0) + vec4(spec, 1.0);
    vec4 phongColor = vec4 (diffuse + specular + ambient, v_Color.a) ; 

    //hatching 3levels
    float shading = (phongColor.x + phongColor.y + phongColor.z) / 3. + 0.1;
    
    vec4 result = v_Color;
    float step = 1. / 6.;
       
    if( shading <= 2. * step )
    {
        result = mix( texture2D( hatch2, v_TexCoord ), texture2D( hatch3, v_TexCoord) , 6. * ( shading - step ) );
    }

    if( shading > 2. * step && shading <= 4. * step )
    {
        result = mix( texture2D( hatch3, v_TexCoord ), texture2D( hatch1, v_TexCoord ), 6. * ( shading - 3. * step ) );
    }

    if( shading > 4. * step )
    {
        result = mix( texture2D( hatch1, v_TexCoord ), vec4( 1. ), 6. * ( shading - 5. * step ) );
    }

    vec4 src = mix( mix( inkColor, vec4( 1. ), result.r ), result, 0.5 );
        
    gl_FragColor = src;
}