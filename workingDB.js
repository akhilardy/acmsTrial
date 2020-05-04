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

let user1 = new userModel({
   type:1,
   rollno: "17",
   firstName: "akh",
   lastName: "yek",
   address:"pavan",
   phoneNumber:789381
});

saveUser(user1);
 let user2 = new userModel({
   type:1,
   rollno: "16",
   firstName: "akhi",
   lastName: "ch"
});
saveUser(user2);
let user3=new userModel({
   type:2,
   rollno:"18",
   firstName:"abc",
   
});
saveUser(user3);
})

.catch(err=>{
   console.log(err);

})