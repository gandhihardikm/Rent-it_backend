var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var connectionUrl = 'mongodb://admin:password@ds011311.mlab.com:11311/placefinder';

/*
MongoClient.connect(url,function(err,db){
   if(err){
       console.log('Unable to connect database',err);
   } else{
       console.log('Connection Established.');
       mongodb_handler = db;
   }
});
*/

exports.mongoClient = mongoClient;
exports.connectionUrl = connectionUrl;
    /*
    *   db: placefinder
    *   collection 1 : person
    *   collection 2 : property
    *
 */
//function connectMongoDB(){
    
   /* MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connnect', err);

        } else {
            console.log('Conneciton Established..');

            var collection = db.collection('person');

            // Lets input some users into database
            var person1 = {name:'Ashish Bende', location:'India', role:'tenant'};
            var person2 = {name:'Hardik Gandhi', location:'US', role:'landlord'};
            var person3 = {name:'Nipun Ahuja', location:'Australia', role:'tenant'};
            var person4 = {name:'Pankaj Dighe', location:'Canada', role:'landlord'};

            collection.insertOne(person1,function(err,result){
               if(err){
                   console.log("Error: ("+err+") This sucks!")
               }else{
                   console.log("Success!");
               }
            });

            collection.insertMany([person1,person2,person3,person4],function(err,result){
               if(err){
                   console.log("Error: "+err);
               }else{
                   console.log("Result : %d Documents inserted successfully.",result.length);
                   db.close();
               }
            });


            // update database

            collection.updateOne({name: 'Ashish Bende'}, {$set: {enabled: false}}, function (err, numUpdated) {
                if (err) {
                    console.log(err);
                } else if (numUpdated) {
                    console.log('Updated Successfully %d document(s).', numUpdated);
                    
                } else {
                    console.log('No document found with defined "find" criteria!');
                    db.close();
                }
            });

            // find users

            collection.find({name: 'Ashish Bende'}).toArray(function (err, result) {
                if (err) {
                    console.log(err);
                } else if (result.length) {
                    console.log('Found:', result);
                    db.close();
                } else {
                    console.log('No document(s) found with defined "find" criteria!');
                    db.close();
                }
            });

            // remove record.

            collection.deleteOne({name: 'Ashish Bende'},function(err,result){
               if(err){
                   console.log("Error: "+ err)
               } else{
                   console.log("Document removed successfully: ");
                   db.close();
               }
            });
            /!*var result = collection.find();

            result.toArray(function(e,doc){
                console.log(doc);
            });

            docs.forEach(function(person){
               console.log(person.placeName);
            });*!/
            //console.log(result);

        }
    });*/
//}





