attribute vec3 a_Position;
attribute vec4 a_Color; 
attribute vec3 a_Normal;
attribute vec2 a_TexCoord;

uniform mat4 u_World;
uniform mat4 u_View;
uniform mat4 u_Proj;
uniform mat4 u_TrNorm;

// varying: output variable to fragment shader
varying vec3 v_Normal;
varying vec4 v_Position;
varying vec4 v_Color;       
varying vec2 v_TexCoord;

void main()
{
    v_Position      = vec4(a_Position, 1.0);
    gl_Position     = v_Position;  

    v_Normal        = vec3(u_TrNorm * vec4(a_Normal, 1.0));
    v_TexCoord      = a_TexCoord;
    v_Color         = a_Color;
}
