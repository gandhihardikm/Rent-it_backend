/**
 * Created by Hardik on 5/6/16.
 */


var mongoConnection = require('./mongoconnection');

var Cron = require('cron');

/*var everyfivesec = Cron.job("*!/5 * * * * *",function(){
    console.log("Running every after 5 seconds...");
});*/

var dailycron = Cron.job("0 0 23 * * *",function(){
   console.log("Running daily...");


    mongoConnection.mongoClient.connect(mongoConnection.connectionUrl,function(err,db){
        if(err){
            res.send({"status":"Failure","value":err});
        }else{
            collection = db.collection('tenantinterestedproperty');
            collection.find({"notificationfrequency":"Daily"},function(err,result){
                if(err){
                    res.send({"status":"Failure","value":err});
                }else{

                }
            });
        }
    });
});

var weeklycron = Cron.job("* * * * * 1",function(){
   console.log("Running weekly");
});

dailycron.start();
weeklycron.start();


function saveSearchedProperty(req,res){

    console.log("reached to tenant save searched Property function");

    var searchid = req.body.tenantid + "_" + Number(new Date());
    var tenantid = req.body.tenantid;
    var propertyType = req.body.propertyType;
    var pricerangefrom = req.body.pricerangefrom;
    var pricerangeto = req.body.pricerangeto;
    var city = req.body.city;
    var zipcode = req.body.zipcode;
    var keyword = req.body.keyword;
    var notificationfrequency = req.body.notificationfrequency;
    var token = req.body.token;

    // photo link code is remaining

    var searchedDetail = { searchid:searchid,
        tenantid:tenantid,
        city:city,
        zipcode:zipcode,
        type:propertyType,
        pricerangefrom:pricerangefrom,
        pricerangeto:pricerangeto,
        keyword:keyword,
        notificationfrequency:notificationfrequency,
        token:token};

    mongoConnection.mongoClient.connect(mongoConnection.connectionUrl,function(err,db){
        if(err){
            console.log("saved Property database connection error");
            res.send({"status":"Failure"});
        }else{
            console.log("saved Property database connection established");
            var collection = db.collection('tenantinterestedproperty');

            collection.insertOne(searchedDetail,function(err,result){
                if(err){
                    console.log("searched detail record not inserted. ");
                    res.send({"status":"Sucesss","value":"false"})
                } else{
                    console.log("searched detail inserted successfully.");
                    res.send({"status":"Success","value":"true"});
                }
            });
        }
    });
}


function searchProperty(req,res){


    var keyword = '/.*'+req.query["keyword"]+'./';
    var city = req.query["city"];
    var zipcode = req.query["zipcode"];
    var type = req.query["propertytype"];
    var from = req.query["pricerangefrom"];
    var to = req.query["pricerangeto"];

    console.log(keyword+" "+city +" "+zipcode + type + from + to);

    var query;
    if(type != "NA"){
        query = {"description": new RegExp(req.query["keyword"], 'i'),"address.city":city,"address.zipcode":zipcode,"type":type,"rent":{$gt:from,$lt:to},"status":{$ne:"Cancelled"}};
    } else{
        query = {"description": new RegExp(req.query["keyword"], 'i'),"address.city":city,"address.zipcode":zipcode,"status":{$ne:"Cancelled"}};
    }


    mongoConnection.mongoClient.connect(mongoConnection.connectionUrl,function(err,db){
       if(err){
           console.log("searched Property database connection error");
           res.send({"status":"Failure"});
       } else{
           console.log("searched Property database connection established");
           var collection = db.collection('property');

           collection.find(query).toArray(function(err,result){
               console.log(result);
               if(err){
                   console.log(err);
                   res.send({"status":"Success","value":err});
               } else {
                   if(result != null)
                   {
                       res.send({"status":"Success","value":result});
                   } else{
                       res.send({"status":"Success","value":null});
                   }

               }
           });
       }
    });
}

function updatePropertyReview(req,res){
    var propertyid = req.body.propertyid;

    console.log(propertyid);

    mongoConnection.mongoClient.connect(mongoConnection.connectionUrl,function(err,db){
        if(err){
            console.log("update property review database error..");
            res.send({"status":"Failure"});
        }
        else{
            console.log("update property review database connection established.");
            var collection = db.collection('property');

            collection.findOneAndUpdate({propertyid:propertyid},{$inc:{count:1}},function(err,numUpdated){
                if(err){
                    res.send({"status":"Success","value":"false"});
                }else{
                    res.send({"status":"Success","value":"true"});
                }
            });
        }
    });
}

exports.updatePropertyReview = updatePropertyReview;
exports.searchProperty = searchProperty;
exports.saveSearchedProperty = saveSearchedProperty;

