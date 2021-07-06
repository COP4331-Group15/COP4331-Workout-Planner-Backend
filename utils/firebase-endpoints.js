const axios = require('axios');

const FB_URL = "https://cop4331-group15-default-rtdb.firebaseio.com";

const getValueAtPath = async (authkey, path) => {
    var builtPath = `${FB_URL}${path}.json`;
    if(authkey != null) builtPath += `?auth=${authkey}`;

    // Send our request, wait for response
    try {
        const result = await axios.get(builtPath);
        return result.data;
    } catch (e) {
        console.log(e);
    }
}

const deleteValueAtPath = async (authkey, path) => {
    var builtPath = `${FB_URL}${path}.json`;
    if(authkey != null) builtPath += `?auth=${authkey}`;

    
    axios.delete(builtPath)
        .then(res =>{
            console.log(res);
            console.log(res.data);
        })
        .catch(e =>{
            console.log(e);
        });
}

//puts data at a specific path
//IF ANYTHING IS ALREADY AT THAT PATH, IT WILL OVER WRITE
const putValueAtPath = async (authkey, path, data) => {

    var builtPath = `${FB_URL}${path}.json`;
    if(authkey != null) builtPath += `?auth=${authkey}`;

    //post our data
    axios.put(builtPath, data )
        .then(res =>{
            console.log(res);
            console.log(res.data);
        })
        .catch(e =>{
            console.log(e);
        });
    
}

//adds data to a path non-destructively with a unique ID
/*
    Users/
    |
    |
    \/
    Users/<uuid>/<data>
*/
const postValueAtPath = async (authkey, path, data) => {

    var builtPath = `${FB_URL}${path}.json`;
    if(authkey != null) builtPath += `?auth=${authkey}`;

    //post our data
    axios.post(builtPath, data )
        .then(res =>{
            console.log(res);
            console.log(res.data);
        })
        .catch(e =>{
            console.log(e);
        });
    
}

exports.putValueAtPath = putValueAtPath;
exports.deleteValueAtPath = deleteValueAtPath;
exports.postValueAtPath = postValueAtPath;
exports.getValueAtPath = getValueAtPath;