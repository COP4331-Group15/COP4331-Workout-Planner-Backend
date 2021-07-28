const { putValueAtPath } = require('./firebase-endpoints');
const { getValueAtPath } = require('./firebase-endpoints');
const { deleteValueAtPath } = require('./firebase-endpoints');
const { postValueAtPath } = require('./firebase-endpoints');
const date = new Date();

//put
test('should put data at path', async ()=>{
    
    var message = {"day": date.toString()}
    var output = await Promise.resolve(putValueAtPath( null ,"/unittests/put", message ));
    
    expect(output).toBe(10);
});

//put fail
test('should fail to put data at path', async ()=>{
    
    var message = {"shouldnt exist": 2}
    var output = await Promise.resolve(putValueAtPath( "bad auth" ,"/unittests/put", message ));
    
    expect(output).toBe(20);
});

/*
//post
test('should post data at path', async ()=>{
    
    var message = {"day": date.toString()}
    var output = await Promise.resolve(postValueAtPath( null ,"/unittests/post", message ));

    console.log(output);
    
    expect(output).toBe(10);
});


//post fail
test('should fail to post data at path', async ()=>{
    
    var message = {"shouldnt happen": date.toString()}
    var output = await Promise.resolve(postValueAtPath( "bad auth" ,"/unittests/post", message ));
    
    expect(output).toBe(20);
});
*/

//get
test('should get data at path', async ()=>{
    
    var output = await Promise.resolve(getValueAtPath( null ,"/unittests/get/value"));

    expect(output).toBe("yay!");
});

//delete
test('should delete data at path', async ()=>{
    
    var output = await Promise.resolve(deleteValueAtPath( null ,"/unittests/delete/example"));

    expect(output).toBe(10);
});


