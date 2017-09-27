var sqlite = require('sqlite3').verbose()

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
        connection = new sqlite.Database(db_config.database, function(err){
            if (err)
                throw err;
            console.log("Data Base Connected!");            
        });
        var createTable = "CREATE TABLE IF NOT EXISTS user ("
                                + "id_user INTEGER PRIMARY KEY AUTOINCREMENT, "
                                + "name TEXT, "
                                + "lastname TEXT"
                                + ");";
        connection.all(createTable, [], function(error, rows){
                if(error){
                    console.log("SQL ERROR:\n    " + error.message + "\n");
                }
            });
        return connection;
    }else{
        return connection;
    }
    
};

// ----------------------------------------------------------------------------- escape string or array recusrively (PROTECT FROM SQL INJECTION !!! USE IT EVERYWHERE ! )
exports.esc = function (data) {
        return "'" + data + "'";
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
    this.getInstance().all(request, [],  function (error, rows) {
        if (!error) {
            callback(rows);
        } else {
            console.log("SQL ERROR:\n    " + error.message + "\n");
            console.log("SQL REQUEST:\n    " + request + "\n");
            callback(error);
        }
    });    
};
