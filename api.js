const FBEndpoints = require('./utils/firebase-endpoints');

const axios = require('axios');

const FB_URL = "https://cop4331-group15-default-rtdb.firebaseio.com";

exports.setApp = function (app) {
    app.post('/api/exercise/:uuid/create', async (req, res, next) => {

      const { muscleGroup, focusTypes, name, sets, repititions, duration, resistance } = req.body;
      const newExercise = {MuscleGroup:muscleGroup,Name:name,Sets:sets,Repititions:repititions,Duration:duration,Resistance:resistance}

      var path = 'Exercises/' + req.params.uuid;
      var ret;
      var error = '';
      try {
        var builtPath = `${FB_URL}${path}.json`;
        const result = await axios.post(builtPath, newExercise);
        ret = {message: "Exercise created successfully", data: result};
      } catch (e) {
        error = e.toString();
        ret = {message: "Error creating exercise", error: error};
      }

      re.status(200).json(ret);
    })
    app.get('/api/test', async (req, res, next) => {

        // Check our authentication status
        const auth = req.currentUser;
        const token = req.authToken;
        var ret;
        if (auth) {
            console.log('authenticated!', auth);

            var result = await FBEndpoints.getValueAtPath(token, "/test");
            ret = {message: "Test successful!", data: result};
        } else {
            ret = {message: "Not Authenticated!"}
        }

        // (res)olve our query with a 200 (OK) status, returning a JSON object (ret)
        res.status(200).json(ret);
    })
}
