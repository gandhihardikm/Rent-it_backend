/**
 * Created by Hardik Gandhi on 4/17/16.
 */

var mongoConnection = require('./mongoconnection');

function authenticateUser (req,res){
    console.log("reached to authenticateUser function");
    var userEmail = req.query["email"];

    console.log("Received Email: " + userEmail);

    mongoConnection.mongoClient.connect(mongoConnection.connectionUrl,function(err,db){
       if(err){
           console.log('Unable to connect database',err);
           res.send({"status":"Failure"});
       } else{
           console.log('Connection Established.');

           var collection = db.collection('person');
           collection.find({email:userEmail}).toArray(function (err,result){
               console.log(result.length);
               if(err){
                   console.log(err);
               } else if (result.length){
                   console.log(result[0].role);
                   res.send({"status":"Success","value":"true","role":result[0].role});
               } else {
                   res.send({"status":"Success","value":"false"});
               }
           });
       }
    });
}


function createUser(req,res){
    console.log("reached to createUser function");

    var name = req.body.Name;
    //var lastname = req.body.LastName;
    var email = req.body.Email;
    var userType = req.body.Type;
    console.log(name + email + userType);
    var user = {name:name, email:email, role:userType};

    mongoConnection.mongoClient.connect(mongoConnection.connectionUrl,function(err,db) {
        if (err) {
            console.log('create user - Unable to connect database', err);
            res.send({"status": "Failure"});
        } else {
            console.log('create user - Connection Established.');

            var collection = db.collection('person');
            collection.insertOne(user, function (err, result) {
                if (err) {
                    console.log("Error: " + err);
                    res.send({"status": "Failure"});
                } else {
                    console.log("Success!");
                    res.send({"status": "Success"});
                }
            });
        }
    });
}

function updateUserRole(req,res) {
    console.log("reached to update role function");

    var email = req.body.email;
    var updatedRole = req.body.updatedrole;

    console.log(email + updatedRole);

    mongoConnection.mongoClient.connect(mongoConnection.connectionUrl,function(err,db){
        if(err){
            console.log("update role database error..");
            res.send({"status":"Failure"});
        }
        else{
            console.log("update role database connection established.");
            var collection = db.collection('person');

            collection.updateOne({email:email},{$set:{role:updatedRole}},function(err,numUpdated){
                if(err){
                    res.send({"status":"Success","value":"false"});
                }else{
                    res.send({"status":"Success","value":"true"});
                }
            });
        }
    });
}

exports.updateUserRole = updateUserRole;
exports.login = authenticateUser;
exports.createUser = createUser;