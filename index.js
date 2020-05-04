// const fs = require('fs');
// const parse = require('csv-parse');
// var inputFile='eventsFile.csv';
// console.log("Processing trial file");
// var parser = parse({delimiter: ','}, function (err, data) {
//    console.log(data);
//    data.forEach(function(line) {
//       console.log(line);
//      // create country object out of parsed fields
//      var obj = { "name" : line[0]
//                    , "num" : line[1]
//                    , "add" : line[2]

//                    };
//     console.log(JSON.stringify(obj));
//    });    
// });

// // read the inputFile, feed the contents to the parser
// fs.createReadStream('eventsFile.csv').pipe(parser);

//creating a connection to mongodb
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const userModel = require('./createSchema');

// replace the uri string with your connection string.
const uri = "mongodb+srv://sellerperformance:sellerpassword@acms-project-wgmfk.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, {
   useUnifiedTopology: true,
   useNewUrlParser: true,
}).then(() => {
   console.log("db is connected");
   async function saveUser(user1){
      try{
         await user1.save();
         console.log(user1);
      }
      catch(err){
         console.log(err);
      }
   
   }
   //find a paticular user with a given roll no
   var searchObj=new userModel({
      type:2,rollno:"18",phoneNumber:78931,lastName:"reddy"});
   var toSearch={rollno:"18"};
   //const uniqueId=searchObj.rollno;
   const typeNum=searchObj.type;
   
   async function searchFun(search){
      try{
         //type 1 address

         // phone num lastNum type2
      
         var userInfo=await userModel.findOne(search);
         if(userInfo!=null){

            var newObj=new userModel();
            newObj.type=typeNum;
            const ch=typeNum;
            switch(ch){
                  case 1:newObj.address=searchObj.address;
                  break;
                  case 2:newObj.phoneNumber=searchObj.phoneNumber;
                        newObj.lastName=searchObj.lastName;
                        break;
            };
            
            
            var num=userInfo.rollno;
            var fstName=userInfo.firstName;
            var lstName=userInfo.lastName;
            if(num!=""){
               newObj.rollno=num;
            }
            if(fstName!=""){
               newObj.firstName=fstName;
            }
            if(lstName!=null){
               newObj.lastName=lstName
            }
            saveUser(newObj);
            await userModel.deleteOne(toSearch);
        
            // const options={
            //    new:true
            // }

            // const finalObj= await userModel.findOneAndUpdate(toSearch,newObj);
            // console.log(finalObj+"...got if");


         }
         else{
            saveUser(searchObj);
         }


        // console.log(newObj);
      }
   catch(err){
      console.log(err);
   }

   }
   searchFun(toSearch);


      //userModel.getAllName("akhila");

})
   .catch(err => {
      console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
   });

   //const collection = client.db("test").collection("devices");
   // perform actions on the collection object

