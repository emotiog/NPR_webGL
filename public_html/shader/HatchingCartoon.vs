attribute vec4 a_Position;   // attribute variable 
attribute vec4 a_Color; 
attribute vec3 a_Normal;
attribute vec2 a_TexCoord;

uniform mat4 u_World;
uniform mat4 u_View;
uniform mat4 u_Proj;
uniform mat4 u_TrNorm;

varying vec3 v_Normal;
varying vec4 v_Position;
varying vec4 v_Color;       // output variable to fragment shader
varying vec2 v_TexCoord;


void main() {
    v_Position = u_View*u_World*a_Position;
    gl_Position = u_Proj*v_Position;  
    
    v_Normal = vec3(u_TrNorm*vec4(a_Normal, 0.0));
    
    v_Color = a_Color;
    
    v_TexCoord = a_TexCoord;
} 