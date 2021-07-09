const FBEndpoints = require('./utils/firebase-endpoints');

exports.setApp = function (app) {

  // ==================
  // Calendar endpoints.
  // ==================

  // Adds a one-off workout to the given day
  app.post('/api/calender/:uuid/:year/:month/:day', async (req, res, next) => {

    // Stores the inputted workout in JSON format.
    const {muscleGroup, focusTypes, name, sets, repititions, duration, resistance, exercises} = req.body;
    const newCalenderWorkout = {MuscleGroup: muscleGroup, FocusTypes: focusTypes, Name: name, Sets: sets, Repititions: repititions, Duration: duration, Resistance: resistance, Exercises: exercises};
    const token = req.authToken;

    // Gets the path of the current user's workout for that day.
    var path = '/calender/' + req.params.uuid + '/' + req.params.year + '/' + req.params.month + '/' + req.params.day;
    var ret;
    var error = '';
    try {
      // Attempts to post the JSON workout to the database.
      var result = await FBEndpoints.postValueAtPath(token, path, newCalenderWorkout);
      ret = {message: "Workout created successfully"};
      res.status(200).json(ret);
    } catch (e) {
      // Prints any error that occurs.
      error = e.toString();
      ret = {message: "Error creating workout", error: error};
      res.status(400).json(ret);
    }
  })

  // Gets a calendar for the current user on the given month and year.
  app.get('/api/calender/:uuid/:year/:month', async (req, res, next) => {

    const token = req.authToken;

    // Gets the path of the user's workouts for that month.
    var path = '/calender/' + req.params.uuid + '/' + req.params.year + '/' + req.params.month;
    var ret;
    var error = '';
    try {
      // Attempts to get a calender of all workouts that month.
      var result = await FBEndpoints.getValueAtPath(token, path);
      res.status(200).json(result);
    } catch (e) {
      // Prints any error that occurs.
      error = e.toString();
      ret = {message: "Workouts not found", error: error};
      res.status(404).json(ret);
    }
  })

  // Gets the workout for a given day in a given month in a given year.
  app.get('/api/calender/:uuid/:year/:month/:day', async (req, res, next) => {

    const token = req.authToken;

    // Gets the path of a specific workout on that day.
    var path = '/calender/' + req.params.uuid + '/' + req.params.year + '/' + req.params.month + '/' + req.params.day;
    var ret;
    var error = '';
    try {
      // Attempts to get the specific JSON workout selected.
      var result = await FBEndpoints.getValueAtPath(token, path);
      res.status(200).json(result);
    } catch (e) {
      // Prints an error if the workout is not found.
      error = e.toString();
      ret = {message: "Workouts not found", error: error};
      res.status(404).json(ret);
    }
  })

  // Updates a single date-specific workout.
  app.patch('/api/calender/:uuid/:year/:month/:day', async (req, res, next) => {

    // Stores the inputted updated workout in JSON format.
    const {muscleGroup, focusTypes, name, sets, repititions, duration, resistance, exercises} = req.body;
    const updatedExercise = {MuscleGroup: muscleGroup, FocusTypes: focusTypes, Name: name, Sets: sets, Repititions: repititions, Duration: duration, Resistance: resistance, Exercises: exercises}
    const token = req.authToken;

    // Gets the path of the the workout on that day.
    var path = '/calender/' + req.params.uuid + '/' + req.params.year + '/' + req.params.month + '/' + req.params.day;
    var ret;
    var error = '';
    try {
      // Attempts to put the updated workout in the place of the selected workout.
      var result = await FBEndpoints.putValueAtPath(token, path, updatedExercise);
      ret = {message: "Workout updated successfully"};
      res.status(200).json(ret);
    } catch (e) {
      // Prints any error that occurs.
      error = e.toString();
      ret = {message: "Error updating workout", error: error};
      res.status(400).json(ret);
    }
  })

  // Deletes a single-day workout.
  app.delete('/api/calender/:uuid/:year/:month/:day', async (req, res, next) => {

    const token = req.authToken;

    // Gets the path of the workout on the given day.
    var path = '/calender/' + req.params.uuid + '/' + req.params.year + '/' + req.params.month + '/' + req.params.day;
    var ret;
    var error = '';

    try {
      // Attempts to delete the selected workout.
      var result = await FBEndpoints.deleteValueAtPath(token, path);
      ret = {message: "Workout deleted successfully"};
      res.status(200).json(ret);
    } catch (e) {
      // Prints any error that occurs.
      error = e.toString();
      ret = {message: "No date-specific workout exists on that day", error: error};
      res.status(404).json(ret);
    }
  })
    // ==================
    // Exercise endpoints.
    // ==================

    // Creates an exercise.
    app.post('/api/exercise/:uuid/create', async (req, res, next) => {

      // Stores the inputted exercise in JSON format.
      const {muscleGroup, focusTypes, name, sets, repititions, duration, resistance} = req.body;
      const newExercise = {MuscleGroup: muscleGroup, FocusTypes: focusTypes, Name: name, Sets: sets, Repititions: repititions, Duration: duration, Resistance: resistance};
      const token = req.authToken;

      // Gets the path of the current user's exercises.
      var path = '/exercise/' + req.params.uuid;
      var ret;
      var error = '';
      try {
        // Attempts to post the JSON exercise to the database.
        var result = await FBEndpoints.postValueAtPath(token, path, newExercise);
        ret = {message: "Exercise created successfully", data: result};
        res.status(200).json(ret);
      } catch (e) {
        // Prints any error that occurs.
        error = e.toString();
        ret = {message: "Error creating exercise", error: error};
        res.status(400).json(ret);
      }
    })

    // Gets all exercises for a given user.
    app.get('/api/exercise/:uuid', async (req, res, next) => {

      const token = req.authToken;

      // Gets the path of the current user's exercises.
      var path = '/exercise/' + req.params.uuid;
      var ret;
      try {
        // Attempts to get all the JSON exercises at the current path.
        var result = await FBEndpoints.getValueAtPath(token, path);
        res.status(200).json(result);
      } catch (e) {
        // Prints any error that occurs.
        ret = {message: "No user exists with that given ID"};
        res.status(404).json(ret);
      }
    })

    // Gets a specific exercise.
    app.get('/api/exercise/:uuid/:exerciseId', async (req, res, next) => {

      const token = req.authToken;

      // Gets the path of a specific exercise from among the user's exercises.
      var path = '/exercise/' + req.params.uuid + '/' + req.params.exerciseId;
      var ret;
      var error = '';
      try {
        // Attempts to get the specific JSON exercise selected.
        var result = await FBEndpoints.getValueAtPath(token, path);
        res.status(200).json(result);
      } catch (e) {
        // Prints an error if the exercise is not found.
        error = e.toString();
        ret = {message: "Exercise not found", error: error};
        res.status(404).json(ret);
      }
    })

    // Updates an existing exercise.
    app.patch('/api/exercise/:uuid/:exerciseId/update', async (req, res, next) => {

      // Stores the inputted updated exercise in JSON format.
      const {muscleGroup, focusTypes, name, sets, repititions, duration, resistance} = req.body;
      const updatedExercise = {MuscleGroup: muscleGroup, FocusTypes: focusTypes, Name: name, Sets: sets, Repititions: repititions, Duration: duration, Resistance: resistance}
      const token = req.authToken;

      // Gets the path of a specific exercise from among the user's exercises.
      var path = '/exercise/' + req.params.uuid + '/' + req.params.exerciseId;
      var ret;
      var error = '';
      try {
        // Attempts to put the updated exercise in the place of the selected exercise.
        var result = await FBEndpoints.putValueAtPath(token, path, updatedExercise);
        ret = {message: "Exercise updated successfully"};
        res.status(200).json(ret);
      } catch (e) {
        // Prints any error that occurs.
        error = e.toString();
        ret = {message: "Error updating exercise", error: error};
        res.status(400).json(ret);
      }
    })

    // Deletes an existing exercise.
    app.delete('/api/exercise/:uuid/:exerciseId/delete', async (req, res, next) => {

      const token = req.authToken;

      // Gets the path of a specific exercise from among the user's exercises.
      var path = '/exercise/' + req.params.uuid + '/' + req.params.exerciseId;
      var ret;
      var error = '';

      try {
        // Attempts to delete the selected exercise.
        var result = await FBEndpoints.deleteValueAtPath(token, path);
        ret = {message: "Exercise deleted successfully"};
        res.status(200).json(ret);
      } catch (e) {
        // Prints any error that occurs.
        error = e.toString();
        ret = {message: "Error deleting exercise", error: error};
        res.status(400).json(ret);
      }
    })

    // ==================
    // Workout endpoints
    // ==================

    // Creates a workout.
    app.post('/api/workout/:uuid/create', async (req, res, next) => {

      // Stores the inputted workout in JSON format.
      const {muscleGroup, focusTypes, name, sets, repititions, duration, resistance, exercises} = req.body;
      const newWorkout = {MuscleGroup: muscleGroup, FocusTypes: focusTypes, Name: name, Sets: sets, Repititions: repititions, Duration: duration, Resistance: resistance, Exercises: exercises};
      const token = req.authToken;

      // Gets the path of the current user's workouts.
      var path = '/workout/' + req.params.uuid;
      var ret;
      var error = '';
      try {
        // Attempts to post the JSON workout to the database.
        var result = await FBEndpoints.postValueAtPath(token, path, newWorkout);
        ret = {message: "Workout created successfully", data: result};
        res.status(200).json(ret);
      } catch (e) {
        // Prints any error that occurs.
        error = e.toString();
        ret = {message: "Error creating workout", error: error};
        res.status(400).json(ret);
      }
    })

    // Gets all workouts for a given user.
    app.get('/api/workout/:uuid', async (req, res, next) => {

      const token = req.authToken;

      // Gets the path of the current user's workouts.
      var path = '/workout/' + req.params.uuid;
      var ret;
      try {
        // Attempts to get all the JSON exercises at the current path.
        var result = await FBEndpoints.getValueAtPath(token, path);
        res.status(200).json(result);
      } catch (e) {
        // Prints any error that occurs.
        ret = {message: "No user exists with that given ID"};
        res.status(404).json(ret);
      }
    })

    // Gets a specific workout.
    app.get('/api/workout/:uuid/:workoutId', async (req, res, next) => {

      const token = req.authToken;

      // Gets the path of a specific workout from among the user's workouts.
      var path = '/workout/' + req.params.uuid + '/' + req.params.workoutId;
      var ret;
      var error = '';
      try {
        // Attempts to get the specific JSON workout selected.
        var result = await FBEndpoints.getValueAtPath(token, path);
        res.status(200).json(result);
      } catch (e) {
        // Prints an error if the workout is not found.
        error = e.toString();
        ret = {message: "Workout not found", error: error};
        res.status(404).json(ret);
      }
    })

    // Updates an existing workout.
    app.patch('/api/workout/:uuid/:workoutId/update', async (req, res, next) => {

      // Stores the inputted updated workout in JSON format.
      const {muscleGroup, focusTypes, name, sets, repititions, duration, resistance, exercises} = req.body;
      const updatedWorkout = {MuscleGroup: muscleGroup, FocusTypes: focusTypes, Name: name, Sets: sets, Repititions: repititions, Duration: duration, Resistance: resistance, Exercises: exercises}
      const token = req.authToken;

      // Gets the path of a specific workout from among the user's workouts.
      var path = '/workout/' + req.params.uuid + '/' + req.params.workoutId;
      var ret;
      var error = '';
      try {
        // Attempts to put the updated workout in the place of the selected workout.
        var result = await FBEndpoints.putValueAtPath(token, path, updatedWorkout);
        ret = {message: "Workout updated successfully"};
        res.status(200).json(ret);
      } catch (e) {
        // Prints any error that occurs.
        error = e.toString();
        ret = {message: "Error updateing workout", error: error};
        res.status(400).json(ret);
      }
    })

    // Deletes an existing workout.
    app.delete('/api/workout/:uuid/:workoutId/delete', async (req, res, next) => {

      const token = req.authToken;

      // Gets the path of a specific exercise from among the user's exercises.
      var path = '/workout/' + req.params.uuid + '/' + req.params.workoutId;
      var ret;
      var error = '';

      try {
        // Attempts to delete the selected workout.
        var result = await FBEndpoints.deleteValueAtPath(token, path);
        ret = {message: "Workout deleted successfully"};
        res.status(200).json(ret);
      } catch (e) {
        // Prints any error that occurs.
        error = e.toString();
        ret = {message: "Error deleting workout", error: error};
        res.status(400).json(ret);
      }
    })

    // ==================
    // Split endpoints
    // ==================

    // Creates a split.
    app.post('/api/split/:uuid/create', async (req, res, next) => {

      // Stores the inputted split in JSON format.
      const {focus, startDate, length, workouts} = req.body;
      const newSplit = {Focus: focus, StartDate: startDate, Length: length, Workouts: workouts};
      const token = req.authToken;

      // Gets the path where the user's split will be stored.
      var path = '/split/' + req.params.uuid;
      var ret;
      var error = '';
      try {
        // Attempts to post the JSON split to the database.
        var result = await FBEndpoints.putValueAtPath(token, path, newSplit);
        ret = {message: "Split created successfully", data: result};
        res.status(200).json(ret);
      } catch (e) {
        // Prints any error that occurs.
        error = e.toString();
        ret = {message: "Error creating split", error: error};
        res.status(400).json(ret);
      }
    })

    // Gets the split for a given user.
    app.get('/api/split/:uuid', async (req, res, next) => {

      const token = req.authToken;

      // Gets the path of the current user's split.
      var path = '/split/' + req.params.uuid;
      var ret;
      try {
        // Attempts to get the user's JSON split from the current path.
        var result = await FBEndpoints.getValueAtPath(token, path);
        res.status(200).json(result);
      } catch (e) {
        // Prints any error that occurs.
        ret = {message: "No user exists with that given ID"};
        res.status(404).json(ret);
      }
    })

    // Updates an existing split.
    app.patch('/api/split/:uuid/update', async (req, res, next) => {

      // Stores the inputted updated workout in JSON format.
      const {focus, startDate, length, workouts} = req.body;
      const updatedSplit = {Focus: focus, StartDate: startDate, Length: length, Workouts: workouts};
      const token = req.authToken;

      // Gets the path of the current user's split.
      var path = '/split/' + req.params.uuid;
      var ret;
      var error = '';
      try {
        // Attempts to put the updated split in the place of the user's current split.
        var result = await FBEndpoints.putValueAtPath(token, path, updatedSplit);
        ret = {message: "Split updated successfully"};
        res.status(200).json(ret);
      } catch (e) {
        // Prints any error that occurs.
        error = e.toString();
        ret = {message: "Error updateing split", error: error};
        res.status(400).json(ret);
      }
    })

    // ==================
    // Test endpoints
    // ==================

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
