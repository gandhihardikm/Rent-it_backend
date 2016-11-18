/**
 * Created by Hardik on 4/30/16.
 */

var mongoConnection = require('./mongoconnection');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

var querystring = require('querystring');
var qs = require('qs');
var http = require('http');
var fs = require('fs');
var request = require('request');

var sendgrid_username   = 'kabalida2016';
var sendgrid_password   = 'Kabali20!^';
var sendgrid_sender = 'kabali2016@gmail.com';
var sendgrid  = require('sendgrid')(sendgrid_username,sendgrid_password);

function addProperty(req,res){
    console.log("reached to AddProperty function");

    var ownerid = req.body.ownerid;
    var propertyname = req.body.propertyname;
    var streetname = req.body.streetname;
    var city = req.body.city;
    var state = req.body.statename;
    var zipcode = req.body.zipcode;
    var propertyType = req.body.propertyType;
    var numberOfBath = req.body.numberOfBath;
    var numberOfRooms = req.body.numberOfRooms;
    var squareFeets = req.body.squarefeets;
    var rent = req.body.rent;
    var phoneNumber = req.body.phoneNumber;
    var alternateEmail = req.body.alternateEmail;
    var description = req.body.description;
    var photourl = req.body.photourl;
    var status = req.body.status;
    var propertyid = ownerid + "_" + Number(new Date());

    var propertyDetail = { propertyid:propertyid,

                          owner:ownerid,
                          propertyname:propertyname,
                          address:{street:streetname,city:city,state:state,zipcode:zipcode},
                          type:propertyType,
                          bath:numberOfBath,
                          room:numberOfRooms,
                          area:squareFeets,
                          rent:rent,
                          phone:phoneNumber,
                          email:alternateEmail,
                          description:description,
                          status:status,
                          count:0,
                          photourl:photourl};

    mongoConnection.mongoClient.connect(mongoConnection.connectionUrl,function(err,db){
        if(err){
            console.log("Add Property database connection error");
            res.send({"status":"Failure"});
        }else{
            console.log("Add Property database connection established");
            var collection = db.collection('property');

            collection.insertOne(propertyDetail,function(err,result){
               if(err){
                   console.log("Property record not inserted. ");

                   res.send({"status":"Failure","value":err});
               } else{
                   console.log("Property record inserted successfully.");

                   email(ownerid,propertyDetail,'Property added');
                   /*var transporter = nodemailer.createTransport('smtps://hardik.spring2015@gmail.com:Hg588984@smtp.gmail.com');

                   mailOptions = {  //email options
                       from: 'hardik.spring2015@gmail.com', // sender address.  Must be the same as authenticated user if using Gmail.
                       to: ownerid, // receiver
                       subject: 'Emailing with nodemailer', // subject
                       text: 'Below property added to database' + JSON.stringify(propertyDetail) // body
                   };
                   console.log(mailOptions);

                   transporter.sendMail(mailOptions,function(error,response){
                       if(error){
                           console.log(error);
                       }else{
                           console.log("Message sent: " + response.message);
                       }
                   });*/

                   collection = db.collection('tenantinterestedproperty');

                   collection.find({"type":propertyType,"notificationfrequency":"Realtime"}).toArray(function(err,result){
                       console.log("Result from interested party:" );
                      if(err){
                          console.log(err);
                          res.send({"status":"Failure","value":err});
                      } else {
                          //data = JSON.parse(result);
                          var senderslist = [];
                          for(var i=0;i<result.length;i++){
                              var obj = result[i];
                              senderslist.push(obj.token);
                          }
                          console.log(senderslist);

                          var post_data = JSON.stringify({ "data": {
                              "score": "5x1",
                              "time": "15:10",
                              "message":"New property posted..."
                          },
                              "registration_ids" : senderslist
                          });

                          // An object of options to indicate where to post to
                          var post_options = {
                              host: 'gcm-http.googleapis.com',
                              port: '80',
                              path: '/gcm/send',
                              method: 'POST',
                              headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': "key=AIzaSyBerL6xaCt-lPfxXOe7uODr9JYvbCsAvxM"
                              }
                          };

                          // Set up the request
                          var post_req = http.request(post_options, function(res) {
                              res.setEncoding('utf8');
                              res.on('data', function (chunk) {
                                  console.log('Response::::::::: ' + chunk);
                              });
                          });

                          // post the data
                          post_req.write(post_data);
                          post_req.end();

                      }
                   });


                   res.send({"status":"Success","value":"true"});
               }
            });
        }
    });
}

