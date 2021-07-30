const FBEndpoints = require('./utils/firebase-endpoints');

exports.setApp = function (app) {

  // ==================
  // Calendar endpoints.
  // ==================

  // Adds a one-off workout to the given day
  app.post('/api/calendar/:uuid/:year/:month/:day/create', async (req, res, next) => {

    // Stores the inputted workout in JSON format.
    const {startTime, exercises, unworkable} = req.body;
    const newCalenderWorkout = {StartTime: startTime, Exercises: exercises, Unworkable: unworkable};
    const token = req.authToken;

    // Gets the path of the current user's workout for that day.
    var path = '/calendar/' + req.params.uuid + '/' + req.params.year + '/' + req.params.month + '/' + req.params.day;
    var ret;
    var error = '';
    try {
      // Attempts to post the JSON workout to the database.
      var result = await FBEndpoints.putValueAtPath(token, path, newCalenderWorkout);
      ret = {message: "Workout created successfully", data: result};
      res.status(200).json(ret);
    } catch (e) {
      // Prints any error that occurs.
      error = e.toString();
      ret = {message: "Error creating workout", error: error};
      res.status(400).json(ret);
    }
  })

  // Gets a calendar for the current user on the given month and year.
  app.get('/api/calendar/:uuid/:year/:month', async (req, res, next) => {

    const token = req.authToken
    //create Data object at the start of the month
    const d = new Date();
    d.setFullYear(req.params.year,req.params.month,1);

    var splitStart =new Date();
    var path;    
    var ret;
    var workoutArray = [];
    var splitarray =[];
    var temp;
    var splitworkout;
    var splitIndex = 0;
    var error = '';
    try{
      //try to get split info and convert from JSON to object
      path = '/split/'+ req.params.uuid ;
      var splitJSON = await FBEndpoints.getValueAtPath(token, path);
      var split = JSON.parse(JSON.stringify(splitJSON));
    }
    catch(e){
      error = e.toString();
      ret = {message: "Could not retrieve split data", error: error};
      res.status(404).json(ret);
    }
    
    //this chunk of code checks to see if today is at a later date than the start of the month
    //if it does, it moves the start to that date
    //this will indirectly skip any workouts in the past, and result in an empty return array for previous months
    //might not need anymore lol
    /*
    const currentDay = new Date();
    
    if(d.getMonth()<currentDay.getMonth()){
      d.setMonth(currentDay.getMonth(),1);

      if(d.getFullYear()<currentDay.getFullYear()){
        d.setFullYear(currentDay.getFullYear());
      }
    }
    */
    
    //if statement handles if there is no split for user
    if(split!=null){
      //get all split workouts here and store them as an array
      while(splitIndex < split.Length){
        try{
          //try to get the next workout in split and store in array
          path = '/workout/'+ req.params.uuid + '/' + split.Workouts[splitIndex%split.Length];
          splitworkout = await FBEndpoints.getValueAtPath(token, path);
          splitarray.push(splitworkout);
        }
        catch(e){
          error = e.toString();
          ret = {message: "Could not retrieve split workouts", error: error};
          res.status(404).json(ret);
        }
        splitIndex++;
        //while loop should finish with splitIndex==split.length
      }

      
      splitStart.setFullYear(split.StartYear,split.StartMonth,split.StartDate);
     
      
      //bring split up to current day
      while((splitStart.getDate() < d.getDate()) && (splitStart.getMonth() <= d.getMonth()) && (splitStart.getFullYear() <= d.getFullYear()) ){
        splitIndex++;
        splitStart.setDate(splitStart.getDate()+1);
      }
    }



    //potentially add update to splitIndex here from req.params
    //ignore if another solution to next month problem found

    //the main try
    try {
      //loop while in the month
      while(d.getMonth() == req.params.month){
        
        
        //path for current day in loop
        path = '/calendar/' + req.params.uuid + '/' + req.params.year + '/' + req.params.month + '/' + d.getDate();
        temp= await FBEndpoints.getValueAtPath(token, path);
        
        //if there is no split just null to empty days
        if(split==null){
          workoutArray.push(temp);
          d.setDate(d.getDate()+1);
          continue;
        }
        
        //if nothing in calendar, take workout from splits
        if(temp == null){

          
          //if split hasnt started yet, just add whatever is in the calnedar
          if(d.getTime() < splitStart.getTime()){

            workoutArray.push(temp);
          }
          //else add from split
          else{
            //add the next split workout into the array and increment index
            workoutArray.push(splitarray[splitIndex%split.Length]);
            splitIndex++;
          }
          
        }
        else{
          
          //add the workout to the array
          workoutArray.push(temp);

          //if both calendar day and split workout are rest days, skip to next in split
          if(JSON.parse(JSON.stringify(temp)).Unworkable==true && splitarray[splitIndex%split.Length].Unworkable==true){
           splitIndex++;
          }
        }

        //increment the date by 1
        d.setDate(d.getDate()+1);
      }
      

      if(split!=null){
        splitIndex = splitIndex%split.Length;
      }
      var result ={calendar: workoutArray , index: splitIndex};
      res.status(200).json(result);
    } catch (e) {
      // Prints any error that occurs.
      error = e.toString();
      ret = {message: "Error making array", error: error};
      res.status(404).json(ret);
    }
  })

  // Gets the workout for a given day in a given month in a given year.
  app.get('/api/calendar/:uuid/:year/:month/:day', async (req, res, next) => {

    const token = req.authToken;

    // Gets the path of a specific workout on that day.
    var path = '/calendar/' + req.params.uuid + '/' + req.params.year + '/' + req.params.month + '/' + req.params.day;
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
  app.patch('/api/calendar/:uuid/:year/:month/:day/update', async (req, res, next) => {

    // Stores the inputted updated workout in JSON format.
    const {startTime, exercises, unworkable} = req.body;
    const updatedExercise = {StartTime: startTime,  Exercises: exercises, Unworkable:unworkable}
    const token = req.authToken;

    // Gets the path of the the workout on that day.
    var path = '/calendar/' + req.params.uuid + '/' + req.params.year + '/' + req.params.month + '/' + req.params.day;
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
  app.delete('/api/calendar/:uuid/:year/:month/:day', async (req, res, next) => {

    const token = req.authToken;

    // Gets the path of the workout on the given day.
    var path = '/calendar/' + req.params.uuid + '/' + req.params.year + '/' + req.params.month + '/' + req.params.day;
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
      const {muscleGroup, name, sets, repititions: repetitions, duration, resistance} = req.body;
      const newExercise = {MuscleGroup: muscleGroup, Name: name, Sets: sets, Repetitions: repetitions, Duration: duration, Resistance: resistance};
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
      const {muscleGroup, name, sets, repetitions, duration, resistance} = req.body;
      const updatedExercise = {MuscleGroup: muscleGroup, Name: name, Sets: sets, Repetitions: repetitions, Duration: duration, Resistance: resistance}
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
      const {startTime, exercises, unworkable} = req.body;
      const newWorkout = {StartTime: startTime, Exercises: exercises, Unworkable: unworkable};
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
      const {startTime, exercises, unworkable} = req.body;
      const updatedWorkout = {StartTime: startTime, Exercises: exercises, Unworkable:unworkable}
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
      console.log('Receieved body: ' + JSON.stringify(req.body));

      // Stores the inputted split in JSON format.
      const {startYear, startMonth, startDate, length, workouts} = req.body;
      const newSplit = {StartDate: startDate, Length: length, Workouts: workouts, StartYear: startYear, StartMonth: startMonth};
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
      const {startYear, startMonth, startDate, length, workouts} = req.body;
      const updatedSplit = { StartDate: startDate, Length: length, Workouts: workouts, StartYear: startYear, StartMonth: startMonth};
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
