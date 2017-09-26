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

exports.createUser = function(args, res, next) {
  /**
   * create a User
   * create a user from a user object, ignore id
   *
   * user User user to create
   * returns User
   **/
  var examples = {};
  examples['application/json'] = {
  "name" : "aeiou",
  "id_user" : 0,
  "lastname" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.deleteUser = function(args, res, next) {
  /**
   * delete a User
   * delete a user from an id
   *
   * id Integer id of user to delete
   * returns Boolean
   **/
  var examples = {};
  examples['application/json'] = true;
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.getAll = function(args, res, next) {
  /**
   * get all users
   * return an array containing all users
   *
   * returns List
   **/
  var examples = {};
  examples['application/json'] = [ {
  "name" : "aeiou",
  "id_user" : 0,
  "lastname" : "aeiou"
} ];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.getUser = function(args, res, next) {
  /**
   * get single user
   * return one user by the id
   *
   * user_id Integer id of required user
   * returns User
   **/
  var examples = {};
  examples['application/json'] = {
  "name" : "aeiou",
  "id_user" : 0,
  "lastname" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.updateUser = function(args, res, next) {
  /**
   * update a User
   * update a user from a user object, use id
   *
   * user User user to update
   * returns User
   **/
  var examples = {};
  examples['application/json'] = {
  "name" : "aeiou",
  "id_user" : 0,
  "lastname" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