function updateProperty(req,res){
    console.log("reached to update property function");

    var ownerid = req.body.ownerid;

    var propertyid = req.body.propertyid;
    var propertyname = req.body.propertyname;
    var streetname = req.body.streetname;
    var city = req.body.city;
    var state = req.body.statename;
    var zipcode = req.body.zipcode;
    var propertyType = req.body.propertyType;
    var numberOfBath = req.body.numberOfBath;
    var numberOfRooms = req.body.numberOfRooms;
    var squareFeets = req.body.squarefeets;
    var newrent = req.body.rent;
    var phoneNumber = req.body.phoneNumber;
    var alternateEmail = req.body.alternateEmail;
    var description = req.body.description;
    var status = req.body.status;
    var photourl = req.body.photourl;
    console.log("Property id:" + propertyid + "   " + newrent);

    var propertyDetail = {propertyname:propertyname,address:{street:streetname,city:city,state:state,zipcode:zipcode},
        type:propertyType,bath:numberOfBath, room:numberOfRooms,area:squareFeets,
        rent:newrent,
        phone:phoneNumber,
        email:alternateEmail,
        description:description,
        status:status,
        photourl:photourl};

    mongoConnection.mongoClient.connect(mongoConnection.connectionUrl,function(err,db){
       if(err){
           console.log("Update property database connection error");
           res.send({"status":"Failure"});
       }else{
           console.log("Update property database connection established");
           var collection = db.collection('property');

           collection.updateOne({propertyid:propertyid}, {$set: propertyDetail}, function (err, numUpdated) {
               if (err) {
                   console.log(err);
                   res.send({"status":"Failure","value":err});
               } else if (numUpdated) {

                   email(ownerid,propertyDetail,'Property Details Updated');
                  /* var transporter = nodemailer.createTransport('smtps://hardik.spring2015@gmail.com:Hg588984@smtp.gmail.com');

                   mailOptions = {  //email options
                       from: 'hardik.spring2015@gmail.com', // sender address.  Must be the same as authenticated user if using Gmail.
                       to: ownerid, // receiver
                       subject: 'Emailing with nodemailer', // subject
                       text: 'Below property updated to database' + JSON.stringify(propertyDetail) // body
                   };
                   console.log(mailOptions);

                   transporter.sendMail(mailOptions,function(error,response){
                       if(error){
                           console.log(error);
                       }else{
                           console.log("Message sent: " + response.message);
                       }
                   });*/
                   console.log('Updated Successfully %d document(s).', numUpdated);
                   res.send({"status":"Success","value":"true"});
               } else {
                   console.log('No document found with defined "find" criteria!');
                   res.send({"status":"Success","value":null});
                   db.close();
               }
           });
       }
    });
}

function getProperties(req,res){

    console.log("reached to getProperties function");

    var userid = req.query["userid"];

    console.log("User id : "+ userid);

    mongoConnection.mongoClient.connect(mongoConnection.connectionUrl,function(err,db){
       if(err){
           console.log("Get properties database connection error");
           res.send({"status":"Failure"});
       } else {
           console.log("Get Properties database connection established");
           var collection = db.collection('property');

           collection.find({owner:userid}).toArray(function(err,result){
                if(err){
                    console.log(err);
                    res.send({"status":"Success","value":"false"});
                } else {
                    console.log(result);
                    res.send({"status":"Success","value":result});
                }
           });
       }
    });
}


function removeProperty(req,res){

    var ownerid = req.body.ownerid;
    var propertyid = req.body.propertyid;
    var status = req.body.status;

    console.log("reached to remove property function");

    mongoConnection.mongoClient.connect(mongoConnection.connectionUrl,function(err,db){
        if(err){
            console.log("Remove property database connection error");
            res.send({"status":"Failure"});
        }else{
            console.log("Remove property database connection established");
            var collection = db.collection('property');

            collection.updateOne({propertyid:propertyid}, {$set: {status:status}}, function (err, numUpdated) {
                if (err) {
                    console.log(err);
                } else if (numUpdated) {

                    var transporter = nodemailer.createTransport('smtps://hardik.spring2015@gmail.com:Hg588984@smtp.gmail.com');

                    mailOptions = {  //email options
                        from: 'hardik.spring2015@gmail.com', // sender address.  Must be the same as authenticated user if using Gmail.
                        to: ownerid, // receiver
                        subject: 'Emailing with nodemailer', // subject
                        text: 'Below property status has been changed to' + status// body
                    };
                    console.log(mailOptions);

                    transporter.sendMail(mailOptions,function(error,response){
                        if(error){
                            console.log(error);
                        }else{
                            console.log("Message sent: " + response.message);
                        }
                    });
                    console.log('Updated Successfully %d document(s).', numUpdated);
                    res.send({"status":"Success","value":"true"});
                } else {
                    console.log('No document found with defined "find" criteria!');
                    db.close();
                }
            });
        }
    });
}


function email(destinationid,body,value){


    sendgrid.send({
        to:       destinationid,
        from:     sendgrid_sender,
        subject:  'RentIT App Notification - ' + value,
        html:     '<html><body><ul> <p>Property Address</p> <li>Street : '+ body.address.street
        +' </li><li>City : '+body.address.city
        +' </li><li>Zipcode : ' +body.address.zipcode
        +'</li><p>Property Specifications </p> <li><b>Rent : '+body.rent
        +'</b></li><li>Bath : '+body.bath
        +'</li> <li>Room : ' + body.room
        +'</li><li>Area : ' + body.area
        +'</li><p>Contact Information </p> <li>Phone Number : '+body.phone
        +'</li> <li>Alternate Email : ' + body.email
        +'</li><p>Property Description </p> <li>Description : '+body.description
        +'</li> </ul> </body></html>'

    }, function(err, json) {
        if (err) {
            console.log(json);
        }
        //res.send('Wooohooo! Email sent');
    });
}

exports.removeProperty = removeProperty;
exports.addProperty = addProperty;
exports.updateProperty = updateProperty;
exports.getProperties = getProperties;