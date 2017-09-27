'use strict';



exports.getAvg = function(args, res, next) {
  /**
   * average age of last race pilots
   * get the average of last race driver's age
   *
   * returns Float
   **/
  
    let request = require('request');
    let xml2js = require('xml2js');
    request.get('http://ergast.com/api/f1/current/last/drivers', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            xml2js.parseString(body, function(err, result){
                res.setHeader('Content-Type', 'application/json');
                if(result.MRData && result.MRData.DriverTable){    
                    let drivers = result.MRData.DriverTable[0].Driver;
                    let total = 0;
                    for(let driver of drivers){
                        total += ((new Date().getTime() - new Date(driver.DateOfBirth[0]).getTime())/31536000000);
                    }
                    res.end(JSON.stringify(total/drivers.length));
                }else{
                    res.end(JSON.stringify("Error"));
                }
            });
        }
    });
}

exports.createUser = function (args, res, next) {
    /**
     * create a User
     * create a user from a user object, ignore id
     *
     * user User_1 user to create
     * returns inline_response_200
     **/
    let that = this;
    let user = args.user.value; // Get user given as parameter

    if (!user) // check if user is given
    {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({code: 400, message: "Invalid User"}));
        return;
    }
    let request = "INSERT INTO user ("
            + "name, "
            + "lastname) "
            + "VALUES  ("
            + DB.esc(user.name || null) + " , "
            + DB.esc(user.lastname || null) + ")";

    DB.queryResults(request, function (results) {
        if (results.affectedRows === 1) {                                        // if user successfully inserted
            that.getUserById(results.insertId, function (user) {                 // get it standard
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(user));
            });
        } else {                                                                // if error occured
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({code: 403, message: results.message}));
        }
    });


};

exports.deleteUser = function (args, res, next) {
    /**
     * delete a User
     * delete a user from an id
     *
     * id Boolean id of user to delete
     * returns Boolean
     **/
    let id_user = DB.esc(args.id.value || null);
    let request = "DELETE FROM user WHERE id_user = " + id_user;
    let that = this;
   
    DB.queryResults(request, function (statement) {                     // delete user
        if (!statement.code) {                
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(true));

        } else {                                                        // if error while deleting user
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({code: 400, message: statement.message}));
        }
    });
};

exports.getAll = function (args, res, next) {
    /**
     * get all users
     * return an array containing all users
     *
     * filter Filter filters to restrict result (optional)
     * returns
     **/;
    let that = this;
    let req = "SELECT * FROM user";
    DB.queryResults(req, function (result) {                                    // get users from DB
        if (Object.keys(result).length > 0 && !result.code) {                   // if user found without SQL error
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
        } else if (result.code) {                                                  // in case of error
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({code: 400, message: result.message}));
        } else {                                                                  // in case of no user found
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({code: 404, message: "User Not Found"}));
        }
    });
};

exports.getUser = function(args, res, next) {
  /**
   * get single user
   * return one user by the id
   *
   * user_id Integer id of required user
   * returns User
   **/
  
  let that = this;
    let req = "SELECT * FROM user where id_user = " + DB.esc(args.user_id.value);
    DB.queryResults(req, function (result) {                                    // get users from DB
        if (Object.keys(result).length > 0 && !result.code) {                   // if user found without SQL error
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result[0]));
        } else if (result.code) {                                                  // in case of error
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({code: 400, message: result.message}));
        } else {                                                                  // in case of no user found
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({code: 404, message: "User Not Found"}));
        }
    });
}

exports.updateUser = function(args, res, next) {
  /**
   * update a User
   * update a user from a user object, use id
   *
   * user User user to update
   * returns User
   **/
    let that = this;
    let user = args.user.value;
    if (!user.id_user) {                                         // check if required field are presents
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({code: 403, message: "Invalid User"}));
    } else {  
        let request = "UPDATE user SET "
                + "name = " + DB.esc(user.name || null) + ", "
                + "lastname = " + DB.esc(user.lastname || null) + " "
                + "WHERE id_user = " + DB.esc(user.id_user);
        DB.queryResults(request, function(result){
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(user));
        });
    }
}

