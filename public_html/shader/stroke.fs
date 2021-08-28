precision mediump float;
uniform sampler2D u_SilColorSampler;
uniform int u_viewportWidth;
uniform int u_viewportHeight;

varying vec2 fs_Texcoord;
void main(void)
{
    vec4 color = texture2D(u_SilColorSampler,fs_Texcoord);

    int numofColoredPixel = 0;
    int hasPixel = 0;
    if(equal(color,vec4(1.0,1.0,1.0,1.0)) == true)
    {
        vec2 pixelIndex = vec2(fs_Texcoord.x * (float(u_viewportWidth) - 1.0),fs_Texcoord.y * (float(u_viewportHeight) - 1.0));	
        for(int i = -1; i<=1 ;++i)
        {
            for(int j = -1; j<=1; ++j)
            {
                if(i == 0 && j == 0)
                        continue;
                vec2 newpixelIdx = pixelIndex + vec2(i,j);
                vec4 newColor = texture2D(u_SilColorSampler,vec2(newpixelIdx.x / (float(u_viewportWidth)-1.0), newpixelIdx.y / (float(u_viewportHeight)-1.0)));

                if(equal(newColor,vec4(0.0,0.0,0.0,1.0)) == true)
                {
                        numofColoredPixel ++;
                }
            }
        }
        if(numofColoredPixel  >= 1)
        {
                color = vec4(0.0,0.0,0.0,1.0);
        }
    }

    gl_FragColor = color;
    return;
}