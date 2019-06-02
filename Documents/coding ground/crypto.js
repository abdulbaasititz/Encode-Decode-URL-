
#Encoding/Decoding transfer data from URL

var count=0;
function toAscii(bin) {
    return bin.replace(/\s*[01]{8}\s*/g, function(bin) {
      return String.fromCharCode(parseInt(bin, 2))
    })
}

function processPacket(oldValue,checkMandtry){
    var key,toggle,i=7;
    var value=oldValue.charCodeAt(0).toString(2);
    while(value.length!==8){
        value='0'+value;
    }
    value=value.split('');
    for(var j=0; j<4; j++){
        toggle=key=value[i];
        while(i>=0){       
            if(value[i]==key){
                if(toggle==='1'){
                    toggle='0';           
                }else{
                    toggle='1';          
                }
            }
            value[i]=toggle;
            i--;
        }i=7;
    }
    if (checkMandtry===true) {
        var checkRange=parseInt(parseInt(value.join(''),2).toString(10));   
        if(checkRange <= 33 || (checkRange<=127 && checkRange >=160) || checkRange == 173 || checkRange == 37){
            return 'gg'+oldValue;
        }
    }       
    return toAscii(value.join(''));
}

function toBinary(input,encryptDo) {
    var value='';   
    if (encryptDo) {
        for (var i = 0; i < input.length; i++) {
            var checkRange=parseInt(input[i].charCodeAt(0));
            count=count+checkRange;       
            value += processPacket(input[i],true);
       }
       return value.toString();
    }
//for decryption  
    for(var i=0; i<input.length; i++){
        if(input[i]=='g' &&  input[i+1]=='g' &&  input[i+2]!=undefined){
            value += input[i+2];
            i+=2;
        }else{
            value += processPacket(input.charAt(i),false);
        }
    }  
    return value.toString();
}
