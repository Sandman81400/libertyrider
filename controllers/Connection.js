var mysql = require('mysql');

var connection = null;
var db_config = null;

// ----------------------------------------------------------------------------- should be done one
exports.configure = function (config) {
    db_config = config;
};

// ----------------------------------------------------------------------------- Connection is Singleton
exports.getInstance = function () {
    if (!db_config) {
        throw new Error("Database Not Configured.");
    }
    if (!connection) {
        connection = mysql.createConnection(db_config);
        connection.connect(function (err) {
            if (err)
                throw err;
            console.log("Data Base Connected!");
        });
    }
    return connection;
};

// ----------------------------------------------------------------------------- escape string or array recusrively (PROTECT FROM SQL INJECTION !!! USE IT EVERYWHERE ! )
exports.esc = function (data) {
    if (typeof data === "object") { // if object or array
        for (let item in data) {
            data[item] = this.esc(data[item]);
        }
        return data;
    } else {
        return mysql.escape(data);
    }

};

// ----------------------------------------------------------------------------- use filter object {{value, min, max, strict}} for add WHERE to request
exports.addFilters = function (request, filters) {
    let filter_size = Object.keys(filters).length;
    let count = 0; // for not add final "AND "
    if (filter_size >= 1) {
        request += " WHERE ";
        let count = 0;
        for (let filter_name in filters) {
            // value comparaison
            filter_name = mysql.escape(filter_name).substr(1,filter_name.length);
            if (filters[filter_name]["value"] && filters[filter_name]["strict"] === true) {                               // if value and use =
                request += filter_name + " = " + mysql.escape(filters[filter_name]["value"]) + " ";
            } else if (filters[filter_name]["value"] && filters[filter_name]["strict"] === false) {                         // if value and use LIKE
                request += filter_name + " LIKE " + mysql.escape("%" + filters[filter_name]["value"] + "%") + " ";
            }
            // Interval
            else if (filters[filter_name]["min"]) {
                request += filter_name;
                request += (filters[filter_name]["strict"] === true) ? " >= " : " > ";
                request += mysql.escape(filters[filter_name]["min"]) + " ";
                if (filters[filter_name]["max"]) {
                    request += "AND " + filter_name;
                    request += (filters[filter_name]["strict"] === true) ? " <= " : " < ";
                    request += mysql.escape(filters[filter_name]["max"]) + " ";
                }
            } else if (filters[filter_name]["max"]) {
                request += filter_name;
                request += (filters[filter_name]["strict"] === true) ? " <= " : " < ";
                request += mysql.escape(filters[filter_name]["max"]) + " ";
            }

            if (++count < filter_size) {  // skip last "AND "
                request += "AND ";
            }
        }
    }
    return(request);
};

exports.start = function(callback){
    this.queryResults("START TRANSACTION", callback); 
};
exports.commit = function(callback){
    this.queryResults("COMMIT", callback); 
};
exports.rollback = function(callback){
    this.queryResults("ROLLBACK", callback); 
};

// ----------------------------------------------------------------------------- GET Query Results 
exports.queryResults = function (request, callback) {
    this.getInstance().query(request, function (error, rows, fields) {
        if (!error) {
            callback(rows);
        } else {
            console.log("SQL ERROR:\n    " + error.message + "\n");
            console.log("SQL REQUEST:\n    " + request + "\n");
            callback(error);
        }
    });    
};