const axios = require('axios');

const FB_URL = "https://cop4331-group15-default-rtdb.firebaseio.com";

exports.getValueAtPath = async (authkey, path) => {
    var builtPath = `${FB_URL}${path}.json`;
    if(authkey != null) builtPath += `?auth=${authkey}`;

    // Send our request, wait for response
    try {
        const result = await axios.get(builtPath);
        console.log(result.data);
        return result.data;
    } catch (e) {
        console.log(e);
    }
}

exports.deleteValueAtPath = async (authkey, path) => {
    ret = 10;
    var builtPath = `${FB_URL}${path}.json`;
    if(authkey != null) builtPath += `?auth=${authkey}`;


    await axios.delete(builtPath)
        .then(res =>{
            //console.log(res);
            //console.log(res.data);
            
        })
        .catch(e =>{
            console.log(e);
            ret = 20;
        });
    return ret;
}

//puts data at a specific path
//IF ANYTHING IS ALREADY AT THAT PATH, IT WILL OVER WRITE
exports.putValueAtPath = async (authkey, path, data) => {

    var ret = 10;
    var builtPath = `${FB_URL}${path}.json`;
    if(authkey != null) builtPath += `?auth=${authkey}`;
    
    //put our data
    await axios.put(builtPath, data )
        .then(res =>{
            //console.log(res);
            //console.log(res.data);
        })
        .catch(e =>{
            console.log(e);
            ret = 20;
        });
    
    return ret;
}

//adds data to a path non-destructively with a unique ID
/*
    Users/
    |
    |
    \/
    Users/<uuid>/<data>
*/
exports.postValueAtPath = async (authkey, path, data) => {

    ret = 10;
    var builtPath = `${FB_URL}${path}.json`;
    if(authkey != null) builtPath += `?auth=${authkey}`;

    //post our data
    await axios.post(builtPath, data )
        .then(res =>{
            //console.log(res);
            //console.log(res.data);
            
        })
        .catch(e =>{
            console.log(e);
            ret = 20;
        });
    return ret;
}


//exports.deleteValueAtPath = deleteValueAtPath;
//exports.postValueAtPath = postValueAtPath;
//exports.getValueAtPath = getValueAtPath;
