const express= require('express')
const app= express();
var mongoose = require('mongoose');
const MongoClient=require('mongodb').MongoClient;
var middleware = require("./middleware.js")
const jwt=require("jsonwebtoken")



var scKey = "ngit123$";

const Mongo = require("mongodb");
const url = 'mongodb://127.0.0.1:27017';
const dbname='hospitalinventory';
let db;

Mongo.MongoClient.connect(url,function(err,cursor){
    db = cursor.db(dbname);
    console.log(`db:${url}`);
    console.log(`database:${dbname}`);

});

app.use(express.json());
app.get('/',(req,res)=>{
    res.send('just a minute!');
});

app.get("/hospital",middleware.checkToken,function(req,res){
    db.collection('hospital').find({}).toArray(function(err,data){
        res.send(data);
    });
});

app.post('/hospital',middleware.checkToken,function(req,res){
    var a = req.query.hid;
    var b = req.query.name;
    var c =req.query.address;
    var d = req.query.contactno;
    var e = {hid:a,name:b,address:c,contactno:d}
    db.collection('hospital').insertOne(e,function(err,re){
        res.send('inserted');
    });
}); 


    /*,*/ 
    app.get('/ventilator',middleware.checkToken,function(req,res){
        db.collection('ventilator').find({}).toArray(function(err,data){
            res.send(data);
        });
    });
    
    app.post('/ventilator',middleware.checkToken,function(req,res){
        var a = req.query.hid;
        var b = req.query.ventilatorid;
        var c =req.query.status;
        var d = req.query.name;
        var e = {hid:a,ventilatorid:b,status:c,name:d}
        db.collection('ventilator').insertOne(e,function(err,re){
            res.send('ventilator added');
        });
    });
    app.get('/ventilator/available',middleware.checkToken,(req,res)=>{
        //const regex = /[^a-zA-Z\_]/g;
        //var c =req.query.status;
        //var q=req.query.statusvar q=  var query = { address: "Park Lane 38" };;
        const ventilator=db.collection('ventilator').find({status:"available"}).toArray(function(err,result){
            //if(!data)res.status(404).send('the ventilator not found');
            if (err) throw err;
            res.send(result);
            console.log('found');
        });
    
    });
    app.get('/ventilator/occupied',middleware.checkToken,(req,res)=>{
        //const regex = /[^a-zA-Z\_]/g;
        //var c =req.query.status;
        //var q=req.query.statusvar q=  var query = { address: "Park Lane 38" };;
        const ventilator=db.collection('ventilator').find({status:"occupied"}).toArray(function(err,result){
            //if(!data)res.status(404).send('the ventilator not found');
            if (err) throw err;
            res.send(result);
            console.log('found');
        });
        app.get('/ventilator/maintanance',middleware.checkToken,(req,res)=>{
            //const regex = /[^a-zA-Z\_]/g;
           // var c =req.query.status;
            //var q=req.query.statusvar q=  var query = { address: "Park Lane 38" };;
            const ventilator=db.collection('ventilator').find({status:"in-maintanance"},).toArray(function(err,result){
                //if(!data)res.status(404).send('the ventilator not found');
                if (err) throw err;
                res.send(result);
                console.log('found');
            });
        
        });
           
    
    });
    //get all hospitals
    
    app.get("/hospitalname",middleware.checkToken,function(req,res){
        
                db.collection("hospital").find({}, {projection:{name: 1 ,_id:0}}).toArray(function(err,data){
                    res.send(data);
       
        });
    });  
    
    //get ventilators by status and name
    
    app.get("/hos",middleware.checkToken,function(req,res){
        jwt.verify(req.token,scKey,function(err,auth){
            if(err){
                res.sendStatus(403)
            }
        
            else{
                var a =req.query.hid
                var b =req.query.status
                db.collection("ventilator").find({hid:a,status:b},{projection:{_id:0,ventilatorid:1,name:1}}).toArray(function(err,data){
                    res.send(data)

        
        });
    }

    });
});
//by name
app.post("/name",middleware.checkToken,function(req,res){
    var a = req.query.name;
    
        db.collection("ventilator").find({name: new RegExp(a,'i')}).toArray().then(result=>res.json(result));
        });


    
 



//upadate operation 
    app.put("/updateventilator",middleware.checkToken,function(req,res){
        var a = req.query.status
        var b = req.query.ventilatorid
        var myquery = { "ventilatorid" : b};
        var newvalues = {$set: {"status" :a} };
        db.collection("ventilator").updateOne(myquery, newvalues, function(err, data) {
          
          res.send(b);
          
        
        });
      }); 

//deleting the ventilator
      app.delete("/delete",middleware.checkToken,function(req,res){
    
        var b = req.query.ventilatorid
        var myquery = { "ventilatorid" : b};
        var newvalues = {$set: {"status" :b} };
        db.collection("ventilator").deleteOne(myquery, newvalues, function(err, data) {
          
          res.send('deleted');
        });
    });
    app.get("/home",function(req,res){
        res.send("hi")
    });
           



app.listen(3000,()=> console.log('running on 3000'));




