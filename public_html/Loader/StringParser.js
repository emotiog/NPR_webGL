/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var StringParser  = function(str)
{
    this.mStr       = null;
    this.mIndex     = 0;
    
    this._initialize(str);
};


StringParser.prototype._initialize  = function(string)
{
    this.mStr   = string;
    this.mIndex = 0;
};


// overload
StringParser.prototype.skipDelimiters   = function()
{
    var start   = this.mIndex;
    var end     = this.mStr.length;
    
    for(; start < end ; start++)
    {
        var char    = this.mStr.charAt(start);
        
        if(char === '\t' || char === ' ' || 
                char === '(' || char ===')' || char ==='"')
            continue;
            
        break;
    }
    
    this.mIndex = start;
};


StringParser.prototype.skipToNextWord   = function()
{
    this.skipDelimiters();
    
    var length  = getWordLength(this.mStr, this.mIndex);
    this.mIndex += (length +1);
};


StringParser.prototype.getUnitWord   = function()
{
    this.skipDelimiters();
    
    var length  = this.getWordLength(this.mStr, this.mIndex);
    
    if( length === 0)
        return null;
    
    var word    = this.mStr.substr(this.mIndex, length);
    this.mIndex += (length +1);
    
    return word;
};


StringParser.prototype.getInt       = function()
{
    return parseInt(this.getUnitWord());
};


StringParser.prototype.getFloat     = function()
{
    return parseFloat(this.getUnitWord());
};


StringParser.prototype.getWordLength  = function(string, start)
{
    var pointer = start;
    
    if(string !== null)
        var end     = string.length;
    
    for(;pointer < end ; pointer ++)
    {
        var char = string.charAt(pointer);
        
        if(char === '\t' || char === ' ' || 
                char === '(' || char ===')' || char ==='"')
            break;
    }
    
    return (pointer - start);
};